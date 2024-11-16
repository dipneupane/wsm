'use client';

import { ColumnDef, Row } from '@tanstack/react-table';

import { CustomerGetAllType } from '@/types/customer';

import ActionCellComponent from './action';

export const columns: ColumnDef<CustomerGetAllType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'fullName',
    header: 'Full Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'note',
    header: 'Note',
  },
  {
    accessorKey: 'phone',
    header: 'Phone no',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCellComponent,
  },
];
