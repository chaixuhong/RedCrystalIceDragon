'use strict';

var qr = require('qr-image');
const zlib = require('zlib');
var fs = require("fs");
var path = require('path');
var archiver = require('archiver');
var file = require('./file');
var image = require('./image');

exports = module.exports = {
    generateCode: (content) => {
        return new Promise((resolve, reject) => {
            var img = qr.image(content, {
                type: 'png'
            });
            let topath = path.dirname(__dirname) + '/public/temp/' + content + '.png';
            var writeStream = fs.createWriteStream(topath);
            img.pipe(writeStream)
                .on('finish', () => {
                    return image.addSNCodeToQRCode(topath, content).then(path => {
                        resolve('public/temp/' + content + '.png')
                    })
                })
                .on('error', (error) => {
                    console.log(error)
                })
        })
    },
    generateZIP: () => {
        return new Promise((resolve, reject) => {
            let path1 = path.dirname(__dirname) + '/public/temp/';
            var output = fs.createWriteStream(path.dirname(__dirname) + '/public/temp.zip');

            var archive = archiver('zip', {
                zlib: {
                    level: 9
                } // Sets the compression level.
            });
            output.on('close', function () {
                file.deleteFolder(path1);
                resolve(path.dirname(__dirname) + '/public/temp.zip')
            });
            archive.pipe(output);
            archive.directory(path1, false);
            archive.finalize();
        })
    }
}