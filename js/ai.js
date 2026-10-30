// שכבת ה-AI: קריאה ישירה מהדפדפן ל-Claude API עם המפתח של המשתמש (נשמר רק במכשיר).
// ברירת המחדל Claude Haiku 5.5 – הזול ביותר ($0.10 / $0.50 למיליון טוקנים): שימוש יומי ≈ סנטים בחודש.
import Anthropic from '../vendor/anthropic-sdk-1.3.0.js';
import { settings, addUsage, learnedWordList, currentUnitIndex, vocabSummary, weakItems } from './store.js';
import { UNITS } from './data.js';

export const MODELS = {
  'claude-haiku-5-5': { name: 'Claude Haiku 5.5 (מומלץ – זול מאוד)', in: 0.10, out: 0.50, effort: 'low' },
  'claude-sonnet-5-5': { name: 'Claude Sonnet 5.5 (איכות גבוהה, פי 20 יקר)', in: 2, out: 10, effort: 'low' },
  'claude-opus-5-5': { name: 'Claude Opus 5.5 (הכי חכם, פי 40 יקר)', in: 4, out: 20, effort: 'low' },
};

export const hasKey = () => !!settings().apiKey;

let client = null, clientKey = '';
function getClient() {
  const key = settings().apiKey;
  if (!key) throw new AIError('nokey', 'צריך להגדיר מפתח API בהגדרות כדי להשתמש במורה ה-AI.');
  if (!client || clientKey !== key) {
    client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2, timeout: 90000 });
    clientKey = key;
  }
  return client;
}

export class AIError extends Error {
  constructor(code, msg) { super(msg); this.code = code; }
}

function friendlyError(e) {
  if (e instanceof AIError) return e;
  if (e instanceof Anthropic.AuthenticationError) return new AIError('auth', 'המפתח לא תקין. בדקו אותו בהגדרות.');
  if (e instanceof Anthropic.PermissionDeniedError) return new AIError('perm', 'למפתח אין הרשאה. בדקו את החשבון ב-console.anthropic.com.');
  if (e instanceof Anthropic.RateLimitError) return new AIError('rate', 'יותר מדי בקשות כרגע. נסו שוב בעוד דקה.');
  if (e instanceof Anthropic.BadRequestError) {
    const m = String(e.message || '');
    if (/credit|balance|billing/i.test(m)) return new AIError('credit', 'נגמרה היתרה בחשבון ה-API. הטעינו קרדיט ב-console.anthropic.com.');
    return new AIError('bad', 'הבקשה נדחתה: ' + m.slice(0, 160));
  }
  if (e instanceof Anthropic.APIConnectionError) return new AIError('net', 'אין חיבור לאינטרנט (או שהשרת לא זמין).');
  if (e instanceof Anthropic.APIError) return new AIError('api', 'שגיאת שרת. נסו שוב. (' + (e.status || '') + ')');
  return new AIError('unknown', 'משהו השתבש: ' + (e?.message || e));
}

function track(usage, model) {
  if (!usage) return;
  const p = MODELS[model] || MODELS['claude-haiku-5-5'];
  const inTok = (usage.input_tokens || 0) + (usage.cache_read_input_tokens || 0) + (usage.cache_creation_input_tokens || 0);
  const usd = (inTok * p.in + (usage.output_tokens || 0) * p.out) / 1e6;
  addUsage(inTok, usage.output_tokens || 0, usd);
}

function extractJSON(text) {
  try { return JSON.parse(text); } catch { /* fallthrough */ }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(text.slice(a, b + 1));
  throw new AIError('parse', 'התשובה מה-AI לא הייתה בפורמט הצפוי. נסו שוב.');
}

let structuredSupported = true;

// קריאה כללית שמחזירה JSON לפי סכמה (structured outputs), עם נסיגה לפענוח טקסט
async function callJSON({ system, messages, schema, maxTokens = 4000 }) {
  const model = settings().model || 'claude-haiku-5-5';
  const body = {
    model,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
    output_config: { effort: MODELS[model]?.effort || 'low' },
  };
  if (structuredSupported) body.output_config.format = { type: 'json_schema', schema };
  let res;
  try {
    res = await getClient().messages.create(body);
  } catch (e) {
    if (structuredSupported && e instanceof Anthropic.BadRequestError && /format|schema|output_config/i.test(e.message)) {
      structuredSupported = false;
      return callJSON({ system, messages, schema, maxTokens });
    }
    throw friendlyError(e);
  }
  track(res.usage, model);
  if (res.stop_reason === 'refusal') throw new AIError('refusal', 'המודל סירב לבקשה הזו. נסו לנסח אחרת.');
  const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  if (res.stop_reason === 'max_tokens' && !text.trim().endsWith('}')) throw new AIError('long', 'התשובה נקטעה. נסו שוב.');
  return extractJSON(text);
}

