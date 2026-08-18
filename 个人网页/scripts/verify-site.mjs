// 用无头 Chrome 对本地开发服务器做渲染验证：DOM 结构、布局指标、滚动动画、
// 控制台错误，并为每个区块截图。

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME =
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const NODE =
  'C:\\Users\\kirito\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe';
const URL = 'http://localhost:5173/';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'preview-shots');
const profile = mkdtempSync(join(tmpdir(), 'codex-chrome-'));

let viteProc = null;

async function ensureServer() {
  try {
    const probe = await fetch(URL);
    if (probe.ok) return;
  } catch {
    // server not running, start it below
  }
  viteProc = spawn(
    NODE,
    [join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), '--port', '5173', '--strictPort'],
    { stdio: 'ignore' },
  );
  await waitFor(async () => {
    try {
      const r = await fetch(URL);
      return r.ok;
    } catch {
      return false;
    }
  }, 30000);
}

await ensureServer();

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitFor(fn, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const value = await fn();
      if (value) return value;
    } catch {
      // retry
    }
    await sleep(300);
  }
  throw new Error('waitFor timeout');
}

const target = await waitFor(async () => {
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const list = await res.json();
  return list.find((t) => t.type === 'page');
});

const ws = new WebSocket(target.webSocketDebuggerUrl);
let msgId = 0;
const pending = new Map();
const events = [];

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  } else if (msg.method) {
    events.push(msg);
  }
};

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise((r) => (ws.onopen = r));
await send('Page.enable');
await send('Runtime.enable');
await send('Page.navigate', { url: URL });
await waitFor(async () => {
  const r = await send('Runtime.evaluate', {
    expression: "document.readyState === 'complete'",
    returnByValue: true,
  });
  return r.result.value === true;
});
await sleep(600);

const evalJs = async (expression) => {
  const r = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return r.result.value;
};

await send('Emulation.setDeviceMetricsOverride', {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  mobile: false,
});

const report = {};
report.midEntrance = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const cv = document.querySelector('.hero__particles canvas'); const ctx = cv && cv.getContext('2d'); let lit = 0; if (cv && ctx) { try { const img = ctx.getImageData(0, 0, cv.width, cv.height); const d = img.data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) lit++; } catch { lit = -1; } } return { canvas: cv ? { w: cv.width, h: cv.height } : null, wrapperH: Math.round(document.querySelector('.hero__particles')?.getBoundingClientRect().height || 0), litPixels: lit, eyebrowOpacity: getComputedStyle(document.querySelector('.hero__eyebrow')).opacity, navOpacity: getComputedStyle(document.querySelector('.nav')).opacity }; })())",
  ),
);
const midShot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(join(OUT_DIR, 'hero-mid.png'), Buffer.from(midShot.data, 'base64'));
await sleep(2800);

report.title = await evalJs('document.title');
report.h1 = await evalJs(
  "document.querySelector('.hero__title')?.getAttribute('aria-label') || ''",
);
report.sections = JSON.parse(
  await evalJs(
    "JSON.stringify(['top','about','works','strengths','contact'].map((id) => { const el = document.getElementById(id); return el ? { id, h: Math.round(el.getBoundingClientRect().height) } : null; }))",
  ),
);
report.navLinks = await evalJs(
  "document.querySelectorAll('.nav__link').length",
);
report.workCards = await evalJs(
  "document.querySelectorAll('.work-strip').length",
);
report.strengthCards = await evalJs(
  "document.querySelectorAll('.strength-card').length",
);
report.horizontalOverflow = await evalJs(
  'document.documentElement.scrollWidth > window.innerWidth',
);
report.bodyBg = await evalJs(
  'getComputedStyle(document.body).backgroundColor',
);
report.webp = await evalJs(
  "(() => { const i = document.querySelector('.hero__media'); return i ? { complete: i.complete, w: i.naturalWidth, h: i.naturalHeight } : null; })()",
);
report.heroVideo = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const vs = [...document.querySelectorAll('.hero__bg video')]; const bg2 = document.querySelector('.hero__bg2'); return { videos: vs.length, src: vs[0]?.querySelector('source')?.getAttribute('src') || '', sameSrc: vs.every((v) => v.querySelector('source')?.getAttribute('src') === vs[0]?.querySelector('source')?.getAttribute('src')), readyState: vs[0]?.readyState ?? -1, hasPoster: !!vs[0]?.getAttribute('poster'), bg2Filter: bg2 ? getComputedStyle(bg2).filter : '', bg2Blend: bg2 ? getComputedStyle(bg2).mixBlendMode : '', bg2Opacity: bg2 ? getComputedStyle(bg2).opacity : '' }; })())",
  ),
);

