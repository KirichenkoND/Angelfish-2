-- Add migration script here

CREATE TABLE Category(
    id SERIAL PRIMARY KEY,
    category VARCHAR(32) NOT NULL UNIQUE
);

INSERT INTO Category(category) VALUES
    ('service'),
    ('laboratory'),
    ('lecture hall'),
    ('office'),
    ('common');

CREATE TABLE Role(
    id SERIAL PRIMARY KEY,
    role VARCHAR(32) NOT NULL UNIQUE
);

INSERT INTO Role(role) VALUES
    ('student'),
    ('teacher'),
    ('admin'),
    ('security'),
    ('service'),
    ('none');

CREATE TABLE Person(
    uuid UUID PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    middle_name VARCHAR(32),
    role_id INTEGER NOT NULL REFERENCES Role,
    banned BOOLEAN NOT NULL DEFAULT false,
    ban_reason TEXT
);

CREATE TABLE Room(
    id SERIAL PRIMARY KEY,
    room VARCHAR(16) NOT NULL, 
    floor INTEGER NOT NULL,
    category_id INTEGER NOT NULL REFERENCES Category,

    UNIQUE (room, floor)
);

CREATE TABLE Permission(
    person_uuid UUID REFERENCES Person,
    role_id INTEGER REFERENCES Role,

    room_id INTEGER REFERENCES Room,
    category_id INTEGER REFERENCES Category,

    PRIMARY KEY (person_uuid, role_id, room_id, category_id)
);

CREATE TABLE Log(
    id SERIAL PRIMARY KEY,
    time TIMESTAMPTZ NOT NULL DEFAULT now(),
    person_uuid UUID NOT NULL REFERENCES Person,
    room_id INTEGER NOT NULL REFERENCES Room,
    allowed BOOLEAN NOT NULL,
    entered BOOLEAN NOT NULL
);
