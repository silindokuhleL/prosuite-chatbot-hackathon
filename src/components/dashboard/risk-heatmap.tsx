'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRisks, getRiskImpactLevels, getRiskLikelihoodLevels, getRiskInherentSettings } from '@/lib/data';

export function RiskHeatmap() {
  const risks = getRisks();
  const impactLevels = getRiskImpactLevels();
  const likelihoodLevels = getRiskLikelihoodLevels();
  const inherentSettings = getRiskInherentSettings();

  const getHeatmapColor = (impact: number, likelihood: number): string => {
    const score = impact * likelihood;
    const setting = inherentSettings.find(
      s => score >= s.min_score && score <= s.max_score
    );
    return setting?.color || '#e5e7eb';
  };

  const getRiskCount = (impactId: number, likelihoodId: number): number => {
    return risks.filter(
      r => r.impact_rating_id === impactId && r.likelihood_rating_id === likelihoodId
    ).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Risk Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            <div className="mb-2 flex items-end justify-center">
              <span className="text-xs font-medium text-muted-foreground">Impact →</span>
            </div>
            
            <div className="flex">
              <div className="flex w-20 flex-col items-center justify-center">
                <span className="rotate-180 text-xs font-medium text-muted-foreground [writing-mode:vertical-lr]">
                  Likelihood →
                </span>
              </div>
              
              <div className="flex-1">
                <div className="mb-1 grid grid-cols-5 gap-1">
                  {impactLevels.map(level => (
                    <div 
                      key={level.id} 
                      className="text-center text-xs text-muted-foreground"
                    >
                      {level.name}
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  {[...likelihoodLevels].reverse().map(likelihood => (
                    <div key={likelihood.id} className="flex items-center gap-1">
                      <div className="w-20 text-right text-xs text-muted-foreground pr-2">
                        {likelihood.name}
                      </div>
                      <div className="grid flex-1 grid-cols-5 gap-1">
                        {impactLevels.map(impact => {
                          const count = getRiskCount(impact.id, likelihood.id);
                          const color = getHeatmapColor(impact.value!, likelihood.value!);
                          return (
                            <div
                              key={`${impact.id}-${likelihood.id}`}
                              className="flex h-10 items-center justify-center rounded text-xs font-medium text-white"
                              style={{ backgroundColor: color }}
                              title={`Impact: ${impact.name}, Likelihood: ${likelihood.name}`}
                            >
                              {count > 0 ? count : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              {inherentSettings.map(setting => (
                <div key={setting.id} className="flex items-center gap-1.5">
                  <div 
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: setting.color }}
                  />
                  <span className="text-xs text-muted-foreground">{setting.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
