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

/* ── click-and-drag scroll for horizontal card rows ── */
document.querySelectorAll('.cards').forEach(row => {
  let isDown = false, startX = 0, startScroll = 0, moved = false;
  row.addEventListener('mousedown', e => {
    isDown = true; moved = false; row.classList.add('dragging');
    startX = e.pageX; startScroll = row.scrollLeft;
  });
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    row.scrollLeft = startScroll - dx;
  });
  window.addEventListener('mouseup', () => { if (isDown) { isDown = false; row.classList.remove('dragging'); } });
  row.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
});

/* ── count-up on view ── */
document.querySelectorAll('[data-count]').forEach(el => {
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.disconnect();
    const target = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dur = 1400; let t0;
    const tick = t => { t0 = t0 || t; const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 });
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

/* ── reusable "before → after" typing demo (hero + every feature) ── */
function setupRewriteDemo(goodId, badId, pairs, speed) {
  const good = document.getElementById(goodId);
  const bad  = document.getElementById(badId);
  if (!good || !bad) return;
  let n = 0;
  function run() {
    const [b, g] = pairs[n % pairs.length];
    bad.style.opacity = '0';
    setTimeout(() => { bad.textContent = b; bad.style.opacity = '1'; }, 350);
    setTimeout(() => typeInto(good, g, speed || 24, () => { n++; setTimeout(run, 1400); }), 1100);
  }
  good.textContent = pairs[0][1]; bad.textContent = pairs[0][0];
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(good);
}

/* panel-style demo: a context block (HTML — e.g. a pulled conversation
   thread with sender names) that fades between examples, plus a typed output
   (the drafted reply / the translation). Mirrors the real Draftly panel. */
function setupPanelDemo(ctxId, outId, pairs, speed) {
  const ctx = document.getElementById(ctxId);
  const out = document.getElementById(outId);
  if (!ctx || !out) return;
  let n = 0;
  function run() {
    const [c, o] = pairs[n % pairs.length];
    ctx.style.opacity = '0';
    setTimeout(() => { ctx.innerHTML = c; ctx.style.opacity = '1'; }, 380);
    setTimeout(() => typeInto(out, o, speed || 22, () => { n++; setTimeout(run, 1900); }), 1150);
  }
  ctx.innerHTML = pairs[0][0]; out.textContent = pairs[0][1];
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(out);
}

/* 01 · Humanize (also powers the home hero) */
setupRewriteDemo('demo-good', 'demo-bad', [
  ['I am writing to express my sincere gratitude for the opportunity and look forward to the possibility of collaborating.',
   "Thanks so much for this — I'd genuinely love to work together. Let's make it happen."],
  ['Please be advised that I will be unable to attend the meeting scheduled for tomorrow afternoon.',
   "Heads up — I can't make tomorrow afternoon's meeting. Can we find another time?"],
  ['I hope this message finds you well. I wanted to kindly follow up regarding my previous correspondence.',
   "Hi again! Just circling back on my last note — any thoughts?"],
  ['It would be greatly appreciated if you could provide the requested documentation at your earliest convenience.',
   "Could you send over those docs when you get a sec? No rush."]
], 26);

/* 02 · Reply — pulls the live thread (real sender names), drafts a fitting reply */
setupPanelDemo('reply-ctx', 'reply-out', [
  [`<div class="thread-line"><span class="nm">Maya:</span> the order still hasn't arrived, any update?</div><div class="thread-line you"><span class="nm">You:</span> let me check with the courier now</div><div class="thread-line"><span class="nm">Maya:</span> please do, it was due yesterday</div>`,
   "So sorry about the wait, Maya — I've chased the courier and it's out for delivery today. Sending you the tracking link now."],
  [`<div class="thread-line"><span class="nm">Daniel:</span> are we still on for the 3pm demo?</div><div class="thread-line you"><span class="nm">You:</span> yep, all set</div><div class="thread-line"><span class="nm">Daniel:</span> great — can you share the deck before?</div>`,
   "Absolutely — I'll send the deck over within the hour so you can skim it beforehand. See you at 3!"]
], 22);

/* 03 · Translate — grabs the thread from any chat, translates it cleanly */
setupPanelDemo('trans-ctx', 'trans-out', [
  [`<div class="thread-line"><span class="nm">Cliente:</span> ¿pueden enviar el pedido antes del viernes?</div><div class="thread-line"><span class="nm">Cliente:</span> lo necesito con urgencia</div>`,
   "Customer: Can you ship the order before Friday? I need it urgently."],
  [`<div class="thread-line"><span class="nm">Léa:</span> est-ce que la réunion est toujours à 15h aujourd'hui?</div>`,
   "Léa: Is the meeting still at 3pm today?"],
  [`<div class="thread-line"><span class="nm">Ravi:</span> क्या कल तक डिलीवरी हो जाएगी?</div>`,
   "Ravi: Will the delivery be done by tomorrow?"]
], 22);

/* 04 · Grammar — fixes the slips, keeps the voice */
setupRewriteDemo('demo4-good', 'demo4-bad', [
  ["their going to send they're feedback by end of day, its allmost ready.", "They're going to send their feedback by end of day — it's almost ready."],
  ["i could of sent it earlier but i wasnt sure whos turn it was.", "I could have sent it earlier, but I wasn't sure whose turn it was."],
  ['the report have alot of errors that effects the results.', 'The report has a lot of errors that affect the results.']
], 22);

/* 05 · LinkedIn Pro — sharp comment from the post */
setupRewriteDemo('demo5-good', 'demo5-bad', [
  ["Post: “The best hires were never the fastest to start — they were the ones I trusted.”", "Trust over speed, every time. The fast hire who needs babysitting is slower than the careful one who doesn't."],
  ["Post: “We shipped our biggest update yet — 6 months of work from a tiny team.”", "Shipping big from a small team is the real flex. What was the hardest call you had to make along the way?"]
], 24);

/* ── LinkedIn comment-generator demo (auto-cycles tones) ── */
(function liDemo() {
  const out = document.getElementById('li-out');
  const tones = document.querySelectorAll('#li-tones .li-tone');
  if (!out || !tones.length) return;
  const ph = document.getElementById('li-ph');
  const byTone = {
    ceo: "Trust over speed, every time. The fast hire who needs managing is slower than the careful one who doesn't.",
    insightful: "The overlooked part: trust compounds because it cuts decision latency. Teams that trust each other ship faster with less process.",
    supportive: "This really resonates — the best people I've worked with earned trust quietly, and then everything got easier. Well put.",
    curious: "Love this. How do you protect a trust‑first culture once you're hiring fast and scaling past 50?",
    professional: "Strong point. Hiring for trust over raw speed tends to pay off in retention and autonomy down the line."
  };
  const order = ['ceo', 'insightful', 'supportive', 'curious', 'professional'];
  let n = 0;
  function run() {
    if (ph) ph.style.display = 'none';
    const id = order[n % order.length];
    tones.forEach(t => t.classList.toggle('on', t.dataset.tone === id));
    typeInto(out, byTone[id], 20, () => { n++; setTimeout(run, 1700); });
  }
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(out);
})();

/* ── LinkedIn connection-note demo (types under 200 chars) ── */
(function noteDemo() {
  const out = document.getElementById('note-out');
  const ph = document.getElementById('note-ph');
  const counter = document.getElementById('note-count');
  const reasons = document.querySelectorAll('#note-reasons .li-tone');
  if (!out) return;
  // One note per "reason for connecting" — Connect / Referral / Hiring / General
  // / Collaborate / Inspired — each written differently, all under 200 chars.
  const byReason = {
    connect:     "Hi Sarah — your work scaling design at Linear is exactly the craft I keep pointing my team to. Would love to connect and trade notes.",
    referral:    "Hi Sarah — I really admire how Linear's design team operates. I'm exploring roles in the space and would value connecting to learn more.",
    hiring:      "Hi Sarah — building a design‑led team and Linear's work is the bar I'm aiming for. Would love to connect and hear how you hire.",
    general:     "Hi Sarah — fellow design nerd here. Linear's craft keeps raising my own standards. Would be great to connect.",
    collaborate: "Hi Sarah — I work on adjacent tooling and think there's a neat collaboration between our teams. Would love to connect and explore it.",
    inspired:    "Hi Sarah — your thread on design systems genuinely changed how my team works. Huge fan — would love to connect and keep learning."
  };
  const order = ['connect', 'referral', 'hiring', 'general', 'collaborate', 'inspired'];
  let n = 0;
  function run() {
    if (ph) ph.style.display = 'none';
    const id = order[n % order.length];
    if (reasons.length) reasons.forEach(r => r.classList.toggle('on', r.dataset.reason === id));
    const note = byReason[id];
    let i = 0; out.innerHTML = '';
    const caret = document.createElement('span'); caret.className = 'caret'; out.appendChild(caret);
    (function step() {
      if (i <= note.length) {
        caret.insertAdjacentText('beforebegin', note[i - 1] || '');
        if (counter) counter.textContent = note.slice(0, i).length + '/200';
        i++; setTimeout(step, 20 + Math.random() * 24);
      } else { caret.remove(); n++; setTimeout(run, 2100); }
    })();
  }
  const start = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { start.disconnect(); run(); }
  }), { threshold: .3 });
  start.observe(out);
})();

