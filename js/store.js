// שמירת כל ההתקדמות במכשיר (localStorage) – בלי שרת, בלי עלות.
import { UNITS } from './data.js';
import { newCard, isDue, isKnown, isSeen } from './srs.js';

const KEY = 'italiano.v1';

const DEFAULTS = {
  cards: {},          // id -> כרטיס FSRS
  custom: [],         // פריטים שנוספו מהשיחות/סיפורים/AI
  unitWords: {},      // יחידות B1–B2: id -> [[it, he, ex, exHe], ...] (נוצרו ע"י ה-AI)
  plan: null,         // { start, days, goal } – תוכנית אינטנסיבית
  ctxLines: [],       // משפטים שהלומד פגש בסיפורים ובשיחות (החדשים קודם) – משמשים בכרטיסיות
  stats: {},          // 'YYYY-MM-DD' -> { reviews, correct, newWords, chat, stories, writing, minutes }
  settings: {
    apiKey: '',
    model: 'claude-haiku-5-5',
    newPerDay: 10,
    dailyGoal: 15,      // דקות ביום
    retention: 0.9,
    rate: 0.95,
    voice: '',
    autoplay: true,
    speakAnswers: true,
    showTranslation: false,
    focusUnit: '',
    reminder: '20:00',
  },
  usage: { inTok: 0, outTok: 0, usd: 0 },
  onboarded: false,
  lastWritingPrompt: '',
};

let state = load();
hydrateUnits();

// מכניסים את המילים שנוצרו ליחידות המתקדמות
function hydrateUnits() {
  UNITS.forEach((u) => { if (u.gen) u.items = state.unitWords[u.id] || []; });
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const s = JSON.parse(raw);
    return { ...structuredClone(DEFAULTS), ...s, settings: { ...DEFAULTS.settings, ...(s.settings || {}) }, usage: { ...DEFAULTS.usage, ...(s.usage || {}) }, unitWords: s.unitWords || {}, ctxLines: s.ctxLines || [] };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function addUnitWords(unitId, items) {
  const have = new Set([...allItems().values()].map((x) => x.it.toLowerCase()));
  const list = state.unitWords[unitId] || (state.unitWords[unitId] = []);
  let n = 0;
  for (const x of items) {
    const it = (x.it || '').trim();
    if (!it || !x.he || have.has(it.toLowerCase())) continue;
    have.add(it.toLowerCase());
    list.push([it, x.he.trim(), x.ex || '', x.exHe || '']);
    n++;
  }
  hydrateUnits();
  itemCache = null;
  save();
  return n;
}

// כמה מילים חדשות זמינות עדיין (בלי ליצור עוד)
export function pendingNewCount() {
  return nextNewItems(100000).length;
}

// היחידה המתקדמת הבאה שעוד אין לה מילים (או האחרונה שהתחלנו, להרחבה)
export function nextUnitToGenerate() {
  return UNITS.find((u) => u.gen && !(state.unitWords[u.id] || []).length) || null;
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn(e); }
}

export const S = () => state;
export const settings = () => state.settings;

export function setSetting(k, v) { state.settings[k] = v; save(); }

// ---------- פריטים ----------
let itemCache = null;
export function allItems() {
  if (itemCache) return itemCache;
  const map = new Map();
  UNITS.forEach((u, ui) => u.items.forEach((it, i) => {
    const id = `${u.id}.${i}`;
    map.set(id, { id, unit: u.id, unitIdx: ui, it: it[0], he: it[1], ex: it[2] || '', exHe: it[3] || '' });
  }));
  state.custom.forEach((c) => map.set(c.id, { ...c, unit: 'custom', unitIdx: 99 }));
  itemCache = map;
  return map;
}
export const item = (id) => allItems().get(id);

