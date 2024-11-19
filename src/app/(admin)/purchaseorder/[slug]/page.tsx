'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import {
  downloadPickListProductionSheet,
  getPickListById,
} from '@/services/pick-list';
import { getPurchaseOrderById } from '@/services/purchase-order';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Download, DownloadIcon, Edit2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PurchaseOrderProps {
  params: {
    slug: string;
  };
}

const StatusMap = {
  1: 'Draft',
  2: 'Ordered',
  3: 'Received',
};

export default function ViewPickupListItems({
  params: { slug },
}: PurchaseOrderProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: purchaseOrderData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['PurchaseOrder', 'GetById', Number(slug)],
    queryFn: () => getPurchaseOrderById(Number(slug)),
  });

  const generatePDF = async (purchaseOrderID: number) => {
    setIsDownloading(true);
    try {
      //   const { blob, filename } =
      //     await downloadPickListProductionSheet(pickListID);
      //   // Create a Blob URL
      //   const blobUrl = window.URL.createObjectURL(new Blob([blob]));
      //   const link = document.createElement('a');
      //   link.href = blobUrl;
      //   link.setAttribute('download', filename); // Use the extracted filename
      //   document.body.appendChild(link);
      //   link.click();
      //   // Cleanup
      //   link.remove();
      //   window.URL.revokeObjectURL(blobUrl);
      const response = await fetch(
        `https://doorsets-api.codenp.com/PurchaseOrder/DownloadPurchaseOrder?id=${purchaseOrderID}`
      );

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PurchaseOrder_${purchaseOrderID}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );
  if (!purchaseOrderData) return <div>No data found</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-inherit">
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">PO Number:</p>
              <p>{purchaseOrderData.poNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Supplier ID:</p>
              <p>{purchaseOrderData.supplierId}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <Badge
                className={`${purchaseOrderData.statusId === 1 && 'bg-orange-400'} ${purchaseOrderData.statusId === 2 && 'bg-blue-400'} ${purchaseOrderData.statusId === 3 && 'bg-green-400'}`}
              >
                {
                  StatusMap[
                    purchaseOrderData.statusId as keyof typeof StatusMap
                  ]
                }
              </Badge>
            </div>
            <div>
              <p className="font-semibold">Ordered Date:</p>
              <p>{format(new Date(purchaseOrderData.orderDate), 'PPP')}</p>
            </div>
            <div>
              <p className="font-semibold">Required Date:</p>
              <p>{format(new Date(purchaseOrderData.requiredByDate), 'PPP')}</p>
            </div>

            <div className="space-x-2">
              <Button
                onClick={() => generatePDF(purchaseOrderData.id)}
                disabled={isDownloading}
              >
                <DownloadIcon />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
              <Link href={`/purchaseorder/${purchaseOrderData.id}/edit`}>
                <Button>
                  <Edit2Icon />
                  Edit
                </Button>
              </Link>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold">Purchase Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrderData.purchaseOrderItems.map(
                (item: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell>{item.itemId}</TableCell>
                    <TableCell>{item.description || 'N/A'}</TableCell>
                    <TableCell>{item.quantity || 'N/A'}</TableCell>
                    <TableCell>{item.unitPrice || 'N/A'}</TableCell>
                    <TableCell>{item.total || 'N/A'}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
