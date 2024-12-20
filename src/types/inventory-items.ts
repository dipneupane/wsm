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

// Interface for 'create' and 'update' operations, which omit the extra fields
export type InventoryItemUpdateType = InventoryItemDetail;
export type InventoryItemCreateType = BaseInventoryItem;
export type InventoryItemGetByIdType = InventoryItemDetail;
export type InventoryItemsGetAllType = InventoryItemDetail;
