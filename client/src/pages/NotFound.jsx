import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center text-center p-4"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      <div className="container py-5" style={{ maxWidth: '580px' }}>
        <div className="editorial-eyebrow justify-content-center mb-2">
          <span>Error 404</span>
        </div>

        <h1
          className="font-display fw-bold mb-3"
          style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            color: 'var(--brand-gold)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          404
        </h1>

        <h2 className="fs-3 fw-semibold mb-3">Destination Undefined</h2>
        <p className="text-secondary mb-5" style={{ lineHeight: 1.8 }}>
          The occasion or portfolio you are seeking does not reside at this address. Let our event
          concierge guide you back.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn-luxury-primary">
            <ArrowLeft size={16} />
            <span>Return to Atelier Home</span>
          </Link>
          <Link to="/packages" className="btn-luxury-outline">
            <span>Explore Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
