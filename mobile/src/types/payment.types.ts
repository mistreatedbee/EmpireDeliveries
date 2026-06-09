export type PaymentProvider = 'payfast' | 'ozow' | 'peach' | 'wallet' | 'cash';

export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  label: string;
  last4?: string;
  brand?: 'visa' | 'mastercard' | 'amex';
  expiryMonth?: number;
  expiryYear?: number;
  token?: string;
  isDefault: boolean;
}

export interface WalletBalance {
  balance: number;
  currency: 'ZAR';
}

export interface PaymentIntent {
  orderId: string;
  provider: PaymentProvider;
  redirectUrl?: string;
  checkoutId?: string;
  amount: number;
}

export interface PaymentConfirmation {
  orderId: string;
  provider: PaymentProvider;
  transactionId: string;
  status: 'success' | 'failed' | 'cancelled';
}
