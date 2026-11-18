import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate hardware-accelerated parallax offset.
 * @param {number} speed - Parallax speed multiplier (positive = forward drift, negative = reverse drift). Default is 0.15.
 * @returns {number} offset - Pixel translation offset to apply via `translate3d(0, ${offset}px, 0)`
 */
export const useParallax = (speed = 0.15) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Respect user's accessibility motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize offset on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
};

export default useParallax;
