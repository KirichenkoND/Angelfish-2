use axum::{
    extract::{FromRequest, FromRequestParts, State},
    response::{IntoResponse, Response},
};
use serde::Serialize;
use sqlx::PgPool;

#[derive(FromRequest)]
#[from_request(via(axum::Json))]
#[from_request(rejection(crate::error::Error))]
struct Json<T>(pub T);

impl<T: Serialize> IntoResponse for Json<T> {
    #[inline]
    fn into_response(self) -> Response {
        axum::Json(self.0).into_response()
    }
}

#[derive(FromRequestParts)]
#[from_request(via(axum::extract::Query))]
#[from_request(rejection(crate::error::Error))]
struct Query<T>(pub T);

pub mod categories;
pub mod people;
pub mod roles;
pub mod rooms;

pub type RouteState = State<PgPool>;
pub type RouteResult<T = ()> = Result<T, crate::error::Error>;
