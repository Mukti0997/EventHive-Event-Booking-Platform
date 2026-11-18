import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, Plus, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { createPackage, updatePackage, getPackageById } from '../../services/packageService';

const CATEGORIES = ['wedding', 'corporate', 'birthday', 'anniversary', 'other'];

const EMPTY_FORM = {
  title: '',
  category: '',
  shortDescription: '',
  description: '',
  price: '',
  capacity: '',
  duration: '',
  inclusions: '',
  images: '',
  isFeatured: false,
  isActive: true,
};

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loadingPackage, setLoadingPackage] = useState(isEditMode);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditMode) return;

    const fetchPackage = async () => {
      try {
        setLoadingPackage(true);
        setFetchError('');
        const pkg = await getPackageById(id);
        setFormData({
          title: pkg.title || '',
          category: pkg.category || '',
          shortDescription: pkg.shortDescription || '',
          description: pkg.description || '',
          price: pkg.price != null ? String(pkg.price) : '',
          capacity: pkg.capacity != null ? String(pkg.capacity) : '',
          duration: pkg.duration || '',
          inclusions: Array.isArray(pkg.inclusions)
            ? pkg.inclusions.join(', ')
            : pkg.inclusions || '',
          images: Array.isArray(pkg.images)
            ? pkg.images.join(', ')
            : pkg.images || '',
          isFeatured: pkg.isFeatured || false,
          isActive: pkg.isActive !== false,
        });
      } catch (err) {
        setFetchError(err?.response?.data?.message || 'Failed to load package.');
      } finally {
        setLoadingPackage(false);
      }
    };

    fetchPackage();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.category) errors.category = 'Category is required.';
    if (!formData.shortDescription.trim())
      errors.shortDescription = 'Short description is required.';
    if (formData.shortDescription.length > 200)
      errors.shortDescription = 'Short description must be under 200 characters.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (!formData.price && formData.price !== 0) {
      errors.price = 'Price is required.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Price must be a valid positive number.';
    }
    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) < 0)) {
      errors.capacity = 'Capacity must be a valid positive number.';
    }
    return errors;
  };

  const buildPayload = () => {
    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
    };

    if (formData.capacity !== '') payload.capacity = Number(formData.capacity);
    if (formData.duration.trim()) payload.duration = formData.duration.trim();

    payload.inclusions = formData.inclusions
      ? formData.inclusions
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    payload.images = formData.images
      ? formData.images
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = buildPayload();

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updatePackage(id, payload);
      } else {
        await createPackage(payload);
      }
      navigate('/admin/packages', { replace: true });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'Failed to save package. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldError = (field) =>
    fieldErrors[field] ? (
      <div className="invalid-feedback d-block small mt-1">{fieldErrors[field]}</div>
    ) : null;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <Link
              to="/admin/packages"
              className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1 mb-2 hover-gold"
            >
              <ArrowLeft size={14} />
              <span>Back to Packages</span>
            </Link>
            <h1 className="font-display fs-2 fw-bold mb-0">
              {isEditMode ? 'Edit Package Portfolio' : 'Author New Package'}
            </h1>
          </div>
        </div>

        {loadingPackage ? (
          <div className="py-5 text-center">
            <Loader />
          </div>
        ) : fetchError ? (
          <ErrorMessage message={fetchError} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-4">
              <div className="col-12 col-lg-8">
                <div
                  className="card-luxury p-4 p-md-5 mb-4"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <h2 className="fs-5 fw-semibold mb-4">Core Specifications</h2>

                  {submitError && (
                    <div className="alert alert-danger py-2 px-3 small mb-4">{submitError}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label-luxury">Package Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control-luxury"
                      placeholder="e.g. Royal Heritage Wedding Pavilion"
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {renderFieldError('title')}
                  </div>

                  <div className="mb-3">
                    <label className="form-label-luxury">Occasion Category *</label>
                    <select
                      name="category"
                      className="form-control-luxury"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select an occasion…</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="text-capitalize">
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    {renderFieldError('category')}
                  </div>

                  <div className="mb-3">
                    <label className="form-label-luxury">
                      Short Tagline * <span className="text-muted fw-normal">({formData.shortDescription.length}/200)</span>
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      className="form-control-luxury"
                      placeholder="A crisp, evocative summary of this celebration"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      maxLength={200}
                    />
                    {renderFieldError('shortDescription')}
                  </div>

                  <div className="mb-3">
                    <label className="form-label-luxury">Full Narrative Description *</label>
                    <textarea
                      name="description"
                      rows={6}
                      className="form-control-luxury"
                      placeholder="Detailed spatial design, culinary highlights, acoustic setup, and itinerary..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {renderFieldError('description')}
                  </div>

                  <div className="mb-3">
                    <label className="form-label-luxury">
                      Inclusions <span className="text-muted fw-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      name="inclusions"
                      className="form-control-luxury"
                      placeholder="e.g. 5-Course Sensory Dining, Live Acoustic Strings, Kinetic Chandeliers"
                      value={formData.inclusions}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label-luxury">
                      Image URLs <span className="text-muted fw-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      name="images"
                      className="form-control-luxury"
                      placeholder="https://images.unsplash.com/..., https://..."
                      value={formData.images}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div
                  className="card-luxury p-4 mb-4"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <h2 className="fs-6 fw-semibold mb-3">Investment & Capacity</h2>

                  <div className="mb-3">
                    <label className="form-label-luxury">Base Investment (₹ INR) *</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      className="form-control-luxury"
                      placeholder="e.g. 450000"
                      value={formData.price}
                      onChange={handleChange}
                    />
                    {renderFieldError('price')}
                  </div>

                  <div className="mb-3">
                    <label className="form-label-luxury">Guest Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      min="0"
                      className="form-control-luxury"
                      placeholder="e.g. 250"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                    {renderFieldError('capacity')}
                  </div>

                  <div className="mb-0">
                    <label className="form-label-luxury">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      className="form-control-luxury"
                      placeholder="e.g. Full Day / 8 Hours"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div
                  className="card-luxury p-4 mb-4"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <h2 className="fs-6 fw-semibold mb-3">Visibility & Status</h2>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small fw-medium" htmlFor="isFeatured">
                      Featured in Homepage Showcase
                    </label>
                  </div>

                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small fw-medium" htmlFor="isActive">
                      Active (Visible to Clients)
                    </label>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn-luxury-gold py-3 justify-content-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Saving Package...</span>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{isEditMode ? 'Save Changes' : 'Publish Package'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-luxury-outline py-2 justify-content-center"
                    onClick={() => navigate('/admin/packages')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default PackageForm;
