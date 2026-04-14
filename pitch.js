'use strict';
/* ═══════════════════════════════════════════════════════════
   pitch.js — unified pitch system, chart constants, helpers
   Depends on: lessonData.js (S_HI, R_HI)
═══════════════════════════════════════════════════════════ */

/* ── Canvas geometry constants ── */
const CW = 820, CH = 150;
const PL = 58, PR = 16, PT = 28, PB = 32;
const PLOT_W = CW - PL - PR;   // 746
const PLOT_H = CH - PT - PB;   // 90

/* ══════════════════════════════════════
   UNIFIED SCALE DEFINITIONS (new API)
   Equal-temperament frequencies from Sa.
   intervals: semitones from Sa for each
   swara position (null = absent in scale).
══════════════════════════════════════ */
const SCALES = {
    Mayamalavagowla: {
        saHz: 196.00,
        // Sa R1 G3 M1 Pa D1 N3
        intervals: [0, 1, 4, 5, 7, 8, 11],
    },
    Shankarabharanam: {
        saHz: 196.00,
        // Sa R2 G3 M1 Pa D2 N3
        intervals: [0, 2, 4, 5, 7, 9, 11],
    },
    Malahari: {
        saHz: 196.00,
        // Sa R1 (–) M1 Pa D1 (–)  pentatonic
        intervals: [0, 1, null, 5, 7, 8, null],
    },
    Kalyani: {
        saHz: 196.00,
        // Sa R2 G3 M2 Pa D2 N3
        intervals: [0, 2, 4, 6, 7, 9, 11],
    },
    Mohanam: {
        saHz: 196.00,
        // Sa R2 G3 (–) Pa D2 (–)  pentatonic
        intervals: [0, 2, 4, null, 7, 9, null],
    },
};

/* Map swara index (0-6) to semitone for a given scale */
function noteToSemitone(swaraIndex, octave, scale) {
    const def = SCALES[scale];
    if (!def) return 0;
    const base = def.intervals[swaraIndex];
    if (base === null || base === undefined) return null;
    const octaveOffset = { mandra: -12, madhya: 0, tara: 12 }[octave] || 0;
    return base + octaveOffset;
}

/* Equal-temperament Hz for a given swara */
function noteToHz(swaraIndex, octave, scale) {
    const st = noteToSemitone(swaraIndex, octave, scale);
    if (st === null) return null;
    return SCALES[scale].saHz * Math.pow(2, st / 12);
}

/* ══════════════════════════════════════
   LEGACY PITCH SYSTEM
   Kept for backward compatibility with
   lessonData.js and the existing render
   pipeline. Chart still uses pitchConfig
   objects and numeric pitch values.
══════════════════════════════════════ */

/* Just-intonation frequencies, Sa = G (196 Hz) */
/* S_HI and R_HI are computed property keys from lessonData.js */
const FREQ = {
    's' :196.00, 'r':209.07,  'g':245.00,  'm':261.33,
    'p' :294.00, 'd':313.60,  'n':367.50,
    [S_HI]:392.00, [R_HI]:418.14,
};

/* Y-axis label sets */
const Y_LABELS = [
    {name:'Sa',   pitch:0.0}, {name:'Ri',  pitch:0.5},
    {name:'Ga',   pitch:2.0}, {name:'Ma',  pitch:2.5},
    {name:'Pa',   pitch:3.5}, {name:'Da',  pitch:4.0},
    {name:'Ni',   pitch:5.5}, {name:"Sa'", pitch:6.0},
    {name:"Ri'",  pitch:6.5},
];

const NT_Y_LABELS = [
    {name:'\u1E61', pitch:0.0},
    {name:'\u1E0B', pitch:4.0},
    {name:'\u1E45', pitch:5.5},
    {name:'s',      pitch:6.0},
    {name:'r',      pitch:6.5},
    {name:'g',      pitch:8.0},
    {name:'m',      pitch:8.5},
    {name:'p',      pitch:9.5},
    {name:'d',      pitch:10.0},
    {name:'n',      pitch:11.5},
    {name:'\u1E60', pitch:12.0},
    {name:'\u1E58', pitch:12.5},
];

