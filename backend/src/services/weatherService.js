const axios = require('axios');

const cache = new Map();
const queue = [];
let processing = false;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processQueue() {
  if (processing || queue.length === 0) return;

  processing = true;

  while (queue.length > 0) {
    const { location, resolve, reject } = queue.shift();

    try {
      const url = 'https://api.tomorrow.io/v4/weather/realtime';
      const response = await axios.get(url, {
        params: {
          location,
          apikey: process.env.TOMORROW_API_KEY
        }
      });

      const values = response.data.data.values;
      const weather = {
        temperature: values.temperature,
        windSpeed: values.windSpeed,
        precipitation: values.precipitationIntensity || 0
      };

      cache.set(location, { timestamp: Date.now(), data: weather });
      resolve(weather);
    } catch (err) {
      reject(err);
    }

    await delay(350); // ~3/sec max
  }

  processing = false;
}

async function getWeather(location) {
  const key = location.toLowerCase().trim();

  if (cache.has(key)) {
    const { timestamp, data } = cache.get(key);
    if (Date.now() - timestamp < 60_000) return data;
  }

  return new Promise((resolve, reject) => {
    queue.push({ location, resolve, reject });
    processQueue();
  });
}

module.exports = { getWeather };
