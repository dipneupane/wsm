import { CustomerGetAllType } from '@/types/customer';

import DataTable from '@/components/generic-table/generic-table';

import { columns } from './column';

interface IUsersTableProps {
  data: CustomerGetAllType[] | any;
}

export default function CustomerTable({ data }: IUsersTableProps) {
  return <DataTable<CustomerGetAllType> data={data} columns={columns} />;
}
