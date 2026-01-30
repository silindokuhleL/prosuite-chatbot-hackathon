'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  module?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  module?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UseChatHistoryReturn {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  createSession: (module?: string) => ChatSession;
  loadSession: (sessionId: string) => void;
  saveMessage: (message: ChatMessage) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  renameSession: (sessionId: string, title: string) => void;
}

const STORAGE_KEY = 'prosuite_chat_history';
const MAX_SESSIONS = 20;

// Generate a title from first user message
function generateTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content.trim();
    return content.length > 40 ? content.substring(0, 40) + '...' : content;
  }
  return 'New Conversation';
}

export function useChatHistory(): UseChatHistoryReturn {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          const sessionsWithDates = parsed.map((s: ChatSession) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
            messages: s.messages.map((m: ChatMessage) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          }));
          setSessions(sessionsWithDates);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const createSession = useCallback((module?: string): ChatSession => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      module,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => {
      // Keep only MAX_SESSIONS, removing oldest if needed
      const updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
      return updated;
    });
    
    setCurrentSessionId(newSession.id);
    return newSession;
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const saveMessage = useCallback((message: ChatMessage) => {
    setSessions(prev => {
      return prev.map(session => {
        if (session.id === currentSessionId) {
          const updatedMessages = [...session.messages, message];
          return {
            ...session,
            messages: updatedMessages,
            title: session.messages.length === 0 ? generateTitle(updatedMessages) : session.title,
            updatedAt: new Date(),
          };
        }
        return session;
      });
    });
  }, [currentSessionId]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const renameSession = useCallback((sessionId: string, title: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title } : s
    ));
  }, []);

  return {
    sessions,
    currentSession,
    createSession,
    loadSession,
    saveMessage,
    deleteSession,
    clearAllSessions,
    renameSession,
  };
}

export default useChatHistory;
