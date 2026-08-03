export type ConversationContextType =
  | 'customer_driver'
  | 'customer_restaurant'
  | 'driver_restaurant'
  | 'support';

export interface Conversation {
  id: string;
  context_type: ConversationContextType;
  order_id: string | null;
  customer_id: string;
  driver_id: string | null;
  restaurant_id: string | null;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: string;
  body: string;
  created_at: string;
}

export interface NewMessageEvent {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: string;
  body: string;
  created_at: string;
}
