import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  BookOpen,
  Home,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Search,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await api.get(`/books?search=${encodeURIComponent(debouncedQuery)}`);
        const books = Array.isArray(response.data?.books) ? response.data.books : [];
        setSearchResults(books.slice(0, 6));
      } catch (error) {
        console.error('Navbar search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideDesktopSearch =
        searchContainerRef.current && !searchContainerRef.current.contains(event.target);
      const clickedOutsideMobileSearch =
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);

      if (clickedOutsideDesktopSearch && clickedOutsideMobileSearch) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeSearchDropdowns = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const clearSearchState = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
    closeSearchDropdowns();
  };

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    setIsSearchOpen(true);
  };

  const handleResultClick = () => {
    clearSearchState();
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'All Books', path: '/all-books', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-background-dark/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <BookOpen className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-background-dark"></span>
            </div>
            <div>
              <p className="font-display text-2xl font-bold leading-none text-slate-900 dark:text-white">
                Book<span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Nest</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Premium Library
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={searchContainerRef} className="group relative hidden lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="h-10 w-56 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />

              {isSearchOpen && (
                <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-surface-dark dark:shadow-black/40">
                  <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Search Results
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {searchQuery.trim().length < 2 && (
                      <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                        Type at least 2 characters to search books.
                      </p>
                    )}

                    {searchQuery.trim().length >= 2 && isSearching && (
                      <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching books...
                      </div>
                    )}

                    {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                      <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                        No matching books found.
                      </p>
                    )}

                    {searchResults.map((book) => (
                      <Link
                        key={book._id}
                        to={`/books/${book._id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50 last:border-b-0 dark:border-slate-700/70 dark:hover:bg-slate-800"
                      >
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-14 w-10 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{book.title}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">by {book.author}</p>
                          <div className="mt-1 flex items-center gap-2">
                            {book.category && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                {book.category}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-primary">${book.price}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-700">
                      <Link
                        to="/all-books"
                        onClick={closeSearchDropdowns}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View full catalog
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsMobileSearchOpen(true);
                setIsSearchOpen(true);
                setIsMenuOpen(false);
                setIsProfileOpen(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {!loading &&
              (user ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center rounded-full ring-2 ring-transparent transition-all hover:ring-primary/30"
                  >
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=40&background=1754cf&color=fff`
                      }
                      alt={user.displayName || 'User'}
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 animate-slide-down dark:border-slate-700 dark:bg-surface-dark dark:shadow-black/40">
                      <div className="mb-2 border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {user.displayName || 'User'}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logOut();
                          setIsProfileOpen(false);
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-slate-200 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-slate-700 dark:text-rose-400 dark:hover:bg-rose-900/20"
                      >
                        <LogIn className="h-4 w-4 rotate-180" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link to="/register" className="btn-ghost">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                  <Link to="/login" className="btn-primary">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </div>
              ))}

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 md:hidden dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="animate-slide-down border-t border-slate-200 py-3 md:hidden dark:border-slate-700">
            <div className="space-y-1">
              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
              {!loading && !user && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-sm">
                    Register
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary text-sm">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/45 px-4 pt-24 lg:hidden">
          <div ref={mobileSearchRef} className="mx-auto max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-surface-dark">
            <div className="border-b border-slate-200 p-3 dark:border-slate-700">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
                <button
                  onClick={() => {
                    if (searchQuery) {
                      setSearchQuery('');
                      setDebouncedQuery('');
                      setSearchResults([]);
                    } else {
                      closeSearchDropdowns();
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label={searchQuery ? 'Clear search' : 'Close search'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim().length < 2 && (
                <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                  Type at least 2 characters to search books.
                </p>
              )}

              {searchQuery.trim().length >= 2 && isSearching && (
                <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching books...
                </div>
              )}

              {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                  No matching books found.
                </p>
              )}

              {searchResults.map((book) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50 last:border-b-0 dark:border-slate-700/70 dark:hover:bg-slate-800"
                >
                  <img src={book.image} alt={book.title} className="h-14 w-10 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{book.title}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">by {book.author}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {book.category && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          {book.category}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-primary">${book.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {searchResults.length > 0 && (
              <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-700">
                <Link to="/all-books" onClick={closeSearchDropdowns} className="text-xs font-semibold text-primary hover:underline">
                  View full catalog
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
