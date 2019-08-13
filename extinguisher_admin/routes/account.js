var express = require('express');
var router = express.Router();
var sys_admin_logic = require('../logic/sys_admin_logic.js');
var md5 = require('../common/md5.js');

//修改个人账号信息
router.get('/accountinfo', async function (req, res, next) {
    let data = await sys_admin_logic.GetSysAdminInfo(req.session.user.sys_login_id, req.session.user.company_id);
    if (data && data[0]) {
        res.render('account/accountinfo', {
            title: '个人账号信息',
            SysAdminInfo: data[0]
        });
    } else {
        res.redirect('/admin/login');
    }
});
router.post('/updateinfo', function (req, res, next) {
    var para = {
        company_id: req.session.user.company_id,
        sys_login_id: req.session.user.sys_login_id,
        sys_name: req.body.sys_name,
        sys_photo: req.body.sys_photo
    };
    sys_admin_logic.UpdateAdminInfo(para, function (err, data) {
        if (data && data.affectedRows > 0) {
            var temp_user = req.session.user;
            temp_user.sys_photo = para.sys_photo;
            res.cookie('user', JSON.stringify(temp_user), {
                maxAge: 600000,
                httpOnly: true,
                path: '/'
            });
            return res.json({
                ret_code: 0,
                ret_msg: '信息修改成功'
            });
        } else {
            return res.json({
                ret_code: 1,
                ret_msg: '失败'
            });
        }
    });
});

//修改个人密码
router.get('/updatepwd', function (req, res, next) {
    res.render('account/updatepwd', {
        title: '修改登录密码'
    });
});
router.post('/updatepwd', async function (req, res, next) {
    var para = {
        company_id: req.session.user.company_id,
        sys_login_id: req.session.user.sys_login_id,
        oldpwd: req.body.oldpwd,
        newpwd: req.body.newpwd
    };
    let data = await sys_admin_logic.GetSysAdminInfo(para.sys_login_id, para.company_id);
    if (data[0].sys_login_pwd != md5.MD5(para.oldpwd)) {
        return res.json({
            ret_code: 2,
            ret_msg: '旧密码错误'
        });
    } else {
        let data2 = await sys_admin_logic.UpdatePwd(para, md5.MD5(para.newpwd));
        if (data2.affectedRows > 0) {
            return res.json({
                ret_code: 0,
                ret_msg: '密码修改成功'
            });
        } else {
            return res.json({
                ret_code: 1,
                ret_msg: '密码修改失败'
            });
        }
    }
});

module.exports = router;