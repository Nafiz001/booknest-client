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

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get(`/wishlist/${user?.id || user?._id}`);
      setWishlist(response.data.wishlist);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
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
          <Link to="/books" className="btn-primary inline-block">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="card overflow-hidden">
              <img
                src={item.book.image}
                alt={item.book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.book.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{item.book.author}</p>
                <p className="text-primary font-bold text-xl mb-4">${item.book.price}</p>
                
                <div className="flex gap-2">
                  <Link
                    to={`/books/${item.book._id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
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
