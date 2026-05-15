import fs from 'fs';
import path from 'path';
import pool from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('Reading schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('Executing schema...');
    // Split by semicolon and filter out empty strings to run queries one by one
    // Note: This is a simple split, might fail with complex SQL but schema.sql looks clean
    const queries = schema
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    for (let query of queries) {
      await pool.query(query);
    }
    
    console.log('Database schema initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
