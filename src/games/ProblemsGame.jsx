import { useState, useEffect, useRef } from 'react';
import { courses } from '../data/courses';
import { getProblemForTopic } from '../data/problems';

// Prize segments for the roulette
const PRIZES = [
  { id: 'free-class', label: '¡Clase Gratis!', color: '#fbbf24', probability: 1, icon: '🎁' },
  { id: 'discount-10', label: '10% Descuento', color: '#60a5fa', probability: 5, icon: '🏷️' },
  { id: 'discount-15', label: '15% Descuento', color: '#34d399', probability: 5, icon: '🏷️' },
  { id: 'free-material', label: '¡Material Gratis!', color: '#a78bfa', probability: 8, icon: '📚' },
  { id: 'try-again', label: 'Vuelve a intentarlo', color: '#64748b', probability: 81, icon: '🔄' },
];

// Build weighted segments for roulette display (more segments = better visual)
function buildRouletteSegments() {
  const segments = [];
  PRIZES.forEach((prize) => {
    const count = Math.max(1, Math.round(prize.probability * 0.8));
    for (let i = 0; i < count; i++) {
      segments.push(prize);
    }
  });
  return segments;
}

const ROULETTE_SEGMENTS = buildRouletteSegments();

function pickPrize() {
  const total = PRIZES.reduce((sum, p) => sum + p.probability, 0);
  let r = Math.random() * total;
  for (const prize of PRIZES) {
    if (r < prize.probability) return prize;
    r -= prize.probability;
  }
  return PRIZES[PRIZES.length - 1];
}

