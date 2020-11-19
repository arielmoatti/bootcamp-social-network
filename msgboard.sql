DROP TABLE IF EXISTS msgboard CASCADE;
CREATE TABLE msgboard(
    id          SERIAL PRIMARY KEY,
    message     TEXT,
    author      INT REFERENCES users(id) NOT NULL,
    -- created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- created_at  timestamp without time zone default (now() at time zone 'MEST')
    created_at  TIMESTAMP DEFAULT TIMEZONE('MEST', NOW())
    );
INSERT INTO msgboard
    (message, author, created_at)
VALUES 
    ('25 years later, she still regretted that specific moment. So long and thanks for the fish.', 201, '2020-11-17 23:05:58'),
    ('The tree fell unexpectedly short. Watching the geriatric men’s softball team brought back memories of 3 yr olds playing t-ball.', 3, '2020-10-17 23:06:58'),
    ('Jason lived his life by the motto, Anything worth doing is worth doing poorly. The beauty of the sunset was obscured by the industrial cranes.', 64, '2020-11-17 23:07:58'),
    ('He found the end of the rainbow and was surprised at what he found there. She looked into the mirror and saw another person.', 23, '2020-11-13 23:08:58'),
    ('I love eating toasted cheese and tuna sandwiches. When I cook spaghetti, I like to boil it a few minutes past al dente so the noodles are super slippery.', 201, '2020-11-17 23:09:58'),
    ('The fish listened intently to what the frogs had to say. Nobody questions who built the pyramids in Mexico.', 23, '2020-11-17 23:10:58'),
    ('The tattered work gloves speak of the many hours of hard labor he endured throughout his life.', 23, '2020-11-16 23:11:58'),
    ('The body piercing didnt go exactly as he expected. Karen realized the only way she was getting into heaven was to cheat.', 201, '2020-11-17 23:12:58'),
    ('Wisdom is easily acquired when hiding under the bed with a saucepan on your head. He always wore his sunglasses at night.', 201, '2020-11-17 23:13:58'),
    ('he two walked down the slot canyon oblivious to the sound of thunder in the distance. He is no James Bond', 64, '2020-11-17 23:14:58'),
    ('She felt that chill that makes the hairs on the back of your neck when he walked into the room. Doris enjoyed tapping her nails on the table to annoy everyone.', 3, '2020-10-13 23:05:58'),
    ('Nobody questions who built the pyramids in Mexico. Doris enjoyed tapping her nails on the table to annoy everyone.', 201, '2020-11-17 22:05:58'),
    ('She used her own hair in the soup to give it more flavor. You cannot compare apples and oranges, but what about bananas and plantains?', 64, '2020-11-17 23:05:58'),
    ('The father died during childbirth. She tilted her head back and let whip cream stream into her mouth while taking a bath.', 23, '2020-11-17 21:35:58'),
    ('The fish dreamed of escaping the fishbowl and into the toilet where he saw his friend go.', 3, '2020-11-13 23:05:58')
    ;



-- SELECT * FROM msgboard ORDER BY created_at DESC;

-- SELECT msgboard.id, message, first, last, avatar, msgboard.created_at
--         FROM msgboard
--         JOIN users
--         ON author = users.id
--         ORDER BY msgboard.created_at DESC
--         LIMIT 10;