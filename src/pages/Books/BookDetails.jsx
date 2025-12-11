import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { X, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    deliveryMethod: 'delivery'
  });

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user || !id) return;
    try {
      const response = await api.get(`/wishlist/${user?.id || user?._id}`);
      const inWishlist = response.data.wishlist.some(item => item.bookId === id);
      setIsInWishlist(inWishlist);
    } catch (err) {
      console.error('Failed to check wishlist status', err);
    }
  };

  const checkIfOrdered = async () => {
    if (!user || !id) return;
    try {
      const userId = user?.id || user?._id;
      const response = await api.get(`/orders/user/${userId}/book/${id}`);
      setHasOrdered(response.data.hasOrdered);
    } catch (err) {
      console.error('Failed to check order status', err);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const response = await api.get(`/books/${id}`);
          setBook(response.data.book);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to load book');
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
      fetchReviews();
      checkWishlistStatus();
      checkIfOrdered();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        bookId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
          <Link to="/books" className="btn-primary">
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      setShowWishlistModal(true);
      return;
    }

    setAddingToWishlist(true);
    try {
      await api.post('/wishlist', { bookId: id });
      setIsInWishlist(true);
      toast.success('Added to wishlist!');
    } catch (error) {
      if (error.response?.status === 409) {
        setIsInWishlist(true);
        setShowWishlistModal(true);
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmittingOrder(true);
    try {
      const userId = user?._id || user?.id;
      const orderData = {
        userId: userId,
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        bookPrice: book.price,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        deliveryMethod: formData.deliveryMethod,
        status: 'pending',
        paymentStatus: 'unpaid',
        librarianId: book.librarianId
      };
      
      await api.post('/orders', orderData);
      toast.success('Order placed successfully!');
      setIsModalOpen(false);
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        deliveryMethod: 'delivery'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400 text-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating} {book.reviews ? `(${book.reviews.toLocaleString()} reviews)` : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/all-books" className="text-blue-600 dark:text-blue-400 hover:underline">All Books</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600 dark:text-gray-400">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-md w-full">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 disabled:opacity-50 ${
                    isInWishlist 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500 hover:bg-green-200 dark:hover:bg-green-900/50' 
                      : 'btn-primary'
                  } px-6 py-3 rounded-lg font-semibold transition-colors`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  {addingToWishlist ? 'Adding...' : isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button className="btn-secondary flex items-center justify-center gap-2 px-4">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              by <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="mb-6">
              {renderStars(book.rating)}
            </div>

            {/* Price */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-primary">${book.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {book.published ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!book.published}
              className="w-full mb-6 bg-accent hover:bg-amber-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-6 h-6" />
              Order Now
            </button>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">About This Book</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Book Details Table */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <h3 className="text-xl font-bold p-4 bg-gray-50 dark:bg-gray-800">Book Information</h3>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex py-3 px-4">
                  <span className="w-32 font-semibold text-gray-600 dark:text-gray-400">ISBN:</span>
                  <span className="text-gray-900 dark:text-white">{book.isbn}</span>
                </div>
                <div className="flex py-3 px-4">
                  <span className="w-32 font-semibold text-gray-600 dark:text-gray-400">Publisher:</span>
                  <span className="text-gray-900 dark:text-white">{book.publisher}</span>
                </div>
                <div className="flex py-3 px-4">
                  <span className="w-32 font-semibold text-gray-600 dark:text-gray-400">Published:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(book.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex py-3 px-4">
                  <span className="w-32 font-semibold text-gray-600 dark:text-gray-400">Pages:</span>
                  <span className="text-gray-900 dark:text-white">{book.pages}</span>
                </div>
                <div className="flex py-3 px-4">
                  <span className="w-32 font-semibold text-gray-600 dark:text-gray-400">Language:</span>
                  <span className="text-gray-900 dark:text-white">{book.language}</span>
                </div>
                <div className="flex py-3 px-4">
                  <span className="w-32 font-semibold text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-gray-900 dark:text-white">{book.category}</span>
                </div>
          </div>
        </div>
      </div>

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative animate-scale-in">
            <button
              onClick={() => setShowWishlistModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400 fill-current" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Already in Your Wishlist
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This book is already saved in your wishlist. Would you like to view your wishlist or continue browsing?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWishlistModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Continue Browsing
                </button>
                <button
                  onClick={() => navigate('/dashboard/my-wishlist')}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  View Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Reviews</h2>
            {user && hasOrdered && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary"
              >
                Write a Review
              </button>
            )}
            {user && !hasOrdered && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                You must order this book to leave a review
              </div>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700"
                    rows="4"
                    placeholder="Share your thoughts about this book..."
                    required
                    minLength="10"
                    maxLength="500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="card p-8 text-center text-gray-500">
                No reviews yet. Be the first to review this book!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                      {(review.userName || review.userEmail || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.userName || 'Anonymous'}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Place Order</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Book Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex gap-4">
                  <img src={book.image} alt={book.title} className="w-16 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{book.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                    <p className="text-lg font-bold text-primary mt-1">${book.price}</p>
                  </div>
                </div>
              </div>

              {/* Name (Readonly) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Phone (Editable) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="input-field"
                />
              </div>

              {/* Address (Editable) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter your complete delivery address"
                  className="input-field resize-none"
                />
              </div>

              {/* Delivery Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Method *
                </label>
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="delivery">Home Delivery</option>
                  <option value="pickup">Pickup from Library</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.deliveryMethod === 'delivery' 
                    ? 'Book will be delivered to your address' 
                    : 'Pick up from your nearest library'}
                </p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submittingOrder}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
