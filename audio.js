'use strict';
/* ═══════════════════════════════════════════════════════════
   audio.js — AudioEngine: oscillators + sample playback
   Depends on: pitch.js (FREQ, SCALES)
═══════════════════════════════════════════════════════════ */

/* ── Audio state ── */
let audioCtx          = null;
let activeOscillators = [];
let shrutiOscillators = [];
let shrutiFilter      = null;
let lastPlayedFreq    = null;
let muted             = false;
let metroOn           = false;
let shrutiOn          = false;

/* ══════════════════════════════════════
   AUDIO ENGINE CLASS
   mode: 'oscillator' | 'samples'
   Falls back to oscillator when sample
   file is missing.
══════════════════════════════════════ */
class AudioEngine {
    constructor(config) {
        this.mode        = config.mode  || 'oscillator';
        this.scale       = config.scale || 'Mayamalavagowla';
        this.sampleCache = {};
    }

    /* Primary API — callers use only this */
    async playNote(swara, octave, durationMs) {
        if (this.mode === 'samples') {
            await this._playSample(swara, octave, durationMs);
        } else {
            const hz = noteToHz(
                ['sa','ri','ga','ma','pa','da','ni'].indexOf(swara),
                octave, this.scale
            );
            if (hz) playFreq(hz, 0.4);
        }
    }

    async _playSample(swara, octave, durationMs) {
        const key = `${swara}_${octave}`;
        if (!this.sampleCache[key]) {
            const url = `/audio/samples/${this.scale}/${key}.opus`;
            try {
                const response     = await fetch(url);
                const arrayBuffer  = await response.arrayBuffer();
                this.sampleCache[key] =
                    await getAudioCtx().decodeAudioData(arrayBuffer);
            } catch (e) {
                /* Sample file missing — fall back to oscillator */
                const hz = noteToHz(
                    ['sa','ri','ga','ma','pa','da','ni'].indexOf(swara),
                    octave, this.scale
                );
                if (hz) playFreq(hz, 0.4);
                return;
            }
        }
        const ctx    = getAudioCtx();
        const source = ctx.createBufferSource();
        source.buffer = this.sampleCache[key];
        /* Pitch-shift to match current kattai setting if needed */
        const scaleDef = SCALES[this.scale];
        if (scaleDef) source.playbackRate.value = 196.00 / scaleDef.saHz;
        source.connect(ctx.destination);
        source.start();
        source.stop(ctx.currentTime + durationMs / 1000);
    }
}

/* Default engine instance (oscillator mode) */
const nadaEngine = new AudioEngine({ mode: 'oscillator', scale: 'Mayamalavagowla' });

/* ── Low-level audio context management ── */
function getAudioCtx() {
    if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        window.nadaAudioCtx = audioCtx;
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function pruneOscillators() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    activeOscillators = activeOscillators.filter(item => {
        if (item.stopAt <= now) { try { item.gain.disconnect(); } catch(e){} return false; }
        return true;
    });
}

function stopAllOscillators() {
    activeOscillators.forEach(item => {
        try { item.osc.stop();        } catch(e) {}
        try { item.gain.disconnect(); } catch(e) {}
    });
    activeOscillators = [];
}

function playFreq(freq, gainLevel) {
    if (muted) return;
    const ctx = getAudioCtx(), now = ctx.currentTime;
    const durMs = Math.min(noteDuration * 0.85, 600);
    const dur   = durMs / 1000;
    pruneOscillators();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainLevel, Math.max(now + 0.001, now + 0.005));
    gain.gain.setTargetAtTime(0, Math.max(now + 0.002, now + dur - 0.1), 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    const stopTime = Math.max(now + 0.001, now + dur + 0.05);
    osc.stop(stopTime);
    activeOscillators.push({ osc, gain, stopAt: stopTime });
}

function playTone(label) {
    if (muted) return;
    const freq = FREQ[label];
    if (!freq) { console.warn('No freq for label:', label, JSON.stringify(label)); return; }
    lastPlayedFreq = freq;
    playFreq(freq, 0.4);
}

function playMetro(beatAbsolute) {
    if (!metroOn) return;
    const ctx  = getAudioCtx();
    const now  = ctx.currentTime + 0.005;
    const N    = currentTalaPattern ? currentTalaPattern.beats.length : 8;
    const isDown = (beatAbsolute % N === 0);
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(isDown ? 1200 : 800, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.setTargetAtTime(isDown ? 0.40 : 0.25, now, 0.001);
    gain.gain.setTargetAtTime(0, now + (isDown ? 0.025 : 0.015), 0.005);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    const stopTime = Math.max(now + 0.001, now + 0.050);
    osc.stop(stopTime);
    activeOscillators.push({ osc, gain, stopAt: stopTime });
}

/* ── Shruti drone ── */
async function startShruti(saFreq, mode) {
    stopShruti();
    mode = mode || 'sa-pa-sa';
    const actx = getAudioCtx();

    let tries = 0;
    while (actx.state !== 'running' && tries < 10) {
        await actx.resume();
        if (actx.state === 'running') break;
        await new Promise(r => setTimeout(r, 50));
        tries++;
    }

    shrutiFilter = actx.createBiquadFilter();
    shrutiFilter.type = 'lowpass';
    shrutiFilter.frequency.value = 700;
    shrutiFilter.Q.value = 0.7;
    shrutiFilter.connect(actx.destination);

    const lfo      = actx.createOscillator();
    const lfoDepth = actx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    lfoDepth.gain.value = 0.015;
    lfo.start();
    shrutiOscillators.push(lfo);

    const toneSets = {
        'sa': [
            { freq: saFreq,       type: 'triangle', base: 0.12 },
        ],
        'sa-pa-sa': [
            { freq: saFreq,       type: 'triangle', base: 0.12 },
            { freq: saFreq * 1.5, type: 'triangle', base: 0.08 },
            { freq: saFreq * 2.0, type: 'triangle', base: 0.07 },
        ],
        'sa-ma-sa': [
            { freq: saFreq,             type: 'triangle', base: 0.12 },
            { freq: saFreq * 4 / 3,     type: 'sine',     base: 0.05 },
            { freq: saFreq * 2.0,       type: 'triangle', base: 0.07 },
        ],
        'sa-pa-sa-ma': [
            { freq: saFreq,             type: 'triangle', base: 0.12 },
            { freq: saFreq * 1.5,       type: 'triangle', base: 0.08 },
            { freq: saFreq * 2.0,       type: 'triangle', base: 0.07 },
            { freq: saFreq * 4 / 3,     type: 'sine',     base: 0.04 },
        ],
    };

    const tones = toneSets[mode] || toneSets['sa-pa-sa'];
    tones.forEach(def => {
        const osc      = actx.createOscillator();
        const gainNode = actx.createGain();
        osc.type = def.type;
        osc.frequency.value = def.freq;
        gainNode.gain.setValueAtTime(0, actx.currentTime);
        gainNode.gain.linearRampToValueAtTime(def.base, actx.currentTime + 0.2);
        lfo.connect(lfoDepth);
        lfoDepth.connect(gainNode.gain);
        osc.connect(gainNode);
        gainNode.connect(shrutiFilter);
        osc.start();
        shrutiOscillators.push(osc);
    });
}

function stopShruti() {
    shrutiOscillators.forEach(node => {
        try { if (typeof node.stop === 'function') node.stop(); } catch(e) {}
        try { node.disconnect(); } catch(e) {}
    });
    shrutiOscillators = [];
    if (shrutiFilter) {
        try { shrutiFilter.disconnect(); } catch(e) {}
        shrutiFilter = null;
    }
}
