import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');

      try {
        const [clubsRes, noticesRes] = await Promise.all([
          api.get('/clubs'),
          api.get('/notices'),
        ]);

        setClubs(clubsRes.data || []);
        setNotices(noticesRes.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load dashboard data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Campus Hub</h1>
            {user?.name && (
              <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
            )}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            {/* Clubs Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Clubs</h2>

              {clubs.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No clubs available yet. Check back soon!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clubs.map((club) => (
                    <div
                      key={club.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {club.description || 'No description provided.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Notices Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notices</h2>

              {notices.length === 0 ? (
                <p className="text-gray-500 text-sm">No notices posted yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                        {notice.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;