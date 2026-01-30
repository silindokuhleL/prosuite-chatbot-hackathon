'use client';

import { useMemo } from 'react';
import { 
  RiskHeatmapChart, 
  SimpleBarChart, 
  SimplePieChart, 
  SimpleLineChart,
  MetricCards,
  ProgressBars 
} from './charts';
import { MarkdownRenderer } from './markdown-renderer';
import { getCollection } from '@/lib/crud';

interface SmartVisualizerProps {
  content: string;
  module?: string;
}

type DataRecord = Record<string, unknown>;

// Detect visualization type from AI response
function detectVisualizationType(content: string): string | null {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('heatmap') || (lowerContent.includes('impact') && lowerContent.includes('likelihood'))) {
    return 'heatmap';
  }
  if (lowerContent.includes('pie chart') || lowerContent.includes('distribution') || lowerContent.includes('breakdown')) {
    return 'pie';
  }
  if (lowerContent.includes('bar chart') || lowerContent.includes('comparison') || lowerContent.includes('by category')) {
    return 'bar';
  }
  if (lowerContent.includes('trend') || lowerContent.includes('over time') || lowerContent.includes('timeline')) {
    return 'line';
  }
  if (lowerContent.includes('metrics') || lowerContent.includes('kpi') || lowerContent.includes('summary')) {
    return 'metrics';
  }
  if (lowerContent.includes('progress') || lowerContent.includes('completion')) {
    return 'progress';
  }
  
  return null;
}

// Detect which module data to use
function detectDataModule(content: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('risk')) return 'risk';
  if (lowerContent.includes('asset')) return 'asset';
  if (lowerContent.includes('incident')) return 'incident';
  if (lowerContent.includes('audit') || lowerContent.includes('finding')) return 'audit';
  if (lowerContent.includes('compliance') || lowerContent.includes('control')) return 'compliance';
  if (lowerContent.includes('policy') || lowerContent.includes('governance')) return 'governance';
  if (lowerContent.includes('performance') || lowerContent.includes('kpi')) return 'performance';
  
  return 'risk'; // Default
}

// Build Risk Heatmap Data
function buildHeatmapData() {
  const risks = getCollection('risk.risks') as DataRecord[];
  
  const impacts = ['Catastrophic', 'Major', 'Moderate', 'Minor', 'Insignificant'];
  const likelihoods = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
  
  // Impact ID to name mapping (from demo data structure)
  const impactIdMap: Record<number, string> = {
    1: 'Insignificant', 2: 'Minor', 3: 'Moderate', 4: 'Major', 5: 'Catastrophic'
  };
  
  // Likelihood ID to name mapping
  const likelihoodIdMap: Record<number, string> = {
    1: 'Rare', 2: 'Unlikely', 3: 'Possible', 4: 'Likely', 5: 'Almost Certain'
  };
  
  const heatmapData: { impact: string; likelihood: string; count: number; risks: string[] }[] = [];
  
  impacts.forEach(impact => {
    likelihoods.forEach(likelihood => {
      const matchingRisks = risks.filter(r => {
        // Use ID mappings - demo data uses impact_rating_id and likelihood_rating_id
        const impactId = r.impact_rating_id as number;
        const likelihoodId = r.likelihood_rating_id as number;
        const riskImpact = impactIdMap[impactId] || (r.impact as string) || 'Moderate';
        const riskLikelihood = likelihoodIdMap[likelihoodId] || (r.likelihood as string) || 'Possible';
        return riskImpact === impact && riskLikelihood === likelihood;
      });
      
      heatmapData.push({
        impact,
        likelihood,
        count: matchingRisks.length,
        risks: matchingRisks.map(r => (r.title as string) || (r.name as string) || 'Unnamed Risk'),
      });
    });
  });
  
  // Check if we have any data
  const totalCount = heatmapData.reduce((sum, cell) => sum + cell.count, 0);
  
  // If no real data, create sample distribution
  if (totalCount === 0) {
    const sampleCounts: Record<string, Record<string, number>> = {
      Catastrophic: { Rare: 0, Unlikely: 0, Possible: 2, Likely: 1, 'Almost Certain': 0 },
      Major: { Rare: 1, Unlikely: 2, Possible: 3, Likely: 1, 'Almost Certain': 0 },
      Moderate: { Rare: 3, Unlikely: 2, Possible: 4, Likely: 2, 'Almost Certain': 0 },
      Minor: { Rare: 5, Unlikely: 3, Possible: 2, Likely: 1, 'Almost Certain': 0 },
      Insignificant: { Rare: 2, Unlikely: 1, Possible: 1, Likely: 0, 'Almost Certain': 0 },
    };
    
    return impacts.flatMap(impact => 
      likelihoods.map(likelihood => ({
        impact,
        likelihood,
        count: sampleCounts[impact]?.[likelihood] || 0,
        risks: [],
      }))
    );
  }
  
  return heatmapData;
}

