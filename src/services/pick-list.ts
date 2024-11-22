import { ApiResponse } from '@/types';

import {
  PickListCreateType,
  PickListGetAllType,
  PickListGetByIdType,
} from '@/types/pick-list';

import { apiClientWithClientHeader } from '@/lib/axios-config';

interface filterProps
  {
    "filterText": string,
    "filterParams": any[]
  }

export const getAllPickListInformation = async (filter:filterProps = {
  "filterText": "",
  "filterParams": []
}): Promise<
  PickListGetAllType[]
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.post<ApiResponse<PickListGetAllType[]>>(
        '/PickList/GetAll', filter
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
export const downloadPickListProductionSheet = async (id: number) => {
  try {
    const response = await apiClientWithClientHeader.get(
      `/PickList/DownloadProductionSheet?id=${id}`,
      {
        responseType: 'blob', // This is crucial for handling binary data.
      }
    );

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    let filename = `production-sheet-${currentDate}.pdf`; // Filename with current date

    return { blob: response.data, filename };
  } catch (error) {
    throw error;
  }
};

export const getPickListById = async (
  id: number
): Promise<PickListGetByIdType> => {
  try {
    const { data } = await apiClientWithClientHeader.get<ApiResponse<any>>(
      `/PickList/GetById?id=${id}`
    );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const updatePickList = async (
  data: PickListCreateType
): Promise<void> => {
  try {
    const { data: res } = await apiClientWithClientHeader.put<ApiResponse<any>>(
      `/PickList/Update`,
      data
    );

    if (res.succeeded === false) {
      throw new Error(res.messages?.[0] || res.Messages?.[0]);
    }
  } catch (error) {
    throw error;
  }
};
