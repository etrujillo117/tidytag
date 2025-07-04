"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContainer } from "@/context/ContainerContext";
import { Nfc } from "lucide-react";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nfcId: z.string().min(1, "NFC Tag ID is required"),
});

interface ScanTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScanTagDialog({ open, onOpenChange }: ScanTagDialogProps) {
  const { getContainerByNfcId } = useContainer();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nfcId: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const container = getContainerByNfcId(values.nfcId);
    if (container) {
      onOpenChange(false);
      router.push(`/container/${container.id}`);
    } else {
      toast({
        title: "Tag Not Found",
        description: "No container is linked to this NFC Tag ID.",
        variant: "destructive",
      });
    }
    form.reset();
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Nfc />
            Scan NFC Tag (Simulated)
          </DialogTitle>
          <DialogDescription>
            Enter the ID of the NFC tag to find a container.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="nfcId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFC Tag ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., tag-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Nfc className="mr-2 h-4 w-4" />
              Find Container
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
