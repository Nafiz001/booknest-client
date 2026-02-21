import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background-light px-4 py-16 dark:bg-background-dark">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Error 404</p>
            <h1 className="mt-4 text-balance text-5xl font-black leading-tight text-slate-900 dark:text-white md:text-6xl">
              A plot twist we didn&apos;t expect.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-400">
              The page you are looking for seems to be misplaced in the archives. Try returning home or jump straight into the catalog.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/" className="btn-primary">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
              <Link to="/all-books" className="btn-outline">
                <Search className="h-4 w-4" />
                Browse Books
              </Link>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back to previous page
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-3xl"></div>
            <div className="card relative overflow-hidden p-10 text-center">
              <h2 className="text-[150px] font-black leading-none text-slate-200 dark:text-slate-800 md:text-[220px]">
            404
              </h2>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-24 w-24 animate-pulse text-primary md:h-32 md:w-32" />
              </div>
              <p className="relative z-10 mt-4 text-sm text-slate-500 dark:text-slate-400">
                While you&apos;re here, explore trending reads and community picks.
              </p>
              <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                    <img
                      src={`https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop&sig=${item}`}
                      alt="Trending book"
                      className="h-28 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
