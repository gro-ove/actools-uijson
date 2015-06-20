modules.checkUpdate = function (){
    var mediator = new Mediator();

    var _updateFile = path.join(path.dirname(process.execPath), 'carsmgr_update.next');

    var _urlHost = 'raw.githubusercontent.com';
    var _urlPort = 443;
    var _urlPath = '/gro-ove/actools-uijson/master/README.md';

    var _details = 'https://ascobash.wordpress.com/2015/06/14/actools-uijson/';

    function getRe(){
        return modules.settings.get('updatesSource', 'stable') == 'stable' ?
            /\[Stable \((\d.\d+.\d+)\)\]\(([^)]+)\)/ :
            /\[Last \((\d.\d+.\d+)\)\]\(([^)]+)\)/;
    }

    function getVersion(data){
        if (getRe().test(data)){
            return RegExp.$1;
        } else {
            return null;
        }
    }

    function compareVersion(c, n){
        var v = n.split('.'),
            r = c.split('.');
        return v.some(function (e, i){
            return +v[i] > +r[i];
        });
    }

    function getDownloadUrl(data){
        if (getRe().test(data)){
            return RegExp.$2;
        } else {
            return null;
        }
    }

    function getChangelog(cv, av, data){
        var b = data.split('#### ').filter(function (e){
            return e.indexOf('Changelog') == 0;
        });

        if (b[0]){
            return b[0].split(/\n\* /).slice(1).map(function (e){
                if (/^(\d\.\d+\.\d+)/.test(e) && compareVersion(cv, RegExp.$1) && !compareVersion(av, RegExp.$1)){
                    return {
                        version: RegExp.$1,
                        changes: e.split(/\n\s+\* /).slice(1)
                    }
                } else {
                    return null;
                }
            }).filter(function (e){
                return e;
            });
        }

        return null;
    }

    function isInstallable(link){
        return /^https:\/\/yadi.sk\/d\/\w+/.test(link) || /^http:\/\/www.racedepartment.com\/downloads\//.test(link);
    }

    function check(){
        var https = require('https');

        https.request({
            host: _urlHost,
            port: _urlPort,
            path: _urlPath,
            method: 'GET',
        }, function (res){
            res.setEncoding('utf8');

            var output = '';
            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function() {
                var actualVersion = getVersion(output);

                if (actualVersion && compareVersion(gui.App.manifest.version, actualVersion)){
                    var d = getDownloadUrl(output),
                        s = isInstallable(d);

                    mediator.dispatch('update', {
                        actualVersion: actualVersion,
                        changelog: getChangelog(gui.App.manifest.version, actualVersion, output),
                        detailsUrl: _details,
                        downloadUrl: d,
                        installUrl: s && d.replace(/\/download\?version=.+$/, ''),
                    });
                }
            });
        }).end();
    }

    var _lr;
    function httpDownload(url, file, callback, progressCallback){
        try {
            if (typeof file === 'string'){
                file = fs.createWriteStream(file);
            }

            _lr = require(url.match(/^https?/)[0]).get(url, function(r){
                if (r.statusCode == 302){
                    httpDownload(r.headers['location'], file, callback, progressCallback);
                } else if (r.statusCode == 200){
                    var m = r.headers['content-length'], p = 0;
                    r.pipe(file);
                    r.on('data', function(d) {
                        progressCallback(p += d.length, m);
                    }).on('end', function() {
                        if (_lr){
                            _lr = null;
                            setTimeout(callback, 50);
                        }
                    });
                } else {
                    callback(r.statusCode);
                }
            }).on('error', function(e) {
                callback(e);
            });
        } catch (e){
            callback('DOWNLOAD:' + url);
        }
    }

    function yadiskDownload(url, dest, callback, progressCallback){
        _lr = true;
        var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load', function (e){
            if (!_lr) return;

            this.contentWindow._cb = function (e){
                if (!_lr) return;
                try {
                    clearTimeout(to);
                    httpDownload(e.models[0].data.file, dest, callback, progressCallback);
                } catch (e){
                    callback('YADISK');
                }
                ifr.remove();
            };
            this.contentWindow.eval(function (){/*
                _XMLHttpRequest = XMLHttpRequest;
                XMLHttpRequest = function (){
                    var r = new _XMLHttpRequest();
                    r.onreadystatechange = function (e){
                        if (r.status == 200 && r.readyState == 4){
                            _cb(JSON.parse(r.responseText));
                        }
                    };
                    return {
                        open: function (){ r.open.apply(r, arguments); },
                        setRequestHeader: function (){ r.setRequestHeader.apply(r, arguments); },
                        getAllResponseHeaders: function (){ r.getAllResponseHeaders.apply(r, arguments); },
                        getResponseHeader: function (){ r.getResponseHeader.apply(r, arguments); },
                        abort: function (){ r.abort.apply(r, arguments); },
                        send: function (){ r.send.apply(r, arguments); },
                    };
                };
            */}.toString().slice(14, -3));

            try {
                this.contentWindow.document.querySelector('button[data-click-action="resource.download"]').click();
            } catch (e){
                ifr.remove();
                callback('YADISK:BTN');
            }
        }).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');

        var to = setTimeout(function (){
            if (!_lr) return;
            ifr.remove();
            callback('YADISK:TO');
        }, 10e3);
    }

    function rdDownload(url, dest, callback, progressCallback){
        _lr = true;
        var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load', function (e){
            if (!_lr) return;

            try {
                clearTimeout(to);
                httpDownload(this.contentWindow.document.querySelector('.downloadButton a').href, dest, callback, progressCallback);
            } catch (e){
                console.warn(e);
                ifr.remove();
                callback('RD:BTN');
            }
        }).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');

        var to = setTimeout(function (){
            if (!_lr) return;
            ifr.remove();
            callback('RD:TO');
        }, 10e3);
    }

    function download(url, dest, callback, progressCallback){
        if (url.indexOf('racedepartment') < 0){
            return yadiskDownload(url, dest, callback, progressCallback);
        } else {
            return rdDownload(url, dest, callback, progressCallback);
        }
    }

    function prepareUpdate(){
        fs.renameSync(_updateFile + '~tmp', _updateFile);
    }

    function install(l){
        mediator.dispatch('install:start');
        download(l, _updateFile + '~tmp', function (error){
            if (error){
                _lr = null;
                mediator.dispatch('install:failed', error);
            } else {
                prepareUpdate();
                mediator.dispatch('install:ready');
            }
        }, function (p, m){
            mediator.dispatch('install:progress', p, m);
        });    
    }

    function abort(l){
        if (_lr.abort) _lr.abort();
        _lr = null;
        mediator.dispatch('install:interrupt');

        setTimeout(function(){
            try {
                fs.unlinkSync(_updateFile + '~tmp');
            } catch (e){}
        }, 500);
    }

    function autoupdate(){
        function clearDir(dirPath) {
            try {
                var files = fs.readdirSync(dirPath);
            } catch(e) { return; }
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile()){
                    fs.unlinkSync(filePath);
                } else {
                    clearDir(filePath);
                    fs.rmdirSync(filePath);
                }
            }
        };

        try {
            if (fs.existsSync(_updateFile)){
                var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
                if (fs.existsSync(d)){
                    clearDir(d);
                } else {
                    fs.mkdirSync(d);
                }

                modules.acTools.Utils.FileUtils.Unzip(_updateFile, d);

                var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
                fs.writeFileSync(b, function (){/*
@ECHO OFF

CD %~dp0
TASKKILL /F /IM carsmgr.exe

:CHECK_EXECUTABLE
IF NOT EXIST carsmgr.exe GOTO EXECUTABLE_REMOVED

DEL carsmgr.exe
TIMEOUT /T 1 >nul

GOTO CHECK_EXECUTABLE
:EXECUTABLE_REMOVED

DEL nw.pak icudtl.dat carsmgr.exe

for /r %%i in (carsmgr_update~next\*) do MOVE /Y "%%i" %%~nxi
RMDIR /S /Q carsmgr_update~next

if exist carsmgr.exe (
    start carsmgr.exe
) else (
    start uijson.exe
)

DEL %0 carsmgr_update.next
                */}.toString().slice(14, -3));
                gui.Shell.openItem(b);
                gui.App.quit();
            }
        } catch (e){
            try {
                if (fs.existsSync(_updateFile)){
                    fs.unlinkSync(_updateFile);
                }
            } catch (e){}

            try {
                var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
                if (fs.existsSync(d)){
                    clearDir(d);
                    fs.rmdirSync(d);
                }
            } catch (e){}

            try {
                var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
                if (fs.existsSync(b)){
                    fs.unlinkSync(b);
                }
            } catch (e){}

            mediator.dispatch('autoupdate:failed', e);
        }
    }

    autoupdate();
    return mediator.extend({
        autoupdate: autoupdate,
        check: check,
        install: install,
        abort: abort,
    });
}();