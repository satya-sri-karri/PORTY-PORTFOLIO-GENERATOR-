const mongoose=require('mongoose');
const schema=new mongoose.Schema({sessionId:{type:String,required:true,unique:true,match:/^[a-f0-9-]{36}$/i},counts:{start:{type:Number,default:0},preview:{type:Number,default:0},save:{type:Number,default:0},publish:{type:Number,default:0},share:{type:Number,default:0},error:{type:Number,default:0},recovery:{type:Number,default:0}},startedAt:{type:Date,default:null},firstPublishedAt:{type:Date,default:null}},{timestamps:true});
module.exports=mongoose.model('Journey',schema);
