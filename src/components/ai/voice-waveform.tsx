'use client';

import { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
}

export function VoiceWaveform({ isActive }: VoiceWaveformProps) {
  const [bars, setBars] = useState<number[]>([0.3, 0.5, 0.7, 0.5, 0.3, 0.6, 0.4, 0.8, 0.5, 0.3]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 0.7 + 0.3));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex-1 flex items-center justify-center gap-1 h-10 px-4 bg-violet-50 rounded-lg">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-violet-500 rounded-full transition-all duration-100"
          style={{
            height: isActive ? `${height * 100}%` : '20%',
            opacity: isActive ? 1 : 0.5,
          }}
        />
      ))}
      <span className="ml-3 text-sm text-violet-600 font-medium">
        {isActive ? 'Listening...' : 'Voice ready'}
      </span>
    </div>
  );
}
