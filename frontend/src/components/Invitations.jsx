import { useEffect, useState } from 'react';
import api from '../api/axios';
import InvitationCard from '../components/InvitationCard';
import Button from '../components/Button';
import Spinner from './Spinner';
import Alert from './Alert';

export default function Invitations() {
  const [subTab, setSubTab] = useState('received');
  const [mainSubTab, setMainSubTab] = useState('receivedInvites');
  const [alert, setAlert] = useState(null);
  const [invitations, setInvitations] = useState({
    received: [],
    sent: [],
    my_requests: [],
  });
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteGroupId, setInviteGroupId] = useState('');
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/');
        const uid = res.data.user?.id || null;

        setMyGroups(res.data.groups.filter((g) => g.created_by?.id === uid));

        const invitationsRes = await api.get('/join-requests/');
        setInvitations({
          received: [...invitationsRes.data.received].reverse() || [],
          sent: [...invitationsRes.data.sent].reverse() || [],
          my_requests: [...invitationsRes.data.my_requests].reverse() || [],
        });

        const joinReqRes = await api.get(
          '/join-requests/requests_to_my_groups/'
        );
        setJoinRequests([...joinReqRes.data].reverse() || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleInvite = async () => {
    if (!inviteUsername || !inviteGroupId) {
      showAlert('error', 'Please select a group and enter a username');
      return;
    }

    try {
      await api.post('/join-requests/invite/', {
        username: inviteUsername,
        group_id: inviteGroupId,
      });

      showAlert('success', 'Invitation sent!');
      setInviteUsername('');
      setInviteGroupId('');

      const res = await api.get('/join-requests/');
      setInvitations(res.data);
    } catch (err) {
      console.error(err);
      showAlert(
        'error',
        err.response?.data?.detail || 'Error sending invitation'
      );
    }
  };

  const handleApproveDecline = async (id, actionType, isRequest = false) => {
    try {
      await api.patch(`/join-requests/${id}/${actionType}/`);
      if (isRequest) {
        setJoinRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: actionType === 'approve' ? 'approved' : 'declined',
                }
              : r
          )
        );
      } else {
        setInvitations((prev) => ({
          ...prev,
          received: prev.received.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: actionType === 'approve' ? 'approved' : 'declined',
                }
              : r
          ),
        }));
      }
    } catch (err) {
      console.error(err);
      showAlert(
        'error',
        `Error ${actionType === 'approve' ? 'approving' : 'declining'}`
      );
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-6 relative">
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Page Title */}
      <h2 className="text-xl font-semibold text-[var(--color-primary)] text-center">
        Invitations
      </h2>

      {/* Sub Tabs: Received / Sent */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setSubTab('received')}
          className={`flex-1 py-2 text-center cursor-pointer font-medium ${
            subTab === 'received'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-gray-500'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setSubTab('sent')}
          className={`flex-1 py-2 text-center cursor-pointer font-medium ${
            subTab === 'sent'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-gray-500'
          }`}
        >
          Sent
        </button>
      </div>

      {/* Received Invitations */}
      {subTab === 'received' && (
        <div className="space-y-4">
          {/* Main Sub Tabs */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setMainSubTab('receivedInvites')}
              className={`flex-1 py-2 text-center font-medium cursor-pointer rounded-lg ${
                mainSubTab === 'receivedInvites'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Invitations to Me
            </button>
            <button
              onClick={() => setMainSubTab('joinRequests')}
              className={`flex-1 py-2 text-center font-medium cursor-pointer rounded-lg ${
                mainSubTab === 'joinRequests'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Requests to My Groups
            </button>
          </div>

          {/* List Cards */}
          {mainSubTab === 'receivedInvites' &&
            (invitations.received.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No received invitations
              </p>
            ) : (
              invitations.received.map((inv) => (
                <InvitationCard
                  key={inv.id}
                  invitation={inv}
                  type="received"
                  onAction={handleApproveDecline}
                />
              ))
            ))}

          {mainSubTab === 'joinRequests' &&
            (joinRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No requests to your groups
              </p>
            ) : (
              joinRequests.map((req) => (
                <InvitationCard
                  key={req.id}
                  invitation={req}
                  type="request"
                  onAction={(id, actionType) =>
                    handleApproveDecline(id, actionType, true)
                  }
                />
              ))
            ))}
        </div>
      )}

      {/* Sent Invitations */}
      {subTab === 'sent' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-3">
            <h3 className="font-semibold text-gray-700 text-center">
              Invite a User
            </h3>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                placeholder="Enter username"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <select
                value={inviteGroupId}
                onChange={(e) => setInviteGroupId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">Select a group</option>
                {myGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleInvite}
                className="w-full bg-[var(--color-primary)] hover:bg-blue-700"
              >
                Invite
              </Button>
            </div>
          </div>

          {invitations.sent.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No sent invitations
            </p>
          ) : (
            invitations.sent.map((inv) => (
              <InvitationCard key={inv.id} invitation={inv} type="sent" />
            ))
          )}
        </div>
      )}
    </div>
  );
}
