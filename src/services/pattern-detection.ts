/**
 * Pattern Detection Service
 * Simple analytics to detect patterns in risks, incidents, and KPIs
 */

import { getCollection } from '@/lib/crud';

interface PatternResult {
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'info';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  data?: Record<string, unknown>;
  recommendations?: string[];
}

interface RiskRecord {
  id: number;
  title?: string;
  priority_id?: number;
  status?: string;
  department_id?: number;
  created_at?: string;
  risk_level?: string;
}

interface IncidentRecord {
  id: number;
  title?: string;
  severity_level_id?: number;
  status?: string;
  incident_type_id?: number;
  reported_date?: string;
  department_id?: number;
}

// Detect risk patterns
export function detectRiskPatterns(): PatternResult[] {
  const risks = getCollection('risk.risks') as RiskRecord[];
  const patterns: PatternResult[] = [];

  if (!risks || risks.length === 0) {
    return [{
      type: 'info' as const,
      severity: 'info',
      title: 'No Risk Data',
      description: 'No risks found in the system to analyze.',
    }];
  }

  // Pattern 1: High concentration of critical/high priority risks
  const criticalRisks = risks.filter(r => r.priority_id === 1 || r.priority_id === 2);
  const criticalPercentage = (criticalRisks.length / risks.length) * 100;
  
  if (criticalPercentage > 30) {
    patterns.push({
      type: 'anomaly',
      severity: 'critical',
      title: 'High Critical Risk Concentration',
      description: `${criticalPercentage.toFixed(0)}% of risks are Critical or High priority (${criticalRisks.length} of ${risks.length}).`,
      data: { criticalCount: criticalRisks.length, totalCount: risks.length },
      recommendations: [
        'Review and prioritize risk mitigation actions',
        'Escalate to senior management',
        'Consider additional controls or resources',
      ],
    });
  }

  // Pattern 2: Department risk concentration
  const deptRiskCounts: Record<number, number> = {};
  risks.forEach(r => {
    if (r.department_id) {
      deptRiskCounts[r.department_id] = (deptRiskCounts[r.department_id] || 0) + 1;
    }
  });
  
  const maxDeptRisks = Math.max(...Object.values(deptRiskCounts));
  const avgRisksPerDept = risks.length / Object.keys(deptRiskCounts).length;
  
  if (maxDeptRisks > avgRisksPerDept * 2) {
    const highRiskDeptId = Object.entries(deptRiskCounts).find(([, count]) => count === maxDeptRisks)?.[0];
    patterns.push({
      type: 'trend',
      severity: 'warning',
      title: 'Department Risk Concentration',
      description: `Department ${highRiskDeptId} has ${maxDeptRisks} risks, significantly above average (${avgRisksPerDept.toFixed(1)}).`,
      recommendations: [
        'Conduct department-specific risk assessment',
        'Review departmental controls and processes',
      ],
    });
  }

  // Pattern 3: Open risks without action plans
  const openRisks = risks.filter(r => r.status === 'Open' || r.status === 'In Progress');
  if (openRisks.length > risks.length * 0.6) {
    patterns.push({
      type: 'trend',
      severity: 'warning',
      title: 'High Open Risk Ratio',
      description: `${openRisks.length} risks (${((openRisks.length / risks.length) * 100).toFixed(0)}%) are still open or in progress.`,
      recommendations: [
        'Review risk closure process',
        'Allocate more resources to risk treatment',
      ],
    });
  }

  if (patterns.length === 0) {
    patterns.push({
      type: 'info' as const,
      severity: 'info',
      title: 'Risk Profile Healthy',
      description: 'No concerning patterns detected in your risk register.',
    });
  }

  return patterns;
}

