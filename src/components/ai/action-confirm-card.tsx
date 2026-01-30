'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon, IconName } from '@/components/ui/icons';

interface ActionConfirmCardProps {
  action: {
    id: string;
    type: string;
    description: string;
    data: Record<string, unknown>;
  };
  onApprove: () => void;
  onReject: () => void;
}

export function ActionConfirmCard({ action, onApprove, onReject }: ActionConfirmCardProps) {
  const getActionIcon = (type: string): IconName => {
    const icons: Record<string, IconName> = {
      create: 'plus-circle',
      update: 'edit',
      delete: 'trash-2',
      escalate: 'alert-triangle',
      assign: 'user-plus',
    };
    return icons[type] || 'activity';
  };

  const getActionColor = (type: string) => {
    const colors: Record<string, string> = {
      create: 'bg-green-50 border-green-200',
      update: 'bg-blue-50 border-blue-200',
      delete: 'bg-red-50 border-red-200',
      escalate: 'bg-orange-50 border-orange-200',
      assign: 'bg-purple-50 border-purple-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <Card className={`p-4 border-2 ${getActionColor(action.type)}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          action.type === 'delete' ? 'bg-red-100 text-red-600' : 
          action.type === 'escalate' ? 'bg-orange-100 text-orange-600' :
          'bg-violet-100 text-violet-600'
        }`}>
          <Icon name={getActionIcon(action.type)} size={20} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">AI wants to {action.type}</p>
          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          
          {Object.keys(action.data).length > 0 && (
            <div className="mt-2 p-2 bg-white rounded text-xs font-mono text-gray-500 max-h-20 overflow-auto">
              {JSON.stringify(action.data, null, 2)}
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Icon name="check" size={16} className="mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Icon name="x" size={16} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
