const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const Portfolio = require('../models/Portfolio');
const original = {};
const records = new Map();
let counter = 0, base, server;
const owner = 'owner-one';
const requestId = '11111111-1111-4111-8111-111111111111';
const matches = (record, query) => Object.entries(query).every(([k, v]) => record[k] === v);

before(async () => {
  process.env.JWT_SECRET = 'local-test-secret';
  for (const method of ['create', 'findOne', 'findOneAndUpdate', 'findOneAndDelete']) original[method] = Portfolio[method];
  Portfolio.create = async body => {
    if (body.clientRequestId && [...records.values()].some(r => r.userId === body.userId && r.clientRequestId === body.clientRequestId)) {
      const error = new Error('Duplicate request'); error.code = 11000; throw error;
    }
    const record = { ...body, _id: String(++counter), shareSlug: `stable-${counter}`, views: 0, isPublic: body.isPublic ?? true, save: async () => {} };
    records.set(record._id, record); return record;
  };
  Portfolio.findOne = async query => [...records.values()].find(r => matches(r, query)) || null;
  Portfolio.findOneAndUpdate = async (query, update) => {
    const record = await Portfolio.findOne(query);
    if (record) Object.assign(record, update.$set);
    return record;
  };
  Portfolio.findOneAndDelete = async query => {
    const record = await Portfolio.findOne(query);
    if (record) records.delete(record._id);
    return record;
  };
  const app = express(); app.use(express.json()); app.use('/portfolio', require('../routes/portfolio'));
  server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  base = `http://127.0.0.1:${server.address().port}/portfolio`;
});
after(async () => { Object.assign(Portfolio, original); await new Promise(resolve => server.close(resolve)); });
beforeEach(() => { records.clear(); counter = 0; });
const request = async (path = '', method = 'GET', body, user = owner) => {
  const response = await fetch(base + path, { method, headers: {
    'Content-Type': 'application/json', ...(user ? { Authorization: `Bearer ${jwt.sign({ userId: user }, process.env.JWT_SECRET)}` } : {}),
  }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, body: await response.json() };
};
const create = (extra = {}) => request('', 'POST', { name: 'Anya', about: 'I build useful tools.', clientRequestId: requestId, isPublic: false, ...extra });

test('retrying create returns the same record and stable link', async () => {
  const first = await create(); const retry = await create();
  assert.equal(first.status, 201); assert.equal(retry.status, 200);
  assert.equal(first.body.data.id, retry.body.data.id);
  assert.equal(first.body.data.shareSlug, retry.body.data.shareSlug);
  assert.equal(retry.body.data.reused, true); assert.equal(records.size, 1);
});
test('request IDs are isolated by owner', async () => {
  await create(); await request('', 'POST', { name: 'Someone', about: 'Other account', clientRequestId: requestId }, 'other');
  assert.equal(records.size, 2);
});
test('update preserves server metadata and allows publishing existing private records', async () => {
  const { body } = await create(); const id = body.data.id;
  const updated = await request(`/${id}`, 'PUT', { name: 'New Name', isPublic: true, _id: 'overwrite', userId: 'other', shareSlug: 'changed', views: 900, clientRequestId: 'changed' });
  assert.equal(updated.status, 200);
  const saved = records.get(id);
  assert.equal(saved.name, 'New Name'); assert.equal(saved.userId, owner);
  assert.equal(saved.shareSlug, body.data.shareSlug); assert.equal(saved._id, id); assert.equal(saved.views, 0);
  assert.equal((await request(`/share/${saved.shareSlug}`, 'GET', undefined, null)).status, 200);
});
test('private portfolios have authenticated owner previews without counting a public view', async () => {
  const { body } = await create();
  assert.equal((await request(`/${body.data.id}`)).status, 200);
  assert.equal((await request(`/share/${body.data.shareSlug}`, 'GET', undefined, null)).status, 404);
  assert.equal(records.get(body.data.id).views, 0);
});
test('non-owners cannot preview, update or delete a record', async () => {
  const { body } = await create();
  for (const method of ['GET', 'PUT', 'DELETE']) assert.equal((await request(`/${body.data.id}`, method, method === 'PUT' ? { name: 'Wrong' } : undefined, 'other')).status, 404);
  assert.equal(records.size, 1);
});
test('expired sessions fail without creating records', async () => {
  const response = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt.sign({ userId: owner }, process.env.JWT_SECRET, { expiresIn: -1 })}` }, body: JSON.stringify({ name: 'Anya', about: 'Test' }) });
  assert.equal(response.status, 401); assert.equal(records.size, 0);
});
test('invalid request IDs return an actionable validation error', async () => {
  assert.equal((await create({ clientRequestId: 'bad' })).status, 400); assert.equal(records.size, 0);
});

test('simultaneous create requests return one record through the unique-index fallback', async () => {
  const responses = await Promise.all([create(), create(), create()]);
  assert.equal(records.size, 1);
  assert.equal(new Set(responses.map(r => r.body.data.id)).size, 1);
  assert.ok(responses.every(r => r.status === 200 || r.status === 201));
});
