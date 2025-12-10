import { Link } from 'react-router-dom';
import { getLatestBooks } from '../../data/books';
import HeroSlider from '../../components/shared/HeroSlider';
import LatestBooks from '../../components/shared/LatestBooks';
import WhyChooseUs from '../../components/shared/WhyChooseUs';
import CoverageMap from '../../components/shared/CoverageMap';

const HomeGoodreads = () => {
  const trendingBooks = getLatestBooks(6).slice(0, 2);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Slider */}
      <HeroSlider />

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
              <span className="inline-block bg-primary text-white text-2xl font-bold p-3 rounded-full mb-4">
                B
              </span>
              <h2 className="text-lg font-semibold mb-2">Welcome to BookNest</h2>
              <p className="text-on-surface-secondary-light dark:text-on-surface-secondary-dark">
                Meet your favorite book, find your reading community, and manage your reading life.
              </p>
            </div>

            {/* Updates Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase text-on-surface-secondary-light dark:text-on-surface-secondary-dark tracking-wider">
                Updates
              </h2>
              <Link
                to="#"
                className="flex items-center text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark hover:underline"
              >
                ⚙️ Customize
              </Link>
            </div>

            {/* Book Feed */}
            <div className="space-y-6">
              {trendingBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-surface-light dark:bg-surface-dark p-4 rounded-md border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-center text-sm text-on-surface-secondary-light dark:text-on-surface-secondary-dark mb-4">
                    <span className="inline-block bg-primary text-white text-lg font-bold p-2 rounded-full mr-3">
                      B
                    </span>
                    <p>
                      Trending this week in one of your favorite genres,{' '}
                      <span className="font-bold text-on-surface-light dark:text-on-surface-dark">
                        {book.category}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <img
                      alt={`Book cover for ${book.title}`}
                      className="w-24 h-auto object-cover rounded flex-shrink-0"
                      src={book.image}
                    />
                    <div>
                      <h3 className="text-lg font-bold">{book.title}</h3>
                      <p className="text-sm mb-2">by {book.author}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <button className="flex items-center bg-accent-green text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-700 transition-colors">
                          Want to Read
                        </button>
                        <button className="bg-accent-green text-white p-1 rounded hover:bg-green-700 transition-colors">
                          ▼
                        </button>
                        <div className="flex items-center text-on-surface-secondary-light dark:text-on-surface-secondary-dark">
                          <span className="text-xs mr-2">Rate it:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-gray-300 dark:text-gray-600 cursor-pointer hover:text-yellow-500">
                                ☆
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm">
                        {book.description}{' '}
                        <Link to={`/books/${book.id}`} className="text-accent-green hover:underline">
                          Continue reading
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Goodreads Choice Awards */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-md border border-border-light dark:border-border-dark text-center">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-8 px-4 rounded-md mb-4">
                <h3 className="text-2xl font-bold mb-2">BookNest</h3>
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
    </div>
  );
};

export default HomeGoodreads;
