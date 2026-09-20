/*
  Función: delete_cancelled_bookings
  Permite al profesor eliminar permanentemente todas las reservas
  con estado 'cancelada', limpiando el contador de la agenda.
  Validada con la misma contraseña del profesor.
*/
CREATE OR REPLACE FUNCTION delete_cancelled_bookings(
  p_password text
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  IF p_password IS NULL OR p_password <> 'chopi2024' THEN
    RAISE EXCEPTION 'Contraseña incorrecta';
  END IF;

  DELETE FROM bookings WHERE status = 'cancelada';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE EXECUTE ON FUNCTION delete_cancelled_bookings FROM anon;
GRANT EXECUTE ON FUNCTION delete_cancelled_bookings TO anon, authenticated;
