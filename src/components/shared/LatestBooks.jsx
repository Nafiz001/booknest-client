import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const BookCard = ({ book, onSave, savingId }) => {
  return (
    <div className="card group animate-fade-in h-full cursor-pointer overflow-hidden hover-lift">
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={book.image}
          alt={book.title}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => onSave(book._id || book.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 transition-all duration-200 hover:bg-white group-hover:opacity-100 dark:bg-slate-800/85 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Save to wishlist"
          title="Save to wishlist"
        >
          <Heart className={`h-4 w-4 ${savingId === (book._id || book.id) ? 'animate-pulse' : ''}`} />
        </button>
        {book.status === 'new' && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            New
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary dark:text-white">
          {book.title}
        </h3>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">by {book.author}</p>
        <div className="mb-3 flex items-center space-x-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < Math.floor(book.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
            ({book.reviews} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${book.price}</span>
          <Link
            to={`/books/${book._id || book.id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const LatestBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [latestBooks, setLatestBooks] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books?sort=newest');
        setLatestBooks(response.data.books.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleSave = async (bookId) => {
    if (!user) {
      toast.error('Please login to save books');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setSavingId(bookId);
      await api.post('/wishlist', { bookId });
      toast.success('Added to wishlist');
    } catch (error) {
      if (error.response?.status === 409) {
        toast('Already in your wishlist');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save book');
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="section-wrap bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="section-title">Latest Books</h2>
          <p className="section-subtitle">
            Discover our newest additions to the collection
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latestBooks.map((book) => (
            <BookCard key={book._id || book.id} book={book} onSave={handleSave} savingId={savingId} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/all-books"
            className="btn-outline"
          >
            View All Books
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBooks;
