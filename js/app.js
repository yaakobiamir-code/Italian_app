import { UNITS, SCENARIOS, STORY_TOPICS } from './data.js';
import * as store from './store.js';
import { review, newCard, isKnown, isSeen } from './srs.js';
import * as ai from './ai.js';
import { speak, stopSpeaking, listen, sttAvailable, ttsAvailable, grade, compareWords, normalize, answerVariants, italianVoices } from './speech.js';

const $ = (s, el = document) => el.querySelector(s);
const view = () => $('#view');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const set = () => store.settings();

// ================= עזרים כלליים =================
function toast(msg, ms = 2400) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms);
}

function sheet(html) {
  const s = $('#sheet');
  s.innerHTML = `<div class="sheet-card" role="dialog">${html}</div>`;
  s.classList.add('open');
  s.onclick = (e) => { if (e.target === s || e.target.closest('[data-close]')) closeSheet(); };
  return s;
}
function closeSheet() { $('#sheet').classList.remove('open'); $('#sheet').innerHTML = ''; }

const spk = (t, slow) => `<button class="icon-btn" data-say="${esc(t)}" ${slow ? 'data-slow="1"' : ''} aria-label="השמע">${slow ? '🐢' : '🔊'}</button>`;

// טקסט איטלקי שאפשר ללחוץ על כל מילה בו
function tappable(text, ctx = '') {
  return esc(text).replace(/([A-Za-zÀ-ÿ']+)/g, (m) => `<span class="w" data-w="${m}" data-ctx="${esc(ctx || text)}">${m}</span>`);
}

function noKeyCard(what) {
  return `<div class="card warn">
    <h3>🔑 צריך מפתח AI</h3>
    <p>${what} משתמש במורה ה-AI. ההגדרה לוקחת 5 דקות ועולה סנטים בחודש.</p>
    <a class="btn" href="#settings">להגדרת המפתח</a>
  </div>`;
}

function errBox(e) {
  return `<div class="card warn"><p>⚠️ ${esc(e.message || e)}</p>${e.code === 'nokey' || e.code === 'auth' ? '<a class="btn" href="#settings">להגדרות</a>' : ''}</div>`;
}

const spinner = (t = 'המורה חושבת…') => `<div class="loading"><div class="dots"><i></i><i></i><i></i></div><p>${t}</p></div>`;

// ================= ניווט =================
const routes = {};
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', render);

function render() {
  stopSpeaking();
  closeSheet();
  view().onclick = null;
  const [name, arg] = (location.hash.slice(1) || 'today').split('/');
  const r = routes[name] || routes.today;
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (r.tab || name)));
  document.body.dataset.route = name;
  view().scrollTop = 0; window.scrollTo(0, 0);
  if (!store.S().onboarded && name !== 'settings' && name !== 'help') return renderOnboarding();
  r.render(arg);
}

// ================= אירועים גלובליים =================
document.addEventListener('click', async (e) => {
  const say = e.target.closest('[data-say]');
  if (say) { e.preventDefault(); speak(say.dataset.say, { rate: say.dataset.slow ? 0.65 : undefined }); return; }
  const w = e.target.closest('.w');
  if (w) { e.preventDefault(); wordSheet(w.dataset.w, w.dataset.ctx); return; }
  const acc = e.target.closest('[data-acc]');
  if (acc) {
    e.preventDefault();
    const inp = document.querySelector('.accent-target');
    if (inp) {
      const s = inp.selectionStart ?? inp.value.length;
      inp.value = inp.value.slice(0, s) + acc.dataset.acc + inp.value.slice(inp.selectionEnd ?? s);
      inp.focus(); inp.setSelectionRange(s + 1, s + 1);
    }
  }
});

const accentBar = () => `<div class="accents">${['à', 'è', 'é', 'ì', 'ò', 'ù', "'"].map((a) => `<button type="button" data-acc="${a}" tabindex="-1">${a}</button>`).join('')}</div>`;

// גיליון תרגום מילה
let storyGloss = null;
async function wordSheet(word, ctx) {
  const lw = word.toLowerCase();
  let info = null;
  if (storyGloss) {
    const g = storyGloss.find((x) => normalize(x.w) === normalize(lw));
    if (g) info = { he: g.he, base: g.base, note_he: '' };
  }
  if (!info) {
    for (const it of store.allItems().values()) {
      if (answerVariants(it.it).some((v) => normalize(v) === normalize(lw))) { info = { he: it.he, base: it.it, note_he: '', known: it.id }; break; }
    }
  }
  const draw = (body) => sheet(`
    <div class="sheet-head"><span class="it big">${esc(word)}</span>${spk(word)}<button class="icon-btn" data-close>✕</button></div>
    ${body}`);
  if (info) return draw(wordBody(info, ctx));
  if (!ai.hasKey()) return draw(`<p class="muted">אין תרגום שמור למילה הזו. עם מפתח AI אפשר לתרגם כל מילה.</p>`);
  draw(spinner('מתרגם…'));
  try {
    const r = await ai.glossWord(word, ctx);
    if ($('#sheet').classList.contains('open')) draw(wordBody(r, ctx));
  } catch (err) { draw(errBox(err)); }
}

function wordBody(info, ctx) {
  const base = info.base || '';
  const inDeck = info.known && store.card(info.known);
  return `<p class="he big">${esc(info.he)}</p>
    ${base ? `<p>צורת מילון: <span class="it">${esc(base)}</span> ${spk(base)}</p>` : ''}
    ${info.note_he ? `<p class="muted">${esc(info.note_he)}</p>` : ''}
    ${inDeck ? '<p class="ok">✓ כבר בכרטיסיות שלך</p>' :
      `<button class="btn" id="addw" data-it="${esc(base || '')}" data-he="${esc(info.he)}" data-ctx="${esc(ctx || '')}">+ הוסף לתרגול</button>`}`;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('#addw');
  if (!b) return;
  const it = b.dataset.it || $('.sheet-head .it')?.textContent;
  store.addCustom({ it, he: b.dataset.he, ex: b.dataset.ctx, src: 'tap' });
  b.outerHTML = '<p class="ok">✓ נוסף! יופיע בתרגול הבא</p>';
});

// ================= קבלת פנים =================
function renderOnboarding() {
  view().innerHTML = `
  <section class="onb">
    <div class="hero-flag">🇮🇹</div>
    <h1>Ciao! ברוכים הבאים</h1>
    <p class="lead">אפליקציה ללימוד איטלקית שבנויה על מה שהמחקר מראה שבאמת עובד:</p>
    <ul class="why">
      <li><b>🧠 שליפה מרווחת</b> – כל מילה חוזרת בדיוק כשאתם עומדים לשכוח אותה.</li>
      <li><b>🎧 הרבה איטלקית מובנת</b> – סיפורים ושיחות שנבנים מהמילים שכבר למדתם.</li>
      <li><b>🗣️ לדבר מהיום הראשון</b> – שיחות עם מורה AI שמתקנת בעדינות ומסבירה בעברית.</li>
      <li><b>📅 קצת כל יום</b> – 15–20 דקות ביום עדיפות על שעתיים פעם בשבוע.</li>
    </ul>
    <h3>כמה זמן ביום תלמדו?</h3>
    <div class="goal-pick" id="gp">
      ${GOALS.map((g, i) => `<button data-i="${i}" class="${i === 1 ? 'on' : ''}"><b>${g.label}</b><small>${g.sub}</small></button>`).join('')}
    </div>
    <p class="muted small" id="gpnote"></p>
    <button class="btn big" id="start">בואו נתחיל!</button>
  </section>`;
  let gi = 1;
  const note = () => { const g = GOALS[gi]; $('#gpnote').textContent = `${g.npd} מילים חדשות ביום · ${g.note}`; };
  note();
  $('#gp').onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    gi = +b.dataset.i; note();
    $('#gp').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
  };
  $('#start').onclick = () => {
    const g = GOALS[gi];
    store.setSetting('newPerDay', g.npd); store.setSetting('dailyGoal', g.min);
    if (g.plan) store.setPlan(planDays('B1', g.min), 'B1');
    store.S().onboarded = true; store.save(); go('#today');
  };
}

// יעדי זמן יומיים. הקצב נגזר מההערכה: B2 ≈ 500–650 שעות לימוד מאפס (Cambridge / FSI)
const GOALS = [
  { min: 15, npd: 10, label: '15 דק\'', sub: 'רגוע', note: 'בסיס שימושי לטיול תוך כמה חודשים' },
  { min: 30, npd: 15, label: '30 דק\'', sub: 'קבוע', note: 'A2 תוך כשנה' },
  { min: 60, npd: 25, label: 'שעה', sub: 'רציני', note: 'A2 תוך כ-6 חודשים, רמה טובה (B1) תוך כשנה', plan: true },
  { min: 150, npd: 35, label: '2–3 שעות', sub: 'אינטנסיבי', note: 'רמה טובה (B1) תוך כ-4–5 חודשים', plan: true },
  { min: 360, npd: 45, label: '6+ שעות', sub: 'טבילה מלאה', note: 'B1 תוך כחודשיים, B2 תוך 3–4 חודשים', plan: true },
];

// יעדי רמה: B1 = "רמה טובה" (שיחה בביטחון, הבנת רוב הדיבור היומיומי), B2 = כמעט שוטף
const TARGETS = {
  B1: { hours: 350, words: 1300, unit: 24, he: 'לדבר בביטחון ולהבין את רוב היומיום' },
  B2: { hours: 600, words: 3500, unit: 36, he: 'כמעט שוטף: סדרות, חדשות ודיונים' },
};
const planDays = (goal, minutes) => Math.max(45, Math.min(730, Math.round(TARGETS[goal].hours / Math.max(0.25, minutes / 60))));
const monthsText = (days) => days < 75 ? `${Math.round(days / 7)} שבועות` : `${Math.round(days / 30)} חודשים`;

