import { ApiResponse } from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { apiClientWithoutHeader } from '@/lib/axios-config';

type UserAuthType = {
  id: number;
  email: string;
  role: string;
  jwt: string;
  refreshToken: string;
};

export const renewToken = async (
  refreshToken: string
): Promise<UserAuthType | null> => {
  try {
    const { data } = await apiClientWithoutHeader.post<
      ApiResponse<UserAuthType>
    >('/Account/renewToken', {
      // refreshToken:refreshToken,
      refreshToken:
        'CfDJ8L6BpPC4HuhFu6/92p9uStHj80ay37QrFaCQbUULtGlTo5/DNFLlO0UdgY8KcAbHk1rwGPgXvzHN72tQzWzYIZyXqpjZyxC3qaOIsDd3WoxHseXt9+m8k26fWJsweO6WlEsCosJiOvSwtgzWz7daUeA178WrXlUhH1mH7P/NlCp4DUC0DGNTZFsHyVKTDd2YBQ==',
    });
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }

    return data.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 401) {
      console.log('401');
      toast.error('Session expired, please login again');
      return null;
    }
    throw error;
  }
};
