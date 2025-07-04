"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  nfcId: z.string().max(50, "ID must be 50 characters or less").optional(),
});

interface LinkNfcDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

export function LinkNfcDialog({ open, onOpenChange, container }: LinkNfcDialogProps) {
  const { linkNfcTag } = useContainer();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nfcId: container.nfcId || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    linkNfcTag(container.id, values.nfcId || "");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if(!isOpen) form.reset({ nfcId: container.nfcId || ""});
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Nfc /> Link NFC Tag</DialogTitle>
          <DialogDescription>
            Enter a unique ID to link to "{container.name}". Leave it blank to unlink. This simulates scanning a physical tag.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nfcId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFC Tag ID</FormLabel>
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
              <Button type="submit">{container.nfcId ? 'Update' : 'Link'} Tag</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