// ================= היום =================
const TIPS = [
  'עדיף 15 דקות כל יום מאשר שעה וחצי פעם בשבוע – הזיכרון מתחזק בהפסקות שבין החזרות.',
  'כשאתם לא בטוחים – נחשו! עצם הניסיון לשלוף מהזיכרון מחזק אותו, גם כשטועים.',
  'אמרו כל מילה בקול. דיבור + שמיעה יוצרים זיכרון חזק יותר מקריאה בלבד.',
  'טעויות בשיחה הן לא כישלון – הן בדיוק הרגע שבו המוח לומד.',
  'האזינו לאותו סיפור שוב ושוב. חזרה על קלט מוכר היא אחת הדרכים הטובות לשפר הבנת הנשמע.',
  'מילה שנלמדת בתוך משפט נזכרת טוב יותר ממילה בודדת. שימו לב למשפטי הדוגמה.',
  'נסו "לחקות" (shadowing): להשמיע משפט ולחזור עליו מיד באותה מנגינה. זה משפר מבטא ושטף.',
  'למדו שמות עצם עם ה-il/la שלהם – כך זוכרים את המין בלי מאמץ.',
  'הגדירו לעצמכם זמן קבוע ביום (למשל עם הקפה של הבוקר). הרגל קבוע מנצח מוטיבציה.',
  'אל תחכו ל"מוכנים" כדי לדבר. גם עם 50 מילים כבר אפשר לנהל שיחה קטנה.',
];

routes.today = {
  render() {
    const t = store.today();
    const due = store.dueCards().length;
    const newLeft = Math.max(0, set().newPerDay - store.newIntroducedToday());
    const newAvail = store.nextNewItems(newLeft).length;
    const v = store.vocabSummary();
    const st = store.streak();
    const ui = store.currentUnitIndex();
    const unit = UNITS[ui];
    const mins = Math.round((t.seconds || 0) / 60);
    const goal = set().dailyGoal || 15;
    const pct = Math.min(100, Math.round((mins / goal) * 100));
    const scen = SCENARIOS.filter((s) => s.minUnit <= ui + 1);
    const nextScen = scen[(new Date().getDate()) % scen.length] || SCENARIOS[0];
    const tasks = dailyTasks(t, due, newAvail, nextScen, unit, goal);
    autoGenerate();
    view().innerHTML = `
    <header class="top">
      <div>
        <div class="muted small">${new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1>Buongiorno! 👋</h1>
      </div>
      <div class="ring" style="--p:${pct}"><span>${mins}<small>/${goal} דק'</small></span></div>
    </header>

    <div class="stats-row">
      <div class="stat"><b>🔥 ${st}</b><span>ימי רצף</span></div>
      <div class="stat"><b>${v.seen}</b><span>מילים שפגשת</span></div>
      <div class="stat"><b>${v.known}</b><span>מילים שאתה יודע</span></div>
    </div>

    <a class="card hero" href="#practice">
      <div>
        <h2>🧠 תרגול יומי</h2>
        <p>${due ? `<b>${due}</b> לחזרה` : 'אין חזרות ממתינות'}${newAvail ? ` · <b>${newAvail}</b> מילים חדשות` : ''}</p>
        <p class="muted small">יחידה נוכחית: ${esc(unit.he)}</p>
      </div>
      <span class="go">${due + newAvail ? 'התחל ←' : 'תרגול נוסף ←'}</span>
    </a>

    <h3 class="sec">התוכנית להיום <small class="muted">(${goal >= 60 ? Math.round(goal / 60 * 10) / 10 + ' שעות' : goal + ' דק\''})</small></h3>
    <div class="tasks">
      ${tasks.map((k) => `<a class="task ${k.done ? 'done' : ''}" href="${k.href}"><span>${k.icon}</span><b>${k.label}</b><i>${k.done ? '✓' : '›'}</i></a>`).join('')}
    </div>
    ${roadmapCard()}
    ${goal >= 30 ? externalCard(t) : ''}

    <div class="grid2">
      <a class="card mini" href="#chat/${nextScen.id}"><span class="emoji">${nextScen.icon}</span><b>${esc(nextScen.he)}</b><small>שיחה מומלצת</small></a>
      <a class="card mini" href="#write"><span class="emoji">✍️</span><b>כתיבה יומית</b><small>תיקון ומשוב אישי</small></a>
      <a class="card mini" href="#unit/${unit.id}"><span class="emoji">📖</span><b>${esc(unit.he)}</b><small>הסבר דקדוק קצר</small></a>
      <a class="card mini" href="#words"><span class="emoji">➕</span><b>מילים משלך</b><small>לפי נושא שמעניין אותך</small></a>
    </div>

    <div class="card tip"><b>💡 טיפ</b><p>${TIPS[new Date().getDate() % TIPS.length]}</p></div>
    ${installHint()}
    ${!ai.hasKey() ? `<div class="card soft"><p>🔑 התרגול היומי עובד גם בלי AI. כדי לפתוח שיחות, סיפורים ותיקוני כתיבה – <a href="#settings">הגדירו מפתח</a>.</p></div>` : ''}
    `;
  },
};

function dailyTasks(t, due, newAvail, nextScen, unit, goal) {
  const k = goal >= 300 ? 3 : goal >= 120 ? 2 : 1;
  const tasks = [
    { done: due === 0 && (newAvail === 0 || t.newWords >= set().newPerDay) && t.reviews > 0, label: 'כל החזרות + המילים החדשות', href: '#practice', icon: '🧠' },
  ];
  if (goal >= 60) tasks.push({ done: false, label: `דקדוק: ${unit.he}`, href: `#unit/${unit.id}`, icon: '📖' });
  tasks.push({ done: t.stories >= k, label: k > 1 ? `${k} סיפורים: קריאה, האזנה וחיקוי (${t.stories || 0}/${k})` : 'סיפור: קריאה והאזנה', href: '#stories', icon: '🎧' });
  const ct = goal >= 60 ? 10 * k : 6;
  tasks.push({ done: t.chat >= ct, label: `שיחה עם המורה (${Math.min(t.chat || 0, ct)}/${ct} משפטים)`, href: `#chat/${nextScen.id}`, icon: '🗣️' });
  if (goal >= 60) tasks.push({ done: t.writing >= 1, label: 'כתיבה יומית', href: '#write', icon: '✍️' });
  if (goal >= 30) {
    const ext = goal >= 300 ? 120 : goal >= 120 ? 60 : goal >= 60 ? 30 : 15;
    tasks.push({ done: (t.external || 0) >= ext, label: `האזנה/צפייה חיצונית (${t.external || 0}/${ext} דק')`, href: '#resources', icon: '📺' });
  }
  return tasks;
}

// מפת הדרכים ל-B2: האם הקצב מספיק?
function roadmapCard() {
  const p = store.planStatus();
  if (!p) return '';
  const v = store.vocabSummary();
  const lv = ai.levelInfo();
  const T = TARGETS[p.goal] || TARGETS.B1;
  const frac = p.day / p.days;
  const wordsTarget = Math.round(T.words * frac);
  const hoursTarget = Math.round(T.hours * frac);
  const unitTarget = Math.min(T.unit, Math.max(1, Math.round(T.unit * Math.min(1, frac * 1.1))));
  const ui = store.currentUnitIndex() + 1;
  const ok = (a, b) => (a >= b * 0.9 ? 'good' : a >= b * 0.6 ? 'mid' : 'low');
  return `<div class="card roadmap">
    <div class="row-between"><h3>🎯 יעד ${esc(p.goal)} · יום ${p.day}/${p.days}</h3><span class="lvl">רמה משוערת: <b>${lv.code}</b></span></div>
    <div class="track"><i style="width:${Math.round(frac * 100)}%"></i></div>
    <div class="rm-grid">
      <div class="${ok(v.seen, wordsTarget)}"><b>${v.seen}</b><small>מילים / יעד להיום ${wordsTarget}</small></div>
      <div class="${ok(p.hours, hoursTarget)}"><b>${Math.round(p.hours)}</b><small>שעות / יעד ${hoursTarget}</small></div>
      <div class="${ok(ui, unitTarget)}"><b>${ui}</b><small>יחידה / יעד ${unitTarget}</small></div>
    </div>
    <p class="small muted">${p.day > 3 && p.hours < hoursTarget * 0.6 ? `קצת מאחורי הקצב – וזה בסדר. אפשר להאריך את התוכנית בהגדרות. העיקר להמשיך כל יום.` : `הקצב טוב! ${esc(T.he)} – בעוד כ-${monthsText(p.days - p.day)}.`}</p>
  </div>`;
}

function externalCard(t) {
  return `<div class="card ext">
    <b>📺 האזנה חיצונית היום: ${t.external || 0} דק'</b>
    <p class="small muted">פודקאסט, יוטיוב או סדרה באיטלקית? רשמו את הזמן – הוא נספר ליעד.</p>
    <div class="chips">${[15, 30, 60].map((m) => `<button class="chip" data-ext="${m}">+${m} דק'</button>`).join('')}<a class="chip" href="#resources">מה להאזין?</a></div>
  </div>`;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-ext]'); if (!b) return;
  const m = +b.dataset.ext;
  store.bump('external', m); store.bump('seconds', m * 60);
  toast(`נרשמו ${m} דקות 👏`); render();
});

// יוצר ברקע מילים ליחידה המתקדמת הבאה כשהמלאי של מילים חדשות עומד להיגמר
let generating = false;
async function autoGenerate(force) {
  if (generating || !ai.hasKey()) return;
  if (!force && store.pendingNewCount() >= set().newPerDay * 2) return;
  const cur = UNITS[store.currentUnitIndex()];
  const u = store.nextUnitToGenerate() || (cur.gen ? cur : UNITS[UNITS.length - 1]);
  if (!u?.gen) return;
  generating = true;
  try {
    const existing = [...store.allItems().values()].map((x) => x.it);
    const items = await ai.generateUnitWords(u, existing, 30);
    const n = store.addUnitWords(u.id, items);
    if (n) toast(`✨ נוספו ${n} מילים ליחידה "${u.he}"`);
  } catch (e) { console.warn('autogen', e); }
  generating = false;
}

function installHint() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<div class="card soft"><p>📲 <b>התקנה כאפליקציה:</b> ${ios ? 'ב-Safari לחצו על כפתור השיתוף ⬆️ ואז "הוסף למסך הבית".' : 'בתפריט הדפדפן (⋮) בחרו "התקן אפליקציה" או "הוסף למסך הבית".'}</p></div>`;
}

// ================= תרגול (SRS) =================
let session = null;

function chooseMode(c, isNewTest) {
  if (isNewTest) return 'mc-it-he';
  const it = store.item(c.id);
  const canCloze = !!clozeForm(it);
  const s = c.s || 0;
  let modes;
  if (c.state === 'learning') modes = ['mc-he-it', 'mc-it-he'];
  else if (s < 2.5) modes = ['mc-it-he', 'listen', 'mc-he-it'];
  else if (s < 8) modes = ['listen', 'mc-he-it', canCloze ? 'cloze' : 'mc-he-it', 'type'];
  else modes = ['type', canCloze ? 'cloze-type' : 'type', sttAvailable() ? 'speak' : 'type', 'listen'];
  return pick(modes);
}

