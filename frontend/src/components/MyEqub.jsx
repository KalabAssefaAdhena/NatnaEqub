import { useEffect, useState } from 'react';
import api from '../api/axios';
import EqubGroupCard from '../components/EqubGroupCard';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

export default function MyEqub() {
  const [subTab, setSubTab] = useState('joined');
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/');
        setMyGroups(res.data.groups || []);
        setUserId(res.data.user?.id || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const joinedEqubs = myGroups.filter((g) => g.created_by?.id !== userId);
  const createdEqubs = myGroups.filter((g) => g.created_by?.id === userId);

  return (
    <div className="w-full max-w-md mx-auto px-2 ">
      <div className="flex border-b border-gray-300 mb-4 ">
        <button
          onClick={() => setSubTab('joined')}
          className={`flex-1 py-2 text-center cursor-pointer font-medium ${
            subTab === 'joined'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-gray-500'
          }`}
        >
          Joined Equbs
        </button>
        <button
          onClick={() => setSubTab('created')}
          className={`flex-1 py-2 text-center cursor-pointer font-medium ${
            subTab === 'created'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-gray-500'
          }`}
        >
          Created Equbs
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {subTab === 'joined' && (
            <div className="space-y-4">
              <Link
                to="/home/join-group"
                className="block text-center w-[80%] mx-auto px-4 py-4 rounded-full font-medium text-sm transition-colors bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow"
              >
                🔗 Join Equb
              </Link>
              {joinedEqubs.length === 0 && (
                <p className="text-center">No joined equbs yet</p>
              )}
              {[...joinedEqubs].reverse().map((g) => (
                <EqubGroupCard
                  key={g.id}
                  group={g}
                  joined={true}
                  clickable={true}
                  className="w-full"
                />
              ))}
            </div>
          )}

          {subTab === 'created' && (
            <div className="space-y-4">
              <Link
                to="/home/create-group"
                className="block text-center w-[80%] mx-auto px-4 py-4 rounded-full font-medium text-sm transition-colors bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow"
              >
                ➕ Create Equb
              </Link>
              {createdEqubs.length === 0 && (
                <p className="text-center">No created equbs yet</p>
              )}
              {[...createdEqubs].reverse().map((g) => (
                <EqubGroupCard
                  key={g.id}
                  group={g}
                  clickable={true}
                  className="w-full"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
