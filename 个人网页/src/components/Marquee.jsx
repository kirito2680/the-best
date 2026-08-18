import { marqueeItems } from '../data/site';
import './Marquee.css';

export default function Marquee() {
  const row = marqueeItems
    .map((item) => `${item} · ${item.toUpperCase()}`)
    .join('  /  ');

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span className="marquee__content">{row}</span>
        <span className="marquee__content">{row}</span>
      </div>
    </div>
  );
}

