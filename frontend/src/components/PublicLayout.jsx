import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { FaSun, FaMoon, FaHome } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { IoIosSunny, IoMdPersonAdd } from "react-icons/io";

const PublicLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");

    if (storedUserId && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ✅ FIXED ACTIVE LOGIC
  const isActive = (path) => location.pathname === path;

  // BASE STYLE
  const linkBase = "px-3 py-1.5 rounded-md transition duration-200";

  const getLinkClass = (path) =>
    `${linkBase} ${
      isActive(path)
        ? "text-[var(--color-primary)] bg-[var(--color-primary)] !text-white font-semibold"
        : "hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-[var(--color-primary)]"
    }`;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm border-b border-gray-200 dark:border-neutral-800">
        <div className="container flex items-center justify-between py-3">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-8 sm:h-9 w-auto" />
            <span className="font-bold text-base sm:text-lg text-[var(--color-primary)] dark:text-white">
              Natna Equb
            </span>
          </Link>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className={getLinkClass("/")}>
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg">
                <FaHome className="text-lg" />
                <span className="text-sm font-medium">Home</span>
              </span>
            </Link>

            {isLoggedIn ? (
              <>
                <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                  {userName}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={getLinkClass("/login")}>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-lg">
                    <IoLogIn className="text-lg" />
                    <span className="text-sm font-medium">Login</span>
                  </span>
                </Link>

                <Link to="/register" className={getLinkClass("/register")}>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-lg">
                    <IoMdPersonAdd className="text-lg" />
                    <span className="text-sm font-medium">Register</span>
                  </span>
                </Link>
              </>
            )}

            {/* THEME */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-neutral-900 px-4 py-4 flex flex-col gap-2 border-t border-gray-200 dark:border-neutral-800">
            <Link to="/" className={getLinkClass("/")}>
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg">
                <FaHome className="text-lg" />
                <span className="text-sm font-medium">Home</span>
              </span>
            </Link>

            {isLoggedIn ? (
              <>
                <span className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                  {userName}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={getLinkClass("/login")}>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-lg">
                    <IoLogIn className="text-lg" />
                    <span className="text-sm font-medium">Login</span>
                  </span>
                </Link>

                <Link to="/register" className={getLinkClass("/register")}>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-lg">
                    <IoMdPersonAdd className="text-lg" />
                    <span className="text-sm font-medium">Register</span>
                  </span>
                </Link>
              </>
            )}

            <button
              onClick={() => setDark(!dark)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              {dark ? (
                <IoIosSunny className="text-lg" />
              ) : (
                <FaMoon className="text-lg" />
              )}
              <span className="text-sm font-medium">Toggle Theme</span>
            </button>
          </div>
        )}
      </nav>

      {/* PAGE */}
      <main className="flex-1 container py-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white">
        © {new Date().getFullYear()} Equb App. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLayout;
