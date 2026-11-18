import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Sparkles,
  Users,
  ChevronRight,
  Shield,
  Star,
} from 'lucide-react';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import useParallax from '../hooks/useParallax';
import useCounter from '../hooks/useCounter';

const marqueeItems = [
  'Grand Weddings',
  'Corporate Galas',
  'Milestone Birthdays',
  'Curated Soirées',
  'Luxury Receptions',
  'Destination Celebrations',
  'Executive Summits',
  'Anniversary Banquets',
];

const pillars = [
  {
    number: '01',
    title: 'Vision & Architecture',
    description:
      'We begin with your aesthetic narrative. Every celebration is tailored from a blank canvas, aligning mood, culinary choices, and flow to your personality.',
  },
  {
    number: '02',
    title: 'Curated Vendor Network',
    description:
      'Gain privileged access to our vetted coterie of master florists, Michelin-level caterers, bespoke lighting designers, and acousticians.',
  },
  {
    number: '03',
    title: 'Flawless Execution',
    description:
      'On the day of the event, our seasoned production directors coordinate every minute cue invisibly so you remain fully present in the moment.',
  },
];

const testimonials = [
  {
    quote:
      'EventHive transformed our wedding in Mathura into an ethereal royal sanctuary. Every single floral arrangement, lighting cue, and transition was executed with sheer architectural perfection.',
    author: 'Sneha & Arjun Kapoor',
    location: 'Wedding at Heritage Palace, Mathura',
    rating: 5,
  },
  {
    quote:
      'Organizing our 350-attendee annual tech summit was effortless thanks to EventHive. Their team anticipates logistics with remarkable composure and precision.',
    author: 'Ramesh Agarwal',
    location: 'Managing Director, Apex Dynamics',
    rating: 5,
  },
  {
    quote:
      'From the live jazz quartet to the bespoke sensory dining, my milestone celebration was unforgettable. Truly the premier event management atelier in North India.',
    author: 'Pooja Sharma',
    location: 'Milestone Celebration, New Delhi',
    rating: 5,
  },
];

