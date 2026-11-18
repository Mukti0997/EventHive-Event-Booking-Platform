import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Trash2, X, FileText, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { getBookings, updateBooking, deleteBooking } from '../../services/bookingService';

const STATUS_OPTIONS = ['new', 'contacted', 'confirmed', 'cancelled'];

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const BookingModal = ({ booking, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(booking?.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  if (!booking) return null;

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await onUpdate(booking._id, { adminNotes: notes });
      setSaveMsg('Saved successfully.');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch {
      setSaveMsg('Failed to save notes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(9, 13, 22, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card-luxury shadow-lg p-0"
        style={{ width: '90%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <span className="editorial-eyebrow mb-1">Inquiry Dossier</span>
            <h3 className="fs-5 fw-bold mb-0">Booking #{booking._id?.slice(-6)}</h3>
          </div>
          <button type="button" onClick={onClose} className="btn btn-sm p-1 border-0 text-muted">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <span className="text-muted small d-block">Host Name</span>
              <div className="fw-semibold text-primary">{booking.name}</div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Contact Email</span>
              <div className="text-secondary">{booking.email}</div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Mobile Phone</span>
              <div className="text-secondary">{booking.phone || '—'}</div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Occasion</span>
              <div className="text-capitalize fw-medium">{booking.eventType || '—'}</div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Target Event Date</span>
              <div>
                {booking.eventDate
                  ? new Date(booking.eventDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Guest Scope</span>
              <div>{booking.guestCount ? `${booking.guestCount} Guests` : '—'}</div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Package Reference</span>
              <div>{booking.package?.title || booking.packageName || 'Custom Inquiry'}</div>
            </div>
            <div className="col-md-6">
              <span className="text-muted small d-block">Status Pipeline</span>
              <div>
                <span className={`status-pill ${booking.status}`}>{booking.status}</span>
              </div>
            </div>
            {booking.venue && (
              <div className="col-12">
                <span className="text-muted small d-block">Preferred Venue</span>
                <div className="small text-secondary">{booking.venue}</div>
              </div>
            )}
            {booking.message && (
              <div className="col-12">
                <span className="text-muted small d-block">Client Vision Notes</span>
                <div
                  className="p-3 rounded-2 small text-secondary mt-1"
                  style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}
                >
                  {booking.message}
                </div>
              </div>
            )}
          </div>

          <div className="border-top pt-3" style={{ borderColor: 'var(--border-hairline)' }}>
            <label className="form-label-luxury">Internal Production Notes</label>
            <textarea
              className="form-control-luxury mb-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private notes about florist coordination, payment status, moodboard links..."
            />
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={saving}
                className="btn-luxury-primary py-2 px-3"
                style={{ fontSize: '0.8rem' }}
              >
                <span>{saving ? 'Saving...' : 'Save Production Notes'}</span>
              </button>
              {saveMsg && <span className="small text-success">{saveMsg}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ManageLeads ──────────────────────────────────────────────────────────────
export default function ManageLeads() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const LIMIT = 10;

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: LIMIT, sort: '-createdAt' };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const data = await getBookings(params);
      setBookings(data?.bookings || data?.data || data || []);
      setTotalPages(data?.totalPages || Math.ceil((data?.total || 1) / LIMIT) || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      const updated = await updateBooking(id, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated?.status || status } : b))
      );
      if (selectedBooking?._id === id) {
        setSelectedBooking((prev) => ({ ...prev, status: updated?.status || status }));
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateBooking = async (id, payload) => {
    const updated = await updateBooking(id, payload);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...updated } : b))
    );
    return updated;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      setDeletingId(id);
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (selectedBooking?._id === id) setSelectedBooking(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete booking.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <div className="mb-4">
          <div className="editorial-eyebrow mb-1">
            <span>Inquiry Pipeline</span>
          </div>
          <h1 className="font-display fs-2 fw-bold mb-1">Manage Inquiries & Leads</h1>
          <p className="text-secondary small mb-0">
            Track inquiries, update consultation status, and inspect guest requirements.
          </p>
        </div>

        {/* Filters */}
        <div
          className="card-luxury p-3 mb-4"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control-luxury ps-5"
                  placeholder="Search by client name, email, or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-3">
              <select
                className="form-control-luxury"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Pipeline Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <button
                type="button"
                className="btn-luxury-outline w-100 justify-content-center"
                style={{ fontSize: '0.825rem' }}
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        {loading ? (
          <div className="py-5 text-center">
            <Loader />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 text-muted small card-luxury p-5">
            No event inquiries match the specified filter.
          </div>
        ) : (
          <div className="card-luxury" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="table-responsive">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Host Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Occasion</th>
                    <th>Event Date</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.name}</td>
                      <td className="text-secondary small">{b.email}</td>
                      <td className="small">{b.phone || '—'}</td>
                      <td className="text-capitalize small">{b.eventType || '—'}</td>
                      <td className="small">
                        {b.eventDate
                          ? new Date(b.eventDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="small">{b.package?.title || b.packageName || '—'}</td>
                      <td>
                        <select
                          className={`status-pill ${b.status} border-0`}
                          value={b.status}
                          disabled={updatingId === b._id}
                          onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                          style={{ cursor: 'pointer' }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="text-capitalize bg-white text-dark">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-luxury-outline p-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setSelectedBooking(b)}
                            title="Inspect details"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger p-1 px-2 border-0"
                            style={{ fontSize: '0.75rem' }}
                            disabled={deletingId === b._id}
                            onClick={() => handleDelete(b._id)}
                            title="Delete inquiry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-top" style={{ borderColor: 'var(--border-hairline)' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        )}
      </main>

      {/* Booking Dossier Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
}
