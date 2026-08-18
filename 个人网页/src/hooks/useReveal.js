import { useEffect, useRef } from 'react';

// 对容器内所有 [data-reveal] 元素做滚动进场动画
export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const targets = [...root.querySelectorAll('[data-reveal]')];
    const shown = new Set();

    const show = (el) => {
      if (shown.has(el)) return;
      shown.add(el);
      el.classList.add('is-visible');
    };

    if (!('IntersectionObserver' in window)) {
      targets.forEach(show);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -6% 0px', ...options },
    );

    // 滚动兜底：快速滚动时 IntersectionObserver 可能漏帧，
    // 任何进入视口上缘附近的元素都会被标记为可见。
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const limit = window.innerHeight * 0.96;
        targets.forEach((el) => {
          if (!shown.has(el) && el.getBoundingClientRect().top < limit) {
            show(el);
            io.unobserve(el);
          }
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return ref;
}
