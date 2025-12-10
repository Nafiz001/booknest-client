import { useState } from 'react';
import { Search, ChevronDown, ShoppingCart, Menu, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublishedBooks } from '../../data/books';

const AllBooks = () => {
  const [selectedCategory, setSelectedCategory] = useState('Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const allBooks = getPublishedBooks();
  
  // Filter and sort books
  const filteredBooks = allBooks
    .filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // default order
    });
  
  // Group books for different sections
  const bestSellers = filteredBooks.slice(0, 6);
  const newReleases = filteredBooks.slice(6, 12);
  const dailyDeals = filteredBooks.slice(12, 18);

  // Mock data matching Amazon design
  const categories = ['Books', 'Kindle Ebooks', 'Print Books', 'Audible Audiobooks'];

  const topCategories = [
    'Romance', 'Children\'s Books', 'Mystery, Thriller & Suspense', 'Science Fiction & Fantasy',
    'Literature & Fiction', 'History', 'Biographies & Memoirs', 'Teen & Young Adult',
    'Business & Money', 'Self-help'
  ];

  const popularAuthors = [
    'DAN BROWN', 'THRONE OF GLASS', 'JASMINE MAS', 'Freida McFadden',
    'STEPHEN KING', 'Mark Bittman', 'CSB', 'Priscilla Shirer', 'LEE STROBEL', 'MEGHAN QUINN'
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Top Category Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BookNest</h1>
              <button className="flex items-center px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm">
                Categories <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="default">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title">Title: A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="bg-white dark:bg-gray-900 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg text-amber-600 dark:text-amber-500 mb-2">Handpicked by BookNest Editors</p>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Best Books of 2025</h2>
              <Link to="#" className="text-lg font-semibold text-blue-600 dark:text-blue-400 underline hover:text-blue-800">
                Explore more
              </Link>
            </div>
            <div className="hidden md:block ml-8">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=300&fit=crop"
                alt="Best Books Collage"
                className="max-h-48 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Quick Links Grid */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Outstanding Fiction of the past 25 years', icon: '📚' },
            { title: 'Unforgettable Nonfiction of the past 25 years', icon: '📖' },
            { title: 'Most buzzworthy books of the past 25 years', icon: '⭐' },
            { title: "Editors' personal favorites", icon: '👤' }
          ].map((item, idx) => (
            <Link
              key={idx}
              to="#"
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mr-4">{item.icon}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
            </Link>
          ))}
        </section>

        {/* Best Sellers Section */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Best sellers in print</h3>
            <Link to="#" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              See more <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
            </Link>
          </div>
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {bestSellers.map((book) => (
                <div key={book.id} className="flex-shrink-0 w-40">
                  <Link to={`/books/${book.id}`}>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-60 object-cover rounded mb-2 shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </Link>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">by {book.author}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(book.rating)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{book.reviews}</span>
                  </div>
                  <p className="text-sm font-bold mt-1 text-gray-900 dark:text-white">${book.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Releases Section */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">New releases on Kindle</h3>
            <Link to="#" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              See more <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
            </Link>
          </div>
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {newReleases.map((book) => (
                <div key={book.id} className="flex-shrink-0 w-40">
                  <Link to={`/books/${book.id}`}>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-60 object-cover rounded mb-2 shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </Link>
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{book.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Deals Section */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Kindle Daily Deals - today only</h3>
            <Link to="#" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              See more <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
            </Link>
          </div>
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {dailyDeals.map((deal) => (
                <div key={deal.id} className="flex-shrink-0 w-40">
                  <Link to={`/books/${deal.id}`}>
                    <img
                      src={deal.image}
                      alt="Deal book"
                      className="w-full h-60 object-cover rounded mb-2 shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </Link>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${deal.price}</p>
                  <p className="text-xs text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 inline-block px-2 py-0.5 rounded mt-1">
                    Ends in {deal.timeLeft}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Authors */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Popular authors & series</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
            {popularAuthors.map((author, idx) => (
              <Link
                key={idx}
                to="#"
                className="text-xl tracking-widest text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-serif"
              >
                {author}
              </Link>
            ))}
          </div>
        </section>

        {/* Top Categories */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore top categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
            {topCategories.map((category, idx) => (
              <Link
                key={idx}
                to="#"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

        {/* Feedback Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            If you have any feedback on this page, we would appreciate hearing from you.{' '}
            <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Submit your feedback here
            </Link>
            .
          </p>
        </div>
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
