'use client';

import { ColumnDef } from '@tanstack/react-table';

import { AssemblyGetAllType } from '@/types/assembly';

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
    header: 'Total Cost',
  },
  {
    accessorKey: 'totalItems',
    header: ' Total Items ',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCellComponent,
  },
];
