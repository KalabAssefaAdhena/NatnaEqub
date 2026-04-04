import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaBookReader } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineContactPhone, MdOutlineEmail } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function MorePage() {
  return <More />;
}

function More() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/");
        const userData = res.data.user;

        const createdEqubs = res.data.groups.filter(
          (g) => g.created_by?.id === userData.id,
        ).length;

        const joinedEqubs = res.data.memberships.filter(
          (m) =>
            m.group?.created_by?.id !== undefined &&
            m.group.created_by.id !== userData.id,
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
    <div className="min-h-screen w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-neutral-800 shadow-md rounded-2xl p-6 space-y-6 text-center border border-gray-200 dark:border-neutral-700">
        {/* Avatar */}
        <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {user.username}
          </h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-4 border-t border-gray-200 dark:border-neutral-700 pt-4">
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {user.createdEqubs}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created Equbs
            </p>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {user.joinedEqubs}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined Equbs
            </p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-4">
        {/* Balance */}
        <Link
          to="/home/more/balance"
          className="flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 shadow-md rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-neutral-700 transition border border-gray-200 dark:border-neutral-700"
        >
          <AiOutlineDollarCircle className="text-2xl text-[var(--color-primary)] dark:text-white" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Account Balance
          </span>
        </Link>

        {/* Guide */}
        <Link
          to="/home/guide"
          className="flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 shadow-md rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-neutral-700 transition border border-gray-200 dark:border-neutral-700"
        >
          <HiOutlineBookOpen  className="text-2xl text-[var(--color-primary)]  dark:text-white" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            How to use this app
          </span>
        </Link>

        {/* Contact */}
        <a
          href="mailto:natnaequb@gmail.com"
          className="flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 shadow-md rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-neutral-700 transition border border-gray-200 dark:border-neutral-700"
        >
          <MdOutlineEmail  className="text-2xl text-[var(--color-primary)] dark:text-white" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Contact Us
          </span>
        </a>

        {/* Logout */}
        <Link
          to="/logout"
          className="flex items-center justify-center gap-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-md rounded-xl p-4 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition font-medium"
        >
          <IoIosLogOut className="text-2xl text-[var(--color-primary)] dark:text-white" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}
