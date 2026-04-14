'use strict';
/* ═══════════════════════════════════════════════════════════
   app.js — main coordinator: state, lesson loading, playback,
            progress tracker, custom builder, print, event listeners.
   Depends on: lessonData.js, pitch.js, audio.js, tala.js, chart.js
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   SHARED MUTABLE STATE
   (referenced as globals by all modules)
══════════════════════════════════════ */
let activeGradeIdx   = 0;
let activeVerseIdx   = 0;
let currentNotes     = [];
let currentGlobalIdx = -1;
let seqTimer         = null;
let placeholderMode  = false;
let currentPitchConfig = PITCH_CONFIG_DEFAULT;

/* Tala state — set by setTalaPattern() in tala.js */
let currentTalaPattern = ADI_TALA;
let currentBeatsPerRow = 8;
let currentTalaGroups  = [4, 2, 2];

let currentBPM    = 90;
let currentMult   = 1;
let noteDuration  = Math.round(60000 / 90);  // ms per note
let notesPerRow   = 8;                        // = currentBeatsPerRow * currentMult
let _ntSubUnits   = 1;                        // sub-units per beat for current song

/* Custom Builder state */
let customMode     = false;
let customNotes    = [];
let customPieces   = [];
let _customFreqMap = {};
let _cbBeatBuffer  = [];      // notes being entered for current sub-unit beat
let _cbBeatPhase   = 'entry'; // 'entry' | 'lyric'

let toastTimer = null;

/* ══════════════════════════════════════
   CONSTANTS
══════════════════════════════════════ */
const PROGRESS_KEY  = 'nadabodha_progress';
const STREAK_KEY    = 'nadabodha_streak';
const CUSTOM_LS_KEY = 'nadabodha_custom_pieces';

const _HDR_ICON  = '<svg width="28" height="28" viewBox="0 0 44 44" style="vertical-align:middle;margin-right:8px;flex-shrink:0"><circle cx="22" cy="22" r="20" fill="none" stroke="#D4A017" stroke-width="1.5"/><path d="M10,22 Q14,14 18,22 Q22,30 26,22 Q30,14 34,22" fill="none" stroke="#F5C842" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="10" r="2.5" fill="#F5C842"/><line x1="38" y1="16" x2="38" y2="28" stroke="#D4A017" stroke-width="1.5" stroke-linecap="round"/></svg>';
const _HDR_BADGE = '<span style="background:#D4A017;color:#2C1006;font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px;vertical-align:middle;margin-left:8px;font-family:Arial,sans-serif;letter-spacing:0.5px;">v1.0</span>';

const KALA_MAP = {
    '0.5': {mult:0.5, name:'Chauka',   desc:'1 note/2 beats'},
    '1':   {mult:1,   name:'Madhyama', desc:'1 note/beat'},
    '2':   {mult:2,   name:'Dwitiya',  desc:'2 notes/beat'},
    '4':   {mult:4,   name:'Tritiya',  desc:'4 notes/beat'},
};

/* Extend FREQ with all 3-octave notes for Custom Builder */
Object.assign(FREQ, {
    /* lower octave (mandra sthāyi) */
    '\u1E61': 98.00,    /* ṡ  lower Sa */
    '\u1E59': 104.54,   /* ṙ  lower Ri */
    '\u0121': 122.50,   /* ġ  lower Ga */
    '\u1E41': 130.67,   /* ṁ  lower Ma */
    '\u1E57': 147.00,   /* ṗ  lower Pa */
    '\u1E0B': 156.80,   /* ḋ  lower Da */
    '\u1E45': 183.75,   /* ṅ  lower Ni */
    /* upper octave (tāra sthāyi) */
    '\u0120': 490.00,   /* Ġ  upper Ga */
    '\u1E40': 522.67,   /* Ṁ  upper Ma */
    '\u1E56': 588.00,   /* Ṗ  upper Pa */
    '\u1E0A': 627.20,   /* Ḋ  upper Da */
    '\u1E44': 735.00,   /* Ṅ  upper Ni */
    'S2'    : 784.00,   /* S2 upper-upper Sa */
    /* Kalyani tivra Ma */
    'M'     : 277.18,
});

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ══════════════════════════════════════
   VERSE BOX HTML
══════════════════════════════════════ */
function noteHTML(note) {
    if (note.label === '-' || note.label === '_') {
        return '<span class="vnote">' + note.label + '</span>';
    }
    if (note.pitch > 6.0) {
        return '<span class="vnote" style="position:relative;display:inline-block">' +
               '<span style="position:absolute;top:-5px;left:50%;transform:translateX(-50%);' +
               'width:4px;height:4px;border-radius:50%;background:#D4A017;display:block"></span>' +
               note.label + '</span>';
    }
    if (note.pitch < 0) {
        return '<span class="vnote" style="position:relative;display:inline-block">' +
               note.label +
               '<span style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);' +
               'width:4px;height:4px;border-radius:50%;background:#7BA3C0;display:block"></span>' +
               '</span>';
    }
    return '<span class="vnote">' + note.label + '</span>';
}

function buildLineHTML(notes) {
    const parts = [];
    const bpr = currentBeatsPerRow;
    const sepPos = new Set();
    let cum = 0;
    for (let g = 0; g < currentTalaGroups.length - 1; g++) {
        cum += currentTalaGroups[g];
        sepPos.add(cum);
    }
    notes.forEach((note, i) => {
        const pos = (i % bpr) + 1;
        if (pos === 1 && i > 0) parts.push('<span class="dbl-bar"> ||</span>');
        parts.push(noteHTML(note));
        if (sepPos.has(pos)) parts.push('<span class="sep">|</span>');
    });
    parts.push('<span class="dbl-bar"> ||</span>');
    return parts.join('\u2009');
}

function buildNotesHTML(notes) {
    const bpr = currentBeatsPerRow;
    const sepPos = new Set();
    let cum = 0;
    for (let g = 0; g < currentTalaGroups.length - 1; g++) {
        cum += currentTalaGroups[g];
        sepPos.add(cum);
    }
    let html = '';
    for (let i = 0; i < notes.length; i += bpr) {
        const cycle = notes.slice(i, i + bpr);
        const realNotes = cycle.filter(n => n.label !== '-');
        const firstPitch = realNotes.length > 0 ? realNotes[0].pitch : 0;
        const lastPitch  = realNotes.length > 0 ? realNotes[realNotes.length - 1].pitch : 0;
        const diff = lastPitch - firstPitch;
        const arrow = diff > 1.0 ? '\u2191' : diff < -1.0 ? '\u2193' : '\u2192';

        const parts = [];
        cycle.forEach((note, j) => {
            parts.push(noteHTML(note));
            if (sepPos.has(j + 1)) parts.push('<span class="sep">|</span>');
        });
        parts.push('<span class="dbl-bar"> ||</span>');
        html += `<div class="vline"><span class="vline-dir">${arrow}</span>\u2009${parts.join('\u2009')}</div>`;
    }
    return html;
}

function buildVerseHTML(verse) {
    if (verse.notes) return buildNotesHTML(verse.notes);
    let html = '';
    if (verse.line1 && verse.line1.length > 0)
        html += `<div class="vline"><span class="vline-dir">\u2191</span>\u2009${buildLineHTML(verse.line1)}</div>`;
    if (verse.line2 && verse.line2.length > 0)
        html += `<div class="vline"><span class="vline-dir">\u2193</span>\u2009${buildLineHTML(verse.line2)}</div>`;
    return html;
}

/* ══════════════════════════════════════
   PLAYBACK ENGINE
══════════════════════════════════════ */
function stopAll() {
    if (rafId)    { cancelAnimationFrame(rafId); rafId = null; }
    if (seqTimer) { clearTimeout(seqTimer); seqTimer = null; }
}

