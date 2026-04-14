'use strict';
/* ═══════════════════════════════════════════════════════════
   tala.js — tala patterns, hand SVGs, beat indicator
   Depends on: pitch.js (CW, PL, PLOT_W, xFor)
═══════════════════════════════════════════════════════════ */

/* ── Tala state ── */
let fixedHandEls = [];
let pulseDots    = [];

/* ── Tala pattern definitions ── */
const ADI_TALA = {
    beatsPerRow: 8, groups: [4, 2, 2],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'di',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'mi',  samam:false},
    ]
};
const TALA_ROOPAKA = {
    beatsPerRow: 6, groups: [2, 4],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
    ]
};
const TALA_TRIPUTA = {
    beatsPerRow: 7, groups: [3, 2, 2],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
    ]
};
const TALA_EKA = {
    beatsPerRow: 4, groups: [4],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
    ]
};
const TALA_DHRUVA = {
    beatsPerRow: 14, groups: [4, 2, 4, 4],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
    ]
};
const TALA_MATYA = {
    beatsPerRow: 10, groups: [4, 2, 4],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
    ]
};
const TALA_JHAMPA = {
    beatsPerRow: 10, groups: [7, 1, 2],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
    ]
};
const TALA_ATA = {
    beatsPerRow: 14, groups: [5, 5, 2, 2],
    beats: [
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:true },
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'pinky',  lbl:'Pinky',  sol:'dhi', samam:false},
        {type:'ring',   lbl:'Ring',   sol:'gi',  samam:false},
        {type:'middle', lbl:'Middle', sol:'na',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
        {type:'clap',   lbl:'Clap',   sol:'ta',  samam:false},
        {type:'wave',   lbl:'Wave',   sol:'ka',  samam:false},
    ]
};

/* ── Tala selection ── */
function setTalaPattern(talaStr) {
    const t = (talaStr || '').toLowerCase();
    let pat;
    if      (t.includes('roopaka') || t.includes('rupaka')) pat = TALA_ROOPAKA;
    else if (t.includes('triputa'))                          pat = TALA_TRIPUTA;
    else if (t.includes('eka'))                              pat = TALA_EKA;
    else if (t.includes('dhruva'))                           pat = TALA_DHRUVA;
    else if (t.includes('matya'))                            pat = TALA_MATYA;
    else if (t.includes('jhampa'))                           pat = TALA_JHAMPA;
    else if (t.includes('ata'))                              pat = TALA_ATA;
    else                                                     pat = ADI_TALA;
    currentTalaPattern = pat;
    currentBeatsPerRow = pat.beatsPerRow;
    currentTalaGroups  = pat.groups;
}

