use super::{Json, Query, RouteResult, RouteState};
use anyhow::anyhow;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::*,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use time::{Duration, OffsetDateTime};
use tower_sessions::{Expiry, Session};
use utoipa::{openapi::OpenApi, IntoParams, ToSchema};

#[derive(Serialize, ToSchema)]
struct Me {
    role: String,
}

#[utoipa::path(get, path = "/roles/me")]
async fn me(session: Session) -> RouteResult<Json<Me>> {
    let role: String = session.get("role").await?.ok_or(anyhow!("Unauthorized"))?;
    Ok(Json(Me { role }))
}

#[derive(Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
struct Login {
    password: String,
}

#[utoipa::path(post, path = "/roles/{role}/login", request_body = LoginReques, responses((status = 200)))]
async fn login(
    session: Session,
    Path(role): Path<String>,
    State(db): RouteState,
    Json(data): Json<Login>,
) -> RouteResult {
    let Login { password } = data;

    let password_hash: String =
        sqlx::query!("SELECT password_hash FROM Role WHERE role = $1", role)
            .fetch_optional(&db)
            .await?
            .ok_or(anyhow!("Role is not found"))?
            .password_hash
            .ok_or(anyhow!("Cannot login into role without password"))?;

    let hash = PasswordHash::try_from(password_hash.as_str()).unwrap();
    Argon2::default()
        .verify_password(password.as_bytes(), &hash)
        .map_err(|_| anyhow!("Invalid password"))?;
    session.set_expiry(Some(Expiry::AtDateTime(
        OffsetDateTime::now_utc() + Duration::days(1),
    )));
    session.insert("role", role).await?;

    Ok(())
}

#[derive(Deserialize, IntoParams)]
struct FetchQuery {
    name: Option<String>,
}

/// Fetch user roles
#[utoipa::path(get, path = "/roles", params(FetchQuery), responses((status = 200, body = Vec<String>)))]
async fn fetch(
    State(db): RouteState,
    Query(query): Query<FetchQuery>,
) -> RouteResult<Json<Vec<String>>> {
    let results = sqlx::query!(
        r#"
            SELECT role FROM Role
            WHERE lower(role) LIKE coalesce('%' || lower($1) || '%', '%')
            ORDER BY role
        "#,
        query.name
    )
    .fetch_all(&db)
    .await?
    .into_iter()
    .map(|r| r.role)
    .collect::<Vec<_>>();

    Ok(Json(results))
}

/// Create new user role
#[utoipa::path(post, path = "/roles/{role}", params(("role" = String, Path, description = "New user role name")))]
async fn create(Path(role): Path<String>, State(db): RouteState) -> RouteResult<()> {
    let result = sqlx::query!("INSERT INTO Role(role) VALUES($1)", role)
        .execute(&db)
        .await;

    match result {
        Err(err) if matches!(err.as_database_error(), Some(err) if err.is_unique_violation()) => {
            return Err(anyhow!("Role with the same name already exists"))?
        }
        _ => {}
    };

    Ok(())
}

/// Delete user role
#[utoipa::path(delete, path = "/roles/{role}", params(("role" = String, Path, description = "User role name")))]
async fn remove(Path(category): Path<String>, State(db): RouteState) -> RouteResult<StatusCode> {
    let result = sqlx::query!("DELETE FROM Role WHERE role = $1", category)
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
            super::roles::fetch,
            super::roles::create,
            super::roles::me,
            super::roles::login,
            super::roles::remove
        ),
        components(schemas(super::roles::Me, super::roles::Login))
    )]
    struct ApiDoc;

    <ApiDoc as utoipa::OpenApi>::openapi()
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(fetch))
        .route("/me", get(me))
        .route("/:role", post(create).delete(remove))
        .route("/:role/login", post(login))
}