function clozeForm(it) {
  if (!it || !it.ex) return null;
  const exN = it.ex.toLowerCase();
  const vs = answerVariants(it.it).filter((v) => v.length > 1).sort((a, b) => b.length - a.length);
  for (const v of vs) {
    const i = exN.indexOf(v.toLowerCase());
    if (i >= 0) return { form: it.ex.substr(i, v.length), index: i };
  }
  return null;
}

function distractors(it, field, n = 3) {
  const pool = [...store.allItems().values()].filter((x) => x.id !== it.id && x[field] !== it[field]);
  const same = pool.filter((x) => x.unit === it.unit);
  const seen = pool.filter((x) => isSeen(store.card(x.id)));
  const out = new Set();
  for (const src of [shuffle(same), shuffle(seen), shuffle(pool)]) {
    for (const x of src) { if (out.size >= n) break; out.add(x[field]); }
  }
  return [...out].slice(0, n);
}

routes.practice = {
  tab: 'today',
  render() {
    // שיעור = עד 80 חזרות ו-20 חדשות. אפשר לעשות כמה שיעורים ביום
    const due = store.dueCards().slice(0, 80);
    const newLeft = Math.min(20, Math.max(0, set().newPerDay - store.newIntroducedToday()));
    let newIds = store.nextNewItems(newLeft);
    let extra = false;
    if (!due.length && !newIds.length) {
      // הכל נעשה – תרגול נוסף: מילים חלשות + 5 חדשות
      extra = true;
      newIds = store.nextNewItems(5);
    }
    const queue = [];
    due.forEach((c) => queue.push({ id: c.id, kind: 'test' }));
    if (extra) {
      store.weakItems(10).forEach((x) => queue.push({ id: x.id, kind: 'test', practiceOnly: true }));
    }
    // משלבים מילים חדשות בין החזרות (interleaving): כל מילה חדשה – הצגה, ובדיקה כמה כרטיסים אחר כך
    const q = shuffle(queue);
    newIds.forEach((id, k) => {
      const pos = Math.min(q.length, k * 3 + 1);
      q.splice(pos, 0, { id, kind: 'intro' });
      q.splice(Math.min(q.length, pos + 3), 0, { id, kind: 'test', isNew: true });
    });
    if (!q.length) {
      view().innerHTML = `<div class="card center"><h2>🎉 סיימת הכל!</h2><p>אין כרטיסים לתרגול כרגע. ${ai.hasKey() ? 'מכינים לך עכשיו מילים ליחידה הבאה – נסו שוב בעוד דקה.' : 'כדי להמשיך מעבר ל-A2 צריך מפתח AI (הוא יוצר את המילים של יחידות B1–B2).'}</p><a class="btn" href="#course">לקורס</a></div>`;
      autoGenerate(true);
      return;
    }
    session = { q, i: 0, total: q.filter((x) => x.kind === 'test').length, done: 0, correct: 0, start: Date.now(), wrong: [], relearn: {} };
    nextCard();
  },
};

function progressBar() {
  const p = session.total ? Math.round((session.done / session.total) * 100) : 0;
  return `<div class="pbar"><a href="#today" class="x" aria-label="יציאה">✕</a><div class="track"><i style="width:${p}%"></i></div><span class="small">${session.done}/${session.total}</span></div>`;
}

function nextCard() {
  if (!session) return;
  if (session.i >= session.q.length) return finishSession();
  const task = session.q[session.i];
  const it = store.item(task.id);
  if (!it) { session.i++; return nextCard(); }
  if (task.kind === 'intro') return showIntro(it);
  let c = store.card(task.id) || newCard(task.id);
  const mode = task.isNew || task.relearn ? (task.relearn ? 'mc-he-it' : 'mc-it-he') : chooseMode(c, false);
  showTest(it, c, mode, task);
}

function showIntro(it) {
  view().innerHTML = `${progressBar()}
  <div class="flash intro">
    <div class="badge">✨ מילה חדשה</div>
    <div class="it huge">${tappable(it.it)}</div>
    <div class="say-row">${spk(it.it)}${spk(it.it, true)}</div>
    <div class="he big">${esc(it.he)}</div>
    ${it.ex ? `<div class="example"><div class="it">${tappable(it.ex)} ${spk(it.ex)}</div><div class="he muted">${esc(it.exHe)}</div></div>` : ''}
    <p class="muted small">🗣️ אמרו את המילה בקול פעמיים</p>
  </div>
  <div class="actions"><button class="btn big" id="cont">הבנתי ←</button></div>`;
  if (set().autoplay) speak(it.it);
  $('#cont').onclick = () => {
    if (!store.card(it.id)) { store.putCard(newCard(it.id)); }
    store.bump('newWords');
    session.i++; nextCard();
  };
}

function showTest(it, c, mode, task) {
  const t0 = Date.now();
  let body = '';
  let answerHtml = '';
  const form = clozeForm(it);
  if (mode === 'cloze' || mode === 'cloze-type') {
    if (!form) mode = mode === 'cloze' ? 'mc-he-it' : 'type';
  }
  if (mode === 'speak' && !sttAvailable()) mode = 'type';

  if (mode === 'mc-it-he') {
    const opts = shuffle([it.he, ...distractors(it, 'he')]);
    body = `<div class="prompt-label">מה הפירוש?</div><div class="it huge">${esc(it.it)}</div><div class="say-row">${spk(it.it)}</div>`;
    answerHtml = mcOptions(opts, 'he');
  } else if (mode === 'listen') {
    const opts = shuffle([it.he, ...distractors(it, 'he')]);
    body = `<div class="prompt-label">🎧 הקשיבו – מה שמעתם?</div><div class="say-row big-say">${spk(it.it)}${spk(it.it, true)}</div>`;
    answerHtml = mcOptions(opts, 'he');
  } else if (mode === 'mc-he-it') {
    const opts = shuffle([it.it, ...distractors(it, 'it')]);
    body = `<div class="prompt-label">איך אומרים באיטלקית?</div><div class="he huge">${esc(it.he)}</div>`;
    answerHtml = mcOptions(opts, 'it');
  } else if (mode === 'cloze') {
    const opts = shuffle([form.form, ...distractors(it, 'it').map((x) => x.replace(/^(il|lo|la|i|gli|le)\s+/i, ''))]);
    body = `<div class="prompt-label">השלימו את המשפט</div>
      <div class="it big cloze">${esc(it.ex.slice(0, form.index))}<span class="blank">____</span>${esc(it.ex.slice(form.index + form.form.length))}</div>
      <div class="he muted">${esc(it.exHe)}</div>`;
    answerHtml = mcOptions(opts, 'it');
  } else if (mode === 'cloze-type') {
    body = `<div class="prompt-label">השלימו את המשפט (הקלידו)</div>
      <div class="it big cloze">${esc(it.ex.slice(0, form.index))}<span class="blank">____</span>${esc(it.ex.slice(form.index + form.form.length))}</div>
      <div class="he muted">${esc(it.exHe)}</div><div class="he small muted">(${esc(it.he)})</div>`;
    answerHtml = typeBox();
  } else if (mode === 'type') {
    body = `<div class="prompt-label">כתבו באיטלקית</div><div class="he huge">${esc(it.he)}</div>
      ${it.exHe ? `<div class="he muted small">לדוגמה: ${esc(it.exHe)}</div>` : ''}`;
    answerHtml = typeBox();
  } else if (mode === 'speak') {
    body = `<div class="prompt-label">🎙️ אמרו באיטלקית</div><div class="he huge">${esc(it.he)}</div>`;
    answerHtml = `<div class="actions col"><button class="btn big mic" id="mic">🎙️ לחצו ודברו</button>
      <p class="muted small" id="heard"></p><button class="btn ghost" id="totype">אני מעדיף להקליד</button></div>`;
  }

  view().innerHTML = `${progressBar()}<div class="flash">${body}</div>${answerHtml}<div id="fb"></div>`;
  if ((mode === 'mc-it-he' && set().autoplay) || mode === 'listen') speak(it.it);

  const target = mode.startsWith('cloze') ? form.form : it.it;
  const finish = (result, given) => onAnswer(it, c, mode, task, result, given, Date.now() - t0);

  if (answerHtml.includes('data-opt')) {
    view().querySelectorAll('[data-opt]').forEach((b) => {
      b.onclick = () => {
        const ok = b.dataset.opt === (mode === 'mc-it-he' || mode === 'listen' ? it.he : target);
        view().querySelectorAll('[data-opt]').forEach((x) => {
          x.disabled = true;
          if (x.dataset.opt === (mode === 'mc-it-he' || mode === 'listen' ? it.he : target)) x.classList.add('right');
        });
        if (!ok) b.classList.add('wrong');
        finish(ok ? 'exact' : 'wrong', b.dataset.opt);
      };
    });
  }
  const inp = $('#ans');
  if (inp) {
    setTimeout(() => inp.focus(), 50);
    const submit = () => {
      if (!inp.value.trim()) { finish('wrong', ''); return; }
      inp.disabled = true;
      finish(grade(inp.value, target), inp.value);
    };
    $('#check').onclick = submit;
    inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    $('#idk').onclick = () => finish('wrong', '');
    const m = $('#tmic');
    if (m) m.onclick = async () => {
      m.classList.add('rec');
      try { const r = await listen({ onInterim: (x) => { inp.value = x; } }); if (r) inp.value = r; } catch { toast('המיקרופון לא זמין'); }
      m.classList.remove('rec');
    };
  }
  if (mode === 'speak') {
    $('#totype').onclick = () => showTest(it, c, 'type', task);
    $('#mic').onclick = async () => {
      const b = $('#mic'); b.classList.add('rec'); b.textContent = '🎙️ מקשיב…';
      try {
        const heard = await listen({ onInterim: (x) => { $('#heard').textContent = x; } });
        b.classList.remove('rec');
        $('#heard').textContent = heard ? `שמעתי: "${heard}"` : 'לא שמעתי. נסו שוב.';
        if (!heard) { b.textContent = '🎙️ נסו שוב'; return; }
        b.disabled = true;
        const g = grade(heard, target);
        finish(g === 'wrong' ? (compareWords(target, heard).score >= 70 ? 'typo' : 'wrong') : g, heard);
      } catch {
        b.classList.remove('rec'); toast('המיקרופון לא זמין – עוברים להקלדה');
        showTest(it, c, 'type', task);
      }
    };
  }
}

