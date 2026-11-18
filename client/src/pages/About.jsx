import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, ShieldCheck, Trophy } from 'lucide-react';
import useParallax from '../hooks/useParallax';
import useCounter from '../hooks/useCounter';

const values = [
  {
    icon: Sparkles,
    title: 'Architectural Creativity',
    description:
      'We reject cookie-cutter formulas. Every celebration is conceived from a blank slate to mirror your personal aesthetic and story.',
  },
  {
    icon: ShieldCheck,
    title: 'Logistical Rigor',
    description:
      'Timelines orchestrated to the second, back-up generators, duplicate floral stocks, and calm command under pressure.',
  },
  {
    icon: Trophy,
    title: 'Excellence Without Compromise',
    description:
      'We curate only certified master florists, bespoke lighting artists, and Michelin-trained catering partners.',
  },
];

const team = [
  {
    name: 'Priya Sharma',
    role: 'Founder & Creative Director',
    bio: 'Former architectural designer who founded EventHive to treat milestone celebrations as living, emotive spatial experiences.',
  },
  {
    name: 'Rahul Verma',
    role: 'Head of Technical Production',
    bio: 'Directs complex acoustic setups, intelligent kinetic lighting rigs, and precision vendor choreography across North India.',
  },
  {
    name: 'Ananya Gupta',
    role: 'Director of Floral & Scenography',
    bio: 'Renowned for botanical installations and immersive cultural tablecapes that redefine wedding and gala environments.',
  },
];

function StatBlock({ value, label }) {
  const [count, ref] = useCounter(value, 1600);
  return (
    <div ref={ref} className="text-center p-3">
      <div
        className="font-display fw-bold mb-1"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--brand-gold)' }}
      >
        {count}+
      </div>
      <div className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  );
}

export default function About() {
  const headerParallax = useParallax(-0.1);

  return (
    <div className="about-page pb-5">
      {/* Header */}
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
              'radial-gradient(circle at 75% 25%, rgba(154, 107, 47, 0.2), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <div className="editorial-eyebrow">
            <span>The Atelier Story</span>
          </div>
          <h1
            className="font-display mb-3"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 600 }}
          >
            We curate moments <br />
            <span className="italic-serif" style={{ color: 'var(--brand-gold)' }}>
              that linger for generations.
            </span>
          </h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '640px', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Born in Mathura and serving heritage destinations across India, EventHive bridges
            timeless cultural reverence with modern architectural production.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="editorial-eyebrow">
                <span>Our Philosophy</span>
              </div>
              <h2 className="font-display fs-2 mb-4">Celebrations as Living Art</h2>
              <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                An event is not merely an assembly of tents, flowers, and microphones. It is a sensory
                journey that begins the second a guest steps into the threshold and remains in their
                memory decades later.
              </p>
              <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                At EventHive, we act as both architect and conductor. We coordinate every minute
                dimension—spatial layout, light temperature, acoustic resonance, culinary pacing—so our
                hosts can truly be guests at their own celebration.
              </p>

              <div className="mt-4 pt-2">
                <Link to="/packages" className="btn-luxury-primary">
                  <span>Explore Our Collections</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="card-luxury p-3 shadow-md"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <div
                  className="card-luxury-image-wrap rounded-3"
                  style={{ height: '400px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80"
                    alt="Event production setup"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Impact */}
      <section className="py-5 bg-white border-top border-bottom" style={{ borderColor: 'var(--border-hairline)' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <StatBlock value={500} label="Curated Events" />
            </div>
            <div className="col-6 col-md-3">
              <StatBlock value={1200} label="Happy Families" />
            </div>
            <div className="col-6 col-md-3">
              <StatBlock value={12} label="Years of Excellence" />
            </div>
            <div className="col-6 col-md-3">
              <StatBlock value={45} label="Production Artisans" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <div className="editorial-eyebrow justify-content-center">
              <span>Principles</span>
            </div>
            <h2 className="font-display fs-2 mb-3">The Pillars of Our Craft</h2>
          </div>

          <div className="row g-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="col-md-4">
                  <div
                    className="p-4 rounded-3 h-100"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="d-inline-flex p-3 rounded-2 mb-3"
                      style={{
                        backgroundColor: 'var(--brand-gold-light)',
                        color: 'var(--brand-gold)',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="fs-5 fw-semibold mb-2">{v.title}</h3>
                    <p className="text-secondary small mb-0" style={{ lineHeight: 1.7 }}>
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Production Leadership */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <div className="editorial-eyebrow justify-content-center">
              <span>Leadership</span>
            </div>
            <h2 className="font-display fs-2 mb-3">Meet the Directors</h2>
            <p className="text-secondary" style={{ maxWidth: '520px', margin: '0 auto' }}>
              The seasoned visionaries responsible for crafting high-profile gatherings across India.
            </p>
          </div>

          <div className="row g-4">
            {team.map((m, idx) => (
              <div key={idx} className="col-md-4">
                <div
                  className="card-luxury p-4 h-100 d-flex flex-column"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <div
                    className="font-display fw-bold mb-3"
                    style={{ fontSize: '1.75rem', color: 'var(--brand-gold)' }}
                  >
                    0{idx + 1}
                  </div>
                  <h3 className="fs-5 fw-semibold mb-1">{m.name}</h3>
                  <div className="small text-muted mb-3 fw-medium">{m.role}</div>
                  <p className="text-secondary small mb-0 flex-grow-1" style={{ lineHeight: 1.7 }}>
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
