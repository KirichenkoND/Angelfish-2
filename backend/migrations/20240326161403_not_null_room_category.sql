-- Add migration script here

ALTER TABLE Room ALTER COLUMN category_id SET NOT NULL;
