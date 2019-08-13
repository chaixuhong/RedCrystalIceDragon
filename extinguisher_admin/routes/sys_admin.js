var express = require('express');
var router = express.Router();
var nodeExcel = require('excel-export');
var md5 = require('../common/md5.js');
var sys_admin_logic = require('../logic/sys_admin_logic.js');
const async = require('async');

//管理员账号列表
router.get('/sys_admin_list', function (req, res, next) {
    res.render('sys_admin/sys_admin_list', {
        title: '管理员账号列表'
    });
});
router.get('/getschadminlist', async function (req, res, next) {
    var para = {
        company_id: req.session.user.company_id,
        sys_login_id: req.query.sys_login_id,
        sys_state: req.query.sys_state,
        limit: req.query.limit,
        offset: req.query.offset,
        order: req.query.order,
        sort: req.query.sort
    };
    let data = await sys_admin_logic.GetAllSysAdminPage(para);
    return res.json(data);
});


//添加学校账号
router.get('/add', function (req, res, next) {
    res.render('sys_admin/schadminadd', {
        title: '添加学校账号'
    });
});
router.post('/add', function (req, res, next) {
    sys_admin_logic.GetSchAdminBySchCode(req.body.SchCode, function (err, data) {
        if (data && data[0]) {
            return res.json({
                ret_code: 2,
                ret_msg: '学校编码已存在'
            });
        } else {
            sys_admin_logic.GetSchAdminBySchAdminLoginID(req.body.SchAdminLoginID, function (err, data) {
                if (data && data[0]) {
                    return res.json({
                        ret_code: 3,
                        ret_msg: '登录账号已存在'
                    });
                } else {
                    req.body.SchAdminLoginPwd = md5.MD5(req.body.SchAdminLoginPwd);
                    sys_admin_logic.AddSchAdmin(req.body, function (err, data) {
                        if (data && data.affectedRows > 0) {
                            return res.json({
                                ret_code: 0,
                                ret_msg: '添加成功'
                            });
                        } else {
                            return res.json({
                                ret_code: 1,
                                ret_msg: '添加失败'
                            });
                        }
                    });
                }
            });
        }
    });
});

//编辑学校账号
router.get('/update', function (req, res, next) {
    sys_admin_logic.GetSchAdminBySchCode(req.query.SchCode, function (err, data) {
        if (data && data[0]) {
            res.render('sys_admin/schadminupdate', {
                title: '编辑学校账号',
                SchAdminInfo: data[0]
            });
        }
    });
});
router.post('/update', function (req, res, next) {
    sys_admin_logic.UpdateSchAdmin(req.body, function (err, data) {
        if (data && data.affectedRows > 0) {
            return res.json({
                ret_code: 0,
                ret_msg: '编辑成功'
            });
        } else {
            return res.json({
                ret_code: 1,
                ret_msg: '编辑失败'
            });
        }
    });
});


//禁用启用
router.get('/updatestate', async function (req, res, next) {
    let data = await sys_admin_logic.UpdateState(req.query.sys_login_id, req.session.user.company_id, req.query.state);
    if (data && data.affectedRows > 0) {
        res.json({
            ret_code: 0,
            ret_msg: '执行成功'
        });
    } else {
        res.json({
            ret_code: 1,
            ret_msg: err
        });
    }
});

module.exports = router;