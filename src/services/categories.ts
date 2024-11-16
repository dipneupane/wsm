import { ApiResponse } from '@/types';

import { CategoryType } from '@/types/category';

import { apiClientWithClientHeader } from '@/lib/axios-config';

export const getAllCategories = async (): Promise<CategoryType[]> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<ApiResponse<CategoryType[]>>(
        '/category/getall'
      );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};
