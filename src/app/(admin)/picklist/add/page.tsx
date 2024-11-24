'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getAllCategories } from '@/services/categories';
import { getAllCustomerInformation } from '@/services/customer';
import { getAllInventoryItems } from '@/services/inventory-item';
import { createPickList } from '@/services/pick-list';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronsUpDown,
  Loader2Icon,
  Trash2Icon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  CATEGORY_QUERY_KEY,
  CUSTOMER_QUERY_KEY,
  INVENTORY_QUERY_KEY,
  PICKLIST_QUERY_KEY,
} from '@/config/query-keys';

import { cn } from '@/lib/utils';

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

import { PurchaseDialog } from './purchaseDialog';

const PriorityLevel = {
  Pending: 1,
  InProgress: 2,
  Completed: 3,
} as const;

const pickListSchema = z.object({
  referenceNo: z.string().min(1, 'required'),
  customerId: z.number().int().positive('required'),
  requiredDate: z.string().min(1, 'required'),
  priorityId: z.number().int(),
  project: z.any().optional(),
  aptHouseNumber: z.any().optional(),
  doorType: z.any().optional(),
  ironMongeryFinish: z.any().optional(),
  frameFinish: z.any().optional(),
});

export type pickListItems = {
  categoryId: number;
  itemId: number;
  itemCode: string;
  fireRating?: string;
  size?: string;
  finish?: string;
  order: number;
  date?: string;
  notes?: string;
  supplierId?: number;
  existingOrder?: number;
  purchaseOrderId?: number;
  madeOrderOfTheItems?: boolean;
};

export type AdditionalInformations = {
  wallThickNess?: string;
  handling?: string;
  underCut?: string;
  lockType?: string;
  fireRating?: string;
  note?: string;
};

