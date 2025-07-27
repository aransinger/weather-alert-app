const express = require("express");
const { getWeather } = require("../services/weatherService");
const db = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM alerts");
    const alerts = result.rows;
    const updated = [];
    
    // Group alerts by location for better performance and less API calls
    const grouped = new Map();
    for (const alert of alerts) {
      const key = alert.location;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(alert);
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

        await db.query("UPDATE alerts SET triggered = $1 WHERE id = $2", 
          [triggered,alert.id]
        );

        updated.push({ id: alert.id, triggered });
      }
    }

    res.json({ updated });
  } catch (err) {
    console.error('Failed to evaluate alerts:', err);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

module.exports = router;
