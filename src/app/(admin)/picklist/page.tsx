'use client';

import Link from 'next/link';

import {
  downloadPickListProductionSheet,
  getAllPickListInformation,
} from '@/services/pick-list';
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

export default function PickListRootPage() {
  const { data } = useQuery({
    queryKey: ['PickList'],
    queryFn: getAllPickListInformation,
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

  const generatePDF = async (pickListID: number) => {
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
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-y-5 py-10">
      <Button asChild className="ms-auto">
        <Link href={'/picklist/add'}>Add PickList</Link>
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Reference No</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Items Count</TableHead>
            <TableHead className="text-right">Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.referenceNo}</TableCell>
              <TableCell>{item.customerName}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    `${item.statusId == 1 ? 'bg-yellow-300' : ''} ${item.statusId == 2 ? 'bg-orange-400' : ''} `,
                    ''
                  )}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{item.itemsCount}</TableCell>
              <TableCell className="text-right">
                {formatDate(item.createdDate)}
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
                    <DropdownMenuItem onClick={() => generatePDF(item.id)}>
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="w-full" href={`/picklist/${item.id}`}>
                        Edit
                      </Link>
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
