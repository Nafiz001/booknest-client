import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const relatedFallbackBooks = [
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=460&fit=crop',
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=460&fit=crop',
  },
  {
    title: 'A Man Called Ove',
    author: 'Fredrik Backman',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=460&fit=crop',
  },
  {
    title: 'Normal People',
    author: 'Sally Rooney',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=460&fit=crop',
  },
];

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
      toast.success('Review submitted successfully');
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
      toast.success('Added to wishlist');
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
      toast.success('Order placed successfully');
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
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < fullStars ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111621]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111621] px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#1a202c] p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Book Not Found</h2>
          <Link to="/all-books" className="btn-primary mt-5">
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111621] text-slate-100 pb-24 lg:pb-10">
      <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-4 py-8 lg:grid-cols-12 lg:px-10">
        <section className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24">
            <div className="group relative mx-auto w-full max-w-[340px] lg:mx-0">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60"></div>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="mt-8 hidden rounded-xl border border-white/10 bg-[#1a202c]/75 p-6 backdrop-blur lg:block">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-white">${Number(book.price || 0).toFixed(2)}</span>
                <span className="text-sm text-slate-500 line-through">
                  ${(Number(book.price || 0) + 8).toFixed(2)}
                </span>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {book.published ? 'In Stock & Ready to Ship' : 'Currently unavailable'}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!book.published}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Order Now
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-600 disabled:opacity-60"
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-rose-400' : 'text-rose-400'}`} />
                {addingToWishlist ? 'Adding...' : isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>

              <div className="mt-4 border-t border-white/10 pt-4 text-center text-xs text-slate-500">
                30-Day Money Back Guarantee
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8 lg:col-span-8 xl:col-span-9">
          <div>
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link to="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/all-books" className="transition-colors hover:text-primary">
                All Books
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-slate-300">{book.category || 'General'}</span>
            </nav>

            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white md:text-6xl">{book.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 md:gap-8">
              <p className="text-2xl font-medium text-primary">{book.author}</p>
              <div className="hidden h-6 w-px bg-white/20 sm:block"></div>
              <div className="flex items-center gap-2">
                {renderStars(book.rating)}
                <span className="font-bold text-white">{Number(book.rating || 0).toFixed(1)}</span>
                <span className="text-sm text-slate-500">({Number(book.reviews || reviews.length || 0).toLocaleString()} reviews)</span>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-primary hover:text-primary">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {[
              { label: 'Hardcover', price: Number(book.price || 0).toFixed(2), active: true },
              { label: 'Paperback', price: (Number(book.price || 0) - 2).toFixed(2) },
              { label: 'Audiobook', price: (Number(book.price || 0) + 6).toFixed(2) },
              { label: 'Kindle', price: (Number(book.price || 0) - 4).toFixed(2) },
            ].map((item) => (
              <button
                key={item.label}
                className={`min-w-[145px] rounded-xl border p-4 text-left transition-colors ${
                  item.active
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-white/10 bg-transparent text-slate-400 hover:border-white/20'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-white">${item.price}</p>
              </button>
            ))}
          </div>

          <section>
            <h3 className="mb-4 text-lg font-bold text-white">About the Book</h3>
            <div className="space-y-4 text-base leading-relaxed text-slate-300">
              <p>{book.description || 'No description available for this book.'}</p>
              <p>
                A thoughtful and immersive reading experience, this title continues to be one of BookNest readers&apos;
                most recommended picks.
              </p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Publisher</span>
              <span className="font-medium text-white">{book.publisher || 'N/A'}</span>
            </div>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Release Date</span>
              <span className="font-medium text-white">
                {book.publishDate
                  ? new Date(book.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Print Length</span>
              <span className="font-medium text-white">{book.pages ? `${book.pages} Pages` : 'N/A'}</span>
            </div>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">ISBN</span>
              <span className="font-medium text-white">{book.isbn || 'N/A'}</span>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-white">Community Reviews</h3>
              {user && hasOrdered && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-sm font-bold text-primary transition-colors hover:text-blue-400"
                >
                  Write a Review
                </button>
              )}
            </div>

            {user && !hasOrdered && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                You must order this book to leave a review.
              </div>
            )}

            {showReviewForm && (
              <div className="rounded-xl border border-white/10 bg-[#1a202c] p-5">
                <h4 className="text-lg font-bold text-white">Write Your Review</h4>
                <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                          <Star
                            className={`h-7 w-7 ${
                              star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="min-h-[130px] w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                      placeholder="Share your thoughts about this book..."
                      required
                      minLength="10"
                      maxLength="500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#1a202c] p-8 text-center text-slate-400">
                No reviews yet. Be the first to review this book.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review) => (
                  <article key={review._id} className="rounded-xl border border-white/10 bg-[#1a202c] p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {(review.userName || review.userEmail || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{review.userName || 'Anonymous'}</h4>
                          <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">People also liked</h3>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar">
              {relatedFallbackBooks.map((item) => (
                <div key={item.title} className="min-w-[145px] cursor-pointer">
                  <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <h4 className="mt-3 truncate text-sm font-bold text-white">{item.title}</h4>
                  <p className="truncate text-xs text-slate-500">{item.author}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-[#1a202c]/90 p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">${Number(book.price || 0).toFixed(2)}</span>
            <span className="text-xs text-emerald-400">{book.published ? 'In Stock' : 'Unavailable'}</span>
          </div>
          <div className="flex flex-1 justify-end gap-2">
            <button
              onClick={handleAddToWishlist}
              disabled={addingToWishlist}
              className="rounded-lg bg-slate-700 p-3 text-rose-400 disabled:opacity-60"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!book.published}
              className="max-w-[220px] flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {showWishlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#1a202c] p-6">
            <button
              onClick={() => setShowWishlistModal(false)}
              className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                <Heart className="h-7 w-7 fill-current text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Already in Your Wishlist</h3>
              <p className="mt-2 text-sm text-slate-400">
                This book is already saved in your wishlist. View wishlist or continue browsing.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowWishlistModal(false)}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-600"
                >
                  Continue
                </button>
                <button
                  onClick={() => navigate('/dashboard/wishlist')}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  View Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md overflow-y-auto rounded-xl border border-white/10 bg-[#1a202c]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h3 className="text-2xl font-bold text-white">Place Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-5 rounded-lg bg-slate-900/70 p-4">
                <div className="flex gap-3">
                  <img src={book.image} alt={book.title} className="h-24 w-16 rounded object-cover" />
                  <div>
                    <h4 className="font-semibold text-white">{book.title}</h4>
                    <p className="text-sm text-slate-400">{book.author}</p>
                    <p className="mt-1 text-lg font-bold text-primary">${Number(book.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    readOnly
                    className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-slate-300 opacity-70"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-slate-300 opacity-70"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Enter your complete delivery address"
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Delivery Method *</label>
                  <select
                    name="deliveryMethod"
                    value={formData.deliveryMethod}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="delivery">Home Delivery</option>
                    <option value="pickup">Pickup from Library</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingOrder}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
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
