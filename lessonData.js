/* ══════════════════════════════════════════════════════════════
   lessonData.js — All lesson / verse / lyric data for
   Sarali Varisai Animator.  Loaded as a classic <script> before
   the main IIFE in index.html; every symbol here is page-global.
══════════════════════════════════════════════════════════════ */
'use strict';

/* ── Shared constants ─────────────────────────────────────── */
const S_HI = '\u1E60'; // Ṡ  upper-octave Sa  (S with dot above)
const R_HI = '\u1E58'; // Ṙ  upper-octave Ri  (R with dot above)

/* ── Mayamalavagowla pitch map ────────────────────────────── */
const _P = {
    's': 0.0, 'r': 0.5, 'g': 2.0, 'm': 2.5,
    'p': 3.5, 'd': 4.0, 'n': 5.5,
    [S_HI]: 6.0, [R_HI]: 6.5,
};
function MN(l) { return { label: l, pitch: _P[l] }; }
const [s, r, g, m, p, d, n, S] = ['s','r','g','m','p','d','n', S_HI].map(MN);
const r_hi = MN(R_HI);   // upper-octave Ri

/* ── Malahari pitch map (Geethams) ────────────────────────── */
// Aroha: S R M P D S' (R' in extended); Ga/Ni present in avaroha
const _PM = {
    's': 0.0, 'r': 0.5, 'g': 2.0, 'm': 2.5,
    'p': 3.5, 'd': 4.0, 'n': 5.5,
    [S_HI]: 6.0, [R_HI]: 6.5,
};
function MM(l)      { return { label: l, pitch: _PM[l], lyric: '' }; }
function ML(l, ly)  { return { label: l, pitch: _PM[l], lyric: ly }; }

