use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};

#[derive(Debug)]
pub struct Error(anyhow::Error);
impl<T: Into<anyhow::Error>> From<T> for Error {
    fn from(err: T) -> Self {
        Self(err.into())
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        #[derive(serde::Serialize)]
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
