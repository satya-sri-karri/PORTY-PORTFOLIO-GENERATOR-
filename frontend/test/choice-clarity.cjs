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
    window.HTMLCanvasElement.prototype.getContext=()=>null;
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
  try { await until(()=>document.querySelector('h1,.builder-section-title')); } catch (error) { throw new Error(error.message + ': ' + errors.join(' | ')); }
  const button=(name,scope=document)=>[...scope.querySelectorAll('button')].find(node=>[...node.childNodes].map(child=>child.nodeType===1 && child.getAttribute('aria-hidden')==='true' ? '' : child.textContent).join('').replace(/\s+/g,' ').trim()===name);
  const click=async(name,scope)=>{const node=button(name,scope);assert.ok(node,`Missing button: ${name}`);node.focus();node.click();await tick();};
  const fill=async(id,value)=>{const input=document.getElementById(id);assert.ok(input,`Missing field ${id}`);const prototype=input.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(prototype,'value').set.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));await tick();};
  return {dom,document,errors,calls,writes,button,click,fill,close(){dom.window.close();}};
}

test('existing landing design keeps two hero choices and moves community browsing to the footer',async()=>{
 const app=await open('/');try{const hero=app.document.querySelector('.fade-up.d-3');assert.equal(hero.querySelectorAll('a').length,2);assert.ok(hero.querySelector('a[href="/register"]'));assert.ok(hero.querySelector('a[href="/try"]'));assert.ok(app.document.querySelector('footer a[href="/showcase"]'));assert.ok(app.document.querySelector('.grainient-container'));assert.deepEqual(app.errors,[]);}finally{app.close();}
});
test('navigation avoids repeat account actions and duplicate new-portfolio buttons',async()=>{
 for(const [route,unwanted] of [['/login','/login'],['/register','/register']]){const app=await open(route);try{assert.equal(app.document.querySelector(`.navbar-actions a[href="${unwanted}"]`),null);assert.deepEqual(app.errors,[]);}finally{app.close();}}
 const app=await open('/dashboard',true,true);try{await until(()=>app.document.querySelector('.empty-state'));assert.equal(app.document.querySelectorAll('a[href="/builder"]').length,1);assert.equal(app.document.querySelector('.navbar-actions a[href="/register"]'),null);assert.deepEqual(app.errors,[]);}finally{app.close();}
});
test('dashboard keeps existing cards and places optional tools after the portfolios',async()=>{
 const app=await open('/dashboard',true);try{await until(()=>app.document.querySelector('.portfolio-card'));assert.ok(app.document.querySelector('.dashboard-header.glass'));assert.equal(app.document.querySelectorAll('.stat-card').length,3);assert.ok(app.document.querySelector('.portfolio-card .portfolio-card-actions'));const trash=[...app.document.querySelectorAll('details')].find(node=>node.querySelector('summary')?.textContent.startsWith('Trash'));assert.ok(app.document.querySelector('.portfolio-grid').compareDocumentPosition(trash) & app.dom.window.Node.DOCUMENT_POSITION_FOLLOWING);assert.doesNotMatch(app.document.body.textContent,/Creation activity on this browser|Load aggregate activity/);assert.equal(trash.open,false);await app.fill('feedback-helpful','The preview helped.');app.document.querySelector('#feedback-helpful').closest('form').dispatchEvent(new app.dom.window.Event('submit',{bubbles:true,cancelable:true}));await until(()=>app.document.body.textContent.includes('Feedback sent'));assert.ok(app.calls.includes('/api/metrics/feedback'));assert.deepEqual(app.errors,[]);}finally{app.close();}
});
test('builder keeps all nine sections and themes, with optional AI help collapsed and one save confirmation',async()=>{
 const app=await open('/builder/one',true);try{await until(()=>app.document.querySelector('.line-sidebar'));assert.equal(app.document.querySelectorAll('.line-sidebar button').length,9);assert.equal(app.document.querySelector('.navbar-actions a[href="/builder"]'),null);await app.click('Theme & Publish');assert.equal(app.document.querySelectorAll('.theme-card').length,41);const ai=app.document.querySelector('details.ai-panel');assert.ok(ai);assert.equal(ai.open,false);assert.ok(app.document.querySelector('[role=switch]'));await app.click('💾 Save Changes');await until(()=>app.writes.length===1);await until(()=>app.document.querySelector('.alert-success'));assert.equal(app.document.querySelectorAll('.toast').length,0);assert.equal(app.writes[0].name,'Anya');assert.deepEqual(app.errors,[]);}finally{app.close();}
});
