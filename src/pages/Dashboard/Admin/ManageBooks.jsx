import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../utils/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, unpublished

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data.books);
    } catch (error) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookStatus = async (bookId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
      const response = await api.patch(`/books/${bookId}/status`, { status: newStatus });
      
      setBooks(books.map(book => 
        book._id === bookId ? response.data.book : book
      ));
      
      toast.success(`Book ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update book status');
    }
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.delete(`/books/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Books</h1>
          <p className="text-gray-600 dark:text-gray-400">{filteredBooks.length} books total</p>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Books</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Librarian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-16 w-12 rounded object-cover" src={book.image} alt={book.title} />
                      <div className="ml-4">
                        <div className="text-sm font-medium">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{book.librarian?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{book.librarian?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary">${book.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{book.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleBookStatus(book._id, book.status)}
                        className={`px-3 py-1 rounded ${
                          book.status === 'published'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        } hover:opacity-80 transition-opacity`}
                        title={book.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {book.status === 'published' ? (
                          <><EyeOff className="w-4 h-4 inline mr-1" />Unpublish</>
                        ) : (
                          <><Eye className="w-4 h-4 inline mr-1" />Publish</>
                        )}
                      </button>
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
