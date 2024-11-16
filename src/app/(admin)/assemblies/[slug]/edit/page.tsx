'use client';

import { useEffect, useState } from 'react';

import { getAssemblyById } from '@/services/assembly';

import { AssemblyGetByIDType } from '@/types/assembly';

import EditAssemblyForm from '@/components/assembly/edit-assembly-form';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InventoryEditProps {
  params: {
    slug: string;
  };
}

const InventoryEdit = ({ params: { slug } }: InventoryEditProps) => {
  const [data, setData] = useState<AssemblyGetByIDType>();
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
        const result = await getAssemblyById(Number(slug));
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
    return <Card className="p-6"></Card>;
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

  return <EditAssemblyForm data={data} />;
};

export default InventoryEdit;
