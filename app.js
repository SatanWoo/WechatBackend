
'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var router = require('./lib/router');
var cloud = require('./cloud');
var path = require('path');

var app = express();


// App 全局配置
app.set('views', path.join(__dirname, 'views'));   // 设置模板目录
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

// app.use('/', function(req, res, next){
//     console.log('get index');
//     return res.send('index');
// })
app.use('/weixin', router);

/**************** Pocket ****************/
var CONSUMER_KEY = "48643-9d170511c0cb64d90e33b4e7";
var REDIRECT_URI = 'http://wechatrobot.avosapps.com';

var pocket = require('pocket-sdk');
pocket.init(CONSUMER_KEY, REDIRECT_URI + '/pocket/callback');
app.use(pocket.oauth({
	afterSuccess:function(token ,req, res, next) {
        res.cookie('access_token', token.access_token);
		return res.redirect('/pocket/list');
	}
}));

app.use('/pocket/list', function(req, res, next){
    var token = req.cookies['access_token'];
    if (!token) {
        return res.redirect('/pocket/authorize');
    }

    pocket.get({
        access_token: token,
        detailType: 'complete',
        state:'unread'
    }, function(err, ret) {
        var list = ret.list;
        var dict = {};

        var itemList = Object.keys(list).map(function(key){
            return list[key];
        });

        itemList.forEach(function(item){
            if (item.tags != void 0) {
                var tag = Object.keys(item.tags)[0];
                console.log(tag);

                if (!dict[tag]) {
                    dict[tag] = [];
                }

                dict[tag].push({
                    url:item.resolved_url,
                    title:item.resolved_title
                });
            }
        });

        console.log('loop is over');


        res.render('hello', {
            title:'吴老板的阅读周记',
            items: dict
        });

        console.log('render ok');

        return;
    });
});

app.use('/pocket/callback', function(req, res, next) {
    if (!req.query.code) {
        return res.redirect('/pocket/authorize');
    }

    res.cookie('access_token', req.query.code);
    return res.redirect('/pocket/list');
});

module.exports = app;