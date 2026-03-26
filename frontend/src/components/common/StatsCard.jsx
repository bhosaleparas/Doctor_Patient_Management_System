const StatsCard = ({ title, value, icon, color = 'blue', sub }) => {
  const colorMap = {
    blue  : 'bg-blue-50 text-blue-600',
    green : 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red   : 'bg-red-50 text-red-600',
    teal  : 'bg-teal-50 text-teal-600',
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
