const mongoose = require("mongoose");

// const checkSchema = new mongoose.Schema({
//     checked: {type:Boolean,default:false},
// });

const schema = new mongoose.Schema({
    projectId:{type:mongoose.Schema.Types.ObjectId, required: true},
    data:{type:String},
    created: {type:Date,default:Date.now},
    creater:{type:mongoose.Schema.Types.ObjectId,required:true},

    column:{type:Number},
    before:{type:mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model("todo",schema);