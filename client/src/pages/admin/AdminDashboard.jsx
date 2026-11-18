import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Package,
  Users,
  Calendar,
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getBookingStats, getBookings } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { admin } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [bookingsError, setBookingsError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const data = await getBookingStats();
        setStats(data);
      } catch (err) {
        setStatsError(err?.response?.data?.message || 'Failed to load stats.');
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchRecent = async () => {
      try {
        setLoadingBookings(true);
        const data = await getBookings({ limit: 5, sort: '-createdAt' });
        setRecentBookings(data?.bookings || data || []);
      } catch (err) {
        setBookingsError(err?.response?.data?.message || 'Failed to load recent bookings.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats?.total ?? 0,
      icon: FolderKanban,
      color: 'var(--text-primary)',
    },
    {
      title: 'New / Uncontacted',
      value: stats?.new ?? 0,
      icon: Sparkles,
      color: 'var(--brand-gold)',
    },
    {
      title: 'Confirmed Bookings',
      value: stats?.confirmed ?? 0,
      icon: CheckCircle2,
      color: '#15803d',
    },
    {
      title: 'Archived / Cancelled',
      value: stats?.cancelled ?? 0,
      icon: XCircle,
      color: '#b91c1c',
    },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
          <div>
            <div className="editorial-eyebrow mb-1">
              <span>Production Control Console</span>
            </div>
            <h1 className="font-display fs-2 fw-bold mb-1">
              Welcome back, {admin?.name || 'Administrator'}
            </h1>
            <p className="text-secondary small mb-0">
              Overview of current event bookings, guest tiers, and inquiry statuses.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/admin/leads" className="btn-luxury-primary" style={{ fontSize: '0.825rem' }}>
              <Users size={15} />
              <span>Manage Inquiries</span>
            </Link>
            <Link to="/admin/packages" className="btn-luxury-outline" style={{ fontSize: '0.825rem' }}>
              <Package size={15} />
              <span>Catalog</span>
            </Link>
          </div>
        </div>

        {/* Metric KPI Cards */}
        {loadingStats ? (
          <div className="py-4 text-center">
            <Loader />
          </div>
        ) : statsError ? (
          <ErrorMessage message={statsError} />
        ) : (
          <div className="row g-4 mb-5">
            {statCards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="col-12 col-sm-6 col-xl-3">
                  <div
                    className="card-luxury p-4 h-100"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="small fw-semibold text-muted text-uppercase" style={{ letterSpacing: '0.04em' }}>
                        {c.title}
                      </span>
                      <Icon size={18} style={{ color: c.color }} />
                    </div>
                    <div
                      className="font-display fw-bold"
                      style={{ fontSize: '2.25rem', color: 'var(--text-primary)', lineHeight: 1 }}
                    >
                      {c.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Inquiries High-Density Table */}
        <div className="card-luxury" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2 className="fs-5 fw-semibold mb-0">Recent Event Inquiries</h2>
            <Link
              to="/admin/leads"
              className="text-primary text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1 hover-gold"
            >
              <span>View All Inquiries</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="p-0">
            {loadingBookings ? (
              <div className="p-5 text-center">
                <Loader />
              </div>
            ) : bookingsError ? (
              <div className="p-4">
                <ErrorMessage message={bookingsError} />
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-5 text-center text-muted small">No inquiries found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table-luxury">
                  <thead>
                    <tr>
                      <th>Host Name</th>
                      <th>Contact Email</th>
                      <th>Occasion</th>
                      <th>Target Date</th>
                      <th>Package Reference</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="fw-semibold">{b.name}</td>
                        <td className="text-secondary small">{b.email}</td>
                        <td className="text-capitalize">{b.eventType || 'Bespoke'}</td>
                        <td className="small">
                          {b.eventDate
                            ? new Date(b.eventDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td>{b.package?.title || b.packageName || 'Custom Scope'}</td>
                        <td>
                          <span className={`status-pill ${b.status || 'new'}`}>
                            {b.status || 'new'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
