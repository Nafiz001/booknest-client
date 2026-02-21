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
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white/90 p-4 backdrop-blur lg:flex dark:border-slate-800 dark:bg-background-dark/95">
          <div className="mb-6 flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">BookNest</h2>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {userRole} panel
              </p>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=80&background=1754cf&color=fff`
                }
                alt={user?.displayName || 'User'}
                className="h-12 w-12 rounded-full border border-primary/30 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.displayName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/55" onClick={() => setIsSidebarOpen(false)}></div>
            <aside className="absolute left-0 top-0 h-full w-72 animate-slide-right bg-white p-4 dark:bg-background-dark">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-surface-dark">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=80&background=1754cf&color=fff`
                    }
                    alt={user?.displayName || 'User'}
                    className="h-12 w-12 rounded-full border border-primary/30 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.displayName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-background-dark/85">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h1 className="text-base font-semibold text-slate-900 dark:text-white">Dashboard</h1>
              </div>
              <div className="w-9"></div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
