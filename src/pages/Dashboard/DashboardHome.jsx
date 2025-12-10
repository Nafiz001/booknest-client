import { useAuth } from '../../context/AuthContext';
import { Package, BookOpen, Users } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const role = user?.role || 'user';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user?.displayName || user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {role === 'admin' && 'Manage users and books from your admin dashboard'}
          {role === 'librarian' && 'Manage your books and orders'}
          {role === 'user' && 'View your orders and manage your account'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === 'user' && (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">My Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">View Orders</p>
                </div>
                <Package className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">My Wishlist</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Saved Books</p>
                </div>
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
          </>
        )}

        {role === 'librarian' && (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">My Books</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Manage Books</p>
                </div>
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Book Orders</p>
                </div>
                <Package className="w-12 h-12 text-primary" />
              </div>
            </div>
          </>
        )}

        {role === 'admin' && (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">All Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Manage Users</p>
                </div>
                <Users className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">All Books</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Manage Books</p>
                </div>
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
