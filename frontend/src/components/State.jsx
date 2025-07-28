import { useEffect, useState } from "react";
import PageCard from "./PageCard";

const API = import.meta.env.VITE_WEATHER_API_URL;

function State() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.filter((a) => a.triggered));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load alerts:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PageCard title="Current Alert State">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : alerts.length === 0 ? (
        <p className="text-green-600 font-medium text-lg">✅ All Clear</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded shadow-sm"
            >
              <div className="text-lg font-semibold text-red-800">
                🚨 {alert.name || "(Unnamed Alert)"}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                {alert.parameter} {alert.threshold} at{" "}
                <strong>{alert.location}</strong>
                {alert.description && (
                  <div className="italic text-gray-500 mt-1">
                    {alert.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageCard>
  );
}

export default State;
