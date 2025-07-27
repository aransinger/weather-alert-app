const axios = require('axios');

async function getWeather(location) {
    const url = 'https://api.tomorrow.io/v4/weather/realtime';

  const response = await axios.get(url, {
    params: {
      location,
      apikey: process.env.TOMORROW_API_KEY
    }
  });

  const values = response.data.data.values;
  return {
    temperature: values.temperature,
    windSpeed: values.windSpeed,
    precipitation: values.precipitationIntensity || 0
  };
}

module.exports = { getWeather };