/* ════════════════════════════════════════════════════════════
   GRADE 1 — SARALI VARISAI  (14 distinct verses, Mayamalavagowla)
════════════════════════════════════════════════════════════ */
const SARALI_VERSES = [
  { title:'Verse 1',
    line1:[s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,m,g,r,s] },
  { title:'Verse 2',
    line1:[s,r,s,r,s,r,g,m,p,d,n,S],
    line2:[S,n,S,n,S,n,d,p,m,g,r,s] },
  { title:'Verse 3',
    line1:[s,r,g,s,r,g,s,r,g,m,p,d,n,S],
    line2:[S,n,d,S,n,d,S,n,d,p,m,g,r,s] },
  { title:'Verse 4',
    line1:[s,r,g,m,s,r,g,m,s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,S,n,d,p,m,g,r,s] },
  { title:'Verse 5',
    line1:[s,r,g,m,p,s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,m,S,n,d,p,m,g,r,s] },
  { title:'Verse 6',
    line1:[s,r,g,m,p,d,s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,m,g,S,n,d,p,m,g,r,s] },
  { title:'Verse 7',
    line1:[s,r,g,m,p,d,n,s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,m,g,r,S,n,d,p,m,g,r,s] },
  { title:'Verse 8',
    line1:[s,r,g,m,p,m,g,r,s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,m,p,d,n,S,n,d,p,m,g,r,s] },
  { title:'Verse 9',
    line1:[s,r,g,m,p,m,d,p,s,r,g,m,p,d,n,S],
    line2:[S,n,d,p,m,p,g,m,S,n,d,p,m,g,r,s] },
  { title:'Verse 10',
    line1:[s,r,g,m,p,g,m,p,d,n,d,p,m,g,m,p],
    line2:[g,m,p,d,n,d,p,m,g,m,p,g,m,g,r,s] },
  { title:'Verse 11',
    line1:[S,n,d,p,n,d,p,m,d,p,m,g,m,g,r,s],
    line2:[g,m,p,d,n,d,p,m,g,m,p,g,m,g,r,s] },
  { title:'Verse 12',
    line1:[S,S,n,d,n,n,d,p,d,d,p,m,p,m,g,r],
    line2:[g,m,p,d,n,d,p,m,g,m,p,g,m,g,r,s] },
  { title:'Verse 13',
    line1:[s,r,g,r,g,m,p,m,p,d,n,S],
    line2:[S,n,d,p,m,p,d,p,m,g,r,s] },
  { title:'Verse 14',
    line1:[s,r,g,m,p,p,d,d,n,S,S,n,d,p,m,g,r,s],
    line2:[s,r,g,m,p,d,n,S,n,d,p,m,g,r,s] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 2 — JANTA VARISAI  (8 verses, Mayamalavagowla)
   Double-note (janta) exercises
════════════════════════════════════════════════════════════ */
const JANTA_VERSES = [
  { title:'Verse 1',
    line1:[s,s,r,r,g,g,m,m, p,p,d,d,n,n,S,S],
    line2:[S,S,n,n,d,d,p,p, m,m,g,g,r,r,s,s] },
  { title:'Verse 2',
    line1:[s,s,r,r,g,g,m,m, r,r,g,g,m,m,p,p, g,g,m,m,p,p,d,d, m,m,p,p,d,d,n,n, p,p,d,d,n,n,S,S],
    line2:[S,S,n,n,d,d,p,p, n,n,d,d,p,p,m,m, d,d,p,p,m,m,g,g, p,p,m,m,g,g,r,r, m,m,g,g,r,r,s,s] },
  { title:'Verse 3',
    line1:[s,s,r,r,s,r,s,r, g,m,p,d,n,S],
    line2:[S,S,n,n,S,n,S,n, d,p,m,g,r,s] },
  { title:'Verse 4',
    line1:[r,r,g,g,m,m,p,p, d,d,n,n,S,S,r_hi,r_hi],
    line2:[r_hi,r_hi,S,S,n,n,d,d, p,p,m,m,g,g,r,r] },
  { title:'Verse 5',
    line1:[s,s,s,r,r,r, g,g,g,m,m,m, p,p,p,d,d,d, n,n,n,S,S,S],
    line2:[S,S,S,n,n,n, d,d,d,p,p,p, m,m,m,g,g,g, r,r,r,s,s,s] },
  { title:'Verse 6',
    line1:[s,s,r,r,g,g,m,m, r,r,g,g,m,m,p,p, g,g,m,m,p,p,d,d],
    line2:[m,m,p,p,d,d,n,n, p,p,d,d,n,n,S,S, S,S,n,n,d,d,p,p, m,m,g,g,r,r,s,s] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 3 — DATU VARISAI  (3 verses, Mayamalavagowla)
   Zigzag / skip-note patterns
════════════════════════════════════════════════════════════ */
const DATU_VERSES = [
  /* Verse 1 — skip-2 doubles (ss mm rr gg …) */
  { title:'Verse 1',
    line1:[s,s,m,m,r,r,g,g, r,r,p,p,g,g,m,m, g,g,d,d,m,m,p,p, m,m,n,n,p,p,d,d, p,p,S,S,d,d,n,n],
    line2:[S,S,p,p,n,n,d,d, n,n,m,m,d,d,p,p, d,d,g,g,p,p,m,m, p,p,r,r,m,m,g,g, m,m,s,s,g,g,r,r] },

  /* Verse 2 — alternating skip (s m g m r g s r …) */
  { title:'Verse 2',
    line1:[
      s,m,g,m,r,g,s,r,  s,g,r,g,s,r,g,m,
      r,p,m,p,g,m,r,g,  r,m,g,m,r,g,m,p,
      g,d,p,d,m,p,g,m,  g,p,m,p,g,m,p,d,
      m,n,d,n,p,d,m,p,  m,d,p,d,m,p,d,n,
      p,S,n,S,d,n,p,d,  p,n,d,n,p,d,n,S,
    ],
    line2:[
      S,p,d,p,n,d,S,n,  S,d,n,d,S,n,d,p,
      n,m,p,m,d,p,n,d,  n,p,d,p,n,d,p,m,
      d,g,m,g,p,m,d,p,  d,m,p,m,d,p,m,g,
      p,r,g,r,m,g,p,m,  p,g,m,g,p,m,g,r,
      m,s,r,s,g,r,m,g,  m,r,g,r,m,g,r,s,
    ] },

  /* Verse 3 — four-note zigzag (s r s g r g r m …) */
  { title:'Verse 3',
    line1:[
      s,r,s,g,r,g,r,m,  s,m,g,r,s,r,g,m,
      r,g,r,m,g,m,g,p,  r,p,m,g,r,g,m,p,
      g,m,g,p,m,p,m,d,  g,d,p,m,g,m,p,d,
      m,p,m,d,p,d,p,n,  m,n,d,p,m,p,d,n,
      p,d,p,n,d,n,d,S,  p,S,n,d,p,d,n,S,
    ],
    line2:[
      S,n,S,d,n,d,n,p,  S,p,d,n,S,n,d,p,
      n,d,n,p,d,p,d,m,  n,m,p,d,n,d,p,m,
      d,p,d,m,p,m,p,g,  d,g,m,p,d,p,m,g,
      p,m,p,g,m,g,m,r,  p,r,g,m,p,m,g,r,
      m,g,m,r,g,r,g,s,  m,s,r,g,m,g,r,s,
    ] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 4 — ALANKARAMS  (7 talas, Mayamalavagowla)
   Core pattern shifts by one note per row (s r g m → r g m p → …)
════════════════════════════════════════════════════════════ */
const ALANKARAM_VERSES = [
  /* A1 — Dhruva Tala (14 beats, treat as 8-per-row for chart) */
  { title:'Dhruva (14)', tala:'Chatusra \u00B7 Dhruva', talaInfo:'Dhruva Tala — 14 beats: 4+2+4+4',
    line1:[
      s,r,g,m,g,r,s,r,  r,g,m,p,m,g,r,g,
      g,m,p,d,p,m,g,m,  m,p,d,n,d,p,m,p,
      p,d,n,S,n,d,p,d,
    ],
    line2:[
      S,n,d,p,d,n,S,n,  n,d,p,m,p,d,n,d,
      d,p,m,g,m,p,d,p,  p,m,g,r,g,m,p,m,
      m,g,r,s,r,g,m,g,
    ] },

  /* A2 — Matya Tala (10 beats) */
  { title:'Matya (10)', tala:'Chatusra \u00B7 Matya', talaInfo:'Matya Tala — 10 beats: 4+2+4',
    line1:[
      s,r,g,r,s,r,g,m,  r,g,m,g,r,g,m,p,
      g,m,p,m,g,m,p,d,  m,p,d,p,m,p,d,n,
      p,d,n,d,p,d,n,S,
    ],
    line2:[
      S,n,d,n,S,n,d,p,  n,d,p,d,n,d,p,m,
      d,p,m,p,d,p,m,g,  p,m,g,m,p,m,g,r,
      m,g,r,g,m,g,r,s,
    ] },

  /* A3 — Roopaka Tala (6 beats; phrases are 6 notes) */
  { title:'Roopaka (6)', tala:'Chatusra \u00B7 Roopaka', talaInfo:'Roopaka Tala — 6 beats: 2+4',
    line1:[
      s,r,s,r,g,m,  r,g,r,g,m,p,
      g,m,g,m,p,d,  m,p,m,p,d,n,
      p,d,p,d,n,S,
    ],
    line2:[
      S,n,S,n,d,p,  n,d,n,d,p,m,
      d,p,d,p,m,g,  p,m,p,m,g,r,
      m,g,m,g,r,s,
    ] },

  /* A4 — Jhampa Tala (complex) */
  { title:'Jhampa (10)', tala:'Mishra \u00B7 Jhampa', talaInfo:'Jhampa Tala — 10 beats: 7+1+2', comingSoon:true },

  /* A5 — Triputa Tala (7 beats; phrases are 7 notes) */
  { title:'Triputa (7)', tala:'Tishra \u00B7 Triputa', talaInfo:'Triputa Tala — 7 beats: 3+2+2',
    line1:[
      s,r,g,s,r,g,m,  r,g,m,r,g,m,p,
      g,m,p,g,m,p,d,  m,p,d,m,p,d,n,
      p,d,n,p,d,n,S,
    ],
    line2:[
      S,n,d,S,n,d,p,  n,d,p,n,d,p,m,
      d,p,m,d,p,m,g,  p,m,g,p,m,g,r,
      m,g,r,m,g,r,s,
    ] },

  /* A6 — Ata Tala (complex) */
  { title:'Ata (14)', tala:'Khanda \u00B7 Ata', talaInfo:'Ata Tala — 14 beats: 5+5+2+2', comingSoon:true },

  /* A7 — Eka Tala (4 beats; simplest) */
  { title:'Eka (4)', tala:'Chatusra \u00B7 Eka', talaInfo:'Eka Tala — 4 beats',
    line1:[s,r,g,m, r,g,m,p, g,m,p,d, m,p,d,n, p,d,n,S],
    line2:[S,n,d,p, n,d,p,m, d,p,m,g, p,m,g,r, m,g,r,s] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 5 — GEETHAMS  (Malahari raga, with lyric syllables)
   Each note object: { label, pitch, lyric }
   lyric="-" means held note (display blank)
════════════════════════════════════════════════════════════ */
const GEETHAM_VERSES = [
  /* G1 — Śrī Gaṇanātha (Lambodara) | Rupakam | Lord Ganesha */
  { title:'\u015ar\u012b Ga\u1e47an\u0101tha', raga:'Malahari', tala:'Chatusra \u00B7 Rupakam', deity:'Lord Ganesha',
    line1:[
      ML('m','\u015ar\u012b'), ML('p','ga'),  ML('d','\u1e47a'), ML(S_HI,'n\u0101'), ML(S_HI,'tha'), ML(R_HI,'-'),
      ML(R_HI,'sin'),    ML(S_HI,'dh\u016b'), ML('d','-'),      ML('p','ra'),        ML('m','var'),    ML('p','\u1e47a'),
      ML('r','ka'),      ML('m','ru'),         ML('p','\u1e47\u0101'), ML('d','s\u0101'), ML('m','ga'),  ML('p','ra'),
      ML('d','ka'),      ML('p','ri'),         ML('m','va'),     ML('g','da'),        ML('r','na'),     ML('s','-'),
    ],
    line2:[
      ML('s','Lam'),  ML('r','-'),   ML('m','bo'), ML('g','-'),   ML('r','da'),  ML('s','ra'),
      ML('s','la'),   ML('r','ku'),  ML('g','mi'), ML('r','ka'),  ML('s','ra'),  ML('s','-'),
    ] },

  /* G2 — Kunda Gowra | Rupakam | Lord Krishna */
  { title:'Kunda Gowra', raga:'Malahari', tala:'Chatusra \u00B7 Rupakam', deity:'Lord Krishna',
    line1:[
      ML('d','kun'),  ML('p','dha'), ML('m','gow'), ML('g','-'),  ML('r','-'),  ML('s','ra'),
      ML('r','gow'),  ML('m','ri'),  ML('p','-'),   ML('d','va'), ML('m','ra'), ML('p','-'),
      ML('d','man'),  ML('r','-'),   ML('r','di'),  ML('s','ra'), ML('d','-'),  ML('p','ya'),
    ],
    line2:[] },

  /* G3 — Padman\u0101bha | Triputa | Lord Vishnu */
  { title:'Padman\u0101bha', raga:'Malahari', tala:'Chatusra \u00B7 Triputa', deity:'Lord Vishnu',
    line1:[
      ML('s','Pa'),    ML('r','du'),  ML('m','ma'),  ML('p','n\u0101'), ML('d','bha'), ML(S_HI,'-'),   ML(R_HI,'-'),
      ML(R_HI,'pa'),   ML(S_HI,'ra'), ML('d','-'),   ML('p','ma'),      ML('m','-'),   ML('g','pu'),    ML('r','ru'),
      ML('s','\u1e63\u0101'), ML('s','-'), ML('s','-'), ML('s','-'),    ML('s','-'),   ML('s','-'),     ML('s','-'),
    ],
    line2:[] },

  /* G4 — Keraya Neeranu | Triputa | Lord Vishnu */
  { title:'Keraya Neeranu', raga:'Malahari', tala:'Chatusra \u00B7 Triputa', deity:'Lord Vishnu',
    line1:[
      ML('s','ke'),  ML('r','re'),  ML('m','ya'),   ML('p','nee'), ML('d','ra'),  ML('s','nu'),  ML('s','-'),
      ML('s','ke'),  ML('r','re'),  ML('d','-'),    ML('p','ge'),  ML('m','-'),   ML('p','jal'), ML('p','li'),
      ML('d','va'),  ML('s','ra'),  ML('s','va'),   ML('r','pa'),  ML('d','de'),  ML('p','da'),  ML('m','-'),
    ],
    line2:[] },

  /* G5 — Placeholder */
  { title:'Kundagowra (Variant)', comingSoon:true },
];

/* ════════════════════════════════════════════════════════════
   SHANKARABHARANAM PITCH MAP  (shifted +6 so ṡ=0)
   Lower: ṡ(0) ḋ(4) ṅ(5.5)  Middle: s(6) r(6.5) g(8) m(8.5) p(9.5) d(10) n(11.5)
   Upper: Ṡ(12) Ṙ(12.5)
════════════════════════════════════════════════════════════ */
const _PSH = {
    '\u1E61':0.0, '\u1E0B':4.0, '\u1E45':5.5,
    's':6.0, 'r':6.5, 'g':8.0, 'm':8.5,
    'p':9.5, 'd':10.0, 'n':11.5,
    '\u1E60':12.0, '\u1E58':12.5,
};
function SN(l,ly){return{label:l,pitch:_PSH[l]!==undefined?_PSH[l]:6.0,lyric:ly||''};}
function SH(p,ly){return{label:'-',pitch:p,lyric:ly||'-'};}

/* NT_SANTATAM — Santatam P\u0101him\u0101m  (God Save the Queen tune, 48 notes) */
const NT_SANTATAM=[
    SN('s','san'),SN('s','ta'),SN('r','tam'),SN('g','p\u0101'),SH(8,'hi'),SN('m','m\u0101\u1e43'),
    SN('p','san'),SH(9.5,'g\u012b'),SN('d','ta'),SN('n','\u015by\u0101'),SH(11.5,'ma'),SN('\u1E60','l\u0113'),
    SN('\u1E60','sar'),SH(12,'v\u0101'),SN('n','dh\u0101'),SN('d','r\u0113'),SH(10,'ja'),SN('p','na'),
    SN('m','ni'),SH(8.5,'cin'),SN('g','ti'),SN('r','t\u0101r'),SH(6.5,'tha'),SN('s','pr\u0113'),
    SN('g','cid'),SN('m','r\u016b'),SN('p','pi'),SN('d','\u1e47i'),SN('n','\u015bi'),SN('\u1E60','v\u0113'),
    SN('\u1E58','\u015br\u012b'),SN('\u1E60','gu'),SN('n','ru'),SN('d','gu'),SN('p','ha'),SN('m','s\u0113'),
    SN('g','vi'),SN('r','t\u0113'),SN('s','\u015bi'),SN('r','va'),SN('g','m\u014d'),SN('m','h\u0101'),
    SN('p','k\u0101'),SH(9.5,'r\u0113'),SN('\u1E60','\u2014'),SH(12,'\u2014'),SH(12,'\u2014'),SH(12,'\u2014'),
];

/* NT_VANDE — Vande M\u012bn\u0101k\u1e63\u012b  (91 notes, 6 spec rows) */
const NT_VANDE=[
    /* Row 1 */
    SN('\u1E60','van'),SN('g','d\u0113'),SN('\u1E60','m\u012b'),SN('g','n\u0101'),
    SN('\u1E60','kshi'),SN('g','\u2014'),SN('m','sa'),SN('g','ra'),
    SN('r','si'),SN('s','ja'),SN('\u1E45','vak'),SN('r','tr\u0113'),
    SN('\u1E45','par'),SN('r','\u1e47\u0113'),SN('\u1E45','dur'),SN('r','g\u0113'),
    /* Row 2 */
    SN('\u1E45','su'),SN('r','ra'),SN('g','b\u1e5bn'),SN('r','d\u0113'),
    SN('s','\u015bak'),SN('n','t\u0113'),SN('\u1E60','gu'),SN('g','ru'),
    SN('\u1E60','gu'),SN('g','ha'),SN('s','p\u0101'),SN('r','li'),
    SN('g','ni'),SN('m','ja'),SN('p','la'),SN('p','ru'),
    /* Row 3 */
    SN('m','cha'),SN('g','ra'),SN('r','\u1e47\u0113'),SN('s','sun'),
    SN('g','da'),SN('r','ra'),SN('s','p\u0101\u1e47'),SN('n','\u1e0dy\u0101'),
    SN('\u1E60','nan'),SH(12,'d\u0113'),SN('\u1E60','m\u0101'),SH(12,'y\u0113'),
    SN('\u1E60','s\u016b'),SH(12,'ri'),SN('n','ja'),SN('d','n\u0101'),
    /* Row 4 */
    SN('p','dh\u0101'),SH(9.5,'r\u0113'),SN('m','sun'),SN('g','da'),
    SN('m','ra'),SN('p','r\u0101'),SN('d','ja'),SN('\u1E60','sa'),
    SH(12,'h\u014d'),SN('n','da'),SN('d','ri'),SN('p','gau'),
    SH(9.5,'ri'),SN('m','\u015bu'),SN('p','bha'),SH(9.5,'ka'),
    /* Row 5 */
    SN('p','ta'),SH(9.5,'ta'),SN('s','ma'),SH(6,'ham'),
    SN('n','\u2014'),SN('d','\u2014'),SN('p','\u2014'),SH(9.5,'\u2014'),
    SN('p','sun'),SN('m','da'),SN('g','ra'),SH(8,'r\u0101'),
    SN('m','ja'),SN('m','sa'),SN('p','h\u014d'),SN('m','da'),
    /* Row 6 (11 notes) */
    SN('g','gau'),SN('r','ri'),SN('s','\u015bu'),SN('g','bha'),
    SN('r','ka'),SN('s','ri'),SN('\u1E45','sa'),SN('s','ta'),
    SH(6,'ta'),SN('s','ma'),SH(6,'ham'),
];

/* NT_GURUGUHA — Guru-guha Sarasija  (96 notes, 6 spec rows) */
const NT_GURUGUHA=[
    /* Row 1 (18) */
    SN('s','gu'),SN('s','ru'),SN('g','gu'),SN('g','ha'),
    SN('s','sa'),SN('s','ra'),SN('g','si'),SN('g','ja'),
    SN('r','ka'),SN('r','ra'),SN('s','pa'),SN('\u1E45','da'),
    SN('s','\u015bu'),SN('\u1E45','bha'),SN('s','ka'),SN('r','ra'),
    SN('s','mur'),SN('p','t\u0113'),
    /* Row 2 (14) */
    SN('s','su'),SN('s','ra'),SN('g','va'),SN('g','ra'),
    SN('s','\u015bi'),SN('s','va'),SN('g','su'),SN('g','ta'),
    SN('r','bhu'),SN('r','va'),SN('s','na'),SN('\u1E45','pa'),
    SN('\u1E60','t\u0113'),SN('\u1E60','\u2014'),
    /* Row 3 (18) */
    SN('g','mu'),SN('g','ra'),SN('p','ha'),SN('p','ra'),
    SN('g','ha'),SN('g','ri'),SN('p','ha'),SN('p','ya'),
    SN('m','vi'),SN('m','dhi'),SN('r','nu'),SN('\u1E45','ta'),
    SN('s','ba'),SN('\u1E45','hu'),SN('s','vi'),SN('r','dha'),
    SN('s','k\u012br'),SN('p','t\u0113'),
    /* Row 4 (14) */
    SN('g','na'),SN('g','ra'),SN('p','pa'),SN('p','ti'),
    SN('g','na'),SN('g','ta'),SN('p','mu'),SN('p','ni'),
    SN('m','yu'),SN('m','ta'),SN('r','su'),SN('\u1E45','ma'),
    SN('\u1E60','t\u0113'),SN('\u1E60','\u2014'),
    /* Row 5 (18) */
    SN('s','ni'),SN('\u1E45','ru'),SN('d','pa'),SN('p','ma'),
    SN('m','ja'),SN('g','ya'),SN('r','ka'),SN('s','ra'),
    SN('r','ni'),SN('s','ra'),SN('\u1E45','ti'),SN('d','\u015ba'),
    SN('s','ya'),SN('\u1E45','su'),SN('s','kha'),SN('r','da'),
    SN('s','\u2014'),SN('p','\u2014'),
    /* Row 6 (14) */
    SN('r','sa'),SN('g','ra'),SN('m','sa'),SN('r','sa'),
    SN('\u1E45','ta'),SN('s','ta'),SN('r','ma'),SN('\u1E45','va'),
    SN('s','sthi'),SN('\u1E45','ra'),SN('s','ta'),SN('r','ra'),
    SN('s','\u015bak'),SN('p','t\u0113'),
];

/* NT_SHAKTI — \u015aakti Sahita Ga\u1e47apatim  (40 notes, 5 chart rows) */
const NT_SHAKTI=[
    SN('\u1E60','\u015bak'),SN('g','ti'),SN('g','sa'),SN('g','hi'),SN('m','ta'),SN('g','ga'),SN('r','\u1e47a'),SN('s','pa'),
    SN('r','ti'),SN('\u1E60','\u1e43'),SN('\u1E45','\u015ba\u1e43'),SN('s','ka'),SN('r','r\u0101'),SN('\u1E45','di'),SN('s','s\u0113'),SN('r','vi'),
    SN('g','ta\u1e43'),SN('g','rak'),SN('g','ta'),SN('m','sa'),SN('g','ka'),SN('r','la'),SN('s','mu'),SN('r','ni'),
    SN('s','va'),SN('\u1E45','ra'),SN('s','su'),SN('r','r\u0101'),SN('g','ja'),SN('s','vi'),SN('n','nu'),SN('d','t\u0101'),
    SN('\u1E60','\u1e43'),SN('p','gu'),SN('s','ru'),SN('\u1E45','gu'),SN('\u1E60','ha'),SN('g','\u1e43'),SN('r','\u2014'),SN('g','\u2014'),
];

/* ════════════════════════════════════════════════════════════
   GRADE 6 — NOTTUSWARAMS  (Muthuswami Dikshitar, 15 pieces)
   Primarily Raga Shankarabharanam
════════════════════════════════════════════════════════════ */
const NOTTUSWARAMS = [
  {
    title:'Santatam P\u0101him\u0101m', deity:'Lord Rama',
    raga:'Shankarabharanam', tala:'Tishra \u00B7 Eka',
    lyrics:[
      'santatam p\u0101him\u0101m jatak\u012b vallabha',
      'r\u0101ma r\u0101j\u012bva-l\u014dcana raghuvara',
      'sura-vara vandita karu\u1e47\u0101-sindhu',
      'guru-guha nuta m\u0101dhava m\u0101dhava',
    ],
    lines: NT_SANTATAM,
  },
  {
    title:'\u0100njan\u0113yam Sad\u0101', deity:'Hanuman',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      '\u0101njan\u0113yam sad\u0101 bhaj\u0113ham',
      '\u015br\u012b r\u0101ma d\u016btam sugr\u012bva sakhyam',
      's\u012bt\u0101 kalatra priya kapi\u015bre\u1e63\u1e6dham',
      'guru-guha vandita bhakta-vatsalam',
    ],
  },
  {
    title:'D\u0101\u015bharathe', deity:'Lord Rama',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'd\u0101\u015barathE daya-sindh\u014d',
      'r\u0101ghav\u0113ndra karu\u1e47\u0101-sindh\u014d',
      'bharata \u015batrughna sahodara',
      'guru-guha vandita sura-p\u016bjita',
    ],
  },
  {
    title:'Sama G\u0101na Priye', deity:'Goddess Kamakshi',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      's\u0101ma-g\u0101na priy\u0113 k\u0101ma-k\u014d\u1e6di nilaye',
      '\u015ba\u1e45kar\u012b sundar\u012b s\u0101ra-tara lahar\u012b',
      'ca\u1e47\u1e0dik\u0113 nirmal\u0113 k\u0101min\u012b m\u014ddin\u012b',
      'p\u0101hi guru-guha janan\u012b k\u0101m\u0101k\u1e63\u012b',
    ],
  },
  {
    title:'Cintay\u0113ham Sad\u0101', deity:'Lord Vishnu',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'cintay\u0113ham sad\u0101 \u015br\u012b-r\u0101mam',
      'd\u012bnabandhu day\u0101-nidhim',
      '\u015br\u012b kamal\u0101-k\u0101nta guru-guha nutam',
      'sakala sura vandita pad\u0101mbujam',
    ],
  },
  {
    title:'Vande M\u012bn\u0101k\u1e63\u012b', deity:'Goddess Meenakshi',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'vand\u0113 m\u012bn\u0101k\u1e63\u012b tv\u0101m sarasija-vaktr\u0113',
      'par\u1e47\u0113 durg\u0113 nata-sura-b\u1e5bnd\u0113',
      '\u015bakt\u0113 guru-guha p\u0101lin\u012b jala-ruha-cara\u1e47\u0113',
      'sundara-p\u0101\u1e47\u1e0dy\u0101nand\u0113 m\u0101y\u0113',
    ],
    lines: NT_VANDE,
  },
  {
    title:'Guru-guha Sarasija', deity:'Lord Murugan',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'guru-guha sarasija-kara-p\u0101da \u015bubha-kara-m\u016brt\u0113',
      'sura-vara \u015biva-suta bhuvana-pat\u0113',
      'muraha-ra hari-haya-vidhi-nuta k\u012brt\u0113',
      'nara-pati-nata muni-yuta su-mat\u0113',
    ],
    lines: NT_GURUGUHA,
  },
  {
    title:'P\u0101hi Durg\u0113', deity:'Goddess Durga',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'p\u0101hi durg\u0113 bhaktam t\u0113',
      'padma-kar\u0113 vijaya-\u015bakt\u0113',
      '\u0113hi d\u0113hi sarvaj\u00f1\u0113 yati-nuta',
      'ga\u1e47apati guru-guha janan\u012b m\u0101m',
    ],
  },
  {
    title:'R\u0101j\u012bvaloocanam', deity:'Lord Rama',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'r\u0101j\u012bval\u014dcanam r\u0101macandram',
      'raghuvara varadam raghu-nandanam',
      's\u012bt\u0101-vallabham sura-vandyam',
      'guru-guha nutam karu\u1e47\u0101-nidhim',
    ],
  },
  {
    title:'\u015aakti Sahita Ga\u1e47apatim', deity:'Lord Ganesha',
    raga:'Shankarabharanam', tala:'Tishra \u00B7 Eka',
    lyrics:[
      '\u015bakti-sahita ga\u1e47apatim \u015ba\u1e45kar\u0101di-s\u0113vitam',
      'virakta sakala-muni-vara',
      'sura-r\u0101ja vinuta guru-guham',
      'bhakt\u0101-nip\u014d\u1e63akam bhava-sutam vin\u0101yakam',
    ],
    lines: NT_SHAKTI,
  },
  {
    title:'P\u0101rvat\u012bpathe', deity:'Lord Shiva',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'p\u0101rvat\u012b-pat\u0113 p\u0101hi m\u0101\u1e43 sad\u0101',
      '\u015ba\u1e45kara \u015bubha-kara \u015biva \u015biva',
      'k\u0101rtik\u0113ya janaka guru-guha nutam',
      'um\u0101-mah\u0113\u015bvara pad\u0101mbujam bhaj\u0113',
    ],
  },
  {
    title:'Sakala Suravinuta', deity:'Lord Vishnu',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'sakala sura-vinuta \u015br\u012bniv\u0101sa',
      'm\u0101dhava k\u0113\u015bava n\u0101r\u0101ya\u1e47a',
      'v\u0101sud\u0113va guru-guha nuta',
      'kamal\u0101-k\u0101nta karu\u1e47\u0101-kara',
    ],
  },
  {
    title:'K\u0101\u00f1c\u012b\u015bam', deity:'Lord Shiva of Kanchipuram',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'k\u0101\u00f1c\u012b\u015bam k\u0101m\u0101k\u1e63\u012b-rama\u1e47am',
      'sad\u0101 bhaj\u0101mi guru-guha nutam',
      '\u015ba\u1e45kara karu\u1e47\u0101-kara \u015biva \u015biva',
      'kail\u0101sa-v\u0101sa parvat\u012b-priya',
    ],
  },
  {
    title:'\u015ar\u012b Ga\u1e47an\u0101tham', deity:'Lord Ganesha',
    raga:'Eesamanoohari', tala:'Chatusra \u00B7 Roopaka', diffRaga:true,
    lyrics:[
      '\u015br\u012b ga\u1e47an\u0101tham bhaj\u0113ham',
      'vighn\u0113\u015bvaram vighna-n\u0101\u015bakam',
      'guru-guha-priyam ga\u1e47a-n\u0101yakam',
      'kamal\u0101-sambhava vandita p\u0101d\u0101bhujam',
    ],
  },
  {
    title:'M\u0101y\u0113 Citkal\u0113', deity:'Goddess Parvati',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'm\u0101y\u0113 citkal\u0113 m\u0101m p\u0101hi',
      'parvat\u012b guru-guha janan\u012b',
      '\u015ba\u1e45kar\u012b sundar\u012b s\u0101ra-lahar\u012b',
      'k\u0101min\u012b m\u014ddin\u012b k\u0101m\u0101k\u1e63\u012b',
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   LESSONS  — master grade list consumed by index.html
════════════════════════════════════════════════════════════ */
const LESSONS = [
  { name:'Sarali Varisai', raga:'Mayamalavagowla', tala:'Chatusra \u00B7 Adi', verses:SARALI_VERSES },
  {
    name:'Janta Varisai', raga:'Mayamalavagowla', tala:'Chatusra \u00B7 Adi',
    desc:'Double-note exercises \u2014 each note struck twice, second with emphasis (spuritam)',
    verses:JANTA_VERSES,
  },
  {
    name:'Datu Varisai', raga:'Mayamalavagowla', tala:'Chatusra \u00B7 Adi',
    desc:'Zigzag skip-note patterns \u2014 notes jump up and down to build agility',
    verses:DATU_VERSES,
  },
  {
    name:'Alankarams', raga:'Mayamalavagowla', tala:'Chatusra \u00B7 Adi',
    desc:'Multi-tala exercises across 7 sacred talas \u2014 the rhythmic soul of Carnatic music',
    verses:ALANKARAM_VERSES,
  },
  {
    name:'Geethams', raga:'Malahari', tala:'Chatusra \u00B7 Rupakam',
    desc:'First songs with lyrics (sahityam) \u2014 union of melody and words',
    verses:GEETHAM_VERSES,
  },
  {
    name:'Nottuswarams', raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    nottuswaram:true, verses:[],
    info:'Beginner songs composed by Muthuswami Dikshitar, set to Western-style melodies with Sanskrit devotional lyrics (primarily Raga Shankarabharanam)',
    items:NOTTUSWARAMS,
  },
];
