SELECT id, first, last, email, bio 
FROM users
ORDER BY id DESC LIMIT 10;

update users
set bio='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut praesentium tenetur, libero laudantium fuga perspiciatis.'
where id=2;

INSERT INTO friendships
(sender_id, recipient_id)
VALUES (201, 1);

UPDATE friendships
SET accepted = true
WHERE (sender_id = 201 AND recipient_id = 1);

DELETE FROM friendships
WHERE recipient_id = 1;


--insert fake friendships
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
    (201, 8, true);


SELECT users.id, first, last, avatar, accepted
FROM friendships
JOIN users
ON (accepted = false AND recipient_id = 201 AND sender_id = users.id)
OR (accepted = true AND recipient_id = 201 AND sender_id = users.id)
OR (accepted = true AND sender_id = 201 AND recipient_id = users.id);




