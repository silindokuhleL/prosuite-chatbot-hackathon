'use client';

import {
  LayoutDashboard,
  ShieldAlert,
  Package,
  Scale,
  Building2,
  AlertTriangle,
  ClipboardCheck,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Plus,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Link,
  Copy,
  RefreshCw,
  Loader2,
  Sun,
  Moon,
  Home,
  type LucideIcon,
} from 'lucide-react';

export const Icons = {
  dashboard: LayoutDashboard,
  risk: ShieldAlert,
  asset: Package,
  compliance: Scale,
  governance: Building2,
  incident: AlertTriangle,
  audit: ClipboardCheck,
  performance: TrendingUp,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  menu: Menu,
  close: X,
  search: Search,
  bell: Bell,
  settings: Settings,
  user: User,
  logout: LogOut,
  plus: Plus,
  filter: Filter,
  download: Download,
  upload: Upload,
  more: MoreVertical,
  view: Eye,
  edit: Edit,
  delete: Trash2,
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  users: Users,
  document: FileText,
  barChart: BarChart3,
  pieChart: PieChart,
  activity: Activity,
  target: Target,
  checkCircle: CheckCircle2,
  xCircle: XCircle,
  alertCircle: AlertCircle,
  info: Info,
  help: HelpCircle,
  externalLink: ExternalLink,
  link: Link,
  copy: Copy,
  refresh: RefreshCw,
  loader: Loader2,
  sun: Sun,
  moon: Moon,
  home: Home,
} as const;

export type IconName = keyof typeof Icons;

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent size={size} className={className} {...props} />;
}

export function getModuleIcon(slug: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    risk: ShieldAlert,
    asset: Package,
    compliance: Scale,
    governance: Building2,
    incident: AlertTriangle,
    audit: ClipboardCheck,
    performance: TrendingUp,
  };
  return iconMap[slug] || LayoutDashboard;
}

export type { LucideIcon };
