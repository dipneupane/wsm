'use client';

import { useState } from 'react';

import {
  createPurchaseOrder,
  getPurchaseOrderBySupplierID,
} from '@/services/purchase-order';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { set } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  PURCHASEORDER_QUERY_KEY,
  SUPPLIER_QUERY_KEY,
} from '@/config/query-keys';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

import PurchaseOrderAddPage from '../../purchaseorder/add/page';
import { pickListItems } from './page';

interface PurchaseDialogProps {
  pickList?: pickListItems[] | undefined;
  value?: pickListItems;
  onPickListItems: React.Dispatch<React.SetStateAction<pickListItems[]>>;
}

export function PurchaseDialog({
  pickList,
  value,
  onPickListItems,
}: PurchaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ['PickListSupplierGetByID', value?.supplierID],
    queryFn: () => getPurchaseOrderBySupplierID(value?.supplierID!),
  });

  console.log(data);

  const handleClick = () => {
    //update the picklist item to true if the purchase order is made
    const newPickListWithUpdateItemPurchasedTrue = pickList?.map((item) => {
      if (item.itemId === value?.itemId) {
        return { ...item, madeOrderOfTheItems: true };
      }
      return item;
    });
    console.log(newPickListWithUpdateItemPurchasedTrue);
    onPickListItems(newPickListWithUpdateItemPurchasedTrue!);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Make Purchase Order</Button>
      </DialogTrigger>
      <DialogContent className="min-h-screen sm:max-w-[950px]">
        <h1>supplierID: {value?.supplierID}</h1>
        <h1>ItemId:{value?.itemId}</h1>
        <h1>ItemCode:{value?.itemCode}</h1>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="View Purchase Order" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                PO {item.id}: {item.poNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <PurchaseOrderForm
          onCreateSuccess={handleClick}
          supplierId={value?.supplierID!}
          itemId={value?.itemId!}
        />
        <div className="grid gap-4 py-4">
          <button onClick={handleClick}>Click</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PurchaseOrderForm = ({
  supplierId,
  itemId,
  onCreateSuccess,
}: {
  supplierId: number;
  itemId: number;
  onCreateSuccess: () => void;
}) => {
  const purchaseOrderSchema = z.object({
    poNumber: z.string().min(1, 'PO number is required'),
    supplierId: z.number().int().positive('Please select a valid supplier'),
    orderDate: z.string().min(1, 'Order date is required'),
    requiredByDate: z.string().min(1, 'Required by date is required'),
    paymentTerm: z.string().min(1, 'Payment term is required'),
    statusId: z.number().int().positive('Status ID is required'),
    description: z.string().min(1, 'Description is required'),
    quantity: z.coerce.number().int().positive('Quantity is required'),
    price: z.coerce.number().int().positive('Price is required'),
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

  const form = useForm<z.infer<typeof purchaseOrderSchema>>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: '',
      supplierId,
      orderDate: '',
      requiredByDate: '',
      paymentTerm: '',
      statusId: 1,
      description: '',
      quantity: 0,
      price: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof purchaseOrderSchema>) => {
    console.log('Purchase Order Data:', data);
    const payloadData = {
      poNumber: data.poNumber,
      supplierId: data.supplierId,
      orderDate: data.orderDate,
      requiredByDate: data.requiredByDate,
      paymentTerm: data.paymentTerm,
      statusId: data.statusId,
      purchaseOrderItems: [
        {
          itemId: itemId,
          description: data.description,
          quantity: data.quantity,
          unitPrice: data.price,
        },
      ],
    };
    mutation.mutate(payloadData);
    console.log('Payload Data:', payloadData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PO Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <Input placeholder="Enter Payment Term" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Quantity"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Price" {...field} />
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
          Create Purchase Order
        </Button>
      </form>
    </Form>
  );
};
