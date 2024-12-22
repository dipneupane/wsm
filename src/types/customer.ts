interface CustomerBase {
  fullName: string;
  phone: string;
  email: string;
  note: string;
}

interface CustomerWithID extends CustomerBase {
  id: number;
}

export type CustomerCreateType = CustomerBase;
export type CustomerGetByIDType = CustomerWithID;
export type CustomerUpdateType = CustomerWithID;
export type CustomerGetAllType = CustomerWithID;

export interface CustomerGetHistoryType {
  createdDate: string; 
  itemName: string;
  count: number;
}