
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useContainer } from "@/context/ContainerContext";
import type { Container } from "@/lib/types";
import { Nfc } from "lucide-react";

const formSchema = z.object({
  name: z.string()
    .min(1, "Container name is required")
    .max(18, "Name must be 18 characters or less")
    .regex(/^[a-zA-Z0-9\s.,_&()#@!'-]+$/, {
      message: "Name can only contain letters, numbers, spaces, and simple symbols.",
    }),
  nfcId: z.string().max(50, "ID must be 50 characters or less").optional(),
});

interface EditContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

export function EditContainerDialog({ open, onOpenChange, container }: EditContainerDialogProps) {
  const { updateContainer } = useContainer();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nfcId: "",
    },
  });

  useEffect(() => {
    if (open && container) {
      form.reset({
        name: container.name,
        nfcId: container.nfcId || "",
      });
    }
  }, [open, container, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!container) return;
    updateContainer(container.id, {
      name: values.name,
      nfcId: values.nfcId || undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Container</DialogTitle>
          <DialogDescription>
            Update the details for "{container?.name}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nfcId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Nfc className="h-4 w-4" /> NFC Tag ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., tag-001 (or leave blank)" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    