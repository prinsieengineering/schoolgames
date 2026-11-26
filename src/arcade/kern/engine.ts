// Kleine eigen spelmotor voor de arcadespelletjes (canvas + spellus + bediening).

import { useEffect, useRef } from 'react';
import type { Leerjaar } from '../../core/types';

/** Logische grootte van elk speelveld; het canvas schaalt mee met het scherm. */
export const B = 480;
export const H = 640;

/** Jonge kinderen: tragere monsters. */
export const tempo = (lj: Leerjaar) => [0.45, 0.55, 0.7, 0.8, 0.9, 1][lj - 1];

/** Roept `stap(dt)` elke frame op zolang `actief` waar is. */
export function useSpellus(stap: (dt: number) => void, actief: boolean) {
  const ref = useRef(stap);
  ref.current = stap;
  useEffect(() => {
    if (!actief) return;
    let id = 0;
    let vorige = performance.now();
    const lus = (nu: number) => {
      const dt = Math.min(0.05, (nu - vorige) / 1000);
      vorige = nu;
      ref.current(dt);
      id = requestAnimationFrame(lus);
    };
    id = requestAnimationFrame(lus);
    return () => cancelAnimationFrame(id);
  }, [actief]);
}

const SPELTOETSEN = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
const norm = (k: string) => (k.length === 1 ? k.toLowerCase() : k);

/** Ingedrukte toetsen + "druk"-gebeurtenissen (één keer per indrukken). */
export function useToetsen(opDruk?: (toets: string) => void) {
  const ingedrukt = useRef(new Set<string>());
  const drukRef = useRef(opDruk);
  drukRef.current = opDruk;
  useEffect(() => {
    const neer = (e: KeyboardEvent) => {
      if (SPELTOETSEN.includes(e.key)) e.preventDefault();
      const k = norm(e.key);
      if (!ingedrukt.current.has(k)) drukRef.current?.(k);
      ingedrukt.current.add(k);
    };
    const op = (e: KeyboardEvent) => ingedrukt.current.delete(norm(e.key));
    const leeg = () => ingedrukt.current.clear();
    window.addEventListener('keydown', neer);
    window.addEventListener('keyup', op);
    window.addEventListener('blur', leeg);
    return () => {
      window.removeEventListener('keydown', neer);
      window.removeEventListener('keyup', op);
      window.removeEventListener('blur', leeg);
    };
  }, []);
  return ingedrukt;
}

export function bereidCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (canvas.width !== B * dpr) {
    canvas.width = B * dpr;
    canvas.height = H * dpr;
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/** Schermcoördinaten → logische coördinaten van het speelveld. */
export function canvasPunt(canvas: HTMLCanvasElement, e: { clientX: number; clientY: number }) {
  const r = canvas.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * B, y: ((e.clientY - r.top) / r.height) * H };
}

export const afstand = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);

export const klem = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