function doReset() {
    placeholderMode = false;
    lastPlayedFreq  = null;
    stopAllOscillators();
    stopAll(); currentGlobalIdx = -1; setActiveHand(-1); glowAngle = 0;
    const _frame = document.getElementById('chartScrollFrame');
    if (_frame) _frame.scrollTo({ top: 0, behavior: 'smooth' });
    const _palmSvg  = document.getElementById('beatPalmSvg');
    const _palmDots = document.getElementById('beatProgressDots');
    const _palmName = document.getElementById('beatPalmName');
    const _palmSol  = document.getElementById('beatPalmSolkattu');
    const _palmInd  = document.getElementById('beatPalmIndicator');
    if (_palmSvg)  _palmSvg.innerHTML    = '';
    if (_palmDots) _palmDots.innerHTML   = '';
    if (_palmName) _palmName.textContent = '';
    if (_palmSol)  _palmSol.textContent  = '';
    if (_palmInd)  _palmInd.style.display = 'none';
    render();
    document.getElementById('playBtn').disabled = false;
    document.getElementById('playBtn').textContent = '\u25BA\uFE0E\u00A0Play';
    _pgHideMarkBtn();
}

function playStep(idx) {
    if (idx >= currentNotes.length) {
        seqTimer = setTimeout(() => {
            currentGlobalIdx = -1; setActiveHand(-1); stopAll(); render();
            document.getElementById('playBtn').disabled = false;
            document.getElementById('playBtn').textContent = '\u25BA\uFE0E\u00A0Play';
            _pgOnPlayComplete();
        }, noteDuration);
        return;
    }
    const notesPerBeat  = currentMult >= 1 ? Math.round(currentMult * _ntSubUnits) : _ntSubUnits;
    const beatAbsolute  = currentMult >= 1 ? Math.floor(idx / notesPerBeat) : idx * 2;
    const isBeatBoundary = (idx % notesPerBeat === 0);

    currentGlobalIdx = idx;
    if (isBeatBoundary) {
        setActiveHand(idx, beatAbsolute);
        playMetro(beatAbsolute);
    }
    const _note = currentNotes[idx];
    if (_note.label !== '-') playTone(_note.label);
    seqTimer = setTimeout(() => playStep(idx + 1), noteDuration);
}

function startPlay() {
    stopAll(); currentGlobalIdx = -1; setActiveHand(-1); glowAngle = 0;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('playBtn').textContent = '\u25BA\uFE0E\u00A0Playing\u2026';
    animLoop();
    seqTimer = setTimeout(() => playStep(0), 100);
}

/* ══════════════════════════════════════
   BPM / KALA
══════════════════════════════════════ */
function updateBPM() {
    noteDuration = Math.round(60000 / currentBPM / currentMult / _ntSubUnits);
    notesPerRow  = Math.max(1, Math.round(currentBeatsPerRow * currentMult * _ntSubUnits));
    const k = Object.values(KALA_MAP).find(v => v.mult === currentMult) || KALA_MAP['1'];
    document.getElementById('bpmDisplay').textContent =
        '\u2669 = ' + currentBPM + ' BPM \u00B7 ' + k.name + ' Kala (' + k.desc + ')';
}

/* ══════════════════════════════════════
   LESSON LOADING
══════════════════════════════════════ */
function loadVerse(gradeIdx, verseIdx) {
    doReset();
    _ntSubUnits = 1;
    activeGradeIdx = gradeIdx; activeVerseIdx = verseIdx;
    const verse = LESSONS[gradeIdx].verses[verseIdx];
    if (verse.comingSoon) { showToast('Coming Soon \u2014 notes being added!'); return; }
    currentPitchConfig = (gradeIdx === 4) ? PITCH_CONFIG_MALAHARI : PITCH_CONFIG_DEFAULT;

    const grade = LESSONS[gradeIdx];
    const hRaga = verse.raga  || grade.raga  || 'Mayamalavagowla';
    const hTala = verse.tala  || grade.tala  || 'Chatusra \u00B7 Adi';
    document.getElementById('hdrRaga').textContent     = hRaga;
    document.getElementById('hdrTala').textContent     = hTala;
    document.getElementById('hdrTalaLabel').textContent = 'Jati \u0026 Thalam';

    setTalaPattern(hTala);

    currentNotes = verse.notes ? [...verse.notes] : [...verse.line1, ...(verse.line2 || [])];

    /* Resolve sustain pitches */
    let _lp = 0;
    currentNotes = currentNotes.map(n => {
        if (n.label === '-') return { label: '-', pitch: _lp };
        _lp = n.pitch;
        return n;
    });

    let lblText = 'Grade ' + (gradeIdx + 1) + ' \u00B7 ' + verse.title;
    if (verse.raga) lblText += ' \u00B7 ' + verse.raga;
    document.getElementById('verseLabel').textContent = lblText;

    const nd = document.getElementById('verseNotes');
    nd.style.fontSize    = currentNotes.length > 24 ? '1.0rem' : currentNotes.length > 16 ? '1.15rem' : '1.3rem';
    nd.style.letterSpacing = currentNotes.length > 16 ? '.1em' : '.17em';

    if (verse.talaInfo) {
        nd.innerHTML = `<span class="nottu-meta">${verse.talaInfo}</span>`;
        if (verse.line1) nd.innerHTML += '<br>' + buildVerseHTML(verse);
    } else {
        nd.innerHTML = buildVerseHTML(verse);
    }

    buildChartSection(currentNotes);
    render();

    document.querySelectorAll('.verse-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === verseIdx);
    });
}

function loadNottuswaram(item) {
    doReset();
    document.getElementById('hdrTitle').innerHTML =
        item.title + '<br><span style="font-size:13px;color:#E8C97E;font-weight:normal;letter-spacing:.06em;">' +
        item.raga + '</span>';
    document.getElementById('hdrTalaLabel').textContent = 'Thalam';
    document.getElementById('hdrTala').textContent      = item.tala;
    document.getElementById('hdrRaga').textContent      = item.raga;
    setTalaPattern(item.tala);

    document.getElementById('verseLabel').textContent = item.title;
    const nd = document.getElementById('verseNotes');
    nd.style.letterSpacing = '.04em';

    if (item.lines) {
        _ntSubUnits = item.subUnitsPerBeat || 1;
        currentPitchConfig = PITCH_CONFIG_NT;
        let _ntLp = currentPitchConfig.min;
        currentNotes = item.lines.map(n => {
            if (n.label === '-') return { ...n, pitch: _ntLp };
            _ntLp = n.pitch;
            return n;
        });
        nd.style.fontSize = '.88rem';
        let ndHTML = item.lyrics.map(l =>
            `<div class="vline"><span class="vline-dir">\u266A</span>\u2009${l}</div>`
        ).join('');
        if (_ntSubUnits > 1) {
            ndHTML = `<span class="nt-kala-badge">${item.compositionKala || '2nd'} Kala composition \u2014 ${_ntSubUnits} notes/beat</span>` + ndHTML;
        }
        nd.innerHTML = ndHTML;
        buildChartSection(currentNotes);
        noteDuration = Math.round(60000 / currentBPM / currentMult / _ntSubUnits);
        render();
    } else {
        _ntSubUnits = 1;
        currentPitchConfig = PITCH_CONFIG_DEFAULT;
        nd.style.fontSize  = '1rem';
        nd.innerHTML = `<span class="nottu-meta">Raga: ${item.raga} &nbsp;\u00B7&nbsp; ${item.tala}</span>`;
        const ph8 = Array(8).fill({label:'s', pitch:0.0});
        buildChartSection(ph8);
        currentNotes = ph8;
        placeholderMode = true;
        drawComingSoon(canvases[0].getContext('2d'), item.title, item.raga, item.lyrics);
    }
}

