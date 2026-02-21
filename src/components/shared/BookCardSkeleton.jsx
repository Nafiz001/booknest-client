const BookCardSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="skeleton-shimmer mb-2 h-64 w-full rounded"></div>
      <div className="skeleton-shimmer mb-2 h-4 w-3/4 rounded"></div>
      <div className="skeleton-shimmer mb-2 h-4 w-1/2 rounded"></div>
      <div className="skeleton-shimmer mb-2 h-3 w-2/3 rounded"></div>
      <div className="mb-2 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-4 w-4 rounded"></div>
        ))}
      </div>
      <div className="skeleton-shimmer h-4 w-1/3 rounded"></div>
    </div>
  );
};

export default BookCardSkeleton;
