'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icons';
import { ActionConfirmCard } from './action-confirm-card';
import { VoiceWaveform } from './voice-waveform';
import { GhostSuggestions } from './ghost-suggestions';
import { SmartVisualizer } from './smart-visualizer';
import { QuickNavigation } from './quick-navigation';
import { ModuleKey, MODULE_SUGGESTIONS } from '@/lib/ai/config';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: PendingAction[];
}

interface PendingAction {
  id: string;
  type: string;
  description: string;
  data: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
}

interface ChatInterfaceProps {
  module?: ModuleKey;
  context?: Record<string, unknown>;
  onClose?: () => void;
  isOpen?: boolean;
}

// Detect navigation-related queries
const isNavigationQuery = (text: string) => {
  const navKeywords = ['navigate', 'navigation', 'go to', 'take me', 'open', 'where is', 'how do i find', 'show me', 'modules', 'menu'];
  return navKeywords.some(keyword => text.toLowerCase().includes(keyword));
};

export function ChatInterface({ module = 'risk', context, onClose, isOpen = true }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Speech recognition hook
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const suggestions = MODULE_SUGGESTIONS[module] || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Update input with speech transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-send when user stops speaking (after getting final transcript)
  useEffect(() => {
    if (!isListening && transcript && transcript.trim()) {
      // Small delay to ensure we have the final transcript
      const timer = setTimeout(() => {
        sendMessage(transcript);
        resetTranscript();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Check if user is asking for navigation help
    if (isNavigationQuery(content)) {
      setShowNavigation(true);
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          module,
          context,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let assistantContent = '';
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessage.id 
                      ? { ...m, content: assistantContent }
                      : m
                  )
                );
              }
            } catch {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      // Check for action requests in response
      detectActions(assistantContent);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectActions = (content: string) => {
    // Detect if AI is proposing actions
    const actionKeywords = ['create', 'update', 'delete', 'escalate', 'assign'];
    const lowerContent = content.toLowerCase();
    
    actionKeywords.forEach(keyword => {
      if (lowerContent.includes(`shall i ${keyword}`) || 
          lowerContent.includes(`would you like me to ${keyword}`) ||
          lowerContent.includes(`i can ${keyword}`)) {
        // Create pending action for approval
        const action: PendingAction = {
          id: `action_${Date.now()}_${keyword}`,
          type: keyword,
          description: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} operation proposed`,
          data: {},
          status: 'pending',
        };
        setPendingActions(prev => [...prev, action]);
      }
    });
  };

  const handleActionApprove = (actionId: string) => {
    setPendingActions(prev => 
      prev.map(a => a.id === actionId ? { ...a, status: 'approved' } : a)
    );
    // Execute the action
    sendMessage(`Yes, please proceed with the action.`);
  };

  const handleActionReject = (actionId: string) => {
    setPendingActions(prev => 
      prev.map(a => a.id === actionId ? { ...a, status: 'rejected' } : a)
    );
    sendMessage(`No, please don't proceed with that action.`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) return null;

  return (
    <Card 
      className="fixed bottom-4 right-4 w-[420px] h-[600px] shadow-2xl z-50 flex flex-col overflow-hidden border-2"
      role="dialog"
      aria-labelledby="chat-title"
      aria-describedby="chat-description"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="bot" size={24} />
          </div>
          <div>
            <h3 id="chat-title" className="font-semibold">Mazwi</h3>
            <p id="chat-description" className="text-xs text-white/80">GRC Intelligence Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{module}</span>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20"
              aria-label="Close chat"
            >
              <Icon name="x" size={18} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <CardContent 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Icon name="message-square" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">How can I help you today?</p>
            <GhostSuggestions 
              suggestions={suggestions.slice(0, 4)} 
              onSelect={handleSuggestionClick}
            />
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border rounded-bl-sm'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="text-sm prose prose-sm max-w-none">
                  <SmartVisualizer content={message.content} module={module} />
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Pending Actions */}
        {pendingActions.filter(a => a.status === 'pending').map(action => (
          <ActionConfirmCard
            key={action.id}
            action={action}
            onApprove={() => handleActionApprove(action.id)}
            onReject={() => handleActionReject(action.id)}
          />
        ))}

        {/* Quick Navigation - shown when user asks for navigation help */}
        {showNavigation && (
          <QuickNavigation onNavigate={() => {
            setShowNavigation(false);
            onClose?.();
          }} />
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Quick Suggestions */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t bg-white">
          <GhostSuggestions 
            suggestions={suggestions.slice(0, 3)} 
            onSelect={handleSuggestionClick}
            compact
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isListening ? stopListening() : startListening()}
            className={isListening ? 'text-red-500' : 'text-gray-500'}
            disabled={!isSpeechSupported}
            aria-label={isSpeechSupported ? (isListening ? 'Stop voice input' : 'Start voice input') : 'Speech not supported'}
            aria-pressed={isListening}
          >
            <Icon name={isListening ? 'mic-off' : 'mic'} size={20} aria-hidden="true" />
          </Button>
          
          {isListening ? (
            <div className="flex-1 flex items-center gap-2">
              <VoiceWaveform isActive={isListening} />
              {interimTranscript && (
                <span className="text-sm text-gray-500 italic truncate max-w-[150px]">
                  {interimTranscript}
                </span>
              )}
            </div>
          ) : (
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Mazwi..."
              className="flex-1"
              disabled={isLoading}
              aria-label="Type your message"
              autoComplete="off"
            />
          )}
          
          <Button
            onClick={() => sendMessage(input)}
            disabled={(!input.trim() && !isListening) || isLoading}
            className="bg-violet-600 hover:bg-violet-700"
            aria-label="Send message"
          >
            <Icon name="send" size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
