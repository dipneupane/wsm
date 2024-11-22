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
              <p className="font-semibold">Reference No :</p>
              <p>{pickListData.referenceNo}</p>
            </div>
            <div>
              <p className="font-semibold">Customer ID :</p>
              <p>{pickListData.customerId}</p>
            </div>
            <div>
              <p className="font-semibold"> Iron Mongery Finish : </p>
              <p>{pickListData.ironMongeryFinish}</p>
            </div>
            <div>
              <p className="font-semibold">Project :</p>
              <p>{pickListData.project}</p>
            </div>
            <div>
              <p className="font-semibold">Frame Finish : </p>
              <p>{pickListData.frameFinish}</p>
            </div>
            <div>
              <p className="font-semibold"> APT House Number : </p>
              <p>{pickListData.aptHouseNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Door Type : </p>
              <p>{pickListData.doorType}</p>
            </div>

            <div>
              <p className="font-semibold">Priority:</p>
              <Badge>
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
          <h3>Additonal Information</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wall Thickness</TableHead>
                <TableHead>Handling</TableHead>
                <TableHead>Under Cut</TableHead>
                <TableHead>Lock Type</TableHead>
                <TableHead>Fire Rating</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickListData.additionalInformations.map((item, index) => (
                <TableRow key={index}>
                  <TableCell key={index}>
                    {item.wallThickNess || 'N/A'}
                  </TableCell>
                  <TableCell key={index}>{item.handling || 'N/A'}</TableCell>
                  <TableCell key={index}>{item.underCut || 'N/A'}</TableCell>
                  <TableCell key={index}>{item.lockType || 'N/A'}</TableCell>
                  <TableCell key={index}>{item.fireRating || 'N/A'}</TableCell>
                  <TableCell key={index}>{item.note || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
