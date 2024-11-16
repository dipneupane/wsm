'use client';

import { ColumnDef, Row } from '@tanstack/react-table';

import { SupplierGetAllType } from '@/types/supplier';

import ActionCellComponent from './action';

export const columns: ColumnDef<SupplierGetAllType>[] = [
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