// ---------- הקשר על הלומד (כדי שה-AI ידבר ברמה הנכונה) ----------
// רמה משוערת לפי אוצר המילים והיחידות (A0 עד B2)
export function levelInfo() {
  const v = vocabSummary();
  const ui = currentUnitIndex();
  const steps = [
    [60, 'A0', 'absolute beginner (A0-A1)'], [180, 'A1', 'beginner (A1)'], [350, 'A2-', 'elementary (A1-A2)'],
    [700, 'A2', 'pre-intermediate (A2)'], [1300, 'B1', 'intermediate (B1)'], [2200, 'B1+', 'upper intermediate (B1+)'],
    [Infinity, 'B2', 'upper intermediate (B2)'],
  ];
  let k = steps.findIndex(([n]) => v.seen < n);
  // לא מדלגים על דקדוק: הרמה לא עולה מעל מה שהיחידות שנלמדו מאפשרות
  const cap = ui < 12 ? 2 : ui < 16 ? 3 : ui < 24 ? 4 : ui < 30 ? 5 : 6;
  k = Math.min(k, cap);
  return { code: steps[k][1], desc: steps[k][2], idx: k };
}

function learnerProfile() {
  const ui = currentUnitIndex();
  const v = vocabSummary();
  const level = levelInfo().desc;
  const studied = UNITS.slice(0, ui + 1).map((u) => `${u.it} (${u.grammar.match(/<h3>(.*?)<\/h3>/)?.[1] || ''})`).join('; ');
  const words = learnedWordList(250);
  const weak = weakItems(6).map((x) => x.it);
  return `LEARNER PROFILE
- Native language: Hebrew (Israeli). Explanations must be in natural, simple Hebrew.
- Level: ${level}. Has met ${v.seen} words/phrases; ${v.known} are well-known.
- Course units studied so far: ${studied}
- Words the learner has studied (${levelInfo().idx >= 4 ? 'the learner also knows many common words not listed; use natural intermediate Italian' : 'prefer these; any other word must be very common and guessable'}): ${words.length ? words.join(', ') : '(none yet - use only the most basic words and very short sentences)'}
- Words the learner struggles with (reuse them naturally when possible): ${weak.join(', ') || '(none)'}`;
}

// ---------- 1. שיחה עם המורה ----------
const CHAT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['reply', 'reply_he', 'corrections', 'hint_he', 'new_words'],
  properties: {
    reply: { type: 'string', description: 'Your next turn in Italian' },
    reply_he: { type: 'string', description: 'Hebrew translation of reply' },
    corrections: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['wrong', 'right', 'why_he'],
        properties: { wrong: { type: 'string' }, right: { type: 'string' }, why_he: { type: 'string' } },
      },
    },
    hint_he: { type: 'string', description: 'Short Hebrew hint on how the learner could answer (may include 1-2 Italian words)' },
    new_words: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he'],
        properties: { it: { type: 'string' }, he: { type: 'string' } },
      },
    },
  },
};

export async function chatTurn(scenario, history) {
  const system = `You are an expert, warm Italian conversation tutor inside a language-learning app for a Hebrew speaker.

ROLE-PLAY: ${scenario.setup}

${learnerProfile()}

HOW TO TEACH (based on second-language acquisition research):
1. Comprehensible input: write at the learner's level (just slightly above it). ${['Beginner: 1-2 very short sentences per turn (max ~25 words).', 'Beginner: 1-2 short sentences (max ~30 words).', 'Elementary: 2-3 sentences (max ~40 words).', 'Pre-intermediate: 2-4 sentences (max ~50 words).', 'Intermediate: natural turns up to ~70 words, varied tenses.', 'Upper-intermediate: natural turns up to ~90 words, idioms and connectors.', 'B2: speak like a friendly native (up to ~100 words), challenge them with follow-up questions that require opinions, reasons and hypotheticals.'][levelInfo().idx]}
2. Keep them talking: almost always end your turn with ONE simple question or prompt that invites them to answer.
3. Corrective feedback: if the learner's last message has errors (grammar, gender/article, conjugation, word choice, spelling, wrong-language words), (a) naturally reuse the correct form in your reply (a recast), and (b) list each real error in "corrections" with the learner's wrong fragment, the corrected Italian, and a 1-sentence explanation in Hebrew. Ignore missing accents/capitalization unless they change meaning. Max 3 corrections, most important first. If the learner wrote in Hebrew or English, tell them how to say it in Italian (put it in corrections).
4. Stay positive and encouraging; never lecture inside "reply". Stay in character.
5. "new_words": 0-3 useful words/phrases from YOUR reply that are probably new to the learner, with Hebrew meaning (base form, nouns with article).
6. "hint_he": a short Hebrew hint helping the learner form an answer to your question.
If the conversation is empty, open the scene yourself with a greeting and a first question.`;
  const msgs = history.length ? history : [{ role: 'user', content: '(התחל את השיחה / Inizia tu)' }];
  return callJSON({ system, messages: msgs, schema: CHAT_SCHEMA, maxTokens: 3000 });
}

