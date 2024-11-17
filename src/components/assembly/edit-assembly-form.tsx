'use client';

import { useRouter } from 'next/navigation';

import { createAssembly, updateAssembly } from '@/services/assembly';
import { getAllInventoryItems } from '@/services/inventory-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2Icon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { AssemblyGetByIDType } from '@/types/assembly';

import { ASSEMBLY_QUERY_KEY, INVENTORY_QUERY_KEY } from '@/config/query-keys';

import { Badge } from '@/components/ui/badge';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  items: z.array(z.number()),
});

type InventoryItem = {
  id: number;
  categoryName: string;
  supplierName: string;
  code: string;
  description: string;
  categoryId: number;
  supplierId: number;
  cost: number;
  stock: number;
};

export default function EditAssemblyForm({
  data,
}: {
  data: AssemblyGetByIDType;
}) {
  const { data: inventoryItemsList } = useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: getAllInventoryItems,
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAssembly,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ASSEMBLY_QUERY_KEY[0], data.id],
      });
      toast.success('Assembly updated successfully');
      router.push('/assemblies');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data.id,
      code: data.code,
      description: data.description,
      items: data.items.map((item) => item.id),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      mutation.mutate(values);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="eg : FE2" type="text" {...field} />
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
                <Input placeholder="Enter description" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory Items</FormLabel>
              <div className="flex flex-col gap-4">
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
                          {inventoryItemsList?.map((item: InventoryItem) => (
                            <CommandItem
                              key={item.id}
                              onSelect={() => {
                                const currentItems = field.value || [];
                                const newItems = currentItems.includes(item.id)
                                  ? currentItems.filter((id) => id !== item.id)
                                  : [...currentItems, item.id];
                                field.onChange(newItems);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  field.value?.includes(item.id)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                }`}
                              />
                              {item.code}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="flex flex-wrap gap-2">
                  {field.value?.map((itemId) => {
                    const item = inventoryItemsList?.find(
                      (i: InventoryItem) => i.id === itemId
                    );
                    return (
                      <div key={itemId} className="flex items-center gap-1">
                        <Badge variant="secondary" className="px-3 py-1">
                          {item?.code}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => {
                            field.onChange(
                              field.value.filter((id) => id !== itemId)
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove {item?.code}</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
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
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}
