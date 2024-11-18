import { InventoryItemsGetAllType } from '@/types/inventory-items';
import DataTable from '@/components/generic-table/generic-table';
import { columns } from './column';

interface IUsersTableProps {
  data: InventoryItemsGetAllType[] | any;
}

export default function InventoryItemsTable({ data }: IUsersTableProps) {
  return (
    <DataTable<InventoryItemsGetAllType>
      data={data}
      columns={columns}
      searchFields={[
        { column: 'code', label: 'Code' },
        { column: 'categoryName', label: 'CategoryName' },
        { column: 'supplierName', label: 'SuppilerName' },
      ]}
    />
  );
}