// Priority level mapping (priority_id to name)
const PRIORITY_MAP: Record<number, string> = {
  1: 'Critical',
  2: 'High', 
  3: 'Medium',
  4: 'Low',
};

// Build Bar Chart Data by Priority/Status
function buildBarChartData(module: string) {
  let data: DataRecord[] = [];
  let groupByField = 'status';
  let useIdMapping = false;
  let idMap: Record<number, string> = {};
  
  switch (module) {
    case 'risk':
      data = getCollection('risk.risks') as DataRecord[];
      groupByField = 'priority_id';
      useIdMapping = true;
      idMap = PRIORITY_MAP;
      break;
    case 'asset':
      data = getCollection('asset.assets') as DataRecord[];
      groupByField = 'status';
      break;
    case 'incident':
      data = getCollection('incident.incidents') as DataRecord[];
      groupByField = 'severity';
      break;
    case 'audit':
      data = getCollection('audit.audit_findings') as DataRecord[];
      groupByField = 'status';
      break;
    case 'compliance':
      data = getCollection('compliance.compliance_packages') as DataRecord[];
      groupByField = 'status';
      break;
    default:
      data = getCollection('risk.risks') as DataRecord[];
      groupByField = 'priority_id';
      useIdMapping = true;
      idMap = PRIORITY_MAP;
  }
  
  // Group by the field
  const groups: Record<string, number> = {};
  data.forEach(item => {
    let key: string;
    if (useIdMapping) {
      const id = item[groupByField] as number;
      key = idMap[id] || 'Unknown';
    } else {
      key = (item[groupByField] as string) || 'Unknown';
    }
    groups[key] = (groups[key] || 0) + 1;
  });
  
  // Remove Unknown if we have other categories
  const nonUnknownEntries = Object.entries(groups).filter(([k]) => k !== 'Unknown');
  if (nonUnknownEntries.length > 0) {
    delete groups['Unknown'];
  }
  
  // If no data or only Unknown, use sample
  if (Object.keys(groups).length === 0) {
    if (groupByField.includes('priority')) {
      return [
        { name: 'Critical', value: 5 },
        { name: 'High', value: 12 },
        { name: 'Medium', value: 23 },
        { name: 'Low', value: 18 },
      ];
    }
    return [
      { name: 'Open', value: 15 },
      { name: 'In Progress', value: 8 },
      { name: 'Closed', value: 22 },
    ];
  }
  
  // Sort by priority order for risks
  const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
  const entries = Object.entries(groups);
  
  if (groupByField.includes('priority')) {
    entries.sort((a, b) => {
      const aIdx = priorityOrder.indexOf(a[0]);
      const bIdx = priorityOrder.indexOf(b[0]);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });
  }
  
  return entries.map(([name, value]) => ({ name, value }));
}

// Build Pie Chart Data
function buildPieChartData(module: string) {
  return buildBarChartData(module); // Same logic works for pie
}

