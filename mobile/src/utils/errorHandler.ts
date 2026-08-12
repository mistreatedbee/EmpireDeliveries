import { AxiosError } from 'axios';
import { AppError } from '@/types/api.types';

/** Maps API / InsForge error codes to user-friendly copy. */
const ERROR_MESSAGES: Record<string, string> = {
  // InsForge auth
  AUTH_UNAUTHORIZED: 'Incorrect email or password.',
  AUTH_INVALID_CREDENTIALS: 'Incorrect email or password.',
  AUTH_EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please log in instead.',
  AUTH_USER_ALREADY_EXISTS: 'An account with this email already exists. Please log in instead.',
  AUTH_INVALID_OTP: 'That code is incorrect. Please check it and try again.',
  AUTH_OTP_INVALID: 'That code is incorrect. Please check it and try again.',
  AUTH_OTP_EXPIRED: 'That code has expired. Request a new one.',
  AUTH_USER_NOT_FOUND: 'No account found with that email.',
  AUTH_WEAK_PASSWORD: 'Password is too weak. Use at least 8 characters.',
  AUTH_EMAIL_NOT_VERIFIED: 'Please verify your email before signing in.',
  AUTH_TOKEN_EXPIRED: 'Your session expired. Please sign in again.',
  AUTH_RATE_LIMITED: 'Too many attempts. Please wait a moment and try again.',

  // Empire backend
  UNAUTHORIZED: 'Please sign in to continue.',
  TOKEN_INVALID: 'Your session expired. Please sign in again.',
  USER_NOT_FOUND: 'Account not found. Please sign up first.',
  PENDING_APPROVAL: 'Your application is still pending approval.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Contact support for help.',
  ACCOUNT_REJECTED: 'Your application was not approved.',
  SUBSCRIPTION_EXPIRED: 'Your access has expired. Please renew to continue.',
  PHONE_TAKEN: 'This phone number is already registered to another account.',
  VALIDATION_ERROR: 'Please check your details and try again.',
  FORBIDDEN: 'You do not have permission to do that.',
  NOT_FOUND: 'We could not find what you were looking for.',
  CONFLICT: 'This is no longer available. Please refresh and try again.',
  CANNOT_CANCEL: 'This order can no longer be cancelled.',
  INSUFFICIENT_FUNDS: 'Insufficient wallet balance. Please top up or choose another payment method.',
  INSUFFICIENT_POINTS: 'Not enough loyalty points.',
  ALREADY_PAID: 'This order has already been paid.',
  PAYMENT_FAILED: 'Payment could not be completed. Please try again.',
  PAYMENT_CANCELLED: 'Payment was cancelled. Your order was not completed.',
  PAYFAST_UNAVAILABLE: 'Card payment is temporarily unavailable. Try wallet or cash on delivery.',
  SERVER_ERROR: 'Something went wrong on our side. Please try again.',

  // Transport
  TIMEOUT: 'Request timed out. Check your connection and try again.',
  NETWORK_ERROR: 'No internet connection. Please try again.',
  HTTP_400: 'Invalid request. Please check your input.',
  HTTP_401: 'Please sign in to continue.',
  HTTP_403: 'You do not have permission to do that.',
  HTTP_404: 'We could not find what you were looking for.',
  HTTP_409: 'This action could not be completed. Please try again.',
  HTTP_402: 'Insufficient wallet balance. Please top up or choose another payment method.',
  HTTP_422: 'Please check your details and try again.',
  HTTP_429: 'Too many attempts. Please wait a moment and try again.',
  HTTP_500: 'Something went wrong on our side. Please try again.',
  HTTP_502: 'Our servers are temporarily unavailable. Please try again.',
  HTTP_503: 'Our servers are temporarily unavailable. Please try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

/** Known plain-English messages from APIs that should pass through as-is. */
const KNOWN_PLAIN_MESSAGES: Record<string, string> = {
  'User already exists': 'An account with this email already exists. Please log in instead.',
  'Invalid credentials': 'Incorrect email or password.',
  'Invalid token': 'Your session expired. Please sign in again.',
};

function looksLikeErrorCode(value: string): boolean {
  return /^[A-Z][A-Z0-9_]+$/.test(value.trim());
}

function getDefaultMessage(status?: number): string {
  switch (status) {
    case 400: return ERROR_MESSAGES.HTTP_400;
    case 401: return ERROR_MESSAGES.HTTP_401;
    case 403: return ERROR_MESSAGES.HTTP_403;
    case 404: return ERROR_MESSAGES.HTTP_404;
    case 409: return ERROR_MESSAGES.HTTP_409;
    case 422: return ERROR_MESSAGES.HTTP_422;
    case 429: return ERROR_MESSAGES.HTTP_429;
    case 500: return ERROR_MESSAGES.HTTP_500;
    case 502: return ERROR_MESSAGES.HTTP_502;
    case 503: return ERROR_MESSAGES.HTTP_503;
    default: return ERROR_MESSAGES.UNKNOWN;
  }
}

/** Turn an API error code + raw message into plain English for the user. */
export function humanizeErrorMessage(
  code?: string,
  rawMessage?: string,
  statusCode?: number,
): string {
  const trimmed = rawMessage?.trim();

  if (trimmed && KNOWN_PLAIN_MESSAGES[trimmed]) {
    return KNOWN_PLAIN_MESSAGES[trimmed];
  }

  if (trimmed && !looksLikeErrorCode(trimmed)) {
    return trimmed;
  }

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  if (trimmed && ERROR_MESSAGES[trimmed]) {
    return ERROR_MESSAGES[trimmed];
  }

  if (statusCode) {
    return getDefaultMessage(statusCode);
  }

  if (trimmed && looksLikeErrorCode(trimmed)) {
    return ERROR_MESSAGES[trimmed] ?? ERROR_MESSAGES.UNKNOWN;
  }

  return ERROR_MESSAGES.UNKNOWN;
}

export function parseApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response?.data) {
      const data = response.data as { code?: string; error?: string; message?: string; field?: string };
      const code = data.code ?? data.error ?? `HTTP_${response.status}`;
      const rawMessage = data.message;
      return {
        code,
        message: humanizeErrorMessage(code, rawMessage, response.status),
        field: data.field,
        statusCode: response.status,
      };
    }
    if (error.code === 'ECONNABORTED') {
      return { code: 'TIMEOUT', message: ERROR_MESSAGES.TIMEOUT, statusCode: 0 };
    }
    if (!error.response) {
      return { code: 'NETWORK_ERROR', message: ERROR_MESSAGES.NETWORK_ERROR, statusCode: 0 };
    }
    const code = `HTTP_${response?.status}`;
    return {
      code,
      message: humanizeErrorMessage(code, undefined, response?.status),
      statusCode: response?.status,
    };
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as AppError;
    return {
      code: err.code ?? 'UNKNOWN',
      message: humanizeErrorMessage(err.code, err.message, err.statusCode),
      field: err.field,
      statusCode: err.statusCode,
    };
  }

  return { code: 'UNKNOWN', message: ERROR_MESSAGES.UNKNOWN, statusCode: 0 };
}

/** Use in catch blocks and onError handlers before showing a toast or alert. */
export function getUserErrorMessage(
  error: unknown,
  fallback = ERROR_MESSAGES.UNKNOWN,
): string {
  if (!error) return fallback;
  if (typeof error === 'string') {
    if (!error.trim()) return fallback;
    const msg = humanizeErrorMessage(undefined, error);
    return msg === ERROR_MESSAGES.UNKNOWN && fallback !== ERROR_MESSAGES.UNKNOWN ? fallback : msg;
  }
  if (typeof error === 'object' && error !== null) {
    const err = error as AppError & { error?: string };
    const code = err.code ?? err.error;
    if (code || err.message) {
      return humanizeErrorMessage(code, err.message, err.statusCode);
    }
  }
  if (error instanceof Error) {
    return humanizeErrorMessage(undefined, error.message);
  }
  return fallback;
}
