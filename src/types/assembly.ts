import { InventoryItemsGetAllType } from './inventory-items';

interface AssemblyBase {
  code: string;
  description: string;
  items: Number[];
}

interface AssemblyGetAll {
  id: number;
  code: string;
  description: string;
  totalCost: number;
  totalItems: number;
}

interface AssemblyGetByID {
  id: number;
  code: string;
  description: string;
  totalCost: number;
  totalItems: number;
  items: InventoryItemsGetAllType[];
}

export type AssemblyCreateType = AssemblyBase;
export type AssemblyGetByIDType = AssemblyGetByID;
export type AssemblyUpdateType = AssemblyBase;
export type AssemblyGetAllType = AssemblyGetAll;
