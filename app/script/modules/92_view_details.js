modules.viewDetails = function (){
    var mediator = new Mediator();

    var _selected, _tagSkip;

    function outMsg(title, msg){
        var dm = $('#details-message'),
            cd = $('#selected-car-details');

        if (title){
            dm.html('<h4>{0}</h4><p>{1}</p>'.format(title, msg)).show();
            cd.hide();
        } else {
            dm.hide();
            cd.show();
        }
    }

    function outMsgTip(){
        outMsg('Tip', modules.tips.next + '<br><button id="next-tip">Next</button>');
    }

    function outErrors(car){
        var er = $('#selected-car-error');
        if (car.error.length > 0){
            er.show().html('Errors:<ul><li>' +
                car.error.map(function (e){
                    return e.msg;
                }).join('</li><li>') + '</li></ul>');
        } else {
            er.hide();
        }
    }

    function outBadge(car){
        var lo = $('#selected-car-logo');
        lo.attr('src', path.join(car.path, 'ui', 'badge.png').cssUrl());
    }

    function outData(car){
        var he = $('#selected-car'),
            de = $('#selected-car-desc'),
            ta = $('#selected-car-tags'),
            pr = $('#selected-car-properties');
        if (car.data){
            he.removeAttr('readonly');
            de.removeAttr('readonly');

            _tagSkip = true;
            ta.show().tagit('removeAll');
            car.data.tags.forEach(function (e){
                ta.tagit('createTag', e);
            });
            _tagSkip = false;

            if (car.data.name != he.val()){
                he.val(car.data.name);
            }

            if (car.data.description != de.val()){
                de.val(car.data.description).elastic();
            }

            pr.show();
            $('#selected-car-brand').val(car.data.brand);
            $('#selected-car-class').val(car.data.class || '');

            $('#selected-car-bhp').val(car.data.specs.bhp || '');
            $('#selected-car-torque').val(car.data.specs.torque || '');
            $('#selected-car-weight').val(car.data.specs.weight || '');
            $('#selected-car-topspeed').val(car.data.specs.topspeed || '');
            $('#selected-car-acceleration').val(car.data.specs.acceleration || '');
            $('#selected-car-pwratio').val(car.data.specs.pwratio || '');
        } else {
            he.attr('readonly', true).val(car.id);
            de.attr('readonly', true).val(car.data == null ? 'Loading...' : '').elastic();
            ta.hide();
            pr.hide();
        }
    }

    function outDisabled(car){
        $('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');
        $('#selected-car-header').toggleClass('disabled', car.disabled)
    }

    function outChanged(car){
        $('#selected-car-header').toggleClass('changed', car.changed)
    }

    function outSkins(car){
        setTimeout(function (){
            var sa = $('#selected-car-skins-article'),
                sp = $('#selected-car-preview'),
                ss = $('#selected-car-skins');
            if (car.skins){
                sa.show();
                ss.empty();

                sp.attr({
                    'data-id': car.skins.selected.id,
                    'src': (car.skins.selected.preview + '?' + Math.random()).cssUrl()
                });

                car.skins.forEach(function (e){
                    $('<img>').attr({
                        'data-id': e.id,
                        'src': e.livery.cssUrl()
                    }).appendTo(ss);
                });
            } else {
                sa.hide();
            }
        }, 50);
    }

    modules.cars
        .on('scan:list', function (list){
            if (list.length == 0){
                outMsg('Hmm', 'Cars not found');
            }
        })
        .on('error', function (car){
            if (_selected != car) return;
            outErrors(car);
        })
        .on('update:car:data', function (car){
            if (_selected != car) return;
            outData(car);
        })
        .on('update:car:skins', function (car){
            if (_selected != car) return;
            outSkins(car);
        })
        .on('update:car:disabled', function (car){
            if (_selected != car) return;
            outDisabled(car);
        })
        .on('update:car:changed', function (car){
            if (_selected != car) return;
            outChanged(car);
        });

    modules.viewList
        .on('select', function (car){
            _selected = car;

            if (car){
                outMsg(null);
            } else {
                outMsgTip();
                return;
            }

            outData(car);
            outBadge(car);
            outDisabled(car);
            outChanged(car);
            outErrors(car);
            outSkins(car);
        });

    /* inputs */
    $('#selected-car').keydown(function (e){
        if (e.keyCode == 13){
            this.blur();
            return false;
        }
    }).change(function (){
        if (!_selected || this.readonly || !this.value) return;
        this.value = this.value.slice(0, 64);
        modules.cars.changeData(_selected, 'name', this.value);
    });

    $('#selected-car-desc').elastic().on('input', function (){
        if (!_selected || this.readonly) return;
        modules.cars.changeData(_selected, 'description', this.value);
    });

    $('#selected-car-brand').keydown(function (e){
        if (e.keyCode == 13){
            this.blur();
            return false;
        }
    }).change(function (e){
        if (!_selected || this.readonly || !this.value) return;
        modules.cars.changeData(_selected, 'brand', this.value);
    }).autocomplete({
        delay: 0,
        minLength: 0,
        source: function(search, showChoices) {
            var f = search.term.toLowerCase();
            showChoices(modules.cars.brands.filter(function (e){
                return e.toLowerCase().indexOf(f) === 0;
            }));
        }
    });

    $('#selected-car-class').keydown(function (e){
        if (e.keyCode == 13){
            this.blur();
            return false;
        }
    }).change(function (){
        if (!_selected || this.readonly) return;
        modules.cars.changeData(_selected, 'class', this.value);
    }).autocomplete({
        delay: 0,
        minLength: 0,
        source: function(search, showChoices) {
            var f = search.term.toLowerCase();
            showChoices(modules.cars.classes.filter(function (e){
                return e.toLowerCase().indexOf(f) === 0;
            }));
        }
    });

    [ 'bhp', 'torque', 'weight', 'topspeed', 'acceleration', 'pwratio' ].forEach(function (e){
        $('#selected-car-' + e).keydown(function (e){
            if (e.keyCode == 13){
                this.blur();
                return false;
            }
        }).change(function (){
            if (!_selected || this.readonly) return;
            modules.cars.changeDataSpecs(_selected, e, this.value);
        });
    });

    $('#selected-car-pwratio').dblclick(function (){
        if (!_selected || !_selected.data || this.readonly) return;
        var w = (_selected.data.specs.weight || '').match(/\d+/),
            p = (_selected.data.specs.bhp || '').match(/\d+/);
        if (w && p){
            modules.cars.changeDataSpecs(_selected, 'pwratio', (+w / +p).toFixed(2) + 'kg/cv');
        }
    });

    function getInputTags(){
        return [].map.call($('ul .tagit-label'), function (a){ return a.textContent });
    }

    $('#selected-car-tags').tagit({
        allowSpaces: true,
        autocomplete: { delay: 0, minLength: 1 },
        availableTags: modules.cars.tags,
        caseSensitive: false,
        removeConfirmation: true,

        afterTagAdded: function (){
            if (!_tagSkip){
                modules.cars.changeData(_selected, 'tags', getInputTags());
            }
        },
        afterTagRemoved: function (){
            if (!_tagSkip){
                modules.cars.changeData(_selected, 'tags', getInputTags());
            }
        }, 
    });

    /* previews */
    $('#selected-car-skins-article').dblclick(function (e){
        if (!_selected) return;
        modules.showroom.start(_selected);
    });

    /* skins changer */
    $('#selected-car-skins').click(function (e){
        if (!_selected) return;

        var id = e.target.getAttribute('data-id');
        if (!id) return;

        modules.cars.selectSkin(_selected, id);
    })

    /* bottom toolbar */
    $('main')
        .on('contextmenu', function (){
            $('footer').toggleClass('active'); 
            return false;
        });

    $('main footer')
        .click(function (e){
            if (e.target.tagName === 'BUTTON'){
                $('footer').removeClass('active');
            }
        });

    /* global hotkeys */
    $(window)
        .keydown(function (e){
            if (!_selected) return;

            if (e.keyCode == 83 && e.ctrlKey){
                /* Ctrl+S */
                modules.cars.save(_selected);
                return false;
            }
        });

    /* first row */
    $('#selected-car-open-directory').click(function (){
        if (!_selected) return;
        gui.Shell.openItem(_selected.path);
    });

    $('#selected-car-showroom').click(function (){
        if (!_selected) return;
        modules.showroom.start(_selected);
    });

    $('#selected-car-showroom-select').click(function (){
        if (!_selected) return;
        modules.showroom.select(_selected);
    });

    $('#selected-car-practice').click(function (){
        if (!_selected) return;
        modules.practice.start(_selected);
    });

    $('#selected-car-practice-select').click(function (){
        if (!_selected) return;
        modules.practice.select(_selected);
    });

    /* second row */
    $('#selected-car-disable').click(function (){
        if (!_selected) return;
        modules.cars.toggle(_selected);
    });

    $('#selected-car-update-previews').click(function (){
        if (!_selected) return;
        modules.showroom.shot(_selected);
    });

    $('#selected-car-update-previews-manual').click(function (){
        if (!_selected) return;
        modules.showroom.shot(_selected, true);
    });

    $('#selected-car-update-description').click(function (){
        if (!_selected) return;
        modules.updateDescription(_selected);
    });

    $('#selected-car-reload').click(function (){
        if (!_selected) return;

        if (_selected.changed){
            new Dialog('Reload', [
                '<p>{0}</p>'.format('Your changes will be lost. Are you sure?')
            ], reload);
        } else {
            reload();
        }

        function reload(){
            modules.cars.reload(_selected);
        }
    });

    $('#selected-car-save').click(function (){
        if (!_selected) return;
        modules.cars.save(_selected);
    });

    /* tips */
    outMsgTip();
    $('#details-message')
        .click(function (e){
            if (e.target.id == 'next-tip'){
                outMsgTip();
            }
        });

    return mediator.extend({
    });
}();