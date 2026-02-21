import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Home, Search, TrendingUp } from 'lucide-react';

const trendingBooks = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  },
  {
    title: 'Cloud Cuckoo Land',
    author: 'Anthony Doerr',
    image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
  },
  {
    title: 'The Paper Palace',
    author: 'Miranda C. Heller',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&h=600&fit=crop',
  },
];

const NotFound = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/all-books');
  };

  return (
    <div className="min-h-screen bg-[#111621] text-slate-100">
      <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-20 px-6 py-12 md:py-20 lg:py-24">
        <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-8">
            <div className="space-y-4 text-left">
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                <span className="h-[2px] w-8 bg-primary"></span>
                Error 404
              </div>
              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">
                A plot twist we didn&apos;t expect.
              </h1>
              <p className="text-lg font-light leading-relaxed text-slate-400 md:text-xl">
                The page you are looking for seems to have been misplaced in the archives. It might have been shelved
                incorrectly or borrowed by another reader.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Link>
              <Link
                to="/all-books"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-transparent px-6 text-base font-bold text-slate-200 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <BookOpen className="h-4 w-4" />
                Browse Catalog
              </Link>
            </div>

            <div className="mt-1 border-t border-slate-800 pt-6">
              <p className="mb-3 text-sm font-medium text-slate-500">Or search for a specific title:</p>
              <form onSubmit={handleSearch} className="flex w-full max-w-[430px]">
                <div className="flex h-12 w-full items-center overflow-hidden rounded-lg border border-slate-700 bg-transparent transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, author, or genre..."
                    className="h-full w-full bg-transparent px-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-full items-center justify-center px-4 text-slate-400 transition-colors hover:text-primary"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="group relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[100px] opacity-40 transition-opacity duration-700 group-hover:opacity-60"></div>
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 transition-transform duration-700 hover:scale-[1.02] hover:rotate-1">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111621] via-transparent to-transparent opacity-65"></div>
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=900&fit=crop"
                alt="Empty library shelf"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-6 top-6 z-20 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="font-mono text-xs font-bold tracking-widest text-white">ERR_FILE_NOT_FOUND</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <TrendingUp className="h-5 w-5 text-primary" />
              While you&apos;re here, try these trending titles
            </h3>
            <Link to="/all-books" className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline sm:inline-flex">
              View Full Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {trendingBooks.map((book) => (
              <div key={book.title} className="group cursor-pointer">
                <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-lg shadow-lg shadow-black/20 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/10">
                  <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
                </div>
                <h4 className="text-base font-bold leading-tight text-white transition-colors group-hover:text-primary">
                  {book.title}
                </h4>
                <p className="mt-1 text-sm text-slate-400">{book.author}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;
