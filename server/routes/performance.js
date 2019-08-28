const router = require("express").Router()
, dbTimer = require('../models/timer')
, dbProject = require('../models/project')
, authMiddleware = require('../authMiddleware');

router.use(authMiddleware);

router.get('/:startTime/:endTime', (req,res) => {
    const {startTime,endTime} = req.params;
    const start = new Date( Number(startTime) );
    const end = new Date( Number(endTime) );
    
    dbTimer.find({ start: { $gt: start }, end: { $lt: end }, creater: req.user._id },{projectId:1,start:1,end:1}).then(times => {
        
        const projectIds = [...new Set(times.map(e => String(e.projectId)))];
        dbProject.find({ creater: req.user._id, _id: { $in: projectIds } },{name:1}).then(projects => {
            res.json({times,projects});
        });
    });
});

module.exports = router;