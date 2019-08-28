const router = require("express").Router()
, dbUser = require('../models/user')

const authMiddle = require('../authMiddleware');

router.get('/', authMiddle, (req,res) => {
    
  const {_id, name, email} = req.user;

  res.json({
    _id,
    name,
    email
  });
});

module.exports = router;