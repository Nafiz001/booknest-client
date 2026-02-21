import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  BookOpen,
  Home,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Search,
  Loader2,
  ShoppingCart,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import ThemeToggle from '../shared/ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const location = useLocation();
  const { user, loading, logOut } = useAuth();

  const isHome = location.pathname === '/';
  const isCatalog = location.pathname.startsWith('/all-books') || location.pathname.startsWith('/books/');
  const isStitchHeader = isHome || isCatalog;

  const homeLinks = [
    { name: 'Browse', path: '/all-books' },
    { name: 'Membership', path: user ? '/dashboard/profile' : '/register' },
    { name: 'Gifts', path: '/all-books' },
  ];

  const catalogLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/all-books' },
    { name: 'My Library', path: user ? '/dashboard/my-orders' : '/login' },
    { name: 'Wishlist', path: user ? '/dashboard/wishlist' : '/login' },
  ];

  const defaultLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'All Books', path: '/all-books', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
  ];

  const activeLinks = isHome ? homeLinks : isCatalog ? catalogLinks : defaultLinks;

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
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      const clickedOutsideDesktopSearch = searchRef.current && !searchRef.current.contains(event.target);
      const clickedOutsideMobileSearch = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);
      if (clickedOutsideDesktopSearch && clickedOutsideMobileSearch) {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
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

  const handleResultClick = () => {
    clearSearchState();
  };

  const headerClass = isStitchHeader
    ? 'border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-[#07122a]/85'
    : 'border-slate-200/80 bg-white/90 dark:border-slate-700/60 dark:bg-background-dark/80';
  const textClass = isStitchHeader ? 'text-slate-600 dark:text-slate-300' : 'text-slate-600 dark:text-slate-300';
  const hoverClass = isStitchHeader ? 'hover:text-slate-900 dark:hover:text-white' : 'hover:text-slate-900 dark:hover:text-white';

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${headerClass}`}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className={`text-2xl font-bold leading-none ${isStitchHeader ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
              BookNest
            </p>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {activeLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <NavLink
                  key={`${link.path}-${link.name}`}
                  to={link.path}
                  className={({ isActive }) =>
                    `${textClass} ${hoverClass} text-sm font-medium transition-colors ${
                      isActive ? 'font-bold text-primary' : ''
                    }`
                  }
                >
                  {link.icon ? (
                    <span className="inline-flex items-center gap-1">
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </span>
                  ) : (
                    link.name
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={searchRef} className="relative">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileSearchOpen(true);
                    setIsSearchOpen(false);
                  } else {
                    setIsSearchOpen((prev) => !prev);
                  }
                  setIsMenuOpen(false);
                }}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isStitchHeader
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 z-50 mt-2 w-[370px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-surface-dark dark:shadow-black/40">
                  <div className="border-b border-slate-200 p-3 dark:border-slate-700">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setDebouncedQuery('');
                            setSearchResults([]);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          aria-label="Clear search"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
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
                        <img src={book.image} alt={book.title} className="h-14 w-10 rounded object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{book.title}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">by {book.author}</p>
                          <span className="mt-1 block text-xs font-semibold text-primary">${book.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isCatalog && (
              <>
                <button
                  className="hidden h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 sm:inline-flex dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
                <button
                  className="hidden h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 sm:inline-flex dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </>
            )}

            <ThemeToggle className="h-10 px-2.5 sm:px-3" iconClassName="h-4 w-4" label={false} />

            {!loading &&
              (user ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => {
                      setIsProfileOpen((prev) => !prev);
                      setIsMenuOpen(false);
                    }}
                    className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-colors ${
                      isStitchHeader ? 'border-slate-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=40&background=1754cf&color=fff`
                      }
                      alt={user.displayName || 'User'}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-surface-dark dark:shadow-black/40">
                      <div className="mb-2 border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {user.displayName || 'User'}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
                <>
                  {isStitchHeader ? (
                    <Link to="/login" className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark">
                      Login
                    </Link>
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
                  )}
                </>
              ))}

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden ${
                isStitchHeader
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`animate-slide-down border-t py-3 md:hidden ${isStitchHeader ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="space-y-1">
              {activeLinks.map((link) => (
                <NavLink
                  key={`${link.path}-${link.name}`}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : isStitchHeader
                          ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {!loading && !user && !isStitchHeader && (
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <span className="mt-1 block text-xs font-semibold text-primary">${book.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
