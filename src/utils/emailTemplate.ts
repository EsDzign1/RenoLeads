import { RenovationLead, DailyEmailDigestConfig } from '../types';
import { formatCurrency, formatNumber } from './scoring';

export function generateDailyEmailDigest(leads: RenovationLead[], config: DailyEmailDigestConfig): {
  subject: string;
  htmlContent: string;
  filteredLeads: RenovationLead[];
} {
  // Filter leads based on config
  const filtered = leads.filter(lead => {
    if (lead.leadQualityScore < config.filterMinQualityScore) return false;
    if (lead.squareFootage < config.filterMinSqFt) return false;
    if (config.selectedMetroAreas.length > 0 && !config.selectedMetroAreas.includes(lead.metroRegion)) {
      return false;
    }
    return true;
  }).sort((a, b) => b.leadQualityScore - a.leadQualityScore);

  const hotCount = filtered.filter(l => l.isHotLead || l.leadQualityScore >= 85).length;
  const permitsCount = filtered.filter(l => l.permitStatus === 'Approved').length;
  const totalPipelineValue = filtered.reduce((acc, l) => acc + l.estimatedBudget, 0);
  const totalSqFt = filtered.reduce((acc, l) => acc + l.squareFootage, 0);

  const subject = config.emailSubjectTemplate
    .replace('{{hot_leads_count}}', String(hotCount))
    .replace('{{permits_count}}', String(permitsCount))
    .replace('{{total_sqft}}', formatNumber(totalSqFt))
    .replace('{{pipeline_value}}', formatCurrency(totalPipelineValue));

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const leadCardsHtml = filtered.slice(0, 5).map(lead => {
    const primaryDM = lead.decisionMakers[0];
    return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 9999px; margin-bottom: 6px;">
              Score: ${lead.leadQualityScore}/100 • ${lead.isHotLead ? '🔥 Hot Lead' : 'Qualified'}
            </span>
            <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700;">
              ${lead.companyName}
            </h3>
            <p style="margin: 3px 0 0; font-size: 13px; color: #64748b;">
              📍 ${lead.officeAddress}, ${lead.city} • <strong style="color: #0284c7;">${lead.metroRegion}</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${formatCurrency(lead.estimatedBudget)}</div>
            <div style="font-size: 12px; color: #64748b;">${formatNumber(lead.squareFootage)} sq ft (RM ${lead.budgetPerSqFt}/sqft)</div>
          </div>
        </div>

        <div style="background: #f8fafc; border-left: 3px solid #3b82f6; padding: 8px 12px; margin: 10px 0; font-size: 13px; color: #334155;">
          <strong>Renovation Scope:</strong> ${lead.projectType} • <em>${lead.timeline}</em><br/>
          <strong>DBKL / PBT Permit:</strong> <span style="font-family: monospace;">${lead.permitNumber || 'Filing in progress'}</span> (${lead.permitStatus})
        </div>

        ${lead.hiringSignal ? `
        <div style="font-size: 12px; color: #475569; margin: 6px 0;">
          ⚡ <strong>Intent Signal:</strong> ${lead.hiringSignal}
        </div>
        ` : ''}

        ${primaryDM ? `
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
          <div>
            <strong>Key Decision Maker:</strong> ${primaryDM.name} (${primaryDM.title})
          </div>
          <div>
            <a href="mailto:${primaryDM.email}" style="color: #2563eb; text-decoration: none; font-weight: 600; margin-right: 12px;">
              ✉️ Email Contact
            </a>
            ${primaryDM.phone ? `<span style="color: #64748b;">📞 ${primaryDM.phone}</span>` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }).join('');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;">
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 24px; color: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #f59e0b;">
          RenoLeads Daily Intelligence
        </span>
        <span style="font-size: 12px; color: #94a3b8;">${dateStr} (MYT)</span>
      </div>
      <h1 style="margin: 12px 0 6px; font-size: 24px; font-weight: 800; color: #f8fafc;">
        Kuala Lumpur Office Renovation Sales Briefing
      </h1>
      <p style="margin: 0; font-size: 14px; color: #cbd5e1;">
        Automated scrape extraction summary for commercial interior fit-outs, DBKL permit filings & corporate relocations across TRX, KLCC, KL Sentral & Bangsar South.
      </p>
    </div>

    <!-- Quick Metrics Bar -->
    <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 16px 24px; display: flex; justify-content: space-between;">
      <div style="text-align: center;">
        <div style="font-size: 20px; font-weight: 800; color: #d97706;">${hotCount}</div>
        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Hot Leads (>80)</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 20px; font-weight: 800; color: #0284c7;">${permitsCount}</div>
        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">DBKL Permits Lulus</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 20px; font-weight: 800; color: #059669;">${formatCurrency(totalPipelineValue)}</div>
        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">KL Pipeline (RM)</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 20px; font-weight: 800; color: #7c3aed;">${formatNumber(totalSqFt)}</div>
        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Total Sq Ft</div>
      </div>
    </div>

    <!-- Main Content -->
    <div style="padding: 24px;">
      <div style="margin-bottom: 18px;">
        <h2 style="margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #1e293b;">
          Top Actionable KL Renovation Opportunities Today
        </h2>
        <p style="margin: 0; font-size: 13px; color: #64748b;">
          Filtered by min quality score ≥ ${config.filterMinQualityScore} and min area ≥ ${formatNumber(config.filterMinSqFt)} sq ft across primary Kuala Lumpur precincts.
        </p>
      </div>

      ${leadCardsHtml}

      <!-- Footer Info & Automated CSV Notice -->
      <div style="background: #f1f5f9; border-radius: 8px; padding: 14px; margin-top: 20px; font-size: 12px; color: #475569;">
        <div style="font-weight: 600; margin-bottom: 4px; color: #0f172a;">
          📎 Automated CSV Dataset:
        </div>
        <div>
          ${config.autoExportCsvAttachment ? 'A structured CSV file containing complete DBKL permit records, key decision maker contacts, and estimating notes has been generated and attached.' : 'CSV export attachment is currently paused in settings.'}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #ffffff; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      RenoLeads Scraper Orchestrator • Monitoring DBKL OSC 3.0 registries, LinkedIn Malaysia relocations, and CIDB construction tenders.<br/>
      Sent to: ${config.recipientEmails.join(', ')}
    </div>

  </div>
</body>
</html>
  `;

  return { subject, htmlContent, filteredLeads: filtered };
}
