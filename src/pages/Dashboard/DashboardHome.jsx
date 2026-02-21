import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, Clock3, Sparkles, Truck, Wallet } from 'lucide-react';
import RevealOnScroll from '../../components/shared/RevealOnScroll';

const kpiCards = [
  {
    title: 'Active Orders',
    value: '2',
    meta: 'In Transit',
    note: 'Arriving by Friday, Oct 24th',
    icon: Truck,
    accent: 'text-emerald-500',
    progress: 66,
  },
  {
    title: 'Books in Wishlist',
    value: '14',
    meta: 'Titles',
    note: '7 added this month',
    icon: Bookmark,
    accent: 'text-primary',
    progress: 72,
  },
  {
    title: 'Total Saved',
    value: '$120.50',
    meta: '+12% vs last year',
    note: 'Based on retail comparison',
    icon: Wallet,
    accent: 'text-emerald-500',
    progress: 84,
  },
];

const activityFeed = [
  {
    title: 'Order #1234 Delivered',
    when: '2 hours ago',
    detail: '"Atomic Habits" arrived at your doorstep.',
    dot: 'bg-emerald-500',
  },
  {
    title: 'Added to Wishlist',
    when: 'Yesterday',
    detail: '"Dune" was added to your reading list.',
    dot: 'bg-primary',
  },
  {
    title: 'Returned Book',
    when: 'Oct 20, 2023',
    detail: '"Project Hail Mary" was returned successfully.',
    dot: 'bg-slate-400',
  },
  {
    title: 'Membership Renewed',
    when: 'Oct 15, 2023',
    detail: 'Pro Reader plan renewed for another cycle.',
    dot: 'bg-amber-400',
  },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(' ')[0] || 'Alex';

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <RevealOnScroll y={12}>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/45 md:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl"></div>
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Good evening, {firstName}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 md:text-base">
                Here&apos;s what&apos;s happening with your library today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </span>
                Library Status: Online
              </span>
              <button
                type="button"
                onClick={() => navigate('/memberships')}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:text-white"
              >
                <Sparkles className="h-4 w-4" />
                Memberships
              </button>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <RevealOnScroll key={card.title} delay={index * 90}>
              <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-900/45">
                <div className="pointer-events-none absolute right-4 top-4 opacity-15 transition-opacity group-hover:opacity-25">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                    <p className={`text-sm font-semibold ${card.accent}`}>{card.meta}</p>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${card.progress}%` }}></div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{card.note}</p>
                </div>
              </article>
            </RevealOnScroll>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <RevealOnScroll delay={40}>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Reading Habits</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pages read over the last 30 days</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">1,240</p>
                  <p className="text-sm font-semibold text-emerald-500">+85 pages</p>
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
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-black">
              <div
                className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#1754cf 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              ></div>
              <p className="relative inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
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
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={80} className="xl:col-span-4">
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                Timeline
              </span>
            </div>

            <div className="relative mt-5 space-y-6 border-l border-slate-200 pl-4 dark:border-slate-700">
              {activityFeed.map((item) => (
                <div key={`${item.title}-${item.when}`} className="relative">
                  <span className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full ${item.dot} ring-4 ring-slate-100 dark:ring-slate-900`}></span>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.when}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <button
                type="button"
                onClick={() => navigate('/dashboard/my-orders')}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                View Full History
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/memberships')}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200 dark:hover:text-white"
              >
                Manage Membership
              </button>
            </div>
          </aside>
        </RevealOnScroll>
      </section>
    </div>
  );
};

export default DashboardHome;
