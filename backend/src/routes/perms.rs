use super::{Json, Query, RouteResult, RouteState};
use crate::models::{Permission, Target, User};
use axum::{extract::State, http::Method, routing::*};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, PgPool};
use uuid::Uuid;

#[derive(Deserialize)]
struct FetchQuery {
    room_id: Option<i32>,
    category: Option<String>,
    role: Option<String>,
    person_uuid: Option<Uuid>,
    count: Option<i64>,
    offset: Option<i64>,
}

#[derive(Serialize, FromRow)]
struct Out {
    #[serde(skip_serializing_if = "Option::is_none")]
    person_uuid: Option<Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    room_id: Option<i32>,
}

async fn fetch(
    State(db): RouteState,
    Query(query): Query<FetchQuery>,
) -> RouteResult<Json<Vec<Out>>> {
    let FetchQuery {
        room_id,
        category,
        role,
        person_uuid,
        count,
        offset,
    } = query;

    let records = sqlx::query_as::<_, Out>(
        r#"
        SELECT * FROM Permission
        LEFT JOIN Role ON Role.id = role_id
        LEFT JOIN Category ON Category.id = category_id
        WHERE
            coalesce(room_id = $3, true) AND
            coalesce(category_id = (SELECT id FROM Category WHERE category = $4), true) AND
            coalesce(role_id = (SELECT id FROM Role WHERE role = $5), true) AND
            coalesce(person_uuid = $6, true)
        LIMIT $1 OFFSET $2
    "#,
    )
    .bind(count.unwrap_or(25).max(0))
    .bind(offset.unwrap_or(0).max(0))
    .bind(room_id)
    .bind(category)
    .bind(role)
    .bind(person_uuid)
    .fetch_all(&db)
    .await?;

    Ok(Json(records))
}

async fn change_perms(
    method: Method,
    State(db): RouteState,
    Json(data): Json<Permission>,
) -> RouteResult {
    let Permission { target, user } = data;

    let (person_uuid, role) = match user {
        User::Person { person_uuid } => (Some(person_uuid), None),
        User::Role { role } => (None, Some(role)),
    };

    let (room_id, category) = match target {
        Target::Room { room_id } => (Some(room_id), None),
        Target::Category { category } => (None, Some(category)),
    };

    let allow = method == Method::POST;
    if allow {
        sqlx::query!(
            "INSERT INTO Permission(person_uuid, role_id, room_id, category_id) VALUES(
                $1,
                (SELECT id FROM Role WHERE role = $2),
                $3,
                (SELECT id FROM Category WHERE category = $4)
            )",
            person_uuid,
            role,
            room_id,
            category
        )
        .execute(&db)
        .await?;
    } else {
        sqlx::query!(
            "DELETE FROM Permission
            WHERE
                (person_uuid = $1 OR $1 IS NULL) AND
                coalesce(role_id = (SELECT id FROM Role WHERE role = $2), true) AND
                (room_id = $3 OR $3 IS NULL) AND
                coalesce(category_id = (SELECT id FROM Category WHERE category = $4), true)
            ",
            person_uuid,
            role,
            room_id,
            category
        )
        .execute(&db)
        .await?;
    }

    Ok(())
}

pub fn router() -> Router<PgPool> {
    Router::new().route("/", get(fetch).post(change_perms).delete(change_perms))
}
