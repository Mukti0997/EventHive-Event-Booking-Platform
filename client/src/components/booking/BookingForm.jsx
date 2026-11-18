import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Heart,
  Briefcase,
  Cake,
  Gem,
} from 'lucide-react';
import { createBooking } from '../../services/bookingService';

const TODAY_DATE = new Date().toISOString().split('T')[0];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  package: '',
  eventType: '',
  eventDate: '',
  guestCount: '',
  venue: '',
  budget: '',
  message: '',
};

const eventTypes = [
  { value: 'wedding', label: 'Grand Wedding', icon: Gem, desc: 'Bespoke ceremony & reception' },
  { value: 'corporate', label: 'Corporate Gala', icon: Briefcase, desc: 'Summits, conferences & galas' },
  { value: 'birthday', label: 'Milestone Birthday', icon: Cake, desc: 'Celebrations & intimate parties' },
  { value: 'anniversary', label: 'Anniversary', icon: Heart, desc: 'Silver, Golden & milestone banquets' },
  { value: 'other', label: 'Bespoke Event', icon: Sparkles, desc: 'Custom curated gathering' },
];

export default function BookingForm({ packages = [], selectedPackageId = '', onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...initialForm, package: selectedPackageId || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (selectedPackageId) {
      setForm((prev) => ({ ...prev, package: selectedPackageId }));
    }
  }, [selectedPackageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const selectEventType = (val) => {
    setForm((prev) => ({ ...prev, eventType: val }));
    if (errors.eventType) {
      setErrors((prev) => ({ ...prev, eventType: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!form.eventType) errs.eventType = 'Please select your celebration occasion.';
      if (!form.eventDate) {
        errs.eventDate = 'Target event date is required.';
      } else {
        const selected = new Date(form.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected <= today) errs.eventDate = 'Event date must be in the future.';
      }
    } else if (currentStep === 2) {
      if (!form.guestCount) {
        errs.guestCount = 'Estimated guest count is required.';
      } else if (Number(form.guestCount) < 1) {
        errs.guestCount = 'Guest count must be at least 1.';
      }
    } else if (currentStep === 3) {
      if (!form.name.trim()) errs.name = 'Full name is required.';
      if (!form.email.trim()) {
        errs.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errs.email = 'Please provide a valid email address.';
      }
      if (!form.phone.trim()) {
        errs.phone = 'Mobile phone number is required.';
      } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
        errs.phone = 'Please provide a valid 10-digit Indian mobile number.';
      }
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Final validation
    const errs = { ...validateStep(1), ...validateStep(2), ...validateStep(3) };
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        eventType: form.eventType,
        eventDate: form.eventDate,
        guestCount: Number(form.guestCount),
        ...(form.package && { package: form.package }),
        ...(form.venue.trim() && { venue: form.venue.trim() }),
        ...(form.budget && { budget: Number(form.budget) }),
        ...(form.message.trim() && { message: form.message.trim() }),
      };

      await createBooking(payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please check your submission and try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedPkg = packages.find((p) => p._id === form.package);

  return (
    <div
      className="card-luxury p-4 p-md-5"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Wizard Step Progress Bar */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {['Occasion', 'Scope', 'Contact', 'Review'].map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div key={label} className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '28px',
                    height: '28px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: isCompleted
                      ? 'var(--brand-gold)'
                      : isCurrent
                      ? 'var(--brand-primary)'
                      : 'var(--bg-surface-subtle)',
                    color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : `0${stepNum}`}
                </span>
                <span
                  className="d-none d-sm-inline small fw-medium"
                  style={{
                    color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bar */}
        <div
          className="w-100 rounded-pill overflow-hidden"
          style={{ height: '4px', backgroundColor: 'var(--border-subtle)' }}
        >
          <div
            style={{
              width: `${((step - 1) / 3) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--brand-gold)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {apiError && (
        <div
          className="p-3 mb-4 rounded-2 text-danger small border border-danger-subtle"
          style={{ backgroundColor: 'var(--status-cancelled-bg)' }}
        >
          {apiError}
        </div>
      )}

      {/* =========================================================================
          STEP 1: THE OCCASION
          ========================================================================= */}
      {step === 1 && (
        <div className="wizard-step">
          <div className="editorial-eyebrow">
            <span>Step 01 / 04</span>
          </div>
          <h2 className="font-display fs-3 mb-2">What are you celebrating?</h2>
          <p className="text-secondary small mb-4">
            Select your occasion to help our event directors pair the ideal decor, acoustics, and
            catering.
          </p>

          <div className="row g-3 mb-4">
            {eventTypes.map((et) => {
              const Icon = et.icon;
              const isSelected = form.eventType === et.value;
              return (
                <div key={et.value} className="col-sm-6 col-12">
                  <button
                    type="button"
                    onClick={() => selectEventType(et.value)}
                    className="w-100 text-start p-3 rounded-2 transition-all"
                    style={{
                      backgroundColor: isSelected ? 'var(--brand-gold-light)' : 'var(--bg-surface)',
                      border: isSelected
                        ? '1.5px solid var(--brand-gold)'
                        : '1px solid var(--border-subtle)',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="p-2 rounded-2"
                        style={{
                          backgroundColor: isSelected ? '#ffffff' : 'var(--bg-surface-subtle)',
                          color: isSelected ? 'var(--brand-gold)' : 'var(--text-secondary)',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="fw-semibold text-primary">{et.label}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {et.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          {errors.eventType && (
            <div className="text-danger small mb-3">{errors.eventType}</div>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Target Date *</label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className="form-control-luxury"
                min={TODAY_DATE}
              />
              {errors.eventDate && (
                <div className="text-danger small mt-1">{errors.eventDate}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label-luxury">Destination / Preferred Venue</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g. Radisson Mathura, Heritage Haveli, Private Estate"
                className="form-control-luxury"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: SCOPE & PACKAGE
          ========================================================================= */}
      {step === 2 && (
        <div className="wizard-step">
          <div className="editorial-eyebrow">
            <span>Step 02 / 04</span>
          </div>
          <h2 className="font-display fs-3 mb-2">Scope & Scale</h2>
          <p className="text-secondary small mb-4">
            Specify the number of guests and select or customize a base package.
          </p>

          <div className="mb-4">
            <label className="form-label-luxury">Estimated Guest Count *</label>
            <div className="position-relative" style={{ maxWidth: '300px' }}>
              <input
                type="number"
                name="guestCount"
                value={form.guestCount}
                onChange={handleChange}
                placeholder="e.g. 150"
                min="1"
                className="form-control-luxury"
              />
              <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted small">
                Guests
              </span>
            </div>
            {errors.guestCount && (
              <div className="text-danger small mt-1">{errors.guestCount}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label-luxury">Curated Base Package (Optional)</label>
            <select
              name="package"
              value={form.package}
              onChange={handleChange}
              className="form-control-luxury"
            >
              <option value="">— Select a package or request 100% custom tailoring —</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.title} (₹{pkg.price?.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
            {selectedPkg && (
              <div className="mt-2 p-3 rounded-2 bg-light border small text-muted">
                <strong>{selectedPkg.title}</strong> includes {selectedPkg.capacity || 200} guests,{' '}
                {selectedPkg.duration || 'full day'}, and premium decor coordination.
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label-luxury">Estimated Budget Range (₹ INR)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 350000"
              className="form-control-luxury"
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: CONTACT & VISION
          ========================================================================= */}
      {step === 3 && (
        <div className="wizard-step">
          <div className="editorial-eyebrow">
            <span>Step 03 / 04</span>
          </div>
          <h2 className="font-display fs-3 mb-2">Host Information</h2>
          <p className="text-secondary small mb-4">
            Our Senior Event Director will connect with you directly to present concept moodboards.
          </p>

          <div className="row g-3 mb-3">
            <div className="col-12">
              <label className="form-label-luxury">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Radhika Singhania"
                className="form-control-luxury"
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-luxury">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="radhika@example.com"
                className="form-control-luxury"
              />
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-luxury">Phone (10-digit Indian Mobile) *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                className="form-control-luxury"
              />
              {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label-luxury">Special Requests or Vision Notes</label>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your aesthetic preferences, floral desires, entertainment, or special dietary requirements..."
              className="form-control-luxury"
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: REVIEW & CONFIRMATION
          ========================================================================= */}
      {step === 4 && (
        <div className="wizard-step">
          <div className="editorial-eyebrow">
            <span>Step 04 / 04</span>
          </div>
          <h2 className="font-display fs-3 mb-2">Review Reservation Details</h2>
          <p className="text-secondary small mb-4">
            Verify your celebration outline before sending to our planning atelier.
          </p>

          <div
            className="p-4 rounded-2 mb-4"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="row g-3 small">
              <div className="col-sm-6">
                <span className="text-muted d-block">Occasion</span>
                <strong className="text-capitalize fs-6">{form.eventType}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted d-block">Target Date</span>
                <strong className="fs-6">{form.eventDate}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted d-block">Estimated Guests</span>
                <strong className="fs-6">{form.guestCount} Guests</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted d-block">Selected Package</span>
                <strong className="fs-6">{selectedPkg ? selectedPkg.title : 'Bespoke Custom'}</strong>
              </div>
              {form.venue && (
                <div className="col-12">
                  <span className="text-muted d-block">Venue Preference</span>
                  <strong>{form.venue}</strong>
                </div>
              )}
              <div className="col-sm-6">
                <span className="text-muted d-block">Host Name</span>
                <strong>{form.name}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted d-block">Contact Phone & Email</span>
                <strong>
                  {form.phone} • {form.email}
                </strong>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 p-3 rounded-2 bg-light border small text-muted mb-4">
            <ShieldCheck size={18} className="text-success flex-shrink-0" />
            <span>
              Submitting an inquiry places a priority hold on your date for 48 hours without immediate payment.
            </span>
          </div>
        </div>
      )}

      {/* Wizard Step Controls */}
      <div className="d-flex justify-content-between align-items-center pt-4 border-top mt-4" style={{ borderColor: 'var(--border-hairline)' }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="btn-luxury-outline"
            disabled={loading}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button type="button" onClick={handleNext} className="btn-luxury-primary">
            <span>Continue</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-luxury-gold px-4 py-3"
          >
            {loading ? (
              <span>Orchestrating Request...</span>
            ) : (
              <>
                <span>Confirm & Submit Inquiry</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
