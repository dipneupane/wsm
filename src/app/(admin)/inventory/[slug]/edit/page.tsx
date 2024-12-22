'use client';

import { getInventoryItemById } from '@/services/inventory-item';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';

import { INVENTORY_QUERY_KEY } from '@/config/query-keys';

import EditInventoryItemForm from '@/components/inventory/edit-inventory-form';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InventoryEditProps {
  params: {
    slug: string;
  };
}

const InventoryEdit = ({ params: { slug } }: InventoryEditProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY[0], slug],
    queryFn: () => getInventoryItemById(Number(slug)),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <div className="text-destructive">
          Error loading inventory item:{' '}
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">No inventory item found</div>
      </Card>
    );
  }

  return <EditInventoryItemForm data={data} />;
};

export default InventoryEdit;
