import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import HeroSlider from '../../components/shared/HeroSlider';
import LatestBooks from '../../components/shared/LatestBooks';
import WhyChooseUs from '../../components/shared/WhyChooseUs';
import CoverageMap from '../../components/shared/CoverageMap';
import api from '../../utils/api';

const HomeGoodreads = () => {
  const { data: featuredBooks = [], isLoading: loading } = useQuery({
    queryKey: ['featuredBooks'],
    queryFn: async () => {
      const response = await api.get('/books?sort=newest');
      return response.data.books.slice(0, 4);
    },
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center text-xs">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating || 0) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <HeroSlider />

      <div className="border-y border-slate-200 bg-white/60 py-2 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 sm:px-6 lg:px-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>2026 Reader Favorites are now live.</span>
          <Link to="/all-books" className="inline-flex items-center gap-1 text-primary hover:underline">
            Explore
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <div className="card overflow-hidden p-0">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Reader Hub</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight">Build your next reading streak.</h2>
                <p className="mt-3 text-sm text-slate-200">
                  Save titles, track progress, and get recommendations tailored to your reading behavior.
                </p>
                <div className="mt-5 flex gap-2 text-xs text-slate-200">
                  <span className="rounded-full bg-white/15 px-3 py-1">10k+ titles</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">48h delivery</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-slate-200 text-center dark:border-slate-700">
                <div className="border-r border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">4.9</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Average Rating</p>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">25k+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Community Reviews</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Reading Challenge
              </h3>
              <div className="mt-4 flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">2026 BookNest Challenge</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Finish 24 books this year and unlock exclusive recommendation collections.
                  </p>
                  <button className="mt-3 btn-outline text-sm">Join Challenge</button>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-5 lg:col-span-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Featured Feed</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">Editor picks for this week</h2>
              </div>
              <Link to="/all-books" className="hidden text-sm font-semibold text-primary hover:underline md:inline-flex">
                View catalog
              </Link>
            </div>

            {loading ? (
              <div className="card p-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {featuredBooks.map((book, index) => (
                  <article key={book._id} className="card group overflow-hidden">
                    <div className="flex h-full flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {index === 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{book.category || 'General'}</p>
                        <Link
                          to={`/books/${book._id}`}
                          className="mt-2 line-clamp-2 text-xl font-bold text-slate-900 transition-colors hover:text-primary dark:text-white"
                        >
                          {book.title}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by {book.author}</p>

                        <div className="mt-3 flex items-center gap-2">
                          {renderStars(book.rating)}
                          <span className="text-xs text-slate-500 dark:text-slate-400">({book.reviews || 0} reviews)</span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{book.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${book.price}</span>
                          <Link to={`/books/${book._id}`} className="btn-primary text-sm">
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="card bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white dark:from-slate-900 dark:to-slate-800">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">BookNest Membership</p>
                  <h3 className="mt-2 text-2xl font-bold">Free delivery + early access to popular titles</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Start with a trial and unlock premium shelves curated by librarians and reviewers.
                  </p>
                </div>
                <button className="btn-primary whitespace-nowrap">Start Free Trial</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <LatestBooks />
      <WhyChooseUs />
      <CoverageMap />
    </div>
  );
};

export default HomeGoodreads;
