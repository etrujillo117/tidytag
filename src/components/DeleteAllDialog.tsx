"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { useContainer } from "@/context/ContainerContext";
import { AlertTriangle } from "lucide-react";

interface DeleteAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONFIRMATION_TEXT = "DELETE ALL";

export function DeleteAllDialog({ open, onOpenChange }: DeleteAllDialogProps) {
  const { deleteAllData } = useContainer();
  const [confirmationInput, setConfirmationInput] = useState("");

  const isConfirmed = confirmationInput === CONFIRMATION_TEXT;

  const handleConfirm = () => {
    if (isConfirmed) {
      deleteAllData();
      onOpenChange(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
      setConfirmationInput("");
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Delete All Data?
          </DialogTitle>
          <DialogDescription>
            This action is irreversible and will permanently delete all your containers and items.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
            <Label htmlFor="confirmation">To confirm, please type "<span className="font-bold text-destructive">{CONFIRMATION_TEXT}</span>" in the box below.</Label>
            <Input 
                id="confirmation"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                autoComplete="off"
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed}
          >
            Delete All Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
