const User = require("../models/User");
const findUser = User.findById;
User.findById = () => ({ select: async () => ({ tokenVersion: 0 }) });
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const catalog = require('../themeCatalog.json');
let response, messages, calls = 0, base, server;
// Exercise real authenticated routes and provider response validation without contacting AI services.
const providerPath = require.resolve('openai');
const originalProvider = require.cache[providerPath];
require.cache[providerPath] = { id: providerPath, filename: providerPath, loaded: true, exports: class {
  chat = { completions: { create: async body => { calls++; messages = body.messages; return { choices: [{ message: { content: response } }] }; } } };
} };
before(async () => {
  process.env.JWT_SECRET = 'local-ai-test-secret'; process.env.GROQ_API_KEY = 'fixture-only';
  const app = express(); app.use(express.json()); app.use('/ai', require('../routes/ai'));
  server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  base = `http://127.0.0.1:${server.address().port}/ai`;
});
after(async () => { if (originalProvider) require.cache[providerPath] = originalProvider; else delete require.cache[providerPath]; await new Promise(resolve => server.close(resolve)); });
beforeEach(() => { calls = 0; messages = null; response = 'A clear, factual draft.'; });
async function request(path, body, authenticated = true) {
  const res = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: `Bearer ${jwt.sign({ userId: 'owner-one' }, process.env.JWT_SECRET)}` } : {}) }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}
test('a name alone cannot become an invented professional biography', async () => {
  const res = await request('/bio', { name: 'Anya' }); assert.equal(res.status, 400); assert.equal(calls, 0);
});
test('biography requests include actual notes and forbid unsupported claims', async () => {
  const res = await request('/bio', { name: 'Anya', about: 'I sketch neighborhood maps.', skills: [] });
  assert.equal(res.status, 200); assert.match(messages[1].content, /I sketch neighborhood maps/);
  assert.match(messages[0].content, /Never invent experience/); assert.doesNotMatch(messages[1].content, /fresher \/ student|software development/);
});
test('project rewrite requires facts and preserves the supplied contribution in the prompt', async () => {
  assert.equal((await request('/project', { title: 'Journal' })).status, 400); assert.equal(calls, 0);
  assert.equal((await request('/project', { title: 'Journal', description: 'I built a local-only journal for my class.', techStack: ['React'] })).status, 200);
  assert.match(messages[1].content, /local-only journal/); assert.match(messages[0].content, /project outcomes/);
});
test('skills are validated, deduplicated and exclude existing skills', async () => {
  response = '["React","Python","python","","Docker"]';
  const res = await request('/skills', { title: 'Developer', currentSkills: ['react'] });
  assert.deepEqual(res.body.skills, ['python', 'Docker']);
  response = '[{"skill":"AWS"}]'; assert.equal((await request('/skills', { title: 'Developer' })).status, 503);
});
test('three recommendations are restricted to distinct existing themes across the full catalog', async () => {
  assert.equal(catalog.length, 41);
  response = JSON.stringify({ recommendations: ['minimalist', 'museum', 'terminal-os'].map(theme => ({ theme, reason: 'Fits the profile.' })) });
  const valid = await request('/theme-recommend', { title: 'Designer' }); assert.equal(valid.status, 200); assert.equal(valid.body.recommendations.length, 3);
  assert.match(messages[1].content, /hacker-matrix/);
  for (const themes of [['minimalist', 'minimalist', 'museum'], ['missing', 'museum', 'minimalist']]) {
    response = JSON.stringify({ recommendations: themes.map(theme => ({ theme, reason: 'Fits.' })) });
    assert.equal((await request('/theme-recommend', {})).status, 503);
  }
});
test('AI routes require authentication', async () => {
  assert.equal((await request('/bio', { name: 'Anya', about: 'Real notes' }, false)).status, 401); assert.equal(calls, 0);
});

test('the recommendation catalog preserves the frontend theme IDs and names', () => {
  const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '../../frontend/src/registry/themeRegistry.js'), 'utf8');
  const registered = [...source.matchAll(/id: "([^"]+)",\s+name: "([^"]+)",\s+persona: "([^"]+)"/g)].map(m => ({ id: m[1], name: m[2], persona: m[3] }));
  assert.deepEqual(catalog, registered);
});

test('project story fields ground a rewrite even when the short description is empty', async () => {
  const res = await request('/project', { title: 'Journal', problem: 'Class notes were scattered.', contribution: 'I built the editor.', process: 'Reviewed it with two classmates.', outcome: '', techStack: ['React'] });
  assert.equal(res.status, 200); assert.match(messages[1].content, /Class notes were scattered/); assert.match(messages[1].content, /two classmates/);
  assert.match(messages[1].content, /"outcome":""/); assert.match(messages[0].content, /Never invent/);
});

after(() => { User.findById = findUser; });
