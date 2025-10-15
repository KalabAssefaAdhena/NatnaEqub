import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function JoinGroup() {
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!groupCode.trim()) {
      setMessage('Please enter or select a group code.');
      return;
    }

    try {
      await api.post('/join-requests/request_join/', {
        group_code: groupCode.trim(),
      });

      setMessage(`Join request sent successfully for group ${groupCode}`);
      setGroupCode('');

      const myReqsRes = await api.get('/join-requests/my_requests/');
      setMyRequests([...myReqsRes.data].reverse() || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Error sending join request');
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/join-requests/my_requests/');
        setMyRequests([...res.data].reverse() || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Page title */}
      <h2 className="text-xl font-semibold text-[var(--color-primary)] text-center">
        Join a Group
      </h2>

      {/* Input section */}
      <Card className="space-y-4 p-4 flex flex-col items-center">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter group code:
          </label>
          <Input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="E.g. E10002"
          />
        </div>

        <Button variant="primary" onClick={handleJoin}>
          Send Join Request
        </Button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.toLowerCase().includes('error')
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </Card>

      {/* My requests */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-[var(--color-primary)] mb-3">
          My Join Requests
        </h3>
        {myRequests.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No join requests yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {myRequests.map((req) => (
              <li
                key={req.id}
                className="flex justify-between bg-white border rounded-lg px-3 py-2 text-sm shadow-sm"
              >
                <span>
                  Group: <strong>{req.group.name}</strong>
                </span>
                <span
                  className={`${
                    req.status === 'pending'
                      ? 'text-yellow-600'
                      : req.status === 'approved'
                      ? 'text-green-600'
                      : 'text-red-600'
                  } font-medium`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
