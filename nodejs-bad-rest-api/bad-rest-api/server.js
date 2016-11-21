var express    = require('express');        // call express
var bodyParser = require('body-parser')     // body parser
var app        = express();                 // define our app using express
var child_process = require('child_process');

var port = process.env.PORT || 8080;        // set our port

var router = express.Router();              // get an instance of the express Router

router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function(req, res) {
    res.json({ message: 'API available'});
});

router.get('/exec/:cmd', function(req, res) {
    var ret = child_process.spawnSync(req.params.cmd);
    res.send(ret.stdout);
});

router.post('/days-from-year/', function(req, res) {
    var year = eval("year = (" + req.body.year + ")");
    var date = new Date();

    var futureAge = 2050 - year;

    res.json({ 'days-from-year': futureAge });
});

app.use('/api', router);

app.use(function(err, req, res, next) {
  // Do logging and user-friendly error message display
  console.error(err);
  res.status(500).send({status:500, message: 'internal error', type:'internal'}); 
})

app.listen(port);
console.log('Server running on port: ' + port);

