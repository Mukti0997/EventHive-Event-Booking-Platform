import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll progress (0-100%) and scroll threshold status.
 * @param {number} threshold - Scroll Y threshold in px to trigger isScrolled
 * @returns {{ progress: number, isScrolled: boolean, scrollY: number }}
 */
export const useScrollProgress = (threshold = 24) => {
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const percent = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;

          setScrollY(currentScroll);
          setProgress(Math.min(100, Math.max(0, percent)));
          setIsScrolled(currentScroll > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return { progress, isScrolled, scrollY };
};

export default useScrollProgress;
