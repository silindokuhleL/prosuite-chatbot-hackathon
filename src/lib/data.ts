// ============================================
// ProSuite Data Layer
// Centralized data access with type safety
// ============================================

import type { ProSuiteData, User, Department, Module, Risk, Asset, Incident, AuditEngagement, CompliancePackage, GovernancePolicy, BusinessObjective, StatusEntity, RatingLevel } from '@/types';
import rawData from '@/data/prosuite-data.json';

// Type assertion for the imported JSON
const data = rawData as ProSuiteData;

// ============================================
// Core Data Access
// ============================================

export const getData = (): ProSuiteData => data;

export const getMetadata = () => data.metadata;

export const getTenant = (id: number = 1) => 
  data.core.tenants.find(t => t.id === id);

export const getUsers = (): User[] => data.core.users;

export const getUser = (id: number): User | undefined => 
  data.core.users.find(u => u.id === id);

export const getDepartments = (): Department[] => data.core.departments;

export const getDepartment = (id: number): Department | undefined => 
  data.core.departments.find(d => d.id === id);

export const getModules = (): Module[] => data.core.modules;

export const getModule = (slug: string): Module | undefined => 
  data.core.modules.find(m => m.slug === slug);

export const getEnabledModules = (): Module[] => 
  data.core.modules.filter(m => m.is_disable === 0);

export const getSites = () => data.core.sites;

export const getLocations = () => data.core.locations;

export const getPriorityLevels = () => data.core.priority_levels;

// ============================================
// Risk Module Data Access
// ============================================

export const getRisks = (): Risk[] => data.risk.risks;

export const getRisk = (id: number): Risk | undefined => 
  data.risk.risks.find(r => r.id === id);

export const getRisksByDepartment = (departmentId: number): Risk[] => 
  data.risk.risks.filter(r => r.department_id === departmentId);

export const getRisksByOwner = (ownerId: number): Risk[] => 
  data.risk.risks.filter(r => r.owner_id === ownerId);

export const getRiskCategories = () => data.risk.risk_categories;

export const getRiskCategory = (id: number) => 
  data.risk.risk_categories.find(c => c.id === id);

export const getRiskSubCategories = () => data.risk.risk_sub_categories;

export const getRiskTypes = () => data.risk.risk_types;

export const getRiskAges = () => data.risk.risk_ages;

export const getRiskOrigins = () => data.risk.risk_origins;

export const getRiskApproaches = () => data.risk.risk_approaches;

export const getRiskImpactLevels = () => data.risk.risk_impact_rating_levels;

export const getRiskLikelihoodLevels = () => data.risk.risk_likelihood_rating_levels;

export const getRiskInherentSettings = () => data.risk.risk_inherent_settings;

export const getRiskActionPlanStatuses = () => data.risk.risk_action_plan_statuses;

export const getRiskActionPlans = () => data.risk.risk_action_plans;

export const getRiskActionPlansByRisk = (riskId: number) => 
  data.risk.risk_action_plans.filter(ap => ap.risk_id === riskId);

export const getRiskCauses = () => data.risk.risk_causes;

export const getRiskCausesByRisk = (riskId: number) => 
  data.risk.risk_causes.filter(c => c.risk_id === riskId);

export const getRiskConsequences = () => data.risk.risk_consequences;

export const getRiskConsequencesByRisk = (riskId: number) => 
  data.risk.risk_consequences.filter(c => c.risk_id === riskId);

export const getRiskMonitoringPlans = () => data.risk.risk_monitoring_plans;

export const getRiskAssessments = () => data.risk.risk_assessments;

export const getControls = () => data.risk.controls;

export const getControl = (id: number) => 
  data.risk.controls.find(c => c.id === id);

export const getRiskControlMappings = () => data.risk.risk_control_mappings;

export const getControlsByRisk = (riskId: number) => {
  const mappings = data.risk.risk_control_mappings.filter(m => m.risk_id === riskId);
  return mappings.map(m => data.risk.controls.find(c => c.id === m.control_id)).filter(Boolean);
};

export const getRiskReports = () => data.risk.risk_reports;

// ============================================
// Asset Module Data Access
// ============================================

export const getAssets = (): Asset[] => data.asset.assets;

export const getAsset = (id: number): Asset | undefined => 
  data.asset.assets.find(a => a.id === id);

export const getAssetsByCategory = (categoryId: number): Asset[] => 
  data.asset.assets.filter(a => a.category_id === categoryId);

