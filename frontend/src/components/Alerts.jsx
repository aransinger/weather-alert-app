import { useEffect, useState } from "react";
const API = import.meta.env.VITE_WEATHER_API_URL;

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    parameter: "temperature",
    operator: ">",
    value: "",
    description: "",
  });

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then((res) => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(`${API}/weather?location=${lat},${lon}`);
          const data = await res.json();

          // Use the original coordinates as fallback
          const name = `${lat.toFixed(4)},${lon.toFixed(4)}`;

          // If response includes a resolved name/location, prefer it
          const resolved = data.resolvedAddress || data.location || name;

          setForm((prev) => ({ ...prev, location: resolved }));
        } catch (err) {
          console.error("Failed to get city name:", err);
          setForm((prev) => ({ ...prev, location: `${lat},${lon}` }));
        }
      },
      (err) => {
        alert("Failed to get location: " + err.message);
      }
    );
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    const { operator, value, ...rest } = form;
    const threshold = `${operator} ${value}`;

    const res = await fetch(`${API}/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, threshold }),
    });

    const newAlert = await res.json();
    setAlerts((prev) => [...prev, newAlert]);

    setForm({
      name: "",
      location: "",
      parameter: "temperature",
      operator: ">",
      value: "",
      description: "",
    });
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#0066FF] mb-4">
        Create New Alert
      </h2>

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

      <h2 className="text-xl font-semibold text-[#0066FF] mb-4">All Alerts</h2>
      <ul className="space-y-4">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`p-4 border-l-4 rounded shadow ${
              alert.triggered
                ? "border-red-500 bg-red-50"
                : "border-green-500 bg-green-50"
            }`}
          >
            <div className="font-semibold text-lg">
              {alert.name || "(No Name)"}
            </div>
            <div className="text-sm text-gray-700">
              {alert.parameter} {alert.threshold} at{" "}
              <strong>{alert.location}</strong>
              <br />
              {alert.description && (
                <span className="block italic text-gray-500 mt-1">
                  {alert.description}
                </span>
              )}
              <span className="block mt-2">
                Status: {alert.triggered ? "🚨 Triggered" : "✅ Not Triggered"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Alerts;
