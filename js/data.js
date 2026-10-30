// תוכן הקורס: יחידות לפי סדר שכיחות ושימושיות (A1→A2).
// כל פריט: [איטלקית, עברית, משפט דוגמה באיטלקית, תרגום המשפט]
// שמות עצם מופיעים עם יידוע (il/la...) כי לומדים את המין יחד עם המילה.

export const UNITS = [
  {
    id: 'u1', it: 'Saluti', he: 'שלום ונימוסים', level: 'A1',
    grammar: `
<h3>הגייה – 6 כללים שמספיקים כמעט לכל מילה</h3>
<p>איטלקית נקראת כמו שהיא נכתבת. מה שבאמת צריך לזכור:</p>
<ul>
<li><b lang="it">c / g</b> לפני <b>e, i</b> נשמעות "צ'" ו"ג'": <i lang="it">ciao</i> = צ'או, <i lang="it">gelato</i> = ג'לאטו. לפני a/o/u הן "ק" ו"ג".</li>
<li><b lang="it">ch / gh</b> = "ק" ו"ג" קשות: <i lang="it">che</i> = קה, <i lang="it">spaghetti</i> = ספגטי.</li>
<li><b lang="it">gli</b> ≈ "לְיִ" רכה: <i lang="it">famiglia</i>. <b lang="it">gn</b> ≈ "נְי": <i lang="it">gnocchi</i>.</li>
<li><b lang="it">sc</b> לפני e/i = "ש": <i lang="it">scusi</i> = סקוזי, אבל <i lang="it">pesce</i> = פֶּשֶה.</li>
<li><b>אותיות כפולות</b> נהגות ארוך יותר: <i lang="it">pala</i> ≠ <i lang="it">palla</i>. זה משנה משמעות!</li>
<li><b lang="it">h</b> תמיד שקטה. <b lang="it">r</b> מתגלגלת (קצה הלשון).</li>
</ul>
<p>💡 לדוברי עברית: התנועות באיטלקית "נקיות" כמו בעברית (a, e, i, o, u) – יתרון גדול לכם.</p>`,
    items: [
      ['ciao', 'היי / ביי (לא רשמי)', 'Ciao, Marco! Come stai?', 'היי מרקו! מה שלומך?'],
      ['buongiorno', 'בוקר טוב / שלום (רשמי, עד אחה"צ)', 'Buongiorno, signora!', 'בוקר טוב, גברתי!'],
      ['buonasera', 'ערב טוב', 'Buonasera, un tavolo per due?', 'ערב טוב, שולחן לשניים?'],
      ['buonanotte', 'לילה טוב', 'Buonanotte, a domani!', 'לילה טוב, נתראה מחר!'],
      ['arrivederci', 'להתראות', 'Grazie e arrivederci!', 'תודה ולהתראות!'],
      ['a domani', 'נתראה מחר', 'Ciao, a domani!', 'ביי, נתראה מחר!'],
      ['grazie', 'תודה', 'Grazie mille!', 'תודה רבה!'],
      ['prego', 'בבקשה / על לא דבר', 'Grazie! – Prego!', 'תודה! – על לא דבר!'],
      ['per favore', 'בבקשה (כשמבקשים)', 'Un caffè, per favore.', 'קפה אחד, בבקשה.'],
      ['scusi', 'סליחה (רשמי)', 'Scusi, dov\'è la stazione?', 'סליחה, איפה התחנה?'],
      ['scusa', 'סליחה (לא רשמי)', 'Scusa, non ho capito.', 'סליחה, לא הבנתי.'],
      ['sì', 'כן', 'Sì, certo!', 'כן, בטח!'],
      ['no', 'לא', 'No, grazie.', 'לא, תודה.'],
      ['Come stai?', 'מה שלומך? (לא רשמי)', 'Ciao Anna, come stai?', 'היי אנה, מה שלומך?'],
      ['Come sta?', 'מה שלומך? (רשמי)', 'Buongiorno, come sta?', 'בוקר טוב, מה שלומך?'],
      ['Sto bene', 'אני בסדר / טוב לי', 'Sto bene, grazie. E tu?', 'אני בסדר, תודה. ואתה?'],
      ['E tu?', 'ואתה? / ואת?', 'Sto bene, e tu?', 'אני בסדר, ואתה?'],
      ['Mi chiamo…', 'קוראים לי…', 'Mi chiamo David.', 'קוראים לי דוד.'],
      ['Come ti chiami?', 'איך קוראים לך?', 'Ciao! Come ti chiami?', 'היי! איך קוראים לך?'],
      ['Piacere!', 'נעים מאוד!', 'Piacere, io sono Sara.', 'נעים מאוד, אני שרה.'],
      ['Non ho capito', 'לא הבנתי', 'Scusi, non ho capito.', 'סליחה, לא הבנתי.'],
      ['Può ripetere?', 'אפשר לחזור על זה? (רשמי)', 'Può ripetere, per favore?', 'אפשר לחזור על זה, בבקשה?'],
    ],
  },
  {
    id: 'u2', it: 'Io sono…', he: 'אני ואתה – הפועל "להיות"', level: 'A1',
    grammar: `
<h3>essere – להיות</h3>
<p>בעברית בהווה אין "להיות" ("אני ישראלי"). באיטלקית <b>חייבים</b> אותו:</p>
<table>
<tr><td lang="it">io sono</td><td>אני</td></tr>
<tr><td lang="it">tu sei</td><td>אתה/את</td></tr>
<tr><td lang="it">lui / lei è</td><td>הוא / היא</td></tr>
<tr><td lang="it">noi siamo</td><td>אנחנו</td></tr>
<tr><td lang="it">voi siete</td><td>אתם/אתן</td></tr>
<tr><td lang="it">loro sono</td><td>הם/הן</td></tr>
</table>
<p>💡 בדרך כלל משמיטים את הכינוי: <i lang="it">Sono israeliano</i> (ולא io sono) – כי הפועל כבר אומר מי.</p>
<p>💡 <b>פנייה רשמית:</b> לזרים ולמבוגרים פונים ב-<i lang="it">Lei</i> ("היא") עם פועל של גוף שלישי: <i lang="it">Lei è italiano?</i> = "האם אתה איטלקי?" (בנימוס). אין לזה מקבילה בעברית.</p>
<p>💡 שמות תואר משנים מין כמו בעברית: <i lang="it">israeliano</i> (ז) / <i lang="it">israeliana</i> (נ).</p>`,
    items: [
      ['io', 'אני', 'Io sono Marco, e tu?', 'אני מרקו, ואתה?'],
      ['tu', 'אתה / את', 'Tu sei italiana?', 'את איטלקייה?'],
      ['lui', 'הוא', 'Lui è mio fratello.', 'הוא אחי.'],
      ['lei', 'היא', 'Lei è molto simpatica.', 'היא מאוד נחמדה.'],
      ['Lei', 'אתה/את (פנייה רשמית)', 'Lei è il signor Rossi?', 'אתה מר רוסי?'],
      ['noi', 'אנחנו', 'Noi siamo di Haifa.', 'אנחנו מחיפה.'],
      ['voi', 'אתם / אתן', 'Voi siete in vacanza?', 'אתם בחופשה?'],
      ['loro', 'הם / הן', 'Loro sono amici.', 'הם חברים.'],
      ['sono', 'אני (צורת "להיות") / הם', 'Sono israeliano.', 'אני ישראלי.'],
      ['sei', 'אתה/את (צורת "להיות")', 'Sei stanco?', 'אתה עייף?'],
      ['è', 'הוא/היא/זה (צורת "להיות")', 'È bellissimo!', 'זה יפהפה!'],
      ['siamo', 'אנחנו (צורת "להיות")', 'Siamo in ritardo.', 'אנחנו מאחרים.'],
      ['siete', 'אתם (צורת "להיות")', 'Di dove siete?', 'מאיפה אתם?'],
      ['israeliano / israeliana', 'ישראלי / ישראלית', 'Sono israeliana, di Tel Aviv.', 'אני ישראלית, מתל אביב.'],
      ['italiano / italiana', 'איטלקי / איטלקייה', 'Lui è italiano, di Roma.', 'הוא איטלקי, מרומא.'],
      ['Di dove sei?', 'מאיפה אתה?', 'Di dove sei? – Sono di Gerusalemme.', 'מאיפה אתה? – אני מירושלים.'],
      ['Sono di…', 'אני מ…', 'Sono di Tel Aviv.', 'אני מתל אביב.'],
      ['anche', 'גם', 'Anch\'io sono di Milano!', 'גם אני ממילאנו!'],
      ['molto', 'מאוד / הרבה', 'Sono molto contento.', 'אני מאוד שמח.'],
      ['contento / contenta', 'שמח / שמחה', 'Sono contenta di essere qui.', 'אני שמחה להיות כאן.'],
      ['stanco / stanca', 'עייף / עייפה', 'Oggi sono stanco.', 'היום אני עייף.'],
      ['qui', 'כאן', 'Siamo qui!', 'אנחנו כאן!'],
    ],
  },
  {
    id: 'u3', it: 'Le persone e le cose', he: 'שמות עצם ויידוע', level: 'A1',
    grammar: `
<h3>ה' הידיעה – באיטלקית יש כמה</h3>
<p>בעברית יש רק <b>ה</b>. באיטלקית היא תלויה במין, במספר ובאות הראשונה:</p>
<table>
<tr><th></th><th>יחיד</th><th>רבים</th></tr>
<tr><td>זכר (רגיל)</td><td lang="it">il libro</td><td lang="it">i libri</td></tr>
<tr><td>זכר לפני s+עיצור, z</td><td lang="it">lo zaino</td><td lang="it">gli zaini</td></tr>
<tr><td>לפני תנועה</td><td lang="it">l'amico</td><td lang="it">gli amici</td></tr>
<tr><td>נקבה</td><td lang="it">la casa</td><td lang="it">le case</td></tr>
</table>
<h3>"אחד/אחת" – un, una</h3>
<p>בעברית אומרים "ספר" בלי כלום. באיטלקית צריך: <i lang="it">un libro</i>, <i lang="it">una casa</i>, <i lang="it">un'amica</i>, <i lang="it">uno zaino</i>.</p>
<h3>רבים</h3>
<p><b>-o → -i</b> (libro→libri), <b>-a → -e</b> (casa→case), <b>-e → -i</b> (notte→notti). מילים שמסתיימות בתנועה מוטעמת לא משתנות: <i lang="it">la città → le città</i>.</p>
<p>💡 תמיד למדו מילה <b>עם</b> ה-il/la שלה – כך זוכרים את המין בלי מאמץ.</p>`,
    items: [
      ['la casa', 'הבית', 'La casa è grande.', 'הבית גדול.'],
      ['l\'uomo', 'האיש (רבים: gli uomini)', 'L\'uomo parla italiano.', 'האיש מדבר איטלקית.'],
      ['la donna', 'האישה', 'La donna è una dottoressa.', 'האישה היא רופאה.'],
      ['il ragazzo', 'הבחור / הנער', 'Il ragazzo è simpatico.', 'הבחור נחמד.'],
      ['la ragazza', 'הבחורה / חברה (בת זוג)', 'La mia ragazza è italiana.', 'החברה שלי איטלקייה.'],
      ['il bambino', 'הילד / התינוק', 'Il bambino dorme.', 'הילד ישן.'],
      ['l\'amico / l\'amica', 'החבר / החברה', 'È un mio amico.', 'הוא חבר שלי.'],
      ['la persona', 'האדם', 'È una persona gentile.', 'הוא אדם אדיב.'],
      ['il libro', 'הספר', 'Leggo un libro.', 'אני קורא ספר.'],
      ['l\'acqua', 'המים', 'Un bicchiere d\'acqua, per favore.', 'כוס מים, בבקשה.'],
      ['il caffè', 'הקפה', 'Il caffè è buonissimo.', 'הקפה מעולה.'],
      ['la città', 'העיר', 'Roma è una città bellissima.', 'רומא היא עיר יפהפייה.'],
      ['il giorno', 'היום (יממה)', 'Che bel giorno!', 'איזה יום יפה!'],
      ['la notte', 'הלילה', 'La notte è fredda.', 'הלילה קר.'],
      ['l\'anno', 'השנה', 'Quest\'anno vado in Italia.', 'השנה אני נוסע לאיטליה.'],
      ['il lavoro', 'העבודה', 'Il lavoro è interessante.', 'העבודה מעניינת.'],
      ['la cosa', 'הדבר', 'Una cosa importante.', 'דבר חשוב.'],
      ['il tempo', 'הזמן / מזג האוויר', 'Non ho tempo.', 'אין לי זמן.'],
      ['la vita', 'החיים', 'La vita è bella.', 'החיים יפים.'],
      ['il telefono', 'הטלפון', 'Dov\'è il mio telefono?', 'איפה הטלפון שלי?'],
      ['la chiave', 'המפתח', 'Ho perso la chiave.', 'איבדתי את המפתח.'],
      ['lo zaino', 'התרמיל', 'Lo zaino è pesante.', 'התרמיל כבד.'],
    ],
  },
  {
    id: 'u4', it: 'Numeri e ore', he: 'מספרים, מחירים ושעות', level: 'A1',
    grammar: `
<h3>מספרים</h3>
<p>1–10: <i lang="it">uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci</i>.<br>
11–20: <i lang="it">undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti</i>.<br>
עשרות: <i lang="it">trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta, cento, mille</i>.</p>
<p>צירוף: <i lang="it">ventitré</i> (23), <i lang="it">trentacinque</i> (35). לפני uno/otto נופלת התנועה: <i lang="it">ventuno, ventotto</i>.</p>
<h3>מה השעה?</h3>
<p><i lang="it">Che ore sono?</i> → <i lang="it">Sono le tre</i> (זו "השלוש" ברבים!), אבל <i lang="it">È l'una</i> (אחת), <i lang="it">È mezzogiorno</i>.</p>
<p>רבע וחצי: <i lang="it">le tre e un quarto</i>, <i lang="it">le tre e mezza</i>, <i lang="it">le quattro meno un quarto</i>.</p>
<p>"בשעה": <i lang="it">alle otto</i> (ב-8), <i lang="it">all'una</i>.</p>`,
    items: [
      ['uno', 'אחד', 'Ho solo un fratello.', 'יש לי רק אח אחד.'],
      ['due', 'שתיים', 'Due caffè, per favore.', 'שני קפה, בבקשה.'],
      ['tre', 'שלוש', 'Sono le tre.', 'השעה שלוש.'],
      ['quattro', 'ארבע', 'Siamo in quattro.', 'אנחנו ארבעה.'],
      ['cinque', 'חמש', 'Cinque minuti!', 'חמש דקות!'],
      ['sei', 'שש', 'Alle sei di sera.', 'בשש בערב.'],
      ['sette', 'שבע', 'Sette giorni a settimana.', 'שבעה ימים בשבוע.'],
      ['otto', 'שמונה', 'Il treno parte alle otto.', 'הרכבת יוצאת בשמונה.'],
      ['nove', 'תשע', 'Apre alle nove.', 'פותח בתשע.'],
      ['dieci', 'עשר', 'Costa dieci euro.', 'זה עולה עשרה יורו.'],
      ['venti', 'עשרים', 'Venti euro, grazie.', 'עשרים יורו, תודה.'],
      ['cento', 'מאה', 'Cento grammi di prosciutto.', 'מאה גרם פרושוטו.'],
      ['mille', 'אלף', 'Mille grazie!', 'אלף תודות!'],
      ['Quanto costa?', 'כמה זה עולה?', 'Scusi, quanto costa questo?', 'סליחה, כמה זה עולה?'],
      ['Che ore sono?', 'מה השעה?', 'Scusa, che ore sono?', 'סליחה, מה השעה?'],
      ['a che ora…?', 'באיזו שעה…?', 'A che ora parte il treno?', 'באיזו שעה יוצאת הרכבת?'],
      ['oggi', 'היום', 'Oggi fa caldo.', 'היום חם.'],
      ['domani', 'מחר', 'Ci vediamo domani.', 'נתראה מחר.'],
      ['ieri', 'אתמול', 'Ieri ero a Roma.', 'אתמול הייתי ברומא.'],
      ['adesso', 'עכשיו', 'Adesso non posso.', 'עכשיו אני לא יכול.'],
      ['il minuto', 'הדקה', 'Arrivo tra cinque minuti.', 'אני מגיע בעוד חמש דקות.'],
      ['l\'ora', 'השעה', 'Un\'ora di treno.', 'שעה ברכבת.'],
    ],
  },
  {
    id: 'u5', it: 'Avere e la famiglia', he: 'יש לי – משפחה', level: 'A1',
    grammar: `
<h3>avere – "יש ל…"</h3>
<p>בעברית "יש לי". באיטלקית זה פועל: "אני מחזיק".</p>
<table>
<tr><td lang="it">ho</td><td>יש לי</td></tr><tr><td lang="it">hai</td><td>יש לך</td></tr>
<tr><td lang="it">ha</td><td>יש לו/לה</td></tr><tr><td lang="it">abbiamo</td><td>יש לנו</td></tr>
<tr><td lang="it">avete</td><td>יש לכם</td></tr><tr><td lang="it">hanno</td><td>יש להם</td></tr>
</table>
<p>(ה-h שקטה: <i lang="it">ho</i> = "או").</p>
<h3>⚠️ מלכודת לדוברי עברית</h3>
<p>תחושות בונים עם avere, לא עם "להיות":<br>
<i lang="it">Ho fame</i> = אני רעב ("יש לי רעב"), <i lang="it">ho sete</i>, <i lang="it">ho freddo</i>, <i lang="it">ho caldo</i>, <i lang="it">ho sonno</i>.<br>
גיל: <i lang="it">Ho trent'anni</i> = אני בן 30 ("יש לי 30 שנה").</p>
<h3>שלי, שלך</h3>
<p>באים <b>לפני</b> שם העצם ועם יידוע: <i lang="it">la mia casa</i> (הבית שלי). חריג: בן משפחה ביחיד – בלי יידוע: <i lang="it">mia madre, mio padre</i>.</p>`,
    items: [
      ['ho', 'יש לי', 'Ho una sorella.', 'יש לי אחות.'],
      ['hai', 'יש לך', 'Hai fratelli?', 'יש לך אחים?'],
      ['ha', 'יש לו / לה', 'Ha due figli.', 'יש לו שני ילדים.'],
      ['abbiamo', 'יש לנו', 'Abbiamo un cane.', 'יש לנו כלב.'],
      ['hanno', 'יש להם', 'Hanno una casa al mare.', 'יש להם בית ליד הים.'],
      ['la famiglia', 'המשפחה', 'La mia famiglia è grande.', 'המשפחה שלי גדולה.'],
      ['il padre', 'האב', 'Mio padre è medico.', 'אבא שלי רופא.'],
      ['la madre', 'האם', 'Mia madre cucina benissimo.', 'אמא שלי מבשלת מעולה.'],
      ['il fratello', 'האח', 'Mio fratello abita a Eilat.', 'אחי גר באילת.'],
      ['la sorella', 'האחות', 'Mia sorella ha vent\'anni.', 'אחותי בת עשרים.'],
      ['il figlio', 'הבן', 'Nostro figlio studia.', 'הבן שלנו לומד.'],
      ['la figlia', 'הבת', 'Mia figlia ama la pizza.', 'הבת שלי אוהבת פיצה.'],
      ['il marito', 'הבעל', 'Mio marito lavora molto.', 'בעלי עובד הרבה.'],
      ['la moglie', 'האישה (רעיה)', 'Mia moglie è di Napoli.', 'אשתי מנאפולי.'],
      ['i genitori', 'ההורים', 'I miei genitori sono in pensione.', 'ההורים שלי בפנסיה.'],
      ['il nonno / la nonna', 'הסבא / הסבתא', 'La nonna fa la pasta in casa.', 'סבתא מכינה פסטה בבית.'],
      ['Quanti anni hai?', 'בן כמה אתה?', 'Quanti anni hai? – Ho quarant\'anni.', 'בן כמה אתה? – אני בן ארבעים.'],
      ['ho fame', 'אני רעב', 'Ho fame, mangiamo?', 'אני רעב, נאכל?'],
      ['ho sete', 'אני צמא', 'Ho sete, c\'è dell\'acqua?', 'אני צמא, יש מים?'],
      ['ho freddo / ho caldo', 'קר לי / חם לי', 'Ho freddo, chiudi la finestra?', 'קר לי, תסגור את החלון?'],
      ['mio / mia', 'שלי (ז/נ)', 'Questa è la mia valigia.', 'זו המזוודה שלי.'],
      ['tuo / tua', 'שלך (ז/נ)', 'È tuo questo?', 'זה שלך?'],
    ],
  },
  {
    id: 'u6', it: 'Verbi in -are', he: 'פעלים ב-are: לדבר, לאכול, לעבוד', level: 'A1',
    grammar: `
<h3>נטיית הווה – פעלים ב-are (הקבוצה הגדולה)</h3>
<p>בעברית בהווה הפועל משתנה רק לפי מין ומספר (מדבר/מדברת). באיטלקית הוא משתנה לפי <b>גוף</b> – 6 צורות:</p>
<table>
<tr><td lang="it">parl<b>o</b></td><td>אני מדבר</td></tr><tr><td lang="it">parl<b>i</b></td><td>אתה מדבר</td></tr>
<tr><td lang="it">parl<b>a</b></td><td>הוא/היא מדבר/ת</td></tr><tr><td lang="it">parl<b>iamo</b></td><td>אנחנו מדברים</td></tr>
<tr><td lang="it">parl<b>ate</b></td><td>אתם מדברים</td></tr><tr><td lang="it">parl<b>ano</b></td><td>הם מדברים</td></tr>
</table>
<p>מורידים <b>-are</b> ומוסיפים את הסיומת. אותו דבר לכל הפעלים ביחידה.</p>
<h3>שלילה</h3>
<p>פשוט מוסיפים <i lang="it">non</i> לפני הפועל: <i lang="it">Non parlo tedesco</i> = אני לא מדבר גרמנית.</p>
<p>💡 שאלה = אותו משפט עם אינטונציה עולה: <i lang="it">Parli italiano?</i></p>`,
    items: [
      ['parlare', 'לדבר', 'Parlo un po\' di italiano.', 'אני מדבר קצת איטלקית.'],
      ['mangiare', 'לאכול', 'Mangiamo insieme?', 'נאכל ביחד?'],
      ['lavorare', 'לעבוד', 'Lavoro in un ufficio.', 'אני עובד במשרד.'],
      ['abitare', 'לגור', 'Abito a Tel Aviv.', 'אני גר בתל אביב.'],
      ['studiare', 'ללמוד', 'Studio l\'italiano ogni giorno.', 'אני לומד איטלקית כל יום.'],
      ['imparare', 'ללמוד (לרכוש ידע)', 'Voglio imparare a cucinare.', 'אני רוצה ללמוד לבשל.'],
      ['cercare', 'לחפש', 'Cerco un buon ristorante.', 'אני מחפש מסעדה טובה.'],
      ['trovare', 'למצוא', 'Non trovo le chiavi.', 'אני לא מוצא את המפתחות.'],
      ['comprare', 'לקנות', 'Compro il pane.', 'אני קונה לחם.'],
      ['pagare', 'לשלם', 'Posso pagare con la carta?', 'אפשר לשלם בכרטיס?'],
      ['guardare', 'להסתכל / לצפות', 'Guardiamo un film stasera?', 'נראה סרט הערב?'],
      ['ascoltare', 'להקשיב', 'Ascolto musica italiana.', 'אני מקשיב למוזיקה איטלקית.'],
      ['aspettare', 'לחכות', 'Aspetto l\'autobus.', 'אני מחכה לאוטובוס.'],
      ['arrivare', 'להגיע', 'Arrivo subito!', 'אני מגיע מיד!'],
      ['tornare', 'לחזור', 'Torno a casa alle sei.', 'אני חוזר הביתה בשש.'],
      ['amare', 'לאהוב', 'Amo l\'Italia.', 'אני אוהב את איטליה.'],
      ['chiamare', 'לקרוא / להתקשר', 'Ti chiamo domani.', 'אתקשר אליך מחר.'],
      ['pensare', 'לחשוב', 'Penso di sì.', 'אני חושב שכן.'],
      ['non', 'לא (לפני פועל)', 'Non lavoro il sabato.', 'אני לא עובד בשבת.'],
      ['ogni giorno', 'כל יום', 'Cammino ogni giorno.', 'אני הולך ברגל כל יום.'],
      ['un po\'', 'קצת', 'Parlo un po\' d\'inglese.', 'אני מדבר קצת אנגלית.'],
      ['insieme', 'ביחד', 'Studiamo insieme.', 'בואו נלמד ביחד.'],
    ],
  },
  {
    id: 'u7', it: 'Al bar e al ristorante', he: 'בבית קפה ובמסעדה', level: 'A1',
    grammar: `
<h3>vorrei – "הייתי רוצה"</h3>
<p>הדרך המנומסת להזמין: <i lang="it">Vorrei un cappuccino</i>. עדיף על <i lang="it">voglio</i> (אני רוצה), שנשמע תובעני.</p>
<h3>קצת מ… – del, della</h3>
<p>כשמדברים על כמות לא מוגדרת ("קצת לחם", "יין"): <i lang="it">del pane</i>, <i lang="it">della pasta</i>, <i lang="it">dell'acqua</i>, <i lang="it">dei biscotti</i>. בעברית פשוט משמיטים – באיטלקית זה נשמע טבעי יותר עם.</p>
<h3>💡 תרבות</h3>
<ul>
<li>קפוצ'ינו – רק בבוקר. אחרי ארוחה מזמינים <i lang="it">un caffè</i> (=אספרסו).</li>
<li>החשבון לא מגיע לבד – מבקשים: <i lang="it">Il conto, per favore</i>.</li>
<li><i lang="it">coperto</i> בחשבון = דמי שולחן, זה חוקי ומקובל.</li>
</ul>`,
    items: [
      ['vorrei', 'הייתי רוצה (בנימוס)', 'Vorrei un cappuccino, per favore.', 'אשמח לקפוצ\'ינו, בבקשה.'],
      ['il conto', 'החשבון', 'Il conto, per favore.', 'את החשבון, בבקשה.'],
      ['un tavolo per due', 'שולחן לשניים', 'Avete un tavolo per due?', 'יש לכם שולחן לשניים?'],
      ['il menù', 'התפריט', 'Posso vedere il menù?', 'אפשר לראות את התפריט?'],
      ['il pane', 'הלחם', 'Ancora un po\' di pane?', 'עוד קצת לחם?'],
      ['il vino', 'היין', 'Un bicchiere di vino rosso.', 'כוס יין אדום.'],
      ['la birra', 'הבירה', 'Una birra piccola, per favore.', 'בירה קטנה, בבקשה.'],
      ['il latte', 'החלב', 'Un caffè con un po\' di latte.', 'קפה עם קצת חלב.'],
      ['il formaggio', 'הגבינה', 'Questo formaggio è buonissimo.', 'הגבינה הזו מעולה.'],
      ['la carne', 'הבשר', 'Non mangio carne.', 'אני לא אוכל בשר.'],
      ['il pesce', 'הדג', 'Il pesce è fresco?', 'הדג טרי?'],
      ['la verdura', 'הירקות', 'Un piatto di verdure grigliate.', 'צלחת ירקות על הגריל.'],
      ['la frutta', 'הפירות', 'Mangio frutta ogni mattina.', 'אני אוכל פירות כל בוקר.'],
      ['la colazione', 'ארוחת הבוקר', 'La colazione è inclusa?', 'ארוחת הבוקר כלולה?'],
      ['il pranzo', 'ארוחת הצהריים', 'Il pranzo è all\'una.', 'ארוחת הצהריים באחת.'],
      ['la cena', 'ארוחת הערב', 'Andiamo a cena fuori?', 'נצא לארוחת ערב?'],
      ['Cosa mi consiglia?', 'מה אתה ממליץ לי?', 'Cosa mi consiglia oggi?', 'מה אתה ממליץ לי היום?'],
      ['Sono vegetariano/a', 'אני צמחוני/ת', 'Sono vegetariana, c\'è qualcosa senza carne?', 'אני צמחונית, יש משהו בלי בשר?'],
      ['senza', 'בלי', 'Un caffè senza zucchero.', 'קפה בלי סוכר.'],
      ['con', 'עם', 'Pasta con pomodoro e basilico.', 'פסטה עם עגבנייה ובזיליקום.'],
      ['buonissimo', 'טעים מאוד / מעולה', 'Il tiramisù è buonissimo!', 'הטירמיסו מעולה!'],
      ['il bicchiere', 'הכוס', 'Un bicchiere d\'acqua naturale.', 'כוס מים רגילים (לא מוגזים).'],
    ],
  },
  {
    id: 'u8', it: 'Verbi in -ere e -ire', he: 'פעלים ב-ere ו-ire', level: 'A1',
    grammar: `
<h3>-ere ו--ire</h3>
<table>
<tr><th></th><th lang="it">prendere</th><th lang="it">dormire</th></tr>
<tr><td>אני</td><td lang="it">prend<b>o</b></td><td lang="it">dorm<b>o</b></td></tr>
<tr><td>אתה</td><td lang="it">prend<b>i</b></td><td lang="it">dorm<b>i</b></td></tr>
<tr><td>הוא/היא</td><td lang="it">prend<b>e</b></td><td lang="it">dorm<b>e</b></td></tr>
<tr><td>אנחנו</td><td lang="it">prend<b>iamo</b></td><td lang="it">dorm<b>iamo</b></td></tr>
<tr><td>אתם</td><td lang="it">prend<b>ete</b></td><td lang="it">dorm<b>ite</b></td></tr>
<tr><td>הם</td><td lang="it">prend<b>ono</b></td><td lang="it">dorm<b>ono</b></td></tr>
</table>
<p>שימו לב: "אני" תמיד <b>-o</b> ו"אנחנו" תמיד <b>-iamo</b> – בכל הקבוצות.</p>
<h3>פעלי -isc</h3>
<p>חלק מפעלי ire מוסיפים <b>isc</b>: <i lang="it">capisco, capisci, capisce, capiamo, capite, capiscono</i>. כך גם <i lang="it">finire, preferire, pulire</i>.</p>`,
    items: [
      ['prendere', 'לקחת / להזמין (אוכל) / לנסוע ב…', 'Prendo un caffè. E tu?', 'אני לוקח קפה. ואתה?'],
      ['vedere', 'לראות', 'Ci vediamo dopo!', 'נתראה אחר כך!'],
      ['leggere', 'לקרוא', 'Leggo il giornale ogni mattina.', 'אני קורא את העיתון כל בוקר.'],
      ['scrivere', 'לכתוב', 'Scrivo un messaggio a Luca.', 'אני כותב הודעה ללוקה.'],
      ['vivere', 'לחיות / לגור', 'Vivo in Israele.', 'אני חי בישראל.'],
      ['chiedere', 'לשאול / לבקש', 'Chiedo informazioni.', 'אני שואל לפרטים.'],
      ['rispondere', 'לענות', 'Non risponde al telefono.', 'הוא לא עונה לטלפון.'],
      ['credere', 'להאמין', 'Non ci credo!', 'אני לא מאמין!'],
      ['mettere', 'לשים', 'Metto la giacca.', 'אני שם את המעיל.'],
      ['perdere', 'לאבד / להחמיץ', 'Perdo sempre il treno!', 'אני תמיד מפספס את הרכבת!'],
      ['conoscere', 'להכיר', 'Conosci Marco?', 'אתה מכיר את מרקו?'],
      ['dormire', 'לישון', 'Dormo otto ore.', 'אני ישן שמונה שעות.'],
      ['partire', 'לצאת לדרך / לעזוב', 'Il treno parte alle dieci.', 'הרכבת יוצאת בעשר.'],
      ['sentire', 'לשמוע / להרגיש', 'Non ti sento bene.', 'אני לא שומע אותך טוב.'],
      ['aprire', 'לפתוח', 'A che ora aprite?', 'באיזו שעה אתם פותחים?'],
      ['capire', 'להבין', 'Non capisco.', 'אני לא מבין.'],
      ['finire', 'לסיים', 'Finisco alle cinque.', 'אני מסיים בחמש.'],
      ['preferire', 'להעדיף', 'Preferisco il tè.', 'אני מעדיף תה.'],
      ['offrire', 'להציע / לכבד (לשלם על מישהו)', 'Offro io!', 'אני מזמין! (משלם)'],
      ['il messaggio', 'ההודעה', 'Ti mando un messaggio.', 'אשלח לך הודעה.'],
      ['sempre', 'תמיד', 'Sei sempre in ritardo!', 'אתה תמיד מאחר!'],
      ['mai', 'אף פעם', 'Non bevo mai caffè la sera.', 'אני אף פעם לא שותה קפה בערב.'],
    ],
  },
  {
    id: 'u9', it: 'Verbi irregolari', he: 'הפעלים הכי חשובים (חריגים)', level: 'A1',
    grammar: `
<h3>10 הפעלים החריגים הנפוצים</h3>
<p>הם חריגים בדיוק כי הם הכי שימושיים. הנה "אני / אתה / הוא":</p>
<table>
<tr><td lang="it">andare</td><td lang="it">vado, vai, va</td><td>ללכת/לנסוע</td></tr>
<tr><td lang="it">fare</td><td lang="it">faccio, fai, fa</td><td>לעשות</td></tr>
<tr><td lang="it">venire</td><td lang="it">vengo, vieni, viene</td><td>לבוא</td></tr>
<tr><td lang="it">volere</td><td lang="it">voglio, vuoi, vuole</td><td>לרצות</td></tr>
<tr><td lang="it">potere</td><td lang="it">posso, puoi, può</td><td>יכול</td></tr>
<tr><td lang="it">dovere</td><td lang="it">devo, devi, deve</td><td>צריך/חייב</td></tr>
<tr><td lang="it">sapere</td><td lang="it">so, sai, sa</td><td>לדעת</td></tr>
<tr><td lang="it">stare</td><td lang="it">sto, stai, sta</td><td>להיות (מצב)/להישאר</td></tr>
<tr><td lang="it">dire</td><td lang="it">dico, dici, dice</td><td>לומר</td></tr>
<tr><td lang="it">uscire</td><td lang="it">esco, esci, esce</td><td>לצאת</td></tr>
</table>
<h3>יכול / רוצה / צריך + שם פועל</h3>
<p>בדיוק כמו בעברית: <i lang="it">Posso entrare?</i> = אפשר להיכנס? <i lang="it">Devo andare</i> = אני צריך ללכת.</p>
<p>💡 <i lang="it">fare</i> משמש גם למזג אוויר: <i lang="it">Fa caldo</i> = חם.</p>`,
    items: [
      ['andare', 'ללכת / לנסוע', 'Vado al mare domani.', 'אני נוסע לים מחר.'],
      ['vado', 'אני הולך / נוסע', 'Vado a casa.', 'אני הולך הביתה.'],
      ['fare', 'לעשות', 'Cosa fai stasera?', 'מה אתה עושה הערב?'],
      ['faccio', 'אני עושה', 'Faccio una passeggiata.', 'אני יוצא לטיול רגלי.'],
      ['venire', 'לבוא', 'Vieni con noi?', 'אתה בא איתנו?'],
      ['volere', 'לרצות', 'Vuoi un gelato?', 'אתה רוצה גלידה?'],
      ['voglio', 'אני רוצה', 'Voglio visitare Firenze.', 'אני רוצה לבקר בפירנצה.'],
      ['potere', 'יכול / לְהיות מסוגל', 'Posso aiutarti?', 'אני יכול לעזור לך?'],
      ['posso', 'אני יכול / אפשר?', 'Posso pagare qui?', 'אפשר לשלם כאן?'],
      ['dovere', 'להיות חייב / צריך', 'Devo lavorare domani.', 'אני צריך לעבוד מחר.'],
      ['devo', 'אני צריך / חייב', 'Scusa, devo andare.', 'סליחה, אני חייב ללכת.'],
      ['sapere', 'לדעת', 'Non lo so.', 'אני לא יודע.'],
      ['stare', 'להיות (מצב) / להישאר', 'Come stai? – Sto benissimo.', 'מה שלומך? – מצוין.'],
      ['dire', 'לומר', 'Come si dice "תודה" in italiano?', 'איך אומרים "תודה" באיטלקית?'],
      ['uscire', 'לצאת', 'Usciamo stasera?', 'יוצאים הערב?'],
      ['dare', 'לתת', 'Mi dai il numero?', 'תיתן לי את המספר?'],
      ['bere', 'לשתות', 'Cosa bevi?', 'מה אתה שותה?'],
      ['Fa caldo / Fa freddo', 'חם / קר (מזג אוויר)', 'Oggi fa molto caldo.', 'היום חם מאוד.'],
      ['Posso…?', 'אפשר…?', 'Posso entrare?', 'אפשר להיכנס?'],
      ['Come si dice…?', 'איך אומרים…?', 'Come si dice "מים" in italiano?', 'איך אומרים "מים" באיטלקית?'],
      ['stasera', 'הערב', 'Stasera mangiamo fuori.', 'הערב אוכלים בחוץ.'],
      ['subito', 'מיד', 'Vengo subito!', 'אני בא מיד!'],
    ],
  },
  {
    id: 'u10', it: 'In viaggio', he: 'בטיול: מקומות וכיוונים', level: 'A1',
    grammar: `
<h3>מילות יחס + יידוע = מילה אחת</h3>
<p>כמו בעברית "ב+ה = בַּ", באיטלקית מילות יחס מתמזגות עם il/la:</p>
<table>
<tr><th></th><th>il</th><th>la</th><th>l'</th><th>i</th><th>le</th></tr>
<tr><td lang="it">a (ל/ב)</td><td lang="it">al</td><td lang="it">alla</td><td lang="it">all'</td><td lang="it">ai</td><td lang="it">alle</td></tr>
<tr><td lang="it">in (ב)</td><td lang="it">nel</td><td lang="it">nella</td><td lang="it">nell'</td><td lang="it">nei</td><td lang="it">nelle</td></tr>
<tr><td lang="it">di (של)</td><td lang="it">del</td><td lang="it">della</td><td lang="it">dell'</td><td lang="it">dei</td><td lang="it">delle</td></tr>
<tr><td lang="it">da (מ/אצל)</td><td lang="it">dal</td><td lang="it">dalla</td><td lang="it">dall'</td><td lang="it">dai</td><td lang="it">dalle</td></tr>
</table>
<h3>a או in?</h3>
<p><b>a</b> + עיר: <i lang="it">a Roma</i>. <b>in</b> + ארץ/אזור: <i lang="it">in Italia, in Toscana</i>. וגם: <i lang="it">vado al mare, in centro, a casa</i>.</p>
<p>💡 <i lang="it">c'è</i> = יש (יחיד), <i lang="it">ci sono</i> = יש (רבים): <i lang="it">C'è una farmacia qui vicino?</i></p>`,
    items: [
      ['la stazione', 'התחנה (רכבת)', 'Dov\'è la stazione?', 'איפה התחנה?'],
      ['il treno', 'הרכבת', 'Il treno per Firenze è in ritardo.', 'הרכבת לפירנצה מאחרת.'],
      ['il biglietto', 'הכרטיס', 'Un biglietto per Roma, per favore.', 'כרטיס לרומא, בבקשה.'],
      ['l\'aeroporto', 'שדה התעופה', 'Come arrivo all\'aeroporto?', 'איך מגיעים לשדה התעופה?'],
      ['l\'albergo', 'המלון', 'L\'albergo è in centro.', 'המלון במרכז.'],
      ['la camera', 'החדר (במלון)', 'Ho prenotato una camera doppia.', 'הזמנתי חדר זוגי.'],
      ['la strada', 'הרחוב / הדרך', 'È questa la strada giusta?', 'זו הדרך הנכונה?'],
      ['la piazza', 'הכיכר', 'Ci vediamo in piazza.', 'ניפגש בכיכר.'],
      ['il centro', 'מרכז העיר', 'Andiamo in centro?', 'נלך למרכז?'],
      ['il mare', 'הים', 'Andiamo al mare!', 'בואו נלך לים!'],
      ['la spiaggia', 'החוף', 'La spiaggia è bellissima.', 'החוף יפהפה.'],
      ['il museo', 'המוזיאון', 'Il museo è chiuso il lunedì.', 'המוזיאון סגור בימי שני.'],
      ['Dov\'è…?', 'איפה…?', 'Scusi, dov\'è il bagno?', 'סליחה, איפה השירותים?'],
      ['c\'è / ci sono', 'יש (יחיד / רבים)', 'C\'è un bancomat qui vicino?', 'יש כספומט קרוב לכאן?'],
      ['a destra', 'ימינה', 'Giri a destra.', 'פנה ימינה.'],
      ['a sinistra', 'שמאלה', 'La farmacia è a sinistra.', 'בית המרקחת משמאל.'],
      ['dritto', 'ישר', 'Vada sempre dritto.', 'סע/לך כל הזמן ישר.'],
      ['vicino', 'קרוב', 'È vicino? – Sì, cinque minuti a piedi.', 'זה קרוב? – כן, חמש דקות ברגל.'],
      ['lontano', 'רחוק', 'È lontano da qui?', 'זה רחוק מכאן?'],
      ['a piedi', 'ברגל', 'Andiamo a piedi.', 'נלך ברגל.'],
      ['il bagno', 'השירותים / האמבטיה', 'Posso usare il bagno?', 'אפשר להשתמש בשירותים?'],
      ['prenotare', 'להזמין (מקום)', 'Vorrei prenotare un tavolo.', 'אני רוצה להזמין שולחן.'],
    ],
  },
  {
    id: 'u11', it: 'Mi piace!', he: 'אני אוהב – ותיאורים', level: 'A1',
    grammar: `
<h3>mi piace – בדיוק כמו "מוצא חן בעיניי"</h3>
<p>יתרון ענק לדוברי עברית! <i lang="it">Mi piace la pizza</i> = "הפיצה מוצאת חן בעיניי". הדבר שאוהבים הוא הנושא, ולכן:</p>
<ul>
<li>דבר אחד/פעולה: <i lang="it">mi piace</i> – <i lang="it">Mi piace il mare. Mi piace viaggiare.</i></li>
<li>כמה דברים: <i lang="it">mi piacciono</i> – <i lang="it">Mi piacciono i gatti.</i></li>
</ul>
<p>לך: <i lang="it">ti piace</i>, לו: <i lang="it">gli piace</i>, לה: <i lang="it">le piace</i>, לנו: <i lang="it">ci piace</i>.</p>
<h3>שמות תואר</h3>
<p>באים <b>אחרי</b> שם העצם ומתאימים במין ובמספר – בדיוק כמו בעברית: <i lang="it">una casa bianca, due case bianche</i>.</p>
<p>תואר שמסתיים ב-e זהה בזכר ובנקבה: <i lang="it">un uomo gentile, una donna gentile</i>.</p>`,
    items: [
      ['mi piace', 'אני אוהב (דבר אחד)', 'Mi piace molto Roma.', 'אני מאוד אוהב את רומא.'],
      ['mi piacciono', 'אני אוהב (כמה דברים)', 'Mi piacciono i film italiani.', 'אני אוהב סרטים איטלקיים.'],
      ['ti piace?', 'אתה אוהב?', 'Ti piace il gelato?', 'אתה אוהב גלידה?'],
      ['bello / bella', 'יפה', 'Che bella giornata!', 'איזה יום יפה!'],
      ['brutto / brutta', 'מכוער / רע', 'Che brutto tempo!', 'איזה מזג אוויר רע!'],
      ['grande', 'גדול', 'Una pizza grande, per favore.', 'פיצה גדולה, בבקשה.'],
      ['piccolo / piccola', 'קטן', 'Una camera piccola ma carina.', 'חדר קטן אבל חמוד.'],
      ['nuovo / nuova', 'חדש', 'Ho un telefono nuovo.', 'יש לי טלפון חדש.'],
      ['vecchio / vecchia', 'ישן / זקן', 'Una città vecchia e bellissima.', 'עיר עתיקה ויפהפייה.'],
      ['buono / buona', 'טוב / טעים', 'Questa pizza è buona.', 'הפיצה הזו טעימה.'],
      ['caro / cara', 'יקר', 'È troppo caro!', 'זה יקר מדי!'],
      ['economico', 'זול', 'Un albergo economico.', 'מלון זול.'],
      ['facile', 'קל', 'L\'italiano è facile!', 'איטלקית קלה!'],
      ['difficile', 'קשה', 'È difficile ma interessante.', 'זה קשה אבל מעניין.'],
      ['interessante', 'מעניין', 'Un libro molto interessante.', 'ספר מעניין מאוד.'],
      ['simpatico / simpatica', 'נחמד', 'Il cameriere è simpatico.', 'המלצר נחמד.'],
      ['caldo / freddo', 'חם / קר', 'Un caffè caldo.', 'קפה חם.'],
      ['troppo', 'יותר מדי', 'Fa troppo caldo.', 'חם מדי.'],
      ['poco', 'מעט', 'Ho poco tempo.', 'יש לי מעט זמן.'],
      ['tanto', 'הרבה', 'Grazie tante!', 'תודה רבה!'],
      ['perfetto', 'מושלם', 'Perfetto, grazie!', 'מושלם, תודה!'],
      ['Che bello!', 'איזה יופי!', 'Andiamo in Sicilia? Che bello!', 'נוסעים לסיציליה? איזה יופי!'],
    ],
  },
  {
    id: 'u12', it: 'La giornata', he: 'שגרת היום וימי השבוע', level: 'A2',
    grammar: `
<h3>פעלים חוזרים (riflessivi)</h3>
<p>כמו "התלבשתי / התרחצתי" בעברית (בניין התפעל) – הפעולה חוזרת אל העושה. באיטלקית מוסיפים כינוי לפני הפועל:</p>
<table>
<tr><td lang="it">mi alzo</td><td>אני קם</td></tr><tr><td lang="it">ti alzi</td><td>אתה קם</td></tr>
<tr><td lang="it">si alza</td><td>הוא קם</td></tr><tr><td lang="it">ci alziamo</td><td>אנחנו קמים</td></tr>
<tr><td lang="it">vi alzate</td><td>אתם קמים</td></tr><tr><td lang="it">si alzano</td><td>הם קמים</td></tr>
</table>
<p>💡 גם <i lang="it">mi chiamo</i> ("קוראים לי") הוא בעצם "אני קורא לעצמי".</p>
<h3>ימים</h3>
<p>בלי אות גדולה, וכל ימי השבוע זכר חוץ מ-<i lang="it">domenica</i>. "ביום שני" = <i lang="it">lunedì</i> (בלי מילת יחס). "בכל יום שני" = <i lang="it">il lunedì</i>.</p>`,
    items: [
      ['lunedì', 'יום שני', 'Lunedì comincio un nuovo lavoro.', 'ביום שני אני מתחיל עבודה חדשה.'],
      ['martedì', 'יום שלישי', 'Ci vediamo martedì.', 'נתראה ביום שלישי.'],
      ['mercoledì', 'יום רביעי', 'Il mercato è il mercoledì.', 'השוק ביום רביעי.'],
      ['giovedì', 'יום חמישי', 'Giovedì sera sono libero.', 'ביום חמישי בערב אני פנוי.'],
      ['venerdì', 'יום שישי', 'Venerdì andiamo a Venezia.', 'ביום שישי נוסעים לוונציה.'],
      ['sabato', 'שבת', 'Il sabato dormo tanto.', 'בשבת אני ישן הרבה.'],
      ['domenica', 'יום ראשון', 'La domenica pranzo con la famiglia.', 'ביום ראשון אני אוכל צהריים עם המשפחה.'],
      ['la settimana', 'השבוע', 'Due volte alla settimana.', 'פעמיים בשבוע.'],
      ['la mattina', 'הבוקר', 'La mattina bevo un caffè.', 'בבוקר אני שותה קפה.'],
      ['il pomeriggio', 'אחר הצהריים', 'Il pomeriggio lavoro.', 'אחר הצהריים אני עובד.'],
      ['la sera', 'הערב', 'La sera guardo la TV.', 'בערב אני רואה טלוויזיה.'],
      ['svegliarsi', 'להתעורר', 'Mi sveglio alle sette.', 'אני מתעורר בשבע.'],
      ['alzarsi', 'לקום', 'Mi alzo presto.', 'אני קם מוקדם.'],
      ['lavarsi', 'להתרחץ', 'Mi lavo e mi vesto.', 'אני מתרחץ ומתלבש.'],
      ['vestirsi', 'להתלבש', 'Ti vesti in fretta!', 'אתה מתלבש מהר!'],
      ['divertirsi', 'ליהנות / לבלות', 'Ci divertiamo molto!', 'אנחנו נהנים מאוד!'],
      ['riposarsi', 'לנוח', 'Domenica mi riposo.', 'ביום ראשון אני נח.'],
      ['di solito', 'בדרך כלל', 'Di solito ceno alle otto.', 'בדרך כלל אני אוכל ארוחת ערב בשמונה.'],
      ['spesso', 'לעתים קרובות', 'Vado spesso al cinema.', 'אני הולך הרבה לקולנוע.'],
      ['qualche volta', 'לפעמים', 'Qualche volta cucino io.', 'לפעמים אני מבשל.'],
      ['presto', 'מוקדם / בקרוב', 'A presto!', 'נתראה בקרוב!'],
      ['tardi', 'מאוחר', 'È tardi, andiamo!', 'מאוחר, בואו נלך!'],
    ],
  },
  {
    id: 'u13', it: 'Il passato', he: 'זמן עבר (passato prossimo)', level: 'A2',
    grammar: `
<h3>עבר = עזר + בינוני פעול</h3>
<p>כמו באנגלית "I have eaten": <i lang="it">ho mangiato</i> = אכלתי.</p>
<p>בינוני פעול: <b>-are → -ato</b>, <b>-ere → -uto</b>, <b>-ire → -ito</b> (mangiato, avuto, dormito).</p>
<h3>avere או essere?</h3>
<ul>
<li>רוב הפעלים: <b>avere</b> – <i lang="it">ho visto, hai fatto</i>.</li>
<li>תנועה/שינוי מצב (ללכת, לבוא, להגיע, לצאת, להישאר, להיוולד) ופעלים חוזרים: <b>essere</b> – <i lang="it">sono andato, è arrivata, mi sono svegliato</i>.</li>
</ul>
<p>עם essere, הסיומת מתאימה במין ובמספר – כמו בעברית "הלכתי/הלכה": <i lang="it">Marco è andato, Anna è andata, siamo andati</i>.</p>
<h3>חריגים נפוצים</h3>
<p><i lang="it">fare → fatto, dire → detto, vedere → visto, prendere → preso, essere → stato, leggere → letto, scrivere → scritto, venire → venuto, mettere → messo, aprire → aperto</i>.</p>`,
    items: [
      ['ho mangiato', 'אכלתי', 'Ho mangiato una pizza fantastica.', 'אכלתי פיצה מדהימה.'],
      ['sono andato / sono andata', 'הלכתי / נסעתי', 'Ieri sono andata al mare.', 'אתמול הלכתי לים.'],
      ['ho fatto', 'עשיתי', 'Cosa hai fatto ieri?', 'מה עשית אתמול?'],
      ['ho visto', 'ראיתי', 'Ho visto un bel film.', 'ראיתי סרט יפה.'],
      ['ho detto', 'אמרתי', 'Te l\'ho detto!', 'אמרתי לך!'],
      ['ho preso', 'לקחתי', 'Ho preso il treno delle otto.', 'לקחתי את הרכבת של שמונה.'],
      ['sono stato / sono stata', 'הייתי', 'Sei mai stato in Italia?', 'היית פעם באיטליה?'],
      ['sono arrivato', 'הגעתי', 'Sono arrivato a Milano ieri sera.', 'הגעתי למילאנו אתמול בערב.'],
      ['ho capito', 'הבנתי', 'Ah, ho capito!', 'אה, הבנתי!'],
      ['ho comprato', 'קניתי', 'Ho comprato un regalo per te.', 'קניתי לך מתנה.'],
      ['ho letto', 'קראתי', 'Ho letto il libro in due giorni.', 'קראתי את הספר ביומיים.'],
      ['ho dormito', 'ישנתי', 'Ho dormito benissimo.', 'ישנתי מצוין.'],
      ['è piaciuto', 'זה מצא חן (עבר)', 'Ti è piaciuto il museo?', 'נהנית מהמוזיאון?'],
      ['sono uscito', 'יצאתי', 'Sabato sono uscito con gli amici.', 'בשבת יצאתי עם חברים.'],
      ['mi sono svegliato', 'התעוררתי', 'Mi sono svegliato tardi.', 'התעוררתי מאוחר.'],
      ['la settimana scorsa', 'בשבוע שעבר', 'La settimana scorsa ho lavorato molto.', 'בשבוע שעבר עבדתי הרבה.'],
      ['l\'anno scorso', 'בשנה שעברה', 'L\'anno scorso sono andato a Napoli.', 'בשנה שעברה נסעתי לנאפולי.'],
      ['fa', 'לפני (זמן)', 'Due giorni fa.', 'לפני יומיים.'],
      ['già', 'כבר', 'Hai già mangiato?', 'כבר אכלת?'],
      ['non… ancora', 'עוד לא', 'Non ho ancora deciso.', 'עוד לא החלטתי.'],
      ['poi', 'אחר כך', 'Prima un caffè, poi andiamo.', 'קודם קפה, אחר כך הולכים.'],
      ['dopo', 'אחרי / אחר כך', 'Ci sentiamo dopo.', 'נדבר אחר כך.'],
    ],
  },
  {
    id: 'u14', it: 'Negozi e salute', he: 'קניות ובריאות', level: 'A2',
    grammar: `
<h3>כינויי מושא – lo, la, li, le</h3>
<p>בעברית: "אני לוקח <b>אותו</b>". באיטלקית הכינוי בא <b>לפני</b> הפועל:</p>
<ul>
<li><i lang="it">Lo prendo</i> = אני לוקח אותו (ז').</li>
<li><i lang="it">La prendo</i> = אני לוקח אותה (נ').</li>
<li><i lang="it">Li prendo / Le prendo</i> = אני לוקח אותם / אותן.</li>
</ul>
<p>"אותי / אותך / אותנו": <i lang="it">mi, ti, ci</i>. "לי / לך": <i lang="it">mi, ti</i> (<i lang="it">Mi dai…?</i> = תיתן לי…?).</p>
<h3>כואב לי</h3>
<p>שוב מבנה כמו piacere: <i lang="it">Mi fa male la testa</i> ("הראש עושה לי כאב"). או בקיצור: <i lang="it">Ho mal di testa</i>.</p>`,
    items: [
      ['il negozio', 'החנות', 'Il negozio chiude alle otto.', 'החנות נסגרת בשמונה.'],
      ['il mercato', 'השוק', 'Compro la frutta al mercato.', 'אני קונה פירות בשוק.'],
      ['il supermercato', 'הסופרמרקט', 'Vado al supermercato.', 'אני הולך לסופר.'],
      ['Posso provare?', 'אפשר למדוד?', 'Posso provare questa giacca?', 'אפשר למדוד את הז\'קט הזה?'],
      ['la taglia', 'המידה (בגדים)', 'Avete una taglia più grande?', 'יש לכם מידה גדולה יותר?'],
      ['le scarpe', 'הנעליים', 'Queste scarpe sono comode.', 'הנעליים האלה נוחות.'],
      ['la maglietta', 'החולצה (טי-שירט)', 'Una maglietta bianca.', 'חולצה לבנה.'],
      ['lo sconto', 'ההנחה', 'C\'è uno sconto?', 'יש הנחה?'],
      ['Lo prendo', 'אני לוקח אותו', 'Mi piace, lo prendo!', 'מוצא חן בעיניי, אני לוקח אותו!'],
      ['rosso', 'אדום', 'Un vestito rosso.', 'שמלה אדומה.'],
      ['bianco', 'לבן', 'Vino bianco o rosso?', 'יין לבן או אדום?'],
      ['nero', 'שחור', 'Un caffè nero.', 'קפה שחור.'],
      ['blu', 'כחול', 'Il mare è blu.', 'הים כחול.'],
      ['verde', 'ירוק', 'Gli occhi verdi.', 'עיניים ירוקות.'],
      ['la farmacia', 'בית המרקחת', 'C\'è una farmacia aperta?', 'יש בית מרקחת פתוח?'],
      ['il medico', 'הרופא', 'Devo andare dal medico.', 'אני צריך ללכת לרופא.'],
      ['Mi fa male…', 'כואב לי ה…', 'Mi fa male la gamba.', 'כואבת לי הרגל.'],
      ['ho mal di testa', 'יש לי כאב ראש', 'Ho mal di testa, hai un\'aspirina?', 'יש לי כאב ראש, יש לך אספירין?'],
      ['la testa', 'הראש', 'Mi gira la testa.', 'מסתובב לי הראש.'],
      ['la pancia', 'הבטן', 'Mi fa male la pancia.', 'כואבת לי הבטן.'],
      ['Aiuto!', 'הצילו!', 'Aiuto! Chiamate un\'ambulanza!', 'הצילו! תזמינו אמבולנס!'],
      ['la carta (di credito)', 'כרטיס האשראי', 'Accettate la carta?', 'אתם מקבלים כרטיס?'],
    ],
  },
  {
    id: 'u15', it: 'Parlare davvero', he: 'מילות שאלה, קישור ורגש', level: 'A2',
    grammar: `
<h3>מילות שאלה</h3>
<p><i lang="it">chi</i> (מי), <i lang="it">che cosa / cosa</i> (מה), <i lang="it">dove</i> (איפה), <i lang="it">quando</i> (מתי), <i lang="it">come</i> (איך), <i lang="it">perché</i> (למה – וגם "כי"!), <i lang="it">quanto</i> (כמה), <i lang="it">quale</i> (איזה).</p>
<h3>מילות "דבק" לשיחה טבעית</h3>
<p>אלה המילים שהופכות תשובות קצרות לשיחה. דוברים טבעיים משתמשים בהן כל הזמן:</p>
<p><i lang="it">allora</i> (אז…), <i lang="it">quindi</i> (לכן), <i lang="it">però</i> (אבל), <i lang="it">comunque</i> (בכל מקרה), <i lang="it">magari</i> (אולי / הלוואי), <i lang="it">dai!</i> (נו!/יאללה), <i lang="it">boh</i> (אין לי מושג).</p>
<p>💡 <i lang="it">perché</i> משמש גם לשאלה וגם לתשובה: <i lang="it">Perché? – Perché sono stanco.</i></p>`,
    items: [
      ['chi', 'מי', 'Chi è quella ragazza?', 'מי הבחורה ההיא?'],
      ['cosa', 'מה', 'Cosa vuoi fare?', 'מה אתה רוצה לעשות?'],
      ['dove', 'איפה / לאן', 'Dove andiamo?', 'לאן הולכים?'],
      ['quando', 'מתי', 'Quando parti?', 'מתי אתה נוסע?'],
      ['come', 'איך / כמו', 'Come funziona?', 'איך זה עובד?'],
      ['perché', 'למה / כי', 'Perché ridi?', 'למה אתה צוחק?'],
      ['quanto', 'כמה', 'Quanto tempo ci vuole?', 'כמה זמן זה לוקח?'],
      ['quale', 'איזה', 'Quale preferisci?', 'איזה אתה מעדיף?'],
      ['allora', 'אז', 'Allora, cosa facciamo?', 'אז, מה עושים?'],
      ['quindi', 'לכן', 'Piove, quindi resto a casa.', 'יורד גשם, לכן אני נשאר בבית.'],
      ['però', 'אבל', 'È caro, però è bello.', 'זה יקר, אבל יפה.'],
      ['ma', 'אבל', 'Vorrei venire, ma non posso.', 'הייתי רוצה לבוא, אבל אני לא יכול.'],
      ['comunque', 'בכל מקרה', 'Comunque, grazie lo stesso.', 'בכל מקרה, תודה בכל זאת.'],
      ['magari', 'אולי / הלוואי', 'Magari domani!', 'אולי מחר! / הלוואי!'],
      ['Dai!', 'נו! / יאללה!', 'Dai, andiamo!', 'יאללה, הולכים!'],
      ['davvero?', 'באמת?', 'Davvero? Non ci credo!', 'באמת? אני לא מאמין!'],
      ['certo', 'בטח / כמובן', 'Certo, nessun problema.', 'בטח, אין בעיה.'],
      ['Peccato!', 'חבל!', 'Non puoi venire? Peccato!', 'אתה לא יכול לבוא? חבל!'],
      ['Non vedo l\'ora!', 'אני לא יכול לחכות!', 'Domani parto per Roma, non vedo l\'ora!', 'מחר אני טס לרומא, אני לא יכול לחכות!'],
      ['triste', 'עצוב', 'Perché sei triste?', 'למה אתה עצוב?'],
      ['preoccupato', 'מודאג', 'Sono un po\' preoccupato.', 'אני קצת מודאג.'],
      ['Va bene', 'בסדר / מתאים', 'Alle otto va bene?', 'בשמונה מתאים?'],
    ],
  },
  {
    id: 'u16', it: 'Il futuro e i progetti', he: 'עתיד ותוכניות', level: 'A2',
    grammar: `
<h3>עתיד – futuro semplice</h3>
<p>מורידים את ה-e הסופית ומוסיפים: <b>-ò, -ai, -à, -emo, -ete, -anno</b>. בפעלי are, ה-a הופכת ל-e:</p>
<p><i lang="it">parlare → parlerò</i> (אדבר), <i lang="it">prendere → prenderò</i>, <i lang="it">partire → partirò</i>.</p>
<p>חריגים: <i lang="it">essere → sarò, avere → avrò, andare → andrò, fare → farò, venire → verrò, potere → potrò, volere → vorrò</i>.</p>
<h3>💡 הקלה גדולה</h3>
<p>לתוכניות קרובות איטלקים משתמשים פשוט ב<b>הווה</b>: <i lang="it">Domani vado a Roma</i> = מחר אסע לרומא. אין מבנה של "going to".</p>
<p>לתקוות ותוכניות: <i lang="it">Spero di…</i> (אני מקווה ל…), <i lang="it">Ho intenzione di…</i> (אני מתכוון ל…), <i lang="it">Mi piacerebbe…</i> (הייתי רוצה…).</p>`,
    items: [
      ['sarò', 'אהיה', 'Sarò a Roma a giugno.', 'אהיה ברומא ביוני.'],
      ['andrò', 'אלך / אסע', 'Andrò in Italia quest\'estate.', 'אסע לאיטליה הקיץ.'],
      ['farò', 'אעשה', 'Farò del mio meglio.', 'אעשה כמיטב יכולתי.'],
      ['avrò', 'יהיה לי', 'Avrò più tempo la settimana prossima.', 'יהיה לי יותר זמן בשבוע הבא.'],
      ['vedrò', 'אראה', 'Vedrò cosa posso fare.', 'אראה מה אני יכול לעשות.'],
      ['Spero di…', 'אני מקווה ל…', 'Spero di tornare presto.', 'אני מקווה לחזור בקרוב.'],
      ['Mi piacerebbe…', 'הייתי רוצה…', 'Mi piacerebbe vivere in Toscana.', 'הייתי רוצה לגור בטוסקנה.'],
      ['Ho intenzione di…', 'אני מתכוון ל…', 'Ho intenzione di imparare bene l\'italiano.', 'אני מתכוון ללמוד איטלקית היטב.'],
      ['la settimana prossima', 'בשבוע הבא', 'Ci vediamo la settimana prossima.', 'נתראה בשבוע הבא.'],
      ['il prossimo anno', 'בשנה הבאה', 'Il prossimo anno vado in Sicilia.', 'בשנה הבאה אני נוסע לסיציליה.'],
      ['l\'estate', 'הקיץ', 'D\'estate fa molto caldo.', 'בקיץ חם מאוד.'],
      ['l\'inverno', 'החורף', 'In inverno nevica in montagna.', 'בחורף יורד שלג בהרים.'],
      ['la vacanza', 'החופשה', 'Buone vacanze!', 'חופשה נעימה!'],
      ['il viaggio', 'הנסיעה / הטיול', 'Buon viaggio!', 'נסיעה טובה!'],
      ['visitare', 'לבקר (במקום)', 'Voglio visitare Venezia.', 'אני רוצה לבקר בוונציה.'],
      ['decidere', 'להחליט', 'Non ho ancora deciso.', 'עוד לא החלטתי.'],
      ['forse', 'אולי', 'Forse vengo anch\'io.', 'אולי גם אני אבוא.'],
      ['sicuramente', 'בוודאות', 'Sicuramente tornerò!', 'בוודאות אחזור!'],
      ['tra', 'בעוד (זמן)', 'Parto tra due settimane.', 'אני נוסע בעוד שבועיים.'],
      ['il sogno', 'החלום', 'È il mio sogno.', 'זה החלום שלי.'],
      ['In bocca al lupo!', 'בהצלחה! (תשובה: Crepi!)', 'Domani hai l\'esame? In bocca al lupo!', 'מחר יש לך מבחן? בהצלחה!'],
      ['Buona fortuna!', 'בהצלחה! / מזל טוב', 'Buona fortuna con il nuovo lavoro!', 'בהצלחה בעבודה החדשה!'],
    ],
  },
];

