import { ApiResponse } from '@/types';

import {
  AssemblyCreateType,
  AssemblyGetAllType,
  AssemblyGetByIDType,
  AssemblyUpdateType,
} from '@/types/assembly';

import { apiClientWithClientHeader } from '@/lib/axios-config';

export const getAllAssemblyInformation = async (): Promise<
  AssemblyGetAllType[]
> => {
  try {
    const { data } =
      await apiClientWithClientHeader.get<ApiResponse<AssemblyGetAllType[]>>(
        '/Assembly/GetAll'
      );

    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const createAssembly = async (data: AssemblyCreateType) => {
  try {
    const response = await apiClientWithClientHeader.post<ApiResponse<any>>(
      '/Assembly/Create',
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

export const getAssemblyById = async (
  id: number
): Promise<AssemblyGetByIDType> => {
  try {
    const { data } = await apiClientWithClientHeader.get<
      ApiResponse<AssemblyGetByIDType>
    >(`/Assembly/GetById?Id=${id}`);
    if (!data.succeeded) {
      throw new Error(data.messages[0] || 'Unknown error from the server');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAssembly = async (id: number) => {
  try {
    const response = await apiClientWithClientHeader.delete<ApiResponse<any>>(
      `/Assembly/Delete?Id=${id}`
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

export const updateAssembly = async (data: AssemblyUpdateType) => {
  try {
    const response = await apiClientWithClientHeader.put<ApiResponse<any>>(
      '/Assembly/Update',
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
