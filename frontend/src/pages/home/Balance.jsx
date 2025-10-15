// src/pages/Balance.jsx
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useOutletContext } from 'react-router-dom';
import Spinner from '../../components/Spinner';

export default function Balance() {
  const { user } = useOutletContext();
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/account/me/');
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;
    setActionLoading(true);
    try {
      const res = await api.post('/payments/chapa/initiate/', {
        amount: Number(depositAmount),
      });
      // Redirect to Chapa checkout
      window.location.href = res.data.checkout_url;
    } catch (err) {
      console.error('Deposit failed', err);
      alert(err.response?.data?.detail || 'Deposit failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    if (!accountNumber || !bankCode) {
      alert('Please enter account number and bank code');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/payments/withdraw/initiate/', {
        amount: Number(withdrawAmount),
        account_number: accountNumber,
        bank_code: bankCode,
      });

      if (res.data?.tx_ref) {
        // Call the unified webhook
        await api.post('/payments/chapa/webhook/', {
          tx_ref: res.data.tx_ref,
          status: 'success',
        });

        // Fetch the updated withdrawal status
        const withdrawalRes = await api.get(
          `/payments/transaction-status/?tx_ref=${res.data.tx_ref}`
        );

        // Redirect to return page with latest status
        window.location.href = `/payments/return/?tx_ref=${res.data.tx_ref}&status=${withdrawalRes.data.status}`;
      }
    } catch (err) {
      console.error('Withdraw failed', err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          'Withdraw failed'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto space-y-6">
      {/* Current Balance */}
      <div className="bg-white shadow-md rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
        <p className="text-3xl font-bold text-[var(--color-primary)]">
          ETB {balance}
        </p>
      </div>

      {/* Deposit Section */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h3 className="font-semibold mb-2">Deposit</h3>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button
          onClick={handleDeposit}
          disabled={actionLoading}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded font-medium hover:bg-blue-800 disabled:opacity-50"
        >
          Deposit
        </button>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h3 className="font-semibold mb-2">Withdraw</h3>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Account Number"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bank Code"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
        />
        <button
          onClick={handleWithdraw}
          disabled={actionLoading}
          className="w-full bg-secondary text-white py-2 rounded font-medium hover:bg-amber-700 disabled:opacity-50"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}
