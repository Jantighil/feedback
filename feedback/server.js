const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

// PostgreSQL Pool using Supabase connection string
const pool = new Pool({
  connectionString: 'postgresql://postgres.ensyvveevljxfdkdgcvo:07034984914Bread@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/feedback', async (req, res) => {
  const { username, rating, feedback } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO feedback (username, rating, feedback) VALUES ($1, $2, $3) RETURNING *',
      [username, rating, feedback]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting feedback:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
