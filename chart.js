'use strict';
/* ═══════════════════════════════════════════════════════════
   chart.js — canvas drawing, chart build, print SVG
   Depends on: pitch.js, tala.js
═══════════════════════════════════════════════════════════ */

/* ── Chart render state ── */
let rows      = [];
let canvases  = [];
let glowAngle = 0;
let rafId     = null;

/* ══════════════════════════════════════
   BUILD CHART SECTION
══════════════════════════════════════ */
function buildChartSection(notes) {
    notesPerRow = Math.max(1, Math.round(currentBeatsPerRow * currentMult * _ntSubUnits));

    const container = document.getElementById('chartsContainer');
    container.innerHTML = '';
    canvases = []; rows = [];
    buildPulseBar();

    for (let i = 0; i < notes.length; i += notesPerRow) {
        rows.push(notes.slice(i, i + notesPerRow));
    }

    rows.forEach((rowNotes, ri) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'chart-row';
        rowDiv.id = 'row-' + ri;

        const cvs = document.createElement('canvas');
        cvs.width = CW; cvs.height = CH; cvs.className = 'chart-canvas';
        rowDiv.appendChild(cvs);
        canvases.push(cvs);
        container.appendChild(rowDiv);
    });

    buildFixedHandsRow();

    const frame = document.getElementById('chartScrollFrame');
    if (frame) frame.scrollTo({ top: 0, behavior: 'instant' });
}

