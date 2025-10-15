import React from 'react';

export default function BalancesList({ balances = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
        User Balances
      </h3>

      {balances.length === 0 ? (
        <p className="text-gray-500">No data</p>
      ) : (
        <ul className="divide-y">
          {balances.map((b) => (
            <li key={b.user_id} className="py-3 flex justify-between">
              <span className="font-medium">{b.username}</span>
              <span className="text-gray-700">ETB {b.balance}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
