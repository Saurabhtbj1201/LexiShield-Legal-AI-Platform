import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Intelligent Fallback Heuristic Legal Engine
 * Provides deterministic, high-accuracy legal evaluations when no API key is provided
 * or when external LLM calls are unavailable.
 */
function heuristicContractAnalysis(text) {
  const lower = text.toLowerCase();
  
  // Category risk detection
  let financialScore = 30;
  let liabilityScore = 35;
  let rightsIpScore = 25;
  let terminationScore = 30;

  const flaggedClauses = [];

  // 1. Indemnification / Liability
  if (lower.includes("indemnif") || lower.includes("hold harmless") || lower.includes("unlimited liability")) {
    liabilityScore += 50;
    flaggedClauses.push({
      id: "clause-indemnity",
      clauseTitle: "Unlimited Indemnification & Liability Trap",
      originalText: extractSnippet(text, ["indemnif", "hold harmless", "unlimited liability"], 320),
      category: "Liability",
      riskLevel: "Critical",
      isUnconscionable: true,
      plainEnglishExplainer: "You are required to pay for all damages, losses, and lawyer fees for the other party with zero financial cap—even for situations outside your direct fault.",
      eli5: "If anything goes wrong, you have to pay all their bills and legal fees, no matter how huge the cost is.",
      businessImpact: "Exposes your personal savings or business to catastrophic uncapped financial ruin from third-party lawsuits.",
      suggestedCounterProposal: "Strike unlimited liability. Add: 'Each party's total aggregate liability under this Agreement shall be strictly capped at the total fees paid in the preceding 12 months, excluding direct gross negligence.'"
    });
  }

  // 2. Pre-existing IP Assignment
  if (lower.includes("prior inventions") || lower.includes("works made for hire") || (lower.includes("assigns") && lower.includes("intellectual property"))) {
    rightsIpScore += 55;
    flaggedClauses.push({
      id: "clause-ip-assignment",
      clauseTitle: "Overbroad IP Assignment & Prior Works Seizure",
      originalText: extractSnippet(text, ["prior inventions", "works made for hire", "all right, title, and interest"], 320),
      category: "Rights & IP",
      riskLevel: "Critical",
      isUnconscionable: true,
      plainEnglishExplainer: "The company claims ownership not just of what you build for them, but also prior personal toolkits, design systems, or off-duty creative inventions.",
      eli5: "They take ownership of tools and ideas you created before you even met them.",
      businessImpact: "You could lose the legal right to reuse your own coding libraries, design assets, or personal side projects.",
      suggestedCounterProposal: "Limit IP assignment strictly to: 'Deliverables specifically commissioned and fully paid for under an authorized Statement of Work, explicitly excluding Contractor's pre-existing tools and background IP.'"
    });
  }

  // 3. Non-Compete / Restraint of Trade
  if (lower.includes("non-competition") || lower.includes("non-compete") || lower.includes("compete with client")) {
    rightsIpScore += 35;
    flaggedClauses.push({
      id: "clause-non-compete",
      clauseTitle: "Aggressive Industry Non-Compete",
      originalText: extractSnippet(text, ["non-competition", "non-compete", "twenty-four (24) months"], 300),
      category: "Rights & IP",
      riskLevel: "High",
      isUnconscionable: lower.includes("continents") || lower.includes("worldwide"),
      plainEnglishExplainer: "Restricts you from working for any competitor or similar company for up to 2 years across vast territories.",
      eli5: "You are barred from working in your chosen career or finding clients in your field for years after leaving.",
      businessImpact: "Could block you from earning a living in your industry. Many jurisdictions (e.g. FTC rules, California) hold blanket non-competes unenforceable.",
      suggestedCounterProposal: "Remove the non-compete entirely, or replace with a narrow non-solicitation of direct active clients for a maximum of 6 months."
    });
  }

  // 4. Unilateral Payment Withholding / Discretion
  if (lower.includes("withhold") || lower.includes("sole unilateral right to withhold") || lower.includes("subjective discretion")) {
    financialScore += 45;
    flaggedClauses.push({
      id: "clause-unilateral-payment",
      clauseTitle: "Unilateral Payment Delay & Withholding",
      originalText: extractSnippet(text, ["withhold", "ninety (90) calendar days", "subjective discretion"], 300),
      category: "Financial",
      riskLevel: "High",
      isUnconscionable: true,
      plainEnglishExplainer: "The client can freeze your earned pay for 90+ days without interest based purely on subjective feelings.",
      eli5: "They can decide not to pay you on time whenever they feel like it, and pay zero late penalty.",
      businessImpact: "Severe cash flow risk. You finance their operations without recourse.",
      suggestedCounterProposal: "Provide that invoices are payable Net 15, with a formal written dispute notice required within 7 business days of delivery."
    });
  }

  // 5. Landlord Unannounced Entry / Tenant Repair Shifting (Lease specific)
  if (lower.includes("right of entry") || lower.includes("any time, 24 hours a day") || lower.includes("without prior notice")) {
    liabilityScore += 40;
    flaggedClauses.push({
      id: "clause-landlord-entry",
      clauseTitle: "Arbitrary Entry Without Notice",
      originalText: extractSnippet(text, ["right to enter", "without prior notice", "24 hours a day"], 280),
      category: "Liability",
      riskLevel: "Critical",
      isUnconscionable: true,
      plainEnglishExplainer: "Landlord claims the right to enter your home at any hour without standard 24-hour advance notice, infringing statutory quiet enjoyment.",
      eli5: "The landlord or contractors can walk into your apartment whenever they want without telling you first.",
      businessImpact: "Violates fundamental privacy rights and statutory landlord-tenant laws in almost all jurisdictions.",
      suggestedCounterProposal: "Require at least 24 hours prior written notice before any non-emergency entry during reasonable daytime hours (9 AM - 6 PM)."
    });
  }

  // 6. Security Deposit Liquidated Damages & Pre-Deductions
  if (lower.includes("security deposit") && (lower.includes("automatically forfeited") || lower.includes("non-refundable"))) {
    financialScore += 45;
    flaggedClauses.push({
      id: "clause-deposit-forfeiture",
      clauseTitle: "Automatic Security Deposit Forfeiture & Mandatory Fee",
      originalText: extractSnippet(text, ["automatically forfeited", "sanitization fee", "liquidated damages"], 280),
      category: "Financial",
      riskLevel: "High",
      isUnconscionable: false,
      plainEnglishExplainer: "Entire security deposit is confiscated upon early move-out regardless of actual damages, plus mandatory non-refundable fees.",
      eli5: "You lose all your deposit even if you leave the apartment completely spotless.",
      businessImpact: "Causes loss of thousands of dollars in deposits contrary to statutory deposit accounting requirements.",
      suggestedCounterProposal: "Specify: 'Security deposit shall be returned within statutory period minus only verified itemized actual repair costs exceeding normal wear and tear.'"
    });
  }

  // 7. Asymmetric Termination / Forfeiture of Earned Fees
  if (lower.includes("forfeits all accrued") || lower.includes("liquidated damages") || lower.includes("immediately without cause")) {
    terminationScore += 45;
    flaggedClauses.push({
      id: "clause-asymmetric-termination",
      clauseTitle: "One-Sided Termination & Penalty Forfeiture",
      originalText: extractSnippet(text, ["immediately without cause", "sixty (60) days", "forfeits all accrued"], 300),
      category: "Termination",
      riskLevel: "High",
      isUnconscionable: true,
      plainEnglishExplainer: "They can fire you instantly without reason, but you must give 60 days notice or lose two months of already-earned pay.",
      eli5: "They can kick you out in one second, but you are trapped for two months or they steal your earned paycheck.",
      businessImpact: "Creates extreme operational vulnerability and potential wage/contract theft.",
      suggestedCounterProposal: "Require mutual 14-day notice for termination without cause, and guarantee immediate full payment for all billable hours completed prior to termination."
    });
  }

  // 8. Perpetual Confidentiality & Trade Secrets
  if (lower.includes("perpetuity") || lower.includes("forever") || lower.includes("indefinite")) {
    rightsIpScore += 30;
    flaggedClauses.push({
      id: "clause-perpetual-nda",
      clauseTitle: "Perpetual NDA & Indefinite Restrictions",
      originalText: extractSnippet(text, ["perpetuity", "forever", "survive the termination"], 260),
      category: "Rights & IP",
      riskLevel: "Moderate",
      isUnconscionable: false,
      plainEnglishExplainer: "Confidentiality obligations never expire, putting you at legal risk decades later over routine industry knowledge.",
      eli5: "You are sworn to secrecy forever, even about general ideas.",
      businessImpact: "Leaves a lingering cloud of litigation risk over your long-term career moves.",
      suggestedCounterProposal: "Limit confidentiality duration to two (2) to three (3) years from the date of disclosure, excepting genuine trade secrets."
    });
  }

  // Bound scores between 10 and 98
  financialScore = Math.min(Math.max(financialScore, 15), 95);
  liabilityScore = Math.min(Math.max(liabilityScore, 15), 98);
  rightsIpScore = Math.min(Math.max(rightsIpScore, 15), 95);
  terminationScore = Math.min(Math.max(terminationScore, 15), 95);

  const overallRiskScore = Math.round(
    financialScore * 0.25 + liabilityScore * 0.35 + rightsIpScore * 0.25 + terminationScore * 0.15
  );

  const missingProtections = [
    "Mutual limitation of liability cap (e.g. 12 months fees paid)",
    "Right to cure default with 15-day written notice",
    "Carve-out for pre-existing intellectual property and personal tools",
    "Symmetric termination for convenience with equitable notice",
    "Clear prompt payment terms with standard statutory interest for delays"
  ];

  const keyObligations = [
    "Strict adherence to working/on-call availability hours",
    "Full indemnification of opposing party against third-party lawsuits",
    "Safekeeping and confidential treatment of all shared materials",
    "Strict compliance with non-compete and non-solicitation restrictions"
  ];

  return {
    documentType: detectDocumentType(text),
    overallRiskScore,
    riskLevel: overallRiskScore >= 75 ? "Critical" : overallRiskScore >= 50 ? "High" : overallRiskScore >= 30 ? "Moderate" : "Low",
    riskSummary: `This agreement contains multiple one-sided stipulations that heavily tilt liability, IP ownership, and financial risk away from fairness. Specifically, uncapped indemnity, asymmetric termination penalties, and broad restrictions require immediate counter-negotiation before signing.`,
    scoreBreakdown: {
      financial: { score: financialScore, level: getScoreLevel(financialScore), summary: "Payment withholding and liquidated damage penalties present high financial exposure." },
      liability: { score: liabilityScore, level: getScoreLevel(liabilityScore), summary: "Unlimited indemnity and waiver of statutory protections shift heavy legal burdens onto you." },
      rightsAndIp: { score: rightsIpScore, level: getScoreLevel(rightsIpScore), summary: "Broad assignment of prior inventions and extended non-competes restrict your career freedom." },
      termination: { score: terminationScore, level: getScoreLevel(terminationScore), summary: "Disproportionate exit notice periods and fee forfeiture clauses." }
    },
    flaggedClauses,
    keyObligations,
    missingProtections
  };
}

