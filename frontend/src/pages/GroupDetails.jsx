import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import WheelModal from '../components/WheelModal';

export default function GroupDetails() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [userContributed, setUserContributed] = useState(false);
  const [totalContributions, setTotalContributions] = useState(0);
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rotating, setRotating] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const wheelShownRef = useRef(false);

  const [showWheel, setShowWheel] = useState(false);
  const [winnerUsername, setWinnerUsername] = useState('');

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/dashboard/');
      setCurrentUserId(res.data.user.id);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  };

  const fetchGroupDetails = async () => {
    try {
      const res = await api.get(`/groups/${id}/details/`);
      const data = res.data;
      setGroup(data);
      setTotalContributions(data.total_contributions || 0);

      const currentUserMembership = (data.memberships || []).find(
        (m) => m.user && m.user.id === currentUserId
      );
      setUserContributed(
        Boolean(
          currentUserMembership &&
            currentUserMembership.total_contributed >= data.contribution_amount
        )
      );

      setIsCreator(currentUserId === data.created_by_id);
    } catch (err) {
      console.error('Error fetching group details:', err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCurrentUser();
    })();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    fetchGroupDetails();
  }, [currentUserId, id]);

  const handleContribute = async () => {
    if (!group || userContributed) {
      setMessage('You already contributed for this cycle!');
      return;
    }
    try {
      await api.post('/contributions/', { group: id });
      setMessage('✅ Contribution successful!');
      fetchGroupDetails();
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Error contributing');
    }
  };

  const handleRotate = async () => {
    if (!group || !isCreator) return;
    setMessage('');
    setRotating(true);
    try {
      const res = await api.post(`/groups/${id}/rotate/`);
      const winner =
        res.data.winner?.username ||
        res.data.group?.latest_winner?.username ||
        '';

      if (winner) {
        wheelShownRef.current = true;
        setWinnerUsername(winner);
        setShowWheel(true);
      } else {
        setMessage('Rotation started but no winner returned.');
      }

      fetchGroupDetails();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const missing = err.response?.data?.missing;
      if (missing)
        setMessage(`${detail} Missing contributions: ${missing.join(', ')}`);
      else setMessage(detail || 'Error rotating');
    } finally {
      setRotating(false);
    }
  };

  const handleWheelFinished = async (winner) => {
    setShowWheel(false);
    setMessage(`🏆 Winner: ${winner}`);
    wheelShownRef.current = false;

    if (!isCreator) {
      await fetchGroupDetails();
      return;
    }

    try {
      await api.post(`/groups/${id}/reset_rotation_flag/`);
    } catch (err) {
      console.error('Error resetting rotation flag:', err);
    }

    fetchGroupDetails();
  };

  if (!group) return <Spinner />;
  const rotationEnded = group.is_finished;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-[var(--color-primary)] text-center">
        {group.name}
      </h2>
      <p className="text-center text-gray-600">{group.description}</p>

      <Card className="p-4 space-y-3">
        <p>
          💰 <strong>Contribution Amount:</strong> ETB{' '}
          {group.contribution_amount}
        </p>
        <p>
          🔁 <strong>Cycle Days:</strong> {group.cycle_days}
        </p>
        <p>
          📅 <strong>Current Cycle:</strong> {group.current_cycle}
        </p>
        <p>
          <strong>Service Fee:</strong> {group.service_fee_percentage}%
        </p>
        <div onClick={fetchGroupDetails}>
          <p className="text-sm font-medium text-center text-gray-700 cursor-pointer pb-1">
            💵 <strong>Total Amount:</strong> {totalContributions}/
            {group.memberships?.length * group.contribution_amount} ETB
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  (totalContributions /
                    (group.memberships?.length * group.contribution_amount)) *
                    100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!rotationEnded ? (
          <Button
            variant="primary"
            onClick={handleContribute}
            disabled={userContributed}
            className="flex-1"
          >
            {userContributed ? '✅ Already Contributed' : '💸 Contribute'}
          </Button>
        ) : (
          <Button
            disabled
            variant="primary"
            className="flex-1 bg-gray-400 text-white"
          >
            Rotation Ended
          </Button>
        )}

        {isCreator && (
          <Button
            onClick={handleRotate}
            disabled={rotating || rotationEnded}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {rotationEnded
              ? 'Rotation Ended'
              : rotating
              ? 'Rotating...'
              : '🔄 Rotate'}
          </Button>
        )}
      </div>

      {message && (
        <p
          className={`text-center text-sm font-medium ${
            message.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}

      <Card className="p-4">
        <h3 className="text-lg font-medium text-[var(--color-primary)] mb-2">
          Members ({group.memberships?.length}/{group.max_members})
        </h3>
        <ul className="space-y-2 text-sm">
          {group.memberships?.map((m) => (
            <li
              key={m.id}
              className="flex justify-between bg-white border rounded-lg px-3 py-2 shadow-sm"
            >
              <span>{m.user.username}</span>
              <span className="text-gray-600">ETB {m.total_contributed}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium text-[var(--color-primary)] mb-2">
          Payout History
        </h3>
        {group.payouts?.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {group.payouts.map((p) => (
              <li
                key={p.id}
                className="flex justify-between bg-white border rounded-lg px-3 py-2 shadow-sm"
              >
                <span>
                  Cycle {p.cycle_number}: {p.recipient.username}
                </span>
                <span className="font-medium text-[var(--color-primary)]">
                  ETB {p.amount}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm text-center">No payouts yet.</p>
        )}
      </Card>

      {showWheel && (
        <WheelModal
          members={group.memberships}
          winnerUsername={winnerUsername}
          onClose={() => setShowWheel(false)}
          onFinished={handleWheelFinished}
        />
      )}
    </div>
  );
}
