const express = require('express');
const { getWeather } = require('../services/weatherService');

const router = express.Router();

router.get('/', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: 'location is required' });

  try {
    const data = await getWeather(location);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
