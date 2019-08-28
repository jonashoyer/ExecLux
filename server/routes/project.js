const router = require("express").Router()
, dbProject = require('../models/project')
, authMiddle = require('../authMiddleware')
, projectMiddle = require('../projectMiddleware')

, dbTodo = require('../models/todo')
, dbPassword = require('../models/password')
, dbTimer = require('../models/timer')
, encryption = require('../utils/encryption');

// sha256 -> argon(hash) & enc key -> chiperKey
router.post('/set-encryption', projectMiddle, (req,res) => {
    const {key,projectId} = req.body;
    if(key.length != 64){
        return res.sendStatus(400);
    }
    let cipherBuf;
    dbProject.findById(projectId,{cipherKey:1}).then(doc => {
        if(doc.cipherKey){
            return Promise.reject('Already encrypted!');
        }
        return encryption.ArgonHash(key);
    }).then(hash => {
        cipherBuf = encryption.CreateProjectCipher(Buffer.from(key,'hex'));
        return dbProject.updateMany({_id:projectId},{cipherKey:cipherBuf,keyHash:hash})
    }).then(fulfilled => {
        res.json(cipherBuf.toJSON());
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.post('/validate',projectMiddle,(req,res) => {
    const {hash,projectId} = req.body;
    dbProject.findById(projectId,{keyHash:1}).then(doc => {
        return encryption.ValidateHash(hash,doc.keyHash);
    }).then(match => {
        if(!match) return res.status(400).send('Invalid phrase');
        res.send('match');
    })
})

router.get('/fetch-list', authMiddle, (req,res) => {
    dbProject.find({creater:req.user._id},{_id:1,name:1}).then( docs => {
        res.json(docs);
    }).catch( err => {
        console.log(err);
        res.sendStatus(501);
    })
})

router.post('/remove', projectMiddle, (req,res) => {
    const {projectId} = req.body;
    dbProject.remove({_id: projectId, creater: req.user._id}).then(fulfilled => {
        res.sendStatus(200);
    }).catch( err => {
        res.sendStatus(500);
    })
})

router.post('/create', authMiddle, (req,res) => {
    const {name} = req.body;
    dbProject.create({name,creater:req.user._id}).then(doc => {
        res.json(doc);
    }).catch( err => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.get('/settings/:projectId', projectMiddle, (req,res) => {
    const {projectId} = req.params;
    
    dbProject.find({_id:projectId}).then(docs => {
        if(docs.length != 1){
            return res.sendStatus(500);
        }

        const [doc] = docs;
        res.json(doc);
    });
})

router.get('/:projectId', projectMiddle,(req,res) => {
    const {projectId} = req.params;
    
    Promise.all([
        dbProject.find({_id:projectId},{keyHash:0}),
        dbTodo.find({projectId}),
        dbPassword.find({projectId}),
        dbTimer.find({projectId})
    ]).then(([project,todos,passwords,timers]) => {
        res.json({project:project[0],todos,passwords,timers});
    }).catch(err => {
        res.sendStatus(500);
    })
})


module.exports = router;