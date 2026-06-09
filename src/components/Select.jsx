/**
 * Select Component - Reusable dropdown input field
 * Supports labels, options, and accessibility features
 */
export function Select({
  label,
  id,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 dark:text-gray-50 mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
