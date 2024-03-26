-- Add migration script here

ALTER TABLE Permission RENAME COLUMN person_id TO person_uuid;
