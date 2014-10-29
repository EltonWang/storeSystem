var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var stockController = require('./controller/stock.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static(__dirname + '/public'));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', function(req, res) {
    res.render('index', { 'title': 'The index page!' });
});

app.get('/beacon/list', function(req, res) {
    res.render('list');
});

app.get('/beacon/tab', function(req, res) {
    res.render('tab');
});


app.get('/initial', function(req, res) {

    var reverseDay = req.query.days ? req.query.days : 30;

    //stockController.requestStockDataByDays(res, reverseDay);

    res.render('index', { 'title': 'The index page!' });
});

app.listen(4000);
console.log('app is listening at localhost:4000');

module.exports = app;
