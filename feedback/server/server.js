const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = 3000;

// PostgreSQL Pool
const pool = new Pool({
  user: 'john',
  host: 'localhost',
  database: 'phishnatomy',
  password: '1234',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static('public'));

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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
