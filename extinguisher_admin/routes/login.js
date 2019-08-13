var express = require('express');
var router = express.Router();
var md5 = require('../common/md5.js');
var sys_admin_logic = require('../logic/sys_admin_logic'); 

//跳转到登录页
router.get('/', function (req, res, next) {
    res.render('login', {
        title: '登录'
    });
});

//管理员登录
router.post('/', async function (req, res, next) {
    if (req.body.name === '' && req.body.password === '') {
        res.json({
            ret_code: 1,
            ret_msg: '账号或密码错误'
        });
    } else {
        let data = await sys_admin_logic.SysAdminLogin(req.body.name, md5.MD5(req.body.password));
        if (data && data[0]) {
            req.session.user = data[0];
            res.cookie('user', JSON.stringify(data[0]), {
                maxAge: 600000,
                httpOnly: true,
                path: '/'
            });
            res.json({
                ret_code: 0,
                ret_msg: '登录成功'
            });
        } else {
            res.json({
                ret_code: 1,
                ret_msg: '账号或密码错误'
            });
        }
    }
});

//退出系统
router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect('/admin/login');
});

module.exports = router;