function buildNottuswaramView(grade) {
    const vt = document.getElementById('verseTabs');
    vt.innerHTML = '';
    vt.style.flexDirection = 'column';
    document.getElementById('versePLabel').textContent = 'Songs';

    const info = document.createElement('div');
    info.className   = 'nottu-info-banner';
    info.textContent = '\u2139\uFE0F  ' + grade.info;
    vt.appendChild(info);

    const pickerRow = document.createElement('div');
    pickerRow.className = 'nottu-picker-row';
    const lbl = document.createElement('span');
    lbl.className   = 'nottu-picker-lbl';
    lbl.textContent = 'Select:';
    const sel = document.createElement('select');
    sel.id = 'nottuswaramSelect';
    grade.items.forEach((item, idx) => {
        const opt = document.createElement('option');
        opt.value       = idx;
        opt.textContent = item.title;
        sel.appendChild(opt);
    });
    pickerRow.appendChild(lbl);
    pickerRow.appendChild(sel);
    vt.appendChild(pickerRow);

    const card = document.createElement('div');
    card.id = 'nottuswaramCard';
    vt.appendChild(card);

    function renderCard(item) {
        const badgeRaga  = item.diffRaga ? item.raga : 'Shankarabharanam';
        const lyricsHTML = item.lyrics.map(l => `<span class="nc-lyric-line">${l}</span>`).join('');
        card.innerHTML =
            `<div class="nc-body">
               <div class="nc-header">
                 <div class="nc-main">
                   <span class="nc-title" style="font-size:18px">${item.title}</span>
                   <span class="nc-deity">Deity: ${item.deity} &nbsp;\u00B7&nbsp; ${item.tala}</span>
                   <span class="nc-badge">Nottuswaram \u00B7 Muthuswami Dikshitar \u00B7 Raga: ${badgeRaga}</span>
                 </div>
                 <button class="nc-toggle">&#9662;&nbsp;Lyrics</button>
               </div>
             </div>
             <div class="nc-lyrics" id="nlyr-active">${lyricsHTML}</div>`;
        card.querySelector('.nc-toggle').addEventListener('click', e => {
            e.stopPropagation();
            const ld  = card.querySelector('.nc-lyrics');
            const btn = card.querySelector('.nc-toggle');
            const open = ld.classList.toggle('open');
            btn.innerHTML = open ? '&#9652;&nbsp;Lyrics' : '&#9662;&nbsp;Lyrics';
        });
    }

    sel.addEventListener('change', () => {
        const item = grade.items[parseInt(sel.value, 10)];
        renderCard(item);
        loadNottuswaram(item);
    });

    renderCard(grade.items[0]);
    loadNottuswaram(grade.items[0]);
}

function loadGrade(gradeIdx) {
    customMode = false;
    document.getElementById('customBuilder').style.display = 'none';
    doReset();
    currentPitchConfig = PITCH_CONFIG_DEFAULT;
    activeGradeIdx = gradeIdx; activeVerseIdx = 0;
    document.getElementById('hdrTitle').innerHTML =
        _HDR_ICON + 'N\u0101da Bodha' + _HDR_BADGE +
        '<br><span style="font-size:13px;color:#E8C97E;font-weight:normal;letter-spacing:.06em;">Visual Carnatic Music \u00B7 Beginner Guide</span>';
    const _g = LESSONS[gradeIdx];
    document.getElementById('hdrTalaLabel').textContent = 'Jati \u0026 Thalam';
    document.getElementById('hdrTala').textContent      = _g.tala || 'Chatusra \u00B7 Adi';
    document.getElementById('hdrRaga').textContent      = _g.raga || 'Mayamalavagowla';
    setTalaPattern(_g.tala || 'Chatusra · Adi');

    document.querySelectorAll('.grade-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === gradeIdx);
    });

    const grade = LESSONS[gradeIdx];
    const vt = document.getElementById('verseTabs');
    vt.style.flexDirection = '';

    if (grade.nottuswaram) {
        buildNottuswaramView(grade);
        return;
    }

    document.getElementById('versePLabel').textContent = grade.isAlankaram ? 'Alankaram' : 'Verse';
    vt.innerHTML = '';

    if (grade.desc) {
        const db = document.createElement('div');
        db.className   = 'grade-desc-banner';
        db.textContent = grade.desc;
        vt.appendChild(db);
    }

    if (grade.comingSoon || grade.verses.length === 0) {
        const span = document.createElement('span');
        span.className   = 'coming-soon-banner';
        span.textContent = '\u2728 ' + grade.name + ' \u2014 Coming Soon';
        vt.appendChild(span);
        return;
    }

    grade.verses.forEach((v, vi) => {
        const btn = document.createElement('button');
        btn.className = 'verse-btn' + (v.comingSoon ? ' v-soon' : '');
        btn.textContent = v.title;
        btn.onclick = () => {
            if (v.comingSoon) {
                const info = v.talaInfo ? v.talaInfo + ' — notation coming soon' : 'Coming Soon!';
                showToast(info); return;
            }
            loadVerse(gradeIdx, vi);
        };
        vt.appendChild(btn);
        _pgApplyVerseBadge(btn, gradeIdx, vi);
    });

    const firstOk = grade.verses.findIndex(v => !v.comingSoon);
    if (firstOk >= 0) loadVerse(gradeIdx, firstOk);
}

/* ══════════════════════════════════════
   PROGRESS TRACKER
══════════════════════════════════════ */
function _pgLoad() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch(e) { return {}; }
}
function _pgSave(data) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }
    catch(e) {}
}
function _pgCount(gradeIdx, verseIdx) {
    const d = _pgLoad();
    return (d[gradeIdx + ':' + verseIdx] || 0);
}
function _pgTodayDate() {
    const now = new Date();
    return now.getFullYear() + '-' +
           String(now.getMonth() + 1).padStart(2, '0') + '-' +
           String(now.getDate()).padStart(2, '0');
}
function _pgPracticedToday(gradeIdx, verseIdx) {
    try {
        const dates = JSON.parse(localStorage.getItem(PROGRESS_KEY + '_dates') || '{}');
        return (dates[gradeIdx + ':' + verseIdx] || '') === _pgTodayDate();
    } catch(e) { return false; }
}
function _pgRecord(gradeIdx, verseIdx) {
    const d = _pgLoad();
    const k = gradeIdx + ':' + verseIdx;
    d[k] = (d[k] || 0) + 1;
    _pgSave(d);
    try {
        const dates = JSON.parse(localStorage.getItem(PROGRESS_KEY + '_dates') || '{}');
        dates[k] = _pgTodayDate();
        localStorage.setItem(PROGRESS_KEY + '_dates', JSON.stringify(dates));
    } catch(e) {}
    _stUpdate();
    const vt = document.getElementById('verseTabs');
    if (vt) {
        vt.querySelectorAll('.verse-btn').forEach((btn, bi) => {
            if (bi === verseIdx) _pgApplyVerseBadge(btn, gradeIdx, bi);
        });
    }
}
function _pgHideMarkBtn() {
    const row = document.getElementById('markPracticedRow');
    if (row) { row.style.display = 'none'; row.innerHTML = ''; }
}
function _pgOnPlayComplete() {
    if (customMode) return;
    const gi = activeGradeIdx, vi = activeVerseIdx;
    const row = document.getElementById('markPracticedRow');
    if (!row) return;
    const alreadyDone = _pgPracticedToday(gi, vi);
    row.innerHTML = '';
    const btn = document.createElement('button');
    btn.className   = 'mark-practiced-btn' + (alreadyDone ? ' mark-done' : '');
    btn.textContent = alreadyDone ? '\u2714\uFE0E Practiced today' : '\u2714\uFE0E Mark as Practiced';
    btn.onclick = function() {
        if (btn.classList.contains('mark-done')) return;
        _pgRecord(gi, vi);
        btn.classList.add('mark-done');
        btn.textContent = '\u2714\uFE0E Practiced today';
    };
    row.style.display = 'flex';
    row.appendChild(btn);
}
function _pgApplyVerseBadge(btn, gradeIdx, verseIdx) {
    const old = btn.querySelector('.vbadge');
    if (old) old.remove();
    const count = _pgCount(gradeIdx, verseIdx);
    if (count === 0) return;
    const badge = document.createElement('span');
    badge.className   = 'vbadge' + (count >= 5 ? ' vb-star' : '');
    badge.textContent = count >= 5 ? '\u2605' : count;
    btn.appendChild(badge);
}

