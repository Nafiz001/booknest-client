import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { Link } from 'react-router-dom';

const MyWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await api.get(`/wishlist/${user?.id || user?._id}`);
      setWishlist(response.data.wishlist);
    } catch (err) {
      toast.error('Failed to load wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const removeFromWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Saved</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} in your wishlist
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding books you love to your wishlist
          </p>
          <Link to="/all-books" className="btn-primary inline-block">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="relative">
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 rounded-lg bg-primary px-2 py-1 text-sm font-bold text-white">
                  ${item.book.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{item.book.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">by {item.book.author}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mb-3">{item.book.category}</p>
                
                {item.book.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{item.book.rating}</span>
                    <span className="text-gray-400 text-xs">({item.book.reviews || 0} reviews)</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Link
                    to={`/books/${item.book._id}`}
                    className="btn-primary flex-1 text-center text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                    Buy Now
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="rounded-lg bg-red-100 px-4 py-2 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
