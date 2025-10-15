import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from './Spinner';

export default function More() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/');
        const userData = res.data.user;

        const createdEqubs = res.data.groups.filter(
          (g) => g.created_by?.id === userData.id
        ).length;

        const joinedEqubs = res.data.memberships.filter(
          (m) =>
            m.group?.created_by?.id !== undefined &&
            m.group.created_by.id !== userData.id
        ).length;

        setUser({
          ...userData,
          createdEqubs,
          joinedEqubs,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen p-4 space-y-6 max-w-md mx-auto">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6 text-center">
        <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p>{user.email}</p>
        </div>
        <div className="flex justify-around mt-4 border-t border-gray-200 pt-4">
          <div>
            <p className="text-lg font-semibold">{user.createdEqubs}</p>
            <p>Created Equbs</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{user.joinedEqubs}</p>
            <p>Joined Equbs</p>
          </div>
        </div>
      </div>

      {/* Account Balance */}
      <Link
        to="/home/more/balance"
        className="block bg-white shadow-md rounded-xl p-4 text-center hover:bg-gray-100 transition font-medium"
      >
        💰 Account Balance
      </Link>

      {/* App Guide */}
      <Link
        to="/guide"
        className="block bg-white shadow-md rounded-xl p-4 text-center hover:bg-gray-100 transition font-medium"
      >
        📖 How to use this app
      </Link>

      {/* Contact Us */}
      <a
        href="mailto:natnaequb@gmail.com"
        className="block bg-white shadow-md rounded-xl p-4 text-center hover:bg-gray-100 transition font-medium no-underline"
      >
        <p className="font-medium ">Contact Us</p>
      </a>

      {/* Logout */}
      <Link
        to="/logout"
        className="block bg-red-50 text-red-600 shadow-md rounded-xl p-4 text-center hover:bg-red-500 hover:text-white transition font-medium"
      >
        Logout
      </Link>
    </div>
  );
}
