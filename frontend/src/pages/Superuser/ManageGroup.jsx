import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function ManageGroup() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      setLoading(true);
      await Promise.all([fetchDetails(), fetchJoinRequests()]);
      setLoading(false);
    })();
  }, [groupId]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/details/`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const res = await api.get('/join-requests/requests_to_my_groups/');
      const gid = Number(groupId);
      const filtered = (res.data || []).filter(
        (r) => Number(r.group?.id) === gid
      );
      setJoinRequests(filtered);
    } catch (err) {
      console.error('fetchJoinRequests error', err);
    }
  };

  const handleApproveDecline = async (reqId, actionType) => {
    try {
      await api.patch(`/join-requests/${reqId}/${actionType}/`);
      await fetchJoinRequests();
      await fetchDetails();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  const handleRotate = async () => {
    if (!group) return;
    setRotating(true);
    setMessage('');
    try {
      const res = await api.post(`/groups/${groupId}/rotate/`);
      const data = res.data;
      const cycleNum = data.cycle - 1;
      const winnerName = data.winner?.username || 'Unknown';

      setMessage(
        data.is_finished
          ? `Rotation ended. Last winner: ${winnerName}`
          : `Cycle ${cycleNum} winner: ${winnerName}`
      );
      await fetchDetails();
    } catch (err) {
      const missing = err.response?.data?.missing;
      if (missing) setMessage(`Missing contributions: ${missing.join(', ')}`);
      else setMessage(err.response?.data?.detail || 'Error rotating');
      console.error(err);
    } finally {
      setRotating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-6">
        <Spinner />
      </div>
    );

  if (!group) return <p>Group not found</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>

      <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
        {group.name}
      </h2>
      <p className="text-gray-600 mb-4">{group.description}</p>

      <div className="mb-4">
        <button
          onClick={handleRotate}
          disabled={rotating || group.is_finished}
          className={`px-4 py-2 rounded text-white ${
            group.is_finished
              ? 'bg-gray-400'
              : 'bg-[var(--color-primary)] hover:bg-blue-800'
          }`}
        >
          {rotating
            ? 'Rotating...'
            : group.is_finished
            ? 'Rotation Ended'
            : 'Rotate'}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Members</h4>
          <ul className="text-sm divide-y">
            {group.memberships?.map((m) => (
              <li key={m.id} className="py-2 flex justify-between">
                <div>
                  <div className="font-medium">{m.user.username}</div>
                  <div className="text-xs text-gray-500">
                    Total: {m.total_contributed}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-2">Payouts</h4>
          <ul className="text-sm divide-y">
            {group.payouts?.map((p) => (
              <li key={p.id} className="py-2">
                Cycle {p.cycle_number}: {p.recipient.username} — ETB {p.amount}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Pending Join Requests</h4>
          {joinRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No requests</p>
          ) : (
            <ul className="space-y-2">
              {joinRequests.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{r.user.username}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {r.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveDecline(r.id, 'approve')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveDecline(r.id, 'decline')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-600">{r.status}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
