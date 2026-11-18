import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Clean error message with retry trigger.
 * @param {string} message - Error message
 * @param {Function} onRetry - Optional retry callback
 */
const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div
      className="p-4 rounded-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 text-danger border border-danger-subtle mx-auto my-3"
      style={{
        backgroundColor: 'var(--status-cancelled-bg)',
        maxWidth: '640px',
      }}
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        <AlertCircle size={20} className="flex-shrink-0" />
        <span className="small">{message}</span>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 border-0 fw-semibold"
          style={{ fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
