const mongoose = require("mongoose")
, argon2 = require("argon2")
, jwt = require("jsonwebtoken")
, CONFIG = require('../config.json')

const schema = new mongoose.Schema({
    name:{ type: String, required: true, },
    email:{ type: String, required: true, lowercase:true, unique: true },
    password:{ type: String, required: true },
    nonce:{type:Number}
});

schema.methods.setPassword = function setPassword(password) {
    return argon2.hash(password).then( hash => {
        this.password = hash;
        return Promise.resolve();
    })
};

schema.methods.isValidPassword = function isValidPassword(password){
    return argon2.verify(this.password, password);
}

schema.methods.generateJWT = function generateJWT(){

    return jwt.sign(
        {
            _id: this._id,
            nonce: this.nonce
        },
        CONFIG.secret
    );
}

schema.methods.setConfirmationToken = function setConfirmationToken() {
    this.confirmationToken = this.generateJWT();
};

module.exports = mongoose.model("user",schema);