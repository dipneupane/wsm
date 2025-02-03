'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { PurchaseOrderGetAllType } from '@/types/purchase-order';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import ActionCellComponent from './action';

export const columns: ColumnDef<PurchaseOrderGetAllType>[] = [
  {
    accessorKey: 'poNumber',
    header: ({ column }) => {
      return (
        <Button
          variant={'outline'}
          className="flex cursor-pointer items-center gap-x-2 border-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          PO Number
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="mx-auto w-1/2">{row.original.poNumber}</p>;
    },
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
  },
  {
    accessorKey: 'orderDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ordered Date
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.orderDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: 'itemsCount',
    header: ({ column }) => {
      return (
        <Button
          variant={'outline'}
          className="flex cursor-pointer items-center gap-x-2 border-none"
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
    accessorKey: 'total',
    header: 'Total',
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
          case 'Draft':
            return <Badge className="translate-x-6 bg-orange-400">Draft</Badge>;
          case 'Ordered':
            return <Badge className="translate-x-6 bg-blue-400">Ordered</Badge>;
          case 'Received':
            return (
              <Badge className="translate-x-6 bg-green-400">Received</Badge>
            );
          case 'PartialReceived':
            return (
              <Badge className="translate-x-6 bg-blue-400">
                Partial Received
              </Badge>
            );
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
