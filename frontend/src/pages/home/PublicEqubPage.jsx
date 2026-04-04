import { useEffect, useState } from "react";
import api from "../../api/axios";
import EqubGroupCard from "../../components/EqubGroupCard";
import Spinner from "../../components/Spinner";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

export default function PublicEqubPage() {
  return <PublicEqub />;
}

function PublicEqub() {
  const [publicGroups, setPublicGroups] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupsRes, requestsRes, dashboardRes] = await Promise.all([
          api.get("/groups/public_groups_all/"),
          api.get("/join-requests/my_requests/"),
          api.get("/dashboard/"),
        ]);

        setPublicGroups([...groupsRes.data].reverse() || []);
        setMyRequests(requestsRes.data || []);
        setMyMemberships(dashboardRes.data.groups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoin = async (groupCode) => {
    try {
      const res = await api.post("/join-requests/request_join/", {
        group_code: groupCode,
      });
      setMessage(res.data.detail || "Join request sent");

      const myReqsRes = await api.get("/join-requests/my_requests/");
      setMyRequests(myReqsRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Error sending join request");
    }
  };

  const getRequestForGroup = (groupId) =>
    myRequests.find((r) => r.group.id === groupId);

  const isMember = (groupId) => myMemberships.some((g) => g.id === groupId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary)] flex items-center justify-center gap-2">
          <HiOutlineGlobeAlt className="w-6 h-6" />
          Public Equbs
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Discover and join available groups
        </p>
      </div>

      {/* Message */}
      {message && (
        <p className="text-center text-sm font-medium text-green-600 dark:text-green-400">
          {message}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : publicGroups.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No public equbs available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {publicGroups.map((group) => (
            <EqubGroupCard
              key={group.id}
              group={group}
              joined={isMember(group.id)}
              request={getRequestForGroup(group.id)}
              onJoin={handleJoin}
              clickable={isMember(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
