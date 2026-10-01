export type ProjectType = 
  | 'Full HQ Relocation & Fit-Out'
  | 'Cat B Interior Renovation'
  | 'Floor Expansion & Demolition'
  | 'Acoustic & Modern Workspace Upgrade'
  | 'Turnkey Executive Suite'
  | 'MEP & Sustainable Alteration';

export type SourceChannel =
  | 'Permit Registry'
  | 'LinkedIn Signal'
  | 'Commercial Real Estate'
  | 'Google Maps & Directories'
  | 'Construction Tenders'
  | 'Trade Supplier Network'
  | 'Job Portal Hiring';

export type PermitStatus = 'Approved' | 'Under Review' | 'Plan Check' | 'Pre-Filing' | 'Exempt';

export type PipelineStage = 
  | 'New Ingested'
  | 'Qualified'
  | 'Outreach Initiated'
  | 'Discovery Meeting'
  | 'RFP / Estimating'
  | 'Won / Contracted'
  | 'Disqualified';

export interface DecisionMaker {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  isPrimary: boolean;
}

export interface LeadScoreBreakdown {
  intentSignals: number; // 0-25
  sqFtVolume: number; // 0-20
  permitProgress: number; // 0-25
  decisionMakerReachability: number; // 0-15
  financialHealth: number; // 0-15
}

export interface RenovationLead {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  officeAddress: string;
  city: string;
  state: string;
  metroRegion: string;
  projectType: ProjectType;
  squareFootage: number;
  estimatedBudget: number;
  budgetPerSqFt: number;
  timeline: string;
  permitNumber?: string;
  permitJurisdiction?: string;
  permitFilingDate?: string;
  permitStatus: PermitStatus;
  leadQualityScore: number; // 0 - 100
  scoreBreakdown: LeadScoreBreakdown;
  sourceChannel: SourceChannel;
  sourceUrl: string;
  hiringSignal?: string;
  creditRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'Growth / VC';
  annualRevenue?: string;
  decisionMakers: DecisionMaker[];
  stage: PipelineStage;
  notes: string;
  tags: string[];
  createdAt: string;
  lastActivity: string;
  isHotLead: boolean;
}

export interface ScraperJob {
  id: string;
  name: string;
  channel: SourceChannel;
  targetJurisdiction: string;
  targetUrl: string;
  schedule: 'Realtime Trigger' | 'Every 3 Hours' | 'Daily at 05:00' | 'Daily at 18:00' | 'Weekly (Mon)';
  status: 'idle' | 'running' | 'completed' | 'paused' | 'error';
  lastRun: string;
  nextRun: string;
  leadsExtractedCount: number;
  proxyPool: string;
  keywords: string[];
  minSqFtFilter: number;
  confidenceScore: number;
}

export interface DailyEmailDigestConfig {
  enabled: boolean;
  frequency: 'daily' | 'twice_daily' | 'weekly';
  dispatchTime: string;
  recipientEmails: string[];
  filterMinQualityScore: number;
  filterMinSqFt: number;
  selectedMetroAreas: string[];
  includePermitAlerts: boolean;
  includeHiringAlerts: boolean;
  autoExportCsvAttachment: boolean;
  emailSubjectTemplate: string;
  webhookUrl?: string;
  lastSentTimestamp?: string;
}

export interface AutoExportRule {
  id: string;
  name: string;
  frequency: 'Daily (06:00 AM)' | 'Real-time on Lead Score > 85' | 'Weekly Summary (Sun)' | 'Instant Trigger';
  format: 'CSV' | 'JSON' | 'CRM Webhook';
  destination: 'Direct Browser Download' | 'Auto-Export Storage' | 'Webhook Endpoint';
  minScore: number;
  columns: string[];
  enabled: boolean;
  lastTriggered?: string;
}

export type RoleType = 
  | 'Super Admin' 
  | 'Senior Estimator & PM' 
  | 'Sales Outreach Executive' 
  | 'Sourcing & Data Analyst' 
  | 'Executive Stakeholder';

export interface UserRolePermissions {
  canRunScrapers: boolean;
  canExportCsv: boolean;
  canEditLeadStages: boolean;
  canConfigureEmailAlerts: boolean;
  canAccessFinancials: boolean;
  canManageTeamRoles: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  permissions: UserRolePermissions;
}
