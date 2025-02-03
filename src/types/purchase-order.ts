// Base interface for Purchase Order items
interface IPurchaseOrderItemsBase {
  id: number;
  itemId: number;
  description: string;
  quantity: number;
  receivedQuantity: number;
  unitPrice: number;
  itemCode: string;
}

// Extended interface for Purchase Order items used in getById
interface IPurchaseOrderItemsGetById extends IPurchaseOrderItemsBase {
  id: number;
  purchaseOrderId: number;
  total: number;
}

// Interface for Purchase Order items used in update
interface IPurchaseOrderItemsUpdate extends IPurchaseOrderItemsBase {
  id: number;
  purchaseOrderId: number;
}

// Base interface for the Purchase Order
interface IPurchaseOrderBase {
  poNumber?: string;
  supplierId: number;
  orderDate: string;
  requiredByDate: string;
  paymentTerm: string;
  statusId: number;
}

// Type for retrieving a specific Purchase Order by ID (detailed view)
export interface PurchaseOrderGetByIdType extends IPurchaseOrderBase {
  id: number;
  supplierName: string;
  status: string;
  purchaseOrderItems: IPurchaseOrderItemsGetById[];
}

// Type for updating a Purchase Order
export interface PurchaseOrderUpdateType extends IPurchaseOrderBase {
  id: number;
  purchaseOrderItems: IPurchaseOrderItemsUpdate[];
}

// Type for creating a new Purchase Order
export type PurchaseOrderCreateType = IPurchaseOrderBase;

// Type for retrieving a list of Purchase Orders
export type PurchaseOrderGetAllType = {
  id: number;
  poNumber: string;
  supplierName: string;
  supplierId: number;
  statusId: number;
  status: string;
  orderDate: string;
  requiredByDate: string;
  paymentTerm: string;
  itemsCount: number;
  total: number;
};
