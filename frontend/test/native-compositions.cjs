const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const baseline = process.env.PORTY_BASELINE_ROOT;
if (!baseline) throw new Error('Set PORTY_BASELINE_ROOT to a separately built checkout of 7ef2676.');
const fixture = {name:'Anya Karri',title:'Designer & developer',about:'I turn everyday problems into thoughtful experiences.',location:'Hyderabad',motion:'none',skills:['Design','React'],themeColors:{},projects:[0,1,2].map(i=>({title:`Project ${i}`,description:'Actual supplied description.',image:'',techStack:['React'],link:`https://example.com/project/${i}`,github:`https://github.com/example/${i}`})),experience:[{role:'Designer',company:'Studio',duration:'2026'}],contact:{email:'anya@example.com'},isPublic:true};
(async()=>{
 const servers = [spawn(process.execPath,[path.join(__dirname,'serve-build.cjs')],{env:{...process.env,PORT:'3116'}}),spawn(process.execPath,[path.resolve(baseline,'frontend/test/serve-build.cjs')],{env:{...process.env,PORT:'3117'}})];
 let browser;
 try {
  await Promise.all(servers.map(server=>new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Comparison server exited: '+code))); })));
  browser=await chromium.launch({headless:true,executablePath:process.env.PORTY_CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({reducedMotion:'reduce'});await context.route('https://fonts.googleapis.com/**',r=>r.abort());await context.route('https://fonts.gstatic.com/**',r=>r.abort());
  let active;await context.route('**/api/portfolio/share/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({data:active})}));
  const pages=await Promise.all([context.newPage(),context.newPage()]);pages.forEach(page=>page.setDefaultTimeout(15000));let cases=0;
  for(const {id} of JSON.parse(fs.readFileSync(path.join(__dirname,'../../backend/themeCatalog.json'))))for(const width of [390,1440]) {
   active={...fixture,theme:id};const snapshots=[];
   for(let i=0;i<pages.length;i++){
    const page=pages[i];await page.setViewportSize({width,height:1000});await page.goto(`http://127.0.0.1:${3116+i}/p/native-fixture`);await page.locator('.portfolio-v4 h1').waitFor();
    snapshots.push(await page.evaluate(()=>['.portfolio-v4','.pf-container','.pf-hero','.portfolio-v4 h1','.pf-section-heading h2','#pf-work .pf-project-grid, #pf-work .scrapbook-project-grid, #pf-work .editorial-project-grid, #pf-work .product-studies','#pf-work .pf-project, #pf-work .scrapbook-project, #pf-work .product-study, #pf-work .editorial-project','#pf-work .pf-project-media'].map(sel=>{const node=document.querySelector(sel),s=node&&getComputedStyle(node);if(!node)return null;return [s.color,s.backgroundColor,s.fontFamily,s.fontSize,s.fontWeight,s.letterSpacing,s.display,s.gridTemplateColumns,s.gap,s.textAlign,s.padding,s.margin,s.aspectRatio,s.borderRadius,s.borderWidth,node.getBoundingClientRect().width];})));
   }
   assert.deepEqual(snapshots[0],snapshots[1],`${id} at ${width}: native composition differs from pre-studio baseline`);cases++;
  }
  console.log(`PASS ${cases} desktop/phone native composition comparisons against 7ef2676; colors, typography, grids, spacing and frames retained.`);
 }finally{await browser?.close();servers.forEach(s=>s.kill());}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
