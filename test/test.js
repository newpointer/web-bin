/**
 * @author ankostyuk
 */

var fs          = require('fs-extra'),
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should();

var wb = require('../src/');

describe('web-bin test...', function(){

    it('Процессинг ресурсов - замена на URL?hash', function(done){

        var options = {
            skipProcess: false,
            urlToBase64: false,
            inputDir: __dirname + '/process-resources/input/src',
            outputDir: __dirname + '/process-resources/output/hash'
        };

        fs.removeSync(options.outputDir);
        fs.mkdirsSync(options.outputDir);

        wb.processResources.run(options, function(){
            done();
        });
    })

    it('Процессинг ресурсов - замена на data:URI', function(done){

        var options = {
            skipProcess: false,
            urlToBase64: true,
            inputDir: __dirname + '/process-resources/input/src',
            outputDir: __dirname + '/process-resources/output/data-url'
        };

        fs.removeSync(options.outputDir);
        fs.mkdirsSync(options.outputDir);

        wb.processResources.run(options, function(){
            done();
        });
    })

    it('Оптимизация requirejs', function(done){

        var options = {
            skipOptimize: true,
            propertiesFile: __dirname + '/requirejs-optimize/web-resources-build.properties',
            buildIdPropertyName: 'test.web.resources.build.id',
            mainFile: '',
            requirejs: {
                dir: __dirname + '/requirejs-optimize/build'
            }
        };


        fs.removeSync(options.requirejs.dir);
        fs.mkdirsSync(options.requirejs.dir);

        wb.requirejsOptimize.run(options, function(){
            done();
        });
    })
})
