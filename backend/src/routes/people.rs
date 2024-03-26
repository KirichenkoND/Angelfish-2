use super::{Json, Query, RouteResult, RouteState};
use crate::models::Person;
use axum::{extract::State, routing::*};
use serde::Deserialize;
use sqlx::{error::ErrorKind, PgPool};
use uuid::Uuid;

#[derive(Deserialize)]
struct FetchQuery {
    name: Option<String>,
    uuid: Option<Uuid>,
    banned: Option<bool>,
}

async fn fetch(
    State(db): RouteState,
    Query(query): Query<FetchQuery>,
) -> RouteResult<Json<Vec<Person>>> {
    let FetchQuery { name, uuid, banned } = query;

    let results = sqlx::query_as::<_, Person>(
        r#"
            SELECT * FROM Person
            LEFT JOIN Role ON Role.id = role_id
            WHERE
                lower(concat(first_name, last_name, middle_name)) LIKE coalesce('%' || lower($1) || '%', '%') AND
                coalesce(uuid = $2, true) AND
                coalesce(banned = $3, true)
        "#,
    ).bind(name).bind(uuid).bind(banned).fetch_all(&db).await?;

    Ok(Json(results))
}

#[derive(Deserialize)]
struct CreateData {
    uuid: Option<Uuid>,
    first_name: String,
    last_name: String,
    middle_name: Option<String>,
    role: Option<String>,
}

async fn create(State(db): RouteState, Json(data): Json<CreateData>) -> RouteResult {
    let CreateData {
        uuid,
        first_name,
        last_name,
        middle_name,
        role,
    } = data;

    let result = sqlx::query!(
        r#"
        INSERT INTO Person(uuid, first_name, last_name, middle_name, role_id) VALUES(
            coalesce($1, gen_random_uuid()),
            $2, $3, $4,
            coalesce((SELECT id FROM Role WHERE role = $5), 0)
        )
    "#,
        uuid,
        first_name,
        last_name,
        middle_name,
        role,
    )
    .execute(&db)
    .await;

    match result {
        Err(sqlx::Error::Database(err)) if err.kind() == ErrorKind::UniqueViolation => {
            dbg!(err.constraint());
        }
        Err(err) => return Err(err.into()),
        _ => {}
    }

    Ok(())
}

pub fn router() -> Router<PgPool> {
    Router::new().route("/", get(fetch).post(create))
}
