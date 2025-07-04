"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, MoreVertical, Pencil } from 'lucide-react';
import { RemoveConfirmationDialog } from '@/components/RemoveConfirmationDialog';
import { useContainer } from '@/context/ContainerContext';
import type { Item } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Logo } from './Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { EditItemSheet } from './EditItemSheet';

interface ItemCardProps {
  item: Item;
  containerId: string;
}

export function ItemCard({ item, containerId }: ItemCardProps) {
  const { removeItem, updateItem } = useContainer();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  const handleIncrease = () => {
    updateItem(containerId, item.id, { quantity: item.quantity + 1 }, true);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateItem(containerId, item.id, { quantity: item.quantity - 1 }, false);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true });

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0 flex-grow">
          <div className="aspect-square w-full bg-secondary overflow-hidden flex items-center justify-center">
             {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint={`${item.name.split(' ').slice(0,2).join(' ')}`}
                />
              ) : (
                <Logo className="h-16 w-16 text-primary/20" />
              )}
          </div>
          <div className="p-4 pb-0">
            <CardTitle className="text-lg font-headline break-words">{item.name}</CardTitle>
            <CardDescription className="pt-1 text-xs">Updated {formattedDate}</CardDescription>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options for {item.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setEditSheetOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrease} disabled={item.quantity <= 1}>
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="font-bold text-lg w-10 text-center tabular-nums" aria-live="polite">{item.quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrease}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <EditItemSheet
        open={isEditSheetOpen}
        onOpenChange={setEditSheetOpen}
        item={item}
        containerId={containerId}
      />

      <RemoveConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => removeItem(containerId, item.id)}
        title={`Remove ${item.name}?`}
        description={`Are you sure you want to remove ${item.quantity} x "${item.name}" from this container? This will remove all quantities of this item.`}
      />
    </>
  );
}