/* ── Streak ── */
function _stLoad() {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || {count:0, lastDate:''}; }
    catch(e) { return {count:0, lastDate:''}; }
}
function _stSave(s) {
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); }
    catch(e) {}
}
function _stUpdate() {
    const s = _stLoad();
    const today = _pgTodayDate();
    const yesterday = (function() {
        const d = new Date(); d.setDate(d.getDate() - 1);
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    })();
    if (s.lastDate === today) {
        /* already counted */
    } else if (s.lastDate === yesterday) {
        s.count = (s.count || 0) + 1;
        s.lastDate = today;
    } else {
        s.count = 1;
        s.lastDate = today;
    }
    _stSave(s);
    _stRefreshBadge();
}
function _stRefreshBadge() {
    const el = document.getElementById('streakBadge');
    if (!el) return;
    const s = _stLoad();
    if (s.count >= 1) {
        el.style.display = 'inline';
        el.textContent   = '\uD83D\uDD25 ' + s.count;
    } else {
        el.style.display = 'none';
    }
}

/* ── Progress modal ── */
function _pgShowModal() {
    const data   = _pgLoad();
    const streak = _stLoad();

    const sl = document.getElementById('pgStreakLine');
    sl.textContent = streak.count >= 1
        ? '\uD83D\uDD25 ' + streak.count + '-day practice streak'
        : 'No streak yet — practice today to start one!';

    const gl = document.getElementById('pgGradeList');
    gl.innerHTML = '';
    let totalSessions = 0, totalDistinct = 0;
    const _PG_TOTALS = [14, 8, 3, 7, 4, 15];

    LESSONS.forEach((g, gi) => {
        if (g.nottuswaram) {
            const items = g.items || [];
            const total = _PG_TOTALS[gi] || items.length;
            let gradeTotal = 0, gradeDistinct = 0;
            items.forEach((item, vi) => {
                const c = _pgCount(gi, vi);
                gradeTotal += c;
                if (c > 0) gradeDistinct++;
            });
            totalSessions += gradeTotal;
            totalDistinct += gradeDistinct;
            const pct = total > 0 ? Math.round(gradeDistinct / total * 100) : 0;
            const fillCls = pct >= 100 ? 'pg-bar-gold' : pct >= 50 ? 'pg-bar-light' : 'pg-bar-gray';
            const row = document.createElement('div');
            row.className = 'pg-grade-row';
            row.innerHTML =
                '<div class="pg-grade-name">Gr.' + (gi + 1) + ' ' + g.name + '</div>' +
                '<div class="pg-bar-wrap"><div class="pg-bar-fill ' + fillCls + '" data-pct="' + pct + '"></div></div>' +
                '<div class="pg-count">' + gradeDistinct + '/' + total + '</div>';
            gl.appendChild(row);
            return;
        }

        if (g.comingSoon || !g.verses || g.verses.length === 0) return;
        const available = g.verses.filter(v => !v.comingSoon);
        const total = _PG_TOTALS[gi] || available.length;
        let gradeTotal = 0, gradeDistinct = 0;
        available.forEach((v, vi) => {
            const c = _pgCount(gi, vi);
            gradeTotal += c;
            if (c > 0) gradeDistinct++;
        });
        totalSessions += gradeTotal;
        totalDistinct += gradeDistinct;

        const pct = total > 0 ? Math.round(gradeDistinct / total * 100) : 0;
        const fillCls = pct >= 100 ? 'pg-bar-gold' : pct >= 50 ? 'pg-bar-light' : 'pg-bar-gray';
        const row = document.createElement('div');
        row.className = 'pg-grade-row';
        row.innerHTML =
            '<div class="pg-grade-name">Gr.' + (gi + 1) + ' ' + g.name + '</div>' +
            '<div class="pg-bar-wrap"><div class="pg-bar-fill ' + fillCls + '" data-pct="' + pct + '"></div></div>' +
            '<div class="pg-count">' + gradeDistinct + '/' + total + '</div>';
        gl.appendChild(row);
    });

    document.getElementById('pgStats').innerHTML =
        '<span>Total sessions: <strong>' + totalSessions + '</strong></span>' +
        '<span>Verses attempted: <strong>' + totalDistinct + '</strong></span>';

    const modal = document.getElementById('progressModal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.querySelectorAll('.pg-bar-fill').forEach(f => {
                f.style.width = f.dataset.pct + '%';
            });
        });
    });
}

/* ══════════════════════════════════════
   CUSTOM BUILDER
══════════════════════════════════════ */
/* Per-raga note grid definitions */
const _CB_LOWER_ROW = {lbl:'m\u0101ndra', notes:[
    {label:'\u1E61', pitch:-6.0, cls:'nb-lower', base:'s'},
    {label:'\u1E59', pitch:-5.5, cls:'nb-lower', base:'r'},
    {label:'\u0121', pitch:-4.0, cls:'nb-lower', base:'g'},
    {label:'\u1E41', pitch:-3.5, cls:'nb-lower', base:'m'},
    {label:'\u1E57', pitch:-2.5, cls:'nb-lower', base:'p'},
    {label:'\u1E0B', pitch:-2.0, cls:'nb-lower', base:'d'},
    {label:'\u1E45', pitch:-0.5, cls:'nb-lower', base:'n'},
]};
const _CB_MIDDLE_ROW = {lbl:'madhya', notes:[
    {label:'s',     pitch:0.0,  base:'s'},
    {label:'r',     pitch:0.5,  base:'r'},
    {label:'g',     pitch:2.0,  base:'g'},
    {label:'m',     pitch:2.5,  base:'m'},
    {label:'p',     pitch:3.5,  base:'p'},
    {label:'d',     pitch:4.0,  base:'d'},
    {label:'n',     pitch:5.5,  base:'n'},
    {label:'\u1E60',pitch:6.0,  cls:'nb-upper', base:'S'},
]};
const _CB_UPPER_ROW = {lbl:'t\u0101ra', notes:[
    {label:'\u1E58', pitch:6.5,  cls:'nb-upper', base:'R'},
    {label:'\u0120', pitch:8.0,  cls:'nb-upper', base:'G'},
    {label:'\u1E40', pitch:8.5,  cls:'nb-upper', base:'M'},
    {label:'\u1E56', pitch:9.5,  cls:'nb-upper', base:'P'},
    {label:'\u1E0A', pitch:10.0, cls:'nb-upper', base:'D'},
    {label:'\u1E44', pitch:11.5, cls:'nb-upper', base:'N'},
    {label:'S2',     pitch:12.0, cls:'nb-upper', base:'S'},
]};

