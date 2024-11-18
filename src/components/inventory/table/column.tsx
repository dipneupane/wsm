'use client';

import { ColumnDef } from '@tanstack/react-table';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

import ActionCellComponent from './action';

export const columns: ColumnDef<InventoryItemsGetAllType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'categoryName',
    header: 'Category Name',
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
  },
  {
    accessorKey: 'stock',
    header: 'Stock'
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCellComponent,
  },
];
