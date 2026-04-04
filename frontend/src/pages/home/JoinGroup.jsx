// src/pages/JoinGroup.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../../components/Input"; // ✅ use your styled Input
import Button from "../../components/Button"; // ✅ use your styled Button
import Card from "../../components/Card"; // optional, for layout consistency
import {
  HiOutlineKey,
  HiOutlinePaperAirplane,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import Alert from "../../components/Alert";

export default function JoinGroup() {
  const [groupCode, setGroupCode] = useState("");
  const [message, setMessage] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [messageType, setMessageType] = useState("info");

  const handleJoin = async () => {
    if (!groupCode.trim()) {
      setMessage("Please enter or select a group code.");
      setMessageType("error");
      return;
    }

    try {
      await api.post("/join-requests/request_join/", {
        group_code: groupCode.trim(),
      });

      setMessage(`Join request sent successfully for group ${groupCode}`);
      setMessageType("success");
      setGroupCode("");

      // Refresh requests after successful join
      const myReqsRes = await api.get("/join-requests/my_requests/");
      setMyRequests([...myReqsRes.data].reverse() || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Error sending join request");
      setMessageType("error");
    }
  };

  // Load user's current join requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/join-requests/my_requests/");
        setMyRequests([...res.data].reverse() || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary)]">
          Join a Group
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Enter a group code to send a join request
        </p>
      </div>

      {/* Join Form */}
      <Card className="p-5 sm:p-6 space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <HiOutlineKey className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200" />
            Group Code
          </label>

          <Input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="E.g. E10002"
          />
        </div>
        {message && (
          <div className="w-full mb-4">
            <Alert
              type={messageType} // "error" | "success" | "info"
              message={message}
              onClose={() => setMessage("")}
            />
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2"
        >
          <HiOutlinePaperAirplane className="w-4 h-4" />
          Send Join Request
        </Button>
      </Card>

      {/* Requests */}
      <Card className="p-5 sm:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <h3 className="text-lg sm:text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
          <HiOutlineClipboardDocumentList className="w-5 h-5" />
          My Join Requests
        </h3>

        {myRequests.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No join requests yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {myRequests.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-sm transition"
              >
                {/* Group Name */}
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  Group:{" "}
                  <strong className="text-[var(--color-primary)]">
                    {req.group.name}
                  </strong>
                </span>

                {/* Status Badge */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : req.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
