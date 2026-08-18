import { strengths } from '../data/site';
import useReveal from '../hooks/useReveal';
import BorderGlow from './BorderGlow';
import SectionHead from './SectionHead';
import './Strengths.css';

const icons = {
  visual: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 12s3.5-6.5 10-6.5 10 6.5 10 6.5-3.5 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="m12 2 3 6.5 6.5 3-6.5 3L12 21l-3-6.5-6.5-3 6.5-3L12 2Z" />
    </svg>
  ),
  tech: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6M13.5 4l-3 16" />
    </svg>
  ),
};

export default function Strengths() {
  const ref = useReveal();

  return (
    <section className="strengths section" id="strengths" ref={ref}>
      <div className="container">
        <div data-reveal>
          <SectionHead idx="03" title="个人优势" en="Capabilities" />
        </div>

        <div className="strengths__grid">
          {strengths.map((item, i) => (
            <div
              className="strength-reveal"
              key={item.title}
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` }}
            >
              <BorderGlow
                className="strength-card"
                edgeSensitivity={34}
                glowColor="135 70 55"
                backgroundColor="#121218"
                borderRadius={18}
                glowRadius={34}
                glowIntensity={0.95}
                coneSpread={24}
                colors={['#4ade80', '#34d399', '#a3e635']}
              >
                <div className="strength-card__content">
                  <div className="strength-card__top">
                    <span className="strength-card__idx">0{i + 1}</span>
                    <span className="strength-card__icon">{icons[item.icon]}</span>
                  </div>
                  <h3 className="strength-card__title">{item.title}</h3>
                  <p className="strength-card__desc">{item.desc}</p>
                  <ul className="strength-card__tags">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
