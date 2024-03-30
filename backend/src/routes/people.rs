use super::{Json, Query, RouteResult, RouteState};
use crate::models::Person;
use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    routing::*,
};
use serde::Deserialize;
use sqlx::{error::ErrorKind, PgPool};
use utoipa::{openapi::OpenApi, IntoParams};
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
struct FetchQuery {
    name: Option<String>,
    uuid: Option<Uuid>,
    banned: Option<bool>,
}

/// Fetch people
#[utoipa::path(
    get,
    path = "/people",
    params(FetchQuery),
    responses(
        (status = 200, body = Vec<Person>)
    )
)]
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

/// Create new person record
/// Only `uuid`, `first_name`, `last_name`, `middle_name`, `role` fields are used.
#[utoipa::path(
    post,
    path = "/people",
    request_body = Person,
)]
async fn create(State(db): RouteState, Json(data): Json<Person>) -> RouteResult {
    let Person {
        uuid,
        first_name,
        last_name,
        middle_name,
        role,
        ..
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

/// Edits person record
#[utoipa::path(
    put,
    path = "/people/:uuid",
    params(
        ("uuid" = Uuid, Path, description = "Uuid of the person to edit")
    ),
    request_body = Person,
)]
async fn change(
    State(db): RouteState,
    Path(uuid): Path<Uuid>,
    Json(data): Json<Person>,
) -> RouteResult {
    let Person {
        uuid: new_uuid,
        first_name,
        last_name,
        middle_name,
        role,
        banned,
        ban_reason,
    } = data;

    sqlx::query!(
        r#"
        UPDATE Person SET
            uuid = coalesce($1, uuid),
            first_name = $2,
            last_name = $3,
            middle_name = $4,
            role_id = (SELECT id FROM Role WHERE role = $5),
            banned = $6,
            ban_reason = $7
        WHERE
            uuid = $8
    "#,
        new_uuid,
        first_name,
        last_name,
        middle_name,
        role,
        banned,
        ban_reason,
        uuid
    )
    .execute(&db)
    .await?;

    Ok(())
}

/// Deletes person record
#[utoipa::path(
    delete,
    path = "/people/:uuid",
    params(
        ("uuid" = Uuid, Path, description = "Uuid of the person to delete")
    ),
)]
async fn remove(State(db): RouteState, Path(uuid): Path<Uuid>) -> RouteResult {
    let result = sqlx::query!("DELETE FROM Person WHERE uuid = $1", uuid)
        .execute(&db)
        .await?;

    if result.rows_affected() == 0 {
        Err(anyhow!("Person with this uuid was not found").into())
    } else {
        Ok(())
    }
}

pub fn openapi() -> OpenApi {
    #[derive(utoipa::OpenApi)]
    #[openapi(
        paths(
            super::people::fetch,
            super::people::create,
            super::people::change,
            super::people::remove
        ),
        components(schemas(Person))
    )]
    struct ApiDoc;

    <ApiDoc as utoipa::OpenApi>::openapi()
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(fetch).post(create))
        .route("/:uuid", put(change).delete(remove))
}
