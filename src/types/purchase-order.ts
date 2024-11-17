interface IPurchaseOrderBase {
    poNumber: string;
    supplierId: number;
    orderDate: string;
    requiredByDate: string;
    paymentTerm:string,
    statusId:number,
    purchaseOrderItems?: IPurchaseOrderItems[];
  }
  
  interface IPurchaseOrderItems {
    itemId: number;
    description: string;
    size?: string;
    quantity:number,
    unitPrice:number,
  }
  
  interface ICreatePurchaseOrderItem extends IPurchaseOrderBase, IPurchaseOrderItems {}
  
  export type PurchaseOrderCreateType = ICreatePurchaseOrderItem;
  
  export type PurchaseOrderGetAllType = {
    id: number;
    poNumber: string;
    supplierName: string;
    supplierId: number;
    statusId:number,
    status:string,
    orderDate: string;
    requiredByDate: string;
    paymentTerm: string;
    itemsCount: number;
    total: number;
  };
  