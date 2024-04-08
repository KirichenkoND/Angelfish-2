use super::{Json, Query, RouteResult, RouteState};
use crate::{middleware::protect_guard, models::Log};
use axum::{extract::State, middleware::from_fn_with_state, routing::get, Router};
use serde::Deserialize;
use sqlx::PgPool;
use time::OffsetDateTime;
use utoipa::{openapi::OpenApi, IntoParams};
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
struct FetchQuery {
    #[serde(with = "time::serde::rfc3339::option", default)]
    before: Option<OffsetDateTime>,
    #[serde(with = "time::serde::rfc3339::option", default)]
    after: Option<OffsetDateTime>,
    person_uuid: Option<Uuid>,
    room_id: Option<i32>,
    allowed: Option<bool>,
    entered: Option<bool>,
    count: Option<i64>,
    offset: Option<i64>,
}

/// Get logs
#[utoipa::path(
    get,
    tag = "Log history",
    path = "/logs",
    params(FetchQuery),
    responses(
        (status = 200, body = Vec<Log>)
    )
)]
async fn fetch(
    State(db): RouteState,
    Query(query): Query<FetchQuery>,
) -> RouteResult<Json<Vec<Log>>> {
    let FetchQuery {
        before,
        after,
        person_uuid,
        room_id,
        allowed,
        entered,
        count,
        offset,
    } = query;

    let results = sqlx::query_as::<_, Log>(
        r#"
        SELECT * FROM Log
        WHERE
            time BETWEEN coalesce($1, '-infinity'::timestamptz) AND coalesce($2, '+infinity'::timestamptz) AND
            coalesce(person_uuid = $3, true) AND
            coalesce(room_id = $4, true) AND
            coalesce(allowed = $5, true) AND
            coalesce(entered = $6, true)
        LIMIT $7 OFFSET $8
    "#)
        .bind(before)
        .bind(after)
        .bind(person_uuid)
        .bind(room_id)
        .bind(allowed)
        .bind(entered)
        .bind(count)
        .bind(offset)
        .fetch_all(&db).await?;

    Ok(Json(results))
}

pub fn openapi() -> OpenApi {
    #[derive(utoipa::OpenApi)]
    #[openapi(paths(super::logs::fetch), components(schemas(Log)))]
    struct ApiDoc;

    <ApiDoc as utoipa::OpenApi>::openapi()
}

pub fn router(db: &PgPool) -> Router<PgPool> {
    Router::new()
        .route("/", get(fetch))
        .layer(from_fn_with_state(db.clone(), protect_guard))
}
