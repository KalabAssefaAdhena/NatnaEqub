import { useEffect, useState } from 'react';
import api from '../api/axios';
import EqubGroupCard from '../components/EqubGroupCard';
import Spinner from './Spinner';

export default function PublicEqubs() {
  const [publicGroups, setPublicGroups] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupsRes, requestsRes, dashboardRes] = await Promise.all([
          api.get('/groups/public_groups_all/'),
          api.get('/join-requests/my_requests/'),
          api.get('/dashboard/'),
        ]);

        setPublicGroups([...groupsRes.data].reverse() || []);
        setMyRequests(requestsRes.data || []);
        setMyMemberships(dashboardRes.data.groups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoin = async (groupCode) => {
    try {
      const res = await api.post('/join-requests/request_join/', {
        group_code: groupCode,
      });
      setMessage(res.data.detail || 'Join request sent');

      const myReqsRes = await api.get('/join-requests/my_requests/');
      setMyRequests(myReqsRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Error sending join request');
    }
  };

  const getRequestForGroup = (groupId) =>
    myRequests.find((r) => r.group.id === groupId);

  const isMember = (groupId) => myMemberships.some((g) => g.id === groupId);

  return (
    <div className="w-full max-w-md mx-auto px-2 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
        Public Equbs
      </h2>

      {message && (
        <p className="text-center text-green-600 font-medium">{message}</p>
      )}

      {loading ? (
        <Spinner />
      ) : publicGroups.length === 0 ? (
        <p className="text-center">No public equbs available.</p>
      ) : (
        publicGroups.map((group) => (
          <EqubGroupCard
            key={group.id}
            group={group}
            joined={isMember(group.id)}
            request={getRequestForGroup(group.id)}
            onJoin={handleJoin}
            clickable={isMember(group.id)}
          />
        ))
      )}
    </div>
  );
}