const PickUpListRootPage = () => {
  const [open, setOpen] = React.useState(false);

  // Initialize form with Zod resolver
  const form = useForm<z.infer<typeof pickListSchema>>({
    resolver: zodResolver(pickListSchema),
    defaultValues: {
      referenceNo: '',
      customerId: 0,
      priorityId: 2,
      requiredDate: '',
    },
  });

  // Query hooks
  const { data: categoryData, isLoading: isCategotyLoading } = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: getAllCategories,
  });

  const { data: inventoryItemsList } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY, { filterText: '', filterParams: [] }],
    queryFn: () => getAllInventoryItems({ filterText: '', filterParams: [] }),
  });

  const { data: customerList } = useQuery({
    queryKey: CUSTOMER_QUERY_KEY,
    queryFn: getAllCustomerInformation,
  });

  const [pickListItems, setPickListItems] = useState<pickListItems[]>([]);
  const [additionalInformation, setAdditionalInformation] = useState<
    AdditionalInformations[]
  >([]);

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

  const handleItemFieldChange = (itemId: number, field: keyof Omit<pickListItems, 'categoryId' | 'itemId'>, value: string) => {
    setPickListItems((prevItems) =>
      prevItems.map((item) => item.itemId === itemId ? { ...item, [field]: value } : item));
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
      purchaseOrderId: p.purchaseOrderId,
    }));

    const data = {
      ...validatedData,
      pickListItems: pickListItemsWithoutCategory,
      additionalInformations: additionalInformation,
    };

    if (
      pickListItems.some((item) => Number(item.order) >
        (inventoryItemsList?.find((i) => i.id === item.itemId)?.stock ?? 0) && !item.madeOrderOfTheItems)
    ) {
      toast.error('Some items exceed available stock. Please create purchase orders for those items.');
      return;
    }
    mutation.mutateAsync(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h2 className="mb-4 text-2xl font-bold">Basic Informations</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="referenceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference No *</FormLabel>
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
                  <FormLabel>Status *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <SelectTrigger
                      className={
                        form.formState.errors.priorityId ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Select Status" />
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
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Customer *</FormLabel>
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
                  <FormLabel>Required Date *</FormLabel>
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
            <FormField
              control={form.control}
              name="aptHouseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apt House Number </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Door Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ironMongeryFinish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ironmogery Finish</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frameFinish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Frame Finish</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Project</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h2 className="mb-4 text-2xl font-bold">Items Informations</h2>
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
                    <Button variant="outline" role="combobox" className="justify-between">
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
                                            categoryId: c.key,
                                            itemCode: item.description + '-' + item.code,
                                            madeOrderOfTheItems: false,
                                            supplierId: item.supplierId,
                                            order: 1,
                                            fireRating: item.fireRating,
                                            size: item.size,
                                            finish: item.finish
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

              {pickListItems?.map((item) => {
                const isOrderConfirmed = item.madeOrderOfTheItems;
                const stock = inventoryItemsList?.find((i) => i.id === item.itemId)?.stock ?? 0;
                return (
                  item.categoryId === c.key && (
                    <div
                      key={item.itemId}
                      className={cn({
                        'bg-green-300/30': Number(item.order) <= stock || isOrderConfirmed,
                        'bg-red-300/30': Number(item.order) <= 0 || (Number(item.order) > stock && !isOrderConfirmed),
                        'flex items-center justify-center gap-x-2 border-b-2 border-white py-2': true,
                      })}
                    >
                      <div className="grid grid-cols-12 gap-4 rounded px-5">
                        <div className="col-span-4">
                          <Label>Item Code</Label>
                          <Input value={item.itemCode} disabled type="text" />
                        </div>

                        <div className="col-span-1">
                          <Label>Fire Rating</Label>
                          <Input
                            type="text"
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
                          <Label className="">
                            Order
                            <span className="mt-2 text-nowrap text-xs">
                              (Stock:{' '}
                              {
                                inventoryItemsList?.find(
                                  (i) => i.id === item.itemId
                                )?.stock
                              }
                              )
                            </span>
                          </Label>

                          <Input
                            type="number"
                            min={1}
                            value={item.order || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'order',
                                e.target.value
                              )
                            }
                          />
                          <div className="col-span-1 ml-2 mt-2 text-nowrap text-xs">
                            {pickListItems?.find(
                              (i) => i.itemId === item.itemId
                            )?.madeOrderOfTheItems &&
                              item.order > 0 && (
                                <span className="text-xs">
                                  {item.order} P.O Confirmed
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
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

                        <div className="col-span-1">
                          <Label>Notes</Label>
                          <Input
                            type="text"
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

                        <div className="d-flex grid grid-cols-2 content-start gap-2">
                          {pickListItems && (
                            <PurchaseDialog
                              //@ts-ignore
                              pickList={pickListItems}
                              //@ts-ignore
                              onPurchaseOrderConfirmationCallback={
                                setPickListItems
                              }
                              //@ts-ignore
                              value={pickListItems.find(
                                (i) => i.itemId === item.itemId
                              )}
                            />
                          )}

                          <Button
                            className="mt-3 translate-y-3"
                            variant="destructive"
                            onClick={() =>
                              setPickListItems((prev) =>
                                prev.filter((v) => v.itemId !== item.itemId)
                              )
                            }
                          >
                            <Trash2Icon />
                          </Button>

                          <div className="hidden">
                            <Label>Id</Label>
                            <Input value={item.itemId} disabled type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          ))}

          <h2 className="mb-4 text-2xl font-bold">Additional Informations</h2>
          <div className="flex flex-col">
            {additionalInformation.map((info, index) => (
              <div className="flex items-center">
                <div className="mr-5">
                  <Label>Fire Rating</Label>
                  <Input
                    key={index}
                    value={info.fireRating}
                    onChange={(e) => {
                      setAdditionalInformation((prev) =>
                        prev.map((i, idx) =>
                          idx === index
                            ? { ...i, fireRating: e.target.value }
                            : i
                        )
                      );
                    }}
                  />
                </div>
                <div className="mr-5">
                  <Label>Handling</Label>
                  <Input
                    key={index}
                    value={info.handling}
                    onChange={(e) => {
                      setAdditionalInformation((prev) =>
                        prev.map((i, idx) =>
                          idx === index ? { ...i, handling: e.target.value } : i
                        )
                      );
                    }}
                  />
                </div>
                <div className="mr-5">
                  <Label>LockType</Label>
                  <Input
                    key={index}
                    value={info.lockType}
                    onChange={(e) => {
                      setAdditionalInformation((prev) =>
                        prev.map((i, idx) =>
                          idx === index ? { ...i, lockType: e.target.value } : i
                        )
                      );
                    }}
                  />
                </div>
                <div className="mr-5">
                  <Label>UnderCut</Label>
                  <Input
                    key={index}
                    value={info.underCut}
                    onChange={(e) => {
                      setAdditionalInformation((prev) =>
                        prev.map((i, idx) =>
                          idx === index ? { ...i, underCut: e.target.value } : i
                        )
                      );
                    }}
                  />
                </div>
                <div className="mr-5">
                  <Label> Wall Thickness</Label>
                  <Input
                    key={index}
                    value={info.wallThickNess}
                    onChange={(e) => {
                      setAdditionalInformation((prev) =>
                        prev.map((i, idx) =>
                          idx === index
                            ? { ...i, wallThickNess: e.target.value }
                            : i
                        )
                      );
                    }}
                  />
                </div>

                <div className="mx-4 cursor-pointer">
                  <Button
                    className="translate-y-3"
                    variant="destructive"
                    onClick={() =>
                      setAdditionalInformation((prev) =>
                        prev.filter((_, idx) => idx !== index)
                      )
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-5 w-fit cursor-pointer rounded-sm bg-primary p-2 text-black"
            onClick={(e) => {
              setAdditionalInformation((prev) => [
                ...prev,
                {
                  fireRating: '',
                  handling: '',
                  lockType: '',
                  note: '',
                  underCut: '',
                  wallThickNess: '',
                },
              ]);
            }}
          >
            Add New
          </div>

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
