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
    (5, 201, true),
    (201, 6, false),
    (7, 201, false),    
    (201, 9, true),
    (201, 11, false),    
    (13, 201, true),
    (15, 201, false),
    (201, 16, true),
    (202, 201, false);