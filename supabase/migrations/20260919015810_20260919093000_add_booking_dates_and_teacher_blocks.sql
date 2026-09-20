/*
# Agregar fechas reales y bloqueos personales a la agenda

1. Cambios en `bookings`
- Agrega `booking_date` (date), la fecha exacta de cada clase.
- Las reservas existentes se conservan; las nuevas reservas usan una fecha exacta.

2. Nueva tabla `teacher_blocks`
- `id` (uuid): identificador del bloqueo.
- `block_date` (date): día exacto que el profesor no está disponible.
- `start_hour` (int): hora de inicio.
- `duration` (int): duración de 1 o 2 horas.
- `created_at` (timestamptz): fecha de creación.

3. Seguridad
- RLS está habilitado en `teacher_blocks`.
- La lectura pública solo permite a los alumnos saber qué horas no están disponibles.
- Los cambios de bloqueos solo ocurren mediante funciones protegidas por la contraseña del profesor.
- La función de reserva comprueba al mismo tiempo reservas y bloqueos.

4. Importante
- Una reserva ocupa únicamente su fecha y horario exactos.
- Al pasar la fecha y hora de la clase, ese horario queda disponible automáticamente para otra semana.
- No se borran ni se modifican columnas existentes de forma destructiva.
*/

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_date date;
CREATE INDEX IF NOT EXISTS idx_bookings_date_hour ON bookings(booking_date, start_hour);

CREATE TABLE IF NOT EXISTS teacher_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date date NOT NULL,
  start_hour int NOT NULL,
  duration int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT teacher_blocks_duration_check CHECK (duration IN (1, 2)),
  CONSTRAINT teacher_blocks_hour_check CHECK (start_hour >= 0 AND start_hour <= 23)
);

ALTER TABLE teacher_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_teacher_blocks" ON teacher_blocks;
CREATE POLICY "anon_select_teacher_blocks" ON teacher_blocks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teacher_blocks" ON teacher_blocks;
CREATE POLICY "anon_insert_teacher_blocks" ON teacher_blocks FOR INSERT TO anon, authenticated WITH CHECK (false);
DROP POLICY IF EXISTS "anon_update_teacher_blocks" ON teacher_blocks;
CREATE POLICY "anon_update_teacher_blocks" ON teacher_blocks FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "anon_delete_teacher_blocks" ON teacher_blocks;
CREATE POLICY "anon_delete_teacher_blocks" ON teacher_blocks FOR DELETE TO anon, authenticated USING (false);

CREATE OR REPLACE FUNCTION create_booking(
  p_day text,
  p_booking_date date,
  p_start_hour int,
  p_duration int,
  p_topic text,
  p_branch text,
  p_category text,
  p_university text,
  p_student_name text,
  p_student_phone text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_conflict int;
BEGIN
  IF p_booking_date IS NULL OR p_booking_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'La fecha de clase no es válida';
  END IF;
  IF p_duration NOT IN (1, 2) OR p_start_hour < 0 OR p_start_hour + p_duration > 24 THEN
    RAISE EXCEPTION 'El horario no es válido';
  END IF;
  IF p_student_name IS NULL OR trim(p_student_name) = '' THEN
    RAISE EXCEPTION 'El nombre del alumno es obligatorio';
  END IF;
  IF p_student_phone IS NULL OR trim(p_student_phone) = '' THEN
    RAISE EXCEPTION 'El celular del alumno es obligatorio';
  END IF;

  SELECT count(*) INTO v_conflict
  FROM bookings
  WHERE booking_date = p_booking_date
    AND status = 'confirmada'
    AND start_hour < p_start_hour + p_duration
    AND start_hour + duration > p_start_hour;
  IF v_conflict > 0 THEN RAISE EXCEPTION 'Este horario ya está reservado'; END IF;

  SELECT count(*) INTO v_conflict
  FROM teacher_blocks
  WHERE block_date = p_booking_date
    AND start_hour < p_start_hour + p_duration
    AND start_hour + duration > p_start_hour;
  IF v_conflict > 0 THEN RAISE EXCEPTION 'Este horario no está disponible'; END IF;

  INSERT INTO bookings (day_of_week, booking_date, start_hour, duration, topic, branch, category, university, student_name, student_phone, status)
  VALUES (p_day, p_booking_date, p_start_hour, p_duration, p_topic, p_branch, p_category, p_university, p_student_name, p_student_phone, 'confirmada')
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION create_booking(text, date, int, int, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_booking(text, date, int, int, text, text, text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION create_teacher_block(
  p_block_date date,
  p_start_hour int,
  p_duration int,
  p_password text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_conflict int;
BEGIN
  IF p_password IS NULL OR p_password <> 'chopi2024' THEN RAISE EXCEPTION 'Contraseña incorrecta'; END IF;
  IF p_block_date < CURRENT_DATE OR p_duration NOT IN (1, 2) OR p_start_hour < 0 OR p_start_hour + p_duration > 24 THEN
    RAISE EXCEPTION 'El bloqueo no es válido';
  END IF;
  SELECT count(*) INTO v_conflict FROM teacher_blocks
  WHERE block_date = p_block_date AND start_hour < p_start_hour + p_duration AND start_hour + duration > p_start_hour;
  IF v_conflict > 0 THEN RAISE EXCEPTION 'Ese horario ya está bloqueado'; END IF;
  INSERT INTO teacher_blocks (block_date, start_hour, duration) VALUES (p_block_date, p_start_hour, p_duration) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION create_teacher_block(date, int, int, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_teacher_block(date, int, int, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION delete_teacher_block(p_block_id uuid, p_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_count int;
BEGIN
  IF p_password IS NULL OR p_password <> 'chopi2024' THEN RAISE EXCEPTION 'Contraseña incorrecta'; END IF;
  DELETE FROM teacher_blocks WHERE id = p_block_id;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END;
$$;
REVOKE ALL ON FUNCTION delete_teacher_block(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_teacher_block(uuid, text) TO anon, authenticated;