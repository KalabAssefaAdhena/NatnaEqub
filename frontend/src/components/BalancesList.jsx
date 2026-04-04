import React from "react";

export default function BalancesList({ balances = [] }) {
  return (
    <div
      className="
        rounded-2xl shadow-sm border p-4 sm:p-6
        bg-white dark:bg-neutral-900
        border-gray-200 dark:border-neutral-800
        transition
      "
    >
      {/* HEADER */}
      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-primary)] dark:text-white mb-4">
        User Balances
      </h3>

      {/* EMPTY STATE */}
      {balances.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No data</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
          {balances.map((b) => (
            <li
              key={b.user_id}
              className="
                py-3 flex items-center justify-between
                hover:bg-gray-50 dark:hover:bg-neutral-800
                px-2 rounded-lg transition
              "
            >
              {/* USER */}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {b.username}
              </span>

              {/* BALANCE */}
              <span
                className="
                  font-semibold
                  text-[var(--color-primary)]
                  dark:text-gray-200
                "
              >
                ETB {Number(b.balance).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
