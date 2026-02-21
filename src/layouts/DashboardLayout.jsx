import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
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
  X,
  PlusCircle,
  Settings,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/shared/ThemeToggle';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'user';

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', path: '/dashboard/my-orders', icon: ShoppingBag },
    { name: 'Wishlist', path: '/dashboard/wishlist', icon: Heart },
    { name: 'Invoices', path: '/dashboard/invoices', icon: FileText },
    { name: 'Settings', path: '/dashboard/profile', icon: Settings },
  ];

  const librarianLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Book', path: '/dashboard/add-book', icon: BookPlus },
    { name: 'My Books', path: '/dashboard/my-books', icon: Library },
    { name: 'Orders', path: '/dashboard/orders', icon: Truck },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Users', path: '/dashboard/all-users', icon: Users },
    { name: 'Manage Books', path: '/dashboard/manage-books', icon: BookOpen },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const links = userRole === 'admin' ? adminLinks : userRole === 'librarian' ? librarianLinks : userLinks;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#07122a] dark:text-slate-100">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#030b1c] lg:flex">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">BookNest</h2>
                  <p className="text-xs text-slate-500 capitalize dark:text-slate-400">{userRole} panel</p>
                </div>
              </div>

              <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=80&background=1754cf&color=fff`
                    }
                    alt={user?.displayName || 'User'}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.displayName || 'User'}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userRole === 'user' ? 'Premium Member' : userRole}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="space-y-2">
              <ThemeToggle className="w-full justify-center" iconClassName="h-4 w-4" />
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:text-white"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
              <button
                type="button"
                onClick={() => navigate('/request-delivery')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15 dark:bg-[#0b2c67] dark:text-primary dark:hover:bg-[#133781]"
              >
                <PlusCircle className="h-4 w-4" />
                Request New Book
              </button>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
            <aside className="absolute left-0 top-0 h-full w-72 animate-slide-right bg-white p-4 dark:bg-[#030b1c]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">BookNest</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
                <Link
                  to="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
                >
                  <Home className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
                <ThemeToggle className="mt-2 w-full justify-center" iconClassName="h-4 w-4" />
              </nav>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-[#07122a]/90 lg:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h1 className="text-base font-semibold text-slate-900 dark:text-white">Dashboard</h1>
              </div>
              <ThemeToggle className="h-9 w-9 px-0" iconClassName="h-4 w-4" label={false} />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1300px] p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
