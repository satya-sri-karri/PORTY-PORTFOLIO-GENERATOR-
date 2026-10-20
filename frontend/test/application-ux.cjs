const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, ResourceLoader, VirtualConsole} = require('jsdom');
const build = path.resolve(__dirname,'../build');
class LocalBuild extends ResourceLoader {
  fetch(url) { const parsed=new URL(url); if(parsed.hostname!=='porty.test' || !parsed.pathname.startsWith('/static/'))return null; return Promise.resolve(fs.readFileSync(path.join(build,parsed.pathname))); }
}
const tick=()=>new Promise(resolve=>setTimeout(resolve,50));
async function until(condition){for(let i=0;i<180;i++){if(condition())return;await tick();}throw Error('Timed out waiting for application state');}
const fixture={_id:'one',name:'Anya',title:'Designer',about:'I make thoughtful digital experiences.',theme:'minimalist',projects:[{title:'Journal',description:'A personal project',techStack:[]}],skills:['React'],contact:{email:'anya@example.com'},isPublic:false,shareSlug:'anya-work',createdAt:'2026-10-01T00:00:00Z',updatedAt:'2026-10-01T00:00:00Z'};
async function open(route,authenticated=false,empty=false){
  const errors=[],calls=[],writes=[];const console=new VirtualConsole();console.on('jsdomError',error=>{if(error.type!=='css parsing')errors.push(error.message);});
  const dom=new JSDOM(fs.readFileSync(path.join(build,'index.html'),'utf8'),{url:'https://porty.test'+route,runScripts:'dangerously',resources:new LocalBuild(),pretendToBeVisual:true,virtualConsole:console,beforeParse(window){
    window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
    window.ResizeObserver=class{observe(){}disconnect(){}};window.IntersectionObserver=class{observe(){}disconnect(){}};
    window.confirm=()=>true;window.scrollTo=()=>{};window.structuredClone=structuredClone; window.crypto={randomUUID:require("node:crypto").randomUUID};
    if(authenticated){window.localStorage.setItem('token','fixture-token');window.localStorage.setItem('user',JSON.stringify({_id:'owner',name:'Anya'}));}
    window.fetch=async(url,options={})=>{const pathname=new URL(url,'https://porty.test').pathname;calls.push(pathname);let data={success:true};
      if(pathname==='/api/portfolio/my')data={data:empty?[]:[fixture]};
      else if(pathname==='/api/portfolio/one'){if(options.method==='PUT')writes.push(JSON.parse(options.body));data={data:{...fixture,...(writes.at(-1)||{})}};}
      else if(pathname==='/api/portfolio/capabilities')data={data:{layoutStudio:true}};
      else if(pathname==='/api/ai/character/status')data={available:false};
      else if(pathname==='/api/portfolio/showcase')data={data:[]};
      else if(pathname==='/api/auth/send-otp')data={message:'Code sent'};
      else if(pathname==='/api/auth/verify-otp')data={token:'fixture-token',user:{_id:'owner',name:'Anya'}};
      else if(pathname==='/api/auth/forgot-password')data={message:'Recovery code sent'};
      return {ok:true,status:200,json:async()=>data};
    };
  }});
  const document=dom.window.document;
  try { await until(()=>document.querySelector('h1')); } catch (error) { throw new Error(error.message + ': ' + errors.join(' | ')); }
  const button=(name,scope=document)=>[...scope.querySelectorAll('button')].find(node=>[...node.childNodes].map(child=>child.nodeType===1 && child.getAttribute('aria-hidden')==='true' ? '' : child.textContent).join('').replace(/\s+/g,' ').trim()===name);
  const click=async(name,scope)=>{const node=button(name,scope);assert.ok(node,`Missing button: ${name}`);node.focus();node.click();await tick();};
  const fill=async(id,value)=>{const input=document.getElementById(id);assert.ok(input,`Missing field ${id}`);const prototype=input.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(prototype,'value').set.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));await tick();};
  return {dom,document,errors,calls,writes,button,click,fill,close(){dom.window.close();}};
}

test('landing offers one primary route and authenticating screens remove competing signup actions',async()=>{
  let app=await open('/');try{const hero=app.document.querySelector('.app-hero');assert.equal(hero.querySelectorAll('a.btn').length,1);assert.equal(hero.querySelector('a').getAttribute('href'),'/try');assert.equal(app.document.querySelectorAll('canvas').length,0);assert.deepEqual(app.errors,[]);}finally{app.close();}
  app=await open('/register');try{assert.equal(app.document.querySelector('.navbar a[href="/try"]'),null);assert.equal(app.document.querySelector('.auth-alternate a').getAttribute('href'),'/login');await app.fill('auth-email','anya@example.com');app.document.querySelector('form').dispatchEvent(new app.dom.window.Event('submit',{bubbles:true,cancelable:true}));await until(()=>app.document.querySelector('#auth-otp'));assert.equal(app.calls.filter(p=>p==='/api/auth/send-otp').length,1);assert.ok(app.button('Change email'));assert.deepEqual(app.errors,[]);}finally{app.close();}
});

test('guest stages retain entered content and expose three directions before the full catalog',async()=>{
  const app=await open('/try');try{await app.fill('trial-name','Anya');assert.equal(app.document.querySelector('#trial-project-0'),null);await app.click('Continue →');await app.fill('trial-project-0','My journal');await app.click('Continue →');assert.equal(app.document.querySelectorAll('.trial-style-choices button').length,3);assert.equal(app.document.querySelector('#trial-theme').closest('details').open,false);await app.click('← Back');assert.equal(app.document.querySelector('#trial-project-0').value,'My journal');await app.click('← Back');assert.equal(app.document.querySelector('#trial-name').value,'Anya');assert.deepEqual(app.errors,[]);}finally{app.close();}
});

