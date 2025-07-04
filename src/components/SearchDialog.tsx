
"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContainer } from "@/context/ContainerContext";
import type { Item, Container } from '@/lib/types';
import Link from 'next/link';
import { Search, Package, ArrowRight } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface SearchResult {
  item: Item;
  container: {
    id: string;
    name: string;
  };
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { containers } = useContainer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const allItems = useMemo(() => {
    const items: SearchResult[] = [];
    containers.forEach(container => {
      if (container.allowedContentType === 'items') {
        container.items.forEach(item => {
          items.push({
            item,
            container: { id: container.id, name: container.name },
          });
        });
      }
    });
    return items;
  }, [containers]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filteredResults = allItems.filter(({ item }) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, allItems]);
  
  // Reset query when dialog is closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => setQuery(''), 200); // delay to allow for closing animation
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search for an Item</DialogTitle>
          <DialogDescription>
            Find items across all of your containers.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type an item name to search..."
            className="pl-10"
            autoFocus
          />
        </div>
        <ScrollArea className="h-[40vh] mt-4">
            {query.length > 1 && results.length > 0 && (
                 <div className="space-y-2 pr-4">
                    {results.map(({ item, container }) => (
                        <Link
                            href={`/container/${container.id}`}
                            key={item.id}
                            className="block p-3 rounded-md hover:bg-accent"
                            onClick={() => onOpenChange(false)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">in "{container.name}"</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-mono text-sm">{item.quantity}x</p>
                                        <p className="text-xs text-muted-foreground">quantity</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </Link>
                    ))}
                 </div>
            )}
            {query.length > 1 && results.length === 0 && (
                <div className="text-center py-10">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No results found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try searching for something else.
                    </p>
                </div>
            )}
            {query.length <= 1 && (
                 <div className="text-center py-10">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Start Searching</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter at least two characters to see results.
                    </p>
                </div>
            )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
