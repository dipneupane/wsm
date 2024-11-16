'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { getAllCategories } from '@/services/categories';
import { getAllCustomerInformation } from '@/services/customer';
import { getAllInventoryItems } from '@/services/inventory-item';
import { createPickList } from '@/services/pick-list';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, Loader2Icon, Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  CATEGORY_QUERY_KEY,
  CUSTOMER_QUERY_KEY,
  INVENTORY_QUERY_KEY,
  PICKLIST_QUERY_KEY,
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

const PriorityLevel = {
  Pending: 1,
  InProgress: 2,
  Completed: 0,
} as const;

// Create the Zod schema
const pickListSchema = z.object({
  referenceNo: z.string().min(1, 'Reference number is required'),
  customerId: z.number().int().positive('Please select a customer'),
  priorityId: z.number().int(),
  requiredDate: z.string(),
});

const PickUpListRootPage = () => {
  const [open, setOpen] = React.useState(false);

  // Initialize form with Zod resolver
  const form = useForm<z.infer<typeof pickListSchema>>({
    resolver: zodResolver(pickListSchema),
    defaultValues: {
      referenceNo: '',
      customerId: 0,
      priorityId: 0,
      requiredDate: '',
    },
  });

  // Query hooks
  const { data: categoryData, isLoading: isCategotyLoading } = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: getAllCategories,
  });

  const { data: inventoryItemsList } = useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: getAllInventoryItems,
  });

  const { data: customerList } = useQuery({
    queryKey: CUSTOMER_QUERY_KEY,
    queryFn: getAllCustomerInformation,
  });

  type pickListItems = {
    categotyId: number;
    itemId: number;
    fireRating?: string;
    size?: string;
    finish?: string;
    order?: string;
    date?: string;
    notes?: string;
  };

  const [pickListItems, setPickListItems] = React.useState<pickListItems[]>([]);

  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createPickList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PICKLIST_QUERY_KEY });
      toast.success('Pick list created successfully');
      router.push('/picklist');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const handleItemFieldChange = (
    itemId: number,
    field: keyof Omit<pickListItems, 'categotyId' | 'itemId'>,
    value: string
  ) => {
    setPickListItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const onSubmit = async (values: z.infer<typeof pickListSchema>) => {
    const validatedData = pickListSchema.parse(values);
    const pickListItemsWithoutCategory = pickListItems.map((p) => ({
      itemId: p.itemId,
      fireRating: p.fireRating,
      size: p.size,
      finish: p.finish,
      order: p.order,
      date: p.date ?? new Date(Date.now()).toISOString(),
      notes: p.notes,
    }));
    const data = {
      ...validatedData,
      pickListItems: pickListItemsWithoutCategory,
    };
    console.log(data);
    mutation.mutateAsync(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="referenceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference No</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter reference number"
                      {...field}
                      className={
                        form.formState.errors.referenceNo
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
              name="priorityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <SelectTrigger
                      className={
                        form.formState.errors.priorityId ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PriorityLevel.Completed.toString()}>
                        Completed
                      </SelectItem>
                      <SelectItem value={PriorityLevel.InProgress.toString()}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={PriorityLevel.Pending.toString()}>
                        Pending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Customer</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`justify-between ${form.formState.errors.customerId ? 'border-red-500' : ''}`}
                      >
                        {field.value && customerList
                          ? customerList.find(
                              (customer) => customer.id === field.value
                            )?.fullName
                          : 'Select Customer'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search customers..." />
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {customerList?.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                onSelect={() => {
                                  form.setValue('customerId', customer.id, {
                                    shouldValidate: true,
                                  });
                                  setOpen(false);
                                }}
                              >
                                {customer.fullName}
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
              name="requiredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className={
                        form.formState.errors.requiredDate
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isCategotyLoading && (
            <Loader2Icon className="animate-spin text-primary" />
          )}
          {categoryData?.map((c, index) => (
            <div key={index} className="border-b">
              {/* top */}
              <div className="flex items-center justify-between pb-2">
                <h2>
                  {index + 1} {c.value}
                </h2>
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
                          {inventoryItemsList?.map(
                            (item) =>
                              item.categoryId === c.key && (
                                <>
                                  {
                                    <CommandItem
                                      disabled={pickListItems?.some(
                                        (i) => i.itemId === item.id
                                      )}
                                      onSelect={() =>
                                        setPickListItems((prev) => [
                                          ...prev,
                                          {
                                            itemId: item.id,
                                            categotyId: c.key,
                                          },
                                        ])
                                      }
                                      key={item.categoryId}
                                    >
                                      {item.categoryId}-{item.id} -{item.code} -{' '}
                                      {item.description}
                                    </CommandItem>
                                  }
                                </>
                              )
                          )}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/*  additional fields  */}
              <div className="">
                {pickListItems?.map(
                  (item) =>
                    item.categotyId === c.key && (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-center gap-x-2 py-2"
                      >
                        <Button
                          className="translate-y-3"
                          variant="destructive"
                          onClick={() =>
                            setPickListItems((prev) =>
                              prev.filter((v) => v.itemId !== item.itemId)
                            )
                          }
                        >
                          <Trash2Icon />
                        </Button>
                        <div className="">
                          <Label>Id</Label>
                          <Input value={item.itemId} disabled type="text" />
                        </div>

                        <div className="">
                          <Label>Fire Rating</Label>
                          <Input
                            type="text"
                            placeholder="fireRating"
                            value={item.fireRating || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'fireRating',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="">
                          <Label>Size</Label>
                          <Input
                            type="text"
                            placeholder="size"
                            value={item.size || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'size',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="">
                          <Label>Finish</Label>
                          <Input
                            type="text"
                            placeholder="finish"
                            value={item.finish || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'finish',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="">
                          <Label>Order</Label>
                          <Input
                            type="text"
                            placeholder="order"
                            value={item.order || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'order',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            placeholder="date"
                            value={item.date || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'date',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="">
                          <Label>Notes</Label>
                          <Input
                            type="text"
                            placeholder="notes"
                            value={item.notes || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'notes',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Pick List'}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PickUpListRootPage;