test('dashboard puts portfolios before utilities and keeps destructive actions disclosed',async()=>{
  let app=await open('/dashboard',true);try{await until(()=>app.document.querySelector('.app-portfolio-card'));const card=app.document.querySelector('.app-portfolio-card');assert.ok(card.querySelector('a[href="/builder/one"]'));assert.equal(card.querySelector('.portfolio-more').open,false);assert.ok(app.document.querySelector('.portfolio-grid').compareDocumentPosition(app.document.querySelector('.workspace-tools')) & app.dom.window.Node.DOCUMENT_POSITION_FOLLOWING);assert.equal(app.document.querySelector('.portfolio-more-content button.btn-danger').textContent,'Move to Trash');assert.equal(app.document.querySelector('.portfolio-more-content button.btn-secondary'),null);assert.deepEqual(app.errors,[]);}finally{app.close();}
  app=await open('/dashboard',true,true);try{await until(()=>app.document.querySelector('.app-empty'));assert.equal(app.document.querySelectorAll('a[href="/builder"]').length,1);assert.deepEqual(app.errors,[]);}finally{app.close();}
});

test('builder separates core, optional, style and publication decisions without losing data',async()=>{
 const app=await open('/builder/one',true);try{
  await until(()=>app.document.querySelector('.studio-steps'));assert.equal(app.document.querySelectorAll('.studio-steps button').length,5);assert.equal(app.document.querySelector('.optional-steps').open,false);assert.equal(app.document.querySelector('#portfolio-name').value,'Anya');
  await app.fill('portfolio-name','Anya Updated');await app.click('Your work');await app.click('About you');assert.equal(app.document.querySelector('#portfolio-name').value,'Anya Updated');
  await app.click('Design');assert.ok(app.document.querySelectorAll('.theme-card').length<=6);assert.equal(app.document.querySelector('[role=switch]'),null);await app.click('Browse all 41 themes');assert.equal(app.document.querySelectorAll('.theme-card').length,41);await app.click('Show starting points');assert.ok(app.document.querySelectorAll('.theme-card').length<=6);
  await app.click('Customise current style');await until(()=>app.document.querySelector('[role=dialog]'));
  const dialog=app.document.querySelector('[role=dialog]');assert.equal(app.document.activeElement.getAttribute('aria-label'),'Close theme preview');
  const colors=[...dialog.querySelectorAll('details')].find(node=>node.querySelector('summary').textContent==='Colours & contrast');assert.equal(colors.open,false);colors.querySelector('summary').click();await app.click('Midnight',dialog);assert.equal(dialog.querySelector('#theme-color-bg').value,'#101522');
  await app.click('Cancel',dialog);assert.equal(app.document.querySelector('[role=dialog]'),null);assert.equal(app.document.activeElement.textContent,'Customise current style');assert.equal(app.writes.length,0);
  await app.click('Skills');assert.equal(app.document.querySelector('.optional-steps').open,true);await app.click('Review & save');assert.equal(app.document.querySelector('.builder-content [role=switch]').getAttribute('aria-checked'),'false');assert.ok(app.button('Save private portfolio'));
  app.document.querySelector('.builder-content [role=switch]').click();await tick();assert.ok(app.button('Save public changes'));assert.equal(app.writes.length,0,'Changing visibility must not publish');
  app.document.querySelector('.builder-content [role=switch]').click();await tick();await app.click('Save private portfolio');await until(()=>app.writes.length===1);assert.equal(app.writes[0].name,'Anya Updated');assert.equal(app.writes[0].isPublic,false);assert.deepEqual(app.errors,[]);
 }finally{app.close();}
});

 test('application styling is scoped away from portfolio theme documents',()=>{
 const postcss=require('postcss');const sheet=postcss.parse(fs.readFileSync(path.resolve(__dirname,'../src/styles/application.css'),'utf8'));
 sheet.walkRules(rule=>assert.ok(rule.selector.includes('.porty-app'),`Unscoped application rule: ${rule.selector}`));
 });

test('recovery, community empty state and validation retain clear next actions',async()=>{
 let app=await open('/recover');try{await app.fill('recovery-email','anya@example.com');app.document.querySelector('form').dispatchEvent(new app.dom.window.Event('submit',{bubbles:true,cancelable:true}));await until(()=>app.document.querySelector('#recovery-code'));assert.equal(app.document.querySelector('#recovery-email').readOnly,true);await app.click('Change email');assert.equal(app.document.querySelector('#recovery-email').value,'anya@example.com');assert.deepEqual(app.errors,[]);}finally{app.close();}
 app=await open('/showcase');try{await until(()=>app.document.body.textContent.includes('No owners have opted in'));assert.ok(app.document.querySelector('main a[href="/try"]'));assert.deepEqual(app.errors,[]);}finally{app.close();}
 app=await open('/builder',true);try{await until(()=>app.document.querySelector('.studio-steps'));await app.click('Review & save');await app.click('Save private portfolio');assert.equal(app.document.querySelector('.builder-section-title').textContent,'About you');assert.equal(app.writes.length,0);assert.match(app.document.querySelector('.builder-content [role=alert]').textContent,/name and biography/);assert.deepEqual(app.errors,[]);}finally{app.close();}
});
