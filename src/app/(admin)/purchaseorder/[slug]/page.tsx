'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  getPurchaseOrderById,
  updatePurchaseOrder,
} from '@/services/purchase-order';
import { getAllSupplierInformation } from '@/services/supplier';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, Loader2Icon, Trash2, Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  PURCHASEORDER_QUERY_KEY,
  SUPPLIER_QUERY_KEY,
} from '@/config/query-keys';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Validation schema
const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, 'PO Number is required'),
  supplierId: z.number().int().positive('Supplier is required'),
  orderDate: z.string().min(1, 'Order Date is required'),
  requiredByDate: z.string().min(1, 'Required By Date is required'),
  paymentTerm: z.string().min(1, 'Payment Term is required'),
  statusId: z.number().int().positive('Status is required'),
});

interface PurchaseOrderEditProps {
  params: {
    slug: string;
  };
}

const STATUS = {
  Draft: 1,
  Ordered: 2,
  Received: 3,
};

const PurchaseOrderEdit: React.FC<PurchaseOrderEditProps> = ({
  params: { slug },
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  // Fetch purchase order details
  const {
    data: purchaseOrderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [PURCHASEORDER_QUERY_KEY[0], slug],
    queryFn: () => getPurchaseOrderById(Number(slug)),
    enabled: !!slug,
  });

  // Fetch supplier information
  const { data: supplierList } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: updatePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PURCHASEORDER_QUERY_KEY });
      toast.success('Purchase Order updated successfully');
      router.push('/purchaseorder');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error updating Purchase Order');
    },
  });

  // Form setup
  const form = useForm<z.infer<typeof purchaseOrderSchema>>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: '',
      supplierId: 0,
      orderDate: '',
      requiredByDate: '',
      paymentTerm: '',
      statusId: 1,
    },
  });

  const [purchaseOrderItems, setPurchaseOrderItems] = useState<
    Array<{
      id: number;
      description: string;
      quantity: string;
      unitPrice: string;
      itemId: string;
      isNew?: boolean;
      tempId?: number;
    }>
  >([]);

  // Prefill data when fetched
  useEffect(() => {
    if (purchaseOrderData) {
      form.reset({
        poNumber: purchaseOrderData.poNumber,
        supplierId: purchaseOrderData.supplierId,
        orderDate: purchaseOrderData.orderDate.split('T')[0],
        requiredByDate: purchaseOrderData.requiredByDate.split('T')[0],
        paymentTerm: purchaseOrderData.paymentTerm,
        statusId: purchaseOrderData.statusId,
      });
      setPurchaseOrderItems(purchaseOrderData.purchaseOrderItems || []);
    }
  }, [purchaseOrderData, form]);

  // Add new item
  const handleAddItem = () => {
    setPurchaseOrderItems((prev) => [
      ...prev,
      {
        id: 0,
        itemId: '',
        description: '',
        quantity: '',
        unitPrice: '',
        isNew: true,
        tempId: prev.length + 1,
      },
    ]);
  };

  // Remove item
  const handleRemoveItem = (id: number) => {
    setPurchaseOrderItems((prev) => prev.filter((_, idx) => idx !== id));
  };

  // Update item
  const handleItemChange = (
    id: number,
    field: string,
    value: string | number,
    tempId?: number
  ) => {
    setPurchaseOrderItems((prev: any) => {
      return prev.map((item: any) => {
        if (item.isNew) {
          return item.tempId === tempId ? { ...item, [field]: value } : item;
        }
        return item.id === id ? { ...item, [field]: value } : item;
      });
    });
  };

  // Submit form
  const onSubmit = async (values: z.infer<typeof purchaseOrderSchema>) => {
    let currentSlug = Number(slug);
    const updatedPurchaseOrder = {
      ...values,
      id: currentSlug,
      purchaseOrderItems: purchaseOrderItems.map((item) => ({
        id: Number(item.id),
        itemId: Number(item.itemId),
        purchaseOrderId: currentSlug,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };
    mutation.mutateAsync(updatedPurchaseOrder);
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (isError) return <div>Error fetching Purchase Order data</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">Edit Purchase Order</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="poNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PO Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter PO number"
                      className={
                        form.formState.errors.poNumber ? 'border-red-500' : ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-around">
                  <FormLabel>Supplier</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`justify-between ${form.formState.errors.supplierId ? 'border-red-500' : ''}`}
                      >
                        {field.value && supplierList
                          ? supplierList.find(
                              (supplier: any) => supplier.id === field.value
                            )?.fullName
                          : 'Select Supplier'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search supplier..." />
                        <CommandEmpty>No Supplier found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {supplierList?.map((supplier) => (
                              <CommandItem
                                key={supplier.id}
                                onSelect={() => {
                                  form.setValue('supplierId', supplier.id, {
                                    shouldValidate: true,
                                  });
                                  setOpen(false);
                                }}
                              >
                                {supplier.fullName}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    <Input
                      type="date"
                      {...field}
                      className={
                        form.formState.errors.orderDate ? 'border-red-500' : ''
                      }
                    />
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
                    <Input
                      type="date"
                      {...field}
                      className={
                        form.formState.errors.requiredByDate
                          ? 'border-red-500'
                          : ''
                      }
                    />
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
                    <Input
                      placeholder="Net 30"
                      {...field}
                      className={
                        form.formState.errors.paymentTerm
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={
                      field.value ? Number(field.value).toString() : undefined
                    }
                  >
                    <SelectTrigger
                      className={
                        form.formState.errors.statusId ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={STATUS.Draft.toString()}>
                        Draft
                      </SelectItem>
                      <SelectItem value={STATUS.Ordered.toString()}>
                        Ordered
                      </SelectItem>
                      <SelectItem value={STATUS.Received.toString()}>
                        Received
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-10">
            <h3>Items</h3>
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Order Items</h2>
              <Button type="button" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
            <div>
              {purchaseOrderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="mb-4 flex flex-wrap items-center gap-4"
                >
                  <div>
                    <Label htmlFor={`itemId-${idx}`}>Item ID</Label>
                    <Input
                      type="number"
                      id={`itemId-${idx}`}
                      value={item.itemId}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'itemId',
                          e.target.value,
                          idx + 1
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${idx}`}>Description</Label>
                    <Input
                      type="text"
                      id={`description-${idx}`}
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'description',
                          e.target.value,
                          idx + 1
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${idx}`}>Quantity</Label>
                    <Input
                      id={`quantity-${idx}`}
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'quantity',
                          e.target.value,
                          idx + 1
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`unitPrice-${idx}`}>Unit Price</Label>

                    <Input
                      id={`unitPrice-${idx}`}
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'unitPrice',
                          e.target.value,
                          idx + 1
                        )
                      }
                    />
                  </div>
                  <div>
                    <Button
                      variant="destructive"
                      type="button"
                      className="px-5"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-5 font-bold text-black"
          >
            {mutation.isPending ? 'Updating...' : 'Update Purchase Order'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderEdit;
