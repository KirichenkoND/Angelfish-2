use super::{Json, Query, RouteResult, RouteState};
use crate::{
    middleware::{protect_admin, protect_guard},
    models::Room,
};
use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    middleware::from_fn_with_state,
    routing::*,
};
use serde::Deserialize;
use sqlx::{error::ErrorKind, PgPool};
use utoipa::{openapi::OpenApi, IntoParams, ToSchema};
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
struct Fetch {
    id: Option<i32>,
    floor: Option<i32>,
    category: Option<String>,
    name: Option<String>,
    count: Option<i64>,
    offset: Option<i64>,
}

/// Fetch rooms
#[utoipa::path(
    get,
    path = "/rooms",
    params(Fetch),
    responses(
        (status = 200, body = Vec<Room>)
    )
)]
async fn fetch(State(db): RouteState, Query(query): Query<Fetch>) -> RouteResult<Json<Vec<Room>>> {
    let Fetch {
        id,
        floor,
        name,
        count,
        offset,
        category,
    } = query;

    let categories = category
        .unwrap_or_default()
        .split(',')
        .filter(|s| !s.is_empty())
        .map(|c| c.to_lowercase())
        .collect::<Vec<_>>();

    let results = sqlx::query_as::<_, Room>(
        r#"
        SELECT Room.*, category FROM Room
        JOIN Category ON Category.id = Room.category_id
        WHERE
            coalesce(lower(room) LIKE ('%' || lower($3) || '%'), true) AND
            coalesce(floor = $4, true) AND
            (category = any($5) OR cardinality($5) = 0) AND
            (Room.id = $6 OR $6 IS NULL)
        LIMIT $1 OFFSET $2
    "#,
    )
    .bind(count.unwrap_or(100).max(0))
    .bind(offset.unwrap_or(0).max(0))
    .bind(name)
    .bind(floor)
    .bind(categories)
    .bind(id)
    .fetch_all(&db)
    .await?;

    Ok(Json(results))
}

/// Create new room
/// Only `category`, `floor`, `name` fields are used.
#[utoipa::path(
    post,
    path = "/rooms",
    request_body = Room
)]
async fn create(State(db): RouteState, Json(data): Json<Room>) -> RouteResult {
    let Room {
        id: _,
        category,
        floor,
        name,
    } = data;

    let result = sqlx::query!(
        r#"
        INSERT INTO Room(room, floor, category_id) VALUES($1, $2, (SELECT id FROM Category WHERE category = $3)) 
    "#,
        name,
        floor,
        category
    ).execute(&db).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) if matches!(err.as_database_error(), Some(err) if err.kind() == ErrorKind::NotNullViolation) => {
            Err(anyhow!("This room category does not exist").into())
        }
        Err(err) if matches!(err.as_database_error(), Some(err) if err.is_unique_violation()) => {
            Err(anyhow!("Room with this name already exists on the floor").into())
        }
        Err(err) => Err(err.into()),
    }
}

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "lowercase")]
enum Direction {
    Enter,
    Leave,
}

/// Try to enter/leave a room (EMBEDDED API)
#[utoipa::path(post, path = "/rooms/{room_id}/{direction}/{person_uuid}", params(
    ("room_id" = i32, Path, description = "Id of the room"),
    ("direction" = Direction, Path, description = "Enter/leave"),
    ("person_uuid" = Uuid, Path, description = "Uuid of the person trying to access the room")
))]
async fn pass(
    State(db): RouteState,
    Path((room_id, dir, person_uuid)): Path<(i32, Direction, Uuid)>,
) -> RouteResult<StatusCode> {
    let allowed = sqlx::query!(
        r#"
        SELECT 1 as allowed FROM Permission
        WHERE
            (room_id = $1 OR category_id = (SELECT Room.category_id FROM Room WHERE id = $1))
            AND
            (person_uuid = $2 OR role_id = (SELECT role_id FROM Person WHERE uuid = $2))
        LIMIT 1
    "#,
        room_id,
        person_uuid
    )
    .fetch_optional(&db)
    .await?
    .is_some();

    let entered = matches!(dir, Direction::Enter);
    sqlx::query!(
        "INSERT INTO Log(person_uuid, room_id, entered, allowed) VALUES($1, $2, $3, $4)",
        person_uuid,
        room_id,
        entered,
        allowed
    )
    .execute(&db)
    .await?;

    let code = if allowed {
        StatusCode::OK
    } else {
        StatusCode::FORBIDDEN
    };
    Ok(code)
}

/// Delete room
#[utoipa::path(delete, path = "/rooms/{room_id}", params(("room_id" = i32, Path, description = "Id of the room to delete")))]
async fn remove(Path(room_id): Path<i32>, State(db): RouteState) -> RouteResult<StatusCode> {
    let result = sqlx::query!("DELETE FROM Room WHERE id = $1", room_id)
        .execute(&db)
        .await?;
    if result.rows_affected() == 0 {
        return Ok(StatusCode::NOT_FOUND);
    }

    Ok(StatusCode::OK)
}

pub fn openapi() -> OpenApi {
    #[derive(utoipa::OpenApi)]
    #[openapi(
        paths(
            super::rooms::fetch,
            super::rooms::create,
            super::rooms::remove,
            super::rooms::pass
        ),
        components(schemas(Room))
    )]
    struct ApiDoc;

    <ApiDoc as utoipa::OpenApi>::openapi()
}

pub fn router(db: &PgPool) -> Router<PgPool> {
    Router::new()
        .route(
            "/",
            get(fetch).layer(from_fn_with_state(db.clone(), protect_guard)),
        )
        .route(
            "/",
            post(create).layer(from_fn_with_state(db.clone(), protect_admin)),
        )
        .route(
            "/:room_id",
            delete(remove).layer(from_fn_with_state(db.clone(), protect_admin)),
        )
        .route("/:room_id/:direction/:person_uuid", post(pass))
}
