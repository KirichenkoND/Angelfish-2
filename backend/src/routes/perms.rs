use super::{Json, RouteResult, RouteState};
use axum::{extract::State, http::Method, routing::*};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum Target {
    Room { room_id: i32 },
    Category { category: String },
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum User {
    Role { role: String },
    Person { person_uuid: Uuid },
}

#[derive(Debug, Deserialize)]
struct Perm {
    #[serde(flatten)]
    target: Target,
    #[serde(flatten)]
    user: User,
}

async fn change_perms(
    method: Method,
    State(db): RouteState,
    Json(data): Json<Perm>,
) -> RouteResult {
    let Perm { target, user } = data;

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
    Router::new().route("/", post(change_perms).delete(change_perms))
}
