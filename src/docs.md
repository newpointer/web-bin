# nullpointer-web-bin

> Скрипты для веб-приложений


## Использование

### Окружение

* node.js 0.10.x+
* npm 1.3.x+

### Установка

    npm install newpointer/web-bin.git

### Импорт

    var wb = require('nullpointer-web-bin');

### Процессинг ресурсов

> Замена `url("path/to/resource")` на `url("path/to/resource?hashResource")` в файлах `CSS`, `LESS`,
где `hashResource` - sha1 хэш от файла, на который ссылается ресурс.

> Или замена `url("path/to/resource")` на `url(data:base64)` в файлах `CSS`, `LESS`.

> Регулируется флагом `urlToBase64 = true|false`, по умолчанию `false`.

    var processResources = wb.processResources;

    var options = {
        // Пропустить процессинг?
        // Если процессинг пропущен,
        // то будет выполнено копирование из inputDir в outputDir
        skipProcess: false,

        // Заменить url на data:base64?
        urlToBase64: false,

        // Директория исходных файлов
        inputDir: 'path/to/src',

        // Директория для файлов после процессинга
        outputDir: 'path/to/src-process'
    };

    processResources.run(options, function(){
        // done
    });

### Оптимизация requirejs

> [Оптимизация requirejs](http://requirejs.org/docs/optimization.html) и запись java-properties файла со свойством `web.resources.build.id`
- sha1 хэш от оптимизированного файла.

    var requirejsOptimize = wb.requirejsOptimize;

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

    requirejsOptimize.run(options, function(){
        // done
    });
