'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean; // Cmd on Mac
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

const defaultShortcuts: KeyboardShortcut[] = [];

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[] = defaultShortcuts) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable
    ) {
      // Allow Escape key even in inputs
      if (event.key !== 'Escape') {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
      const metaMatches = shortcut.meta ? event.metaKey : true;
      const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatches = shortcut.alt ? event.altKey : !event.altKey;

      // Special handling for Cmd/Ctrl+K
      if (shortcut.key.toLowerCase() === 'k' && (shortcut.ctrl || shortcut.meta)) {
        if (keyMatches && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Pre-defined shortcuts for the chat interface
export function useChatShortcuts(options: {
  onOpenChat: () => void;
  onCloseChat: () => void;
  onClearChat?: () => void;
  isOpen: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      meta: true,
      action: options.onOpenChat,
      description: 'Open AI Chat (⌘K)'
    },
    {
      key: 'Escape',
      action: options.onCloseChat,
      description: 'Close AI Chat (Esc)'
    },
  ];

  if (options.onClearChat) {
    shortcuts.push({
      key: 'l',
      meta: true,
      shift: true,
      action: options.onClearChat,
      description: 'Clear Chat (⌘⇧L)'
    });
  }

  useKeyboardShortcuts(shortcuts);
}

// Accessibility shortcuts
export function useAccessibilityShortcuts(options: {
  onFocusChat?: () => void;
  onFocusMain?: () => void;
  onToggleHighContrast?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (options.onFocusChat) {
    shortcuts.push({
      key: '/',
      action: options.onFocusChat,
      description: 'Focus Chat Input (/)'
    });
  }

  if (options.onFocusMain) {
    shortcuts.push({
      key: 'm',
      alt: true,
      action: options.onFocusMain,
      description: 'Focus Main Content (Alt+M)'
    });
  }

  useKeyboardShortcuts(shortcuts);
}

export default useKeyboardShortcuts;
