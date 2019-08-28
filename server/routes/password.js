const router = require("express").Router()
, dbPassword = require('../models/password')
, projectMiddle = require('../projectMiddleware');

router.use(projectMiddle);

router.post('/create', (req,res) => {
    const {projectId, data} = req.body;
    dbPassword.create({
        projectId,
        data,
        creater: req.user._id
    }).then(doc => {
        res.json(doc);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/edit', (req,res) => {
    const {id, projectId, data} = req.body;
    dbPassword.updateMany({_id:id, projectId},{data}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/remove', (req,res) => {
    const {projectId, id} = req.body;
    dbPassword.deleteMany({_id:id,projectId}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})


module.exports = router;