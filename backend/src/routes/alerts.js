const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, location, parameter, threshold, description } = req.body;

  if (!location || !parameter || !threshold) {
    return res.status(400).json({ error: 'location, parameter, and threshold are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO alerts (name, location, parameter, threshold, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name?.trim() || null, location.trim(), parameter, threshold, description?.trim() || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting alert:', err);
    res.status(500).json({ error: 'Failed to save alert' });
  }
});

router.get('/', async (req, res) => {
try {
    const result = await db.query('SELECT * FROM alerts ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }});

module.exports = router;
