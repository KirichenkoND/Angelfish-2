-- Add migration script here

ALTER TABLE Room ADD CONSTRAINT room_floor_name_uniq UNIQUE (room, floor);
ALTER TABLE AllowedEntity ADD CONSTRAINT params_uniq UNIQUE (person_id, role_id, category_id, room_id);