const CUSTOM_RAGA_DEFS = {
    'Mayamalavagowla': {
        pitchConfig: PITCH_CONFIG_CUSTOM_3OCT,
        rows: [_CB_LOWER_ROW, _CB_MIDDLE_ROW, _CB_UPPER_ROW],
        freqs: {
            '\u1E61':98,'\u1E59':104.54,'\u0121':122.5,'\u1E41':130.67,'\u1E57':147,'\u1E0B':156.8,'\u1E45':183.75,
            's':196,'r':209.07,'g':245,'m':261.33,'p':294,'d':313.60,'n':367.50,'\u1E60':392,
            '\u1E58':418.14,'\u0120':490,'\u1E40':522.67,'\u1E56':588,'\u1E0A':627.2,'\u1E44':735,'S2':784,
        },
    },
    'Shankarabharanam': {
        pitchConfig: PITCH_CONFIG_CUSTOM_3OCT,
        rows: [_CB_LOWER_ROW, _CB_MIDDLE_ROW, _CB_UPPER_ROW],
        freqs: {
            '\u1E61':98,'\u1E59':104.54,'\u0121':122.5,'\u1E41':130.67,'\u1E57':147,'\u1E0B':156.8,'\u1E45':183.75,
            's':196,'r':209.07,'g':245,'m':261.33,'p':294,'d':313.60,'n':367.50,'\u1E60':392,
            '\u1E58':418.14,'\u0120':490,'\u1E40':522.67,'\u1E56':588,'\u1E0A':627.2,'\u1E44':735,'S2':784,
        },
    },
    'Malahari': {
        pitchConfig: PITCH_CONFIG_CUSTOM_3OCT,
        rows: [_CB_LOWER_ROW, _CB_MIDDLE_ROW, _CB_UPPER_ROW],
        freqs: {
            '\u1E61':98,'\u1E59':104.54,'\u1E41':130.67,'\u1E57':147,'\u1E0B':156.8,
            's':196,'r':209.07,'m':261.33,'p':294,'d':313.60,'\u1E60':392,
            '\u1E58':418.14,'\u1E40':522.67,'\u1E56':588,'\u1E0A':627.2,'S2':784,
        },
    },
    'Kalyani': {
        pitchConfig: PITCH_CONFIG_CUSTOM_3OCT,
        rows: [_CB_LOWER_ROW, _CB_MIDDLE_ROW, _CB_UPPER_ROW],
        freqs: {
            '\u1E61':98,'\u1E59':104.54,'\u0121':122.5,'\u1E41':130.67,'\u1E57':147,'\u1E0B':156.8,'\u1E45':183.75,
            's':196,'r':209.07,'g':245,'M':277.18,'p':294,'d':313.60,'n':367.50,'\u1E60':392,
            '\u1E58':418.14,'\u0120':490,'\u1E40':522.67,'\u1E56':588,'\u1E0A':627.2,'\u1E44':735,'S2':784,
        },
    },
    'Mohanam': {
        pitchConfig: PITCH_CONFIG_CUSTOM_3OCT,
        rows: [_CB_LOWER_ROW, _CB_MIDDLE_ROW, _CB_UPPER_ROW],
        freqs: {
            '\u1E61':98,'\u1E59':104.54,'\u0121':122.5,'\u1E57':147,'\u1E0B':156.8,
            's':196,'r':209.07,'g':245,'p':294,'d':313.60,'\u1E60':392,
            '\u1E58':418.14,'\u0120':490,'\u1E56':588,'\u1E0A':627.2,'S2':784,
        },
    },
    'Custom': {
        pitchConfig: PITCH_CONFIG_CUSTOM_3OCT,
        rows: [_CB_LOWER_ROW, _CB_MIDDLE_ROW, _CB_UPPER_ROW],
        freqs: {
            '\u1E61':98,'\u1E59':104.54,'\u0121':122.5,'\u1E41':130.67,'\u1E57':147,'\u1E0B':156.8,'\u1E45':183.75,
            's':196,'r':209.07,'g':245,'m':261.33,'p':294,'d':313.60,'n':367.50,'\u1E60':392,
            '\u1E58':418.14,'\u0120':490,'\u1E40':522.67,'\u1E56':588,'\u1E0A':627.2,'\u1E44':735,'S2':784,
        },
    },
};

function _cbRagaDef() {
    const sel = document.getElementById('cb-raga');
    return CUSTOM_RAGA_DEFS[sel ? sel.value : 'Mayamalavagowla'] || CUSTOM_RAGA_DEFS['Mayamalavagowla'];
}

function _cbLoadPieces() {
    try { customPieces = JSON.parse(localStorage.getItem(CUSTOM_LS_KEY) || '[]'); }
    catch(e) { customPieces = []; }
}
function _cbSavePieces() {
    try { localStorage.setItem(CUSTOM_LS_KEY, JSON.stringify(customPieces)); }
    catch(e) { showToast('Storage full \u2014 cannot save'); }
}

function _cbNoteInnerHTML(nd) {
    const b = nd.base || nd.label[0];
    if (nd.cls === 'nb-lower') {
        return '<div style="display:flex;flex-direction:column;align-items:center">' +
               '<div style="font-size:16px;font-weight:700;line-height:1">' + b + '</div>' +
               '<div style="width:6px;height:6px;border-radius:50%;background:#7BA3C0;margin:2px auto 0"></div>' +
               '</div>';
    }
    if (nd.cls === 'nb-upper') {
        const dots = nd.label === 'S2'
            ? '<div style="display:flex;gap:2px;justify-content:center;margin-bottom:2px">' +
              '<div style="width:5px;height:5px;border-radius:50%;background:#D4A017"></div>' +
              '<div style="width:5px;height:5px;border-radius:50%;background:#D4A017"></div>' +
              '</div>'
            : '<div style="width:6px;height:6px;border-radius:50%;background:#D4A017;margin:0 auto 2px"></div>';
        return '<div style="display:flex;flex-direction:column;align-items:center">' +
               dots +
               '<div style="font-size:16px;font-weight:700;line-height:1">' + b + '</div>' +
               '</div>';
    }
    return '<span style="font-size:18px;font-weight:700">' + (nd.base || nd.label) + '</span>';
}

function _cbRebuildNoteGrid() {
    const def = _cbRagaDef();
    _customFreqMap = def.freqs;
    const grid = document.getElementById('cb-note-grid');
    if (!grid) return;
    grid.innerHTML = '';

    def.rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'cb-note-row';
        const lbl = document.createElement('span');
        const firstCls = row.notes[0] && row.notes[0].cls;
        const lblMod = firstCls === 'nb-lower' ? ' lbl-lower' : firstCls === 'nb-upper' ? ' lbl-upper' : ' lbl-middle';
        lbl.className   = 'cb-note-row-label' + lblMod;
        lbl.textContent = row.lbl;
        rowDiv.appendChild(lbl);
        row.notes.forEach(nd => {
            const btn = document.createElement('button');
            btn.className = 'note-btn' + (nd.cls ? ' ' + nd.cls : '');
            btn.innerHTML = _cbNoteInnerHTML(nd);
            btn.title = nd.base || nd.label;
            btn.addEventListener('click', () => { _cbAddNote(nd); });
            rowDiv.appendChild(btn);
        });
        grid.appendChild(rowDiv);
    });

    const specRow = document.createElement('div');
    specRow.className = 'cb-note-row';
    const specLbl = document.createElement('span');
    specLbl.className   = 'cb-note-row-label';
    specLbl.textContent = 'special';
    specRow.appendChild(specLbl);

    const susBtn = document.createElement('button');
    susBtn.className  = 'note-btn nb-special';
    susBtn.textContent = '\u2013';
    susBtn.title = 'Sustain — hold previous pitch';
    susBtn.addEventListener('click', () => {
        const allNotes = [...customNotes, ..._cbBeatBuffer];
        const prev  = [...allNotes].reverse().find(n => n.label !== '-');
        const pitch = prev ? prev.pitch : def.pitchConfig.min;
        _cbAddNote({label:'-', pitch, base:'-', cls:''});
    });
    specRow.appendChild(susBtn);

    const restBtn = document.createElement('button');
    restBtn.className  = 'note-btn nb-special';
    restBtn.textContent = '\u2715';
    restBtn.title = 'Rest / silence';
    restBtn.addEventListener('click', () => {
        _cbAddNote({label:'-', pitch: def.pitchConfig.min, base:'-', cls:''});
    });
    specRow.appendChild(restBtn);
    grid.appendChild(specRow);
}

const _cbSubUnits = () => parseInt(document.getElementById('cb-subunits')?.value || '1');

function _cbAddNote(nd) {
    const sub  = _cbSubUnits();
    const freq = _customFreqMap[nd.label] || FREQ[nd.label];
    if (freq && !muted) playFreq(freq, 0.4);

    if (sub === 1) {
        const lyric = (document.getElementById('cb-lyric').value || '').trim();
        customNotes.push({label: nd.label, pitch: nd.pitch, lyric, base: nd.base, cls: nd.cls});
        document.getElementById('cb-lyric').value = '';
        _cbRenderSeq();
        return;
    }

    if (_cbBeatPhase !== 'entry') return;
    _cbBeatBuffer.push({label: nd.label, pitch: nd.pitch, lyric: '', base: nd.base, cls: nd.cls});
    if (_cbBeatBuffer.length >= sub) _cbBeatPhase = 'lyric';
    _cbUpdateBeatBuffer();
}

