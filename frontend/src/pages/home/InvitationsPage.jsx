import { useEffect, useState } from "react";
import api from "../../api/axios";
import InvitationCard from "../../components/InvitationCard";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

export default function InvitationsPage() {
  return <Invitations />;
}

function Invitations() {
  const [subTab, setSubTab] = useState("received"); // 'received' or 'sent'
  const [mainSubTab, setMainSubTab] = useState("receivedInvites");
  const [alert, setAlert] = useState(null);
  const [invitations, setInvitations] = useState({
    received: [],
    sent: [],
    my_requests: [],
  });
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteGroupId, setInviteGroupId] = useState("");
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/");
        const uid = res.data.user?.id || null;

        setMyGroups(res.data.groups.filter((g) => g.created_by?.id === uid));

        const invitationsRes = await api.get("/join-requests/");
        setInvitations({
          received: [...invitationsRes.data.received].reverse() || [],
          sent: [...invitationsRes.data.sent].reverse() || [],
          my_requests: [...invitationsRes.data.my_requests].reverse() || [],
        });

        const joinReqRes = await api.get(
          "/join-requests/requests_to_my_groups/",
        );
        setJoinRequests([...joinReqRes.data].reverse() || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to show alert
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000); // hide after 3s
  };

  const handleInvite = async () => {
    if (!inviteUsername || !inviteGroupId) {
      showAlert("error", "Please select a group and enter a username");
      return;
    }

    try {
      await api.post("/join-requests/invite/", {
        username: inviteUsername,
        group_id: inviteGroupId,
      });

      showAlert("success", "Invitation sent!");
      setInviteUsername("");
      setInviteGroupId("");

      const res = await api.get("/join-requests/");
      setInvitations(res.data);
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        err.response?.data?.detail || "Error sending invitation",
      );
    }
  };

  const handleApproveDecline = async (id, actionType, isRequest = false) => {
    try {
      await api.patch(`/join-requests/${id}/${actionType}/`);
      if (isRequest) {
        setJoinRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: actionType === "approve" ? "approved" : "declined",
                }
              : r,
          ),
        );
      } else {
        setInvitations((prev) => ({
          ...prev,
          received: prev.received.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: actionType === "approve" ? "approved" : "declined",
                }
              : r,
          ),
        }));
      }
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        `Error ${actionType === "approve" ? "approving" : "declining"}`,
      );
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 space-y-6 relative">
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Page Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)] text-center">
        Invitations
      </h2>

      {/* Sub Tabs */}
      <div className="flex border-b border-gray-300 dark:border-neutral-700">
        <button
          onClick={() => setSubTab("received")}
          className={`flex-1 py-2 text-center font-medium ${
            subTab === "received"
              ? "border-b-2 border-[var(--color-primary)] dark:border-white text-[var(--color-primary)] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Received
        </button>

        <button
          onClick={() => setSubTab("sent")}
          className={`flex-1 py-2 text-center font-medium ${
            subTab === "sent"
              ? "border-b-2 border-[var(--color-primary)] dark:border-white text-[var(--color-primary)] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Sent
        </button>
      </div>

      {/* RECEIVED */}
      {subTab === "received" && (
        <div className="space-y-6">
          {/* Inner Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setMainSubTab("receivedInvites")}
              className={`flex-1 py-2 text-center font-medium rounded-lg ${
                mainSubTab === "receivedInvites"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Invitations to Me
            </button>

            <button
              onClick={() => setMainSubTab("joinRequests")}
              className={`flex-1 py-2 text-center font-medium rounded-lg ${
                mainSubTab === "joinRequests"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Requests to My Groups
            </button>
          </div>

          {/* Lists */}
          <div className="space-y-4 ">
            {mainSubTab === "receivedInvites" &&
              (invitations.received.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                  No received invitations
                </p>
              ) : (
                invitations.received.map((inv) => (
                  <InvitationCard
                    key={inv.id}
                    invitation={inv}
                    type="received"
                    onAction={handleApproveDecline}
                  />
                ))
              ))}

            {mainSubTab === "joinRequests" &&
              (joinRequests.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                  No requests to your groups
                </p>
              ) : (
                joinRequests.map((req) => (
                  <InvitationCard
                    key={req.id}
                    invitation={req}
                    type="request"
                    onAction={(id, actionType) =>
                      handleApproveDecline(id, actionType, true)
                    }
                  />
                ))
              ))}
          </div>
        </div>
      )}

      {/* SENT */}
      {subTab === "sent" && (
        <div className="space-y-6">
          {/* Invite Form */}
          <div className="p-4 sm:p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 space-y-4 max-w-xl mx-auto w-full">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-center">
              Invite a User
            </h3>

            <div className="flex flex-col gap-3 w-full">
              <input
                type="text"
                placeholder="Enter username"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />

              <select
                value={inviteGroupId}
                onChange={(e) => setInviteGroupId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">Select a group</option>
                {myGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleInvite}
                className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Invite
              </Button>
            </div>
          </div>

          {/* Sent list */}
          <div className="space-y-4">
            {invitations.sent.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                No sent invitations
              </p>
            ) : (
              invitations.sent.map((inv) => (
                <InvitationCard key={inv.id} invitation={inv} type="sent" />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
