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

  router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("DELETE FROM alerts WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete alert:", err);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

module.exports = router;
