-- =====================================================
-- 001_init.sql: core schema
-- Money is stored in paise (integer). 49900 = Rs 499.00
-- =====================================================

-- People who joined the community (Community page form)
CREATE TABLE members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  email         text NOT NULL CHECK (char_length(email) <= 120),
  interests     text[] NOT NULL DEFAULT '{}',
  consent_given boolean NOT NULL CHECK (consent_given),
  created_at    timestamptz NOT NULL DEFAULT now()
);
-- The same email (any capitalisation) can only join once
CREATE UNIQUE INDEX members_email_unique ON members (lower(email));

-- Events
CREATE TABLE events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  name         text NOT NULL,
  description  text NOT NULL DEFAULT '',
  starts_at    timestamptz,
  venue        text,
  city         text,
  is_published boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Ticket categories with inventory
CREATE TABLE ticket_types (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name              text NOT NULL,
  description       text NOT NULL DEFAULT '',
  benefits          text[] NOT NULL DEFAULT '{}',
  price_paise       integer NOT NULL CHECK (price_paise >= 0),
  quantity_total    integer NOT NULL CHECK (quantity_total >= 0),
  quantity_sold     integer NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),
  quantity_reserved integer NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
  max_per_order     integer NOT NULL DEFAULT 10 CHECK (max_per_order BETWEEN 1 AND 20),
  sales_start       timestamptz,
  sales_end         timestamptz,
  is_active         boolean NOT NULL DEFAULT false,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  -- The database itself refuses to oversell, even if our code has a bug
  CONSTRAINT no_overselling CHECK (quantity_sold + quantity_reserved <= quantity_total)
);

-- Orders (one per checkout)
CREATE TABLE orders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref    text NOT NULL UNIQUE,
  event_id       uuid NOT NULL REFERENCES events(id),
  buyer_name     text NOT NULL,
  buyer_email    text NOT NULL,
  buyer_phone    text,
  status         text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','paid','failed','cancelled','expired','refunded')),
  subtotal_paise integer NOT NULL CHECK (subtotal_paise >= 0),
  fees_paise     integer NOT NULL DEFAULT 0 CHECK (fees_paise >= 0),
  total_paise    integer NOT NULL CHECK (total_paise >= 0),
  currency       text NOT NULL DEFAULT 'INR',
  expires_at     timestamptz,
  paid_at        timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT total_matches CHECK (total_paise = subtotal_paise + fees_paise)
);
CREATE INDEX orders_email_idx ON orders (lower(buyer_email));
CREATE INDEX orders_status_idx ON orders (status);

-- What was bought in each order (price is copied so later price edits don't change old orders)
CREATE TABLE order_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_type_id   uuid NOT NULL REFERENCES ticket_types(id),
  quantity         integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  unit_price_paise integer NOT NULL CHECK (unit_price_paise >= 0)
);

-- Payment records (the payment gateway handles all card details; we never store them)
CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders(id),
  provider            text NOT NULL DEFAULT 'razorpay',
  provider_order_id   text NOT NULL UNIQUE,
  provider_payment_id text UNIQUE,   -- UNIQUE stops the same payment being recorded twice
  status              text NOT NULL DEFAULT 'created'
                      CHECK (status IN ('created','captured','failed','refunded')),
  amount_paise        integer NOT NULL CHECK (amount_paise >= 0),
  signature_verified  boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Log of webhook calls from the payment gateway (UNIQUE = each event processed once)
CREATE TABLE webhook_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider          text NOT NULL,
  provider_event_id text NOT NULL,
  event_type        text NOT NULL,
  payload           jsonb NOT NULL,
  received_at       timestamptz NOT NULL DEFAULT now(),
  processed_at      timestamptz,
  UNIQUE (provider, provider_event_id)
);

-- Individual issued tickets (created only after verified payment)
CREATE TABLE tickets (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       uuid NOT NULL REFERENCES orders(id),
  ticket_type_id uuid NOT NULL REFERENCES ticket_types(id),
  ticket_code    text NOT NULL UNIQUE,   -- the random value inside the QR code
  holder_name    text,
  status         text NOT NULL DEFAULT 'valid'
                 CHECK (status IN ('valid','checked_in','cancelled')),
  checked_in_at  timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT checkin_consistent CHECK ((status = 'checked_in') = (checked_in_at IS NOT NULL))
);
CREATE INDEX tickets_order_idx ON tickets (order_id);

-- Admin and staff accounts
CREATE TABLE admin_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  name          text,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('owner','admin','staff','scanner')),
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX admin_users_email_unique ON admin_users (lower(email));

-- Every QR scan attempt (successful, duplicate or invalid)
CREATE TABLE check_ins (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id    uuid REFERENCES tickets(id),
  scanned_code text NOT NULL,
  result       text NOT NULL CHECK (result IN ('success','duplicate','invalid','cancelled')),
  scanned_by   uuid REFERENCES admin_users(id),
  scanned_at   timestamptz NOT NULL DEFAULT now()
);