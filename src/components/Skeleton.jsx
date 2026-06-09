/**
 * Skeleton Component - Loading state placeholder
 * Provides high-fidelity structural loading indicators
 */
export function Skeleton({ height = 'h-4', width = 'w-full', className = '' }) {
  return (
    <div
      className={`${height} ${width} ${className} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
    />
  );
}

/**
 * SkeletonTable Component - Loading state for table rows
 * Displays multiple skeleton rows to match table structure
 */
export function SkeletonTable({ rows = 5, columns = 6 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-200 dark:border-gray-700"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <Skeleton height="h-4" width="w-24" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
