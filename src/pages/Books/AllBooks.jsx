import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import BookCardSkeleton from '../../components/shared/BookCardSkeleton';

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
      setAllBooks(response.data.books);
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

  const categories = [
    { value: 'all', label: 'All Books' },
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Non-Fiction', label: 'Non-Fiction' },
    { value: 'Science Fiction', label: 'Science Fiction' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Biography', label: 'Biography' },
    { value: 'History', label: 'History' },
    { value: 'Self-Help', label: 'Self-Help' },
    { value: 'Business', label: 'Business' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Children', label: 'Children' },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center text-xs">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating || 0) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="border-b border-slate-200 bg-white/70 py-8 backdrop-blur dark:border-slate-800 dark:bg-slate-900/35">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">BookNest Catalog</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">The Collection</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Search by title, author, or category. Apply filters and sort options to quickly discover your next favorite book.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr,220px]">
            <div className="group relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="default">Sort By Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Title: A-Z</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-30 border-b border-slate-200 bg-white/85 py-4 backdrop-blur dark:border-slate-800 dark:bg-background-dark/85">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    selectedCategory === cat.value
                      ? 'border-primary bg-primary text-white shadow-md shadow-primary/25'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/35 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
              <button onClick={clearFilters} className="btn-ghost ml-auto whitespace-nowrap text-rose-600 dark:text-rose-400">
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!loading && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white">{allBooks.length}</span> books found
              {selectedCategory !== 'all' && (
                <span className="ml-1">
                  in <span className="font-semibold text-primary">{categories.find((c) => c.value === selectedCategory)?.label}</span>
                </span>
              )}
            </p>
          </div>
        )}

        <section>
          {loading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : allBooks.length === 0 ? (
            <div className="card py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No books found</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
              </p>
              {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
                <button onClick={clearFilters} className="btn-primary mt-5">
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {allBooks.map((book) => (
                <Link key={book._id} to={`/books/${book._id}`} className="group">
                  <article className="card h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {book.published === false && (
                        <div className="absolute right-2 top-2 rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
                          Unpublished
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                        {book.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-400">by {book.author}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {renderStars(book.rating)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">({book.reviews || 0})</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <p className="text-xl font-bold text-primary">${book.price}</p>
                        {book.category && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                            {book.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AllBooks;
