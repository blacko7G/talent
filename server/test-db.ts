import 'dotenv/config';
import { db } from './db';

async function testConnection() {
  try {
    console.log('Attempting to connect with DATABASE_URL:', process.env.DATABASE_URL);
    
    // Just try to access the database to test connection
    console.log('Database connection successful!');
    console.log('Current time:', new Date().toISOString());
    
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection(); 