const mcOptions = (opts, lang) => `<div class="options">${opts.map((o) => `<button class="opt ${lang}" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
const typeBox = () => `<div class="type-box">
  <div class="inp-row"><input id="ans" class="accent-target" lang="it" dir="ltr" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="scrivi qui…">
  ${sttAvailable() ? '<button class="icon-btn" id="tmic" aria-label="הכתבה">🎙️</button>' : ''}</div>
  ${accentBar()}
  <div class="actions"><button class="btn ghost" id="idk">לא יודע</button><button class="btn" id="check">בדיקה</button></div></div>`;

function onAnswer(it, c, mode, task, result, given, ms) {
  let g;
  if (result === 'exact' || result === 'accent') g = (ms > 12000 && mode.startsWith('mc')) ? 2 : 3;
  else if (result === 'typo') g = 2;
  else g = 1;
  if (g === 3 && mode.startsWith('mc') && ms < 2500 && c.s > 20) g = 4;
  const ok = g > 1;
  session.done += task.relearn ? 0 : 1;
  if (!task.relearn) { if (ok) session.correct++; else session.wrong.push(it.id); }
  store.bump('reviews');
  if (ok) store.bump('correct');
  if (!task.practiceOnly || !ok) {
    store.putCard(review(store.card(it.id) || newCard(it.id), g, Date.now(), set().retention));
  }
  // כרטיס שנכשל חוזר עוד מעט באותו שיעור (עד פעמיים)
  if (!ok) {
    session.relearn[it.id] = (session.relearn[it.id] || 0) + 1;
    if (session.relearn[it.id] <= 2) session.q.splice(Math.min(session.q.length, session.i + 4), 0, { id: it.id, kind: 'test', relearn: true });
  }
  const msg = {
    exact: '✓ מצוין!', accent: '✓ נכון! (שימו לב להטעמה)', typo: '≈ כמעט! שגיאת כתיב קטנה', wrong: given ? '✗ לא בדיוק' : 'זו התשובה:',
  }[result];
  $('#fb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">
    <div class="fb-title">${msg}</div>
    ${!ok && given && !mode.startsWith('mc') ? `<div class="small">כתבת: <span class="it strike">${esc(given)}</span></div>` : ''}
    <div class="it big">${tappable(it.it)} ${spk(it.it)}</div>
    <div class="he">${esc(it.he)}</div>
    ${it.ex ? `<div class="example"><div class="it">${tappable(it.ex)} ${spk(it.ex)}</div><div class="he muted small">${esc(it.exHe)}</div></div>` : ''}
    <div class="actions">
      ${!ok && given && !mode.startsWith('mc') ? '<button class="btn ghost" id="override">בעצם צדקתי</button>' : ''}
      <button class="btn big" id="next">המשך ←</button>
    </div></div>`;
  if (set().autoplay && mode !== 'listen') speak(it.it);
  else if (mode === 'listen' && set().autoplay && it.ex) speak(it.ex);
  const nb = $('#next');
  nb.focus({ preventScroll: true });
  $('#fb').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  nb.onclick = () => { session.i++; nextCard(); };
  const ov = $('#override');
  if (ov) ov.onclick = () => {
    // ביטול הכישלון: מחשבים מחדש כ"קשה"
    store.putCard(review(c.state ? c : newCard(it.id), 2, Date.now(), set().retention));
    session.correct++; session.wrong = session.wrong.filter((x) => x !== it.id);
    session.q = session.q.filter((x, k) => !(k > session.i && x.id === it.id && x.relearn));
    store.bump('correct');
    session.i++; nextCard();
  };
}

function finishSession() {
  const mins = Math.max(1, Math.round((Date.now() - session.start) / 60000));
  const acc = session.total ? Math.round((session.correct / session.total) * 100) : 100;
  const wrong = [...new Set(session.wrong)].map((id) => store.item(id)).filter(Boolean);
  view().innerHTML = `
  <div class="card center done-card">
    <div class="hero-flag">🎉</div>
    <h2>Bravissimo!</h2>
    <div class="stats-row">
      <div class="stat"><b>${session.total}</b><span>כרטיסים</span></div>
      <div class="stat"><b>${acc}%</b><span>הצלחה</span></div>
      <div class="stat"><b>${mins}</b><span>דקות</span></div>
    </div>
    <p class="muted small">${acc >= 95 ? 'קל מדי? אפשר להוסיף מילים חדשות ביום בהגדרות.' : acc < 75 ? 'קצת קשה – זה בסדר! הקושי הזה הוא בדיוק מה שמחזק את הזיכרון.' : 'רמת קושי מצוינת ללמידה.'}</p>
  </div>
  ${wrong.length ? `<div class="card"><h3>מילים לחיזוק</h3>${wrong.map((x) => `<div class="row"><span class="it">${esc(x.it)}</span>${spk(x.it)}<span class="he">${esc(x.he)}</span></div>`).join('')}</div>` : ''}
  <h3 class="sec">ועכשיו – להשתמש במילים</h3>
  <div class="grid2">
    <a class="card mini" href="#stories"><span class="emoji">🎧</span><b>סיפור קצר</b><small>עם המילים שלמדת</small></a>
    <a class="card mini" href="#chat"><span class="emoji">🗣️</span><b>שיחה</b><small>לדבר ולקבל תיקונים</small></a>
  </div>
  <div class="actions">${store.dueCards().length || store.pendingNewCount() ? '<a class="btn" href="#practice" id="again">שיעור נוסף</a>' : ''}<a class="btn ghost" href="#today">חזרה לדף הבית</a></div>`;
  const ag = $('#again'); if (ag) ag.onclick = (e) => { e.preventDefault(); routes.practice.render(); };
  session = null;
}

// ================= קורס =================
routes.course = {
  render() {
    const cur = store.currentUnitIndex();
    let head = '';
    view().innerHTML = `<header class="top"><h1>📚 הקורס</h1></header>
    <p class="muted">${UNITS.length} יחידות מ-A1 עד B2, לפי סדר שכיחות – מה שהכי שימושי קודם. כל יחידה: הסבר קצר בעברית + מילים ומשפטים שעוברים לתרגול היומי. ביחידות B1–B2 המורה מכינה את המילים (30 בכל פעם, אפשר להוסיף עוד).</p>
    <div class="units">${UNITS.map((u, i) => {
      const p = store.unitProgress(u);
      const pct = p.total ? Math.round((p.seen / p.total) * 100) : 0;
      if (i === 16) head = '<h3 class="sec">B1–B2</h3>';
      else head = '';
      const focus = set().focusUnit === u.id;
      return `${head}<a class="unit ${i === cur ? 'cur' : ''} ${p.total && p.seen === p.total ? 'complete' : ''}" href="#unit/${u.id}">
        <span class="num">${i + 1}</span>
        <div class="u-body"><b>${esc(u.he)}</b><small class="it">${esc(u.it)} · ${u.level}</small>
        <div class="track"><i style="width:${pct}%"></i></div></div>
        <span class="u-stat">${!p.total ? '✨' : p.known >= p.total ? '⭐' : p.seen === p.total ? '✓' : focus ? '🎯' : `${p.seen}/${p.total}`}</span></a>`;
    }).join('')}</div>`;
  },
};

routes.unit = {
  tab: 'course',
  render(id) {
    const u = UNITS.find((x) => x.id === id) || UNITS[0];
    const p = store.unitProgress(u);
    const focus = set().focusUnit === u.id;
    view().innerHTML = `
    <header class="top"><a href="#course" class="back">→</a><div><h1>${esc(u.he)}</h1><div class="it muted">${esc(u.it)} · ${u.level}</div></div></header>
    <div class="card grammar">${u.grammar}
      <div class="ask-box">
        <p class="small muted">יש שאלה? שאלו את המורה (בעברית):</p>
        <div class="inp-row"><input id="q" placeholder="למשל: מתי משתמשים ב-lo ומתי ב-il?"><button class="btn" id="ask">שאל</button></div>
        <div id="ans-out"></div>
      </div>
    </div>
    <div class="card">
      <div class="row-between"><h3>מילים וביטויים (${p.seen}/${p.total} נלמדו)</h3>${spk(u.items.map((x) => x[0]).join('. '))}</div>
      ${u.gen && !u.items.length ? `<p class="muted">המורה תכין את המילים השכיחות והשימושיות ביותר ליחידה הזו (עם משפטי דוגמה שמתרגלים את הדקדוק שלה).</p>` : ''}
      ${u.items.map((x, i) => {
        const c = store.card(`${u.id}.${i}`);
        const mark = isKnown(c) ? '⭐' : isSeen(c) ? '✓' : '';
        return `<div class="word-row"><div><span class="it">${esc(x[0])}</span> <span class="mark">${mark}</span><div class="he small">${esc(x[1])}</div></div>${spk(x[0])}</div>`;
      }).join('')}
    </div>
    <div class="actions col">
      ${u.gen ? `<button class="btn ${u.items.length ? 'ghost' : 'big'}" id="genu">${u.items.length ? '+ עוד 30 מילים ליחידה' : '✨ הכן את מילות היחידה'}</button><div id="genout"></div>` : ''}
      ${p.seen < p.total ? `<button class="btn big" id="focus">${focus ? '🎯 היחידה הזו בפוקוס' : 'ללמוד את היחידה הזו עכשיו'}</button>` : ''}
      <a class="btn ghost" href="#practice">לתרגול</a>
    </div>`;
    const gu = $('#genu');
    if (gu) gu.onclick = async () => {
      if (!ai.hasKey()) { $('#genout').innerHTML = noKeyCard('הכנת מילים ליחידות B1–B2'); return; }
      gu.disabled = true; $('#genout').innerHTML = spinner('מכינה 30 מילים… (כ-30 שניות)');
      try {
        const items = await ai.generateUnitWords(u, [...store.allItems().values()].map((x) => x.it), 30);
        const n = store.addUnitWords(u.id, items);
        toast(`נוספו ${n} מילים`); routes.unit.render(u.id);
      } catch (e) { $('#genout').innerHTML = errBox(e); gu.disabled = false; }
    };
    const f = $('#focus');
    if (f) f.onclick = () => { store.setSetting('focusUnit', u.id); toast('המילים החדשות בתרגול יגיעו מהיחידה הזו'); go('#practice'); };
    $('#ask').onclick = async () => {
      const q = $('#q').value.trim(); if (!q) return;
      const out = $('#ans-out');
      if (!ai.hasKey()) { out.innerHTML = noKeyCard('מענה לשאלות'); return; }
      out.innerHTML = spinner();
      try {
        const r = await ai.askTutor(q, `Unit: ${u.it} – ${u.he}`);
        out.innerHTML = renderAnswer(r);
      } catch (e) { out.innerHTML = errBox(e); }
    };
  },
};

const renderAnswer = (r) => `<div class="answer"><p>${esc(r.answer_he)}</p>${(r.examples || []).map((x) => `<div class="ex-line"><span class="it">${tappable(x.it)}</span>${spk(x.it)}<div class="he small muted">${esc(x.he)}</div></div>`).join('')}</div>`;

// ================= שיחה =================
let chat = null;

routes.chat = {
  render(id) {
    if (id) return openChat(id);
    const ui = store.currentUnitIndex();
    view().innerHTML = `<header class="top"><h1>🗣️ שיחה עם המורה</h1></header>
    <p class="muted">שיחות קצרות במצבים אמיתיים. המורה (ג'וליה) מדברת ברמה שלך, מתקנת בעדינות ומסבירה בעברית. אפשר להקליד או לדבר.</p>
    ${!ai.hasKey() ? noKeyCard('השיחה') : ''}
    <div class="scen-list">${SCENARIOS.map((s) => `
      <a class="scen ${s.minUnit > ui + 1 ? 'later' : ''}" href="#chat/${s.id}">
        <span class="emoji">${s.icon}</span><div><b>${esc(s.he)}</b><small class="it">${esc(s.it)}</small>
        ${s.minUnit > ui + 1 ? `<small class="muted">מומלץ אחרי יחידה ${s.minUnit}</small>` : ''}</div></a>`).join('')}
    </div>
    <div class="card"><h3>❓ שאלה חופשית למורה</h3>
      <div class="inp-row"><input id="q" placeholder="איך אומרים…? מה ההבדל בין…?"><button class="btn" id="ask">שאל</button></div><div id="ans-out"></div></div>`;
    $('#ask').onclick = async () => {
      const q = $('#q').value.trim(); if (!q) return;
      const out = $('#ans-out');
      if (!ai.hasKey()) { out.innerHTML = noKeyCard('מענה לשאלות'); return; }
      out.innerHTML = spinner();
      try { out.innerHTML = renderAnswer(await ai.askTutor(q)); } catch (e) { out.innerHTML = errBox(e); }
    };
  },
};

function openChat(id) {
  const sc = SCENARIOS.find((s) => s.id === id) || SCENARIOS[0];
  if (!chat || chat.sc.id !== sc.id) chat = { sc, history: [], turns: [], corrections: [] };
  view().innerHTML = `
  <div class="chat-wrap">
    <header class="chat-head"><a href="#chat" class="back">→</a><span class="emoji">${sc.icon}</span><div><b>${esc(sc.he)}</b><small class="it">${esc(sc.it)}</small></div>
      <button class="icon-btn" id="voice" title="השמעה אוטומטית">${set().speakAnswers ? '🔊' : '🔇'}</button>
      <button class="icon-btn" id="endchat" title="סיום">🏁</button></header>
    <div class="msgs" id="msgs"></div>
    <div class="composer">
      ${accentBar()}
      <div class="inp-row">
        ${sttAvailable() ? '<button class="icon-btn mic-btn" id="cmic" aria-label="דבר">🎙️</button>' : ''}
        <textarea id="cin" class="accent-target" lang="it" dir="auto" rows="1" placeholder="Scrivi in italiano…" autocapitalize="sentences" autocorrect="off" spellcheck="false"></textarea>
        <button class="btn send" id="csend" aria-label="שלח">➤</button>
      </div>
    </div>
  </div>`;
  if (!ai.hasKey()) { $('#msgs').innerHTML = noKeyCard('השיחה'); return; }
  drawMsgs();
  if (!chat.turns.length) aiTurn();
  const cin = $('#cin');
  const send = () => {
    const t = cin.value.trim(); if (!t || chat.busy) return;
    cin.value = ''; cin.style.height = '';
    chat.history.push({ role: 'user', content: t });
    chat.turns.push({ who: 'me', text: t });
    store.bump('chat');
    drawMsgs(); aiTurn();
  };
  $('#csend').onclick = send;
  cin.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  cin.oninput = () => { cin.style.height = 'auto'; cin.style.height = Math.min(120, cin.scrollHeight) + 'px'; };
  $('#voice').onclick = () => { store.setSetting('speakAnswers', !set().speakAnswers); $('#voice').textContent = set().speakAnswers ? '🔊' : '🔇'; };
  $('#endchat').onclick = endChat;
  const m = $('#cmic');
  if (m) m.onclick = async () => {
    if (m.classList.contains('rec')) { listen.stop?.(); return; }
    m.classList.add('rec');
    try { const r = await listen({ onInterim: (x) => { cin.value = x; } }); if (r) cin.value = r; } catch { toast('המיקרופון לא זמין בדפדפן הזה'); }
    m.classList.remove('rec');
    cin.focus();
  };
}

async function aiTurn() {
  chat.busy = true;
  const box = $('#msgs');
  box.insertAdjacentHTML('beforeend', `<div class="msg ai pending" id="pend">${spinner('')}</div>`);
  box.scrollTop = box.scrollHeight;
  // שולחים רק את 20 ההודעות האחרונות כדי לשמור על עלות נמוכה
  let hist = chat.history.slice(-20);
  if (hist[0]?.role === 'assistant') hist = hist.slice(1);
  if (!hist.length || hist[0].role !== 'user') hist = [{ role: 'user', content: '(Inizia tu la conversazione)' }, ...hist];
  try {
    const r = await ai.chatTurn(chat.sc, hist);
    if (!chat.history.length) chat.history.push({ role: 'user', content: '(Inizia tu la conversazione)' });
    chat.history.push({ role: 'assistant', content: JSON.stringify({ reply: r.reply }) });
    // התיקונים שייכים להודעה האחרונה של הלומד
    const lastMe = [...chat.turns].reverse().find((t) => t.who === 'me');
    if (lastMe && r.corrections?.length) { lastMe.corrections = r.corrections; chat.corrections.push(...r.corrections); }
    chat.turns.push({ who: 'ai', text: r.reply, he: r.reply_he, hint: r.hint_he, words: r.new_words || [] });
    if (set().speakAnswers) speak(r.reply);
  } catch (e) {
    chat.turns.push({ who: 'err', text: e.message });
    if (chat.history.at(-1)?.role === 'user' && chat.turns.length > 1) { /* המשתמש יכול לשלוח שוב */ }
  }
  chat.busy = false;
  if (location.hash.startsWith('#chat/')) drawMsgs();
}

function drawMsgs() {
  const box = $('#msgs'); if (!box) return;
  box.innerHTML = chat.turns.map((t, k) => {
    if (t.who === 'me') {
      return `<div class="msg me"><div class="it" dir="ltr">${esc(t.text)}</div>
      ${t.corrections?.length ? `<div class="corr">${t.corrections.map((c, j) => `
        <div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span> ${spk(c.right)}
        <div class="small">${esc(c.why_he)}</div>
        <button class="chip" data-addcorr="${k}:${j}">+ לתרגול</button></div>`).join('')}</div>` : ''}</div>`;
    }
    if (t.who === 'err') return `<div class="msg err">⚠️ ${esc(t.text)} <button class="chip" id="retry">נסו שוב</button></div>`;
    return `<div class="msg ai"><div class="it" dir="ltr">${tappable(t.text)}</div>
      <div class="msg-tools">${spk(t.text)}${spk(t.text, true)}
        <button class="chip" data-tr="${k}">תרגום</button>${t.hint ? `<button class="chip" data-hint="${k}">💡 רמז</button>` : ''}</div>
      <div class="he small tr" id="tr${k}" ${set().showTranslation ? '' : 'hidden'}>${esc(t.he)}</div>
      <div class="he small hint" id="hint${k}" hidden>💡 ${esc(t.hint || '')}</div>
      ${t.words?.length ? `<div class="words">${t.words.map((w, j) => `<button class="chip word" data-addw="${k}:${j}">+ <span class="it">${esc(w.it)}</span> = ${esc(w.he)}</button>`).join('')}</div>` : ''}
    </div>`;
  }).join('');
  box.scrollTop = box.scrollHeight;
  box.onclick = (e) => {
    const tr = e.target.closest('[data-tr]'); if (tr) { const el = $('#tr' + tr.dataset.tr); el.hidden = !el.hidden; return; }
    const h = e.target.closest('[data-hint]'); if (h) { const el = $('#hint' + h.dataset.hint); el.hidden = !el.hidden; return; }
    const aw = e.target.closest('[data-addw]');
    if (aw) {
      const [k, j] = aw.dataset.addw.split(':').map(Number); const w = chat.turns[k].words[j];
      store.addCustom({ it: w.it, he: w.he, ex: chat.turns[k].text, exHe: chat.turns[k].he, src: 'chat' });
      aw.outerHTML = `<span class="chip ok">✓ ${esc(w.it)}</span>`; return;
    }
    const ac = e.target.closest('[data-addcorr]');
    if (ac) {
      const [k, j] = ac.dataset.addcorr.split(':').map(Number); const c = chat.turns[k].corrections[j];
      store.addCustom({ it: c.right, he: c.why_he, ex: '', src: 'mistake' });
      ac.outerHTML = '<span class="chip ok">✓ נוסף</span>'; return;
    }
    if (e.target.id === 'retry') { chat.turns = chat.turns.filter((t) => t.who !== 'err'); drawMsgs(); aiTurn(); }
  };
}

function endChat() {
  const corr = chat?.corrections || [];
  const myTurns = chat?.turns.filter((t) => t.who === 'me').length || 0;
  sheet(`<div class="sheet-head"><b>🏁 סיכום השיחה</b><button class="icon-btn" data-close>✕</button></div>
    <p>אמרת <b>${myTurns}</b> משפטים באיטלקית. ${myTurns >= 6 ? 'כל הכבוד! 💪' : 'נסו להגיע ל-6+ משפטים בשיחה.'}</p>
    ${corr.length ? `<h4>נקודות לשיפור</h4>${corr.map((c) => `<div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span><div class="small">${esc(c.why_he)}</div></div>`).join('')}
      <button class="btn" id="addall">+ הוסף את כל התיקונים לתרגול</button>` : '<p class="ok">לא היו טעויות משמעותיות! 🎉</p>'}
    ${myTurns >= 5 ? '<button class="btn ghost" id="assess">📏 הערכת רמה לפי השיחה</button><div id="assout"></div>' : ''}
    <div class="actions"><button class="btn ghost" id="newchat">שיחה חדשה</button><a class="btn" href="#today">סיום</a></div>`);
  const as = $('#assess');
  if (as) as.onclick = async () => {
    as.disabled = true; $('#assout').innerHTML = spinner('מעריכה…');
    try {
      const r = await ai.assessLevel(chat.turns.filter((t) => t.who === 'me').map((t) => t.text));
      store.S().assessments = [...(store.S().assessments || []), { at: Date.now(), level: r.level }].slice(-30); store.save();
      $('#assout').innerHTML = `<div class="answer"><p class="big">רמה משוערת בדיבור: <b>${esc(r.level)}</b></p><p>👍 ${esc(r.strengths_he)}</p><p>🎯 ${esc(r.focus_he)}</p><p>➡️ ${esc(r.next_steps_he)}</p></div>`;
    } catch (e) { $('#assout').innerHTML = errBox(e); }
  };
  const aa = $('#addall');
  if (aa) aa.onclick = () => { corr.forEach((c) => store.addCustom({ it: c.right, he: c.why_he, src: 'mistake' })); aa.outerHTML = '<p class="ok">✓ נוספו לתרגול</p>'; };
  $('#newchat').onclick = () => { const id = chat.sc.id; chat = null; closeSheet(); openChat(id); };
}

// ================= סיפורים =================
const STORIES_KEY = 'italiano.stories';
const loadStories = () => { try { return JSON.parse(localStorage.getItem(STORIES_KEY) || '[]'); } catch { return []; } };
const saveStories = (a) => { try { localStorage.setItem(STORIES_KEY, JSON.stringify(a.slice(0, 15))); } catch { /* ignore */ } };

routes.stories = {
  render() {
    storyGloss = null;
    const list = loadStories();
    const lvi = ai.levelInfo().idx;
    const defLen = lvi >= 4 ? 'long' : lvi >= 2 ? 'medium' : 'short';
    let len = defLen;
    view().innerHTML = `<header class="top"><h1>🎧 קריאה והאזנה</h1></header>
    <p class="muted">סיפורים קצרים שנכתבים במיוחד בשבילך – רק עם מילים שכבר למדת ועוד כמה חדשות. לחצו על כל מילה לתרגום, האזינו, וחקו את הדובר.</p>
    ${!ai.hasKey() ? noKeyCard('יצירת סיפורים') : `
    <div class="card"><h3>סיפור חדש</h3>
      <div class="chips">${shuffle(STORY_TOPICS).slice(0, 6).map((t) => `<button class="chip" data-topic="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div class="inp-row"><input id="topic" placeholder="או נושא משלכם…"><button class="btn" id="gen">צור</button></div>
      <div class="seg small" id="slen">${[['short', 'קצר'], ['medium', 'בינוני'], ['long', 'ארוך']].map(([k, l]) => `<button data-l="${k}" class="${k === defLen ? 'on' : ''}">${l}</button>`).join('')}</div>
    </div>`}
    ${list.length ? `<h3 class="sec">הסיפורים שלי</h3><div class="story-list">${list.map((s, i) => `<a class="story-item" href="#story/${i}"><b class="it">${esc(s.title)}</b><small>${esc(s.title_he)}</small>${s.read ? '<i>✓</i>' : ''}</a>`).join('')}</div>` : ''}`;
    const gen = async (topic) => {
      view().innerHTML = spinner('כותבת לך סיפור… (כ-20 שניות)');
      try {
        const s = await ai.makeStory(topic, len);
        s.topic = topic; s.created = Date.now();
        const all = loadStories(); all.unshift(s); saveStories(all);
        go('#story/0');
      } catch (e) { view().innerHTML = errBox(e) + '<a class="btn ghost" href="#stories">חזרה</a>'; }
    };
    view().querySelectorAll('[data-topic]').forEach((b) => { b.onclick = () => gen(b.dataset.topic); });
    const sl = $('#slen');
    if (sl) sl.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; len = b.dataset.l; sl.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); };
    const g = $('#gen'); if (g) g.onclick = () => gen($('#topic').value.trim() || pick(STORY_TOPICS));
  },
};

