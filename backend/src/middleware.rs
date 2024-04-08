use crate::error::Error;
use anyhow::anyhow;
use axum::{extract::Request, middleware::Next, response::Response, RequestExt};
use tower_sessions::Session;

async fn get_role(req: &mut Request) -> Result<String, Error> {
    let session = req
        .extract_parts::<Session>()
        .await
        .map_err(|(_, err)| anyhow!("{err}"))?;

    let Some(role) = session
        .get::<String>("role")
        .await
        .map_err(|msg| anyhow!("{msg}"))?
    else {
        return Err(anyhow!("Не авторизован").into());
    };

    Ok(role)
}

pub async fn protect_guard(mut req: Request, next: Next) -> Result<Response, Error> {
    let role = get_role(&mut req).await?;

    if role == "security" || role == "admin" {
        Ok(next.run(req).await)
    } else {
        Err(anyhow!("Вход запрещен").into())
    }
}

pub async fn protect_admin(mut req: Request, next: Next) -> Result<Response, Error> {
    let role = get_role(&mut req).await?;

    if role == "admin" {
        Ok(next.run(req).await)
    } else {
        Err(anyhow!("Вход запрещен").into())
    }
}
