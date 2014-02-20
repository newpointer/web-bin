/**
 * @author ankostyuk
 */

//
var fs     = require('fs'),
    crypto = require('crypto');

//
function regexpIterator(regexp, text, callback) {
    var result = null;

    while ((result = regexp.exec(text))) {
        callback(result);
    }
}

function getFileHash(filePath) {
    var shasum = crypto.createHash('sha1');
    shasum.update(fs.readFileSync(filePath));
    return shasum.digest('hex');
}

//
module.exports.regexpIterator = regexpIterator;
module.exports.getFileHash = getFileHash;
