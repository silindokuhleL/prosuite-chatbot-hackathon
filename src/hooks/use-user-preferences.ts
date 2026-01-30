'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  // Chat preferences
  defaultModule: string;
  showSuggestions: boolean;
  autoSend: boolean; // Auto-send after voice input
  
  // UI preferences
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  soundEnabled: boolean;
  
  // Behavior preferences
  rememberLastModule: boolean;
  showNavigationOnStart: boolean;
  
  // Frequently used items (learned from usage)
  frequentModules: string[];
  frequentQueries: string[];
  lastUsedModule: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultModule: 'risk',
  showSuggestions: true,
  autoSend: true,
  theme: 'light',
  compactMode: false,
  soundEnabled: false,
  rememberLastModule: true,
  showNavigationOnStart: false,
  frequentModules: [],
  frequentQueries: [],
  lastUsedModule: 'risk',
};

const STORAGE_KEY = 'prosuite_user_preferences';
const MAX_FREQUENT_ITEMS = 5;

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  trackModuleUsage: (module: string) => void;
  trackQueryUsage: (query: string) => void;
  resetPreferences: () => void;
  getEffectiveModule: () => string;
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load user preferences:', error);
        setIsLoaded(true);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save user preferences:', error);
      }
    }
  }, [preferences, isLoaded]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const trackModuleUsage = useCallback((module: string) => {
    setPreferences(prev => {
      const frequent = [module, ...prev.frequentModules.filter(m => m !== module)]
        .slice(0, MAX_FREQUENT_ITEMS);
      return {
        ...prev,
        frequentModules: frequent,
        lastUsedModule: module,
      };
    });
  }, []);

  const trackQueryUsage = useCallback((query: string) => {
    // Only track meaningful queries (not too short)
    if (query.length < 10) return;
    
    setPreferences(prev => {
      const frequent = [query, ...prev.frequentQueries.filter(q => q !== query)]
        .slice(0, MAX_FREQUENT_ITEMS);
      return {
        ...prev,
        frequentQueries: frequent,
      };
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getEffectiveModule = useCallback(() => {
    if (preferences.rememberLastModule && preferences.lastUsedModule) {
      return preferences.lastUsedModule;
    }
    return preferences.defaultModule;
  }, [preferences.rememberLastModule, preferences.lastUsedModule, preferences.defaultModule]);

  return {
    preferences,
    updatePreference,
    trackModuleUsage,
    trackQueryUsage,
    resetPreferences,
    getEffectiveModule,
  };
}

export default useUserPreferences;
