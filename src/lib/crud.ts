'use client';

import demoData from '@/data/prosuite-data.json';

// Type for the data store
type DataStore = typeof demoData;

// Initialize data store from JSON (with localStorage persistence in browser)
function getDataStore(): DataStore {
  if (typeof window === 'undefined') {
    return demoData as DataStore;
  }
  
  const stored = localStorage.getItem('prosuite-data');
  if (stored) {
    try {
      return JSON.parse(stored) as DataStore;
    } catch {
      return demoData as DataStore;
    }
  }
  return demoData as DataStore;
}

function saveDataStore(data: DataStore): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('prosuite-data', JSON.stringify(data));
  }
}

// Generic CRUD operations
export function getCollection<T>(path: string): T[] {
  const data = getDataStore();
  const parts = path.split('.');
  let result: unknown = data;
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = (result as Record<string, unknown>)[part];
    } else {
      return [];
    }
  }
  
  return Array.isArray(result) ? result as T[] : [];
}

export function getItemById<T extends { id: number }>(path: string, id: number): T | null {
  const collection = getCollection<T>(path);
  return collection.find(item => item.id === id) || null;
}

export function createItem<T extends { id?: number }>(path: string, item: Omit<T, 'id'>): T {
  const data = getDataStore();
  const parts = path.split('.');
  let target: unknown = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (target && typeof target === 'object' && parts[i] in target) {
      target = (target as Record<string, unknown>)[parts[i]];
    }
  }
  
  const collectionKey = parts[parts.length - 1];
  const collection = (target as Record<string, unknown[]>)[collectionKey] as Array<T & { id: number }>;
  
  // Generate new ID
  const maxId = collection.reduce((max, item) => Math.max(max, item.id || 0), 0);
  const newItem = { ...item, id: maxId + 1 } as T;
  
  collection.push(newItem as T & { id: number });
  saveDataStore(data);
  
  return newItem;
}

export function updateItem<T extends { id: number }>(path: string, id: number, updates: Partial<T>): T | null {
  const data = getDataStore();
  const parts = path.split('.');
  let target: unknown = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (target && typeof target === 'object' && parts[i] in target) {
      target = (target as Record<string, unknown>)[parts[i]];
    }
  }
  
  const collectionKey = parts[parts.length - 1];
  const collection = (target as Record<string, unknown[]>)[collectionKey] as Array<T>;
  
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const updatedItem = { ...collection[index], ...updates, id } as T;
  collection[index] = updatedItem;
  saveDataStore(data);
  
  return updatedItem;
}

export function deleteItem<T extends { id: number }>(path: string, id: number): boolean {
  const data = getDataStore();
  const parts = path.split('.');
  let target: unknown = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (target && typeof target === 'object' && parts[i] in target) {
      target = (target as Record<string, unknown>)[parts[i]];
    }
  }
  
  const collectionKey = parts[parts.length - 1];
  const collection = (target as Record<string, unknown[]>)[collectionKey] as Array<T>;
  
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  collection.splice(index, 1);
  saveDataStore(data);
  
  return true;
}

// Reset data to original state
export function resetDataStore(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('prosuite-data');
  }
}

// Lookup helpers
export function getLookupValue<T extends { id: number; name?: string; title?: string }>(
  path: string, 
  id: number | null | undefined
): string {
  if (!id) return 'N/A';
  const item = getItemById<T>(path, id);
  return item?.name || item?.title || 'Unknown';
}

export function getUserName(userId: number | null | undefined): string {
  return getLookupValue<{ id: number; name: string }>('core.users', userId);
}

export function getDepartmentName(deptId: number | null | undefined): string {
  return getLookupValue<{ id: number; name: string }>('core.departments', deptId);
}
