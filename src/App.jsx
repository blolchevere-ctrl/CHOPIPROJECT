import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';

const branches = [
  { id: 'math', label: 'Matemática', icon: '∑', color: '#a78bfa', categories: [
    { id: 'algebra', title: 'Álgebra', topics: [
      { title: 'Leyes de Exponentes y Ecuaciones Exponenciales' },
      { title: 'Polinomios y Métodos de División (Horner/Ruffini)' },
      { title: 'Factorización y Productos Notables' },
      { title: 'Inecuaciones (1er/2do Grado y Puntos Críticos)' },
      { title: 'Valor Absoluto y Radicación' },
      { title: 'Números Complejos' },
      { title: 'Funciones y Logaritmos' },
    ]},
    { id: 'aritmetica', title: 'Aritmética', topics: [
      { title: 'Teoría de Conjuntos' },
      { title: 'Números Enteros y Divisibilidad (MCD y MCM)' },
      { title: 'Números Racionales y Decimales' },
      { title: 'Razones, Proporciones y Promedios' },
      { title: 'Magnitudes Proporcionales y Reparto' },
      { title: 'Tanto por Ciento' },
      { title: 'Regla de Tres (Simple y Compuesta)' },
      { title: 'Estadística Básica' },
    ]},
    { id: 'geometria', title: 'Geometría', topics: [
      { title: 'Segmentos y Ángulos' },
      { title: 'Triángulos y Congruencia' },
      { title: 'Polígonos y Cuadriláteros' },
      { title: 'Circunferencia' },
      { title: 'Proporcionalidad y Semejanza (Thales)' },
      { title: 'Relaciones Métricas y Pitágoras' },
      { title: 'Áreas de Regiones Planas' },
      { title: 'Geometría del Espacio y Poliedros' },
    ]},
    { id: 'trigonometria', title: 'Trigonometría', topics: [
      { title: 'Sistemas de Medición Angular y Sector Circular' },
      { title: 'Razones Trigonométricas de Ángulos Agudos' },
      { title: 'Razones de Ángulos en Posición Normal' },
      { title: 'Identidades Trigonométricas (Simples, Compuestas, Doble/Mitad)' },
      { title: 'Ecuaciones Trigonométricas' },
      { title: 'Resolución de Triángulos Oblicuángulos' },
    ]},
  ]},
  { id: 'fisica', label: 'Física', icon: '⚛', color: '#60a5fa', categories: [
    { id: 'clasica', title: 'Física Clásica', topics: [
      { title: 'Vectores y Análisis Dimensional' },
      { title: 'Cinemática (MRU, MRUV, Parabólico, MCU)' },
      { title: 'Dinámica y Leyes de Newton' },
      { title: 'Estática y DCL' },
      { title: 'Trabajo, Potencia y Energía Mecánica' },
      { title: 'Calorimetría y Cambios de Fase' },
      { title: 'Electromagnetismo (Campo Eléctrico, Circuitos, Campo Magnético)' },
      { title: 'Óptica (Reflexión, Refracción y Lentes)' },
    ]},
    { id: 'moderna', title: 'Física Moderna', topics: [
      { title: 'Radiación de Cuerpo Negro' },
      { title: 'Efecto Fotoeléctrico' },
      { title: 'Ondas de Materia' },
      { title: 'Relatividad Especial' },
      { title: 'Radiactividad y Física/Fisión Nuclear' },
    ]},
  ]},
  { id: 'quimica', label: 'Química', icon: '⚗', color: '#34d399', categories: [
    { id: 'inorganica', title: 'Química Inorgánica', topics: [
      { title: 'Materia y sus Propiedades' },
      { title: 'Estructura Atómica y Números Cuánticos' },
      { title: 'Tabla Periódica y Propiedades Periódicas' },
      { title: 'Enlace Químico (Iónico, Covalente, Intermolecular)' },
      { title: 'Nomenclatura Inorgánica IUPAC' },
      { title: 'Reacciones Químicas y Redox' },
      { title: 'Unidades Químicas de Masa y Estequiometría' },
      { title: 'Leyes de los Gases' },
    ]},
    { id: 'organica', title: 'Química Orgánica', topics: [
      { title: 'El Átomo de Carbono e Hibridación' },
      { title: 'Hidrocarburos (Alcanos, Alquenos, Alquinos, Aromáticos)' },
      { title: 'Compuestos Oxigenados (Alcoholes, Aldehídos, Cetonas, Ácidos)' },
      { title: 'Compuestos Nitrogenados (Aminas, Amidas, Aminoácidos)' },
      { title: 'Isomería' },
    ]},
  ]},
  { id: 'estadistica', label: 'Estadística', icon: 'σ', color: '#f472b6', categories: [
    { id: 'descriptiva', title: 'Estadística Descriptiva', topics: [
      { title: 'Introducción a la Estadística y Tipos de Datos' },
      { title: 'Tablas de Frecuencia y Gráficos Estadísticos' },
      { title: 'Medidas de Tendencia Central (Media, Mediana, Moda)' },
      { title: 'Medidas de Dispersión (Rango, Varianza, Desviación Estándar)' },
      { title: 'Medidas de Posición (Cuantiles, Percentiles)' },
    ]},
    { id: 'inferencial', title: 'Estadística Inferencial', topics: [
      { title: 'Probabilidad Básica y Regla de Laplace' },
      { title: 'Distribuciones de Probabilidad (Binomial, Normal)' },
      { title: 'Teorema del Límite Central' },
      { title: 'Estimación por Intervalos de Confianza' },
      { title: 'Pruebas de Hipótesis (Paramétricas)' },
      { title: 'Regresión Lineal y Correlación' },
    ]},
  ]},
];

const universities = [
  { id: 'UNALM', label: 'UNALM', full: 'U. Nacional Agraria La Molina', color: '#2e7d32', color2: '#1b5e20', text: '#fff' },
  { id: 'PUCP', label: 'PUCP', full: 'Pontificia U. Católica del Perú', color: '#0d47a1', color2: '#1565c0', text: '#fff' },
  { id: 'UNMSM', label: 'UNMSM', full: 'U. Nacional Mayor de San Marcos', color: '#b71c1c', color2: '#c62828', text: '#fff' },
  { id: 'UNFV', label: 'UNFV', full: 'U. Nacional Federico Villarreal', color: '#e65100', color2: '#f57c00', text: '#fff' },
];
const objectives = [
  { id: 'teoria', label: 'Teoría', icon: 'book' },
  { id: 'ejercicios', label: 'Resolución de Ejercicios', icon: 'pencil' },
  { id: 'ambos', label: 'Ambos', icon: 'sparkles' },
];

