import React from 'react';
import Button from './Button';

export default function InvitationCard({
  invitation,
  onAction,
  type = 'received',
}) {
  const isPending = invitation.status === 'pending';

  return (
    <div className="p-4 rounded-lg shadow-sm border border-gray-200 bg-white space-y-2">
      {type === 'request' ? (
        <p>
          User: <strong>{invitation.user.username}</strong> wants to join{' '}
          <strong>{invitation.group.name}</strong>
        </p>
      ) : (
        <p>
          Group: <strong>{invitation.group.name}</strong>{' '}
          {type === 'sent' && '→ ' + invitation.user.username}
        </p>
      )}

      <p>
        Status:{' '}
        <strong
          className={
            invitation.status === 'approved'
              ? 'text-green-600'
              : invitation.status === 'declined'
              ? 'text-red-600'
              : 'text-gray-700'
          }
        >
          {invitation.status.charAt(0).toUpperCase() +
            invitation.status.slice(1)}
        </strong>
      </p>

      {isPending && onAction && (
        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => onAction(invitation.id, 'approve')}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            Approve
          </Button>
          <Button
            onClick={() => onAction(invitation.id, 'decline')}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
