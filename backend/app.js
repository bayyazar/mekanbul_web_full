require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('./app_api/models/db');
var apiRoute= require('./app_api/routes/index');
const passport = require('passport');
require('./app_api/config/passport');
var app = express();
app.use(passport.initialize());

app.use((err, req, res, next) => {
    if(err.name ===  "UnauthorizedError"){
        res.status(401)
        .json({ status: "Doğrulama tokeni bulunamadı!"});
    }
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api", apiRoute);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
