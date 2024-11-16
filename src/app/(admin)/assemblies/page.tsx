'use client';

import Link from 'next/link';

import { getAllAssemblyInformation } from '@/services/assembly';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon, PlusCircleIcon } from 'lucide-react';

import { ASSEMBLY_QUERY_KEY } from '@/config/query-keys';

import AssemblyTable from '@/components/assembly/table';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';

const AssembliesRootPage = () => {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ASSEMBLY_QUERY_KEY,
    queryFn: getAllAssemblyInformation,
  });

  if (isLoading && !isFetched) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <>
      <DashboardShell>
        <DashboardHeader text=" Manage your Assembles" heading="Assembles" />
        <div className="flex w-full justify-end gap-x-2">
          <Button>
            <PlusCircleIcon />
            <Link href="/assemblies/add">Add Assembly Item</Link>
          </Button>
        </div>
        <AssemblyTable data={data} />
      </DashboardShell>
    </>
  );
};

export default AssembliesRootPage;
