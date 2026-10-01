import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronUp, 
  ChevronDown, 
  Flame, 
  Building2, 
  Mail, 
  Phone, 
  ExternalLink, 
  FileText, 
  Layers, 
  Sparkles,
  CheckSquare,
  Square,
  ArrowUpDown,
  RefreshCw,
  Plus
} from 'lucide-react';
import { RenovationLead, PipelineStage, SourceChannel, PermitStatus, ProjectType } from '../types';
import { formatCurrency, formatNumber } from '../utils/scoring';
import { exportLeadsToCSV, triggerDownload } from '../utils/csvExporter';

interface LeadsTableViewProps {
  leads: RenovationLead[];
  onSelectLead: (lead: RenovationLead) => void;
  onOpenOutreachModal: (lead: RenovationLead) => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onDeleteLead?: (leadId: string) => void;
  canExport: boolean;
  canEdit: boolean;
}

type SortField = 'leadQualityScore' | 'squareFootage' | 'estimatedBudget' | 'companyName' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const LeadsTableView: React.FC<LeadsTableViewProps> = ({
  leads,
  onSelectLead,
  onOpenOutreachModal,
  onUpdateLeadStage,
  canExport,
  canEdit,
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedMetro, setSelectedMetro] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedPermitStatus, setSelectedPermitStatus] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('leadQualityScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Selected lead IDs for bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Unique Filter Options
  const metros = useMemo(() => Array.from(new Set(leads.map(l => l.metroRegion))).sort(), [leads]);
  const channels = useMemo(() => Array.from(new Set(leads.map(l => l.sourceChannel))).sort(), [leads]);
  const permitStatuses = useMemo(() => Array.from(new Set(leads.map(l => l.permitStatus))).sort(), [leads]);
  const stages: PipelineStage[] = [
    'New Ingested',
    'Qualified',
    'Outreach Initiated',
    'Discovery Meeting',
    'RFP / Estimating',
    'Won / Contracted'
  ];

  // Filtering Logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const primaryDM = lead.decisionMakers[0]?.name?.toLowerCase() || '';
        const permit = lead.permitNumber?.toLowerCase() || '';
        const match = 
          lead.companyName.toLowerCase().includes(query) ||
          lead.officeAddress.toLowerCase().includes(query) ||
          lead.city.toLowerCase().includes(query) ||
          primaryDM.includes(query) ||
          permit.includes(query) ||
          lead.industry.toLowerCase().includes(query);
        if (!match) return false;
      }

      // Tier filter
      if (selectedTier === 'hot' && lead.leadQualityScore < 85) return false;
      if (selectedTier === 'warm' && (lead.leadQualityScore < 65 || lead.leadQualityScore >= 85)) return false;
      if (selectedTier === 'nurture' && lead.leadQualityScore >= 65) return false;

      // Metro filter
      if (selectedMetro !== 'all' && lead.metroRegion !== selectedMetro) return false;

      // Channel filter
      if (selectedChannel !== 'all' && lead.sourceChannel !== selectedChannel) return false;

      // Permit Status filter
      if (selectedPermitStatus !== 'all' && lead.permitStatus !== selectedPermitStatus) return false;

      // Stage filter
      if (selectedStage !== 'all' && lead.stage !== selectedStage) return false;

      return true;
    });
  }, [leads, searchTerm, selectedTier, selectedMetro, selectedChannel, selectedPermitStatus, selectedStage]);

  // Sorting Logic
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredLeads, sortField, sortDirection]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === sortedLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(sortedLeads.map(l => l.id));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export Selected / All
  const handleExportCSV = () => {
    const leadsToExport = selectedLeadIds.length > 0
      ? leads.filter(l => selectedLeadIds.includes(l.id))
      : sortedLeads;

    const { csvString, filename } = exportLeadsToCSV(leadsToExport);
    triggerDownload(csvString, filename);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, permit numbers, addresses, contacts, or industry keywords..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={!canExport}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                canExport
                  ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
              }`}
              title="Export filtered records directly to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {selectedLeadIds.length > 0 
                  ? `Export Selected (${selectedLeadIds.length})` 
                  : `Export All Filtered (${sortedLeads.length})`}
              </span>
            </button>
          </div>

        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* Quality Tier */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Quality Tier
            </label>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Tiers (0-100)</option>
              <option value="hot">🔥 Tier 1: Hot (85-100)</option>
              <option value="warm">⚡ Tier 2: Warm (65-84)</option>
              <option value="nurture">🌱 Tier 3: Nurture (&lt;65)</option>
            </select>
          </div>

          {/* Metro Submarket */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              KL Commercial Precinct
            </label>
            <select
              value={selectedMetro}
              onChange={e => setSelectedMetro(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All KL Precincts</option>
              {metros.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Sourcing Channel */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Scraping Channel
            </label>
            <select
              value={selectedChannel}
              onChange={e => setSelectedChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Channels</option>
              {channels.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Permit Status */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Permit Status
            </label>
            <select
              value={selectedPermitStatus}
              onChange={e => setSelectedPermitStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Permit Statuses</option>
              {permitStatuses.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Pipeline Stage */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Sales Stage
            </label>
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Pipeline Stages</option>
              {stages.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Main Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            
            {/* Table Header */}
            <thead className="bg-slate-950/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button onClick={handleToggleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedLeadIds.length === sortedLeads.length && sortedLeads.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>

                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('companyName')}>
                  <div className="flex items-center gap-1">
                    <span>Company & Scope</span>
                    {sortField === 'companyName' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>

                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('leadQualityScore')}>
                  <div className="flex items-center gap-1">
                    <span>Quality Score</span>
                    {sortField === 'leadQualityScore' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>

                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('squareFootage')}>
                  <div className="flex items-center gap-1">
                    <span>Area (Sq Ft)</span>
                    {sortField === 'squareFootage' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>

                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('estimatedBudget')}>
                  <div className="flex items-center gap-1">
                    <span>Est. Budget</span>
                    {sortField === 'estimatedBudget' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>

                <th className="py-3 px-3">
                  <span>Permit Details</span>
                </th>

                <th className="py-3 px-3">
                  <span>Key Decision Maker</span>
                </th>

                <th className="py-3 px-3">
                  <span>Pipeline Stage</span>
                </th>

                <th className="py-3 px-3 text-right">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No office renovation leads matched your search and filter criteria.
                  </td>
                </tr>
              ) : (
                sortedLeads.map(lead => {
                  const primaryDM = lead.decisionMakers[0];
                  const isSelected = selectedLeadIds.includes(lead.id);

                  // Score badge
                  let scoreBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                  if (lead.leadQualityScore >= 85) {
                    scoreBadgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
                  } else if (lead.leadQualityScore >= 65) {
                    scoreBadgeColor = 'bg-amber-950 text-amber-300 border-amber-500/40';
                  }

                  // Permit badge
                  let permitColor = 'bg-slate-800 text-slate-400';
                  if (lead.permitStatus === 'Approved') permitColor = 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50';
                  if (lead.permitStatus === 'Plan Check') permitColor = 'bg-blue-900/60 text-blue-300 border border-blue-700/50';
                  if (lead.permitStatus === 'Under Review') permitColor = 'bg-amber-900/60 text-amber-300 border border-amber-700/50';

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className={`hover:bg-slate-800/40 transition cursor-pointer group ${
                        isSelected ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Select Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={e => handleToggleSelectOne(lead.id, e)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                        )}
                      </td>

                      {/* Company Name & Location */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-white group-hover:text-amber-300 transition text-sm flex items-center gap-1.5">
                          {lead.companyName}
                          {lead.isHotLead && (
                            <span className="p-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]" title="Hot Lead (High Intent Score)">
                              🔥
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          📍 {lead.officeAddress}, {lead.city}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="text-amber-400/90 font-medium">{lead.projectType}</span>
                          <span>•</span>
                          <span>{lead.sourceChannel}</span>
                        </div>
                      </td>

                      {/* Quality Score */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border font-mono ${scoreBadgeColor}`}>
                            {lead.leadQualityScore >= 85 && <Flame className="w-3 h-3 text-emerald-400" />}
                            {lead.leadQualityScore}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {lead.leadQualityScore >= 85 ? 'Tier 1: Hot' : lead.leadQualityScore >= 65 ? 'Tier 2: Warm' : 'Tier 3: Nurture'}
                        </div>
                      </td>

                      {/* Square Footage */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-200">
                        {formatNumber(lead.squareFootage)} sq ft
                        <div className="text-[10px] text-slate-500 font-sans">
                          RM {lead.budgetPerSqFt}/sqft
                        </div>
                      </td>

                      {/* Estimated Budget */}
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-emerald-400 font-mono text-sm">
                          {formatCurrency(lead.estimatedBudget)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {lead.timeline}
                        </div>
                      </td>

                      {/* Permit Info */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${permitColor}`}>
                          {lead.permitStatus}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[130px] mt-1">
                          {lead.permitNumber || 'Filing in progress'}
                        </div>
                      </td>

                      {/* Key Decision Maker */}
                      <td className="py-3 px-3">
                        {primaryDM ? (
                          <div>
                            <div className="font-semibold text-slate-200 text-xs">
                              {primaryDM.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {primaryDM.title}
                            </div>
                            <a
                              href={`mailto:${primaryDM.email}`}
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Mail className="w-2.5 h-2.5" />
                              {primaryDM.email}
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">Researching Contact</span>
                        )}
                      </td>

                      {/* Stage Selector */}
                      <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                        <select
                          value={lead.stage}
                          disabled={!canEdit}
                          onChange={e => onUpdateLeadStage(lead.id, e.target.value as PipelineStage)}
                          className={`bg-slate-950 text-slate-300 text-xs px-2 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 ${
                            !canEdit ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-slate-700'
                          }`}
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="py-3 px-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenOutreachModal(lead)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition"
                            title="Generate Cold Outreach Pitch referencing permit & sqft"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectLead(lead)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                            title="Inspect Complete Renovation Lead Dossier"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{sortedLeads.length}</strong> of <strong className="text-white">{leads.length}</strong> commercial renovation leads
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Filtered Pipeline: <strong className="text-emerald-400 font-mono">{formatCurrency(sortedLeads.reduce((a, b) => a + b.estimatedBudget, 0))}</strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
