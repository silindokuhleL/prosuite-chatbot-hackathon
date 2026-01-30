'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

// Color palettes
const RISK_COLORS = {
  Critical: '#dc2626',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

const STATUS_COLORS = {
  Open: '#3b82f6',
  'In Progress': '#f59e0b',
  Closed: '#22c55e',
  Resolved: '#10b981',
  Pending: '#f97316',
};

const MODULE_COLORS = [
  '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'
];

// Risk Heatmap Component - Visual Grid
interface HeatmapData {
  impact: string;
  likelihood: string;
  count: number;
  risks: string[];
}

interface RiskHeatmapChartProps {
  data: HeatmapData[];
  title?: string;
}

export function RiskHeatmapChart({ data, title }: RiskHeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<{ impact: string; likelihood: string; x: number; y: number } | null>(null);
  
  const impacts = ['Catastrophic', 'Major', 'Moderate', 'Minor', 'Insignificant'];
  const likelihoods = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];

  const getCell = (impact: string, likelihood: string) => {
    return data.find(d => d.impact === impact && d.likelihood === likelihood);
  };

  const getRiskScore = (impactIdx: number, likelihoodIdx: number): number => {
    return (5 - impactIdx) * (likelihoodIdx + 1);
  };

  const getColor = (score: number): string => {
    if (score >= 20) return '#dc2626'; // Critical - Red
    if (score >= 15) return '#f97316'; // High - Orange
    if (score >= 10) return '#eab308'; // Medium - Yellow
    if (score >= 5) return '#84cc16';  // Low-Medium - Light Green
    return '#22c55e'; // Low - Green
  };

  const hoveredData = hoveredCell ? getCell(hoveredCell.impact, hoveredCell.likelihood) : null;

  return (
    <div className="my-4 p-4 bg-white rounded-lg border shadow-sm overflow-visible relative">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="p-1 font-medium text-gray-500 text-left w-20">Impact ↓</th>
              {likelihoods.map(l => (
                <th key={l} className="p-1 font-medium text-gray-600 text-center w-14">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {impacts.map((impact, iIdx) => (
              <tr key={impact}>
                <td className="p-1 font-medium text-gray-600 text-[10px]">{impact}</td>
                {likelihoods.map((likelihood, lIdx) => {
                  const cell = getCell(impact, likelihood);
                  const score = getRiskScore(iIdx, lIdx);
                  const color = getColor(score);
                  return (
                    <td key={likelihood} className="p-0.5 relative">
                      <div
                        className="h-10 w-full rounded flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-transform hover:scale-110 hover:z-10 hover:shadow-lg"
                        style={{ backgroundColor: color }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({ impact, likelihood, x: rect.left, y: rect.top });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <span className="text-sm">{cell?.count || 0}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Custom Tooltip */}
      {hoveredCell && hoveredData && (
        <div 
          className="absolute z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-[200px] pointer-events-none"
          style={{ 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="font-semibold mb-1 text-violet-300">
            {hoveredCell.impact} × {hoveredCell.likelihood}
          </div>
          <div className="text-gray-300 mb-2">
            {hoveredData.count} risk{hoveredData.count !== 1 ? 's' : ''} in this zone
          </div>
          {hoveredData.risks && hoveredData.risks.length > 0 ? (
            <ul className="space-y-1">
              {hoveredData.risks.slice(0, 5).map((risk, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-yellow-400">•</span>
                  <span className="text-white">{risk}</span>
                </li>
              ))}
              {hoveredData.risks.length > 5 && (
                <li className="text-gray-400 italic">+{hoveredData.risks.length - 5} more...</li>
              )}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No risks in this zone</p>
          )}
        </div>
      )}
      
      {/* Legend with proper spacing */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-2 border-t text-[10px]">
        <span className="font-medium text-gray-500">Risk Level:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{backgroundColor: '#22c55e'}}></span>Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{backgroundColor: '#84cc16'}}></span>Low-Med</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{backgroundColor: '#eab308'}}></span>Medium</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{backgroundColor: '#f97316'}}></span>High</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{backgroundColor: '#dc2626'}}></span>Critical</span>
      </div>
    </div>
  );
}

// Bar Chart for counts/distributions
interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  colorKey?: 'risk' | 'status' | 'module';
}

export function SimpleBarChart({ data, title, xLabel, yLabel, colorKey = 'module' }: SimpleBarChartProps) {
  const getColor = (name: string, index: number) => {
    if (colorKey === 'risk') return RISK_COLORS[name as keyof typeof RISK_COLORS] || MODULE_COLORS[index % MODULE_COLORS.length];
    if (colorKey === 'status') return STATUS_COLORS[name as keyof typeof STATUS_COLORS] || MODULE_COLORS[index % MODULE_COLORS.length];
    return MODULE_COLORS[index % MODULE_COLORS.length];
  };

  return (
    <div className="my-4 p-4 bg-white rounded-lg border shadow-sm">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }} 
            label={xLabel ? { value: xLabel, position: 'bottom', fontSize: 11 } : undefined}
          />
          <YAxis tick={{ fontSize: 11 }} label={yLabel ? { value: yLabel, angle: -90, position: 'left', fontSize: 11 } : undefined} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || getColor(entry.name, index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Pie Chart for distributions
interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface SimplePieChartProps {
  data: PieChartData[];
  title?: string;
  colorKey?: 'risk' | 'status' | 'module';
}

export function SimplePieChart({ data, title, colorKey = 'module' }: SimplePieChartProps) {
  const getColor = (name: string, index: number) => {
    if (colorKey === 'risk') return RISK_COLORS[name as keyof typeof RISK_COLORS] || MODULE_COLORS[index % MODULE_COLORS.length];
    if (colorKey === 'status') return STATUS_COLORS[name as keyof typeof STATUS_COLORS] || MODULE_COLORS[index % MODULE_COLORS.length];
    return MODULE_COLORS[index % MODULE_COLORS.length];
  };

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="my-4 p-4 bg-white rounded-lg border shadow-sm">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || getColor(entry.name, index)} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        {data.map((entry, index) => (
          <span key={entry.name} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || getColor(entry.name, index) }}></span>
            {entry.name}: {entry.value}
          </span>
        ))}
      </div>
    </div>
  );
}

// Line Chart for trends
interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface SimpleLineChartProps {
  data: LineChartData[];
  lines: { key: string; color: string; name: string }[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export function SimpleLineChart({ data, lines, title, xLabel, yLabel }: SimpleLineChartProps) {
  return (
    <div className="my-4 p-4 bg-white rounded-lg border shadow-sm">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            label={xLabel ? { value: xLabel, position: 'bottom', fontSize: 11 } : undefined}
          />
          <YAxis tick={{ fontSize: 11 }} label={yLabel ? { value: yLabel, angle: -90, position: 'left', fontSize: 11 } : undefined} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {lines.map(line => (
            <Line 
              key={line.key}
              type="monotone" 
              dataKey={line.key} 
              stroke={line.color} 
              strokeWidth={2}
              dot={{ r: 4 }}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Area Chart for cumulative/stacked data
interface AreaChartData {
  name: string;
  [key: string]: string | number;
}

interface SimpleAreaChartProps {
  data: AreaChartData[];
  areas: { key: string; color: string; name: string }[];
  title?: string;
  stacked?: boolean;
}

export function SimpleAreaChart({ data, areas, title, stacked = true }: SimpleAreaChartProps) {
  return (
    <div className="my-4 p-4 bg-white rounded-lg border shadow-sm">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {areas.map(area => (
            <Area 
              key={area.key}
              type="monotone" 
              dataKey={area.key} 
              stroke={area.color}
              fill={area.color}
              fillOpacity={0.3}
              stackId={stacked ? 'stack' : undefined}
              name={area.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Metric Cards Grid
interface MetricData {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
  color?: string;
}

interface MetricCardsProps {
  metrics: MetricData[];
  title?: string;
}

export function MetricCards({ metrics, title }: MetricCardsProps) {
  return (
    <div className="my-4">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-3 bg-white rounded-lg border shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold" style={{ color: metric.color || '#7c3aed' }}>
              {metric.value}
            </p>
            {metric.change !== undefined && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{metric.change >= 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(metric.change)}% from last period</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontal Progress Bars for comparisons
interface ProgressData {
  label: string;
  value: number;
  max: number;
  color?: string;
}

interface ProgressBarsProps {
  data: ProgressData[];
  title?: string;
}

export function ProgressBars({ data, title }: ProgressBarsProps) {
  return (
    <div className="my-4 p-4 bg-white rounded-lg border shadow-sm">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{item.value} / {item.max}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                  backgroundColor: item.color || MODULE_COLORS[idx % MODULE_COLORS.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
