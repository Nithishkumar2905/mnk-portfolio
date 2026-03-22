import { useState } from 'react';
import { Mail, Instagram, Linkedin, ArrowUpRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import './Contact.css';

const contactItems = [
  {
    icon: <Mail size={22} />,
    label: 'Email',
    value: 'nithishstudy2905@gmail.com',
    href: 'mailto:nithishstudy2905@gmail.com',
  },
  {
    icon: <Instagram size={22} />,
    label: 'Instagram',
    value: '@iam_mnk2905',
    href: 'https://www.instagram.com/iam_mnk2905/',
  },
  {
    icon: <Linkedin size={22} />,
    label: 'LinkedIn',
    value: 'Nithish Kumar M',
    href: 'https://www.linkedin.com/in/nithish-kumar-m-4b862b289/',
  },
];

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.target);

    // Web3Forms Access Key from .env
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New Contact Form Submission from mnkportfolio.com");
    formData.append("from_name", "Portfolio Contact Form");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        e.target.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        console.error("Error", data);
        setErrorMessage(data.message || "Something went wrong.");
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send message. Please try again later.");
      setStatus('error');
    }
  };

  return (
    <section className="contact section-padding" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__left">
            <span className="section-eyebrow">Get In Touch</span>
            <h2 className="section-title">Let's Work Together</h2>
            <p className="contact__desc">
              Have a project in mind? Looking for a designer to bring your vision to life?
              I'd love to hear from you. Let's create something amazing together!
            </p>

            <div className="contact__links">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__link-card"
                >
                  <div className="contact__link-icon">{item.icon}</div>
                  <div className="contact__link-info">
                    <span className="contact__link-label">{item.label}</span>
                    <span className="contact__link-value">{item.value}</span>
                  </div>
                  <ArrowUpRight size={16} className="contact__link-arrow" />
                </a>
              ))}
            </div>
          </div>

          <div className="contact__right">
            <form className="contact__form" onSubmit={handleSubmit}>
              <h3 className="contact__form-title">Send a Message</h3>
              <div className="contact__field">
                <label>Your Name</label>
                <input type="text" name="name" placeholder="John Doe" required />
              </div>
              <div className="contact__field">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="john@example.com" required />
              </div>
              <div className="contact__field">
                <label>Message</label>
                <textarea name="message" rows={5} placeholder="Tell me about your project..." required />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' && <Loader2 size={18} className="spin-anim" />}
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="contact__alert success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginTop: '16px', fontSize: '0.9rem', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <CheckCircle size={18} />
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="contact__alert error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', marginTop: '16px', fontSize: '0.9rem', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                  <XCircle size={18} />
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="contact__footer">
        <p>© {new Date().getFullYear()} Nithish Kumar M. All rights reserved.</p>
        <a href="/admin/login" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Admin</a>
      </div>
    </section>
  );
}