// ---------- 2. סיפור מדורג (קריאה + האזנה) ----------
const STORY_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'title_he', 'sentences', 'glossary', 'questions'],
  properties: {
    title: { type: 'string' }, title_he: { type: 'string' },
    sentences: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he'],
        properties: { it: { type: 'string' }, he: { type: 'string' } },
      },
    },
    glossary: {
      type: 'array', description: 'EVERY distinct word form in the story, so the learner can tap any word',
      items: {
        type: 'object', additionalProperties: false, required: ['w', 'he', 'base'],
        properties: { w: { type: 'string', description: 'word exactly as it appears, lowercase' }, he: { type: 'string' }, base: { type: 'string', description: 'dictionary form (nouns with article)' } },
      },
    },
    questions: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['q', 'options', 'answer'],
        properties: { q: { type: 'string', description: 'question in simple Italian' }, options: { type: 'array', items: { type: 'string' } }, answer: { type: 'integer', description: 'index of correct option' } },
      },
    },
  },
};

export async function makeStory(topic, length = 'short') {
  const system = `You write short graded readers for a Hebrew-speaking learner of Italian.

${learnerProfile()}

RULES (research: learners understand and acquire best when ~95-98% of words are already known):
- Use almost only words from the learner's list plus the most frequent Italian words. Introduce at most 4-6 new words, and repeat each new word at least twice.
- Length: ${({ short: '6-9 sentences', medium: '12-16 sentences', long: '20-28 sentences (several paragraphs)' })[length] || '8-12 sentences'}. Use only tenses/structures from the units studied so far (the newest unit's grammar should appear several times).
- From level B1 upward the text may read like a real magazine article, blog post, or dialogue on the topic, with authentic expressions.
- Natural, engaging, a little humor or a small twist. Real Italian culture details.
- Each sentence with a natural Hebrew translation.
- glossary: every distinct word form (lowercase, without punctuation) with its Hebrew meaning in context and its dictionary form.
- 3 comprehension questions in simple Italian with 3 options each.`;
  return callJSON({ system, messages: [{ role: 'user', content: `Topic: ${topic}` }], schema: STORY_SCHEMA, maxTokens: length === 'long' ? 16000 : 10000 });
}

// ---------- 3. תיקון כתיבה ----------
const WRITE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['corrected', 'errors', 'praise_he', 'tip_he', 'better_version'],
  properties: {
    corrected: { type: 'string', description: 'learner text with minimal corrections only' },
    errors: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['wrong', 'right', 'why_he'],
        properties: { wrong: { type: 'string' }, right: { type: 'string' }, why_he: { type: 'string' } },
      },
    },
    praise_he: { type: 'string', description: 'specific, honest praise in Hebrew (1 sentence)' },
    tip_he: { type: 'string', description: 'the ONE most useful thing to improve, in Hebrew' },
    better_version: { type: 'string', description: 'a more natural native-like version, still at learner level' },
  },
};

export async function correctWriting(prompt, text) {
  const system = `You are an encouraging Italian writing tutor for a Hebrew speaker.
${learnerProfile()}
Correct the learner's text. Minimal corrections in "corrected" (keep their wording). Explain every real error briefly in Hebrew. Do not flag missing capital letters. Then give a more natural version at their level.`;
  return callJSON({ system, messages: [{ role: 'user', content: `Task given to learner: ${prompt}\n\nLearner's text:\n${text}` }], schema: WRITE_SCHEMA, maxTokens: 3000 });
}

// ---------- 4. מילים חדשות לפי נושא ----------
const WORDS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['items'],
  properties: {
    items: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he', 'ex', 'exHe'],
        properties: { it: { type: 'string' }, he: { type: 'string' }, ex: { type: 'string' }, exHe: { type: 'string' } },
      },
    },
  },
};

export async function generateWords(topic, n = 10) {
  const system = `You create vocabulary flashcards for a Hebrew-speaking learner of Italian.
${learnerProfile()}
Choose the ${n} MOST USEFUL, high-frequency words or short chunks for the topic, that are not in the learner's list. Nouns with definite article (il/la/l'/lo). For each: Hebrew meaning, a short natural example sentence using mostly known words, and its Hebrew translation. The example sentence must contain the word exactly as written in "it" (without the article if needed).`;
  const r = await callJSON({ system, messages: [{ role: 'user', content: `Topic (may be in Hebrew): ${topic}` }], schema: WORDS_SCHEMA, maxTokens: 4000 });
  return r.items || [];
}

