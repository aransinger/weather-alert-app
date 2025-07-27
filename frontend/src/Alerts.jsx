import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_WEATHER_API_URL;

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    parameter: 'temperature',
    threshold: '',
    description: ''
  });

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${API}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const newAlert = await res.json();
    setAlerts(prev => [...prev, newAlert]);

    setForm({ name: '', location: '', parameter: 'temperature', threshold: '', description: '' });
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Alert</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="name" placeholder="Alert name" value={form.name} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <select name="parameter" value={form.parameter} onChange={handleChange}>
          <option value="temperature">Temperature</option>
          <option value="windSpeed">Wind Speed</option>
          <option value="precipitation">Precipitation</option>
        </select>
        <input name="threshold" placeholder="e.g. > 30" value={form.threshold} onChange={handleChange} required />
        <input name="description" placeholder="Optional description" value={form.description} onChange={handleChange} />
        <button type="submit">Create Alert</button>
      </form>

      <h2>All Alerts</h2>
      <ul>
        {alerts.map(alert => (
          <li key={alert.id}>
            <strong>{alert.name || '(no name)'}</strong> — {alert.parameter} {alert.threshold} at {alert.location} → {alert.triggered ? '🚨 Triggered' : '✅ Not Triggered'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Alerts;
