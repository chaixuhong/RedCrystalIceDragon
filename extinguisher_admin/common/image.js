var fs = require("fs");
var gm = require('gm');

exports = module.exports = {
    addSNCodeToQRCode: (path, SNCode) => {
        return new Promise((resolve, reject) => {
            gm(path)
                .fontSize(15)
                .drawText(50, 140, SNCode)
                .write(path, error => {
                    if (!error) {
                        resolve(path)
                    } else {
                        reject(error)
                    }
                });
        })
    },
}