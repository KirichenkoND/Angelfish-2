use crate::error::Error;
use anyhow::anyhow;
use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
    RequestExt,
};
use sqlx::PgPool;
use tower_sessions::Session;
use uuid::Uuid;

async fn get_role(req: &mut Request, pool: &PgPool) -> Result<String, Error> {
    let session = req
        .extract_parts::<Session>()
        .await
        .map_err(|(_, err)| anyhow!("{err}"))?;

    let Some(person_uuid) = session
        .get::<Uuid>("person_uuid")
        .await
        .map_err(|msg| anyhow!("{msg}"))?
    else {
        return Err(anyhow!("Запрос не авторизован").into());
    };

    let Some(record) = sqlx::query!(
        "SELECT role FROM Role JOIN Person ON Person.role_id = Role.id WHERE Person.uuid = $1",
        person_uuid
    )
    .fetch_optional(pool)
    .await?
    else {
        return Err(anyhow!("Пользователь удален").into());
    };

    Ok(record.role)
}

pub async fn protect_guard(
    State(pool): State<PgPool>,
    mut req: Request,
    next: Next,
) -> Result<Response, Error> {
    let role = get_role(&mut req, &pool).await?;

    if role == "security" || role == "admin" {
        Ok(next.run(req).await)
    } else {
        Err(anyhow!("Действие запрещено").into())
    }
}

pub async fn protect_admin(
    State(pool): State<PgPool>,
    mut req: Request,
    next: Next,
) -> Result<Response, Error> {
    let role = get_role(&mut req, &pool).await?;

    if role == "admin" {
        Ok(next.run(req).await)
    } else {
        Err(anyhow!("Действие запрещено").into())
    }
}
