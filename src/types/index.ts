// ============================================
// ProSuite Core Type Definitions
// Production-grade type system for GRC platform
// ============================================

// Base Types
export interface BaseEntity {
  id: number;
  tenant_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StatusEntity {
  id: number;
  name: string;
  color: string;
}

export interface RatingLevel {
  id: number;
  name: string;
  value?: number;
  level?: number;
  color: string;
}

// ============================================
// Metadata
// ============================================
export interface Metadata {
  version: string;
  generated_at: string;
  description: string;
  tenant_id: number;
}

// ============================================
// System
// ============================================
export interface CacheEntry {
  key: string;
  value: string;
  expiration: number;
}

export interface Job {
  id: number;
  queue: string;
  payload: string;
  attempts: number;
}

export interface FailedJob {
  id: number;
  uuid: string;
  queue: string;
  exception: string;
  failed_at: string;
}

export interface License {
  id: number;
  name: string;
  slug: string;
  default_users: number;
}

export interface Partner {
  id: number;
  partner_name: string;
  partner_code: string;
  contact_email: string;
  is_active: number;
}

export interface Media {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  file_name: string;
  mime_type: string;
}

export interface Task extends BaseEntity {
  title: string;
  priority: string;
  status: string;
  module: string;
  assignee_id: number;
}

export interface TaskSubtask {
  id: number;
  task_id: number;
  title: string;
  completed: number;
}

// ============================================
// Core
// ============================================
export interface Tenant extends BaseEntity {
  tenant_name: string;
  tenant_code: string;
  email: string;
  partner_id: number;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
}

export interface Department extends BaseEntity {
  name: string;
}

export interface Module {
  id: number;
  slug: string;
  name: string;
  alias_name: string;
  is_disable: number;
}

export interface Site extends BaseEntity {
  name: string;
  code: string;
  city: string;
}

export interface Location extends BaseEntity {
  name: string;
  site_id: number;
  floor: string;
}

export type PriorityLevel = RatingLevel;

// ============================================
// Risk Management
// ============================================
export interface RiskCategory extends BaseEntity {
  name: string;
}

export interface RiskSubCategory extends BaseEntity {
  name: string;
  category_id: number;
}

export interface RiskType {
  id: number;
  name: string;
  prefix: string;
}

export interface RiskAge {
  id: number;
  name: string;
}

export interface RiskOrigin {
  id: number;
  name: string;
}

export interface RiskApproach {
  id: number;
  name: string;
}

export interface RiskInherentSetting {
  id: number;
  name: string;
  min_score: number;
  max_score: number;
  color: string;
}

export interface Risk extends BaseEntity {
  title: string;
  description: string;
  risk_number: string;
  risk_type_id: number;
  department_id: number;
  owner_id: number;
  category_id: number;
  sub_category_id: number | null;
  origin_id: number;
  association_id: number | null;
  risk_age_id: number;
  key_performance_area_id: number | null;
  industry_id: number | null;
  objective_id: number | null;
  identification_date: string;
  causes: string[];
  consequences: string[];
  impact_rating_id: number;
  likelihood_rating_id: number;
  inherit_risk_score: number;
  priority_id: number;
  approach_id: number;
  monitoring_frequency_id: number;
  residual_score: number;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: number | null;
}

export interface RiskCause extends BaseEntity {
  risk_id: number;
  description: string;
}

export interface RiskConsequence extends BaseEntity {
  risk_id: number;
  description: string;
}

export interface RiskActionPlan extends BaseEntity {
  description: string;
  risk_id: number;
  risk_causes_id: number;
  status_id: number;
  owner_id: number;
  due_date: string;
}

export interface RiskMonitoringPlan extends BaseEntity {
  title: string;
  risk_id: number;
  monitoring_frequency_id: number;
  owner_id: number;
  next_date: string;
}

export interface RiskAssessment extends BaseEntity {
  risk_id: number;
  name: string;
  impact_rating_id: number;
  likelihood_rating_id: number;
  assessor_id: number;
  date: string;
  inherent_rating_score: number;
}

export interface Control extends BaseEntity {
  name: string;
  description: string;
  owner_id: number;
  effectiveness: number;
}

export interface RiskControlMapping extends BaseEntity {
  risk_id: number;
  control_id: number;
}

export interface RiskReport extends BaseEntity {
  name: string;
  type: string;
  status: string;
  is_default: boolean;
  ai_enabled?: boolean;
}

// ============================================
// Asset Management
// ============================================
export interface AssetCategory extends BaseEntity {
  name: string;
}

export type AssetStatus = StatusEntity;

export interface DepreciationMethod {
  id: number;
  name: string;
}

export interface Asset extends BaseEntity {
  description: string;
  assetTag: string;
  serialNumber: string | null;
  purchaseOrderNumber: string;
  invoiceNumber: string;
  serviceProvider: string;
  brand: string;
  cost: number;
  purchaseDate: string;
  condition: string;
  depreciationRate?: number;
  assetLife?: number;
  residualValue?: number;
  entity_model: string;
  warrantyPeriod?: number;
  warrantyExpiration?: string;
  category_id: number;
  category_name: string;
  department_id: number;
  department_name: string;
  site_id: number;
  site_name: string;
  location_id: number;
  location_name: string;
  assetStatus_id: number;
  assetStatus_name: string;
  isDepreciable: boolean;
  depreciationMethod_id?: number;
  depreciationMethod_name?: string;
  // Software specific
  licenseType?: string | null;
  supplier?: string;
  licenseKey?: string;
  numberOfSeats?: number;
  renewalDate?: string;
  supportContact?: string;
  // Vehicle specific
  vehicle_make_id?: number;
  vehicle_make_name?: string;
  vin?: string;
  licensePlate?: string;
  servicePlanPeriod?: number;
  dueForService?: string;
  servicePlanExpiration?: string;
  discExpiration?: string;
  lastMaintenanceDate?: string;
}

export interface VehicleMake {
  id: number;
  name: string;
}

export interface AssetReport extends BaseEntity {
  name: string;
  type: string;
  status: string;
  is_default: boolean;
}

// ============================================
// Incident Management
// ============================================
export interface IncidentType extends BaseEntity {
  name: string;
}

export type IncidentStatus = StatusEntity;

export interface IncidentCategory {
  id: number;
  name: string;
}

export type IncidentSeverityLevel = RatingLevel;

export interface IncidentPriorityLevel {
  id: number;
  name: string;
}

export interface Incident extends BaseEntity {
  title: string;
  description: string;
  reporter_id: number;
  department_id: number;
  assignee_id: number;
  due_date: string;
  date_occurred: string;
  type_id: number;
  category_id: number;
  sub_category_id: number | null;
  priority_level_id: number;
  urgency_level_id: number;
  impact_level_id: number;
  status_id: number;
  severity_level_id: number;
  site_id: number;
  location_id: number;
  root_cause: string;
  impact_details: string;
  solution_id: number | null;
}

export interface IncidentTask extends BaseEntity {
  incident_id: number;
  title: string;
  status_id: number;
  assigned_to: number;
}

export type IncidentTaskStatus = StatusEntity;

export interface KnowledgeBaseSolution extends BaseEntity {
  title: string;
  kb_id: string;
}

export interface IncidentReport extends BaseEntity {
  name: string;
  type: string;
  status: string;
  is_default: boolean;
}

// ============================================
// Audit Management
// ============================================
export interface AuditUniverseCategory extends BaseEntity {
  name: string;
}

export type AuditUniverseRiskRating = RatingLevel;

export interface AuditUniverseAuditCycle {
  id: number;
  name: string;
  months: number;
}

export type AuditEngagementStatus = StatusEntity;

export type AuditFindingStatus = StatusEntity;

export type AuditFindingRiskRating = RatingLevel;

export interface AuditWorkpaperType {
  id: number;
  name: string;
}

export type AuditWorkpaperStatus = StatusEntity;

export interface AuditUniverseItem extends BaseEntity {
  name: string;
  category_id: number;
  risk_rating_id: number;
  audit_cycle_id: number;
  department_id: number;
  last_audit_date: string;
  next_audit_date: string;
}

export interface AnnualAuditPlan extends BaseEntity {
  name: string;
  year: number;
  status_id: number;
  created_by: number;
}

export interface AuditEngagement extends BaseEntity {
  engagement_id: string;
  title: string;
  lead_auditor_id: number;
  start_date: string;
  end_date: string;
  scope: string;
  status_id: number;
}

export interface AuditFinding extends BaseEntity {
  finding_id: string;
  title: string;
  engagement_id: number;
  risk_rating_id: number;
  status_id: number;
  owner_id: number;
  due_date: string;
}

export interface AuditWorkpaper extends BaseEntity {
  title: string;
  type_id: number;
  engagement_id: number;
  status_id: number;
  prepared_by: number;
  reviewed_by: number;
}

export interface AuditReport extends BaseEntity {
  name: string;
  type: string;
  status: string;
  is_default: boolean;
}

// ============================================
// Compliance Management
// ============================================
export interface RegulationStandard extends BaseEntity {
  name: string;
  description: string;
  jurisdiction: string;
}

export type CompliancePackageStatus = StatusEntity;

export type ComplianceAssessmentStatus = StatusEntity;

export interface CompliancePackage extends BaseEntity {
  name: string;
  description: string;
  version: string;
  publisher_name: string;
  comments: string;
  regulation_standard_status_id: number;
  compliance_package_status_id: number;
  pending_reviews_count: number;
  compliance_score: number;
  total_requirements: number;
  completed_requirements: number;
  overdue_requirements: number;
  missing_evidence_count: number;
}

export interface CompliancePackageItem extends BaseEntity {
  package_id: number;
  name: string;
  status: string;
  evidence_required: boolean;
}

export interface ComplianceAssessment extends BaseEntity {
  name: string;
  package_id: number;
  status_id: number;
  assessor_id: number;
  assessment_date: string;
}

export interface TrainingCampaign extends BaseEntity {
  name: string;
  status_id: number;
  start_date: string;
  end_date: string;
}

export interface ComplianceReport extends BaseEntity {
  name: string;
  type: string;
  status: string;
  is_default: boolean;
}

// ============================================
// Governance Management
// ============================================
export interface PolicyCategory extends BaseEntity {
  name: string;
}

export type GovernancePolicyStatus = StatusEntity;

export interface GovernancePolicy extends BaseEntity {
  title: string;
  version: string;
  category_id: number;
  owner_id: number;
  description: string;
  policy_content: string;
  effective_date: string | null;
  next_review_date: string | null;
  policy_status_id: number;
}

export interface CommitteeType {
  id: number;
  name: string;
}

export type GovernanceCommitteeStatus = StatusEntity;

export interface GovernanceCommittee extends BaseEntity {
  name: string;
  type_id: number;
  status_id: number;
  chairperson_id: number;
  secretary_id: number;
}

export type DelegationStatus = StatusEntity;

export interface DelegationOfAuthority extends BaseEntity {
  name: string;
  delegator_id: number;
  delegate_id: number;
  authority_type: string;
  limit_amount: number;
  status_id: number;
}

export type BusinessContinuityStatus = StatusEntity;

export interface BusinessContinuityPlan extends BaseEntity {
  name: string;
  status_id: number;
  owner_id: number;
  last_tested: string;
  next_test_date: string;
}

export type ConflictStatus = StatusEntity;

export interface ConflictOfInterest extends BaseEntity {
  declared_by: number;
  nature: string;
  status_id: number;
  declaration_date: string;
}

export type BusinessObjectiveStatus = StatusEntity;

export interface BusinessObjective extends BaseEntity {
  title: string;
  description: string;
  strategic_goal: string;
  owner_id: number;
  status_id: number;
  start_date: string;
  end_date: string;
  performance_indicator: string;
}

export interface GovernanceReport extends BaseEntity {
  name: string;
  type: string;
  status: string;
  is_default: boolean;
}

// ============================================
// Performance Management
// ============================================
export interface PerformanceReport extends BaseEntity {
  name: string;
  description?: string;
  type: string;
  status: string;
  is_default: boolean;
  ai_enabled?: boolean;
  ai_insights?: { title: string; summary: string }[];
}

// ============================================
// Complete Data Schema
// ============================================
export interface ProSuiteData {
  metadata: Metadata;
  system: {
    cache: CacheEntry[];
    jobs: Job[];
    failed_jobs: FailedJob[];
    licenses: License[];
    partners: Partner[];
    media: Media[];
    tasks: Task[];
    task_subtasks: TaskSubtask[];
  };
  core: {
    tenants: Tenant[];
    users: User[];
    departments: Department[];
    modules: Module[];
    sites: Site[];
    locations: Location[];
    priority_levels: PriorityLevel[];
  };
  risk: {
    risk_categories: RiskCategory[];
    risk_sub_categories: RiskSubCategory[];
    risk_types: RiskType[];
    risk_ages: RiskAge[];
    risk_origins: RiskOrigin[];
    risk_approaches: RiskApproach[];
    risk_impact_rating_levels: RatingLevel[];
    risk_likelihood_rating_levels: RatingLevel[];
    risk_inherent_settings: RiskInherentSetting[];
    risk_action_plan_statuses: StatusEntity[];
    risk_action_plan_timeframes: { id: number; name: string; days: number }[];
    risk_monitoring_frequencies: { id: number; name: string; days: number }[];
    risk_control_effectiveness_levels: RatingLevel[];
    risks: Risk[];
    risk_causes: RiskCause[];
    risk_consequences: RiskConsequence[];
    risk_action_plans: RiskActionPlan[];
    risk_monitoring_plans: RiskMonitoringPlan[];
    risk_assessments: RiskAssessment[];
    controls: Control[];
    risk_control_mappings: RiskControlMapping[];
    risk_reports: RiskReport[];
  };
  asset: {
    categories: AssetCategory[];
    asset_statuses: AssetStatus[];
    depreciation_methods: DepreciationMethod[];
    assets: Asset[];
    vehicle_makes: VehicleMake[];
    asset_reports: AssetReport[];
  };
  incident: {
    incident_types: IncidentType[];
    incident_statuses: IncidentStatus[];
    incident_categories: IncidentCategory[];
    incident_severity_levels: IncidentSeverityLevel[];
    incident_priority_levels: IncidentPriorityLevel[];
    incidents: Incident[];
    incident_tasks: IncidentTask[];
    incident_task_statuses: IncidentTaskStatus[];
    knowledge_base_solutions: KnowledgeBaseSolution[];
    incident_reports: IncidentReport[];
  };
  audit: {
    audit_universe_categories: AuditUniverseCategory[];
    audit_universe_risk_ratings: AuditUniverseRiskRating[];
    audit_universe_audit_cycles: AuditUniverseAuditCycle[];
    audit_engagement_statuses: AuditEngagementStatus[];
    audit_finding_statuses: AuditFindingStatus[];
    audit_finding_risk_ratings: AuditFindingRiskRating[];
    audit_workpaper_types: AuditWorkpaperType[];
    audit_workpaper_statuses: AuditWorkpaperStatus[];
    audit_universe_items: AuditUniverseItem[];
    annual_audit_plans: AnnualAuditPlan[];
    audit_engagements: AuditEngagement[];
    audit_findings: AuditFinding[];
    audit_workpapers: AuditWorkpaper[];
    comprehensive_audit_reports: AuditReport[];
  };
  compliance: {
    regulations_standards: RegulationStandard[];
    compliance_package_statuses: CompliancePackageStatus[];
    compliance_assessment_statuses: ComplianceAssessmentStatus[];
    compliance_packages: CompliancePackage[];
    compliance_package_items: CompliancePackageItem[];
    compliance_assessments: ComplianceAssessment[];
    training_campaigns: TrainingCampaign[];
    compliance_reports: ComplianceReport[];
  };
  governance: {
    policy_categories: PolicyCategory[];
    governance_policy_statuses: GovernancePolicyStatus[];
    governance_policies: GovernancePolicy[];
    committee_types: CommitteeType[];
    governance_committee_statuses: GovernanceCommitteeStatus[];
    governance_committees: GovernanceCommittee[];
    delegation_statuses: DelegationStatus[];
    delegations_of_authority: DelegationOfAuthority[];
    business_continuity_statuses: BusinessContinuityStatus[];
    business_continuity_plans: BusinessContinuityPlan[];
    conflict_statuses: ConflictStatus[];
    conflict_of_interests: ConflictOfInterest[];
    business_objective_statuses: BusinessObjectiveStatus[];
    business_objectives: BusinessObjective[];
    governance_reports: GovernanceReport[];
  };
  performance: {
    performance_reports: PerformanceReport[];
  };
}

// ============================================
// Module Registry Types
// ============================================
export type ModuleSlug = 'risk' | 'asset' | 'compliance' | 'governance' | 'incident' | 'audit' | 'performance';

export interface ModuleConfig {
  slug: ModuleSlug;
  name: string;
  alias: string;
  description: string;
  icon: string;
  color: string;
  routes: {
    list: string;
    detail: string;
    create?: string;
  };
  features: string[];
  enabled: boolean;
}

export interface ModuleRegistry {
  [key: string]: ModuleConfig;
}
