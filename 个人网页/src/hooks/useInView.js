import { useEffect, useRef, useState } from 'react';

// 元素进入视口附近后才返回 true（用于懒加载重型组件）
export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px', threshold: 0, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

