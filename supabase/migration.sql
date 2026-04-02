CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  birthday DATE,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
