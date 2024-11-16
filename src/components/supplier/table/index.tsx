import { SupplierGetAllType } from '@/types/supplier';

import DataTable from '@/components/generic-table/generic-table';

import { columns } from './column';

interface IUsersTableProps {
  data: SupplierGetAllType[] | any;
}

export default function SupplierTable({ data }: IUsersTableProps) {
  return <DataTable<SupplierGetAllType> data={data} columns={columns} />;
}
