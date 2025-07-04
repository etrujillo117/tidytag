"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Container, Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'tidy-tag-containers';

interface ContainerContextType {
  containers: Container[];
  loading: boolean;
  getContainerById: (id: string) => Container | undefined;
  getContainerByNfcId: (nfcId: string) => Container | undefined;
  getChildContainers: (parentId: string) => Container[];
  addContainer: (name: string, allowedContentType: 'items' | 'containers', parentId?: string) => void;
  removeContainer: (id: string) => void;
  addItem: (containerId: string, itemData: { name: string; quantity: number, imageUrl?: string }) => void;
  removeItem: (containerId: string, itemId: string) => void;
  updateItem: (containerId: string, itemId: string, updates: Partial<Pick<Item, 'name' | 'quantity' | 'imageUrl'>>) => void;
  linkNfcTag: (containerId: string, nfcId: string) => void;
}

const ContainerContext = createContext<ContainerContextType | undefined>(undefined);

export const useContainer = () => {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error('useContainer must be used within a ContainerProvider');
  }
  return context;
};

export const ContainerProvider = ({ children }: { children: ReactNode }) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedContainers = localStorage.getItem(STORAGE_KEY);
      if (storedContainers) {
        setContainers(JSON.parse(storedContainers));
      }
    } catch (error) {
      console.error('Failed to load containers from local storage', error);
      toast({
        title: 'Error',
        description: 'Could not load your saved data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(containers));
      } catch (error) {
        console.error('Failed to save containers to local storage', error);
        toast({
          title: 'Error',
          description: 'Could not save your changes.',
          variant: 'destructive',
        });
      }
    }
  }, [containers, loading, toast]);

  const getContainerById = useCallback((id: string) => {
    return containers.find(c => c.id === id);
  }, [containers]);
  
  const getContainerByNfcId = useCallback((nfcId: string) => {
    return containers.find(c => c.nfcId === nfcId);
  }, [containers]);

  const getChildContainers = useCallback((parentId: string) => {
    return containers.filter(c => c.parentId === parentId);
  }, [containers]);

  const addContainer = (name: string, allowedContentType: 'items' | 'containers', parentId?: string) => {
    const newContainer: Container = {
      id: crypto.randomUUID(),
      name,
      items: [],
      allowedContentType,
      parentId,
    };
    setContainers(prev => [...prev, newContainer]);
    toast({
      title: 'Container Created',
      description: `"${name}" has been added.`,
    });
  };

  const removeContainer = (id: string) => {
    const childContainers = containers.filter(c => c.parentId === id);
    if (childContainers.length > 0) {
        toast({
            title: 'Cannot Remove Container',
            description: 'This container has other containers inside it. Please empty it first.',
            variant: 'destructive',
        });
        return;
    }
    const containerName = containers.find(c => c.id === id)?.name;
    setContainers(prev => prev.filter(c => c.id !== id));
    toast({
      title: 'Container Removed',
      description: `"${containerName}" has been removed.`,
      variant: 'destructive'
    });
  };

  const addItem = (containerId: string, itemData: { name: string; quantity: number, imageUrl?: string }) => {
    const container = getContainerById(containerId);
    if (container?.allowedContentType !== 'items') {
      toast({
        title: 'Action Not Allowed',
        description: 'Items can only be added to item containers.',
        variant: 'destructive',
      });
      return;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      ...itemData,
      addedAt: new Date().toISOString(),
    };
    setContainers(prev => prev.map(c => 
      c.id === containerId ? { ...c, items: [...c.items, newItem] } : c
    ));
    toast({
      title: 'Item Added',
      description: `${itemData.quantity} x "${itemData.name}" added.`,
    });
  };

  const removeItem = (containerId: string, itemId: string) => {
    let itemName = '';
    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        const item = c.items.find(i => i.id === itemId);
        if (item) itemName = item.name;
        return { ...c, items: c.items.filter(i => i.id !== itemId) };
      }
      return c;
    }));
    toast({
      title: 'Item Removed',
      description: `"${itemName}" has been removed.`,
      variant: 'destructive'
    });
  };

  const updateItem = (containerId: string, itemId: string, updates: Partial<Pick<Item, 'name' | 'quantity' | 'imageUrl'>>) => {
    let itemName = '';
    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        return {
          ...c,
          items: c.items.map(i => {
            if (i.id === itemId) {
              itemName = updates.name || i.name;
              return { ...i, ...updates, addedAt: new Date().toISOString() };
            }
            return i;
          })
        };
      }
      return c;
    }));
     toast({
      title: 'Item Updated',
      description: `"${itemName}" has been updated.`,
    });
  };

  const linkNfcTag = (containerId: string, nfcId: string) => {
    if (nfcId) {
      const tagExists = containers.some(c => c.nfcId === nfcId && c.id !== containerId);
      if (tagExists) {
        toast({
          title: 'NFC Tag In Use',
          description: 'This NFC tag ID is already assigned to another container.',
          variant: 'destructive',
        });
        return;
      }
    }

    let containerName = '';
    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        containerName = c.name;
        return { ...c, nfcId: nfcId || undefined };
      }
      return c;
    }));
    toast({
      title: nfcId ? 'NFC Tag Linked' : 'NFC Tag Unlinked',
      description: nfcId ? `Tag linked to "${containerName}".` : `Tag unlinked from "${containerName}".`,
    });
  };


  const value = {
    containers,
    loading,
    getContainerById,
    getContainerByNfcId,
    getChildContainers,
    addContainer,
    removeContainer,
    addItem,
    removeItem,
    updateItem,
    linkNfcTag,
  };

  return (
    <ContainerContext.Provider value={value}>
      {children}
    </ContainerContext.Provider>
  );
};
