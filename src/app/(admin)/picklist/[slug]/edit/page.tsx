'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { getAllCategories } from '@/services/categories';
import { getAllCustomerInformation } from '@/services/customer';
import { getAllInventoryItems } from '@/services/inventory-item';
import { getPickListById, updatePickList } from '@/services/pick-list';
import { getAllSupplierInformation } from '@/services/supplier';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, Loader2Icon, Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { InventoryItemsGetAllType } from '@/types/inventory-items';
import { ItemGetByIdType } from '@/types/items';

import {
  CATEGORY_QUERY_KEY,
  CUSTOMER_QUERY_KEY,
  INVENTORY_QUERY_KEY,
  PICKLIST_QUERY_KEY,
  SUPPLIER_QUERY_KEY,
} from '@/config/query-keys';

import { cn } from '@/lib/utils';

import { MultiSelectDropdown } from '@/components/MultiSelectDropDown/multiselectdropdown';
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
import { Textarea } from '@/components/ui/textarea';

import { AdditionalInformations } from '../../add/page';
import { PurchaseDialog } from '../../add/purchaseDialog';

const PriorityLevel = {
  Pending: 1,
  InProgress: 2,
  Completed: 3,
} as const;

// Create the Zod schema
const pickListSchema = z.object({
  id: z.number().min(1),
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

interface PickListProps {
  params: {
    slug: string;
  };
}

const PickUpListEditPage = ({ params: { slug } }: PickListProps) => {
  const [open, setOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<
    InventoryItemsGetAllType[] | undefined
  >([]);
  const [supplierId, setSupplierId] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: pickListDataById } = useQuery({
    queryKey: ['PickList', 'GetById', Number(slug)],
    queryFn: () => getPickListById(Number(slug)),
  });

  // Initialize form with Zod resolver
  const form = useForm<z.infer<typeof pickListSchema>>({
    resolver: zodResolver(pickListSchema),
    defaultValues: {
      id: pickListDataById?.id,
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

  const {
    data: inventoryItemsList,
    refetch: refetchInventory,
    isRefetching: isInventoryRefetching,
    isLoading: isInventoryListLoading,
  } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY, { filterText: '', filterParams: [] }],
    queryFn: () => getAllInventoryItems({ filterText: '', filterParams: [] }),
  });

  const { data: customerList } = useQuery({
    queryKey: CUSTOMER_QUERY_KEY,
    queryFn: getAllCustomerInformation,
  });

  const { data: suppliers } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });

  type pickListItems = {
    id?: number;
    categoryId?: number;
    itemId: number;
    itemCode: string;
    fireRating?: string;
    size?: string;
    finish?: string;
    order?: number;
    orderedCount?: number;
    date?: string;
    notes?: string;
    existingOrder?: number;
    purchaseOrderId?: number;
    madeOrderOfTheItems?: boolean;
  };

  const [pickListItems, setPickListItems] = React.useState<pickListItems[]>([]);
  const [additionalInformation, setAdditionalInformation] = useState<
    AdditionalInformations[]
  >([]);

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    refetchInventory;
  }, [pickListDataById]);

  useEffect(() => {
    if (pickListDataById && !isInventoryRefetching) {
      form.reset({
        id: pickListDataById.id,
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
          id: item.id,
          date: new Date(item.date!).toISOString().split('T')[0],
          orderedCount: inventoryItemsList?.filter(
            (x) => x.id == item.itemId
          )[0].orderedCount,
        }))
      );
    }
  }, [isInventoryRefetching]);

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
      id: p.id,
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
    mutation.mutateAsync(data);
  };

  useEffect(() => {
    setFilteredItems(inventoryItemsList);
  }, [inventoryItemsList]);

  const handleFilterChange = () => {
    setOpenDropdown(null);
    const filtered =
      supplierId.length > 0
        ? inventoryItemsList?.filter((item: ItemGetByIdType) =>
            supplierId.includes(item.supplierId)
          )
        : inventoryItemsList;
    setFilteredItems(filtered);
  };

  const handleFilterReset = () => {
    setSupplierId([]);
    setOpenDropdown(null);
    setFilteredItems(inventoryItemsList);
  };

  const handleDropdownToggle = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
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
                    <Command className="overflow-visible">
                      <div className="flex items-center gap-2 p-1">
                        <CommandInput
                          placeholder="Search items..."
                          className="w-full min-w-72"
                        />

                        {suppliers && suppliers?.length > 0 && (
                          <MultiSelectDropdown
                            label="Select Suppliers"
                            options={suppliers?.map((sup) => ({
                              label: sup.fullName,
                              value: sup.id,
                            }))}
                            selectedOptions={supplierId}
                            setSelectedOptions={setSupplierId}
                            isOpen={openDropdown === 'supplier'}
                            toggleOpen={() => handleDropdownToggle('supplier')}
                            className="border-none"
                          />
                        )}
                        <Button type="button" onClick={handleFilterChange}>
                          Apply Filters
                        </Button>
                        <Button
                          type="button"
                          className="bg-red-500 text-white hover:bg-red-400"
                          onClick={handleFilterReset}
                        >
                          Reset
                        </Button>
                      </div>
                      <CommandGroup>
                        <ScrollArea className="h-64 w-[700px]">
                          {isInventoryListLoading && (
                            <Loader2Icon className="mx-auto mt-10 animate-spin" />
                          )}
                          {filteredItems?.map(
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
                                            itemCode:
                                              item.description +
                                              '-' +
                                              item.code,
                                            madeOrderOfTheItems: false,
                                            supplierId: item.supplierId,
                                            order: 1,
                                            fireRating: item.fireRating,
                                            size: item.size,
                                            finish: item.finish,
                                            orderedCount: item.orderedCount,
                                          },
                                        ])
                                      }
                                      key={item.categoryId}
                                    >
                                      {item.categoryId}-{item.id} -{item.code} -{' '}
                                      {item.description}-
                                      <span className="text-sm">
                                        Stock({item.stock})
                                      </span>
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
              {pickListItems?.map((item) => {
                const isOrderConfirmed = item.madeOrderOfTheItems;
                const stock =
                  inventoryItemsList?.find((i) => i.id === item.itemId)
                    ?.stock ?? 0;
                const hasExistingOrder =
                  typeof item.purchaseOrderId != 'undefined' &&
                  item.purchaseOrderId > 0
                    ? true
                    : false;

                return (
                  item.categoryId === c.key && (
                    <div
                      className={cn({
                        'bg-green-300/30':
                          Number(item.order) <= stock ||
                          isOrderConfirmed ||
                          hasExistingOrder,
                        'bg-red-300/30':
                          Number(item.order) <= 0 ||
                          (Number(item.order) > stock &&
                            !isOrderConfirmed &&
                            !hasExistingOrder),
                        'flex items-center justify-center gap-x-2 border-b-2 border-white py-2':
                          true,
                      })}
                    >
                      <div className="grid grid-cols-12 gap-4 rounded px-5">
                        <div className="col-span-3">
                          <Label>Item Code</Label>
                          <Textarea rows={3} value={item.itemCode} disabled />
                        </div>

                        <div className="">
                          <Label>Fire Rating</Label>
                          <Textarea
                            rows={3}
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
                          <Textarea
                            rows={3}
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
                          <Textarea
                            rows={3}
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
                            <span className="mt-2 text-nowrap text-[10px]">
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
                          <div className="ml-2 mt-2 text-xs">
                            {pickListItems?.find(
                              (i) => i.itemId === item.itemId
                            )?.madeOrderOfTheItems &&
                              item.order &&
                              item.order > 0 && (
                                <span className="text-xs">
                                  {item.order} P.O Confirmed
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="">
                          <Label>On Order</Label>
                          <Input
                            type="text"
                            value={item.orderedCount || ''}
                            disabled
                          />
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

                        <div className="">
                          <Label>Notes</Label>
                          <Textarea
                            rows={3}
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
                            className="mt-3 translate-x-3 translate-y-3"
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
