import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db';
import { sql } from 'drizzle-orm';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = process.env.PORT || 3000;

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    // Simple query to test connection
    const timestamp = new Date().toISOString();
    res.json({ 
      status: 'ok',
      timestamp,
      message: 'Database connection successful'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
  console.log('Environment:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set'
  });
}); 