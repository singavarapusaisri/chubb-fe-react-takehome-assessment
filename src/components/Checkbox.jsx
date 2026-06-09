/**
 * Checkbox Component - Reusable checkbox input
 * Provides accessible checkboxes with labels and aria attributes
 */
export function Checkbox({
  id,
  label,
  checked,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-50 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
}
