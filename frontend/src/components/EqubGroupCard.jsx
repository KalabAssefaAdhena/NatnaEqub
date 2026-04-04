import React from "react";
import { useNavigate } from "react-router-dom";

export default function EqubGroupCard({
  group,
  request,
  onJoin,
  clickable = false,
  showJoinedBadge = false,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) navigate(`/home/group/${group.id}`);
  };

  const isJoined =
    showJoinedBadge || (request && request.status === "approved");

  return (
    <div
      onClick={handleClick}
      className={`rounded-2xl overflow-hidden shadow-md sm:shadow-lg mb-4 transition-transform duration-200 ${
        clickable ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-yellow-400 dark:bg-yellow-500 p-4 sm:p-5">
        <div className="min-w-0">
          <h3 className="font-bold text-lg sm:text-xl !text-white dark:!text-gray-900 truncate">
            {group.name}
          </h3>
          <p className="text-white dark:text-gray-900 text-xs sm:text-sm opacity-90">
            Code: {group.code}
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white dark:bg-gray-900 text-[var(--color-primary)] dark:text-white">
          {group.created_by?.is_superuser ? "Public" : "Private"}
        </span>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-green-500 dark:bg-green-600 text-white p-3 sm:p-4 text-xs sm:text-sm text-center">
        <div>
          <p className="text-white dark:text-gray-900 font-semibold">
            Contribution
          </p>
          <p className="text-white dark:text-gray-900">
            ETB {group.contribution_amount}
          </p>
        </div>

        <div>
          <p className="text-white dark:text-gray-900 font-semibold">
            Members Joined
          </p>
          <p className="text-white dark:text-gray-900">
            {group.members_count} / {group.max_members}
          </p>
        </div>

        <div>
          <p className="text-white dark:text-gray-900 font-semibold">
            Cycle Days
          </p>
          <p className="text-white dark:text-gray-900">{group.cycle_days}</p>
        </div>

        <div>
          <p className="text-white dark:text-gray-900 font-semibold">
            Service Fee
          </p>
          <p className="text-white dark:text-gray-900">
            {group.service_fee_percentage}%
          </p>
        </div>
      </div>

      {/* FOOTER */}
      {(showJoinedBadge || request || onJoin) && (
        <div className="bg-white dark:bg-neutral-800 p-3 sm:p-4 border-t border-gray-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {/* LEFT SIDE */}
          <div className="w-full flex flex-col gap-2">
            {!isJoined && request && (
              <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
                Request:{" "}
                <strong className="capitalize">{request.status}</strong>
              </span>
            )}

            {!isJoined && !request && onJoin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(group.code);
                }}
                className="w-full px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition"
              >
                Send Join Request
              </button>
            )}
          </div>

          {/* RIGHT SIDE */}
          {isJoined && (
            <span className="text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm text-center sm:text-right">
              ✅ Joined
            </span>
          )}
        </div>
      )}
    </div>
  );
}
