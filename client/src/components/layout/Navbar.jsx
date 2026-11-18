import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useScrollProgress from '../../hooks/useScrollProgress';

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Curated Packages' },
  { to: '/about', label: 'The Studio' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollProgress(20);
  const { admin } = useAuth();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`sticky-top transition-all ${
          isScrolled ? 'nav-scrolled' : 'nav-transparent'
        }`}
        style={{
          height: '74px',
          backgroundColor: isScrolled ? 'rgba(252, 251, 249, 0.92)' : 'var(--bg-canvas)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1030,
        }}
      >
        <div className="container h-100 d-flex align-items-center justify-content-between">
          {/* Brand Wordmark */}
          <Link
            to="/"
            onClick={closeMenu}
            className="d-flex align-items-center text-decoration-none"
            style={{ color: 'var(--text-primary)' }}
          >
            <span
              className="font-display"
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              EventHive
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-gold)',
                marginLeft: '4px',
                marginBottom: '4px',
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-4">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-decoration-none px-2 py-1 ${
                    isActive ? 'fw-semibold' : ''
                  }`
                }
                style={({ isActive }) => ({
                  fontSize: '0.875rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  letterSpacing: '0.01em',
                  position: 'relative',
                  transition: 'color 0.2s ease',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-3">
            {admin ? (
              <Link
                to="/admin"
                className="d-none d-sm-inline-flex align-items-center gap-1 badge-minimal"
                style={{ textDecoration: 'none' }}
              >
                <ShieldCheck size={14} className="text-primary" />
                <span>Admin Console</span>
              </Link>
            ) : null}

            <Link
              to="/book"
              className="btn-luxury-primary d-none d-sm-inline-flex"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.825rem' }}
            >
              <span>Plan an Event</span>
              <ArrowUpRight size={14} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="d-lg-none btn p-1 border-0"
              style={{ color: 'var(--text-primary)' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none position-fixed w-100 h-100 top-0 start-0"
          style={{
            backgroundColor: 'rgba(252, 251, 249, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 1025,
            paddingTop: '90px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }}
        >
          <div className="d-flex flex-column gap-3">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="text-decoration-none py-2 font-display"
                style={({ isActive }) => ({
                  fontSize: '1.65rem',
                  color: isActive ? 'var(--brand-gold)' : 'var(--text-primary)',
                  borderBottom: '1px solid var(--border-hairline)',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-4 pt-2">
              <Link
                to="/book"
                onClick={closeMenu}
                className="btn-luxury-primary w-100 justify-content-center py-3"
              >
                <span>Plan an Event</span>
                <ArrowUpRight size={16} />
              </Link>

              {admin && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="btn-luxury-outline w-100 justify-content-center py-3 mt-2"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
