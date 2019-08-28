const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: { type: String, required: true, },
    cipherKey: { type: Buffer },
    keyHash: {type: String},
    created: {type:Date,default:Date.now},
    creater: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("project",schema);