export const getAssetsByDepartment = (departmentId: number): Asset[] => 
  data.asset.assets.filter(a => a.department_id === departmentId);

export const getAssetCategories = () => data.asset.categories;

export const getAssetStatuses = () => data.asset.asset_statuses;

export const getDepreciationMethods = () => data.asset.depreciation_methods;

export const getVehicleMakes = () => data.asset.vehicle_makes;

export const getAssetReports = () => data.asset.asset_reports;

// ============================================
// Incident Module Data Access
// ============================================

export const getIncidents = (): Incident[] => data.incident.incidents;

export const getIncident = (id: number): Incident | undefined => 
  data.incident.incidents.find(i => i.id === id);

export const getIncidentsByStatus = (statusId: number): Incident[] => 
  data.incident.incidents.filter(i => i.status_id === statusId);

export const getIncidentTypes = () => data.incident.incident_types;

export const getIncidentStatuses = () => data.incident.incident_statuses;

export const getIncidentCategories = () => data.incident.incident_categories;

export const getIncidentSeverityLevels = () => data.incident.incident_severity_levels;

export const getIncidentPriorityLevels = () => data.incident.incident_priority_levels;

export const getIncidentTasks = () => data.incident.incident_tasks;

export const getIncidentTasksByIncident = (incidentId: number) => 
  data.incident.incident_tasks.filter(t => t.incident_id === incidentId);

export const getIncidentTaskStatuses = () => data.incident.incident_task_statuses;

export const getKnowledgeBaseSolutions = () => data.incident.knowledge_base_solutions;

export const getIncidentReports = () => data.incident.incident_reports;

// ============================================
// Audit Module Data Access
// ============================================

export const getAuditEngagements = (): AuditEngagement[] => data.audit.audit_engagements;

export const getAuditEngagement = (id: number): AuditEngagement | undefined => 
  data.audit.audit_engagements.find(e => e.id === id);

export const getAuditUniverseCategories = () => data.audit.audit_universe_categories;

export const getAuditUniverseRiskRatings = () => data.audit.audit_universe_risk_ratings;

export const getAuditUniverseAuditCycles = () => data.audit.audit_universe_audit_cycles;

export const getAuditEngagementStatuses = () => data.audit.audit_engagement_statuses;

export const getAuditFindingStatuses = () => data.audit.audit_finding_statuses;

export const getAuditFindingRiskRatings = () => data.audit.audit_finding_risk_ratings;

export const getAuditWorkpaperTypes = () => data.audit.audit_workpaper_types;

export const getAuditWorkpaperStatuses = () => data.audit.audit_workpaper_statuses;

export const getAuditUniverseItems = () => data.audit.audit_universe_items;

export const getAnnualAuditPlans = () => data.audit.annual_audit_plans;

export const getAuditFindings = () => data.audit.audit_findings;

export const getAuditFindingsByEngagement = (engagementId: number) => 
  data.audit.audit_findings.filter(f => f.engagement_id === engagementId);

export const getAuditWorkpapers = () => data.audit.audit_workpapers;

export const getAuditWorkpapersByEngagement = (engagementId: number) => 
  data.audit.audit_workpapers.filter(w => w.engagement_id === engagementId);

export const getAuditReports = () => data.audit.comprehensive_audit_reports;

// ============================================
// Compliance Module Data Access
// ============================================

export const getCompliancePackages = (): CompliancePackage[] => data.compliance.compliance_packages;

export const getCompliancePackage = (id: number): CompliancePackage | undefined => 
  data.compliance.compliance_packages.find(p => p.id === id);

export const getRegulationStandards = () => data.compliance.regulations_standards;

export const getCompliancePackageStatuses = () => data.compliance.compliance_package_statuses;

export const getComplianceAssessmentStatuses = () => data.compliance.compliance_assessment_statuses;

export const getCompliancePackageItems = () => data.compliance.compliance_package_items;

export const getCompliancePackageItemsByPackage = (packageId: number) => 
  data.compliance.compliance_package_items.filter(i => i.package_id === packageId);

export const getComplianceAssessments = () => data.compliance.compliance_assessments;

export const getTrainingCampaigns = () => data.compliance.training_campaigns;

export const getComplianceReports = () => data.compliance.compliance_reports;

// ============================================
// Governance Module Data Access
// ============================================

export const getGovernancePolicies = (): GovernancePolicy[] => data.governance.governance_policies;

