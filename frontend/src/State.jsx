import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_WEATHER_API_URL;

function State() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then(res => res.json())
      .then(data => {
        setAlerts(data.filter(a => a.triggered));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load alerts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Current Alert State</h2>
      {loading ? (
        <p>Loading...</p>
      ) : alerts.length === 0 ? (
        <p>✅ All Clear</p>
      ) : (
        <ul>
          {alerts.map(alert => (
            <li key={alert.id}>
              🚨 <strong>{alert.name || '(unnamed)'}</strong> — {alert.parameter} {alert.threshold} at {alert.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default State;
