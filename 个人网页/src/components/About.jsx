import { profile } from '../data/site';
import useReveal from '../hooks/useReveal';
import SectionHead from './SectionHead';
import './About.css';

const contacts = [
  { label: '电话', value: profile.phone, href: `tel:${profile.phoneRaw}` },
  { label: 'QQ', value: profile.qq, href: `https://wpa.qq.com/msgrd?v=3&uin=${profile.qq}&site=qq&menu=yes` },
  { label: '邮箱', value: profile.email, href: `mailto:${profile.email}` },
  { label: '所在地', value: profile.location },
];

export default function About() {
  const ref = useReveal();

  return (
    <section className="about section" id="about" ref={ref}>
      <div className="container">
        <div className="section-head-wrap" data-reveal>
          <SectionHead idx="01" title="个人经历" en="About & Experience" />
        </div>

        <div className="about__grid">
          {/* 头像占位：后续替换为真实照片 */}
          <div className="about__portrait" data-reveal>
            <div className="about__portrait-frame">
              <div className="about__portrait-glow" />
              <div className="about__monogram">
                <span>{profile.name[0]}</span>
                <span>{profile.name[1]}</span>
              </div>
              <span className="about__portrait-tag">PORTRAIT — 001</span>
              <span className="about__portrait-corner about__portrait-corner--tl" />
              <span className="about__portrait-corner about__portrait-corner--br" />
            </div>
          </div>

          <div className="about__body">
            <h3 className="about__lead" data-reveal>
              把复杂的技术，
              <br />
              翻译成有温度的设计。
            </h3>

            {profile.bio.map((p) => (
              <p className="about__text" key={p.slice(0, 12)} data-reveal>
                {p}
              </p>
            ))}

            <div className="about__timeline" data-reveal>
              <span className="about__timeline-dot" />
              <div className="about__timeline-body">
                <p className="about__timeline-name">{profile.school}</p>
                <p className="about__timeline-meta">
                  {profile.period} · 在校大学生
                </p>
              </div>
            </div>

            <div className="about__contacts" data-reveal>
              {contacts.map((c) => (
                <a
                  className="about__contact"
                  key={c.label}
                  href={c.href || undefined}
                  target={c.href && c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href && c.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span className="about__contact-label">{c.label}</span>
                  <span className="about__contact-value">{c.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="about__stats" data-reveal>
          {profile.stats.map((s) => (
            <div className="about__stat" key={s.label}>
              <span className="about__stat-value">{s.value}</span>
              <span className="about__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

