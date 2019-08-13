var config = require('../config');
var log4js = require('../common/log4js.js');
var mysql = require('mysql');
var mysql_config = {
    host: config.mydb.host,
    user: config.mydb.user,
    password: config.mydb.password,
    database: config.mydb.database,
    port: config.mydb.port
};

var pool = mysql.createPool(mysql_config);


exports = module.exports = {
    /**
     * 用于带有参数的查询操作
     * @param sql
     * @param obj 查询语句中的参数
     * @param callback
     */
    exe_mysql_obj: function (sql, obj, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                log4js.logError("Mysql Connet error:");
                log4js.logError(err);
            }
            connection.query({
                sql: sql,
                timeout: 600000
            }, obj, function (err, rows, fields) {
                if (err) {
                    log4js.logError("exe_mysql_obj.connection.query 执行错误:");
                    log4js.logError(err);
                }
                callback(err, rows, fields)
                connection.release();
            });
        });
    },

    /**
     * 查询不带有sql参数的操作
     * @param sql
     * @param callback
     */
    exe_mysql: function (sql, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                log4js.logError("Mysql Connet error:");
                log4js.logError(err);
            }
            connection.query({
                sql: sql,
                timeout: 600000
            }, function (err, rows) {
                if (err) {
                    log4js.logError("exe_mysql.connection.query 执行错误:");
                    log4js.logError(err);
                }
                callback(err, rows)
                connection.release();
            });
        });
    },
    query: function (sql) {
        return new Promise((rs, rj) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    rj(err);
                    conn.release();
                } else {
                    conn.query({
                        sql: sql,
                        timeout: 60000
                    }, (err2, rwos) => {
                        if (err2) {
                            rj(err2)
                            conn.release();
                        } else {
                            rs(rwos);
                            conn.release();
                        }
                    });
                }
            });
        })

    },
    queryParam: function (sql, param) {
        return new Promise((rs, rj) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    rj(err);
                    conn.release();
                } else {
                    conn.query({
                        sql: sql,
                        timeout: 60000
                    }, param, (err2, rwos) => {
                        if (err2) {
                            rj(err2)
                            conn.release();
                        } else {
                            rs(rwos);
                            conn.release();
                        }
                    });
                }
            });
        })

    }
}