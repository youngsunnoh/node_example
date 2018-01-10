var express  = require('express'); //프레임워크
var httpProxy = require('http-proxy'); //프록시
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // 로그
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // POST 데이터 처리
var fs = require("fs"); //파일 컨트롤
var session = require('express-session'); // 세션
var sys = require('util');
var passport = require('passport'); //인증
var LocalStrategy = require('passport-local').Strategy; //인증
var bcrypt = require('bcrypt-nodejs');  //비밀번호 암호화
var flash = require('connect-flash'); //휘발성 메세지를 사용하는 모듈 passport가 지원해줍니다.


//JS 선언
var index = require('./routes/index');
var users = require('./routes/users');
var mysql = require('./routes/mysql');
var sessionTest = require('./routes/sessionTest');
var requestInfo = require('./routes/requestInfo');

var app = express(); //express 선언
var options = { //proxy 서버 옵션(https://github.com/chimurai/http-proxy-middleware#options)
    changeOrigin: true,
    ignorePath : true // 구분자 패스 삭제
};

// HTTP-PROXY 테스트
var Proxy = httpProxy.createProxyServer(options);
var Server1 = 'http://localhost:3000/mysql',
    Server2 = 'http://localhost:3000/users',
    Server3 = 'http://naver.com',
    Server4 = 'http://localhost:3000/mysql/keyword',
    Server5 = 'http://localhost:3000/mysql/user';


/// Request_Info
app.all("/request", function(req, res) {
    Proxy.web(req, res, {target: 'http://localhost:3000/requestInfo'});
});

/// SESSION
app.all("/login/:username/:password", function(req, res) {
    var username = req.params.username;
    var password = req.params.password;
    Proxy.web(req, res, {target: 'http://localhost:3000/sessionTest/login/' + username + "/" + password});
});

app.all("/logout", function(req, res) {
    Proxy.web(req, res, {target: 'http://localhost:3000/sessionTest/logout'});
});

app.all("/session", function(req, res) {
    Proxy.web(req, res, {target: 'http://localhost:3000/sessionTest'});
});

/// MYSQL 테스트
app.all("/app1/", function(req, res) {
    console.log('redirecting to Server1');
    Proxy.web(req, res, {target: Server1});
});

app.all("/app1/user/", function(req, res) {
    console.log('redirecting to Server1');
    Proxy.web(req, res, {target: Server5});
});

app.all("/app1/keyword/:id", function(req, res) {
    var id = req.params.id;
    Proxy.web(req, res, {target: 'http://localhost:3000/mysql/keyword/' + id});
});

app.all("/app1/excel/*", function(req, res) {
    Proxy.web(req, res, {target: 'http://localhost:3000/mysql/excel'});
});

app.all("/app2/", function(req, res) {
    console.log('redirecting to Server2');
    Proxy.web(req, res, {target: Server2});
});

app.all("/app3/", function(req, res) {
    console.log('redirecting to Server3');
    Proxy.web(req, res, {target: Server3});
});


//서버 설정 구성
app.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger());
/*app.use(logger('dev'));*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));


//JS
app.use('/', index);
app.use('/users', users);
app.use('/mysql', mysql);
app.use('/sessionTest', sessionTest);
app.use('/requestInfo', requestInfo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
