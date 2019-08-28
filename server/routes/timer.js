const router = require("express").Router()
, dbTimer = require('../models/timer')
, projectMiddle = require('../projectMiddleware');

router.use(projectMiddle);

router.post('/create', (req,res) => {
    const {projectId, name, start, end} = req.body;
    dbTimer.create({
        projectId,
        name,
        start,
        end,
        creater: req.user._id
    }).then(doc => {
        res.json(doc);
    }).catch(err => {
        res.sendStatus(500);
    })
});

router.post('/end', (req,res) => {
    const {projectId, id, end} = req.body;
    dbTimer.updateMany({_id:id,projectId},{end}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/edit', (req,res) => {
    const {id, projectId, name, start, end} = req.body;
    dbTimer.updateMany({_id:id,projectId},{name,start,end}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/remove', (req,res) => {
    const {projectId, id} = req.body;
    dbTimer.deleteMany({_id:id,projectId}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

module.exports = router;