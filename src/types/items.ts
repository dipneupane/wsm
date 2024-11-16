interface BaseItem {
  code: string;
  description: string;
  categoryId: number;
  supplierId: number;
  cost: number;
  stock: number;
}

// Interface for the 'get by ID' operation, which includes additional fields
interface ItemDetail extends BaseItem {
  id: number;
  categoryName: string;
  supplierName: string;
}

// Interface for 'create' and 'update' operations, which omit the extra fields
export type ItemUpdateType = ItemDetail;
export type ItemCreateType = BaseItem;
export type ItemGetByIdType = ItemDetail;
export type ItemsDetailType = ItemDetail[];
