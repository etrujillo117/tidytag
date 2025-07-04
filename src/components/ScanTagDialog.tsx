"use client";

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
import { Box, Nfc } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface ScanTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScanTagDialog({ open, onOpenChange }: ScanTagDialogProps) {
  const { containers } = useContainer();
  const router = useRouter();

  const handleSelectContainer = (id: string) => {
    onOpenChange(false);
    router.push(`/container/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Nfc />
            Scan NFC Tag (Simulated)
          </DialogTitle>
          <DialogDescription>
            Select a container to view its contents. In a real app, you would scan a physical NFC tag.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-72">
          <div className="space-y-2 py-4">
            {containers.length > 0 ? (
              containers.map((container) => (
                <Button
                  key={container.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSelectContainer(container.id)}
                >
                  <Box className="mr-2 h-4 w-4" />
                  {container.name}
                </Button>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                <p>No containers found.</p>
                <p>Create one to get started.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
