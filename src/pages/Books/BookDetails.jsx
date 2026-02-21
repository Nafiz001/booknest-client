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
    deliveryMethod: 'delivery',
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
      const inWishlist = response.data.wishlist.some((item) => item.bookId === id);
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
        comment: reviewForm.comment,
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
        librarianId: book.librarianId,
      };

      await api.post('/orders', orderData);
      toast.success('Order placed successfully!');
      setIsModalOpen(false);
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        deliveryMethod: 'delivery',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < fullStars
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalfStar
                ? 'fill-amber-400 text-amber-400 opacity-50'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
          {rating} {book?.reviews ? `(${book.reviews.toLocaleString()} reviews)` : ''}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark px-4">
        <div className="card max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Book Not Found</h2>
          <Link to="/all-books" className="btn-primary mt-5">
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-10 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm">
          <Link to="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link to="/all-books" className="text-primary hover:underline">
            All Books
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              <div className="card overflow-hidden">
                <img src={book.image} alt={book.title} className="h-auto w-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all disabled:opacity-60 ${
                    isInWishlist
                      ? 'border border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  {addingToWishlist ? 'Adding...' : isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button className="btn-secondary">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{book.category || 'General'}</p>
              <h1 className="mt-2 text-balance text-4xl font-bold text-slate-900 dark:text-white">{book.title}</h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                by <span className="font-semibold text-primary">{book.author}</span>
              </p>
              <div className="mt-4">{renderStars(book.rating)}</div>
            </div>

            <div className="card bg-gradient-to-r from-slate-50 to-white p-5 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-primary">${book.price}</span>
                <span
                  className={`status-pill ${
                    book.published
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}
                >
                  {book.published ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!book.published}
                className="btn-primary mt-4 w-full py-3 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                Order Now
              </button>
            </div>

            <div className="card p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About This Book</h2>
              <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{book.description}</p>
            </div>

            <div className="table-shell">
              <div className="border-b border-slate-200 p-5 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Book Information</h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {[
                  ['ISBN', book.isbn],
                  ['Publisher', book.publisher],
                  [
                    'Published',
                    book.publishDate
                      ? new Date(book.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'N/A',
                  ],
                  ['Pages', book.pages],
                  ['Language', book.language],
                  ['Category', book.category],
                ].map(([label, value]) => (
                  <div key={label} className="flex px-5 py-3 text-sm">
                    <span className="w-32 font-semibold text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="text-slate-800 dark:text-slate-200">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Community Reviews</h2>
            {user && hasOrdered && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="btn-primary">
                Write a Review
              </button>
            )}
            {user && !hasOrdered && <div className="text-sm text-slate-500 dark:text-slate-400">You must order this book to leave a review</div>}
          </div>

          {showReviewForm && (
            <div className="card mb-6 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Write Your Review</h3>
              <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <Star className={`h-7 w-7 ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="input-field min-h-[130px] resize-none"
                    placeholder="Share your thoughts about this book..."
                    required
                    minLength="10"
                    maxLength="500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="card p-8 text-center text-slate-500 dark:text-slate-400">
                No reviews yet. Be the first to review this book!
              </div>
            ) : (
              reviews.map((review) => (
                <article key={review._id} className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/80 text-sm font-bold text-white">
                      {(review.userName || review.userEmail || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{review.userName || 'Anonymous'}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{review.comment}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {showWishlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="card w-full max-w-md animate-scale-in p-6">
            <button
              onClick={() => setShowWishlistModal(false)}
              className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/25">
                <Heart className="h-7 w-7 fill-current text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Already in Your Wishlist</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                This book is already saved in your wishlist. View wishlist or continue browsing.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button onClick={() => setShowWishlistModal(false)} className="btn-secondary text-sm">
                  Continue
                </button>
                <button onClick={() => navigate('/dashboard/wishlist')} className="btn-primary text-sm">
                  View Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Place Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex gap-3">
                  <img src={book.image} alt={book.title} className="h-24 w-16 rounded object-cover" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{book.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{book.author}</p>
                    <p className="mt-1 text-lg font-bold text-primary">${book.price}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input type="text" value={formData.name} readOnly className="input-field cursor-not-allowed bg-slate-100 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input type="email" value={formData.email} readOnly className="input-field cursor-not-allowed bg-slate-100 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
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
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Delivery Address *</label>
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
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Delivery Method *</label>
                  <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} required className="input-field">
                    <option value="delivery">Home Delivery</option>
                    <option value="pickup">Pickup from Library</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={submittingOrder} className="btn-primary mt-6 w-full py-3">
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
