import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, Sparkles, Package } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getPackages, deletePackage } from '../../services/packageService';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPackages({});
      setPackages(data?.packages || data?.data || data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setDeletingId(id);
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete package.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <div className="editorial-eyebrow mb-1">
              <span>Catalog Management</span>
            </div>
            <h1 className="font-display fs-2 fw-bold mb-1">Package Collections</h1>
            <p className="text-secondary small mb-0">
              Configure, author, and publish event packages showcased to clients.
            </p>
          </div>
          <Link to="/admin/packages/new" className="btn-luxury-primary">
            <Plus size={16} />
            <span>Create New Package</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-5 text-center">
            <Loader />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : packages.length === 0 ? (
          <div className="card-luxury p-5 text-center">
            <Package size={36} className="text-muted mx-auto mb-3" />
            <h3 className="fs-5 fw-semibold mb-2">No packages currently published</h3>
            <p className="text-muted small mb-4">Create your first signature celebration package.</p>
            <Link to="/admin/packages/new" className="btn-luxury-primary mx-auto">
              <Plus size={16} />
              <span>Create First Package</span>
            </Link>
          </div>
        ) : (
          <div className="card-luxury" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="table-responsive">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Title & Category</th>
                    <th>Base Price</th>
                    <th>Capacity</th>
                    <th>Highlight</th>
                    <th>Availability</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td>
                        <div className="fw-semibold text-primary">{pkg.title}</div>
                        <div className="text-muted small text-capitalize">{pkg.category}</div>
                      </td>
                      <td className="fw-medium">
                        {pkg.price != null ? `₹${pkg.price.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="small">{pkg.capacity ? `${pkg.capacity} guests` : '—'}</td>
                      <td>
                        {pkg.isFeatured ? (
                          <span className="badge-minimal gold">
                            <Sparkles size={11} className="me-1" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        {pkg.isActive !== false ? (
                          <span className="status-pill confirmed">Active</span>
                        ) : (
                          <span className="status-pill new">Draft</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/admin/packages/${pkg._id}/edit`}
                            className="btn btn-sm btn-luxury-outline p-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            title="Edit Package"
                          >
                            <Edit3 size={13} />
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger p-1 px-2 border-0"
                            style={{ fontSize: '0.75rem' }}
                            disabled={deletingId === pkg._id}
                            onClick={() => handleDelete(pkg._id, pkg.title)}
                            title="Delete Package"
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

            <div className="p-3 border-top small text-muted text-end" style={{ borderColor: 'var(--border-hairline)' }}>
              {packages.length} package{packages.length !== 1 ? 's' : ''} in catalog
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagePackages;
