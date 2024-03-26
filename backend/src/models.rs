use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Room {
    pub id: i32,
    pub category: String,
    pub floor: i32,
    #[sqlx(rename = "room")]
    pub name: String,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Person {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uuid: Option<Uuid>,
    pub first_name: String,
    pub last_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub middle_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub banned: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ban_reason: Option<String>,
}
