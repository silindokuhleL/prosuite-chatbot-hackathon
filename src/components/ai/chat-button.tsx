'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { ChatInterface } from './chat-interface';
import { ModuleKey } from '@/lib/ai/config';

interface ChatButtonProps {
  module?: ModuleKey;
  context?: Record<string, unknown>;
}

export function ChatButton({ module = 'risk', context }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 scale-90' 
            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 scale-100'
        }`}
      >
        <Icon 
          name={isOpen ? 'x' : 'message-circle'} 
          size={24} 
          className="text-white"
        />
      </Button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 animate-ping opacity-20 z-30" />
      )}

      {/* Chat Interface */}
      <ChatInterface 
        module={module} 
        context={context} 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
