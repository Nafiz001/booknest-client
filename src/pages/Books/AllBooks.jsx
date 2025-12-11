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

  // Debounce search query
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
      
      // Add search query if present
      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }
      
      // Add category filter if not 'all'
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      // Add sort parameter if not default
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

  // Real book categories
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
          <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Explore All Books</h1>
          
          {/* Search & Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[180px]"
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

      {/* Category Filter Pills */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full border whitespace-nowrap transition-all font-medium text-sm ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors whitespace-nowrap ml-auto"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{allBooks.length}</span> books found
              {selectedCategory !== 'all' && (
                <span className="ml-2">
                  in <span className="font-medium text-primary">{categories.find(c => c.value === selectedCategory)?.label}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* All Books Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : allBooks.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No books found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
              </p>
              {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allBooks.map((book) => (
                <Link 
                  key={book._id} 
                  to={`/books/${book._id}`} 
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {book.published === false && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Unpublished
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">by {book.author}</p>
                      <div className="flex items-center mb-2">
                        {renderStars(book.rating)}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({book.reviews || 0})</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">${book.price}</p>
                        {book.category && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            {book.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AllBooks;