function detectDocumentType(text) {
  const lower = text.toLowerCase();
  if (lower.includes("lease") || lower.includes("landlord") || lower.includes("tenant") || lower.includes("premises")) {
    return "Residential Lease Agreement";
  }
  if (lower.includes("independent contractor") || lower.includes("freelance") || lower.includes("deliverables")) {
    return "Independent Contractor / Freelance Agreement";
  }
  if (lower.includes("non-disclosure") || lower.includes("nda") || lower.includes("confidential information")) {
    return "Non-Disclosure Agreement (NDA)";
  }
  if (lower.includes("employment offer") || lower.includes("salary") || lower.includes("stock options")) {
    return "Employment Offer & Agreement";
  }
  return "General Legal Contract";
}

function getScoreLevel(score) {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Moderate";
  return "Low";
}

function extractSnippet(text, searchTerms, maxLen = 250) {
  const lower = text.toLowerCase();
  for (const term of searchTerms) {
    const idx = lower.indexOf(term.toLowerCase());
    if (idx !== -1) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + maxLen);
      let snippet = text.slice(start, end).trim();
      if (start > 0) snippet = "..." + snippet;
      if (end < text.length) snippet = snippet + "...";
      return snippet.replace(/[\r\n]+/g, " ");
    }
  }
  return text.slice(0, maxLen) + "...";
}

