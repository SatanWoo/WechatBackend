
'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var router = require('./lib/router');
var cloud = require('./cloud');

var app = express();


// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(cloud);
app.use(cookieParser());
app.use(session(
    {
        resave: false,
        saveUninitialized: true,
        secret: 'keyboard cat',
        cookie: {
        maxAge: 60000
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/weixin', router);


module.exports = app;