// 滚动整页触发进场动画，再统计可见性
await evalJs(`(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 300) {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 160));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
})()`);
await sleep(2200);
report.reveals = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const all = document.querySelectorAll('[data-reveal]').length; const vis = document.querySelectorAll('[data-reveal].is-visible').length; return { all, vis }; })())",
  ),
);
report.hiddenReveals = JSON.parse(
  await evalJs(
    "JSON.stringify([...document.querySelectorAll('[data-reveal]:not(.is-visible)')].map((el) => el.className.split(' ').slice(0, 3).join('.')))",
  ),
);

report.consoleErrors = events
  .filter(
    (e) =>
      e.method === 'Runtime.exceptionThrown' ||
      (e.method === 'Runtime.consoleAPICalled' &&
        e.params.type === 'error'),
  )
  .map((e) =>
    e.method === 'Runtime.exceptionThrown'
      ? (e.params.exceptionDetails?.exception?.description ||
          e.params.exceptionDetails?.text ||
          'Uncaught') +
        '\n  ' +
        (e.params.exceptionDetails?.stackTrace?.callFrames?.[0]?.url || '')
      : e.params.args?.map((a) => a.value ?? a.description).join(' '),
  )
  .filter(Boolean);

// 每个区块截图
const shots = [
  ['hero', 0],
  ['about', 'about'],
  ['works', 'works'],
  ['strengths', 'strengths'],
  ['contact', 'contact'],
];

for (const [name, targetId] of shots) {
  const y =
    targetId === 0
      ? 0
      : await evalJs(`document.getElementById('${targetId}')?.offsetTop || 0`);
  await evalJs(`window.scrollTo(0, ${y})`);
  await sleep(900);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT_DIR, `${name}.png`), Buffer.from(shot.data, 'base64'));
}

report.settled = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const cv = document.querySelector('.hero__particles canvas'); const ctx = cv && cv.getContext('2d'); let lit = 0; if (cv && ctx) { try { const img = ctx.getImageData(0, 0, cv.width, cv.height); const d = img.data; for (let i = 3; i < d.length; i += 4) if (d[i] > 100) lit++; } catch { lit = -1; } } const rise = document.querySelector('.hero__line-rise'); const actions = document.querySelector('.hero__actions'); return { canvas: cv ? { w: cv.width, h: cv.height } : null, litPixels: lit, lineRiseTransform: rise ? getComputedStyle(rise).transform : '', actionsClip: actions ? getComputedStyle(actions).clipPath : '', eyebrowOpacity: getComputedStyle(document.querySelector('.hero__eyebrow')).opacity }; })())",
  ),
);

await evalJs(`window.scrollTo({ top: 0, behavior: 'instant' })`);
await sleep(400);
const btnCenter = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const b = document.querySelector('.hero__actions .btn--primary').getBoundingClientRect(); return { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) }; })())",
  ),
);
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: btnCenter.x,
  y: btnCenter.y,
});
await sleep(600);
report.buttonHover = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const p = getComputedStyle(document.querySelector('.hero__actions .btn--primary')); const g = getComputedStyle(document.querySelector('.hero__actions .btn--ghost')); return { primary: { bg: p.backgroundColor, color: p.color }, ghost: { bg: g.backgroundColor, color: g.color, border: g.borderColor }, accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() }; })())",
  ),
);

const ghostCenter = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const b = document.querySelector('.hero__actions .btn--ghost').getBoundingClientRect(); return { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) }; })())",
  ),
);
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: ghostCenter.x,
  y: ghostCenter.y,
});
await sleep(600);
report.ghostHover = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const g = getComputedStyle(document.querySelector('.hero__actions .btn--ghost')); return { bg: g.backgroundColor, color: g.color, border: g.borderColor }; })())",
  ),
);

