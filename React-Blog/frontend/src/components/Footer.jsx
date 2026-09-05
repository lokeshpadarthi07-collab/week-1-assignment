import React from 'react';
import { Sparkles, Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import Form from './Form';

/**
 * Reusable Footer Component
 */
export const Footer = ({ onCategorySelect, categories = [] }) => {
  const handleNewsletterSubmit = (formData) => {
    // Newsletter signup simulation
    console.log('Newsletter subscription:', formData);
  };

  const newsletterFields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email address...',
      required: true,
      icon: Mail
    }
  ];

  return (
    <footer className="app-footer">
      <div className="container footer-content-grid">
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <div className="logo-icon-bg">
              <Sparkles size={20} />
            </div>
            <span className="brand-name">Dev<span className="text-highlight">Pulse</span></span>
          </div>
          <p className="footer-bio">
            A modern developer hub featuring curated insights into React engineering, component design systems, state management, and modern Web APIs.
          </p>

          <div className="footer-social-icons">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://www.linkedin.com/in/lokesh-padarthi-87668134a" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>

        <div className="footer-col links-col">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links-list">
            <li>
              <button onClick={() => onCategorySelect('All')} className="footer-link-btn">
                All Topics
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button onClick={() => onCategorySelect(cat)} className="footer-link-btn">
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h4 className="footer-heading">Stay Updated</h4>
          <p className="newsletter-subtitle">
            Subscribe to receive our latest React guides and architecture articles directly to your inbox.
          </p>
          
          <Form
            fields={newsletterFields}
            onSubmit={handleNewsletterSubmit}
            submitText="Subscribe"
            className="footer-newsletter-form"
          />
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} DevPulse React Blog UI. Built with React & Vite.</p>
          <p className="built-with">
            Designed with <Heart size={14} className="heart-icon" /> for Week 1 Assignment
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