/* ══════════════════════════════════════
   DRAW ROW  (canvas 2D)
══════════════════════════════════════ */
function drawRow(ctx, rowNotes, rowIdx, totalRows, activeInRow, pulse) {
    /* Background */
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = '#FAFAF7'; ctx.fillRect(PL, PT, PLOT_W, PLOT_H);

    /* Row label */
    if (totalRows > 1) {
        ctx.fillStyle = '#8B4513'; ctx.font = '700 9px system-ui, Arial, sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.letterSpacing = '1.5px';
        ctx.fillText('ROW ' + (rowIdx + 1), 4, 3);
        ctx.letterSpacing = '0px';
    }

    /* Horizontal grid */
    currentPitchConfig.labels.forEach(yl => {
        const y = yFor(yl.pitch);
        ctx.beginPath(); ctx.strokeStyle = '#DDD4C8'; ctx.lineWidth = .8;
        ctx.setLineDash([4,4]); ctx.moveTo(PL, y); ctx.lineTo(PL + PLOT_W, y); ctx.stroke();
        ctx.setLineDash([]);
    });

    /* Sa octave boundary (NT mode) */
    if (currentPitchConfig === PITCH_CONFIG_NT) {
        const saY = yFor(6.0);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.strokeStyle = '#C8A97E'; ctx.lineWidth = 1;
        ctx.setLineDash([4,4]); ctx.moveTo(PL, saY); ctx.lineTo(PL + PLOT_W, saY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    /* Y-axis labels */
    const visibleYLabels = getFilteredYLabels(currentPitchConfig);
    visibleYLabels.forEach(yl => {
        const y = yFor(yl.pitch);
        ctx.fillStyle = '#8B6914'; ctx.font = '500 10px Georgia, serif';
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(yl.name, PL - 4, y);
    });

    /* Vertical grid + beat numbers */
    for (let b = 0; b < currentBeatsPerRow; b++) {
        const ni = b * currentMult;
        if (ni !== Math.floor(ni)) continue;
        const x = xForNote(ni);
        ctx.beginPath(); ctx.strokeStyle = '#DDD4C8'; ctx.lineWidth = .8;
        ctx.setLineDash([4,4]); ctx.moveTo(x, PT); ctx.lineTo(x, PT + PLOT_H); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#5C2E0A'; ctx.font = '10px Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(b + 1, x, PT + PLOT_H + 28);
    }

    /* Kala indicator */
    if (currentMult !== 1) {
        const kLbl = currentMult < 1 ? '\u00BD\u00D7' : '\u00D7' + Math.round(currentMult);
        ctx.fillStyle = '#8B4513'; ctx.font = 'bold 9px Georgia, serif';
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText(kLbl, CW - 4, 3);
    }

    /* Tala group dividers — double line */
    let cumBeat = 0;
    for (let gi = 0; gi < currentTalaGroups.length - 1; gi++) {
        cumBeat += currentTalaGroups[gi];
        const x = PL + (cumBeat / currentBeatsPerRow) * PLOT_W;
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 1.5;
        ctx.setLineDash([6,3]);
        ctx.beginPath(); ctx.moveTo(x - 2, PT); ctx.lineTo(x - 2, PT + PLOT_H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 2, PT); ctx.lineTo(x + 2, PT + PLOT_H); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();
    }

    /* Beat lines */
    {
        const notesPerBeat = Math.max(1, Math.round(currentMult * _ntSubUnits));
        for (let bi = notesPerBeat; bi < rowNotes.length; bi += notesPerBeat) {
            const x = xForNote(bi - 0.5);
            let nearTala = false;
            let cb = 0;
            for (let gi = 0; gi < currentTalaGroups.length - 1; gi++) {
                cb += currentTalaGroups[gi];
                const tx = PL + (cb / currentBeatsPerRow) * PLOT_W;
                if (Math.abs(x - tx) < 8) { nearTala = true; break; }
            }
            if (!nearTala) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(74,144,217,0.9)';
                ctx.lineWidth = 2.0;
                ctx.setLineDash([4,3]);
                ctx.moveTo(x, PT); ctx.lineTo(x, PT + PLOT_H); ctx.stroke();
                ctx.setLineDash([]); ctx.restore();
            }
        }
    }

    /* Axes */
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(PL, PT); ctx.lineTo(PL, PT + PLOT_H); ctx.lineTo(PL + PLOT_W, PT + PLOT_H);
    ctx.stroke();

    /* Blue connecting line */
    if (rowNotes.length > 1) {
        ctx.beginPath(); ctx.strokeStyle = '#4A90D9'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
        rowNotes.forEach((note, i) => {
            const x = xForNote(i), y = yFor(note.pitch);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    /* Dots + labels */
    rowNotes.forEach((note, i) => {
        const x = xForNote(i), y = yFor(note.pitch);
        const isActive  = i === activeInRow;
        const isSustain = note.label === '-';

        if (isActive) {
            if (isSustain) {
                const r   = 8 + pulse * 3;
                const grd = ctx.createRadialGradient(x, y, 2, x, y, r);
                grd.addColorStop(0,  'rgba(34,197,94,.45)');
                grd.addColorStop(.5, 'rgba(34,197,94,.15)');
                grd.addColorStop(1,  'rgba(34,197,94,0)');
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = grd; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.strokeStyle = '#22C55E'; ctx.lineWidth = 2; ctx.stroke();
            } else {
                const r   = 10 + pulse * 5;
                const grd = ctx.createRadialGradient(x, y, 2, x, y, r);
                grd.addColorStop(0,   'rgba(34,197,94,.55)');
                grd.addColorStop(.5,  'rgba(34,197,94,.18)');
                grd.addColorStop(1,   'rgba(34,197,94,0)');
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = grd; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 7 + pulse * 2, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(34,197,94,${.45 - pulse * .25})`; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#22C55E'; ctx.fill();
                ctx.strokeStyle = '#15803D'; ctx.lineWidth = 1.2; ctx.stroke();
            }
        } else {
            if (isSustain) {
                ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.strokeStyle = '#C0392B'; ctx.lineWidth = 2; ctx.stroke();
            } else {
                ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#E53E3E'; ctx.fill();
                ctx.strokeStyle = '#B91C1C'; ctx.lineWidth = 1; ctx.stroke();
            }
        }

        /* Note label */
        if (!isSustain) {
            const nearBaseline = (y >= PT + PLOT_H - 18);
            ctx.font = '600 11px Georgia, serif';
            ctx.fillStyle = '#C0392B';
            ctx.globalAlpha = 0.9;
            ctx.textAlign = 'center';
            if (nearBaseline) {
                ctx.textBaseline = 'bottom';
                ctx.fillText(note.label, x, y - 10);
            } else {
                ctx.textBaseline = 'top';
                ctx.fillText(note.label, x, y + 10);
            }
            ctx.globalAlpha = 1.0;

            /* Octave dot */
            if (note.pitch > 12.0 ||
                (currentPitchConfig === PITCH_CONFIG_NT && note.pitch < 6.0 && note.pitch > 0) ||
                note.pitch < 0) {
                const isTara = note.pitch > 12.0;
                const dotY   = nearBaseline
                    ? (isTara ? y - 10 - 14 : y - 10 + 3)
                    : (isTara ? y + 10 - 5  : y + 10 + 14);
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = isTara ? '#D4A017' : '#7BA3C0';
                ctx.beginPath(); ctx.arc(x, dotY, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        /* Lyric */
        const lyr = note.lyric || '';
        const nearTop = (y - PT < 36);
        const lyricAboveOffset = (i % 2 === 0) ? -28 : -33;
        const lyY = nearTop ? y + 32 : y + lyricAboveOffset;
        if (isSustain || lyr === '-') {
            /* sustain: no lyric rendered */
        } else if (lyr) {
            if (isActive) {
                ctx.font = 'italic 700 17px Georgia, serif';
                ctx.fillStyle = '#D4A017';
                ctx.globalAlpha = 1.0;
                ctx.shadowColor = 'rgba(212,160,23,0.6)';
                ctx.shadowBlur = 10;
            } else {
                ctx.font = 'italic 500 14px Georgia, serif';
                ctx.fillStyle = '#2C5282';
                ctx.globalAlpha = 0.85;
            }
            ctx.textAlign = (i === 0) ? 'left' : 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(lyr, x, lyY);
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
        }
    });
}

/* ── Placeholder chart ── */
function drawComingSoon(ctx, title, raga, lyrics) {
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = '#F5F0E8'; ctx.fillRect(PL, PT, PLOT_W, PLOT_H);
    Y_LABELS.forEach(yl => {
        const y = yFor(yl.pitch);
        ctx.beginPath(); ctx.strokeStyle = '#E8E0D4'; ctx.lineWidth = .8;
        ctx.setLineDash([4,4]); ctx.moveTo(PL, y); ctx.lineTo(PL + PLOT_W, y); ctx.stroke(); ctx.setLineDash([]);
    });
    ctx.strokeStyle = '#5C2E0A'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, PT + PLOT_H); ctx.lineTo(PL + PLOT_W, PT + PLOT_H); ctx.stroke();

    const cx = CW / 2, cy = CH / 2 - 6;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4050A0'; ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText('\u266A ' + title, cx, cy - 24);
    if (lyrics && lyrics.length > 0) {
        ctx.fillStyle = '#6070A8'; ctx.font = 'italic 13px Georgia, serif';
        ctx.fillText(lyrics[0], cx, cy - 4);
    }
    const badgeText = 'Full notation \u2014 coming soon';
    ctx.font = 'bold 11px Georgia, serif';
    const tw = ctx.measureText(badgeText).width;
    const bpad = 10, bh = 20;
    const bx = cx - tw / 2 - bpad, by = cy + 14, bw = tw + bpad * 2;
    const r = 5;
    ctx.beginPath();
    ctx.moveTo(bx + r, by); ctx.lineTo(bx + bw - r, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + r, r);
    ctx.lineTo(bx + bw, by + bh - r); ctx.arcTo(bx + bw, by + bh, bx + bw - r, by + bh, r);
    ctx.lineTo(bx + r, by + bh); ctx.arcTo(bx, by + bh, bx, by + bh - r, r);
    ctx.lineTo(bx, by + r); ctx.arcTo(bx, by, bx + r, by, r);
    ctx.closePath();
    ctx.fillStyle = '#FFF3CD'; ctx.fill();
    ctx.strokeStyle = '#E6AC00'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#7A5200'; ctx.fillText(badgeText, cx, by + bh / 2);
}

/* ══════════════════════════════════════
   RENDER LOOP
══════════════════════════════════════ */
function render() {
    if (placeholderMode) return;
    const pulse = Math.sin(glowAngle) * 0.5 + 0.5;
    rows.forEach((rowNotes, ri) => {
        const ctx = canvases[ri].getContext('2d');
        const gs  = ri * notesPerRow;
        const activeInRow = (currentGlobalIdx >= gs && currentGlobalIdx < gs + notesPerRow)
            ? currentGlobalIdx - gs : -1;
        drawRow(ctx, rowNotes, ri, rows.length, activeInRow, pulse);
    });
}

function animLoop() {
    glowAngle += 0.09;
    render();
    rafId = requestAnimationFrame(animLoop);
}

/* ══════════════════════════════════════
   PRINT SVG BUILDER
══════════════════════════════════════ */
function _buildPrintSVG(rowNotes, ri, totalRows) {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CW} ${CH}" width="100%" style="display:block">`;

    svg += `<rect x="0" y="0" width="${CW}" height="${CH}" fill="#FFFDF5"/>`;
    svg += `<rect x="${PL}" y="${PT}" width="${PLOT_W}" height="${PLOT_H}" fill="#FFFDF5"/>`;

    if (totalRows > 1) {
        svg += `<text x="4" y="11" font-size="9" font-family="system-ui,Arial,sans-serif" font-weight="700" fill="#8B4513" letter-spacing="1.5">ROW ${ri + 1}</text>`;
    }

    /* Y-axis grid */
    currentPitchConfig.labels.forEach(yl => {
        const y = yFor(yl.pitch).toFixed(1);
        svg += `<line x1="${PL}" y1="${y}" x2="${PL + PLOT_W}" y2="${y}" stroke="#DDD4C8" stroke-width="0.8" stroke-dasharray="4,4"/>`;
    });

    /* Y-axis labels */
    getFilteredYLabels(currentPitchConfig).forEach(yl => {
        const y = yFor(yl.pitch).toFixed(1);
        svg += `<text x="${PL - 4}" y="${y}" font-size="10" font-family="Georgia,serif" fill="#8B6914" text-anchor="end" dominant-baseline="middle">${_esc(yl.name)}</text>`;
    });

    /* X-axis grid + beat numbers */
    for (let b = 0; b < currentBeatsPerRow; b++) {
        const ni = b * currentMult;
        if (ni !== Math.floor(ni)) continue;
        const x = xForNote(ni).toFixed(1);
        svg += `<line x1="${x}" y1="${PT}" x2="${x}" y2="${PT + PLOT_H}" stroke="#DDD4C8" stroke-width="0.8" stroke-dasharray="4,4"/>`;
        svg += `<text x="${x}" y="${PT + PLOT_H + 28}" font-size="10" font-family="Georgia,serif" fill="#5C2E0A" text-anchor="middle">${b + 1}</text>`;
    }

    /* Tala dividers — double line */
    let cumBeat = 0;
    for (let g = 0; g < currentTalaGroups.length - 1; g++) {
        cumBeat += currentTalaGroups[g];
        const xBase = PL + (cumBeat / currentBeatsPerRow) * PLOT_W;
        const x1 = (xBase - 2).toFixed(1);
        const x2 = (xBase + 2).toFixed(1);
        svg += `<line x1="${x1}" y1="${PT}" x2="${x1}" y2="${PT + PLOT_H}" stroke="#8B4513" stroke-width="1.5" stroke-dasharray="6,3"/>`;
        svg += `<line x1="${x2}" y1="${PT}" x2="${x2}" y2="${PT + PLOT_H}" stroke="#8B4513" stroke-width="1.5" stroke-dasharray="6,3"/>`;
    }

    /* Beat lines */
    {
        const notesPerBeat = Math.max(1, Math.round(currentMult * _ntSubUnits));
        for (let bi = notesPerBeat; bi < rowNotes.length; bi += notesPerBeat) {
            const bx = (PL + (bi - 0.5) / (notesPerRow - 1) * PLOT_W).toFixed(1);
            let near = false;
            let cb2  = 0;
            for (let gi = 0; gi < currentTalaGroups.length - 1; gi++) {
                cb2 += currentTalaGroups[gi];
                const tx = PL + (cb2 / currentBeatsPerRow) * PLOT_W;
                if (Math.abs(bx - tx) < 8) { near = true; break; }
            }
            if (!near) {
                svg += `<line x1="${bx}" y1="${PT}" x2="${bx}" y2="${PT + PLOT_H}" stroke="rgba(74,144,217,0.75)" stroke-width="1.0" stroke-dasharray="4,3"/>`;
            }
        }
    }

    /* Axes */
    svg += `<path d="M${PL},${PT} L${PL},${PT + PLOT_H} L${PL + PLOT_W},${PT + PLOT_H}" fill="none" stroke="#8B4513" stroke-width="1.5"/>`;

    /* Connecting line */
    if (rowNotes.length > 1) {
        const pts = rowNotes.map((n, i) => `${xForNote(i).toFixed(1)},${yFor(n.pitch).toFixed(1)}`).join(' ');
        svg += `<polyline points="${pts}" fill="none" stroke="#4A90C4" stroke-width="1.5" stroke-linejoin="round"/>`;
    }

    /* Dots + labels + lyrics */
    rowNotes.forEach((note, i) => {
        const x        = xForNote(i).toFixed(1);
        const y        = yFor(note.pitch);
        const yf       = y.toFixed(1);
        const isSustain = note.label === '-' || note.label === '_';

        if (isSustain) {
            svg += `<circle cx="${x}" cy="${yf}" r="5" fill="none" stroke="#C0392B" stroke-width="2"/>`;
        } else {
            svg += `<circle cx="${x}" cy="${yf}" r="5" fill="#C0392B" stroke="none"/>`;
        }

        if (!isSustain) {
            if (note.pitch > 12.0 || (note.pitch < 6.0 && note.pitch > 0)) {
                const isTara = note.pitch > 12.0;
                const nearBaseline = y >= PT + PLOT_H - 18;
                const dotY = nearBaseline
                    ? (isTara ? y - 25 : y - 8)
                    : (isTara ? y + 5  : y + 24);
                svg += `<circle cx="${x}" cy="${dotY.toFixed(1)}" r="2.5" fill="${isTara ? '#D4A017' : '#7BA3C0'}"/>`;
            }
            const nearBaseline = y >= PT + PLOT_H - 18;
            if (nearBaseline) {
                svg += `<text x="${x}" y="${(y - 11).toFixed(1)}" font-size="11" font-family="Georgia,serif" font-weight="600" fill="#C0392B" text-anchor="middle" dominant-baseline="auto">${_esc(note.label)}</text>`;
            } else {
                svg += `<text x="${x}" y="${(y + 11).toFixed(1)}" font-size="11" font-family="Georgia,serif" font-weight="600" fill="#C0392B" text-anchor="middle" dominant-baseline="hanging">${_esc(note.label)}</text>`;
            }
        }

        const lyr = note.lyric || '';
        const nearTop = y - PT < 26;
        const lyricOffset = (i % 2 === 0) ? -28 : -33;
        const lyY = (nearTop ? y + 32 : y + lyricOffset).toFixed(1);
        const lyricAnchor = i === 0 ? 'start' : 'middle';
        if (!isSustain && lyr && lyr !== '-') {
            svg += `<text x="${x}" y="${lyY}" font-size="13" font-family="Georgia,serif" font-style="italic" fill="#4A6FA5" text-anchor="${lyricAnchor}" dominant-baseline="middle">${_esc(lyr)}</text>`;
        }
    });

    svg += `</svg>`;
    return svg;
}

/* ── Print area builder ── */
function _printBuildArea() {
    const prArea = document.getElementById('printArea');
    prArea.innerHTML = '';

    const gi    = activeGradeIdx, vi = activeVerseIdx;
    const grade = customMode ? null : LESSONS[gi];

    let gradeName = '', verseName = '', ragaName = '', talaName = '', composerNote = '';
    if (customMode) {
        gradeName    = 'Custom Builder';
        verseName    = 'Custom Piece';
        ragaName     = document.getElementById('hdrRaga').textContent;
        talaName     = document.getElementById('hdrTala').textContent;
        composerNote = 'Custom Builder';
    } else if (grade && grade.nottuswaram) {
        const item   = (grade.items || [])[vi];
        gradeName    = 'Grade ' + (gi + 1) + ' \u00B7 ' + grade.name;
        verseName    = item ? item.title : 'Nottuswaram';
        ragaName     = item ? (item.raga || grade.raga) : grade.raga;
        talaName     = item ? (item.tala || grade.tala) : grade.tala;
        composerNote = 'Raga: ' + ragaName + ' | Tala: ' + talaName + ' | Composer: Muthuswami Dikshitar';
    } else if (grade) {
        const verse  = grade.verses && grade.verses[vi];
        gradeName    = 'Grade ' + (gi + 1) + ' \u00B7 ' + grade.name;
        verseName    = verse ? (verse.title || ('Verse ' + (vi + 1))) : '';
        ragaName     = document.getElementById('hdrRaga').textContent;
        talaName     = document.getElementById('hdrTala').textContent;
        composerNote = 'Raga: ' + ragaName + ' | Tala: ' + talaName;
    }

    const hdr = document.createElement('div');
    hdr.className = 'pr-header';
    hdr.innerHTML =
        '<div class="pr-hdr-row">' +
            '<span class="pr-hdr-raga">'  + _esc(ragaName)  + '</span>' +
            '<span class="pr-hdr-title">N\u0101da Bodha \u2014 Visual Carnatic Music</span>' +
            '<span class="pr-hdr-tala">'  + _esc(talaName)  + '</span>' +
        '</div>' +
        '<div class="pr-hdr-sub">' + _esc(gradeName) + ' \u00B7 ' + _esc(verseName) + '</div>' +
        '<hr class="pr-divider">';
    prArea.appendChild(hdr);

    if (currentNotes.length === 0 || placeholderMode) {
        const ph = document.createElement('div');
        ph.className = 'pr-placeholder';
        ph.textContent = placeholderMode
            ? verseName + ' \u2014 full notation coming soon'
            : 'No notes loaded \u2014 select a grade and verse first.';
        prArea.appendChild(ph);
    } else {
        /* Verse text (hidden in print CSS, kept for completeness) */
        const lines = [];
        for (let start = 0; start < currentNotes.length; start += notesPerRow) {
            const rowSlice = currentNotes.slice(start, start + notesPerRow);
            const parts = [];
            let pos = 0;
            currentTalaGroups.forEach(grpBeats => {
                const cnt = Math.max(1, Math.round(grpBeats * currentMult));
                parts.push(rowSlice.slice(pos, pos + cnt).map(n => n.label).join('\u2009'));
                pos += cnt;
            });
            lines.push(parts.join('  \u2502  ') + '  \u2016');
        }
        const textBox = document.createElement('div');
        textBox.className = 'pr-verse-text';
        textBox.textContent = lines.join('\n');
        prArea.appendChild(textBox);

        /* SVG chart rows */
        const totalRows = Math.ceil(currentNotes.length / notesPerRow);
        const chartDiv  = document.createElement('div');
        for (let ri = 0; ri < totalRows; ri++) {
            const rowNotes = currentNotes.slice(ri * notesPerRow, (ri + 1) * notesPerRow);
            const wrap     = document.createElement('div');
            wrap.className = 'print-chart-row';
            wrap.innerHTML = _buildPrintSVG(rowNotes, ri, totalRows);
            chartDiv.appendChild(wrap);
        }
        prArea.appendChild(chartDiv);
    }

    /* Tala hands (hidden in print CSS) */
    const pat      = currentTalaPattern || ADI_TALA;
    const handsDiv = document.createElement('div');
    handsDiv.className = 'pr-hands-row';
    pat.beats.forEach(beat => {
        const hd = document.createElement('div');
        hd.className = 'pr-hand';
        hd.innerHTML = buildHandSVG(beat.type, beat.samam) +
            '<div class="pr-hand-lbl">' + _esc(beat.lbl) + '</div>' +
            '<div class="pr-hand-sol">' + _esc(beat.sol) + '</div>';
        handsDiv.appendChild(hd);
    });
    prArea.appendChild(handsDiv);

    /* Footer */
    const dateStr = new Date().toLocaleDateString('en-IN', {year:'numeric', month:'long', day:'numeric'});
    const footer  = document.createElement('div');
    footer.className = 'pr-footer';
    footer.innerHTML =
        '<div>Printed from N\u0101da Bodha \u2014 nadabodha.github.io</div>' +
        '<div>Date printed: ' + _esc(dateStr) + '</div>' +
        '<div class="pr-footer-note">' + _esc(composerNote) + '</div>';
    prArea.appendChild(footer);
}
