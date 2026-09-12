import { useState } from 'react';

const COLORS = ['#ff5a36', '#ffc24b', '#34d1bd', '#f1f1f8'];

function generatePieces(pieceCount) {
  return Array.from({ length: pieceCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.4,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  }));
}

// Renders once per mount: a fixed batch of colored rectangles that fall
// and fade via a CSS animation, then the layer is left empty (it has
// pointer-events: none, so it never blocks the UI underneath). The
// lazy useState initializer runs exactly once, so the randomness is
// generated on mount rather than on every render.
export default function Confetti({ pieceCount = 40 }) {
  const [pieces] = useState(() => generatePieces(pieceCount));

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
