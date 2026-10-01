import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Plus, 
  Globe, 
  Server, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { ScraperJob, RenovationLead, SourceChannel } from '../types';
import { calculateLeadScore, formatNumber } from '../utils/scoring';

interface ScraperHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  scraperJobs: ScraperJob[];
  onTriggerScraper: (jobId: string) => void;
  onAddNewLead: (newLead: RenovationLead) => void;
  canRunScrapers: boolean;
}

export const ScraperHubModal: React.FC<ScraperHubModalProps> = ({
  isOpen,
  onClose,
  scraperJobs,
  onTriggerScraper,
  onAddNewLead,
  canRunScrapers,
}) => {
  if (!isOpen) return null;

  const [activeJobRunning, setActiveJobRunning] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[SYSTEM] Scraper Orchestrator initialized. Malaysia residential proxy pool online (Cyberjaya & KL Gateway).',
    '[CRON] DBKL OSC 3.0 Commercial Alterations crawler last ran at 07:15:00 MYT (168 records parsed).',
    '[STREAM] Real-time LinkedIn Malaysia workplace executive moves monitoring: active.'
  ]);

  // Live Extractor state
  const [customUrl, setCustomUrl] = useState('');
  const [customChannel, setCustomChannel] = useState<SourceChannel>('Permit Registry');
  const [customMetro, setCustomMetro] = useState('TRX - Tun Razak Exchange Financial Hub');
  const [isExtractingCustom, setIsExtractingCustom] = useState(false);
  const [extractionResult, setExtractionResult] = useState<string | null>(null);

  // Simulate streaming scraper execution
  const handleRunJob = (job: ScraperJob) => {
    if (!canRunScrapers) return;
    setActiveJobRunning(job.id);
    onTriggerScraper(job.id);

    const timestamp = new Date().toLocaleTimeString();
    const newLogs = [
      `[${timestamp}] [INIT] Spawning worker for: "${job.name}"`,
      `[${timestamp}] [NETWORK] Rotating proxy node -> MY-CYBERJAYA-RESIDENTIAL-4921 (Latency: 14ms)`,
      `[${timestamp}] [CRAWL] Fetching target: ${job.targetUrl}`,
      `[${timestamp}] [PARSE] Extracting DOM nodes matching keywords: ${job.keywords.slice(0, 3).join(', ')}...`,
      `[${timestamp}] [VALIDATE] Filtering records with square footage >= ${job.minSqFtFilter} sq ft...`,
      `[${timestamp}] [DEDUP] Checking DBKL OSC 3.0 permit registry for duplicates... (0 collisions)`,
      `[${timestamp}] [SUCCESS] Successfully extracted 3 new high-confidence KL commercial renovation leads!`,
      `[${timestamp}] [PIPELINE] Ingested into database with AI qualification scores.`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < newLogs.length) {
        setConsoleLogs(prev => [...prev.slice(-15), newLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
        setActiveJobRunning(null);
      }
    }, 400);
  };

  // Instant Custom URL Live Extractor
  const handleInstantScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !canRunScrapers) return;

    setIsExtractingCustom(true);
    setExtractionResult(null);

    const urlDomain = customUrl.replace('https://', '').replace('http://', '').split('/')[0];
    const companyClean = urlDomain.split('.')[0].toUpperCase();

    // Simulate extraction latency & synthesize lead
    setTimeout(() => {
      const generatedLeadId = `lead-${Date.now()}`;
      const sqFt = Math.floor(Math.random() * 25000) + 15000;
      const budgetRate = Math.floor(Math.random() * 40) + 150;
      const estimatedBudget = sqFt * budgetRate;

      const mockExtractedLead: RenovationLead = {
        id: generatedLeadId,
        companyName: `${companyClean.charAt(0) + companyClean.slice(1).toLowerCase()} Malaysia Tech Hub`,
        industry: 'Enterprise Software & Cloud',
        website: customUrl,
        officeAddress: 'The Exchange 106, Level 32, Lingkaran TRX',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan Kuala Lumpur',
        metroRegion: customMetro,
        projectType: 'Cat B Interior Renovation',
        squareFootage: sqFt,
        estimatedBudget: estimatedBudget,
        budgetPerSqFt: budgetRate,
        timeline: 'Within 45 Days',
        permitNumber: `DBKL/JPRB/UB/2026/${Math.floor(Math.random() * 8999) + 1000}`,
        permitJurisdiction: 'Dewan Bandaraya Kuala Lumpur (DBKL OSC 3.0 Plus)',
        permitFilingDate: new Date().toISOString().slice(0, 10),
        permitStatus: 'Approved',
        leadQualityScore: 88,
        scoreBreakdown: {
          intentSignals: 23,
          sqFtVolume: 17,
          permitProgress: 24,
          decisionMakerReachability: 12,
          financialHealth: 12,
        },
        sourceChannel: customChannel,
        sourceUrl: customUrl,
        hiringSignal: 'Lease signed for new executive branch; hiring VP of Workplace Operations Malaysia.',
        creditRating: 'AA',
        annualRevenue: 'RM 140M Turnover',
        decisionMakers: [
          {
            id: `dm-${Date.now()}`,
            name: 'Ahmad Faiz bin Zulkarnain',
            title: 'Head of Facilities & Corporate Projects',
            email: `faiz.z@${urlDomain}`,
            phone: '+60 3-2181 8800',
            linkedinUrl: `https://linkedin.com/in/faiz-facilities-kl`,
            isPrimary: true,
          }
        ],
        stage: 'New Ingested',
        notes: `Automatically extracted from ${customUrl} via RenoLeads scraper engine.`,
        tags: ['Live Scraped', 'Hot Lead', 'Cat B Interior', 'TRX Hub'],
        createdAt: new Date().toISOString().slice(0, 10),
        lastActivity: 'Just now',
        isHotLead: true,
      };

      onAddNewLead(mockExtractedLead);
      setIsExtractingCustom(false);
      setExtractionResult(`Successfully extracted renovation lead: "${mockExtractedLead.companyName}" (${formatNumber(sqFt)} sq ft, RM ${(estimatedBudget/1000000).toFixed(1)}M budget)!`);
      setCustomUrl('');

      setConsoleLogs(prev => [
        ...prev.slice(-15),
        `[USER_SCRAPE] Ingested URL: ${customUrl} -> Extracted Company: ${mockExtractedLead.companyName} (Score: 88)`
      ]);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Kuala Lumpur Automated Web Scrapers & Extraction Orchestrator
                </h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  5 Crawlers Configured
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuous DBKL OSC 3.0 permit monitoring, LinkedIn Malaysia relocation signals, and CIDB commercial construction tenders
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Section 1: Instant URL Live Scraper */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-amber-400" />
                Instant Target Extractor / Live URL Scrape (KL Commercial)
              </h3>
              <span className="text-[10px] text-slate-400">
                Paste any DBKL e-Lesen permit page, iProperty / PropertyGuru commercial listing, or corporate domain
              </span>
            </div>

            <form onSubmit={handleInstantScrape} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <input
                type="url"
                required
                placeholder="https://example.com.my/press/new-trx-headquarters or DBKL permit URL"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                disabled={!canRunScrapers || isExtractingCustom}
                className="sm:col-span-6 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <select
                value={customChannel}
                onChange={e => setCustomChannel(e.target.value as SourceChannel)}
                disabled={!canRunScrapers || isExtractingCustom}
                className="sm:col-span-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
              >
                <option value="Permit Registry">Permit Registry</option>
                <option value="LinkedIn Signal">LinkedIn Signal</option>
                <option value="Commercial Real Estate">Commercial Real Estate</option>
                <option value="Google Maps & Directories">Google Maps & Directories</option>
                <option value="Construction Tenders">Construction Tenders</option>
              </select>

              <button
                type="submit"
                disabled={!canRunScrapers || isExtractingCustom}
                className={`sm:col-span-3 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition shadow ${
                  canRunScrapers && !isExtractingCustom
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isExtractingCustom ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract & Ingest</span>
                  </>
                )}
              </button>
            </form>

            {extractionResult && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{extractionResult}</span>
              </div>
            )}
          </div>

          {/* Section 2: Configured Automated Scrapers List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Active Sourcing Channels & Crawlers</span>
              <span className="text-slate-400 font-normal">Auto-rotating proxies enabled</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {scraperJobs.map(job => {
                const isRunning = activeJobRunning === job.id;

                return (
                  <div
                    key={job.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">
                          {job.name}
                        </span>
                        <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                          {job.channel}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {job.confidenceScore}% Confidence
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                        <span>Target: <strong className="text-slate-200">{job.targetJurisdiction}</strong></span>
                        <span>•</span>
                        <span>Schedule: <strong className="text-amber-400">{job.schedule}</strong></span>
                        <span>•</span>
                        <span>Proxy Pool: <strong className="text-blue-400">{job.proxyPool}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-slate-500">Keywords:</span>
                        {job.keywords.map((kw, idx) => (
                          <span key={idx} className="bg-slate-900 text-slate-400 text-[9px] px-1.5 py-0.2 rounded border border-slate-800">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-slate-800/80 pt-2 md:pt-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white font-mono">
                          {job.leadsExtractedCount} leads
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Last run: {job.lastRun}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRunJob(job)}
                        disabled={!canRunScrapers || isRunning}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          isRunning
                            ? 'bg-amber-600 text-white animate-pulse'
                            : canRunScrapers
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Crawling...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Run Scraper Now</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Live Scraper Terminal / Console Output */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
              <span className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE CRAWLER LOGS & PACKET STREAM
              </span>
              <button 
                onClick={() => setConsoleLogs(['[SYSTEM] Console cleared. Listening for crawler packets...'])}
                className="text-[10px] text-slate-500 hover:text-white"
              >
                Clear Console
              </button>
            </div>

            <div className="font-mono text-[11px] text-slate-300 space-y-1 max-h-36 overflow-y-auto leading-relaxed">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="truncate">
                  {log.includes('[SUCCESS]') ? (
                    <span className="text-emerald-400 font-bold">{log}</span>
                  ) : log.includes('[INIT]') || log.includes('[CRAWL]') ? (
                    <span className="text-blue-400">{log}</span>
                  ) : log.includes('[USER_SCRAPE]') ? (
                    <span className="text-amber-400">{log}</span>
                  ) : (
                    <span className="text-slate-400">{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Proxy Rotation: Active • Deduplication Database: SQLite / Cloud Sync
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close Scraper Hub
          </button>
        </div>

      </div>
    </div>
  );
};
