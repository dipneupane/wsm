import { PickListGetAllType } from '@/types/pick-list';

import DataTable from '@/components/generic-table/generic-table';

import { columns } from './column';

interface IUsersTableProps {
  data: PickListGetAllType[] | any;
}

export default function PickListItemsTable({ data }: IUsersTableProps) {
  return (
    <DataTable<PickListGetAllType>
      data={data}
      columns={columns}
      searchFields={[
        { column: 'customerName', label: 'Customer' },
        { column: 'referenceNo', label: 'Reference No' },
      ]}
    />
  );
}
