import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contribution, setContribution] = useState('');
  const [cycle, setCycle] = useState('');
  const [numberOfMembers, setNumberOfMembers] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name || !numberOfMembers || !contribution || !cycle) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      await api.post('/groups/', {
        name,
        description,
        contribution_amount: contribution,
        cycle_days: cycle,
        max_members: numberOfMembers,
        service_fee_percentage: serviceFee || 0,
      });

      setMessage('Group created successfully!');
      setTimeout(() => navigate('/home/my-equb'), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Error creating group');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-[var(--color-primary)] text-center">
        Create Equb Group
      </h2>

      <Card className="space-y-4 p-4 flex flex-col items-center">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Group Name
          </label>
          <Input
            placeholder="e.g. Unity Equb"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Number of Members
          </label>
          <Input
            type="number"
            placeholder="e.g. 10"
            value={numberOfMembers}
            onChange={(e) => setNumberOfMembers(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <Input
            placeholder="About this group"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Contribution Amount (ETB)
          </label>
          <Input
            type="number"
            placeholder="e.g. 500"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cycle (in days)
          </label>
          <Input
            type="number"
            placeholder="e.g. 30"
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Service Fee (%)
          </label>
          <Input
            type="number"
            placeholder="e.g. 5"
            value={serviceFee}
            onChange={(e) => setServiceFee(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            The percentage the creator receives from each cycle's pot.
          </p>
        </div>

        <Button variant="primary" onClick={handleCreate}>
          Create Group
        </Button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.toLowerCase().includes('error')
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}
