import * as WebBrowser from 'expo-web-browser';
import { Config } from '@/constants/config';
import api from './api';
import { orderService } from './order.service';
import { PaymentIntent, PaymentConfirmation, PaymentMethod, WalletTransaction } from '@/types/payment.types';
import { ApiResponse } from '@/types/api.types';
import { parseApiError } from '@/utils/errorHandler';

export type PaymentBrowserResult = 'success' | 'cancelled' | 'dismissed';

const REDIRECT_PREFIX = `${Config.API_BASE_URL}/payments/payfast/`;

async function openPaymentBrowser(redirectUrl: string): Promise<PaymentBrowserResult> {
  try {
    const result = await WebBrowser.openAuthSessionAsync(redirectUrl, REDIRECT_PREFIX);
    if (result.type === 'success' && result.url) {
      if (result.url.includes('/payments/payfast/return') || result.url.includes('payment/success')) {
        return 'success';
      }
      if (result.url.includes('/payments/payfast/cancel') || result.url.includes('payment/cancelled')) {
        return 'cancelled';
      }
    }
    if (result.type === 'cancel' || result.type === 'dismiss') return 'cancelled';
    return 'dismissed';
  } catch (error) {
    throw parseApiError(error);
  }
}

async function waitForPaidOrder(orderId: string, attempts = 20): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    const status = await orderService.getPaymentStatus(orderId);
    if (status.paymentStatus === 'paid') return true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return false;
}

export const paymentService = {
  async initiatePayFast(orderId: string): Promise<PaymentBrowserResult> {
    const res = await api.post<never, ApiResponse<PaymentIntent>>('/payments/payfast/initiate', { orderId });
    const { redirectUrl } = res.data;
    if (!redirectUrl) throw new Error('PayFast could not be started. Please try again.');
    const browserResult = await openPaymentBrowser(redirectUrl);
    if (browserResult === 'success') {
      await api.post('/payments/confirm', { orderId }).catch(() => undefined);
      await waitForPaidOrder(orderId);
    }
    return browserResult;
  },

  async payWithWallet(orderId: string): Promise<{ newBalance: number }> {
    const res = await api.post<never, ApiResponse<{ newBalance: number }>>('/payments/wallet/pay', { orderId });
    return res.data;
  },

  async getWalletBalance(): Promise<number> {
    const res = await api.get<never, ApiResponse<{ balance: number }>>('/payments/wallet/balance');
    return res.data.balance;
  },

  async getWalletTransactions(): Promise<WalletTransaction[]> {
    const res = await api.get<never, ApiResponse<WalletTransaction[]>>('/payments/wallet/transactions');
    return res.data;
  },

  async topupWallet(amount: number): Promise<PaymentBrowserResult> {
    const res = await api.post<never, ApiResponse<{ redirectUrl: string }>>('/payments/wallet/topup', { amount });
    const { redirectUrl } = res.data;
    if (!redirectUrl) throw new Error('Wallet top-up could not be started.');
    return openPaymentBrowser(redirectUrl);
  },

  async confirmPayment(confirmation: PaymentConfirmation): Promise<void> {
    await api.post('/payments/confirm', confirmation);
  },

  async getSavedMethods(): Promise<PaymentMethod[]> {
    const res = await api.get<never, ApiResponse<PaymentMethod[]>>('/users/payment-methods');
    return res.data;
  },

  async deleteMethod(id: string): Promise<void> {
    await api.delete(`/users/payment-methods/${id}`);
  },

  async setDefaultMethod(id: string): Promise<void> {
    await api.put(`/users/payment-methods/${id}/default`);
  },
};
