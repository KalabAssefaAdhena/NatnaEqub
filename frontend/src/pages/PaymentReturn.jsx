import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const txRef = searchParams.get('tx_ref');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/payments/transaction-status/?tx_ref=${txRef}`
        );
        setData(res.data);
      } catch (err) {
        console.error('Error fetching transaction:', err);
      } finally {
        setLoading(false);
      }
    };
    if (txRef) fetchData();
  }, [txRef]);

  if (loading)
    return <p className="text-center mt-10">Loading transaction...</p>;
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-red-600 text-2xl mb-2">⚠️ Transaction Unknown</h1>
          <p>No record found for this transaction.</p>
          <Link
            to="home/more/balance"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Return
          </Link>
        </div>
      </div>
    );

  const { type, status, tx_ref, amount, first_name, last_name } = data;
  const isPaid = status === 'PAID';
  const isFailed = status === 'FAILED';
  const isPending = status === 'PENDING';

  const statusClass = isPaid
    ? 'text-green-600'
    : isFailed
    ? 'text-red-600'
    : 'text-yellow-500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-[360px]">
        {type === 'payment' ? (
          <p>
            <strong>Payer:</strong> {first_name} {last_name}
          </p>
        ) : (
          <p>
            <strong>Receiver:</strong> {first_name} {last_name}
          </p>
        )}

        {isPaid && (
          <h1 className={`${statusClass} text-2xl font-semibold mt-2`}>
            {type === 'payment'
              ? '✅ Payment Successful'
              : '💸 Withdrawal Successful'}
          </h1>
        )}
        {isFailed && (
          <h1 className={`${statusClass} text-2xl font-semibold mt-2`}>
            {type === 'payment' ? '❌ Payment Failed' : '❌ Withdrawal Failed'}
          </h1>
        )}
        {isPending && (
          <h1 className={`${statusClass} text-2xl font-semibold mt-2`}>
            {type === 'payment'
              ? '⏳ Payment Pending'
              : '⏳ Withdrawal Pending'}
          </h1>
        )}

        <p className="text-gray-600 text-sm mt-3">Transaction Ref: {tx_ref}</p>
        <p className="font-bold text-lg mt-2">{amount} ETB</p>

        <Link
          to="/home/more/balance"
          className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return
        </Link>
      </div>
    </div>
  );
}
