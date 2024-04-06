-- Add migration script here

ALTER TABLE Person DROP COLUMN password_hash;
ALTER TABLE Role ADD COLUMN password_hash VARCHAR(128);
