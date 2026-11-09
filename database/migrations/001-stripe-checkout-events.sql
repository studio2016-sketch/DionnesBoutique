CREATE TABLE IF NOT EXISTS public.stripe_checkout_events (
 account_id text NOT NULL,
 event_id text NOT NULL,
 session_id text NOT NULL,
 event_type text NOT NULL,
 event_created_at timestamptz NOT NULL,
 payment_state text NOT NULL CHECK (payment_state IN ('PAID','PENDING','FAILED','EXPIRED')),
 amount_total bigint CHECK (amount_total IS NULL OR amount_total>=0),
 currency text,
 processing_status text NOT NULL DEFAULT 'PENDING' CHECK (processing_status IN ('PENDING','PROCESSED','REVIEW')),
 received_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(account_id,event_id)
);
CREATE INDEX IF NOT EXISTS stripe_checkout_events_pending_idx ON public.stripe_checkout_events(processing_status,received_at);
CREATE INDEX IF NOT EXISTS stripe_checkout_events_session_idx ON public.stripe_checkout_events(account_id,session_id);
