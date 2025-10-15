import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    showJoinedBadge || (request && request.status === 'approved');

  return (
    <div
      onClick={handleClick}
      className={`rounded-2xl overflow-hidden shadow-lg mb-4 transition-transform duration-200 ${
        clickable ? 'cursor-pointer hover:scale-[1.01]' : 'cursor-default'
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start bg-yellow-400 p-4 sm:p-5">
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-white">
            {group.name}
          </h3>
          <p className="text-white text-sm opacity-90">Code: {group.code}</p>
        </div>
        <span className="px-2 py-1 rounded-full text-xs sm:text-sm font-semibold bg-white text-[var(--color-primary)]">
          {group.created_by?.is_superuser ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-green-500 text-white p-3 sm:p-4 text-xs sm:text-sm font-medium text-center">
        <div className="flex flex-col items-center">
          <p className="font-semibold">Contribution</p>
          <p>ETB {group.contribution_amount}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-semibold">Members</p>
          <p>
            {group.members_count} / {group.max_members}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-semibold">Cycle Days</p>
          <p>{group.cycle_days}</p>
        </div>

        {/*  Service Fee */}
        <div className="flex flex-col items-center">
          <p className="font-semibold">Service Fee</p>
          <p>{group.service_fee_percentage}%</p>
        </div>
      </div>

      {/* Footer: Actions */}
      {(showJoinedBadge || request || onJoin) && (
        <div className="bg-white p-3 sm:p-4 text-sm font-medium border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-center sm:text-left">
            {!isJoined && request && (
              <span>
                Request:{' '}
                <strong>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </strong>
              </span>
            )}

            {!isJoined && !request && onJoin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(group.code);
                }}
                className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-blue-800 transition-colors"
              >
                Send Join Request
              </button>
            )}
          </div>

          {isJoined && (
            <span className="text-green-600 font-semibold text-sm">
              ✅ Joined
            </span>
          )}
        </div>
      )}
    </div>
  );
}
