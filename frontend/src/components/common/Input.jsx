const Input = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      className={`
        w-full px-4 py-2.5 rounded-xl border text-sm
        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default Input;
