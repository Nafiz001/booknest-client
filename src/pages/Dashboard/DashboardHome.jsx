import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, Truck, Wallet } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(' ')[0] || 'Alex';

  return (
    <div className="animate-fade-in flex flex-col gap-6 md:gap-8">
      <div className="animate-slide-up flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">Good evening, {firstName}</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400 md:text-xl">Here&apos;s what&apos;s happening with your library today.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          Library Status: Online
        </div>
      </div>

      <section className="animate-slide-up animate-delay-100 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-800/70">
          <div className="pointer-events-none absolute right-0 top-0 p-5 opacity-15 transition-opacity group-hover:opacity-25">
            <Truck className="h-12 w-12 text-primary" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Active Orders</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">2</p>
              <p className="text-sm font-semibold text-emerald-400">In Transit</p>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full w-2/3 rounded-full bg-primary"></div>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Arriving by Friday, Oct 24th</p>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-800/70">
          <div className="pointer-events-none absolute right-0 top-0 p-5 opacity-15 transition-opacity group-hover:opacity-25">
            <Bookmark className="h-12 w-12 text-primary" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Books in Wishlist</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">14</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Titles</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/wishlist')}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Browse Wishlist
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-800/70">
          <div className="pointer-events-none absolute right-0 top-0 p-5 opacity-15 transition-opacity group-hover:opacity-25">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Total Saved</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">$120.50</p>
              <p className="text-sm font-semibold text-emerald-400">+12% vs last year</p>
            </div>
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">Based on retail price comparison</p>
          </div>
        </article>
      </section>

      <section className="animate-slide-up animate-delay-150 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800/70">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Reading Habits</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pages read over the last 30 days</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">1,240</p>
                <p className="text-sm font-semibold text-emerald-400">+85 pages</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="readingChartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1754cf" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#1754cf" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="10" x2="100" y2="10" stroke="#334155" strokeWidth="0.2" strokeDasharray="2" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.2" strokeDasharray="2" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#334155" strokeWidth="0.2" strokeDasharray="2" />
                <path d="M0,35 Q10,32 20,25 T40,20 T60,15 T80,28 T100,10 V40 H0 Z" fill="url(#readingChartGradient)" />
                <path d="M0,35 Q10,32 20,25 T40,20 T60,15 T80,28 T100,10" fill="none" stroke="#1754cf" strokeWidth="0.9" strokeLinecap="round" />
                <circle cx="20" cy="25" r="1" fill="#1754cf" />
                <circle cx="60" cy="15" r="1" fill="#1754cf" />
                <circle cx="100" cy="10" r="1.35" fill="#fff" stroke="#1754cf" strokeWidth="0.5" />
              </svg>
              <div className="mt-2 grid grid-cols-4 text-center text-xs text-slate-500 dark:text-slate-500">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white p-6 dark:border-slate-700 dark:from-slate-800 dark:to-black">
            <div
              className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#1754cf 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>
            <p className="relative inline-flex rounded-full bg-primary/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Currently Reading
            </p>
            <div className="relative mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-36 w-24 shrink-0 overflow-hidden rounded-md border border-slate-300 shadow-2xl dark:border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?w=300&h=450&fit=crop"
                  alt="Current reading book"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">The Great Gatsby</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by F. Scott Fitzgerald</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-900 dark:text-white">64%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[64%] rounded-full bg-primary shadow-[0_0_14px_rgba(23,84,207,0.45)]"></div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/all-books')}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Continue Reading
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/all-books')}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800/70 xl:col-span-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <div className="relative mt-6 flex-1 space-y-7 border-l border-slate-200 pl-4 dark:border-slate-700">
            <div className="relative">
              <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-slate-100 dark:ring-slate-800"></span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Order #1234 Delivered</p>
              <p className="text-xs text-slate-500">2 hours ago</p>
              <p className="mt-2 rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                &quot;Atomic Habits&quot; arrived at your doorstep.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-slate-100 dark:ring-slate-800"></span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Added to Wishlist</p>
              <p className="text-xs text-slate-500">Yesterday</p>
              <div className="mt-2 inline-flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=120&fit=crop"
                  alt="Dune cover"
                  className="h-8 w-8 rounded object-cover"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Dune</span>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-slate-500 ring-4 ring-slate-100 dark:ring-slate-800"></span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Returned Book</p>
              <p className="text-xs text-slate-500">Oct 20, 2023</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">&quot;Project Hail Mary&quot; was returned successfully.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-amber-400 ring-4 ring-slate-100 dark:ring-slate-800"></span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Membership Renewed</p>
              <p className="text-xs text-slate-500">Oct 15, 2023</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-orders')}
            className="mt-6 w-full rounded-lg py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-primary/80"
          >
            View Full History
          </button>
        </aside>
      </section>
    </div>
  );
};

export default DashboardHome;
