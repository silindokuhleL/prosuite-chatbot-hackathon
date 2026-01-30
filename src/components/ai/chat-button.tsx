'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { ChatInterface } from './chat-interface';
import { ModuleKey } from '@/lib/ai/config';

interface ChatButtonProps {
  module?: ModuleKey;
  context?: Record<string, unknown>;
}

// Detect module from URL path
function detectModuleFromPath(pathname: string): ModuleKey {
  const pathParts = pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0]?.toLowerCase();
  
  const moduleMap: Record<string, ModuleKey> = {
    'risk': 'risk',
    'asset': 'asset',
    'incident': 'incident',
    'audit': 'audit',
    'compliance': 'compliance',
    'governance': 'governance',
    'performance': 'performance',
  };
  
  return moduleMap[firstPart] || 'risk';
}

export function ChatButton({ module: propModule, context }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Auto-detect module from URL if not provided
  const detectedModule = detectModuleFromPath(pathname);
  const module = propModule || detectedModule;

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
