import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import TopStats from '../../components/TopStats';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState([]);
  const [superuserBalance, setSuperuserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sum, grp, bal, suBalRes] = await Promise.all([
        api.get('/superuser/public-groups/summary/'),
        api.get('/superuser/public-groups/'),
        api.get('/account/all_accounts/'),
        api.get('/superuser/balance/'),
      ]);

      setSummary(sum.data);
      setGroups(grp.data);
      setBalances(bal.data);

      setSuperuserBalance(Number(suBalRes.data.balance || 0));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <Card className="p-6 flex justify-center">
        <Spinner />
      </Card>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Natna Equb - Admin
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchData}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <TopStats
        summary={summary}
        groups={groups}
        balances={balances}
        superuserBalance={superuserBalance}
      />
    </div>
  );
}
