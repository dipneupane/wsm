'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { getAllInventoryItems } from '@/services/inventory-item';
import {
  getPurchaseOrderById,
  getPurchaseOrderNumber,
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
  INVENTORY_QUERY_KEY,
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

  // Query hooks
  const { data: supplierList } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });

  const { data: inventoryItemsList } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY, { filterText: '', filterParams: [] }],
    queryFn: () => getAllInventoryItems({ filterText: '', filterParams: [] }),
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
      supplierId: 0,
      orderDate: '',
      requiredByDate: '',
      paymentTerm: '',
      statusId: 1,
    },
  });

  type PurchaseOrderItems = {
    id: number;
    itemId: number;
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
  };

  const [purchaseOrderItems, setPurchaseOrderItems] = React.useState<
    PurchaseOrderItems[]
  >([]);

  // Prefill data when fetched
  useEffect(() => {
    if (purchaseOrderData) {
      form.reset({
        supplierId: purchaseOrderData.supplierId,
        orderDate: purchaseOrderData.orderDate.split('T')[0],
        requiredByDate: purchaseOrderData.requiredByDate.split('T')[0],
        paymentTerm: purchaseOrderData.paymentTerm,
        statusId: purchaseOrderData.statusId,
      });
      //@ts-ignore
      setPurchaseOrderItems(purchaseOrderData.purchaseOrderItems || []);
    }
  }, [purchaseOrderData, form]);

  const handleAddItem = (
    itemId: number,
    itemCode: string,
    itemCost: number,
    description: string
  ) => {
    setPurchaseOrderItems((prev: any) => [
      ...prev,
      {
        itemId,
        itemCode: itemCode,
        description,
        unitPrice: itemCost,
        quantity: 1,
      },
    ]);
  };

  const handleItemFieldChange = (
    itemId: number,
    field: string,
    value: string
  ) => {
    if (field === 'quantity' || field === 'unitPrice') {
      // Allow empty string
      if (value === '') {
        setPurchaseOrderItems((prevItems) =>
          prevItems.map((item) =>
            item.itemId === itemId ? { ...item, [field]: '' } : item
          )
        );
        return;
      }

      // Allow valid numeric input (including floats like "1.", "1.5")
      const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(value);
      if (!isValidNumber) return;

      setPurchaseOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? { ...item, [field]: value } : item
        )
      );
      return;
    }

    // Handle other fields
    setPurchaseOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, [field]: value } : item
      )
    );
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
            <FormItem>
              <FormLabel>PO Number</FormLabel>
              <FormControl>
                <Input value={purchaseOrderData?.poNumber!} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>

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
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Order Items</h2>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="justify-between"
                    >
                      Select items
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search items..." />
                      <CommandEmpty>No items found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-64">
                          {inventoryItemsList?.map((item) => (
                            <CommandItem
                              key={item.id}
                              disabled={purchaseOrderItems?.some(
                                (i) => i.itemId === item.id
                              )}
                              onSelect={() =>
                                handleAddItem(
                                  item.id,
                                  item.code,
                                  item.cost,
                                  item.description
                                )
                              }
                            >
                              {item.id} - {item.code} - {item.description}-
                              <span className="text-sm">
                                Stock({item.stock})
                              </span>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex flex-col items-start">
              {purchaseOrderItems?.map((item: any) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-center gap-x-2 py-2"
                >
                  <div>
                    <Label>Item Code</Label>
                    <Input
                      className="w-80"
                      value={item.itemCode}
                      disabled
                      type="text"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`description-${item.itemId}`}>
                      Description
                    </Label>
                    <Input
                      className="w-[560px]"
                      type="text"
                      id={`description-${item.itemId}`}
                      value={item.description}
                      onChange={(e) =>
                        handleItemFieldChange(
                          item.itemId,
                          'description',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                    <Input
                      className="w-20"
                      id={`quantity-${item.id}`}
                      type="number"
                      required
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemFieldChange(
                          item.itemId,
                          'quantity',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                    <Input
                      className="w-20"
                      id={`unitPrice-${item.id}`}
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemFieldChange(
                          item.itemId,
                          'unitPrice',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    className="translate-y-3"
                    variant="destructive"
                    onClick={() =>
                      setPurchaseOrderItems((prev: any) =>
                        prev.filter((v: any) => v.itemId !== item.itemId)
                      )
                    }
                  >
                    <Trash2Icon />
                  </Button>
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
