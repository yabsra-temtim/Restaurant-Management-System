import pg from 'pg';
const { Pool } = pg;

async function testConnection(url) {
  const pool = new Pool({ connectionString: url });
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Success with:', url);
    console.log('Result:', res.rows[0]);
    return true;
  } catch (err) {
    console.error('Failed with:', url);
    console.error('Error:', err.message);
    return false;
  } finally {
    await pool.end();
  }
}

const original = 'postgresql://postgres:[#Yabsra2721]@db.fzkccoyvklnwxxiwvskf.supabase.co:5432/postgres';
const encoded = 'postgresql://postgres:%5B%23Yabsra2721%5D@db.fzkccoyvklnwxxiwvskf.supabase.co:5432/postgres';
const noBrackets = 'postgresql://postgres:#Yabsra2721@db.fzkccoyvklnwxxiwvskf.supabase.co:5432/postgres';
const noBracketsEncoded = 'postgresql://postgres:%23Yabsra2721@db.fzkccoyvklnwxxiwvskf.supabase.co:5432/postgres';

async function runTests() {
  await testConnection(original);
  await testConnection(encoded);
  await testConnection(noBrackets);
  await testConnection(noBracketsEncoded);
}

runTests();
