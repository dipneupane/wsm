'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { InventoryItemsGetAllType } from '@/types/inventory-items';
import { PurchaseOrderGetAllType } from '@/types/purchase-order';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import ActionCellComponent from './action';

export const columns: ColumnDef<PurchaseOrderGetAllType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'poNumber',
    header: 'PO Number',
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
  },
  {
    accessorKey: 'createdDate',
    header: 'Ordered Date',
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
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Item Count
          <ArrowUpDownIcon />
        </Button>
      );
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
            return <Badge className="bg-orange-400">Draft</Badge>;
          case 'Ordered':
            return <Badge className="bg-blue-400">Ordered</Badge>;
          case 'Received':
            return <Badge className="bg-green-400">Received</Badge>;
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