routes.story = {
  tab: 'stories',
  render(idx) {
    const all = loadStories();
    const s = all[+idx || 0];
    if (!s) return go('#stories');
    storyGloss = s.glossary || [];
    view().innerHTML = `
    <header class="top"><a href="#stories" class="back">→</a><div><h1 class="it" dir="ltr">${esc(s.title)}</h1><div class="muted">${esc(s.title_he)}</div></div></header>
    <div class="player">
      <button class="btn" id="playall">▶ האזינו לכל הסיפור</button>
      <div class="seg small" id="spd"><button data-r="0.7">איטי</button><button data-r="0.9" class="on">רגיל</button></div>
      <button class="chip" id="alltr">הצג תרגום</button>
    </div>
    <p class="muted small">שיטה מומלצת: 1) האזינו בלי טקסט 2) קראו ולחצו על מילים לא מוכרות 3) האזינו שוב 4) חקו כל משפט 🎙️</p>
    <div class="story">${s.sentences.map((x, i) => `
      <div class="sent" id="s${i}">
        <div class="it" dir="ltr">${tappable(x.it)}</div>
        <div class="sent-tools">${spk(x.it)}${spk(x.it, true)}
          ${sttAvailable() ? `<button class="icon-btn" data-shadow="${i}" aria-label="חיקוי">🎙️</button>` : ''}
          <button class="chip" data-str="${i}">תרגום</button></div>
        <div class="he small tr" id="st${i}" hidden>${esc(x.he)}</div>
        <div class="shadow-out" id="sh${i}"></div>
      </div>`).join('')}</div>
    <div class="card"><h3>❓ בדקו הבנה</h3>${(s.questions || []).map((q, qi) => `
      <div class="q"><p class="it" dir="ltr">${tappable(q.q)}</p><div class="options">${q.options.map((o, oi) => `<button class="opt it" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
    </div>
    <div class="actions"><button class="btn big" id="sdone">סיימתי ✓</button></div>`;

    let rate = 0.9;
    $('#spd').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; rate = +b.dataset.r; $('#spd').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); };
    let playing = false;
    $('#playall').onclick = () => {
      if (playing) { playing = false; stopSpeaking(); $('#playall').textContent = '▶ האזינו לכל הסיפור'; return; }
      playing = true; $('#playall').textContent = '⏸ עצור';
      const step = (i) => {
        document.querySelectorAll('.sent').forEach((el) => el.classList.remove('active'));
        if (!playing || i >= s.sentences.length) { playing = false; $('#playall') && ($('#playall').textContent = '▶ האזינו לכל הסיפור'); return; }
        const el = $('#s' + i); el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        speak(s.sentences[i].it, { rate, onend: () => setTimeout(() => step(i + 1), 350) });
      };
      step(0);
    };
    $('#alltr').onclick = () => { const show = $('#st0')?.hidden; s.sentences.forEach((_, i) => { $('#st' + i).hidden = !show; }); };
    view().onclick = async (e) => {
      const t = e.target.closest('[data-str]'); if (t) { const el = $('#st' + t.dataset.str); el.hidden = !el.hidden; return; }
      const q = e.target.closest('[data-q]');
      if (q) {
        const qq = s.questions[+q.dataset.q]; const ok = +q.dataset.o === qq.answer;
        q.parentElement.querySelectorAll('button').forEach((b, bi) => { b.disabled = true; if (bi === qq.answer) b.classList.add('right'); });
        if (!ok) q.classList.add('wrong');
        return;
      }
      const sh = e.target.closest('[data-shadow]');
      if (sh) {
        const i = +sh.dataset.shadow; const target = s.sentences[i].it; const out = $('#sh' + i);
        speak(target, { rate, onend: async () => {
          sh.classList.add('rec'); out.innerHTML = '<span class="muted small">🎙️ עכשיו אתם…</span>';
          try {
            const heard = await listen();
            const r = compareWords(target, heard);
            out.innerHTML = `<div class="shadow-res"><span class="score ${r.score >= 80 ? 'good' : r.score >= 50 ? 'mid' : 'low'}">${r.score}%</span>
              <span dir="ltr">${r.marks.map((m) => `<span class="${m.ok ? 'hit' : 'miss'}">${esc(m.w)}</span>`).join(' ')}</span></div>
              ${heard ? '' : '<span class="muted small">לא נשמע כלום – נסו שוב קרוב יותר לטלפון.</span>'}`;
          } catch { out.innerHTML = '<span class="muted small">המיקרופון לא זמין.</span>'; }
          sh.classList.remove('rec');
        } });
      }
    };
    $('#sdone').onclick = () => {
      if (!s.read) { s.read = true; all[+idx || 0] = s; saveStories(all); store.bump('stories'); }
      toast('כל הכבוד! 📚');
      go('#today');
    };
  },
};

