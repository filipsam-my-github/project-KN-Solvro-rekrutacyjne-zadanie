import pg from 'pg';

const { Client } = pg;

const sql = `
  DROP TABLE IF EXISTS cocktail_ingredients;
  DROP TABLE IF EXISTS cocktails;
  DROP TABLE IF EXISTS ingredients;

  CREATE TABLE cocktails (
    id SERIAL PRIMARY KEY,
    name VARCHAR(63) NOT NULL,
    category VARCHAR(63) NOT NULL,
    is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE
  );

  CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE,
    image_url TEXT
  );

  CREATE TABLE cocktail_ingredients (
    id SERIAL PRIMARY KEY,
    cocktail_id INT NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity VARCHAR(50),
    unit VARCHAR(20)
  );

  INSERT INTO cocktails (name, category, is_alcoholic) VALUES
    ('cytrynowa lemoniada', 'kwaśno-słodkie', FALSE),
    ('Limonkowa lemoniada', 'kwaśno-słodkie', FALSE),
    ('Sok Jabłkowy', 'słodkie', FALSE),
    ('Sok Mangowy', 'słodkie', FALSE),
    ('Malibu z Mlekiem', 'słodkie', TRUE),
    ('Apple Pie', 'słodkie', TRUE),
    ('Cuba Libre', 'słodko-kwaśne', TRUE),
    ('Vodka Sprite & Lime', 'słodko-kwaśne', TRUE);

  INSERT INTO ingredients (name, description, is_alcoholic, image_url) VALUES
    ('Cytryna', 'Kwaśny owoc żółty', FALSE, 'https://azcdn.doz.pl/image/d/wiki-herb/34401bdf-scale-795x350.png'),
    ('Limonka', 'Kwaśny owoc zielony', FALSE, 'https://cdn.medonet.pl/1/HZhk9lBaHR0cHM6Ly9vY2RuLmV1L3B1bHNjbXMvTURBXy8zZjAyOWZkZjg3MjMxZDliNzZkMDQ1MjU0ZDRlMDM4MS5qcGeSlQMAzJPNE0DNCtSTBc0JYM0E7N4AAqEwB6ExBA'),
    ('Jabłko', 'Słodki owoc z jabłoni', FALSE, 'https://pl.wikipedia.org/wiki/Jab%C5%82ko#/media/Plik:Red_Apple.jpg'),
    ('Mango', 'Soczysty owoc tropikalny', FALSE, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Mango_-_single.jpg'),
    ('Woda', 'Woda do rozcieńczania napojów', FALSE, 'https://upload.wikimedia.org/wikipedia/commons/4/4f/2006-01-15_coin_on_water_retouched.jpg'),
    ('Cukier', 'Słodzik stosowany w napojach', FALSE, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sugar_Brown.jpg/500px-Sugar_Brown.jpg'),
    ('Rum', 'Czarny lub biały rum do drinków', TRUE, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2023_Havana_Club_A%C3%B1ejo_7_A%C3%B1os_%283%29.jpg/500px-2023_Havana_Club_A%C3%B1ejo_7_A%C3%B1os_%283%29.jpg'),
    ('Wódka', 'Czysty alkohol bez smaku', TRUE, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Monopolowa_Baczewski.JPG/500px-Monopolowa_Baczewski.JPG'),
    ('Likier kokosowy', 'Słodki likier kokosowy', TRUE, 'https://images.unsplash.com/photo-1577805947697-89e18249d767'),
    ('Sok jabłkowy', 'Naturalny sok z jabłek', FALSE, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5'),
    ('Lód', 'Kostki lodu do napojów', FALSE, 'https://cityice.pl/wp-content/uploads/2022/09/lod_wkostkach.jpg');

  INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, quantity, unit) VALUES
    (1, 1, '30', 'ml'),
    (1, 5, '100', 'ml'),
    (1, 6, '10', 'g'),
    (1, 11, '2', 'pcs'),
    (2, 2, '30', 'ml'),
    (2, 5, '100', 'ml'),
    (2, 6, '10', 'g'),
    (2, 11, '2', 'pcs'),
    (3, 10, '200', 'ml'),
    (4, 4, '200', 'g'),
    (5, 9, '50', 'ml'),
    (5, 5, '50', 'ml'),
    (5, 11, '2', 'pcs'),
    (6, 3, '120', 'g'),
    (6, 5, '50', 'ml'),
    (6, 6, '10', 'g'),
    (7, 7, '50', 'ml'),
    (7, 2, '20', 'ml'),
    (7, 5, '100', 'ml'),
    (7, 11, '2', 'pcs'),
    (8, 8, '50', 'ml'),
    (8, 2, '20', 'ml'),
    (8, 5, '100', 'ml'),
    (8, 11, '2', 'pcs');
`;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'sql',
  database: 'cocktails_db',
});

try {
  await client.connect();
  await client.query(sql);
  console.log('Database reset complete.');
} catch (error) {
  console.error('Database reset failed:', error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
