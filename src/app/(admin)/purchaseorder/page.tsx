'use client';

import React from 'react';

import Link from 'next/link';

import { getAllPurchaseOrderInformation } from '@/services/purchase-order';
import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Component() {
  const { data } = useQuery({
    queryKey: ['PurchaseOrder'],
    queryFn: getAllPurchaseOrderInformation,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(
        `https://doorsets-api.codenp.com/PurchaseOrder/DownloadPurchaseOrder?id=${id}`
      );

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PurchaseOrder_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-y-5 py-10">
      <Button asChild className="ms-auto">
        <Link href="/purchaseorder/add">Add Purchase Order</Link>
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>PO Number</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Items Count</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.poNumber}</TableCell>
              <TableCell>{item.supplierName}</TableCell>
              <TableCell>{formatDate(item.orderDate)}</TableCell>
              <TableCell className="text-right">{item.itemsCount}</TableCell>
              <TableCell className="text-right">{item.total}</TableCell>
              <TableCell className="text-right">
                <Badge
                  className={cn(
                    `${item.statusId == 1 && 'bg-yellow-300'} ${item.statusId == 2 && 'bg-blue-400'} ${item.statusId == 3 && 'bg-green-400'} `
                  )}
                >
                  {item.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Link href={`purchaseorder/${item.id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleDownload(item.id)}>
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
