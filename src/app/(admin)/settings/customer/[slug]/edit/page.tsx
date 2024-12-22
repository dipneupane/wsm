'use client';

import { useEffect, useState } from 'react';

import { getCustomerById } from '@/services/customer';
import { Loader2 } from 'lucide-react';

import { CustomerGetByIDType } from '@/types/customer';

import EditCustomerForm from '@/components/customer/customer-edit-form';
import { Card } from '@/components/ui/card';

interface CustomerEditProps {
  params: {
    slug: string;
  };
}

const CustomerEditPage = ({ params: { slug } }: CustomerEditProps) => {
  const [data, setData] = useState<CustomerGetByIDType>();
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
        const result = await getCustomerById(Number(slug));
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
          Error loading item: {error.message}
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">No item found</div>
      </Card>
    );
  }

  return (
    <div className="p-12">
      <EditCustomerForm data={data} />
    </div>
  );
};

export default CustomerEditPage;