function _cbCommitBeat() {
    const sub = _cbSubUnits();
    const beatNum = Math.floor(customNotes.length / sub) + 1;
    _cbBeatBuffer.forEach((n, i) => {
        const inp = document.getElementById('cb-li-' + i);
        n.lyric = (inp ? inp.value.trim() : '') || '-';
    });
    customNotes.push(..._cbBeatBuffer);
    _cbBeatBuffer = [];
    _cbBeatPhase  = 'entry';
    _cbRenderSeq();
    _cbUpdateBeatBuffer();
    showToast('Beat ' + beatNum + ' committed \u2713');
}

function _cbReenterBeat() {
    _cbBeatBuffer = [];
    _cbBeatPhase  = 'entry';
    _cbUpdateBeatBuffer();
}

function _cbUpdateBeatBuffer() {
    const buf      = document.getElementById('cb-beat-buffer');
    const lyricRow = document.querySelector('.cb-lyric-row');
    const sub = _cbSubUnits();
    if (!buf) return;

    if (sub === 1) {
        buf.style.display = 'none';
        if (lyricRow) lyricRow.style.display = '';
        return;
    }

    if (lyricRow) lyricRow.style.display = 'none';
    buf.style.display = 'flex';
    buf.innerHTML = '';

    const beatNum = Math.floor(customNotes.length / sub) + 1;

    if (_cbBeatPhase === 'entry') {
        const filled = _cbBeatBuffer.length;
        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap';

        const lbl = document.createElement('span');
        lbl.className   = 'cb-beat-label';
        lbl.textContent = filled === 0
            ? 'Beat ' + beatNum + ': click ' + sub + ' notes'
            : 'Beat ' + beatNum + ': (' + filled + '/' + sub + ')';
        headerRow.appendChild(lbl);

        if (filled > 0) {
            const chips = document.createElement('span');
            chips.style.cssText = 'display:inline-flex;gap:4px;flex-wrap:wrap';
            _cbBeatBuffer.forEach((n, i) => {
                const chip = document.createElement('span');
                chip.className = 'seq-chip';
                chip.style.cssText = 'font-size:11px;padding:1px 5px;height:26px;min-width:28px';
                const ns = document.createElement('span');
                ns.innerHTML = _cbNoteInnerHTML(n);
                chip.appendChild(ns);
                const del = document.createElement('span');
                del.className   = 'chip-del';
                del.textContent = '\u00D7';
                del.addEventListener('click', () => { _cbBeatBuffer.splice(i, 1); _cbBeatPhase = 'entry'; _cbUpdateBeatBuffer(); });
                chip.appendChild(del);
                chips.appendChild(chip);
            });
            headerRow.appendChild(chips);
        }
        buf.appendChild(headerRow);

    } else {
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom:10px;color:#C8A060;font-size:12px;font-weight:600';
        header.textContent   = 'Beat ' + beatNum + ' complete \u2014 assign lyrics:';
        buf.appendChild(header);

        const noteCols = document.createElement('div');
        noteCols.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px';
        _cbBeatBuffer.forEach((n, i) => {
            const col = document.createElement('div');
            col.className = 'cb-lyric-assign-col';

            const noteDisp = document.createElement('div');
            noteDisp.className = 'cb-lyric-note-display';
            noteDisp.innerHTML = _cbNoteInnerHTML(n);
            col.appendChild(noteDisp);

            const inp = document.createElement('input');
            inp.type      = 'text';
            inp.className = 'cb-lyric-note-input';
            inp.id        = 'cb-li-' + i;
            inp.maxLength = 24;
            inp.placeholder = '\u2212';
            inp.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const next = document.getElementById('cb-li-' + (i + 1));
                    if (next) next.focus(); else _cbCommitBeat();
                } else if (e.key === 'Enter') {
                    _cbCommitBeat();
                }
            });
            col.appendChild(inp);
            noteCols.appendChild(col);
        });
        buf.appendChild(noteCols);

        const btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:8px';
        const commitBtn = document.createElement('button');
        commitBtn.className   = 'cb-lyric-commit-btn';
        commitBtn.textContent = 'Commit Beat';
        commitBtn.addEventListener('click', _cbCommitBeat);
        const reenterBtn = document.createElement('button');
        reenterBtn.className   = 'cb-lyric-reenter-btn';
        reenterBtn.textContent = 'Re-enter';
        reenterBtn.addEventListener('click', _cbReenterBeat);
        btns.appendChild(commitBtn);
        btns.appendChild(reenterBtn);
        buf.appendChild(btns);

        setTimeout(() => { const f = document.getElementById('cb-li-0'); if (f) f.focus(); }, 50);
    }
}

function _cbMakeChip(n, onDel) {
    const chip = document.createElement('span');
    chip.className = 'seq-chip';
    const noteSpan = document.createElement('span');
    noteSpan.style.display    = 'inline-flex';
    noteSpan.style.alignItems = 'center';
    noteSpan.innerHTML = _cbNoteInnerHTML(n);
    chip.appendChild(noteSpan);
    if (n.lyric && n.lyric !== '-') {
        const ls = document.createElement('span');
        ls.className   = 'chip-lyric';
        ls.textContent = n.lyric;
        chip.appendChild(ls);
    }
    const del = document.createElement('span');
    del.className   = 'chip-del';
    del.textContent = '\u00D7';
    del.title = 'Remove';
    del.addEventListener('click', onDel);
    chip.appendChild(del);
    return chip;
}

function _cbRenderSeq() {
    const disp = document.getElementById('cb-seq-display');
    const cnt  = document.getElementById('cb-note-count');
    if (!disp) return;
    if (cnt) cnt.textContent = customNotes.length;
    const sub = _cbSubUnits();

    if (customNotes.length === 0) {
        disp.innerHTML = '<span class="cb-seq-empty">No notes yet \u2014 click note buttons above to start</span>';
        return;
    }

    disp.innerHTML = '';

    if (sub === 1) {
        customNotes.forEach((n, i) => {
            disp.appendChild(_cbMakeChip(n, () => { customNotes.splice(i, 1); _cbRenderSeq(); }));
        });
    } else {
        const totalBeats = Math.ceil(customNotes.length / sub);
        for (let b = 0; b < totalBeats; b++) {
            const group = document.createElement('span');
            group.className = 'cb-beat-group';

            const lbl = document.createElement('span');
            lbl.className   = 'cb-beat-num-lbl';
            lbl.textContent = 'Beat ' + (b + 1);
            group.appendChild(lbl);

            const notesRow = document.createElement('span');
            notesRow.style.cssText = 'display:inline-flex;align-items:center;gap:2px';

            for (let j = 0; j < sub; j++) {
                const noteIdx = b * sub + j;
                if (noteIdx >= customNotes.length) break;
                if (j > 0) {
                    const dot = document.createElement('span');
                    dot.className   = 'cb-sub-dot';
                    dot.textContent = '\u00B7';
                    notesRow.appendChild(dot);
                }
                const n    = customNotes[noteIdx];
                const chip = _cbMakeChip(n, () => { customNotes.splice(noteIdx, 1); _cbRenderSeq(); });
                chip.style.cssText += ';padding:1px 5px;height:26px;min-width:28px;font-size:11px';
                notesRow.appendChild(chip);
            }
            group.appendChild(notesRow);
            disp.appendChild(group);
        }
    }
    disp.scrollTop = disp.scrollHeight;
}

