// AI Chat API Route
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prosuiteData from '@/data/prosuite-data.json';

// Validate API key exists
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey || '',
});

// Build data context for AI from JSON
function buildDataContext(module?: string) {
  const data = prosuiteData as Record<string, unknown>;
  
  // Extract key data for AI context
  const risks = (data.risk as Record<string, unknown>)?.risks as unknown[] || [];
  const assets = (data.asset as Record<string, unknown>)?.assets as unknown[] || [];
  const incidents = (data.incident as Record<string, unknown>)?.incidents as unknown[] || [];
  const auditFindings = (data.audit as Record<string, unknown>)?.audit_findings as unknown[] || [];
  const compliancePackages = (data.compliance as Record<string, unknown>)?.compliance_packages as unknown[] || [];
  const policies = (data.governance as Record<string, unknown>)?.governance_policies as unknown[] || [];
  const users = (data.core as Record<string, unknown>)?.users as unknown[] || [];
  const departments = (data.core as Record<string, unknown>)?.departments as unknown[] || [];

  // Calculate summary metrics
  const totalAssetValue = assets.reduce((sum: number, a) => sum + ((a as Record<string, unknown>).cost as number || 0), 0);
  
  // Format data for prompt
  let contextData = `
## LIVE PROSUITE DATA (use this to answer questions)

### Summary Metrics
- Total Risks: ${risks.length}
- Total Assets: ${assets.length} (Total Value: R ${totalAssetValue.toLocaleString()})
- Active Incidents: ${incidents.length}
- Audit Findings: ${auditFindings.length}
- Compliance Packages: ${compliancePackages.length}
- Policies: ${policies.length}

### Users
${users.map((u: unknown) => {
  const user = u as Record<string, unknown>;
  return `- ${user.name} (ID: ${user.id}, Email: ${user.email})`;
}).join('\n')}

### Departments
${departments.map((d: unknown) => {
  const dept = d as Record<string, unknown>;
  return `- ${dept.name} (ID: ${dept.id})`;
}).join('\n')}
`;

  // Add module-specific detailed data
  if (!module || module === 'asset') {
    contextData += `
### Asset Details
| ID | Description | Asset Tag | Category | Cost | Status | Location |
|----|-------------|-----------|----------|------|--------|----------|
${assets.slice(0, 15).map((a: unknown) => {
  const asset = a as Record<string, unknown>;
  return `| ${asset.id} | ${asset.description} | ${asset.assetTag} | ${asset.category_name} | R ${(asset.cost as number)?.toLocaleString()} | ${asset.assetStatus_name} | ${asset.site_name} |`;
}).join('\n')}
`;
  }

  if (!module || module === 'risk') {
    contextData += `
### Risk Details
| ID | Title | Category | Priority | Status | Owner |
|----|-------|----------|----------|--------|-------|
${risks.slice(0, 15).map((r: unknown) => {
  const risk = r as Record<string, unknown>;
  return `| ${risk.id} | ${risk.title} | ${risk.category_id} | ${risk.priority_id} | ${risk.is_archived ? 'Archived' : 'Active'} | User ${risk.owner_id} |`;
}).join('\n')}
`;
  }

  if (!module || module === 'incident') {
    contextData += `
### Incident Details
| ID | Title | Type | Severity | Status | Assigned To |
|----|-------|------|----------|--------|-------------|
${incidents.slice(0, 15).map((i: unknown) => {
  const incident = i as Record<string, unknown>;
  return `| ${incident.id} | ${incident.title} | ${incident.type_id} | ${incident.severity_level_id} | ${incident.status_id} | User ${incident.assignee_id} |`;
}).join('\n')}
`;
  }

  if (!module || module === 'compliance') {
    contextData += `
### Compliance Packages
| ID | Name | Score | Total Reqs | Completed | Overdue | Status |
|----|------|-------|------------|-----------|---------|--------|
${compliancePackages.slice(0, 10).map((c: unknown) => {
  const pkg = c as Record<string, unknown>;
  return `| ${pkg.id} | ${pkg.name} | ${pkg.compliance_score}% | ${pkg.total_requirements} | ${pkg.completed_requirements} | ${pkg.overdue_requirements} | ${pkg.compliance_package_status_id} |`;
}).join('\n')}
`;
  }

  if (!module || module === 'governance') {
    contextData += `
### Policies
| ID | Title | Version | Status | Owner | Review Date |
|----|-------|---------|--------|-------|-------------|
${policies.slice(0, 10).map((p: unknown) => {
  const policy = p as Record<string, unknown>;
  return `| ${policy.id} | ${policy.title} | ${policy.version} | ${policy.policy_status_id} | User ${policy.owner_id} | ${policy.next_review_date} |`;
}).join('\n')}
`;
  }

  if (!module || module === 'audit') {
    contextData += `
### Audit Findings
| ID | Title | Engagement | Risk Rating | Status | Due Date |
|----|-------|------------|-------------|--------|----------|
${auditFindings.slice(0, 10).map((f: unknown) => {
  const finding = f as Record<string, unknown>;
  return `| ${finding.id} | ${finding.title} | ${finding.engagement_id} | ${finding.risk_rating_id} | ${finding.status_id} | ${finding.due_date} |`;
}).join('\n')}
`;
  }

  return contextData;
}

