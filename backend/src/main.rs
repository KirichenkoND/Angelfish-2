use axum::Router;
use dotenvy::var;
use sqlx::PgPool;
use tokio::net::TcpListener;
use tracing::{debug, info, Level};
use tracing_subscriber::EnvFilter;
use utoipa_swagger_ui::SwaggerUi;

mod error;
mod models;
mod routes;

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), error::Error> {
    #[cfg(debug_assertions)]
    let level = Level::DEBUG;
    #[cfg(not(debug_assertions))]
    let level = Level::INFO;

    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(level.into())
                .from_env_lossy(),
        )
        .init();

    debug!("Connecting to the database");
    let db = PgPool::connect(&var("DATABASE_URL").expect("Env `DATABASE_URL` is required")).await?;

    debug!("Migrating database schema");
    sqlx::migrate!("./migrations").run(&db).await?;

    let mut openapi = routes::categories::openapi();
    openapi.merge(routes::roles::openapi());
    openapi.merge(routes::people::openapi());

    let swagger = SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", openapi);

    let app = Router::new()
        .nest("/categories", routes::categories::router())
        .nest("/roles", routes::roles::router())
        .nest("/people", routes::people::router())
        .nest("/rooms", routes::rooms::router())
        .nest("/permissions", routes::perms::router())
        .nest("/logs", routes::logs::router())
        .merge(swagger)
        .with_state(db);

    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    info!("Listening at at {}", listener.local_addr()?);

    axum::serve(listener, app).await?;

    Ok(())
}
