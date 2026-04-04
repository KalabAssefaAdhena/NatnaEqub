import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";

export default function SuperuserLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Dark mode (same as PublicLayout)
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

  const linkBase = "flex items-center gap-2 px-3 py-2 rounded-lg transition";

  const activeClass = "bg-[var(--color-primary)] text-white font-semibold";
  const inactiveClass =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800";

  const getClass = ({ isActive }) =>
    `${linkBase} ${isActive ? activeClass : inactiveClass}`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-neutral-900">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800 md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 w-64 bg-white dark:bg-neutral-900
            border-r border-gray-200 dark:border-neutral-800 p-4 flex flex-col gap-2
            transform transition-transform duration-300 z-40
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:relative md:flex
          `}
        >
          {/* Title */}
          <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)] dark:text-white">
            Superuser
          </h2>

          {/* Links */}
          <NavLink
            to="/superuser"
            end
            className={getClass}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/superuser/groups"
            className={getClass}
            onClick={() => setIsOpen(false)}
          >
            Public Groups
          </NavLink>

          <NavLink
            to="/superuser/balances"
            className={getClass}
            onClick={() => setIsOpen(false)}
          >
            User Balances
          </NavLink>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom actions */}
          <button
            onClick={handleLogout}
            className="mt-4 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            Logout
          </button>

          {/* Theme toggle (desktop) */}
          <button
            onClick={() => setDark(!dark)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 mt-2"
          >
            {dark ? <FaSun /> : <FaMoon />}
            <span className="text-sm">Toggle Theme</span>
          </button>
        </aside>

        {/* OVERLAY (mobile) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* CONTENT */}
        <main className="flex-1 p-6 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
