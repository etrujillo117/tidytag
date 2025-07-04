"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RemoveConfirmationDialog } from '@/components/RemoveConfirmationDialog';
import { useContainer } from '@/context/ContainerContext';
import type { Item } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Logo } from './Logo';

interface ItemCardProps {
  item: Item;
  containerId: string;
}

export function ItemCard({ item, containerId }: ItemCardProps) {
  const { removeItem } = useContainer();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

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
          <div className="p-4">
            <CardTitle className="text-lg font-headline break-words">{item.name}</CardTitle>
            <CardDescription className="pt-1">Quantity: {item.quantity}</CardDescription>
             <CardDescription className="pt-1 text-xs">Added {formattedDate}</CardDescription>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </CardFooter>
      </Card>
      <RemoveConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => removeItem(containerId, item.id)}
        title={`Remove ${item.name}?`}
        description={`Are you sure you want to remove ${item.quantity} x "${item.name}" from this container?`}
      />
    </>
  );
}
