import { ApiResponse } from '@/types';

import {
  InventoryItemCreateType,
  InventoryItemGetByIdType,
  InventoryItemsGetAllType,
  InventoryItemUpdateType,
} from '@/types/inventory-items';

import {
  apiClientWithClientHeader,
  apiClientWithoutHeader,
} from '@/lib/axios-config';

export const getAllInventoryItems = async (): Promise<
  InventoryItemsGetAllType[] | undefined
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<
        ApiResponse<InventoryItemsGetAllType[]>
      >('/Item/GetAll');
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};
export const createInventoryItem = async (
  createItemdata: InventoryItemCreateType
): Promise<any> => {
  try {
    const { data } = await apiClientWithClientHeader.post<ApiResponse<any>>(
      '/Item/Create',
      createItemdata
    );
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};
export const editInventoryItem = async (
  createItemdata: InventoryItemUpdateType
) => {
  try {
    const { data } = await apiClientWithClientHeader.put<ApiResponse<any>>(
      '/Item/Update',
      createItemdata
    );
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryItem = async (id: number): Promise<any> => {
  try {
    const { data } = await apiClientWithClientHeader.delete<ApiResponse<any>>(
      `/Item/Delete?Id=${id}`
    );
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemById = async (
  id: number
): Promise<InventoryItemGetByIdType> => {
  try {
    const { data } = await apiClientWithClientHeader.get<ApiResponse<any>>(
      `Item/GetById?Id=${id}`
    );
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};
