import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-100 pt-16 pb-8 text-slate-600 dark:border-white/5 dark:bg-[#07122a] dark:text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">BookNest</span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Reimagining the library experience for the modern reader. Sustainable, convenient, and curated with care.
            </p>

            <div className="flex items-center gap-3 text-slate-500">
              <a href="#" className="text-xs transition-colors hover:text-slate-900 dark:hover:text-white" aria-label="Twitter">
                TW
              </a>
              <a href="#" className="text-xs transition-colors hover:text-slate-900 dark:hover:text-white" aria-label="Instagram">
                IG
              </a>
              <a href="#" className="text-xs transition-colors hover:text-slate-900 dark:hover:text-white" aria-label="LinkedIn">
                IN
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">Explore</h3>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/all-books" className="transition-colors hover:text-primary">
                  Catalog
                </Link>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  New Releases
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Staff Picks
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Waitlist Info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">Company</h3>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">Stay Updated</h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Get the latest book drops and literary news.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button type="button" className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 dark:border-white/5 md:flex-row">
          <p>(c) {year} BookNest Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
