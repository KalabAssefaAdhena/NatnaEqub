// src/components/DashboardLayout.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";

export default function DashboardLayout() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // DARK MODE
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/");
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
    { name: "My Equb", path: "/home/my-equb" },
    { name: "Public Equb", path: "/home/public-equb" },
    { name: "Invitations", path: "/home/invitations" },
    { name: "More", path: "/home/more" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 shadow-md z-10">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 w-full max-w-screen-xl mx-auto">
          {/* LOGO */}
          <Link to="/home/my-equb" className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="logo" className="h-8 sm:h-9 w-auto" />
            <span className="font-bold text-base sm:text-lg text-[var(--color-primary)] dark:text-white truncate">
              Natna Equb
            </span>
          </Link>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* BALANCE BUTTON */}
            <Link
              to="/home/more/balance"
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700  transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                />
              </svg>
            </Link>

            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              {dark ? (
                <IoIosSunny className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <FaMoon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 mt-20 mb-20 sm:mb-24 px-3 sm:px-4">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mx-auto max-w-screen-xl">
          <Outlet context={{ user, balance, loading }} />
        </div>
      </main>

      {/* FOOTER NAV */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 shadow-lg z-10">
        <div className="flex justify-between sm:justify-center sm:gap-6 items-center px-2 sm:px-4 py-2 w-full max-w-screen-md mx-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={() =>
                `flex-1 min-w-[70px] text-center px-2 py-2 rounded-xl text-[10px] sm:text-sm font-medium transition ${
                  isActive(tab.path)
                    ? "bg-[var(--color-primary)] !text-white shadow-md"
                    : "text-[var(--color-primary)] hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`
              }
            >
              <span className="block truncate">{tab.name}</span>
            </NavLink>
          ))}
        </div>
      </footer>
    </div>
  );
}
