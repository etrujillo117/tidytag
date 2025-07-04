"use client";

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
    onOpenChange(false);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <div className="space-y-4">
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
