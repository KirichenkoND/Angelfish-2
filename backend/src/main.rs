use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Router,
};
use dotenvy::var;
use serde::Serialize;
use sqlx::PgPool;
use tokio::net::TcpListener;

mod routes;

#[derive(Debug)]
struct Error(anyhow::Error);
impl<T: Into<anyhow::Error>> From<T> for Error {
    fn from(err: T) -> Self {
        Self(err.into())
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        #[derive(Serialize)]
        struct Err {
            error: bool,
            message: String,
        }

        (
            StatusCode::BAD_REQUEST,
            axum::Json(Err {
                error: true,
                message: self.0.to_string(),
            }),
        )
            .into_response()
    }
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Error> {
    let db = PgPool::connect(&var("DATABASE_URL").expect("Env `DATABASE_URL` is required")).await?;

    sqlx::migrate!("./migrations").run(&db).await?;

    let app = Router::new()
        .nest("/categories", routes::categories::router())
        .nest("/roles", routes::roles::router())
        .with_state(db);
    let listener = TcpListener::bind("0.0.0.0:8080").await?;

    axum::serve(listener, app).await?;

    Ok(())
}
