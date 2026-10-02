<div align="center">

# 🧮 CHOPIMATH · Web Platform

### Clases particulares preuniversitarias con reservas en línea, control de pagos y aulas virtuales

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![Jitsi](https://img.shields.io/badge/Jitsi%20Meet-Videollamadas-97979A?logo=jitsi&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

🌐 **Demo en vivo:** [chopiproject.vercel.app](https://chopiproject.vercel.app/)

</div>

---

## 📑 Tabla de contenidos

1. [Descripción general](#-descripción-general)
2. [Características principales](#-características-principales)
3. [Stack tecnológico](#-stack-tecnológico)
4. [Arquitectura y estructura](#-arquitectura-y-estructura)
5. [Cómo se creó el proyecto](#-cómo-se-creó-el-proyecto)
6. [Base de datos y migraciones](#-base-de-datos-y-migraciones)
7. [Funciones PostgreSQL (RPC)](#-funciones-postgresql-rpc)
8. [Lógica del frontend](#-lógica-del-frontend)
9. [Flujos de usuario](#-flujos-de-usuario)
10. [Instalación local](#-instalación-local)
11. [Despliegue en Vercel](#-despliegue-en-vercel)
12. [Seguridad y mejoras futuras](#-seguridad-y-mejoras-futuras)
13. [Roadmap](#-roadmap)

---

## 📋 Descripción general

**Chopimath Web Platform** es una aplicación web desarrollada con **React, Vite y Supabase** que ayuda a estudiantes a prepararse para el ingreso a la universidad en **Matemática, Física, Química y Estadística**.

La plataforma permite que el alumno **explore el temario, elija su universidad objetivo y reserve una clase** (virtual o presencial) **sin crear cuenta**. El profesor gestiona todo desde un **panel de agenda protegido por contraseña**: confirma pagos, bloquea horarios, cancela reservas y envía por WhatsApp el enlace de la sala de **Jitsi Meet**.

---

## ✨ Características principales

| Icono | Módulo | Descripción |
|:---:|---|---|
| 📚 | **Temario interactivo** | 4 ramas, 10 categorías y más de 60 temas organizados por área |
| 🎓 | **Universidad objetivo** | Personalización por UNALM, PUCP, UNMSM, UNFV, U. de Lima, UPC y Ricardo Palma |
| 🎯 | **Objetivo de la clase** | Teoría, Resolución de ejercicios o Ambos |
| 📅 | **Reserva de clases** | Calendario de las próximas 6 semanas con horarios disponibles en tiempo real |
| ⏱️ | **Duración flexible** | Clases de 1 o 2 horas |
| 🏠 | **Modalidad** | Virtual o presencial (con selección de distrito) |
| 🚫 | **Anti-solapamiento** | Validación atómica en base de datos: dos alumnos no pueden reservar el mismo horario |
| ⏳ | **Anticipación mínima** | Solo se puede reservar con al menos 3 horas de anticipación |
| 🔒 | **Panel del profesor** | Agenda protegida con contraseña, validada en el servidor |
| ⛔ | **Bloqueos docentes** | El profesor deshabilita días u horas en los que no está disponible |
| 💳 | **Control de pagos** | Estados `pendiente` / `pagado` por cada reserva |
| 🎥 | **Aulas virtuales** | Al confirmar el pago se genera automáticamente una sala única de Jitsi Meet |
| 💬 | **Integración WhatsApp** | Mensaje prellenado con el enlace de la reunión para enviarlo al alumno |
| 🧹 | **Limpieza de agenda** | Eliminación masiva de reservas canceladas |
| 🔎 | **SEO y redes** | Metaetiquetas Open Graph y Twitter Card, favicon e imagen de vista previa |

### 📖 Contenido del temario

| Rama | Categorías | Temas |
|---|---|:---:|
| ∑ **Matemática** | Álgebra, Aritmética, Geometría, Trigonometría | 29 |
| ⚛ **Física** | Física Clásica, Física Moderna | 13 |
| ⚗ **Química** | Química Inorgánica, Química Orgánica | 13 |
| σ **Estadística** | Estadística Descriptiva, Estadística Inferencial | 11 |

### 💰 Tarifas y horarios

| Modalidad | Precio por clase |
|---|:---:|
| 💻 Virtual | S/ 20 |
| 🏠 Presencial | S/ 25 |

| Día | Horario de atención |
|---|---|
| Lunes | 8:00 pm – 11:00 pm |
| Martes | 6:00 pm – 11:00 pm |
| Miércoles | 6:00 pm – 10:00 pm |
| Jueves | 8:00 pm – 11:00 pm |
| Viernes | 3:00 pm – 11:00 pm |
| Sábado | 9:00 am – 11:00 pm |
| Domingo | 9:00 am – 11:00 pm |

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Uso en el proyecto |
|---|---|---|
| 🎨 Frontend | **React** (Hooks: `useState`, `useEffect`, `useCallback`) | Interfaz y estado de la aplicación |
| ⚡ Bundler | **Vite** + `@vitejs/plugin-react` | Servidor de desarrollo y compilación |
| 🗄️ Backend / BD | **Supabase (PostgreSQL)** | Base de datos, RLS y funciones RPC |
| 🔌 Cliente | `@supabase/supabase-js` | Conexión desde el frontend |
| 🎥 Videollamadas | **Jitsi Meet** (`meet.jit.si`) | Salas virtuales por reserva |
| 💬 Mensajería | **WhatsApp** (`wa.me`) | Envío de enlaces al alumno |
| 💅 Estilos | **CSS3 personalizado** | Diseño responsivo sin librerías externas |
| ☁️ Hosting | **Vercel** | Despliegue continuo |

---

## 🏗️ Arquitectura y estructura

```text
project/
├── .env                      # Variables de entorno (NO se sube a Git)
├── .gitignore                # Excluye node_modules/ y .env
├── index.html                # HTML principal + metaetiquetas SEO
├── package.json              # Dependencias y scripts
├── package-lock.json
├── assets/                   # Imágenes institucionales
├── public/
│   ├── favicon.svg           # Ícono de la pestaña
│   └── og-image.svg          # Imagen de vista previa al compartir
├── src/
│   ├── main.jsx              # Punto de entrada de React
│   ├── App.jsx               # Componente principal (vistas, reservas, panel docente)
│   ├── styles.css            # Estilos globales
│   └── lib/
│       └── supabase.js       # Cliente de Supabase
└── supabase/
    └── migrations/           # Histórico de migraciones SQL
        ├── 20260919011407_create_bookings_table.sql
        ├── 20260919015810_..._add_booking_dates_and_teacher_blocks.sql
        ├── 20260920142154_add_delete_cancelled_bookings_function.sql
        └── 20260920200323_..._add_payment_jitsi_to_bookings.sql.sql
```

### 🔄 Arquitectura lógica

```text
┌──────────────┐    supabase-js     ┌────────────────────────────┐
│  React (UI)  │ ─────────────────▶ │  Supabase (PostgreSQL)     │
│  Vite + CSS  │ ◀───────────────── │  • Tablas + RLS            │
└──────┬───────┘     SELECT / RPC   │  • Funciones SECURITY      │
       │                            │    DEFINER (reglas)        │
       │                            └────────────────────────────┘
       ├──▶ Jitsi Meet  (sala de clase virtual)
       └──▶ WhatsApp    (envío del enlace al alumno)
```

---

## 🚧 Cómo se creó el proyecto

El proyecto se construyó de forma **incremental, en 4 mini-proyectos**, cada uno agregando una capa funcional sobre el anterior (el código base fue generado y prototipado en [Bolt.new](https://bolt.new)).

| Etapa | Mini-proyecto | Qué se hizo |
|:---:|---|---|
| 1️⃣ | **Frontend base** | Se creó la app con Vite + React, los estilos CSS y el cliente de Supabase |
| 2️⃣ | **Reservas y disponibilidad** | Tabla `bookings`, tabla `teacher_blocks`, validación de solapamientos y cancelación |
| 3️⃣ | **Pagos y aulas virtuales** | Estado de pago, modalidad, distrito y generación automática de salas Jitsi |
| 4️⃣ | **Despliegue** | Publicación en Vercel con despliegue continuo |

### 🧱 Paso a paso técnico

**1. Crear el proyecto con Vite**

```bash
npm create vite@latest project -- --template react
cd project
npm install
npm install @supabase/supabase-js
```

**2. Conectar Supabase** (`src/lib/supabase.js`)

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**3. Montar React** (`src/main.jsx`)

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
```

**4. Definir el temario como datos** (`App.jsx`): ramas → categorías → temas, para que la interfaz se genere dinámicamente.

```js
const branches = [
  { id: 'math', label: 'Matemática', icon: '∑', color: '#a78bfa', categories: [
    { id: 'algebra', title: 'Álgebra', topics: [
      { title: 'Leyes de Exponentes y Ecuaciones Exponenciales' },
      { title: 'Números Complejos' },
      // ...
    ]},
    // ...
  ]},
  // Física, Química, Estadística...
];
```

**5. Crear las migraciones SQL** en `supabase/migrations/` (ver siguiente sección).

**6. Desplegar en Vercel** conectando el repositorio y configurando las variables de entorno.

---

## 🗄️ Base de datos y migraciones

### 🗂️ Modelo de datos

```text
┌─────────────────────────┐          ┌─────────────────────────┐
│        bookings         │          │     teacher_blocks      │
├─────────────────────────┤          ├─────────────────────────┤
│ id (uuid, PK)           │          │ id (uuid, PK)           │
│ booking_date (date)     │          │ block_date (date)       │
│ day_of_week (text)      │          │ start_hour (int)        │
│ start_hour (int)        │          │ duration (1 | 2)        │
│ duration (1 | 2)        │          │ created_at (timestamptz)│
│ topic / branch /        │          └─────────────────────────┘
│ category / university   │
│ student_name / phone    │
│ status                  │   confirmada | cancelada
│ payment_status          │   pendiente  | pagado
│ booking_mode            │   virtual    | presencial
│ district                │
│ jitsi_room              │
│ created_at              │
└─────────────────────────┘
```

### 📜 Historial de migraciones

| # | Archivo | Qué agrega |
|:---:|---|---|
| 1 | `create_bookings_table.sql` | Tabla `bookings`, índices, políticas RLS y funciones `create_booking` y `cancel_booking` |
| 2 | `add_booking_dates_and_teacher_blocks.sql` | Columna `booking_date`, tabla `teacher_blocks` y funciones `create_teacher_block` y `delete_teacher_block` |
| 3 | `add_delete_cancelled_bookings_function.sql` | Función `delete_cancelled_bookings` para limpiar reservas canceladas |
| 4 | `add_payment_jitsi_to_bookings.sql.sql` | Columnas `payment_status`, `booking_mode`, `district`, `jitsi_room` y función `confirm_payment` |

### 🔐 Políticas de seguridad (RLS)

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|:---:|:---:|:---:|:---:|
| `bookings` | ✅ Público | ✅ Público | ❌ Solo vía funciones | ❌ Solo vía funciones |
| `teacher_blocks` | ✅ Público | ❌ Solo vía funciones | ❌ Solo vía funciones | ❌ Solo vía funciones |

> 💡 El SELECT público permite que la interfaz marque como ocupados los horarios ya reservados o bloqueados.

---

## ⚙️ Funciones PostgreSQL (RPC)

Toda la lógica sensible vive en funciones `SECURITY DEFINER`, de modo que el cliente anónimo **no puede modificar datos directamente**.

| Función | Quién la usa | Qué hace |
|---|---|---|
| `create_booking(...)` | 🎓 Alumno | Valida datos, detecta solapamientos con reservas y bloqueos, e inserta la reserva con pago `pendiente` |
| `cancel_booking(id, password)` | 👨‍🏫 Profesor | Cambia el estado a `cancelada` |
| `confirm_payment(id, password)` | 👨‍🏫 Profesor | Marca `pagado` y genera el enlace de Jitsi Meet |
| `create_teacher_block(...)` | 👨‍🏫 Profesor | Bloquea una fecha y hora de la agenda |
| `delete_teacher_block(id, password)` | 👨‍🏫 Profesor | Quita un bloqueo |
| `delete_cancelled_bookings(password)` | 👨‍🏫 Profesor | Elimina permanentemente las reservas canceladas |

### 🚫 Detección de solapamientos

Dos intervalos se solapan si el inicio de uno es anterior al fin del otro **y** su fin es posterior al inicio del otro:

```sql
SELECT count(*) INTO v_conflict
FROM bookings
WHERE booking_date = p_booking_date
  AND status = 'confirmada'
  AND start_hour < p_start_hour + p_duration
  AND start_hour + duration > p_start_hour;

IF v_conflict > 0 THEN RAISE EXCEPTION 'Este horario ya está reservado'; END IF;
```

La misma comprobación se repite contra `teacher_blocks`, por lo que un horario bloqueado por el profesor tampoco puede reservarse.

### 🎥 Generación automática de la sala Jitsi

Al confirmar el pago, la función arma un nombre de sala único con la fecha, la hora y un fragmento del id de la reserva:

```sql
v_room_name := 'ChopiMath-' || to_char(v_booking.booking_date, 'YYYYMMDD')
               || '-' || v_booking.start_hour
               || '-' || substring(v_booking.id::text, 1, 8);

v_jitsi_url := 'https://meet.jit.si/' || v_room_name;

UPDATE bookings
SET payment_status = 'pagado', jitsi_room = v_jitsi_url
WHERE id = p_booking_id;
```

**Ejemplo de enlace generado:** `https://meet.jit.si/ChopiMath-20260925-20-3f9a1c2b`

---

## 💻 Lógica del frontend

### 🧩 Funciones auxiliares principales (`App.jsx`)

| Función | Propósito |
|---|---|
| `generateSlots()` | Genera los bloques horarios disponibles según el día y la duración |
| `isSlotInPast()` | Descarta horarios pasados o con menos de 3 horas de anticipación |
| `getUpcomingDates()` | Calcula las fechas reservables de las próximas 6 semanas |
| `groupByWeek()` | Agrupa las fechas por semana para la navegación del calendario |
| `overlaps()` | Detecta cruces con reservas y bloqueos para deshabilitar horarios en la UI |
| `priceFor()` | Devuelve la tarifa según la modalidad |
| `fmtHour()` | Convierte formato 24 h a `8:00 pm` |

### 📡 Comunicación con Supabase

**Lectura de datos** (la vista pública solo trae las reservas confirmadas):

```js
supabase
  .from('bookings')
  .select('id, booking_date, start_hour, duration, status, payment_status, booking_mode, jitsi_room, ...')
  .eq('status', 'confirmada')
  .order('created_at', { ascending: false });
```

**Escritura mediante RPC** (el alumno reserva una clase):

```js
const { data, error } = await supabase.rpc('create_booking', {
  p_day: day,
  p_booking_date: bookingDate,
  p_start_hour: slot.start,
  p_duration: bookingDuration,
  p_topic: selectedTopic.title,
  p_branch: branch.label,
  p_category: category.title,
  p_university: selectedUniversity,
  p_student_name: studentName,
  p_student_phone: studentPhone,
  p_booking_mode: bookingMode,
  p_district: presencialDistrict,
});
```

### 💬 Mensaje automático por WhatsApp

Tras confirmar el pago, el profesor puede enviar el enlace de la clase con un mensaje prellenado:

```js
`https://wa.me/51${phone}?text=${encodeURIComponent(
  `Hola ${name}, he confirmado tu pago! Te envío la reunión: ${jitsiUrl}`
)}`
```

---

## 🧭 Flujos de usuario

### 🎓 Flujo del alumno

```text
Inicio → Elige universidad → Elige objetivo → Explora rama/categoría/tema
   → Reserva: fecha, duración, horario, modalidad (y distrito)
   → Ingresa nombre y celular → Confirma datos → Reserva creada (pago pendiente)
   → Coordina el pago por WhatsApp → Recibe el enlace de Jitsi
```

### 👨‍🏫 Flujo del profesor

```text
Acceso al panel (contraseña) → Agenda de reservas
   ├── 💳 Confirmar pago → se genera la sala Jitsi → enviar enlace por WhatsApp
   ├── ❌ Cancelar reserva
   ├── ⛔ Bloquear / desbloquear horarios
   └── 🧹 Eliminar reservas canceladas
```

---

## 🚀 Instalación local

### ✅ Requisitos previos

| Herramienta | Versión recomendada |
|---|---|
| Node.js | 18 o superior |
| npm | 9 o superior |
| Cuenta de Supabase | Gratuita |

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/blolchevere-ctrl/chopimath.git
cd chopimath/project
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar la base de datos

Crea un proyecto en [Supabase](https://supabase.com) y ejecuta en el **SQL Editor**, en orden cronológico, los 4 archivos de `supabase/migrations/`.

### 4️⃣ Configurar variables de entorno

Crea el archivo `.env` en la raíz de `project/`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-supabase
```

### 5️⃣ Ejecutar en desarrollo

```bash
npm run dev
```

Abre 👉 `http://localhost:5173`

### 6️⃣ Compilar para producción

```bash
npm run build
npm run preview   # Previsualizar la compilación
```

### 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera la versión optimizada en `dist/` |
| `npm run preview` | Sirve localmente la compilación de producción |

---

## ☁️ Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. En [Vercel](https://vercel.com) elige **Add New → Project** e importa el repositorio.
3. Configura el **Root Directory** como `project` (si el repo lo requiere).
4. Agrega las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. Pulsa **Deploy**. Cada `git push` a la rama principal desplegará automáticamente.

| Ajuste | Valor |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

---

## 🛡️ Seguridad y mejoras futuras

| Aspecto | Estado actual | Mejora recomendada |
|---|---|---|
| 🔑 Acceso del profesor | Contraseña simple validada en funciones SQL | Migrar a **Supabase Auth** con rol de administrador |
| 🙈 Credenciales | La contraseña está definida en el código fuente | Moverla a variables seguras (Vault / secretos de Supabase) |
| 🗝️ Archivo `.env` | Excluido por `.gitignore` | Mantenerlo fuera del repositorio |
| 👀 Datos de alumnos | `SELECT` público en `bookings` | Exponer solo una vista con horarios ocupados (sin nombres ni celulares) |
| 💳 Pagos | Confirmación manual por el profesor | Integrar Yape/Plin o una pasarela de pagos |

> ⚠️ **Importante:** cambia la contraseña del profesor antes de usar el proyecto en producción real.

---

## 🗺️ Roadmap

- [x] **Mini-Proyecto 1:** Arquitectura frontend y estructura base (React + Vite + cliente Supabase)
- [x] **Mini-Proyecto 2:** Sistema de reservas y disponibilidad docente (`bookings`, `teacher_blocks`, anti-solapamiento)
- [x] **Mini-Proyecto 3:** Aulas virtuales (Jitsi Meet) y control de pagos
- [x] **Mini-Proyecto 4:** Despliegue en Vercel
- [ ] Autenticación real para el profesor (Supabase Auth)
- [ ] Notificaciones automáticas de recordatorio
- [ ] Pagos en línea (Yape / Plin / tarjeta)
- [ ] Historial de clases y panel de estadísticas

---

<div align="center">

### 👨‍💻 Autor

**Chopimath** · Proyecto académico — *Lenguaje de Programación II*

Hecho con ❤️, React y Supabase

</div>
