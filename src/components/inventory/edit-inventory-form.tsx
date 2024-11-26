'use client';

import { useRouter } from 'next/navigation';

import { getAllCategories } from '@/services/categories';
import { editInventoryItem } from '@/services/inventory-item';
import { getAllSupplierInformation } from '@/services/supplier';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { InventoryItemUpdateType } from '@/types/inventory-items';

import {
  CATEGORY_QUERY_KEY,
  INVENTORY_QUERY_KEY,
  SUPPLIER_QUERY_KEY,
} from '@/config/query-keys';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  id: z.number(),
  code: z.string(),
  fireRating: z.any().optional(),
  size: z.any().optional(),
  finish: z.any().optional(),
  cost: z.any(),
  description: z.any().optional(),
  categoryId: z.number().min(1, "required"),
  supplierId: z.number().min(1, "required"),
  stock: z.any(),
  totalStockValue: z.any(),
  safetyStockRequired: z.any(),
  reorderLevel: z.any()
});

export default function EditInventoryItemForm({ data }: { data: InventoryItemUpdateType; }) {
  const router = useRouter();
  const supplierData = useQuery({ queryKey: SUPPLIER_QUERY_KEY, queryFn: getAllSupplierInformation });
  const categoryData = useQuery({ queryKey: CATEGORY_QUERY_KEY, queryFn: getAllCategories });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success('Inventory Item updated successfully');
      router.push('/inventory');
    },
    onError: (error) => { toast.error(error.message); },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data.id,
      code: data.code,
      fireRating: data.fireRating,
      size: data.size,
      finish: data.finish,
      cost: data.cost,
      description: data.description,
      categoryId: data.categoryId,
      supplierId: data.supplierId,
      stock: data.stock,
      totalStockValue: data.totalStockValue,
      safetyStockRequired: data.safetyStockRequired,
      reorderLevel: data.reorderLevel,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //@ts-ignore
      mutation.mutate(values);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 py-10">

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-4">
            <FormField
              control={form.control}
              name="fireRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fire Rating</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-4">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="finish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finish</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-4">
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} defaultValue={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} defaultValue={0} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="totalStockValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Stock Value</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} defaultValue={0} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-4">
            <FormField
              control={form.control}
              name="safetyStockRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safety Stock Required</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} defaultValue={0} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-4">
            <FormField
              control={form.control}
              name="reorderLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Level</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} defaultValue={0} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('w-100 justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value && categoryData?.data ? categoryData?.data.find((d) => d.key === field.value)?.value : 'Select Category'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-0">
                      <Command>
                        <CommandInput placeholder="Search ..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {categoryData.data?.map((d) => (
                              <CommandItem
                                value={d.value}
                                key={d.key}
                                onSelect={() => { form.setValue('categoryId', d.key); }}>
                                <Check className={cn('mr-2 h-4 w-4', d.key === field.value ? 'opacity-100' : 'opacity-0')} />
                                {d.value}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Suppiler</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('w-100 justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value && supplierData?.data ? supplierData?.data.find((s) => s.id === field.value)?.fullName : 'Select Supplier'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-0">
                      <Command>
                        <CommandInput placeholder="Search ..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {supplierData.data?.map((s) => (
                              <CommandItem value={s.fullName} key={s.id.toString()} onSelect={() => { form.setValue('supplierId', s.id); }}>
                                <Check className={cn('mr-2 h-4 w-4', s.id == field.value ? 'opacity-100' : 'opacity-0')} />
                                {s.fullName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : ('Submit')}
        </Button>
      </form>
    </Form>
  );
}
