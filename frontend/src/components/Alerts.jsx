import { useEffect, useState } from 'react';
import AlertForm from './AlertForm';
import AlertCard from './AlertCard';

const API = import.meta.env.VITE_WEATHER_API_URL;

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  function addAlert(alert) {
    setAlerts(prev => [...prev, alert]);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#0066FF] mb-4">Create New Alert</h2>
      <AlertForm onAdd={addAlert} />

      <h2 className="text-xl font-semibold text-[#0066FF] mb-4">All Alerts</h2>
      <ul className="space-y-4">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </ul>
    </div>
  );
}

export default Alerts;
