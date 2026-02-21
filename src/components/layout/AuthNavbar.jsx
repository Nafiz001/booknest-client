import { Link, NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';

const AuthNavbar = () => {
  const { user } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/all-books' },
    { name: 'Membership', path: user ? '/dashboard/profile' : '/register' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#111621]/92">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">BookNest</p>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={`${link.path}-${link.name}`}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="h-10 px-2.5 sm:px-3" iconClassName="h-4 w-4" label={false} />
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;
