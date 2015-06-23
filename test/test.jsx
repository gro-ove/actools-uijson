fs = require('fs');

JSON.restoreDamaged = function (data, fields){
    data = data.toString().replace(/\r?\n|\r/g, '\n').trim();

    var result = {};
    for (var key, type in-object fields){
        var re = new RegExp(`(?:"\s*%0\s*"|'\s*%0\s*'|%0)\s*:\s*([\s\S]+)`(key));
        var m = data.match(re);
        if (re.test(data)){
            var d = RegExp.$1.trim();

            if (type !== 'multiline' && type !== 'array' && type !== 'pairsArray'){
                d = d.split('\n')[0].replace(/\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:[\s\S]+|\s*}/, '');
            }

            d = d.replace(/(?:\n?\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:|\s*})[\s\S]*$/, '');
            result[key] = d.trim().replace(/,$/, '');
        }
    }

    for (var key, value in-object result){
        if (fields[key] === 'string' || fields[key] === 'multiline'){
            result[key] = value.replace(/^['"]/, '').replace(/['"]$/, '');
        }

        if (fields[key] === 'array' || fields[key] === 'pairsArray'){
            value = value.split(/\n|,/)
                .map(lambda arg.trim().replace(/^['"]/, '').replace(/['"]$/, ''))
                .filter(lambda (a, i) a && (i > 0 || a != '['));
            if (value[value.length - 1] === ']'){
                value.length--;
            }

            result[key] = value;
        }

        if (fields[key] === 'pairsArray'){
            result[key] = [];
            var last;
            value.forEach(lambda {
                if (arg === '[' || arg === ']') return;
                if (last){
                    last.push(arg);
                    last = null;
                } else {
                    result[key].push(last = [ arg ]);
                }
            });
        }

        if (fields[key] === 'number'){
            value = value.replace(/^['"]/, '').replace(/['"]$/, '');

            value = value.replace(/[oO]/g, '0');
            result[key] = +value;

            if (Number.isNaN(result[key])){
                result[key] = +value.replace(/[^-.\d]+/g, '');
            }

            if (Number.isNaN(result[key])){
                result[key] = +(value.replace(/[^\d]+/g, '') || '0');
            }
        }
    }

    return result;
};

fs.readdirSync(dd = 'D:\\Development\\GitHub\\actools-uijson\\test\\skins').forEach(function (e){
    console.log(e, JSON.stringify(JSON.restoreDamaged(fs.readFileSync(dd + '/' + e), {
        skinname: 'string'
        drivername: 'string'
        country: 'string'
        team: 'string'
        number: 'number'
    }), null, 4));
});

fs.readdirSync(dd = 'D:\\Development\\GitHub\\actools-uijson\\test\\cars').forEach(function (e){
    console.log(e, JSON.stringify(JSON.restoreDamaged(fs.readFileSync(dd + '/' + e), {
        name: 'string'
        brand: 'string'
        parent: 'string'
        description: 'multiline'
        class: 'string'
        tags: 'array'
        bhp: 'string'
        torque: 'string'
        weight: 'string'
        topspeed: 'string'
        acceleration: 'string'
        pwratio: 'string'
        range: 'number'
        torqueCurve: 'pairsArray'
        powerCurve: 'pairsArray'
    }), null, 4));
});
