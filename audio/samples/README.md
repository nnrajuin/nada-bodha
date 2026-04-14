# Nāda Bodha — Voice Sample Library

Replace the placeholder files in each scale folder with recorded vocal samples.

## File Format
- Container : `.opus` (Ogg Opus)
- Sample rate: 44.1 kHz
- Bit depth  : 16-bit
- Channels   : Mono
- Duration   : ~2 seconds (held note, no decay)
- Vowel      : open 'aa' (as in "father")
- Style       : Pure, no vibrato, no ornaments

## Naming Convention
`{swara}_{octave}.opus`

Examples:
  sa_mandra.opus   — lower-octave Sa
  sa_madhya.opus   — middle-octave Sa
  sa_tara.opus     — upper-octave Sa
  ri_mandra.opus   — lower-octave Ri
  ...

## Swara names
sa, ri, ga, ma, pa, da, ni  (7 notes × 3 octaves = 21 files per scale)

## Folder layout
  samples/
    Mayamalavagowla/   (21 files)
    Shankarabharanam/  (21 files)
  shruti/
    drone_C.opus       — Sa drone at C (1 kattai)
    drone_G.opus       — Sa drone at G (5 kattai)

## AudioEngine usage (audio.js)
Set `mode: 'samples'` in AudioEngine config to enable sample playback.
Falls back to oscillator automatically if a sample file is missing.
