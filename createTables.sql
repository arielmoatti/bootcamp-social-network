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


-- update users
-- set bio='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut praesentium tenetur, libero laudantium fuga perspiciatis.'
-- where id=2;