function _cbRenderSavedPieces() {
    const list = document.getElementById('cb-saved-list');
    if (!list) return;
    _cbLoadPieces();
    if (customPieces.length === 0) {
        list.innerHTML = '<div class="cb-no-saves">No saved pieces yet</div>';
        return;
    }
    list.innerHTML = '';
    customPieces.forEach((piece, idx) => {
        const row  = document.createElement('div');
        row.className = 'saved-piece-row';
        const info = document.createElement('div');
        info.className = 'sp-info';
        info.innerHTML =
            '<div class="sp-title">' + _esc(piece.title) + '</div>' +
            '<div class="sp-meta">' + _esc(piece.raga) + ' \u00B7 ' + _esc(piece.tala) + ' \u00B7 ' + piece.notes.length + ' notes</div>';
        const btns = document.createElement('div');
        btns.className = 'sp-btns';

        const loadBtn = document.createElement('button');
        loadBtn.className = 'sp-load-btn';
        loadBtn.innerHTML = '&#9654;&nbsp;Load';
        loadBtn.addEventListener('click', () => {
            const p = customPieces[idx];
            if (!p) return;
            customNotes  = p.notes.map(n => ({label: n.note || n.label, pitch: n.pitch || 0, lyric: n.lyric || ''}));
            _cbBeatBuffer = [];
            _cbBeatPhase  = 'entry';
            const rSel = document.getElementById('cb-raga');
            const tSel = document.getElementById('cb-tala');
            const tInp = document.getElementById('cb-title');
            const sSel = document.getElementById('cb-subunits');
            if (rSel) { rSel.value = p.raga; _cbRebuildNoteGrid(); }
            if (tSel) tSel.value = p.tala;
            if (tInp) tInp.value = p.title;
            if (sSel) sSel.value = String(p.subUnitsPerBeat || 1);
            _ntSubUnits = p.subUnitsPerBeat || 1;
            _cbUpdateBeatBuffer();
            _cbRenderSeq();
            showToast('Loaded: ' + p.title);
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'sp-del-btn';
        delBtn.innerHTML = '&#10005;&nbsp;Delete';
        delBtn.addEventListener('click', () => {
            const title = customPieces[idx] ? customPieces[idx].title : '?';
            customPieces.splice(idx, 1);
            _cbSavePieces();
            _cbRenderSavedPieces();
            showToast('Deleted: ' + title);
        });
        btns.appendChild(loadBtn);
        btns.appendChild(delBtn);
        row.appendChild(info);
        row.appendChild(btns);
        list.appendChild(row);
    });
}

function buildCustomBuilderUI() {
    const div = document.getElementById('customBuilder');
    div.innerHTML =
        '<div class="cb-section">' +
            '<div class="cb-section-title">Song Info</div>' +
            '<div class="cb-info-row">' +
                '<label>Title</label>' +
                '<input type="text" id="cb-title" placeholder="My Practice Piece" maxlength="60">' +
                '<label>Raga</label>' +
                '<select id="cb-raga">' +
                    '<option>Mayamalavagowla</option>' +
                    '<option>Shankarabharanam</option>' +
                    '<option>Malahari</option>' +
                    '<option>Kalyani</option>' +
                    '<option>Mohanam</option>' +
                    '<option>Custom</option>' +
                '</select>' +
                '<label>Tala</label>' +
                '<select id="cb-tala">' +
                    '<option value="Chatusra \u00B7 Adi">Adi (8 beats)</option>' +
                    '<option value="Chatusra \u00B7 Roopaka">Roopaka (6 beats)</option>' +
                    '<option value="Chatusra \u00B7 Triputa">Triputa (7 beats)</option>' +
                    '<option value="Chatusra \u00B7 Eka">Eka (4 beats)</option>' +
                '</select>' +
                '<label>Notes/Beat</label>' +
                '<select id="cb-subunits">' +
                    '<option value="1">1 (normal)</option>' +
                    '<option value="2">2 per beat</option>' +
                    '<option value="4">4 per beat</option>' +
                '</select>' +
            '</div>' +
        '</div>' +
        '<div class="cb-section">' +
            '<div class="cb-section-title">Note Entry</div>' +
            '<div id="cb-note-grid"></div>' +
            '<div class="cb-lyric-row">' +
                '<label>Next lyric:</label>' +
                '<input type="text" id="cb-lyric" placeholder="syllable (optional)" maxlength="24">' +
                '<span class="cb-lyric-hint">Type a syllable, then click a note button</span>' +
            '</div>' +
            '<div id="cb-beat-buffer"></div>' +
            '<div class="cb-seq-header">' +
                '<span class="cb-seq-label">Sequence:</span>' +
                '<span class="cb-seq-count"><span id="cb-note-count">0</span> notes</span>' +
            '</div>' +
            '<div class="cb-seq-display" id="cb-seq-display">' +
                '<span class="cb-seq-empty">No notes yet \u2014 click note buttons above to start</span>' +
            '</div>' +
            '<div class="cb-controls">' +
                '<button onclick="window._cbUndo()">&#8592;&nbsp;Undo</button>' +
                '<button onclick="window._cbClear()">&#10005;&nbsp;Clear All</button>' +
                '<button class="cb-btn-play" onclick="window._cbPlayPreview()">&#9654;&nbsp;Play Preview</button>' +
                '<button class="cb-btn-save" onclick="window._cbSave()">&#128190;&nbsp;Save</button>' +
            '</div>' +
        '</div>' +
        '<div class="cb-section">' +
            '<div class="cb-section-title">Saved Pieces (max 10)</div>' +
            '<div id="cb-saved-list"></div>' +
        '</div>';

    document.getElementById('cb-raga').addEventListener('change', _cbRebuildNoteGrid);
    document.getElementById('cb-subunits').addEventListener('change', () => {
        _cbBeatBuffer = [];
        _cbBeatPhase  = 'entry';
        _cbUpdateBeatBuffer();
        _cbRenderSeq();
    });
    _cbRebuildNoteGrid();
    _cbRenderSeq();
    _cbRenderSavedPieces();
    _cbUpdateBeatBuffer();
}

/* Builder actions exposed to inline onclick handlers */
window._cbUndo = function() {
    const sub = _cbSubUnits();
    if (sub > 1 && _cbBeatPhase === 'lyric') {
        _cbBeatPhase = 'entry';
        _cbUpdateBeatBuffer();
        return;
    }
    if (_cbBeatBuffer.length > 0) {
        _cbBeatBuffer.pop();
        _cbUpdateBeatBuffer();
        return;
    }
    if (!customNotes.length) { showToast('Nothing to undo'); return; }
    const toRemove = sub > 1 ? sub : 1;
    customNotes.splice(-toRemove, toRemove);
    _cbRenderSeq();
};
window._cbClear = function() {
    if (!customNotes.length && !_cbBeatBuffer.length) return;
    customNotes   = [];
    _cbBeatBuffer = [];
    _cbBeatPhase  = 'entry';
    _cbUpdateBeatBuffer();
    _cbRenderSeq();
};
window._cbPlayPreview = function() {
    if (!customNotes.length) { showToast('Add some notes first!'); return; }
    const def     = _cbRagaDef();
    const talaStr = document.getElementById('cb-tala').value;
    const title   = (document.getElementById('cb-title').value || '').trim() || 'Custom Piece';

    doReset();
    currentPitchConfig = def.pitchConfig;
    _customFreqMap = def.freqs;
    Object.assign(FREQ, def.freqs);

    setTalaPattern(talaStr);
    _ntSubUnits  = _cbSubUnits();
    noteDuration = Math.round(60000 / currentBPM / currentMult / _ntSubUnits);
    updateBPM();
    buildPulseBar();

    let lp = def.pitchConfig.min;
    currentNotes = customNotes.map(n => {
        if (n.label === '-') return {label:'-', pitch:lp, lyric: n.lyric || '-'};
        lp = n.pitch;
        return {...n};
    });

    document.getElementById('verseLabel').textContent = '\u2728 ' + title;
    const nd = document.getElementById('verseNotes');
    nd.style.fontSize = '1rem'; nd.style.letterSpacing = '.04em';
    let metaHTML = '<span style="color:#8B6030;font-style:italic;">' +
        _esc(title) + ' \u00B7 ' + _esc(talaStr) + ' \u00B7 ' + currentNotes.length + ' notes</span>';
    if (_ntSubUnits > 1) {
        const kalaName = _ntSubUnits === 4 ? 'Dwitiya' : 'Prathama';
        metaHTML = '<span class="nt-kala-badge">' + kalaName + ' Kala \u2014 ' + _ntSubUnits +
            ' notes/beat</span><br>' + metaHTML;
    }
    nd.innerHTML = metaHTML;

    buildChartSection(currentNotes);
    render();

    document.querySelector('.chart-section').scrollIntoView({behavior:'smooth', block:'nearest'});
    setTimeout(() => {
        try { getAudioCtx(); startPlay(); } catch(e) {}
    }, 300);
};
window._cbSave = function() {
    if (!customNotes.length) { showToast('Add some notes first!'); return; }
    const title = (document.getElementById('cb-title').value || '').trim() || 'Untitled';
    const raga  = document.getElementById('cb-raga').value;
    const tala  = document.getElementById('cb-tala').value;
    setTalaPattern(tala);
    _cbLoadPieces();
    if (customPieces.length >= 10) { showToast('Max 10 pieces \u2014 delete one first'); return; }
    const sub = _cbSubUnits();
    customPieces.push({
        id: Date.now(), title, raga, tala,
        beatsPerRow: currentBeatsPerRow, groups: [...currentTalaGroups],
        subUnitsPerBeat: sub,
        compositionKala: sub === 4 ? 'Dwitiya' : sub === 2 ? 'Prathama' : '',
        notes: customNotes.map(n => ({note: n.label, pitch: n.pitch, lyric: n.lyric || ''})),
    });
    _cbSavePieces();
    _cbRenderSavedPieces();
    showToast('Saved: ' + title);
};

function loadCustomMode() {
    doReset();
    _ntSubUnits = 1;
    customMode  = true;

    document.getElementById('hdrTitle').innerHTML =
        _HDR_ICON + 'N\u0101da Bodha' + _HDR_BADGE +
        '<br><span style="font-size:13px;color:#E8C97E;font-weight:normal;letter-spacing:.06em;">Custom Builder \u2014 Build Your Own Piece</span>';
    document.getElementById('hdrRaga').textContent      = 'Custom';
    document.getElementById('hdrTalaLabel').textContent = 'Mode';
    document.getElementById('hdrTala').textContent      = 'Builder';

    document.querySelectorAll('.grade-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('customTab').classList.add('active');

    const vt = document.getElementById('verseTabs');
    vt.innerHTML = ''; vt.style.flexDirection = '';
    document.getElementById('versePLabel').textContent = '';

    document.getElementById('verseLabel').textContent = 'Custom Practice Piece';
    document.getElementById('verseNotes').innerHTML =
        '<span style="color:#5A3818;font-style:italic;">Build your sequence \u2193, then click Play Preview</span>';

    currentNotes = [];
    document.getElementById('chartsContainer').innerHTML = '';
    document.getElementById('fixedHandsRow').innerHTML   = '';
    document.getElementById('pulseBarOuter').innerHTML   = '';
    pulseDots = []; fixedHandEls = [];

    document.getElementById('customBuilder').style.display = '';
    buildCustomBuilderUI();
}

/* ══════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════ */
document.getElementById('playBtn').addEventListener('click', async () => {
    if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        window.nadaAudioCtx = audioCtx;
    }
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    startPlay();
});

document.getElementById('resetBtn').addEventListener('click', doReset);

document.getElementById('muteBtn').addEventListener('click', () => {
    muted = !muted;
    const btn = document.getElementById('muteBtn');
    btn.textContent = muted ? '\uD83D\uDD07\u00A0Muted' : '\uD83D\uDD0A\u00A0Sound';
    btn.classList.toggle('is-muted', muted);
});

document.getElementById('metroBtn').addEventListener('click', async () => {
    metroOn = !metroOn;
    const btn = document.getElementById('metroBtn');
    btn.textContent = metroOn ? '\uD83E\uDD41\u00A0Metro: ON' : '\uD83E\uDD41\u00A0Metro: OFF';
    btn.classList.toggle('metro-on', metroOn);
    if (metroOn) {
        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            window.nadaAudioCtx = audioCtx;
        }
        if (audioCtx.state === 'suspended') await audioCtx.resume();
    }
});

const shrutiBtn    = document.getElementById('shrutiBtn');
const shrutiSelect = document.getElementById('shrutiSelect');

shrutiBtn.addEventListener('click', async () => {
    try {
        if (!shrutiOn) {
            if (!audioCtx || audioCtx.state === 'closed') {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                window.nadaAudioCtx = audioCtx;
            }
            if (audioCtx.state === 'suspended') await audioCtx.resume();
            await startShruti(parseFloat(shrutiSelect.value), 'sa-pa-sa');
            shrutiOn = true;
        } else {
            stopShruti();
            shrutiOn = false;
        }
    } catch (e) {
        console.error('Shruti toggle failed:', e);
        shrutiOn = false;
    }
    shrutiBtn.textContent = shrutiOn ? '\uD83C\uDFB5 Shruti: ON' : '\uD83C\uDFB5 Shruti: OFF';
    shrutiBtn.classList.toggle('shruti-on', shrutiOn);
});

shrutiSelect.addEventListener('change', async () => {
    if (!shrutiOn) return;
    try { await startShruti(parseFloat(shrutiSelect.value), 'sa-pa-sa'); }
    catch (e) { console.error('Shruti change failed:', e); }
});

document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const k = KALA_MAP[btn.dataset.mult];
        if (!k) return;
        currentMult = k.mult;
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateBPM();
        if (currentNotes.length > 0 && !placeholderMode) {
            buildChartSection(currentNotes);
            render();
        }
    });
});

