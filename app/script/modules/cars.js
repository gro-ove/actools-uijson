modules.cars = function (){
    var carsList;

    function byName(n){
        for (var i = 0; i < carsList.length; i++){
            if (carsList[i].name === n){
                return carsList[i];
            }
        }

        return null;
    }

    function scan(){
        $('#cars-list').empty();

        var names = {};

        carsList = fs.readdirSync(acCarsDir).map(function (e){
            return { name: e, path: path.join(acCarsDir, e), disabled: false };
        }).concat(fs.readdirSync(acCarsOffDir).map(function (e){
            return { name: e, path: path.join(acCarsOffDir, e), disabled: true };
        })).filter(function (e){
            if (names[e.name]) return;
            names[e.name] = true;
            
            e.json = path.join(e.path, 'ui', 'ui_car.json');

            /* TEMPORARY FIX */
            if (!fs.existsSync(e.json) && fs.existsSync(e.json + '.disabled')){
                fs.renameSync(e.json + '.disabled', e.json);
            }

            if (!fs.existsSync(e.json)) return;

            $('<span></span>').text(e.name).toggleClass('disabled', e.disabled).attr({
                'title': e.path,
                'data-path': e.path,
                'data-name': e.name,
            }).appendTo('#cars-list');

            return e;
        });

        selected = carsList[0].name;
        $('#total-cars').val(carsList.length);

        asyncLoad();
    }

    function asyncLoad(){
        var a = carsList;

        function step(){
            if (a != carsList) return;

            var n = a.filter(function (n){
                return n.data == null && n.error == null;
            })[0];

            if (!n) return;

            fs.readdir(path.join(n.path, 'skins'), function (e, d){
                n.skins = d.filter(function (e){
                    return !/\.\w{3,4}$/.test(e);
                }).map(function (e){
                    var p = path.join(n.path, 'skins', e);
                    return {
                        name: e,
                        path: p,
                        preview: path.join(p, 'preview.jpg')
                    }
                });
            });

            fs.readFile(n.json, function (e, d){
                step();

                var p;
                try {
                    eval('p=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g, function (_){
                        return _.replace(/\r?\n/g, '\\n');
                    }));
                } catch (er){
                    e = er;
                }

                if (e){
                    n.data = null;
                    n.error = e;
                } else {
                    n.data = p;
                    if (!n.data.tags){
                        n.data.tags = [];
                    }

                    n.data.tags.forEach(function (e){
                        if (tagsList.indexOf(e) < 0){
                            tagsList.push(e);
                        }
                    });
                }

                loaded(n);
            });
        }

        step();
    }

    function toggle(c){
        c = c || selected;

        function dumb(o, a, b){
            for (var n in o){
                if (typeof o[n] === 'string') o[n] = o[n].replace(a, b);
                else if (typeof o[n] === 'object') dumb(o[n], a, b);
            }
        }

        var a, b;
        if (c.disabled){
            a = acCarsOffDir, b = acCarsDir;
        } else {
            a = acCarsDir, b = acCarsOffDir;
        }

        try {
            fs.renameSync(c.path, c.path.replace(a, b));
        } catch (err){
            new Dialog('Oops!', [ 
                '<p>Cannot disable car, sorry.</p>',
                '<pre>' + err + '</pre>'
            ]);

            return false;
        }

        c.disabled = !c.disabled;
        dumb(c, a, b);
        return true;
    }

    function save(c){
        c = c || selected;
        if (selected && selected.data){
            fs.writeFileSync(selected.json, JSON.stringify(selected.data, null, 4));
            changed(false);
        }
    }

    function saveChanged(){
        carsList.forEach(function (e){
            if (e.changed){
                fs.writeFileSync(e.json, JSON.stringify(e.data, null, 4));
                $('[data-name="' + e.name + '"]').removeClass('changed');
                e.changed = false;
            }
        });
    }

    return {
        byName: byName,
        scan: scan,
        toggle: toggle,
        save: save,
        saveChanged: saveChanged,
    };
}();
