var exemysql = require('./sqlhelper').exe_mysql;
var exe_mysql_para = require('./sqlhelper.js').exe_mysql_obj;
var query = require('./sqlhelper.js').queryParam;
var moment = require('moment');
var async = require("async");
exports = module.exports = {
    save: function (tbname, nodebean, cb) {
        save(tbname, nodebean, cb);
    },
    save_retrun_id: function (tbname, nodebean, cb) {
        save_(tbname, nodebean, cb);
    },
    save_arr: function (tbname, nodeArr, cb) {
        save_arr(tbname, nodeArr, cb);
    },
    update: function (tbname, nodebean, wherecoulom, cb) {
        update(tbname, nodebean, wherecoulom, cb);
    },
    updates: function (tbname, nodebean, wheresqlstr, cb) {
        updates(tbname, nodebean, wheresqlstr, cb);
    },
    deletes: function (tbname, wherrobj, array, cb) {
        deletes(tbname, wherrobj, array, cb);
    },

    /**
     * 删除方法，有关联表，需要判断关联表
     * @param tbname 删除的表名
     * @param wherrobj 查询条件 格式｛id:1,name:"xx"｝
     * @param otherarray 删除的表关联的其他表，如果存在使用数据 不可以删除，格式[{tablename:"aa",column:{id:1}}]
     */
    deletesPromise: async function (tbname, wherrobj, otherarray = []) {
        var count = 0;
        //判读其他关联表业务数据
        for (let i = 0; i < otherarray.length; i++) {
            const item = otherarray[i];
            var wherecolumn = [];
            var valuepram = [];
            for (var key in item.column) {
                wherecolumn.push("and " + key + "=?");
                valuepram.push(item.column[key]);
            }
            var sql = "select count(*) as count from " + item.tablename + " where 1=1 " + wherecolumn.join(" ");
            let r = await query(sql, valuepram);
            count += r[0].count;
        }
        if (count > 0) {
            throw '已在业务中使用，无法删除！请先删除其他业务引用。'
        } else {
            //删除当前数据
            var where = [];
            var value = [];
            for (var key in wherrobj) {
                where.push("and " + key + "=?");
                value.push(wherrobj[key]);
            }
            var sql1 = "delete from " + tbname + " where 1=1  " + where.join(" ");
            return query(sql1, value);
        }
    },
    findOneBean: function (tbname, wherrobj, cb) {
        findOneBean(tbname, wherrobj, cb);
    },
    getListPage: function (tbname, wherrobj, orderobj, page, rows, cb) {
        getListPage(tbname, wherrobj, orderobj, page, rows, cb);
    },
    getListNoPage: function (tbname, wherrobj, orderobj, cb) {
        getListNoPage(tbname, wherrobj, orderobj, cb);
    },
    getJSONPage: function (sqlstr, pram, page, rows, cb) {
        getJSONPage(sqlstr, pram, page, rows, cb);
    },
    /**
     * 分页查询-getJSONPage的Promise实现
     * @param {string} sqlstr sql字符串
     * @param {Array} pram SQL参数数组
     * @param {int} start 
     * @param {int} rows 行数
     */
    getJSONPagePromise: function (sqlstr, pram, start, rows) {
        return new Promise((rs, rj) => {
            // var start = (page - 1) * rows;
            var count = rows;
            var obj = {};
            var total = 0;
            var sql = "select count(*) as count from (" + sqlstr + ") as _bbbbbbbbbb";
            exe_mysql_para(sql, pram, function (err, data) {
                if (!err) {
                    total = data[0].count;
                    var sql1 = "select * from (" + sqlstr + ") as _bbbbbbbbbb  limit " + start + "," + count;
                    exe_mysql_para(sql1, pram, function (err1, data1, fields) {
                        if (!err1) {
                            obj.rows = rtTOString(data1, fields);
                            obj.total = total;
                            rs(obj);
                        } else {
                            obj.rows = rows;
                            obj.total = total;
                            rs(obj);
                        }
                    })
                } else {
                    obj.rows = [];
                    obj.total = total;
                    rs(obj);
                }
            });
        });
    },
    getJSON: function (sqlstr, pram, cb) {
        getJSON(sqlstr, pram, cb);
    },
    delete_all: function (tbname, arr, cb) {
        delete_all(tbname, arr, cb);
    }
};

