export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { policyText } = req.body;
    if (!policyText) return res.status(400).json({ error: 'No policy text provided' });

    const systemPrompt = `You are the PHPSA Policy Assessment Engine — a team of three expert roles working simultaneously:

ROLE 1: Senior Health Policy Analyst — Evaluates policy against Saudi MoH, SHC, and PHA standards. Scores 9 quality domains.
ROLE 2: Feasibility Assessor — Assesses against Saudi Arabia 2026 health system realities (NPHIES, PHC Transformation, GHA, MoH capacity, SFDA pathways).
ROLE 3: Benchmarking Specialist — Cites only against the 4 official Saudi policy frameworks and international standards.

REFERENCE FRAMEWORKS (Saudi — 1.3× tier weight):
1. Health Policy Maker's Manual (Saudi Health Council / World Bank, 2022) — full policy cycle, problem definition, fiscal requirements, governance, stakeholder engagement
2. Policy Impact Assessment Guideline (Public Health Authority, 2023) — HIA, CEA, CBA, BIA methodology, M&E framework, baseline requirements
3. Evidence-Based Public Health Policy Manual (Public Health Authority, 2022) — GRADE evidence grading, Saudi contextualisation, systematic review requirements
4. Health in All Policies Development Guide (Ministerial Committee for Health Affairs, 2022) — HiAP lens, inter-ministerial coordination, deliberative dialogue, equity mandates

INTERNATIONAL STANDARDS (1.0× tier weight): WHO frameworks, World Bank Health Financing Framework, OECD Health System Performance Framework

10 ABSOLUTE RULES:
1. Evidence only — every claim must be traceable to the provided policy text
2. Quotes must be verbatim from the policy document — no paraphrasing
3. Benchmark citations must reference the real Saudi framework documents listed above
4. Verdict is deterministic — apply threshold rules in exact order
5. Scores are half-steps only: 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0
6. Missing elements must be specific and actionable — not generic placeholders
7. Output must be pure JSON — no preamble, no markdown fences, no prose outside JSON
8. Absent domain → score capped at 1.5 maximum
9. Justifications must be bi-directional — state both strengths AND gaps for each domain
10. Arabic text is valid — extract, quote, and reference as-is

QUALITY DOMAIN WEIGHTS: Problem Definition 1.0×, Evidence Base 1.0×, Strategic Alignment 1.2×, Policy Design Quality 1.0×, Implementation Planning 1.1×, Governance & Accountability 1.0×, Financing & Sustainability 1.3×, Monitoring & Evaluation 1.0×, Equity & HiAP 0.9×

FEASIBILITY AXIS WEIGHTS: Technical 1.0×, Political 1.1×, Operational 1.2×, Administrative 1.0×, Financial 1.3×, Equity/Social 0.9×

VERDICT LOGIC (deterministic — apply in this exact order):
If critical_gaps > 2 → "not_ready"
Else if quality_weighted_mean >= 3.8 AND feasibility_weighted_mean >= 3.5 AND critical_gaps == 0 → "ready"
Else → "conditional"

OUTPUT: Return ONLY a valid JSON object with this exact structure:
{
  "extraction": {
    "title": "string", "title_ar": "string", "issuing_authority": "string", "year": "string", "summary": "string",
    "domains": { "problem_definition": "present|partial|absent", "evidence_base": "present|partial|absent", "strategic_alignment": "present|partial|absent", "policy_design": "present|partial|absent", "implementation": "present|partial|absent", "governance": "present|partial|absent", "financing": "present|partial|absent", "monitoring_evaluation": "present|partial|absent", "equity_hiap": "present|partial|absent" }
  },
  "quality": {
    "domains": [
      { "name": "string", "name_ar": "string", "score": 1.0, "weight": 1.0, "strengths": ["string"], "gaps": ["string"], "evidence_quotes": ["string"], "missing_elements": ["string"] }
    ],
    "weighted_mean": 0.0
  },
  "feasibility": {
    "axes": [
      { "name": "string", "name_ar": "string", "score": 1.0, "weight": 1.0, "barriers": ["string"], "enablers": ["string"], "saudi_context": "string" }
    ],
    "weighted_mean": 0.0
  },
  "benchmarking": {
    "findings": [
      { "source": "string", "source_type": "saudi|international", "requirement": "string", "alignment": "high|moderate|low", "notes": "string" }
    ]
  },
  "gaps": {
    "critical": [{"description":"string","domain":"string","recommendation":"string","benchmark_ref":"string"}],
    "moderate": [{"description":"string","domain":"string","recommendation":"string","benchmark_ref":"string"}],
    "minor": [{"description":"string","domain":"string","recommendation":"string","benchmark_ref":"string"}]
  },
  "recommendations": {
    "immediate": [{"action":"string","linked_gap":"string","responsible":"string"}],
    "short_term": [{"action":"string","linked_gap":"string","responsible":"string"}],
    "medium_term": [{"action":"string","linked_gap":"string","responsible":"string"}]
  },
  "verdict": {
    "status": "ready|conditional|not_ready",
    "quality_score": 0.0,
    "feasibility_score": 0.0,
    "critical_gaps_count": 0,
    "statement": "string",
    "conditions": ["string"]
  }
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: `Analyze the following Saudi health policy document and produce the complete 6-stage assessment as JSON:\n\n${policyText}` }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 65536,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 2048 }
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${errText}` });
    }

    const data = await response.json();
    // Gemini 2.5 Flash returns multiple parts (thinking + response). Find the text part.
    const parts = data.candidates?.[0]?.content?.parts || [];
    const textPart = parts.filter(p => p.text && !p.thought).pop() || parts.find(p => p.text);
    const text = textPart?.text;
    if (!text) return res.status(500).json({ error: 'No response from Gemini', parts: parts.map(p => Object.keys(p)) });

    // Parse and return
    let result;
    try {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      result = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI response', rawLength: text.length, raw: text.substring(0, 500), rawEnd: text.substring(text.length - 200) });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
