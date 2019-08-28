const jwt = require("jsonwebtoken")
, dbUser = require("./models/user")
, dbProject = require('./models/project')
, authMiddle = require('./authMiddleware')
, CONFIG = require("./config.json");

const middleware = [authMiddle,(req,res,next) => {
    return req.method == 'GET' ? get(req,res,next) : post(req, res,next);
}]

const get = (req, res, next) => {
    const { projectId } = req.params;
    HasProjectAuth(projectId, req, res, next);
}

const post = (req, res, next) => {
    const { projectId } = req.body;
    HasProjectAuth(projectId, req, res, next);
}

const HasProjectAuth = (projectId, req, res, next) => {
    dbProject.find({ _id: projectId, creater: req.user._id },{_id:1}).then(docs => {
        if (docs.length == 0) throw Error();
        next();
    }).catch(err => {
        res.sendStatus(400);
    })
}

module.exports = middleware;