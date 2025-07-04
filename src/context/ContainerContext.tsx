"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Container, Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'tidy-tag-containers';

interface ContainerContextType {
  containers: Container[];
  loading: boolean;
  getContainerById: (id: string) => Container | undefined;
  addContainer: (name: string) => void;
  removeContainer: (id: string) => void;
  addItem: (containerId: string, itemData: { name: string; quantity: number, imageUrl?: string }) => void;
  removeItem: (containerId: string, itemId: string) => void;
  updateItem: (containerId: string, itemId: string, updates: Partial<Pick<Item, 'name' | 'quantity' | 'imageUrl'>>) => void;
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

  const addContainer = (name: string) => {
    const newContainer: Container = {
      id: crypto.randomUUID(),
      name,
      items: [],
    };
    setContainers(prev => [...prev, newContainer]);
    toast({
      title: 'Container Created',
      description: `"${name}" has been added.`,
    });
  };

  const removeContainer = (id: string) => {
    const containerName = containers.find(c => c.id === id)?.name;
    setContainers(prev => prev.filter(c => c.id !== id));
    toast({
      title: 'Container Removed',
      description: `"${containerName}" has been removed.`,
      variant: 'destructive'
    });
  };

  const addItem = (containerId: string, itemData: { name: string; quantity: number, imageUrl?: string }) => {
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


  const value = {
    containers,
    loading,
    getContainerById,
    addContainer,
    removeContainer,
    addItem,
    removeItem,
    updateItem,
  };

  return (
    <ContainerContext.Provider value={value}>
      {children}
    </ContainerContext.Provider>
  );
};