// ================= כתיבה =================
const WRITE_PROMPTS = [
  [0, 'הציגו את עצמכם: שם, מאיפה אתם, ואיך אתם מרגישים היום (2–3 משפטים).'],
  [2, 'תארו את המשפחה שלכם או חבר קרוב (3 משפטים).'],
  [5, 'מה אתם עושים בדרך כלל ביום רגיל? (3–4 משפטים עם פעלים ב-are)'],
  [6, 'אתם בבית קפה ברומא. כתבו מה אתם מזמינים ושאלו כמה זה עולה.'],
  [8, 'כתבו הודעה לחבר: מה אתם רוצים לעשות הערב ומה אתם לא יכולים לעשות.'],
  [9, 'תארו את הדרך מהבית שלכם לסופרמרקט הקרוב.'],
  [10, 'מה אתם אוהבים ומה אתם לא אוהבים? (אוכל, מקומות, עיסוקים)'],
  [11, 'תארו את השגרה שלכם בבוקר עם פעלים חוזרים (mi sveglio…).'],
  [12, 'מה עשיתם בסוף השבוע האחרון? (passato prossimo)'],
  [13, 'כתבו דיאלוג קצר בחנות בגדים.'],
  [14, 'ספרו על משהו שקרה לכם לאחרונה ואיך הרגשתם.'],
  [15, 'מה התוכניות שלכם לחופשה הבאה? (עתיד)'],
  [16, 'ספרו איך היו החיים שלכם כשהייתם ילדים (imperfetto, 5–6 משפטים).'],
  [17, 'ספרו סיפור מצחיק או מביך שקרה לכם בטיול (passato prossimo + imperfetto).'],
  [20, 'כתבו מייל מנומס לבעל דירה ב-Airbnb: בקשה, שאלה ותלונה קטנה (condizionale).'],
  [21, 'כתבו מתכון של מנה שאתם אוהבים (ציווי).'],
  [24, 'מה דעתכם על עבודה מהבית? יתרונות וחסרונות (penso che + congiuntivo, 8 משפטים).'],
  [25, 'מה הייתם עושים אילו הייתם גרים שנה באיטליה? (se + congiuntivo imperfetto)'],
  [27, 'קראו כותרת חדשות כלשהי וסכמו אותה ב-5 משפטים + דעה (si impersonale, discorso indiretto).'],
  [29, 'כתבו מאמר דעה קצר (150 מילים) על נושא חברתי שחשוב לכם, עם מילות קישור.'],
  [30, 'כתבו מכתב מוטיבציה למשרה באיטליה (150 מילים).'],
];

