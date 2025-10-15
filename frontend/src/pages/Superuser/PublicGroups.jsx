import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
import CreateGroupForm from '../../components/CreateGroupForm';
import GroupsList from '../../components/GroupsList';

export default function PublicGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superuser/public-groups/');
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openManage = (id) => {
    navigate(`/superuser/manage-group/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Public Groups
        </h1>
        <button
          onClick={fetchGroups}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      <CreateGroupForm refreshAll={fetchGroups} />

      {loading ? (
        <Card className="p-6 flex justify-center">
          <Spinner />
        </Card>
      ) : (
        <GroupsList groups={groups} openManage={openManage} />
      )}
    </div>
  );
}
