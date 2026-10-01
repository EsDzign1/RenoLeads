import { RenovationLead } from '../types';

export const CSV_COLUMN_DEFINITIONS = [
  { key: 'companyName', label: 'Company Name' },
  { key: 'industry', label: 'Industry Sector' },
  { key: 'leadQualityScore', label: 'Quality Score (0-100)' },
  { key: 'isHotLead', label: 'Hot Lead Flag' },
  { key: 'projectType', label: 'Renovation Project Type' },
  { key: 'squareFootage', label: 'Square Footage (sq ft)' },
  { key: 'estimatedBudget', label: 'Estimated Budget (RM)' },
  { key: 'budgetPerSqFt', label: 'Budget/SqFt (RM)' },
  { key: 'officeAddress', label: 'Commercial Building & Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State / Federal Territory' },
  { key: 'metroRegion', label: 'KL Commercial Precinct' },
  { key: 'permitNumber', label: 'DBKL Permit / OSC Reference' },
  { key: 'permitJurisdiction', label: 'Local Authority (PBT / DBKL)' },
  { key: 'permitStatus', label: 'Renovation Approval Status' },
  { key: 'timeline', label: 'Target Completion Timeline' },
  { key: 'sourceChannel', label: 'Sourcing Channel' },
  { key: 'stage', label: 'Sales Pipeline Stage' },
  { key: 'primaryDecisionMaker', label: 'Key Contact / Decision Maker' },
  { key: 'contactTitle', label: 'Designation / Title' },
  { key: 'contactEmail', label: 'Verified Corporate Email' },
  { key: 'contactPhone', label: 'Direct / Office Contact' },
  { key: 'creditRating', label: 'Financial Health / SSM Status' },
  { key: 'hiringSignal', label: 'Workplace & Expansion Signal' },
  { key: 'notes', label: 'Commercial Fit-Out & Tender Notes' },
];

export function exportLeadsToCSV(leads: RenovationLead[], selectedColumnKeys?: string[]): { csvString: string; filename: string } {
  const activeColumns = selectedColumnKeys && selectedColumnKeys.length > 0
    ? CSV_COLUMN_DEFINITIONS.filter(col => selectedColumnKeys.includes(col.key))
    : CSV_COLUMN_DEFINITIONS;

  // Header row
  const headers = activeColumns.map(col => `"${col.label.replace(/"/g, '""')}"`).join(',');

  // Data rows
  const rows = leads.map(lead => {
    return activeColumns.map(col => {
      let value: any = '';

      switch (col.key) {
        case 'companyName':
          value = lead.companyName;
          break;
        case 'industry':
          value = lead.industry;
          break;
        case 'leadQualityScore':
          value = lead.leadQualityScore;
          break;
        case 'isHotLead':
          value = lead.isHotLead ? 'YES' : 'NO';
          break;
        case 'projectType':
          value = lead.projectType;
          break;
        case 'squareFootage':
          value = lead.squareFootage;
          break;
        case 'estimatedBudget':
          value = lead.estimatedBudget;
          break;
        case 'budgetPerSqFt':
          value = lead.budgetPerSqFt;
          break;
        case 'officeAddress':
          value = lead.officeAddress;
          break;
        case 'city':
          value = lead.city;
          break;
        case 'state':
          value = lead.state;
          break;
        case 'metroRegion':
          value = lead.metroRegion;
          break;
        case 'permitNumber':
          value = lead.permitNumber || 'N/A';
          break;
        case 'permitJurisdiction':
          value = lead.permitJurisdiction || 'N/A';
          break;
        case 'permitStatus':
          value = lead.permitStatus;
          break;
        case 'timeline':
          value = lead.timeline;
          break;
        case 'sourceChannel':
          value = lead.sourceChannel;
          break;
        case 'stage':
          value = lead.stage;
          break;
        case 'primaryDecisionMaker':
          value = lead.decisionMakers[0]?.name || 'N/A';
          break;
        case 'contactTitle':
          value = lead.decisionMakers[0]?.title || 'N/A';
          break;
        case 'contactEmail':
          value = lead.decisionMakers[0]?.email || 'N/A';
          break;
        case 'contactPhone':
          value = lead.decisionMakers[0]?.phone || 'N/A';
          break;
        case 'creditRating':
          value = lead.creditRating || 'N/A';
          break;
        case 'hiringSignal':
          value = lead.hiringSignal || 'N/A';
          break;
        case 'notes':
          value = lead.notes || '';
          break;
        default:
          value = (lead as any)[col.key] || '';
      }

      if (value === null || value === undefined) {
        return '""';
      }
      const stringified = String(value).replace(/"/g, '""');
      return `"${stringified}"`;
    }).join(',');
  });

  const csvString = [headers, ...rows].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `kl_office_renovation_leads_${dateStr}_${leads.length}leads.csv`;

  return { csvString, filename };
}

export function triggerDownload(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
