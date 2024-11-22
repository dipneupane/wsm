import { PurchaseOrderGetAllType } from '@/types/purchase-order';

import DataTable from '@/components/generic-table/generic-table';

import { columns } from './column';

interface IUsersTableProps {
  data: PurchaseOrderGetAllType[] | any;
  filterUI?: any;
}

export default function PurchaseOrderItemsTable({
  data,
  filterUI,
}: IUsersTableProps) {
  return (
    <DataTable<PurchaseOrderGetAllType>
      filterUI={filterUI}
      data={data}
      columns={columns}
      searchFields={[
        { column: 'supplierName', label: 'Supplier' },
        { column: 'poNumber', label: 'PO Number' },
      ]}
    />
  );
}