/* ── flagship "See it work" scene: WhatsApp ↔ Draftly panel, end to end ── */
(function flowDemo() {
  const $ = id => document.getElementById(id);
  const body = $('wa-body'), thread = $('flow-thread'), out = $('flow-out');
  if (!body || !thread || !out) return;
  const tabs = $('flow-tabs'), modes = $('flow-modes'), l1 = $('flow-l1'),
        grab = $('flow-grab'), mid = $('flow-mid'), l2 = $('flow-l2'),
        btns = $('flow-btns'), step = $('flow-step-txt');

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const setStep = t => { if (step) step.textContent = t; };
  function addMsg(side, html, time) {
    const d = document.createElement('div');
    d.className = 'wa-msg ' + (side === 'in' ? 'wa-in' : 'wa-out');
    d.innerHTML = html + '<span class="t">' + time + (side === 'out' ? ' ✓✓' : '') + '</span>';
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function typing(on) {
    let t = body.querySelector('.wa-typing');
    if (on && !t) { t = document.createElement('div'); t.className = 'wa-typing'; t.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(t); body.scrollTop = body.scrollHeight; }
    else if (!on && t) { t.remove(); }
  }
  const setTab = t => tabs.querySelectorAll('.ptab').forEach(x => x.classList.toggle('on', x.dataset.t === t));
  function pulse(sel) { const el = btns.querySelector(sel); if (!el) return; el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }
  const typeP = (el, text, sp) => new Promise(res => typeInto(el, text, sp || 18, res));

  async function replyPhase() {
    setTab('rep'); modes.style.display = 'flex';
    l1.firstChild.nodeValue = 'Conversation thread '; grab.textContent = '↻ pulled live';
    mid.innerHTML = '<div class="panel-input">Reply in: &nbsp;Auto (match conversation)</div>';
    l2.textContent = '✦ Draftly · drafted reply';
    btns.innerHTML = '<span class="pbtn primary">✦ Draft Reply</span><span class="pbtn green">🔍 Check</span>';
    thread.innerHTML = ''; out.textContent = '';

    setStep('1 · A message comes in');
    typing(true); await wait(900); typing(false);
    addMsg('in', 'Hey, did the package ship yet?', '9:41'); await wait(800);
    addMsg('in', 'I needed it by Friday 😅', '9:41'); await wait(950);

    setStep('2 · Draftly pulls the whole thread');
    thread.classList.add('flash');
    thread.innerHTML = '<div class="thread-line"><span class="nm">Marco:</span> Hey, did the package ship yet?</div><div class="thread-line"><span class="nm">Marco:</span> I needed it by Friday</div>';
    await wait(1100); thread.classList.remove('flash');

    setStep('3 · It drafts a reply that fits the chat');
    pulse('.pbtn.primary'); await wait(500);
    const reply = "Hey Marco! It ships today and lands Thursday — comfortably before Friday. Sending your tracking link now.";
    await typeP(out, reply, 17);
    await wait(500);
    btns.innerHTML = '<span class="pbtn primary">Apply</span><span class="pbtn green">Send ➤</span><span class="pbtn">Dismiss</span>';

    setStep('4 · Send it straight back to the chat');
    pulse('.pbtn.green'); await wait(700);
    addMsg('out', reply, '9:42'); await wait(2000);
  }

  async function translatePhase() {
    setTab('tr'); modes.style.display = 'none';
    l1.firstChild.nodeValue = 'Text to translate '; grab.textContent = '↻ Grab text';
    mid.innerHTML = '<div class="langsel"><span class="arrow">→</span> English <span class="ml">Google · AI translate</span></div>';
    l2.textContent = '✦ Draftly · translation';
    btns.innerHTML = '<span class="pbtn primary">Apply</span><span class="pbtn green">Send ➤</span><span class="pbtn green">Spanish &amp; Send</span>';
    thread.innerHTML = ''; out.textContent = '';

    setStep('5 · A reply lands in another language');
    typing(true); await wait(900); typing(false);
    addMsg('in', '¿me puedes enviar la factura?', '9:44'); await wait(1000);

    setStep('6 · Draftly grabs it and translates');
    thread.classList.add('flash');
    thread.innerHTML = '<div class="thread-line"><span class="nm">Marco:</span> ¿me puedes enviar la factura?</div>';
    await wait(900); thread.classList.remove('flash');
    pulse('.pbtn.primary'); await wait(400);
    await typeP(out, 'Marco: Can you send me the invoice?', 17);
    await wait(900);

    setStep('7 · Reply in their language, sent in one tap');
    pulse('.pbtn.green:last-child'); await wait(700);
    addMsg('out', '¡Claro! Te envío la factura ahora mismo 📎', '9:45'); await wait(2200);
  }

  async function loop() { while (true) { await replyPhase(); await translatePhase(); } }
  const ob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { ob.disconnect(); loop(); } }), { threshold: .25 });
  ob.observe(thread);
})();
