import { useState, useEffect, useCallback, useRef } from 'react';

const BOARD_W = 10;
const BOARD_H = 20;
const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];
const COLORS = ['#a78bfa', '#60a5fa', '#f472b6', '#f59e0b', '#34d399', '#ef4444', '#06b6d4'];

function newPiece() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[idx];
  return { shape, color: COLORS[idx], x: Math.floor(BOARD_W / 2) - Math.floor(shape[0].length / 2), y: 0 };
}

function rotate(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = shape[r][c];
    }
  }
  return result;
}

function collides(piece, board) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const x = piece.x + c;
      const y = piece.y + r;
      if (x < 0 || x >= BOARD_W || y >= BOARD_H) return true;
      if (y >= 0 && board[y] && board[y][x]) return true;
    }
  }
  return false;
}

function merge(piece, board) {
  const newBoard = board.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] && piece.y + r >= 0) {
        newBoard[piece.y + r][piece.x + c] = piece.color;
      }
    }
  }
  return newBoard;
}

function clearLines(board) {
  let cleared = 0;
  const newBoard = board.filter((row) => {
    if (row.every((cell) => cell !== 0)) { cleared++; return false; }
    return true;
  });
  while (newBoard.length < BOARD_H) newBoard.unshift(Array(BOARD_W).fill(0));
  return { board: newBoard, cleared };
}

function emptyBoard() {
  return Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill(0));
}

export default function TetrisGame({ onExit }) {
  const [board, setBoard] = useState(emptyBoard);
  const [piece, setPiece] = useState(newPiece);
  const [nextPiece, setNextPiece] = useState(newPiece);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem('tetris-best') || '0', 10); } catch { return 0; }
  });
  const pieceRef = useRef(piece);
  const boardRef = useRef(board);
  const runningRef = useRef(running);
  useEffect(() => { pieceRef.current = piece; }, [piece]);
  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { runningRef.current = running; }, [running]);

  const drop = useCallback(() => {
    if (!runningRef.current) return;
    const p = pieceRef.current;
    const moved = { ...p, y: p.y + 1 };
    if (!collides(moved, boardRef.current)) {
      setPiece(moved);
    } else {
      const merged = merge(p, boardRef.current);
      const { board: clearedBoard, cleared } = clearLines(merged);
      if (cleared > 0) {
        setLines((l) => l + cleared);
        setScore((s) => s + [0, 100, 300, 500, 800][cleared] * level);
      }
      setBoard(clearedBoard);
      const np = nextPiece;
      setNextPiece(newPiece());
      if (collides(np, clearedBoard)) {
        setGameOver(true);
        setRunning(false);
      } else {
        setPiece(np);
      }
    }
  }, [nextPiece, level]);

  useEffect(() => {
    if (!running || gameOver) return;
    const speed = Math.max(100, 500 - (level - 1) * 50);
    const interval = setInterval(drop, speed);
    return () => clearInterval(interval);
  }, [running, gameOver, level, drop]);

  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1);
  }, [lines]);

  useEffect(() => {
    if (gameOver && score > best) {
      setBest(score);
      try { localStorage.setItem('tetris-best', String(score)); } catch { /* noop */ }
    }
  }, [gameOver, score, best]);

  const move = (dx) => {
    if (!running) return;
    const moved = { ...piece, x: piece.x + dx };
    if (!collides(moved, board)) setPiece(moved);
  };

  const doRotate = () => {
    if (!running) return;
    const rotated = { ...piece, shape: rotate(piece.shape) };
    if (!collides(rotated, board)) setPiece(rotated);
  };

  const hardDrop = () => {
    if (!running) return;
    let p = piece;
    while (!collides({ ...p, y: p.y + 1 }, board)) p = { ...p, y: p.y + 1 };
    setPiece(p);
  };

  const start = () => {
    setBoard(emptyBoard());
    setPiece(newPiece());
    setNextPiece(newPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setRunning(true);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!running) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); drop(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); doRotate(); }
      else if (e.key === ' ') { e.preventDefault(); hardDrop(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const displayBoard = board.map((row) => [...row]);
  if (running || gameOver) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] && piece.y + r >= 0 && piece.y + r < BOARD_H && piece.x + c >= 0 && piece.x + c < BOARD_W) {
          displayBoard[piece.y + r][piece.x + c] = piece.color;
        }
      }
    }
  }

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
        <h3 className="game-title">🟦 Tetris</h3>
        <p className="game-subtitle">Encaja las piezas y completa líneas</p>
      </div>
      <div className="tetris-layout">
        <div className="tetris-board" style={{ '--bw': BOARD_W, '--bh': BOARD_H }}>
          {displayBoard.flatMap((row, y) => row.map((cell, x) => (
            <div key={`${y}-${x}`} className="tetris-cell" style={cell ? { background: cell, boxShadow: `inset 0 0 0 1px rgba(255,255,255,.2)` } : undefined} />
          )))}
        </div>
        <div className="tetris-sidebar">
          <div className="tetris-next">
            <span className="tetris-next-label">Siguiente</span>
            <div className="tetris-next-grid">
              {nextPiece.shape.flatMap((row, r) => row.map((cell, c) => (
                <div key={`n-${r}-${c}`} className="tetris-next-cell" style={cell ? { background: nextPiece.color } : undefined} />
              )))}
            </div>
          </div>
          <div className="tetris-stats">
            <div><span>Nivel</span><strong>{level}</strong></div>
            <div><span>Líneas</span><strong>{lines}</strong></div>
          </div>
        </div>
      </div>
      {gameOver && <div className="game-over"><p>¡Game Over!</p><p className="game-over-score">{score} puntos</p></div>}
      <div className="game-controls">
        <button className="game-btn" onClick={start}>{gameOver ? 'Reiniciar' : 'Iniciar'}</button>
        {running && <button className="game-btn game-btn-pause" onClick={() => setRunning(false)}>Pausar</button>}
      </div>
      <div className="tetris-mobile-controls">
        <button className="snake-dir-btn" onClick={doRotate}>⟳</button>
        <div className="snake-dir-row">
          <button className="snake-dir-btn" onClick={() => move(-1)}>←</button>
          <button className="snake-dir-btn" onClick={hardDrop}>↓</button>
          <button className="snake-dir-btn" onClick={() => move(1)}>→</button>
        </div>
      </div>
    </div>
  );
}
