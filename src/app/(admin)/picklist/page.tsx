'use client';

import Link from 'next/link';

import { getAllPickListInformation } from '@/services/pick-list';
import { useQuery } from '@tanstack/react-query';
import { PlusCircleIcon } from 'lucide-react';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import PickListItemsTable from '@/components/picklist/table';
import { Button } from '@/components/ui/button';

export default function PickListRootPage() {
  const { data } = useQuery({
    queryKey: ['PickList'],
    queryFn: getAllPickListInformation,
  });

  return (
    <>
      <DashboardShell>
        <DashboardHeader text=" Manage your PickList" heading="PickList" />
        <div className="flex w-full justify-end gap-x-2">
          <Link href="/picklist/add">
            <Button>
              <PlusCircleIcon />
              Add Item
            </Button>
          </Link>
        </div>
        <PickListItemsTable data={data} />
      </DashboardShell>
    </>
  );
}
