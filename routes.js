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

    app.get('/data/destroyInitial', function(req, res) {
        database.initialAllSlots();
        res.send('hello world');
    });

    app.get('/data/pools', function(req, res) {

        database.getPoolInfo(function(result){
            res.json(result);
        });
    });

    app.post('/data/slot/update', function(req, res) {
        var slotPlace = req.body.slotPlace;
        var batch = req.body.batch;
        var sub = req.body.sub;
        var cell = req.body.cell;
        database.updateSlotInfo(slotPlace, batch, sub, cell, function(result){
            res.json(result);
        });

    });

    app.post('/data/slot/search', function(req, res) {
        var searchKey = req.body.searchKey;
        database.searchSlot(searchKey, function(result){
            res.json(result);
        });
    });




    app.get('/initial', function(req, res) {


        res.render('index', { 'pageTitle': 'The index page!' });
    });
};