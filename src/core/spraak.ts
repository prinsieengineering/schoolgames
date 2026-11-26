// Voorlezen met de spraak die in de browser zit (gratis, werkt offline
// als het toestel een Nederlandse/Franse stem heeft).

import type { Taal } from './types';

let stemmen: SpeechSynthesisVoice[] = [];

function laadStemmen() {
  if (typeof speechSynthesis === 'undefined') return;
  stemmen = speechSynthesis.getVoices();
}
if (typeof speechSynthesis !== 'undefined') {
  laadStemmen();
  speechSynthesis.onvoiceschanged = laadStemmen;
}

function zoekStem(taal: Taal): SpeechSynthesisVoice | undefined {
  const basis = taal.slice(0, 2);
  return (
    stemmen.find((s) => s.lang === taal) ??
    stemmen.find((s) => s.lang.replace('_', '-') === taal) ??
    stemmen.find((s) => s.lang.startsWith(basis))
  );
}

export const kanVoorlezen = () => typeof speechSynthesis !== 'undefined';

export function spreek(tekst: string, taal: Taal = 'nl-BE') {
  if (!kanVoorlezen() || !tekst) return;
  speechSynthesis.cancel();
  // Breuken als "3/4" voorlezen als "3 op 4" (Vlaams) of "trois quarts" laten we aan de stem.
  const zin = taal === 'nl-BE' ? tekst.replace(/€\s?(\d+),(\d{2})/g, '$1 euro $2').replace(/€\s?(\d+)/g, '$1 euro').replace(/cm²/g, 'vierkante centimeter').replace(/m²/g, 'vierkante meter').replace(/(\d+)\/(\d+)/g, '$1 op $2').replace(/×/g, ' maal ').replace(/(\d)\s*:\s*(\d)/g, '$1 gedeeld door $2') : tekst;
  const u = new SpeechSynthesisUtterance(zin);
  u.lang = taal;
  const stem = zoekStem(taal);
  if (stem) u.voice = stem;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

export function stopSpreken() {
  if (kanVoorlezen()) speechSynthesis.cancel();
}