function Icon({ name, size = 28 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'book') return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 6h8M8 10h7" /></svg>;
  if (name === 'pencil') return <svg {...common}><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m13.5 7.5 3 3M6 16.5l2 2" /><path d="M14 20h6" /></svg>;
  if (name === 'sparkles') return <svg {...common}><path d="m12 3-1.1 3.2L8 7.3l2.9 1.1L12 11.5l1.1-3.1L16 7.3l-2.9-1.1L12 3Z" /><path d="m19 12-.8 2.2L16 15l2.2.8L19 18l.8-2.2L22 15l-2.2-.8L19 12ZM5 13l-.7 1.8L2.5 15.5l1.8.7L5 18l.7-1.8 1.8-.7-1.8-.7L5 13Z" /></svg>;
  if (name === 'phone') return <svg {...common}><path d="M5 4h3l1.5 4-2 1.5a15 15 0 0 0 7 7l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3 6.2 2 2 0 0 1 5 4Z" /></svg>;
  if (name === 'check') return <svg {...common}><path d="m5 12 5 5L20 7" /></svg>;
  if (name === 'chat') return <svg {...common}><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.4-.8L4 20l1.5-3.7A7.2 7.2 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></svg>;
  if (name === 'calendar') return <svg {...common}><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="M8 14h.01M12 14h.01M16 14h.01" /></svg>;
  if (name === 'lock') return <svg {...common}><path d="M7 11V7a5 5 0 0 1 10 0v4" /><path d="M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" /></svg>;
  if (name === 'trash') return <svg {...common}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>;
  return <svg {...common}><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.4-.8L4 20l1.5-3.7A7.2 7.2 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></svg>;
}

const PRICE_VIRTUAL = 20;
const PRICE_PRESENCIAL = 25;

function priceFor(mode) {
  return mode === 'presencial' ? PRICE_PRESENCIAL : PRICE_VIRTUAL;
}
const TEACHER_PASSWORD = 'chopi2024';
const TEACHER_WHATSAPP = '51906242512';
const SUPPORT_WHATSAPP = '51906242512';
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const schedule = [
  { day: 'Lunes', start: 20, end: 23 },
  { day: 'Martes', start: 18, end: 23 },
  { day: 'Miércoles', start: 18, end: 22 },
  { day: 'Jueves', start: 20, end: 23 },
  { day: 'Viernes', start: 15, end: 23 },
  { day: 'Sábado', start: 9, end: 23 },
  { day: 'Domingo', start: 9, end: 23 },
];

function fmtHour(h) {
  if (h === 12) return '12:00 pm';
  if (h < 12) return `${h}:00 am`;
  return `${h - 12}:00 pm`;
}

const MIN_BOOKING_LEAD_HOURS = 3;

function isSlotInPast(dateKeyStr, startHour) {
  const now = new Date();
  const todayKey = dateKey(now);
  if (dateKeyStr < todayKey) return true;
  if (dateKeyStr > todayKey) return false;
  const slotTime = new Date(now);
  slotTime.setHours(startHour, 0, 0, 0);
  const hoursUntilSlot = (slotTime - now) / 36e5;
  return hoursUntilSlot < MIN_BOOKING_LEAD_HOURS;
}

function generateSlots(dayConfig, duration, dateKeyStr) {
  const slots = [];
  for (let h = dayConfig.start; h + duration <= dayConfig.end; h++) {
    if (!isSlotInPast(dateKeyStr, h)) {
      slots.push({ start: h, end: h + duration, label: `${fmtHour(h)} - ${fmtHour(h + duration)}` });
    }
  }
  return slots;
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getUpcomingDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let offset = 0; offset < 42; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const day = DAY_NAMES[date.getDay()];
    if (schedule.some((item) => item.day === day)) {
      dates.push({ key: dateKey(date), day, label: date.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }), shortLabel: date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) });
    }
  }
  return dates;
}

function groupByWeek(dates) {
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    const chunk = dates.slice(i, i + 7);
    weeks.push({
      dates: chunk,
      label: `Del ${chunk[0].shortLabel} al ${chunk[chunk.length - 1].shortLabel}`,
    });
  }
  return weeks;
}

function overlaps(items, date, startHour, duration, dateField) {
  return items.some((item) => item[dateField] === date && item.start_hour < startHour + duration && item.start_hour + item.duration > startHour);
}

function countTopics(branch) {
  return branch.categories.reduce((sum, cat) => sum + cat.topics.length, 0);
}

const binaryColumns = Array.from({ length: 18 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 2)).join('')
);

