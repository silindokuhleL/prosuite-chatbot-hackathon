'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export type ActionProgressStatus = 
  | 'pending' 
  | 'validating' 
  | 'executing' 
  | 'completed' 
  | 'failed';

export interface ActionStep {
  id: string;
  label: string;
  status: ActionProgressStatus;
  detail?: string;
}

interface ActionProgressProps {
  title: string;
  steps: ActionStep[];
  currentStep: number;
  onCancel?: () => void;
  className?: string;
}

const statusConfig: Record<ActionProgressStatus, { icon: string; color: string; bgColor: string }> = {
  pending: { icon: 'target', color: 'text-gray-400', bgColor: 'bg-gray-100' },
  validating: { icon: 'loader', color: 'text-blue-500', bgColor: 'bg-blue-50' },
  executing: { icon: 'loader', color: 'text-violet-500', bgColor: 'bg-violet-50' },
  completed: { icon: 'checkCircle', color: 'text-green-500', bgColor: 'bg-green-50' },
  failed: { icon: 'xCircle', color: 'text-red-500', bgColor: 'bg-red-50' },
};

export function ActionProgress({ title, steps, currentStep, onCancel, className }: ActionProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const isComplete = steps.every(s => s.status === 'completed');
  const hasFailed = steps.some(s => s.status === 'failed');

  useEffect(() => {
    if (isComplete || hasFailed) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, hasFailed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!isComplete && !hasFailed && (
              <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            )}
            {isComplete && <Icon name="checkCircle" className="w-5 h-5 text-green-500" />}
            {hasFailed && <Icon name="xCircle" className="w-5 h-5 text-red-500" />}
            <span className="font-medium text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{formatTime(elapsedTime)}</span>
            {onCancel && !isComplete && !hasFailed && (
              <button
                onClick={onCancel}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => {
            const config = statusConfig[step.status];
            const isActive = index === currentStep && !isComplete && !hasFailed;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  isActive && config.bgColor
                )}
              >
                <div className={cn("shrink-0", config.color)}>
                  <Icon 
                    name={config.icon as 'target' | 'loader' | 'checkCircle' | 'xCircle'} 
                    className={cn(
                      "w-4 h-4",
                      (step.status === 'validating' || step.status === 'executing') && 'animate-spin'
                    )} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    step.status === 'completed' && 'text-green-700',
                    step.status === 'failed' && 'text-red-700',
                    step.status === 'pending' && 'text-gray-400'
                  )}>
                    {step.label}
                  </p>
                  {step.detail && (
                    <p className="text-xs text-gray-500 truncate">{step.detail}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              hasFailed ? 'bg-red-500' : 'bg-violet-500'
            )}
            style={{ 
              width: `${((steps.filter(s => s.status === 'completed').length) / steps.length) * 100}%` 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing action progress
export function useActionProgress(initialSteps: Omit<ActionStep, 'status'>[]) {
  const [steps, setSteps] = useState<ActionStep[]>(
    initialSteps.map(s => ({ ...s, status: 'pending' as ActionProgressStatus }))
  );
  const [currentStep, setCurrentStep] = useState(0);

  const startStep = (stepId: string) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, status: 'executing' } : s
    ));
    const index = steps.findIndex(s => s.id === stepId);
    if (index !== -1) setCurrentStep(index);
  };

  const completeStep = (stepId: string, detail?: string) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, status: 'completed', detail } : s
    ));
  };

  const failStep = (stepId: string, detail?: string) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, status: 'failed', detail } : s
    ));
  };

  const reset = () => {
    setSteps(initialSteps.map(s => ({ ...s, status: 'pending' })));
    setCurrentStep(0);
  };

  return {
    steps,
    currentStep,
    startStep,
    completeStep,
    failStep,
    reset,
    isComplete: steps.every(s => s.status === 'completed'),
    hasFailed: steps.some(s => s.status === 'failed'),
  };
}

export default ActionProgress;
