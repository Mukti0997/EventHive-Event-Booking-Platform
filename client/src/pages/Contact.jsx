import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send, ArrowUpRight, ShieldCheck } from 'lucide-react';
import useParallax from '../hooks/useParallax';

const studioOffices = [
  {
    icon: MapPin,
    title: 'Studio Headquarters',
    details: ['EventHive Atelier', 'Civil Lines, Near Vishram Ghat', 'Mathura, Uttar Pradesh 281001'],
  },
  {
    icon: Phone,
    title: 'Direct Telephony',
    details: ['+91 98765 43210 (Concierge)', '+91 87654 32109 (Production Office)'],
  },
  {
    icon: Mail,
    title: 'Electronic Dispatch',
    details: ['concierge@eventhive.in', 'directors@eventhive.in'],
  },
  {
    icon: Clock,
    title: 'Consultation Hours',
    details: ['Monday – Saturday: 10:00 AM – 7:00 PM IST', 'Sunday: By Appointment Only'],
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const headerParallax = useParallax(-0.1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success('Your message has been received. Our concierge will be in touch shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="contact-page pb-5">
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
              'radial-gradient(circle at 80% 20%, rgba(154, 107, 47, 0.2), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <div className="editorial-eyebrow">
            <span>Direct Communication</span>
          </div>
          <h1
            className="font-display mb-3"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 600 }}
          >
            Connect with our Atelier
          </h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '600px', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Whether you are envisioning a grand palace wedding, an executive retreat, or a milestone
            soirée, our production leads are at your service.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="editorial-eyebrow">
                <span>Atelier Locations</span>
              </div>
              <h2 className="font-display fs-2 mb-4">Our Presence</h2>
              <p className="text-secondary mb-5" style={{ lineHeight: 1.8 }}>
                Our studio is rooted in Mathura with regional event directors managing productions
                across Delhi NCR, Rajasthan, and destination resorts nationwide.
              </p>

              <div className="d-flex flex-column gap-4">
                {studioOffices.map((office, idx) => {
                  const Icon = office.icon;
                  return (
                    <div key={idx} className="d-flex align-items-start gap-3">
                      <div
                        className="p-3 rounded-2"
                        style={{
                          backgroundColor: 'var(--bg-surface-subtle)',
                          color: 'var(--brand-gold)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="fs-6 fw-semibold mb-1">{office.title}</h3>
                        {office.details.map((line, i) => (
                          <div key={i} className="text-secondary small">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="col-lg-7">
              <div
                className="card-luxury p-4 p-md-5"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="editorial-eyebrow">
                  <span>General Inquiries</span>
                </div>
                <h2 className="font-display fs-3 mb-2">Send a Message</h2>
                <p className="text-secondary small mb-4">
                  For formal package reservations, please use our{' '}
                  <a href="/book" className="text-primary fw-medium text-decoration-none hover-gold">
                    Booking Wizard
                  </a>
                  . For press, vendor partnerships, or general queries, write to us below.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label-luxury">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Vikram Malhotra"
                        required
                        className="form-control-luxury"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-luxury">Your Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="vikram@domain.com"
                        required
                        className="form-control-luxury"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label-luxury">Inquiry Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="e.g. Destination Wedding in Rajasthan / Corporate Summit"
                        className="form-control-luxury"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label-luxury">Your Message *</label>
                      <textarea
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="How can our event atelier assist you?"
                        required
                        className="form-control-luxury"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-luxury-primary w-100 justify-content-center py-3"
                  >
                    {sending ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
