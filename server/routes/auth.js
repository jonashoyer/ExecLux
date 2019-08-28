const router = require("express").Router()
, dbUser = require('../models/user')
, authMiddle = require('../authMiddleware')

router.post('/login', (req,res) => {

    const {email,password} = req.body;
    dbUser.find({email}).then( docs => {

        if(docs.length !== 1){
            return res.sendStatus(400);
        }

        const user = docs[0];

        user.isValidPassword(password).then(match => {
            if (!match) {
                return res.sendStatus(400);
            }
            const token = user.generateJWT();
            res.json(token);
        }).catch(err => {
            res.sendStatus(500);
        })
        
    }).catch(err => {
        res.sendStatus(500);
    })
});

router.post('/signup', (req,res) => {

    const {name,email,password } = req.body;
    let user = new dbUser();
    user.name = name;
    user.email = email;

    user.setPassword(password)
    .then(_ => user.save())
    .then(_ => {
        const token = user.generateJWT();
        res.json(token);
    })
    .catch(err => {
        res.sendStatus(500);
    })
})

router.post('/logout', authMiddle, (req,res) => {

    dbUser.update({_id: req.user._id},{nonce:GetRndNonce()}).then(_=>{
        res.sendStatus(200);
    })
    .catch(err =>{
        res.sendStatus(500);
    })
})

router.post('/change-password', authMiddle, (req,res) => {

    const { oldPassword, newPassword } = req.body;


    req.user.isValidPassword(oldPassword).then(match => {
        if (!match) {
            throw Error('incorrect password');
        }

        return req.user.setPassword(newPassword);

    }).then(_ => {
        return req.user.save();
    }).then( _=> {
        
        res.sendStatus(200);
    }).catch(err => {
        if(err.message == 'incorrect password') return res.sendStatus(400);
        res.sendStatus(500);
    })
})

const GetRndNonce = () => {
    return Math.floor(Math.random() * 4294967294) - 2147483647;
}

module.exports = router;