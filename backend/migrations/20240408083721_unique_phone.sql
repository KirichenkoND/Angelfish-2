-- Add migration script here

ALTER TABLE Person ADD UNIQUE(phone);
