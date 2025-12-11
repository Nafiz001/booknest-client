import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, User, Calendar, MessageSquare, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

const RequestDelivery = () => {
  const { user } = useAuth();
  const location = useLocation();
  const bookFromState = location.state?.book;
  
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(bookFromState || null);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    preferredDate: '',
    notes: '',
    deliveryType: 'delivery' // delivery or pickup
  });
  const [loading, setLoading] = useState(false);

  // Fetch all books if none was passed
  useEffect(() => {
    if (!bookFromState) {
      const fetchBooks = async () => {
        try {
          const response = await api.get('/books');
          setBooks(response.data.books);
        } catch (error) {
          console.error('Failed to fetch books:', error);
        }
      };
      fetchBooks();
    }
  }, [bookFromState]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
      toast.error('Please select a book');
      return;
    }
    
    if (!formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const userId = user?._id || user?.id;
      const orderData = {
        userId: userId,
        bookId: selectedBook._id,
        bookTitle: selectedBook.title,
        bookImage: selectedBook.image,
        bookPrice: selectedBook.price,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        deliveryType: formData.deliveryType,
        requestedDate: formData.preferredDate,
        notes: formData.notes,
        status: 'pending',
        paymentStatus: 'unpaid',
        librarianId: selectedBook.librarianId
      };
      
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        // Reset form
        setFormData({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          address: '',
          city: '',
          zipCode: '',
          preferredDate: '',
          notes: '',
          deliveryType: 'delivery'
        });
        if (!bookFromState) {
          setSelectedBook(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Request Book Delivery
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Fill out the form below to request book delivery or pickup from your nearest library
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Book Selection */}
          {!bookFromState && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Book *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  required
                  value={selectedBook?._id || ''}
                  onChange={(e) => {
                    const book = books.find(b => b._id === e.target.value);
                    setSelectedBook(book);
                  }}
                  className="input-field pl-10"
                >
                  <option value="">Choose a book...</option>
                  {books.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} - ${book.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Selected Book Display */}
          {selectedBook && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
              <img 
                src={selectedBook.image} 
                alt={selectedBook.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedBook.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {selectedBook.author}
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  ${selectedBook.price}
                </p>
              </div>
            </div>
          )}

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Service Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryType: 'delivery' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.deliveryType === 'delivery'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-light dark:border-border-dark'
                }`}
              >
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <span className="font-semibold">Home Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.deliveryType === 'pickup'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-light dark:border-border-dark'
                }`}
              >
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <span className="font-semibold">Library Pickup</span>
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="input-field pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Address
            </label>
            <textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="123 Main St, Apt 4B"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="input-field"
                placeholder="New York"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zip Code
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                required
                value={formData.zipCode}
                onChange={handleChange}
                className="input-field"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="input-field pl-10"
                placeholder="Any special instructions or preferences..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedBook}
            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestDelivery;
