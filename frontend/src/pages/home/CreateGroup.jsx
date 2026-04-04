import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import {
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineClock,
} from "react-icons/hi";
import { HiOutlinePercentBadge } from "react-icons/hi2";
import { FaRegFileAlt } from "react-icons/fa";
import Alert from "../../components/Alert";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contribution, setContribution] = useState("");
  const [cycle, setCycle] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name || !numberOfMembers || !contribution || !cycle) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      await api.post("/groups/", {
        name,
        description,
        contribution_amount: contribution,
        cycle_days: cycle,
        max_members: numberOfMembers,
        service_fee_percentage: serviceFee || 0,
      });

      setMessage("Group created successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/home/my-equb"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Error creating group");
      setMessageType("error");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary)]">
          Create Equb Group
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Set up your group and start rotating contributions
        </p>
      </div>

      <Card className="p-5 sm:p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        {/* Grid Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Group Name */}
          <div className="space-y-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineUserGroup className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200" />
              Group Name
            </label>
            <Input
              placeholder="e.g. Unity Equb"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Members */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineUserGroup className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200" />
              Members
            </label>
            <Input
              type="number"
              placeholder="e.g. 10"
              value={numberOfMembers}
              onChange={(e) => setNumberOfMembers(e.target.value)}
            />
          </div>

          {/* Contribution */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineCash className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200" />
              Contribution (ETB)
            </label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />
          </div>

          {/* Cycle */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineClock className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200" />
              Cycle (days)
            </label>
            <Input
              type="number"
              placeholder="e.g. 30"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
            />
          </div>

          {/* Service Fee */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlinePercentBadge className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200" />
              Service Fee (%)
            </label>
            <Input
              type="number"
              placeholder="e.g. 5"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FaRegFileAlt className="w-4 h-4 text-[var(--color-primary)] dark:text-gray-200   " />
              Description (optional)
            </label>
            <Input
              placeholder="About this group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
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

        {/* Button */}
        <Button
          variant="primary"
          onClick={handleCreate}
          className="w-full flex items-center justify-center gap-2"
        >
          Create Group
        </Button>
      </Card>
    </div>
  );
}
