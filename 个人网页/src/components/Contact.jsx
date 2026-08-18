import { lazy, Suspense } from 'react';
import { profile, socials } from '../data/site';
import useReveal from '../hooks/useReveal';
import useInView from '../hooks/useInView';
import './Contact.css';

const GradientWavesLazy = lazy(() => import('./GradientWaves'));

export default function Contact() {
  const ref = useReveal();
  const [wavesRef, wavesInView] = useInView();

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact__waves" ref={wavesRef}>
        {wavesInView && (
          <Suspense fallback={null}>
            <GradientWavesLazy
              horizonColor="#0a2417"
              waveColor="#14583a"
              crestColor="#4ade80"
              speed={0.32}
              amplitude={2.4}
              waveScale={0.62}
              waveRatio={0.9}
              swell={36}
              turbulence={22}
              tilt={1.12}
              zoom={1.04}
              height={5.4}
              fogDepth={13}
              detail="low"
              brightness={0.72}
              opacity={0.55}
              mouseInteraction
              parallaxStrength={0.35}
              grain
              grainIntensity={0.04}
              maxDpr={1}
            />
          </Suspense>
        )}
      </div>
      <div className="contact__veil" aria-hidden="true" />
      <div className="contact__ring contact__ring--outer" aria-hidden="true" />
      <div className="contact__ring contact__ring--inner" aria-hidden="true" />
      <div className="contact__grid" aria-hidden="true" />

      <div className="contact__inner container">
        <p className="contact__eyebrow" data-reveal>
          <span className="contact__eyebrow-dot" />
          04 — Get In Touch
        </p>

        <h2 className="contact__title" data-reveal>
          一起做点
          <span className="contact__title-outline">不一样的东西</span>
        </h2>

        <p className="contact__sub" data-reveal style={{ '--reveal-delay': '140ms' }}>
          无论是品牌、视觉还是 AI 驱动的创意项目，都欢迎聊聊。
        </p>

        <div className="contact__actions" data-reveal style={{ '--reveal-delay': '260ms' }}>
          <a className="btn btn--primary btn--lg" href={`mailto:${profile.email}`}>
            发送邮件
            <span className="contact__arrow">→</span>
          </a>
          <a className="btn btn--ghost btn--lg" href={`tel:${profile.phoneRaw}`}>
            {profile.phone}
          </a>
        </div>

        <div className="contact__channels" data-reveal style={{ '--reveal-delay': '380ms' }}>
          <a href={`https://wpa.qq.com/msgrd?v=3&uin=${profile.qq}&site=qq&menu=yes`} target="_blank" rel="noreferrer">
            QQ {profile.qq}
          </a>
          <span className="contact__channels-sep">/</span>
          {socials.map((s, i) => (
            <span className="contact__channel" key={s.label}>
              {s.label}
              <span className="contact__channel-note">{s.note}</span>
              {i < socials.length - 1 && <span className="contact__channels-sep">/</span>}
            </span>
          ))}
        </div>
      </div>

      <footer className="contact__footer container">
        <span>© 2026 {profile.name} — {profile.role}</span>
        <span className="contact__footer-built">Designed & Built with React</span>
      </footer>
    </section>
  );
}
