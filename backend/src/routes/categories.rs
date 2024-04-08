use super::{Json, Query, RouteResult, RouteState};
use crate::middleware::{protect_admin, protect_guard};
use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    middleware::from_fn_with_state,
    routing::*,
};
use serde::Deserialize;
use sqlx::PgPool;
use utoipa::{openapi::OpenApi, IntoParams};

#[derive(Deserialize, IntoParams)]
struct FetchQuery {
    name: Option<String>,
}

/// Fetch room categories
#[utoipa::path(get, path = "/categories", params(FetchQuery), responses(
    (status = 200, body = Vec<String>)
))]
async fn fetch(
    State(db): RouteState,
    Query(query): Query<FetchQuery>,
) -> RouteResult<Json<Vec<String>>> {
    let results = sqlx::query!(
        r#"
            SELECT category FROM Category
            WHERE lower(category) LIKE coalesce('%' || lower($1) || '%', '%')
            ORDER BY category
        "#,
        query.name
    )
    .fetch_all(&db)
    .await?
    .into_iter()
    .map(|r| r.category)
    .collect::<Vec<_>>();

    Ok(Json(results))
}

/// Create new category
#[utoipa::path(post, path = "/categories/{category}", params(("category" = String, Path, description = "New category name")))]
async fn create(Path(category): Path<String>, State(db): RouteState) -> RouteResult {
    let result = sqlx::query!("INSERT INTO Category(category) VALUES($1)", category)
        .execute(&db)
        .await;

    match result {
        Err(err) if matches!(err.as_database_error(), Some(err) if err.is_unique_violation()) => {
            return Err(anyhow!("Category with the same name already exists"))?
        }
        _ => {}
    };

    Ok(())
}

/// Delete category
#[utoipa::path(delete, path = "/categories/{category}", params(("category" = String, Path, description = "Category to delete")))]
async fn remove(Path(category): Path<String>, State(db): RouteState) -> RouteResult<StatusCode> {
    let result = sqlx::query!("DELETE FROM Category WHERE category = $1", category)
        .execute(&db)
        .await?;
    if result.rows_affected() == 0 {
        return Ok(StatusCode::NOT_FOUND);
    }

    Ok(StatusCode::OK)
}

pub fn openapi() -> OpenApi {
    #[derive(utoipa::OpenApi)]
    #[openapi(paths(
        super::categories::fetch,
        super::categories::create,
        super::categories::remove
    ))]
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
            "/:category",
            post(create)
                .delete(remove)
                .layer(from_fn_with_state(db.clone(), protect_admin)),
        )
}
