import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // NEW: Imported Link for navigation
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CreateNoticeForm from '../components/CreateNoticeForm';
import ReportLostItemForm from '../components/ReportLostItemForm';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showLostItemModal, setShowLostItemModal] = useState(false);

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'CLUB_ADMIN';

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [clubsRes, noticesRes, eventsRes] = await Promise.all([
        api.get('/clubs'),
        api.get('/notices'),
        api.get('/events'),
      ]);

      setClubs(clubsRes.data || []);
      setNotices(noticesRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load dashboard data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRsvp = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/rsvp`);
      toast.success('RSVP confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to RSVP.');
    }
  };

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

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowNoticeModal(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                + Notice
              </button>
            )}
            
            {/* NEW: View Lost & Found Link Button */}
            <Link
              to="/feed"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              View Lost & Found
            </Link>

            <button
              onClick={() => setShowLostItemModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Report Lost Item
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
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
            {/* Events Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Events</h2>

              {events.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming events yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {event.description || 'No description provided.'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRsvp(event.id)}
                        className="mt-4 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        RSVP
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

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

      {/* Create Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Notice
              </h3>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <CreateNoticeForm
              onSuccess={() => {
                setShowNoticeModal(false);
                fetchDashboardData();
              }}
            />
          </div>
        </div>
      )}

      {/* Report Lost Item Modal */}
      {showLostItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Report Lost Item
              </h3>
              <button
                onClick={() => setShowLostItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <ReportLostItemForm
              onSuccess={() => setShowLostItemModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;