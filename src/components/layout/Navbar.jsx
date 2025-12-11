import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, BookOpen, Home, LayoutDashboard, LogIn, UserPlus, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import BookNestLogo from '../../assets/BookNestLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logOut } = useAuth();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'All Books', path: '/all-books', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-white relative z-10" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white dark:border-background-dark flex items-center justify-center">
                <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white leading-none">
                Book<span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Nest</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold group-hover:text-primary transition-colors">Discover & Collect</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search - Desktop Only */}
            <div className="hidden lg:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search books, authors..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-dark text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>

            {/* Search Icon - Mobile Only */}
            <button className="lg:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* User Profile or Login/Register */}
            {!loading && (
              user ? (
                <div className="relative ml-1 profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none ring-2 ring-transparent focus:ring-primary/20 rounded-full p-1 transition-all"
                  >
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=40&background=2563eb&color=fff`}
                      alt={user.displayName}
                      className="h-9 w-9 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1 border-t border-border-light dark:border-border-dark"
                      >
                        <LogIn className="w-4 h-4 rotate-180" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark font-medium transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 -mr-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-primary'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
              {!loading && !user && (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