/* ── Hand SVG builder ── */
function buildHandSVG(type, isSamam) {
    const FG = [
        { name:'thumb',  x:5,  y:30, w:8, h:17, rx:4 },
        { name:'index',  x:13, y:11, w:7, h:21, rx:3 },
        { name:'middle', x:21, y:7,  w:7, h:25, rx:3 },
        { name:'ring',   x:29, y:11, w:7, h:21, rx:3 },
        { name:'pinky',  x:37, y:17, w:6, h:16, rx:3 },
    ];

    const barIdx = { pinky:4, ring:3, middle:2 }[type] ?? -1;
    const fAttr  = `fill="white" stroke="#555555" stroke-width="1.2"`;

    function handContent(palmFill) {
        let o = '';
        o += `<rect x="11" y="32" width="28" height="18" rx="6" `
           + `fill="${palmFill}" stroke="#555555" stroke-width="1.2"/>`;
        o += `<rect x="${FG[0].x}" y="${FG[0].y}" width="${FG[0].w}" height="${FG[0].h}" `
           + `rx="${FG[0].rx}" ${fAttr} transform="rotate(-12,${FG[0].x+4},${FG[0].y+FG[0].h})"/>`;
        FG.slice(1).forEach(f => {
            o += `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="${f.rx}" ${fAttr}/>`;
        });
        o += `<path d="M13,36 Q26,33 39,36" fill="none" stroke="#CCCCCC" stroke-width="0.8"/>`;
        if (barIdx >= 0) {
            const f   = FG[barIdx];
            const brx = (barIdx === 4) ? 2 : f.rx;
            o += `<rect x="${f.x+1}" y="${f.y+1}" width="${f.w-2}" height="${f.h-2}" `
               + `rx="${brx}" fill="#1A1A1A" stroke="none" opacity="1"/>`;
        }
        return o;
    }

    let out = '';
    out += `<circle class="hand-ring" cx="26" cy="30" r="24" `
         + `fill="rgba(212,160,23,0.15)" stroke="#D4A017" stroke-width="1.5" opacity="0"/>`;

    if (type === 'wave') {
        out += `<g transform="scale(-1,1) translate(-52,0)">`;
        out += handContent('#F0F0F0');
        out += `</g>`;
        out += `<text x="49" y="42" font-size="9" fill="#999999" font-family="Georgia,serif">\u21BA</text>`;
    } else {
        out += handContent('white');
    }

    if (isSamam) {
        out += `<text x="26" y="57" text-anchor="middle" font-size="9" fill="#D4A017" font-family="Georgia,serif">&#9733;</text>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 58" width="52" height="58" `
         + `style="filter:drop-shadow(1px 2px 3px rgba(0,0,0,0.12))">${out}</svg>`;
}

/* ── Fixed hands row ── */
function buildFixedHandsRow() {
    const handsDiv = document.getElementById('fixedHandsRow');
    if (!handsDiv) return;
    handsDiv.innerHTML = '';
    fixedHandEls = [];
    handsDiv.style.width = CW + 'px';
    const pat = currentTalaPattern || ADI_TALA;
    pat.beats.forEach((beat, bi) => {
        const hd = document.createElement('div');
        hd.className = 'hand';
        hd.style.left = xFor(bi) + 'px';
        hd.innerHTML =
            buildHandSVG(beat.type, beat.samam) +
            `<span class="hand-lbl">${beat.lbl}</span>` +
            `<span class="hand-sol">${beat.sol}</span>`;
        handsDiv.appendChild(hd);
        fixedHandEls.push(hd);
    });
}

/* ── Pulse bar ── */
function buildPulseBar() {
    const outer = document.getElementById('pulseBarOuter');
    outer.innerHTML = '';
    pulseDots = [];
    const N = currentTalaPattern ? currentTalaPattern.beats.length : 8;
    for (let i = 0; i < N; i++) {
        const d = document.createElement('div');
        d.className = 'pulse-dot';
        outer.appendChild(d);
        pulseDots.push(d);
    }
}

function setPulseDot(beatIdx) {
    pulseDots.forEach((d, i) => {
        d.classList.remove('active');
        if (i === beatIdx) {
            void d.offsetWidth;
            d.classList.add('active');
        }
    });
}

/* ── Animated beat palm indicator ── */
function updateBeatPalmIndicator(beatAbsolute) {
    const indicator = document.getElementById('beatPalmIndicator');
    if (!indicator) return;
    const N          = currentTalaPattern ? currentTalaPattern.beats.length : 8;
    const beatInCycle = beatAbsolute % N;
    const handEl     = fixedHandEls[beatInCycle];
    const svgEl      = document.getElementById('beatPalmSvg');

    if (handEl && svgEl) {
        const srcSvg = handEl.querySelector('svg');
        if (srcSvg) {
            svgEl.innerHTML = srcSvg.outerHTML;
            const s = svgEl.querySelector('svg');
            if (s) { s.setAttribute('width', '80'); s.setAttribute('height', '80'); }
        }
        svgEl.style.transition = 'transform 200ms ease, filter 200ms ease';
        if (beatInCycle === 0) {
            svgEl.style.filter    = 'drop-shadow(0 0 8px rgba(212,160,23,0.9)) drop-shadow(0 0 16px rgba(212,160,23,0.4))';
            svgEl.style.transform = 'scale(1.08)';
        } else {
            svgEl.style.filter    = 'none';
            svgEl.style.transform = 'scale(1.0)';
        }
    }

    const nameEl = document.getElementById('beatPalmName');
    const solEl  = document.getElementById('beatPalmSolkattu');
    if (nameEl && handEl) {
        const gestureName = handEl.querySelector('.hand-lbl')?.textContent || '';
        const solkattu    = handEl.querySelector('.hand-sol')?.textContent  || '';
        nameEl.textContent = gestureName + (solkattu ? ' \u00B7 ' + solkattu : '');
    }
    if (solEl) solEl.style.display = 'none';

    const dotsEl = document.getElementById('beatProgressDots');
    if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let i = 0; i < N; i++) {
            const dot      = document.createElement('div');
            const isActive = i === beatInCycle;
            const isPast   = i < beatInCycle;
            const isSamam  = i === 0;
            dot.style.cssText =
                'width:'  + (isActive ? '12px' : isSamam ? '8px' : '6px') + ';' +
                'height:' + (isActive ? '12px' : isSamam ? '8px' : '6px') + ';' +
                'border-radius:50%;' +
                'background:' + (isActive ? '#D4A017' :
                                 isSamam  ? 'rgba(212,160,23,0.5)' :
                                 isPast   ? 'rgba(139,69,19,0.45)' :
                                            'rgba(139,69,19,0.15)') + ';' +
                'border:' + (isActive ? '2px solid #F5C842' :
                             isSamam  ? '1.5px solid rgba(212,160,23,0.6)' : 'none') + ';' +
                'transition:all 200ms ease;flex-shrink:0;';
            dotsEl.appendChild(dot);
        }
    }
    indicator.style.display = 'flex';
}

/* ── Hand activation + auto-scroll ── */
function setActiveHand(gIdx, beatAbsolute) {
    fixedHandEls.forEach(h => h.classList.remove('active'));
    if (gIdx < 0) { pulseDots.forEach(d => d.classList.remove('active')); return; }
    const N  = fixedHandEls.length || currentBeatsPerRow;
    const ri = Math.floor(gIdx / notesPerRow);
    const bi = (beatAbsolute !== undefined) ? (beatAbsolute % N) : (gIdx % N);
    if (!fixedHandEls[bi]) return;
    const el = fixedHandEls[bi];
    el.classList.remove('active'); void el.offsetWidth; el.classList.add('active');
    setPulseDot(bi);
    if (beatAbsolute !== undefined) updateBeatPalmIndicator(beatAbsolute);
    /* Auto-scroll: only when row bottom goes below container bottom */
    const container = document.getElementById('chartScrollFrame');
    const activeRow = document.getElementById('row-' + ri);
    if (container && activeRow) {
        const cRect = container.getBoundingClientRect();
        const rRect = activeRow.getBoundingClientRect();
        if (rRect.bottom > cRect.bottom) {
            container.scrollBy({ top: rRect.top - cRect.top - 16, behavior: 'smooth' });
        }
    }
}
