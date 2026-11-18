import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Minimalist luxury pagination component.
 * @param {number} currentPage - Active page number (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback with new page number
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <div className="d-flex justify-content-center align-items-center gap-1">
        <button
          type="button"
          className="btn btn-luxury-outline p-2"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`btn px-3 py-2 ${
              p === currentPage ? 'btn-luxury-primary' : 'btn-luxury-outline'
            }`}
            style={{ fontSize: '0.825rem' }}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-luxury-outline p-2"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
