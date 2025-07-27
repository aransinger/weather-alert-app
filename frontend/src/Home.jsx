import { useEffect, useState } from 'react';

function Home() {
  const [location, setLocation] = useState('Tel Aviv-Yafo');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/weather?location=${encodeURIComponent(location)}`)
      .then(res => {
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
      })
      .then(setWeather)
      .catch(err => setError(err.message));
  }, [location]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Current Weather</h2>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weather ? (
        <ul>
          <li><strong>Temperature:</strong> {weather.temperature}°C</li>
          <li><strong>Wind Speed:</strong> {weather.windSpeed} km/h</li>
          <li><strong>Precipitation:</strong> {weather.precipitation} mm/h</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
