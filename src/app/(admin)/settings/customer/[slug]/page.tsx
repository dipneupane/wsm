'use client';

import React from 'react';

import { getCustomerById, getCustomerHistoryById } from '@/services/customer';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { CustomerGetByIDType, CustomerGetHistoryType } from '@/types/customer';

import { CUSTOMERHISTORY_QUERY_KEY } from '@/config/query-keys';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CustomerViewProps {
  params: {
    slug: string;
  };
}
const CustomerViewPage = ({ params: { slug } }: CustomerViewProps) => {
  const { data: customerDetails, isLoading: isCustomerDataLoading } =
    useQuery<CustomerGetByIDType>({
      queryKey: ['customer_data'],
      queryFn: () => getCustomerById(Number(slug)),
    });
  const {
    data: customerHistory,
    isLoading,
    error,
  } = useQuery<CustomerGetHistoryType>({
    queryKey: [...CUSTOMERHISTORY_QUERY_KEY, slug],
    queryFn: () => getCustomerHistoryById(Number(slug)),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-destructive">
          Error loading item: {error.message}
        </div>
      </Card>
    );
  }

  if (!customerDetails) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">No customer found</div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-inherit">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            {isCustomerDataLoading ? (
              <div>loading...</div>
            ) : (
              <>
                <div>
                  <p className="font-semibold">Customer:</p>
                  <p>{customerDetails?.fullName}</p>
                </div>
                <div>
                  <p className="font-semibold">Id:</p>
                  <p>{customerDetails?.id}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{customerDetails?.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{customerDetails?.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Note:</p>
                  <p>{customerDetails?.note}</p>
                </div>
              </>
            )}
          </div>

          <h3 className="mb-2 text-lg font-semibold">Order History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerHistory &&
                customerHistory?.map(
                  (item: CustomerGetHistoryType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemName || 'N/A'}</TableCell>
                      <TableCell>{item.count || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdDate), 'PPP') || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerViewPage;
