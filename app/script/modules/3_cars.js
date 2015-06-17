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

    function initCar(carPath){
        var id = carPath.slice(Math.max(carPath.lastIndexOf('/'), carPath.lastIndexOf('\\')) + 1);
        var disabled = carPath.indexOf(modules.acDir.cars) < 0;
        var json = path.join(carPath, 'ui', 'ui_car.json');

        return {
            id: id,
            path: carPath,
            disabled: disabled,

            json: json,
            error: [],
            changed: false,
        };
    }

    function loadCar(car, callback){
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

        if (!fs.existsSync(car.json)){
            if (fs.existsSync(car.json + '.disabled')){
                fs.renameSync(car.json + '.disabled', car.json);
            } else {
                car.data = false;
                car.error.push({ id: 'json-missing', msg: 'Missing ui_car.json', details: null });
                mediator.dispatch('error', car);
                mediator.dispatch('update:car:data', car);
                callback();
                return;
            }
        }

        fs.readFile(car.json, function (err, d){
            callback();

            if (err){
                car.data = false;
                car.error.push({ id: 'json-read', msg: 'Unavailable ui_car.json', details: err });
                mediator.dispatch('error', car);
            } else {
                var p;
                try {
                    eval('p=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g, function (_){
                        return _.replace(/\r?\n[ \t]*|<\/?br\/?>/g, '\\n');
                    }));
                } catch (er){
                    err = er;
                }

                if (err){
                    car.data = false;
                    car.error.push({ id: 'json-parse', msg: 'Damaged ui_car.json', details: err });
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
            }

            mediator.dispatch('update:car:data', car);
        });
    }

    function scan(){
        mediator.dispatch('scan:start');

        var names = {};
        _list = fs.readdirSync(modules.acDir.cars).map(function (e){
            return path.join(modules.acDir.cars, e);
        }).concat(fs.readdirSync(modules.acDir.carsOff).map(function (e){
            return path.join(modules.acDir.carsOff, e);
        })).map(function (carPath){
            car = initCar(carPath);

            if (names[car.id]) return;
            mediator.dispatch('new:car', car);
            names[car.id] = true;
            return car;
        }).filter(function (e){
            return e;
        });

        mediator.dispatch('scan:list', _list);
        asyncLoad();
    }

    function asyncLoad(){
        var a = _list, i = 0;
        step();

        function step(){
            if (a != _list) return;

            var car = a[i++];
            if (car){
                loadCar(car, step);
            }
        }
    }

    function toggle(car){
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
        car.json = car.json.replace(a, b)
        car.skins.forEach(function (e){
            for (var n in e){
                if (typeof e[n] === 'string'){
                    e[n] = e[n].replace(a, b);
                }
            }
        });

        mediator.dispatch('update:car:disabled', car);
        mediator.dispatch('update:car:path', car);
        mediator.dispatch('update:car:skins', car);
    }

    function changeData(car, key, value){
        if (!car.data || car.data[key] == value) return;

        car.data[key] = value;
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

    function reload(car){
        throw new Error('Not implemented'); // TODO

        if (car.data){
            fs.writeFileSync(car.json, JSON.stringify(car.data, null, 4));
            car.changed = false;
            mediator.dispatch('update:car:changed', car);
        }

        mediator.dispatch('update:car:data', car);
        mediator.dispatch('update:car:changed', car);
    }

    function save(car){
        if (car.data){
            fs.writeFileSync(car.json, JSON.stringify(car.data, null, 4));
            car.changed = false;
            mediator.dispatch('update:car:changed', car);
        }
    }

    function saveChanged(){
        carsList.forEach(function (car){
            if (car.changed){
                save(car);
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
        reload: reload,
        save: save,
        saveChanged: saveChanged,

        get tags (){
            return _tags;
        },
    });
}();
