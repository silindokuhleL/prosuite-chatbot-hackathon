'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { 
  getUser, 
  getDepartment, 
  getRiskCategory, 
  getRiskSubCategories,
  getRiskTypes,
  getRiskOrigins,
  getRiskApproaches,
  getRiskActionPlansByRisk,
  getRiskActionPlanStatuses,
  getControlsByRisk,
  getRiskScoreColor, 
  getRiskScoreLabel,
  getRiskImpactLevels,
  getRiskLikelihoodLevels,
} from '@/lib/data';
import type { Risk } from '@/types';

interface RiskDetailProps {
  risk: Risk;
}

export function RiskDetail({ risk }: RiskDetailProps) {
  const owner = getUser(risk.owner_id);
  const department = getDepartment(risk.department_id);
  const category = getRiskCategory(risk.category_id);
  const subCategories = getRiskSubCategories();
  const subCategory = subCategories.find(sc => sc.id === risk.sub_category_id);
  const riskTypes = getRiskTypes();
  const riskType = riskTypes.find(rt => rt.id === risk.risk_type_id);
  const origins = getRiskOrigins();
  const origin = origins.find(o => o.id === risk.origin_id);
  const approaches = getRiskApproaches();
  const approach = approaches.find(a => a.id === risk.approach_id);
  const actionPlans = getRiskActionPlansByRisk(risk.id);
  const actionPlanStatuses = getRiskActionPlanStatuses();
  const controls = getControlsByRisk(risk.id);
  const impactLevels = getRiskImpactLevels();
  const likelihoodLevels = getRiskLikelihoodLevels();
  const impactLevel = impactLevels.find(l => l.id === risk.impact_rating_id);
  const likelihoodLevel = likelihoodLevels.find(l => l.id === risk.likelihood_rating_id);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Risk Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="mt-1 text-sm">{risk.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                <p className="mt-1 text-sm">{category?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Sub-Category</h4>
                <p className="mt-1 text-sm">{subCategory?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Risk Type</h4>
                <p className="mt-1 text-sm">{riskType?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Origin</h4>
                <p className="mt-1 text-sm">{origin?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                <p className="mt-1 text-sm">{department?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                <p className="mt-1 text-sm">{owner?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Treatment Approach</h4>
                <p className="mt-1 text-sm">{approach?.name || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Identification Date</h4>
                <p className="mt-1 text-sm">{risk.identification_date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Inherent Risk Score</p>
              <p 
                className="mt-1 text-4xl font-bold"
                style={{ color: getRiskScoreColor(risk.inherit_risk_score) }}
              >
                {risk.inherit_risk_score}
              </p>
              <Badge 
                color={getRiskScoreColor(risk.inherit_risk_score)} 
                className="mt-2"
              >
                {getRiskScoreLabel(risk.inherit_risk_score)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Impact</p>
                <StatusBadge 
                  status={impactLevel?.name || '-'} 
                  color={impactLevel?.color || '#6b7280'} 
                />
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Likelihood</p>
                <StatusBadge 
                  status={likelihoodLevel?.name || '-'} 
                  color={likelihoodLevel?.color || '#6b7280'} 
                />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Residual Risk Score</p>
              <p 
                className="mt-1 text-2xl font-bold"
                style={{ color: getRiskScoreColor(risk.residual_score) }}
              >
                {risk.residual_score}
              </p>
              <Badge 
                color={getRiskScoreColor(risk.residual_score)} 
                className="mt-2"
              >
                {getRiskScoreLabel(risk.residual_score)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {risk.causes.map((cause, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  {cause}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Consequences</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {risk.consequences.map((consequence, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {consequence}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls ({controls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {controls.length === 0 ? (
            <p className="text-sm text-muted-foreground">No controls assigned</p>
          ) : (
            <div className="space-y-3">
              {controls.map((control) => control && (
                <div 
                  key={control.id} 
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{control.name}</p>
                    <p className="text-sm text-muted-foreground">{control.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Effectiveness</p>
                    <Badge 
                      color={control.effectiveness >= 75 ? '#22c55e' : control.effectiveness >= 50 ? '#eab308' : '#dc2626'}
                    >
                      {control.effectiveness}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Action Plans ({actionPlans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {actionPlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No action plans created</p>
          ) : (
            <div className="space-y-3">
              {actionPlans.map((plan) => {
                const status = actionPlanStatuses.find(s => s.id === plan.status_id);
                const planOwner = getUser(plan.owner_id);
                return (
                  <div 
                    key={plan.id} 
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">{plan.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Owner: {planOwner?.name || '-'} | Due: {plan.due_date}
                      </p>
                    </div>
                    <StatusBadge 
                      status={status?.name || '-'} 
                      color={status?.color || '#6b7280'} 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
