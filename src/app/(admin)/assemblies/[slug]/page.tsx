'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { deleteAssembly, getAssemblyById } from '@/services/assembly';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  DollarSignIcon,
  FileTextIcon,
  Layers2Icon,
  Loader2,
  Loader2Icon,
  Package2Icon,
  TagsIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { ASSEMBLY_QUERY_KEY } from '@/config/query-keys';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AssemblyEditProps {
  params: {
    slug: string;
  };
}

export default function AssemblyItemDetailPage({
  params: { slug },
}: AssemblyEditProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [ASSEMBLY_QUERY_KEY[0], slug],
    queryFn: () => getAssemblyById(Number(slug)),
    enabled: Boolean(slug),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: deleteAssembly,
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ASSEMBLY_QUERY_KEY });
      router.push('/assemblies');
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const handleItemDelete = () => {
    mutation.mutate(Number(slug));
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error).message ||
            'An error occurred while fetching the assembly data.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          The requested assembly could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid border-none bg-inherit">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">
            Assembly Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="flex items-start space-x-3 rounded-lg p-3 transition-colors">
              <div className="mt-1 flex-shrink-0">
                <TagsIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <dt className="text-sm font-medium">Code</dt>
                <dd className="mt-1 text-sm font-medium">{data.code}</dd>
              </div>
            </Card>
            <Card className="flex items-start space-x-3 rounded-lg p-3 transition-colors">
              <div className="mt-1 flex-shrink-0">
                <DollarSignIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <dt className="text-sm font-medium">Total Cost</dt>
                <dd className="mt-1 text-sm font-medium">
                  ${data.totalCost.toFixed(2)}
                </dd>
              </div>
            </Card>

            <Card className="flex items-start space-x-3 rounded-lg p-3 transition-colors">
              <div className="mt-1 flex-shrink-0">
                <Layers2Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <dt className="text-sm font-medium">Total Items</dt>
                <dd className="mt-1 text-sm font-medium">{data.totalItems}</dd>
              </div>
            </Card>
            <Card className="col-span-4 flex items-start space-x-3 rounded-lg p-3 transition-colors">
              <div className="mt-1 flex-shrink-0">
                <FileTextIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <dt className="text-sm font-medium">Description</dt>
                <dd className="mt-1 text-sm font-medium">{data.description}</dd>
              </div>
            </Card>
          </div>
        </CardContent>
      </div>
      <div className="flex w-full justify-end gap-x-4 px-6">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this assembly?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                assembly and all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleItemDelete}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button>
          <Link href={`/assemblies/${slug}/edit`}>Edit</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>{item.supplierName}</TableCell>
                    <TableCell>${item.cost.toFixed(2)}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
