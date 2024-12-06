interface IPickListBase {
  referenceNo: string;
  customerId: number;
  priorityId: number;
  requiredDate: string;
  project?: string;
  aptHouseNumber?: string;
  doorType?: string;
  ironMongeryFinish?: string;
  frameFinish?: string;
  pickListItems?: IPickListItems[];
  additionalInformations?: IAdditionalInformations[];
}

interface IAdditionalInformations {
  wallThickNess?: string;
  handling?: string;
  underCut?: string;
  lockType?: string;
  fireRating?: string;
  note?: string;
}

interface IPickListItems {
  itemId?: number;
  fireRating?: string;
  size?: string;
  finish?: string;
  order?: number;
  date?: string;
  notes?: string;
  categoryId?: number;
}

interface ICreatePickListItem extends IPickListBase { }

export type PickListCreateType = ICreatePickListItem;

export type PickListGetAllType = {
  id: number;
  referenceNo: string;
  customerId: number;
  customerName: string;
  statusId: number;
  status: string;
  itemsCount: number;
  createdDate: string;
};

export type PickListGetByIdType = {
  id: number;
  referenceNo: string;
  customerId: number;
  priorityId: number;
  createdDate: string;
  requiredDate: string;
  project?: string;
  aptHouseNumber?: string;
  doorType?: string;
  ironMongeryFinish?: string;
  frameFinish?: string;
  pickListItems: {
    id: number;
    categoryId?: number;
    itemId: number;
    itemCode: string;
    fireRating?: string;
    categoryName?: string;
    size?: string;
    finish?: string;
    order?: number;
    date?: string;
    notes?: string;
  }[];
  additionalInformations: {
    wallThickNess?: string;
    handling?: string;
    underCut?: string;
    lockType?: string;
    fireRating?: string;
    note?: string;
  }[];
};

export type PurchaseOrderGetBySupplierIDType = {
  id: number;
  poNumber: string;
};
