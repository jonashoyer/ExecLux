const router = require("express").Router()
, dbTodo = require('../models/todo')
, projectMiddle = require('../projectMiddleware');

router.use(projectMiddle);

router.post('/create', (req,res) => {
    const {projectId} = req.body;
    dbTodo.create({
        projectId,
        creater: req.user._id
    }).then(doc => {
        res.json(doc);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/edit', (req,res) => {
    const {projectId, id, data} = req.body;
    dbTodo.updateMany({_id:id,projectId},{data}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/remove', (req,res) => {
    const {projectId, id} = req.body;
    dbTodo.remove({_id:id,projectId}).then(fulfilled => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.post('/order', (req,res) => {
    const {projectId, order} = req.body;
    
    console.log(order);
    if(!Array.isArray(order)) return res.sendStatus(400);

    
    //{id,before,column}
    for (let i = 0; i < order.length; i++) {

        const {id,before,column} = order[i];
        
        dbTodo.updateMany({_id:id, projectId}, {before,column}).then(fulfilled => {

        }).catch(err => {
            
        })
    }

    res.sendStatus(200);
})

module.exports = router;