use super::{Json, Query, RouteResult, RouteState};
use crate::models::Room;
use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::*,
};
use serde::Deserialize;
use sqlx::{error::ErrorKind, PgPool};
use uuid::Uuid;

#[derive(Deserialize)]
struct Fetch {
    floor: Option<i32>,
    category: Option<String>,
    name: Option<String>,
    count: Option<i64>,
    offset: Option<i64>,
}

async fn fetch(State(db): RouteState, Query(query): Query<Fetch>) -> RouteResult<Json<Vec<Room>>> {
    let Fetch {
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
            (category = any($5) OR cardinality($5) = 0)
        LIMIT $1 OFFSET $2
    "#,
    )
    .bind(count.unwrap_or(100).max(0))
    .bind(offset.unwrap_or(0).max(0))
    .bind(name)
    .bind(floor)
    .bind(categories)
    .fetch_all(&db)
    .await?;

    Ok(Json(results))
}

async fn create(State(db): RouteState, Json(query): Json<Room>) -> RouteResult {
    let Room {
        id: _,
        category,
        floor,
        name,
    } = query;

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

#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
enum Direction {
    Enter,
    Leave,
}

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

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(fetch).post(create))
        .route("/:room_id/:direction/:person_uuid", post(pass))
}
