const User = require("../models/User");
const findUser = User.findById;
User.findById = () => ({ select: async () => ({ tokenVersion: 0 }) });
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
const matches = (record, query) => Object.entries(query).every(([k, v]) => v === null ? record[k] == null : v && typeof v === "object" ? ("$ne" in v ? record[k] != v.$ne : "$gte" in v ? record[k] != null && new Date(record[k]) >= v.$gte : false) : record[k] === v);

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
    if (record) { Object.assign(record, update.$set); for (const [key,value] of Object.entries(update.$inc || {})) { if(key.startsWith("analytics.")) { record.analytics ||= {}; record.analytics[key.split(".")[1]] = (record.analytics[key.split(".")[1]] || 0) + value; } else record[key] = (record[key] || 0) + value; } }
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

test('Layout compatibility can be checked without an account or database write', async () => {
  const response=await request('/capabilities','GET',undefined,null);assert.equal(response.status,200);assert.equal(response.body.data.layoutStudio,true);assert.deepEqual(response.body.data.motionModes,['none','subtle','expressive']);assert.equal(records.size,0);
});

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

test('Trash hides a public link, restores its stable link, and permanent deletion requires Trash ownership', async () => {
  const {body}=await create({isPublic:true}); const id=body.data.id;
  assert.equal((await request(`/${id}/permanent`, 'DELETE')).status,404);
  assert.equal((await request(`/${id}`, 'DELETE')).status,200);assert.equal(records.get(id).isPublic,false);
  assert.equal((await request(`/share/${body.data.shareSlug}`, 'GET', undefined, null)).status,404);
  assert.equal((await request(`/${id}/restore`, 'POST', {}, 'other')).status,404);
  assert.equal((await request(`/${id}/restore`, 'POST', {})).status,200);
  assert.equal(records.get(id).shareSlug,body.data.shareSlug);
  assert.equal((await request(`/share/${body.data.shareSlug}`, 'GET', undefined, null)).status,200);
  await request(`/${id}`, 'DELETE');
  assert.equal((await request(`/${id}/permanent`, 'DELETE')).status,200); assert.equal(records.size,0);
});
test('Only supported click events increment a public portfolio; private and trashed records reject events', async () => {
  const {body}=await create({isPublic:true}); const slug=body.data.shareSlug;
  assert.equal((await request(`/events/${slug}`, 'POST',{type:'project'},null)).status,200);
  assert.equal(records.get(body.data.id).analytics.project,1);
  assert.equal((await request(`/events/${slug}`, 'POST',{type:'userId'},null)).status,400);
  await request(`/${body.data.id}`, 'PUT',{isPublic:false});
  assert.equal((await request(`/events/${slug}`, 'POST',{type:'contact'},null)).status,404);
  await request(`/${body.data.id}`, 'DELETE');
  assert.equal((await request(`/events/${slug}`, 'POST',{type:'resume'},null)).status,404);
});
test('Owners can save new presentation fields but cannot overwrite measured counts or Trash dates', async () => {
  const {body}=await create(); const id=body.data.id;
  await request(`/${id}`, 'PUT',{availability:'Seeking an internship',motto:'Build carefully',interests:['Drawing'],resumeUrl:'https://example.com/resume.pdf',motion:'subtle',sectionOrder:['contact','projects'],sectionVisibility:{experience:false},audience:'Recruiters',showcaseOptIn:true,analytics:{project:999},deletedAt:new Date()});
  assert.equal(records.get(id).audience,'Recruiters'); assert.equal(records.get(id).sectionVisibility.experience,false); assert.equal(records.get(id).analytics,undefined); assert.equal(records.get(id).deletedAt,undefined);
});

test('Layout experiments round trip on owner save and public retrieval while keeping the same portfolio link', async () => {
  const {body}=await create({isPublic:true});const id=body.data.id;
  const layoutSettings={hero:'centered',projects:'rail',spacing:'airy',typography:'bold',image:'rounded',hover:'tilt'};
  await request(`/${id}`,'PUT',{layoutSettings,motion:'expressive'});
  const response=await request(`/share/${body.data.shareSlug}`,'GET',undefined,null);
  assert.deepEqual(response.body.data.layoutSettings,layoutSettings);assert.equal(response.body.data.motion,'expressive');assert.equal(response.body.data.shareSlug,body.data.shareSlug);
});
test('The presentation schema supports Still mode and rejects unsupported layout values', async () => {
  const document=new Portfolio({userId:'507f1f77bcf86cd799439011',name:'Anya',about:'I make things.',motion:'none',layoutSettings:{projects:'rail'}});
  await document.validate();document.layoutSettings.projects='injected';
  await assert.rejects(()=>document.validate(),/layoutSettings.projects/);
});

test('Public responses omit owner metadata and hidden contact content while owner previews retain the original fields', async () => {
  const {body}=await create({isPublic:true,contact:{email:'private@example.com'},socialLinks:{github:'https://github.com/private'},resumeUrl:'https://example.com/private.pdf',location:'Private location',showLocation:false,sectionVisibility:{contact:false},analytics:{project:5}});
  const publicResponse=await request(`/share/${body.data.shareSlug}`, 'GET',undefined,null);
  assert.equal(publicResponse.status,200); assert.deepEqual(publicResponse.body.data.contact,{}); assert.equal(publicResponse.body.data.resumeUrl,''); assert.equal(publicResponse.body.data.location,''); assert.equal(publicResponse.body.data.userId,undefined); assert.equal(publicResponse.body.data.clientRequestId,undefined); assert.equal(publicResponse.body.data.analytics,undefined);
  const ownerResponse=await request(`/${body.data.id}`); assert.equal(ownerResponse.body.data.contact.email,'private@example.com');
});

after(() => { User.findById = findUser; });
