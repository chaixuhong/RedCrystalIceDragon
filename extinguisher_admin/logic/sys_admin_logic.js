var sqlhelper = require("../common/sqlhelper.js");
var manager = require("../common/manager.js");
exports = module.exports = {
    /**
     * 获取所有管理账号，无分页
     * @param para 参数json对象
     * @param callback
     * @constructor
     */
    GetAllSchAdmin: function (para, callback) {
        var partSql = "";
        if (para.txtSchCode != '') partSql += " and SchCode like '%" + para.txtSchCode + "%'";
        if (para.txtSchName != '') partSql += " and SchName like '%" + para.txtSchName + "%'";
        if (para.txtSchAdminLoginID != '') partSql += " and SchAdminLoginID like '%" + para.txtSchAdminLoginID + "%'";
        if (para.selectState != '') partSql += " and SchAdminState = '" + para.selectState + "'";

        var sql = 'select SchID,SchCode,SchName,SchAdminLoginID,SchAdminState ';
        sql += ' FROM SchAdmin  where 1=1 and SchAdminRoleType <> 1 ' + partSql;
        sql += ' order by ' + para.sort + ' ' + para.order;

        sqlhelper.exe_mysql_obj(sql, null, function (err, data) {
            callback(err, data);
        });
    },
    /**
     * 获取所有管理账号，分页
     */
    GetAllSysAdminPage: async function (para) {
        var partSql = "";
        if (para.sys_login_id != '') partSql += " and sys_login_id like '%" + para.sys_login_id + "%'";
        if (para.sys_state != '') partSql += " and sys_state = '" + para.sys_state + "'";
        var sql = 'select a.*,r.role_name,r.role_type';
        sql += ' from sys_admin a left JOIN sys_admin_role r on a.role_id=r.role_id where a.company_id=? ' + partSql;
        sql += ' order by ' + para.sort + ' ' + para.order;
        return manager.getJSONPagePromise(sql, [para.company_id], para.offset, para.limit);
    },
    /**
     * 禁用启用管理员账号
     */
    UpdateState: async function (sys_login_id, company_id, state, callback) {
        return sqlhelper.queryParam('update sys_admin set sys_state = ? where sys_login_id = ? and company_id', [state, sys_login_id, company_id]);
    },
    /**
     * 修改管理员密码
     */
    UpdatePwd: async function (para, newpwd) {
        return sqlhelper.queryParam('update sys_admin set sys_login_pwd = ? where sys_login_id = ? and company_id=?', [newpwd, para.sys_login_id, para.company_id]);
    },
    /**
     * 修改信息，系统超级管理员
     * @param id 系统id
     * @param state 状态值
     * @param callback
     * @constructor
     */
    UpdateSchAdmin: function (req, callback) {
        sqlhelper.exe_mysql_obj(
            'update SchAdmin set SchAppKey = ?,SchAppSecret=?,SchName=?,MorningLesson=?,AfternoonLesson=?,EveningLesson=? where SchCode = ?',
            [req.SchAppKey, req.SchAppSecret, req.SchName, req.MorningLesson, req.AfternoonLesson, req.EveningLesson, req.SchCode],
            function (err, data) {
                callback(err, data);
            });
    },
    /**
     * 修改个人账号信息
     */
    UpdateAdminInfo: function (para, cb) {
        sqlhelper.exe_mysql_obj(`update sys_admin set sys_name=?,sys_photo=? where sys_login_id = ? and company_id=?`, [para.sys_name, para.sys_photo, para.sys_login_id, para.company_id],
            function (err, data) {
                cb(err, data);
            });
    },
    /**
     * 管理员登录
     */
    SysAdminLogin: async function (name, password) {
        return sqlhelper.queryParam(`select  * from sys_admin where sys_state=1 and sys_login_id=? and sys_login_pwd=?`, [name, password]);
    },
    /**
     * 添加新管理员
     * @param objJson 实体json对象
     * @param callback
     * @constructor
     */
    AddSchAdmin: function (objJson, callback) {
        sqlhelper.exe_mysql_obj(
            'insert into SchAdmin(SchCode,SchAppKey,SchAppSecret,SchName,SchAdminLogo,SchAdminLoginID,SchAdminLoginPwd,' +
            'SchAdminState,SchAdminRoleType,MorningLesson,AfternoonLesson,EveningLesson,SchSchoolName,SchSchoolMotto) ' +
            ' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [objJson.SchCode, objJson.SchAppKey, objJson.SchAppSecret, objJson.SchName, objJson.SchAdminLogo,
                objJson.SchAdminLoginID, objJson.SchAdminLoginPwd, 1, 2, objJson.MorningLesson,
                objJson.AfternoonLesson, objJson.EveningLesson, objJson.SchSchoolName, '校训'
            ],
            function (err, data) {
                callback(err, data);
            });
    },
    /**
     * 获取管理员信息
     */
    GetSysAdminInfo: async function (sys_login_id, company_id) {
        return sqlhelper.queryParam('select a.*,r.role_name from sys_admin a INNER JOIN sys_admin_role r where a.sys_login_id = ? and a.company_id=? ', [sys_login_id, company_id]);
    },
}