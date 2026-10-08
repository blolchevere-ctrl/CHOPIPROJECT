import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const SPEED = 150;

export default function SnakeGame({ onExit }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem('snake-best') || '0', 10); } catch { return 0; }
  });
  const dirRef = useRef(dir);
  const nextDirRef = useRef(dir);

  useEffect(() => { dirRef.current = dir; }, [dir]);

  const placeFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      const k = e.key;
      const d = dirRef.current;
      if ((k === 'ArrowUp' || k === 'w') && d.y === 0) nextDirRef.current = { x: 0, y: -1 };
      else if ((k === 'ArrowDown' || k === 's') && d.y === 0) nextDirRef.current = { x: 0, y: 1 };
      else if ((k === 'ArrowLeft' || k === 'a') && d.x === 0) nextDirRef.current = { x: -1, y: 0 };
      else if ((k === 'ArrowRight' || k === 'd') && d.x === 0) nextDirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setDir(nextDirRef.current);
      setSnake((prev) => {
        const newDir = nextDirRef.current;
        const head = { x: prev[0].x + newDir.x, y: prev[0].y + newDir.y };
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const ns = s + 10;
            return ns;
          });
          setFood(placeFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [running, gameOver, food, placeFood]);

  useEffect(() => {
    if (gameOver && score > best) {
      setBest(score);
      try { localStorage.setItem('snake-best', String(score)); } catch { /* noop */ }
    }
  }, [gameOver, score, best]);

  const start = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 10 });
    setDir({ x: 1, y: 0 });
    nextDirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  const setMobileDir = (d) => {
    const cur = dirRef.current;
    if (d === 'up' && cur.y === 0) nextDirRef.current = { x: 0, y: -1 };
    if (d === 'down' && cur.y === 0) nextDirRef.current = { x: 0, y: 1 };
    if (d === 'left' && cur.x === 0) nextDirRef.current = { x: -1, y: 0 };
    if (d === 'right' && cur.x === 0) nextDirRef.current = { x: 1, y: 0 };
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
        <h3 className="game-title">🐍 Snake</h3>
        <p className="game-subtitle">Come la comida sin chocar con los bordes ni contigo mismo</p>
      </div>
      <div className="snake-board" style={{ '--gs': GRID_SIZE }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return <div key={i} className={`snake-cell ${isHead ? 'snake-head' : isSnake ? 'snake-body' : ''} ${isFood ? 'snake-food' : ''}`} />;
        })}
      </div>
      {gameOver && <div className="game-over"><p>¡Game Over!</p><p className="game-over-score">{score} puntos</p></div>}
      {!running && !gameOver && <div className="game-pause-overlay"><p>Presiona iniciar</p></div>}
      <div className="game-controls">
        <button className="game-btn" onClick={start}>{gameOver ? 'Reiniciar' : 'Iniciar'}</button>
        {running && <button className="game-btn game-btn-pause" onClick={() => setRunning(false)}>Pausar</button>}
      </div>
      <div className="snake-mobile-controls">
        <button className="snake-dir-btn" onClick={() => setMobileDir('up')}>↑</button>
        <div className="snake-dir-row">
          <button className="snake-dir-btn" onClick={() => setMobileDir('left')}>←</button>
          <button className="snake-dir-btn" onClick={() => setMobileDir('down')}>↓</button>
          <button className="snake-dir-btn" onClick={() => setMobileDir('right')}>→</button>
        </div>
      </div>
    </div>
  );
}
