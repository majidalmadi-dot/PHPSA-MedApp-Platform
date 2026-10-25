import test from 'node:test';
import assert from 'node:assert/strict';
import { weightedMean, verdictFor, finalize, rateLimited, allowedOrigin } from '../api/_lib/assess.js';

const mk = (qs, fs, crit = 0) => ({
  quality: { domains: qs.map((score) => ({ score, weight: 99 })) },
  feasibility: { axes: fs.map((score) => ({ score, weight: 99 })) },
  gaps: { critical: Array.from({ length: crit }, () => ({})) },
  verdict: { status: 'ready', statement: 's' },
});
const ten = (v) => Array(10).fill(v), six = (v) => Array(6).fill(v);

test('weightedMean basic and rejects bad scores', () => {
  assert.equal(weightedMean([{ score: 4, weight: 1 }, { score: 2, weight: 1 }]), 3);
  assert.equal(weightedMean([{ score: 3.2, weight: 1 }]), null);
  assert.equal(weightedMean([{ score: 3, weight: 0 }]), null);
  assert.equal(weightedMean([]), null);
});
test('verdict thresholds', () => {
  assert.equal(verdictFor(4, 4, 0), 'ready');
  assert.equal(verdictFor(3.79, 4, 0), 'conditional');
  assert.equal(verdictFor(5, 5, 1), 'conditional');
  assert.equal(verdictFor(5, 5, 3), 'not_ready');
});
test('finalize overrides model weights, means and verdict', () => {
  const r = mk(ten(2), six(2), 0); r.quality.weighted_mean = 5; r.verdict.status = 'ready';
  const o = finalize(r);
  assert.ok(o.ok);
  assert.equal(o.result.quality.weighted_mean, 2);
  assert.equal(o.result.verdict.status, 'conditional');
  assert.equal(o.result.quality.domains[6].weight, 1.3);
  assert.ok(o.result.disclaimer);
});
test('finalize rejects malformed output', () => {
  assert.equal(finalize(null).ok, false);
  assert.equal(finalize(mk(ten(3.3), six(3))).ok, false);
  assert.equal(finalize(mk([4], six(3))).ok, false);
});
test('rate limiter trips after max', () => {
  let t = 1000, tripped = false;
  for (let i = 0; i < 12; i++) tripped = rateLimited('ipA', t + i);
  assert.equal(tripped, true);
  assert.equal(rateLimited('ipB', t), false);
});
test('origin allowlist', () => {
  assert.equal(allowedOrigin('https://a.sa', 'https://a.sa, https://b.sa'), 'https://a.sa');
  assert.equal(allowedOrigin('https://evil', 'https://a.sa'), null);
  assert.equal(allowedOrigin('https://a.sa', ''), null);
});
