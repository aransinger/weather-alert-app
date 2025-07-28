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

  async function deleteAlert(id) {
    try {
      const res = await fetch(`${API}/alerts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#0066FF] mb-4">Create New Alert</h2>
      <AlertForm onAdd={addAlert} />

      <h2 className="text-xl font-semibold text-[#0066FF] mb-4">All Alerts</h2>
      <ul className="space-y-4">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} onDelete={deleteAlert} />
        ))}
      </ul>
    </div>
  );
}

export default Alerts;
