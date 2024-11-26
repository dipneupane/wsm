import { ApiResponse } from '@/types';

import { PurchaseOrderGetBySupplierIDType } from '@/types/pick-list';
import {
  PurchaseOrderCreateType,
  PurchaseOrderGetAllType,
  PurchaseOrderGetByIdType,
  PurchaseOrderUpdateType,
} from '@/types/purchase-order';

import { apiClientWithClientHeader } from '@/lib/axios-config';

interface filterProps {
  filterText: string;
  filterParams: any[];
}
export const getPurchaseOrderNumber = async (): Promise<any> => {
  try {
    const { data } = await apiClientWithClientHeader.get<ApiResponse<string[]>>(
      '/PurchaseOrder/GetPurchaseOrderNumber'
    );
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPurchaseOrderInformation = async (
  filter: filterProps = { filterText: '', filterParams: [] }
): Promise<PurchaseOrderGetAllType[]> => {
  try {
    const { data } = await apiClientWithClientHeader.post<
      ApiResponse<PurchaseOrderGetAllType[]>
    >('/PurchaseOrder/GetAll', filter);

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

export const getPurchaseOrderById = async (id: number): Promise<any> => {
  try {
    const { data } = await apiClientWithClientHeader.get<
      ApiResponse<PurchaseOrderGetByIdType>
    >(`/PurchaseOrder/GetById?Id=${id}`);
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
    const { data: res } = await apiClientWithClientHeader.put<ApiResponse<any>>(
      '/PurchaseOrder/Update',
      data
    );
    const errorMessage = res.messages?.[0] || res.Messages?.[0];

    if (res.Succeeded === false || res.succeeded === false) {
      throw new Error(errorMessage || 'Unknown error from the server');
    }
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPurchaseOrderBySupplierID = async (
  id: number
): Promise<PurchaseOrderGetBySupplierIDType[]> => {
  try {
    const { data } = await apiClientWithClientHeader.get<
      ApiResponse<PurchaseOrderGetBySupplierIDType[]>
    >(`/PurchaseOrder/GetBySupplierId?SupplierId=${id}`);
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};
