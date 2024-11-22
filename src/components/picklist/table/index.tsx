import { PickListGetAllType } from '@/types/pick-list';

import DataTable from '@/components/generic-table/generic-table';

import { columns } from './column';

interface IUsersTableProps {
  data: PickListGetAllType[] | any;
  filterUI?: any;
}

export default function PickListItemsTable({
  data,
  filterUI,
}: IUsersTableProps) {
  return (
    <DataTable<PickListGetAllType>
      filterUI={filterUI}
      data={data}
      columns={columns}
      searchFields={[
        { column: 'customerName', label: 'Customer' },
        { column: 'referenceNo', label: 'Reference No' },
      ]}
    />
  );
}
