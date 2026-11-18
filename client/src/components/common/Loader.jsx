/**
 * Minimalist luxury loader spinner.
 * @param {boolean} fullScreen - If true, center in the full viewport
 */
const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center gap-3">
      <div
        className="spinner-border"
        role="status"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          color: 'var(--brand-gold)',
          borderWidth: '2px',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span
        className="editorial-eyebrow text-muted"
        style={{ fontSize: '0.7rem', letterSpacing: '0.12em', margin: 0 }}
      >
        Curating Experience
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}
      >
        {content}
      </div>
    );
  }

  return <div className="d-flex justify-content-center align-items-center py-5">{content}</div>;
};

export default Loader;
