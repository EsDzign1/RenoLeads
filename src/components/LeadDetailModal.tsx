import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Flame, 
  FileCheck2, 
  ExternalLink, 
  Mail, 
  Phone, 
  Briefcase, 
  DollarSign, 
  Layers, 
  Copy, 
  Check, 
  Sparkles, 
  Send,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { RenovationLead, PipelineStage } from '../types';
import { formatCurrency, formatNumber } from '../utils/scoring';

interface LeadDetailModalProps {
  lead: RenovationLead | null;
  onClose: () => void;
  onUpdateStage: (leadId: string, newStage: PipelineStage) => void;
  onUpdateNotes: (leadId: string, notes: string) => void;
  canEdit: boolean;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateStage,
  onUpdateNotes,
  canEdit,
}) => {
  if (!lead) return null;

  const [notes, setNotes] = useState(lead.notes || '');
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'permit' | 'contacts' | 'pitch'>('overview');

  const primaryDM = lead.decisionMakers[0];

  // Outbound Pitch Template
  const coldPitchText = `Subject: Commercial office fit-out & G7 contractor tender - ${lead.companyName} (${formatNumber(lead.squareFootage)} sq ft)

Salam & Hi ${primaryDM?.name?.split(' ')[0] || 'there'},

I noticed ${lead.companyName}'s commercial alteration filing for your new office space at ${lead.officeAddress} (DBKL Permit Ref: ${lead.permitNumber || 'OSC 3.0 In Progress'}).

With ${formatNumber(lead.squareFootage)} sq ft planned for your ${lead.projectType.toLowerCase()}, are you currently reviewing CIDB G7 main contractor and interior architecture tender packages?

We specialize in prime commercial workspace renovations across ${lead.metroRegion}, delivering turnkey Grade A Cat B spaces at competitive benchmarks (~RM ${lead.budgetPerSqFt}/sq ft) with guaranteed delivery timelines and full DBKL / JBPM Bomba compliance.

Would you be open to a brief 10-minute discovery call this Thursday or Friday to benchmark your architectural bill of quantities against recent fit-outs in ${lead.officeAddress.split(',')[0]}?

Best regards,
Commercial Project Team | RenoLeads
Email: estimating-kl@es-matrix.com`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(coldPitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(lead.id, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">
                  {lead.companyName}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                  lead.leadQualityScore >= 85
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-950 text-amber-300 border-amber-500/40'
                }`}>
                  Score: {lead.leadQualityScore}/100 {lead.isHotLead ? '🔥 Hot Lead' : ''}
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-700">
                  {lead.industry}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {lead.officeAddress}, {lead.city}, {lead.state} • <strong className="text-slate-200">{lead.metroRegion}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Project Overview & Budget
          </button>
          <button
            onClick={() => setActiveTab('permit')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'permit'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            DBKL Permit & OSC Intent ({lead.permitStatus})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Decision Makers ({lead.decisionMakers.length})
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'pitch'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Outreach Pitch Generator
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Budget</span>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    {formatCurrency(lead.estimatedBudget)}
                  </div>
                  <span className="text-[10px] text-slate-500">RM {lead.budgetPerSqFt} / sq ft benchmark</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Square Footage</span>
                  <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                    {formatNumber(lead.squareFootage)}
                  </div>
                  <span className="text-[10px] text-slate-500">Commercial Leased Area</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Project Type</span>
                  <div className="text-xs font-bold text-amber-400 mt-1 truncate">
                    {lead.projectType}
                  </div>
                  <span className="text-[10px] text-slate-500">{lead.timeline}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pipeline Stage</span>
                  <div className="mt-1">
                    <select
                      value={lead.stage}
                      disabled={!canEdit}
                      onChange={e => onUpdateStage(lead.id, e.target.value as PipelineStage)}
                      className="bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none w-full"
                    >
                      <option value="New Ingested">New Ingested</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Outreach Initiated">Outreach Initiated</option>
                      <option value="Discovery Meeting">Discovery Meeting</option>
                      <option value="RFP / Estimating">RFP / Estimating</option>
                      <option value="Won / Contracted">Won / Contracted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quality Score Breakdown */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Lead Quality Score Calculation Breakdown ({lead.leadQualityScore}/100)
                  </span>
                  <span className="text-emerald-400 font-semibold">{lead.scoreBreakdown ? 'Composite Verified' : ''}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Intent Velocity</span>
                    <div className="font-extrabold text-amber-400 text-sm mt-0.5">{lead.scoreBreakdown.intentSignals}/25</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">SqFt Scale</span>
                    <div className="font-extrabold text-blue-400 text-sm mt-0.5">{lead.scoreBreakdown.sqFtVolume}/20</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Permit Status</span>
                    <div className="font-extrabold text-emerald-400 text-sm mt-0.5">{lead.scoreBreakdown.permitProgress}/25</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Reachability</span>
                    <div className="font-extrabold text-purple-400 text-sm mt-0.5">{lead.scoreBreakdown.decisionMakerReachability}/15</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Credit & Financial</span>
                    <div className="font-extrabold text-sky-400 text-sm mt-0.5">{lead.scoreBreakdown.financialHealth}/15</div>
                  </div>
                </div>
              </div>

              {/* Notes & Estimating Log */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-200">
                    Estimating & Project Scope Notes
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-[11px]"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add notes on general contractor RFP requirements, interior architect appointed, site visit dates..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Tags:
                </span>
                {lead.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-800/80 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: PERMIT REGISTRY & INTENT */}
          {activeTab === 'permit' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    Official DBKL Permit Record (OSC 3.0 Plus & Bomba JBPM)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                    {lead.permitStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">DBKL Permit Reference:</span>
                    <div className="font-mono font-bold text-white mt-0.5 text-sm">
                      {lead.permitNumber || 'Application Pending'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Local Planning Authority:</span>
                    <div className="text-white mt-0.5 font-medium">
                      {lead.permitJurisdiction || 'Dewan Bandaraya Kuala Lumpur'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Date of Filing / Kelulusan:</span>
                    <div className="text-white mt-0.5 font-mono">
                      {lead.permitFilingDate || 'Recent'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Official DBKL Portal URL:</span>
                    <div className="mt-0.5">
                      <a
                        href={lead.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 text-xs truncate max-w-[240px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Verify on DBKL e-Lesen Portal
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sourcing Channel Signals */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Intent Velocity & Sourcing Channel Signals
                </h3>
                
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Channel: {lead.sourceChannel}
                    </span>
                    <p className="text-slate-200 mt-1">
                      {lead.hiringSignal || 'Workplace expansion signal detected from recent business registry update and hiring portal scans.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Financial Health & Qualification:
                      </span>
                      <div className="text-slate-200 font-medium mt-0.5">
                        Rating: <strong className="text-emerald-400">{lead.creditRating || 'Verified'}</strong> • Revenue / AUM: <strong className="text-white">{lead.annualRevenue || 'Confidential'}</strong>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Verified decision makers extracted via LinkedIn Sales Navigator and corporate directories for workspace & facilities decision authority.
              </div>

              <div className="space-y-3">
                {lead.decisionMakers.map(dm => (
                  <div key={dm.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{dm.name}</h4>
                        {dm.isPrimary && (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Primary Contact
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{dm.title}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 flex-wrap">
                        <a
                          href={`mailto:${dm.email}`}
                          className="flex items-center gap-1.5 text-blue-400 hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {dm.email}
                        </a>
                        {dm.phone && (
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {dm.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={dm.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OUTREACH PITCH GENERATOR */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Automated Executive Cold Outreach Pitch
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pre-populated with exact permit reference, square footage, and submarket benchmark.
                  </p>
                </div>
                <button
                  onClick={handleCopyPitch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition"
                >
                  {copiedPitch ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Pitch Email</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {coldPitchText}
              </div>

              <div className="flex justify-end gap-2">
                <a
                  href={`mailto:${primaryDM?.email || ''}?subject=${encodeURIComponent(`Commercial fit-out tender - ${lead.companyName}`)}&body=${encodeURIComponent(coldPitchText)}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open in Mail Client</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 text-[11px]">
            Ingested on {lead.createdAt} • Channel: {lead.sourceChannel}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
