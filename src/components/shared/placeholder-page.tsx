import { Icon, type IconName } from '@/components/ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: IconName;
  color?: string;
}

export function PlaceholderPage({ title, description, icon = 'dashboard', color }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div 
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: color ? `${color}20` : 'var(--muted)' }}
          >
            <Icon 
              name={icon} 
              size={32} 
              style={{ color: color || 'var(--muted-foreground)' }}
            />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page is under development. Check back soon for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
