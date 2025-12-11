const BookCardSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      
      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      
      {/* Author skeleton */}
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
      
      {/* Rating skeleton */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
      
      {/* Price skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
    </div>
  );
};

export default BookCardSkeleton;
