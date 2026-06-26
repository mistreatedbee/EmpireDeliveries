import * as WebBrowser from 'expo-web-browser';
import { Config } from '@/constants/config';
import api from './api';
import { PaymentIntent, PaymentConfirmation, PaymentMethod, WalletTransaction } from '@/types/payment.types';
import { ApiResponse } from '@/types/api.types';

export const paymentService = {
  async initiatePayFast(orderId: string): Promise<void> {
    const res = await api.post<never, ApiResponse<PaymentIntent>>('/payments/payfast/initiate', { orderId });
    const { redirectUrl } = res.data;
    if (!redirectUrl) return;
    await WebBrowser.openAuthSessionAsync(redirectUrl, `${Config.APP_SCHEME}://`);
  },

  async initiateOzow(orderId: string): Promise<void> {
    const res = await api.post<never, ApiResponse<PaymentIntent>>('/payments/ozow/initiate', { orderId });
    const { redirectUrl } = res.data;
    if (!redirectUrl) return;
    await WebBrowser.openAuthSessionAsync(redirectUrl, `${Config.APP_SCHEME}://`);
  },

  async initiatePeach(orderId: string): Promise<void> {
    const res = await api.post<never, ApiResponse<PaymentIntent>>('/payments/peach/initiate', { orderId });
    const { redirectUrl } = res.data;
    if (!redirectUrl) return;
    await WebBrowser.openAuthSessionAsync(redirectUrl, `${Config.APP_SCHEME}://`);
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

  async topupWallet(amount: number): Promise<void> {
    const res = await api.post<never, ApiResponse<{ redirectUrl: string }>>('/payments/wallet/topup', { amount });
    const { redirectUrl } = res.data;
    if (!redirectUrl) return;
    await WebBrowser.openAuthSessionAsync(redirectUrl, `${Config.APP_SCHEME}://`);
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
