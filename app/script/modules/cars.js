modules.cars = function (){
    var mediator = new Mediator();

    var _list,
        _tags = [],
        _tagsLower = [];

    function byName(n){
        for (var i = 0; i < _list.length; i++){
            if (_list[i].id === n){
                return _list[i];
            }
        }

        return null;
    }

    function scan(){
        mediator.dispatch('scan:start');

        var names = {};
        _list = fs.readdirSync(modules.acDir.cars).map(function (e){
            return { id: e, path: path.join(modules.acDir.cars, e), disabled: false };
        }).concat(fs.readdirSync(modules.acDir.carsOff).map(function (e){
            return { id: e, path: path.join(modules.acDir.carsOff, e), disabled: true };
        })).filter(function (car){
            if (names[car.id]) return;
            
            car.json = path.join(car.path, 'ui', 'ui_car.json');
            car.error = [];
            car.changed = false;

            /* TEMPORARY FIX */
            if (!fs.existsSync(car.json) && fs.existsSync(car.json + '.disabled')){
                fs.renameSync(car.json + '.disabled', car.json);
            }

            if (!fs.existsSync(car.json)) return;

            mediator.dispatch('new:car', car);
            names[car.id] = true;
            return car;
        });

        mediator.dispatch('scan:list', _list);
        asyncLoad();
    }

    function asyncLoad(){
        var a = _list;
        step();

        function step(){
            if (a != _list) return;

            var car = a.filter(function (car){
                return car.data == null && car.error.length == 0;
            })[0];

            if (!car) return;

            fs.readdir(path.join(car.path, 'skins'), function (err, skins){
                car.skins = false;

                if (err){
                    car.error.push({ id: 'skins-not-readable', msg: 'Cannot read skins' });
                    mediator.dispatch('error', car);
                    return;
                }

                skins = skins.filter(function (e){
                    return !/\.\w{3,4}$/.test(e);
                });

                if (skins.length == 0){
                    car.error.push({ id: 'skins-empty', msg: 'Skins folder is empty' });
                    mediator.dispatch('error', car);
                    return;
                }

                car.skins = skins.map(function (e){
                    var p = path.join(car.path, 'skins', e);
                    var e = {
                        id: e,
                        path: p,
                        livery: path.join(p, 'livery.png'),
                        preview: path.join(p, 'preview.jpg'),
                    }

                    return e;
                });

                car.skins.selected = car.skins[0];
                mediator.dispatch('update:car:skins', car);
            });

            fs.readFile(car.json, function (err, d){
                step();

                var p;
                try {
                    eval('p=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g, function (_){
                        return _.replace(/\r?\n|<\/?br\/?>/g, '\\n');
                    }));
                } catch (er){
                    err = er;
                }

                if (err){
                    car.data = false;
                    car.error.push({ id: 'json', msg: 'Damaged ui_car.json', details: err });
                    mediator.dispatch('error', car);
                } else {
                    if (!p.name){
                        car.error.push({ id: 'data-name', msg: 'Name is missing' });
                        mediator.dispatch('error', car);
                        return;
                    }

                    if (!p.description) p.description = '';
                    if (!p.tags) p.tags = [];

                    car.data = p;

                    car.data.tags.forEach(function (e){
                        var l = e.toLowerCase();
                        if (_tagsLower.indexOf(l) < 0){
                            _tags.push(e);
                            _tagsLower.push(l);
                        }
                    });
                }

                mediator.dispatch('update:car:data', car);
            });
        }
    }

    function toggle(car){
        function dumb(o, a, b){
            for (var n in o){
                if (typeof o[n] === 'string') o[n] = o[n].replace(a, b);
                else if (typeof o[n] === 'object') dumb(o[n], a, b);
            }
        }

        var a, b;
        if (car.disabled){
            a = modules.acDir.carsOff, b = modules.acDir.cars;
        } else {
            a = modules.acDir.cars, b = modules.acDir.carsOff;
        }

        var newPath = car.path.replace(a, b);
        try {
            fs.renameSync(car.path, newPath);
        } catch (err){
            errorHandler.handled(err);
            return;
        }

        car.disabled = !car.disabled;
        car.path = newPath;
        dumb(car.skins, a, b);

        mediator.dispatch('update:car:disabled', car);
        mediator.dispatch('update:car:path', car);
        mediator.dispatch('update:car:skins', car);
    }

    function changeData(car, key, value){
        if (car[key] == value) return;

        car[key] = value;
        car.changed = true;

        mediator.dispatch('update:car:data', car);
        mediator.dispatch('update:car:changed', car);
    }

    function selectSkin(car, skinId){
        var newSkin = car.skins.filter(function (e){
            return e.id == skinId;
        })[0];

        if (newSkin == car.skins.selected) return;

        car.skins.selected = newSkin;
        mediator.dispatch('update:car:skins', car);
    }

    function updateSkins(car){
        mediator.dispatch('update:car:skins', car);
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
                $('[data-id="' + e.id + '"]').removeClass('changed');
                e.changed = false;
            }
        });
    }

    return mediator.extend({
        byName: byName,
        scan: scan,
        toggle: toggle,
        changeData: changeData,
        selectSkin: selectSkin,
        updateSkins: updateSkins,
        save: save,
        saveChanged: saveChanged,
    });
}();
