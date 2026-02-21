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
  X,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

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
    <div className="min-h-screen bg-[#07122a] text-slate-100">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-800 bg-[#030b1c] p-4 lg:flex">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">BookNest</h2>
                  <p className="text-xs text-slate-400 capitalize">{userRole} panel</p>
                </div>
              </div>

              <div className="mb-5 rounded-xl border border-slate-700 bg-slate-900/80 p-3">
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
                    <p className="truncate text-sm font-semibold text-white">{user?.displayName || 'User'}</p>
                    <p className="truncate text-xs text-slate-400">{userRole === 'user' ? 'Premium Member' : userRole}</p>
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
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b2c67] px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-[#133781]">
              <PlusCircle className="h-4 w-4" />
              Request New Book
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
            <aside className="absolute left-0 top-0 h-full w-72 bg-[#030b1c] p-4 animate-slide-right">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-white">BookNest</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
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
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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
          <div className="sticky top-0 z-40 border-b border-slate-800 bg-[#07122a]/90 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h1 className="text-base font-semibold text-white">Dashboard</h1>
              </div>
              <div className="w-9"></div>
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
