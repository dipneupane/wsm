interface BaseInventoryItem {
  code: string;
  fireRating: string;
  size: string;
  finish: string;
  description: string;
  categoryId: number;
  supplierId: number;
  cost: number;
  stock: number;
  totalStockValue: number;
  safetyStockRequired: number;
  reorderLevel: number;
  orderedCount?: number;
}

// Interface for the 'get by ID' operation, which includes additional fields
interface InventoryItemDetail extends BaseInventoryItem {
  id: number;
  categoryName: string;
  supplierName: string;
}
export interface CustomerHistoryType {
  createdDate: string;
  customerName: string;
  orderCount: number;
}

export interface SupplierHistoryType {
  orderedDate: string;
  poNumber: string;
  supplierName: string;
  quantity: number;
}

interface InventoryCustomerDetail {
  customerHistory: CustomerHistoryType[];
  supplierHistory: SupplierHistoryType[];
}

// Interface for 'create' and 'update' operations, which omit the extra fields
export type InventoryItemUpdateType = InventoryItemDetail;
export type InventoryItemCreateType = BaseInventoryItem;
export type InventoryItemGetByIdType = InventoryItemDetail;
export type InventoryItemsGetAllType = InventoryItemDetail;
export type InventoryCustomersGetByIdType = InventoryCustomerDetail;
