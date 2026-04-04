// src/pages/Balance.jsx
import { useState, useEffect } from "react";
import api from "../../api/axios";
// import { useOutletContext } from 'react-router-dom';
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

export default function Balance() {
  // const { user } = useOutletContext();
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await api.get("/account/me/");
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setMessage("Enter a valid amount");
      setMessageType("error");
      return;
    }

    setActionLoading(true);
    setMessage("");

    try {
      const res = await api.post("/payments/chapa/initiate/", {
        amount: Number(depositAmount),
      });

      if (res.data.status === "success") {
        setMessage("Payment successful");
        setMessageType("success");

        setDepositAmount("");
        fetchBalance();
      } else {
        setMessage(res.data.message || "Payment failed");
        setMessageType("error");
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Deposit failed");
      setMessageType("error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setMessage("Enter a valid amount");
      setMessageType("error");
      return;
    }

    if (!accountNumber || !bankCode) {
      setMessage("Please enter account number and bank code");
      setMessageType("error");
      return;
    }

    setActionLoading(true);
    setMessage("");

    try {
      const res = await api.post("/payments/withdraw/initiate/", {
        amount: Number(withdrawAmount),
        account_number: accountNumber,
        bank_code: bankCode,
      });

      if (res.data.status === "success") {
        setMessage("Withdrawal successful");
        setMessageType("success");

        setWithdrawAmount("");
        setAccountNumber("");
        setBankCode("");

        fetchBalance();
      } else {
        setMessage(res.data.message || "Withdrawal failed");
        setMessageType("error");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Withdraw failed",
      );
      setMessageType("error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 py-6 space-y-6">
      {message && (
        <div className="w-full max-w-md mx-auto mb-4">
          <Alert
            type={messageType}
            message={message}
            onClose={() => setMessage("")}
          />
        </div>
      )}
      {/* Current Balance */}
      <div className="bg-white dark:bg-neutral-800 shadow-md rounded-2xl p-6 text-center border border-gray-200 dark:border-neutral-700 space-y-2">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Current Balance
        </h2>

        <p className="text-3xl font-bold text-[var(--color-primary)]">
          ETB {balance}
        </p>
      </div>

      {/* Deposit Section */}
      <div className="bg-white dark:bg-neutral-800 shadow-md rounded-2xl p-6 space-y-4 border border-gray-200 dark:border-neutral-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Deposit
        </h3>

        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />

        <button
          onClick={handleDeposit}
          disabled={actionLoading}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          Deposit
        </button>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white dark:bg-neutral-800 shadow-md rounded-2xl p-6 space-y-4 border border-gray-200 dark:border-neutral-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Withdraw
        </h3>

        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Account Number"
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <input
          type="text"
          placeholder="Bank Code"
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
        />

        <button
          onClick={handleWithdraw}
          disabled={actionLoading}
          className="w-full bg-[var(--color-secondary)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}
