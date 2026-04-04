import React from "react";

export default function TopStats({
  summary = {},
  groups = [],
  balances = [],
  superuserBalance = 0,
}) {
  const totalHeld = balances.reduce(
    (acc, b) => acc + Number(b.balance || 0),
    0,
  );

  const cards = [
    {
      label: "Public Equbs",
      value: summary?.total_public_groups ?? groups.length,
    },
    {
      label: "User-created Equbs",
      value: summary?.total_user_created_equb ?? "-",
    },
    {
      label: "Total Held in System",
      value: `ETB ${totalHeld.toFixed(2)}`,
    },
    {
      label: "Superuser Balance",
      value: `ETB ${superuserBalance.toFixed(2)}`,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item, index) => (
        <div
          key={index}
          className={`
            relative rounded-2xl p-5 shadow-sm border transition 
            bg-white dark:bg-neutral-800 
            border-gray-200 dark:border-neutral-700
            hover:shadow-md hover:-translate-y-1
            duration-200
          `}
        >
          {/* Label */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.label}
          </p>

          {/* Value */}
          <p
            className={`
              text-xl sm:text-2xl font-bold mt-2
            `}
          >
            {item.value}
          </p>

       
        </div>
      ))}
    </div>
  );
}