function App() {
  const [view, setView] = useState('home');
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState('UNALM');
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modalFocus, setModalFocus] = useState(null);
  const [modalLevel, setModalLevel] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDuration, setBookingDuration] = useState(1);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [openPicker, setOpenPicker] = useState(null);

  // Booking form state
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingMode, setBookingMode] = useState(null);
  const [presencialDistrict, setPresencialDistrict] = useState(null);

  // Teacher agenda state
  const [teacherView, setTeacherView] = useState(false);
  const [teacherPasswordInput, setTeacherPasswordInput] = useState('');
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [teacherError, setTeacherError] = useState('');
  const [allBookings, setAllBookings] = useState([]);
  const [teacherBlocks, setTeacherBlocks] = useState([]);
  const [agendaDate, setAgendaDate] = useState('');
  const [blockDuration, setBlockDuration] = useState(1);
  const [blockError, setBlockError] = useState('');
  const [agendaTab, setAgendaTab] = useState('reservas');
  const [bookingWeekIndex, setBookingWeekIndex] = useState(0);
  const [agendaWeekIndex, setAgendaWeekIndex] = useState(0);

  const loadBookings = useCallback(async () => {
    const [{ data: bookingData, error: bookingErrorResult }, { data: blockData, error: blockErrorResult }] = await Promise.all([
      supabase.from('bookings').select('id, booking_date, day_of_week, start_hour, duration, topic, branch, category, university, student_name, student_phone, status, payment_status, booking_mode, district, jitsi_room, created_at').eq('status', 'confirmada').order('created_at', { ascending: false }),
      supabase.from('teacher_blocks').select('id, block_date, start_hour, duration').gte('block_date', dateKey(new Date())).order('block_date').order('start_hour'),
    ]);
    if (!bookingErrorResult && bookingData) setBookings(bookingData);
    if (!blockErrorResult && blockData) setTeacherBlocks(blockData);
  }, []);

  const loadAllBookings = useCallback(async () => {
    const [{ data: bookingData, error: bookingErrorResult }, { data: blockData, error: blockErrorResult }] = await Promise.all([
      supabase.from('bookings').select('id, booking_date, day_of_week, start_hour, duration, topic, branch, category, university, student_name, student_phone, status, payment_status, booking_mode, district, jitsi_room, created_at').order('created_at', { ascending: false }),
      supabase.from('teacher_blocks').select('id, block_date, start_hour, duration').gte('block_date', dateKey(new Date())).order('block_date').order('start_hour'),
    ]);
    if (!bookingErrorResult && bookingData) setAllBookings(bookingData);
    if (!blockErrorResult && blockData) setTeacherBlocks(blockData);
  }, []);

  const upcomingDates = getUpcomingDates();
  const bookingWeeks = groupByWeek(upcomingDates);
  const activeBookingDate = bookingDate || upcomingDates[0]?.key || dateKey(new Date());
  const activeBookingInfo = upcomingDates.find((item) => item.key === activeBookingDate) || upcomingDates[0];
  const activeBookingWeekIndex = Math.max(0, bookingWeeks.findIndex((week) => week.dates.some((d) => d.key === activeBookingDate)));
  const activeAgendaDate = agendaDate || upcomingDates[0]?.key || dateKey(new Date());
  const activeAgendaInfo = upcomingDates.find((item) => item.key === activeAgendaDate) || upcomingDates[0];
  const activeAgendaWeekIndex = Math.max(0, bookingWeeks.findIndex((week) => week.dates.some((d) => d.key === activeAgendaDate)));
  const bookingDay = activeBookingInfo?.day || 'Lunes';
  const agendaDay = activeAgendaInfo?.day || 'Lunes';

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const goHome = useCallback(() => {
    setView('home'); setExpandedBranch(null); setExpandedCategory(null);
    setSelectedTopic(null); setBookingOpen(false); setOpenPicker(null);
    setTeacherView(false); setTeacherAuthed(false); setTeacherPasswordInput('');
    setTeacherError(''); setBookingSuccess(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (bookingOpen) setBookingOpen(false);
        else if (selectedTopic) setSelectedTopic(null);
        else if (openPicker) setOpenPicker(null);
        else if (expandedCategory) setExpandedCategory(null);
        else if (expandedBranch) setExpandedBranch(null);
        else if (view !== 'home') goHome();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedTopic, view, goHome, expandedBranch, expandedCategory, bookingOpen, openPicker]);

  useEffect(() => {
    if (!openPicker) return;
    const onClick = () => setOpenPicker(null);
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [openPicker]);

  const transition = (next) => { setView('transition'); setTimeout(() => setView(next), 280); };
  const enterTree = () => { if (selectedObjective) transition('tree'); };

  const currentDayConfig = schedule.find((s) => s.day === bookingDay) || schedule[0];
  const currentSlots = generateSlots(currentDayConfig, bookingDuration, activeBookingDate);
  const agendaDayConfig = schedule.find((s) => s.day === agendaDay) || schedule[0];
  const agendaSlots = generateSlots(agendaDayConfig, blockDuration, activeAgendaDate);
  const currentPrice = bookingMode ? priceFor(bookingMode) : PRICE_VIRTUAL;
  const totalPrice = bookingDuration * currentPrice;
  const bookingIsUnavailable = (slot) => overlaps(bookings, activeBookingDate, slot.start, bookingDuration, 'booking_date') || overlaps(teacherBlocks, activeBookingDate, slot.start, bookingDuration, 'block_date');

  const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/;
  const PHONE_RE = /^9\d{8}$/;
  const TROLL_WORDS = ['admin','profesor','profe','chopi','test','troll','xD','xxx','puto','verga','pene','culo','mierda','stupid','dummy','asdf','qwerty','aaaa','bbbb','zzzz','123','000','111','999'];

  const nameError = (() => {
    const v = studentName.trim();
    if (!v) return '';
    if (v.length < 3) return 'El nombre es muy corto (mínimo 3 letras)';
    if (v.length > 60) return 'El nombre es muy largo';
    if (!NAME_RE.test(v)) return 'Solo se permiten letras y espacios';
    const words = v.split(/\s+/).filter(Boolean);
    if (words.length < 2) return 'Escribe tu nombre y apellido';
    if (words.some((w) => w.length < 2)) return 'Cada palabra debe tener al menos 2 letras';
    const lower = v.toLowerCase();
    if (TROLL_WORDS.some((t) => lower.includes(t))) return 'Por favor escribe tu nombre real';
    return '';
  })();

  const phoneError = (() => {
    const v = studentPhone.replace(/[\s\-]/g, '');
    if (!v) return '';
    if (!/^9\d{0,8}$/.test(v.replace(/^51/, ''))) return 'El celular debe empezar con 9 y tener 9 dígitos';
    if (!PHONE_RE.test(v.replace(/^51/, ''))) return 'El celular debe tener 9 dígitos (ej: 987654321)';
    const digits = v.replace(/^51/, '');
    if (/^(\d)\1{8}$/.test(digits)) return 'El celular no puede tener todos los dígitos iguales';
    if (/^(123|987|999|000)/.test(digits)) return 'Por favor escribe tu celular real';
    return '';
  })();

  const nameValid = studentName.trim() && !nameError;
  const phoneValid = studentPhone.trim() && !phoneError;

  const handleConfirmBooking = async () => {
    setBookingError('');
    if (!studentName.trim()) { setBookingError('Por favor escribe tu nombre'); return; }
    if (nameError) { setBookingError(nameError); return; }
    if (!studentPhone.trim()) { setBookingError('Por favor escribe tu celular'); return; }
    if (phoneError) { setBookingError(phoneError); return; }
    if (!dataConfirmed) { setBookingError('Confirma que tus datos son correctos para continuar'); return; }
    if (!bookingSlot) { setBookingError('Selecciona un bloque horario'); return; }
    if (!bookingMode) { setBookingError('Elige si la clase es presencial o virtual'); return; }
    if (bookingMode === 'presencial' && !presencialDistrict) { setBookingError('Selecciona un distrito para la clase presencial'); return; }

    setBookingLoading(true);
    const { data, error } = await supabase.rpc('create_booking', {
      p_day: bookingDay,
      p_booking_date: activeBookingDate,
      p_start_hour: bookingSlot.start,
      p_duration: bookingDuration,
      p_topic: selectedTopic.title,
      p_branch: selectedTopic.branch,
      p_category: selectedTopic.category,
      p_university: selectedUniversity,
      p_student_name: studentName.trim(),
      p_student_phone: studentPhone.trim(),
      p_booking_mode: bookingMode,
      p_district: bookingMode === 'presencial' ? presencialDistrict : null,
    });

    setBookingLoading(false);

    if (error) {
      const msg = error.message || '';
      if (msg.includes('ya está reservado') || msg.includes('solapamiento')) {
        setBookingError('Ese horario acaba de ser reservado por otra persona. Elige otro bloque.');
        loadBookings();
      } else {
        setBookingError('No se pudo completar la reserva. Intenta de nuevo.');
      }
      return;
    }

    if (data) {
      setBookingSuccess(true);
      loadBookings();
    }
  };

  const handleTeacherLogin = () => {
    if (teacherPasswordInput === TEACHER_PASSWORD) {
      setTeacherAuthed(true);
      setTeacherError('');
      loadAllBookings();
    } else {
      setTeacherError('Contraseña incorrecta');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const { error } = await supabase.rpc('cancel_booking', {
      p_booking_id: bookingId,
      p_password: teacherPasswordInput,
    });
    if (!error) loadAllBookings();
  };

  const [cleaningCancelled, setCleaningCancelled] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(null);
  const [jitsiLinks, setJitsiLinks] = useState({});

  const handleConfirmPayment = async (bookingId) => {
    setConfirmingPayment(bookingId);
    const { data, error } = await supabase.rpc('confirm_payment', {
      p_booking_id: bookingId,
      p_password: teacherPasswordInput,
    });
    setConfirmingPayment(null);
    if (error) {
      setTeacherError(error.message?.includes('Contraseña') ? 'Contraseña incorrecta' : 'No se pudo confirmar el pago');
    } else if (data) {
      setJitsiLinks((prev) => ({ ...prev, [bookingId]: data }));
      loadAllBookings();
    }
  };

  const handleCleanCancelled = async () => {
    setCleaningCancelled(true);
    const { error } = await supabase.rpc('delete_cancelled_bookings', {
      p_password: teacherPasswordInput,
    });
    setCleaningCancelled(false);
    if (!error) loadAllBookings();
  };

  const whatsappConfirmUrl = bookingSuccess && selectedTopic
    ? `https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(
        `Hola, soy ${studentName}. Confirmo mi reserva de clase.\n\nTema: ${selectedTopic.title}\nCurso: ${selectedTopic.category} · ${selectedTopic.branch}\nUniversidad: ${selectedUniversity}\nFecha: ${activeBookingInfo?.label}\nHorario: ${bookingSlot.label}\nDuración: ${bookingDuration} hora(s)\nMonto: S/ ${totalPrice}\nModalidad: ${bookingMode === 'virtual' ? 'Virtual' : `Presencial en ${presencialDistrict}`}\nMi celular: ${studentPhone}\n\nQuisiera coordinar el pago${bookingMode === 'virtual' ? '. Una vez confirmado el pago, recibirás el link para entrar a la clase virtual.' : ' y los detalles de la clase presencial.'}`
      )}`
    : '#';

  return (
    <div className={`app view-${view}`}>
      <div className="bg-decor">
        <span className="orb orb1" />
        <span className="orb orb2" />
        <span className="orb orb3" />
        <div className="binary-rain" aria-hidden="true">{binaryColumns.map((col, i) => <span key={i} className="binary-rain-col" style={{ animationDelay: `${(i % 10) * 0.4}s`, animationDuration: `${4 + (i % 6)}s` }}>{col}</span>)}</div>
      </div>

      {/* HOME */}
      <section className={`screen home-screen ${view === 'home' && !teacherView ? 'show' : 'hide'}`}>
        <header className="topbar">
          <div className="topbar-left-spacer" />
          <div className="topbar-right">
            <button className="teacher-access-btn" onClick={() => setTeacherView(true)} aria-label="Agenda del profesor">
              <Icon name="lock" size={16} /> Agenda
            </button>
            <div className="payment-logos" aria-label="Medios de pago disponibles">
              <div className="payment-logo yape-logo"><span className="yape-bubble">S/</span><span className="yape-word">yape</span></div>
              <div className="payment-logo plin-logo"><span className="plin-bubble">plin</span></div>
            </div>
          </div>
        </header>

        <div className="home-center">
          <div className="home-inner">
            <div className="home-title-wrap">
              <h1 className="home-title">CHOPIMATH</h1>
            </div>

            <div className="university-row">
              <span className="row-label">Elige tu universidad:</span>
              <div className="uni-pills">
                {universities.map((u) => (
                  <button
                    key={u.id}
                    className={`uni-pill ${selectedUniversity === u.id ? 'active' : ''}`}
                    style={{ '--uc': u.color, '--uc2': u.color2, '--uct': u.text }}
                    onClick={() => setSelectedUniversity(u.id)}
                  >
                    <span className="uni-pill-label">{u.label}</span>
                    <span className="uni-pill-full">{u.full}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="objective-section">
              <span className="row-label">¿Cómo quieres prepararte?</span>
              <div className="objective-buttons">
                {objectives.map((obj) => (
                  <button key={obj.id} className={`obj-btn ${selectedObjective === obj.id ? 'active' : ''}`} onClick={() => setSelectedObjective(obj.id)}>
                    <span className="obj-icon"><Icon name={obj.icon} size={30} /></span>
                    <span className="obj-label">{obj.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className={`cta-main ${selectedObjective ? '' : 'disabled'}`} onClick={enterTree} disabled={!selectedObjective}>
              <span>Ir al Árbol de Aprendizaje</span>
              <span className="cta-arrow">→</span>
            </button>

            <div className="home-description">
              Clases particulares y grupales de Matemática, Física, Química y Estadística.
              Presencial y virtual. Reserva tu clase online y sé un monstruo de las ciencias.
            </div>

            <div className="contact-quick">
              <a href="tel:+51906242512" className="quick-phone"><Icon name="phone" size={15} /> +51 906 242 512</a>
              <span className="quick-sep">·</span>
              <span className="quick-info">Clases particulares y grupales</span>
            </div>
          </div>
        </div>

        <a href={`https://wa.me/${TEACHER_WHATSAPP}?text=Hola%20profe%2C%20quiero%20info%20sobre%20clases`} target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="Habla con un tutor por WhatsApp">
          <span className="wa-icon"><Icon name="chat" size={20} /></span>
          <span className="wa-text">¡Habla con un tutor!</span>
        </a>
      </section>

      {/* TREE */}
      <section className={`screen tree-screen ${view === 'tree' && !teacherView ? 'show' : 'hide'}`}>
        <header className="sub-header">
          <button className="back-btn" onClick={goHome}><span>←</span> Volver</button>
          <div className="sub-title">
            <span className="sub-eyebrow">MAPA DE APRENDIZAJE · {selectedUniversity}</span>
            <h2>Árbol de Aprendizaje</h2>
          </div>
        </header>

        <div className="tree-canvas">
          <div className="tree-trunk">
            <div className="trunk-node"><span>INICIO</span></div>
          </div>
          <div className="tree-branches">
            {branches.filter((branch) => {
              if (selectedUniversity === 'PUCP' && (branch.id === 'fisica' || branch.id === 'quimica')) return false;
              return true;
            }).map((branch) => {
              const isExpanded = expandedBranch === branch.id;
              return (
                <div className={`branch ${isExpanded ? 'expanded' : ''}`} key={branch.id}>
                  <div className="branch-connector" style={{ '--bc': branch.color }} />
                  <button className="branch-head" style={{ '--bc': branch.color }} onClick={() => { setExpandedBranch(isExpanded ? null : branch.id); setExpandedCategory(null); setOpenPicker(null); }}>
                    <span className="branch-icon" style={{ background: branch.color }}>{branch.icon}</span>
                    <span className="branch-name">{branch.label}</span>
                    <span className="branch-count">{countTopics(branch)} temas</span>
                    <span className="branch-expand">{isExpanded ? '−' : '+'}</span>
                  </button>
                  <div className="branch-categories">
                    {branch.categories.map((cat, ci) => {
                      const catExpanded = expandedCategory === cat.id;
                      return (
                        <div className={`category ${catExpanded ? 'expanded' : ''}`} key={cat.id} style={{ '--delay': `${ci * 0.05}s` }}>
                          <div className="cat-connector" />
                          <button className="category-head" style={{ '--cc': branch.color }} onClick={() => { setExpandedCategory(catExpanded ? null : cat.id); setOpenPicker(null); }}>
                            <span className="cat-title">{cat.title}</span>
                            <span className="cat-count">{cat.topics.length} temas</span>
                            <span className="cat-expand">{catExpanded ? '−' : '+'}</span>
                          </button>
                          <div className="category-topics">
                            {cat.topics.map((topic, ti) => {
                              return (
                                <div className="topic-leaf" key={ti} style={{ '--delay': `${ti * 0.04}s` }}>
                                  <button className="topic-node" onClick={() => setSelectedTopic({ title: topic.title, branch: branch.label, category: cat.title, branchColor: branch.color })}>
                                    <span className="tn-title">{topic.title}</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tree-welcome-banner">
          <p className="tree-welcome-title">¿Listo para tus clases?</p>
          <p className="tree-welcome-text">Selecciona un curso y luego el tema que desees. ¡Realiza tu reserva y sé un monstruo de las ciencias!</p>
        </div>

        <div className="tree-foot-hint">
          <span>Toca una rama para ver sus categorías · Toca un tema para empezar una clase</span>
        </div>

        <a href={`https://wa.me/${TEACHER_WHATSAPP}?text=Hola%20profe%2C%20quiero%20info%20sobre%20clases`} target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="WhatsApp">
          <span className="wa-icon"><Icon name="chat" size={20} /></span>
          <span className="wa-text">¡Habla con un tutor!</span>
        </a>
      </section>

      {/* TRANSITION */}
      <section className={`screen transition-screen ${view === 'transition' ? 'show' : 'hide'}`}>
        <div className="transition-spinner" />
      </section>

      {/* MODAL */}
      {selectedTopic && !bookingOpen && (
        <div className="modal-overlay" onClick={() => setSelectedTopic(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ '--mc': selectedTopic.branchColor }}>
            <button className="modal-close" onClick={() => setSelectedTopic(null)}>×</button>
            <div className="modal-header">
              <span className="modal-branch">{selectedTopic.branch} · {selectedTopic.category}</span>
              <h3>{selectedTopic.title}</h3>
            </div>

            <div className="modal-section">
              <span className="modal-label">a) Enfoque</span>
              <div className="modal-options">
                <button className={`opt-btn ${modalFocus === 'teoria' ? 'active' : ''}`} onClick={() => setModalFocus('teoria')}>Ver Teoría</button>
                <button className={`opt-btn ${modalFocus === 'ejercicios' ? 'active' : ''}`} onClick={() => setModalFocus('ejercicios')}>Resolver Ejercicios</button>
                <button className={`opt-btn ${modalFocus === 'ambos' ? 'active' : ''}`} onClick={() => setModalFocus('ambos')}>Ambos</button>
              </div>
            </div>

            <div className="modal-section">
              <span className="modal-label">b) Nivel</span>
              <div className="modal-levels">
                <button className={`lvl-btn basic ${modalLevel === 'basico' ? 'active' : ''}`} onClick={() => setModalLevel('basico')}>
                  <span className="lvl-circle basic-c" /> Básico
                </button>
                <button className={`lvl-btn inter ${modalLevel === 'intermedio' ? 'active' : ''}`} onClick={() => setModalLevel('intermedio')}>
                  <span className="lvl-circle inter-c" /> Intermedio
                </button>
                <button className={`lvl-btn adv ${modalLevel === 'avanzado' ? 'active' : ''}`} onClick={() => setModalLevel('avanzado')}>
                  <span className="lvl-circle adv-c" /> Avanzado
                </button>
              </div>
            </div>

            <button className="modal-start-btn rainbow-btn" onClick={() => { setBookingOpen(true); setBookingSlot(null); setBookingDate(upcomingDates[0]?.key || ''); setBookingWeekIndex(0); setBookingDuration(1); setStudentName(''); setStudentPhone(''); setBookingError(''); setBookingSuccess(false); setBookingMode(null); setPresencialDistrict(null); setDataConfirmed(false); setNameTouched(false); setPhoneTouched(false); }}>
              <span className="rainbow-btn-line1">¡Quiero reservar mi clase!</span>
              <span className="rainbow-btn-line2">¡Deseo ser un lobo de las ciencias!</span>
              <span className="rainbow-btn-price">desde S/ {PRICE_VIRTUAL}/hora</span>
            </button>
            <p className="modal-contact-hint">¿Necesitas ayuda? <a href={`https://wa.me/${TEACHER_WHATSAPP}`} target="_blank" rel="noreferrer">Escríbeme por WhatsApp →</a></p>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingOpen && selectedTopic && (
        <div className="modal-overlay" onClick={() => setBookingOpen(false)}>
          <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBookingOpen(false)}>×</button>

            {!bookingSuccess ? (
              <>
                <div className="modal-header">
                  <span className="modal-branch">RESERVA TU CLASE</span>
                  <h3>Elige tu horario</h3>
                  <p className="modal-status-text">{bookingMode ? `S/ ${currentPrice} por hora` : 'Elige modalidad para ver el precio'} · {bookingDuration === 1 ? '1 hora' : '2 horas'}{bookingMode ? ` = S/ ${totalPrice}` : ''}</p>
                </div>

                <div className="modal-section">
                  <span className="modal-label">1. Fecha de clase</span>
                  <div className="week-nav">
                    <button className="week-arrow" disabled={bookingWeekIndex === 0} onClick={() => setBookingWeekIndex((prev) => Math.max(0, prev - 1))}>‹</button>
                    <span className="week-label">{bookingWeeks[bookingWeekIndex]?.label}</span>
                    <button className="week-arrow" disabled={bookingWeekIndex >= bookingWeeks.length - 1} onClick={() => setBookingWeekIndex((prev) => Math.min(bookingWeeks.length - 1, prev + 1))}>›</button>
                  </div>
                  <div className="booking-dates-scroll">
                    {bookingWeeks[bookingWeekIndex]?.dates.map((d) => (
                      <button key={d.key} className={`booking-date-btn ${activeBookingDate === d.key ? 'active' : ''}`} onClick={() => { setBookingDate(d.key); setBookingSlot(null); setBookingError(''); }}>
                        <span className="bd-day">{d.day.slice(0, 3)}</span>
                        <span className="bd-label">{d.shortLabel}</span>
                      </button>
                    ))}
                  </div>
                  <p className="day-range-info">Horario: {fmtHour(currentDayConfig.start)} a {fmtHour(currentDayConfig.end)}</p>
                </div>

                <div className="modal-section">
                  <span className="modal-label">2. Duración</span>
                  <div className="booking-days">
                    <button className={`booking-choice ${bookingDuration === 1 ? 'active' : ''}`} onClick={() => { setBookingDuration(1); setBookingSlot(null); setBookingError(''); }}>1 hora{bookingMode ? ` · S/ ${currentPrice}` : ''}</button>
                    <button className={`booking-choice ${bookingDuration === 2 ? 'active' : ''}`} onClick={() => { setBookingDuration(2); setBookingSlot(null); setBookingError(''); }}>2 horas{bookingMode ? ` · S/ ${currentPrice * 2}` : ''}</button>
                  </div>
                </div>

                <div className="modal-section">
                  <span className="modal-label">3. Selecciona tu bloque horario</span>
                  <div className="hour-grid">
                    {currentSlots.map((slot) => {
                      const booked = bookingIsUnavailable(slot);
                      return (
                        <button
                          key={slot.label}
                          className={`hour-choice ${bookingSlot && bookingSlot.label === slot.label ? 'active' : ''} ${booked ? 'booked' : ''}`}
                          disabled={booked}
                          onClick={() => { setBookingSlot(slot); setBookingError(''); }}
                        >
                          {slot.label}
                          {booked && <span className="booked-label">Ocupado</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="modal-section">
                  <span className="modal-label">4. Modalidad de la clase</span>
                  <div className="booking-days">
                    <button className={`booking-choice ${bookingMode === 'presencial' ? 'active' : ''}`} onClick={() => { setBookingMode('presencial'); setBookingError(''); }}>Presencial · S/ {PRICE_PRESENCIAL}/hora</button>
                    <button className={`booking-choice ${bookingMode === 'virtual' ? 'active' : ''}`} onClick={() => { setBookingMode('virtual'); setPresencialDistrict(null); setBookingError(''); }}>Virtual · S/ {PRICE_VIRTUAL}/hora</button>
                  </div>
                  {bookingMode === 'presencial' && (
                    <div className="district-selector">
                      <span className="district-label">Distritos disponibles:</span>
                      <div className="district-pills">
                        {['Surco', 'San Juan de Miraflores', 'Surquillo', 'La Molina'].map((d) => (
                          <button key={d} className={`district-pill ${presencialDistrict === d ? 'active' : ''}`} onClick={() => { setPresencialDistrict(d); setBookingError(''); }}>{d}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {bookingMode === 'virtual' && (
                    <p className="mode-hint">La reunión virtual se coordina por WhatsApp después de reservar.</p>
                  )}
                </div>

                <div className="modal-section">
                  <span className="modal-label">5. Tus datos</span>
                  <input
                    className={`form-input ${nameTouched && nameError ? 'input-error' : nameValid ? 'input-ok' : ''}`}
                    type="text"
                    placeholder="Tu nombre y apellido (ej: María López)"
                    value={studentName}
                    onChange={(e) => { setStudentName(e.target.value); setDataConfirmed(false); }}
                    onBlur={() => setNameTouched(true)}
                    maxLength={60}
                  />
                  {nameTouched && nameError && <div className="field-error">{nameError}</div>}
                  <input
                    className={`form-input ${phoneTouched && phoneError ? 'input-error' : phoneValid ? 'input-ok' : ''}`}
                    type="tel"
                    placeholder="Tu celular (ej: 987654321)"
                    value={studentPhone}
                    onChange={(e) => { setStudentPhone(e.target.value); setDataConfirmed(false); }}
                    onBlur={() => setPhoneTouched(true)}
                    maxLength={11}
                  />
                  {phoneTouched && phoneError && <div className="field-error">{phoneError}</div>}
                </div>

                {nameValid && phoneValid && (
                  <div className={`data-confirm-box ${dataConfirmed ? 'checked' : ''}`}>
                    <button
                      type="button"
                      className="data-confirm-btn"
                      onClick={() => setDataConfirmed((v) => !v)}
                    >
                      <span className="data-confirm-check">{dataConfirmed && <Icon name="check" size={18} />}</span>
                      <span>¿Tu nombre y número están correctos?</span>
                    </button>
                  </div>
                )}

                {bookingError && <div className="booking-error">{bookingError}</div>}

                <div className="booking-summary">
                  {bookingSlot
                    ? <span>{activeBookingInfo?.label} · {bookingSlot.label} · <strong>S/ {totalPrice}</strong></span>
                    : <span>Selecciona un bloque horario para continuar</span>}
                </div>

                <button
                  className={`modal-start-btn ${(!bookingSlot || bookingLoading || !dataConfirmed) ? 'disabled' : ''}`}
                  onClick={handleConfirmBooking}
                  disabled={!bookingSlot || bookingLoading || !dataConfirmed}
                >
                  {bookingLoading ? 'Reservando...' : 'Confirmar reserva'}
                </button>
              </>
            ) : (
              <div className="booking-success">
                <div className="success-check"><Icon name="check" size={48} /></div>
                <h3>¡Reserva confirmada!</h3>
                <p className="success-detail">
                  {selectedTopic.title}<br />
                  {activeBookingInfo?.label} · {bookingSlot.label}<br />
                  S/ {totalPrice}
                </p>
                <div className="coordination-box">
                  <p className="coordination-title">Coordinación y pago</p>
                  <p className="coordination-text">
                    Todo se coordina previa conversación, hasta el pago mismo.<br />
                    Escríbeme al <strong>906 242 512</strong> para coordinar{bookingMode === 'virtual' ? ' la reunión virtual' : presencialDistrict ? ` la clase presencial en ${presencialDistrict}` : ''} y los detalles del pago.
                  </p>
                  {bookingMode === 'virtual' && (
                    <p className="coordination-note">
                      Una vez confirmado el pago, recibirás el link para entrar a la clase virtual.
                    </p>
                  )}
                </div>
                <a className="modal-start-btn booking-send" href={whatsappConfirmUrl} target="_blank" rel="noreferrer">
                  Coordinar por WhatsApp
                </a>
                <button className="success-close" onClick={() => { setBookingOpen(false); setSelectedTopic(null); setBookingSuccess(false); }}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEACHER AGENDA */}
      {teacherView && (
        <section className="screen teacher-screen show">
          <header className="sub-header">
            <button className="back-btn" onClick={goHome}><span>←</span> Volver</button>
            <div className="sub-title">
              <span className="sub-eyebrow">PANEL DEL PROFESOR</span>
              <h2>Mi Agenda</h2>
            </div>
          </header>

          {!teacherAuthed ? (
            <div className="teacher-login">
              <div className="teacher-login-card">
                <div className="teacher-login-icon"><Icon name="lock" size={36} /></div>
                <h3>Acceso restringido</h3>
                <p className="teacher-login-hint">Ingresa tu contraseña para ver las reservas</p>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Contraseña"
                  value={teacherPasswordInput}
                  onChange={(e) => setTeacherPasswordInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleTeacherLogin(); }}
                />
                {teacherError && <div className="booking-error">{teacherError}</div>}
                <button className="modal-start-btn" onClick={handleTeacherLogin}>Entrar</button>
              </div>
            </div>
          ) : (
            <div className="teacher-agenda">
              <div className="agenda-tabs">
                <button className={`agenda-tab ${agendaTab === 'reservas' ? 'active' : ''}`} onClick={() => setAgendaTab('reservas')}>Reservas</button>
                <button className={`agenda-tab ${agendaTab === 'bloqueos' ? 'active' : ''}`} onClick={() => setAgendaTab('bloqueos')}>Bloquear horas</button>
              </div>

              {agendaTab === 'reservas' ? (
                <>
                  <div className="agenda-stats">
                    <div className="agenda-stat">
                      <span className="stat-num">{allBookings.filter((b) => b.status === 'confirmada').length}</span>
                      <span className="stat-label">Confirmadas</span>
                    </div>
                    <div className="agenda-stat">
                      <span className="stat-num">{allBookings.filter((b) => b.status === 'confirmada' && b.payment_status === 'pagado').length}</span>
                      <span className="stat-label">Pagadas</span>
                    </div>
                    <div className="agenda-stat">
                      <span className="stat-num">{allBookings.filter((b) => b.status === 'confirmada' && b.payment_status === 'pendiente').length}</span>
                      <span className="stat-label">Pago pendiente</span>
                    </div>
                  </div>
                  {teacherError && <div className="booking-error">{teacherError}</div>}
                  {allBookings.some((b) => b.status === 'cancelada') && (
                    <button className="clean-cancelled-btn" onClick={handleCleanCancelled} disabled={cleaningCancelled}>
                      {cleaningCancelled ? 'Limpiando…' : 'Limpiar clases canceladas'}
                    </button>
                  )}

                  <div className="calendar-view">
                    <div className="week-nav">
                      <button className="week-arrow" disabled={agendaWeekIndex === 0} onClick={() => setAgendaWeekIndex((prev) => Math.max(0, prev - 1))}>‹</button>
                      <span className="week-label">{bookingWeeks[agendaWeekIndex]?.label}</span>
                      <button className="week-arrow" disabled={agendaWeekIndex >= bookingWeeks.length - 1} onClick={() => setAgendaWeekIndex((prev) => Math.min(bookingWeeks.length - 1, prev + 1))}>›</button>
                    </div>
                    <div className="calendar-grid">
                      {bookingWeeks[agendaWeekIndex]?.dates.map((d) => {
                        const dayBookings = allBookings
                          .filter((b) => b.booking_date === d.key && b.status === 'confirmada')
                          .sort((a, b) => a.start_hour - b.start_hour);
                        const dayBlocks = teacherBlocks.filter((b) => b.block_date === d.key);
                        return (
                          <div className="cal-day-col" key={d.key}>
                            <div className="cal-day-header">
                              <span className="cal-day-name">{d.day.slice(0, 3)}</span>
                              <span className="cal-day-date">{d.shortLabel}</span>
                            </div>
                            <div className="cal-day-body">
                              {dayBookings.length === 0 && dayBlocks.length === 0 && (
                                <div className="cal-empty">Sin clases</div>
                              )}
                              {dayBookings.map((b) => {
                                const jitsiUrl = jitsiLinks[b.id] || b.jitsi_room;
                                const isPaid = b.payment_status === 'pagado';
                                const isVirtual = b.booking_mode === 'virtual';
                                const waMessage = jitsiUrl
                                  ? `https://wa.me/51${b.student_phone.replace(/\s/g, '')}?text=${encodeURIComponent(`Hola ${b.student_name}, he confirmado tu pago! Te envio la reunión: ${jitsiUrl}\n\nEntra a ese enlace el día acordado! De todas maneras si se te olvida te haré acordar por medio de whatsapp.`)}`
                                  : '#';
                                return (
                                  <div className={`cal-class-block ${isPaid ? 'paid' : 'unpaid'} ${isVirtual ? 'virtual' : 'inperson'}`} key={b.id}>
                                    <div className="cal-class-time">{fmtHour(b.start_hour)} · {b.duration}h</div>
                                    <div className="cal-class-topic">{b.topic}</div>
                                    <div className="cal-class-student">{b.student_name}</div>
                                    <div className="cal-class-mode">
                                      {isVirtual ? 'Virtual' : `Presencial${b.district ? ' · ' + b.district : ''}`}
                                    </div>
                                    <div className="cal-class-payment">
                                      {isPaid ? (
                                        <span className="pay-badge pay-badge-paid">Pagado</span>
                                      ) : (
                                        <span className="pay-badge pay-badge-pending">Pago pendiente</span>
                                      )}
                                    </div>
                                    <div className="cal-class-actions">
                                      {!isPaid && (
                                        <button
                                          className="cal-action-btn cal-confirm-pay"
                                          disabled={confirmingPayment === b.id}
                                          onClick={() => handleConfirmPayment(b.id)}
                                        >
                                          {confirmingPayment === b.id ? 'Confirmando…' : 'Confirmar pago'}
                                        </button>
                                      )}
                                      {isPaid && jitsiUrl && (
                                        <>
                                          <a className="cal-action-btn cal-join-jitsi" href={jitsiUrl} target="_blank" rel="noreferrer">
                                            Entrar a la clase
                                          </a>
                                          <a className="cal-action-btn cal-send-link" href={waMessage} target="_blank" rel="noreferrer">
                                            Enviar link al alumno
                                          </a>
                                        </>
                                      )}
                                      <button className="cal-cancel-btn" onClick={() => handleCancelBooking(b.id)}>
                                        <Icon name="trash" size={14} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                              {dayBlocks.map((blk) => (
                                <div className="cal-class-block blocked" key={blk.id}>
                                  <div className="cal-class-time">{fmtHour(blk.start_hour)} · {blk.duration}h</div>
                                  <div className="cal-class-topic">Bloqueado</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {allBookings.filter((b) => b.status === 'confirmada').length === 0 && allBookings.filter((b) => b.status === 'cancelada').length === 0 && (
                      <div className="agenda-empty">
                        <Icon name="calendar" size={48} />
                        <p>No tienes reservas aún</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="block-panel">
                  <p className="block-hint">Selecciona una fecha y hora para bloquear y que ningún alumno pueda reservar ese horario.</p>
                  <div className="week-nav">
                    <button className="week-arrow" disabled={agendaWeekIndex === 0} onClick={() => setAgendaWeekIndex((prev) => Math.max(0, prev - 1))}>‹</button>
                    <span className="week-label">{bookingWeeks[agendaWeekIndex]?.label}</span>
                    <button className="week-arrow" disabled={agendaWeekIndex >= bookingWeeks.length - 1} onClick={() => setAgendaWeekIndex((prev) => Math.min(bookingWeeks.length - 1, prev + 1))}>›</button>
                  </div>
                  <div className="booking-dates-scroll">
                    {bookingWeeks[agendaWeekIndex]?.dates.map((d) => (
                      <button key={d.key} className={`booking-date-btn ${activeAgendaDate === d.key ? 'active' : ''}`} onClick={() => { setAgendaDate(d.key); setBlockError(''); }}>
                        <span className="bd-day">{d.day.slice(0, 3)}</span>
                        <span className="bd-label">{d.shortLabel}</span>
                      </button>
                    ))}
                  </div>
                  <div className="modal-section">
                    <span className="modal-label">Duración del bloqueo</span>
                    <div className="booking-days">
                      <button className={`booking-choice ${blockDuration === 1 ? 'active' : ''}`} onClick={() => { setBlockDuration(1); setBlockError(''); }}>1 hora</button>
                      <button className={`booking-choice ${blockDuration === 2 ? 'active' : ''}`} onClick={() => { setBlockDuration(2); setBlockError(''); }}>2 horas</button>
                    </div>
                  </div>
                  <div className="modal-section">
                    <span className="modal-label">Hora a bloquear</span>
                    <div className="hour-grid">
                      {agendaSlots.map((slot) => {
                        const isBlocked = overlaps(teacherBlocks, activeAgendaDate, slot.start, blockDuration, 'block_date');
                        const hasBooking = overlaps(allBookings.filter((b) => b.status === 'confirmada'), activeAgendaDate, slot.start, blockDuration, 'booking_date');
                        return (
                          <button
                            key={slot.label}
                            className={`hour-choice ${isBlocked ? 'booked' : ''}`}
                            disabled={isBlocked || hasBooking}
                            onClick={async () => {
                              setBlockError('');
                              const { error: rpcError } = await supabase.rpc('create_teacher_block', {
                                p_block_date: activeAgendaDate,
                                p_start_hour: slot.start,
                                p_duration: blockDuration,
                                p_password: teacherPasswordInput,
                              });
                              if (rpcError) {
                                setBlockError(rpcError.message.includes('Contraseña') ? 'Contraseña incorrecta' : 'No se pudo bloquear ese horario');
                              } else {
                                loadAllBookings();
                              }
                            }}
                          >
                            {slot.label}
                            {isBlocked && <span className="booked-label">Bloqueado</span>}
                            {hasBooking && !isBlocked && <span className="booked-label">Reservado</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {blockError && <div className="booking-error">{blockError}</div>}
                  {teacherBlocks.filter((b) => b.block_date === activeAgendaDate).length > 0 && (
                    <div className="modal-section">
                      <span className="modal-label">Horas bloqueadas para {activeAgendaInfo?.label}</span>
                      <div className="hour-grid">
                        {teacherBlocks.filter((b) => b.block_date === activeAgendaDate).sort((a, b) => a.start_hour - b.start_hour).map((b) => (
                          <button
                            key={b.id}
                            className="hour-choice blocked-active"
                            onClick={async () => {
                              const { error: rpcError } = await supabase.rpc('delete_teacher_block', {
                                p_block_id: b.id,
                                p_password: teacherPasswordInput,
                              });
                              if (rpcError) {
                                setBlockError('No se pudo desbloquear');
                              } else {
                                loadAllBookings();
                              }
                            }}
                          >
                            {fmtHour(b.start_hour)}
                            <span className="booked-label">Desbloquear</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
