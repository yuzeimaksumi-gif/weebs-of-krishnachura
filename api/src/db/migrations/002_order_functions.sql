-- =====================================================
-- 002_order_functions.sql
-- Stock handling lives inside the database so that it is
-- all-or-nothing and safe when many people buy at once.
-- =====================================================

-- Gives back stock held by pending orders whose time ran out
CREATE OR REPLACE FUNCTION release_expired_orders() RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  WITH expired AS (
    UPDATE orders
       SET status = 'expired', updated_at = now()
     WHERE status = 'pending'
       AND expires_at IS NOT NULL
       AND expires_at < now()
    RETURNING id
  ),
  released AS (
    SELECT oi.ticket_type_id, SUM(oi.quantity)::integer AS qty
      FROM order_items oi
      JOIN expired e ON e.id = oi.order_id
     GROUP BY oi.ticket_type_id
  )
  UPDATE ticket_types t
     SET quantity_reserved = t.quantity_reserved - r.qty,
         updated_at = now()
    FROM released r
   WHERE t.id = r.ticket_type_id;
END;
$$;

-- Creates a pending order and reserves stock, or fails without changing anything.
CREATE OR REPLACE FUNCTION create_pending_order(
  p_event_id     uuid,
  p_buyer_name   text,
  p_buyer_email  text,
  p_buyer_phone  text,
  p_items        jsonb,
  p_booking_ref  text,
  p_hold_minutes integer
)
RETURNS TABLE (
  out_order_id    uuid,
  out_booking_ref text,
  out_total_paise integer,
  out_expires_at  timestamptz
)
LANGUAGE plpgsql AS $$
DECLARE
  r         record;
  tt        ticket_types%ROWTYPE;
  v_sub     integer := 0;
  v_order   uuid;
  v_expires timestamptz := now() + make_interval(mins => p_hold_minutes);
BEGIN
  PERFORM release_expired_orders();

  IF NOT EXISTS (SELECT 1 FROM events WHERE id = p_event_id AND is_published) THEN
    RAISE EXCEPTION 'not_available: event';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'invalid_items';
  END IF;

  -- Pass 1: lock each ticket type (always in the same order), check it, reserve stock.
  -- FOR UPDATE makes simultaneous buyers wait their turn, so nobody oversells.
  FOR r IN
    SELECT (t.item->>'ticket_type_id')::uuid AS tid,
           SUM((t.item->>'quantity')::integer)::integer AS qty
      FROM jsonb_array_elements(p_items) AS t(item)
     GROUP BY 1
     ORDER BY 1
  LOOP
    SELECT * INTO tt
      FROM ticket_types
     WHERE id = r.tid AND event_id = p_event_id
       FOR UPDATE;

    IF NOT FOUND OR NOT tt.is_active THEN
      RAISE EXCEPTION 'not_available: %', COALESCE(tt.name, 'ticket');
    END IF;

    IF (tt.sales_start IS NOT NULL AND tt.sales_start > now())
       OR (tt.sales_end IS NOT NULL AND tt.sales_end < now()) THEN
      RAISE EXCEPTION 'not_available: %', tt.name;
    END IF;

    IF r.qty < 1 OR r.qty > tt.max_per_order THEN
      RAISE EXCEPTION 'invalid_quantity: %', tt.name;
    END IF;

    IF tt.quantity_total - tt.quantity_sold - tt.quantity_reserved < r.qty THEN
      RAISE EXCEPTION 'sold_out: %', tt.name;
    END IF;

    UPDATE ticket_types
       SET quantity_reserved = quantity_reserved + r.qty, updated_at = now()
     WHERE id = tt.id;

    -- The price always comes from the database, never from the browser
    v_sub := v_sub + tt.price_paise * r.qty;
  END LOOP;

  -- Pass 2: create the order and its lines
  INSERT INTO orders (booking_ref, event_id, buyer_name, buyer_email, buyer_phone,
                      status, subtotal_paise, fees_paise, total_paise, expires_at)
  VALUES (p_booking_ref, p_event_id, p_buyer_name, p_buyer_email, p_buyer_phone,
          'pending', v_sub, 0, v_sub, v_expires)
  RETURNING id INTO v_order;

  INSERT INTO order_items (order_id, ticket_type_id, quantity, unit_price_paise)
  SELECT v_order, tt2.id, g.qty, tt2.price_paise
    FROM (
      SELECT (t.item->>'ticket_type_id')::uuid AS tid,
             SUM((t.item->>'quantity')::integer)::integer AS qty
        FROM jsonb_array_elements(p_items) AS t(item)
       GROUP BY 1
    ) g
    JOIN ticket_types tt2 ON tt2.id = g.tid;

  RETURN QUERY SELECT v_order, p_booking_ref, v_sub, v_expires;
END;
$$;