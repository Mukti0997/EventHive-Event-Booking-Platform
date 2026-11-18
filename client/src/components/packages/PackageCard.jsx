import { Link } from 'react-router-dom';
import { Users, Clock, ArrowUpRight } from 'lucide-react';

/**
 * High-end minimalist PackageCard with image zoom, clean typography and specification metadata.
 * @param {Object} pkg - Package data
 */
const PackageCard = ({ pkg }) => {
  const fallbackImg =
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
  const img = pkg.images?.[0] || fallbackImg;
  const categoryLabel = pkg.category
    ? pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)
    : 'Package';

  return (
    <div className="card-luxury h-100 d-flex flex-column">
      {/* Image & Category Badges */}
      <div className="card-luxury-image-wrap" style={{ height: '230px' }}>
        <img
          src={img}
          alt={pkg.title || 'Event package'}
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge-minimal">{categoryLabel}</span>
          {pkg.isFeatured && <span className="badge-minimal gold">Featured</span>}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        <h3 className="fs-5 fw-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {pkg.title}
        </h3>

        <p
          className="text-secondary small mb-3 flex-grow-1"
          style={{
            lineHeight: 1.6,
            minHeight: '44px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {pkg.shortDescription || pkg.description || 'Custom crafted celebration experience.'}
        </p>

        {/* Specifications */}
        <div
          className="d-flex align-items-center gap-3 py-2 mb-3 text-secondary small"
          style={{
            borderTop: '1px solid var(--border-hairline)',
            borderBottom: '1px solid var(--border-hairline)',
            fontSize: '0.8rem',
          }}
        >
          {pkg.capacity && (
            <span className="d-flex align-items-center gap-1">
              <Users size={14} className="text-muted" />
              <span>{pkg.capacity} guests</span>
            </span>
          )}
          {pkg.duration && (
            <span className="d-flex align-items-center gap-1">
              <Clock size={14} className="text-muted" />
              <span>{pkg.duration}</span>
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <div>
            <div
              className="text-muted"
              style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              Estimated From
            </div>
            <div
              className="font-display fw-bold"
              style={{ fontSize: '1.25rem', color: 'var(--brand-gold)' }}
            >
              ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <Link
            to={`/packages/${pkg._id}`}
            className="btn-luxury-outline py-2 px-3 text-decoration-none"
            style={{ fontSize: '0.8rem' }}
          >
            <span>Details</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
