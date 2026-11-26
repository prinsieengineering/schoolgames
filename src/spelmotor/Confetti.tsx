import { useMemo } from 'react';

const KLEUREN = ['#ef476f', '#ffd23f', '#06d6a0', '#4d96ff', '#9b5de5', '#ff8c42'];

export function Confetti({ aantal = 60 }: { aantal?: number }) {
  const stukjes = useMemo(
    () =>
      Array.from({ length: aantal }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duur: 1.8 + Math.random() * 1.5,
        kleur: KLEUREN[i % KLEUREN.length],
        draai: Math.random() * 360,
      })),
    [aantal],
  );
  return (
    <div className="confetti" aria-hidden>
      {stukjes.map((s, i) => (
        <span
          key={i}
          style={{ left: `${s.left}%`, background: s.kleur, animationDelay: `${s.delay}s`, animationDuration: `${s.duur}s`, transform: `rotate(${s.draai}deg)` }}
        />
      ))}
    </div>
  );
}
