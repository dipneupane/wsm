interface SupplierBase {
  fullName: string;
  phone: string;
  email: string;
  note: string;
}

interface SupplierWithID extends SupplierBase {
  id: number;
}

export type SupplierCreateType = SupplierBase;
export type SupplierGetByIDType = SupplierWithID;
export type SupplierUpdateType = SupplierWithID;
export type SupplierGetAllType = SupplierWithID;
