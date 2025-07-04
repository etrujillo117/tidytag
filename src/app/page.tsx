"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Nfc, Plus, Boxes, MoreVertical, Trash2 } from "lucide-react";
import { useContainer } from "@/context/ContainerContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ContainerCard } from "@/components/ContainerCard";
import { AddContainerDialog } from "@/components/AddContainerDialog";
import { ScanTagDialog } from "@/components/ScanTagDialog";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteAllDialog } from "@/components/DeleteAllDialog";

export default function Home() {
  const { containers, loading } = useContainer();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isScanDialogOpen, setScanDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  const rootContainers = containers.filter(c => !c.parentId);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold font-headline text-primary">
                  TidyTag
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button size="sm" onClick={() => setScanDialogOpen(true)}>
                  <Nfc />
                  <span className="hidden sm:inline">Scan Tag</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAddDialogOpen(true)}>
                  <Plus />
                  <span className="hidden sm:inline">New Container</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical />
                            <span className="sr-only">More options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDeleteAllDialogOpen(true)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete All Data</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-primary">
              Your Home, Organized
            </h2>
            <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
              Effortlessly manage your storage with NFC tags. Create containers, add items, and find what you need in seconds.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : rootContainers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rootContainers.map((container) => (
                <ContainerCard key={container.id} container={container} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Boxes className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-primary">No containers yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new container.</p>
              <div className="mt-6">
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Container
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      <AddContainerDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
      <ScanTagDialog open={isScanDialogOpen} onOpenChange={setScanDialogOpen} />
      <DeleteAllDialog open={isDeleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen} />
    </>
  );
}
