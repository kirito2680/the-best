import { useEffect, useState } from 'react';
import { navLinks, profile } from '../data/site';
import './Nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__logo" href="#top" aria-label="回到顶部">
          <span className="nav__logo-name">{profile.name}</span>
          <span className="nav__logo-en">{profile.nameEn}</span>
        </a>

        <nav className="nav__links" aria-label="主导航">
          {navLinks.map((link, i) => (
            <a className="nav__link" key={link.id} href={`#${link.id}`}>
              <span className="nav__link-idx">0{i + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--primary nav__cta" href="#contact">
          联系我
        </a>
      </div>
    </header>
  );
}

