/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  RenovationLead, 
  ScraperJob, 
  DailyEmailDigestConfig, 
  AutoExportRule, 
  AppUser, 
  RoleType, 
  PipelineStage 
} from './types';
import { 
  INITIAL_LEADS, 
  INITIAL_SCRAPER_JOBS, 
  INITIAL_EMAIL_CONFIG, 
  INITIAL_EXPORT_RULES, 
  INITIAL_USERS 
} from './data/mockLeads';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LeadsTableView } from './components/LeadsTableView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { ScraperHubModal } from './components/ScraperHubModal';
import { EmailDigestModal } from './components/EmailDigestModal';
import { AutoExportModal } from './components/AutoExportModal';
import { PermissionsModal } from './components/PermissionsModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { exportLeadsToCSV, triggerDownload } from './utils/csvExporter';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Persistent state for leads
  const [leads, setLeads] = useState<RenovationLead[]>(() => {
    try {
      const saved = localStorage.getItem('renovatepulse_kl_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LEADS;
  });

  // Persistent state for scrapers
  const [scraperJobs, setScraperJobs] = useState<ScraperJob[]>(() => {
    try {
      const saved = localStorage.getItem('renovatepulse_kl_scrapers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SCRAPER_JOBS;
  });

  // Persistent state for email config
  const [emailConfig, setEmailConfig] = useState<DailyEmailDigestConfig>(() => {
    try {
      const saved = localStorage.getItem('renovatepulse_kl_email_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMAIL_CONFIG;
  });

  // Persistent state for export rules
  const [exportRules, setExportRules] = useState<AutoExportRule[]>(() => {
    try {
      const saved = localStorage.getItem('renovatepulse_kl_export_rules');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EXPORT_RULES;
  });

  // Users & RBAC
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[0]);

  // Active View Tab
  const [activeView, setActiveView] = useState<'dashboard' | 'leads' | 'scrapers' | 'email' | 'export'>('dashboard');

  // Modals state
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<RenovationLead | null>(null);
  const [scraperModalOpen, setScraperModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Global Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('renovatepulse_kl_leads', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('renovatepulse_kl_scrapers', JSON.stringify(scraperJobs));
    } catch (e) {
      console.error(e);
    }
  }, [scraperJobs]);

  useEffect(() => {
    try {
      localStorage.setItem('renovatepulse_kl_email_config', JSON.stringify(emailConfig));
    } catch (e) {
      console.error(e);
    }
  }, [emailConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('renovatepulse_kl_export_rules', JSON.stringify(exportRules));
    } catch (e) {
      console.error(e);
    }
  }, [exportRules]);

  // Handlers
  const handleUpdateLeadStage = (leadId: string, newStage: PipelineStage) => {
    if (!currentUser.permissions.canEditLeadStages) {
      showToast(`Role "${currentUser.role}" does not have permission to modify lead stages.`, 'error');
      return;
    }
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage, lastActivity: 'Just now' } : l));
    if (selectedLeadForDetail && selectedLeadForDetail.id === leadId) {
      setSelectedLeadForDetail(prev => prev ? { ...prev, stage: newStage } : null);
    }
    showToast(`Lead moved to "${newStage}" stage.`, 'info');
  };

  const handleUpdateLeadNotes = (leadId: string, notes: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes, lastActivity: 'Just now' } : l));
    showToast('Estimating & scope notes updated successfully.', 'success');
  };

  const handleAddNewLead = (newLead: RenovationLead) => {
    setLeads(prev => [newLead, ...prev]);
    showToast(`Ingested new renovation lead: ${newLead.companyName} (${newLead.squareFootage.toLocaleString()} sq ft)!`, 'success');
  };

  const handleTriggerScraper = (jobId: string) => {
    setScraperJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'running',
          leadsExtractedCount: j.leadsExtractedCount + Math.floor(Math.random() * 4) + 1,
          lastRun: 'Just now',
        };
      }
      return j;
    }));
  };

  const handleToggleExportRule = (ruleId: string) => {
    setExportRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
    showToast('Auto-export rule updated.', 'info');
  };

  const handleAddNewExportRule = (newRule: AutoExportRule) => {
    setExportRules(prev => [newRule, ...prev]);
    showToast(`Configured automated rule: "${newRule.name}"`, 'success');
  };

  const handleQuickExportCSV = () => {
    if (!currentUser.permissions.canExportCsv) {
      showToast('Export restricted for current user role.', 'error');
      return;
    }
    const { csvString, filename } = exportLeadsToCSV(leads);
    triggerDownload(csvString, filename);
    showToast(`Exported ${leads.length} leads to CSV file.`, 'success');
  };

  const handleSelectUserRole = (role: RoleType) => {
    const foundUser = users.find(u => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Switched active view role to: ${role}`, 'info');
    }
  };

  const handleTogglePermission = (userId: string, permKey: keyof AppUser['permissions']) => {
    if (!currentUser.permissions.canManageTeamRoles) {
      showToast('Only Super Admin can modify stakeholder permissions.', 'error');
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedPerms = { ...u.permissions, [permKey]: !u.permissions[permKey] };
        if (currentUser.id === userId) {
          setCurrentUser({ ...u, permissions: updatedPerms });
        }
        return { ...u, permissions: updatedPerms };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold backdrop-blur-md border animate-bounce bg-slate-900 border-amber-500/50 text-white">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onSelectUserRole={handleSelectUserRole}
        users={users}
        leads={leads}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenScraperModal={() => setScraperModalOpen(true)}
        onOpenEmailModal={() => setEmailModalOpen(true)}
        onOpenExportModal={() => setExportModalOpen(true)}
        onOpenPermissionsModal={() => setPermissionsModalOpen(true)}
        onOpenAIModal={() => setAiModalOpen(true)}
        onQuickExportCSV={handleQuickExportCSV}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'dashboard' ? (
          <DashboardView
            leads={leads}
            onSelectLead={lead => setSelectedLeadForDetail(lead)}
            onUpdateLeadStage={handleUpdateLeadStage}
            onOpenScraperModal={() => setScraperModalOpen(true)}
            onOpenEmailModal={() => setEmailModalOpen(true)}
            onOpenExportModal={() => setExportModalOpen(true)}
          />
        ) : (
          <LeadsTableView
            leads={leads}
            onSelectLead={lead => setSelectedLeadForDetail(lead)}
            onOpenOutreachModal={lead => setSelectedLeadForDetail(lead)}
            onUpdateLeadStage={handleUpdateLeadStage}
            canExport={currentUser.permissions.canExportCsv}
            canEdit={currentUser.permissions.canEditLeadStages}
          />
        )}
      </main>

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onUpdateStage={handleUpdateLeadStage}
        onUpdateNotes={handleUpdateLeadNotes}
        canEdit={currentUser.permissions.canEditLeadStages}
      />

      <ScraperHubModal
        isOpen={scraperModalOpen}
        onClose={() => setScraperModalOpen(false)}
        scraperJobs={scraperJobs}
        onTriggerScraper={handleTriggerScraper}
        onAddNewLead={handleAddNewLead}
        canRunScrapers={currentUser.permissions.canRunScrapers}
      />

      <EmailDigestModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        config={emailConfig}
        onUpdateConfig={cfg => {
          setEmailConfig(cfg);
          showToast('Updated daily email digest settings & filter rules.', 'success');
        }}
        leads={leads}
        canConfigure={currentUser.permissions.canConfigureEmailAlerts}
      />

      <AutoExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        exportRules={exportRules}
        onToggleRule={handleToggleExportRule}
        onAddNewRule={handleAddNewExportRule}
        leads={leads}
        canExport={currentUser.permissions.canExportCsv}
      />

      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onSelectUserRole={handleSelectUserRole}
        onTogglePermission={handleTogglePermission}
      />

      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        leads={leads}
      />

      {/* Subdued Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        RenoLeads • Kuala Lumpur Commercial Office Renovation Lead Intelligence & Scraper Automation • Real-Time DBKL OSC 3.0 & Bomba JBPM Ingestion
      </footer>

    </div>
  );
}