const SYSTEM_PROMPT = `You are Mazwi, an intelligent enterprise GRC (Governance, Risk, and Compliance) assistant.

## Your Identity
- Name: Mazwi
- Role: Enterprise GRC Analyst & Advisor
- Expertise: Risk, Compliance, Audit, Governance, Asset, Incident, and Performance Management

## Core Capabilities
1. **Analysis**: Deep understanding of GRC data, trends, and relationships
2. **Insights**: Cross-module intelligence connecting risks, incidents, controls, and compliance
3. **Actions**: Can create, update, and manage GRC records (with user approval)
4. **Search**: Can search across all modules and external sources
5. **Reports**: Generate summaries, analyses, and recommendations

## CRITICAL: Response Format & Visualization Triggers

When responding, include specific KEYWORDS that trigger automatic chart rendering:

### VISUALIZATION TRIGGERS (use these exact phrases):
- Say "heatmap" when showing risk matrix → triggers visual Risk Heatmap
- Say "bar chart" or "by category" → triggers Bar Chart
- Say "pie chart" or "distribution" or "breakdown" → triggers Pie Chart  
- Say "trend" or "over time" → triggers Line Chart
- Say "metrics" or "KPI summary" → triggers Metric Cards
- Say "progress" or "completion rate" → triggers Progress Bars

### Example Responses:

**For Risk Heatmap request:**
"Here's the risk heatmap showing impact vs likelihood distribution across your organization. The heatmap displays [X] total risks with [Y] in critical zones requiring immediate attention."

**For Asset Distribution:**
"Here's a bar chart showing assets by category. You have [X] total assets distributed across [categories]."

**For Incident Breakdown:**
"The pie chart below shows incident distribution by severity. Critical incidents make up [X]% of total."

**For Trend Analysis:**
"Here's the trend over time for the past 6 months showing risk and incident patterns."

**For Summary/Dashboard:**
"Here are the key metrics for your GRC overview..."

### Data Table Format (for lists):
| ID | Name | Status | Priority | Owner |
|----|------|--------|----------|-------|
| R-001 | Data Breach Risk | Open | Critical | John Smith |

### Keep responses conversational but include trigger keywords naturally.

## Safety Rules
- NEVER expose sensitive data inappropriately
- ALWAYS require approval for create/update/delete operations
- Flag potential compliance or security concerns

Be concise but thorough. Use emojis sparingly for status indicators (🔴🟠🟡🟢✅❌⚠️).`;

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { messages, module, context } = await request.json();

    // Build data context from JSON - THIS IS THE KEY FIX
    const dataContext = buildDataContext(module);
    const moduleInfo = module ? `\n\nCurrent Module: ${module}\nAdditional Context: ${JSON.stringify(context || {})}` : '';
    const fullSystemPrompt = SYSTEM_PROMPT + dataContext + moduleInfo;

    // Use gpt-4o-mini as default (gpt-5-mini doesn't exist)
    const model = process.env.OPENAI_MODEL === 'gpt-5-mini' ? 'gpt-4o-mini' : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
    
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: fullSystemPrompt },
        ...messages,
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      stream: true,
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process chat request', details: errorMessage },
      { status: 500 }
    );
  }
}
