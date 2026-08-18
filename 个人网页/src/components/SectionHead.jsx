export default function SectionHead({ idx, title, en }) {
  return (
    <div className="section-head">
      <span className="section-head__idx">/{idx}</span>
      <h2 className="section-head__title">{title}</h2>
      <span className="section-head__en">{en}</span>
    </div>
  );
}

