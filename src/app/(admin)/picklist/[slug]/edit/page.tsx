'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { getAllCategories } from '@/services/categories';
import { getAllCustomerInformation } from '@/services/customer';
import { getAllInventoryItems } from '@/services/inventory-item';
import {
  createPickList,
  getPickListById,
  updatePickList,
} from '@/services/pick-list';
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

import { AdditionalInformations } from '../../add/page';
import { PurchaseDialog } from '../../add/purchaseDialog';

const PriorityLevel = {
  Pending: 1,
  InProgress: 2,
  Completed: 3,
} as const;

// Create the Zod schema
const pickListSchema = z.object({
  referenceNo: z.string().min(1, 'Reference number is required'),
  customerId: z.number().int().positive('Please select a customer'),
  priorityId: z.number().int(),
  requiredDate: z.string(),
  project: z.string().optional(),
  aptHouseNumber: z.string().optional(),
  doorType: z.string().optional(),
  ironMongeryFinish: z.string().optional(),
  frameFinish: z.string().optional(),
});

interface PickListProps {
  params: {
    slug: string;
  };
}

const PickUpListEditPage = ({ params: { slug } }: PickListProps) => {
  const [open, setOpen] = React.useState(false);

  const { data: pickListDataById } = useQuery({
    queryKey: ['PickList', 'GetById', Number(slug)],
    queryFn: () => getPickListById(Number(slug)),
  });

  // Initialize form with Zod resolver
  const form = useForm<z.infer<typeof pickListSchema>>({
    resolver: zodResolver(pickListSchema),
    defaultValues: {
      referenceNo: pickListDataById?.referenceNo,
      customerId: pickListDataById?.customerId,
      priorityId: pickListDataById?.priorityId ?? 2,
      requiredDate: pickListDataById?.requiredDate,
      project: pickListDataById?.project,
      aptHouseNumber: pickListDataById?.aptHouseNumber,
      doorType: pickListDataById?.doorType,
      ironMongeryFinish: pickListDataById?.ironMongeryFinish,
      frameFinish: pickListDataById?.frameFinish,
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

  type pickListItems = {
    categoryId?: number;
    itemId: number;
    fireRating?: string;
    size?: string;
    finish?: string;
    order?: string;
    date?: string;
    notes?: string;
    madeOrderOfTheItems?: boolean;
  };

  const [pickListItems, setPickListItems] = React.useState<pickListItems[]>([]);
  const [additionalInformation, setAdditionalInformation] = useState<
    AdditionalInformations[]
  >([]);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (pickListDataById) {
      form.reset({
        referenceNo: pickListDataById.referenceNo,
        customerId: pickListDataById.customerId,
        priorityId: pickListDataById.priorityId,
        requiredDate: new Date(pickListDataById.requiredDate)
          .toISOString()
          .split('T')[0],
        project: pickListDataById.project,
        aptHouseNumber: pickListDataById.aptHouseNumber,
        doorType: pickListDataById.doorType,
        ironMongeryFinish: pickListDataById.ironMongeryFinish,
        frameFinish: pickListDataById.frameFinish,
      });
      setAdditionalInformation(pickListDataById.additionalInformations ?? []);
      setPickListItems(
        pickListDataById.pickListItems.map((item) => ({
          ...item,
          date: new Date(item.date!).toISOString().split('T')[0],
        }))
      );
    }
  }, [pickListDataById]);

  const mutation = useMutation({
    mutationFn: updatePickList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PICKLIST_QUERY_KEY });
      toast.success('Pick list updated successfully');
      router.push('/picklist');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const handleItemFieldChange = (
    itemId: number,
    field: keyof Omit<pickListItems, 'categoryId' | 'itemId'>,
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
      additionalInformations: additionalInformation,
    };
    mutation.mutateAsync(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
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
                  <FormLabel>Status</FormLabel>
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
            <FormField
              control={form.control}
              name="aptHouseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AptHouseNumber </FormLabel>
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
                  <FormLabel>Iron Mogery Finish</FormLabel>
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
                                            categoryId: c.key,
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
                    item.categoryId === c.key && (
                      <div
                        className={cn({
                          'text-primary':
                            Number(item.order) <=
                            (inventoryItemsList?.find(
                              (i) => i.id === item.itemId
                            )?.stock ?? 0),
                          'text-orange-200': pickListItems?.find(
                            (i) => i.itemId === item.itemId
                          )?.madeOrderOfTheItems,
                          'text-red-500':
                            Number(item.order) >
                              (inventoryItemsList?.find(
                                (i) => i.id === item.itemId
                              )?.stock ?? 0) &&
                            !pickListItems?.find(
                              (i) => i.itemId === item.itemId
                            )?.madeOrderOfTheItems,
                          'flex items-center justify-center gap-x-2 py-2': true,
                        })}
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
                        <div className="hidden">
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
                        <div
                          className={cn({
                            'text-primary':
                              Number(item.order) <=
                              (inventoryItemsList?.find(
                                (i) => i.id === item.itemId
                              )?.stock ?? 0),
                            'text-orange-200': pickListItems?.find(
                              (i) => i.itemId === item.itemId
                            )?.madeOrderOfTheItems,
                            'text-red-500':
                              Number(item.order) >
                                (inventoryItemsList?.find(
                                  (i) => i.id === item.itemId
                                )?.stock ?? 0) &&
                              !pickListItems?.find(
                                (i) => i.itemId === item.itemId
                              )?.madeOrderOfTheItems,
                            'flex flex-col items-center': true,
                          })}
                        >
                          <Label className="">Order</Label>
                          <span className="text-xs text-red-500">
                            Stock:
                            {
                              inventoryItemsList?.find(
                                (i) => i.id === item.itemId
                              )?.stock
                            }
                          </span>
                          <Input
                            type="number"
                            value={item.order || ''}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.itemId,
                                'order',
                                e.target.value
                              )
                            }
                          />
                          {pickListItems?.find((i) => i.itemId === item.itemId)
                            ?.madeOrderOfTheItems ? (
                            <span className="text-xs">PickListAdded</span>
                          ) : (
                            'no'
                          )}
                          {Number(item.order) >
                          (inventoryItemsList?.find((i) => i.id === item.itemId)
                            ?.stock ?? 0) ? (
                            <span>
                              <PurchaseDialog
                                //@ts-ignore
                                pickList={pickListItems}
                                //@ts-ignore
                                onPickListItems={setPickListItems}
                                //@ts-ignore
                                value={pickListItems.find(
                                  (i) => i.itemId === item.itemId
                                )}
                              />
                            </span>
                          ) : (
                            ''
                          )}
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
          <div className="">
            <h2>Additinonal Information</h2>
            <div
              className="w-fit cursor-pointer rounded-xl bg-primary p-2 text-black"
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
              Add
            </div>
          </div>
          <div className="flex flex-col">
            {additionalInformation.map((info, index) => (
              <div className="flex items-center">
                <h3>{index + 1}</h3>
                <div className="">
                  <span
                    onClick={() =>
                      setAdditionalInformation((prev) =>
                        prev.filter((_, idx) => idx !== index)
                      )
                    }
                  >
                    <Trash2Icon />
                  </span>
                </div>
                <div className="">
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
                <div className="">
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
                <div className="">
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
                <div className="">
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
                <div className="">
                  <Label> Wall ThickNess</Label>
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
              </div>
            ))}
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

export default PickUpListEditPage;
