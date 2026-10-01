import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Clock, 
  FileSpreadsheet, 
  Settings, 
  Check, 
  Plus, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AutoExportRule, RenovationLead } from '../types';
import { CSV_COLUMN_DEFINITIONS, exportLeadsToCSV, triggerDownload } from '../utils/csvExporter';

interface AutoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportRules: AutoExportRule[];
  onToggleRule: (ruleId: string) => void;
  onAddNewRule: (newRule: AutoExportRule) => void;
  leads: RenovationLead[];
  canExport: boolean;
}

export const AutoExportModal: React.FC<AutoExportModalProps> = ({
  isOpen,
  onClose,
  exportRules,
  onToggleRule,
  onAddNewRule,
  leads,
  canExport,
}) => {
  if (!isOpen) return null;

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    CSV_COLUMN_DEFINITIONS.map(c => c.key)
  );
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // New rule form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleFreq, setNewRuleFreq] = useState<'Daily (06:00 AM)' | 'Real-time on Lead Score > 85' | 'Weekly Summary (Sun)' | 'Instant Trigger'>('Daily (06:00 AM)');
  const [newRuleMinScore, setNewRuleMinScore] = useState(80);

  const handleToggleColumn = (key: string) => {
    setSelectedColumns(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(CSV_COLUMN_DEFINITIONS.map(c => c.key));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns(['companyName', 'squareFootage', 'estimatedBudget', 'leadQualityScore']);
  };

  const handleImmediateDownload = () => {
    if (!canExport) return;
    const { csvString, filename } = exportLeadsToCSV(leads, selectedColumns);
    triggerDownload(csvString, filename);
    setDownloadSuccess(`Generated and downloaded ${filename} (${leads.length} commercial leads)!`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: AutoExportRule = {
      id: `exp-${Date.now()}`,
      name: newRuleName.trim(),
      frequency: newRuleFreq,
      format: 'CSV',
      destination: 'Auto-Export Storage',
      minScore: newRuleMinScore,
      columns: selectedColumns,
      enabled: true,
      lastTriggered: 'Scheduled for next cycle',
    };

    onAddNewRule(newRule);
    setNewRuleName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Kuala Lumpur Automated CSV & Data Export Engine
              </h2>
              <p className="text-xs text-slate-400">
                Configure scheduled daily automated CSV dumps, CRM webhook sync, and custom column definitions for KL commercial projects
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Quick Immediate Export Action Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Immediate Full KL Pipeline Export ({leads.length} Records)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exports all active Kuala Lumpur office renovation leads formatted with RFC 4180 compliance.
              </p>
            </div>

            <button
              onClick={handleImmediateDownload}
              disabled={!canExport}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                canExport
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download CSV File Now</span>
            </button>
          </div>

          {/* Scheduled Automated Rules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Export Schedules & Rules
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {showAddForm ? 'Cancel New Rule' : 'Create Auto-Export Rule'}
              </button>
            </div>

            {/* Add Rule Form */}
            {showAddForm && (
              <form onSubmit={handleCreateRule} className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
                <div className="font-bold text-amber-400 text-xs">New Automated Export Schedule</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Rule Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daily CRM Ingestion Sync"
                      value={newRuleName}
                      onChange={e => setNewRuleName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Frequency</label>
                    <select
                      value={newRuleFreq}
                      onChange={e => setNewRuleFreq(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="Daily (06:00 AM)">Daily (06:00 AM)</option>
                      <option value="Real-time on Lead Score > 85">Real-time on Lead Score &gt; 85</option>
                      <option value="Weekly Summary (Sun)">Weekly Summary (Sun)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Min Score Threshold</label>
                    <input
                      type="number"
                      min={50}
                      max={95}
                      value={newRuleMinScore}
                      onChange={e => setNewRuleMinScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg"
                  >
                    Save Automated Rule
                  </button>
                </div>
              </form>
            )}

            {/* Rules Cards */}
            <div className="space-y-2">
              {exportRules.map(rule => (
                <div
                  key={rule.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {rule.name}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                        {rule.format}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Min Score: {rule.minScore}+
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Schedule: <strong className="text-slate-300">{rule.frequency}</strong></span>
                      <span>•</span>
                      <span>Target: <strong className="text-blue-400">{rule.destination}</strong></span>
                      <span>•</span>
                      <span>{rule.lastTriggered || 'Active'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => onToggleRule(rule.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Column Selection */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Configurable CSV Column Output Fields
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select which fields are included in automated CSV downloads & daily attachments
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="text-amber-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAllColumns}
                  className="text-slate-400 hover:underline"
                >
                  Essential Only
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
              {CSV_COLUMN_DEFINITIONS.map(col => {
                const isChecked = selectedColumns.includes(col.key);
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      isChecked
                        ? 'bg-slate-900 border-amber-500/40 text-slate-200'
                        : 'bg-slate-950 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleColumn(col.key)}
                      className="accent-amber-500"
                    />
                    <span className="truncate">{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Selected: {selectedColumns.length} of {CSV_COLUMN_DEFINITIONS.length} export columns
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
