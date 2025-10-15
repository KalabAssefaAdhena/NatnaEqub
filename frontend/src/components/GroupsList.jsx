import React from 'react';

export default function GroupsList({ groups = [], openManage = () => {} }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">
          My Public Groups
        </h3>
      </div>

      {groups.length === 0 ? (
        <p className="text-gray-500">No public groups</p>
      ) : (
        <ul className="space-y-3">
          {[...groups].reverse().map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-gray-500">
                  Contribution: {g.contribution_amount} • Max: {g.max_members}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openManage(g.id)}
                  className="px-3 py-1 rounded-md bg-[var(--color-primary)] text-white text-sm hover:bg-blue-800"
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