// Detect incident patterns
export function detectIncidentPatterns(): PatternResult[] {
  const incidents = getCollection('incident.incidents') as IncidentRecord[];
  const patterns: PatternResult[] = [];

  if (!incidents || incidents.length === 0) {
    return [{
      type: 'info' as const,
      severity: 'info',
      title: 'No Incident Data',
      description: 'No incidents found in the system to analyze.',
    }];
  }

  // Pattern 1: Recurring incident types
  const typeCounts: Record<number, number> = {};
  incidents.forEach(i => {
    if (i.incident_type_id) {
      typeCounts[i.incident_type_id] = (typeCounts[i.incident_type_id] || 0) + 1;
    }
  });
  
  const recurringTypes = Object.entries(typeCounts).filter(([, count]) => count >= 2);
  if (recurringTypes.length > 0) {
    const mostCommonType = recurringTypes.sort((a, b) => b[1] - a[1])[0];
    patterns.push({
      type: 'trend',
      severity: 'warning',
      title: 'Recurring Incident Type Detected',
      description: `Incident type ${mostCommonType[0]} has occurred ${mostCommonType[1]} times. This may indicate a systemic issue.`,
      recommendations: [
        'Investigate root cause of recurring incidents',
        'Review related controls and procedures',
        'Consider additional training or awareness programs',
      ],
    });
  }

  // Pattern 2: High severity incidents
  const criticalIncidents = incidents.filter(i => i.severity_level_id === 1 || i.severity_level_id === 2);
  if (criticalIncidents.length >= 2) {
    patterns.push({
      type: 'anomaly',
      severity: 'critical',
      title: 'Multiple High-Severity Incidents',
      description: `${criticalIncidents.length} critical or high-severity incidents detected.`,
      recommendations: [
        'Immediate management review required',
        'Activate incident response procedures',
        'Document lessons learned',
      ],
    });
  }

  // Pattern 3: Open incidents aging
  const openIncidents = incidents.filter(i => i.status === 'Open' || i.status === 'In Progress');
  if (openIncidents.length > 0) {
    patterns.push({
      type: 'info' as const,
      severity: openIncidents.length > 3 ? 'warning' : 'info',
      title: 'Open Incidents',
      description: `${openIncidents.length} incident(s) are currently open and require attention.`,
      recommendations: openIncidents.length > 3 ? [
        'Review incident resolution process',
        'Ensure adequate resources for incident handling',
      ] : undefined,
    });
  }

  if (patterns.length === 0) {
    patterns.push({
      type: 'info' as const,
      severity: 'info',
      title: 'Incident Profile Stable',
      description: 'No concerning patterns detected in incident data.',
    });
  }

  return patterns;
}

// Simple KPI forecasting based on trend
export function forecastKPIs(): PatternResult[] {
  const patterns: PatternResult[] = [];

  // Since we don't have historical KPI data, provide guidance
  patterns.push({
    type: 'prediction',
    severity: 'info',
    title: 'KPI Trend Analysis',
    description: 'Based on current risk and incident data, here are projected trends.',
    data: {
      riskTrend: detectRiskPatterns().some(p => p.severity === 'critical') ? 'increasing' : 'stable',
      incidentTrend: detectIncidentPatterns().some(p => p.severity === 'critical') ? 'increasing' : 'stable',
    },
    recommendations: [
      'Continue monitoring key metrics',
      'Set up automated alerts for threshold breaches',
      'Schedule quarterly trend reviews',
    ],
  });

  return patterns;
}

// Get all patterns summary
export function getAllPatterns(): {
  risks: PatternResult[];
  incidents: PatternResult[];
  forecasts: PatternResult[];
  summary: string;
} {
  const risks = detectRiskPatterns();
  const incidents = detectIncidentPatterns();
  const forecasts = forecastKPIs();

  const criticalCount = [...risks, ...incidents, ...forecasts].filter(p => p.severity === 'critical').length;
  const warningCount = [...risks, ...incidents, ...forecasts].filter(p => p.severity === 'warning').length;

  let summary = '';
  if (criticalCount > 0) {
    summary = `⚠️ ${criticalCount} critical pattern(s) detected requiring immediate attention.`;
  } else if (warningCount > 0) {
    summary = `📊 ${warningCount} pattern(s) detected that may need review.`;
  } else {
    summary = '✅ No concerning patterns detected. Systems operating normally.';
  }

  return { risks, incidents, forecasts, summary };
}

const patternDetection = { detectRiskPatterns, detectIncidentPatterns, forecastKPIs, getAllPatterns };
export default patternDetection;
