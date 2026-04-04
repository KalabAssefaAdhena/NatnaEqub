// src/components/Alert.jsx
import React from "react";

export default function Alert({ type = "info", message, onClose }) {
  const styles = {
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    success:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    error:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  return (
    <div
      className={`w-full flex items-start justify-between gap-3 p-3 rounded-lg border shadow-sm ${styles[type]}`}
    >
      {/* MESSAGE */}
      <p className="text-sm sm:text-base leading-relaxed flex-1">
        {message}
      </p>

      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold leading-none opacity-70 hover:opacity-100 transition"
        >
          ×
        </button>
      )}
    </div>
  );
}