'use client';

import { useRouter } from 'next/navigation';

import { createAssembly } from '@/services/assembly';
import { getAllInventoryItems } from '@/services/inventory-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2Icon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
  code: z.string(),
  description: z.string(),
  items: z.array(z.number()),
});

interface InventoryItem {
  id: number;
  categoryName: string;
  supplierName: string;
  code: string;
  description: string;
  categoryId: number;
  supplierId: number;
  cost: number;
  stock: number;
}

interface ItemSelectorProps {
  items: InventoryItem[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

const ItemSelector = ({ items, selectedIds, onSelect }: ItemSelectorProps) => {
  const handleSelect = (itemId: number) => {
    const newItems = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId];
    onSelect(newItems);
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  return (
    <div className="flex flex-col gap-4">
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
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item.id)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedIds.includes(item.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    />
                    {item.code} - {item.description}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            <Badge variant="secondary" className="px-3 py-1">
              {item.code}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleSelect(item.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove {item.code}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AddAssemblyForm() {
  const { data: inventoryItems = [] } = useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: getAllInventoryItems,
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createAssembly,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSEMBLY_QUERY_KEY });
      toast.success('Assembly created successfully');
      router.push('/assemblies');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      mutation.mutate(values);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
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
                <Input placeholder="" type="text" {...field} />
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
              <ItemSelector
                items={inventoryItems}
                selectedIds={field.value}
                onSelect={field.onChange}
              />
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
