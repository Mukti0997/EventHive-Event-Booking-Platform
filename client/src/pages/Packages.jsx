import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import PackageFilters from '../components/packages/PackageFilters';
import PackageGrid from '../components/packages/PackageGrid';
import useParallax from '../hooks/useParallax';

const ITEMS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 300;

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [reloadKey, setReloadKey] = useState(0);

  const headerParallax = useParallax(-0.1);

  // Sync category state if URL params change
  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat !== null && paramCat !== category) {
      setCategory(paramCat);
      setPage(1);
    }
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch packages from API
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          limit: ITEMS_PER_PAGE,
          page,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(category && { category }),
        };
        const data = await getPackages(params);
        if (ignore) return;

        const list = Array.isArray(data) ? data : data?.packages ?? [];
        setPackages(list);
        setTotalCount(data?.total || list.length);
        setTotalPages(
          data?.totalPages ||
            Math.ceil((data?.total || list.length) / ITEMS_PER_PAGE) ||
            1
        );
      } catch (err) {
        if (ignore) return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load packages.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [page, debouncedSearch, category, reloadKey]);

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
    if (val) {
      setSearchParams({ category: val });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('');
    setPage(1);
    setSearchParams({});
  };

  const handleRetry = () => setReloadKey((k) => k + 1);

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push('...');
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) range.push('...');
      range.push(totalPages);
    }
    return range;
  };

  const hasFilters = Boolean(debouncedSearch || category);

  return (
    <div className="packages-page">
      {/* Editorial Header with subtle parallax */}
      <section
        className="position-relative overflow-hidden py-5"
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="position-absolute end-0 top-0 w-50 h-100 opacity-25 will-change-transform"
          style={{
            transform: `translate3d(0, ${headerParallax}px, 0)`,
            backgroundImage:
              'radial-gradient(circle at 70% 30%, rgba(154, 107, 47, 0.15), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <div className="editorial-eyebrow">
            <span>Portfolio & Collections</span>
          </div>
          <h1
            className="font-display mb-3"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 600 }}
          >
            Curated Event Packages
          </h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '640px', fontSize: '1.05rem' }}>
            Thoughtfully engineered packages that balance creative ambition with meticulous logistics.
            Select a package to view inclusions or customize your celebration.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-5">
        <div className="container">
          <PackageFilters
            search={search}
            category={category}
            onSearchChange={setSearch}
            onCategoryChange={handleCategoryChange}
          />

          {/* Result Metadata & Clear Button */}
          {!loading && !error && (
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-hairline)' }}>
              <div className="small text-secondary">
                Showing{' '}
                <strong className="text-primary">{packages.length}</strong> of{' '}
                <strong className="text-primary">{totalCount}</strong> package
                {totalCount !== 1 ? 's' : ''}
                {debouncedSearch && <span> matching “{debouncedSearch}”</span>}
                {category && <span className="text-capitalize"> in {category}</span>}
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 border-0"
                  style={{ fontSize: '0.8rem' }}
                >
                  <X size={14} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          )}

          {/* Loading, Error or Grid */}
          {loading ? (
            <div className="py-5 text-center">
              <Loader />
            </div>
          ) : error ? (
            <div className="py-5">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          ) : (
            <PackageGrid packages={packages} />
          )}

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <nav className="mt-5 pt-3" aria-label="Package pagination">
              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-luxury-outline p-2"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {getPaginationRange().map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`btn px-3 py-2 ${
                        p === page ? 'btn-luxury-primary' : 'btn-luxury-outline'
                      }`}
                      style={{ fontSize: '0.85rem' }}
                      aria-current={p === page ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="btn btn-luxury-outline p-2"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="text-center text-muted small mt-3">
                Page {page} of {totalPages}
              </div>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
