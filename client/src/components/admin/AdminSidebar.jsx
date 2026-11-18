import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Inquiries & Leads', icon: Users, end: false },
  { to: '/admin/packages', label: 'Package Catalog', icon: Package, end: false },
];

const AdminSidebar = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        borderRight: '1px solid var(--border-dark)',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-4 border-bottom"
        style={{ borderColor: 'var(--bg-dark-border)' }}
      >
        {!collapsed && (
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-1 text-white">
            <span className="font-display fs-5 fw-bold">EventHive</span>
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-gold)',
              }}
            />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-sm text-white-50 p-1 border-0 hover-white ms-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="p-2 flex-grow-1 mt-2">
        {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 px-3 py-2 rounded-2 mb-1 text-decoration-none transition-all ${
                isActive ? 'fw-semibold' : 'text-white-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--brand-gold)' : 'transparent',
              color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.875rem',
            })}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        <div className="my-3 border-top" style={{ borderColor: 'var(--bg-dark-border)' }} />

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-white-50 text-decoration-none small hover-white"
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {!collapsed && <span>View Live Site</span>}
        </Link>
      </nav>

      {/* Admin Profile Footer */}
      <div
        className="p-3 border-top"
        style={{ borderColor: 'var(--bg-dark-border)', backgroundColor: 'var(--bg-dark-card)' }}
      >
        <div className="d-flex align-items-center justify-content-between">
          {!collapsed && (
            <div className="overflow-hidden pe-2">
              <div className="text-white small fw-semibold text-truncate">
                {admin?.name || 'Administrator'}
              </div>
              <div className="text-white-50 text-truncate" style={{ fontSize: '0.72rem' }}>
                {admin?.email || 'admin@eventhive.in'}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-sm text-danger p-1 border-0"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
