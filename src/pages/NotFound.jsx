import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the library stacks.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/all-books"
            className="flex items-center gap-2 px-6 py-3 bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-white border-2 border-border-light dark:border-border-dark rounded-lg hover:border-primary transition-colors duration-200"
          >
            <Search className="w-5 h-5" />
            <span>Browse Books</span>
          </Link>
        </div>

        {/* Go Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go back to previous page</span>
        </button>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-8 text-gray-300 dark:text-gray-700">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
