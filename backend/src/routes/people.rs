use super::{Json, Query, RouteResult, RouteState};
use crate::{
    middleware::{protect_admin, protect_guard},
    models::Person,
};
use anyhow::anyhow;
use argon2::PasswordHasher;
use argon2::{password_hash::SaltString, Argon2};
use axum::{
    extract::{Path, State},
    middleware::from_fn_with_state,
    routing::*,
};
use rand::rngs::OsRng;
use serde::Deserialize;
use sqlx::PgPool;
use utoipa::{openapi::OpenApi, IntoParams, ToSchema};
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
struct FetchQuery {
    name: Option<String>,
    phone: Option<String>,
    uuid: Option<Uuid>,
    banned: Option<bool>,
}

/// Fetch people
#[utoipa::path(
    get,
    tag = "People management",
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
    let FetchQuery {
        name,
        uuid,
        banned,
        phone,
    } = query;

    let results = sqlx::query_as::<_, Person>(
        r#"
            SELECT * FROM Person
            LEFT JOIN Role ON Role.id = role_id
            WHERE
                lower(concat(first_name, last_name, middle_name)) LIKE coalesce('%' || lower($1) || '%', '%') AND
                coalesce(uuid = $2, true) AND
                coalesce(banned = $3, true) AND
                coalesce(phone LIKE '%' || $4 || '%', true)
        "#,
    ).bind(name).bind(uuid).bind(banned).bind(phone).fetch_all(&db).await?;

    Ok(Json(results))
}

#[derive(Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
struct CreatePersonRequest {
    uuid: Option<Uuid>,
    first_name: String,
    last_name: String,
    middle_name: Option<String>,
    role: String,
    phone: Option<String>,
    password: Option<String>,
}

/// Create new person record
/// Only `uuid`, `first_name`, `last_name`, `middle_name`, `role` fields are used.
#[utoipa::path(
    post,
    tag = "People management",
    path = "/people",
    request_body = CreatePersonRequest,
)]
async fn create(State(db): RouteState, Json(data): Json<CreatePersonRequest>) -> RouteResult {
    let CreatePersonRequest {
        uuid,
        first_name,
        last_name,
        middle_name,
        role,
        phone,
        password,
    } = data;

    let password_hash = password.map(|pass| {
        Argon2::default()
            .hash_password(pass.as_bytes(), &SaltString::generate(OsRng))
            .unwrap()
            .to_string()
    });

    sqlx::query!(
        r#"
        INSERT INTO Person(uuid, first_name, last_name, middle_name, role_id, phone, password_hash) VALUES(
            coalesce($1, gen_random_uuid()),
            $2, $3, $4,
            coalesce((SELECT id FROM Role WHERE role = $5), 0),
            $6,
            $7
        )
    "#,
        uuid,
        first_name,
        last_name,
        middle_name,
        role,
        phone,
        password_hash
    )
    .execute(&db)
    .await?;

    Ok(())
}

/// Edits person record
#[utoipa::path(
    put,
    tag = "People management",
    path = "/people/{uuid}",
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
        phone,
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
            ban_reason = $7,
            phone = $9
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
        uuid,
        phone
    )
    .execute(&db)
    .await?;

    Ok(())
}

/// Deletes person record
#[utoipa::path(
    delete,
    tag = "People management",
    path = "/people/{uuid}",
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
        components(schemas(Person, CreatePersonRequest))
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
            "/:uuid",
            put(change)
                .delete(remove)
                .layer(from_fn_with_state(db.clone(), protect_admin)),
        )
}