const MALAHARI_Y_LABELS = [
    {name:'Sa',  pitch:0.0}, {name:'Ri', pitch:0.5},
    {name:'Ma',  pitch:2.5}, {name:'Pa', pitch:3.5},
    {name:'Da',  pitch:4.0}, {name:"Sa'",pitch:6.0},
];

/* Pitch config objects used by chart rendering */
const PITCH_CONFIG_DEFAULT  = { min:0.0,  max:7.0,  labels:Y_LABELS };
const PITCH_CONFIG_NT       = { min:0.0,  max:12.5, labels:NT_Y_LABELS };
const PITCH_CONFIG_MALAHARI = { min:0.0,  max:7.0,  labels:MALAHARI_Y_LABELS };

/* 3-octave pitch config for Custom Builder */
const _CB_3OCT_Y_LABELS = [
    {name:'\u1E61',pitch:-6.0},{name:'\u1E59',pitch:-5.5},{name:'\u0121',pitch:-4.0},
    {name:'\u1E41',pitch:-3.5},{name:'\u1E57',pitch:-2.5},{name:'\u1E0B',pitch:-2.0},
    {name:'\u1E45',pitch:-0.5},
    {name:'s',pitch:0.0},{name:'r',pitch:0.5},{name:'g',pitch:2.0},
    {name:'m',pitch:2.5},{name:'p',pitch:3.5},{name:'d',pitch:4.0},
    {name:'n',pitch:5.5},{name:'\u1E60',pitch:6.0},
    {name:'\u1E58',pitch:6.5},{name:'\u0120',pitch:8.0},{name:'\u1E40',pitch:8.5},
    {name:'\u1E56',pitch:9.5},{name:'\u1E0A',pitch:10.0},{name:'\u1E44',pitch:11.5},
    {name:'S2',pitch:12.0},
];
const PITCH_CONFIG_CUSTOM_3OCT = { min:-6.0, max:12.5, labels:_CB_3OCT_Y_LABELS };

/* ── Coordinate helpers — reference app-state globals ── */
/* xFor: maps beat index (0-based) to canvas x position */
function xFor(beat) {
    return PL + (beat / (currentBeatsPerRow - 1)) * PLOT_W;
}

/* xForNote: maps note index within a row to canvas x */
function xForNote(ni) {
    return notesPerRow <= 1
        ? PL + PLOT_W / 2
        : PL + 8 + (ni / (notesPerRow - 1)) * (PLOT_W - 16);
}

/* yFor: maps pitch value to canvas y */
function yFor(pitch) {
    return PT + (1 - (pitch - currentPitchConfig.min) /
        (currentPitchConfig.max - currentPitchConfig.min)) * PLOT_H;
}

/* ── Y-axis label filter ── */
function getFilteredYLabels(pitchConfig) {
    let allowed, priorityOrder;
    if (pitchConfig === PITCH_CONFIG_NT) {
        allowed = new Set(['\u1E61','\u1E45','s','r','g','m','p','d','n','\u1E60']);
        priorityOrder = ['s','\u1E60','p','m','g','r','d','n','\u1E61','\u1E45'];
    } else if (pitchConfig === PITCH_CONFIG_MALAHARI) {
        allowed = new Set(['Sa','Ri','Ma','Pa','Da',"Sa'"]);
        priorityOrder = ['Sa',"Sa'",'Pa','Ma','Ri','Da'];
    } else {
        allowed = new Set(['Sa','Ri','Ga','Ma','Pa','Da','Ni',"Sa'"]);
        priorityOrder = ['Sa',"Sa'",'Pa','Ma','Ga','Ri','Da','Ni'];
    }

    const yLocal = p => PT + (1 - (p - pitchConfig.min) /
        (pitchConfig.max - pitchConfig.min)) * PLOT_H;
    const getPri = name => { const i = priorityOrder.indexOf(name); return i === -1 ? 999 : i; };

    const filtered = pitchConfig.labels
        .filter(yl => allowed.has(yl.name))
        .sort((a, b) => getPri(a.name) - getPri(b.name));

    const selected = [];
    for (const yl of filtered) {
        const y = yLocal(yl.pitch);
        if (!selected.some(s => Math.abs(yLocal(s.pitch) - y) < 14)) {
            selected.push(yl);
        }
    }
    return selected;
}

/* ── HTML escape utility (used by chart.js and app.js) ── */
function _esc(s) {
    return String(s || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
