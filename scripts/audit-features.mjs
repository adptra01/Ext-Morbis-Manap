#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const FEATURE_FILES = [
  'src/features/scrollButtons.ts',
  'src/features/shortcutButtons.ts',
  'src/features/openDetail.ts',
  'src/features/batchDeleteFiles.ts',
  'src/features/batchUploadUrl.ts',
  'src/features/cpptSearchFilter.ts',
  'src/features/consultationEnhancer.ts',
  'src/features/penerimaan_resep/main.ts',
  'src/features/doctorFilterPersistence.ts',
  'src/features/billingFilterPersistence.ts',
  'src/features/filterPersistence.ts',
];

const LEGACY_PATTERNS = [
  { re: /location\.pathname\b/, label: 'location.pathname' },
  { re: /location\.href\b/, label: 'location.href' },
  { re: /window\.location\.pathname\b/, label: 'window.location.pathname' },
  { re: /\.includes\s*\(/, label: '.includes(' },
  { re: /\.startsWith\s*\(/, label: '.startsWith(' },
  { re: /\.match\s*\(/, label: '.match(' },
];

const ENABLED_WHEN_PATHNAME_RE =
  /(?:pathname|location|window\.location|\.includes\(|\.startsWith\()/;

function extractBlock(src, startIdx) {
  let depth = 1, i = startIdx;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  return src.slice(startIdx, i - 1);
}

function evaluateMatchConfig(matchBlock, path) {
  const om = matchBlock.match(/oneOf:\s*\[([\s\S]*?)\]/);
  if (om) {
    const items = om[1].split('},').map(s => s.replace(/[{}]/g, '').trim()).filter(Boolean);
    return items.some(item => {
      const ip = item.match(/pathname:\s*['"]([^'"]+)['"]/);
      if (ip) return path === ip[1];
      const ipf = item.match(/prefix:\s*['"]([^'"]+)['"]/);
      if (ipf) return path.startsWith(ipf[1]);
      const ir = item.match(/regex:\s*\/([^/]+)\//);
      if (ir) try { return new RegExp(ir[1]).test(path); } catch { return false; }
      return false;
    });
  }

  const pm = matchBlock.match(/pathname:\s*['"]([^'"]+)['"]/);
  if (pm) return path === pm[1];
  const pfm = matchBlock.match(/prefix:\s*['"]([^'"]+)['"]/);
  if (pfm) return path.startsWith(pfm[1]);
  const rm = matchBlock.match(/regex:\s*\/((?:[^\/\\]|\\.)+)\/([gimusy]*)/);
  if (rm) try { return new RegExp(rm[1], rm[2] || '').test(path); } catch { return false; }

  return false;
}

function extractMatchBlock(fullBlock) {
  if (!/\bmatch\s*:\s*\{/.test(fullBlock) && fullBlock.trimStart().startsWith('{')) {
    return fullBlock.trim();
  }
  const mm = fullBlock.match(/\bmatch\s*:\s*\{/);
  if (!mm) return null;
  let depth = 1;
  let i = mm.index + mm[0].length;
  while (i < fullBlock.length && depth > 0) {
    if (fullBlock[i] === '{') depth++;
    else if (fullBlock[i] === '}') depth--;
    i++;
  }
  return fullBlock.slice(mm.index + mm[0].length, i - 1);
}

function evaluateMatch(fullBlock, url) {
  if (!fullBlock || fullBlock === 'undefined') return false;
  const matchBlock = extractMatchBlock(fullBlock);
  if (!matchBlock) return false;
  const path = url.replace(/\/+/g, '/').replace(/\/+$/, '') || '/';
  return evaluateMatchConfig(matchBlock, path);
}

// AST-based: scan a function body string for legacy URL gating patterns
function scanBodyForGates(bodyText, functionName, fileName) {
  const gates = [];
  const lines = bodyText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (const pattern of LEGACY_PATTERNS) {
      if (pattern.re.test(lines[i])) {
        // Skip false positives: URL construction, chrome.runtime, etc.
        const trimmed = lines[i].trim();
        if (
          /new\s+URL\s*\(/.test(trimmed) ||
          /chrome\.runtime\.getURL/.test(trimmed) ||
          /chrome\.tabs\.create/.test(trimmed) ||
          /location\.pathname\s*\+\s*['"]/.test(trimmed)
        ) continue;
        gates.push({
          file: fileName,
          function: functionName,
          line: i + 1,
          text: trimmed,
          pattern: pattern.label,
        });
        break;
      }
    }
  }
  return gates;
}

// AST-based: find run() function body and enabledWhen() body from source
function findFunctionBodies(src, fileName) {
  const sf = ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, true);
  const results = { run: null, enabledWhen: null };

  function findPropertyInObjectLiteral(node, propName) {
    if (!ts.isObjectLiteralExpression(node)) return null;
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = prop.name;
      const nameText = ts.isIdentifier(name) ? name.text
        : ts.isStringLiteral(name) ? name.text
        : null;
      if (nameText !== propName) continue;

      const init = prop.initializer;

      // run: functionName (identifier reference)
      if (ts.isIdentifier(init)) {
        return { type: 'ref', name: init.text };
      }

      // run() { ... } (method-like)
      if (ts.isFunctionExpression(init) || ts.isArrowFunction(init)) {
        return { type: 'inline', body: init.body };
      }

      return null;
    }
    return null;
  }

  function findFunctionDeclaration(funcName) {
    for (const stmt of sf.statements) {
      // function foo() { ... }
      if (ts.isFunctionDeclaration(stmt) && stmt.name && stmt.name.text === funcName) {
        return stmt.body;
      }
      // const foo = () => { ... } or const foo = function() { ... }
      if (ts.isVariableStatement(stmt)) {
        for (const decl of stmt.declarationList.declarations) {
          if (ts.isIdentifier(decl.name) && decl.name.text === funcName && decl.initializer) {
            if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) {
              return decl.initializer.body;
            }
          }
        }
      }
    }
    return null;
  }

  function getBodyText(body) {
    if (!body) return '';
    if (ts.isBlock(body)) {
      return body.getText(sf);
    }
    // Single-expression body (arrow function without braces)
    return body.getText(sf);
  }

  // Walk AST for g.featureModules.xxx = { ... }
  function visit(node) {
    if (ts.isExpressionStatement(node) && ts.isBinaryExpression(node.expression)) {
      const bin = node.expression;
      if (bin.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
          ts.isPropertyAccessExpression(bin.left)) {
        const left = bin.left;
        if (ts.isPropertyAccessExpression(left.expression) &&
            ts.isIdentifier(left.expression.expression) &&
            left.expression.expression.text === 'g' &&
            left.expression.name.text === 'featureModules') {

          const rhs = bin.right;
          if (ts.isObjectLiteralExpression(rhs)) {
            const runProp = findPropertyInObjectLiteral(rhs, 'run');
            if (runProp) results.run = runProp;

            const ewProp = findPropertyInObjectLiteral(rhs, 'enabledWhen');
            if (ewProp) results.enabledWhen = ewProp;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sf, visit);

  // Resolve function references to bodies
  if (results.run && results.run.type === 'ref') {
    const body = findFunctionDeclaration(results.run.name);
    results.run = { type: 'body', text: getBodyText(body), funcName: results.run.name };
  } else if (results.run && results.run.type === 'inline') {
    results.run = { type: 'body', text: getBodyText(results.run.body), funcName: '(inline)' };
  }

  if (results.enabledWhen && results.enabledWhen.type === 'ref') {
    const body = findFunctionDeclaration(results.enabledWhen.name);
    results.enabledWhen = { type: 'body', text: getBodyText(body), funcName: results.enabledWhen.name };
  } else if (results.enabledWhen && results.enabledWhen.type === 'inline') {
    results.enabledWhen = { type: 'body', text: getBodyText(results.enabledWhen.body), funcName: '(inline)' };
  }

  return results;
}

const EXPECTED_MATRIX = [
  { url: '/v2/m-klaim', run: ['filterPersistence'], skip: ['scrollButtons', 'batchUpload', 'batchDelete', 'openDetailInNewTab', 'doctorFilterPersistence', 'shortcutButtons'] },
  { url: '/v2/m-klaim/detail-v2-refaktor', run: ['scrollButtons', 'batchUpload', 'batchDelete', 'openDetailInNewTab'], skip: ['filterPersistence'] },
  { url: '/admisi/pelaksanaan_pelayanan', run: ['doctorFilterPersistence'], skip: ['scrollButtons', 'filterPersistence', 'cpptSearchFilter', 'resepTools'] },
  { url: '/admisi/pelaksanaan_pelayanan/cppt', run: ['shortcutButtons', 'cpptSearchFilter'], skip: ['resepTools', 'doctorFilterPersistence'] },
  { url: '/admisi/pelaksanaan_pelayanan/resep', run: ['shortcutButtons', 'resepTools'], skip: ['cpptSearchFilter', 'doctorFilterPersistence'] },
  { url: '/admisi/detail-rawat-inap', run: ['doctorFilterPersistence'], skip: ['shortcutButtons', 'filterPersistence'] },
  { url: '/admisi/detail-rawat-inap/cppt', run: ['shortcutButtons', 'cpptSearchFilter'], skip: ['doctorFilterPersistence'] },
  { url: '/admisi/pelaksanaan-operasi', run: ['doctorFilterPersistence'], skip: ['shortcutButtons', 'filterPersistence'] },
  { url: '/admisi/pengajuan_konsultasi/konsultasi', run: ['consultationEnhancer'], skip: ['shortcutButtons'] },
  { url: '/billing/pembayaran-new/billing-verifikasi', run: ['billingFilterPersistence'], skip: ['filterPersistence', 'doctorFilterPersistence'] },
];

async function main() {
  const features = [];
  const errors = [];
  const seenIds = new Set();
  const legacyGates = [];
  const enabledWhenViolations = [];
  const deadFeatures = [];
  let totalLegacyLines = 0;

  for (const f of FEATURE_FILES) {
    const fp = resolve(root, f);
    if (!existsSync(fp)) continue;
    const src = readFileSync(fp, 'utf-8');

    // Extract registration blocks (existing brace-counting approach)
    const re = /g\.featureModules\.(\w+)\s*=\s*\{/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const key = m[1];
      const block = extractBlock(src, m.index + m[0].length);

      const idMatch = block.match(/(?:^|,|\n)\s*id\s*:\s*['"]([^'"]+)['"]/);
      const id = idMatch ? idMatch[1] : null;
      const idFinal = id || key;

      const hasMatch = /\bmatch\s*:/.test(block);
      const hasRun = /\brun\s*[:\(]/.test(block);
      const nameMatch = block.match(/(?:^|,|\n)\s*name\s*:\s*['"]([^'"]+)['"]/);
      const name = nameMatch ? nameMatch[1] : key;

      if (seenIds.has(idFinal)) errors.push(`DUPLICATE id: "${idFinal}" in ${f}`);
      seenIds.add(idFinal);

      features.push({ key, id: idFinal, name, file: f, block, hasMatch, hasRun, hasId: !!id });
    }

    // Dynamic registrations from filterPersistence.ts FEATURE_MATCHES
    if (f === 'src/features/filterPersistence.ts') {
      const fmStart = src.search(/const\s+FEATURE_MATCHES/);
      if (fmStart !== -1) {
        const after = src.slice(fmStart);
        const objStart = after.indexOf('{');
        if (objStart !== -1) {
          let depth = 1, i = objStart + 1;
          while (i < after.length && depth > 0) {
            if (after[i] === '{') depth++;
            else if (after[i] === '}') depth--;
            i++;
          }
          const objBody = after.slice(objStart + 1, i - 2);
          const keys = [...objBody.matchAll(/(\w+):\s*\{/g)].map(m => m[1]);
          for (const dk of keys) {
            if (!features.find(fx => fx.id === dk)) {
              const valStart = objBody.search(new RegExp(dk + ':\\s*\\{'));
              if (valStart !== -1) {
                let vdepth = 1, vi = objBody.indexOf('{', valStart) + 1;
                while (vi < objBody.length && vdepth > 0) {
                  if (objBody[vi] === '{') vdepth++;
                  else if (objBody[vi] === '}') vdepth--;
                  vi++;
                }
                const blockText = objBody.slice(objBody.indexOf('{', valStart), vi);
                if (!seenIds.has(dk)) {
                  seenIds.add(dk);
                  features.push({ key: dk, id: dk, name: dk, file: f, block: blockText, hasMatch: true, hasRun: true, hasId: true });
                }
              }
            }
          }
        }
      }
    }

    // AST-based: scan run() and enabledWhen() for legacy URL gates
    const bodies = findFunctionBodies(src, f);

    if (bodies.run) {
      const gates = scanBodyForGates(bodies.run.text, bodies.run.funcName, f);
      legacyGates.push(...gates);
    }

    if (bodies.enabledWhen) {
      // Check for legacy URL gates in enabledWhen body
      const ewGates = scanBodyForGates(bodies.enabledWhen.text, bodies.enabledWhen.funcName, f);
      legacyGates.push(...ewGates);

      // Check enabledWhen body for pathname/location usage (P1 violation)
      const ewLines = bodies.enabledWhen.text.split('\n');
      for (let i = 0; i < ewLines.length; i++) {
        if (ENABLED_WHEN_PATHNAME_RE.test(ewLines[i])) {
          const trimmed = ewLines[i].trim();
          // Skip legitimate non-gating uses
          if (
            /new\s+URL\s*\(/.test(trimmed) ||
            /chrome\.runtime/.test(trimmed)
          ) continue;
          enabledWhenViolations.push({
            file: f,
            line: i + 1,
            text: trimmed,
          });
        }
      }
    }
  }

  // Regression matrix
  const matrix = [];
  for (const scenario of EXPECTED_MATRIX) {
    for (const feat of features) {
      const actual = evaluateMatch(feat.block, scenario.url);
      const expected = scenario.run.includes(feat.id);
      const status = actual === expected ? 'PASS' : 'FAIL';
      if (status === 'FAIL') {
        errors.push(`REG: ${scenario.url} | ${feat.id} | expected ${expected ? 'RUN' : 'SKIP'} | actual ${actual ? 'RUN' : 'SKIP'}`);
      }
      if (!matrix.find(r => r.url === scenario.url && r.feature === feat.id)) {
        matrix.push({ url: scenario.url, feature: feat.id, expected: expected ? 'RUN' : 'SKIP', actual: actual ? 'RUN' : 'SKIP', status });
      }
    }
  }

  // Dead feature detection: features in FEATURE_FILES but never match any URL
  const matchedIds = new Set(matrix.filter(r => r.status === 'PASS' && r.expected === 'RUN').map(r => r.feature));
  for (const feat of features) {
    if (!matchedIds.has(feat.id)) {
      deadFeatures.push(feat);
    }
  }

  // Report
  const totalErrors =
    features.filter(f => !f.hasId).length +
    features.filter(f => !f.hasMatch).length +
    features.filter(f => !f.hasRun).length +
    errors.filter(e => e.startsWith('DUPLICATE')).length +
    errors.filter(e => e.startsWith('REG')).length +
    enabledWhenViolations.length;

  console.log('\n=== Feature Audit Report ===\n');
  console.log(`Total features          : ${features.length}`);
  console.log(`Missing id              : ${features.filter(f => !f.hasId).length}`);
  console.log(`Missing match           : ${features.filter(f => !f.hasMatch).length}`);
  console.log(`Missing run             : ${features.filter(f => !f.hasRun).length}`);
  console.log(`Duplicate id            : ${errors.filter(e => e.startsWith('DUPLICATE')).length}`);
  console.log(`Legacy URL gates        : ${legacyGates.length} (in run/enabledWhen bodies)`);
  console.log(`enabledWhen violations  : ${enabledWhenViolations.length} (pathname/location in enabledWhen)`);
  console.log(`Dead features           : ${deadFeatures.length} (never match in regression)`);
  console.log(`Regression PASS         : ${matrix.filter(r => r.status === 'PASS').length}/${matrix.length}\n`);

  for (const feat of features) {
    const ok = feat.hasId && feat.hasMatch && feat.hasRun;
    console.log(`  ${ok ? '✔' : '✘'} ${feat.id.padEnd(30)} ${feat.file}`);
    if (!feat.id) console.log(`       MISSING id field`);
    if (!feat.hasMatch) console.log(`       MISSING match`);
    if (!feat.hasRun) console.log(`       MISSING run`);
  }

  // Legacy URL gates in run/enabledWhen
  if (legacyGates.length > 0) {
    console.log('\n--- Legacy URL Gates in run()/enabledWhen() ---');
    for (const g of legacyGates) {
      const short = g.text.length > 90 ? g.text.slice(0, 87) + '...' : g.text;
      console.log(`  ${g.file}:${g.line}  [${g.function}]  ${g.pattern}  ${short}`);
    }
  }

  // enabledWhen violations
  if (enabledWhenViolations.length > 0) {
    console.log('\n--- enabledWhen() Violations (URL matching in enabledWhen) ---');
    for (const v of enabledWhenViolations) {
      const short = v.text.length > 90 ? v.text.slice(0, 87) + '...' : v.text;
      console.log(`  ${v.file}:${v.line}  ${short}`);
    }
  }

  // Dead features
  if (deadFeatures.length > 0) {
    console.log('\n--- Dead Features ---');
    for (const f of deadFeatures) {
      console.log(`  ${f.id} (${f.file}) — never matches any URL in regression matrix`);
    }
  }

  if (errors.length > 0) {
    console.log('\n--- Errors ---');
    for (const e of errors.sort()) console.log(`  ${e}`);
    console.log(`\n❌ ${errors.length} error(s)`);
    process.exit(1);
  }

  // Regression matrix
  console.log('\n--- Regression Matrix ---');
  const header = `${'URL'.padEnd(42)} ${'Feature'.padEnd(26)} ${'Expected'.padEnd(8)} ${'Actual'.padEnd(8)} Status`;
  console.log(header);
  console.log('='.repeat(header.length));
  for (const r of matrix) {
    console.log(`${r.url.padEnd(42)} ${r.feature.padEnd(26)} ${r.expected.padEnd(8)} ${r.actual.padEnd(8)} ${r.status === 'PASS' ? '✔' : '✘'}`);
  }

  const covered = new Set(matrix.map(r => r.feature));
  const uncovered = features.filter(f => !covered.has(f.id));
  if (uncovered.length > 0) {
    console.log('\n--- Uncovered Features ---');
    for (const f of uncovered) console.log(`  ${f.id} (${f.file})`);
  }

  console.log(`\nCoverage: ${covered.size}/${features.length} features in regression matrix`);
  console.log('✅ Audit complete\n');
}

main().catch(e => { console.error('Audit error:', e); process.exit(1); });
