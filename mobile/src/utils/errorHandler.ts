import { AxiosError } from 'axios';
import { AppError } from '@/types/api.types';

export function parseApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response?.data) {
      const data = response.data as { code?: string; message?: string; field?: string };
      return {
        code: data.code ?? `HTTP_${response.status}`,
        message: data.message ?? getDefaultMessage(response.status),
        field: data.field,
        statusCode: response.status,
      };
    }
    if (error.code === 'ECONNABORTED') {
      return { code: 'TIMEOUT', message: 'Request timed out. Please check your connection.', statusCode: 0 };
    }
    if (!error.response) {
      return { code: 'NETWORK_ERROR', message: 'No internet connection. Please try again.', statusCode: 0 };
    }
    return { code: `HTTP_${response?.status}`, message: getDefaultMessage(response?.status), statusCode: response?.status };
  }
  return { code: 'UNKNOWN', message: 'An unexpected error occurred.', statusCode: 0 };
}

function getDefaultMessage(status?: number): string {
  switch (status) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Session expired. Please log in again.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflict occurred. Please try again.';
    case 422: return 'Validation failed. Please check your input.';
    case 429: return 'Too many requests. Please wait a moment.';
    case 500: return 'Server error. Please try again later.';
    default: return 'Something went wrong. Please try again.';
  }
}
