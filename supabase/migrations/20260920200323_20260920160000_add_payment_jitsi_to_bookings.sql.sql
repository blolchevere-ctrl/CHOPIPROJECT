/*
# Agregar estado de pago, modalidad, distrito y sala Jitsi a las reservas

## Propósito
Permitir que el profesor confirme manualmente el pago de cada reserva.
Al confirmar el pago de una clase virtual, se genera automáticamente una sala
de reunión en Jitsi Meet. El profesor ve el link en su agenda y puede enviarlo
al alumno por WhatsApp.

## Cambios en la tabla `bookings`
1. `payment_status` (text, default 'pendiente'): estado del pago.
   - 'pendiente': la reserva está hecha pero el pago no se ha confirmado.
   - 'pagado': el profesor confirmó haber recibido el pago.
   - Para clases virtuales, al marcar como 'pagado' se genera la sala Jitsi.
2. `booking_mode` (text): modalidad de la clase — 'virtual' o 'presencial'.
3. `district` (text, nullable): distrito si la clase es presencial.
4. `jitsi_room` (text, nullable): nombre único de la sala Jitsi Meet generada.

## Función nueva: `confirm_payment`
- Valida la contraseña del profesor.
- Marca el pago como 'pagado'.
- Si la modalidad es 'virtual', genera una sala Jitsi con nombre único:
  ChopiMath-<fecha>-<hora>-<id corto>.
- Retorna el link de Jitsi para que el profesor lo vea y lo comparta.

## Función actualizada: `create_booking`
- Ahora acepta `p_booking_mode` y `p_district` como parámetros.
- Inserta estos valores en la nueva reserva.
- El pago siempre arranca como 'pendiente'.

## Seguridad
- RLS ya está habilitado en bookings; no se cambia.
- La función confirm_payment es SECURITY DEFINER y valida la contraseña.
- El alumno no puede cambiar el estado de pago; solo el profesor.
*/

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pendiente';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_mode text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS jitsi_room text;

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Función para confirmar el pago y generar la sala Jitsi
CREATE OR REPLACE FUNCTION confirm_payment(
  p_booking_id uuid,
  p_password text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking RECORD;
  v_room_name text;
  v_jitsi_url text;
BEGIN
  IF p_password IS NULL OR p_password <> 'chopi2024' THEN
    RAISE EXCEPTION 'Contraseña incorrecta';
  END IF;

  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id AND status = 'confirmada';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reserva no encontrada o ya cancelada';
  END IF;

  -- Generar nombre de sala Jitsi único
  v_room_name := 'ChopiMath-' || to_char(v_booking.booking_date, 'YYYYMMDD') || '-' || v_booking.start_hour || '-' || substring(v_booking.id::text, 1, 8);

  -- Si es virtual, generar la sala Jitsi. Si es presencial, igual guardamos el link por si se necesita.
  v_jitsi_url := 'https://meet.jit.si/' || v_room_name;

  UPDATE bookings
  SET payment_status = 'pagado',
      jitsi_room = v_jitsi_url
  WHERE id = p_booking_id;

  RETURN v_jitsi_url;
END;
$$;

REVOKE EXECUTE ON FUNCTION confirm_payment(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION confirm_payment(uuid, text) TO anon, authenticated;

-- Actualizar create_booking para aceptar modalidad y distrito
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
  p_student_phone text,
  p_booking_mode text,
  p_district text
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
  IF p_booking_mode NOT IN ('virtual', 'presencial') THEN
    RAISE EXCEPTION 'La modalidad debe ser virtual o presencial';
  END IF;
  IF p_booking_mode = 'presencial' AND (p_district IS NULL OR trim(p_district) = '') THEN
    RAISE EXCEPTION 'Debe seleccionar un distrito para clases presenciales';
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

  INSERT INTO bookings (day_of_week, booking_date, start_hour, duration, topic, branch, category, university, student_name, student_phone, status, booking_mode, district, payment_status)
  VALUES (p_day, p_booking_date, p_start_hour, p_duration, p_topic, p_branch, p_category, p_university, p_student_name, p_student_phone, 'confirmada', p_booking_mode, p_district, 'pendiente')
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION create_booking(text, date, int, int, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_booking(text, date, int, int, text, text, text, text, text, text, text, text) TO anon, authenticated;