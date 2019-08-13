var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var log4js = require('./common/log4js.js');

var index = require('./routes/index');
var login = require('./routes/login');
var sys_admin = require('./routes/sys_admin');
var account = require('./routes/account');
var jcrop = require('./routes/jcrop'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.url = req.url.replace('/admin', '')
    next();
})

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '10mb'
}));
// for parsing application/json
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
// for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    resave: true,
    rolling: true,
    saveUninitialized: false,
    secret: 'user',
    cookie: {
        maxAge: 10 * 60 * 60 * 1000
    }
}));

app.use(function (req, res, next) {
    if (!req.session.user) {

        /**
         * msinitapp ms初始化普教应用
         * cardofapp app内卡片api接口
         * tsmanager 教学分享独立管理
         * sunnyclass_open 课程表对外开放页面，用于无线硬件
         */

        var requrl = req.url + '';
        let rules = []

        if (req.headers["x-requested-with"] != null &&
            req.headers["x-requested-with"] == "XMLHttpRequest" &&
            req.url != "/login") {
            return res.json({
                ret_code: 99,
                ret_msg: '登录信息失效，请您重新登录'
            });
        } else if (
            req.url == "/login") {
            next();
        } else {
            res.redirect('/admin/login');
        }
    } else if (req.session.user) {
        res.locals.session = req.session;
        res.cookie('user', JSON.stringify(req.session.user), {
            maxAge: 600000,
            httpOnly: true,
            path: '/'
        });
        next();
    }
});

app.use('/', index);
app.use('/login', login);   
app.use('/sys_admin', sys_admin);
app.use('/account', account);
app.use('/jcrop', jcrop);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        title: '错误页'
    });
});

module.exports = app;