DROP TABLE IF EXISTS friendships CASCADE;
CREATE TABLE friendships(
    id          SERIAL PRIMARY KEY,
    sender_id   INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted    BOOLEAN DEFAULT false
    );
INSERT INTO friendships
    (sender_id, recipient_id, accepted)
VALUES 
    (201, 1, true),
    (2, 201, false),
    (201, 3, false),
    (201, 4, true),
    (5, 201, true),
    (201, 6, false),
    (7, 201, false),
    (201, 8, true),
    (201, 9, true),
    (10, 201, false),
    (201, 11, false),
    (201, 12, true),
    (13, 201, true),
    (201, 14, false),
    (15, 201, false),
    (201, 16, true);