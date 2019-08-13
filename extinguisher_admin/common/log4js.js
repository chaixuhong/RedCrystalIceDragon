var log4js = require('log4js');

exports = module.exports = {
    logInfo: function (data) {
        log4js.configure({
            appenders: [
                //{ type: 'console' }, //控制台输出
                {
                    type: 'file', //文件输出
                    filename: 'logs/access.log',
                    maxLogSize: 1024 * 1024 * 20,
                    backups: 4,
                    category: 'normal'
                }
            ]
        });
        var logger = log4js.getLogger('normal');
        logger.setLevel('INFO');
        logger.info(data);


    },
    logError: function (data) {
        log4js.configure({
            appenders: [{
                type: 'file', //文件输出
                filename: 'logs/error.log',
                maxLogSize: 1024 * 1024 * 20,
                backups: 4,
                category: 'ERROR'
            }]
        });
        var logger = log4js.getLogger('ERROR');
        logger.setLevel('ERROR');
        logger.error(data);
    },
    connectLogger: function () {
        log4js.configure({
            appenders: [
                //{ type: 'console' }, //控制台输出
                {
                    type: 'file', //文件输出
                    filename: 'logs/access.log',
                    maxLogSize: 1024 * 1024 * 20,
                    backups: 4,
                    category: 'normal'
                }
            ]
        });

        var logger = log4js.getLogger('normal');
        logger.setLevel('INFO');
        return log4js.connectLogger(logger, {
            level: log4js.levels.INFO
        })
    }
}