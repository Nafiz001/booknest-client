import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, Clock3, Sparkles, Truck } from 'lucide-react';
import api from '../../utils/api';

const HomeGoodreads = () => {
  const { data: latestBooks = [], isLoading: booksLoading } = useQuery({
    queryKey: ['home-latest-books'],
    queryFn: async () => {
      const response = await api.get('/books?sort=newest');
      return response.data?.books?.slice(0, 4) || [];
    },
  });

  return (
    <div className="min-h-screen bg-[#07122a] text-slate-100">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#071632] via-[#081a3e] to-[#06112a] p-8 md:p-12">
          <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl"></div>
          <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                New arrivals available
              </div>

              <h1 className="text-balance font-display text-5xl font-bold leading-[1.05] text-white md:text-6xl">
                The World&apos;s
                <br />
                Library,
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-primary bg-clip-text text-transparent">Delivered.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Curated collections of modern classics and new releases delivered straight to your door, with no late fees and no clutter.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/all-books" className="btn-primary rounded-full px-6 py-3">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800/70">
                  View Plans
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Cancel anytime
                </span>
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Free shipping
                </span>
              </div>
            </div>

            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="relative w-[280px] sm:w-[320px]">
                <div className="absolute -right-10 top-3 h-[420px] w-[260px] rounded-xl bg-slate-800/70"></div>
                <div className="absolute -right-5 top-1.5 h-[430px] w-[270px] rounded-xl bg-slate-700/40"></div>
                <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-black/45">
                  <img
                    src={
                      latestBooks[0]?.image ||
                      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&h=1050&fit=crop'
                    }
                    alt={latestBooks[0]?.title || 'Featured book'}
                    className="h-[440px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Book of the month</p>
                    <p className="mt-1 text-xl font-bold text-white">{latestBooks[0]?.title || 'The Midnight Library'}</p>
                    <p className="text-sm text-slate-300">{latestBooks[0]?.author || 'Matt Haig'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900/45 p-5">
            <div className="mb-3 inline-flex rounded-lg bg-primary/20 p-2 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Next-Day Delivery</h3>
            <p className="mt-1 text-sm text-slate-400">Order by 2 PM for tracked delivery to your doorstep by tomorrow.</p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900/45 p-5">
            <div className="mb-3 inline-flex rounded-lg bg-primary/20 p-2 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Pristine Condition</h3>
            <p className="mt-1 text-sm text-slate-400">Every book is inspected and wrapped for a premium reading experience.</p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900/45 p-5">
            <div className="mb-3 inline-flex rounded-lg bg-primary/20 p-2 text-primary">
              <Clock3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">No Late Fees</h3>
            <p className="mt-1 text-sm text-slate-400">Keep books as long as you want. Great reading should never be rushed.</p>
          </article>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-4xl font-bold text-white">Just Landed</h2>
              <p className="mt-1 text-sm text-slate-400">Fresh titles from premium publishers.</p>
            </div>
            <Link to="/all-books" className="text-sm font-semibold text-primary hover:underline">
              View All Books
            </Link>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-[330px] rounded-xl bg-slate-900/40 skeleton-shimmer"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {latestBooks.map((book, index) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/45 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="relative">
                    <img src={book.image} alt={book.title} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {index === 0 && (
                      <span className="absolute right-2 top-2 rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        New
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-base font-bold text-white">{book.title}</h3>
                    <p className="mt-1 truncate text-sm text-slate-400">{book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/45">
            <img
              src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&h=480&fit=crop"
              alt="Coverage map"
              className="h-64 w-full object-cover opacity-85"
            />
            <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
              Active in 10+ major metros
            </div>
          </div>

          <article className="rounded-xl border border-slate-800 bg-slate-900/45 p-6">
            <h3 className="font-display text-3xl font-bold text-white">Delivering to Major Metros</h3>
            <p className="mt-2 text-sm text-slate-400">
              Our logistical network ensures books arrive in top condition across major cities, usually within 24 hours.
            </p>
            <div className="mt-5 space-y-2">
              <div className="rounded-lg border border-slate-700 bg-[#0a1a39] px-4 py-3 text-sm text-slate-200">info@booknest.com</div>
              <div className="rounded-lg border border-slate-700 bg-[#0a1a39] px-4 py-3 text-sm text-slate-200">support@booknest.com</div>
            </div>
          </article>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0a1737] to-[#0c214f] px-6 py-12 text-center">
          <h2 className="font-display text-4xl font-bold text-white">Ready to start your reading journey?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
            Join thousands of readers who trust BookNest for premium delivery and curated recommendations.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="btn-primary rounded-full px-6">
              Start Free Trial
            </Link>
            <Link
              to="/all-books"
              className="inline-flex items-center rounded-full border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
              Explore Catalog
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeGoodreads;
