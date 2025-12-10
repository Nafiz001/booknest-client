import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { getLatestBooks } from '../../data/books';

const BookCard = ({ book }) => {
  return (
    <div className="card overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 opacity-0 group-hover:opacity-100">
          <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        {book.status === 'new' && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
            New
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < Math.floor(book.rating)
                  ? 'fill-accent text-accent'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            ({book.reviews} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${book.price}</span>
          <Link
            to={`/books/${book.id}`}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const LatestBooks = () => {
  const latestBooks = getLatestBooks(6);

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Latest Books</h2>
          <p className="section-subtitle">
            Discover our newest additions to the collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {latestBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/books"
            className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-all duration-200"
          >
            View All Books
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBooks;
