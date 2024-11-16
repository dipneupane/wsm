'use client';

import { useEffect, useState } from 'react';

import { getSupplierById } from '@/services/supplier';
import { Loader2 } from 'lucide-react';

import { SupplierGetByIDType } from '@/types/supplier';

import EditSupplierForm from '@/components/supplier/supplier-edit-form';
import { Card } from '@/components/ui/card';

interface InventoryEditProps {
  params: {
    slug: string;
  };
}

const InventoryEdit = ({ params: { slug } }: InventoryEditProps) => {
  const [data, setData] = useState<SupplierGetByIDType>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const result = await getSupplierById(Number(slug));
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Unknown error occurred')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-destructive">
          Error loading inventory item: {error.message}
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

  return (
    <div className="p-12">
      <EditSupplierForm data={data} />
    </div>
  );
};

export default InventoryEdit;
