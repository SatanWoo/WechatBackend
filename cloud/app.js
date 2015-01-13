var express = require('express');
var weixin = require('cloud/weixin.js');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/weixin/checkSignature', function(req, res) {
  console.log('weixin checkSignature:', req.query);
  if (weixin.checkSignature(req.query.signature, req.query.timestamp, req.query.nonce)) {
    res.send(req.query.echostr);
  } else {
    res.send(401);
  }
})

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
