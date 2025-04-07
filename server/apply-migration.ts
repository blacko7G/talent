import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { PoolClient } from '@neondatabase/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyMigration() {
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize SQLite database
  const sqlite = new Database(path.join(dataDir, "talent-scout.db"));
  const db = drizzle(sqlite);

  try {
    // Run migrations
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: path.join(__dirname, "..", "drizzle") });
    console.log("Migrations completed!");

    // Create initial admin user
    const adminEmail = 'admin@example.com';
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));

    if (existingAdmin.length === 0) {
      console.log('Creating initial admin user...');
      await db.insert(users).values({
        email: adminEmail,
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'scout'
      });
      console.log('Admin user created successfully');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    sqlite.close();
  }
}

applyMigration(); 