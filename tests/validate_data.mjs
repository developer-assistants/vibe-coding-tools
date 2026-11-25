import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const dataPath = path.resolve('data/tools.json');
const tools = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

assert.ok(Array.isArray(tools), 'tools.json must be an array');
assert.ok(tools.length >= 30 && tools.length <= 50, `Expected 30-50 tools, got ${tools.length}`);

const ids = new Set();
const validCategories = new Set(['AI IDE', 'CLI Agents', 'No-code']);
const validPricing = new Set(['Free', 'Freemium', 'Paid']);
const requiredGoals = new Set([
  'website-no-code',
  'android-app',
  'chrome-extension',
  'saas-product',
  'desktop-app',
  'free-open-source',
]);
const coveredGoals = new Set();

for (const tool of tools) {
  assert.ok(tool.id && !ids.has(tool.id), `Duplicate or missing id: ${tool.id}`);
  ids.add(tool.id);
  assert.ok(tool.name && tool.tagline && tool.bestFor, `Missing text fields on ${tool.id}`);
  assert.ok(validCategories.has(tool.category), `Invalid category on ${tool.id}: ${tool.category}`);
  assert.ok(validPricing.has(tool.pricingTier), `Invalid pricingTier on ${tool.id}: ${tool.pricingTier}`);
  assert.equal(typeof tool.openSource, 'boolean', `openSource must be boolean on ${tool.id}`);
  assert.ok(tool.codeExport, `Missing codeExport on ${tool.id}`);
  assert.ok(Array.isArray(tool.pros) && tool.pros.length >= 2, `Need >=2 pros on ${tool.id}`);
  assert.ok(Array.isArray(tool.cons) && tool.cons.length >= 2, `Need >=2 cons on ${tool.id}`);
  assert.ok(tool.officialUrl.startsWith('https://'), `Invalid officialUrl on ${tool.id}`);
  if (tool.githubUrl !== null) {
    assert.ok(tool.githubUrl.startsWith('https://github.com/'), `Invalid githubUrl on ${tool.id}`);
  }
  for (const g of tool.goals) coveredGoals.add(g);
}

for (const goal of requiredGoals) {
  assert.ok(coveredGoals.has(goal), `No tool covers required goal: ${goal}`);
}

const featured = tools.filter((t) => t.featured);
assert.equal(featured.length, 8, `Expected 8 featured tools, got ${featured.length}`);

console.log(`Validated ${tools.length} vibe coding tools across ${coveredGoals.size} goals (${featured.length} featured).`);
