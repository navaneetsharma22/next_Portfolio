"use client";

import React, { useState, memo, useEffect, useMemo } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaMediumM, FaDribbble, FaQuestion } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { AnimatedReveal } from './ui/Shared';
import contactService from '../services/contactService';
import { toast } from 'react-hot-toast';

/**
 * Custom Icon for Code 360 (Coding Ninjas)
 */
const Code360Icon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M18 8.5C17.2 7.4 15.8 6.8 14.2 6.8C10.8 6.8 8.5 9.4 8.5 13C8.5 16.6 10.8 19.2 14.2 19.2C15.8 19.2 17.2 18.6 18 17.5" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <path d="M12.5 12.5L14.5 13L12.5 13.5V12.5Z" fill="currentColor"/>
    <path d="M17.5 12.5L15.5 13L17.5 13.5V12.5Z" fill="currentColor"/>
  </svg>
);

const ICON_MAP = {
  'linkedin': FaLinkedinIn,
  'github': FaGithub,
  'x': FaXTwitter,
  'twitter': FaXTwitter,
  'instagram': FaInstagram,
  'facebook': FaFacebookF,
  'medium': FaMediumM,
  'dribbble': FaDribbble,
  'leetcode': SiLeetcode,
  'code360': Code360Icon
};

const Contact = memo(() => {
  const [info, setInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', location: '', phone: '', budget: '', subject: '', message: '' });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await contactService.getInfo();
        setInfo(data);
      } catch (err) {
        console.error('Failed to fetch contact info');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const contactDetails = useMemo(() => [
    { Icon: MapPin, label: 'Address:', value: info?.address || '' },
    { Icon: Mail, label: 'My Email:', value: info?.email || '' },
    { Icon: Phone, label: 'Call Me Now:', value: info?.phone || '' },
  ], [info]);

  const socialLinks = useMemo(() => {
    const defaults = [
      { platform: 'linkedin', Icon: FaLinkedinIn, url: 'https://linkedin.com/in/navaneet-sharma-750b50357/' },
      { platform: 'github', Icon: FaGithub, url: 'https://github.com/navaneetsharma22' },
      { platform: 'x', Icon: FaXTwitter, url: 'https://x.com/NavaneetSh79884' },
      { platform: 'code360', Icon: Code360Icon, url: 'https://www.naukri.com/code360/profile/Navaneet' },
      { platform: 'medium', Icon: FaMediumM, url: 'https://medium.com/@navaneetsharma26' },
      { platform: 'dribbble', Icon: FaDribbble, url: 'https://dribbble.com/navaneet-sharma' },
      { platform: 'leetcode', Icon: SiLeetcode, url: 'https://leetcode.com/u/NavaneetSharma/' },
    ];

    if (!info?.socialLinks || info.socialLinks.length === 0) {
      return defaults;
    }

    // Merge or prioritize info.socialLinks
    const dynamicLinks = info.socialLinks.map(link => ({
      platform: link.platform.toLowerCase(),
      Icon: ICON_MAP[link.platform.toLowerCase()] || FaQuestion,
      url: link.url
    }));

    // For simplicity, let's just use the defaults and override if dynamic exists
    return defaults.map(def => {
      const dynamic = dynamicLinks.find(d => d.platform === def.platform);
      return dynamic || def;
    });
  }, [info]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Simple validation
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.sendMessage(form);
      toast.success('Message sent successfully! I will get back to you soon.');
      setForm({ name: '', email: '', location: '', phone: '', budget: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pb-3 border-b border-gray-200 outline-none transition-all duration-300 bg-transparent focus:border-[#9929fb] focus:border-b-2 placeholder:text-gray-400";
  const inputStyle = { color: 'var(--color-heading)' };

  if (isLoading) return null;

  return (
    <section id="contact" className="py-20 lg:py-[120px] px-4 sm:px-6 relative z-20 overflow-visible" style={{ backgroundColor: 'var(--color-background-alt)' }} aria-label="Contact">
      <div className="mx-auto w-full" style={{ maxWidth: '1100px' }}>

        <AnimatedReveal direction="up">
          <div
            className="bg-white rounded-none p-6 sm:p-10 md:p-16 w-full relative z-30"
            style={{
              boxShadow: '0px 0px 90px 9px rgba(0,0,0,0.08)',
              marginBottom: '-100px',
              marginTop: '0px'
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

              {/* Left Column: Info */}
              <div className="flex flex-col h-full">
                <h2 className="font-bold mb-6" style={{ fontSize: 'clamp(32px, 4vw, 44px)', color: 'var(--color-heading)' }}>
                  {info?.title || "Let's discuss your Project"}
                </h2>
                <p className="text-base leading-relaxed mb-12" style={{ color: 'var(--color-body)' }}>
                  {info?.description || "I'm available for freelance work. Drop me a line if you have a project you think I'd be a good fit for."}
                </p>

                <address className="space-y-8 mb-12 flex-grow not-italic">
                  {contactDetails.map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-none flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                        aria-hidden="true"
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--color-soft-dark)' }}>
                          {label}
                        </span>
                        <span className="text-base sm:text-lg font-black break-all sm:break-normal" style={{ color: 'var(--color-heading)' }}>
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </address>

                {/* Social Icons */}
                <div className="flex flex-wrap items-center gap-6 pt-10 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-soft-dark hover:text-[#9929fb] transition-all duration-300 transform hover:scale-125 flex items-center justify-center w-10 h-10 rounded-full hover:bg-purple-50"
                      title={social.platform}
                    >
                      <social.Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Column: Form */}
              <div>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-body)' }}>
                  I'm always open to discussing product design work or partnership opportunities.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {['name', 'email'].map((field) => (
                        <div key={field}>
                          <label htmlFor={`contact-${field}`} className="sr-only">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            id={`contact-${field}`}
                            type={field === 'email' ? 'email' : 'text'}
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}*`}
                            className={inputClass}
                            style={inputStyle}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {['location', 'phone'].map((field) => (
                        <div key={field}>
                          <label htmlFor={`contact-${field}`} className="sr-only">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            id={`contact-${field}`}
                            type="text"
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}${field === 'phone' ? '' : '*'}`}
                            className={inputClass}
                            style={inputStyle}
                            required={field !== 'phone'}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {['budget', 'subject'].map((field) => (
                        <div key={field}>
                          <label htmlFor={`contact-${field}`} className="sr-only">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            id={`contact-${field}`}
                            type="text"
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}*`}
                            className={inputClass}
                            style={inputStyle}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="sr-only">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Message*"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Card Footer: Social + Submit Row */}
            <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-6">
              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#9929fb] text-white py-4 px-10 text-sm font-bold uppercase tracking-widest hover:bg-[#801edb] active:scale-95 transition-all duration-300 !rounded-none shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;
