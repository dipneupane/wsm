'use client';

import Link from 'next/link';

import { generateCustomerPDF } from '@/action/generate-pdf';
import { getAllPickListInformation } from '@/services/pick-list';
import { useQuery } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
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

type DataItem = {
  id: number;
  referenceNo: string;
  customerId: number;
  customerName: string;
  statusId: number;
  status: string;
  itemsCount: number;
  createdDate: string;
};

export default function Component() {
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

  const generatePDF = (customerData: DataItem) => {
    const doc = new jsPDF();
    // Add content to the PDF
    doc.setFontSize(22);
    doc.text('DOORSETS REPORT', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Customer ID: ${customerData.id}`, 20, 40);
    doc.text(`Reference No: ${customerData.referenceNo}`, 20, 50);
    doc.text(`Customer Name: ${customerData.customerName}`, 20, 60);
    doc.text(`Status: ${customerData.status}`, 20, 70);
    doc.text(`Items Count: ${customerData.itemsCount}`, 20, 80);
    doc.text(
      `Created Date: ${new Date(customerData.createdDate).toLocaleString()}`,
      20,
      90
    );

    doc.setFontSize(10);
    doc.text(
      'This is an automatically generated report for the customer.',
      105,
      110,
      { align: 'center' }
    );

    // Save the PDF
    doc.save(`customer_${customerData.id}_report.pdf`);
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
                    <DropdownMenuItem onClick={() => generatePDF(item)}>
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
