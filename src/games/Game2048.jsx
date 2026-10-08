import { useState, useEffect, useCallback } from 'react';

const SIZE = 4;

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandomTile(grid) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return grid;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map((row) => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function slideRow(row) {
  let arr = row.filter((v) => v !== 0);
  let gained = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      gained += arr[i];
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < SIZE) arr.push(0);
  return { row: arr, gained };
}

function rotateGrid(grid) {
  const result = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      result[c][SIZE - 1 - r] = grid[r][c];
    }
  }
  return result;
}

function gridsEqual(a, b) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function move(grid, dir) {
  let g = grid.map((row) => [...row]);
  const rotations = { left: 0, up: 1, right: 2, down: 3 };
  for (let i = 0; i < rotations[dir]; i++) g = rotateGrid(g);
  let gained = 0;
  g = g.map((row) => {
    const { row: newRow, gained: g2 } = slideRow(row);
    gained += g2;
    return newRow;
  });
  for (let i = 0; i < (4 - rotations[dir]) % 4; i++) g = rotateGrid(g);
  return { grid: g, gained, moved: !gridsEqual(grid, g) };
}

function canMove(grid) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

const TILE_COLORS = {
  2: { bg: '#eee4da', color: '#776e65' },
  4: { bg: '#ede0c8', color: '#776e65' },
  8: { bg: '#f2b179', color: '#fff' },
  16: { bg: '#f59563', color: '#fff' },
  32: { bg: '#f67c5f', color: '#fff' },
  64: { bg: '#f65e3b', color: '#fff' },
  128: { bg: '#edcf72', color: '#fff' },
  256: { bg: '#edcc61', color: '#fff' },
  512: { bg: '#edc850', color: '#fff' },
  1024: { bg: '#edc53f', color: '#fff' },
  2048: { bg: '#edc22e', color: '#fff' },
};

export default function Game2048({ onExit }) {
  const [grid, setGrid] = useState(() => addRandomTile(addRandomTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem('2048-best') || '0', 10); } catch { return 0; }
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const doMove = useCallback((dir) => {
    if (gameOver) return;
    setGrid((prev) => {
      const { grid: newGrid, gained, moved } = move(prev, dir);
      if (!moved) return prev;
      const withTile = addRandomTile(newGrid);
      setScore((s) => {
        const ns = s + gained;
        if (ns > best) {
          setBest(ns);
          try { localStorage.setItem('2048-best', String(ns)); } catch { /* noop */ }
        }
        return ns;
      });
      if (!won && withTile.some((row) => row.includes(2048))) setWon(true);
      if (!canMove(withTile)) setGameOver(true);
      return withTile;
    });
  }, [gameOver, best, won]);

  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); doMove(dir); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [doMove]);

  const restart = () => {
    setGrid(addRandomTile(addRandomTile(emptyGrid())));
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="game-back-btn" onClick={onExit}>← Juegos</button>
        <div className="game-scores">
          <span className="game-score">Puntos: <strong>{score}</strong></span>
          <span className="game-best">Récord: <strong>{best}</strong></span>
        </div>
      </div>
      <div className="game-title-wrap">
        <h3 className="game-title">🔢 2048</h3>
        <p className="game-subtitle">Desliza las casillas para llegar a 2048</p>
      </div>
      <div className="g2048-board" style={{ '--sz': SIZE }}>
        {grid.flatMap((row, r) => row.map((val, c) => {
          const tc = TILE_COLORS[val] || { bg: '#edc22e', color: '#fff' };
          return (
            <div key={`${r}-${c}`} className={`g2048-cell ${val ? 'g2048-filled' : ''}`} style={val ? { background: tc.bg, color: tc.color } : undefined}>
              {val || ''}
            </div>
          );
        }))}
      </div>
      {(gameOver || won) && (
        <div className="game-over">
          <p>{won && !gameOver ? '¡Ganaste!' : '¡Game Over!'}</p>
          <p className="game-over-score">{score} puntos</p>
          {won && !gameOver && <button className="game-btn" onClick={restart}>Seguir jugando</button>}
        </div>
      )}
      <div className="game-controls">
        <button className="game-btn" onClick={restart}>Reiniciar</button>
      </div>
      <div className="g2048-mobile-controls">
        <button className="snake-dir-btn" onClick={() => doMove('up')}>↑</button>
        <div className="snake-dir-row">
          <button className="snake-dir-btn" onClick={() => doMove('left')}>←</button>
          <button className="snake-dir-btn" onClick={() => doMove('down')}>↓</button>
          <button className="snake-dir-btn" onClick={() => doMove('right')}>→</button>
        </div>
      </div>
    </div>
  );
}
