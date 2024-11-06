CREATE TABLE IF NOT EXISTS todo_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todo_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    owner_id INTEGER REFERENCES todo_users(id) ON DELETE CASCADE,
    priority INTEGER NOT NULL,  
    due_date TIMESTAMP,          
    creation_date TIMESTAMP  
    );