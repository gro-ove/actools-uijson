/* uses */
    var fs = require('fs'),
        path = require('path'),
        spawn = require('child_process').spawn,
        gui = require('nw.gui'),
        nwWindow = gui.Window.get();

    var Dialog = require('./script/lib/dialog').Dialog;

/* helpers */
    String.prototype.cssUrl = function (){
        return 'file://' + this.replace(/\\/g, '/');
    }

/* state */
    var acDir, carsList, tagsList = [], tagitSkip;

    function byName(n){
        for (var i = 0; i < carsList.length; i++){
            if (carsList[i].name === n){
                return carsList[i];
            }
        }

        return null;
    }

/* selected */
    var _selected;
    __defineGetter__('selected', function (){
        if (!_selected){
            _selected = byName($('#cars-list > span.selected').data('name'));
        }
        return _selected;
    });

    __defineSetter__('selected', function (s){
        $('#cars-list > span.selected').removeClass('selected');
        _selected = null;

        if (typeof s === 'string'){
            s = '#cars-list > span[data-name="' + s + '"]';
        }

        s = $(s);
        $('main > div').toggle(!!s[0]);
        if (!s[0]) return;

        s.addClass('selected');
        display(s.data('name'));
    })

/* app */
    initAcDir(function (){
        scanCars();
    });

    initCarsList();
    initCarsInformation();

/* main functions */
    function initAcDir(c){
        function ready(d){
            if (!fs.existsSync(d)){
                prompt('Directory not found');
            } else {
                localStorage.acDir = d;
                acDir = d;
                c(d);
            }
        }

        function prompt(e){
            var dialog = new Dialog('Cars Directory', [
                e && '<p class="error">' + e + '</p>',
                '<button style="float:right;width:30px">…</button>',
                '<input placeholder="…/Assetto Corsa/content/cars" style="width:calc(100% - 35px)"></input>',
            ], function (){
                ready(this.find('input').val());
            }, function (){
                return false;
            });

            if (localStorage.acDir){
                dialog.find('input').val(localStorage.acDir);
            }

            dialog.find('p + button').click(function (){
                $('<input type="file" nwdirectory />').attr({
                    nwworkingdir: dialog.find('input').val()
                }).change(function (){
                    dialog.find('input').val(this.value);
                }).click();
            });
        }

        if (localStorage.acDir){
            ready(localStorage.acDir);
        } else {
            prompt();
        }
    }

    function initCarsList(){
        function filter(){
            var v = $('#cars-list-filter').val();
            if (v){
                $('#cars-list > span').hide();
                $('#cars-list > span[data-name*="' + v + '"]').show();
            } else {
                $('#cars-list > span').show();
            }
        }

        $(window).keypress(function (e){
            if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.target.contentEditable === 'true') return;

            var f = $('#cars-list-filter').show();
            f[0].focus();
        });

        $('#cars-list-filter')
                .on('change paste keyup keypress search', filter)
                .on('blur', function (){ 
                    if (!this.value){
                        $(this).hide();
                    }
                });

        $('#cars-list').click(function (e){
            selected = e.target;
        });
    }

    function scanCars(){
        var sub = fs.readdirSync(acDir);

        $('#cars-list').empty();
        carsList = [];
        sub.forEach(function (e){
            var p = path.join(acDir, e),
                u = path.join(p, 'ui', 'ui_car.json'),
                d = !fs.existsSync(u);

            if (d){
                u = u + '.disabled';
            }

            carsList.push({
                name: e,
                path: p,
                json: u,
                disabled: d,
                data: null,
                skins: null,
                error: null,
                changed: false
            });

            $('<span></span>').text(e).toggleClass('disabled', d).attr({
                'title': u,
                'data-path': u,
                'data-name': e,
            }).appendTo('#cars-list');
        });

        selected = sub[0];
        $('#total-cars').val(sub.length);

        asyncCarsLoad();
    }

    function asyncCarsLoad(){
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

    function changed(v){
        selected.changed = v === undefined ? true : !!v;
        $('[data-name="' + selected.name + '"]').toggleClass('changed', selected.changed);
    }

    function getTags(){
        return [].map.call($('ul .tagit-label'), function (a){ return a.textContent });
    }

    function initCarsInformation(){
        $(window).on('contextmenu', function (){
            $('footer').toggleClass('active'); 
        });

        $('#selected-car-tags').tagit({
            availableTags: tagsList,
            autocomplete: { delay: 0, minLength: 1, allowSpaces: true },
            removeConfirmation: true,

            afterTagAdded: function (){
                if (!tagitSkip){
                    selected.data.tags = getTags();
                    changed();
                }
            },
            afterTagRemoved: function (){
                if (!tagitSkip){
                    selected.data.tags = getTags();
                    changed();
                }
            }, 
        });

        $('#selected-car-disable').click(function (){
            selected.disabled = !selected.disabled;
            var j = selected.disabled ? selected.json + '.disabled' :
                    selected.json.slice(0, -9);
            fs.renameSync(selected.json, j);
            selected.json = j;

            display(selected);
            $('[data-name="' + selected.name + '"]').toggleClass('disabled', selected.disabled);
        });

        $('#selected-car-open-directory').click(function (){
            gui.Shell.openItem(selected.path);
        });

        $('#selected-car-save').click(function (){
            save();
        });

        $('#selected-car-desc').on('change paste keypress keyup', function (){
            if (selected.data){
                selected.data.description = this.innerHTML;
                changed(true);
            }
        });

        $(window).keydown(function (e){
            if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.contentEditable == 'true'){
                return;
            }

            if (e.keyCode == 83 && e.ctrlKey){
                /* Ctrl+S */
                save();
            } else {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        })
    }

/* secondary functions */
    function display(n){
        if (typeof n === 'string') n = byName(n);

        $('main > h4')
                .toggleClass('error', n.error != null)
                .toggleClass('disabled', n.disabled);

        var h = $('#selected-car'),
            d = $('#selected-car-desc'),
            t = $('#selected-car-tags'),
            p = $('#selected-car-preview'),
            s = $('#selected-car-skins');

        $('#selected-car-disable').text(n.disabled ? 'Enable' : 'Disable');
        $('#selected-car-logo').attr('src', path.join(n.path, 'ui', 'badge.png').cssUrl());

        if (n.error != null){
            h.val(n.name);
            d.html(n.error);
        } else if (n.data != null){
            h.val(n.data.name);
            d.html(n.data.description);

            tagitSkip = true;
            t.tagit('removeAll');
            n.data.tags.forEach(function (e){
                t.tagit('createTag', e);
            });

            tagitSkip = false;
        } else {
            h.val(n.name);
            d.html('Loading...');
        }

        p.toggle(n.skins && n.skins[0] ? true : false);
        s.empty();
        if (n.skins && n.skins[0]){
            p.attr({
                src: n.skins[0].preview.cssUrl()
            });

            n.skins.slice(1).forEach(function (e){
                $('<img>').attr({
                    src: e.preview.cssUrl()
                }).appendTo(s);
            })
        }
    }

    function save(){
        if (selected && selected.data){
            fs.writeFileSync(selected.json, JSON.stringify(selected.data, null, 4));
            changed(false);
        }
    }

    function loaded(n){
        if (typeof n === 'string') n = byName(n);
        $('#cars-list > span[data-name="' + n.name + '"]')
                .toggleClass('error', n.error != null)
                .text(n.data ? n.data.name : n.name);

        if ($('#selected-car').val() == n.name){
            display(n);
        }
    }