
var crypto = require('crypto');

exports = module.exports = {
    MD5: function (password) {
        var hash = crypto.createHash("md5");
        hash.update(password, "binary");
        return hash.digest('hex');
    }
}