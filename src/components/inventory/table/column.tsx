'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

import { Button } from '@/components/ui/button';

import ActionCellComponent from './action';

export const columns: ColumnDef<InventoryItemsGetAllType>[] = [
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stock
          <ArrowUpDown />
        </Button>
      );
    },
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
    accessorKey: 'minStockQuantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Min. Stock Quantity
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: 'reorderLevel',
    header: 'Reorder Level',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCellComponent,
  },
];
