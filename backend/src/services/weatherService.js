const axios = require('axios');

const cache = new Map();

async function getWeather(location) {
  const key = location.toLowerCase().trim();

  if (cache.has(key)) {
    const { timestamp, data } = cache.get(key);
    if (Date.now() - timestamp < 60_000) {
      return data;
    }
  }

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

  cache.set(key, { timestamp: Date.now(), data: weather });
  return weather;
}

module.exports = { getWeather };
