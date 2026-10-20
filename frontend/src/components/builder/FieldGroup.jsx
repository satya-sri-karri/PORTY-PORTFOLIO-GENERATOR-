import React, { useId } from "react";
// Native associations remain stable across reordering and section switches.
export default function FieldGroup({ children, ...props }) {
  const generated = useId(); let inputId;
  function find(nodes) { React.Children.forEach(nodes, node => { if(!React.isValidElement(node) || inputId) return; if(["input","textarea","select"].includes(node.type) && node.props.type !== "file" && node.props.type !== "checkbox") inputId = node.props.id || generated; else find(node.props.children); }); }
  find(children);
  function label(nodes) { return React.Children.map(nodes, node => { if(!React.isValidElement(node)) return node; const next = {}; if(["input","textarea","select"].includes(node.type) && !node.props.id && inputId === generated && node.props.type !== "file" && node.props.type !== "checkbox") next.id = generated; if(node.type === "label" && !node.props.htmlFor) next.htmlFor = inputId; if(node.props.children) next.children = label(node.props.children); return React.cloneElement(node,next); }); }
  return <div {...props}>{label(children)}</div>;
}
