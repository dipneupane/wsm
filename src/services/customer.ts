import { ApiResponse } from '@/types';

import {
  CustomerCreateType,
  CustomerGetAllType,
  CustomerGetByIDType,
  CustomerGetHistoryType,
  CustomerUpdateType,
} from '@/types/customer';

import { apiClientWithClientHeader } from '@/lib/axios-config';

export const getAllCustomerInformation = async (): Promise<
  CustomerGetAllType[]
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<ApiResponse<CustomerGetAllType[]>>(
        '/Customer/GetAll'
      );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const createCustomer = async (data: CustomerCreateType) => {
  try {
    const response = await apiClientWithClientHeader.post<ApiResponse<any>>(
      '/Customer/Create',
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

export const getCustomerById = async (
  id: number
): Promise<CustomerGetByIDType> => {
  try {
    const { data } = await apiClientWithClientHeader.get<
      ApiResponse<CustomerGetByIDType>
    >(`/Customer/GetById?Id=${id}`);
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id: number) => {
  try {
    const response = await apiClientWithClientHeader.delete<ApiResponse<any>>(
      `/Customer/Delete?Id=${id}`
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

export const updateCustomer = async (data: CustomerUpdateType) => {
  try {
    const response = await apiClientWithClientHeader.put<ApiResponse<any>>(
      '/Customer/Update',
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

export const getCustomerHistoryById = async (
  id: number
): Promise<CustomerGetHistoryType> => {
  try {
    const { data } = await apiClientWithClientHeader.get<
      ApiResponse<CustomerGetHistoryType>
    >(`/Customer/GetHistory?Id=${id}`);
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};
