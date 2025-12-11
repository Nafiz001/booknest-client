import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeroSlider from '../../components/shared/HeroSlider';
import LatestBooks from '../../components/shared/LatestBooks';
import WhyChooseUs from '../../components/shared/WhyChooseUs';
import CoverageMap from '../../components/shared/CoverageMap';
import BookNestLogo from '../../assets/BookNestLogo';
import api from '../../utils/api';

const HomeGoodreads = () => {
  const { data: featuredBooks = [], isLoading: loading } = useQuery({
    queryKey: ['featuredBooks'],
    queryFn: async () => {
      const response = await api.get('/books?sort=newest');
      return response.data.books.slice(0, 3);
    },
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center text-sm">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Slider */}
      <HeroSlider />
       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Currently Reading */}
            <div>
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider mb-3">
                Currently Reading
              </h2>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">📖</span>
                </div>
                <p className="text-on-surface-secondary-light dark:text-on-surface-secondary-dark text-sm">
                  What are you reading?
                </p>
              </div>
              <div className="relative mb-3">
                <input
                  className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Search books"
                  type="text"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2">🔍</span>
              </div>
              <Link to="#" className="text-sm text-accent-green hover:underline">
                Recommendations
              </Link>
              <span className="text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark"> · </span>
              <Link to="#" className="text-sm text-accent-green hover:underline">
                General update
              </Link>
              <hr className="border-border-light dark:border-border-dark my-6" />
            </div>

            {/* Reading Challenge */}
            <div>
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider mb-3">
                2025 Reading Challenge
              </h2>
              <p className="text-sm mb-3">Challenge yourself to read more this year!</p>
              <div className="flex items-center space-x-4">
                <img
                  alt="2025 Reading Challenge badge"
                  className="w-24 h-auto"
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop"
                />
                <button className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded px-4 py-1.5 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  Start Challenge
                </button>
              </div>
              <hr className="border-border-light dark:border-border-dark my-6" />
            </div>

            {/* Want to Read */}
            <div>
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider mb-3">
                Want to Read
              </h2>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">📚</span>
                </div>
                <p className="text-on-surface-secondary-light dark:text-on-surface-secondary-dark text-sm">
                  What do you want to read next?
                </p>
              </div>
              <Link to="#" className="text-sm text-accent-green hover:underline">
                Recommendations
              </Link>
              <hr className="border-border-light dark:border-border-dark my-6" />
            </div>

            {/* Bookshelves */}
            <div>
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider mb-3">
                Bookshelves
              </h2>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="#" className="text-accent-green hover:underline">
                    <span className="font-bold">0</span> Want to Read
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-accent-green hover:underline">
                    <span className="font-bold">0</span> Currently Reading
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-accent-green hover:underline">
                    <span className="font-bold">0</span> Read
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Welcome Card */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-md border border-border-light dark:border-border-dark mb-8 text-center">
              <div className="flex justify-center mb-4">
                <BookNestLogo className="scale-150" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Welcome to BookNest</h2>
              <p className="text-on-surface-secondary-light dark:text-on-surface-secondary-dark">
                Meet your favorite book, find your reading community, and manage your reading life.
              </p>
            </div>

            {/* Updates Feed */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider">
                Updates From Your Shelves
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Featured Books Feed */}
                  {featuredBooks.map((book, index) => (
                    <div key={book._id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-md border border-border-light dark:border-border-dark">
                      <div className="flex gap-4">
                        <Link to={`/books/${book._id}`} className="flex-shrink-0">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-24 h-36 object-cover rounded shadow-md hover:shadow-xl transition-shadow"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link to={`/books/${book._id}`} className="text-lg font-semibold hover:text-primary">
                                {book.title}
                              </Link>
                              <p className="text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark">
                                by {book.author}
                              </p>
                            </div>
                            {index === 0 && (
                              <span className="bg-accent-yellow text-gray-900 text-xs font-bold px-2 py-1 rounded">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(book.rating)}
                            <span className="text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark">
                              {book.rating} · {book.reviews || 0} reviews
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark mb-3 line-clamp-2">
                            {book.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/books/${book._id}`}
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              View Details
                            </Link>
                            <span className="text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark">
                              ${book.price}
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {book.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  
                 

                  

                  
                  
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Goodreads Choice Awards */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-md border border-border-light dark:border-border-dark text-center">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-8 px-4 rounded-md mb-4">
                <div className="flex justify-center mb-2">
                  <div className="bg-white px-2 py-1 dark:bg-surface-dark rounded">
                    <BookNestLogo />
                  </div>
                </div>
                <p className="text-lg">CHOICE AWARDS</p>
                <p className="text-sm mt-2">The Best Books of 2024</p>
              </div>
              <Link
                to="#"
                className="inline-block w-full bg-accent-yellow text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors"
              >
                See the Winners
              </Link>
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider mb-3">
                Recommendations
              </h2>
              <p className="text-sm mb-3">Get recommendations based on your taste</p>
              <Link
                to="#"
                className="text-sm text-accent-green hover:underline"
              >
                Answer a few questions
              </Link>
            </div>

            {/* News & Interviews */}
            <div>
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider mb-3">
                News & Interviews
              </h2>
              <div className="space-y-4">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=200&fit=crop"
                    alt="News article"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <Link to="#" className="text-sm font-semibold hover:text-primary">
                    The Most Anticipated Books of 2025
                  </Link>
                </div>
                <div>
                  <Link to="#" className="text-sm hover:text-primary">
                    50 Books to Read in 2025
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Latest Books Section */}
      <LatestBooks />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Coverage Map */}
      <CoverageMap />
      
      {/* Top Banner */}
      <div className="bg-[#026967] text-white py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="#" className="flex items-center justify-center text-sm font-semibold hover:underline">
            <span className="mr-2">📚</span>
            2025 Challenge Faves
            <span className="font-normal mx-2 text-gray-300">|</span>
            <span>Explore the most popular books of the 2025 Reading Challenge</span>
            <span className="ml-1">›</span>
          </Link>
        </div>
      </div>

     
    </div>
  );
};

export default HomeGoodreads;
