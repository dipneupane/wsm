import React, { useState } from 'react';

import { Settings } from 'lucide-react';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

type BulkEditModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  selectedRows: InventoryItemsGetAllType[];
  handleCostChange: (id: number, cost: number) => void;
  handleStockChange: (id: number, stock: number) => void;
  handleBulkUpdate: () => void;
};
export default function BulkEditModal({
  isModalOpen,
  setIsModalOpen,
  selectedRows,
  handleCostChange,
  handleBulkUpdate,
  handleStockChange,
}: BulkEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    try {
      await handleBulkUpdate();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating items:', error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild disabled={selectedRows.length === 0}>
        <Button variant="outline">
          <Settings />
          <span>Bulk Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Stock Detail</DialogTitle>
        </DialogHeader>

        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-w-[600px]">
              {selectedRows.map((item: InventoryItemsGetAllType) => (
                <TableRow key={item.id} className="">
                  <TableCell>
                    <Label htmlFor={`cost-${item.id}`} className="text-right">
                      {item.code}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Input
                      id={`cost-${item.id}`}
                      type="number"
                      className="w-28"
                      value={item.cost}
                      onChange={(e) =>
                        handleCostChange(item.id, Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      id={`stock-${item.id}`}
                      type="number"
                      className="w-28"
                      value={item.stock}
                      onChange={(e) =>
                        handleStockChange(item.id, Number(e.target.value))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {/* <table>
          <tr>
            <th>Item Code</th>
            <th>Cost</th>
            <th>Stock</th>
          </tr>
          <tbody>
            <ScrollArea className="h-72">
              {selectedRows.map((item: InventoryItemsGetAllType) => (
                <tr key={item.id} className="">
                  <td>
                    <Label htmlFor={`cost-${item.id}`} className="text-right">
                      {item.code}
                    </Label>
                  </td>
                  <td>
                    <Input
                      id={`cost-${item.id}`}
                      type="number"
                      className="w-28"
                      value={item.cost}
                      onChange={(e) =>
                        handleCostChange(item.id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <Input
                      id={`stock-${item.id}`}
                      type="number"
                      className="w-28"
                      value={item.stock}
                      onChange={(e) =>
                        handleStockChange(item.id, Number(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))}
            </ScrollArea>
          </tbody>
        </table> */}

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
