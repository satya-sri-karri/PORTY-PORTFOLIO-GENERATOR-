const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const service = require("../services/character");
const { createRouter } = require("../routes/character");
const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3f8AAAAASUVORK5CYII=";
const original = User.findById;
let server, base, router, generate, calls;
before(async () => {
  process.env.JWT_SECRET = "character-fixture-secret";
  User.findById = () => ({ select: async () => ({ tokenVersion: 0 }) });
  const app = express(); app.use(express.json({ limit: "10mb" })); app.use("/character", (req,res,next) => router(req,res,next));
  server = await new Promise(resolve => { const listener = app.listen(0,"127.0.0.1",() => resolve(listener)); });
  base = `http://127.0.0.1:${server.address().port}/character`;
});
after(async () => { User.findById = original; await new Promise(resolve => server.close(resolve)); });
beforeEach(() => {
  process.env.HF_CHARACTER_SPACE_URL = "https://porty-fixture.hf.space";
  process.env.HF_CHARACTER_SPACE_KEY = "x".repeat(32); delete process.env.HF_TOKEN;
  calls = 0; generate = async () => image;
  router = createRouter((...args) => { calls++; return generate(...args); });
});
const request = async (path = "", method = "GET", body, owner = "owner") => {
  const response = await fetch(base+path, { method, headers: { "Content-Type":"application/json", ...(owner ? { Authorization:`Bearer ${jwt.sign({userId:owner},process.env.JWT_SECRET)}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status:response.status, body:await response.json() };
};
const submit = (extra = {}, owner = "owner") => request("","POST",{image,style:"soft-3d",consent:true,...extra},owner);
const settle = () => new Promise(resolve => setImmediate(resolve));
test("configuration accepts only an HF HTTPS origin and does not expose credentials", async () => {
  for (const url of ["http://localhost", "https://evil.example", "https://x.hf.space@evil.example", "https://x.hf.space/path", "https://x.hf.space?token=x"]) { process.env.HF_CHARACTER_SPACE_URL=url; assert.equal(service.configuration(),null); }
  process.env.HF_CHARACTER_SPACE_URL="https://porty-fixture.hf.space";
  const status=await request("/status","GET",undefined,null); assert.deepEqual(status.body,{available:true});
  delete process.env.HF_CHARACTER_SPACE_KEY; assert.deepEqual((await request("/status")).body,{available:false}); assert.equal((await submit()).status,503); assert.equal(calls,0);
});
test("generation requires authentication, consent, valid image bytes and an allowed style", async () => {
  assert.equal((await submit({},null)).status,401);
  for (const extra of [{consent:false},{image:"https://example.com/photo.png"},{image:"data:image/png;base64,dGVzdA=="},{style:"custom prompt"}]) assert.equal((await submit(extra)).status,400);
  assert.equal(calls,0);
});
test("jobs return accepted then complete, and results are private to their owner", async () => {
  const started=await submit(); assert.equal(started.status,202); await settle();
  const result=await request(`/${started.body.id}`); assert.deepEqual(result.body,{status:"complete",image});
  assert.equal((await request(`/${started.body.id}`,"GET",undefined,"other")).status,404);
  assert.equal((await request(`/${started.body.id}`,"DELETE",undefined,"other")).status,404);
  assert.equal((await request(`/${started.body.id}`,"DELETE")).status,200);
  assert.equal((await request(`/${started.body.id}`)).status,404);
});
test("only one pending job is allowed, and cancellation aborts the local provider request", async () => {
  let signal; generate=async (_photo,_style,options) => { signal=options.signal; return new Promise((_resolve,reject) => signal.addEventListener("abort",()=>reject(new Error("aborted")))); };
  const started=await submit(); await settle(); assert.equal((await submit()).status,409);
  assert.equal((await request(`/${started.body.id}`,"DELETE")).status,200); assert.equal(signal.aborted,true);
});
test("failed providers and invalid output become safe errors without changing a portfolio", async () => {
  generate=async () => { throw new Error("secret provider details"); };
  const first=await submit(); await settle(); const failed=await request(`/${first.body.id}`);
  assert.equal(failed.body.status,"failed"); assert.ok(!failed.body.error.includes("secret"));
  generate=async()=>"https://untrusted.example/result.png"; const second=await submit(); await settle(); assert.equal((await request(`/${second.body.id}`)).body.status,"failed");
});
test("the free prototype allows at most three new requests per account per day", async () => {
  for(let i=0;i<3;i++){const started=await submit(); assert.equal(started.status,202); await settle(); await request(`/${started.body.id}`,"DELETE");}
  assert.equal((await submit()).status,429); assert.equal((await submit({},"different-owner")).status,202);
});
test("Gradio protocol preserves secrets server-side and handles split SSE frames", async () => {
  process.env.HF_TOKEN="fixture-only"; const requests=[];
  const text=`event: heartbeat\ndata: null\n\nevent: complete\ndata: ${JSON.stringify([{image}])}\n\n`;
  const fetchImpl=async (url,options) => { requests.push({url,...options}); return requests.length===1 ? new Response(JSON.stringify({event_id:"fixture-id"})) : new Response(new ReadableStream({start(controller){for(const piece of [text.slice(0,17),text.slice(17,61),text.slice(61)])controller.enqueue(new TextEncoder().encode(piece));controller.close();}})); };
  assert.equal(await service.generateCharacter(image,"clay",{fetchImpl}),image);
  assert.deepEqual(JSON.parse(requests[0].body),{data:[image,"clay"]});
  assert.equal(requests[0].headers["X-Porty-Key"],"x".repeat(32)); assert.equal(requests[1].headers.Authorization,"Bearer fixture-only"); assert.equal(requests[1].redirect,"error");
});
test("Gradio errors, unsafe event identifiers and untrusted output are rejected", async () => {
  const run=(id,payload)=>{let call=0;return service.generateCharacter(image,"soft-3d",{fetchImpl:async()=>++call===1 ? new Response(JSON.stringify({event_id:id})) : new Response(payload)});};
  await assert.rejects(run("../../other",""));
  await assert.rejects(run("fixture","event: error\ndata: null\n\n"));
  await assert.rejects(run("fixture",'event: complete\ndata: [{"image":"https://evil.example/photo"}]\n\n'));
});
