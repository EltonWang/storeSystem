var ServiceUtils = require('./lib/ServiceUtils.js');
var database = require('./lib/database.js');


module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', { 'pageTitle': 'The index page!' });
    });

    app.get('/beacon/list', function(req, res) {
        res.render('list');
    });

    app.get('/beacon/tab', function(req, res) {
        res.render('tab');
    });

    app.get('/data/pools', function(req, res) {

        database.getPoolInfo(function(result){
            res.json(result);
        });

    });




    app.get('/initial', function(req, res) {


        res.render('index', { 'pageTitle': 'The index page!' });
    });
};