import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

export default function ManageGroup() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [alert, setAlert] = useState(null); // { type, message }

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // ✅ FIXED: wrap with useCallback to solve dependency warning
  const fetchDetails = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}/details/`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [groupId]);

  const fetchJoinRequests = useCallback(async () => {
    try {
      const res = await api.get("/join-requests/requests_to_my_groups/");
      const gid = Number(groupId);
      const filtered = (res.data || []).filter(
        (r) => Number(r.group?.id) === gid,
      );
      setJoinRequests(filtered);
    } catch (err) {
      console.error("fetchJoinRequests error", err);
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;

    (async () => {
      setLoading(true);
      await Promise.all([fetchDetails(), fetchJoinRequests()]);
      setLoading(false);
    })();
  }, [groupId, fetchDetails, fetchJoinRequests]);

  const handleApproveDecline = async (reqId, actionType) => {
    try {
      await api.patch(`/join-requests/${reqId}/${actionType}/`);
      await fetchJoinRequests();
      await fetchDetails();
      showAlert("success", `Request ${actionType}d successfully`);
    } catch (err) {
      console.error(err);
      showAlert("error", "Action failed");
    }
  };

  const handleRotate = async () => {
    if (!group) return;

    setRotating(true);
    try {
      const res = await api.post(`/groups/${groupId}/rotate/`);
      const data = res.data;

      const cycleNum = data.cycle - 1;
      const winnerName = data.winner?.username || "Unknown";

      showAlert(
        "success",
        data.is_finished
          ? `Rotation ended. Last winner: ${winnerName}`
          : `Cycle ${cycleNum} winner: ${winnerName}`,
      );

      await fetchDetails();
    } catch (err) {
      console.error(err);

      const missing = err.response?.data?.missing;
      if (missing) {
        showAlert("error", `Missing contributions: ${missing.join(", ")}`);
      } else {
        showAlert("error", err.response?.data?.detail || "Error rotating");
      }
    } finally {
      setRotating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-6">
        <Spinner />
      </div>
    );

  if (!group) return <p className="text-center">Group not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* ALERT */}
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm px-3 py-1 rounded-md border 
                   border-gray-300 dark:border-neutral-700 
                   hover:bg-gray-100 dark:hover:bg-neutral-800 
                   transition"
      >
        ← Back
      </button>

      {/* GROUP HEADER */}
      <div
        className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border 
                      border-gray-200 dark:border-neutral-800"
      >
        <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-white">
          {group.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {group.description}
        </p>

        <button
          onClick={handleRotate}
          disabled={rotating || group.is_finished}
          className={`mt-4 px-5 py-2 rounded-lg text-white font-medium transition
            ${
              group.is_finished
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--color-primary)] hover:opacity-90"
            }`}
        >
          {rotating
            ? "Rotating..."
            : group.is_finished
              ? "Rotation Ended"
              : "Rotate"}
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* MEMBERS */}
        <div
          className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border 
                        border-gray-200 dark:border-neutral-800"
        >
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Members
          </h4>

          <ul className="text-sm divide-y divide-gray-200 dark:divide-neutral-700">
            {group.memberships?.map((m) => (
              <li key={m.id} className="py-2 flex justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {m.user.username}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total: {m.total_contributed}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* PAYOUTS */}
        <div
          className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border 
                        border-gray-200 dark:border-neutral-800"
        >
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Payouts
          </h4>

          <ul className="text-sm divide-y divide-gray-200 dark:divide-neutral-700">
            {group.payouts?.map((p) => (
              <li key={p.id} className="py-2 text-gray-700 dark:text-gray-300">
                Cycle {p.cycle_number}: {p.recipient.username} — ETB {p.amount}
              </li>
            ))}
          </ul>
        </div>

        {/* JOIN REQUESTS */}
        <div
          className="md:col-span-2 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border 
                        border-gray-200 dark:border-neutral-800"
        >
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Pending Join Requests
          </h4>

          {joinRequests.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No requests
            </p>
          ) : (
            <ul className="space-y-2">
              {joinRequests.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center 
                             justify-between gap-3 p-3 border rounded-xl
                             border-gray-200 dark:border-neutral-700
                             bg-gray-50 dark:bg-neutral-800"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {r.user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {r.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApproveDecline(r.id, "approve")}
                          className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:opacity-90"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveDecline(r.id, "decline")}
                          className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:opacity-90"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {r.status}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
