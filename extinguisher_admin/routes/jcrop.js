
var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');
var gm = require('gm');
//var gm = require('gm').subClass({ imageMagick : true });
var multer = require('multer')
var needle = require('needle');
var moment = require('moment');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({
    storage: storage
});

//选择本地文件暂存，用于裁剪本地图片
router.post('/add_local_file', upload.single('ImageUrl'), function (req, res, next) {
    var path = req.file.path;
    if (req.file.mimetype != 'image/png' && req.file.mimetype != 'image/jpeg') {
        return res.json({
            ret_code: 1,
            path: path
        });
    }
    if (req.file.size > 3 * 1024 * 1024) { // 3M 内图片
        return res.json({
            ret_code: 3,
            path: path
        });
    }
    var readStream = fs.createReadStream(req.file.path);
    gm(readStream).size(function (err, size) {
        var maxWidth = 700;
        var maxHeight = 500;
        var hRatio;
        var wRatio;
        var Ratio = 1;
        var w = size.width;
        var h = size.height;
        if (w < 300 || h < 300) {
            return res.json({
                ret_code: 2,
                path: path
            });
        }
        wRatio = maxWidth / w
        hRatio = maxHeight / h;
        if (wRatio < 1 || hRatio < 1) {
            Ratio = (wRatio <= hRatio ? wRatio : hRatio);
        }
        return res.json({
            ret_code: 0,
            path: path,
            showpath: "/admin/uploads/" + req.file.originalname,
            ratio: Ratio,
            wh: w > h ? (h / w) : (w / h)
        });
    });
});

//跳转到裁剪页面
router.get('/add_file', function (req, res, next) {
    res.render('jcropfiles/add_file', {
        title: '选择图片',
        path: req.query.path,
        showpath: req.query.showpath,
        ratio: req.query.ratio,
        setSelect: req.query.setSelect,
        minSize: req.query.minSize,
        aspectRatio: req.query.aspectRatio,
        wh: req.query.wh
    });
});

//提交裁剪图片参数，用于裁剪并上传到微哨cdn
router.post('/add_file', function (req, res, next) {

    var path = req.body.path;
    var x1 = req.body.x1;
    var y1 = req.body.y1;
    var w = req.body.w;
    var h = req.body.h;
    var Ratio = req.body.Ratio;

    var resizeW = req.body.resizeW;
    var resizeH = req.body.resizeH;

    x1 = parseInt(x1) / parseFloat(Ratio);
    y1 = parseInt(y1) / parseFloat(Ratio);
    w = parseInt(w) / parseFloat(Ratio);
    h = parseInt(h) / parseFloat(Ratio);

    var new_filename = moment().unix() + '.png'
    var new_file = process.cwd() + '/public/uploads/' + new_filename;
    gm(path).crop(w, h, x1, y1).quality(95).write(new_file, function (err) {
        if (err) {
            return res.json({
                ret_code: 1,
                ret_msg: '图片裁剪上传失败'
            });
        } else {
            return res.json({
                ret_code: 0,
                ret_msg: '/uploads/' + new_filename
            });
        }
    });
});

//删除原始localfile
router.get('/del_add_localfile', function (req, res, next) {
    fs.unlink(req.query.path, function () {
        return res.json({
            ret_code: 0,
            ret_msg: ''
        });
    });
});


module.exports = router;