import { ApiResponse } from '@/types';

import {
  SupplierCreateType,
  SupplierGetAllType,
  SupplierGetByIDType,
  SupplierUpdateType,
} from '@/types/supplier';

import { apiClientWithClientHeader } from '@/lib/axios-config';

export const getAllSupplierInformation = async (): Promise<
  SupplierGetAllType[]
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<ApiResponse<SupplierGetAllType[]>>(
        '/Supplier/GetAll'
      );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const createSupplier = async (data: SupplierCreateType) => {
  try {
    const response = await apiClientWithClientHeader.post<ApiResponse<any>>(
      '/Supplier/Create',
      data
    );
    if (!response.data.succeeded) {
      throw new Error(
        response.data.messages[0] || 'Unknown error from the server'
      );
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSupplierById = async (
  id: number
): Promise<SupplierGetByIDType> => {
  try {
    const { data } = await apiClientWithClientHeader.get<
      ApiResponse<SupplierGetByIDType>
    >(`/Supplier/GetById?Id=${id}`);
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSupplier = async (id: number) => {
  try {
    const response = await apiClientWithClientHeader.delete<ApiResponse<any>>(
      `/Supplier/Delete?Id=${id}`
    );
    if (!response.data.succeeded) {
      throw new Error(
        response.data.messages[0] || 'Unknown error from the server'
      );
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSupplier = async (data: SupplierUpdateType) => {
  try {
    const response = await apiClientWithClientHeader.put<ApiResponse<any>>(
      '/Supplier/Update',
      data
    );
    if (!response.data.succeeded) {
      throw new Error(
        response.data.messages[0] || 'Unknown error from the server'
      );
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
