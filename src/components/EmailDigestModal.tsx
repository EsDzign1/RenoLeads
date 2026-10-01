import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Check, 
  Copy, 
  Clock, 
  Filter, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Flame, 
  Building2,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { DailyEmailDigestConfig, RenovationLead } from '../types';
import { generateDailyEmailDigest } from '../utils/emailTemplate';
import { formatCurrency, formatNumber } from '../utils/scoring';

interface EmailDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DailyEmailDigestConfig;
  onUpdateConfig: (newConfig: DailyEmailDigestConfig) => void;
  leads: RenovationLead[];
  canConfigure: boolean;
}

export const EmailDigestModal: React.FC<EmailDigestModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  leads,
  canConfigure,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [recipientInput, setRecipientInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Generate digest content
  const { subject, htmlContent, filteredLeads } = generateDailyEmailDigest(leads, config);

  // Handle Add recipient
  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientInput.trim() || !recipientInput.includes('@')) return;
    if (config.recipientEmails.includes(recipientInput.trim())) return;

    const updated = {
      ...config,
      recipientEmails: [...config.recipientEmails, recipientInput.trim()],
    };
    onUpdateConfig(updated);
    setRecipientInput('');
  };

  const handleRemoveRecipient = (email: string) => {
    const updated = {
      ...config,
      recipientEmails: config.recipientEmails.filter(e => e !== email),
    };
    onUpdateConfig(updated);
  };

  // Simulate Instant Dispatch
  const handleTriggerDispatch = () => {
    setIsSending(true);
    setSentNotice(null);

    setTimeout(() => {
      setIsSending(false);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = {
        ...config,
        lastSentTimestamp: `Just now (${nowStr}) to ${config.recipientEmails.length} recipients`,
      };
      onUpdateConfig(updated);
      setSentNotice(`Successfully dispatched daily email digest to ${config.recipientEmails.join(', ')} with ${filteredLeads.length} filtered actionable leads!`);
    }, 1200);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Kuala Lumpur Automated Daily Email Briefing & Sales Insights
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  config.enabled 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {config.enabled ? '● Active: Scheduled 08:00 AM MYT' : '○ Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Delivers filtered, high-intent KL renovation opportunities and DBKL permit filings directly to stakeholder inboxes
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

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 text-xs font-semibold">
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-3 px-4 border-b-2 transition ${
                activeTab === 'preview'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Morning Briefing Preview ({filteredLeads.length} Actionable Leads)
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Delivery & Filter Rules
            </button>
          </div>

          {/* Quick Action in Header */}
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
            </button>

            <button
              onClick={handleTriggerDispatch}
              disabled={isSending}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Now'}</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {sentNotice && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{sentNotice}</span>
            </div>
          )}

          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              
              {/* Email Envelope Meta Bar */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-16">Subject:</span>
                  <span className="text-white font-medium truncate">{subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-16">To:</span>
                  <span className="text-amber-400 truncate">{config.recipientEmails.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-16">Status:</span>
                  <span className="text-slate-300">{config.lastSentTimestamp || 'Pending scheduled 08:00 AM MYT dispatch'}</span>
                </div>
              </div>

              {/* Rendered Email Container */}
              <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-100 text-slate-900 shadow-inner">
                <div className="bg-slate-200/90 px-4 py-2 text-[11px] text-slate-600 font-mono flex items-center justify-between border-b border-slate-300">
                  <span>Interactive HTML Email Preview (Rendered Client-Side)</span>
                  <span>Filtered: Quality Score ≥ {config.filterMinQualityScore}</span>
                </div>

                <div 
                  className="p-4 overflow-y-auto max-h-[500px]"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>

            </div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Enable / Frequency */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Daily Dispatch Automation</h3>
                    <p className="text-xs text-slate-400">Trigger daily morning summary to KL sales directors and estimating team</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      disabled={!canConfigure}
                      onChange={e => onUpdateConfig({ ...config, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Dispatch Time</label>
                    <input
                      type="text"
                      value={config.dispatchTime}
                      disabled={!canConfigure}
                      onChange={e => onUpdateConfig({ ...config, dispatchTime: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Frequency</label>
                    <select
                      value={config.frequency}
                      disabled={!canConfigure}
                      onChange={e => onUpdateConfig({ ...config, frequency: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    >
                      <option value="daily">Daily Morning Digest (Recommended)</option>
                      <option value="twice_daily">Twice Daily (Morning & Evening Close)</option>
                      <option value="weekly">Weekly Commercial Pipeline Summary</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filtering Criteria */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-400" />
                  Filter Thresholds for Daily Email Inclusion
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Minimum Quality Score:</span>
                      <strong className="text-amber-400 font-mono">{config.filterMinQualityScore} / 100</strong>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={config.filterMinQualityScore}
                      disabled={!canConfigure}
                      onChange={e => onUpdateConfig({ ...config, filterMinQualityScore: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500">Only opportunities passing this threshold are featured in the email</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Minimum Area (Sq Ft):</span>
                      <strong className="text-blue-400 font-mono">{formatNumber(config.filterMinSqFt)} sq ft</strong>
                    </div>
                    <input
                      type="range"
                      min={5000}
                      max={35000}
                      step={5000}
                      value={config.filterMinSqFt}
                      disabled={!canConfigure}
                      onChange={e => onUpdateConfig({ ...config, filterMinSqFt: Number(e.target.value) })}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500">Filters out small office suites to focus on high-yield fit-outs</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="csvAttach"
                    checked={config.autoExportCsvAttachment}
                    disabled={!canConfigure}
                    onChange={e => onUpdateConfig({ ...config, autoExportCsvAttachment: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <label htmlFor="csvAttach" className="text-xs text-slate-300 cursor-pointer">
                    Automatically attach complete structured CSV dataset to the daily email
                  </label>
                </div>
              </div>

              {/* Recipient Management */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Recipient Distribution List</h3>
                
                <form onSubmit={handleAddRecipient} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="add.stakeholder@company.com"
                    value={recipientInput}
                    disabled={!canConfigure}
                    onChange={e => setRecipientInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!canConfigure}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Add Recipient
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-1">
                  {config.recipientEmails.map(email => (
                    <span key={email} className="bg-slate-900 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-amber-400" />
                      {email}
                      {canConfigure && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(email)}
                          className="text-slate-400 hover:text-rose-400 ml-1"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Email Engine: SMTP / SendGrid / AWS SES relay compatible
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