// Build Metrics Data
function buildMetricsData() {
  const risks = getCollection('risk.risks') as DataRecord[];
  const assets = getCollection('asset.assets') as DataRecord[];
  const incidents = getCollection('incident.incidents') as DataRecord[];
  const findings = getCollection('audit.audit_findings') as DataRecord[];
  
  const criticalRisks = risks.filter(r => r.priority === 'Critical' || r.risk_level === 'Critical').length;
  const openIncidents = incidents.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
  const openFindings = findings.filter(f => f.status === 'Open').length;
  
  return [
    { label: 'Total Risks', value: risks.length || 45, change: 5, color: '#ef4444' },
    { label: 'Critical Risks', value: criticalRisks || 8, change: -12, color: '#dc2626' },
    { label: 'Total Assets', value: assets.length || 156, change: 3, color: '#3b82f6' },
    { label: 'Active Incidents', value: openIncidents || 12, change: -8, color: '#f59e0b' },
    { label: 'Open Findings', value: openFindings || 15, change: 2, color: '#7c3aed' },
    { label: 'Compliance Score', value: '87%', change: 4, color: '#22c55e' },
  ];
}

// Build Progress Data
function buildProgressData(module: string) {
  const data = buildBarChartData(module);
  const max = Math.max(...data.map(d => d.value), 30);
  
  return data.map(d => ({
    label: d.name,
    value: d.value,
    max,
  }));
}

// Build Line Chart Data (trend over time)
function buildLineChartData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map((month, idx) => ({
    name: month,
    risks: 30 + Math.floor(Math.random() * 20) + idx * 2,
    incidents: 10 + Math.floor(Math.random() * 10),
    resolved: 20 + Math.floor(Math.random() * 15) + idx * 3,
  }));
}

export function SmartVisualizer({ content, module }: SmartVisualizerProps) {
  const vizType = useMemo(() => detectVisualizationType(content), [content]);
  const dataModule = useMemo(() => module || detectDataModule(content), [content, module]);
  
  // Render the appropriate visualization
  const renderVisualization = () => {
    switch (vizType) {
      case 'heatmap':
        return (
          <RiskHeatmapChart 
            data={buildHeatmapData()} 
            title="Risk Heatmap (Impact vs Likelihood)"
          />
        );
      
      case 'bar':
        return (
          <SimpleBarChart 
            data={buildBarChartData(dataModule)}
            title={`${dataModule.charAt(0).toUpperCase() + dataModule.slice(1)} Distribution`}
            colorKey={dataModule === 'risk' ? 'risk' : 'status'}
          />
        );
      
      case 'pie':
        return (
          <SimplePieChart 
            data={buildPieChartData(dataModule)}
            title={`${dataModule.charAt(0).toUpperCase() + dataModule.slice(1)} Breakdown`}
            colorKey={dataModule === 'risk' ? 'risk' : 'status'}
          />
        );
      
      case 'line':
        return (
          <SimpleLineChart 
            data={buildLineChartData()}
            lines={[
              { key: 'risks', color: '#ef4444', name: 'Total Risks' },
              { key: 'incidents', color: '#f59e0b', name: 'Incidents' },
              { key: 'resolved', color: '#22c55e', name: 'Resolved' },
            ]}
            title="Trend Over Time"
          />
        );
      
      case 'metrics':
        return (
          <MetricCards 
            metrics={buildMetricsData()}
            title="Key Metrics"
          />
        );
      
      case 'progress':
        return (
          <ProgressBars 
            data={buildProgressData(dataModule)}
            title={`${dataModule.charAt(0).toUpperCase() + dataModule.slice(1)} Progress`}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="smart-visualizer">
      {/* Always render the markdown content first */}
      <MarkdownRenderer content={content} />
      
      {/* Then render the detected visualization */}
      {vizType && renderVisualization()}
    </div>
  );
}
