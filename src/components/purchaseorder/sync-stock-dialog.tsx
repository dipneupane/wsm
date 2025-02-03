// sync dialog box

import { useState } from 'react';

import { bulkUpdateStock } from '@/services/inventory-item';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { RefreshCcwIcon } from 'lucide-react';
import { toast } from 'sonner';

import { INVENTORY_QUERY_KEY } from '@/config/query-keys';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function SyncWithStockDialog({
  itemId,
  unitPrice,
}: {
  itemId: number;
  unitPrice: number;
}) {
  const queryClient = new QueryClient();

  const mutation = useMutation({
    mutationFn: () => bulkUpdateStock([{ id: itemId, cost: unitPrice }]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success('Synced with Stock');
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Error');
    },
  });
  const handleStockUpdate = async () => {
    mutation.mutate();
  };

  const [isOpen, setIsOpen] = useState<any>();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="translate-y-3" variant="outline">
          <RefreshCcwIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Stock Price set to {unitPrice} </DialogTitle>
          <DialogDescription>
            Are you sure that you want to update the Price of the Stock ? These
            changes will be direclty reflected on exising Stock
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleStockUpdate}
            disabled={mutation.isPending}
            type="submit"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
