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
    ('Hello, I''m not new to third-wave coffee, been using V60 or AeroPress with fresh roasted beans for 10 years. ', 201, '2020-11-17 23:05:58'),

    ('I''ve always changed up what I''m drinking from bag to bag, no issue.', 3, '2020-10-17 23:06:58'),

    ('when you''re still learning how to dial in and evaluate espresso, it''s probably best to stick with the same beans until you become proficient in getting the most you can out of the beans.', 64, '2020-11-17 23:07:58'),

    ('Once you can consistently dial in those beans to taste about the same as the cafe''s product, you can move on to trying other beans and change them up as often as you like.', 23, '2020-11-13 23:08:58'),

    ('Ten years ago, when my tastes were aligned with espresso roasts, I''d stick with the same roaster, a 16 or 12 oz bag at a time. I''d rotate in "something fun" from the SO drip selection maybe once a month. I''d stick with the same roaster for months or years.', 201, '2020-11-17 23:09:58'),

    ('With where my skills for dial-in and repeatability are now, I''ll probably start splitting into 5-6 oz after opening a 10 or 12 oz bag. That''s something like 7-8 shots before opening something else.', 23, '2020-11-17 23:10:58'),

    ('I''m probably a bit of an outlier here, but I haven''t really changed coffees in three years. But that''s partly my personality I think.', 23, '2020-11-16 23:11:58'),

    (' I''ll probably start splitting into 5-6 oz after opening a 10 or 12 oz bag', 201, '2020-11-17 23:12:58'),

    ('If I even have the same coffee to roast again that I roasted last time, I might roast it again to a different level. So basically I change coffees often', 201, '2020-11-17 23:13:58'),

    ('That''s the fun of changing coffees!', 64, '2020-11-17 23:14:58'),

    ('It is a challenging thing since every espresso needs a different grind, dose, which I write on each jar.', 3, '2020-10-13 23:05:58'),

    ('I tend to stick to the same coffee bean from the same roaster that I know is consistently roasted well.
', 201, '2020-11-17 22:05:58'),

    ('You might not like every coffee as espresso even if dial it in properly. For instance, personally, the winy Kenyans don''t do it for me as espresso--for pour over I''m all over it.', 64, '2020-11-17 23:05:58'),

    ('Getting a "good" espresso from "not great" beans or roast is much more difficult.', 23, '2020-11-17 21:35:58'),

    ('I am now running 3 beans. I have a subscription for my espresso with Onyx. I get the 2lb bags and can switch the blend when I want', 3, '2020-11-13 23:05:58')
    ;



-- SELECT * FROM msgboard ORDER BY created_at DESC;

-- SELECT msgboard.id, message, first, last, avatar, msgboard.created_at
--         FROM msgboard
--         JOIN users
--         ON author = users.id
--         ORDER BY msgboard.created_at DESC
--         LIMIT 10;