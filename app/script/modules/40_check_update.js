modules.checkUpdate = function (){
    var mediator = new Mediator();

    var _urlHost = 'raw.githubusercontent.com';
    var _urlPort = 443;
    var _urlPath = '/gro-ove/actools-uijson/master/README.md';

    var _details = 'https://github.com/gro-ove/actools-uijson/blob/master/README.md';

    var _delay = 1e3;

    setTimeout(function (){
        check();
    }, _delay);

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
                if (/\[Last \((\d.\d+.\d+)\)\]\(([^)]+)\)/.test(output)){
                    var v = RegExp.$1.split('.'),
                        c = gui.App.manifest.version.split('.');
                    if (v.some(function (e, i){
                        return v[i] > c[i];
                    })){
                        mediator.dispatch('update', RegExp.$1, _details, RegExp.$2);
                    }
                }
            });
        }).end();
    }

    return mediator.extend({
    });
}();