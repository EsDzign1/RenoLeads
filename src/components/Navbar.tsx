import React from 'react';
import { 
  Building2, 
  Layers, 
  Download, 
  Mail, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  TrendingUp,
  UserCircle,
  Play,
  CheckCircle2,
  CalendarClock
} from 'lucide-react';
import { AppUser, RoleType, RenovationLead } from '../types';
import { formatCurrency } from '../utils/scoring';

interface NavbarProps {
  currentUser: AppUser;
  onSelectUserRole: (role: RoleType) => void;
  users: AppUser[];
  leads: RenovationLead[];
  activeView: 'dashboard' | 'leads' | 'scrapers' | 'email' | 'export';
  setActiveView: (view: 'dashboard' | 'leads' | 'scrapers' | 'email' | 'export') => void;
  onOpenScraperModal: () => void;
  onOpenEmailModal: () => void;
  onOpenExportModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenAIModal: () => void;
  onQuickExportCSV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUserRole,
  users,
  leads,
  activeView,
  setActiveView,
  onOpenScraperModal,
  onOpenEmailModal,
  onOpenExportModal,
  onOpenPermissionsModal,
  onOpenAIModal,
  onQuickExportCSV,
}) => {
  const hotLeadsCount = leads.filter(l => l.isHotLead || l.leadQualityScore >= 85).length;
  const totalPipeline = leads.reduce((sum, l) => sum + l.estimatedBudget, 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-amber-600/20 via-blue-600/20 to-emerald-600/20 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Orchestrator Active: 5 Automated Scrapers Running
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Channels: DBKL OSC 3.0 • LinkedIn Malaysia • JLL & Knight Frank MY • CIDB G7 Tenders
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Daily Digest: <strong className="text-amber-400 font-semibold">Scheduled 08:00 AM MYT</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            KL Pipeline: <strong className="text-emerald-400 font-semibold">{formatCurrency(totalPipeline)}</strong>
          </span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <Building2 className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  RenoLeads
                </span>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                  Kuala Lumpur Commercial Fit-Out
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Web Scraping & Automated Data Extraction for Greater KL Corporate Renovation Leads
              </p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics & Pipeline
            </button>
            <button
              onClick={() => setActiveView('leads')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'leads'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Leads Dossier
              <span className="ml-1 bg-slate-800/90 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">
                {leads.length}
              </span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Run Scraper Button */}
            <button
              onClick={onOpenScraperModal}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-md shadow-blue-600/20 border border-blue-400/30"
              title="Launch web scrapers, view crawler logs, and extract fresh permits"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">Scraper Hub</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Daily Email Button */}
            <button
              onClick={onOpenEmailModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition border border-slate-700"
              title="Configure Daily Email Notifications & Preview Morning Briefing"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Daily Digest</span>
              {hotLeadsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {hotLeadsCount}
                </span>
              )}
            </button>

            {/* Quick Export CSV Button */}
            <button
              onClick={onQuickExportCSV}
              disabled={!currentUser.permissions.canExportCsv}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition border ${
                currentUser.permissions.canExportCsv
                  ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
                  : 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={currentUser.permissions.canExportCsv ? "Export all filtered leads to CSV" : "Role lacks export permission"}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* AI Synthesizer */}
            <button
              onClick={onOpenAIModal}
              className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition"
              title="AI Lead Intent Analyzer & Cold Pitch Generator"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
            </button>

            {/* Role Switcher & RBAC */}
            <div className="relative border-l border-slate-800 pl-2 ml-1">
              <button
                onClick={onOpenPermissionsModal}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs transition"
                title="Manage Stakeholder Access & Permissions"
              >
                <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-[11px] font-semibold leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    {currentUser.role}
                  </div>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Nav Switcher */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-950 px-4 text-xs">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center gap-1.5 font-semibold py-1 px-3 rounded-lg ${
            activeView === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Analytics & Pipeline
        </button>
        <button
          onClick={() => setActiveView('leads')}
          className={`flex items-center gap-1.5 font-semibold py-1 px-3 rounded-lg ${
            activeView === 'leads' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Leads List ({leads.length})
        </button>
      </div>
    </header>
  );
};
