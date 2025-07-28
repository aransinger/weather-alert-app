import { useState } from 'react';

const API = import.meta.env.VITE_WEATHER_API_URL;

function AlertForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '',
    location: '',
    parameter: 'temperature',
    operator: '>',
    value: '',
    description: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { operator, value, ...rest } = form;
    const threshold = `${operator} ${value}`;

    const res = await fetch(`${API}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, threshold }),
    });

    const newAlert = await res.json();
    onAdd(newAlert);

    setForm({
      name: '',
      location: '',
      parameter: 'temperature',
      operator: '>',
      value: '',
      description: ''
    });
  }

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        const res = await fetch(`${API}/weather?location=${lat},${lon}`);
        const data = await res.json();
        const resolved = data.resolvedAddress || data.location || `${lat.toFixed(4)},${lon.toFixed(4)}`;
        setForm(prev => ({ ...prev, location: resolved }));
      } catch (err) {
        console.error('Failed to get city name:', err);
        setForm(prev => ({ ...prev, location: `${lat},${lon}` }));
      }
    }, (err) => {
      alert('Failed to get location: ' + err.message);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
      <input
        name="name"
        placeholder="Alert name"
        value={form.name}
        onChange={handleChange}
        required
        className="p-2 border border-gray-300 rounded"
      />

      <div className="flex gap-2 items-center">
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          title="Use your location"
        >
          📍 My Location
        </button>
      </div>

      <select
        name="parameter"
        value={form.parameter}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="temperature">Temperature</option>
        <option value="windSpeed">Wind Speed</option>
        <option value="precipitation">Precipitation</option>
      </select>

      <div className="flex gap-2 items-center">
        <select
          name="operator"
          value={form.operator}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value=">=">&ge;</option>
          <option value="<=">&le;</option>
          <option value="==">=</option>
        </select>
        <input
          name="value"
          type="number"
          step="any"
          placeholder="Threshold value"
          value={form.value}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <input
        name="description"
        placeholder="Optional description"
        value={form.description}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded"
      />

      <button
        type="submit"
        className="bg-[#0066FF] text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Alert
      </button>
    </form>
  );
}

export default AlertForm;
