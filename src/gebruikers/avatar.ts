// Samengestelde avatar, opgebouwd uit lagen (dier + kleur + hoed + bril + extra).
// Alles is zelf getekend als SVG, zodat het ook in één HTML-bestand werkt.
// Wil je later tekeningen uit een pakket (bv. Kenney, CC0) gebruiken? Vervang
// dan enkel de functie `avatarSvg`: de rest van de app gebruikt alleen die.

import type { Avatar } from '../core/types';

export const DIEREN = ['vos', 'beer', 'kat', 'konijn', 'panda', 'kikker', 'uil', 'eenhoorn', 'draak', 'robot'] as const;

export const KLEUREN: Record<string, string> = {
  oranje: '#ff8c42',
  bruin: '#b0703c',
  blauw: '#4d96ff',
  grijs: '#9aa5b1',
  roze: '#ff8fab',
  groen: '#5cc96e',
  paars: '#9b5de5',
  geel: '#ffd23f',
  wit: '#f4f1ea',
  rood: '#ef476f',
  turkoois: '#2ec4b6',
  zwart: '#4a4a55',
};

function donkerder(hex: string, factor = 0.75) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return `rgb(${r},${g},${b})`;
}

function oren(dier: string, c: string, d: string): string {
  switch (dier) {
    case 'vos':
    case 'kat':
      return `<path d="M24 38 L30 8 L48 28 Z" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M76 38 L70 8 L52 28 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
        <path d="M29 30 L32 16 L41 27 Z" fill="#ffd1dc"/><path d="M71 30 L68 16 L59 27 Z" fill="#ffd1dc"/>`;
    case 'beer':
      return `<circle cx="26" cy="28" r="12" fill="${c}" stroke="${d}" stroke-width="2"/><circle cx="74" cy="28" r="12" fill="${c}" stroke="${d}" stroke-width="2"/>
        <circle cx="26" cy="28" r="6" fill="${d}"/><circle cx="74" cy="28" r="6" fill="${d}"/>`;
    case 'panda':
      return `<circle cx="26" cy="28" r="12" fill="#333"/><circle cx="74" cy="28" r="12" fill="#333"/>`;
    case 'konijn':
      return `<ellipse cx="36" cy="10" rx="9" ry="24" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="64" cy="10" rx="9" ry="24" fill="${c}" stroke="${d}" stroke-width="2"/>
        <ellipse cx="36" cy="12" rx="4" ry="16" fill="#ffd1dc"/><ellipse cx="64" cy="12" rx="4" ry="16" fill="#ffd1dc"/>`;
    case 'kikker':
      return `<circle cx="32" cy="30" r="14" fill="${c}" stroke="${d}" stroke-width="2"/><circle cx="68" cy="30" r="14" fill="${c}" stroke="${d}" stroke-width="2"/>`;
    case 'uil':
      return `<path d="M22 36 L20 12 L40 28 Z" fill="${d}"/><path d="M78 36 L80 12 L60 28 Z" fill="${d}"/>`;
    case 'eenhoorn':
      return `<path d="M44 26 L50 -4 L56 26 Z" fill="#ffe066" stroke="#e0a100" stroke-width="2"/>
        <path d="M27 36 L30 14 L44 28 Z" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M73 36 L70 14 L56 28 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
        <path d="M20 44 Q14 60 22 76" stroke="#ff8fab" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M24 40 Q16 54 20 66" stroke="#9b5de5" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    case 'draak':
      return `<path d="M30 30 L22 6 L42 26 Z" fill="#ffe066" stroke="#e0a100" stroke-width="2"/><path d="M70 30 L78 6 L58 26 Z" fill="#ffe066" stroke="#e0a100" stroke-width="2"/>
        <path d="M40 26 L45 16 L50 25 L55 16 L60 26" fill="${d}"/>`;
    case 'robot':
      return `<line x1="50" y1="24" x2="50" y2="8" stroke="#666" stroke-width="3"/><circle cx="50" cy="7" r="5" fill="#ef476f"/>
        <rect x="12" y="46" width="8" height="18" rx="3" fill="#888"/><rect x="80" y="46" width="8" height="18" rx="3" fill="#888"/>`;
    default:
      return '';
  }
}

function hoofd(dier: string, c: string, d: string): string {
  if (dier === 'robot') return `<rect x="20" y="24" width="60" height="58" rx="14" fill="${c}" stroke="${d}" stroke-width="2.5"/>`;
  const vul = dier === 'panda' ? '#fbfbfb' : c;
  const rand = dier === 'panda' ? '#bbb' : d;
  return `<ellipse cx="50" cy="56" rx="31" ry="29" fill="${vul}" stroke="${rand}" stroke-width="2.5"/>`;
}

function gezicht(dier: string, c: string, d: string): string {
  const oogY = dier === 'kikker' ? 30 : 52;
  const oogX = dier === 'kikker' ? 18 : 12;
  let s = '';
  if (dier === 'panda') s += `<ellipse cx="38" cy="53" rx="9" ry="11" fill="#333" transform="rotate(-20 38 53)"/><ellipse cx="62" cy="53" rx="9" ry="11" fill="#333" transform="rotate(20 62 53)"/>`;
  if (dier === 'uil') s += `<circle cx="38" cy="52" r="12" fill="#fff" stroke="${d}" stroke-width="2"/><circle cx="62" cy="52" r="12" fill="#fff" stroke="${d}" stroke-width="2"/>`;
  if (dier === 'kikker') s += `<circle cx="32" cy="30" r="8" fill="#fff"/><circle cx="68" cy="30" r="8" fill="#fff"/>`;
  if (dier === 'robot') {
    s += `<rect x="30" y="42" width="16" height="14" rx="4" fill="#dff"/><rect x="54" y="42" width="16" height="14" rx="4" fill="#dff"/>
      <circle cx="38" cy="49" r="4" fill="#223"/><circle cx="62" cy="49" r="4" fill="#223"/>
      <rect x="36" y="66" width="28" height="6" rx="3" fill="#223"/><line x1="43" y1="66" x2="43" y2="72" stroke="#dff"/><line x1="50" y1="66" x2="50" y2="72" stroke="#dff"/><line x1="57" y1="66" x2="57" y2="72" stroke="#dff"/>`;
    return s;
  }
  // snuit
  if (['vos', 'beer', 'kat', 'konijn', 'eenhoorn', 'draak'].includes(dier)) {
    s += `<ellipse cx="50" cy="68" rx="15" ry="11" fill="${dier === 'draak' ? donkerder(c, 1.1) : '#fff6ec'}" opacity="0.95"/>`;
  }
  // ogen
  s += `<circle cx="${50 - oogX}" cy="${oogY}" r="5" fill="#222"/><circle cx="${50 + oogX}" cy="${oogY}" r="5" fill="#222"/>
    <circle cx="${50 - oogX + 1.8}" cy="${oogY - 1.8}" r="1.8" fill="#fff"/><circle cx="${50 + oogX + 1.8}" cy="${oogY - 1.8}" r="1.8" fill="#fff"/>`;
  // neus + mond
  if (dier === 'uil') s += `<path d="M45 62 L55 62 L50 72 Z" fill="#ffb703"/>`;
  else if (dier === 'kikker') s += `<path d="M34 66 Q50 80 66 66" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else {
    s += `<ellipse cx="50" cy="63" rx="5" ry="3.5" fill="#333"/>
      <path d="M43 70 Q50 76 57 70" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
  if (dier === 'kat') s += `<g stroke="#555" stroke-width="1.3"><line x1="22" y1="64" x2="38" y2="66"/><line x1="22" y1="70" x2="38" y2="69"/><line x1="78" y1="64" x2="62" y2="66"/><line x1="78" y1="70" x2="62" y2="69"/></g>`;
  // wangetjes
  s += `<circle cx="28" cy="66" r="5" fill="#ff8fab" opacity="0.5"/><circle cx="72" cy="66" r="5" fill="#ff8fab" opacity="0.5"/>`;
  return s;
}

function hoed(h: string | null): string {
  switch (h) {
    case 'pet':
      return `<path d="M24 34 Q50 4 76 34 Z" fill="#ef476f" stroke="#a32347" stroke-width="2"/><path d="M60 32 Q82 30 90 36 Q74 40 58 36 Z" fill="#a32347"/>`;
    case 'feesthoed':
      return `<path d="M36 30 L50 -6 L64 30 Z" fill="#4d96ff" stroke="#1f5fc9" stroke-width="2"/><circle cx="50" cy="-7" r="5" fill="#ffd23f"/>
        <circle cx="46" cy="16" r="2.5" fill="#ffd23f"/><circle cx="54" cy="8" r="2.5" fill="#ef476f"/><circle cx="53" cy="22" r="2.5" fill="#fff"/>`;
    case 'tovenaar':
      return `<path d="M22 32 Q50 24 78 32 L60 26 L44 -12 L40 26 Z" fill="#5a3ea8" stroke="#2d1d66" stroke-width="2"/>
        <text x="46" y="18" font-size="10" fill="#ffd23f">★</text><text x="52" y="6" font-size="7" fill="#ffd23f">★</text>`;
    case 'kroon':
      return `<path d="M28 32 L30 8 L40 20 L50 4 L60 20 L70 8 L72 32 Z" fill="#ffd23f" stroke="#c99400" stroke-width="2"/>
        <circle cx="50" cy="22" r="3.5" fill="#ef476f"/><circle cx="38" cy="25" r="2.5" fill="#4d96ff"/><circle cx="62" cy="25" r="2.5" fill="#5cc96e"/>`;
    case 'bloem':
      return `<g transform="translate(70 26)"><circle cx="0" cy="-7" r="6" fill="#ff8fab"/><circle cx="7" cy="0" r="6" fill="#ff8fab"/><circle cx="0" cy="7" r="6" fill="#ff8fab"/><circle cx="-7" cy="0" r="6" fill="#ff8fab"/><circle r="5" fill="#ffd23f"/></g>`;
    case 'strik':
      return `<g transform="translate(50 26)"><path d="M0 0 L-16 -9 L-16 9 Z" fill="#ef476f"/><path d="M0 0 L16 -9 L16 9 Z" fill="#ef476f"/><circle r="4.5" fill="#c9184a"/></g>`;
    case 'koptelefoon':
      return `<path d="M18 54 Q18 14 50 14 Q82 14 82 54" stroke="#333" stroke-width="5" fill="none"/><rect x="11" y="46" width="12" height="20" rx="5" fill="#4d96ff"/><rect x="77" y="46" width="12" height="20" rx="5" fill="#4d96ff"/>`;
    default:
      return '';
  }
}

function bril(b: string | null, dier: string): string {
  const y = dier === 'kikker' ? 30 : 52;
  const x = dier === 'kikker' ? 18 : 12;
  switch (b) {
    case 'rond':
      return `<g fill="none" stroke="#333" stroke-width="2.5"><circle cx="${50 - x}" cy="${y}" r="9"/><circle cx="${50 + x}" cy="${y}" r="9"/><line x1="${50 - x + 9}" y1="${y}" x2="${50 + x - 9}" y2="${y}"/></g>`;
    case 'zonnebril':
      return `<g><rect x="${50 - x - 11}" y="${y - 7}" width="21" height="14" rx="5" fill="#222"/><rect x="${50 + x - 10}" y="${y - 7}" width="21" height="14" rx="5" fill="#222"/><line x1="${50 - x + 10}" y1="${y - 3}" x2="${50 + x - 10}" y2="${y - 3}" stroke="#222" stroke-width="3"/>
        <line x1="${50 - x - 6}" y1="${y - 3}" x2="${50 - x - 1}" y2="${y - 5}" stroke="#fff" stroke-width="2" opacity=".7"/></g>`;
    case 'sterbril':
      return `<g fill="#ff8fab" stroke="#c9184a" stroke-width="1.5" opacity="0.95">
        <path transform="translate(${50 - x} ${y}) scale(1.1)" d="M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3 Z"/>
        <path transform="translate(${50 + x} ${y}) scale(1.1)" d="M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3 Z"/></g>`;
    default:
      return '';
  }
}

function extra(e: string | null): string {
  switch (e) {
    case 'sjaal':
      return `<path d="M26 82 Q50 94 74 82 L74 90 Q50 102 26 90 Z" fill="#ef476f"/><rect x="58" y="88" width="10" height="18" rx="3" fill="#ef476f"/><line x1="30" y1="87" x2="70" y2="87" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>`;
    case 'vlinderdas':
      return `<g transform="translate(50 90)"><path d="M0 0 L-12 -7 L-12 7 Z" fill="#4d96ff"/><path d="M0 0 L12 -7 L12 7 Z" fill="#4d96ff"/><circle r="3.5" fill="#1f5fc9"/></g>`;
    case 'medaille':
      return `<path d="M42 82 L50 96 L58 82" stroke="#4d96ff" stroke-width="4" fill="none"/><circle cx="50" cy="100" r="8" fill="#ffd23f" stroke="#c99400" stroke-width="2"/><text x="46" y="104" font-size="10" fill="#c99400">★</text>`;
    case 'cape':
      return `<path d="M22 80 L8 112 L92 112 L78 80 Z" fill="#9b5de5" opacity="0.9"/>`;
    default:
      return '';
  }
}

/** Geeft de avatar terug als SVG-tekst. */
export function avatarSvg(a: Avatar): string {
  const c = KLEUREN[a.kleur] ?? a.kleur ?? '#ff8c42';
  const d = donkerder(c);
  const lijf = a.dier === 'robot' ? '' : `<ellipse cx="50" cy="98" rx="22" ry="14" fill="${a.dier === 'panda' ? '#333' : c}" stroke="${a.dier === 'panda' ? '#222' : d}" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -14 110 128">
    ${a.extra === 'cape' ? extra('cape') : ''}
    ${lijf}
    ${a.dier === 'robot' ? `<rect x="32" y="82" width="36" height="26" rx="6" fill="${c}" stroke="${d}" stroke-width="2"/>` : ''}
    ${oren(a.dier, c, d)}
    ${hoofd(a.dier, c, d)}
    ${gezicht(a.dier, c, d)}
    ${bril(a.bril, a.dier)}
    ${hoed(a.hoed)}
    ${a.extra && a.extra !== 'cape' ? extra(a.extra) : ''}
  </svg>`;
}

export const avatarUrl = (a: Avatar) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(avatarSvg(a));
