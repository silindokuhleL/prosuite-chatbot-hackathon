'use client';

// Risk Heatmap Component
interface HeatmapCell {
  label: string;
  value: number;
  count?: number;
}

interface RiskHeatmapProps {
  data: HeatmapCell[][];
  xLabels: string[];
  yLabels: string[];
  title?: string;
}

export function RiskHeatmap({ data, xLabels, yLabels, title }: RiskHeatmapProps) {
  const getColor = (value: number) => {
    if (value >= 20) return 'bg-red-600 text-white';
    if (value >= 15) return 'bg-red-500 text-white';
    if (value >= 10) return 'bg-orange-500 text-white';
    if (value >= 5) return 'bg-yellow-400 text-gray-900';
    return 'bg-green-400 text-gray-900';
  };

  return (
    <div className="my-3">
      {title && <h4 className="text-sm font-semibold mb-2 text-gray-700">{title}</h4>}
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="p-1"></th>
              {xLabels.map((label, i) => (
                <th key={i} className="p-1 text-center font-medium text-gray-600 min-w-[60px]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="p-1 font-medium text-gray-600 text-right pr-2">{yLabels[i]}</td>
                {row.map((cell, j) => (
                  <td key={j} className="p-0.5">
                    <div
                      className={`w-full h-10 rounded flex items-center justify-center font-semibold ${getColor(cell.value)}`}
                    >
                      {cell.count !== undefined ? cell.count : cell.value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>Risk Level:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded"></span>Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span>Medium</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span>High</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 rounded"></span>Critical</span>
      </div>
    </div>
  );
}

// Module Summary Cards
interface ModuleSummary {
  module: string;
  color: string;
  total: number;
  critical: number;
  open: number;
}

interface ModuleSummaryCardsProps {
  summaries: ModuleSummary[];
}

export function ModuleSummaryCards({ summaries }: ModuleSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 my-3">
      {summaries.map((summary) => (
        <div
          key={summary.module}
          className="p-3 rounded-lg border bg-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: summary.color }}>
              {summary.module}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: summary.color }}>
              {summary.total}
            </span>
          </div>
          <div className="flex gap-2 text-xs">
            {summary.critical > 0 && (
              <span className="text-red-600">⚠ {summary.critical} critical</span>
            )}
            {summary.open > 0 && (
              <span className="text-orange-600">{summary.open} open</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Status Distribution Bar
interface StatusDistributionProps {
  title: string;
  data: { label: string; value: number; color: string }[];
}

export function StatusDistribution({ title, data }: StatusDistributionProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  return (
    <div className="my-3">
      <h4 className="text-sm font-semibold mb-2 text-gray-700">{title}</h4>
      <div className="h-6 rounded-full overflow-hidden flex bg-gray-100">
        {data.map((d, i) => (
          <div
            key={i}
            className="h-full flex items-center justify-center text-xs text-white font-medium transition-all"
            style={{
              width: `${(d.value / total) * 100}%`,
              backgroundColor: d.color,
            }}
          >
            {d.value > 0 && total > 0 && ((d.value / total) * 100) > 10 && d.value}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs">
        {data.map((d, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: d.color }}></span>
            {d.label}: {d.value}
          </span>
        ))}
      </div>
    </div>
  );
}

// Metric Card
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  color?: string;
}

export function MetricCard({ label, value, change, color = '#7c3aed' }: MetricCardProps) {
  return (
    <div className="p-3 rounded-lg border bg-white shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
        </p>
      )}
    </div>
  );
}

// Metrics Grid
interface MetricsGridProps {
  metrics: MetricCardProps[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 my-3">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}

// Data Table with styling
interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  title?: string;
}

export function StyledDataTable({ headers, rows, title }: DataTableProps) {
  return (
    <div className="my-3">
      {title && <h4 className="text-sm font-semibold mb-2 text-gray-700">{title}</h4>}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-xs">
          <thead className="bg-violet-50">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold text-violet-900 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 border-b border-gray-100">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Priority Badge
export function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[priority] || 'bg-gray-100 text-gray-700'}`}>
      {priority}
    </span>
  );
}

// Status Badge
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    Closed: 'bg-green-100 text-green-700',
    Resolved: 'bg-green-100 text-green-700',
    Critical: 'bg-red-100 text-red-700',
    Pending: 'bg-orange-100 text-orange-700',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
