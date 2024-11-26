'use client';

import { useEffect, useState } from 'react';

import {
  createPurchaseOrder,
  getPurchaseOrderBySupplierID,
  getPurchaseOrderNumber,
} from '@/services/purchase-order';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { PurchaseOrderGetBySupplierIDType } from '@/types/pick-list';

import { PURCHASEORDER_QUERY_KEY } from '@/config/query-keys';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { pickListItems } from './page';

interface PurchaseDialogProps {
  pickList?: pickListItems[];
  value: pickListItems;
  onPurchaseOrderConfirmationCallback: React.Dispatch<
    React.SetStateAction<pickListItems[]>
  >;
}

export function PurchaseDialog({
  pickList,
  value,
  onPurchaseOrderConfirmationCallback,
}: PurchaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<
    PurchaseOrderGetBySupplierIDType | null | undefined
  >(null);

  const { data: purchaseOrders, refetch } = useQuery({
    queryKey: ['PickListSupplierGetByID', value.supplierId],
    queryFn: () => getPurchaseOrderBySupplierID(value.supplierId!),
  });

  const handlePurchaseOrderSubmitCallback = () => {
    refetch();
  };

  const handlePurchaseOrderSelectionChanges = (id: any) => {
    var _selected = purchaseOrders?.filter((x) => x.id == id)[0];
    setSelectedPurchaseOrder(_selected);
  };

  const handleConfirmAndCloseClick = () => {
    const newPickListWithUpdateItemPurchasedTrue = pickList?.map((item) => {
      if (item.itemId === value?.itemId)
        return {
          ...item,
          madeOrderOfTheItems: true,
          purchaseOrderId: selectedPurchaseOrder?.id,
        };
      return item;
    });

    onPurchaseOrderConfirmationCallback(
      newPickListWithUpdateItemPurchasedTrue!
    );
    setIsOpen(false);
  };

  const handleCancelClick = () => {
    const newPickListWithUpdateItemPurchasedTrue = pickList?.map((item) => {
      if (item.itemId === value?.itemId)
        return {
          ...item,
          madeOrderOfTheItems: false,
          purchaseOrderId: item.purchaseOrderId,
        };
      return item;
    });

    onPurchaseOrderConfirmationCallback(
      newPickListWithUpdateItemPurchasedTrue!
    );
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-6 border-none bg-inherit px-2">
          {value.existingOrder != null || value.madeOrderOfTheItems
            ? 'Edit P.O'
            : 'Add P.O'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <PurchaseOrderForm
          onCreateSuccess={handlePurchaseOrderSubmitCallback}
          supplierId={value?.supplierId!}
        />

        <h2 className="mb-4 mt-8 text-2xl font-bold">
          Existing Purchase Orders
        </h2>
        <Select onValueChange={handlePurchaseOrderSelectionChanges}>
          <SelectTrigger>
            <SelectValue placeholder="Select Purchase Order" />
          </SelectTrigger>
          <SelectContent>
            {purchaseOrders?.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                PO {item.id}: {item.poNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span>
          Order :<span className="font-bold"> {value?.order}</span>
        </span>
        <span>
          Item Code :<span className="font-bold"> {value?.itemCode}</span>
        </span>
        {selectedPurchaseOrder && (
          <span>
            {value.existingOrder != null ? 'Updated P.O :' : 'Selected P.O :'}
            <span className="mr-2 font-bold">
              {selectedPurchaseOrder.poNumber}
            </span>
          </span>
        )}

        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            disabled={!selectedPurchaseOrder ? true : false}
            onClick={handleConfirmAndCloseClick}
            className="w-full"
          >
            Confirm and Close
          </Button>

          <Button
            onClick={handleCancelClick}
            className="w-full"
            variant="destructive"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PurchaseOrderForm = ({ supplierId, onCreateSuccess }: {
  supplierId: number;
  onCreateSuccess: () => void;
}) => {
  const purchaseOrderSchema = z.object({
    poNumber: z.string().min(1, 'P.O number is required'),
    supplierId: z.number().int().positive('Supplier is required'),
    orderDate: z.string(),
    requiredByDate: z.string().min(1, 'Required by date is required'),
    paymentTerm: z.string().min(1, 'Peyment term is required'),
    statusId: z.number().int(),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PURCHASEORDER_QUERY_KEY });
      toast.success('Purchase order created successfully');
      onCreateSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const { data: purchaseOrderNumber } = useQuery({
    queryKey: PURCHASEORDER_QUERY_KEY,
    queryFn: getPurchaseOrderNumber,
  });

  const form = useForm<z.infer<typeof purchaseOrderSchema>>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: '',
      supplierId,
      orderDate: new Date().toISOString(),
      requiredByDate: '',
      paymentTerm: '',
      statusId: 1,
    },
  });

  useEffect(() => {
    form.setValue('poNumber', purchaseOrderNumber);
  }, [purchaseOrderNumber]);

  const onSubmit = (data: z.infer<typeof purchaseOrderSchema>) => {
    const payloadData = {
      poNumber: data.poNumber,
      supplierId: data.supplierId,
      orderDate: data.orderDate,
      requiredByDate: data.requiredByDate,
      paymentTerm: data.paymentTerm,
      statusId: data.statusId,
    };
    mutation.mutate(payloadData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="mb-4 text-2xl font-bold">Create New Purchase Order</h2>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredByDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required By Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Term</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}
          className="w-full"
        >
          Create New
        </Button>
      </form>
    </Form>
  );
};
