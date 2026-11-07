/**
 * Procedural Web Audio API sound synthesis for ambient road and atmosphere effects
 */

let audioCtx: AudioContext | null = null;
let rainGainNode: GainNode | null = null;
let rainSourceNode: AudioNode | null = null;
let isRainPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play authentic Indian Highway Bus / Truck multi-tone air horn
 */
export function playHornSound(type: 'bus' | 'truck' = 'bus') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const baseFreqs = type === 'truck' ? [220, 275, 330] : [293.66, 369.99, 440]; // D4, F#4, A4 triad
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    masterGain.gain.setValueAtTime(0.25, now + 0.45);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    masterGain.connect(ctx.destination);

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // subtle vibrato for that genuine pneumatic lorry horn effect
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 6;
      vibratoGain.gain.value = 4;
      vibrato.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + 0.85);

      oscGain.gain.value = 0.33;
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.85);
    });
  } catch (err) {
    console.warn('Audio effect error:', err);
  }
}

/**
 * Play clay cup / ceramic chai toast sound
 */
export function playChaiSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // High pitch ceramic clink
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.warn('Audio effect error:', err);
  }
}

/**
 * Barber scissors snip sound
 */
export function playScissorsSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.12].forEach((offset) => {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3500;
      filter.Q.value = 5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now + offset);
    });
  } catch (err) {
    console.warn('Audio effect error:', err);
  }
}

/**
 * Barber water spray bottle sound
 */
export function playSpraySound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2500;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch (err) {
    console.warn('Audio effect error:', err);
  }
}

/**
 * Start or stop procedural ambient rain
 */
export function setAmbientRain(active: boolean, volume = 0.2) {
  try {
    const ctx = getAudioContext();

    if (active && !isRainPlaying) {
      // Create continuous pink-like filtered noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      rainSourceNode = noise;
      rainGainNode = gain;
      isRainPlaying = true;
    } else if (!active && isRainPlaying && rainGainNode) {
      rainGainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => {
        try {
          if (rainSourceNode && 'stop' in rainSourceNode) {
            (rainSourceNode as AudioScheduledSourceNode).stop();
          }
        } catch {
          // ignore already stopped
        }
        rainSourceNode = null;
        rainGainNode = null;
        isRainPlaying = false;
      }, 900);
    }
  } catch (err) {
    console.warn('Rain ambient error:', err);
  }
}

export function updateRainVolume(volume: number) {
  if (rainGainNode && audioCtx) {
    rainGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
}
