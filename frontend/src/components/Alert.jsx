// src/components/Alert.jsx
import React from 'react';

export default function Alert({ type = 'info', message, onClose }) {
  const colors = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div
      className={`p-3 rounded-md shadow-sm ${colors[type]} flex justify-between items-center`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 font-bold text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
