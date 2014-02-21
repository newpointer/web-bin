/**
 * @author ankostyuk
 */

//
var fs              = require('fs'),
    _               = require('underscore'),
    requirejs       = require('requirejs'),
    helper          = require('./helper');

//
var options = {
    // Пропустить оптимизацию?
    // Если оптимизация пропущена,
    // то свойство web.resources.build.id будет равно null
    skipOptimize: false,

    // Java-properties файл для записи свойства web.resources.build.id
    propertiesFile: 'path/to/file.properties',

    // Путь к файлу, от которого будет взят хэш для записи свойства web.resources.build.id
    mainFile: 'path/to/main',

    // requirejs build config
    // https://github.com/jrburke/r.js/blob/master/build/example.build.js
    requirejs: {}
};

//
function run(o, callback) {
    options = o;

    if (options.skipOptimize) {
        console.log('Оптимизация отключена');
        writePropertiesFile(null);
        callback();
    } else {
        optimize(callback);
    }
}

function optimize(callback) {
    console.log('Оптимизация...');

    requirejs.optimize(options.requirejs, function(results) {
        writePropertiesFile(helper.getFileHash(options.mainFile));
        callback();
    });
}

function writePropertiesFile(hash) {
    console.log('Записан файл свойств с хэшем', hash);
    console.log(options.propertiesFile);
    fs.writeFileSync(options.propertiesFile, 'web.resources.build.id=' + (hash ? hash : 'null') + '\n');
}

//
module.exports.run = run;

