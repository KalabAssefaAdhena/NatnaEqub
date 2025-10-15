// src/components/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Outlet, NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function DashboardLayout() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/');
        setBalance(res.data.account?.balance || 0);
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { name: 'My Equb', path: '/home/my-equb' },
    { name: 'Public Equb', path: '/home/public-equb' },
    { name: 'Invitations', path: '/home/invitations' },
    { name: 'More', path: '/home/more' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="flex justify-between items-center px-4 py-3 w-full max-w-md mx-auto">
          <Link to="/home/my-equb" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Natna Equb Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-[var(--color-primary)]">
              Natna Equb
            </span>
          </Link>
          <Link
            to="/home/more/balance"
            className="text-primary px-3 py-1 rounded text-sm hover:bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main content wrapper */}
      <main className="flex-1 mt-22 mb-20 px-4 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <Outlet context={{ user, balance, loading }} />
        </div>
      </main>

      {/* Footer Tabs */}
      <footer className="fixed bottom-0 left-0 right-0 rounded-full py-3 shadow-t bg-white">
        <div className="flex justify-around px-4 w-full max-w-md mx-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 flex items-center justify-center rounded-full font-medium text-sm text-center transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-primary)]'
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </footer>
    </div>
  );
}
