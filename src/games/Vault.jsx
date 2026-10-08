import { useState } from 'react';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import Game2048 from './Game2048';
import MemoryGame from './MemoryGame';
import ProblemsGame from './ProblemsGame';
import MaterialsSection from './MaterialsSection';

const GAMES = [
  { id: 'snake', title: 'Snake', emoji: '🐍', description: 'Come y crece sin chocar', color: '#34d399' },
  { id: 'tetris', title: 'Tetris', emoji: '🟦', description: 'Encaja las piezas', color: '#60a5fa' },
  { id: '2048', title: '2048', emoji: '🔢', description: 'Combina números hasta 2048', color: '#f59e0b' },
  { id: 'memory', title: 'Memoria', emoji: '🧠', description: 'Encuentra las parejas', color: '#f472b6' },
];

export default function Vault({ goHome, activeUni }) {
  const [section, setSection] = useState(null); // null = menu, 'games' = game list, 'problems', 'materials', or a game id
  const [activeGame, setActiveGame] = useState(null);

  const handleExitGame = () => {
    setActiveGame(null);
    setSection('games');
  };

  // ===== GAME VIEW =====
  if (activeGame === 'snake') return <SnakeGame onExit={handleExitGame} />;
  if (activeGame === 'tetris') return <TetrisGame onExit={handleExitGame} />;
  if (activeGame === '2048') return <Game2048 onExit={handleExitGame} />;
  if (activeGame === 'memory') return <MemoryGame onExit={handleExitGame} />;

  // ===== PROBLEMS VIEW =====
  if (section === 'problems') return <ProblemsGame onExit={() => setSection(null)} activeUni={activeUni} />;

  // ===== MATERIALS VIEW =====
  if (section === 'materials') return <MaterialsSection onExit={() => setSection(null)} />;

  // ===== GAMES LIST VIEW =====
  if (section === 'games') {
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={() => setSection(null)}>← Volver</button>
        </div>
        <div className="game-title-wrap">
          <h3 className="game-title">🎮 Juegos</h3>
          <p className="game-subtitle">Relájate con estos clásicos mientras aprendes</p>
        </div>
        <div className="games-grid">
          {GAMES.map((game) => (
            <button key={game.id} className="game-card" style={{ '--gc': game.color }} onClick={() => setActiveGame(game.id)}>
              <span className="game-card-emoji">{game.emoji}</span>
              <span className="game-card-title">{game.title}</span>
              <span className="game-card-desc">{game.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== MAIN VAULT MENU =====
  return (
    <div className="vault-menu-container">
      <header className="sub-header">
        <button className="back-btn" onClick={goHome}><span>←</span> Volver</button>
        <div className="sub-title">
          <span className="sub-eyebrow">ZONA DE APRENDIZAJE</span>
          <h2>Elige tu aventura</h2>
        </div>
      </header>
      <div className="vault-menu-body">
        <div className="vault-options">
          <button className="vault-option vault-games" onClick={() => setSection('games')}>
            <div className="vault-option-icon">🎮</div>
            <div className="vault-option-content">
              <span className="vault-option-title">Juegos</span>
              <span className="vault-option-desc">Snake, Tetris, 2048 y Memoria</span>
            </div>
            <span className="vault-option-arrow">→</span>
          </button>

          <button className="vault-option vault-materials" onClick={() => setSection('materials')}>
            <div className="vault-option-icon">📚</div>
            <div className="vault-option-content">
              <span className="vault-option-title">Material Académico</span>
              <span className="vault-option-desc">Resúmenes, guías y fórmulas</span>
            </div>
            <span className="vault-option-arrow">→</span>
          </button>

          <button className="vault-option vault-problems" onClick={() => setSection('problems')}>
            <div className="vault-option-icon">🎯</div>
            <div className="vault-option-content">
              <span className="vault-option-title">Problemas Interactivos</span>
              <span className="vault-option-desc">Sortea un tema, responde y gira la ruleta de premios</span>
            </div>
            <span className="vault-option-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