export default function ProblemsGame({ onExit, activeUni }) {
  const [phase, setPhase] = useState('menu'); // menu → course → draw → problem → roulette → result
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [drawCards, setDrawCards] = useState([]);
  const [drawnTopic, setDrawnTopic] = useState(null);
  const [problem, setProblem] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [prize, setPrize] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);
  const [prizeHistory, setPrizeHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('prize-history') || '[]'); } catch { return []; }
  });
  const drawTimerRef = useRef(null);

  const selectCourse = (course) => {
    setSelectedCourse(course);
    const cats = course.categories;
    setCategories(cats);
    const topics = [];
    cats.forEach((cat) => {
      cat.topics.forEach((topic) => {
        topics.push({ title: topic.title, categoryId: cat.id, categoryTitle: cat.title });
      });
    });
    setAllTopics(topics);
    setPhase('course');
  };

  const startDraw = () => {
    setPhase('draw');
    setDrawnTopic(null);
    // Pick 5 random topic cards for the visual
    const shuffled = [...allTopics].sort(() => Math.random() - 0.5);
    const cards = shuffled.slice(0, Math.min(5, shuffled.length));
    setDrawCards(cards);
    // Animate the draw
    let cycles = 0;
    const maxCycles = 12 + Math.floor(Math.random() * 5);
    const interval = setInterval(() => {
      cycles++;
      if (cycles >= maxCycles) {
        clearInterval(interval);
        const finalTopic = cards[Math.floor(Math.random() * cards.length)];
        setDrawnTopic(finalTopic);
        setTimeout(() => {
          const prob = getProblemForTopic(selectedCourse.id, finalTopic.categoryId, finalTopic.title);
          setProblem(prob);
          setSelectedAnswer(null);
          setAnswered(false);
          setIsCorrect(false);
          setPhase('problem');
        }, 800);
      }
    }, 180);
    drawTimerRef.current = interval;
  };

  useEffect(() => {
    return () => { if (drawTimerRef.current) clearInterval(drawTimerRef.current); };
  }, []);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    const correct = idx === problem.answer;
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => startRoulette(), 1500);
    }
  };

  const startRoulette = () => {
    setPhase('roulette');
    setPrize(null);
    setShowPrize(false);
    setSpinning(false);
  };

  const spinRoulette = () => {
    if (spinning) return;
    const winningPrize = pickPrize();
    setSpinning(true);
    // Find a segment index that matches the prize
    const matchingIndices = ROULETTE_SEGMENTS.map((s, i) => s.id === winningPrize.id ? i : -1).filter((i) => i >= 0);
    const targetIdx = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
    const segAngle = 360 / ROULETTE_SEGMENTS.length;
    // We want the target segment to land at the top (pointer position)
    const targetAngle = 360 - (targetIdx * segAngle) - segAngle / 2;
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation - (rotation % 360) + fullSpins * 360 + targetAngle;
    setRotation(finalRotation);
    setTimeout(() => {
      setSpinning(false);
      setPrize(winningPrize);
      setShowPrize(true);
      // Save to history
      const entry = { prize: winningPrize.label, icon: winningPrize.icon, date: new Date().toISOString() };
      const newHistory = [entry, ...prizeHistory].slice(0, 10);
      setPrizeHistory(newHistory);
      try { localStorage.setItem('prize-history', JSON.stringify(newHistory)); } catch { /* noop */ }
      setTimeout(() => setPhase('result'), 1000);
    }, 4000);
  };

  const playAgain = () => {
    setPhase('course');
    setProblem(null);
    setSelectedAnswer(null);
    setAnswered(false);
    setIsCorrect(false);
    setPrize(null);
    setShowPrize(false);
  };

  const backToCourseSelect = () => {
    setPhase('menu');
    setSelectedCourse(null);
    setCategories([]);
    setAllTopics([]);
  };

  // ===== MENU PHASE: Select a course =====
  if (phase === 'menu') {
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={onExit}>← Volver</button>
        </div>
        <div className="game-title-wrap">
          <h3 className="game-title">🎯 Problemas Interactivos</h3>
          <p className="game-subtitle">Elige un curso, saca un tema al azar y responde correctamente para girar la ruleta de premios</p>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <button key={course.id} className="course-card" style={{ '--cc': course.color }} onClick={() => selectCourse(course)}>
              <span className="course-card-icon">{course.icon}</span>
              <span className="course-card-label">{course.label}</span>
              <span className="course-card-count">{course.categories.reduce((s, c) => s + c.topics.length, 0)} temas</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== COURSE PHASE: Show categories and topics =====
  if (phase === 'course') {
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={backToCourseSelect}>← Cursos</button>
        </div>
        <div className="game-title-wrap">
          <h3 className="game-title" style={{ color: selectedCourse.color }}>{selectedCourse.icon} {selectedCourse.label}</h3>
          <p className="game-subtitle">Presiona el botón para realizar el sorteo de un tema al azar</p>
        </div>
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat.id} className="category-info-card">
              <span className="category-info-title">{cat.title}</span>
              <span className="category-info-topics">{cat.topics.length} subtemas</span>
            </div>
          ))}
        </div>
        <button className="draw-btn" onClick={startDraw}>
          <span className="draw-btn-icon">🎴</span>
          <span className="draw-btn-text">¡Sortear tema!</span>
        </button>
      </div>
    );
  }

  // ===== DRAW PHASE: Card deck animation =====
  if (phase === 'draw') {
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={() => { if (drawTimerRef.current) clearInterval(drawTimerRef.current); setPhase('course'); }}>← Cancelar</button>
        </div>
        <div className="game-title-wrap">
          <h3 className="game-title">🎴 Sorteando tema...</h3>
          <p className="game-subtitle">{selectedCourse.label} · {selectedCourse.icon}</p>
        </div>
        <div className="card-deck-area">
          <div className="card-deck">
            {drawCards.map((topic, i) => {
              const isHighlighted = !drawnTopic && i === Math.floor((Date.now() / 180) % drawCards.length);
              const isDrawn = drawnTopic && drawnTopic.title === topic.title;
              return (
                <div
                  key={i}
                  className={`deck-card ${isHighlighted ? 'highlighted' : ''} ${isDrawn ? 'drawn' : ''} ${drawnTopic && !isDrawn ? 'faded' : ''}`}
                  style={{ '--card-delay': `${i * 0.1}s`, transform: `translateX(${i * 4}px) translateY(${i * 2}px)` }}
                >
                  <div className="deck-card-back">
                    <span className="deck-card-icon">{selectedCourse.icon}</span>
                    <span className="deck-card-label">{selectedCourse.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {drawnTopic && (
            <div className="drawn-topic-banner">
              <span className="drawn-topic-kicker">Tema sorteado</span>
              <span className="drawn-topic-title">{drawnTopic.title}</span>
              <span className="drawn-topic-cat">{drawnTopic.categoryTitle}</span>
            </div>
          )}
          {!drawnTopic && (
            <div className="draw-shuffle-text">
              <span className="draw-shuffle-label">Barajando...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== PROBLEM PHASE: Show the question =====
  if (phase === 'problem' && problem) {
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={backToCourseSelect}>← Salir</button>
        </div>
        <div className="game-title-wrap">
          <h3 className="game-title" style={{ color: selectedCourse.color }}>{selectedCourse.icon} {selectedCourse.label}</h3>
          <p className="game-subtitle">{drawnTopic.categoryTitle} · {drawnTopic.title}</p>
        </div>
        <div className="problem-card">
          <div className="problem-question">{problem.question}</div>
          <div className="problem-options">
            {problem.options.map((opt, idx) => {
              let cls = 'problem-option';
              if (answered) {
                if (idx === problem.answer) cls += ' correct';
                else if (idx === selectedAnswer) cls += ' wrong';
                else cls += ' disabled';
              }
              return (
                <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={answered}>
                  <span className="problem-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="problem-option-text">{opt}</span>
                  {answered && idx === problem.answer && <span className="problem-option-check">✓</span>}
                  {answered && idx === selectedAnswer && idx !== problem.answer && <span className="problem-option-x">✗</span>}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className={`problem-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎉</span>
                  <span className="feedback-text">¡Correcto! Prepárate para girar la ruleta...</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">❌</span>
                  <span className="feedback-text">Incorrecto. {problem.explanation}</span>
                  <button className="feedback-retry" onClick={playAgain}>Intentar otro tema</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== ROULETTE PHASE =====
  if (phase === 'roulette') {
    const segAngle = 360 / ROULETTE_SEGMENTS.length;
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={backToCourseSelect}>← Salir</button>
        </div>
        <div className="game-title-wrap">
          <h3 className="game-title">🎰 Ruleta de Premios</h3>
          <p className="game-subtitle">¡Gira para ver qué premio te toca!</p>
        </div>
        <div className="roulette-area">
          <div className="roulette-pointer">▼</div>
          <div className="roulette-wheel" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(.17,.67,.34,1)' : 'none' }}>
            {ROULETTE_SEGMENTS.map((seg, i) => {
              const angle = i * segAngle;
              return (
                <div
                  key={i}
                  className="roulette-segment"
                  style={{
                    background: seg.color,
                    transform: `rotate(${angle}deg)`,
                    clipPath: `polygon(50% 50%, ${50 - 35 * Math.sin((segAngle * Math.PI) / 180)}% ${50 - 35 * Math.cos((segAngle * Math.PI) / 180)}%, ${50 + 35 * Math.sin((segAngle * Math.PI) / 180)}% ${50 - 35 * Math.cos((segAngle * Math.PI) / 180)}%)`,
                  }}
                >
                  <span className="roulette-segment-label" style={{ transform: `rotate(${segAngle / 2}deg)` }}>
                    {seg.icon}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="roulette-center">🎲</div>
        </div>
        {!spinning && !showPrize && (
          <button className="spin-btn" onClick={spinRoulette}>
            <span>🎲 Girar la ruleta</span>
          </button>
        )}
        {spinning && <div className="spinning-text">Girando...</div>}
      </div>
    );
  }

  // ===== RESULT PHASE =====
  if (phase === 'result') {
    const isWin = prize && prize.id !== 'try-again';
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={backToCourseSelect}>← Cursos</button>
        </div>
        <div className="result-area">
          <div className={`result-card ${isWin ? 'win' : 'try-again'}`} style={isWin ? { '--prize-color': prize.color } : undefined}>
            <span className="result-icon">{prize.icon}</span>
            <h3 className="result-title">{isWin ? '¡Felicidades!' : '¡Casi!'}</h3>
            <p className="result-prize">{prize.label}</p>
            {isWin && (
              <p className="result-instructions">
                {prize.id === 'free-class' && 'Has ganado una clase gratuita. Escríbenos por WhatsApp para reclamarla.'}
                {prize.id === 'discount-10' && 'Has ganado un 10% de descuento en tu próxima clase. Menciónalo al coordinar.'}
                {prize.id === 'discount-15' && 'Has ganado un 15% de descuento en tu próxima clase. Menciónalo al coordinar.'}
                {prize.id === 'free-material' && 'Has ganado material de estudio gratis. Escríbenos por WhatsApp para recibirlo.'}
              </p>
            )}
            {!isWin && (
              <p className="result-instructions">No te rindas, ¡sigue practicando e inténtalo de nuevo!</p>
            )}
          </div>
          <button className="game-btn" onClick={playAgain}>Jugar otro tema</button>
          <button className="game-btn game-btn-secondary" onClick={backToCourseSelect}>Cambiar de curso</button>
        </div>
        {prizeHistory.length > 0 && (
          <div className="prize-history">
            <span className="prize-history-title">Premios recientes</span>
            <div className="prize-history-list">
              {prizeHistory.slice(0, 5).map((entry, i) => (
                <div key={i} className="prize-history-item">
                  <span>{entry.icon}</span>
                  <span>{entry.prize}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="game-container">
      <div className="game-title-wrap">
        <h3 className="game-title">Cargando...</h3>
      </div>
      <button className="game-btn" onClick={backToCourseSelect}>Volver</button>
    </div>
  );
}
