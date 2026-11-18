import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { admin, loginAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin', { replace: true });
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await login({ email, password });
      loginAdmin(data);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Invalid administrator credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'var(--bg-dark)',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(154, 107, 47, 0.15), transparent 60%)',
      }}
    >
      <div className="mb-4">
        <Link
          to="/"
          className="text-white-50 text-decoration-none small d-inline-flex align-items-center gap-2 hover-white"
        >
          <ArrowLeft size={15} />
          <span>Return to EventHive Site</span>
        </Link>
      </div>

      <div
        className="card-luxury p-4 p-sm-5 shadow-lg"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-dark-card)',
          border: '1px solid var(--bg-dark-border)',
        }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{
              backgroundColor: 'rgba(154, 107, 47, 0.15)',
              color: 'var(--brand-gold)',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-display fs-3 text-white mb-1">Production Console</h1>
          <p className="text-white-50 small mb-0">Authorized EventHive administrators only</p>
        </div>

        {error && (
          <div
            className="p-3 mb-4 rounded-2 small text-danger border border-danger-subtle"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label-luxury text-white-50">Email Address</label>
            <div className="position-relative">
              <Mail
                size={16}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@eventhive.com"
                required
                className="form-control ps-5 text-white"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-dark-border)',
                  borderRadius: '4px',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label-luxury text-white-50">Master Password</label>
            <div className="position-relative">
              <Lock
                size={16}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="form-control ps-5 text-white"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-dark-border)',
                  borderRadius: '4px',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-luxury-gold w-100 justify-content-center py-3"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: 'var(--bg-dark-border)' }}>
          <span className="text-white-50" style={{ fontSize: '0.75rem' }}>
            Seed Credentials: <code>admin@eventhive.com</code> / <code>admin123</code>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
