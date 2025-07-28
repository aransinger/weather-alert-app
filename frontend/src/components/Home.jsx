import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_WEATHER_API_URL;

function Home() {
  const [location, setLocation] = useState('Tel Aviv-Yafo');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/weather?location=${encodeURIComponent(location)}`)
      .then(res => {
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
      })
      .then(setWeather)
      .catch(err => setError(err.message));
  }, [location]);

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#0066FF] mb-4">Current Weather</h2>

      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
      />

      {error && !weather && (
        <p className="text-red-500">⚠️ {error}. Please try again later.</p>
      )}

      {weather ? (
        <ul className="space-y-2 text-gray-800">
          <li><span className="font-medium">🌡️ Temperature:</span> {weather.temperature}°C</li>
          <li><span className="font-medium">💨 Wind Speed:</span> {weather.windSpeed} km/h</li>
          <li><span className="font-medium">🌧️ Precipitation:</span> {weather.precipitation} mm/h</li>
        </ul>
      ) : !error ? (
        <p className="text-gray-500">Loading...</p>
      ) : null}
    </div>
  );
}

export default Home;
