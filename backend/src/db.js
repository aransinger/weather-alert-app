const { Pool } = require('pg');
console.log('Connecting to:', process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // optionally add ssl: { rejectUnauthorized: false } if using a cloud provider
});

module.exports = pool;
