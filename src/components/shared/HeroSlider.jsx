import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Discover Your Next Great Read',
      description: 'Browse thousands of books from local libraries and get them delivered straight to your doorstep.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=600&fit=crop',
      buttonText: 'Browse Collection',
    },
    {
      id: 2,
      title: 'Fast & Reliable Delivery',
      description: 'Track every order in real time and receive books in 24-48 hours with protected packaging.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop',
      buttonText: 'How It Works',
    },
    {
      id: 3,
      title: 'Support Local Libraries',
      description: 'Every order contributes to partner library programs and keeps reading communities growing.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop',
      buttonText: 'Get Started',
    },
    {
      id: 4,
      title: 'Join Our Reading Community',
      description: 'Share reviews, discover hidden gems, and build your next reading list with fellow readers.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=600&fit=crop',
      buttonText: 'Explore Community',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 h-[560px] transition-opacity duration-700 md:h-[640px] ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
          </div>

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl animate-fade-in text-white">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Curated Picks
              </p>
              <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-200 md:text-xl">
                {slide.description}
              </p>
              <Link
                to="/all-books"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 transition-transform duration-200 hover:scale-[1.02]"
              >
                {slide.buttonText}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/50 md:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/50 md:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
