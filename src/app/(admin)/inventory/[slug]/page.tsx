'use client';

import {
  getInventoryCustomersItemById,
  getInventoryItemById,
} from '@/services/inventory-item';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2Icon } from 'lucide-react';

import {
  CustomerHistoryType,
  ItemUpdateLogType,
  SupplierHistoryType,
} from '@/types/inventory-items';

import { INVENTORY_QUERY_KEY } from '@/config/query-keys';

import EditInventoryItemForm from '@/components/inventory/edit-inventory-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InventoryEditProps {
  params: {
    slug: string;
  };
}

const InventoryEdit = ({ params: { slug } }: InventoryEditProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY[0], slug],
    queryFn: () => getInventoryItemById(Number(slug)),
    enabled: Boolean(slug),
  });
  const {
    data: inventoryCustomerAndSupplierData,
    isLoading: isInventoryCustomerDataLoading,
  } = useQuery({
    queryKey: ['inventor_customer'],
    queryFn: () => getInventoryCustomersItemById(Number(slug)),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <div className="text-destructive">
          Error loading data:{' '}
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">No data found</div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-inherit">
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Inventory Id:</p>
              <p>{data?.id || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Code:</p>
              <p>{data?.code || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Description:</p>
              <p>{data?.description || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">fireRating:</p>
              <p>{data?.fireRating || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Size:</p>
              <p>{data?.size || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Finish:</p>
              <p>{data?.finish || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Category:</p>
              <p>{data?.categoryName || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Supplier:</p>
              <p>{data?.supplierName || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Cost:</p>
              <p>{data?.cost || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Stock:</p>
              <p>{data?.stock || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Total Stock Value:</p>
              <p>{data?.totalStockValue || 'N/A'}</p>
            </div>
          </div>

          <h3 className="mt-5 text-lg font-semibold">Item Update Logs</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Old Stock</TableHead>
                <TableHead>New Stock</TableHead>
                <TableHead>Old Stock In Order</TableHead>
                <TableHead>New Stock In Order</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Updated Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInventoryCustomerDataLoading ? (
                <div>Loading...</div>
              ) : inventoryCustomerAndSupplierData?.itemUpdateLog &&
                inventoryCustomerAndSupplierData?.itemUpdateLog.length > 0 ? (
                inventoryCustomerAndSupplierData?.itemUpdateLog.map(
                  (sup: ItemUpdateLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{sup?.oldStock || 'N/A'}</TableCell>
                      <TableCell>{sup?.newStock || 'N/A'}</TableCell>
                      <TableCell>{sup?.oldInOrder || 'N/A'}</TableCell>
                      <TableCell>{sup?.newInOrder || 'N/A'}</TableCell>
                      <TableCell>{sup?.description || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(sup?.updatedDate), 'PPP') || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <div className="p-3">No Item Update Logs found</div>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <h3 className="mt-5 text-lg font-semibold">Customer History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Order Count</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInventoryCustomerDataLoading ? (
                <div>Loading...</div>
              ) : inventoryCustomerAndSupplierData?.customerHistory &&
                inventoryCustomerAndSupplierData.customerHistory.length > 0 ? (
                inventoryCustomerAndSupplierData.customerHistory.map(
                  (cust: CustomerHistoryType, index: any) => (
                    <TableRow key={index}>
                      <TableCell>{cust?.customerName || 'N/A'}</TableCell>
                      <TableCell>{cust?.orderCount || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(cust.createdDate), 'PPP') || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <div className="p-3">No Customer found</div>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <h3 className="mt-5 text-lg font-semibold">Supplier History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Po Number</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Ordered Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInventoryCustomerDataLoading ? (
                <div>Loading...</div>
              ) : inventoryCustomerAndSupplierData?.supplierHistory &&
                inventoryCustomerAndSupplierData?.supplierHistory.length > 0 ? (
                inventoryCustomerAndSupplierData?.supplierHistory.map(
                  (sup: SupplierHistoryType, index: any) => (
                    <TableRow key={index}>
                      <TableCell>{sup?.poNumber || 'N/A'}</TableCell>
                      <TableCell>{sup?.supplierName || 'N/A'}</TableCell>
                      <TableCell>{sup?.quantity || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(sup?.orderedDate), 'PPP') || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <div className="p-3">No Supplier found</div>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryEdit;
