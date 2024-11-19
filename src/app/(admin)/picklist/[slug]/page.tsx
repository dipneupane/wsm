'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import {
  downloadPickListProductionSheet,
  getPickListById,
} from '@/services/pick-list';
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

interface PickListProps {
  params: {
    slug: string;
  };
}

const priorityMap = {
  1: 'Pending',
  2: 'In Progress',
  3: 'Completed',
};

export default function ViewPickupListItems({
  params: { slug },
}: PickListProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: pickListData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['PickList', 'GetById', Number(slug)],
    queryFn: () => getPickListById(Number(slug)),
  });

  const generatePDF = async (pickListID: number) => {
    setIsDownloading(true);
    try {
      const { blob, filename } =
        await downloadPickListProductionSheet(pickListID);
      // Create a Blob URL
      const blobUrl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename); // Use the extracted filename
      document.body.appendChild(link);
      link.click();
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
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
  if (!pickListData) return <div>No data found</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-inherit">
        <CardHeader>
          <CardTitle>Pick List Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Reference No:</p>
              <p>{pickListData.referenceNo}</p>
            </div>
            <div>
              <p className="font-semibold">Customer ID:</p>
              <p>{pickListData.customerId}</p>
            </div>
            <div>
              <p className="font-semibold">Priority:</p>
              <Badge
                variant={
                  pickListData.priorityId === 1
                    ? 'default'
                    : pickListData.priorityId === 2
                      ? 'secondary'
                      : 'outline'
                }
              >
                {
                  priorityMap[
                    pickListData.priorityId as keyof typeof priorityMap
                  ]
                }
              </Badge>
            </div>
            <div>
              <p className="font-semibold">Created Date:</p>
              <p>{format(new Date(pickListData.createdDate), 'PPP')}</p>
            </div>
            <div>
              <p className="font-semibold">Required Date:</p>
              <p>{format(new Date(pickListData.requiredDate), 'PPP')}</p>
            </div>

            <div className="space-x-2">
              <Button
                onClick={() => generatePDF(pickListData.id)}
                disabled={isDownloading}
              >
                <DownloadIcon />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
              <Link href={`/picklist/${pickListData.id}/edit`}>
                <Button>
                  <Edit2Icon />
                  Edit
                </Button>
              </Link>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold">Pick List Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Fire Rating</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Finish</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickListData.pickListItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.categoryName || 'N/A'}</TableCell>
                  <TableCell>{item.fireRating || 'N/A'}</TableCell>
                  <TableCell>{item.size || 'N/A'}</TableCell>
                  <TableCell>{item.finish || 'N/A'}</TableCell>
                  <TableCell>{item.order || 'N/A'}</TableCell>
                  <TableCell>
                    {item.date ? format(new Date(item.date), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell>{item.notes || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
