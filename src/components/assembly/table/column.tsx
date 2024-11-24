'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { AssemblyGetAllType } from '@/types/assembly';

import { Button } from '@/components/ui/button';

import ActionCellComponent from './action';

export const columns: ColumnDef<AssemblyGetAllType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'code',
    header: ' Code ',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'totalCost',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Cost
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="translate-x-9">{row.original.totalCost}</p>;
    },
  },
  {
    accessorKey: 'totalItems',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Items
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="mx-auto w-1/2">{row.original.totalItems}</p>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCellComponent,
  },
];
