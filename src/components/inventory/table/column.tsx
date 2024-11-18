'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

import { Button } from '@/components/ui/button';

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cost
          <ArrowUpDown />
        </Button>
      );
  },
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
