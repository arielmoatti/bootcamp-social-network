SELECT id, first, last, email, bio 
FROM users
ORDER BY id DESC LIMIT 10;

update users
set bio='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut praesentium tenetur, libero laudantium fuga perspiciatis.'
where id=2;