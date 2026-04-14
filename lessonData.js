/* ══════════════════════════════════════════════════════════════
   lessonData.js v1.0 — All lesson / verse / lyric data for
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
const _  = {label:'-', pitch:0}; // hold/sustain — pitch filled at load time

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
   Each verse is a flat notes array; 8 notes = 1 tala cycle (Adi).
   Sustain pitches ('-') are resolved at load time in index.html.
════════════════════════════════════════════════════════════ */
const SARALI_VERSES = [
  { title:'Verse 1',
    notes:[s,r,g,m,p,d,n,S,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 2',
    notes:[s,r,s,r,s,r,g,m,
           p,d,n,S,S,n,S,n,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 3',
    notes:[s,r,g,s,r,g,s,r,
           s,r,g,m,p,d,n,S,
           S,n,d,S,n,d,S,n,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 4',
    notes:[s,r,g,m,s,r,g,m,
           s,r,g,m,p,d,n,S,
           S,n,d,p,S,n,d,p,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 5',
    notes:[s,r,g,m,p,_,s,r,
           s,r,g,m,p,d,n,S,
           S,n,d,p,m,_,S,n,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 6',
    notes:[s,r,g,m,p,d,s,r,
           s,r,g,m,p,d,n,S,
           S,n,d,p,m,g,S,n,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 7',
    notes:[s,r,g,m,p,d,n,_,
           s,r,g,m,p,d,n,S,
           S,n,d,p,m,g,r,_,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 8',
    notes:[s,r,g,m,p,m,g,r,
           s,r,g,m,p,d,n,S,
           S,n,d,p,m,p,d,n,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 9',
    notes:[s,r,g,m,p,m,d,p,
           s,r,g,m,p,d,n,S,
           S,n,d,p,m,p,g,m,
           S,n,d,p,m,g,r,s] },

  { title:'Verse 10',
    notes:[s,r,g,m,p,_,g,m,
           p,_,_,_,p,_,_,_,
           g,m,p,d,n,d,p,m,
           g,m,p,g,m,g,r,s] },

  { title:'Verse 11',
    notes:[S,_,n,d,n,_,d,p,
           d,_,p,m,p,_,p,_,
           g,m,p,d,n,d,p,m,
           g,m,p,g,m,g,r,s,
           s,_,_,_,_,_,_,_] },

  { title:'Verse 12',
    notes:[S,S,n,d,n,n,d,p,
           d,d,p,m,p,_,p,_,
           g,m,p,d,n,d,p,m,
           g,m,p,g,m,g,r,s] },

  { title:'Verse 13',
    notes:[s,r,g,r,g,_,g,m,
           p,m,p,_,d,p,d,_,
           m,p,d,p,d,n,d,p,
           m,p,d,p,m,g,r,s] },

  { title:'Verse 14',
    notes:[s,r,g,m,p,_,p,_,
           d,d,p,_,m,m,p,_,
           d,n,S,_,S,n,d,p,
           S,n,d,p,m,g,r,s] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 2 — JANTA VARISAI  (8 verses, Mayamalavagowla)
   Double-note (janta) exercises
════════════════════════════════════════════════════════════ */
const JANTA_VERSES = [
  { title:'Verse 1',
    notes:[s,s,r,r,g,g,m,m, p,p,d,d,n,n,S,S,
           S,S,n,n,d,d,p,p, m,m,g,g,r,r,s,s] },

  { title:'Verse 2',
    notes:[s,s,r,r,g,g,m,m, r,r,g,g,m,m,p,p,
           g,g,m,m,p,p,d,d, m,m,p,p,d,d,n,n,
           p,p,d,d,n,n,S,S, S,S,n,n,d,d,p,p, 
           n,n,d,d,p,p,m,m, d,d,p,p,m,m,g,g, 
           p,p,m,m,g,g,r,r, m,m,g,g,r,r,s,s] },

  { title:'Verse 3',
    notes:[s,s,r,s,s,r,s,r, s,s,r,r,g,g,m,m,
           r,r,g,r,r,g,r,g, r,r,g,g,m,m,p,p,
           g,g,m,g,g,m,g,m, g,g,m,m,p,p,d,d, 
           m,m,p,m,m,p,m,p, m,m,p,p,d,d,n,n, 
           p,p,d,p,p,d,p,d, p,p,d,d,n,n,S,S,
           S,S,n,S,S,n,S,n, S,S,n,n,d,d,p,p,
           n,n,d,n,n,d,n,d, n,n,d,d,p,p,m,m,
           d,d,p,d,d,p,d,p, d,d,p,p,m,m,g,g,
           p,p,m,p,p,m,p,m, p,p,m,m,g,g,r,r,
           m,m,g,m,m,g,m,g, m,m,g,g,r,r,s,s] },

  { title:'Verse 4',
    notes:[s,s,r,r,g,s,r,g, s,s,r,r,g,g,m,m,
           r,r,g,g,m,r,g,m, r,r,g,g,m,m,p,p,
           g,g,m,m,p,g,m,p, g,g,m,m,p,p,d,d, 
           m,m,p,p,d,m,p,d, m,m,p,p,d,d,n,n, 
           p,p,d,d,n,p,d,n, p,p,d,d,n,n,S,S,
           S,S,n,n,d,S,n,d, S,S,n,n,d,d,p,p,
           n,n,d,d,p,n,d,p, n,n,d,d,p,p,m,m,
           d,d,p,p,m,d,p,m, d,d,p,p,m,m,g,g,
           p,p,m,m,g,p,m,g, p,p,m,m,g,g,r,r,
           m,m,g,g,r,m,g,r, m,m,g,g,r,r,s,s] },

  { title:'Verse 5',
    notes:[s,s,_,r,r,_,g,g, s,s,r,r,g,g,m,m,
           r,r,_,g,g,_,m,m, r,r,g,g,m,m,p,p,
           g,g,_,m,m,_,p,p, g,g,m,m,p,p,d,d, 
           m,m,_,p,p,_,d,d, m,m,p,p,d,d,n,n, 
           p,p,_,d,d,_,n,n, p,p,d,d,n,n,S,S,
           S,S,_,n,n,_,d,d, S,S,n,n,d,d,p,p,
           n,n,_,d,d,_,p,p, n,n,d,d,p,p,m,m,
           d,d,_,p,p,_,m,m, d,d,p,p,m,m,g,g,
           p,p,_,m,m,_,g,g, p,p,m,m,g,g,r,r,
           m,m,_,g,g,_,r,r, m,m,g,g,r,r,s,s] },

  { title:'Verse 6',
    notes:[s,_,s,r,_,r,g,g, s,s,r,r,g,g,m,m,
           r,_,r,g,_,g,m,m, r,r,g,g,m,m,p,p,
           g,_,g,m,_,m,p,p, g,g,m,m,p,p,d,d, 
           m,_,m,p,_,p,d,d, m,m,p,p,d,d,n,n, 
           p,_,p,d,_,d,n,n, p,p,d,d,n,n,S,S,
           S,_,S,n,_,n,d,d, S,S,n,n,d,d,p,p,
           n,_,n,d,_,d,p,p, n,n,d,d,p,p,m,m,
           d,_,d,p,_,p,m,m, d,d,p,p,m,m,g,g,
           p,_,p,m,_,m,g,g, p,p,m,m,g,g,r,r,
           m,_,m,g,_,g,r,r, m,m,g,g,r,r,s,s] },

  { title:'Verse 7',
    notes:[s,s,s,r,r,r,g,g, s,s,r,r,g,g,m,m,
           r,r,g,g,g,g,m,m, r,r,g,g,m,m,p,p,
           g,g,g,m,m,m,p,p, g,g,m,m,p,p,d,d, 
           m,m,m,p,p,p,d,d, m,m,p,p,d,d,n,n, 
           p,p,p,d,d,d,n,n, p,p,d,d,n,n,S,S,
           S,S,S,n,n,n,d,d, S,S,n,n,d,d,p,p,
           n,n,n,d,d,d,p,p, n,n,d,d,p,p,m,m,
           d,d,d,p,p,p,m,m, d,d,p,p,m,m,g,g,
           p,p,p,m,m,m,g,g, p,p,m,m,g,g,r,r,
           m,m,m,g,g,g,r,r, m,m,g,g,r,r,s,s] },

  { title:'Verse 8',
    notes:[s,s,m,m,g,g,r,r, s,s,r,r,g,g,m,m,
           r,r,p,p,m,m,g,g, r,r,g,g,m,m,p,p,
           g,g,d,d,p,p,m,m, g,g,m,m,p,p,d,d, 
           m,m,n,n,d,d,p,p, m,m,p,p,d,d,n,n, 
           p,p,S,S,n,n,d,d, p,p,d,d,n,n,S,S,
           S,S,p,p,d,d,n,n, S,S,n,n,d,d,p,p,
           n,n,m,m,p,p,d,d, n,n,d,d,p,p,m,m,
           d,d,g,g,m,m,p,p, d,d,p,p,m,m,g,g,
           p,p,r,r,g,g,m,m, p,p,m,m,g,g,r,r,
           m,m,s,s,r,r,g,g, m,m,g,g,r,r,s,s] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 3 — DATU VARISAI  (3 verses, Mayamalavagowla)
   Zigzag / skip-note patterns
════════════════════════════════════════════════════════════ */
const DATU_VERSES = [
  /* Verse 1 — skip-2 doubles (ss mm rr gg …) */
  { title:'Verse 1',
    notes:[
      s,r,s,g,r,g,r,m,  s,m,g,r,s,r,g,m,
      r,g,r,m,g,m,g,p,  r,p,m,g,r,g,m,p,
      g,m,g,p,m,p,m,d,  g,d,p,m,g,m,p,d,
      m,p,m,d,p,d,p,n,  m,n,d,p,m,p,d,n,
      p,d,p,n,d,n,d,S,  p,S,n,d,p,d,n,S,
      S,n,S,d,n,d,n,p,  S,p,d,n,S,n,d,p,
      n,d,n,p,d,p,d,m,  n,m,p,d,n,d,p,m,
      d,p,d,m,p,m,p,g,  d,g,m,p,d,p,m,g,
      p,m,p,g,m,g,m,r,  p,r,g,m,p,m,g,r,
      m,g,m,r,g,r,g,s,  m,s,r,g,m,g,r,s,
    ] },

  /* Verse 2 — alternating skip (s m g m r g s r …) */
  { title:'Verse 2',
    notes:[
      s,m,g,m,r,g,s,r,  s,g,r,g,s,r,g,m,
      r,p,m,p,g,m,r,g,  r,m,g,m,r,g,m,p,
      g,d,p,d,m,p,g,m,  g,p,m,p,g,m,p,d,
      m,n,d,n,p,d,m,p,  m,d,p,d,m,p,d,n,
      p,S,n,S,d,n,p,d,  p,n,d,n,p,d,n,S,
      S,p,d,p,n,d,S,n,  S,d,n,d,S,n,d,p,
      n,m,p,m,d,p,n,d,  n,p,d,p,n,d,p,m,
      d,g,m,g,p,m,d,p,  d,m,p,m,d,p,m,g,
      p,r,g,r,m,g,p,m,  p,g,m,g,p,m,g,r,
      m,s,r,s,g,r,m,g,  m,r,g,r,m,g,r,s,
    ] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 4 — ALANKARAMS  (7 talas, Mayamalavagowla)
   Core melodic pattern: s r g m → shift up 1 swara each row.
   tala field drives setTalaPattern() in index.html.
   beatsPerRow / groups stored for documentation.
════════════════════════════════════════════════════════════ */
const ALANKARAM_VERSES = [

  /* A1 — Dhruva Tala (14 beats: 4+2+4+4) */
  { title:'Alankaram 1 \u2014 Dhruva', tala:'Chatusra \u00B7 Dhruva',
    jati:'Chatusra', beatsPerRow:14, groups:[4,2,4,4],
    notes:[
      /* Ascending */
      s,r,g,m, g,r,s,r, g,r,s,r, g,m,
      r,g,m,p, m,g,r,g, m,g,r,g, m,p,
      g,m,p,d, p,m,g,m, p,m,g,m, p,d,
      m,p,d,n, d,p,m,p, d,p,m,p, d,n,
      p,d,n,S, n,d,p,d, n,d,p,d, n,S,
      /* Descending */
      S,n,d,p, d,n,S,n, d,n,S,n, d,p,
      n,d,p,m, p,d,n,d, p,d,n,d, p,m,
      d,p,m,g, m,p,d,p, m,p,d,p, m,g,
      p,m,g,r, g,m,p,m, g,m,p,m, g,r,
      m,g,r,s, r,g,m,g, r,g,m,g, r,s,
    ] },

  /* A2 — Matya Tala (10 beats: 4+2+4) */
  { title:'Alankaram 2 \u2014 Matya', tala:'Chatusra \u00B7 Matya',
    jati:'Chatusra', beatsPerRow:10, groups:[4,2,4],
    notes:[
      /* Ascending */
      s,r,g,r, s,r, s,r,g,m,
      r,g,m,g, r,g, r,g,m,p,
      g,m,p,m, g,m, g,m,p,d,
      m,p,d,p, m,p, m,p,d,n,
      p,d,n,d, p,d, p,d,n,S,
      /* Descending */
      S,n,d,n, S,n, S,n,d,p,
      n,d,p,d, n,d, n,d,p,m,
      d,p,m,p, d,p, d,p,m,g,
      p,m,g,m, p,m, p,m,g,r,
      m,g,r,g, m,g, m,g,r,s,
    ] },

  /* A3 — Roopaka Tala (6 beats: 2+4) */
  { title:'Alankaram 3 \u2014 Roopaka', tala:'Chatusra \u00B7 Roopaka',
    jati:'Chatusra', beatsPerRow:6, groups:[2,4],
    notes:[
      /* Ascending */
      s,r, s,r,g,m,
      r,g, r,g,m,p,
      g,m, g,m,p,d,
      m,p, m,p,d,n,
      p,d, p,d,n,S,
      /* Descending */
      S,n, S,n,d,p,
      n,d, n,d,p,m,
      d,p, d,p,m,g,
      p,m, p,m,g,r,
      m,g, m,g,r,s,
    ] },

  /* A4 — Jhampa Tala (10 beats: 7+1+2)
     Beat 10 = anudhrutam (single clap, no swara — hold/rest) */
  { title:'Alankaram 4 \u2014 Jhampa', tala:'Mishra \u00B7 Jhampa',
    jati:'Mishra', beatsPerRow:10, groups:[7,1,2],
    notes:[
      /* Ascending */
      s,r,g,s,r,s,r, g,m,_,
      r,g,m,r,g,r,g, m,p,_,
      g,m,p,g,m,g,m, p,d,_,
      m,p,d,m,p,m,p, d,n,_,
      p,d,n,p,d,p,d, n,S,_,
      /* Descending */
      S,n,d,S,n,S,n, d,p,_,
      n,d,p,n,d,n,d, p,m,_,
      d,p,m,d,p,d,p, m,g,_,
      p,m,g,p,m,p,m, g,r,_,
      m,g,r,m,g,m,g, r,s,_,
    ] },

  /* A5 — Triputa Tala (7 beats: 3+2+2) */
  { title:'Alankaram 5 \u2014 Triputa', tala:'Tishra \u00B7 Triputa',
    jati:'Tishra', beatsPerRow:7, groups:[3,2,2],
    notes:[
      /* Ascending */
      s,r,g, s,r, g,m,
      r,g,m, r,g, m,p,
      g,m,p, g,m, p,d,
      m,p,d, m,p, d,n,
      p,d,n, p,d, n,S,
      /* Descending */
      S,n,d, S,n, d,p,
      n,d,p, n,d, p,m,
      d,p,m, d,p, m,g,
      p,m,g, p,m, g,r,
      m,g,r, m,g, r,s,
    ] },

  /* A6 — Ata Tala (14 beats: 5+5+2+2)
     '-' = held/ghost beat filling the elongated pattern */
  { title:'Alankaram 6 \u2014 Ata', tala:'Khanda \u00B7 Ata',
    jati:'Khanda', beatsPerRow:14, groups:[5,5,2,2],
    notes:[
      /* Ascending */
      s,r,_,g,_, s,_,r,g,_, m,_,m,_,
      r,g,_,m,_, r,_,g,m,_, p,_,p,_,
      g,m,_,p,_, g,_,m,p,_, d,_,d,_,
      m,p,_,d,_, m,_,p,d,_, n,_,n,_,
      p,d,_,n,_, p,_,d,n,_, S,_,S,_,
      /* Descending */
      S,n,_,d,_, S,_,n,d,_, p,_,p,_,
      n,d,_,p,_, n,_,d,p,_, m,_,m,_,
      d,p,_,m,_, d,_,p,m,_, g,_,g,_,
      p,m,_,g,_, p,_,m,g,_, r,_,r,_,
      m,g,_,r,_, m,_,g,r,_, s,_,s,_,
    ] },

  /* A7 — Eka Tala (4 beats: 4) */
  { title:'Alankaram 7 \u2014 Eka', tala:'Chatusra \u00B7 Eka',
    jati:'Chatusra', beatsPerRow:4, groups:[4],
    notes:[
      /* Ascending */
      s,r,g,m,
      r,g,m,p,
      g,m,p,d,
      m,p,d,n,
      p,d,n,S,
      /* Descending */
      S,n,d,p,
      n,d,p,m,
      d,p,m,g,
      p,m,g,r,
      m,g,r,s,
    ] },
];

/* ════════════════════════════════════════════════════════════
   GRADE 5 — GEETHAMS  (Malahari raga, with lyric syllables)
   Each note: ML(swara, lyric) → { label, pitch, lyric }
   '-' lyric = held/sustained (pitch dots shown, no new attack)
   tala field drives setTalaPattern() for each geetham.
════════════════════════════════════════════════════════════ */
const GEETHAM_VERSES = [

  /* G1 — Śrī Gaṇanātha (Lambodara) | Rupakam 6-beat | Lord Ganesha
     Structure: Pallavi (4) → Refrain (6) → Charanam 1 (4) → Refrain (6)
     Total: 20 rows × 6 = 120 notes */
  { title:'\u015ar\u012b Ga\u1e47an\u0101tha', raga:'Malahari',
    tala:'Chatusra \u00B7 Rupakam', deity:'Lord Ganesha',
    notes:[
      /* Pallavi */
      ML('m','\u015ar\u012b'), ML('p','ga'),       ML('d','\u1e47a'),      ML(S_HI,'n\u0101'),    ML(S_HI,'tha'),      ML(R_HI,'-'),
      ML(R_HI,'sin'),          ML(S_HI,'dh\u016b'), ML('d','-'),           ML('p','ra'),           ML('m','var'),       ML('p','\u1e47a'),
      ML('r','ka'),            ML('m','ru'),        ML('p','\u1e47\u0101'), ML('d','s\u0101'),     ML('m','ga'),        ML('p','ra'),
      ML('d','ka'),            ML('p','ri'),        ML('m','va'),           ML('g','da'),           ML('r','na'),        ML('s','-'),
      /* Refrain — Lambodara */
      ML('s','Lam'),           ML('r','-'),         ML('m','bo'),           ML('g','-'),            ML('r','da'),        ML('s','ra'),
      ML('s','la'),            ML('r','ku'),        ML('g','mi'),           ML('r','ka'),           ML('s','ra'),        ML('s','-'),
      ML('r','Am'),            ML('m','-'),         ML('p','b\u0101'),      ML('d','-'),            ML('m','su'),        ML('p','tha'),
      ML('d','a'),             ML('p','ma'),        ML('m','ra'),           ML('g','vi'),           ML('r','nu'),        ML('s','tha'),
      ML('s','Lam'),           ML('r','-'),         ML('m','bo'),           ML('g','-'),            ML('r','da'),        ML('s','ra'),
      ML('s','la'),            ML('r','ku'),        ML('g','mi'),           ML('r','ka'),           ML('s','r\u0101'),   ML('s','-'),
      /* Charanam 1 */
      ML('m','Sid'),           ML('p','dha'),       ML('d','Ch\u0101'),     ML(S_HI,'ra'),          ML(S_HI,'\u1e47a'),  ML(R_HI,'-'),
      ML(R_HI,'ga'),           ML(S_HI,'\u1e47a'),  ML('d','s\u0113'),     ML('p','vi'),           ML('m','tha'),       ML('p','-'),
      ML('r','Sid'),           ML('m','dhi'),       ML('p','vi'),           ML('d','n\u0101'),      ML('m','ya'),        ML('p','ka'),
      ML('d','t\u0113'),       ML('p','-'),         ML('m','na'),           ML('g','mo'),           ML('r','na'),        ML('s','mo'),
      /* Refrain repeat */
      ML('s','Lam'),           ML('r','-'),         ML('m','bo'),           ML('g','-'),            ML('r','da'),        ML('s','ra'),
      ML('s','la'),            ML('r','ku'),        ML('g','mi'),           ML('r','ka'),           ML('s','ra'),        ML('s','-'),
      ML('r','Am'),            ML('m','-'),         ML('p','b\u0101'),      ML('d','-'),            ML('m','su'),        ML('p','tha'),
      ML('d','a'),             ML('p','ma'),        ML('m','ra'),           ML('g','vi'),           ML('r','nu'),        ML('s','tha'),
      ML('s','Lam'),           ML('r','-'),         ML('m','bo'),           ML('g','-'),            ML('r','da'),        ML('s','ra'),
      ML('s','la'),            ML('r','ku'),        ML('g','mi'),           ML('r','ka'),           ML('s','r\u0101'),   ML('s','-'),
    ] },

  /* G2 — Kunda Gowra | Rupakam 6-beat | Lord Krishna
     7 rows × 6 = 42 notes */
  { title:'Kunda Gowra', raga:'Malahari',
    tala:'Chatusra \u00B7 Rupakam', deity:'Lord Krishna',
    notes:[
      ML('d','kun'),      ML('p','dha'),      ML('m','gow'),      ML('g','-'),        ML('r','-'),        ML('s','ra'),
      ML('r','gow'),      ML('m','ri'),       ML('p','-'),        ML('d','va'),       ML('m','ra'),       ML('p','-'),
      ML('d','man'),      ML('r','-'),        ML('r','di'),       ML('s','ra'),       ML('d','-'),        ML('p','ya'),
      ML('m','n\u012b'),  ML('r','ra'),       ML('s','ja'),       ML('d','nan'),      ML('p','da'),       ML('m','na'),
      ML('p','go'),       ML('d','vi'),       ML('p','nda'),      ML('m','r\u0101'),  ML('r','ja'),       ML('s','-'),
      ML('r','ku'),       ML('m','m\u0101'),  ML('p','ra'),       ML('d','gu'),       ML('m','ru'),       ML('p','gu'),
      ML('d','ha'),       ML('p','-'),        ML('m','van'),      ML('g','di'),       ML('r','ta'),       ML('s','-'),
    ] },

  /* G3 — Padmanābha | Triputa 7-beat | Lord Vishnu
     7 rows × 7 = 49 notes */
  { title:'Padman\u0101bha', raga:'Malahari',
    tala:'Chatusra \u00B7 Triputa', deity:'Lord Vishnu',
    notes:[
      ML('s','Pa'),           ML('r','du'),         ML('m','ma'),        ML('p','n\u0101'),      ML('d','bha'),       ML(S_HI,'-'),        ML(R_HI,'-'),
      ML(R_HI,'pa'),          ML(S_HI,'ra'),        ML('d','-'),         ML('p','ma'),           ML('m','-'),         ML('g','pu'),        ML('r','ru'),
      ML('s','\u1e63\u0101'), ML('s','-'),          ML('r','pa'),        ML('m','ra'),           ML('p','ma'),        ML('d','pu'),        ML(S_HI,'ru'),
      ML(R_HI,'\u1e63\u0101'),ML(S_HI,'-'),         ML('d','u'),         ML('p','da'),           ML('m','dhi'),       ML('p','-'),         ML('d','ni'),
      ML(S_HI,'v\u0101'),     ML(R_HI,'sa'),        ML(S_HI,'-'),        ML('d','u'),            ML('p','ra'),        ML('m','ga'),        ML('p','\u015ba'),
      ML('d','ya'),           ML(S_HI,'-'),         ML(R_HI,'na'),       ML(S_HI,'da'),          ML('d','-'),         ML('p','ya'),        ML('m','da'),
      ML('p','-'),            ML('d','r\u0101'),    ML('p','ja'),        ML('m','vi'),           ML('p','nu'),        ML('d','ta'),        ML(S_HI,'-'),
    ] },

  /* G4 — Keraya Neeranu | Triputa 7-beat | Lord Vishnu
     9 rows × 7 = 63 notes */
  { title:'Keraya Neeranu', raga:'Malahari',
    tala:'Chatusra \u00B7 Triputa', deity:'Lord Vishnu',
    notes:[
      ML('s','ke'),           ML('r','re'),          ML('m','ya'),         ML('p','n\u012b'),     ML('d','ra'),        ML('s','nu'),        ML('s','-'),
      ML('s','ke'),           ML('r','re'),          ML('d','-'),          ML('p','ge'),          ML('m','-'),         ML('p','jal'),       ML('p','li'),
      ML('d','va'),           ML('s','ra'),          ML('s','va'),         ML('r','pa'),          ML('d','de'),        ML('p','da'),        ML('m','-'),
      ML('p','va'),           ML('d','ra'),          ML('p','va'),         ML('m','pa'),          ML('r','de'),        ML('s','da'),        ML('s','-'),
      ML('r','ran'),          ML('m','te'),          ML('p','-'),          ML('d','k\u0101'),     ML('m','ne'),        ML('p','ro'),        ML('d','-'),
      ML(S_HI,'Ha'),          ML(R_HI,'ri'),         ML(S_HI,'ya'),        ML('d','ka'),          ML('p','ru'),        ML('m','\u1e47\u0101'), ML('p','-'),
      ML('d','do'),           ML(S_HI,'l\u0101'),   ML(R_HI,'da'),        ML(S_HI,'bh\u0101'),   ML('d','gya'),       ML('p','va'),        ML('m','-'),
      ML('p','Ha'),           ML('d','ri'),          ML('p','sam'),        ML('m','ar'),          ML('r','pa'),        ML('s','ne'),        ML('s','-'),
      ML('r','m\u0101'),      ML('m','di'),          ML('p','ba'),         ML('d','du'),          ML('m','ki'),        ML('p','ro'),        ML('d','-'),
    ] },

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

/* NT_AANJANEYAM — \u0100njan\u0113yam Sad\u0101  (108 notes, Tishra Eka padded to 4-beat rows) */
const NT_AANJANEYAM=[
    SN('s','An'),    SN('r','ja'),    SN('g','n\u0113'),   SH(8.0,'-'),
    SN('m','yam'),   SN('p','sa'),    SN('d','d\u0101'),   SH(10.0,'-'),
    SN('n','bh\u0101'),SN('\u1E60','-'),SN('\u1E60','va'),  SH(12.0,'-'),
    SN('n','ja'),    SN('d','y\u0101'),SN('p','mi'),        SH(9.5,'-'),
    SN('m','-'),     SN('g','a'),     SN('r','pra'),        SH(6.5,'-'),
    SN('s','m\u0113'),SN('r','yam'),  SN('g','mu'),         SH(8.0,'-'),
    SN('m','d\u0101'),SN('p','cin'),  SN('d','ta'),         SH(10.0,'-'),
    SN('n','y\u0101'),SN('\u1E60','mi'),SN('\u1E58','-'),   SH(12.5,'-'),
    SN('\u1E60','An'),SN('n','ja'),   SN('d','n\u0101'),    SH(10.0,'-'),
    SN('p','nan'),   SN('m','dam'),   SN('g','v\u0101'),    SH(8.0,'-'),
    SN('r','na'),    SN('s','r\u0113'),SN('r','sham'),      SH(6.5,'-'),
    SN('g','pa'),    SN('m','\u00f1ca'),SN('p','vak'),      SH(9.5,'-'),
    SN('d','tram'),  SN('n','su'),    SN('\u1E60','r\u0113'),SH(12.0,'-'),
    SN('\u1E60','sh\u0101'),SN('n','di'),SN('d','van'),     SH(10.0,'-'),
    SN('p','dyam'),  SN('m','gu'),    SN('g','ru'),         SH(8.0,'-'),
    SN('r','gu'),    SN('s','ha'),    SN('r','hi'),         SH(6.5,'-'),
    SN('g','tam'),   SN('m','sh\u0101n'),SN('p','tam'),     SH(9.5,'-'),
    SN('d','s\u0113'),SN('n','vi'),   SN('\u1E60','ta'),    SH(12.0,'-'),
    SN('\u1E60','shr\u012b'),SN('n','r\u0101'),SN('d','ma'),SH(10.0,'-'),
    SN('p','p\u0101'),SN('m','da'),   SN('g','pan'),        SH(8.0,'-'),
    SN('r','ka'),    SN('s','jam'),   SN('r','san'),        SH(6.5,'-'),
    SN('g','j\u012b'),SN('m','vi'),   SN('p','pa'),         SH(9.5,'-'),
    SN('d','rva'),   SN('n','ta'),    SN('\u1E60','ka'),     SH(12.0,'-'),
    SN('\u1E60','ram'),SN('n','mu'),  SN('d','kh\u0101m'),  SH(10.0,'-'),
    SN('p','jam'),   SN('m','sa'),    SN('g','d\u0101'),    SH(8.0,'-'),
    SN('r','r\u0101'),SN('s','ma'),   SN('s','can'),        SH(6.0,'-'),
    SN('r','dram'),  SN('g','bha'),   SN('m','j\u0113'),    SH(8.5,'-'),
];

/* NT_DAASHARATHA — D\u0101\u015bharathe  (72 notes, Tishra Eka padded to 4-beat rows) */
const NT_DAASHARATHA=[
    SN('s','D\u0101'),  SN('r','sha'),  SN('g','ra'),         SH(8.0,'-'),
    SN('m','th\u0113'), SN('p','d\u012b'),SN('m','na'),       SH(8.5,'-'),
    SN('g','da'),       SN('r','y\u0101'),SN('s','ni'),       SH(6.0,'-'),
    SN('r','dh\u0113'), SN('g','d\u0101'),SN('m','na'),       SH(8.5,'-'),
    SN('p','va'),       SN('d','bh\u012b'),SN('p','ka'),      SH(9.5,'-'),
    SN('m','ra'),       SN('g','d\u0101'),SN('r','mo'),       SH(6.5,'-'),
    SN('s','da'),       SN('r','ra'),   SN('g','k\u0113'),    SH(8.0,'-'),
    SN('m','sha'),      SN('p','va'),   SN('d','m\u0101'),    SH(10.0,'-'),
    SN('p','ma'),       SN('m','va'),   SN('g','s\u012b'),    SH(8.0,'-'),
    SN('r','t\u0101'),  SN('s','dha'),  SN('r','va'),         SH(6.5,'-'),
    SN('g','k\u0113'),  SN('m','y\u016b'),SN('p','ra'),       SH(9.5,'-'),
    SN('d','h\u0101'),  SN('n','ra'),   SN('\u1E60','ra'),     SH(12.0,'-'),
    SN('\u1E60','ghu'), SN('n','ku'),   SN('d','la'),         SH(10.0,'-'),
    SN('p','ti'),       SN('m','la'),   SN('g','ka'),         SH(8.0,'-'),
    SN('r','gu'),       SN('s','ru'),   SN('r','gu'),         SH(6.5,'-'),
    SN('g','ha'),       SN('m','van'),  SN('p','di'),         SH(9.5,'-'),
    SN('d','ta'),       SN('n','su'),   SN('\u1E60','ra'),     SH(12.0,'-'),
    SN('\u1E60','p\u016b'),SN('n','ji'),SN('d','ta'),         SH(10.0,'-'),
];

/* NT_SAMAGANA — Sama G\u0101na Priye  (128 notes, Chatusra Adi, 4 rows x 32)
   2nd Kala composition: 4 sub-units per beat, 32 notes per tala cycle.
   Each beat is written as 4 consecutive SN entries.              */
const NT_SAMAGANA=[
    /* ROW 1 — s\u0101ma-g\u0101na priy\u0113 k\u0101ma-k\u014d\u1e6di nilaye */
    SN('s','s\u0101'),SN('-','-'),SN('-','-'),SN('r','ma'),
    SN('g','g\u0101'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('s','na'),SN('-','-'),SN('-','-'),SN('r','Pri'),
    SN('g','y\u0113'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('s','k\u0101'),SN('-','-'),SN('r','ma'),SN('-','-'),
    SN('g','k\u014d'),SN('-','-'),SN('p','\u1e6di'),SN('-','-'),
    SN('m','ni'),SN('-','-'),SN('g','la'),SN('-','-'),
    SN('r','y\u0113'),SN('-','-'),SN('-','-'),SN('-','-'),
    /* ROW 2 — \u015ba\u1e45kar\u012b sundar\u012b s\u0101ra-tara lahar\u012b */
    SN('\u1E45','\u015bhan'),SN('-','-'),SN('-','-'),SN('s','ka'),
    SN('r','r\u012b'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('\u1E45','sun'),SN('-','-'),SN('-','-'),SN('s','da'),
    SN('r','r\u012b'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('p','s\u0101'),SN('-','-'),SN('-','-'),SN('m','ra'),
    SN('g','ta'),SN('r','ra'),SN('s','la'),SN('\u1E45','ha'),
    SN('s','r\u012b'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('-','-'),SN('-','-'),SN('-','-'),SN('-','-'),
    /* ROW 3 — ca\u1e47\u1e0dik\u0113 nirmal\u0113 k\u0101min\u012b m\u014ddin\u012b */
    SN('\u1E60','cha\u1e47'),SN('-','-'),SN('-','-'),SN('n','di'),
    SN('d','k\u0113'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('d','nir'),SN('-','-'),SN('-','-'),SN('p','ma'),
    SN('m','l\u0113'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('m','k\u0101'),SN('-','-'),SN('-','-'),SN('g','mi'),
    SN('r','n\u012b'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('g','m\u014d'),SN('-','-'),SN('-','-'),SN('m','di'),
    SN('p','n\u012b'),SN('-','-'),SN('-','-'),SN('-','-'),
    /* ROW 4 — p\u0101hi guru-guha janan\u012b k\u0101m\u0101k\u1e63\u012b */
    SN('p','p\u0101'),SN('-','-'),SN('-','-'),SN('m','hi'),
    SN('g','gu'),SN('r','ru'),SN('s','gu'),SN('\u1E45','ha'),
    SN('s','ja'),SN('r','na'),SN('g','n\u012b'),SN('-','-'),
    SN('-','-'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('\u1E45','k\u0101'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('r','m\u0101'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('s','k\u1e63\u012b'),SN('-','-'),SN('-','-'),SN('-','-'),
    SN('-','-'),SN('-','-'),SN('-','-'),SN('-','-'),
];

/* NT_CINTAYEHAM — Cintayēham Sadā  (56 notes, Chatusra Eka)
   Source: Subbarama Dikshitar Prathamabhyasa Pustakamu #8
   Pitch map: s=6, r=6.5, g=8, m=8.5, p=9.5, d=10, n=11.5, S=12
   (all in _PSH relative to Ṡ=12 as tonic for this piece)         */
const NT_CINTAYEHAM=[
    /* Row 1 — cintayēham sadā citsabhānayakam */
    SN('p','cin'),       SN('p','ta'),      SN('\u1E60','yē'),    SN('p','ham'),
    SN('p','sa'),        SN('p','dā'),      SN('p','cit'),        SN('\u1E60','sa'),
    /* Row 2 — cintitārthadāyakam jīveśvara bhēdāpaham */
    SN('\u1E60','bhā'),  SN('p','nā'),      SN('d','ya'),         SN('p','kam'),
    SN('m','cin'),       SN('g','ti'),      SN('r','tār'),        SN('s','tha'),
    /* Row 3 — cintāmaṇi svarūpam */
    SN('r','dā'),        SN('g','ya'),      SN('m','kam'),        SN('p','jī'),
    SN('d','vē'),        SN('n','śva'),     SN('\u1E60','ra'),     SN('\u1E60','bhē'),
    /* Row 4 — tāṇḍavēśvaram śāntam munimahitam */
    SN('n','dā'),        SN('d','pa'),      SN('p','ham'),        SN('m','cin'),
    SN('g','tā'),        SN('r','ma'),      SN('s','ṇi'),         SN('r','sva'),
    /* Row 5 — sa guruguham śankaram santatam */
    SN('g','rū'),        SN('m','pam'),     SN('p','tāṇ'),        SN('d','ḍa'),
    SN('n','vē'),        SN('\u1E60','śva'),SN('n','ram'),         SN('d','śān'),
    /* Row 6 — sāmbavīśam mudā bhavayē */
    SN('p','tam'),       SN('m','mu'),      SN('g','ni'),         SN('r','ma'),
    SN('s','hi'),        SN('r','tam'),     SN('g','sa'),         SN('m','gu'),
    /* Row 7 — (continuation) */
    SN('p','ru'),        SN('d','gu'),      SN('n','ham'),        SN('\u1E60','śan'),
    SN('\u1E60','ka'),   SN('n','ram'),     SN('d','-'),           SN('p','-'),
];

/* NT_PAAHI_DURGE — P\u0101hi Durg\u0113  (40 notes, Chatusra Eka) */
const NT_PAAHI_DURGE=[
    SN('s','P\u0101'),   SN('r','hi'),    SN('g','dur'),        SN('m','g\u0113'),
    SN('p','bhak'),      SN('d','tam'),   SN('n','t\u0113'),    SN('\u1E60','-'),
    SN('\u1E60','pad'),  SN('n','ma'),    SN('d','ka'),         SN('p','r\u0113'),
    SN('m','vi'),        SN('g','ja'),    SN('r','ya'),         SN('s','shak'),
    SN('r','t\u0113'),   SN('g','\u0113'),SN('m','hi'),         SN('p','d\u0113'),
    SN('d','hi'),        SN('n','sar'),   SN('\u1E60','vaj'),   SN('\u1E60','\u00f1\u0113'),
    SN('n','ya'),        SN('d','ti'),    SN('p','nu'),         SN('m','ta'),
    SN('g','ga'),        SN('m','\u1e47a'),SN('p','pa'),        SN('d','ti'),
    SN('n','gu'),        SN('\u1E60','ru'),SN('n','gu'),         SN('d','ha'),
    SN('p','ja'),        SN('m','na'),    SN('g','ni'),         SN('r','m\u0101m'),
];

/* NT_RAJEEVALOCHAN — R\u0101j\u012bvaloocanam  (44 notes, Chatusra Eka) */
const NT_RAJEEVALOCHAN=[
    SN('s','R\u0101'),   SN('r','j\u012b'),SN('g','va'),        SN('m','l\u014d'),
    SN('p','ca'),        SN('d','nam'),   SN('n','r\u0101'),    SN('\u1E60','ma'),
    SN('\u1E60','can'),  SN('n','dram'),  SN('d','-'),          SN('p','-'),
    SN('m','ra'),        SN('g','ghu'),   SN('r','va'),         SN('s','ra'),
    SN('r','va'),        SN('g','ra'),    SN('m','dam'),        SN('p','ra'),
    SN('d','ghu'),       SN('n','nan'),   SN('\u1E60','da'),     SN('\u1E60','nam'),
    SN('n','s\u012b'),   SN('d','t\u0101'),SN('p','val'),       SN('m','la'),
    SN('g','bham'),      SN('r','su'),    SN('s','ra'),         SN('r','van'),
    SN('g','dyam'),      SN('m','gu'),    SN('p','ru'),         SN('d','gu'),
    SN('n','ha'),        SN('\u1E60','nu'),SN('\u1E60','tam'),   SN('n','ka'),
    SN('d','ru'),        SN('p','\u1e47\u0101'),SN('m','ni'),   SN('g','dhim'),
];

/* NT_GURUGUHA_PADA — Guruguha Pada Pa\u1e45kaja  (88 notes, Tishra Eka padded) */
const NT_GURUGUHA_PADA=[
    SN('s','gu'),         SN('r','ru'),    SN('g','gu'),         SH(8.0,'-'),
    SN('r','ha'),         SN('s','pa'),    SN('\u1E45','da'),     SH(5.5,'-'),
    SN('\u1E0B','pan'),   SN('\u1E45','ka'),SN('s','ja'),        SH(6.0,'-'),
    SN('r','ma'),         SN('g','ti'),    SN('m','gu'),         SH(8.5,'-'),
    SN('p','pta'),        SN('d','ma'),    SN('n','ni'),         SH(11.5,'-'),
    SN('\u1E60','\u015ba'),SN('\u1E60','ma'),SN('n','\u015bra'), SH(11.5,'-'),
    SN('d','y\u0113'),    SN('p','-'),     SN('m','-'),          SH(8.5,'-'),
    SN('s','ni'),         SN('r','ra'),    SN('g','ti'),         SH(8.0,'-'),
    SN('r','\u015ba'),    SN('s','ya'),    SN('\u1E45','ni'),     SH(5.5,'-'),
    SN('\u1E0B','ja'),    SN('\u1E45','pra'),SN('s','k\u0101'),  SH(6.0,'-'),
    SN('r','\u015ba'),    SN('g','k\u0101'),SN('m','ni'),        SH(8.5,'-'),
    SN('p','tya'),        SN('d','su'),    SN('n','kha'),        SH(11.5,'-'),
    SN('\u1E60','pra'),   SN('\u1E60','la'),SN('n','pra'),       SH(11.5,'-'),
    SN('d','dam'),        SN('p','-'),     SN('m','-'),          SH(8.5,'-'),
    SN('g','n\u012b'),    SN('r','ra'),    SN('s','ja'),         SH(6.0,'-'),
    SN('r','na'),         SN('g','bha'),   SN('m','pu'),         SH(8.5,'-'),
    SN('p','ran'),        SN('d','da'),    SN('n','ra'),         SH(11.5,'-'),
    SN('\u1E60','m\u0101'),SN('\u1E58','r\u0101'),SN('\u1E60','ri'),SH(12.0,'-'),
    SN('n','v\u0101'),    SN('d','ri'),    SN('p','ja'),         SH(9.5,'-'),
    SN('m','sam'),        SN('g','bha'),   SN('r','va'),         SH(6.5,'-'),
    SN('s','v\u0113'),    SN('r','di'),    SN('g','ta'),         SH(8.0,'-'),
    SN('m','vyam'),       SN('p','-'),     SN('d','-'),          SH(10.0,'-'),
];

/* NT_SAKALA — Sakala Suravinuta  (48 notes, Chatusra Eka) */
const NT_SAKALA=[
    SN('s','sa'),         SN('r','ka'),    SN('g','la'),         SN('m','su'),
    SN('p','ra'),         SN('d','vi'),    SN('n','nu'),         SN('\u1E60','ta'),
    SN('\u1E60','shr\u012b'),SN('n','ni'), SN('d','v\u0101'),    SN('p','sa'),
    SN('m','m\u0101'),    SN('g','dha'),   SN('r','va'),         SN('s','k\u0113'),
    SN('r','sha'),        SN('g','va'),    SN('m','na'),         SN('p','r\u0101'),
    SN('d','ya'),         SN('n','na'),    SN('\u1E60','r\u0101'),SN('\u1E60','ya'),
    SN('n','na'),         SN('d','gu'),    SN('p','ru'),         SN('m','gu'),
    SN('g','ha'),         SN('r','nu'),    SN('s','ta'),         SN('r','ma'),
    SN('g','la'),         SN('m','ka'),    SN('p','m\u0101'),    SN('d','la'),
    SN('n','ka'),         SN('\u1E60','nta'),SN('\u1E60','ka'),   SN('n','ru'),
    SN('d','\u1e47\u0101'),SN('p','ka'),  SN('m','ra'),         SN('g','vi'),
    SN('r','nu'),         SN('s','ta'),    SN('r','-'),          SN('g','-'),
];

/* NT_KAANCHI — K\u0101\u00f1c\u012b\u015bam  (44 notes, Chatusra Eka) */
const NT_KAANCHI=[
    SN('s','k\u0101\u00f1'),SN('r','c\u012b'),SN('g','\u015bam'),SN('m','k\u0101'),
    SN('p','m\u0101'),    SN('d','kshi'),  SN('n','ra'),         SN('\u1E60','ma'),
    SN('\u1E60','\u1e47am'),SN('n','sa'),  SN('d','d\u0101'),    SN('p','bha'),
    SN('m','j\u0101'),    SN('g','mi'),    SN('r','gu'),         SN('s','ru'),
    SN('r','gu'),         SN('g','ha'),    SN('m','nu'),         SN('p','tam'),
    SN('d','\u015ban'),   SN('n','ka'),    SN('\u1E60','ra'),     SN('\u1E60','ka'),
    SN('n','ru'),         SN('d','\u1e47\u0101'),SN('p','ka'),   SN('m','ra'),
    SN('g','\u015bi'),    SN('r','va'),    SN('s','\u015bi'),     SN('r','va'),
    SN('g','kai'),        SN('m','l\u0101'),SN('p','sa'),        SN('d','v\u0101'),
    SN('n','sa'),         SN('\u1E60','par'),SN('n','va'),        SN('d','t\u012b'),
    SN('p','pri'),        SN('m','ya'),    SN('g','-'),          SN('r','-'),
];

/* NT_SHREE_GANA_EESA — \u015ar\u012b Ga\u1e47an\u0101tham  (42 notes, Chatusra Roopaka) */
const NT_SHREE_GANA_EESA=[
    SN('s','shr\u012b'),  SN('r','ga'),    SN('g','\u1e47a'),    SN('m','n\u0101'),    SN('p','tham'),  SN('d','bha'),
    SN('n','j\u0113'),    SN('\u1E60','ham'),SN('\u1E60','vi'),   SN('n','ghn\u0113'),  SN('d','shva'),  SN('p','ram'),
    SN('m','vi'),         SN('g','ghna'),  SN('r','n\u0101'),    SN('s','sha'),         SN('r','kam'),   SN('g','gu'),
    SN('m','ru'),         SN('p','gu'),    SN('d','ha'),         SN('n','pri'),         SN('\u1E60','yam'),SN('\u1E60','ga'),
    SN('n','\u1e47a'),    SN('d','n\u0101'),SN('p','ya'),        SN('m','kam'),         SN('g','ka'),    SN('r','ma'),
    SN('s','l\u0101'),    SN('r','sam'),   SN('g','bha'),        SN('m','va'),          SN('p','van'),   SN('d','di'),
    SN('n','ta'),         SN('\u1E60','p\u0101'),SN('n','d\u0101m'),SN('d','bu'),       SN('p','jam'),   SN('m','-'),
];

/* NT_MAAYE — M\u0101y\u0113 Citkal\u0113  (40 notes, Chatusra Eka) */
const NT_MAAYE=[
    SN('s','m\u0101'),    SN('r','y\u0113'),SN('g','cit'),       SN('m','ka'),
    SN('p','l\u0113'),    SN('d','m\u0101m'),SN('n','p\u0101'),  SN('\u1E60','hi'),
    SN('\u1E60','par'),   SN('n','va'),    SN('d','t\u012b'),     SN('p','gu'),
    SN('m','ru'),         SN('g','gu'),    SN('r','ha'),         SN('s','ja'),
    SN('r','na'),         SN('g','ni'),    SN('m','\u015ban'),    SN('p','ka'),
    SN('d','ri'),         SN('n','sun'),   SN('\u1E60','da'),     SN('\u1E60','ri'),
    SN('n','s\u0101'),    SN('d','ra'),    SN('p','la'),         SN('m','ha'),
    SN('g','ri'),         SN('r','k\u0101'),SN('s','mi'),        SN('r','ni'),
    SN('g','m\u014d'),    SN('m','di'),    SN('p','ni'),         SN('d','k\u0101'),
    SN('n','m\u0101'),    SN('\u1E60','kshi'),SN('\u1E60','-'),   SN('n','-'),
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
    lines: NT_AANJANEYAM,
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
    lines: NT_DAASHARATHA,
  },
  {
    title:'Sama G\u0101na Priye', deity:'Goddess Kamakshi',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Adi',
    subUnitsPerBeat:4, compositionKala:'Dwitiya',
    lyrics:[
      's\u0101ma-g\u0101na priy\u0113 k\u0101ma-k\u014d\u1e6di nilaye',
      '\u015ba\u1e45kar\u012b sundar\u012b s\u0101ra-tara lahar\u012b',
      'ca\u1e47\u1e0dik\u0113 nirmal\u0113 k\u0101min\u012b m\u014ddin\u012b',
      'p\u0101hi guru-guha janan\u012b k\u0101m\u0101k\u1e63\u012b',
    ],
    lines: NT_SAMAGANA,
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
    lines: NT_CINTAYEHAM,
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
    lines: NT_PAAHI_DURGE,
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
    lines: NT_RAJEEVALOCHAN,
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
    title:'Guruguha Pada Pa\u1e45kaja', deity:'Lord Murugan',
    raga:'Shankarabharanam', tala:'Chatusra \u00B7 Eka',
    lyrics:[
      'guruguha pada pa\u1e45kaja manuta',
      'nirat\u012b\u015baya sukha prad\u0101yaka',
      'm\u0101r\u0101ri v\u0101rija sambhava v\u0113dita',
      'p\u0101vana guru-guha nuta k\u012brtana',
    ],
    lines: NT_GURUGUHA_PADA,
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
    lines: NT_SAKALA,
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
    lines: NT_KAANCHI,
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
    lines: NT_SHREE_GANA_EESA,
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
    lines: NT_MAAYE,
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