function StatItem({ value, label, suffix = '+' }) {
  const [count, ref] = useCounter(value, 1800);

  return (
    <div ref={ref} className="text-center p-3">
      <div
        className="font-display fw-bold mb-1"
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {count}
        <span style={{ color: 'var(--brand-gold)' }}>{suffix}</span>
      </div>
      <div
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Parallax offsets
  const bgParallax = useParallax(-0.12);
  const cardParallax = useParallax(0.06);

  useEffect(() => {
    let ignore = false;
    const fetchFeatured = async () => {
      try {
        const data = await getPackages({ featured: true, limit: 6 });
        if (!ignore) {
          setFeaturedPackages(data.packages || data || []);
        }
      } catch (err) {
        console.error('Failed to fetch featured packages:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredPackages =
    selectedCategory === 'all'
      ? featuredPackages
      : featuredPackages.filter(
          (pkg) => pkg.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="home-container">
      {/* =========================================================================
          HERO SECTION (Minimalist Typography & Parallax)
          ========================================================================= */}
      <section className="parallax-hero-wrapper pt-5 pb-5">
        <div className="parallax-decor-grid" aria-hidden="true" />
        <div
          className="parallax-bg-glow will-change-transform"
          style={{ transform: `translate3d(0, ${bgParallax}px, 0)` }}
          aria-hidden="true"
        />

        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="editorial-eyebrow">
                <span>Atelier of Curated Celebrations</span>
              </div>

              <h1
                className="font-display mb-4"
                style={{
                  fontSize: 'clamp(2.75rem, 6vw, 4.75rem)',
                  lineHeight: 1.08,
                  fontWeight: 600,
                }}
              >
                Make room for <br />
                <span className="italic-serif" style={{ color: 'var(--brand-gold)' }}>
                  moments that matter.
                </span>
              </h1>

              <p
                className="mb-5 text-secondary"
                style={{
                  fontSize: '1.15rem',
                  lineHeight: 1.8,
                  maxWidth: '560px',
                }}
              >
                EventHive conceives, designs, and flawlessly produces celebrations of distinction.
                From grand destination weddings to intimate galas and high-profile corporate summits.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/packages" className="btn-luxury-primary">
                  <span>Explore Collections</span>
                  <ArrowUpRight size={16} />
                </Link>

                <Link to="/book" className="btn-luxury-outline">
                  <span>Schedule Consultation</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="d-flex flex-wrap align-items-center gap-4 mt-5 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex align-items-center gap-2">
                  <Shield size={16} style={{ color: 'var(--brand-gold)' }} />
                  <span className="small text-muted fw-medium">Certified Event Producers</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Star size={16} style={{ color: 'var(--brand-gold)' }} />
                  <span className="small text-muted fw-medium">4.9/5 Across 500+ Reviews</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Composition with Parallax Tilt */}
            <div className="col-lg-5">
              <div
                className="position-relative will-change-transform"
                style={{ transform: `translate3d(0, ${cardParallax}px, 0)` }}
              >
                {/* Hero Editorial Card */}
                <div
                  className="card-luxury p-3 shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    transform: 'rotate(1deg)',
                  }}
                >
                  <div
                    className="card-luxury-image-wrap rounded-3 mb-3"
                    style={{ height: '380px' }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
                      alt="Luxurious wedding event decor"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-end p-2">
                    <div>
                      <span className="badge-minimal gold mb-1">Signature Experience</span>
                      <h3 className="fs-5 mb-0 fw-semibold">The Royal Courtyard</h3>
                    </div>
                    <Link
                      to="/packages"
                      className="btn-luxury-primary py-2 px-3"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <span>View</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Floating Parallax Pill */}
                <div
                  className="position-absolute d-none d-sm-flex align-items-center gap-3 p-3 rounded-3 shadow-md"
                  style={{
                    bottom: '-24px',
                    left: '-32px',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border-subtle)',
                    zIndex: 2,
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'var(--brand-gold-light)',
                      color: 'var(--brand-gold)',
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="fw-semibold text-primary" style={{ fontSize: '0.85rem' }}>
                      Bespoke Tailoring
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      100% custom itinerary & design
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KINETIC TICKER (Infinite Smooth Marquee)
          ========================================================================= */}
      <section className="ticker-wrap" aria-label="Event specializations">
        <div className="ticker-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="ticker-item">
              <span>{item}</span>
              <span className="ticker-dot" />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CURATED PACKAGES SHOWCASE
          ========================================================================= */}
      <section className="py-5 my-4">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5 gap-3">
            <div>
              <div className="editorial-eyebrow">
                <span>Curated Portfolios</span>
              </div>
              <h2 className="font-display fs-1 mb-2">Signature Packages</h2>
              <p className="text-muted mb-0" style={{ maxWidth: '520px' }}>
                Pre-conceived event architectures thoughtfully priced with premier amenities, fully
                adaptable to your guest tier.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="d-flex flex-wrap gap-2">
              {['all', 'wedding', 'corporate', 'birthday', 'anniversary'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn py-2 px-3 text-capitalize rounded-2 transition-all ${
                    selectedCategory === cat
                      ? 'btn-dark'
                      : 'btn-outline-secondary border-subtle'
                  }`}
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  {cat === 'all' ? 'All Occasions' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Display */}
          {loading ? (
            <div className="py-5 text-center">
              <Loader />
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-5 border rounded-3 p-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <p className="text-muted mb-3">No packages currently match this category.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="btn-luxury-outline"
              >
                <span>View All Collections</span>
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredPackages.map((pkg) => {
                const fallbackImg =
                  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';
                const image = pkg.images?.[0] || fallbackImg;

                return (
                  <div key={pkg._id} className="col-lg-4 col-md-6">
                    <div className="card-luxury h-100 d-flex flex-column">
                      <div className="card-luxury-image-wrap" style={{ height: '240px' }}>
                        <img
                          src={image}
                          alt={pkg.title}
                          onError={(e) => {
                            e.target.src = fallbackImg;
                          }}
                        />
                        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
                          <span className="badge-minimal">
                            {pkg.category || 'Package'}
                          </span>
                          {pkg.isFeatured && (
                            <span className="badge-minimal gold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                          <h3 className="fs-5 mb-0 fw-semibold">{pkg.title}</h3>
                          <span
                            className="font-display fw-bold"
                            style={{ color: 'var(--brand-gold)', fontSize: '1.25rem' }}
                          >
                            ₹{pkg.price?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <p
                          className="text-secondary small mb-3 flex-grow-1"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {pkg.description}
                        </p>

                        <div
                          className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto"
                          style={{ borderColor: 'var(--border-hairline)' }}
                        >
                          <div className="d-flex align-items-center gap-1 text-muted small">
                            <Users size={14} />
                            <span>Up to {pkg.capacity || 200} guests</span>
                          </div>

                          <Link
                            to={`/packages/${pkg._id}`}
                            className="text-primary text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1 hover-gold"
                          >
                            <span>Explore Details</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/packages" className="btn-luxury-outline px-4">
              <span>View Complete Portfolio ({featuredPackages.length} Available)</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE ATELIER METHOD (01, 02, 03 Pillars)
          ========================================================================= */}
      <section
        className="py-5"
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-4">
              <div className="editorial-eyebrow">
                <span>The Production Method</span>
              </div>
              <h2 className="font-display fs-1 mb-3">
                How We Bring <br />
                <span className="italic-serif">Vision to Reality</span>
              </h2>
              <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                We treat every event not merely as logistics, but as a temporary architecture of
                memory. Each stage is managed by a dedicated production lead.
              </p>
              <Link to="/about" className="btn-luxury-primary mt-2">
                <span>Our Philosophy</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="col-lg-8">
              <div className="row g-4">
                {pillars.map((pillar) => (
                  <div key={pillar.number} className="col-md-4">
                    <div
                      className="p-4 rounded-3 h-100"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div
                        className="font-display fw-bold mb-3"
                        style={{
                          fontSize: '2rem',
                          color: 'var(--brand-gold)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {pillar.number}
                      </div>
                      <h3 className="fs-5 fw-semibold mb-2">{pillar.title}</h3>
                      <p className="text-secondary small mb-0" style={{ lineHeight: 1.6 }}>
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NUMERIC ROLLUP METRICS SECTION
          ========================================================================= */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4 justify-content-center">
            <div className="col-6 col-md-3">
              <StatItem value={500} label="Events Orchestrated" />
            </div>
            <div className="col-6 col-md-3">
              <StatItem value={1200} label="Celebrated Families" />
            </div>
            <div className="col-6 col-md-3">
              <StatItem value={12} label="Years Production Exp" />
            </div>
            <div className="col-6 col-md-3">
              <StatItem value={99} label="Flawless Execution %" suffix="%" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLIENT REVIEWS & TESTIMONIALS
          ========================================================================= */}
      <section
        className="py-5"
        style={{
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--text-inverse)',
        }}
      >
        <div className="container py-5">
          <div className="text-center max-w-xl mx-auto mb-5">
            <div className="editorial-eyebrow text-warning mb-2">
              <span>Client Testimonials</span>
            </div>
            <h2 className="font-display fs-1 text-white mb-3">Words from Hosts</h2>
            <p className="text-white-50" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Reflections from families and corporate partners whose most important milestones we
              had the honor of shaping.
            </p>
          </div>

          <div className="row g-4">
            {testimonials.map((t, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="p-4 rounded-3 h-100 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: 'var(--bg-dark-card)',
                    border: '1px solid var(--bg-dark-border)',
                  }}
                >
                  <div>
                    <div className="d-flex gap-1 text-warning mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#D4AF37" color="#D4AF37" />
                      ))}
                    </div>
                    <p
                      className="text-white-50 fst-italic mb-4"
                      style={{ fontSize: '0.95rem', lineHeight: 1.7 }}
                    >
                      “{t.quote}”
                    </p>
                  </div>

                  <div className="pt-3 border-top" style={{ borderColor: 'var(--bg-dark-border)' }}>
                    <div className="fw-semibold text-white fs-6">{t.author}</div>
                    <div className="text-muted small">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL PARALLAX CALL TO ACTION
          ========================================================================= */}
      <section className="py-5 text-center position-relative overflow-hidden">
        <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
          <div className="editorial-eyebrow justify-content-center">
            <span>Your Next Milestone</span>
          </div>
          <h2
            className="font-display mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600 }}
          >
            Let us craft your next <br />
            <span className="italic-serif" style={{ color: 'var(--brand-gold)' }}>
              unforgettable experience.
            </span>
          </h2>
          <p
            className="text-secondary mx-auto mb-4"
            style={{ maxWidth: '540px', fontSize: '1.05rem' }}
          >
            Dates for prime celebration seasons fill months in advance. Secure a private design
            consultation with our event directors.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/book" className="btn-luxury-primary px-4 py-3">
              <span>Initiate Event Inquiry</span>
              <ArrowUpRight size={16} />
            </Link>
            <Link to="/contact" className="btn-luxury-outline px-4 py-3">
              <span>Connect with Atelier</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
