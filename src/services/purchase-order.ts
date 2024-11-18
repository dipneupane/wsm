import { ApiResponse } from '@/types';

import { PurchaseOrderGetAllType,PurchaseOrderCreateType, PurchaseOrderGetByIdType, PurchaseOrderUpdateType } from '@/types/purchase-order';

import { apiClientWithClientHeader } from '@/lib/axios-config';

export const getAllPurchaseOrderInformation = async (): Promise<
  PurchaseOrderGetAllType[]
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<ApiResponse<PurchaseOrderGetAllType[]>>(
        '/PurchaseOrder/GetAll'
      );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const createPurchaseOrder = async (data: PurchaseOrderCreateType) => {
  try {
    const { data: res } = await apiClientWithClientHeader.post<
      ApiResponse<any>
    >('/PurchaseOrder/Create', data);
    const errorMessage = res.messages?.[0] || res.Messages?.[0];

    if (res.Succeeded === false || res.succeeded === false) {
      throw new Error(errorMessage || 'Unknown error from the server');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseOrderById = async (
  id: number
): Promise<any> => {
  try {
    const { data } = await apiClientWithClientHeader.get<ApiResponse<PurchaseOrderGetByIdType>>(
      `/PurchaseOrder/GetById?Id=${id}`
    );
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};


export const updatePurchaseOrder = async (data: PurchaseOrderUpdateType) => {
  try {
    const { data: res } = await apiClientWithClientHeader.put<
      ApiResponse<any>
    >('/PurchaseOrder/Update', data);
    const errorMessage = res.messages?.[0] || res.Messages?.[0];

    if (res.Succeeded === false || res.succeeded === false) {
      throw new Error(errorMessage || 'Unknown error from the server');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};
