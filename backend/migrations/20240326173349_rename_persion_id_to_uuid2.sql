-- Add migration script here

ALTER TABLE Log RENAME COLUMN person_id TO person_uuid;

