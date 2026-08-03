// InsForge Deno edge function, deployed as slug "send-message-push"
// (https://mnf8bzhv.us-east.insforge.app/functions/send-message-push).
// Invoked synchronously from the messages_realtime_trigger (see
// chat-schema.sql) on every new chat message; resolves the recipient(s) for
// the conversation, looks up their push_tokens rows, and sends an Expo push.
//
// Requires two InsForge secrets (POST /api/secrets), read via Deno.env.get:
//   INSFORGE_SERVICE_KEY — an InsForge instance/admin key (ik_...), used as
//     the SDK's `accessToken` so the function can read across users/
//     conversations/restaurants/push_tokens regardless of RLS.
//   INSFORGE_BASE_URL — auto-provisioned by InsForge for every project.
//
// To redeploy after editing: PUT /api/functions/send-message-push with
// { "code": "<this file's contents>" }.
import { createClient } from 'npm:@insforge/sdk';

export default async function (req) {
  const corsHeaders = { 'Access-Control-Allow-Origin': '*' };
  try {
    const body = await req.json();
    const { conversationId, senderId, messageBody } = body;
    if (!conversationId || !senderId) {
      return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400, headers: corsHeaders });
    }

    const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
    const serviceRoleKey = Deno.env.get('INSFORGE_SERVICE_KEY');
    const client = createClient({ baseUrl, accessToken: serviceRoleKey });

    const { data: conversation, error: convErr } = await client.database
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    if (convErr || !conversation) {
      return new Response(JSON.stringify({ error: 'conversation not found' }), { status: 404, headers: corsHeaders });
    }

    let recipientIds = [];

    async function restaurantOwnerId() {
      const { data } = await client.database.from('restaurants').select('owner_id').eq('id', conversation.restaurant_id).single();
      return data?.owner_id ?? null;
    }

    if (conversation.context_type === 'customer_driver') {
      recipientIds = [senderId === conversation.customer_id ? conversation.driver_id : conversation.customer_id];
    } else if (conversation.context_type === 'customer_restaurant') {
      const ownerId = await restaurantOwnerId();
      recipientIds = [senderId === conversation.customer_id ? ownerId : conversation.customer_id];
    } else if (conversation.context_type === 'driver_restaurant') {
      const ownerId = await restaurantOwnerId();
      recipientIds = [senderId === conversation.driver_id ? ownerId : conversation.driver_id];
    } else if (conversation.context_type === 'support') {
      if (senderId === conversation.customer_id) {
        const { data: admins } = await client.database.from('users').select('id').eq('role', 'admin');
        recipientIds = (admins ?? []).map((a) => a.id);
      } else {
        recipientIds = [conversation.customer_id];
      }
    }

    recipientIds = recipientIds.filter(Boolean);
    if (recipientIds.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: corsHeaders });
    }

    const { data: tokenRows } = await client.database.from('push_tokens').select('token').in('user_id', recipientIds);
    const tokens = (tokenRows ?? []).map((t) => t.token).filter(Boolean);
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: corsHeaders });
    }

    const truncated = (messageBody ?? '').length > 80 ? `${messageBody.slice(0, 77)}...` : (messageBody ?? '');

    await Promise.all(
      tokens.map((token) =>
        fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            to: token,
            title: 'New message',
            body: truncated,
            sound: 'default',
            data: { type: 'new_message', conversationId },
          }),
        }).catch(() => null)
      )
    );

    return new Response(JSON.stringify({ sent: tokens.length }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
}
