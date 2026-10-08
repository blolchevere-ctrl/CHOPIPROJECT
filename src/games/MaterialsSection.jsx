import { useState } from 'react';
import { courses } from '../data/courses';

const MATERIALS = {
  'matematica': {
    'algebra': [
      { title: 'Resumen: Leyes de Exponentes', type: 'pdf', description: 'Fórmulas y ejemplos de leyes de exponentes' },
      { title: 'Guía: Factorización', type: 'pdf', description: 'Métodos de factorización con ejercicios resueltos' },
      { title: 'Fórmulas: Productos Notables', type: 'pdf', description: 'Todos los productos notables en una página' },
    ],
    'aritmetica': [
      { title: 'Resumen: MCD y MCM', type: 'pdf', description: 'Métodos para calcular MCD y MCM' },
      { title: 'Guía: Tanto por Ciento', type: 'pdf', description: 'Problemas de porcentajes paso a paso' },
    ],
    'geometria': [
      { title: 'Fórmulas: Áreas de Regiones Planas', type: 'pdf', description: 'Todas las fórmulas de área en un solo lugar' },
      { title: 'Resumen: Teorema de Pitágoras', type: 'pdf', description: 'Teoría y aplicaciones del teorema' },
    ],
    'trigonometria': [
      { title: 'Tabla: Razones Trigonométricas', type: 'pdf', description: 'Tabla de seno, coseno y tangente de ángulos notables' },
      { title: 'Resumen: Identidades Trigonométricas', type: 'pdf', description: 'Identidades fundamentales y derivadas' },
    ],
  },
  'fisica': {
    'clasica': [
      { title: 'Fórmulas: Cinemática', type: 'pdf', description: 'MRU, MRUV, Tiro Parabólico y MCU' },
      { title: 'Resumen: Leyes de Newton', type: 'pdf', description: 'Las tres leyes con ejemplos' },
      { title: 'Fórmulas: Trabajo y Energía', type: 'pdf', description: 'Trabajo, energía cinética y potencial' },
    ],
    'moderna': [
      { title: 'Resumen: Efecto Fotoeléctrico', type: 'pdf', description: 'Teoría y fórmulas del efecto fotoeléctrico' },
      { title: 'Fórmulas: Relatividad Especial', type: 'pdf', description: 'Dilatación del tiempo y contracción de longitud' },
    ],
  },
  'quimica': {
    'inorganica': [
      { title: 'Tabla Periódica Interactiva', type: 'pdf', description: 'Tabla periódica con propiedades principales' },
      { title: 'Guía: Nomenclatura IUPAC', type: 'pdf', description: 'Reglas de nomenclatura inorgánica' },
      { title: 'Resumen: Reacciones Redox', type: 'pdf', description: 'Óxido-reducción con ejemplos' },
    ],
    'organica': [
      { title: 'Guía: Grupos Funcionales', type: 'pdf', description: 'Identificación de grupos funcionales orgánicos' },
      { title: 'Resumen: Hidrocarburos', type: 'pdf', description: 'Alcanos, alquenos, alquinos y aromáticos' },
    ],
  },
  'estadistica': {
    'descriptiva': [
      { title: 'Fórmulas: Medidas de Tendencia Central', type: 'pdf', description: 'Media, mediana y moda' },
      { title: 'Guía: Tablas de Frecuencia', type: 'pdf', description: 'Construcción paso a paso' },
    ],
    'inferencial': [
      { title: 'Resumen: Probabilidad Básica', type: 'pdf', description: 'Regla de Laplace y probabilidad condicional' },
      { title: 'Fórmulas: Distribución Normal', type: 'pdf', description: 'La campana de Gauss y sus propiedades' },
    ],
  },
};

export default function MaterialsSection({ onExit }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const courseMaterials = selectedCourse ? MATERIALS[selectedCourse.id] || {} : {};

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="game-back-btn" onClick={onExit}>← Volver</button>
      </div>
      <div className="game-title-wrap">
        <h3 className="game-title">📚 Material Académico</h3>
        <p className="game-subtitle">Resúmenes, guías y fórmulas para reforzar tu aprendizaje</p>
      </div>

      {!selectedCourse ? (
        <div className="course-grid">
          {courses.map((course) => {
            const matCount = Object.values(MATERIALS[course.id] || {}).reduce((s, items) => s + items.length, 0);
            return (
              <button key={course.id} className="course-card" style={{ '--cc': course.color }} onClick={() => { setSelectedCourse(course); setExpandedCategory(null); }}>
                <span className="course-card-icon">{course.icon}</span>
                <span className="course-card-label">{course.label}</span>
                <span className="course-card-count">{matCount} materiales</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="materials-list">
          <div className="materials-course-header" style={{ '--mc': selectedCourse.color }}>
            <span className="materials-course-icon">{selectedCourse.icon}</span>
            <span className="materials-course-name">{selectedCourse.label}</span>
            <button className="materials-change-btn" onClick={() => setSelectedCourse(null)}>Cambiar curso</button>
          </div>
          {selectedCourse.categories.map((cat) => {
            const mats = courseMaterials[cat.id] || [];
            if (mats.length === 0) return null;
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className={`materials-category ${isExpanded ? 'expanded' : ''}`}>
                <button className="materials-category-head" style={{ '--mc': selectedCourse.color }} onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}>
                  <span className="materials-category-title">{cat.title}</span>
                  <span className="materials-category-count">{mats.length} recursos</span>
                  <span className="materials-category-expand">{isExpanded ? '−' : '+'}</span>
                </button>
                {isExpanded && (
                  <div className="materials-items">
                    {mats.map((mat, i) => (
                      <div key={i} className="material-item">
                        <span className="material-icon">📄</span>
                        <div className="material-info">
                          <span className="material-title">{mat.title}</span>
                          <span className="material-desc">{mat.description}</span>
                        </div>
                        <span className="material-type">{mat.type.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="materials-note">
            <p>Próximamente podrás descargar todos los materiales en PDF.</p>
          </div>
        </div>
      )}
    </div>
  );
}