// תרחישי שיחה עם המורה – משימות אמיתיות (Task-Based Language Teaching)
export const SCENARIOS = [
  { id: 'free', icon: '💬', he: 'שיחה חופשית', it: 'Chiacchierata', minUnit: 0,
    setup: 'A friendly casual chat. You are Giulia, a warm Italian from Bologna. Ask the learner about their day, life and interests.' },
  { id: 'bar', icon: '☕', he: 'הזמנה בבית קפה', it: 'Al bar', minUnit: 6,
    setup: 'You are a barista in a busy café in Rome. Greet the customer, take their order, tell them the price, and handle payment.' },
  { id: 'rest', icon: '🍝', he: 'ארוחה במסעדה', it: 'Al ristorante', minUnit: 7,
    setup: 'You are a waiter in a trattoria in Florence. Seat the customer, recommend dishes, take the order, and later bring the bill.' },
  { id: 'meet', icon: '🤝', he: 'היכרות עם איטלקי', it: 'Conoscersi', minUnit: 2,
    setup: 'You are Luca, a 30-year-old Italian the learner just met at a party. Get to know each other: names, where from, work, family, hobbies.' },
  { id: 'hotel', icon: '🏨', he: 'צ\'ק-אין במלון', it: 'In albergo', minUnit: 10,
    setup: 'You are a hotel receptionist in Venice. Handle the check-in: name, reservation, passport, breakfast hours, Wi-Fi, room number.' },
  { id: 'dir', icon: '🧭', he: 'לשאול על הדרך', it: 'Chiedere la strada', minUnit: 10,
    setup: 'You are a local in Naples. The learner is lost and asks for directions to the station / a museum. Give simple directions.' },
  { id: 'train', icon: '🚆', he: 'קניית כרטיס רכבת', it: 'In stazione', minUnit: 10,
    setup: 'You are a ticket clerk at Milano Centrale. Sell a train ticket: destination, time, one-way or return, platform, price.' },
  { id: 'shop', icon: '👟', he: 'קניות בחנות בגדים', it: 'In negozio', minUnit: 14,
    setup: 'You are a shop assistant in a clothing store. Help the customer find an item, size, color, try it on, and pay.' },
  { id: 'doc', icon: '💊', he: 'בבית המרקחת', it: 'In farmacia', minUnit: 14,
    setup: 'You are a pharmacist. The customer feels unwell. Ask about symptoms and suggest something simple.' },
  { id: 'past', icon: '📸', he: 'לספר על סוף השבוע', it: 'Il mio weekend', minUnit: 13,
    setup: 'You are Giulia, a friend. Ask the learner what they did last weekend and on their last trip. Encourage use of the past tense (passato prossimo).' },
  { id: 'plans', icon: '✈️', he: 'לתכנן טיול לאיטליה', it: 'Progetti di viaggio', minUnit: 16,
    setup: 'You are Giulia, an Italian friend helping the learner plan a trip to Italy: where, when, what to see and eat.' },
];

export const STORY_TOPICS = [
  'יום ראשון בשוק', 'פגישה בבית קפה ברומא', 'נסיעה ברכבת לפירנצה', 'ארוחת ערב משפחתית',
  'חתול שאבד בוונציה', 'יום בחוף בסיציליה', 'הזמנת פיצה בנאפולי', 'בוקר עמוס בעבודה',
  'טיול בהרי הדולומיטים', 'מתכון של סבתא', 'כדורגל ביום ראשון', 'חנות ספרים קטנה',
];
