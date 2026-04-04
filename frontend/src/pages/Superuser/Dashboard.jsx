import { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import TopStats from "../../components/TopStats";
import Card from "../../components/Card";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState([]);
  const [superuserBalance, setSuperuserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
 

 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sum, grp, bal, suBalRes] = await Promise.all([
        api.get("/superuser/public-groups/summary/"),
        api.get("/superuser/public-groups/"),
        api.get("/account/all_accounts/"),
        api.get("/superuser/balance/"), // <-- new call
      ]);

      setSummary(sum.data);
      setGroups(grp.data);
      setBalances(bal.data);

      // Use dedicated superuser endpoint
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] dark:text-white text-center sm:text-left">
          Natna Equb - Admin
        </h1>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 
                     text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-neutral-800 
                     transition"
          >
            Refresh
          </button>

          
        </div>
      </div>

      {/* STATS CARD WRAPPER */}
      <div
        className="bg-white dark:bg-neutral-900 
                    border border-gray-200 dark:border-neutral-800 
                    rounded-2xl shadow-sm p-4 sm:p-6 transition"
      >
        <TopStats
          summary={summary}
          groups={groups}
          balances={balances}
          superuserBalance={superuserBalance}
        />
      </div>
    </div>
  );
}
