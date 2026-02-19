/**
 * Sound Service — Web Audio API synthesized sounds
 * No external audio files required.
 */

const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
let ctx: AudioContext | null = null;

const getCtx = (): AudioContext => {
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
};

// --- Mute State ---
let _isMuted: boolean = localStorage.getItem('camblaster_muted') === 'true';

export const getIsMuted = (): boolean => _isMuted;

export const toggleMute = (): boolean => {
    _isMuted = !_isMuted;
    localStorage.setItem('camblaster_muted', String(_isMuted));
    return _isMuted;
};

// --- Sound Generators ---

/** Short satisfying bubble pop — sine wave, 300ms, pitch drop */
export const playPop = (): void => {
    if (_isMuted) return;
    const c = getCtx();
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
};

/** Quick whoosh on shoot — noise burst, 150ms */
export const playWhoosh = (): void => {
    if (_isMuted) return;
    const c = getCtx();
    const now = c.currentTime;
    // White noise via buffer
    const bufferSize = c.sampleRate * 0.15;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // fade-out envelope
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    const bandpass = c.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2000;
    bandpass.Q.value = 0.5;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(c.destination);
    source.start(now);
    source.stop(now + 0.15);
};

/** Short celebratory fanfare — 3-note ascending, 600ms */
export const playFanfare = (): void => {
    if (_isMuted) return;
    const c = getCtx();
    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        const t = now + i * 0.15;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.35);
    });
};

/** Warm tone on 4+ bubble combo — chord, 400ms */
export const playMatch = (): void => {
    if (_isMuted) return;
    const c = getCtx();
    const now = c.currentTime;
    const chord = [440, 554.37, 659.25]; // A4, C#5, E5 — A major
    chord.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now + i * 0.03);
        osc.stop(now + 0.45);
    });
};
