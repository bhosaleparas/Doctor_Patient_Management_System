const Select = ({ label, error, options = [], placeholder, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <select
      className={`
        w-full px-4 py-2.5 rounded-xl border text-sm bg-white
        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
        ${error ? 'border-red-400' : 'border-gray-200'}
        ${className}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default Select;
