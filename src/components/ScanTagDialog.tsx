"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  
  const [nfcSupport, setNfcSupport] = useState<'checking' | 'supported' | 'unsupported'>('checking');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nfcId: "" },
  });

  // Check for NFC support on component mount
  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupport('supported');
    } else {
      setNfcSupport('unsupported');
    }
  }, []);

  // Handle the actual scanning process
  useEffect(() => {
    if (open && nfcSupport === 'supported') {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setScanStatus('scanning');
      setErrorMessage('');

      const startScan = async () => {
        try {
          const reader = new NDEFReader();
          await reader.scan({ signal: controller.signal });

          reader.onreading = (event) => {
            const serialNumber = event.serialNumber;
            if (serialNumber) {
              const container = getContainerByNfcId(serialNumber);
              if (container) {
                onOpenChange(false);
                router.push(`/container/${container.id}`);
              } else {
                setScanStatus('error');
                const errorMsg = `Tag with ID "${serialNumber}" is not linked to any container.`;
                setErrorMessage(errorMsg);
                toast({
                  title: "Tag Not Found",
                  description: "This NFC tag is not linked to a container.",
                  variant: "destructive",
                });
              }
            }
          };

          reader.onreadingerror = (event) => {
            console.error("NFC reading error:", event);
            setScanStatus('error');
            setErrorMessage("Couldn't read the NFC tag. Please try again.");
          };

        } catch (error: any) {
          console.error("NFC scan error:", error);
          let msg = "An error occurred while scanning.";
          if (error.name === 'NotAllowedError') {
            msg = "NFC permission was denied. Please enable it in your browser settings.";
          } else if (error.name === 'NotFoundError' || error.name === 'AbortError') {
             msg = "Scan cancelled or no tag was found.";
          }
          setScanStatus('error');
          setErrorMessage(msg);
        }
      };

      startScan();

      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setScanStatus('idle');
      };
    }
  }, [open, nfcSupport, getContainerByNfcId, onOpenChange, router, toast]);

  function onManualSubmit(values: z.infer<typeof formSchema>) {
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
  
  const handleDialogChange = (isOpen: boolean) => {
      if (!isOpen) {
          // Abort scan if active
          if (abortControllerRef.current) {
              abortControllerRef.current.abort();
              abortControllerRef.current = null;
          }
          // Reset state
          setScanStatus('idle');
          setErrorMessage('');
          form.reset();
      }
      onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Nfc />
            {nfcSupport === 'supported' ? 'Scan NFC Tag' : 'Find by NFC Tag ID'}
          </DialogTitle>
          <DialogDescription>
            {nfcSupport === 'supported' ? 'Hold an NFC tag near your device to find its container.' : 'Enter the ID of the NFC tag since your browser does not support Web NFC.'}
          </DialogDescription>
        </DialogHeader>
        
        {nfcSupport === 'checking' && (
          <div className="py-8 flex justify-center items-center">
             <p>Checking for NFC support...</p>
          </div>
        )}
        
        {nfcSupport === 'supported' && (
          <div className="py-8 text-center">
            <Nfc className={`mx-auto h-20 w-20 mb-4 ${scanStatus === 'scanning' ? 'animate-pulse text-accent-foreground' : 'text-primary'}`} />
            <p className="font-semibold text-lg">
                {scanStatus === 'scanning' && 'Ready to Scan...'}
                {scanStatus === 'error' && 'Scan Failed'}
            </p>
            {errorMessage && <p className="text-destructive mt-2 text-sm">{errorMessage}</p>}
          </div>
        )}

        {nfcSupport === 'unsupported' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4 pt-4">
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
        )}
      </DialogContent>
    </Dialog>
  );
}
