import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
import BalancesList from '../../components/BalancesList';

export default function Balances() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await api.get('/account/all_accounts/');
      setBalances(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          All Balances
        </h1>
        <button
          onClick={fetchBalances}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <Card className="p-6 flex justify-center">
          <Spinner />
        </Card>
      ) : (
        <BalancesList balances={balances} />
      )}
    </div>
  );
}
