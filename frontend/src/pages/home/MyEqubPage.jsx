export default function MyEqubPage() {
  return <MyEqub />;
}

import { useEffect, useState } from "react";
import api from "../../api/axios";
import EqubGroupCard from "../../components/EqubGroupCard";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

export function MyEqub() {
  const [subTab, setSubTab] = useState("joined");
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/");
        setMyGroups(res.data.groups || []);
        setUserId(res.data.user?.id || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const joinedEqubs = myGroups.filter((g) => g.created_by?.id !== userId);
  const createdEqubs = myGroups.filter((g) => g.created_by?.id === userId);

  return (
    <div className="w-full max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6">
      <div className="flex border-b border-neutral-300 dark:border-neutral-700 mb-4">
        <button
          onClick={() => setSubTab("joined")}
          className={`flex-1 py-2 text-center cursor-pointer font-medium transition-colors ${
            subTab === "joined"
              ? "border-b-2 border-[var(--color-primary)] dark:border-white text-[var(--color-primary)] dark:text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Joined Equbs
        </button>
        <button
          onClick={() => setSubTab("created")}
          className={`flex-1 py-2 text-center cursor-pointer font-medium transition-colors ${
            subTab === "created"
              ? "border-b-2 border-[var(--color-primary)] dark:border-white text-[var(--color-primary)] dark:text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Created Equbs
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {subTab === "joined" && (
            <div className="space-y-4">
              <Link
                to="/home/join-group"
                className="block text-center w-full sm:w-[80%] md:w-[60%] mx-auto px-4 py-4 rounded-full font-medium text-sm transition-colors bg-white dark:bg-neutral-800 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white dark:hover:bg-[var(--color-primary)] dark:hover:text-white shadow"
              >
                🔗 Join Equb
              </Link>

              {joinedEqubs.length === 0 && (
                <p className="text-center text-neutral-500 dark:text-neutral-400">
                  No joined equbs yet
                </p>
              )}

              {[...joinedEqubs].reverse().map((g) => (
                <EqubGroupCard
                  key={g.id}
                  group={g}
                  joined={true}
                  clickable={true}
                  className="w-full"
                />
              ))}
            </div>
          )}

          {subTab === "created" && (
            <div className="space-y-4">
              <Link
                to="/home/create-group"
                className="block text-center w-full sm:w-[80%] md:w-[60%] mx-auto px-4 py-4 rounded-full font-medium text-sm transition-colors bg-white dark:bg-neutral-800 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white dark:hover:bg-[var(--color-primary)] dark:hover:text-white shadow"
              >
                ➕ Create Equb
              </Link>

              {createdEqubs.length === 0 && (
                <p className="text-center text-neutral-500 dark:text-neutral-400">
                  No created equbs yet
                </p>
              )}

              {[...createdEqubs].reverse().map((g) => (
                <EqubGroupCard
                  key={g.id}
                  group={g}
                  clickable={true}
                  className="w-full"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