routes.write = {
  tab: 'today',
  render() {
    const ui = store.currentUnitIndex();
    const avail = WRITE_PROMPTS.filter((p) => p[0] <= ui);
    const prompt = avail[(new Date().getDate()) % avail.length][1];
    view().innerHTML = `<header class="top"><a href="#today" class="back">→</a><h1>✍️ כתיבה יומית</h1></header>
    ${!ai.hasKey() ? noKeyCard('תיקון הכתיבה') : ''}
    <div class="card"><p class="muted small">המשימה של היום:</p><p class="big" id="wp">${esc(prompt)}</p>
      <button class="chip" id="other">משימה אחרת</button></div>
    <textarea id="wtext" class="accent-target big-input" lang="it" dir="ltr" rows="6" placeholder="Scrivi qui… (אל תדאגו מטעויות – בשביל זה יש תיקון)" autocorrect="off" spellcheck="false"></textarea>
    ${accentBar()}
    <div class="actions"><button class="btn big" id="wcheck">בדיקה ותיקון</button></div>
    <div id="wout"></div>`;
    let cur = prompt;
    $('#other').onclick = () => { cur = pick(avail)[1]; $('#wp').textContent = cur; };
    $('#wcheck').onclick = async () => {
      const text = $('#wtext').value.trim();
      if (text.length < 3) return toast('כתבו לפחות משפט אחד');
      if (!ai.hasKey()) return toast('צריך מפתח AI');
      const out = $('#wout'); out.innerHTML = spinner('בודקת…');
      try {
        const r = await ai.correctWriting(cur, text);
        store.bump('writing');
        out.innerHTML = `<div class="card">
          <p class="ok">👏 ${esc(r.praise_he)}</p>
          <h4>הטקסט המתוקן</h4><p class="it" dir="ltr">${tappable(r.corrected)} ${spk(r.corrected)}</p>
          ${r.errors?.length ? `<h4>הטעויות (${r.errors.length})</h4>${r.errors.map((c, j) => `<div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span> ${spk(c.right)}<div class="small">${esc(c.why_he)}</div><button class="chip" data-we="${j}">+ לתרגול</button></div>`).join('')}` : '<p class="ok">אין טעויות! 🎉</p>'}
          <h4>🎯 הדבר הכי חשוב לשפר</h4><p>${esc(r.tip_he)}</p>
          <h4>✨ גרסה טבעית יותר</h4><p class="it" dir="ltr">${tappable(r.better_version)} ${spk(r.better_version)}</p>
          <p class="muted small">טיפ: קראו בקול את הגרסה הטבעית 2–3 פעמים.</p></div>`;
        out.onclick = (e) => {
          const b = e.target.closest('[data-we]'); if (!b) return;
          const c = r.errors[+b.dataset.we];
          store.addCustom({ it: c.right, he: c.why_he, src: 'mistake' });
          b.outerHTML = '<span class="chip ok">✓ נוסף</span>';
        };
      } catch (e) { out.innerHTML = errBox(e); }
    };
  },
};

// ================= עוד: התקדמות, מילים, הגדרות =================
routes.more = {
  render() {
    const v = store.vocabSummary();
    const days = [];
    for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push([d, store.S().stats[store.dayKey(d)] || {}]); }
    const max = Math.max(10, ...days.map(([, s]) => s.reviews || 0));
    const total = Object.values(store.S().stats).reduce((a, s) => ({ r: a.r + (s.reviews || 0), m: a.m + (s.seconds || 0), c: a.c + (s.chat || 0) }), { r: 0, m: 0, c: 0 });
    view().innerHTML = `<header class="top"><h1>📊 ההתקדמות שלי</h1></header>
    <div class="stats-row">
      <div class="stat"><b>🔥 ${store.streak()}</b><span>ימי רצף</span></div>
      <div class="stat"><b>${v.seen}</b><span>מילים שפגשת</span></div>
      <div class="stat"><b>${v.known}</b><span>יודע היטב</span></div>
    </div>
    <div class="stats-row">
      <div class="stat"><b>${Math.round(total.m / 60)}</b><span>דקות למידה</span></div>
      <div class="stat"><b>${total.r}</b><span>תרגולים</span></div>
      <div class="stat"><b>${total.c}</b><span>משפטים בשיחה</span></div>
    </div>
    <div class="card"><h3>14 הימים האחרונים</h3>
      <div class="bars">${days.map(([d, s]) => `<div class="bar ${store.activeDay(s) ? 'act' : ''}" title="${s.reviews || 0}"><i style="height:${Math.round(((s.reviews || 0) / max) * 100)}%"></i><small>${d.getDate()}</small></div>`).join('')}</div>
    </div>
    <div class="menu">
      <a href="#words">📝 המילים שלי + הוספת מילים לפי נושא</a>
      <a href="#settings">⚙️ הגדרות ומפתח AI</a>
      <a href="#help">❓ מדריך שימוש ושיטת הלימוד</a>
    </div>`;
  },
};

routes.words = {
  tab: 'more',
  render() {
    const custom = store.S().custom.slice().reverse();
    view().innerHTML = `<header class="top"><a href="#more" class="back">→</a><h1>📝 המילים שלי</h1></header>
    <div class="card"><h3>✨ מילים לפי נושא שמעניין אותך</h3>
      <p class="muted small">מילים שקשורות לחיים שלכם נזכרות טוב יותר. כתבו נושא (עבודה, תחביב, טיול…) והמורה תבחר את 10 המילים השימושיות ביותר.</p>
      <div class="inp-row"><input id="wt" placeholder="למשל: בישול, כדורגל, הייטק, טיול לטוסקנה"><button class="btn" id="wgen">צור</button></div>
      <div id="wgout"></div></div>
    <div class="card"><h3>➕ הוספה ידנית</h3>
      <input id="mit" lang="it" dir="ltr" placeholder="איטלקית" class="accent-target">
      <input id="mhe" placeholder="עברית">
      <button class="btn" id="madd">הוסף</button></div>
    <div class="card"><h3>חיפוש בכל המילים</h3><input id="srch" placeholder="חפשו באיטלקית או בעברית"><div id="sres"></div></div>
    ${custom.length ? `<div class="card"><h3>מילים שהוספתי (${custom.length})</h3>${custom.map((c) => `<div class="word-row"><div><span class="it">${esc(c.it)}</span><div class="he small">${esc(c.he)}</div></div>${spk(c.it)}<button class="icon-btn" data-del="${c.id}" aria-label="מחק">🗑</button></div>`).join('')}</div>` : ''}`;
    $('#wgen').onclick = async () => {
      const t = $('#wt').value.trim(); if (!t) return;
      const out = $('#wgout');
      if (!ai.hasKey()) { out.innerHTML = noKeyCard('יצירת מילים'); return; }
      out.innerHTML = spinner();
      try {
        const items = await ai.generateWords(t, 10);
        out.innerHTML = `${items.map((x, i) => `<label class="gen-row"><input type="checkbox" checked data-gi="${i}"><div><span class="it">${esc(x.it)}</span> – ${esc(x.he)}<div class="small muted it" dir="ltr">${esc(x.ex)}</div></div></label>`).join('')}
          <button class="btn" id="gadd">הוסף את המסומנות לתרגול</button>`;
        $('#gadd').onclick = () => {
          let n = 0;
          out.querySelectorAll('[data-gi]').forEach((cb) => { if (cb.checked) { store.addCustom({ ...items[+cb.dataset.gi], src: 'topic' }); n++; } });
          toast(`נוספו ${n} מילים – יופיעו בתרגול הבא`); routes.words.render();
        };
      } catch (e) { out.innerHTML = errBox(e); }
    };
    $('#madd').onclick = () => {
      const id = store.addCustom({ it: $('#mit').value, he: $('#mhe').value, src: 'manual' });
      if (id) { toast('נוסף!'); routes.words.render(); } else toast('מלאו את שני השדות');
    };
    $('#srch').oninput = () => {
      const q = $('#srch').value.trim().toLowerCase();
      if (q.length < 2) { $('#sres').innerHTML = ''; return; }
      const res = [...store.allItems().values()].filter((x) => x.it.toLowerCase().includes(q) || x.he.includes(q)).slice(0, 20);
      $('#sres').innerHTML = res.map((x) => {
        const c = store.card(x.id);
        return `<div class="word-row"><div><span class="it">${esc(x.it)}</span> ${isKnown(c) ? '⭐' : isSeen(c) ? '✓' : ''}<div class="he small">${esc(x.he)}</div></div>${spk(x.it)}</div>`;
      }).join('') || '<p class="muted">לא נמצא</p>';
    };
    view().querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => { if (confirm('למחוק את המילה?')) { store.removeCustom(b.dataset.del); routes.words.render(); } }; });
  },
};

