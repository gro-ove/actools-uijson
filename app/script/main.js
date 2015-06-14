/* state */
    var acDir, acCarsDir, acCarsOffDir, tagsList = [], tagitSkip;

/* selected */
    var _selected;
    __defineGetter__('selected', function (){
        if (!_selected){
            _selected = modules.cars.byName($('#cars-list > span.selected').data('name'));
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
        modules.cars.scan();
    });

    initUiCarsList();
    initUiCarsInformation();

    process.on('uncaughtException', function (err) {
        new Dialog('Oops!', [
            '<p>Uncaught exception, sorry.</p>',
            '<pre>' + err + '</pre>'
        ], function (){
            nwWindow.reloadDev();
        }, function (){
            return false;
        }).find('button').text('Restart');
    });

/* main functions */
    function initAcDir(c){
        function ready(d){
            if (!fs.existsSync(d)) return prompt('Directory not found');

            acCarsDir = path.join(d, 'content', 'cars');
            if (!fs.existsSync(acCarsDir)) return prompt('Directory content/cars not found');

            acCarsOffDir = path.join(d, 'content', 'cars-off');
            if (!fs.existsSync(acCarsOffDir)){
                fs.mkdirSync(acCarsOffDir);
            }

            localStorage.acRootDir = d;
            acDir = d;
            c(d);
        }

        function prompt(e){
            var dialog = new Dialog('Cars Directory', [
                e && '<p class="error">' + e + '</p>',
                '<button id="select-dir" style="float:right;width:30px">…</button>',
                '<input placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)"></input>',
            ], function (){
                ready(this.find('input').val());
            }, function (){
                return false;
            });

            if (localStorage.acRootDir){
                dialog.find('input').val(localStorage.acRootDir);
            }

            dialog.find('#select-dir').click(function (){
                $('<input type="file" nwdirectory />').attr({
                    nwworkingdir: dialog.find('input').val()
                }).change(function (){
                    dialog.find('input').val(this.value);
                }).click();
            });
        }

        if (localStorage.acRootDir){
            ready(localStorage.acRootDir);
        } else {
            prompt();
        }
    }

    function initUiCarsList(){
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

    function initUiCarsInformation(){
        $(window).on('contextmenu', function (){
            $('footer').toggleClass('active'); 
        });

        /* previews */
        $('#selected-car-skins-article').dblclick(function (e){
            var skin = $(e.target).data('skin');
            if (skin){
                modules.showroom(selected, skin);
            }
        });

        /* inputs */
        $('#selected-car').on('change paste keypress keyup', function (e){
            if (e.keyCode == 13){
                this.blur();
                return false;
            }

            if (selected.data){
                selected.data.name = getInputName();
                changed();
                $('[data-name="' + selected.name + '"]').text(selected.data.name);
            }
        });

        $('#selected-car-tags').tagit({
            availableTags: tagsList,
            autocomplete: { delay: 0, minLength: 1, allowSpaces: true },
            removeConfirmation: true,
            caseSensitive: false,

            afterTagAdded: function (){
                if (!tagitSkip){
                    selected.data.tags = getInputTags();
                    changed();
                }
            },
            afterTagRemoved: function (){
                if (!tagitSkip){
                    selected.data.tags = getInputTags();
                    changed();
                }
            }, 
        });

        $('#selected-car-desc').on('change paste keypress keyup', function (){
            if (selected.data){
                selected.data.description = getInputDescription();
                changed();
            }
        });

        /* buttons */
        $('#selected-car-disable').click(function (){
            if (!modules.cars.toggle()) return;

            display(selected);
            $('[data-name="' + selected.name + '"]').toggleClass('disabled', selected.disabled);
        });

        $('#selected-car-open-directory').click(function (){
            gui.Shell.openItem(selected.path);
        });

        $('#selected-car-save').click(function (){
            modules.cars.save();
        });

        $('#selected-car-update-description').click(function (){
            modules.updateDescription(selected);
        });

        /* global hotkeys */
        $(window).keydown(function (e){
            if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.contentEditable == 'true') return;

            if (e.keyCode == 83 && e.ctrlKey){
                /* Ctrl+S */
                modules.cars.saveChanged();
            } else {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        })
    }

/* secondary functions */
    function changed(v){
        selected.changed = v === undefined ? true : !!v;
        $('[data-name="' + selected.name + '"]').toggleClass('changed', selected.changed);
    }

    function getInputName(){
        return $('#selected-car').text();
    }

    function getInputTags(){
        return [].map.call($('ul .tagit-label'), function (a){ return a.textContent });
    }

    function getInputDescription(){
        return $('#selected-car-desc').html().replace(/<\/?div>/g, '');
    }

    function display(n){
        if (typeof n === 'string') n = modules.cars.byName(n);

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
            h.removeAttr('contenteditable').text(n.name);
            d.html(n.error);
        } else if (n.data != null){
            h.attr('contenteditable', true).text(n.data.name);
            d.html(n.data.description);

            tagitSkip = true;
            t.tagit('removeAll');
            n.data.tags.forEach(function (e){
                t.tagit('createTag', e);
            });

            tagitSkip = false;
        } else {
            h.removeAttr('contenteditable').text(n.name);
            d.html('Loading…');
        }

        p.toggle(n.skins && n.skins[0] ? true : false);
        s.empty();
        if (n.skins && n.skins[0]){
            p.attr({
                'data-skin': n.skins[0].name,
                'src': n.skins[0].preview.cssUrl()
            });

            n.skins.slice(1).forEach(function (e){
                $('<img>').attr({
                    'data-skin': e.name,
                    'src': e.preview.cssUrl()
                }).appendTo(s);
            })
        }
    }

    function loaded(n){
        if (typeof n === 'string') n = modules.cars.byName(n);
        $('#cars-list > span[data-name="' + n.name + '"]')
                .toggleClass('error', n.error != null)
                .text(n.data ? n.data.name : n.name);

        if ($('#selected-car').text() == n.name){
            display(n);
        }
    }