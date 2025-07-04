"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useContainer } from "@/context/ContainerContext";
import { suggestItems } from "@/ai/flows/suggest-items";
import { WandSparkles, Loader2 } from "lucide-react";
import type { Container } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, "Item name is required").max(50, "Name must be 50 characters or less"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

interface AddItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

export function AddItemSheet({ open, onOpenChange, container }: AddItemSheetProps) {
  const { addItem } = useContainer();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addItem(container.id, { name: values.name, quantity: values.quantity });
    form.reset();
    setSuggestions([]);
    onOpenChange(false);
  }
  
  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const existingItems = container.items.map(item => item.name);
      const result = await suggestItems({ containerName: container.name, existingItems });
      setSuggestions(result.suggestedItems);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('name', suggestion);
    setSuggestions([]);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Item to "{container.name}"</SheetTitle>
          <SheetDescription>
            Enter the details of the item you want to add.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Woolen Scarf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <Button type="button" variant="outline" size="sm" onClick={handleGetSuggestions} disabled={loadingSuggestions}>
                {loadingSuggestions ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <WandSparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Items
              </Button>

              {loadingSuggestions && <p className="text-sm text-muted-foreground mt-2">Getting suggestions...</p>}

              {suggestions.length > 0 && (
                 <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                    {suggestions.map(suggestion => (
                        <Button key={suggestion} type="button" variant="secondary" size="sm" onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                        </Button>
                    ))}
                    </div>
                 </div>
              )}
            </div>

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </SheetClose>
              <Button type="submit">Add Item</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
