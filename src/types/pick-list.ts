interface IPickListBase {
  referenceNo: string;
  customerId: number;
  priorityId: number;
  requiredDate: string;
  pickListItems?: IPickListItems[];
}

interface IPickListItems {
  itemId?: number;
  fireRating?: string;
  size?: string;
  finish?: string;
  order?: string;
  date?: string;
  notes?: string;
  categoryId?: number;
}

interface ICreatePickListItem extends IPickListBase, IPickListItems { }

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
  pickListItems: {
    categoryId?: number;
    itemId: number;
    itemCode: string;
    fireRating?: string;
    size?: string;
    finish?: string;
    order?: string;
    date?: string;
    notes?: string;
  }[];
};
