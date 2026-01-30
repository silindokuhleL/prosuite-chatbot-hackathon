'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';

interface GhostSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  compact?: boolean;
}

export function GhostSuggestions({ suggestions, onSelect, compact = false }: GhostSuggestionsProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-xs text-violet-600 hover:bg-violet-50 h-7 px-2"
          >
            <Icon name="star" size={12} className="mr-1" />
            {suggestion.length > 25 ? suggestion.slice(0, 25) + '...' : suggestion}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
          className="text-xs border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
        >
          <Icon name="activity" size={14} className="mr-1 text-violet-500" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
