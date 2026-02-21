import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X, Heart, Star } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import BookCardSkeleton from '../../components/shared/BookCardSkeleton';
import { useAuth } from '../../context/AuthContext';
import RevealOnScroll from '../../components/shared/RevealOnScroll';

const categories = [
  { value: 'all', label: 'All Books', count: 124 },
  { value: 'Fiction', label: 'Fiction', count: 86 },
  { value: 'Non-Fiction', label: 'Non-Fiction', count: 32 },
  { value: 'Science Fiction', label: 'Sci-Fi', count: 14 },
  { value: 'Biography', label: 'Biography', count: 18 },
];

const categoryPills = [
  { value: 'all', label: 'All' },
  { value: 'Fiction', label: 'Bestsellers' },
  { value: 'Non-Fiction', label: 'New Releases' },
  { value: 'Science Fiction', label: 'Classics' },
  { value: 'Biography', label: 'Must Read' },
];

const AllBooks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [savingWishlistId, setSavingWishlistId] = useState(null);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 100 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [minRating, setMinRating] = useState(0);

  const booksPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (sortBy !== 'default') {
        params.append('sort', sortBy);
      }

      const queryString = params.toString();
      const response = await api.get(`/books${queryString ? `?${queryString}` : ''}`);
      const books = response.data.books || [];
      setAllBooks(books);

      const prices = books
        .map((book) => Number(book.price || 0))
        .filter((price) => Number.isFinite(price));
      const derivedMin = prices.length ? Math.max(0, Math.floor(Math.min(...prices))) : 0;
      const derivedMax = prices.length ? Math.max(derivedMin + 1, Math.ceil(Math.max(...prices))) : 100;
      setPriceBounds({ min: derivedMin, max: derivedMax });
      setPriceRange({ min: derivedMin, max: derivedMax });
    } catch (error) {
      console.error('Failed to load books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, selectedCategory]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearch, sortBy, priceRange, minRating]);

  const filteredBooks = useMemo(
    () =>
      allBooks.filter((book) => {
        const price = Number(book.price || 0);
        const rating = Number(book.rating ?? 4.8);
        return (
          price >= priceRange.min &&
          price <= priceRange.max &&
          rating >= minRating
        );
      }),
    [allBooks, minRating, priceRange.max, priceRange.min]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredBooks.length / booksPerPage)),
    [filteredBooks.length]
  );

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }, [filteredBooks, currentPage]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
    setPriceRange({ min: priceBounds.min, max: priceBounds.max });
    setMinRating(0);
    setCurrentPage(1);
  };

  const handleAddToWishlist = async (bookId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save books');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setSavingWishlistId(bookId);
      await api.post('/wishlist', { bookId });
      toast.success('Added to wishlist');
    } catch (error) {
      if (error.response?.status === 409) {
        toast('Already in your wishlist');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    } finally {
      setSavingWishlistId(null);
    }
  };

  const goToPage = (page) => {
    const nextPage = Math.min(totalPages, Math.max(1, page));
    setCurrentPage(nextPage);
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, null, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, null, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages];
  }, [currentPage, totalPages]);

  const effectiveMaxBound = Math.max(priceBounds.max, priceBounds.min + 1);

  const handleMinPriceChange = (value) => {
    const nextMin = Number(value);
    setPriceRange((prev) => ({
      ...prev,
      min: Math.min(nextMin, prev.max - 1),
    }));
  };

  const handleMaxPriceChange = (value) => {
    const nextMax = Number(value);
    setPriceRange((prev) => ({
      ...prev,
      max: Math.max(nextMax, prev.min + 1),
    }));
  };

  const ratingOptions = [4, 3];

  const renderFiltersPanel = () => (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Reset All
        </button>
      </div>

      <div className="mb-8">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.value);
                setIsMobileFiltersOpen(false);
              }}
              className="group flex w-full items-center gap-3 text-left"
            >
              <span
                className={`mt-0.5 inline-flex h-4 w-4 shrink-0 rounded border ${
                  selectedCategory === cat.value ? 'border-primary bg-primary' : 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-900/40'
                }`}
              ></span>
              <span className="text-sm text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                {cat.label}
              </span>
              <span className="ml-auto text-xs text-slate-500 dark:text-slate-500">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Price Range</h4>
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Min: ${priceRange.min}
            </label>
            <input
              type="range"
              min={priceBounds.min}
              max={effectiveMaxBound}
              value={priceRange.min}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="h-2 w-full cursor-pointer accent-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Max: ${priceRange.max}
            </label>
            <input
              type="range"
              min={priceBounds.min + 1}
              max={effectiveMaxBound}
              value={priceRange.max}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="h-2 w-full cursor-pointer accent-primary"
            />
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              ${priceRange.min}
            </span>
            <span className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              ${priceRange.max}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Rating</h4>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setMinRating((prev) => (prev === rating ? 0 : rating))}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                  minRating === rating ? 'border-primary' : 'border-slate-400 dark:border-slate-600'
                }`}
              >
                {minRating === rating && <span className="h-2 w-2 rounded-full bg-primary"></span>}
              </span>
              <span className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={`${rating}-${i}`} className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} />
                ))}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">&amp; Up</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-900 dark:from-[#07122a] dark:via-[#081a3e] dark:to-[#07122a] dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <RevealOnScroll className="hidden lg:block" y={18}>
          <aside className="sticky top-20 h-[calc(100vh-80px)] w-72 shrink-0 border-r border-slate-200 bg-white/80 px-6 py-8 dark:border-slate-800 dark:bg-[#06112a]/70">
            {renderFiltersPanel()}
          </aside>
        </RevealOnScroll>

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <RevealOnScroll y={14}>
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <Filter className="h-4 w-4" />
                Open Filters
              </button>
            </div>

            <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">The Collection</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Showing {loading ? '...' : filteredBooks.length} premium books curated for you.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                <div className="group relative w-full md:w-96">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
                >
                  <option value="default">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title: A-Z</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categoryPills.map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setSelectedCategory(pill.value)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                    selectedCategory === pill.value
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-primary/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </RevealOnScroll>

          {loading ? (
            <RevealOnScroll>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            </RevealOnScroll>
          ) : filteredBooks.length === 0 ? (
            <RevealOnScroll>
              <div className="rounded-xl border border-slate-200 bg-white/90 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No books found</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try adjusting search or filters.</p>
                <button onClick={clearFilters} className="btn-primary mt-5 text-sm">
                  Clear Filters
                </button>
              </div>
            </RevealOnScroll>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {paginatedBooks.map((book, index) => (
                  <RevealOnScroll key={book._id} delay={index * 70}>
                    <Link
                      to={`/books/${book._id}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-900/70"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleAddToWishlist(book._id, e)}
                          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-primary"
                          aria-label="Save"
                          title="Save to wishlist"
                        >
                          <Heart className={`h-4 w-4 ${savingWishlistId === book._id ? 'animate-pulse' : ''}`} />
                        </button>

                        {index === 2 && (
                          <span className="absolute left-3 top-3 rounded bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
                            Bestseller
                          </span>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                          <div className="rounded-lg bg-primary py-2 text-center text-sm font-bold text-white">View Details</div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                          {book.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{book.author}</p>
                        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700/60">
                          <div className="inline-flex items-center gap-1 text-amber-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{(book.rating || 4.8).toFixed(1)}</span>
                            <span className="text-xs text-slate-500">({(book.reviews || 1200).toLocaleString()})</span>
                          </div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${Number(book.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>

              <RevealOnScroll>
                <div className="mt-10 flex items-center justify-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10 rounded border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    {'<'}
                  </button>

                  {pageNumbers.map((page, idx) =>
                    page === null ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-slate-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-10 w-10 rounded transition-colors ${
                          currentPage === page
                            ? 'bg-primary font-bold text-white shadow-lg shadow-primary/30'
                            : 'border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 rounded border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    {'>'}
                  </button>
                </div>
              </RevealOnScroll>
            </>
          )}
        </main>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] bg-black/45 p-4 lg:hidden">
          <div className="absolute inset-0" onClick={() => setIsMobileFiltersOpen(false)}></div>
          <div className="relative mx-auto mt-20 max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Filters</h3>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {renderFiltersPanel()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBooks;
