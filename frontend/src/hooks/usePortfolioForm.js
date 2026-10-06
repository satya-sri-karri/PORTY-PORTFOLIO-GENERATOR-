import { useState, useCallback, useReducer } from "react";
export const blank = { name:"",title:"",about:"",avatarUrl:"",location:"",skills:[],projects:[],experience:[],certifications:[],achievements:[],codingProfiles:[],contact:{email:"",phone:""},socialLinks:{github:"",linkedin:"",twitter:"",website:""},theme:"minimalist",themeColors:{accent:"",bg:"",text:""},isPublic:false, availability:"",motto:"",interests:[],resumeUrl:"",showLocation:true,motion:"subtle",sectionOrder:["projects","experience","credentials","profiles","contact"],sectionVisibility:{},audience:"",showcaseOptIn:false };
export const usePortfolioForm = (initial = blank) => {
  const [history, dispatch] = useReducer((state, action) => {
    if (action.type === "load") return { form: action.value, past: [], future: [] };
    if (action.type === "undo") return state.past.length ? { form: state.past.at(-1), past: state.past.slice(0, -1), future: [state.form, ...state.future].slice(0, 40) } : state;
    if (action.type === "redo") return state.future.length ? { form: state.future[0], past: [...state.past, state.form].slice(-40), future: state.future.slice(1) } : state;
    const next = typeof action.value === "function" ? action.value(state.form) : action.value;
    if (JSON.stringify(next) === JSON.stringify(state.form)) return state;
    return { form: next, past: [...state.past, state.form].slice(-40), future: [] };
  }, { form: initial, past: [], future: [] });
  const form = history.form;
  const setForm = useCallback(value => dispatch({ type: "edit", value }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const [skillInput, setSkillInput] = useState("");
  const set = useCallback((f, v) => setForm(p => ({ ...p, [f]: v })), []);
  const setNested = useCallback((parent, f, v) => setForm(p => ({ ...p, [parent]: { ...p[parent], [f]: v } })), []);
  const addSkill = useCallback(() => { const s = skillInput.trim(); if (!s || form.skills.map(x=>x.toLowerCase()).includes(s.toLowerCase())) { setSkillInput(""); return; } setForm(p => ({ ...p, skills: [...p.skills, s] })); setSkillInput(""); }, [skillInput, form.skills]);
  const addSkillDirect = useCallback((name) => { const s = name.trim(); if (!s) return; setForm(p => { if (p.skills.map(x=>x.toLowerCase()).includes(s.toLowerCase())) return p; return { ...p, skills: [...p.skills, s] }; }); }, []);
  const removeSkill = useCallback(i => setForm(p => ({ ...p, skills: p.skills.filter((_,idx) => idx!==i) })), []);
  const addItem = useCallback((arr, tpl) => setForm(p => ({ ...p, [arr]: [...p[arr], { ...tpl }] })), []);
  const updateItem = useCallback((arr, i, f, v) => setForm(p => { const n=[...p[arr]]; n[i]={...n[i],[f]:v}; return {...p,[arr]:n}; }), []);
  const moveItem = useCallback((arr, from, to) => setForm(p => {
    if (from === to || to < 0 || to >= p[arr].length) return p;
    const next = [...p[arr]]; const [item] = next.splice(from, 1); next.splice(to, 0, item);
    return { ...p, [arr]: next };
  }), []);
  const removeItem = useCallback((arr, i) => setForm(p => ({ ...p, [arr]: p[arr].filter((_,idx)=>idx!==i) })), []);
  const load = useCallback(data => dispatch({ type: "load", value: { ...blank, ...data, contact: { ...blank.contact, ...data.contact }, socialLinks: { ...blank.socialLinks, ...data.socialLinks }, themeColors: { ...blank.themeColors, ...data.themeColors } } }), []);
  const reset = useCallback(() => dispatch({ type: "load", value: blank }), []);
  return { undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0, form, skillInput, setSkillInput, set, setNested, addSkill, addSkillDirect, removeSkill, addItem, updateItem, moveItem, removeItem, load, reset };
};
