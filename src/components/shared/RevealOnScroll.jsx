import { useEffect, useRef, useState } from 'react';

const RevealOnScroll = ({
  children,
  className = '',
  delay = 500,
  duration = 700,
  y = 24,
  threshold = 0.15,
  once = true,
}) => {
  const ref = useRef(null);
  const timerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // delay the state change so transition starts after timeout
          timerRef.current = setTimeout(() => {
            setIsVisible(true);
            if (once) observer.unobserve(node);
          }, delay);
          return;
        }

        if (!once) {
          clearTimeout(timerRef.current);
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, [once, threshold, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translate3d(0, ${isVisible ? 0 : y}px, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `0ms`, // optional: avoid double-delay if using JS timeout
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
