const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    projectId:{type:mongoose.Schema.Types.ObjectId, required: true},
    data:{type:String, required:true},
    //name,username,password
    created: {type:Date,default:Date.now},
    creater:{type:mongoose.Schema.Types.ObjectId,required:true}
});

module.exports = mongoose.model("password",schema);