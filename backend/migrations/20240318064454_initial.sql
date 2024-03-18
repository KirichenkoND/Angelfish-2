-- Add migration script here

CREATE TABLE Person(
    uuid UUID PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    middle_name VARCHAR(32)
);

CREATE TABLE Category(
    id SERIAL PRIMARY KEY,
    category VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE Room(
    id SERIAL PRIMARY KEY,
    floor INTEGER NOT NULL,
    category_id INTEGER REFERENCES Category
);

CREATE TABLE AllowedPerson(
    person_id UUID NOT NULL REFERENCES Person,
    room_id INTEGER NOT NULL REFERENCES Room,

    PRIMARY KEY (person_id, room_id)
);

CREATE TABLE AllowedCategory(
    category_id INTEGER NOT NULL REFERENCES Category,
    room_id INTEGER NOT NULL REFERENCES Room,
    
    PRIMARY KEY (category_id, room_id)
);

CREATE TABLE Log(
    id SERIAL PRIMARY KEY,
    time TIMESTAMPTZ NOT NULL DEFAULT now(),
    person_id UUID NOT NULL REFERENCES Person,
    room_id INTEGER NOT NULL REFERENCES Room,
    allowed BOOLEAN NOT NULL,
    entered BOOLEAN NOT NULL
);
