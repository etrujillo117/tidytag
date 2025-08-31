
"use client";

import { QRCodeCanvas } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Container } from "@/lib/types";
import { QrCode, Printer } from "lucide-react";
import { useEffect, useState } from "react";

interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

export function QrCodeDialog({ open, onOpenChange, container }: QrCodeDialogProps) {
    const [containerUrl, setContainerUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setContainerUrl(`${window.location.origin}/container/${container.id}`);
        }
    }, [container.id]);

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print QR Code</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; text-align: center; margin-top: 50px; } canvas { width: 300px !important; height: 300px !important; } h1 { font-size: 24px; }</style>');
            printWindow.document.write('</head><body>');
            const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
            if (canvas) {
                const dataUrl = canvas.toDataURL();
                printWindow.document.write(`<h1>${container.name}</h1>`);
                printWindow.document.write(`<img src="${dataUrl}" style="width:300px; height:300px;" />`);
            }
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };


  if (!container) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><QrCode />QR Code for "{container.name}"</DialogTitle>
          <DialogDescription>
            Scan this code with your phone's camera to quickly open this container.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center justify-center gap-4">
           {containerUrl && (
             <QRCodeCanvas 
                id="qr-code-canvas"
                value={containerUrl} 
                size={256}
                level="H" 
                className="rounded-lg"
              />
           )}
           <p className="text-sm text-muted-foreground text-center">
            You can print this code and stick it on your physical container.
           </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
