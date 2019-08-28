const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    projectId:{type:mongoose.Schema.Types.ObjectId, required: true},
    name:{type:String, required:true},
    start:{type:Date, required:true},
    end:{type:Date},
    created: {type:Date,default:Date.now},
    creater:{type:mongoose.Schema.Types.ObjectId,required:true}
});

module.exports = mongoose.model("timer",schema);