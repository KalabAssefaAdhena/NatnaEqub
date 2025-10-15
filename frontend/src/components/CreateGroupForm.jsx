import React, { useState } from 'react';
import api from '../api/axios';
import Spinner from './Spinner';

export default function CreateGroupForm({ refreshAll }) {
  const [form, setForm] = useState({
    name: '',
    contribution_amount: '',
    service_fee: '',
    max_members: '',
    cycle_days: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (k, v) => setForm({ ...form, [k]: v });

  const handleCreate = async () => {
    if (
      !form.name ||
      !form.contribution_amount ||
      !form.service_fee ||
      !form.max_members ||
      !form.cycle_days
    ) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/superuser/public-groups/create/', {
        name: form.name,
        contribution_amount: Number(form.contribution_amount),
        service_fee_percentage: Number(form.service_fee),
        max_members: Number(form.max_members),
        cycle_days: Number(form.cycle_days),
      });

      setForm({
        name: '',
        contribution_amount: '',
        service_fee: '',
        max_members: '',
        cycle_days: '',
      });

      await refreshAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Error creating group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
        Create Public Group
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Group Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Contribution (ETB)"
          type="number"
          value={form.contribution_amount}
          onChange={(e) => handleChange('contribution_amount', e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Service Fee (%)"
          type="number"
          value={form.service_fee}
          onChange={(e) => handleChange('service_fee', e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Max Members"
          type="number"
          value={form.max_members}
          onChange={(e) => handleChange('max_members', e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Cycle Days"
          type="number"
          value={form.cycle_days}
          onChange={(e) => handleChange('cycle_days', e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? <Spinner size={18} /> : 'Create Group'}
        </button>
      </div>
    </div>
  );
}
