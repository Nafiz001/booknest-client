import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { getBookById } from '../../data/books';

const BookDetails = () => {
  const { id } = useParams();
  const book = getBookById(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe', // Readonly - from auth
    email: 'john.doe@example.com', // Readonly - from auth
    phone: '',
    address: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save order to database
    console.log('Order placed:', { ...formData, bookId: book.id, status: 'pending', paymentStatus: 'unpaid' });
    setIsModalOpen(false);
    // Show success message
    alert('Order placed successfully!');
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
          {rating} ({book.reviews.toLocaleString()} reviews)
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
          <Link to="/books" className="text-blue-600 dark:text-blue-400 hover:underline">All Books</Link>
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
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Add to Wishlist
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
                  {book.status === 'published' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={book.status !== 'published'}
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
              <div className="mb-6">
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

              {/* Submit Button */}
              <button type="submit" className="w-full btn-primary py-3 text-lg">
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
