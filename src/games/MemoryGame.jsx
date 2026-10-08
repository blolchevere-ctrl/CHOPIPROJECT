import { useState, useEffect } from 'react';

const EMOJIS = ['∑', '∫', 'π', '√', '∞', 'Δ', '≈', 'φ'];

function makeCards() {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export default function MemoryGame({ onExit }) {
  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem('memory-best') || '0', 10); } catch { return 0; }
  });

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setMatched((m) => {
          const nm = m + 1;
          if (nm === EMOJIS.length) {
            setGameOver(true);
            if (best === 0 || moves + 1 < best) {
              setBest(moves + 1);
              try { localStorage.setItem('memory-best', String(moves + 1)); } catch { /* noop */ }
            }
          }
          return nm;
        });
        setFlipped([]);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setFlipped([]);
        }, 800);
      }
    }
  }, [flipped, cards, moves, best]);

  const handleClick = (i) => {
    if (cards[i].flipped || cards[i].matched || flipped.length === 2) return;
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, flipped: true } : c)));
    setFlipped((prev) => [...prev, i]);
  };

  const restart = () => {
    setCards(makeCards());
    setFlipped([]);
    setMatched(0);
    setMoves(0);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="game-back-btn" onClick={onExit}>← Juegos</button>
        <div className="game-scores">
          <span className="game-score">Movimientos: <strong>{moves}</strong></span>
          {best > 0 && <span className="game-best">Mejor: <strong>{best}</strong></span>}
        </div>
      </div>
      <div className="game-title-wrap">
        <h3 className="game-title">🧠 Memoria</h3>
        <p className="game-subtitle">Encuentra todas las parejas de símbolos matemáticos</p>
      </div>
      <div className="memory-grid">
        {cards.map((card, i) => (
          <button
            key={card.id}
            className={`memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleClick(i)}
            disabled={card.matched}
          >
            <span className="memory-card-inner">{card.emoji}</span>
          </button>
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <p>¡Lo lograste!</p>
          <p className="game-over-score">{moves} movimientos</p>
        </div>
      )}
      <div className="game-controls">
        <button className="game-btn" onClick={restart}>Reiniciar</button>
      </div>
    </div>
  );
}