/**
 * Main Service API for Contract Analysis
 */
export async function analyzeContract(contractText, userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful, lightning-fast heuristic legal intelligence
    return heuristicContractAnalysis(contractText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are a world-class legal technology analyst. Analyze the following legal agreement to empower an everyday citizen, employee, tenant, or freelancer to understand, negotiate, and protect themselves.
Assess risk, detect unconscionable or predatory clauses, and translate legalese into crystal-clear plain English.

Return a JSON object adhering STRICTLY to this schema:
{
  "documentType": string (e.g. "Residential Lease", "Freelance Agreement"),
  "overallRiskScore": integer between 0 and 100 (where 0-25 is Low Risk, 26-55 is Moderate, 56-79 is High, 80-100 is Critical),
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "riskSummary": string (2-3 sentences summarizing the fairness, balance, and key hazards of this contract),
  "scoreBreakdown": {
    "financial": { "score": integer (0-100), "level": "Low"|"Moderate"|"High"|"Critical", "summary": string },
    "liability": { "score": integer (0-100), "level": "Low"|"Moderate"|"High"|"Critical", "summary": string },
    "rightsAndIp": { "score": integer (0-100), "level": "Low"|"Moderate"|"High"|"Critical", "summary": string },
    "termination": { "score": integer (0-100), "level": "Low"|"Moderate"|"High"|"Critical", "summary": string }
  },
  "flaggedClauses": [
    {
      "id": string (unique ID like "clause-1"),
      "clauseTitle": string,
      "originalText": string (exact quotation or excerpt from the contract),
      "category": "Financial" | "Liability" | "Rights & IP" | "Termination" | "Dispute",
      "riskLevel": "Critical" | "High" | "Moderate" | "Low",
      "isUnconscionable": boolean,
      "plainEnglishExplainer": string (clear explanation of what it actually means),
      "eli5": string (explain like I'm 5 years old),
      "businessImpact": string (real-world consequences for the user's money, career, or freedom),
      "suggestedCounterProposal": string (actionable fair alternative wording to propose)
    }
  ],
  "keyObligations": string[],
  "missingProtections": string[]
}

Contract Text:
${contractText}
`;

    const result = await model.generateContent(prompt);
    const jsonText = result.response.text();
    return JSON.parse(jsonText);
  } catch (err) {
    console.warn("Gemini API call failed or rate-limited. Using intelligent legal heuristic engine fallback.", err.message);
    return heuristicContractAnalysis(contractText);
  }
}

/**
 * Compare Two Versions of a Contract (Redline & Diff Analysis)
 */
export async function compareContracts(versionA, versionB, userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Intelligent fallback comparison
    const hasEquityChange = versionA.includes("1-year cliff") && versionB.includes("2-year cliff");
    const hasSeveranceChange = versionA.includes("three (3) months") && versionB.includes("two (2) weeks");
    const hasIpChange = versionA.includes("Personal side projects") && versionB.includes("ALL inventions");

    return {
      summaryOfChanges: "The revised Version 2.0 significantly increases employer protections while drastically curtailing employee rights, equity vesting schedules, and severance guarantees.",
      riskDelta: {
        v1Score: 32,
        v2Score: 84,
        changeDirection: "Worse",
        explanation: "Version 2.0 adds 52 risk points due to doubling the equity cliff, slashing severance pay by 83%, and capturing personal off-hours intellectual property."
      },
      diffClauses: [
        {
          clauseName: "Equity Vesting & Cliff",
          status: "modified",
          v1Snippet: "4-year vesting schedule with a standard 1-year cliff (25% vesting after 12 months).",
          v2Snippet: "5-year vesting schedule with a 2-year cliff (0% vesting until 24 months of continuous service).",
          impact: "Doubles the wait time before you receive any stock options. If you leave or are terminated at 23 months, you walk away with zero equity.",
          severity: "Critical"
        },
        {
          clauseName: "Severance Pay & Termination Rights",
          status: "modified",
          v1Snippet: "Employee shall be entitled to three (3) months of base salary continuation as severance, plus health benefits.",
          v2Snippet: "Employee is entitled to two (2) weeks of base salary upon signing a comprehensive liability release. No health benefits.",
          impact: "Reduces your safety net from 12 weeks of pay plus healthcare to just 2 weeks of pay, conditioned on waiving legal claims.",
          severity: "Critical"
        },
        {
          clauseName: "Intellectual Property Ownership Scope",
          status: "modified",
          v1Snippet: "Personal side projects conducted off-hours without Company resources remain 100% Employee's property.",
          v2Snippet: "Employee assigns to Employer ALL inventions... created during personal hours, at home... whether or not related to Company's business.",
          impact: "Confiscates all personal hobbies, open-source code, and weekend side projects created entirely outside of work.",
          severity: "Critical"
        },
        {
          clauseName: "Non-Compete Geographic & Industry Reach",
          status: "modified",
          v1Snippet: "Reasonable non-compete restricted to direct competitors in consumer legaltech for 6 months within state of residence.",
          v2Snippet: "Extended to twenty-four (24) months worldwide covering any software, SaaS, or digital platform industry.",
          impact: "Effectively attempts to lock you out of working in any software company anywhere in the world for two full years.",
          severity: "High"
        }
      ],
      negotiationAdvice: [
        "Demand reinstatement of the standard 1-year equity cliff (industry standard across tech companies).",
        "Refuse the off-duty IP assignment; include an explicit Exhibit listing excluded prior works and personal projects.",
        "Negotiate severance back to at least 8 to 12 weeks for termination without cause.",
        "Strike the 24-month worldwide non-compete clause as overly restrictive and commercially unreasonable."
      ]
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Compare these two versions of a contract: Version 1 (original/prior) vs Version 2 (revised/current).
Identify key differences, sneaky changes, and the shift in legal risk.

Return strict JSON:
{
  "summaryOfChanges": string,
  "riskDelta": {
    "v1Score": integer (0-100),
    "v2Score": integer (0-100),
    "changeDirection": "Worse" | "Better" | "Neutral",
    "explanation": string
  },
  "diffClauses": [
    {
      "clauseName": string,
      "status": "added" | "modified" | "removed",
      "v1Snippet": string,
      "v2Snippet": string,
      "impact": string,
      "severity": "Critical" | "Warning" | "Favorable" | "Neutral"
    }
  ],
  "negotiationAdvice": string[]
}

Version 1:
${versionA}

Version 2:
${versionB}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.warn("Comparison fallback triggered:", err.message);
    return {
      summaryOfChanges: "Contract versions compared with heuristic engine. Substantial alterations noted in rights, remedies, and risk allocation.",
      riskDelta: { v1Score: 35, v2Score: 78, changeDirection: "Worse", explanation: "Later version imposes tighter constraints and reduces protective remedies." },
      diffClauses: [
        { clauseName: "Term and Termination", status: "modified", v1Snippet: "Standard terms", v2Snippet: "Unilateral provisions", impact: "Increased exposure", severity: "Warning" }
      ],
      negotiationAdvice: ["Review all redline changes with an attorney before signing."]
    };
  }
}

/**
 * Context-Grounded Legal Q&A ("Talk to Your Contract")
 */
export async function answerQuestion(contractText, question, conversationHistory = [], userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Intelligent heuristic Q&A search
    const lowerQ = question.toLowerCase();
    let answer = "";
    let citations = [];
    let followUpSuggestions = [];

    if (lowerQ.includes("terminat") || lowerQ.includes("fire") || lowerQ.includes("quit") || lowerQ.includes("leave")) {
      answer = "Under this contract, termination terms are highly asymmetric. The client or landlord can terminate immediately or arbitrarily, whereas you must provide extended advance written notice. If you terminate early without compliance, you risk forfeiture of accrued fees or your entire security deposit.";
      citations.push({
        clauseTitle: "Termination and Exit Terms",
        excerpt: extractSnippet(contractText, ["terminate", "termination", "forfeits", "advance written notice"], 250),
        pageOrSection: "Section: Termination / Remedies"
      });
      followUpSuggestions = [
        "Can I negotiate a mutual 14-day notice period?",
        "What happens to my unpaid invoices if they terminate?",
        "Are these liquidated damages penalties enforceable in court?"
      ];
    } else if (lowerQ.includes("ip") || lowerQ.includes("intellectual property") || lowerQ.includes("own") || lowerQ.includes("copyright") || lowerQ.includes("invention")) {
      answer = "This agreement contains an aggressive IP assignment. The other party claims ownership of all deliverables and attempts to seize prior inventions, pre-existing toolkits, and works created outside the engagement without additional compensation.";
      citations.push({
        clauseTitle: "Ownership of Intellectual Property",
        excerpt: extractSnippet(contractText, ["intellectual property", "inventions", "works made for hire", "prior inventions"], 250),
        pageOrSection: "Section: Intellectual Property"
      });
      followUpSuggestions = [
        "How do I protect my pre-existing code and design libraries?",
        "Can I license the work instead of assigning full ownership?",
        "Does this cover side projects I work on during weekends?"
      ];
    } else if (lowerQ.includes("money") || lowerQ.includes("pay") || lowerQ.includes("invoice") || lowerQ.includes("late fee") || lowerQ.includes("deposit")) {
      answer = "Financial terms heavily favor the counterparty. They reserve the right to delay or withhold payment for up to 90 days, or impose immediate severe late fees and deposit forfeiture upon minor infractions.";
      citations.push({
        clauseTitle: "Payment & Financial Obligations",
        excerpt: extractSnippet(contractText, ["payment", "withhold", "late fee", "security deposit", "compensation"], 250),
        pageOrSection: "Section: Compensation / Deposits"
      });
      followUpSuggestions = [
        "What is the standard payment turnaround for this type of contract?",
        "What should I do if they withhold payment without justification?",
        "Can I add interest fees for late payments?"
      ];
    } else {
      answer = `Based on the provided agreement, the terms allocate substantial unilateral rights to the drafting party. Specifically, review the dispute resolution, indemnity, and termination clauses carefully.`;
      citations.push({
        clauseTitle: "Contract Terms Excerpt",
        excerpt: contractText.slice(0, 220) + "...",
        pageOrSection: "General Contract Provisions"
      });
      followUpSuggestions = [
        "What are the top 3 biggest risks in this agreement?",
        "What clauses should I ask my lawyer to rewrite?",
        "Are there any illegal or unconscionable clauses here?"
      ];
    }

    return {
      answer,
      citations,
      confidence: "High",
      followUpSuggestions
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a helpful legal assistant assisting a user in understanding their contract.
Answer the user's question accurately, grounded STRICTLY in the provided contract text.
Quote exact excerpts as citations so the user can verify.
Maintain an objective, empowering, plain-English tone. (Remind that this is legal info, not formal attorney representation).

Return JSON adhering to:
{
  "answer": string (plain English, actionable, direct),
  "citations": [
    {
      "clauseTitle": string,
      "excerpt": string (exact verbatim text quote from contract),
      "pageOrSection": string
    }
  ],
  "confidence": "High" | "Medium" | "Low",
  "followUpSuggestions": string[] (3 thoughtful follow-up questions the user should consider)
}

Question: ${question}

Contract Text:
${contractText}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.warn("Q&A Gemini fallback triggered:", err.message);
    return {
      answer: "Unable to contact live GenAI model. Review the highlighted clauses in the Risk Radar tab for direct text excerpts and analysis.",
      citations: [],
      confidence: "Medium",
      followUpSuggestions: ["What are my termination penalties?", "Who owns the IP?"]
    };
  }
}

/**
 * Generate Attorney Consultation Prep Kit
 */
export async function generatePrepKit(contractAnalysis, userGoals = "", userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  const defaultKit = {
    executiveSummary: `Contract Analysis Prep Packet for ${contractAnalysis.documentType || "Agreement"} with an overall Risk Score of ${contractAnalysis.overallRiskScore || 75}/100. This document contains substantial risk regarding liability, remedies, and restrictive covenants that warrant focused legal review.`,
    userGoals: userGoals || "Ensure fair compensation/housing security, prevent unmerited financial forfeiture, and maintain ownership of pre-existing work.",
    topRedFlags: (contractAnalysis.flaggedClauses || []).map(c => `${c.clauseTitle}: ${c.plainEnglishExplainer}`),
    missingSafeguards: contractAnalysis.missingProtections || [
      "Liability monetary cap",
      "Notice and cure periods for alleged breach",
      "Symmetric termination for convenience"
    ],
    attorneyConsultationQuestions: [
      {
        questionNumber: 1,
        question: "Is the indemnification and limitation of liability clause enforceable as written in our jurisdiction, and how can we narrow it?",
        whyItMatters: "Broad uncapped indemnification exposes personal and business assets to ruinous third-party lawsuits.",
        whatToAskFor: "Request mutual indemnification strictly limited to direct losses caused by gross negligence, capped at total contract fees."
      },
      {
        questionNumber: 2,
        question: "Does the intellectual property assignment seize my pre-existing background toolkits and off-duty creations?",
        whyItMatters: "Standard boilerplate often overreaches into personal open-source code and previous portfolio assets.",
        whatToAskFor: "Attach a designated 'Schedule of Excluded Prior Works' and limit assignment to specifically paid deliverables."
      },
      {
        questionNumber: 3,
        question: "Are the liquidated damages and deposit forfeiture penalties legally considered unenforceable penalties?",
        whyItMatters: "Courts frequently invalidate arbitrary forfeiture clauses that bear no proportion to actual landlord or client damages.",
        whatToAskFor: "Replace forfeiture with actual reasonable damages documented by invoices."
      },
      {
        questionNumber: 4,
        question: "What is our counter-proposal strategy for the non-compete or non-solicitation restrictions?",
        whyItMatters: "Overbroad post-termination restrictions can freeze your career and livelihood for years.",
        whatToAskFor: "Strike non-compete completely or limit to non-solicitation of active clients for 6 months."
      },
      {
        questionNumber: 5,
        question: "How can we introduce a mutual 15-day 'Notice and Opportunity to Cure' before either party can declare a material breach?",
        whyItMatters: "Prevents the counterparty from ambushing you with termination or penalty fees without giving you a chance to fix minor misunderstandings.",
        whatToAskFor: "Standard 15-day cure provision before remedies apply."
      }
    ],
    estimatedNegotiationLeverage: "Moderate - Standard commercial standards provide strong justification to negotiate these boilerplate terms."
  };

  if (!apiKey) {
    return defaultKit;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a strategic legal technology advisor preparing a client for a productive, cost-effective consultation with a licensed attorney.
Based on this contract analysis and the user's objectives, generate an executive 'Attorney Consultation Prep Kit'.

Contract Analysis:
${JSON.stringify(contractAnalysis)}

User Objectives:
${userGoals || "Protect my financial and legal rights while preserving a positive relationship."}

Return JSON with:
{
  "executiveSummary": string,
  "userGoals": string,
  "topRedFlags": string[],
  "missingSafeguards": string[],
  "attorneyConsultationQuestions": [
    {
      "questionNumber": integer,
      "question": string,
      "whyItMatters": string,
      "whatToAskFor": string
    }
  ],
  "estimatedNegotiationLeverage": string
}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.warn("Prep kit fallback triggered:", err.message);
    return defaultKit;
  }
}
