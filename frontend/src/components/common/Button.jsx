const variants = {
  primary : 'bg-primary-600 hover:bg-primary-700 text-white',
  outline : 'border border-primary-600 text-primary-600 hover:bg-primary-50',
  danger  : 'bg-red-500 hover:bg-red-600 text-white',
  success : 'bg-green-500 hover:bg-green-600 text-white',
  ghost   : 'text-gray-600 hover:bg-gray-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  className= '',
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {loading && (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    {children}
  </button>
);

export default Button;
