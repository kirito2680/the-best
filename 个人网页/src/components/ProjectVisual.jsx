import './ProjectVisual.css';

// 程序化生成的抽象占位视觉，后续直接用真实作品截图替换整个卡片图片区
export default function ProjectVisual({ variant = 'aurora', index, title, tags }) {
  return (
    <div className={`pv pv--${variant}`}>
      <div className="pv__orb pv__orb--1" />
      <div className="pv__orb pv__orb--2" />
      <div className="pv__orb pv__orb--3" />
      <div className="pv__lines" />
      <div className="pv__grain" />
      <div className="pv__meta">
        <span>{title}</span>
        <span>{tags[0]}</span>
      </div>
      <span className="pv__index">{index}</span>
      <span className="pv__placeholder">PLACEHOLDER</span>
    </div>
  );
}