// ---------- 4ב. מילים ליחידה מתקדמת (B1–B2) ----------
export async function generateUnitWords(unit, existing, n = 30) {
  const system = `You build the vocabulary for one unit of an Italian course for a Hebrew speaker who is heading to level B2.
Unit: "${unit.it}" (${unit.level}). Theme and grammar focus: ${unit.gen}

Choose the ${n} MOST USEFUL items for this unit at level ${unit.level}: prioritize high-frequency words (top 5000 Italian lemmas) and common collocations/chunks that a B2 speaker must know; mix nouns, verbs, adjectives, adverbs and 3-6 multi-word expressions. Do NOT include any word from the "already known" list.
Rules:
- "it": nouns with definite article (il/la/l'/lo); verbs in the infinitive; expressions as used.
- "he": precise Hebrew meaning (add a short clarification in parentheses if ambiguous).
- "ex": a natural, short example sentence (max 14 words) containing the item exactly as written in "it" (article may be omitted in the sentence only if unavoidable), preferably practicing the unit's grammar.
- "exHe": natural Hebrew translation of the example.`;
  const r = await callJSON({
    system,
    messages: [{ role: 'user', content: `Already known (exclude): ${existing.join(', ')}` }],
    schema: WORDS_SCHEMA, maxTokens: 12000,
  });
  return r.items || [];
}

// ---------- 4ג. הערכת רמה לפי מה שהלומד כתב/אמר ----------
const LEVEL_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['level', 'strengths_he', 'focus_he', 'next_steps_he'],
  properties: {
    level: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1'] },
    strengths_he: { type: 'string' }, focus_he: { type: 'string' }, next_steps_he: { type: 'string' },
  },
};
export async function assessLevel(samples) {
  const system = `You are a certified CEFR examiner for Italian. Estimate the learner's productive level (speaking/writing) from their messages below, following CEFR descriptors (range, accuracy, coherence, interaction). Be honest and calibrated, not flattering; if there is too little evidence, estimate conservatively. Answer in Hebrew: strengths (1-2 sentences), the 2-3 most important things to fix to reach the next level, and concrete next steps.`;
  return callJSON({ system, messages: [{ role: 'user', content: samples.map((x, i) => `${i + 1}. ${x}`).join('\n') }], schema: LEVEL_SCHEMA, maxTokens: 3000 });
}

// ---------- 5. שאלה חופשית למורה (דקדוק, משמעות) ----------
const ASK_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['answer_he', 'examples'],
  properties: {
    answer_he: { type: 'string', description: 'clear, concise answer in Hebrew' },
    examples: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he'],
        properties: { it: { type: 'string' }, he: { type: 'string' } },
      },
    },
  },
};

export async function askTutor(question, context = '') {
  const system = `You are a patient Italian teacher answering a Hebrew-speaking learner's question. Answer in simple Hebrew, short (max ~120 words), concrete, with a comparison to Hebrew when it helps. Give 2-3 short Italian examples with Hebrew translation.
${learnerProfile()}`;
  return callJSON({ system, messages: [{ role: 'user', content: (context ? `Context: ${context}\n\n` : '') + question }], schema: ASK_SCHEMA, maxTokens: 2500 });
}

// ---------- 6. תרגום מהיר של מילה בהקשר ----------
const GLOSS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['he', 'base', 'note_he'],
  properties: { he: { type: 'string' }, base: { type: 'string' }, note_he: { type: 'string' } },
};
const glossCache = new Map();
export async function glossWord(word, sentence) {
  const k = word.toLowerCase() + '|' + sentence;
  if (glossCache.has(k)) return glossCache.get(k);
  const r = await callJSON({
    system: 'Translate one Italian word in context for a Hebrew speaker. "he": Hebrew meaning in this context. "base": dictionary form (nouns with article, verbs infinitive). "note_he": very short grammar note in Hebrew (e.g. "פועל andare, גוף ראשון") or empty.',
    messages: [{ role: 'user', content: `Word: ${word}\nSentence: ${sentence}` }],
    schema: GLOSS_SCHEMA, maxTokens: 800,
  });
  glossCache.set(k, r);
  return r;
}

// בדיקת מפתח – קריאה זעירה
export async function testKey() {
  const r = await callJSON({
    system: 'Reply with JSON {"ok": true, "msg": "<a short Italian greeting>"}',
    messages: [{ role: 'user', content: 'ping' }],
    schema: { type: 'object', additionalProperties: false, required: ['ok', 'msg'], properties: { ok: { type: 'boolean' }, msg: { type: 'string' } } },
    maxTokens: 500,
  });
  return r;
}
