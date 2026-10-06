const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let content;
before(async () => { content = await import('data:text/javascript;base64,' + fs.readFileSync(path.join(__dirname, '../src/utils/portfolioContent.js')).toString('base64')); });
test('sparse and legacy records normalize without invented claims or mutation', () => {
  const source = { name: 'Anya', projects: [{ title: 'Journal', techStack: null }], achievements: [{ icon: '🏆' }], themeColors: { text: '#111' } };
  const snapshot = structuredClone(source); const normalized = content.normalizePortfolio(source);
  assert.deepEqual(source, snapshot); assert.equal(normalized.title, ''); assert.equal(normalized.about, ''); assert.deepEqual(normalized.skills, []);
  assert.deepEqual(normalized.projects[0].techStack, []); assert.equal(normalized.projects[0].featured, false);
  assert.equal(normalized.projects[0].outcome, ''); assert.equal(normalized.achievements.length, 0);
  assert.deepEqual(content.normalizePortfolio(null).projects, []);
});
test('project evidence and every supported section survive rendering normalization', () => {
  const source = { name: 'Anya', location: 'Hyderabad', projects: [{ title: 'Journal', problem: 'Class notes were scattered.', contribution: 'I built the editor.', process: 'I tested it with classmates.', outcome: 'Used in our class demo.', techStack: ['React'], featured: true, github: 'https://github.com/example/journal' }], certifications: [{ title: 'Course', credentialUrl: 'https://example.com/credential' }], achievements: [{ title: 'Class demo' }], codingProfiles: [{ platform: 'LeetCode', username: 'anya', solved: '20', url: 'https://leetcode.com/u/anya/' }], contact: { email: 'anya@example.com', phone: '+919999999999' }, socialLinks: { website: 'https://example.com' } };
  const normalized = content.normalizePortfolio(source);
  assert.equal(content.projectStory(normalized.projects[0]).length, 4); assert.equal(normalized.projects[0].github, source.projects[0].github);
  assert.equal(normalized.certifications[0].credentialUrl, source.certifications[0].credentialUrl); assert.equal(normalized.codingProfiles[0].solved, '20');
  assert.equal(normalized.location, source.location); assert.deepEqual(content.profileLinks(normalized).map(l => l.label), ['Website', 'Email', 'Phone']);
});
test('featured arrangement is deterministic and leaves the saved project order untouched', () => {
  const source = [{ title: 'First' }, { title: 'Second', featured: true }, { title: 'Third' }];
  assert.deepEqual(content.orderedProjects(source).map(p => p.title), ['Second', 'First', 'Third']); assert.equal(source[0].title, 'First');
});
test('rendered destinations allow genuine web links and block executable or disguised protocols', () => {
  assert.equal(content.externalURL('github.com/example/journal'), 'https://github.com/example/journal');
  assert.equal(content.externalURL('http://localhost:3000/project'), 'http://localhost:3000/project');
  for (const invalid of ['javascript:alert(1)', 'data:text/html,hello', '//evil.example', 'a title with spaces']) assert.equal(content.externalURL(invalid), '');
  assert.equal(content.imageURL('data:image/png;base64,AA=='), 'data:image/png;base64,AA==');
  assert.equal(content.imageURL('data:text/html,hello'), '');
});
test('button labels choose readable foregrounds for light and dark accent colours', () => {
  assert.equal(content.readableOn('#fff'), '#000000'); assert.equal(content.readableOn('#111111'), '#ffffff');
  assert.equal(content.readableOn('#f6eacc'), '#000000');
});

test('saved-content comparison ignores key order while preserving project order and real edits', async () => {
  const storage = await import('data:text/javascript;base64,' + fs.readFileSync(path.join(__dirname, '../src/utils/storage.js')).toString('base64'));
  const first = { name: 'Anya', themeColors: { bg: '#fff', accent: '#333', text: '#111' }, projects: [{ title: 'First' }, { title: 'Second' }] };
  const same = { projects: first.projects, themeColors: { accent: '#333', text: '#111', bg: '#fff' }, name: 'Anya' };
  assert.equal(storage.contentSnapshot(first), storage.contentSnapshot(same));
  assert.notEqual(storage.contentSnapshot(first), storage.contentSnapshot({ ...same, projects: [...first.projects].reverse() }));
  assert.notEqual(storage.contentSnapshot(first), storage.contentSnapshot({ ...same, name: 'Changed' }));
});

test('Visibility and motion normalize as presentation choices without mutating stored content', () => {
  const source={name:'Anya',about:'Biography',location:'Hyderabad',showLocation:false,availability:'Seeking internships',motto:'Build carefully',interests:['Drawing'],resumeUrl:'https://example.com/resume.pdf',motion:'subtle',projects:[{title:'Project'}],sectionVisibility:{projects:false,contact:false},contact:{email:'private@example.com'},sectionOrder:['contact','projects','projects','invalid']};
  const normalized=content.normalizePortfolio(source); assert.equal(normalized.motion,'subtle'); assert.equal(normalized.location,''); assert.equal(normalized.availability,'Seeking internships'); assert.equal(normalized.projects.length,0); assert.deepEqual(normalized.contact,{}); assert.equal(source.projects.length,1); assert.deepEqual(normalized.sectionOrder,['contact','projects','experience','credentials','profiles']);
});

test('Layout experiments accept only supported choices, retain content and distinguish gentle motion from still mode', () => {
  const source={name:'Anya',projects:[{title:'Journal',link:'https://example.com/journal'}],motion:'none',layoutSettings:{hero:'centered',projects:'rail',spacing:'airy',typography:'editorial',image:'rounded',hover:'tilt'}};
  const snapshot=structuredClone(source), normalized=content.normalizePortfolio(source);
  assert.deepEqual(normalized.layoutSettings,source.layoutSettings); assert.deepEqual(source,snapshot);assert.equal(normalized.motion,'none');assert.equal(normalized.projects[0].link,source.projects[0].link);
  assert.equal(content.normalizePortfolio({motion:'subtle'}).motion,'subtle');assert.equal(content.normalizePortfolio({}).motion,'expressive');
  assert.equal(content.normalizePortfolio({layoutSettings:{hero:'bad class',projects:'bad'}}).layoutSettings.projects,'theme');
  assert.notDeepEqual(content.normalizePortfolio({layoutSettings:null}).layoutSettings,source.layoutSettings);
});