export const getGovernancePolicy = (id: number): GovernancePolicy | undefined => 
  data.governance.governance_policies.find(p => p.id === id);

export const getPolicyCategories = () => data.governance.policy_categories;

export const getGovernancePolicyStatuses = () => data.governance.governance_policy_statuses;

export const getCommitteeTypes = () => data.governance.committee_types;

export const getGovernanceCommitteeStatuses = () => data.governance.governance_committee_statuses;

export const getGovernanceCommittees = () => data.governance.governance_committees;

export const getDelegationStatuses = () => data.governance.delegation_statuses;

export const getDelegationsOfAuthority = () => data.governance.delegations_of_authority;

export const getBusinessContinuityStatuses = () => data.governance.business_continuity_statuses;

export const getBusinessContinuityPlans = () => data.governance.business_continuity_plans;

export const getConflictStatuses = () => data.governance.conflict_statuses;

export const getConflictsOfInterest = () => data.governance.conflict_of_interests;

export const getBusinessObjectiveStatuses = () => data.governance.business_objective_statuses;

export const getBusinessObjectives = (): BusinessObjective[] => data.governance.business_objectives;

export const getBusinessObjective = (id: number): BusinessObjective | undefined => 
  data.governance.business_objectives.find(o => o.id === id);

export const getGovernanceReports = () => data.governance.governance_reports;

// ============================================
// Performance Module Data Access
// ============================================

export const getPerformanceReports = () => data.performance.performance_reports;

// ============================================
// System Data Access
// ============================================

export const getTasks = () => data.system.tasks;

export const getTasksByModule = (module: string) => 
  data.system.tasks.filter(t => t.module === module);

export const getTaskSubtasks = () => data.system.task_subtasks;

export const getLicenses = () => data.system.licenses;

export const getPartners = () => data.system.partners;

export const getMedia = () => data.system.media;

export const getJobs = () => data.system.jobs;

export const getFailedJobs = () => data.system.failed_jobs;

// ============================================
// Utility Functions
// ============================================

export const findStatusById = <T extends StatusEntity>(statuses: T[], id: number): T | undefined => 
  statuses.find(s => s.id === id);

export const findRatingById = <T extends RatingLevel>(ratings: T[], id: number): T | undefined => 
  ratings.find(r => r.id === id);

export const getRiskScoreColor = (score: number): string => {
  const setting = data.risk.risk_inherent_settings.find(
    s => score >= s.min_score && score <= s.max_score
  );
  return setting?.color || '#6b7280';
};

export const getRiskScoreLabel = (score: number): string => {
  const setting = data.risk.risk_inherent_settings.find(
    s => score >= s.min_score && score <= s.max_score
  );
  return setting?.name || 'Unknown';
};

// ============================================
// Dashboard Metrics
// ============================================

export interface DashboardMetrics {
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  totalAssets: number;
  activeAssets: number;
  openIncidents: number;
  criticalIncidents: number;
  activeAudits: number;
  complianceScore: number;
  activePolicies: number;
  activeObjectives: number;
}

export const getDashboardMetrics = (): DashboardMetrics => {
  const risks = getRisks();
  const assets = getAssets();
  const incidents = getIncidents();
  const audits = getAuditEngagements();
  const packages = getCompliancePackages();
  const policies = getGovernancePolicies();
  const objectives = getBusinessObjectives();

  const criticalRisks = risks.filter(r => r.inherit_risk_score >= 20).length;
  const highRisks = risks.filter(r => r.inherit_risk_score >= 13 && r.inherit_risk_score < 20).length;
  const activeAssets = assets.filter(a => a.assetStatus_id === 1).length;
  const openIncidents = incidents.filter(i => i.status_id !== 4).length;
  const criticalIncidents = incidents.filter(i => i.severity_level_id === 1).length;
  const activeAudits = audits.filter(a => a.status_id !== 4).length;
  const avgComplianceScore = packages.reduce((acc, p) => acc + p.compliance_score, 0) / packages.length;
  const activePolicies = policies.filter(p => p.policy_status_id === 3).length;
  const activeObjectives = objectives.filter(o => o.status_id === 2 || o.status_id === 3).length;

  return {
    totalRisks: risks.length,
    criticalRisks,
    highRisks,
    totalAssets: assets.length,
    activeAssets,
    openIncidents,
    criticalIncidents,
    activeAudits,
    complianceScore: Math.round(avgComplianceScore * 10) / 10,
    activePolicies,
    activeObjectives,
  };
};
