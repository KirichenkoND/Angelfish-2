use super::{Json, Query, RouteResult, RouteState};
use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::*,
};
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Deserialize)]
struct FetchQuery {
    name: Option<String>,
}

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

async fn create(Path(category): Path<String>, State(db): RouteState) -> RouteResult<()> {
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

async fn remove(Path(category): Path<String>, State(db): RouteState) -> RouteResult<StatusCode> {
    let result = sqlx::query!("DELETE FROM Category WHERE category = $1", category)
        .execute(&db)
        .await?;
    if result.rows_affected() == 0 {
        return Ok(StatusCode::NOT_FOUND);
    }

    Ok(StatusCode::OK)
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(fetch))
        .route("/:category", post(create).delete(remove))
}
