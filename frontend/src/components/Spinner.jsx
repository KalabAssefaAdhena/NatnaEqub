// src/components/Spinner.jsx
export default function Spinner({ size = 40, color = 'primary' }) {
  const colorClass =
    color === 'primary'
      ? 'border-blue-600'
      : color === 'white'
      ? 'border-white'
      : `border-${color}-600`;

  return (
    <div className="flex justify-center items-center py-1">
      <div
        className={`border-4 border-t-transparent ${colorClass} rounded-full animate-spin`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
    </div>
  );
}
