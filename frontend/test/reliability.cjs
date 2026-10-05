// Browser integration checks use local API fixtures; no production account or API is touched.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const url = process.env.PORTY_TEST_URL || 'http://127.0.0.1:3109';
const { spawn } = require('node:child_process');
const output = path.join(__dirname, 'artifacts');
fs.mkdirSync(output, { recursive: true });
let passed = 0;
(async () => {
  let server;
  if (!process.env.PORTY_TEST_URL) {
    server = spawn(process.execPath, [path.join(__dirname, 'serve-build.cjs')], { env: { ...process.env, PORT: '3109' } });
    await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); server.once('exit', code => reject(new Error('Review server exited: ' + code))); });
  }
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PORTY_CHROME_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }).catch(error => { server?.kill(); throw error; });
  const test = async (name, fn, disableGraphics = true) => {
    if (process.env.PORTY_TEST_FILTER && !new RegExp(process.env.PORTY_TEST_FILTER).test(name)) return;
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    await context.addInitScript(disableGraphics => {
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'local-fixture');
        localStorage.setItem('user', JSON.stringify({ id: 'owner-one', name: 'Anya' }));
      }
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        return disableGraphics && /webgl/.test(type) ? null : getContext.call(this, type, ...args);
      };
    }, disableGraphics);
    // Keep local browser checks independent of external font providers.
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    await context.route('https://fonts.gstatic.com/**', route => route.abort());
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    try { await fn(page, context); assert.deepEqual(errors, []); console.log('PASS ' + name); passed++; }
    catch (error) { await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }); throw new Error(name + ': ' + error.message, { cause: error }); }
    finally { await context.close(); }
  };
  const fixtures = async (page, options = {}) => {
    const records = new Map(); let posts = 0, puts = 0, attempts = 0, dashboardAttempts = 0;
    await page.route('**/api/**', async route => {
      const request = route.request(); const pathname = new URL(request.url()).pathname;
      const method = request.method(); const body = request.postDataJSON();
      const reply = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
      if (pathname === '/api/portfolio/my') {
        dashboardAttempts++;
        if (options.dashboardFailure && dashboardAttempts === 1) return reply({ error: 'Temporary outage' }, 503);
        return reply({ data: [...records.values()] });
      }
      if (pathname === '/api/portfolio' && method === 'POST') {
        attempts++;
        if (options.firstSaveFailure && attempts === 1) return reply({ error: 'Please retry this save.' }, 503);
        if (options.expired) return reply({ error: 'Expired' }, 401);
        if (options.delay) await new Promise(resolve => setTimeout(resolve, 250));
        const record = { ...body, _id: 'abc123', shareSlug: 'anya-stable', updatedAt: new Date().toISOString() };
        records.set(record._id, record); posts++;
        return reply({ data: { id: record._id, shareSlug: record.shareSlug } }, 201);
      }
      if (pathname.startsWith('/api/portfolio/share/')) return reply({ error: 'Private record' }, 404);
      if (pathname === '/api/portfolio/abc123') {
        if (method === 'PUT') {
          if (options.delay) await new Promise(resolve => setTimeout(resolve, 250));
          Object.assign(records.get('abc123'), body); puts++;
        }
        return reply({ data: records.get('abc123') });
      }
      if (pathname.startsWith('/api/ai/')) return reply({ error: 'AI temporarily unavailable' }, 503);
      return reply({ error: 'Unknown fixture request' }, 404);
    });
    return { records, counts: () => ({ posts, puts, attempts, dashboardAttempts }) };
  };
  const fill = async page => {
    await page.getByPlaceholder('John Doe').fill('Anya');
    await page.getByPlaceholder('Write a compelling bio…').fill('I build useful tools with React and Python.');
  };
  const saveButton = page => page.getByRole('button', { name: /Save Private Portfolio|Save Changes|Publish Portfolio/ });

  try {
    await test('create → edit → reload → owner preview → update uses one record', async page => {
      const api = await fixtures(page, { delay: true });
      await page.goto(url + '/builder'); await fill(page);
      await saveButton(page).click(); await page.waitForURL('**/builder/abc123');
      await page.getByText('Saved at', { exact: false }).waitFor();
      await page.getByPlaceholder('John Doe').fill('Anya Updated');
      await saveButton(page).click(); await page.getByText('Saved at', { exact: false }).waitFor();
      assert.deepEqual(api.counts(), { posts: 1, puts: 1, attempts: 1, dashboardAttempts: 0 });
      await page.reload(); assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya Updated');
      assert.equal(await page.getByRole('button', { name: 'Recover draft', exact: true }).count(), 0);
      await page.getByRole('button', { name: '👁 Preview', exact: true }).click(); await page.waitForURL('**/preview');
      await page.getByRole('link', { name: 'Back to Builder', exact: false }).click(); await page.waitForURL('**/builder/abc123');
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya Updated');
      await page.goto(url + '/preview/abc123'); await page.getByText('Private — only you can view', { exact: false }).waitFor();
      assert.equal(api.records.size, 1);
      await page.screenshot({ path: path.join(output, 'private-preview.png') });
    });
    await test('dashboard and saved-portfolio previews stay in the same tab', async (page, context) => {
      await fixtures(page); await page.goto(url + '/builder'); await fill(page);
      await saveButton(page).click(); await page.waitForURL('**/builder/abc123');
      let popups = 0;
      page.on('popup', () => { popups++; });
      for (const label of ['View it here', 'View portfolio']) {
        await page.getByRole('link', { name: label, exact: true }).click();
        await page.waitForURL('**/preview/abc123');
        await page.getByText('Private — only you can view', { exact: false }).waitFor();
        assert.equal(context.pages().length, 1);
        await page.getByRole('link', { name: 'Back to Builder', exact: false }).click();
        await page.waitForURL('**/builder/abc123');
        await saveButton(page).click();
        await page.getByRole('link', { name: 'View portfolio', exact: true }).waitFor();
      }
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url + '/dashboard');
        await page.getByRole('link', { name: 'Preview', exact: true }).click();
        await page.waitForURL('**/preview/abc123');
        await page.getByText('Private — only you can view', { exact: false }).waitFor();
        assert.equal(context.pages().length, 1);
      }
      assert.equal(popups, 0);
    });
    await test('new portfolios offer recovery without automatically copying preview content', async page => {
      await fixtures(page); await page.goto(url + '/builder'); await fill(page);
      await page.waitForFunction(() => !!localStorage.getItem('porty:draft:v1:owner-one:new'));
      await page.reload(); await page.getByRole('button', { name: 'Recover draft', exact: true }).waitFor();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), '');
      await page.getByRole('button', { name: 'Recover draft', exact: true }).click();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya');
      await page.reload(); await page.getByRole('button', { name: 'Start new portfolio', exact: true }).click();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), '');
      assert.equal(await page.evaluate(() => localStorage.getItem('porty:draft:v1:owner-one:new')), null);
    });
    await test('failed saves preserve text and can be retried', async page => {
      const api = await fixtures(page, { firstSaveFailure: true }); await page.goto(url + '/builder'); await fill(page);
      await saveButton(page).click(); await page.getByText('Please retry this save.', { exact: false }).waitFor();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya');
      await saveButton(page).click(); await page.waitForURL('**/builder/abc123');
      assert.equal(api.counts().posts, 1); assert.equal(api.counts().attempts, 2);
    });
    await test('dashboard errors show Retry and never masquerade as empty accounts', async page => {
      await fixtures(page, { dashboardFailure: true }); await page.goto(url + '/dashboard');
      await page.getByRole('heading', { name: 'Your portfolios could not be loaded' }).waitFor();
      assert.equal(await page.getByText('No portfolios yet').count(), 0);
      await page.getByRole('button', { name: 'Retry', exact: true }).click(); await page.getByText('No portfolios yet').waitFor();
    });
    await test('storage failures and blocked popups still permit same-tab preview and return', async page => {
      await fixtures(page); await page.goto(url + '/builder');
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Unavailable', 'QuotaExceededError'); }; window.open = () => null; });
      await fill(page); await page.getByRole('button', { name: '👁 Preview', exact: true }).click();
      await page.waitForURL('**/preview'); await page.getByText('Preview is available while this page is open.', { exact: false }).waitFor();
      await page.getByRole('link', { name: 'Back to Builder', exact: false }).click();
      await page.waitForURL('**/builder'); assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya');
    });
    await test('expired sessions retain input and offer sign-in', async page => {
      await fixtures(page, { expired: true }); await page.goto(url + '/builder'); await fill(page);
      await saveButton(page).click(); await page.getByText('Your session has expired.', { exact: false }).waitFor();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya');
      await page.getByRole('link', { name: 'Sign in again' }).waitFor();
    });
    await test('mobile and desktop builder navigation, preview and save remain reachable', async page => {
      await fixtures(page); await page.goto(url + '/builder'); await fill(page);
      for (const width of [360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
        await page.getByRole('switch').waitFor();
        assert.equal(await saveButton(page).isVisible(), true);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        if (overflow) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 12).map(e => ({ tag: e.tagName, class: e.className, width: e.getBoundingClientRect().width, right: e.getBoundingClientRect().right }))));
        assert.equal(overflow, false, `Page overflow at ${width}px`);
        await page.getByRole('button', { name: 'Personal Info', exact: true }).click();
        await page.screenshot({ path: path.join(output, `builder-${width}.png`), fullPage: true });
      }
    });
    await test('WebGL-disabled entry pages remain usable without reduced motion', async (page) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      for (const route of ['/', '/login', '/register']) {
        await page.goto(url + route); assert.equal(await page.locator('#root').innerText().then(s => s.length > 30), true);
      }
      await page.getByPlaceholder('John Doe').fill('No graphics needed');
    });
    await test('clipboard rejection reports failure and share cancellation is silent', async page => {
      await page.route('**/api/portfolio/share/*', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: { name: 'Anya', title: 'Developer', about: 'Real content', theme: 'minimalist', skills: [], projects: [], experience: [], contact: {}, socialLinks: {} } }) }));
      await page.goto(url + '/p/anya');
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } });
        Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Canceled', 'AbortError'); } });
      });
      await page.getByRole('button', { name: 'Copy link' }).click();
      await page.getByText('Could not copy the link.', { exact: false }).waitFor();
      assert.equal(await page.getByText('Link copied to clipboard', { exact: false }).count(), 0);
      await page.getByRole('button', { name: 'Share', exact: false }).click();
      assert.equal(await page.getByText('Sharing failed.', { exact: false }).count(), 0);
    });
    await test('theme fixtures show supplied skills without invented scores, distance or project status', async page => {
      await fixtures(page); await page.goto(url + '/builder');
      const data = { name: 'Anya', title: 'Student', about: 'Real biography', skills: ['React', 'Python'], projects: [{ title: 'PORTY', description: 'Built portfolio tools', techStack: ['React'], link: 'https://example.com/project', github: 'https://github.com/example/project' }], experience: [], certifications: [], achievements: [], codingProfiles: [], contact: {}, socialLinks: {} };
      for (const theme of ['kinetic', 'executive', 'dashboard-portfolio', 'google-maps-portfolio']) {
        await page.evaluate(({ data, theme }) => sessionStorage.setItem('porty:preview:v1', JSON.stringify({ account: 'owner-one', data: { ...data, theme }, returnTo: '/builder' })), { data, theme });
        await page.goto(url + '/preview');
        const document = page.frameLocator('iframe[title="Full portfolio preview"]');
        await document.getByText('PORTY', { exact: true }).first().waitFor();
        const text = await document.locator('body').innerText();
        assert.ok(text.includes('React') && text.includes('Python') && text.includes('PORTY'));
        assert.doesNotMatch(text, /\d+%|\d+\.0 km|Beta|Archived|Open to opportunities/);
        if (theme === 'google-maps-portfolio') await document.getByRole('link', { name: 'View project', exact: false }).waitFor();
      }
    });
    await test('failed uploads and AI recommendations display recoverable feedback', async page => {
      await fixtures(page); await page.goto(url + '/builder'); await fill(page);
      await page.locator('input[type="file"]').first().setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
      await page.getByText('Could not read that image.', { exact: false }).waitFor();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya');
      await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByRole('button', { name: 'Recommend My Theme', exact: false }).click();
      await page.getByText('AI temporarily unavailable', { exact: false }).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Recommend My Theme', exact: false }).isEnabled(), true);
    });
    await test('graphics context loss falls back and leaves the entry flow usable', async page => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(url + '/login');
      await page.locator('.grainient-container canvas').waitFor();
      const lost = await page.evaluate(() => {
        const canvas = document.querySelector('.grainient-container canvas');
        const gl = canvas.getContext('webgl2');
        const extension = gl?.getExtension('WEBGL_lose_context');
        if (!extension) return false;
        extension.loseContext(); return true;
      });
      assert.ok(lost, 'A real WebGL context is required for this scenario');
      await page.waitForFunction(() => !document.querySelector('.grainient-container canvas'));
      await page.getByPlaceholder('john@example.com').fill('anya@example.com');
      assert.equal(await page.getByPlaceholder('john@example.com').inputValue(), 'anya@example.com');
    }, false);
    await test('AI bio review preserves manual edits and supports edit, apply, restore and dismiss', async page => {
      await fixtures(page);
      let bioRequests = 0;
      await page.route('**/api/ai/bio', async route => {
        bioRequests++;
        assert.equal(route.request().postDataJSON().about, bioRequests === 1 ? 'I build useful tools with React and Python.' : 'My manual edit while AI works.');
        await new Promise(resolve => setTimeout(resolve, 150));
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ bio: 'A suggested biography.' }) });
      });
      await page.goto(url + '/builder'); await fill(page);
      await page.getByRole('button', { name: /Generate Bio/ }).click();
      await page.getByPlaceholder('Write a compelling bio…').fill('My manual edit while AI works.');
      await page.getByLabel('Review suggested bio', { exact: true }).waitFor();
      assert.equal(await page.getByPlaceholder('Write a compelling bio…').inputValue(), 'My manual edit while AI works.');
      await page.getByLabel('Review suggested bio', { exact: true }).fill('My reviewed biography.');
      await page.getByRole('button', { name: 'Apply suggestion', exact: true }).click();
      assert.equal(await page.getByPlaceholder('Write a compelling bio…').inputValue(), 'My reviewed biography.');
      await page.getByRole('button', { name: 'Restore previous text', exact: true }).click();
      assert.equal(await page.getByPlaceholder('Write a compelling bio…').inputValue(), 'My manual edit while AI works.');
      await page.getByRole('button', { name: /Generate Bio/ }).click();
      await page.getByLabel('Review suggested bio', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Try another', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('.ai-review button:disabled'));
      await page.getByRole('button', { name: 'Dismiss suggestion', exact: true }).click();
      assert.equal(await page.getByLabel('Review suggested bio', { exact: true }).count(), 0);
      assert.equal(await page.getByPlaceholder('Write a compelling bio…').inputValue(), 'My manual edit while AI works.');
      assert.equal(bioRequests, 3);
    });
    await test('AI skills are added only after individual selection', async page => {
      await fixtures(page);
      await page.route('**/api/ai/skills', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ skills: ['Python', 'Docker'] }) }));
      await page.goto(url + '/builder'); await fill(page);
      await page.getByPlaceholder('Full Stack Developer · ML Engineer').fill('Developer');
      await page.getByRole('button', { name: 'Skills', exact: true }).click();
      await page.getByRole('button', { name: /Suggest Skills/ }).click();
      await page.getByRole('checkbox', { name: 'Python', exact: true }).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Remove Python', exact: true }).count(), 0);
      await page.getByRole('checkbox', { name: 'Python', exact: true }).check();
      await page.getByRole('button', { name: 'Add selected skills', exact: true }).click();
      await page.getByRole('button', { name: 'Remove Python', exact: true }).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Remove Docker', exact: true }).count(), 0);
    });
    await test('project rewrites require facts and a removed editor cannot overwrite the next project', async page => {
      await fixtures(page);
      await page.route('**/api/ai/project', async route => {
        await new Promise(resolve => setTimeout(resolve, 400));
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ description: 'Suggested description for project one.' }) }).catch(() => {});
      });
      await page.goto(url + '/builder'); await fill(page);
      await page.getByRole('button', { name: 'Projects', exact: true }).click();
      await page.getByRole('button', { name: 'Add Project', exact: false }).click();
      await page.getByPlaceholder('E-Commerce Platform').fill('First project');
      await page.getByRole('button', { name: 'Write with AI' }).click();
      await page.getByText('Add a few facts', { exact: false }).waitFor();
      await page.getByPlaceholder('What does it do? What problem does it solve?').fill('I built a class journal.');
      await page.getByRole('button', { name: 'Add Project', exact: false }).click();
      await page.getByPlaceholder('E-Commerce Platform').nth(1).fill('Second project');
      await page.getByPlaceholder('What does it do? What problem does it solve?').nth(1).fill('Untouched second description.');
      await page.getByRole('button', { name: 'Write with AI' }).first().click();
      await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
      await page.waitForTimeout(500);
      assert.equal(await page.getByPlaceholder('E-Commerce Platform').inputValue(), 'Second project');
      assert.equal(await page.getByPlaceholder('What does it do? What problem does it solve?').inputValue(), 'Untouched second description.');
      assert.equal(await page.getByRole('button', { name: 'Apply suggestion', exact: true }).count(), 0);
    });
    await test('theme search, isolated real content, focus, cancel, palette reset and saved colours', async page => {
      const api = await fixtures(page);
      await page.route('**/api/ai/theme-recommend', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ recommendations: ['minimalist', 'aurora', 'museum'].map(theme => ({ theme, reason: 'Fits your supplied profile.' })) }) }));
      await page.goto(url + '/builder'); await fill(page);
      await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByRole('button', { name: /Recommend My Theme/ }).click();
      await page.locator('.ai-result').nth(2).waitFor();
      assert.equal(await page.locator('.ai-result').count(), 3);
      await page.getByLabel('Search themes by name or style').fill('NO MATCH HERE');
      await page.getByText('No themes match.', { exact: false }).waitFor();
      await page.getByLabel('Search themes by name or style').fill('AURORA');
      const card = page.locator('.theme-grid').getByRole('button', { name: 'Preview Aurora', exact: true });
      assert.equal(await page.locator('.theme-card').count(), 1); await card.click();
      const dialog = page.getByRole('dialog'); await dialog.waitFor();
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.getByRole('button', { name: 'Cancel', exact: true }).evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Tab');
      assert.equal(await page.getByRole('button', { name: 'Close theme preview', exact: true }).evaluate(el => el === document.activeElement), true);
      await page.frameLocator('iframe[title="Aurora theme preview"]').getByText('Anya', { exact: false }).first().waitFor();
      assert.equal(await dialog.locator('iframe').getAttribute('aria-hidden'), 'true');
      await page.getByRole('button', { name: 'Midnight', exact: true }).click();
      assert.equal(await page.getByLabel('Background', { exact: true }).inputValue(), '#101522');
      await page.getByRole('button', { name: 'Reset colours', exact: true }).click();
      assert.equal((await page.getByLabel('Background', { exact: true }).inputValue()).toLowerCase(), '#101525');
      await page.getByLabel('Text', { exact: true }).evaluate(el => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '#101525'); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.getByText('These colours may be hard to read.', { exact: false }).waitFor();
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      assert.equal(await card.evaluate(el => el === document.activeElement), true);
      await page.getByText('selected: Minimalist', { exact: false }).waitFor();
      await card.click(); await page.getByRole('button', { name: 'Midnight', exact: true }).click();
      await page.getByRole('button', { name: 'Mobile layout', exact: true }).last().click();
      assert.equal(await dialog.locator('iframe').evaluate(el => el.style.width), '390px');
      await page.getByRole('button', { name: 'Apply Theme', exact: true }).click();
      await saveButton(page).click(); await page.waitForURL('**/builder/abc123');
      assert.equal(api.records.get('abc123').theme, 'aurora');
      assert.deepEqual(api.records.get('abc123').themeColors, { bg: '#101522', text: '#f5f7ff', accent: '#b9a3ff' });
      await page.frameLocator('iframe[title="Live portfolio preview"]').getByRole('heading', { name: 'Anya', exact: true }).waitFor();
      await page.screenshot({ path: path.join(output, 'theme-picker-desktop.png') });
    });
    await test('desktop live preview updates and mobile Edit/Preview preserves the form', async page => {
      await fixtures(page); await page.goto(url + '/builder');
      const frame = page.frameLocator('iframe[title="Live portfolio preview"]');
      await frame.getByRole('heading', { name: 'Alex Morgan', exact: true }).waitFor();
      await page.getByText('Sample content · add your details to replace it', { exact: true }).waitFor();
      await fill(page);
      await frame.getByRole('heading', { name: 'Anya', exact: true }).waitFor();
      assert.equal(await frame.getByText('Community journal', { exact: true }).count(), 0);
      await page.getByPlaceholder('John Doe').fill('Anya Live');
      await frame.getByRole('heading', { name: 'Anya Live', exact: true }).waitFor();
      await page.setViewportSize({ width: 390, height: 900 });
      await page.getByRole('button', { name: 'Live preview', exact: true }).click();
      await frame.getByRole('heading', { name: 'Anya Live', exact: true }).waitFor();
      assert.ok(await page.getByRole('button', { name: 'Save Private Portfolio', exact: true }).isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(output, 'live-preview-mobile.png'), fullPage: true });
      await page.getByRole('button', { name: 'Edit details', exact: true }).click();
      assert.equal(await page.getByPlaceholder('John Doe').inputValue(), 'Anya Live');
    });
    await test('full theme preview is same-tab and returning does not apply unconfirmed settings', async (page, context) => {
      await fixtures(page); await page.goto(url + '/builder'); await fill(page);
      await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByLabel('Search themes by name or style').fill('Aurora');
      await page.getByRole('button', { name: 'Preview Aurora', exact: true }).click();
      await page.getByRole('dialog').getByRole('button', { name: 'Open full preview', exact: true }).click();
      await page.waitForURL('**/preview');
      await page.getByText('Preview · Aurora', { exact: false }).waitFor();
      assert.equal(context.pages().length, 1);
      await page.getByRole('link', { name: 'Back to Builder', exact: false }).click();
      await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByText('selected: Minimalist', { exact: false }).waitFor();
      assert.equal(await page.getByPlaceholder('John Doe').count(), 0);
    });
    await test('project ordering, featured selection and case-study facts persist through save, theme preview and reload', async page => {
      const api = await fixtures(page); await page.goto(url + '/builder'); await fill(page);
      await page.getByRole('button', { name: 'Projects', exact: true }).click();
      for (const name of ['First project', 'Second project']) {
        await page.getByRole('button', { name: 'Add Project', exact: false }).click();
        await page.getByPlaceholder('E-Commerce Platform').last().fill(name);
        await page.getByPlaceholder('What does it do? What problem does it solve?').last().fill('A real description for ' + name);
      }
      const first = page.locator('.sub-card').first();
      await first.locator('.builder-project-story summary').click();
      await first.getByLabel('The problem', { exact: true }).fill('Scattered class notes.');
      await first.getByLabel('My contribution', { exact: true }).fill('I built the editor.');
      await first.getByRole('button', { name: 'Move project 1 down', exact: true }).click();
      assert.equal(await page.getByPlaceholder('E-Commerce Platform').first().inputValue(), 'Second project');
      assert.equal(await page.locator('.sub-card').last().getByLabel('My contribution', { exact: true }).inputValue(), 'I built the editor.');
      await page.locator('.sub-card').last().getByRole('button', { name: 'Feature project', exact: false }).click();
      await saveButton(page).click(); await page.waitForURL('**/builder/abc123');
      const record = api.records.get('abc123');
      assert.deepEqual(record.projects.map(p => p.title), ['Second project', 'First project']);
      assert.equal(record.projects[1].featured, true); assert.equal(record.projects[1].problem, 'Scattered class notes.');
      assert.ok(!record.projects[1].outcome);
      await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByLabel('Search themes by name or style').fill('Product Showcase');
      await page.getByRole('button', { name: 'Preview Product Showcase', exact: true }).click();
      await page.getByRole('button', { name: 'Apply Theme', exact: true }).click();
      await saveButton(page).click(); await page.getByText('Saved at', { exact: false }).waitFor();
      await page.getByRole('button', { name: '👁 Preview', exact: true }).click(); await page.waitForURL('**/preview');
      const document = page.frameLocator('iframe[title="Full portfolio preview"]');
      await document.getByRole('heading', { name: 'First project', exact: true }).waitFor();
      assert.equal(await document.locator('.product-study h3').first().innerText(), 'First project');
      await document.getByText('I built the editor.', { exact: true }).waitFor();
      await page.getByRole('link', { name: 'Back to Builder', exact: false }).click(); await page.reload();
      await page.getByRole('button', { name: 'Projects', exact: true }).click();
      assert.equal(await page.getByPlaceholder('E-Commerce Platform').first().inputValue(), 'Second project');
      await page.locator('.sub-card').last().locator('.builder-project-story summary').click();
      assert.equal(await page.locator('.sub-card').last().getByLabel('My contribution', { exact: true }).inputValue(), 'I built the editor.');
      assert.equal(api.records.size, 1); assert.equal(api.records.get('abc123').theme, 'product-showcase');
    });
    await test('Neo-brutalist palettes preview reversibly and persist through save and reload', async page => {
      const api = await fixtures(page);
      await page.goto(url + '/builder'); await fill(page);
      await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByLabel('Search themes by name or style').fill('Neo-brutalism');
      const card = page.locator('.theme-grid').getByRole('button', { name: 'Preview Brutalist', exact: true });
      assert.equal(await page.locator('.theme-card').count(), 1); await card.click();
      await page.getByRole('button', { name: 'Neo-brutalism', exact: true }).click();
      assert.equal(await page.getByLabel('Background', { exact: true }).inputValue(), '#f7de4f');
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await page.getByText('selected: Minimalist', { exact: false }).waitFor();
      await card.click(); await page.getByRole('button', { name: 'Neo-brutalism', exact: true }).click();
      await page.getByRole('button', { name: 'Apply Theme', exact: true }).click();
      await saveButton(page).click(); await page.waitForURL('**/builder/abc123');
      assert.deepEqual(api.records.get('abc123').themeColors, { bg: '#F7DE4F', text: '#191916', accent: '#5B2C8E' });
      await page.reload(); await page.getByRole('button', { name: 'Theme & Publish', exact: true }).click();
      await page.getByLabel('Search themes by name or style').fill('Brutalist');
      await page.setViewportSize({ width: 360, height: 900 }); await card.click();
      assert.equal(await page.getByLabel('Background', { exact: true }).inputValue(), '#f7de4f');
      await page.frameLocator('iframe[title="Brutalist theme preview"]').getByRole('heading', { name: 'Anya', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Neo lilac', exact: true }).click();
      assert.equal(await page.getByLabel('Background', { exact: true }).inputValue(), '#ded5f1');
      await page.getByRole('button', { name: 'Reset colours', exact: true }).click();
      assert.equal(await page.getByLabel('Background', { exact: true }).inputValue(), '#f5f5f0');
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      assert.equal(api.records.get('abc123').themeColors.bg, '#F7DE4F');
      assert.equal(api.records.size, 1);
    });
    await test('all registered lazy-loaded themes render minimal, populated and empty-optional content in isolation', async page => {
      const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../../backend/themeCatalog.json'), 'utf8'));
      await page.goto(url + '/theme-preview');
      const base = { name: 'Anya Fixture', title: 'Designer', about: 'A real biography.', avatarUrl: '', location: '', skills: [], projects: [], experience: [], certifications: [], achievements: [], codingProfiles: [], contact: {}, socialLinks: {}, themeColors: {} };
      const full = { ...base, skills: ['React', 'Python'], projects: [{ title: 'Journal', description: 'A class journal I built.', techStack: ['React'], link: 'https://example.com/project', github: '', image: '' }], experience: [{ role: 'Designer', company: 'Studio', duration: '2025', description: 'Designed a journal.', current: false }], certifications: [{ title: 'Design course', issuer: 'Studio', date: '2025', credentialUrl: 'https://example.com/course' }], achievements: [{ title: 'Class exhibition', description: 'Shared my journal.' }], codingProfiles: [{ platform: 'GitHub', username: 'anya', url: 'https://github.com/anya' }], contact: { email: 'anya@example.com' }, socialLinks: { website: 'https://example.com' } };
      for (const theme of catalog) {
        for (const variant of [base, full, { ...base, title: '', about: '' }]) {
          await page.evaluate(data => new Promise(resolve => { window.postMessage({ type: 'porty:theme-data', data }, location.origin); requestAnimationFrame(() => requestAnimationFrame(resolve)); }), { ...variant, theme: theme.id });
          await page.waitForFunction(id => document.querySelector('.isolated-theme-preview')?.dataset.themeId === id && !document.querySelector('.theme-load-message'), theme.id);
          const text = await page.locator('body').innerText();
          assert.ok(text.replace(/\s+/g, '').toLowerCase().includes('anyafixture'), theme.id + ' lost the supplied identity');
          assert.ok(!text.includes('could not be displayed'), theme.id + ' hit the error boundary');
        }
      }
    });
    console.log(`${passed} browser scenarios passed.`);
  } finally { await browser.close(); server?.kill(); }
})().catch(e => { console.error(e.stack); if (e.cause) console.error(e.cause.stack); process.exitCode = 1; });
