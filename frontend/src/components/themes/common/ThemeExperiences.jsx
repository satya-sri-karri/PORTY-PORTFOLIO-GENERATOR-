import React, { useRef, useState } from "react";
import { orderedProjects, profileLinks } from "../../../utils/portfolioContent";
import { useProjectExplorer } from "./ProjectExplorer";

export function TerminalConsole({ data }) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState({ text: "Try help, about, skills, projects, experience or contact.", href: "" });
  const run = event => {
    event.preventDefault(); const query=command.trim().toLowerCase();
    const replies={
      help:{text:"Commands: about · skills · projects (or ls) · experience · contact · clear"},
      about:{text:[data.name,data.title,data.about].filter(Boolean).join("\n"),href:"#pf-intro"},
      skills:{text:data.skills.join(" · ") || "No skills supplied."},
      projects:{text:orderedProjects(data.projects).map(p => p.title).join("\n") || "No projects supplied.",href:data.projects.length?"#pf-work":""},
      experience:{text:data.experience.map(e => [e.role,e.company,e.duration].filter(Boolean).join(" · ")).join("\n") || "No experience supplied.",href:data.experience.length?"#pf-experience":""},
      contact:{text:profileLinks(data).map(l => l.label).join(" · ") || "No contact links supplied.",href:profileLinks(data).length?"#pf-contact":""},
      clear:{text:""},
    };
    setOutput(replies[query === "ls" ? "projects" : query] || {text:`Unknown command: ${command}. Type help to see the available topics.`});
  };
  return <section className="ex-console" aria-label="Portfolio command console"><p className="pf-eyebrow">Explore by command · section links work too</p><form onSubmit={run}><label htmlFor="terminal-command">Portfolio command</label><div className="ex-query"><span aria-hidden="true">❯</span><input id="terminal-command" autoComplete="off" spellCheck="false" value={command} onChange={e => setCommand(e.target.value)} placeholder="Type projects or help" /><button type="submit">Run command</button></div></form><div className="ex-console-output" role="status"><p>{output.text}</p>{output.href && <a href={output.href}>Open section ↗</a>}</div></section>;
}
export function CanvasPlayground({ data }) {
  const explorer = useProjectExplorer();
  const projects=orderedProjects(data.projects);
  const origin=()=>projects.map((_,i)=>({x:8+(i%3)*30,y:12+Math.floor(i/3)*28}));
  const [positions,setPositions]=useState(origin); const drag=useRef(null); const board=useRef(null); const moved=useRef(false);
  if(!projects.length) return null;
  const update=(i,x,y)=>setPositions(previous=>{const next=[...previous];next[i]={x:Math.min(72,Math.max(0,x)),y:Math.min(82,Math.max(0,y))};return next;});
  const open=i=>explorer.reveal(projects[i],board.current.closest('.portfolio-v4'));
  return <section className="ex-playground" aria-label="Arrange project board"><div className="ex-controls"><p>Drag your project cards. Use arrow keys to move a focused card; Enter opens its story.</p><button type="button" onClick={()=>setPositions(origin())}>Reset board</button></div><div ref={board} className="ex-drag-board">{projects.map((p,i)=>{const point=positions[i] || origin()[i];return <button type="button" key={p._id || `${i}-${p.title}`} className="ex-drag-card" aria-label={`Arrange ${p.title}`} style={{left:`${point.x}%`,top:`${point.y}%`}} onPointerDown={e=>{moved.current=false;drag.current={i,x:e.clientX,y:e.clientY,start:point};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(drag.current?.i!==i)return;const r=board.current.getBoundingClientRect(),dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;if(Math.abs(dx)+Math.abs(dy)>5)moved.current=true;update(i,drag.current.start.x+dx/r.width*100,drag.current.start.y+dy/r.height*100);}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;moved.current=true;}} onClick={()=>{if(!moved.current)open(i);moved.current=false;}} onKeyDown={e=>{const delta={ArrowLeft:[-3,0],ArrowRight:[3,0],ArrowUp:[0,-3],ArrowDown:[0,3]}[e.key];if(delta){e.preventDefault();update(i,point.x+delta[0],point.y+delta[1]);}}}><span>{String(i+1).padStart(2,"0")} ↗</span><strong>{p.title}</strong></button>;})}</div></section>;
}
export function PixelExplorer({ data }) {
  const explorer = useProjectExplorer();
  const [x,setX]=useState(50); const [jump,setJump]=useState(0); const [visited,setVisited]=useState([]);
  if(!data.projects.length) return null;
  return <section className="ex-pixel-game" aria-label="Pixel explorer"><p className="pf-eyebrow">Explore my world</p><div className="ex-pixel-stage" aria-hidden="true"><span className="ex-pixel-cloud" /><span key={jump} className={`ex-pixel-player ${jump ? 'ex-pixel-jump' : ''}`} style={{left:`${x}%`}}><svg viewBox="0 0 16 20" width="32" height="40" shapeRendering="crispEdges"><path d="M4 0H12V2H14V8H12V10H4V8H2V2H4Z" fill="var(--pf-text)"/><path d="M4 10H12V16H14V20H10V16H6V20H2V16H4Z" fill="var(--pf-accent)"/><path d="M4 4H6V6H4ZM10 4H12V6H10Z" fill="var(--pf-bg)"/></svg></span><div className="ex-pixel-ground" /></div><div className="ex-controls"><button type="button" onClick={()=>setX(v=>Math.max(8,v-10))}>Move left</button><button type="button" onClick={()=>setJump(v=>v+1)}>Jump</button><button type="button" onClick={()=>setX(v=>Math.min(88,v+10))}>Move right</button><span role="status">{visited.filter(i=>i<data.projects.length).length} of {data.projects.length} project paths explored</span></div><div className="ex-pixel-paths">{orderedProjects(data.projects).map((p,i)=><a key={i} href="#pf-work" onClick={e=>{e.preventDefault();setX(8+(i/Math.max(1,data.projects.length-1))*80);setVisited(v=>v.includes(i)?v:[...v,i]);explorer.reveal(p,e.currentTarget.closest(".portfolio-v4"));}}>◇ {p.title}{visited.includes(i)?" ✓":""}</a>)}</div></section>;
}
export function SceneNavigator({ data }) {
  const explorer = useProjectExplorer();
  const [active,setActive]=useState(-1);
  return <nav className="ex-scene-nav" aria-label="Cinema scenes"><button type="button" aria-pressed={active===-1} onClick={e=>{setActive(-1);e.currentTarget.closest('.portfolio-v4').querySelector('.pf-hero')?.scrollIntoView({behavior:'auto'});}}>Opening scene</button>{orderedProjects(data.projects).map((p,i)=><button type="button" key={i} aria-pressed={active===i} onClick={e=>{setActive(i);explorer.reveal(p,e.currentTarget.closest('.portfolio-v4'));}}>{String(i+1).padStart(2,"0")} / {p.title}</button>)}</nav>;
}
