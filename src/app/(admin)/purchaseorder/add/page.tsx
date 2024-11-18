'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { createPurchaseOrder } from '@/services/purchase-order';
import { getAllSupplierInformation } from '@/services/supplier';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, Loader2Icon, Trash2, Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SUPPLIER_QUERY_KEY } from '@/config/query-keys';

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

// Create the Zod schema
const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, 'PO number is required'),
  supplierId: z.number().int().positive('Please select a valid supplier'),
  orderDate: z.string().min(1, 'Order date is required'),
  requiredByDate: z.string().min(1, 'Required by date is required'),
  paymentTerm: z.string().min(1, 'Payment term is required'),
  statusId: z.number().int().positive('Status ID is required'),
});

const STATUS = {
  Draft: 1,
  Ordered: 2,
  Received: 3,
} as const;

const PurchaseOrderRootPage = () => {
  const [open, setOpen] = React.useState(false);

  type PurchaseOrderItems = {
    id: number;
    itemId: string;
    description: string;
    quantity: string;
    unitPrice: string;
  };

  const [purchaseOrderItems, setPurchaseOrderItems] = React.useState<
    PurchaseOrderItems[]
  >([]);

  // Initialize form with Zod resolver
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

  // Query hooks
  const { data: supplierList } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_QUERY_KEY });
      toast.success('Purchase order created successfully');
      router.push('/purchaseorder');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleAddItem = () => {
    setPurchaseOrderItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        itemId: '',
        description: '',
        quantity: '',
        unitPrice: '',
      },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setPurchaseOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (id: number, field: string, value: string) => {
    setPurchaseOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const onSubmit = async (values: z.infer<typeof purchaseOrderSchema>) => {
    const validatedData = purchaseOrderSchema.parse(values);
    const formattedPurchaseOrderItems = purchaseOrderItems.map((p) => ({
      itemId: Number(p.itemId),
      description: p.description,
      quantity: Number(p.quantity),
      unitPrice: Number(p.unitPrice),
    }));

    const data = {
      ...validatedData,
      purchaseOrderItems: formattedPurchaseOrderItems,
    };
    console.log(data);
    // mutation.mutateAsync(data);
  };
  return (
    <>
      <h2 className="text-xl font-bold">Purchase Order Details</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="poNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PO Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter PO number"
                      {...field}
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
                              (supplier) => supplier.id === field.value
                            )?.fullName
                          : 'Select Supplier'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search supplier..." />
                        <CommandEmpty>No customer found.</CommandEmpty>
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
                  <FormLabel>Required By</FormLabel>
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
                  <FormLabel>Payment Terms</FormLabel>
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
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <SelectTrigger
                      className={
                        form.formState.errors.statusId ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Select priority" />
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
              <Button type="button" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
            <div>
              {purchaseOrderItems.map((item) => (
                <div
                  key={item.id}
                  // className="mb-4 grid grid-cols-12 items-center gap-4"
                  className="mb-4 flex flex-wrap items-center gap-4"
                >
                  <div>
                    <Label htmlFor={`itemId-${item.id}`}>Item ID</Label>
                    <Input
                      type="number"
                      id={`itemId-${item.id}`}
                      value={item.itemId}
                      onChange={(e) =>
                        handleChange(item.id, 'itemId', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${item.id}`}>
                      Description
                    </Label>
                    <Input
                      type="text"
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) =>
                        handleChange(item.id, 'description', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(item.id, 'quantity', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                    <Input
                      id={`unitPrice-${item.id}`}
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleChange(item.id, 'unitPrice', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Button
                      variant="destructive"
                      type="button"
                      className="px-5"
                      onClick={() => handleRemoveItem(item.id)}
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
            className="w-full py-5 font-bold text-black"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Purchase Order'}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PurchaseOrderRootPage;