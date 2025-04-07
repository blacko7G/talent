import { db } from './db';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Create tables directly
    console.log('Creating database tables...');
    
    // Create users table
    await db.run(schema.users);
    console.log('Users table created');

    // Create player profiles table
    await db.run(schema.playerProfiles);
    console.log('Player profiles table created');

    // Create scout profiles table
    await db.run(schema.scoutProfiles);
    console.log('Scout profiles table created');

    // Create academy profiles table
    await db.run(schema.academyProfiles);
    console.log('Academy profiles table created');

    // Create videos table
    await db.run(schema.videos);
    console.log('Videos table created');

    // Create trials table
    await db.run(schema.trials);
    console.log('Trials table created');

    // Create trial applications table
    await db.run(schema.trialApplications);
    console.log('Trial applications table created');

    // Create messages table
    await db.run(schema.messages);
    console.log('Messages table created');

    // Create scout interests table
    await db.run(schema.scoutInterests);
    console.log('Scout interests table created');

    // Create initial admin user if needed
    const adminEmail = 'admin@example.com';
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail)
    });

    if (!existingAdmin) {
      console.log('Creating initial admin user...');
      await db.insert(schema.users).values({
        email: adminEmail,
        password: 'admin123', // In production, this should be properly hashed
        firstName: 'Admin',
        lastName: 'User',
        role: 'scout'
      });
      console.log('Admin user created successfully');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 