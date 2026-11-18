import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { getPackage } from '../services/packageService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const fetchPackage = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPackage(id);
      setPkg(data);
      setActiveImage(0);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load package details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="py-5 text-center my-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 my-5">
        <ErrorMessage message={error} onRetry={fetchPackage} />
        <div className="text-center mt-4">
          <Link to="/packages" className="btn-luxury-outline">
            <ChevronLeft size={16} />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  const fallbackImg =
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
  const rawImages = pkg.images?.filter(Boolean) || [];
  const images = rawImages.length > 0 ? rawImages : [fallbackImg];

  return (
    <div className="package-details-page pb-5">
      {/* Editorial Breadcrumb */}
      <div className="py-3 border-bottom" style={{ borderColor: 'var(--border-hairline)' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <Link to="/" className="text-decoration-none text-muted hover-gold">
              Home
            </Link>
            <span>/</span>
            <Link to="/packages" className="text-decoration-none text-muted hover-gold">
              Collections
            </Link>
            <span>/</span>
            <span className="text-primary fw-medium">{pkg.title}</span>
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Gallery Column */}
            <div className="col-lg-7">
              {/* Main Showcase Image */}
              <div
                className="position-relative rounded-3 overflow-hidden shadow-sm mb-3"
                style={{ height: '460px', backgroundColor: 'var(--bg-surface-subtle)' }}
              >
                <img
                  src={images[activeImage]}
                  alt={pkg.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover', transition: 'all 0.4s ease' }}
                  onError={(e) => {
                    e.target.src = fallbackImg;
                  }}
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImage((prev) => (prev - 1 + images.length) % images.length)
                      }
                      className="btn position-absolute top-50 start-0 translate-middle-y ms-3 p-2 rounded-circle"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        zIndex: 2,
                      }}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                      className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-2 rounded-circle"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        zIndex: 2,
                      }}
                      aria-label="Next photo"
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div className="position-absolute bottom-0 end-0 m-3">
                      <span className="badge-minimal">
                        {activeImage + 1} / {images.length}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className="p-0 border-0 rounded-2 overflow-hidden flex-shrink-0"
                      style={{
                        width: '84px',
                        height: '64px',
                        opacity: activeImage === idx ? 1 : 0.6,
                        border:
                          activeImage === idx
                            ? '2px solid var(--brand-gold)'
                            : '1px solid var(--border-subtle)',
                        transition: 'all 0.2s ease',
                      }}
                      aria-label={`Thumbnail ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Description & Narrative */}
              <div className="mt-5 pt-3">
                <div className="editorial-eyebrow">
                  <span>Architecture & Concept</span>
                </div>
                <h2 className="font-display fs-2 mb-3">About this Experience</h2>
                <p
                  className="text-secondary"
                  style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}
                >
                  {pkg.description}
                </p>

                {/* Inclusions Matrix */}
                {pkg.inclusions?.length > 0 && (
                  <div className="mt-5 pt-4 border-top" style={{ borderColor: 'var(--border-hairline)' }}>
                    <h3 className="font-display fs-4 mb-4">Included Signature Elements</h3>
                    <div className="row g-3">
                      {pkg.inclusions.map((item, idx) => (
                        <div key={idx} className="col-md-6">
                          <div
                            className="p-3 rounded-2 h-100 d-flex align-items-start gap-2"
                            style={{
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <CheckCircle2
                              size={18}
                              style={{ color: 'var(--brand-gold)', flexShrink: 0, marginTop: '2px' }}
                            />
                            <span className="small fw-medium text-primary">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Reservation Sidebar */}
            <div className="col-lg-5">
              <div
                className="position-sticky p-4 rounded-3 shadow-sm"
                style={{
                  top: '100px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge-minimal gold">{pkg.category || 'Curated'}</span>
                  {pkg.isFeatured && <span className="badge-minimal">Featured Experience</span>}
                </div>

                <h1 className="font-display fs-2 mb-2">{pkg.title}</h1>

                <div className="d-flex align-items-baseline gap-2 mb-4">
                  <span
                    className="font-display fw-bold"
                    style={{ fontSize: '2rem', color: 'var(--brand-gold)' }}
                  >
                    ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted small">base investment</span>
                </div>

                {/* Key Metrics */}
                <div
                  className="p-3 rounded-2 mb-4 d-flex justify-content-around text-center"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div className="text-muted small d-flex align-items-center justify-content-center gap-1">
                      <Users size={14} />
                      <span>Capacity</span>
                    </div>
                    <div className="fw-semibold text-primary">{pkg.capacity || 200} Guests</div>
                  </div>

                  <div style={{ width: '1px', backgroundColor: 'var(--border-subtle)' }} />

                  <div>
                    <div className="text-muted small d-flex align-items-center justify-content-center gap-1">
                      <Clock size={14} />
                      <span>Duration</span>
                    </div>
                    <div className="fw-semibold text-primary">{pkg.duration || 'Full Event'}</div>
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <Link
                  to="/book"
                  state={{ packageId: pkg._id }}
                  className="btn-luxury-primary w-100 justify-content-center py-3 mb-3 text-decoration-none"
                  style={{ fontSize: '0.95rem' }}
                >
                  <span>Reserve This Package</span>
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/contact"
                  className="btn-luxury-outline w-100 justify-content-center py-3 mb-4 text-decoration-none"
                  style={{ fontSize: '0.9rem' }}
                >
                  <PhoneCall size={15} />
                  <span>Request Custom Consultation</span>
                </Link>

                {/* Assurances */}
                <div className="pt-3 border-top small text-muted" style={{ borderColor: 'var(--border-hairline)' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Dedicated Master Production Director</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Calendar size={16} className="text-success" />
                    <span>Flexible date rescheduling prior to lock-in</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Sparkles size={16} className="text-success" />
                    <span>Complete transparent cost breakdown</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
