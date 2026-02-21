import { useAuth } from '../../context/AuthContext';
import { Package, BookOpen, Users } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const role = user?.role || 'user';

  const userCards = [
    { label: 'My Orders', value: 'Track Orders', icon: Package },
    { label: 'My Wishlist', value: 'Saved Books', icon: BookOpen },
  ];

  const librarianCards = [
    { label: 'My Books', value: 'Manage Books', icon: BookOpen },
    { label: 'Orders', value: 'Book Orders', icon: Package },
  ];

  const adminCards = [
    { label: 'All Users', value: 'Manage Users', icon: Users },
    { label: 'All Books', value: 'Manage Books', icon: BookOpen },
  ];

  const cards = role === 'admin' ? adminCards : role === 'librarian' ? librarianCards : userCards;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.displayName || user?.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {role === 'admin' && 'Manage users and books from your admin dashboard'}
          {role === 'librarian' && 'Manage your books and orders'}
          {role === 'user' && 'View your orders and manage your account'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card group overflow-hidden p-6 hover-lift">
            <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-all group-hover:bg-primary group-hover:text-white">
              <card.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
          </div>
        ))}

        <div className="card col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">Quick Insight</p>
          <h3 className="mt-3 text-2xl font-bold">Your workspace is live</h3>
          <p className="mt-2 text-sm text-slate-200">Keep your records updated for a cleaner experience across orders, books, and invoices.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
