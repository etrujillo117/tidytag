"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContainer } from "@/context/ContainerContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, PackageOpen, PackagePlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { AddItemSheet } from "@/components/AddItemSheet";
import type { Container } from "@/lib/types";

export default function ContainerPage() {
  const params = useParams();
  const router = useRouter();
  const { getContainerById, loading } = useContainer();
  const [isAddItemSheetOpen, setAddItemSheetOpen] = useState(false);

  const containerId = typeof params.id === 'string' ? params.id : '';
  const container = getContainerById(containerId);

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

  return (
    <>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="text-xl font-bold font-headline text-primary truncate">
                {container.name}
              </h1>
              <Button size="sm" onClick={() => setAddItemSheetOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {container.items.length > 0 ? (
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
          )}
        </main>
      </div>
      <AddItemSheet
        open={isAddItemSheetOpen}
        onOpenChange={setAddItemSheetOpen}
        container={container}
      />
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
            <Skeleton className="h-9 w-28 rounded-md" />
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
