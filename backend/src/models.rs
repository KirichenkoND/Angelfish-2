use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
#[serde(untagged)]
pub enum Target {
    Room { room_id: i32 },
    Category { category: String },
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
pub enum User {
    Role { role: String },
    Person { person_uuid: Uuid },
}

#[derive(Debug, Deserialize)]
pub struct Permission {
    #[serde(flatten)]
    pub target: Target,
    #[serde(flatten)]
    pub user: User,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
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

#[derive(Debug, FromRow, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Person {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uuid: Option<Uuid>,
    pub first_name: String,
    pub last_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub middle_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    pub banned: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ban_reason: Option<String>,
}
