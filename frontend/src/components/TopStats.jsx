import React from 'react';

export default function TopStats({
  summary = {},
  groups = [],
  balances = [],
  superuserBalance = 0,
}) {
  const totalHeld = balances.reduce(
    (acc, b) => acc + Number(b.balance || 0),
    0
  );

  const card = (label, value, highlight = false) => (
    <div
      className={`rounded-xl p-4 shadow-md bg-white ${
        highlight ? 'border-l-4 border-[var(--color-primary)]' : ''
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-2xl font-semibold mt-1 ${
          highlight ? 'text-[var(--color-primary)]' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {card('Public Equbs', summary?.total_public_groups ?? groups.length)}
      {card('User-created Equbs', summary?.total_user_created_equb ?? '-')}
      {card('Total Held in System', `ETB ${totalHeld.toFixed(2)}`)}
      {card('Superuser Balance', `ETB ${superuserBalance.toFixed(2)}`, true)}
    </div>
  );
}
