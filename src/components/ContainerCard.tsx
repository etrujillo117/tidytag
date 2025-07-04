
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Box, Package, Boxes, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RemoveConfirmationDialog } from '@/components/RemoveConfirmationDialog';
import { useContainer } from '@/context/ContainerContext';
import type { Container } from '@/lib/types';
import { EditContainerDialog } from './EditContainerDialog';

interface ContainerCardProps {
  container: Container;
}

export function ContainerCard({ container }: ContainerCardProps) {
  const { removeContainer, containers } = useContainer();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const childContainers = containers.filter(c => c.parentId === container.id);

  return (
    <>
      <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
        <Link href={`/container/${container.id}`} className="flex-grow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
            <div className="flex-shrink-0">
              <div className="bg-secondary p-3 rounded-full">
                 {container.allowedContentType === 'items' ? (
                  <Box className="h-6 w-6 text-primary" />
                ) : (
                  <Boxes className="h-6 w-6 text-primary" />
                )}
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <CardTitle className="font-headline break-words">{container.name}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 pt-1">
                 {container.allowedContentType === 'items' ? (
                  <>
                    <Package className="w-4 h-4" />
                    {container.items.length} item{container.items.length !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <Boxes className="w-4 h-4" />
                    {childContainers.length} container{childContainers.length !== 1 ? 's' : ''}
                  </>
                )}
              </CardDescription>
            </div>
          </CardHeader>
        </Link>
        <CardContent className="pt-2 flex justify-end">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                 <span className="sr-only">More options for {container.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
      <RemoveConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => removeContainer(container.id)}
        title={`Delete "${container.name}"?`}
        description="This will permanently delete the container and all its contents. This action cannot be undone."
      />
      <EditContainerDialog
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        container={container}
      />
    </>
  );
}

    