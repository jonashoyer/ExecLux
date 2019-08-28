const express = require('express')
, path = require("path")
, mongoose = require("mongoose")
, bodyParser = require("body-parser")
, promise = require("bluebird")
, fs = require('fs');

mongoose.Promise = promise;
mongoose.connect('mongodb://localhost/execlux',{ useCreateIndex: true, useNewUrlParser: true  });

const app = express();
app.use(bodyParser.json());
app.use(express.static('static'));

// app.use((req,res,next) => setTimeout(next,500));

const routes = fs.readdirSync('./routes/');
routes.forEach(e => {
    const name = e.slice(0,-3);
    const urlPath = '/api/' + name;
    const path = './routes/' + e;
    app.use(urlPath, require(path));
    console.log('[*] Route ' + urlPath);
});

app.use(express.static(`${__dirname}/web-build`));
app.use('*', express.static(`${__dirname}/web-build/index.html`));

app.listen(3001, () => console.log("Running on port 3001..."));