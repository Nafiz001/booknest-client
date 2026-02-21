import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const MyBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    image: '',
    status: 'published',
  });

  useEffect(() => {
    fetchMyBooks();
  }, [user]);

  const fetchMyBooks = async () => {
    try {
      const userId = user?.id || user?._id;
      const response = await api.get(`/books/librarian/${userId}`);
      setBooks(response.data.books);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
      const response = await api.patch(`/books/${id}`, { status: newStatus });
      
      setBooks(books.map(book => 
        book._id === id ? response.data.book : book
      ));
      
      toast.success(`Book ${newStatus} successfully`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      price: Number(book.price || 0),
      image: book.image || '',
      status: book.status || 'published',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editForm.title || !editForm.author || !editForm.category || !editForm.image) {
      toast.error('Please complete all required fields');
      return;
    }

    if (Number(editForm.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    try {
      setSavingEdit(true);
      const payload = {
        title: editForm.title.trim(),
        author: editForm.author.trim(),
        category: editForm.category.trim(),
        price: Number(editForm.price),
        image: editForm.image.trim(),
        status: editForm.status,
      };

      const response = await api.patch(`/books/${editingBook._id}`, payload);
      const updatedBook = response.data?.book || { ...editingBook, ...payload };

      setBooks((prev) =>
        prev.map((book) => (book._id === editingBook._id ? { ...book, ...updatedBook } : book))
      );
      toast.success('Book updated successfully');
      setEditingBook(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setSavingEdit(false);
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
    <div className="animate-fade-in">
      <Toaster position="top-right" />
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Inventory</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">My Books</h1>
          <p className="text-gray-600 dark:text-gray-400">{books.length} books in your library</p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No books yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start adding books to your library
          </p>
        </div>
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="table-head-cell">
                    Book
                  </th>
                  <th className="table-head-cell">
                    Price
                  </th>
                  <th className="table-head-cell">
                    Category
                  </th>
                  <th className="table-head-cell">
                    Status
                  </th>
                  <th className="table-head-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {books.map((book) => (
                  <tr key={book._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="table-cell whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-16 w-12 rounded object-cover" src={book.image} alt={book.title} />
                        <div className="ml-4">
                          <div className="text-sm font-medium">{book.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">${book.price}</div>
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm">{book.category}</div>
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="table-cell whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStatus(book._id, book.status)}
                          className="text-blue-600 transition-colors hover:text-blue-900 dark:text-blue-400"
                          title={book.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {book.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(book)}
                          className="text-green-600 transition-colors hover:text-green-900 dark:text-green-400"
                          title="Edit book"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 transition-colors hover:text-red-900 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Book</h3>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close edit modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Author</label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, author: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Price</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="input-field"
                >
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingEdit} className="btn-primary">
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
