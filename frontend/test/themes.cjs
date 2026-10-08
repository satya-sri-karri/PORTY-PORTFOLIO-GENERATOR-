const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const output = path.join(__dirname, 'artifacts', 'complete-catalog'); fs.mkdirSync(output, { recursive: true });
const themes = ["aurora", "minimalist", "editorial", "neon-terminal", "brutalist", "neumorphic", "kinetic", "executive", "retro-wave", "organic", "bento", "dark-luxe", "apple-vision", "blueprint", "cyberpunk-2077", "ai-assistant", "interactive-3d", "timeline-journey", "dashboard-portfolio", "space-explorer", "infinite-canvas", "storybook", "spotify-wrapped", "netflix-portfolio", "google-maps-portfolio", "comic-book", "terminal-os", "newspaper", "museum", "hacker-matrix", "scrapbook", "y2k-aesthetic", "product-showcase", "surrealism", "pixel-art", "maximalism", "conceptual-sketch", "bohemian", "victorian", "wabi-sabi", "scroll-cinema"];
const selectedThemes = themes.filter(id => !process.env.PORTY_THEME_FILTER || process.env.PORTY_THEME_FILTER.split(',').some(filter => id.includes(filter)));
const svg = source => 'data:image/svg+xml;base64,' + Buffer.from(source).toString('base64');
const screenshot = svg('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600"><rect width="960" height="600" fill="#e7ecdf"/><rect x="45" y="45" width="870" height="510" rx="16" fill="#fafbf7"/><text x="85" y="118" font-family="sans-serif" font-size="24" fill="#22342d">THE COMMUNITY JOURNAL · TEST FIXTURE</text><rect x="85" y="160" width="500" height="260" rx="10" fill="#c8d4b8"/><text x="112" y="245" font-family="serif" font-size="45" fill="#22342d">Small stories.</text><text x="112" y="304" font-family="serif" font-size="45" fill="#22342d">A shared place.</text><rect x="620" y="160" width="240" height="78" rx="8" fill="#ece8de"/><rect x="620" y="262" width="240" height="78" rx="8" fill="#dce5d5"/><text x="85" y="492" font-family="sans-serif" font-size="18" fill="#22342d">A local browser fixture, not a production project screenshot.</text></svg>');
const portrait = svg('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="625"><rect width="500" height="625" fill="#cbcdbf"/><circle cx="250" cy="235" r="90" fill="#7c8b7c"/><path d="M65 625 Q80 340 250 340 Q420 340 435 625" fill="#7c8b7c"/><text x="25" y="595" font-family="sans-serif" font-size="15" fill="#22342d">Illustrative portrait fixture</text></svg>');
const basic = { name: 'Anya Karri', title: 'Product designer & developer', about: 'I turn everyday problems into thoughtful digital experiences. My work brings together visual design, accessible interfaces, and practical development.', location: 'Hyderabad, India', avatarUrl: '', skills: [], projects: [], experience: [], certifications: [], achievements: [], codingProfiles: [], contact: {}, socialLinks: {}, themeColors: {} };
const project = (i = 0) => ({ title: ['Community journal', 'Field notes', 'Study planner', 'Local archive', 'Recipe notebook', 'Reading room', 'Campus guide', 'Music library'][i], description: 'A space to collect small stories and keep useful information easy to find. I designed the interface and built the working prototype.', problem: 'Our notes were scattered across several apps.', contribution: 'I designed and built a searchable journal.', process: 'I tested the prototype with two classmates and revised the navigation.', outcome: 'We demonstrated the prototype at our class review.', techStack: ['React', 'CSS', 'Node.js'], image: i === 0 ? screenshot : '', link: `https://example.com/project/${i}`, github: `https://github.com/example/project-${i}`, featured: i === 0 });
const full = { ...basic, avatarUrl: portrait, skills: ['React', 'JavaScript', 'Interface design', 'Figma'], projects: Array.from({ length: 8 }, (_, i) => project(i)), experience: [{ role: 'Design intern', company: 'Student studio', duration: 'May – June 2026', description: 'Designed and built an interface with my project team.', current: false }], certifications: [{ title: 'Full stack development', issuer: 'Training studio', date: '2026', credentialUrl: 'https://example.com/credential' }], achievements: [{ title: 'Campus exhibition', description: 'Shared our class project at the campus exhibition.', date: '2026' }], codingProfiles: [{ platform: 'LeetCode', username: 'anya-karri', solved: '45', rating: '', url: 'https://leetcode.com/u/anya-karri/' }], contact: { email: 'anya@example.com', phone: '+919999999999' }, socialLinks: { github: 'https://github.com/example', linkedin: 'https://linkedin.com/in/example', twitter: 'https://example.com/social', website: 'https://example.com' } };
(async () => {
  const server = spawn(process.execPath, [path.join(__dirname, 'serve-build.cjs')], { env: { ...process.env, PORT: '3110' } });
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); server.once('exit', code => reject(new Error('Review server exited: ' + code))); });
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.PORTY_CHROME_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    await context.route('https://fonts.googleapis.com/**', route => route.abort()); await context.route('https://fonts.gstatic.com/**', route => route.abort());
    const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
    let active;
    await page.route('**/api/portfolio/share/*', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: active }) }));
    await page.route('**/missing-image.png', route => route.fulfill({ status: 404, body: '' }));
    const render = async (data, theme, width) => {
      active = { ...data, theme }; await page.setViewportSize({ width, height: 1000 }); await page.goto('http://127.0.0.1:3110/p/local-theme-fixture');
      await page.locator('.portfolio-v4 h1').waitFor();
      assert.equal(await page.locator('.portfolio-v4 h1').innerText(), data.name);
      assert.equal(await page.locator('.portfolio-v4 h1').count(), 1);
      assert.deepEqual(errors, []);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      if (overflow) { console.log(await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, viewport: innerWidth, client: document.documentElement.clientWidth, elements: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 || el.getBoundingClientRect().left < -1).slice(0, 12).map(el => ({ class: el.className, width: el.getBoundingClientRect().width, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right })) }))); await page.screenshot({ path: path.join(output, 'layout-failure.png') }); }
      assert.equal(overflow, false, `${theme} overflow at ${width}px`);
      const missing = await page.locator('.portfolio-v4 a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))));
      assert.deepEqual(missing, []);
    };
    let cases = 0;
    for (const theme of selectedThemes) {
      for (const variant of [full, { ...basic, projects: [project()] }, { ...basic, title: '', about: '', location: '' }]) {
        for (const width of [360, 390, 768, 1024, 1440]) {
          await render(variant, theme, width); cases++;
          if (theme === 'bento' && variant.projects.length > 4) {
            assert.equal(await page.locator('.pf-project').count(), 4);
            const expand = page.getByRole('button', { name: `View all ${variant.projects.length} projects`, exact: true });
            await expand.focus(); await page.keyboard.press('Enter');
            assert.equal(await page.getByRole('button', { name: 'Show first 4 projects', exact: true }).getAttribute('aria-expanded'), 'true');
            assert.equal(await page.locator('.pf-project').count(), variant.projects.length);
          }
          for (const item of variant.projects) await page.getByRole('heading', { name: item.title, exact: true }).waitFor();
          assert.equal(await page.locator('.pf-project-links a').count(), variant.projects.length * 2);
          if (variant === full) {
            await page.getByRole('heading', { name: 'Design intern', exact: true }).waitFor(); await page.getByRole('heading', { name: 'Campus exhibition', exact: true }).waitFor();
            assert.equal(await page.getByRole('link', { name: 'View credential', exact: false }).getAttribute('href'), full.certifications[0].credentialUrl);
            assert.equal(await page.getByRole('link', { name: 'Visit profile', exact: false }).getAttribute('href'), full.codingProfiles[0].url);
            const stories = page.locator('.pf-story'); assert.equal(await stories.count(), 8);
            for (const story of await stories.all()) if (!(await story.evaluate(el => el.open))) await story.locator('summary').click();
            assert.equal(await page.getByText('We demonstrated the prototype at our class review.', { exact: true }).count(), 8);
            assert.equal(await page.locator('.pf-skills span').count(), full.skills.length);
            assert.equal(await page.getByRole('link', { name: 'Email', exact: false }).getAttribute('href'), `mailto:${full.contact.email}`);
          } else if (!variant.projects.length) {
            assert.equal(await page.locator('#pf-work, #pf-experience, #pf-credentials, #pf-profiles, #pf-contact').count(), 0);
          }
        }
      }
      // Additional stress cases: long strings, missing nested fields, broken images and a light custom palette.
      const long = { ...full, name: 'Anya Verylongnamewithoutspaces'.repeat(3), about: basic.about.repeat(12), projects: [{ ...project(), title: 'A very long project title with a clear explanation '.repeat(4), description: 'LongDescriptionWithoutSpaces'.repeat(60), image: '/missing-image.png' }], avatarUrl: '/missing-image.png', contact: { email: 'long-address-'.repeat(14) + '@example.com' }, themeColors: { bg: '#fff4e8', text: '#35251f', accent: '#984222' } };
      for (const width of [360, 1440]) {
        await render(long, theme, width); cases++;
        await page.locator('.pf-project-media').scrollIntoViewIfNeeded(); await page.getByText('Screenshot unavailable', { exact: true }).waitFor();
        assert.equal(await page.locator('.portfolio-v4').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 244, 232)');
      }
      await render({ name: 'Anya Legacy', projects: [{ title: 'Legacy project' }] }, theme, 390); cases++;
      await page.getByRole('heading', { name: 'Legacy project', exact: true }).waitFor();
      for (const width of [360, 1440]) {
        await render({ ...full, projects: full.projects.slice(0, 2), themeColors: { bg: '#12161e', text: '#edf0fa', accent: '#c1b0f0' } }, theme, width); cases++;
        assert.equal(await page.locator('.portfolio-v4').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(18, 22, 30)');
        assert.equal(await page.locator('.portfolio-v4').evaluate(el => getComputedStyle(el).color), 'rgb(237, 240, 250)');
      }
      if (theme === 'kinetic') {
        for (const width of [360, 1440]) {
          await render(full, theme, width);
          assert.ok((await page.getByRole('button', { name: 'Index view', exact: true }).boundingBox()).height >= 44);
          await page.getByRole('button', { name: 'Index view', exact: true }).click();
          assert.equal(await page.getByRole('button', { name: 'Index view', exact: true }).getAttribute('aria-pressed'), 'true');
          assert.equal(await page.locator('.kinetic-index .pf-project').count(), 8);
          assert.equal(await page.locator('.pf-project-links a').count(), 16);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
          await page.getByRole('button', { name: 'Gallery view', exact: true }).focus(); await page.keyboard.press('Space');
          assert.equal(await page.locator('.kinetic-index').count(), 0);
          assert.equal(await page.getByRole('button', { name: 'Gallery view', exact: true }).getAttribute('aria-pressed'), 'true');
        }
        console.log('PASS Kinetic gallery/index views and keyboard switching retain every project and destination');
      }
      if (theme === 'bento') {
        for (const width of [360, 1440]) {
          await render({ ...full, projects: full.projects.map((item, i) => ({ ...item, featured: i === 6 })) }, theme, width);
          assert.equal(await page.locator('.pf-project h3').first().innerText(), full.projects[6].title);
          assert.equal(await page.locator('.pf-project').count(), 4);
          await page.getByRole('button', { name: 'View all 8 projects', exact: true }).focus(); await page.keyboard.press('Space');
          assert.equal(await page.locator('.pf-project').count(), 8);
          assert.equal(await page.locator('.pf-project-links a').count(), 16);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
          await page.getByRole('button', { name: 'Show first 4 projects', exact: true }).click();
          assert.equal(await page.locator('.pf-project').count(), 4);
          assert.equal(await page.getByRole('button', { name: 'View all 8 projects', exact: true }).getAttribute('aria-expanded'), 'false');
          assert.equal(await page.getByRole('button', { name: 'View all 8 projects', exact: true }).evaluate(el => el === document.activeElement), true);
        }
        console.log('PASS Bento keyboard expansion/collapse, focus retention and featured ordering expose all eight projects');
      }
      if (theme === 'neon-terminal') {
        for (const width of [360, 1440]) {
          await render(full, theme, width);
          await page.getByRole('button', { name: 'Compact view', exact: true }).click();
          assert.equal(await page.getByRole('button', { name: 'Compact view', exact: true }).getAttribute('aria-pressed'), 'true');
          assert.equal(await page.locator('.terminal-compact .pf-project').count(), 8);
          assert.equal(await page.locator('.pf-project-links a').count(), 16);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
          const files = page.getByRole('navigation', { name: 'Portfolio files' });
          await files.getByRole('link', { name: 'credentials.md', exact: false }).click();
          assert.equal(new URL(page.url()).hash, '#pf-credentials');
          await files.getByRole('link', { name: 'projects/', exact: false }).click();
          await page.getByRole('button', { name: 'Card view', exact: true }).focus(); await page.keyboard.press('Space');
          assert.equal(await page.locator('.terminal-compact').count(), 0);
          assert.equal(await page.getByRole('button', { name: 'Card view', exact: true }).getAttribute('aria-pressed'), 'true');
        }
        console.log('PASS terminal file destinations and keyboard card/compact switching at phone and desktop widths');
      }
      const visual = { ...full, projects: full.projects.slice(0, 3) };
      for (const width of [1440, 390]) {
        await render(visual, theme, width);
        await page.screenshot({ path: path.join(output, `${theme}-${width}-hero.png`) });
        await page.locator('#pf-work').evaluate(el => el.scrollIntoView({ block: 'start' })); await page.screenshot({ path: path.join(output, `${theme}-${width}-work.png`) });
      }
      console.log(`PASS ${theme}: content, destinations, five widths, sparse/long/broken-image cases`);
    }
    const thirdBatch = ['kinetic', 'executive', 'retro-wave', 'organic', 'bento'].filter(theme => selectedThemes.includes(theme));
    for (const theme of thirdBatch) {
      await render(full, theme, 1440);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      if (theme === 'kinetic') {
        assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).animationName), 'pf-kinetic-arrive');
        assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).animationIterationCount), '1');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).animationName), 'none');
      }
      if (theme === 'retro-wave') {
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.retro-grid')).animationName === 'fx-horizon');
        await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
        assert.equal(await page.locator('.retro-grid').evaluate(el => getComputedStyle(el).animationName), 'none');
        await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.retro-grid')).animationName === 'none');
      }
      await page.goto('http://127.0.0.1:3110/theme-preview'); await page.getByText('Waiting for preview…').waitFor();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.evaluate(({ data, theme }) => window.postMessage({ type: 'porty:theme-data', data: { ...data, theme }, staticPreview: true }, location.origin), { data: full, theme });
      await page.locator('.pf-static h1').waitFor();
      const animated = await page.locator('.pf-static *').evaluateAll(elements => elements.filter(el => getComputedStyle(el).animationName !== 'none').length);
      assert.equal(animated, 0, theme + ' animated inside static preview');
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    if (thirdBatch.length) console.log('PASS third-batch static previews, finite Kinetic entrance and dynamic reduced motion; Retro Wave horizon pauses and honors reduced motion');
    if (selectedThemes.includes('aurora')) {
      await render(full, 'aurora', 1440);
      assert.equal(await page.locator('.aurora-orbit').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      assert.equal(await page.locator('.aurora-motion').count(), 0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.getByRole('button', { name: 'Pause atmosphere', exact: true }).waitFor();
      await page.waitForFunction(() => document.querySelector('.aurora-hero')?.dataset.animate === 'true');
      await page.getByRole('button', { name: 'Pause atmosphere', exact: true }).click();
      assert.equal(await page.locator('.aurora-orbit').first().evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
      await page.getByRole('button', { name: 'Animate atmosphere', exact: true }).click();
      assert.equal(await page.locator('.aurora-orbit').first().evaluate(el => getComputedStyle(el).animationPlayState), 'running');
      await page.locator('#pf-contact').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.aurora-hero')?.dataset.animate === 'false');
      assert.equal(await page.locator('.aurora-orbit').first().evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.aurora-orbit').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      await page.goto('http://127.0.0.1:3110/theme-preview');
      await page.getByText('Waiting for preview…').waitFor();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.evaluate(data => window.postMessage({ type: 'porty:theme-data', data: { ...data, theme: 'aurora' }, staticPreview: true }, location.origin), full);
      await page.locator('.pf-static h1').waitFor();
      assert.equal(await page.locator('.aurora-orbit').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      assert.equal(await page.locator('.aurora-motion').count(), 0);
      console.log('PASS Aurora pause/resume, offscreen pause, dynamic reduced motion and static preview');
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ themes: selectedThemes, cases, widths: [360, 390, 768, 1024, 1440], errors, externalFonts: 'blocked for deterministic fallback-font checks' }, null, 2));
    console.log(`${cases} theme layout/content cases passed; ${selectedThemes.length * 4} review screenshots saved.`);
    await context.close();
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
  finally { await browser?.close(); server.kill(); }
})();