routes.settings = {
  tab: 'more',
  render() {
    const s = set();
    const vs = italianVoices();
    const u = store.S().usage;
    view().innerHTML = `<header class="top"><a href="#more" class="back">→</a><h1>⚙️ הגדרות</h1></header>
    <div class="card"><h3>🔑 מורה AI (Claude)</h3>
      <p class="small muted">המפתח נשמר רק בטלפון הזה ונשלח רק ל-Anthropic. הוראות קבלת מפתח: <a href="#help">במדריך</a>.</p>
      <input id="key" type="password" dir="ltr" placeholder="sk-ant-…" value="${esc(s.apiKey)}" autocomplete="off">
      <div class="actions"><button class="btn ghost" id="showkey">הצג</button><button class="btn" id="savekey">שמירה ובדיקה</button></div>
      <div id="keyres"></div>
      <label class="lbl">מודל</label>
      <select id="model">${Object.entries(ai.MODELS).map(([id, m]) => `<option value="${id}" ${s.model === id ? 'selected' : ''}>${m.name}</option>`).join('')}</select>
      <p class="small muted">שימוש עד עכשיו: ${(u.inTok / 1000).toFixed(1)}K טוקנים נכנסים, ${(u.outTok / 1000).toFixed(1)}K יוצאים ≈ <b>$${u.usd.toFixed(3)}</b></p>
    </div>
    <div class="card"><h3>🧠 תרגול</h3>
      <label class="lbl">זמן לימוד ביום</label>
      <select id="dgoal">${GOALS.map((g) => `<option value="${g.min}" ${s.dailyGoal === g.min ? 'selected' : ''}>${g.label} – ${g.sub}</option>`).join('')}</select>
      <label class="lbl">מילים חדשות ביום: <b id="npdv">${s.newPerDay}</b></label>
      <input type="range" id="npd" min="0" max="60" step="1" value="${s.newPerDay}">
      <p class="small muted">כל מילה חדשה ≈ 6–8 חזרות בחודש הראשון. 35 ביום ≈ שעה של תרגול כרטיסיות ביום אחרי כמה שבועות.</p>
      <label class="lbl">יעד</label>
      <select id="target">
        <option value="" ${!store.S().plan ? 'selected' : ''}>בלי יעד – פשוט ללמוד</option>
        ${Object.entries(TARGETS).map(([k, t]) => `<option value="${k}" ${store.S().plan?.goal === k ? 'selected' : ''}>${k} – ${t.he}</option>`).join('')}
      </select>
      <p class="small muted" id="tgnote">${store.S().plan ? `בקצב של ${s.dailyGoal >= 60 ? Math.round(s.dailyGoal / 6) / 10 + ' שעות' : s.dailyGoal + ' דק\''} ביום: ${store.S().plan.goal} בעוד כ-${monthsText(planDays(store.S().plan.goal, s.dailyGoal))} מתחילת התוכנית.` : 'אפשר להגדיר יעד בכל שלב.'}</p>
      <label class="lbl">רמת זכירה רצויה: <b id="retv">${Math.round(s.retention * 100)}%</b></label>
      <input type="range" id="ret" min="80" max="95" step="1" value="${Math.round(s.retention * 100)}">
      <p class="small muted">90% מומלץ. גבוה יותר = יותר חזרות ביום.</p>
      ${s.focusUnit ? `<p class="small">🎯 יחידה בפוקוס: ${esc(UNITS.find((x) => x.id === s.focusUnit)?.he || '')} <button class="chip" id="unfocus">בטל</button></p>` : ''}
    </div>
    <div class="card"><h3>🔊 קול</h3>
      ${ttsAvailable() ? `
      <label class="lbl">קול איטלקי</label>
      <select id="voice"><option value="">אוטומטי</option>${vs.map((v) => `<option ${s.voice === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>
      ${!vs.length ? '<p class="small warn-text">לא נמצא קול איטלקי במכשיר. ראו במדריך איך להוריד אחד (חינם).</p>' : ''}
      <label class="lbl">מהירות דיבור: <b id="ratev">${s.rate}</b></label>
      <input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${s.rate}">
      <button class="btn ghost" data-say="Ciao! Come stai? Benvenuto nella tua app di italiano.">בדיקת קול</button>` : '<p>הדפדפן לא תומך בהקראה.</p>'}
      <label class="check"><input type="checkbox" id="autoplay" ${s.autoplay ? 'checked' : ''}> השמעה אוטומטית בתרגול</label>
      <label class="check"><input type="checkbox" id="showtr" ${s.showTranslation ? 'checked' : ''}> להציג תרגום בשיחה מראש</label>
      <p class="small muted">זיהוי דיבור: ${sttAvailable() ? '✓ זמין' : '✗ לא זמין בדפדפן הזה (אפשר להקליד, או להשתמש בהכתבה של המקלדת)'}</p>
    </div>
    <div class="card"><h3>⏰ תזכורת יומית</h3>
      <p class="small muted">מוסיף אירוע חוזר ליומן הטלפון עם התראה – הדרך הכי אמינה ובלי עלות.</p>
      <div class="inp-row"><input type="time" id="remt" value="${s.reminder}"><button class="btn" id="ics">הוסף ליומן</button></div>
    </div>
    <div class="card"><h3>💾 גיבוי</h3>
      <p class="small muted">ההתקדמות נשמרת בטלפון. מומלץ לגבות פעם בחודש (או לפני החלפת טלפון).</p>
      <div class="actions"><button class="btn ghost" id="exp">שמירת קובץ גיבוי</button><label class="btn ghost">טעינת גיבוי<input type="file" id="imp" accept=".json,application/json" hidden></label></div>
      <button class="btn danger ghost" id="reset">איפוס מלא</button>
    </div>`;
    $('#showkey').onclick = () => { const k = $('#key'); k.type = k.type === 'password' ? 'text' : 'password'; };
    $('#savekey').onclick = async () => {
      store.setSetting('apiKey', $('#key').value.trim());
      const out = $('#keyres');
      if (!set().apiKey) { out.innerHTML = '<p class="muted">המפתח נמחק.</p>'; return; }
      out.innerHTML = spinner('בודק…');
      try { const r = await ai.testKey(); out.innerHTML = `<p class="ok">✓ עובד! המורה אומרת: <span class="it">${esc(r.msg)}</span></p>`; } catch (e) { out.innerHTML = errBox(e); }
    };
    $('#model').onchange = (e) => store.setSetting('model', e.target.value);
    $('#dgoal').onchange = (e) => {
      const g = GOALS.find((x) => x.min === +e.target.value);
      store.setSetting('dailyGoal', g.min); store.setSetting('newPerDay', g.npd);
      const pl = store.S().plan;
      if (pl) { pl.days = planDays(pl.goal, g.min); store.save(); } // משנים קצב – לא מאפסים את ההתקדמות
      routes.settings.render();
    };
    $('#target').onchange = (e) => {
      const goal = e.target.value;
      if (!goal) store.S().plan = null;
      else if (store.S().plan) { store.S().plan.goal = goal; store.S().plan.days = planDays(goal, set().dailyGoal); }
      else store.setPlan(planDays(goal, set().dailyGoal), goal);
      store.save(); routes.settings.render();
    };
    $('#npd').oninput = (e) => { $('#npdv').textContent = e.target.value; store.setSetting('newPerDay', +e.target.value); };
    $('#ret').oninput = (e) => { $('#retv').textContent = e.target.value + '%'; store.setSetting('retention', +e.target.value / 100); };
    const uf = $('#unfocus'); if (uf) uf.onclick = () => { store.setSetting('focusUnit', ''); routes.settings.render(); };
    const vSel = $('#voice'); if (vSel) vSel.onchange = (e) => { store.setSetting('voice', e.target.value); speak('Ciao, come stai?'); };
    const r = $('#rate'); if (r) r.oninput = (e) => { $('#ratev').textContent = e.target.value; store.setSetting('rate', +e.target.value); };
    $('#autoplay').onchange = (e) => store.setSetting('autoplay', e.target.checked);
    $('#showtr').onchange = (e) => store.setSetting('showTranslation', e.target.checked);
    $('#ics').onclick = () => { store.setSetting('reminder', $('#remt').value || '20:00'); downloadICS(set().reminder); };
    $('#exp').onclick = () => download(`italiano-backup-${store.dayKey()}.json`, store.exportJSON(), 'application/json');
    $('#imp').onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { store.importJSON(await f.text()); toast('הגיבוי נטען ✓'); go('#today'); } catch { toast('הקובץ לא תקין'); }
    };
    $('#reset').onclick = () => {
      if (confirm('למחוק את כל ההתקדמות? (מומלץ לגבות קודם)') && confirm('בטוח? אין דרך חזרה.')) { store.resetAll(); localStorage.removeItem(STORIES_KEY); go('#today'); }
    };
  },
};

function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function downloadICS(time) {
  const [hh, mm] = time.split(':');
  const d = new Date(); d.setDate(d.getDate() + 1);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const url = location.href.split('#')[0];
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Italiano//HE', 'BEGIN:VEVENT',
    `UID:italiano-daily-${Date.now()}@app`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${ymd}T${hh}${mm}00`, `DURATION:PT20M`, 'RRULE:FREQ=DAILY',
    'SUMMARY:🇮🇹 איטלקית – 15 דקות', `DESCRIPTION:תרגול יומי + שיחה קצרה. ${url}`, `URL:${url}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:זמן לאיטלקית!', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  download('italiano-reminder.ics', ics, 'text/calendar');
  toast('פתחו את הקובץ כדי להוסיף ליומן');
}

routes.resources = {
  tab: 'today',
  async render() {
    view().innerHTML = `<header class="top"><a href="#today" class="back">→</a><h1>📺 האזנה וצפייה</h1></header><div class="card help" id="resc">${spinner('טוען…')}</div>`;
    try { $('#resc').innerHTML = await (await fetch('resources.html')).text(); } catch { $('#resc').innerHTML = '<p>לא זמין במצב לא מקוון.</p>'; }
    $('#resc').insertAdjacentHTML('beforeend', `<h3>רישום זמן</h3>${externalCard(store.today())}`);
  },
};

routes.help = {
  tab: 'more',
  async render() {
    view().innerHTML = `<header class="top"><a href="#more" class="back">→</a><h1>❓ מדריך</h1></header><div class="card help" id="helpc">${spinner('טוען…')}</div>`;
    try {
      const r = await fetch('help.html');
      $('#helpc').innerHTML = await r.text();
    } catch { $('#helpc').innerHTML = '<p>המדריך לא זמין כרגע במצב לא מקוון.</p>'; }
  },
};

// ================= מדידת זמן למידה =================
let lastAct = Date.now();
['click', 'keydown', 'touchstart'].forEach((ev) => document.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true }));
setInterval(() => {
  const r = document.body.dataset.route;
  const learning = ['practice', 'chat', 'story', 'write', 'unit'].includes(r);
  if (learning && document.visibilityState === 'visible' && Date.now() - lastAct < 90000) store.bump('seconds', 15);
}, 15000);

// ================= הפעלה =================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => { /* ignore */ });
}
render();
