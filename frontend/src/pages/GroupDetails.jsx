import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import WheelModal from "../components/WheelModal";
import { AiOutlineDollarCircle } from "react-icons/ai";
import {
  HiArrowPath,
  HiOutlineCurrencyDollar,
  HiOutlineReceiptPercent,
} from "react-icons/hi2";

import { FaHandHoldingDollar } from "react-icons/fa6";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaSyncAlt } from "react-icons/fa";
import Alert from "../components/Alert";

export default function GroupDetails() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [userContributed, setUserContributed] = useState(false);
  const [totalContributions, setTotalContributions] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rotating, setRotating] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const wheelShownRef = useRef(false);

  const [showWheel, setShowWheel] = useState(false);
  const [winnerUsername, setWinnerUsername] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/dashboard/");
      setCurrentUserId(res.data.user.id);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  };

  const fetchGroupDetails = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${id}/details/`);
      const data = res.data;
      setGroup(data);
      setTotalContributions(data.total_contributions || 0);

      const currentUserMembership = (data.memberships || []).find(
        (m) => m.user && m.user.id === currentUserId,
      );

      setUserContributed(
        Boolean(
          currentUserMembership &&
          currentUserMembership.total_contributed >= data.contribution_amount,
        ),
      );

      setIsCreator(currentUserId === data.created_by_id);
    } catch (err) {
      console.error("Error fetching group details:", err);
    }
  }, [currentUserId, id]);

  useEffect(() => {
    (async () => {
      await fetchCurrentUser();
    })();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    fetchGroupDetails();
  }, [currentUserId, id, fetchGroupDetails]);

  const handleContribute = async () => {
    if (!group || userContributed) {
      setMessage("You already contributed for this cycle!");
      setMessageType("info");
      return;
    }
    try {
      await api.post("/contributions/", { group: id });
      setMessage("Contribution successful!");
      setMessageType("success");
      fetchGroupDetails();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error contributing");
      setMessageType("error");
    }
  };

  const handleRotate = async () => {
    if (!group || !isCreator) return;
    setMessage("");
    setRotating(true);
    try {
      const res = await api.post(`/groups/${id}/rotate/`);
      const winner =
        res.data.winner?.username ||
        res.data.group?.latest_winner?.username ||
        "";

      if (winner) {
        wheelShownRef.current = true;
        setWinnerUsername(winner);
        setShowWheel(true);
      } else {
        setMessage("Rotation started but no winner returned.");
        setMessageType("info");
      }

      fetchGroupDetails();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const missing = err.response?.data?.missing;
      if (missing)
        setMessage(`${detail} Missing contributions: ${missing.join(", ")}`);
      else setMessage(detail || "Error rotating");
      setMessageType("error");
    } finally {
      setRotating(false);
    }
  };

  const handleWheelFinished = async (winner) => {
    setShowWheel(false);
    setMessage(`Winner: ${winner}`);
    setMessageType("success");
    wheelShownRef.current = false;

    if (!isCreator) {
      await fetchGroupDetails();
      return;
    }

    try {
      await api.post(`/groups/${id}/reset_rotation_flag/`);
    } catch (err) {
      console.error("Error resetting rotation flag:", err);
    }

    fetchGroupDetails();
  };

  if (!group) return <Spinner />;

  const rotationEnded = group.is_finished;

  const totalPossible =
    (group.memberships?.length || 0) * group.contribution_amount;

  const progress =
    totalPossible > 0
      ? Math.min((totalContributions / totalPossible) * 100, 100)
      : 0;

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mx-auto max-w-screen-2xl space-y-8">
      {/* Title */}
      <div className="text-center px-5 py-6 sm:py-8 rounded-2xl bg-[var(--color-primary)]/5 dark:bg-gray-900 border border-[var(--color-primary)]/20 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--color-primary)]">
          {group.name} - {group.code}
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          {group.description}
        </p>
      </div>

      {/* Group Info */}
      <Card className="p-6 space-y-5 text-sm sm:text-base bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2">
            {/* Icon + Label */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              <AiOutlineDollarCircle className="w-5 h-5 text-[var(--color-primary)] dark:text-gray-200" />
              <span>Contribution</span>
            </div>

            {/* Value */}
            <p className="font-semibold text-[var(--color-primary)] dark:text-white text-lg">
              ETB {group.contribution_amount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2 transition hover:shadow-md hover:scale-[1.02]">
            {/* Icon + Label */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              <HiArrowPath className="w-5 h-5 text-[var(--color-primary)] dark:text-gray-200" />
              <span>Cycle Days</span>
            </div>

            {/* Value */}
            <p className="font-semibold text-[var(--color-primary)] dark:text-white text-lg">
              {group.cycle_days}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2 transition hover:shadow-md hover:scale-[1.02]">
            {/* Icon + Label */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              <FaRegCalendarCheck className="w-5 h-5 text-[var(--color-primary)] dark:text-gray-200" />
              <span>Current Cycle</span>
            </div>

            {/* Value */}
            <p className="font-semibold text-[var(--color-primary)] dark:text-white text-lg">
              {group.current_cycle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2 transition hover:shadow-md hover:scale-[1.02]">
            {/* Icon + Label */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              <HiOutlineReceiptPercent className="w-5 h-5 text-[var(--color-primary)] dark:text-gray-200" />
              <span>Service Fee</span>
            </div>

            {/* Value */}
            <p className="font-semibold text-[var(--color-primary)] dark:text-white text-lg">
              {group.service_fee_percentage}%
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div onClick={fetchGroupDetails} className="cursor-pointer space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {/* Left side */}
            <div className="flex align-center items-center gap-1">
              <span className="font-medium">Total Progress</span>
            </div>

            {/* Right side */}
            <span className="font-semibold text-[var(--color-primary)] dark:text-gray-200">
              {totalContributions}/{totalPossible} ETB
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}

      {message && (
        <div className="w-full mb-4">
          <Alert
            type={messageType} // "error" | "success" | "info"
            message={message}
            onClose={() => setMessage("")}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
        {/* Contribute Button */}
        {!rotationEnded ? (
          <Button
            variant="primary"
            onClick={handleContribute}
            disabled={userContributed}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <FaHandHoldingDollar className="w-4 h-4" />
            {userContributed ? "Already Contributed" : "Contribute"}
          </Button>
        ) : (
          <Button
            disabled
            className="flex-1 bg-gray-400 text-white flex items-center justify-center gap-2"
          >
            Rotation Ended
          </Button>
        )}

        {/* Rotate Button */}
        {isCreator && (
          <Button
            onClick={handleRotate}
            disabled={rotating || rotationEnded}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white"
          >
            <FaSyncAlt
              className={`w-4 h-4 ${rotating ? "animate-spin" : ""}`}
            />
            {rotationEnded
              ? "Rotation Ended"
              : rotating
                ? "Rotating..."
                : "Rotate"}
          </Button>
        )}
      </div>

      

      {/* Members */}
      <Card className="p-5 text-sm sm:text-base bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <h3 className="text-lg font-medium text-[var(--color-primary)] mb-3">
          Members ({group.memberships?.length}/{group.max_members})
        </h3>

        <ul className="space-y-2">
          {group.memberships?.map((m) => (
            <li
              key={m.id}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {m.user.username}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ETB {m.total_contributed}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Payouts */}
      <Card className="p-5 text-sm sm:text-base bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <h3 className="text-lg font-medium text-[var(--color-primary)] mb-3">
          Payout History
        </h3>

        {group.payouts?.length > 0 ? (
          <ul className="space-y-2">
            {group.payouts.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  Cycle {p.cycle_number}: {p.recipient.username}
                </span>
                <span className="font-semibold text-[var(--color-primary)] dark:text-gray-200">
                  ETB {p.amount}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No payouts yet.
          </p>
        )}
      </Card>

      {/* Wheel */}
      {showWheel && (
        <WheelModal
          members={group.memberships}
          winnerUsername={winnerUsername}
          onClose={() => setShowWheel(false)}
          onFinished={handleWheelFinished}
        />
      )}
    </div>
  );
}
