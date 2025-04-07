CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "profile_image" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "player_profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "position" TEXT,
  "age" INTEGER,
  "location" TEXT,
  "bio" TEXT,
  "achievements" TEXT,
  "overall_rating" INTEGER,
  "appearances" INTEGER,
  "goals" INTEGER,
  "is_elite_prospect" BOOLEAN DEFAULT FALSE,
  "is_verified" BOOLEAN DEFAULT FALSE,
  "stats" JSONB
);

CREATE TABLE IF NOT EXISTS "scout_profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "organization" TEXT,
  "position" TEXT,
  "bio" TEXT,
  "years_of_experience" INTEGER,
  "is_verified" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "academy_profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "name" TEXT NOT NULL,
  "location" TEXT,
  "description" TEXT,
  "founded_year" INTEGER,
  "website" TEXT,
  "is_verified" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "videos" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "url" TEXT NOT NULL,
  "thumbnail" TEXT,
  "duration" INTEGER,
  "views" INTEGER DEFAULT 0,
  "likes" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "trials" (
  "id" SERIAL PRIMARY KEY,
  "creator_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "title" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "position" TEXT,
  "age_group" TEXT,
  "location" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "description" TEXT,
  "requirements" TEXT,
  "image_url" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "trial_applications" (
  "id" SERIAL PRIMARY KEY,
  "trial_id" INTEGER NOT NULL REFERENCES "trials"("id"),
  "player_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "status" TEXT DEFAULT 'pending',
  "message" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" SERIAL PRIMARY KEY,
  "sender_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "receiver_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "content" TEXT NOT NULL,
  "is_read" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "scout_interests" (
  "id" SERIAL PRIMARY KEY,
  "scout_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "player_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "type" TEXT NOT NULL,
  "resource_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 