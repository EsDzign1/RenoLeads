import React, { useState } from 'react';
import { 
  DollarSign, 
  Building, 
  Flame, 
  FileCheck2, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  Layers, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart
} from 'lucide-react';
import { RenovationLead, PipelineStage } from '../types';
import { formatCurrency, formatNumber } from '../utils/scoring';

interface DashboardViewProps {
  leads: RenovationLead[];
  onSelectLead: (lead: RenovationLead) => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onOpenScraperModal: () => void;
  onOpenEmailModal: () => void;
  onOpenExportModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStage,
  onOpenScraperModal,
  onOpenEmailModal,
  onOpenExportModal,
}) => {
  const [pipelineFilter, setPipelineFilter] = useState<string>('all');

  // Compute Metrics
  const totalPipelineValue = leads.reduce((acc, l) => acc + l.estimatedBudget, 0);
  const totalSqFt = leads.reduce((acc, l) => acc + l.squareFootage, 0);
  const hotLeads = leads.filter(l => l.isHotLead || l.leadQualityScore >= 85);
  const approvedPermits = leads.filter(l => l.permitStatus === 'Approved');
  const avgCostPerSqFt = Math.round(totalPipelineValue / (totalSqFt || 1));

  // Lead Quality Scores Tiers
  const tier1Count = leads.filter(l => l.leadQualityScore >= 85).length;
  const tier2Count = leads.filter(l => l.leadQualityScore >= 65 && l.leadQualityScore < 85).length;
  const tier3Count = leads.filter(l => l.leadQualityScore < 65).length;

  // Metro distribution
  const metroCounts: Record<string, { count: number; value: number }> = {};
  leads.forEach(l => {
    const region = l.metroRegion.split(' - ')[0] || l.metroRegion;
    if (!metroCounts[region]) {
      metroCounts[region] = { count: 0, value: 0 };
    }
    metroCounts[region].count += 1;
    metroCounts[region].value += l.estimatedBudget;
  });

  // Industry distribution
  const industryCounts: Record<string, number> = {};
  leads.forEach(l => {
    const ind = l.industry.split(' & ')[0] || l.industry;
    industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  });

  // Pipeline stages
  const STAGES: PipelineStage[] = [
    'New Ingested',
    'Qualified',
    'Outreach Initiated',
    'Discovery Meeting',
    'RFP / Estimating',
    'Won / Contracted'
  ];

  // Trend data over months (May - Oct)
  const trendMonths = [
    { month: 'May 2026', permits: 8, leads: 14, val: 18.2 },
    { month: 'Jun 2026', permits: 11, leads: 19, val: 24.5 },
    { month: 'Jul 2026', permits: 15, leads: 26, val: 32.8 },
    { month: 'Aug 2026', permits: 18, leads: 31, val: 41.2 },
    { month: 'Sep 2026', permits: 22, leads: 38, val: 46.5 },
    { month: 'Oct 2026 (Live)', permits: 27, leads: 44, val: 52.8 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Kuala Lumpur Commercial Office Renovation & Fit-Out Intelligence
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-medium">
              Live Stream: Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated web scraping across DBKL permit registries (OSC 3.0), LinkedIn Malaysia relocations, and Klang Valley commercial real estate databases.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenScraperModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Scraper Automation
          </button>
          <button
            onClick={onOpenEmailModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            Daily Email Digest
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Auto-Export Rules
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Pipeline */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pipeline Renovation Value</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalPipelineValue)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+24.6% vs last quarter</span>
          </div>
        </div>

        {/* Monitored SqFt */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Monitored Fit-Out Area</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight">
            {formatNumber(totalSqFt)} <span className="text-xs font-normal text-slate-400">sq ft</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across {leads.length} commercial locations
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hot Leads (Score ≥ 80)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400 tracking-tight">
            {hotLeads.length} <span className="text-xs font-medium text-slate-400">leads</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-300/80">
            High immediate intent & verified contacts
          </div>
        </div>

        {/* Permits Approved */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Approved Permits</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-purple-400 tracking-tight">
            {approvedPermits.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            DBKL OSC 3.0, JBPM Bomba Lulus
          </div>
        </div>

        {/* Avg Fit-out Cost */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Benchmark Fit-Out Cost</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight">
            RM {avgCostPerSqFt} <span className="text-xs font-normal text-slate-400">/ sq ft</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            KL Prime Grade A interior standard
          </div>
        </div>

      </div>

      {/* Main Analytics Grid: Quality Score Distribution & Trend Analytics Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lead Quality Scores & Scoring Engine (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Lead Quality Score Distribution
              </h2>
              <p className="text-xs text-slate-400">
                AI & rule-based composite scoring (0-100) based on 5 qualification signals
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Avg Score: {Math.round(leads.reduce((a, b) => a + b.leadQualityScore, 0) / leads.length)}
            </span>
          </div>

          {/* Quality Tiers Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Tier 1: Hot
              </div>
              <div className="text-2xl font-extrabold text-emerald-300 mt-0.5">
                {tier1Count}
              </div>
              <div className="text-[10px] text-emerald-400/80">Score: 85 - 100</div>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Tier 2: Warm
              </div>
              <div className="text-2xl font-extrabold text-amber-300 mt-0.5">
                {tier2Count}
              </div>
              <div className="text-[10px] text-amber-400/80">Score: 65 - 84</div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Tier 3: Nurture
              </div>
              <div className="text-2xl font-extrabold text-slate-300 mt-0.5">
                {tier3Count}
              </div>
              <div className="text-[10px] text-slate-400">Score: &lt; 65</div>
            </div>
          </div>

          {/* Quality Factors Weight Bar */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-300">
              Scoring Model Weight Distribution:
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>DBKL / PBT Permit Registry Status (Lulus / Pelan Check)</span>
                  <span className="text-emerald-400 font-semibold">25% Max</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Intent Velocity (Workplace Hires & Lease Expiry)</span>
                  <span className="text-amber-400 font-semibold">25% Max</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Fit-Out Square Footage Scale (&gt;20,000 sq ft)</span>
                  <span className="text-blue-400 font-semibold">20% Max</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Verified Decision Maker Reachability</span>
                  <span className="text-purple-400 font-semibold">15% Max</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Corporate Financial Stability & Credit Rating</span>
                  <span className="text-sky-400 font-semibold">15% Max</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Leads with quality scores above 80 are automatically prioritized for the <strong>08:00 AM MYT Daily Morning Sales Email Briefing</strong>.
            </span>
          </div>

        </div>

        {/* Trend Analytics Over Time & Submarkets (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Renovation Lead Volume & DBKL Permit Filings Trend
              </h2>
              <p className="text-xs text-slate-400">
                Monthly trend tracking Greater KL commercial alterations and interior fit-out pipeline (RM M)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                Ingested Leads
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                Permits Lulus (DBKL)
              </span>
            </div>
          </div>

          {/* Interactive Trend Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 pb-2 border-b border-slate-800">
            {trendMonths.map((m, idx) => {
              const maxLeads = 50;
              const leadsHeight = `${Math.min(100, (m.leads / maxLeads) * 100)}%`;
              const permitsHeight = `${Math.min(100, (m.permits / maxLeads) * 100)}%`;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition">
                    RM {m.val}M
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-32">
                    {/* Leads bar */}
                    <div 
                      className="w-1/2 max-w-[20px] bg-blue-600 rounded-t-md hover:bg-blue-500 transition relative cursor-pointer"
                      style={{ height: leadsHeight }}
                      title={`${m.month}: ${m.leads} Leads Ingested`}
                    ></div>
                    {/* Permits bar */}
                    <div 
                      className="w-1/2 max-w-[20px] bg-amber-500 rounded-t-md hover:bg-amber-400 transition relative cursor-pointer"
                      style={{ height: permitsHeight }}
                      title={`${m.month}: ${m.permits} Approved DBKL Permits`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                    {m.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Submarket & Sector Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Metro Distribution */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs font-bold text-slate-200 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Top KL Commercial Precincts
                </span>
                <span className="text-[10px] text-slate-500">By Lead Value</span>
              </div>
              <div className="space-y-2">
                {Object.entries(metroCounts).slice(0, 4).map(([region, data], idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[130px]">{region}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{data.count} projects</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {formatCurrency(data.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Sectors */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs font-bold text-slate-200 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Top Industry Sectors
                </span>
                <span className="text-[10px] text-slate-500">By Frequency</span>
              </div>
              <div className="space-y-2">
                {Object.entries(industryCounts).slice(0, 4).map(([industry, count], idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[140px]">{industry}</span>
                    <span className="bg-slate-800 text-slate-300 text-[11px] font-mono px-2 py-0.5 rounded">
                      {count} ({Math.round((count / leads.length) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Real-time Sales Pipeline & Conversion Stage Kanban */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Real-Time Renovation Sales Pipeline
            </h2>
            <p className="text-xs text-slate-400">
              Track conversion stages from raw permit ingestion to active contract tender
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Stages Value:</span>
            <span className="text-emerald-400 font-extrabold font-mono text-sm">
              {formatCurrency(totalPipelineValue)}
            </span>
          </div>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-1 overflow-x-auto">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            const stageTotal = stageLeads.reduce((acc, l) => acc + l.estimatedBudget, 0);

            // Stage color accent
            let accentColor = 'border-slate-800 text-slate-400';
            if (stage === 'New Ingested') accentColor = 'border-blue-500/40 text-blue-400';
            if (stage === 'Qualified') accentColor = 'border-cyan-500/40 text-cyan-400';
            if (stage === 'Outreach Initiated') accentColor = 'border-amber-500/40 text-amber-400';
            if (stage === 'Discovery Meeting') accentColor = 'border-purple-500/40 text-purple-400';
            if (stage === 'RFP / Estimating') accentColor = 'border-rose-500/40 text-rose-400';
            if (stage === 'Won / Contracted') accentColor = 'border-emerald-500/40 text-emerald-400';

            return (
              <div 
                key={stage} 
                className="bg-slate-950/70 rounded-xl border border-slate-800/80 p-3 flex flex-col min-w-[210px]"
              >
                {/* Stage Header */}
                <div className="pb-2 mb-2 border-b border-slate-800/60 flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-bold truncate ${accentColor.split(' ')[1]}`}>
                      {stage}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {formatCurrency(stageTotal)}
                    </div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2 flex-1 min-h-[160px]">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-6 text-slate-600 text-xs italic">
                      No leads in stage
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => onSelectLead(lead)}
                        className="bg-slate-900/90 hover:bg-slate-800 p-2.5 rounded-lg border border-slate-800/90 hover:border-amber-500/40 transition cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 line-clamp-1">
                            {lead.companyName}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            lead.leadQualityScore >= 85
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : lead.leadQualityScore >= 65
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {lead.leadQualityScore}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {lead.officeAddress.split(',')[0]}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
                          <span className="text-emerald-400 font-mono font-semibold">
                            {formatCurrency(lead.estimatedBudget)}
                          </span>
                          <span className="text-slate-400">
                            {formatNumber(lead.squareFootage)} sqft
                          </span>
                        </div>

                        {/* Quick stage transition button */}
                        <div className="mt-2 pt-1 flex justify-end">
                          <select
                            value={lead.stage}
                            onClick={e => e.stopPropagation()}
                            onChange={e => onUpdateLeadStage(lead.id, e.target.value as PipelineStage)}
                            className="bg-slate-950 text-slate-300 text-[9px] px-1.5 py-0.5 rounded border border-slate-700 focus:outline-none"
                          >
                            {STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
