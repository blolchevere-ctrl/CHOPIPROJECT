import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { courses } from '../data/courses';

const TEACHER_PASSWORD = 'chopi2024';
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-material`;
const STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/materials`;

export default function MaterialsSection({ onExit }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Teacher upload state
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  const [teacherPwd, setTeacherPwd] = useState('');
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  // Upload form
  const [uploadCourse, setUploadCourse] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadPrice, setUploadPrice] = useState(1);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('materials')
      .select('id, course_id, category_id, title, description, price, file_path, file_type, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setMaterials(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadMaterials(); }, [loadMaterials]);

  const materialsByCourse = (courseId) => materials.filter((m) => m.course_id === courseId);
  const materialsByCategory = (courseId, categoryId) => materials.filter((m) => m.course_id === courseId && m.category_id === categoryId);

  const handleTeacherLogin = () => {
    if (teacherPwd === TEACHER_PASSWORD) {
      setTeacherAuthed(true);
      setTeacherError('');
    } else {
      setTeacherError('Contraseña incorrecta');
    }
  };

  const handleUpload = async () => {
    setUploadError('');
    setUploadSuccess('');
    if (!uploadCourse || !uploadCategory || !uploadTitle || !uploadFile) {
      setUploadError('Completa todos los campos y selecciona un archivo');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('password', TEACHER_PASSWORD);
      formData.append('courseId', uploadCourse);
      formData.append('categoryId', uploadCategory);
      formData.append('title', uploadTitle);
      formData.append('description', uploadDesc);
      formData.append('price', String(uploadPrice));
      formData.append('file', uploadFile);

      const response = await fetch(EDGE_FUNCTION_URL, { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) {
        setUploadError(result.error || 'No se pudo subir el material');
      } else {
        setUploadSuccess('Material subido correctamente');
        setUploadTitle('');
        setUploadDesc('');
        setUploadFile(null);
        setUploadPrice(1);
        loadMaterials();
        setTimeout(() => setUploadSuccess(''), 3000);
      }
    } catch (err) {
      setUploadError('Error de conexión: ' + err.message);
    }
    setUploading(false);
  };

  const handleDelete = async (materialId, filePath) => {
    if (!confirm('¿Eliminar este material?')) return;
    try {
      const url = `${EDGE_FUNCTION_URL}?id=${materialId}&password=${TEACHER_PASSWORD}`;
      const response = await fetch(url, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'No se pudo eliminar');
      } else {
        loadMaterials();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getFileUrl = (filePath) => `${STORAGE_URL}/${filePath}`;

  const formatPrice = (price) => `S/ ${price}`;

  const selectedUploadCategories = courses.find((c) => c.id === uploadCourse)?.categories || [];

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="game-back-btn" onClick={onExit}>← Volver</button>
        <button className="teacher-upload-toggle" onClick={() => setShowTeacherPanel((v) => !v)}>
          {teacherAuthed ? 'cerrar panel' : '🔒 Subir material'}
        </button>
      </div>
      <div className="game-title-wrap">
        <h3 className="game-title">📚 Material Académico</h3>
        <p className="game-subtitle">Resúmenes, guías y fórmulas para reforzar tu aprendizaje</p>
      </div>

      {/* TEACHER UPLOAD PANEL */}
      {showTeacherPanel && (
        <div className="upload-panel">
          {!teacherAuthed ? (
            <div className="upload-login">
              <p className="upload-login-hint">Ingresa la contraseña del profesor para subir materiales</p>
              <input
                className="form-input upload-pwd-input"
                type="password"
                placeholder="Contraseña"
                value={teacherPwd}
                onChange={(e) => setTeacherPwd(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTeacherLogin(); }}
              />
              {teacherError && <div className="upload-error">{teacherError}</div>}
              <button className="game-btn" onClick={handleTeacherLogin}>Entrar</button>
            </div>
          ) : (
            <div className="upload-form">
              <h4 className="upload-form-title">Subir nuevo material</h4>
              <div className="upload-field">
                <label className="upload-label">Curso</label>
                <select className="upload-select" value={uploadCourse} onChange={(e) => { setUploadCourse(e.target.value); setUploadCategory(''); }}>
                  <option value="">Selecciona un curso</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="upload-field">
                <label className="upload-label">Categoría</label>
                <select className="upload-select" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} disabled={!uploadCourse}>
                  <option value="">Selecciona una categoría</option>
                  {selectedUploadCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                </select>
              </div>
              <div className="upload-field">
                <label className="upload-label">Título del material</label>
                <input className="form-input upload-text-input" type="text" placeholder="Ej: Resumen de Factorización" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} maxLength={100} />
              </div>
              <div className="upload-field">
                <label className="upload-label">Descripción (opcional)</label>
                <input className="form-input upload-text-input" type="text" placeholder="Breve descripción del contenido" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} maxLength={200} />
              </div>
              <div className="upload-field">
                <label className="upload-label">Precio</label>
                <div className="price-options">
                  {[1, 2, 5].map((p) => (
                    <button key={p} className={`price-pill ${uploadPrice === p ? 'active' : ''}`} onClick={() => setUploadPrice(p)}>S/ {p}</button>
                  ))}
                </div>
              </div>
              <div className="upload-field">
                <label className="upload-label">Archivo (PDF, imagen, etc.)</label>
                <input className="upload-file-input" type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx" />
              </div>
              {uploadError && <div className="upload-error">{uploadError}</div>}
              {uploadSuccess && <div className="upload-success">{uploadSuccess}</div>}
              <button className="game-btn upload-submit-btn" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Subiendo...' : 'Subir material'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MATERIALS CATALOG */}
      {loading ? (
        <div className="materials-loading">Cargando materiales...</div>
      ) : !selectedCourse ? (
        <>
          <div className="course-grid">
            {courses.map((course) => {
              const matCount = materialsByCourse(course.id).length;
              return (
                <button key={course.id} className="course-card" style={{ '--cc': course.color }} onClick={() => { setSelectedCourse(course); setExpandedCategory(null); }}>
                  <span className="course-card-icon">{course.icon}</span>
                  <span className="course-card-label">{course.label}</span>
                  <span className="course-card-count">{matCount} {matCount === 1 ? 'material' : 'materiales'}</span>
                </button>
              );
            })}
          </div>
          {materials.length === 0 && (
            <div className="materials-empty">
              <p>Aún no hay materiales subidos.</p>
              {teacherAuthed && <p className="materials-empty-hint">Usa el panel de arriba para subir el primer material.</p>}
            </div>
          )}
        </>
      ) : (
        <div className="materials-list">
          <div className="materials-course-header" style={{ '--mc': selectedCourse.color }}>
            <span className="materials-course-icon">{selectedCourse.icon}</span>
            <span className="materials-course-name">{selectedCourse.label}</span>
            <button className="materials-change-btn" onClick={() => setSelectedCourse(null)}>Cambiar curso</button>
          </div>
          {selectedCourse.categories.map((cat) => {
            const mats = materialsByCategory(selectedCourse.id, cat.id);
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className={`materials-category ${isExpanded ? 'expanded' : ''}`}>
                <button className="materials-category-head" style={{ '--mc': selectedCourse.color }} onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}>
                  <span className="materials-category-title">{cat.title}</span>
                  <span className="materials-category-count">{mats.length} {mats.length === 1 ? 'recurso' : 'recursos'}</span>
                  <span className="materials-category-expand">{isExpanded ? '−' : '+'}</span>
                </button>
                {isExpanded && (
                  <div className="materials-items">
                    {mats.length === 0 ? (
                      <div className="materials-empty-cat">Sin materiales en esta categoría aún</div>
                    ) : (
                      mats.map((mat) => (
                        <div key={mat.id} className="material-item">
                          <span className="material-icon">📄</span>
                          <div className="material-info">
                            <span className="material-title">{mat.title}</span>
                            {mat.description && <span className="material-desc">{mat.description}</span>}
                            <span className="material-filetype">{mat.file_type.toUpperCase()}</span>
                          </div>
                          <span className="material-price">{formatPrice(mat.price)}</span>
                          <div className="material-actions">
                            <a className="material-download-btn" href={getFileUrl(mat.file_path)} target="_blank" rel="noreferrer" download>
                              Descargar
                            </a>
                            {teacherAuthed && (
                              <button className="material-delete-btn" onClick={() => handleDelete(mat.id, mat.file_path)}>
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
