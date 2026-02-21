import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Books', path: '/all-books' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '#' },
    { name: 'Terms of Service', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Shipping Policy', path: '#' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-700">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-80"></div>
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none text-white">BookNest</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Premium Library</p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              A modern library-to-home platform for readers who want curated books, reliable delivery, and a better reading experience.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-primary hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-primary hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-primary hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-primary hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>123 Library Street, Booktown, BK 12345</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+1234567890" className="transition-colors hover:text-white">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@booknest.com" className="transition-colors hover:text-white">
                  info@booknest.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          © {currentYear} BookNest. Crafted for readers and built for scale.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