document.getElementById('bpmSelect').addEventListener('change', function() {
    currentBPM = parseInt(this.value, 10);
    updateBPM();
});

document.getElementById('progressBtn').addEventListener('click', _pgShowModal);
document.getElementById('pgClose').addEventListener('click', () => {
    document.getElementById('progressModal').style.display = 'none';
});
document.getElementById('progressModal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});

document.getElementById('verseTabs').addEventListener('change', function(e) {
    if (e.target && e.target.id === 'nottuswaramSelect') {
        activeVerseIdx = e.target.selectedIndex;
        _pgHideMarkBtn();
    }
});

document.getElementById('printBtn').addEventListener('click', () => {
    _printBuildArea();
    window.print();
});

/* Safari audio unlock */
document.addEventListener('touchstart', function unlockAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        window.nadaAudioCtx = audioCtx;
    }
    try {
        const buf = audioCtx.createBuffer(1, 1, 22050);
        const src = audioCtx.createBufferSource();
        src.buffer = buf; src.connect(audioCtx.destination); src.start(0);
        audioCtx.resume();
    } catch(e) {}
    document.removeEventListener('touchstart', unlockAudio);
}, false);

/* ══════════════════════════════════════
   INITIALIZATION
══════════════════════════════════════ */
(function buildGradeTabs() {
    const gt = document.getElementById('gradeTabs');
    gt.innerHTML = '';
    LESSONS.forEach((g, gi) => {
        const tab = document.createElement('button');
        tab.className = 'grade-tab' + (g.nottuswaram ? ' nottu-tab' : '');
        tab.innerHTML = `<span class="g-num">Grade ${gi + 1}</span><span class="g-name">${g.name}</span>`;
        tab.onclick   = () => loadGrade(gi);
        gt.appendChild(tab);
    });
})();

(function addCustomTab() {
    if (document.getElementById('customTab')) return;
    const gt  = document.getElementById('gradeTabs');
    const tab = document.createElement('button');
    tab.id        = 'customTab';
    tab.className = 'grade-tab custom-tab';
    tab.innerHTML = '<span class="g-num">Custom</span><span class="g-name">Builder</span>';
    tab.onclick   = loadCustomMode;
    gt.appendChild(tab);
})();

_stRefreshBadge();
buildPulseBar();
document.getElementById('bpmSelect').value = String(currentBPM);
updateBPM();
loadGrade(0);
