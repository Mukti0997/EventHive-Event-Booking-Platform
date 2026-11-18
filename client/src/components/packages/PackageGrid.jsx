import PackageCard from './PackageCard';
import { Search } from 'lucide-react';

/**
 * Responsive grid layout for package cards.
 * @param {Array} packages - Array of package objects
 */
const PackageGrid = ({ packages }) => {
  if (!packages || packages.length === 0) {
    return (
      <div
        className="text-center py-5 my-4 p-5 rounded-3"
        style={{
          border: '1px dashed var(--border-medium)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3 text-muted"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <Search size={22} />
        </div>
        <h4 className="fw-semibold mb-2" style={{ fontSize: '1.15rem' }}>
          No matching packages found
        </h4>
        <p className="text-muted small mb-0" style={{ maxWidth: '380px', margin: '0 auto' }}>
          Try clearing your search query or selecting a different event category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {packages.map((pkg) => (
        <div className="col-lg-4 col-md-6" key={pkg._id}>
          <PackageCard pkg={pkg} />
        </div>
      ))}
    </div>
  );
};

export default PackageGrid;
