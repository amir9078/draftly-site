'use strict';

/* ── mobile nav ── */
window.toggleNav = () => document.getElementById('nl').classList.toggle('open');
document.querySelectorAll('#nl a').forEach(a => a.addEventListener('click', () => document.getElementById('nl')?.classList.remove('open')));

/* ── scroll reveals ── */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .14 });
document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

/* ── duplicate marquee for seamless loop ── */
const mq = document.getElementById('mq'); if (mq) mq.innerHTML += mq.innerHTML;

/* ── card spotlight ── */
document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

/* ── count-up on view ── */
document.querySelectorAll('[data-count]').forEach(el => {
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.disconnect();
    const target = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dur = 1400; let t0;
    const tick = t => { t0 = t0 || t; const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, { threshold: .5 });
  co.observe(el);
});

/* ── typewriter helper ── */
function typeInto(el, text, speed, done) {
  el.innerHTML = ''; let i = 0;
  const caret = document.createElement('span'); caret.className = 'caret';
  el.appendChild(caret);
  (function step() {
    if (i <= text.length) {
      caret.insertAdjacentText('beforebegin', text[i - 1] || '');
      i++; setTimeout(step, speed + Math.random() * 28);
    } else { setTimeout(() => { caret.remove(); done && done(); }, 900); }
  })();
}

/* ── HERO live rewrite demo ── */
(function heroDemo() {
  const bad = document.getElementById('demo-bad');
  const good = document.getElementById('demo-good');
  if (!bad || !good) return;
  const pairs = [
    ['I am writing to express my sincere gratitude for the opportunity and look forward to the possibility of collaborating.',
     "Thanks so much for this — I'd genuinely love to work together. Let's make it happen."],
    ['Please be advised that I will be unable to attend the meeting scheduled for tomorrow afternoon.',
     "Heads up — I can't make tomorrow afternoon's meeting. Can we find another time?"],
    ['I hope this message finds you well. I wanted to kindly follow up regarding my previous correspondence.',
     "Hi again! Just circling back on my last note — any thoughts?"],
    ['It would be greatly appreciated if you could provide the requested documentation at your earliest convenience.',
     "Could you send over those docs when you get a sec? No rush."]
  ];
  let n = 0;
  function run() {
    const [b, g] = pairs[n % pairs.length];
    bad.style.opacity = '0';
    setTimeout(() => { bad.textContent = b; bad.style.opacity = '1'; }, 350);
    setTimeout(() => typeInto(good, g, 26, () => { n++; setTimeout(run, 1200); }), 1100);
  }
  good.textContent = pairs[0][1]; bad.textContent = pairs[0][0];
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(good);
})();

/* ── LinkedIn comment-generator demo (auto-cycles tones) ── */
(function liDemo() {
  const out = document.getElementById('li-out');
  const tones = document.querySelectorAll('#li-tones .li-tone');
  if (!out || !tones.length) return;
  const byTone = {
    ceo: "Hiring great people beats hiring fast people, every single time. This is the hill I'll die on.",
    insightful: "The part most teams miss: onboarding isn't week one, it's the first 90 days. We saw retention jump once we treated it that way.",
    supportive: "Genuinely needed to read this today — the bit about leading with trust really landed. Thanks for putting it so clearly.",
    curious: "Love this. Curious — how do you keep this culture intact once you're past 50 people and hiring fast?"
  };
  const order = ['ceo', 'insightful', 'supportive', 'curious'];
  let n = 0;
  function run() {
    const id = order[n % order.length];
    tones.forEach(t => t.classList.toggle('on', t.dataset.tone === id));
    typeInto(out, byTone[id], 22, () => { n++; setTimeout(run, 1700); });
  }
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(out);
})();

/* ── LinkedIn connection-note demo (types under 200 chars) ── */
(function noteDemo() {
  const out = document.getElementById('note-out');
  const counter = document.getElementById('note-count');
  if (!out) return;
  const notes = [
    "Hi Sarah — your work scaling design at Linear is exactly the craft I keep pointing my team to. Would love to connect and trade notes.",
    "Hey Daniel, the way you write about dev tools actually changed how we pitch ours. Big fan — would be great to be connected.",
    "Hi Priya — saw you lead growth at Notion. I'm deep in the same trenches and would genuinely value following your thinking."
  ];
  let n = 0;
  function setCount(txt){ if(counter) counter.textContent = txt.length + '/200'; }
  function run() {
    const note = notes[n % notes.length];
    let i = 0; out.innerHTML = '';
    const caret = document.createElement('span'); caret.className = 'caret'; out.appendChild(caret);
    (function step() {
      if (i <= note.length) {
        caret.insertAdjacentText('beforebegin', note[i - 1] || '');
        setCount(note.slice(0, i)); i++; setTimeout(step, 22 + Math.random() * 26);
      } else { caret.remove(); n++; setTimeout(run, 2200); }
    })();
  }
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(out);
})();