report.wheel = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const root = document.querySelector('.option-wheel'); const sub = document.querySelector('.hero__sub')?.textContent?.trim() || ''; const items = [...document.querySelectorAll('.option-wheel__item')].map((el) => el.textContent.trim()); const selected = document.querySelector('.option-wheel__item--selected')?.textContent.trim() || ''; const eyebrow = document.querySelector('.hero__eyebrow')?.textContent.trim() || ''; root?.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })); return { present: !!root, items, selected, eyebrowBefore: eyebrow, subBefore: sub }; })())",
  ),
);
await sleep(1200);
report.wheelAfter = JSON.parse(
  await evalJs(
    "JSON.stringify((() => ({ sub: document.querySelector('.hero__sub')?.textContent?.trim() || '', eyebrow: document.querySelector('.hero__eyebrow')?.textContent.trim() || '', selected: document.querySelector('.option-wheel__item--selected')?.textContent.trim() || '' }))())",
  ),
);

await evalJs("window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })");
await sleep(1600);
report.waves = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const cv = document.querySelector('.contact__waves canvas'); return cv ? { w: cv.width, h: cv.height, display: getComputedStyle(cv).display, containerH: Math.round(document.querySelector('.contact__waves')?.getBoundingClientRect().height || 0) } : null; })())",
  ),
);

await evalJs(
  "window.scrollTo({ top: document.getElementById('works').offsetTop - 100, behavior: 'instant' })",
);
await sleep(1600);
report.driftWall = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const wall = document.querySelector('.drift-wall'); const track = document.querySelector('.drift-wall__track'); const img = document.querySelector('.drift-wall__tile img'); return { present: !!wall, tiles: document.querySelectorAll('.drift-wall__tile').length, imgSrc: img?.getAttribute('src') || '', imgLoaded: img ? img.complete && img.naturalWidth > 0 : false, trackTransform0: track?.style.transform || null, wallH: wall ? Math.round(wall.getBoundingClientRect().height) : 0 }; })())",
  ),
);
await sleep(500);
const driftSamples = [report.driftWall.trackTransform0];
for (let s = 0; s < 3; s++) {
  await sleep(350);
  driftSamples.push(
    await evalJs(
      "document.querySelector('.drift-wall__track')?.style.transform || 'none'",
    ),
  );
}
report.driftWallAfter = JSON.parse(
  await evalJs(
    "JSON.stringify((() => ({ samples: " + JSON.stringify(driftSamples) + ", moving: " + JSON.stringify(driftSamples.some((t, i) => i > 0 && t !== driftSamples[0])) + " }))())",
  ),
);

await evalJs(
  "window.scrollTo({ top: document.getElementById('strengths').offsetTop - 140, behavior: 'instant' })",
);
await sleep(600);
const glowTarget = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const card = document.querySelector('.strength-card'); const r = card.getBoundingClientRect(); return { x: Math.round(r.left + 10), y: Math.round(r.top + r.height / 2), initial: getComputedStyle(card).getPropertyValue('--edge-proximity').trim() }; })())",
  ),
);
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: glowTarget.x,
  y: glowTarget.y,
});
await sleep(500);
report.borderGlow = JSON.parse(
  await evalJs(
    "JSON.stringify((() => { const card = document.querySelector('.strength-card'); return { cards: document.querySelectorAll('.strength-card').length, proximity: getComputedStyle(card).getPropertyValue('--edge-proximity').trim(), angle: getComputedStyle(card).getPropertyValue('--cursor-angle').trim() }; })())",
  ),
);

const measureFps = () =>
  evalJs(
    "new Promise((r) => { let n = 0; const t0 = performance.now(); const step = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(step); else r(Math.round(n)); }; requestAnimationFrame(step); })",
  );

report.perf = {};
await evalJs("window.scrollTo({ top: 0, behavior: 'instant' })");
await sleep(600);
report.perf.hero = await measureFps();
await evalJs(
  "window.scrollTo({ top: document.getElementById('works').offsetTop - 100, behavior: 'instant' })",
);
await sleep(600);
report.perf.works = await measureFps();
await evalJs("window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })");
await sleep(600);
report.perf.contact = await measureFps();

try {
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: Math.ceil(await evalJs('document.body.scrollHeight')),
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(500);
  const full = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT_DIR, 'full.png'), Buffer.from(full.data, 'base64'));
  report.fullShot = 'ok';
} catch (e) {
  report.fullShot = `skipped: ${e.message}`;
}

console.log(JSON.stringify(report, null, 2));
ws.close();
chrome.kill();
if (viteProc) viteProc.kill();
process.exit(0);
