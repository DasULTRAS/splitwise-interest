CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT, password TEXT);
CREATE TABLE IF NOT EXISTS persons (id SERIAL PRIMARY KEY, name TEXT, schuldbetrag REAL, zins REAL, zinsrate REAL);
INSERT INTO users (id, username, password) VALUES (1, 'user', '$2y$10$dG8m8CstbL5fqtlflnYdO.CWtdDfoWpQVGahQeIpwn1zZmex9bpsm');