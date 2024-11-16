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
}

interface ICreatePickListItem extends IPickListBase, IPickListItems {}

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
