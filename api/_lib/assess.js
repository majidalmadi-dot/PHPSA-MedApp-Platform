// Pure helpers for /api/analyze. No I/O, so they are unit-testable.
// Weights mirror the prompt in api/analyze.js (single source of truth: here).
export const QUALITY_WEIGHTS = {
  problem_definition: 1.0, evidence_base: 1.0, strategic_alignment: 1.2,
  policy_design: 1.0, implementation: 1.1, governance: 1.0, financing: 1.3,
  monitoring_evaluation: 1.0, equity_hiap: 0.9, policy_impact: 1.2,
};
export const FEASIBILITY_WEIGHTS = [1.0, 1.1, 1.2, 1.0, 1.3, 0.9]; // technical, political, operational, administrative, financial, equity
export const MAX_POLICY_CHARS = 100_000;

const VALID = new Set([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
export const validScore = (s) => typeof s === 'number' && VALID.has(s);

export function weightedMean(items) {
  // items: [{score, weight}] -> number rounded to 2dp, or null if unusable
  if (!Array.isArray(items) || items.length === 0) return null;
  let sum = 0, w = 0;
  for (const it of items) {
    if (!validScore(it.score) || typeof it.weight !== 'number' || !(it.weight > 0)) return null;
    sum += it.score * it.weight; w += it.weight;
  }
  return Math.round((sum / w) * 100) / 100;
}

export function verdictFor(quality, feasibility, criticalGaps) {
  if (criticalGaps > 2) return 'not_ready';
  if (quality >= 3.8 && feasibility >= 3.5 && criticalGaps === 0) return 'ready';
  return 'conditional';
}

// Recompute means and verdict in code; never trust the model's arithmetic.
// Returns {ok:true,result} or {ok:false,reason}.
export function finalize(r) {
  if (!r || typeof r !== 'object') return { ok: false, reason: 'not an object' };
  const qd = r.quality?.domains, fa = r.feasibility?.axes;
  if (!Array.isArray(qd) || !Array.isArray(fa)) return { ok: false, reason: 'missing domains/axes' };
  // Enforce canonical weights by position/name-independent order from the prompt.
  const qWeights = Object.values(QUALITY_WEIGHTS);
  if (qd.length !== qWeights.length || fa.length !== FEASIBILITY_WEIGHTS.length) return { ok: false, reason: 'unexpected counts' };
  qd.forEach((d, i) => { d.weight = qWeights[i]; });
  fa.forEach((a, i) => { a.weight = FEASIBILITY_WEIGHTS[i]; });
  const q = weightedMean(qd), f = weightedMean(fa);
  if (q === null || f === null) return { ok: false, reason: 'invalid scores' };
  const critical = Array.isArray(r.gaps?.critical) ? r.gaps.critical.length : 0;
  r.quality.weighted_mean = q;
  r.feasibility.weighted_mean = f;
  const status = verdictFor(q, f, critical);
  r.verdict = { ...(r.verdict || {}), status, quality_score: q, feasibility_score: f, critical_gaps_count: critical };
  r.disclaimer = 'AI-assisted screening output. Requires review by a qualified human assessor before any decision.';
  return { ok: true, result: r };
}

// Best-effort per-instance limiter (serverless instances do not share memory;
// durable limiting needs Vercel WAF rate-limit rules or a KV store).
const hits = new Map();
export function rateLimited(key, now = Date.now(), max = 10, windowMs = 60_000) {
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

export function allowedOrigin(origin, envList) {
  const list = (envList || '').split(',').map((s) => s.trim()).filter(Boolean);
  return origin && list.includes(origin) ? origin : null;
}