// raw = נאסף מתוך שיחה/סיפור וממתין שהמורה תהפוך אותו לכרטיס נקי (ראו enrichPending באפליקציה)
export function addCustom({ it, he, ex = '', exHe = '', src = 'ai', raw = false, form = '', wrong = '', note = '' }) {
  it = (it || '').trim(); he = (he || '').trim();
  if (!it || !he) return null;
  const exists = [...allItems().values()].find((x) => x.it.toLowerCase() === it.toLowerCase());
  if (exists) {
    if (!state.cards[exists.id]) { state.cards[exists.id] = { ...newCard(exists.id), src }; save(); }
    return exists.id;
  }
  const id = `c.${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  state.custom.push({ id, it, he, ex, exHe, src, raw, form, wrong, note, created: Date.now() });
  state.cards[id] = newCard(id);
  itemCache = null;
  save();
  return id;
}

export const pendingRaw = () => state.custom.filter((c) => c.raw);

// עדכון כרטיס אחרי שהמורה ניקתה אותו. אם יצא כפול של מילה קיימת – מאחדים
export function updateCustom(id, fields) {
  const c = state.custom.find((x) => x.id === id);
  if (!c) return;
  const it = (fields.it || c.it).trim();
  const dup = [...allItems().values()].find((x) => x.id !== id && x.it.toLowerCase() === it.toLowerCase());
  if (dup) {
    const card = state.cards[id];
    removeCustom(id);
    if (!state.cards[dup.id] && card) state.cards[dup.id] = { ...card, id: dup.id };
    save();
    return;
  }
  Object.assign(c, fields, { it, raw: false });
  itemCache = null;
  save();
}

export function deleteCard(id) { delete state.cards[id]; save(); }

// ---------- משפטים מההקשר של הלומד ----------
export function addContext(lines) {
  const have = new Set(state.ctxLines.map((l) => l.it));
  const fresh = lines.filter((l) => l.it && l.he && l.it.length <= 220 && !have.has(l.it)).map((l) => ({ ...l, t: Date.now() }));
  if (!fresh.length) return;
  state.ctxLines = [...fresh.reverse(), ...state.ctxLines].slice(0, 600);
  save();
}
export const ctxLines = () => state.ctxLines;

export function removeCustom(id) {
  state.custom = state.custom.filter((c) => c.id !== id);
  delete state.cards[id];
  itemCache = null;
  save();
}

// ---------- כרטיסים ----------
export const card = (id) => state.cards[id];
export function putCard(c) { state.cards[c.id] = c; save(); }

export function dueCards(now = Date.now()) {
  return Object.values(state.cards).filter((c) => isDue(c, now) && item(c.id)).sort((a, b) => a.due - b.due);
}

// מילים חדשות לשיעור: קודם כאלה שהמשתמש שמר בעצמו (רלוונטיות אישית), אחר כך לפי סדר הקורס
export function nextNewItems(n) {
  const out = [];
  // קודם מה שהלומד פגש בעצמו (תיקונים, מילים שבדק בסיפור/שיחה), אחר כך מילים לפי נושא, ואז הקורס
  const rank = (id) => ({ mistake: 0, tap: 1, chat: 1, story: 1 }[state.cards[id]?.src || item(id)?.src] ?? 2);
  const pendingCustom = Object.values(state.cards).filter((c) => c.state === 'new' && item(c.id))
    .sort((a, b) => (rank(a.id) - rank(b.id)) || (a.added - b.added));
  for (const c of pendingCustom) { if (out.length >= n) break; out.push(c.id); }
  const focus = state.settings.focusUnit;
  const order = focus ? [UNITS.find((u) => u.id === focus), ...UNITS.filter((u) => u.id !== focus)] : UNITS;
  for (const u of order) {
    if (!u) continue;
    for (let i = 0; i < u.items.length && out.length < n; i++) {
      const id = `${u.id}.${i}`;
      if (!state.cards[id]) out.push(id);
    }
    if (out.length >= n) break;
  }
  return out;
}

export function newIntroducedToday() {
  return today().newWords || 0;
}

export function unitProgress(u) {
  let seen = 0, known = 0;
  u.items.forEach((_, i) => {
    const c = state.cards[`${u.id}.${i}`];
    if (isSeen(c)) seen++;
    if (isKnown(c)) known++;
  });
  return { seen, known, total: u.items.length };
}

// היחידה הנוכחית = הראשונה שעדיין לא הותחלה במלואה
export function currentUnitIndex() {
  for (let i = 0; i < UNITS.length; i++) {
    const p = unitProgress(UNITS[i]);
    if (p.seen < p.total || p.total === 0) return i;
  }
  return UNITS.length - 1;
}

export function vocabSummary() {
  const cards = Object.values(state.cards);
  return {
    seen: cards.filter(isSeen).length,
    known: cards.filter(isKnown).length,
  };
}

// אוצר המילים שהלומד כבר פגש – נשלח ל-AI כדי שידבר ברמה שלו (קלט מובן)
export function learnedWordList(max = 300) {
  return Object.values(state.cards).filter(isSeen)
    .sort((a, b) => b.s - a.s).slice(0, max)
    .map((c) => item(c.id)?.it).filter(Boolean);
}

export function weakItems(max = 8) {
  return Object.values(state.cards).filter((c) => isSeen(c) && item(c.id))
    .sort((a, b) => (b.lapses - a.lapses) || (a.s - b.s)).slice(0, max).map((c) => item(c.id));
}

// ---------- סטטיסטיקה ----------
export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function today() {
  const k = dayKey();
  if (!state.stats[k]) state.stats[k] = { reviews: 0, correct: 0, newWords: 0, chat: 0, stories: 0, writing: 0, seconds: 0, external: 0 };
  return state.stats[k];
}

export function bump(field, n = 1) { today()[field] = (today()[field] || 0) + n; save(); }

export function activeDay(s) {
  return s && (s.reviews >= 10 || s.chat >= 4 || s.stories >= 1 || s.writing >= 1 || s.external >= 15);
}

export function streak() {
  let n = 0;
  const d = new Date();
  if (!activeDay(state.stats[dayKey(d)])) d.setDate(d.getDate() - 1); // היום עוד לא נגמר
  while (activeDay(state.stats[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function addUsage(inTok, outTok, usd) {
  state.usage.inTok += inTok; state.usage.outTok += outTok; state.usage.usd += usd; save();
}

// ---------- גיבוי ----------
export function exportJSON() {
  // המפתח הסודי לא נכלל בקובץ הגיבוי
  return JSON.stringify({ ...state, settings: { ...state.settings, apiKey: '' } }, null, 1);
}
export function importJSON(text) {
  const s = JSON.parse(text);
  if (!s || typeof s !== 'object' || !s.cards) throw new Error('bad file');
  const keepKey = state.settings.apiKey;
  state = { ...structuredClone(DEFAULTS), ...s, settings: { ...DEFAULTS.settings, ...(s.settings || {}) }, unitWords: s.unitWords || {} };
  if (!state.settings.apiKey) state.settings.apiKey = keepKey;
  hydrateUnits();
  itemCache = null;
  save();
}
export function resetAll() { localStorage.removeItem(KEY); state = structuredClone(DEFAULTS); hydrateUnits(); itemCache = null; }

// ---------- תוכנית אינטנסיבית ----------
export const studiedHours = () => Object.values(state.stats).reduce((a, x) => a + (x.seconds || 0), 0) / 3600;
// התוכנית מתחילה מהיום, עם "נקודת פתיחה" – כך היעדים היומיים מחושבים רק על מה שנשאר
export function setPlan(days, goal) {
  state.plan = { start: Date.now(), days, goal, baseHours: studiedHours(), baseWords: vocabSummary().seen };
  save();
}
export function planStatus() {
  if (!state.plan) return null;
  const day = Math.floor((Date.now() - state.plan.start) / 86400000) + 1;
  const total = Object.values(state.stats).reduce((a, x) => a + (x.seconds || 0), 0) / 3600;
  return { ...state.plan, day: Math.min(day, state.plan.days), hours: total };
}
