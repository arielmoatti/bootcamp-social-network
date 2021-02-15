DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    first       VARCHAR(255) NOT NULL,
    last        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    avatar      VARCHAR(255),
    bio         TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

DROP TABLE IF EXISTS reset_codes CASCADE;
CREATE TABLE reset_codes(
    id          SERIAL PRIMARY KEY,
    email       VARCHAR NOT NULL,
    code        VARCHAR NOT NULL,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

DROP TABLE IF EXISTS friendships CASCADE;
CREATE TABLE friendships(
    id          SERIAL PRIMARY KEY,
    sender_id   INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted    BOOLEAN DEFAULT false
    );

DROP TABLE IF EXISTS msgboard CASCADE;
CREATE TABLE msgboard(
    id          SERIAL PRIMARY KEY,
    message     TEXT,
    author      INT REFERENCES users(id) NOT NULL,
    created_at  TIMESTAMP DEFAULT TIMEZONE('MEST', NOW())
    );