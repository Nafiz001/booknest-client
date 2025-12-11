const BookNestLogo = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white leading-none">
        Book<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Nest</span>
      </span>
    </div>
  );
};

export default BookNestLogo;
