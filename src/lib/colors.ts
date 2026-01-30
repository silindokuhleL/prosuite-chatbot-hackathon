// ============================================
// ProSuite Theme Colors
// Centralized color definitions for all modules
// ============================================

export const PROSUITE_COLORS = {
  // Primary brand colors
  primary: '#006EAD',
  accent: '#91BC4D',
  
  // Module-specific colors
  risk: { text: '#dc2626', accent: '#fecaca' },
  asset: { text: '#3b82f6', accent: '#bfdbfe' },
  compliance: { text: '#10b981', accent: '#a7f3d0' },
  governance: { text: '#8b5cf6', accent: '#ddd6fe' },
  incident: { text: '#f97316', accent: '#fed7aa' },
  audit: { text: '#06b6d4', accent: '#a5f3fc' },
  performance: { text: '#ec4899', accent: '#fbcfe8' },
} as const;

export type ModuleColorKey = keyof Omit<typeof PROSUITE_COLORS, 'primary' | 'accent'>;

export function getModuleColors(module: ModuleColorKey) {
  return PROSUITE_COLORS[module] || { text: PROSUITE_COLORS.primary, accent: PROSUITE_COLORS.accent };
}
