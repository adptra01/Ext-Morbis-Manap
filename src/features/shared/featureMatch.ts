import type { FeatureMatch, FeatureContext } from './types.js';

export function normalizePath(path: string): string {
  const normalized = path.replace(/\/+/g, '/').replace(/\/+$/, '');
  if (normalized === '') return '/';
  return normalized.startsWith('/') ? normalized : '/' + normalized;
}

interface EvaluateResult {
  matched: boolean;
  reason?: string;
}

type Evaluator = (match: FeatureMatch, ctx: FeatureContext) => EvaluateResult | null;

const EVALUATORS: Evaluator[] = [
  (m, c) =>
    m.pathname !== undefined && c.pathname !== m.pathname
      ? { matched: false, reason: `expected pathname "${m.pathname}"` }
      : null,
  (m, c) =>
    m.prefix !== undefined && !c.pathname.startsWith(m.prefix)
      ? { matched: false, reason: `expected prefix "${m.prefix}"` }
      : null,
  (m, c) =>
    m.regex !== undefined && !m.regex.test(c.pathname)
      ? { matched: false, reason: `regex ${m.regex} failed` }
      : null,
  (m, c) =>
    m.oneOf !== undefined && !m.oneOf.some((e) => evaluate(e, c).matched)
      ? { matched: false, reason: 'no oneOf matched' }
      : null,
  (m, c) =>
    m.exclude?.some((e) => evaluate(e, c).matched)
      ? { matched: false, reason: 'excluded' }
      : null,
  (m, c) =>
    m.requiredSelectors?.some((sel) => !c.document.querySelector(sel))
      ? { matched: false, reason: 'missing required element' }
      : null,
];

function evaluate(match: FeatureMatch, ctx: FeatureContext): EvaluateResult {
  for (const fn of EVALUATORS) {
    const result = fn(match, ctx);
    if (result) return result;
  }
  return { matched: true };
}

export function matchPage(match: FeatureMatch | undefined, ctx: FeatureContext): boolean {
  if (!match) return false;
  return evaluate(match, ctx).matched;
}
