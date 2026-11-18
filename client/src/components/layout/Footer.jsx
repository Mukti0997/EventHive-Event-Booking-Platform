import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-inverse)',
        paddingTop: '80px',
        paddingBottom: '40px',
        borderTop: '1px solid var(--border-dark)',
      }}
    >
      <div className="container">
        <div className="row g-5 pb-5 border-bottom" style={{ borderColor: 'var(--bg-dark-border)' }}>
          {/* Brand Manifesto */}
          <div className="col-lg-4 col-md-6">
            <Link
              to="/"
              className="d-inline-flex align-items-center mb-3 text-decoration-none"
              style={{ color: '#ffffff' }}
            >
              <span className="font-display fs-4 fw-bold">EventHive</span>
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold)',
                  marginLeft: '4px',
                }}
              />
            </Link>
            <p
              className="pe-lg-4"
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.7,
              }}
            >
              A bespoke event management atelier dedicated to orchestrating meaningful celebrations,
              memorable milestones, and high-impact corporate summits with architectural precision.
            </p>
            <div className="d-flex align-items-center gap-2 mt-4 text-white-50 small">
              <MapPin size={15} className="text-warning" />
              <span>Mathura • Delhi NCR • Pan-India</span>
            </div>
          </div>

          {/* Curated Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <h4
              className="text-uppercase mb-3"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                color: 'var(--brand-gold)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              Curated Occasions
            </h4>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '0.875rem' }}>
              <li>
                <Link to="/packages?category=wedding" className="text-white-50 text-decoration-none hover-white">
                  Grand Weddings
                </Link>
              </li>
              <li>
                <Link to="/packages?category=corporate" className="text-white-50 text-decoration-none hover-white">
                  Corporate Galas
                </Link>
              </li>
              <li>
                <Link to="/packages?category=birthday" className="text-white-50 text-decoration-none hover-white">
                  Milestone Birthdays
                </Link>
              </li>
              <li>
                <Link to="/packages?category=anniversary" className="text-white-50 text-decoration-none hover-white">
                  Anniversaries
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-white-50 text-decoration-none hover-white">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Navigation */}
          <div className="col-lg-2 col-md-6 col-6">
            <h4
              className="text-uppercase mb-3"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                color: 'var(--brand-gold)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              The Studio
            </h4>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '0.875rem' }}>
              <li>
                <Link to="/about" className="text-white-50 text-decoration-none hover-white">
                  About EventHive
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50 text-decoration-none hover-white">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-white-50 text-decoration-none hover-white">
                  Reserve a Date
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-white-50 text-decoration-none hover-white">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Consultation */}
          <div className="col-lg-4 col-md-6">
            <h4
              className="text-uppercase mb-3"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                color: 'var(--brand-gold)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              Begin Your Journey
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Let’s design an experience that leaves a lasting impression. Schedule a private consultation today.
            </p>
            <div className="d-flex flex-column gap-2 mb-4">
              <a
                href="mailto:concierge@eventhive.in"
                className="d-flex align-items-center gap-2 text-white-50 text-decoration-none hover-white"
                style={{ fontSize: '0.875rem' }}
              >
                <Mail size={15} />
                <span>concierge@eventhive.in</span>
              </a>
              <a
                href="tel:+919876543210"
                className="d-flex align-items-center gap-2 text-white-50 text-decoration-none hover-white"
                style={{ fontSize: '0.875rem' }}
              >
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </a>
            </div>

            <Link
              to="/book"
              className="btn-luxury-gold w-100 justify-content-center"
              style={{ fontSize: '0.825rem', padding: '0.65rem 1.25rem' }}
            >
              <span>Request Private Consultation</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-4 text-white-50 small">
          <p className="mb-2 mb-sm-0">
            © {year} EventHive Experience Management Pvt Ltd. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            <span className="text-white-50">Handcrafted with architectural precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
