-- Reference copy of the chat feature's InsForge schema (applied live via the
-- InsForge migrations API, not run from this repo). Kept here so the schema,
-- RLS policies, and realtime/push trigger aren't only visible in the InsForge
-- dashboard. If you need to reapply/modify, use the InsForge SQL editor or
-- POST /api/database/migrations.

CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type text NOT NULL CHECK (context_type IN ('customer_driver','customer_restaurant','driver_restaurant','support')),
  order_id uuid NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  driver_id uuid NULL REFERENCES public.users(id) ON DELETE CASCADE,
  restaurant_id uuid NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_role text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id, created_at);
CREATE INDEX idx_conversations_customer_id ON public.conversations(customer_id);
CREATE INDEX idx_conversations_driver_id ON public.conversations(driver_id);
CREATE INDEX idx_conversations_restaurant_id ON public.conversations(restaurant_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- InsForge's auth.uid() is the InsForge-native auth user id, which is NOT the
-- same as this app's own public.users.id (Express generates its own id at
-- /auth/sync time) — the two are linked only by matching email. Every policy
-- below resolves the caller's app-level user id through this helper first.
CREATE OR REPLACE FUNCTION public.current_app_user_id()
RETURNS uuid AS $$
  SELECT u.id FROM public.users u
  JOIN auth.users au ON au.email = u.email
  WHERE au.id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id uuid, uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations c
    LEFT JOIN public.restaurants r ON r.id = c.restaurant_id
    WHERE c.id = conv_id
      AND (
        (c.context_type = 'customer_driver' AND (c.customer_id = uid OR c.driver_id = uid))
        OR (c.context_type = 'customer_restaurant' AND (c.customer_id = uid OR r.owner_id = uid))
        OR (c.context_type = 'driver_restaurant' AND (c.driver_id = uid OR r.owner_id = uid))
        OR (c.context_type = 'support' AND (c.customer_id = uid OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = uid AND u.role = 'admin')))
      )
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE POLICY "participants_select_conversations"
ON public.conversations FOR SELECT
USING (public.is_conversation_participant(id, public.current_app_user_id()));

CREATE POLICY "participants_insert_conversations"
ON public.conversations FOR INSERT
WITH CHECK (
  customer_id = public.current_app_user_id()
  OR driver_id = public.current_app_user_id()
  OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = public.current_app_user_id())
);

CREATE POLICY "participants_select_messages"
ON public.messages FOR SELECT
USING (public.is_conversation_participant(conversation_id, public.current_app_user_id()));

CREATE POLICY "participants_insert_messages"
ON public.messages FOR INSERT
WITH CHECK (
  sender_id = public.current_app_user_id()
  AND public.is_conversation_participant(conversation_id, public.current_app_user_id())
);

CREATE POLICY "participants_subscribe_conversation_channel"
ON realtime.channels FOR SELECT
USING (
  pattern LIKE 'conversation:%'
  AND public.is_conversation_participant(
    (regexp_replace(pattern, '^conversation:', ''))::uuid,
    public.current_app_user_id()
  )
);

-- On every new message: publish it over realtime, bump the conversation's
-- last_message_at, and synchronously call the send-message-push edge
-- function (see send-message-push.function.js) to deliver an Expo push
-- notification to the recipient(s) for background/closed-app delivery.
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.publish(
    'conversation:' || NEW.conversation_id::text,
    'new_message',
    jsonb_build_object(
      'id', NEW.id,
      'conversation_id', NEW.conversation_id,
      'sender_id', NEW.sender_id,
      'sender_role', NEW.sender_role,
      'body', NEW.body,
      'created_at', NEW.created_at
    )
  );
  UPDATE public.conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;

  BEGIN
    PERFORM http_post(
      'https://mnf8bzhv.us-east.insforge.app/functions/send-message-push',
      jsonb_build_object(
        'conversationId', NEW.conversation_id,
        'senderId', NEW.sender_id,
        'messageBody', NEW.body
      )::text,
      'application/json'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Never let a push-notification failure block the message insert itself.
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER messages_realtime_trigger
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.notify_new_message();

-- Also applied (not chat-specific, but required for chat conversation
-- creation to resolve missing participant ids): a read-only, participant-
-- scoped SELECT policy was attempted on public.orders but rejected because
-- the InsForge admin key isn't the owner of that table (Express's own DB role
-- owns it, having created it via its own migrations). Orders RLS was NOT
-- enabled — instead, conversation creation is seeded entirely from the
-- customer's app (the only side with all three participant ids available),
-- see mobile/src/services/chat.service.ts ensureOrderConversations().
