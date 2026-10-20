const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
test('Mongoose preserves project stories and featured choices without changing existing IDs', async () => {
  const existing = new mongoose.Types.ObjectId();
  const document = new Portfolio({ userId: new mongoose.Types.ObjectId(), name: 'Anya', about: 'I build useful tools.', projects: [{ _id: existing, title: 'Journal', problem: 'Scattered notes', contribution: 'Built an editor', process: 'Classmate review', outcome: 'Used in a class demo', featured: true }] });
  await document.validate(); const record = document.toObject();
  assert.equal(String(record.projects[0]._id), String(existing)); assert.equal(record.projects[0].featured, true);
  for (const field of ['problem', 'contribution', 'process', 'outcome']) assert.ok(record.projects[0][field]);
});
test('legacy projects remain valid with empty optional stories and no featured claim', async () => {
  const document = new Portfolio({ userId: new mongoose.Types.ObjectId(), name: 'Anya', about: 'Real bio', projects: [{ title: 'Legacy project' }] });
  await document.validate(); assert.equal(document.projects[0].featured, false); assert.equal(document.projects[0].outcome, '');
});
