import { RenovationLead, LeadScoreBreakdown } from '../types';

export function calculateLeadScore(lead: Partial<RenovationLead>): {
  score: number;
  breakdown: LeadScoreBreakdown;
  tier: 'Tier 1 - Hot (85-100)' | 'Tier 2 - Warm (65-84)' | 'Tier 3 - Nurture (<65)';
} {
  // 1. Intent signals (0-25)
  let intentSignals = 14;
  if (lead.hiringSignal) intentSignals += 5;
  if (lead.timeline?.toLowerCase().includes('immediate') || lead.timeline?.toLowerCase().includes('30 days')) intentSignals += 6;
  if (lead.sourceChannel === 'Permit Registry' || lead.sourceChannel === 'Construction Tenders') intentSignals += 4;
  intentSignals = Math.min(25, intentSignals);

  // 2. SqFt Volume (0-20)
  const sqft = lead.squareFootage || 10000;
  let sqFtVolume = 10;
  if (sqft >= 35000) sqFtVolume = 20;
  else if (sqft >= 25000) sqFtVolume = 18;
  else if (sqft >= 15000) sqFtVolume = 16;
  else if (sqft >= 10000) sqFtVolume = 13;
  else sqFtVolume = 10;

  // 3. Permit Progress (0-25)
  let permitProgress = 12;
  if (lead.permitStatus === 'Approved') permitProgress = 25;
  else if (lead.permitStatus === 'Plan Check') permitProgress = 21;
  else if (lead.permitStatus === 'Under Review') permitProgress = 18;
  else if (lead.permitStatus === 'Pre-Filing') permitProgress = 14;

  // 4. Decision Maker Reachability (0-15)
  let reachability = 8;
  const primaryDM = lead.decisionMakers?.[0];
  if (primaryDM?.email && primaryDM.email.includes('@')) reachability += 4;
  if (primaryDM?.linkedinUrl) reachability += 2;
  if (primaryDM?.phone) reachability += 1;
  reachability = Math.min(15, reachability);

  // 5. Financial Health (0-15)
  let financialHealth = 10;
  if (lead.creditRating === 'AAA') financialHealth = 15;
  else if (lead.creditRating === 'AA') financialHealth = 14;
  else if (lead.creditRating === 'A') financialHealth = 12;
  else if (lead.creditRating === 'Growth / VC') financialHealth = 13;
  else financialHealth = 10;

  const totalScore = intentSignals + sqFtVolume + permitProgress + reachability + financialHealth;

  let tier: 'Tier 1 - Hot (85-100)' | 'Tier 2 - Warm (65-84)' | 'Tier 3 - Nurture (<65)';
  if (totalScore >= 85) {
    tier = 'Tier 1 - Hot (85-100)';
  } else if (totalScore >= 65) {
    tier = 'Tier 2 - Warm (65-84)';
  } else {
    tier = 'Tier 3 - Nurture (<65)';
  }

  return {
    score: totalScore,
    breakdown: {
      intentSignals,
      sqFtVolume,
      permitProgress,
      decisionMakerReachability: reachability,
      financialHealth,
    },
    tier,
  };
}

export function formatCurrency(num: number): string {
  if (num >= 1000000) {
    return `RM ${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `RM ${(num / 1000).toFixed(0)}k`;
  }
  return `RM ${num.toLocaleString()}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}
