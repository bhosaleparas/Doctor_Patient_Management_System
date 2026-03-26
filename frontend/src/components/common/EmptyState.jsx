const EmptyState = ({ icon = '📭', title = 'Nothing here', message = '' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
    <span className="text-5xl">{icon}</span>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    {message && <p className="text-sm text-gray-400 max-w-xs">{message}</p>}
  </div>
);

export default EmptyState;
