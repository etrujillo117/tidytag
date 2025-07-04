
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string()
    .min(1, "Item name is required")
    .max(18, "Name must be 18 characters or less")
    .regex(/^[a-zA-Z0-9\s.,_&()#@!'-]+$/, {
      message: "Name can only contain letters, numbers, spaces, and simple symbols.",
    }),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

interface AddItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

export function AddItemSheet({ open, onOpenChange, container }: AddItemSheetProps) {
  const { addItem } = useContainer();
  const { toast } = useToast();

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
    },
  });
  
  // Reset state when sheet is closed
  useEffect(() => {
    if (!open) {
      setImageDataUrl(null);
      setActiveTab('upload');
      form.reset();
    }
  }, [open, form]);

  // Camera management
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    const stopCameraStream = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setHasCameraPermission(false);
      }
    };

    if (activeTab === 'camera' && open) {
      getCameraStream();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [activeTab, open, toast]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    addItem(container.id, {
      name: values.name,
      quantity: values.quantity,
      imageUrl: imageDataUrl || undefined,
    });
    onOpenChange(false);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageDataUrl(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImageDataUrl(dataUrl);
        setActiveTab('upload'); // Switch tab to show preview
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Add Item to "{container.name}"</SheetTitle>
          <SheetDescription>
            Enter the details of the item you want to add.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-y-auto pr-6 space-y-4">
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
              <div className="space-y-2">
                <FormLabel>Item Image (Optional)</FormLabel>
                {imageDataUrl ? (
                  <div className="relative">
                    <Image
                      src={imageDataUrl}
                      alt="Item preview"
                      width={200}
                      height={200}
                      className="w-full h-auto object-contain rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => setImageDataUrl(null)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" />Upload</TabsTrigger>
                      <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4" />Camera</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-2">
                       <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                         Choose a file...
                       </Button>
                       <input
                         type="file"
                         ref={fileInputRef}
                         onChange={handleFileChange}
                         className="hidden"
                         accept="image/*"
                       />
                    </TabsContent>
                    <TabsContent value="camera" className="pt-2">
                      <div className="space-y-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted border">
                           <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                           {!hasCameraPermission && open && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                               <p className="text-white text-sm">Waiting for camera...</p>
                            </div>
                           )}
                        </div>
                        { !hasCameraPermission && open && (
                           <Alert variant="destructive">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                  Please allow camera access to use this feature.
                                </AlertDescription>
                           </Alert>
                        )}
                        <Button type="button" className="w-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                          Take Picture
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
            
            <SheetFooter className="mt-auto pt-4">
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
