const express = require("express");
const { getWeather } = require("../services/weatherService");
const db = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const key = req.headers['x-api-key'];
  if (key !== process.env.EVALUATE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await db.query("SELECT * FROM alerts");
    const alerts = result.rows;
    const updated = [];
    const triggeredIds = [];
    const clearedIds = [];
    
    // Group alerts by location for better performance and less API calls
    const grouped = new Map();
    for (const alert of alerts) {
      const locationKey = alert.location.trim();
      if (!grouped.has(locationKey)) grouped.set(locationKey, []);
      grouped.get(locationKey).push(alert);
    } 
    
    // Evaluate all alerts for location
    for (const [location, alertsForLocation] of grouped.entries()) {
      let weather;
      try {
        weather = await getWeather(location);
      } catch (err) {
        console.error(`Failed to fetch weather for ${location}:`, err.message);
        continue;
      }
      
      for (const alert of alertsForLocation) {
        const paramValue = parseFloat(weather[alert.parameter]);
        
        const match = alert.threshold.match(/(>=|<=|>|<|==)\s*([\d.]+)/);
        if (!match) continue;

        const [_, operator, valueStr] = match;
        const thresholdValue = parseFloat(valueStr);

        let triggered = false;
        switch (operator) {
          case ">": triggered = paramValue > thresholdValue; break;
          case "<": triggered = paramValue < thresholdValue; break;
          case ">=": triggered = paramValue >= thresholdValue; break;
          case "<=": triggered = paramValue <= thresholdValue; break;
          case "==": triggered = paramValue === thresholdValue; break;
        }

        updated.push({ id: alert.id, triggered });
        if (triggered) {
          triggeredIds.push(alert.id);
        } else {
          clearedIds.push(alert.id);
        }
      }
    }
    if (triggeredIds.length > 0) {
      await db.query(
        'UPDATE alerts SET triggered = TRUE WHERE id = ANY($1::int[])',
        [triggeredIds]
      );
    }
    if (clearedIds.length > 0) {
      await db.query(
        'UPDATE alerts SET triggered = FALSE WHERE id = ANY($1::int[])',
        [clearedIds]
      );
    }
    res.json({ updated });
  } catch (err) {
    console.error('Failed to evaluate alerts:', err);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

module.exports = router;
