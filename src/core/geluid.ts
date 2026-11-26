// Kleine geluidseffecten, zelf opgewekt met Web Audio (geen bestanden nodig).

let ctx: AudioContext | null = null;
let uitgang: AudioNode | null = null;
let aan = true;

/**
 * Hoofdvolume. Telefoonspeakers zijn klein, dus we versterken flink en zetten een
 * compressor ervoor zodat luide geluiden niet kraken.
 */
const VERSTERKING = 3.5;

function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 6;
    comp.ratio.value = 8;
    const hoofd = ctx.createGain();
    hoofd.gain.value = VERSTERKING;
    hoofd.connect(comp).connect(ctx.destination);
    uitgang = hoofd;
  }
  // Mobiele browsers zetten audio soms op pauze (bv. na het wisselen van app).
  if (ctx.state !== 'running') void ctx.resume();
  return { ctx, uitgang: uitgang! };
}

export const zetGeluid = (waarde: boolean) => {
  aan = waarde;
};

function toon(freq: number, duur: number, type: OscillatorType = 'sine', volume = 0.15, vertraging = 0, glijNaar?: number) {
  if (!aan) return;
  try {
    const { ctx, uitgang } = audio();
    const t0 = ctx.currentTime + vertraging;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glijNaar) osc.frequency.exponentialRampToValueAtTime(glijNaar, t0 + duur);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duur);
    osc.connect(gain).connect(uitgang);
    osc.start(t0);
    osc.stop(t0 + duur);
  } catch {
    /* geen audio beschikbaar */
  }
}

/** Audio ontgrendelen bij de eerste aanraking (nodig op iPhone en iPad). */
if (typeof window !== 'undefined') {
  const ontgrendel = () => {
    try {
      const { ctx, uitgang } = audio();
      const stil = ctx.createBufferSource();
      stil.buffer = ctx.createBuffer(1, 1, 22050);
      stil.connect(uitgang);
      stil.start();
    } catch {
      /* geen audio */
    }
    window.removeEventListener('pointerdown', ontgrendel);
    window.removeEventListener('keydown', ontgrendel);
  };
  window.addEventListener('pointerdown', ontgrendel);
  window.addEventListener('keydown', ontgrendel);
}

export const geluid = {
  juist: () => {
    toon(660, 0.12, 'triangle');
    toon(880, 0.18, 'triangle', 0.15, 0.1);
  },
  fout: () => toon(220, 0.25, 'sawtooth', 0.06, 0, 160),
  klik: () => toon(500, 0.05, 'square', 0.04),
  schiet: () => toon(900, 0.08, 'square', 0.04, 0, 1400),
  ploef: () => toon(300, 0.15, 'triangle', 0.12, 0, 80),
  munt: () => {
    toon(988, 0.08, 'square', 0.05);
    toon(1319, 0.2, 'square', 0.05, 0.08);
  },
  au: () => toon(180, 0.3, 'sine', 0.15, 0, 90),
  fanfare: () => {
    [523, 659, 784, 1047].forEach((f, i) => toon(f, 0.25, 'triangle', 0.12, i * 0.12));
  },
};
