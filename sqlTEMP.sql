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

