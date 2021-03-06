/**
 * @author ankostyuk
 */

//
var fs              = require('fs'),
    _               = require('lodash'),
    requirejs       = require('requirejs'),
    helper          = require('./helper');

//
var defaultBuildIdPropertyName = 'web.resources.build.id';

var options = {
    // Пропустить оптимизацию?
    // Если оптимизация пропущена,
    // то свойство web.resources.build.id будет равно null
    skipOptimize: false,

    // Java-properties файл для записи свойства buildIdPropertyName
    propertiesFile: 'path/to/file.properties',
    buildIdPropertyName: defaultBuildIdPropertyName,

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
        callback(null);
    } else {
        optimize(callback);
    }
}

function optimize(callback) {
    console.log('Оптимизация...');

    requirejs.optimize(options.requirejs, function(results) {
        var hash = helper.getFileHash(options.mainFile);
        writePropertiesFile(hash);
        callback(hash);
    });
}

function writePropertiesFile(hash) {
    console.log('Записан файл свойств с хэшем', hash);
    console.log(options.propertiesFile);
    fs.writeFileSync(
        options.propertiesFile,
        (options.buildIdPropertyName || defaultBuildIdPropertyName) + '=' + (hash ? hash : 'null') + '\n'
    );
}

//
module.exports.run = run;