function save(tbname, nodebean, cb) {
    try {
        var insertcolumn = [];
        var insertvalues = [];
        var nums = [];
        for (var bean in nodebean) {
            insertcolumn.push(bean);
            insertvalues.push(nodebean[bean]);
            nums.push("?");
        }
        var sql = "insert into " + tbname + "(" + insertcolumn.join(",") + ") values(" + nums.join(",") + ")";
        exe_mysql_para(sql, insertvalues, function (err, data) {
            if (!err) {
                cb(200, '保存成功！');
            } else {
                console.log(err);
                cb(500, '保存出错！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}

/**
 * 批量保存
 * @param tbname
 * @param nodeArr
 * @param cb
 * @private
 */
function save_arr(tbname, nodeArr, cb) {
    try {
        var insertvalues = [];
        var sql = "insert into " + tbname;
        for (let i = 0; i < nodeArr.length; i++) {
            const nodebean = nodeArr[i];
            var insertcolumn = [];
            var nums = [];
            for (var bean in nodebean) {
                insertcolumn.push(bean);
                insertvalues.push(nodebean[bean]);
                nums.push("?");
            };
            if (i == 0) sql += "(" + insertcolumn.join(",") + ") values";
            sql += "(" + nums.join(",") + "),";
        }
        sql = sql.substr(0, sql.length - 1);
        exe_mysql_para(sql, insertvalues, function (err, data) {
            if (!err) {
                cb(200, '保存成功！');
            } else {
                cb(500, '保存出错！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}

/**
 * 保存信息，返回插入id
 * @param tbname
 * @param nodebean
 * @param cb
 * @private
 */
function save_(tbname, nodebean, cb) {
    try {
        var insertcolumn = [];
        var insertvalues = [];
        var nums = [];
        for (var bean in nodebean) {
            insertcolumn.push(bean);
            insertvalues.push(nodebean[bean]);
            nums.push("?");
        }
        var sql = "insert into " + tbname + "(" + insertcolumn.join(",") + ") values(" + nums.join(",") + ")";
        exe_mysql_para(sql, insertvalues, function (err, data) {
            if (!err) {
                cb(200, data.insertId);
            } else {
                console.log(err);
                cb(500, '保存出错！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}

/**
 * 修改方法
 * @param tbname
 * @param wherecoulom
 * @param id
 * @param nodebean
 * @param cb
 */
function update(tbname, nodebean, wherecoulom, cb) {
    try {
        var updatestr = [];
        var params = [];
        var where = [];
        for (var bean in nodebean) {
            updatestr.push(bean + "=?");
            params.push(nodebean[bean]);
        }
        for (var key in wherecoulom) {
            where.push("and " + key + "=?");
            params.push(wherecoulom[key]);
        }
        var sql = "update  " + tbname + " set " + (updatestr.join(",")) + " where 1=1 " + where.join(" ");
        exe_mysql_para(sql, params, function (err, data) {
            if (!err) {
                cb(200, '修改成功！');
            } else {
                console.log(err);
                cb(500, '修改出错！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}
/**
 * 修改方法（自己加where条件）
 * @param tbname
 * @param wherecoulom
 * @param id
 * @param nodebean
 * @param cb
 */
function updates(tbname, nodebean, wheresqlstr, cb) {
    try {
        var updatestr = [];
        var params = [];
        for (var bean in nodebean) {
            updatestr.push(bean + "=?");
            params.push(nodebean[bean]);
        }
        var sql = "update  " + tbname + " set " + (updatestr.join(",")) + " where " + wheresqlstr;
        exe_mysql_para(sql, params, function (err, data) {
            if (!err) {
                cb(200, '修改成功！');
            } else {
                console.log(err)
                cb(500, '修改出错！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}
/*

/!**
 * 单表删除，没有关联逻辑，直接删除
 * @param tbname 表名
 * @param wherrobj 查询条件 格式｛id:1,name:"xx"｝
 * @param cb
 *!/
function deletes(tbname, wherrobj, cb) {
    try{
        var where = [];
        var value = [];
        for (var key in wherrobj) {
            where.push("and " + key + "=?");
            value.push(wherrobj[key]);
        }
        var sql1 = "delete from " + tbname + " where 1=1  " + where.join(" ");
        exe_mysql_para(sql1, value, function (err, data) {
            if (!err) {
                cb(200, "删除成功！");
            } else {
                cb(500, '删除异常！');
            }
        });
    }catch(e){
        console.log(e);
        cb(500, e);
    }

}
*/

/**
 * 批量删除，没有关联逻辑，直接删除
 * @param tbname 表名
 * @param arr 查询条件 格式[｛id:1,name:"xx"｝]
 * @param cb
 */
function delete_all(tbname, arr, cb) {
    try {
        var sql1 = "delete from " + tbname + " where  ";
        var value = [];
        for (let i = 0; i < arr.length; i++) {
            var where = [];
            const wherrobj = arr[i];
            for (var key in wherrobj) {
                where.push("and " + key + "=?");
                value.push(wherrobj[key]);
            }
            sql1 += "( 1=1 " + where.join(" ") + ") or";
        };
        sql1 = sql1.substr(0, sql1.length - 2);
        exe_mysql_para(sql1, value, function (err, data) {
            if (!err) {
                cb(200, "删除成功！");
            } else {
                cb(500, '删除异常！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}


/**
 * 删除方法，有关联表，需要判断关联表
 * @param tbname 表名
 * @param wherrobj 查询条件 格式｛id:1,name:"xx"｝
 * @param otherarray 删除的表关联的其他表，如果存在使用数据 不可以删除，格式[{tablename:"aa",column:{id:1}}]
 * @param cb
 */
function deletes(tbname, wherrobj, otherarray, cb) {
    try {
        var count = 0;
        async.eachSeries(otherarray, function (item, callback) {
            var wherecolumn = [];
            var valuepram = [];
            for (var key in item.column) {
                wherecolumn.push("and " + key + "=?");
                valuepram.push(item.column[key]);
            }
            var sql = "select count(*) as count from " + item.tablename + " where 1=1 " + wherecolumn.join(" ");
            exe_mysql_para(sql, valuepram, function (err, data) {
                if (!err) {
                    count += data[0].count;
                    callback("", "1");
                } else {
                    callback("err", "获取总数异常！");
                }
            });
        }, function (err) {
            if (!err) {
                if (count == 0) {
                    var where = [];
                    var value = [];
                    for (var key in wherrobj) {
                        where.push("and " + key + "=?");
                        value.push(wherrobj[key]);
                    }
                    var sql1 = "delete from " + tbname + " where 1=1  " + where.join(" ");
                    exe_mysql_para(sql1, value, function (err, data) {
                        if (!err) {
                            cb(200, "删除成功！");
                        } else {
                            console.log(err)
                            cb(500, '删除异常！');
                        }
                    });
                } else {
                    cb(500, '已在业务中使用，无法删除！请先删除其他业务引用。');
                }
            } else {
                console.log(err)
                cb(500, "查询关联表出现异常！");
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}


/**
 *获取一条信息
 * @param tbname
 * @param where
 * @param id
 * @param cb
 */
function findOneBean(tbname, wherrobj, cb) {
    try {
        var where = [];
        var value = [];
        for (var key in wherrobj) {
            where.push("and " + key + "=?");
            value.push(wherrobj[key]);
        }
        var sql1 = "select * from " + tbname + " where 1=1  " + where.join(" ");
        exe_mysql_para(sql1, value, function (err, data, fields) {
            // console.log(data,"fields");
            if (!err) {
                cb(200, rtTOString(data, fields)[0]);
            } else {
                cb(500, '获取异常！');
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}


/**
 *
 * @param tbname  表名
 * @param wherrobj 查询条件 格式 ｛id:1,name:2｝
 * @param orderobj 排序条件 格式 ｛id:"desc",name:"asc"｝
 * @param page
 * @param rows
 * @param cb
 */
function getListPage(tbname, wherrobj, orderobj, page, rows, cb) {
    try {
        var start = (page - 1) * rows;
        var count = rows;
        var obj = {};
        var total = 0;
        var where = [];
        var value = [];
        for (var key in wherrobj) {
            where.push("and " + key + "=?");
            value.push(wherrobj[key]);
        }

        var order = [];

        for (var key in orderobj) {
            order.push(" " + key + " " + orderobj[key]);
        }
        var orderstr = "";
        if (order.length > 0) {
            orderstr = " order by " + order.join(",");
        }

        var sql = "select count(*) as count from " + tbname + " where 1=1  " + where.join(" ");
        exe_mysql_para(sql, value, function (err, data) {
            if (!err) {
                total = data[0].count;
                var sql1 = "select * from " + tbname + " where 1=1 " + where.join(" ") + orderstr + " limit " + start + "," + count;
                exe_mysql_para(sql1, value, function (err1, data1, fields) {
                    if (!err1) {
                        obj.rows = rtTOString(data1, fields);
                        obj.total = total;
                        cb(200, obj);
                    } else {
                        console.log(err1)
                        obj.rows = [];
                        obj.total = total;
                        cb(200, obj);
                    }
                })
            } else {
                console.log(err)
                obj.rows = [];
                obj.total = total;
                cb(200, obj);
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}

/**
 *
 * @param tbname
 * @param wherrobj
 * @param orderobj
 * @param cb
 */
function getListNoPage(tbname, wherrobj, orderobj, cb) {
    try {
        var where = [];
        var value = [];
        for (var key in wherrobj) {
            where.push("and " + key + "=?");
            value.push(wherrobj[key]);
        }
        var order = [];
        for (var key in orderobj) {
            order.push(" " + key + " " + orderobj[key]);
        }
        var orderstr = "";
        if (order.length > 0) {
            orderstr = " order by " + order.join(",");
        }
        var sql1 = "select * from " + tbname + " where 1=1 " + where.join(" ") + orderstr;
        exe_mysql_para(sql1, value, function (err1, data1, fields) {
            if (!err1) {
                cb(200, rtTOString(data1, fields));
            } else {
                console.log(err1)
                cb(200, []);
            }
        })
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}

function getJSONPage(sqlstr, pram, page, rows, cb) {
    try {
        var start = (page - 1) * rows;
        var count = rows;
        var obj = {};
        var total = 0;
        var sql = "select count(*) as count from (" + sqlstr + ") as _bbbbbbbbbb";
        exe_mysql_para(sql, pram, function (err, data) {
            if (!err) {
                total = data[0].count;
                var sql1 = "select * from (" + sqlstr + ") as _bbbbbbbbbb  limit " + start + "," + count;
                exe_mysql_para(sql1, pram, function (err1, data1, fields) {
                    if (!err1) {
                        obj.rows = rtTOString(data1, fields);
                        obj.total = total;
                        cb(200, obj);
                    } else {
                        console.log(err1)
                        obj.rows = rows;
                        obj.total = total;
                        cb(200, obj);
                    }
                })
            } else {
                console.log(err)
                obj.rows = [];
                obj.total = total;
                cb(200, obj);
            }
        });
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}

function getJSON(sqlstr, pram, cb) {
    try {
        var sql1 = "select * from (" + sqlstr + ") as _bbbbbbbbbb  ";
        exe_mysql_para(sqlstr, pram, function (err1, data1, fields) {
            if (!err1) {
                cb(200, rtTOString(data1, fields));
            } else {
                console.log(err1);
                cb(200, []);
            }
        })
    } catch (e) {
        console.log(e);
        cb(500, e);
    }
}


function rtTOString(data, fields) {
    var obj = {};
    for (var i = 0; i < fields.length; i++) {
        obj[fields[i].name] = fields[i].type;
    }
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (obj[key] == 12) { //date
                data[i][key] = (data[i][key]) ? moment(data[i][key]).format('YYYY-MM-DD HH:mm:ss') : "";
            }
            if (obj[key] == 10) { //datetime
                data[i][key] = (data[i][key]) ? moment(data[i][key]).format('YYYY-MM-DD') : "";
            }
            if (obj[key] == 7) { //timestamp
                data[i][key] = (data[i][key]) ? moment(data[i][key]).format('YYYY-MM-DD HH:mm:ss') : "";
            }
        }
    }
    return data;
}