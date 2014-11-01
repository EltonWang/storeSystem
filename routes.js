


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




    app.get('/initial', function(req, res) {


        res.render('index', { 'pageTitle': 'The index page!' });
    });
};