import { useState, useEffect } from 'react';
import { Users, Shield, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../utils/api';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      // Re-fetch users to get updated data
      await fetchUsers();
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      user: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      librarian: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[role] || colors.user;
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Users</h1>
        <p className="text-gray-600 dark:text-gray-400">{users.length} registered users</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Auth Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {users.map((user) => user && (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <img className="h-10 w-10 rounded-full" src={user.photoURL} alt={user.name || 'User'} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium">{user.name || 'No Name'}</div>
                        <div className="text-sm text-gray-500">ID: {user._id?.toString().slice(-6) || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm">{user.authProvider}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {user.role !== 'librarian' && (
                        <button
                          onClick={() => updateUserRole(user._id, 'librarian')}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          Make Librarian
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => updateUserRole(user._id, 'admin')}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          <Shield className="w-3 h-3" />
                          Make Admin
                        </button>
                      )}
                      {user.role !== 'user' && (
                        <button
                          onClick={() => updateUserRole(user._id, 'user')}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Users className="w-3 h-3" />
                          Make User
                        </button>
                      )}
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

export default AllUsers;
