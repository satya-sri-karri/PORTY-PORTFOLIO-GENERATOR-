const {test,before,after,beforeEach}=require('node:test');
const assert=require('node:assert/strict'); const crypto=require('node:crypto'); const express=require('express');
const User=require('../models/User'); const email=require('../utils/email'); const original={findOne:User.findOne,save:User.prototype.save,sendOTP:email.sendOTP};
let server,base,sent,failDelivery; const users=new Map();
before(async()=>{process.env.JWT_SECRET='fixture-auth-secret'; User.findOne=query=>{const value=users.get(query.email)||null;const promise=Promise.resolve(value);promise.select=()=>Promise.resolve(value);return promise;};
User.prototype.save=async function(){this._id ||= '507f1f77bcf86cd7994390111';users.set(this.email,this);return this;};
email.sendOTP=async(address,otp)=>{if(failDelivery)throw new Error('Fixture email outage'); sent={address,otp};};
const app=express();app.use(express.json());app.use('/auth',require('../routes/auth'));server=await new Promise(resolve=>{const listener=app.listen(0,'127.0.0.1',()=>resolve(listener));});base=`http://127.0.0.1:${server.address().port}/auth`;});
after(async()=>{User.findOne=original.findOne;User.prototype.save=original.save;email.sendOTP=original.sendOTP;await new Promise(resolve=>server.close(resolve));});
beforeEach(()=>{users.clear();sent=null;failDelivery=false;});
const request=async(path,body)=>{const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:response.status,body:await response.json()};};
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
test('Registration awaits email, stores a hashed code, normalizes the address and enforces resend cooldown',async()=>{
assert.equal((await request('/send-otp',{email:' Anya@Example.com ',name:'Anya'})).status,200);
const user=users.get('anya@example.com');assert.equal(user.otp,digest(sent.otp));assert.notEqual(user.otp,sent.otp);
assert.equal((await request('/send-otp',{email:'anya@example.com'})).status,429);
assert.equal((await request('/verify-otp',{email:'ANYA@example.com',otp:sent.otp,password:'secure-test'})).status,200);assert.equal(user.otp,null);
});
test('Email delivery failure does not claim a code was sent or create a pending account',async()=>{failDelivery=true;assert.equal((await request('/send-otp',{email:'anya@example.com'})).status,500);assert.equal(users.size,0);});
test('Registration verification cannot overwrite an established account password',async()=>{const user=new User({email:'anya@example.com',password:'existing-password',otp:digest('123456'),otpExpiry:new Date(Date.now()+10000)});await user.save();assert.equal((await request('/verify-otp',{email:user.email,otp:'123456',password:'attack-password'})).status,409);assert.equal(user.password,'existing-password');});
test('Recovery rejects expired or incorrect codes, keeps portfolios untouched and consumes successful codes',async()=>{
const user=new User({email:'anya@example.com',password:'old-password'});await user.save();assert.equal((await request('/forgot-password',{email:user.email})).status,200);const otp=sent.otp;
assert.equal(user.resetOtp,digest(otp));assert.equal((await request('/reset-password',{email:user.email,otp:'000000',password:'new-password'})).status,400);assert.equal(user.resetAttempts,1);
assert.equal((await request('/reset-password',{email:user.email,otp,password:'new-password'})).status,200);assert.equal(user.password,'new-password');assert.equal(user.tokenVersion,1);assert.equal(user.resetOtp,null);
assert.equal((await request('/reset-password',{email:user.email,otp,password:'another-password'})).status,400);
user.resetOtp=digest(otp);user.resetExpiry=new Date(Date.now()-1000);assert.equal((await request('/reset-password',{email:user.email,otp,password:'expired-password'})).status,400);
});
test('Unknown recovery email gets generic feedback without creating an account',async()=>{const response=await request('/forgot-password',{email:'missing@example.com'});assert.equal(response.status,200);assert.match(response.body.message,/If this email/);assert.equal(users.size,0);assert.equal(sent,null);});
