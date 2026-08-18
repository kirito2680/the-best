import { lazy, Suspense } from 'react';
import { works } from '../data/site';
import useReveal from '../hooks/useReveal';
import useInView from '../hooks/useInView';
import SectionHead from './SectionHead';
import './Works.css';

const DriftWallLazy = lazy(() => import('./DriftWall'));

const wallItems = works.map((work) => ({
  image: '/works/preview.jpg',
  title: work.title,
  href: undefined,
}));

export default function Works() {
  const ref = useReveal();
  const [wallRef, wallInView] = useInView();

  return (
    <section className="works section" id="works" ref={ref}>
      <div className="container">
        <div data-reveal>
          <SectionHead idx="02" title="精选项目" en="Selected Works" />
        </div>

        <div className="works__wall" data-reveal ref={wallRef}>
          {wallInView && (
            <Suspense fallback={null}>
              <DriftWallLazy
                items={wallItems}
                columns={5}
                tileWidth={220}
                tileHeight={146}
                gap={16}
                radius={12}
                tilt={13}
                turn={-12}
                perspective={1400}
                depth={140}
                speed={38}
                direction="up"
                variance={0.5}
                parallax={0.5}
                lift={58}
                fade={0.55}
                dim={0.5}
                overlayColor="#0a0a0c"
              />
            </Suspense>
          )}
        </div>

        <div className="works__strips">
          {works.map((work, i) => (
            <article className="work-strip" key={work.title} data-reveal>
              <span className="work-strip__idx">0{i + 1}</span>
              <div className="work-strip__body">
                <h3 className="work-strip__title">{work.title}</h3>
                <p className="work-strip__desc">{work.desc}</p>
              </div>
              <span className="work-strip__cat">
                {work.category} · {work.year}
              </span>
              <span className="work-strip__tags">{work.tags.join(' / ')}</span>
            </article>
          ))}
        </div>

        <p className="works__note" data-reveal>
          * 以上为占位示例，后续将替换为真实作品与截图。
        </p>
      </div>
    </section>
  );
}
