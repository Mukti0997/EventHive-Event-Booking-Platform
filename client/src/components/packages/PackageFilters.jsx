import { Search, X } from 'lucide-react';

const CATEGORIES = ['', 'wedding', 'corporate', 'birthday', 'anniversary', 'other'];

const CATEGORY_LABELS = {
  '': 'All Collections',
  wedding: 'Weddings',
  corporate: 'Corporate',
  birthday: 'Birthdays',
  anniversary: 'Anniversaries',
  other: 'Bespoke / Other',
};

const PackageFilters = ({ selectedCategory, onCategoryChange, search, onSearchChange }) => {
  return (
    <div className="mb-5">
      <div className="row g-3 align-items-center justify-content-between">
        {/* Category Pills */}
        <div className="col-lg-8 col-12">
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`btn py-2 px-3 rounded-2 transition-all ${
                    isActive ? 'btn-dark' : 'btn-outline-secondary border-subtle'
                  }`}
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.01em',
                    backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-surface)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    borderColor: isActive ? 'var(--brand-primary)' : 'var(--border-subtle)',
                  }}
                  onClick={() => onCategoryChange(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input */}
        <div className="col-lg-4 col-12">
          <div className="position-relative">
            <span
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              style={{ pointerEvents: 'none' }}
            >
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control-luxury ps-5 pe-5"
              placeholder="Search by occasion or title..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search packages"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 border-0 text-muted"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageFilters;
