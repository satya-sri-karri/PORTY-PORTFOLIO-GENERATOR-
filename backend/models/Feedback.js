const mongoose=require('mongoose');
module.exports=mongoose.model('Feedback',new mongoose.Schema({helpful:{type:String,trim:true,maxlength:1000,default:''},blocked:{type:String,trim:true,maxlength:1000,default:''}},{timestamps:true}));
