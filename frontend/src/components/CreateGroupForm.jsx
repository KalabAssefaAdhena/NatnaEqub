import React, { useState } from "react";
import api from "../api/axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

export default function CreateGroupForm({ refreshAll }) {
  const [form, setForm] = useState({
    name: "",
    contribution_amount: "",
    service_fee: "",
    max_members: "",
    cycle_days: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'error' | 'success', message: '' }

  const handleChange = (k, v) => setForm({ ...form, [k]: v });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleCreate = async () => {
    if (
      !form.name ||
      !form.contribution_amount ||
      !form.service_fee ||
      !form.max_members ||
      !form.cycle_days
    ) {
      showAlert("error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/superuser/public-groups/create/", {
        name: form.name,
        contribution_amount: Number(form.contribution_amount),
        service_fee_percentage: Number(form.service_fee),
        max_members: Number(form.max_members),
        cycle_days: Number(form.cycle_days),
      });

      // Reset form after success
      setForm({
        name: "",
        contribution_amount: "",
        service_fee: "",
        max_members: "",
        cycle_days: "",
      });

      showAlert("success", "Group created successfully");

      await refreshAll();
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.detail || "Error creating group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl shadow-sm border p-4 sm:p-6 mb-6
                 bg-white dark:bg-neutral-900
                 border-gray-200 dark:border-neutral-800
                 transition"
    >
      {/* ALERT */}
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-[var(--color-primary)] dark:text-white mb-4">
        Create Public Group
      </h3>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { key: "name", placeholder: "Group Name", type: "text" },
          {
            key: "contribution_amount",
            placeholder: "Contribution (ETB)",
            type: "number",
          },
          {
            key: "service_fee",
            placeholder: "Service Fee (%)",
            type: "number",
          },
          { key: "max_members", placeholder: "Max Members", type: "number" },
          { key: "cycle_days", placeholder: "Cycle Days", type: "number" },
        ].map((input) => (
          <input
            key={input.key}
            type={input.type}
            placeholder={input.placeholder}
            value={form[input.key]}
            onChange={(e) => handleChange(input.key, e.target.value)}
            className="
              border rounded-lg px-3 py-2
              bg-white dark:bg-neutral-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-neutral-700
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              transition
            "
          />
        ))}
      </div>

      {/* BUTTON */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            flex items-center gap-2 px-5 py-2 rounded-lg font-medium
            bg-[var(--color-primary)] text-white
            hover:opacity-90 transition
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? <Spinner size={18} /> : "Create Group"}
        </button>
      </div>
    </div>
  );
}
