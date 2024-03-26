use axum::Router;
use dotenvy::var;
use sqlx::PgPool;
use tokio::net::TcpListener;

mod error;
mod models;
mod routes;

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), error::Error> {
    let db = PgPool::connect(&var("DATABASE_URL").expect("Env `DATABASE_URL` is required")).await?;

    sqlx::migrate!("./migrations").run(&db).await?;

    let app = Router::new()
        .nest("/categories", routes::categories::router())
        .nest("/roles", routes::roles::router())
        .nest("/people", routes::people::router())
        .nest("/rooms", routes::rooms::router())
        .with_state(db);
    let listener = TcpListener::bind("0.0.0.0:8080").await?;

    axum::serve(listener, app).await?;

    Ok(())
}
