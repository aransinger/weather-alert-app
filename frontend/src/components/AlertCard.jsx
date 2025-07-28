function AlertCard({ alert, onDelete }) {
  return (
    <li
      className={`p-4 border-l-4 rounded shadow ${
        alert.triggered ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-lg">
            {alert.triggered ? '🚨 ' : '✅ '}
            {alert.name || '(No Name)'}
          </div>
          <div className="text-sm text-gray-700">
            {alert.parameter} {alert.threshold} at <strong>{alert.location}</strong><br />
            {alert.description && (
              <div className="italic text-gray-500 mt-1">{alert.description}</div>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(alert.id)}
          className="ml-4 text-red-500 hover:text-red-700 hover:opacity-80 text-2xl cursor-pointer">
          ✖️
        </button>
      </div>
    </li>
  );
}

export default AlertCard;
