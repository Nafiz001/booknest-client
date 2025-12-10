import { useState } from 'react';
import { BookOpen, Upload, DollarSign } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { uploadImage } from '../../../utils/imageUpload';

const AddBook = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image: null,
    status: 'published',
    price: '',
    isbn: '',
    publisher: '',
    pages: '',
    language: 'English',
    category: 'Fiction',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/books', formData);
      
      if (response.data.success) {
        toast.success('Book added successfully!');
        
        // Reset form
        setFormData({
          title: '',
          author: '',
          image: null,
          status: 'published',
          price: '',
          isbn: '',
          publisher: '',
          pages: '',
          language: 'English',
          category: 'Fiction',
          description: ''
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Add book error:', error);
      toast.error(error.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Book</h1>
        <p className="text-gray-600 dark:text-gray-400">Add a new book to the library collection</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Book Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Book Cover Image
            </label>
            <div className="flex items-center space-x-6">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-32 h-44 object-cover rounded-lg shadow-lg" />
              ) : (
                <div className="w-32 h-44 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label className="cursor-pointer">
                <div className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload Image</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                value={formData.author}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ISBN
              </label>
              <input
                id="isbn"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                className="input-field"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publisher
              </label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                className="input-field"
                placeholder="Publisher name"
              />
            </div>

            <div>
              <label htmlFor="pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pages
              </label>
              <input
                id="pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleChange}
                className="input-field"
                placeholder="304"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <input
                id="language"
                name="language"
                type="text"
                value={formData.language}
                onChange={handleChange}
                className="input-field"
                placeholder="English"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
                <option value="Self-Help">Self-Help</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Enter book description..."
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3 text-lg font-semibold">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
