import React from "react";

export default function GroupsList({ groups = [], openManage = () => {} }) {
  return (
    <div
      className="rounded-2xl shadow-sm border p-4 sm:p-6
                 bg-white dark:bg-neutral-900
                 border-gray-200 dark:border-neutral-800
                 transition"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-primary)] dark:text-white">
          My Public Groups
        </h3>
      </div>

      {/* EMPTY STATE */}
      {groups.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No public groups
        </p>
      ) : (
        <ul className="space-y-3">
          {[...groups].reverse().map((g) => (
            <li
              key={g.id}
              className="
                flex flex-col sm:flex-row sm:items-center sm:justify-between
                gap-3 sm:gap-0
                border rounded-xl p-4
                bg-gray-50 dark:bg-neutral-800
                border-gray-200 dark:border-neutral-700
                hover:shadow-md hover:-translate-y-0.5
                transition
              "
            >
              {/* INFO */}
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {g.name}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Contribution:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {g.contribution_amount}
                  </span>{" "}
                  • Max:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {g.max_members}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openManage(g.id)}
                  className="
                    px-4 py-1.5 rounded-lg text-sm font-medium
                    bg-[var(--color-primary)] text-white
                    hover:opacity-90 transition
                  "
                >
                  Manage
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
