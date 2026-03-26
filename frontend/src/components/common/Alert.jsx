const types = {
  error  : 'bg-red-50 text-red-700 border border-red-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  info   : 'bg-blue-50 text-blue-700 border border-blue-200',
  warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
};

const icons = {
  error  : '⚠️',
  success: '✅',
  info   : 'ℹ️',
  warning: '⚡',
};

const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${types[type]}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
