var express = require('express');
var router = express.Router();

router.get('/workbench', function (req, res, next) {
    res.render('index', {
        title: '工作台'
    });
});

module.exports = router;