use super::{Json, RouteResult, RouteState};
use crate::models::Person;
use anyhow::anyhow;
use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{extract::State, routing::*};
use rand::rngs::OsRng;
use serde::Deserialize;
use sqlx::PgPool;
use time::{Duration, OffsetDateTime};
use tower_sessions::{Expiry, Session};
use utoipa::{openapi::OpenApi, ToSchema};
use uuid::Uuid;

#[derive(Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
struct ChangePasswordRequest {
    /// Old password
    old: String,
    /// New password
    new: String,
}

/// Changes password of the current user
#[utoipa::path(post, tag = "Authentication", path = "/auth/change_password", responses((status = 200)))]
async fn change_password(
    State(db): RouteState,
    session: Session,
    Json(data): Json<ChangePasswordRequest>,
) -> RouteResult {
    let ChangePasswordRequest { old, new } = data;

    let uuid: Uuid = session
        .get("person_uuid")
        .await?
        .ok_or(anyhow!("Запрос не авторизован"))?;
    let Some(hash): Option<String> =
        sqlx::query!("SELECT password_hash FROM Person WHERE uuid = $1", uuid)
            .fetch_optional(&db)
            .await?
            .ok_or(anyhow!("Пользователь удален"))?
            .password_hash
    else {
        return Err(anyhow!("Смена пароля не доступна").into());
    };

    if Argon2::default()
        .verify_password(
            old.as_bytes(),
            &PasswordHash::try_from(hash.as_str()).unwrap(),
        )
        .is_err()
    {
        return Err(anyhow!("Неверный пароль").into());
    }

    let password_hash = Argon2::default()
        .hash_password(new.as_bytes(), &SaltString::generate(OsRng))
        .unwrap()
        .to_string();
    sqlx::query!(
        "UPDATE Person SET password_hash = $1 WHERE uuid = $2",
        password_hash,
        uuid
    )
    .execute(&db)
    .await?;

    Ok(())
}

/// Returns personal info of the current user
#[utoipa::path(get, tag = "Authentication", path = "/auth/me", responses((status = 200, body = Person)))]
async fn me(State(db): RouteState, session: Session) -> RouteResult<Json<Person>> {
    let person_uuid: Uuid = session
        .get("person_uuid")
        .await?
        .ok_or(anyhow!("Запрос не авторизован"))?;

    let person = sqlx::query_as::<_, Person>(
        "SELECT * FROM Person JOIN Role ON Role.id = role_id WHERE Person.uuid = $1",
    )
    .bind(person_uuid)
    .fetch_one(&db)
    .await?;

    Ok(Json(person))
}

#[derive(Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
struct Login {
    phone: String,
    password: String,
}

/// Logs in as this role
#[utoipa::path(post, tag = "Authentication", path = "/auth/login", request_body = Login, responses((status = 200)))]
async fn login(session: Session, State(db): RouteState, Json(data): Json<Login>) -> RouteResult {
    let Login { phone, password } = data;

    let record = sqlx::query!(
        "SELECT uuid, password_hash FROM Person WHERE phone = $1",
        phone
    )
    .fetch_optional(&db)
    .await?
    .ok_or(anyhow!("Role is not found"))?;

    let password_hash = record
        .password_hash
        .ok_or(anyhow!("Person does not allow log in"))?;

    let hash = PasswordHash::try_from(password_hash.as_str()).unwrap();
    Argon2::default()
        .verify_password(password.as_bytes(), &hash)
        .map_err(|_| anyhow!("Invalid password"))?;
    session.set_expiry(Some(Expiry::AtDateTime(
        OffsetDateTime::now_utc() + Duration::days(1),
    )));
    session.insert("person_uuid", record.uuid).await?;

    Ok(())
}

/// Loggs out of the session
#[utoipa::path(post, tag = "Authentication", path = "/logout", responses((status = 200)))]
async fn logout(session: Session) -> RouteResult {
    session.delete().await?;
    Ok(())
}

pub fn openapi() -> OpenApi {
    #[derive(utoipa::OpenApi)]
    #[openapi(
        paths(
            super::auth::me,
            super::auth::login,
            super::auth::logout,
            super::auth::change_password
        ),
        components(schemas(Login))
    )]
    struct ApiDoc;

    <ApiDoc as utoipa::OpenApi>::openapi()
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/me", get(me))
        .route("/change_password", post(change_password))
        .route("/login", post(login))
        .route("/logout", post(logout))
}
