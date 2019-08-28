const jwt = require("jsonwebtoken")
, dbUser = require("./models/user")
, CONFIG = require("./config.json");

module.exports = (req, res, next) => {

  const header = req.headers.authorization;
  let token;

  if (header) token = header.split(" ")[1];

  if (token) {
    jwt.verify(token, CONFIG.secret, (err, decoded) => {
      if (err || !decoded) {
        res.status(401).json({ errors: { global: "Invalid token" } });  
      } else {
        const {_id,nonce} = decoded;
        dbUser.find({_id, nonce}, (err, docs) => {
          if (docs.length == 0) return res.status(401).json({ errors: { global: "Invalid token" } });
          req.user = docs[0];
          next();
        });
      }
    });
  } else {
    res.status(401).json({ errors: { global: "No token" } });
  }
};