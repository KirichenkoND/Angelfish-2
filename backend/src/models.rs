use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use time::OffsetDateTime;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, FromRow, ToSchema, Serialize, Deserialize)]
pub struct Permission {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub person_uuid: Option<Uuid>,
}

#[derive(Debug, FromRow, ToSchema, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Room {
    #[serde(skip_deserializing)]
    pub id: i32,
    pub category: String,
    pub floor: i32,
    #[sqlx(rename = "room")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
}

#[derive(Debug, FromRow, ToSchema, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Person {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uuid: Option<Uuid>,
    pub first_name: String,
    pub last_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub middle_name: Option<String>,
    pub role: String,
    pub banned: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ban_reason: Option<String>,
}

#[derive(Debug, FromRow, ToSchema, Serialize)]
pub struct Log {
    pub time: OffsetDateTime,
    pub person_uuid: Uuid,
    pub room_id: i32,
    pub allowed: bool,
    pub entered: bool,
}
