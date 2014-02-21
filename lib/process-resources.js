/**
 * @author ankostyuk
 */

//
var fs              = require('fs-extra'),
    byline          = require('byline'),
    util            = require('util'),
    glob            = require('glob'),
    _               = require('underscore'),
    path            = require('path'),
    helper          = require('./helper');

//
var PROCESSED_FILE_EXT  = '.process',
    CSS_PATTERN         = '**/*.+(css|less)',
    CSS_URL_REGEXP      = 'url\\s*\\(\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*\\)',
    CSS_URL_FORMAT      = 'url("%s?%s")';

//
var options = {
    // Пропустить процессинг?
    // Если процессинг пропущен,
    // то будет выполнено копирование из inputDir в outputDir
    skipProcess: false,

    // Директория исходных файлов
    inputDir: 'path/to/src',

    // Директория для файлов после процессинга
    outputDir: 'path/to/src-process'
};

//
function run(o, callback) {
    options = o;

    fs.copySync(options.inputDir, options.outputDir);

    if (options.skipProcess) {
        console.log('Процессинг ресурсов не производится');
        callback();
    } else {
        process(callback);
    }
}

function process(callback) {
    console.log('Процессинг ресурсов...');

    glob(CSS_PATTERN, {
        cwd: options.outputDir
    }, function(error, files) {
        var doCount = 0;

        files.forEach(function(file){
            doCssFile(path.resolve(options.outputDir, file), function() {
                if (++doCount == files.length) {
                    callback();
                }
            });
        });
    });
}

function doCssFile(filePath, callback) {
    if (!fs.statSync(filePath).isFile()) {
        callback();
        return;
    }

    var processedFile = filePath + PROCESSED_FILE_EXT;

    fs.createFileSync(processedFile);

    byline(fs.createReadStream(filePath))
        .on('data', function(line) {
            var str = line;

            // Заменить url("path/to/resource") на url("path/to/resource?hashResource")
            var urlRegexp   = new RegExp(CSS_URL_REGEXP, 'ig'),
                urlResults  = [];

            helper.regexpIterator(urlRegexp, line, function(match){
                urlResults.push(match[1]);
            });

            urlResults.forEach(function(url){
                var p       = path.join(path.dirname(filePath), url),
                    hash    = helper.getFileHash(p);

                str = str.replace(urlRegexp, util.format(CSS_URL_FORMAT, url, hash));
            });

            //
            fs.appendFileSync(processedFile, str + '\n');
        })
        .on('end', function(){
            fs.removeSync(filePath);
            fs.renameSync(processedFile, filePath);

            callback();
        });
}

//
module.exports.run = run;

