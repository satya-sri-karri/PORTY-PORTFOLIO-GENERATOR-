const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const tick = () => new Promise(resolve => setTimeout(resolve, 40));

test('static preview applies styles and avatars only after review, without a backend', async () => {
  const errors = [], console = new VirtualConsole();
  console.on('jsdomError', error => { if (error.type !== 'css parsing') errors.push(error.message); });
  const dom = new JSDOM(fs.readFileSync(path.resolve(__dirname, '../../huggingface/minimalist-static/index.html'), 'utf8'), {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://porty.example/', virtualConsole: console,
    beforeParse(window) { window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} }); window.fetch = () => { throw new Error('Static preview must not call a backend'); }; }
  });
  try {
    await tick();
    const { document, Event, File } = dom.window;
    const click = async text => { const button = [...document.querySelectorAll('button')].find(node => node.textContent === text); assert.ok(button, text); button.click(); await tick(); };
    assert.equal(document.querySelector('h1').textContent, 'Anya');
    const change = async (element, value) => { element.value = value; element.dispatchEvent(new Event('change', { bubbles: true })); await tick(); };
    const selects = document.querySelectorAll('select');
    for (let i = 0; i < 6; i++) { await change(selects[0], String(i)); assert.ok(document.querySelector('.pf-poster').style.getPropertyValue('--pf-bg')); }
    for (const value of ['bold', 'geometric', 'condensed']) { await change(selects[2], value); assert.equal(document.querySelector('.mp-layout').dataset.font, value); }
    await change(selects[1], 'type'); assert.ok(document.querySelector('.mp-type')); assert.equal(document.querySelector('.mp-avatar'), null);
    const original = document.querySelector('.static-avatar img').src;
    const input = document.querySelector('input[type=file]');
    const upload = async file => { Object.defineProperty(input, 'files', { configurable: true, value: [file] }); input.dispatchEvent(new Event('change', { bubbles: true })); await tick(); };
    await upload(new File(['bad'], 'bad.svg', { type: 'image/svg+xml' })); assert.match(document.querySelector('[role=alert]').textContent, /PNG/);
    const image = fs.readFileSync(path.resolve(__dirname, '../public/demo/minimalist-character.webp'));
    await upload(new File([image], 'avatar.webp', { type: 'image/webp' })); assert.ok(document.querySelector('img[alt="Selected avatar preview"]')); assert.equal(document.querySelector('.mp-avatar'), null);
    await click('Discard'); assert.equal(document.querySelector('.static-avatar img').src, original);
    await upload(new File([image], 'avatar.webp', { type: 'image/webp' })); await click('Use avatar'); assert.ok(document.querySelector('.mp-character')); assert.match(document.querySelector('.mp-avatar img').src, /^data:image\/webp;base64,/);
    await click('Reset preview'); assert.equal(selects[0].value, '0'); assert.equal(document.querySelector('h1').textContent, 'Anya');
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});
