'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { PickListGetAllType } from '@/types/pick-list';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import ActionCellComponent from './action';

export const columns: ColumnDef<PickListGetAllType>[] = [
  {
    accessorKey: 'referenceNo',
    header: 'Reference No',
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
  },
  {
    accessorKey: 'itemsCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Item Count
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="mx-auto w-1/2">{row.original.itemsCount}</p>;
    },
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created Date
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusBadge = (status: string) => {
        switch (status) {
          case 'Pending':
            return <Badge className="bg-yellow-400">Pending</Badge>;
          case 'InProgress':
            return <Badge className="bg-orange-400">In Progress</Badge>;
          case 'Completed':
            return <Badge className="">Completed</Badge>;
        }
      };
      return getStatusBadge(status);
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCellComponent,
  },
];
