import { ApiResponse } from '@/types';

import { PickListCreateType, PickListGetAllType } from '@/types/pick-list';

import { apiClientWithClientHeader } from '@/lib/axios-config';

export const getAllPickListInformation = async (): Promise<
  PickListGetAllType[]
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<ApiResponse<PickListGetAllType[]>>(
        '/PickList/GetAll'
      );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const createPickList = async (data: PickListCreateType) => {
  try {
    const { data: res } = await apiClientWithClientHeader.post<
      ApiResponse<any>
    >('/PickList/Create', data);
    const errorMessage = res.messages?.[0] || res.Messages?.[0];

    if (res.Succeeded === false || res.succeeded === false) {
      throw new Error(errorMessage || 'Unknown error from the server');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};
