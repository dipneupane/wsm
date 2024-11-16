import axios from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Improved error handler for better consistency
export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    // Axios-specific error with response details
    const message =
      error.response?.data?.messages?.[0] || 'An unexpected error occurred';
    const statusCode = error.response?.status;
    throw new ApiError(message, statusCode);
  } else {
    // General or network error
    throw new ApiError('Network error, please try again.');
  }
};
