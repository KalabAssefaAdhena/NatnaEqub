import { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import Card from "../../components/Card";
import BalancesList from "../../components/BalancesList";

export default function Balances() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await api.get("/account/all_accounts/");
      setBalances(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] dark:text-white text-center sm:text-left">
          All Balances
        </h1>

        <button
          onClick={fetchBalances}
          className="
          px-4 py-2 rounded-lg border 
          border-gray-300 dark:border-neutral-700
          text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-neutral-800
          transition
        "
        >
          Refresh
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div
          className="
          bg-white dark:bg-neutral-900
          border border-gray-200 dark:border-neutral-800
          rounded-2xl shadow-sm p-10 flex justify-center items-center
        "
        >
          <Spinner />
        </div>
      ) : (
        <div
          className="
          bg-white dark:bg-neutral-900
          border border-gray-200 dark:border-neutral-800
          rounded-2xl shadow-sm p-4 sm:p-6
          transition
        "
        >
          <BalancesList balances={balances} />
        </div>
      )}
    </div>
  );
}
