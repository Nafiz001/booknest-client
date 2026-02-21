import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import BookCardSkeleton from '../../components/shared/BookCardSkeleton';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
      setAllBooks(response.data.books || []);
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

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-900 dark:from-[#07122a] dark:via-[#081a3e] dark:to-[#07122a] dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <aside className="sticky top-20 hidden h-[calc(100vh-80px)] w-72 shrink-0 border-r border-slate-200 bg-white/80 px-6 py-8 dark:border-slate-800 dark:bg-[#06112a]/70 lg:block">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
            <button onClick={clearFilters} className="text-xs font-semibold text-primary transition-colors hover:text-primary/80">
              Reset All
            </button>
          </div>

          <div className="mb-8">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Categories</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="group flex w-full items-center gap-3 text-left"
                >
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 rounded border ${
                      selectedCategory === cat.value ? 'border-primary bg-primary' : 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-900/40'
                    }`}
                  ></span>
                  <span className="text-sm text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">{cat.label}</span>
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-500">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Price Range</h4>
            <div className="px-1 py-2">
              <div className="relative h-1 rounded-full bg-slate-300 dark:bg-slate-700">
                <div className="absolute left-1/4 right-1/4 h-full rounded-full bg-primary"></div>
                <span className="absolute left-1/4 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white"></span>
                <span className="absolute right-1/4 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white"></span>
              </div>
              <div className="mt-4 flex justify-between text-[11px]">
                <span className="rounded border border-slate-300 bg-white px-3 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">$10</span>
                <span className="rounded border border-slate-300 bg-white px-3 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">$50</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Rating</h4>
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border border-slate-400 dark:border-slate-600"></span>
                <span className="flex items-center gap-0.5 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">&amp; Up</span>
              </label>
              <label className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border border-slate-400 dark:border-slate-600"></span>
                <span className="flex items-center gap-0.5 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                  <Star className="h-4 w-4" />
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">&amp; Up</span>
              </label>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <div className="mb-6 lg:hidden">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Filter className="h-4 w-4" />
              Filters are available on desktop
            </button>
          </div>

          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">The Collection</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Showing {loading ? '...' : allBooks.length} premium books curated for you.
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

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : allBooks.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white/90 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No books found</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try adjusting search or filters.</p>
              <button onClick={clearFilters} className="btn-primary mt-5 text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {allBooks.map((book, index) => (
                  <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-900/70"
                >
                    <div className="relative aspect-[2/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-primary"
                        aria-label="Save"
                      >
                        <Heart className="h-4 w-4" />
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
                ))}
              </div>

              <div className="mt-10 flex items-center justify-center gap-2 text-sm">
                <button className="h-10 w-10 rounded border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">{'<'}</button>
                <button className="h-10 w-10 rounded bg-primary font-bold text-white shadow-lg shadow-primary/30">1</button>
                <button className="h-10 w-10 rounded border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">2</button>
                <button className="h-10 w-10 rounded border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">3</button>
                <span className="px-1 text-slate-500">...</span>
                <button className="h-10 w-10 rounded border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">12</button>
                <button className="h-10 w-10 rounded border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">{'>'}</button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllBooks;
