import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getPackages } from '../services/packageService';
import BookingForm from '../components/booking/BookingForm';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import useParallax from '../hooks/useParallax';

export default function Booking() {
  const location = useLocation();
  const selectedPackageId = location.state?.packageId || '';

  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packagesError, setPackagesError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const headerParallax = useParallax(-0.1);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    setPackagesError('');
    try {
      const data = await getPackages({ limit: 100 });
      setPackages(data.packages || data || []);
    } catch (err) {
      setPackagesError(
        err?.response?.data?.message || err?.message || 'Failed to load packages.'
      );
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSuccess = () => {
    setBookingSuccess(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // ── Success Confirmation Screen ──
  if (bookingSuccess) {
    return (
      <div className="py-5 my-5">
        <div className="container py-4">
          <div
            className="card-luxury p-5 text-center max-w-xl mx-auto"
            style={{ maxWidth: '640px', backgroundColor: 'var(--bg-surface)' }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: 'var(--brand-gold-light)',
                color: 'var(--brand-gold)',
                border: '1px solid var(--brand-gold-border)',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div className="editorial-eyebrow justify-content-center">
              <span>Inquiry Received</span>
            </div>

            <h1 className="font-display fs-2 mb-3">Your Celebration is in Motion</h1>
            <p className="text-secondary mb-4" style={{ lineHeight: 1.8 }}>
              Thank you for trusting EventHive. Your event inquiry has been registered with our
              production studio. A Senior Event Director will review your date availability and
              contact you within 24 hours with concept sketches.
            </p>

            <div
              className="p-4 rounded-3 text-start mb-4"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h4 className="fs-6 fw-semibold mb-2">What Happens Next?</h4>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-center gap-2">
                  <span className="badge-minimal gold">1</span>
                  <span>Date & venue availability verification</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <span className="badge-minimal gold">2</span>
                  <span>Private moodboard & initial budget consultation call</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <span className="badge-minimal gold">3</span>
                  <span>Customized contract & vendor reservations</span>
                </li>
              </ul>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="btn-luxury-primary">
                <span>Return to Home</span>
              </Link>
              <Link to="/packages" className="btn-luxury-outline">
                <span>Explore More Portfolios</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page pb-5">
      {/* Editorial Header */}
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
              'radial-gradient(circle at 80% 20%, rgba(154, 107, 47, 0.2), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <div className="editorial-eyebrow">
            <span>The Reservation Atelier</span>
          </div>
          <h1
            className="font-display mb-3"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 600 }}
          >
            Reserve Your Celebration
          </h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
            Complete our guided inquiry questionnaire below. We respect your time and provide
            transparent estimates with zero hidden fees.
          </p>
        </div>
      </section>

      {/* Booking Wizard Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              {loadingPackages ? (
                <div className="py-5 text-center">
                  <Loader />
                </div>
              ) : (
                <>
                  {packagesError && (
                    <div className="p-3 mb-4 rounded-2 bg-light border text-muted small d-flex justify-content-between align-items-center">
                      <span>Live package catalog currently offline. You can still submit a custom inquiry.</span>
                      <button type="button" onClick={fetchPackages} className="btn btn-sm btn-link text-decoration-none">
                        Retry Connect
                      </button>
                    </div>
                  )}
                  <BookingForm
                    packages={packages}
                    selectedPackageId={selectedPackageId}
                    onSuccess={handleSuccess}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
