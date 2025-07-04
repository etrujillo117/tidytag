
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useContainer } from "@/context/ContainerContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, PackageOpen, PackagePlus, Boxes, Nfc, FileDown, MoreVertical, Pencil, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/ItemCard";
import { AddItemSheet } from "@/components/AddItemSheet";
import { AddContainerDialog } from "@/components/AddContainerDialog";
import { ContainerCard } from "@/components/ContainerCard";
import { ScanTagDialog } from "@/components/ScanTagDialog";
import type { Container } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import * as Papa from 'papaparse';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditContainerDialog } from "@/components/EditContainerDialog";
import { RemoveConfirmationDialog } from "@/components/RemoveConfirmationDialog";
import { SearchDialog } from "@/components/SearchDialog";


export default function ContainerPage() {
  const params = useParams();
  const router = useRouter();
  const { getContainerById, getChildContainers, loading, containers, removeContainer } = useContainer();
  const { toast } = useToast();
  const [isAddItemSheetOpen, setAddItemSheetOpen] = useState(false);
  const [isAddContainerDialogOpen, setAddContainerDialogOpen] = useState(false);
  const [isScanDialogOpen, setScanDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false);

  const containerId = typeof params.id === 'string' ? params.id : '';
  const container = getContainerById(containerId);
  const childContainers = container ? getChildContainers(container.id) : [];

  const handleExport = () => {
    if (!container) return;

    let dataToExport;
    const filename = `${container.name.replace(/\s/g, '_')}_export.csv`;

    if (container.allowedContentType === 'items') {
      if (container.items.length === 0) {
        toast({ title: "Nothing to Export", description: "This container is empty." });
        return;
      }
      dataToExport = container.items.map(item => ({
        "Name": item.name,
        "Quantity": item.quantity,
        "Date Added": new Date(item.createdAt).toLocaleDateString(),
      }));
    } else {
      if (childContainers.length === 0) {
        toast({ title: "Nothing to Export", description: "This container has no sub-containers." });
        return;
      }
      dataToExport = childContainers.map(child => ({
        "Container Name": child.name,
        "Contents Count": child.allowedContentType === 'items' 
          ? child.items.length 
          : getChildContainers(child.id).length,
        "Date Added": new Date(child.createdAt).toLocaleDateString(),
      }));
    }

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Successful", description: "Your CSV file has been downloaded." });
  };


  if (loading) {
    return <ContainerSkeleton />;
  }

  if (!container) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <PackageOpen className="h-16 w-16 text-destructive" />
        <h2 className="mt-6 text-2xl font-bold text-primary">Container Not Found</h2>
        <p className="mt-2 text-muted-foreground">The container you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Containers
          </Link>
        </Button>
      </div>
    );
  }
  
  const handleRemoveContainer = () => {
    if (!container) return;
    removeContainer(container.id);
    router.push('/');
  }

  const parentContainer = container.parentId ? getContainerById(container.parentId) : null;
  const breadcrumbs = parentContainer ? (
    <Button variant="link" asChild className="text-muted-foreground p-0 h-auto">
      <Link href={parentContainer ? `/container/${parentContainer.id}` : '/'}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to "{parentContainer.name}"
      </Link>
    </Button>
  ) : (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/">
        <ArrowLeft />
        <span className="sr-only">Back</span>
      </Link>
    </Button>
  );

  return (
    <>
      <div className="min-h-screen pb-32">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 min-w-0">
                {breadcrumbs}
                <h1 className="text-xl font-bold font-headline text-primary break-words">
                  {container.name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchDialogOpen(true)}>
                    <Search />
                    <span className="sr-only">Search Items</span>
                 </Button>
                 <Button variant="outline" size="icon" className="h-9 w-auto px-3 hidden sm:inline-flex" onClick={handleExport}>
                  <FileDown />
                  <span className="ml-2">Export CSV</span>
                </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical />
                            <span className="sr-only">More options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit Container</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExport} className="flex sm:hidden">
                          <FileDown className="mr-2 h-4 w-4" />
                          <span>Export CSV</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Container</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {container.allowedContentType === 'items' && (
            container.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {container.items.map(item => (
                  <ItemCard key={item.id} item={item} containerId={container.id} />
                ))}
              </div>
            ) : (
               <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
                <PackagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-primary">This container is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add your first item to get started.</p>
                <div className="mt-6">
                  <Button onClick={() => setAddItemSheetOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            )
          )}
           {container.allowedContentType === 'containers' && (
            childContainers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {childContainers.map(child => (
                  <ContainerCard key={child.id} container={child} />
                ))}
              </div>
            ) : (
               <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
                <Boxes className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-primary">This container is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add your first sub-container to get started.</p>
                <div className="mt-6">
                  <Button onClick={() => setAddContainerDialogOpen(true)}>
                    <Boxes className="mr-2 h-4 w-4" />
                    Add Sub-Container
                  </Button>
                </div>
              </div>
            )
          )}
        </main>
      </div>

      <div className="fixed bottom-6 right-6 z-20 flex flex-col items-center gap-4">
        <Button 
            variant="secondary"
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setScanDialogOpen(true)}
            aria-label="Scan Tag"
        >
            <Nfc className="h-6 w-6" />
        </Button>
        <Button 
            size="icon"
            className="rounded-full h-16 w-16 shadow-lg"
            onClick={() => {
                if (container.allowedContentType === 'items') {
                    setAddItemSheetOpen(true);
                } else {
                    setAddContainerDialogOpen(true);
                }
            }}
            aria-label={container.allowedContentType === 'items' ? "Add New Item" : "Add New Sub-Container"}
        >
            <Plus className="h-8 w-8" />
        </Button>
      </div>

      <AddItemSheet
        open={isAddItemSheetOpen}
        onOpenChange={setAddItemSheetOpen}
        container={container}
      />
      <AddContainerDialog 
        open={isAddContainerDialogOpen}
        onOpenChange={setAddContainerDialogOpen}
        parentId={container.id}
      />
      <ScanTagDialog 
        open={isScanDialogOpen}
        onOpenChange={setScanDialogOpen}
      />
      <EditContainerDialog
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        container={container}
      />
      <RemoveConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleRemoveContainer}
        title={`Delete "${container.name}"?`}
        description="This will permanently delete the container and all its contents. This action cannot be undone."
      />
      <SearchDialog open={isSearchDialogOpen} onOpenChange={setSearchDialogOpen} />
    </>
  );
}

function ContainerSkeleton() {
  return (
    <div>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-6 w-48 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
