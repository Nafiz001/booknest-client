import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  FileText,
  Heart,
  BookPlus,
  Library,
  Truck,
  Users,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  // Get user role from user object (populated by AuthContext from backend)
  const userRole = user?.role || 'user'; // 'user', 'librarian', 'admin'

  const userLinks = [
    { name: 'My Orders', path: '/dashboard/my-orders', icon: ShoppingBag },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
    { name: 'Invoices', path: '/dashboard/invoices', icon: FileText },
    { name: 'My Wishlist', path: '/dashboard/wishlist', icon: Heart },
  ];

  const librarianLinks = [
    { name: 'Add Book', path: '/dashboard/add-book', icon: BookPlus },
    { name: 'My Books', path: '/dashboard/my-books', icon: Library },
    { name: 'Orders', path: '/dashboard/orders', icon: Truck },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'All Users', path: '/dashboard/all-users', icon: Users },
    { name: 'Manage Books', path: '/dashboard/manage-books', icon: BookOpen },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
  ];

  const links = userRole === 'admin' ? adminLinks : userRole === 'librarian' ? librarianLinks : userLinks;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark min-h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="mb-6 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=48&background=2563eb&color=fff`}
                  alt={user?.displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface-light dark:bg-surface-dark animate-slide-right">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard className="w-8 h-8 text-primary" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* User Profile Card */}
                <div className="mb-6 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=48&background=2563eb&color=fff`}
                      alt={user?.displayName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {links.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
              </div>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
