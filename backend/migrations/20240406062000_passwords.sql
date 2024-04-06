-- Add migration script here

ALTER TABLE Person ADD COLUMN password_hash VARCHAR(128);
