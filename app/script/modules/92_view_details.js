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
            ta = $('#selected-car-tags');
        if (car.data){
            he.attr('contenteditable', true);
            de.removeAttr('readonly');

            _tagSkip = true;
            ta.show().tagit('removeAll');
            car.data.tags.forEach(function (e){
                ta.tagit('createTag', e);
            });
            _tagSkip = false;

            if (car.data.name != he.text()){
                he.text(car.data.name);
            }

            if (car.data.description != de.val()){
                de.val(car.data.description).elastic();
            }
        } else {
            he.removeAttr('contenteditable').text(car.id);
            de.attr('readonly', true).val(car.data == null ? 'Loading...' : '').elastic();
            ta.hide();
        }
    }

    function outDisabled(car){
        $('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');
        $('#selected-car-header').toggleClass('disabled', car.disabled)
    }

    function outChanged(car){
        $('#selected-car').toggleClass('changed', car.changed)
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
    $('#selected-car').on('keydown input', function (e){
        if (e.keyCode == 13){
            this.blur();
            return false;
        }

        this.textContent = this.textContent.slice(0, 64);

        if (!_selected || this.contentEditable != 'true') return;
        modules.cars.changeData(_selected, 'name', this.textContent);
    });

    $('#selected-car-desc').elastic().change(function (){
        if (!_selected || this.readonly) return;
        modules.cars.changeData(_selected, 'description', this.value);
    });

    function getInputTags(){
        return [].map.call($('ul .tagit-label'), function (a){ return a.textContent });
    }

    $('#selected-car-tags').tagit({
        availableTags: modules.cars.tags,
        autocomplete: { delay: 0, minLength: 1, allowSpaces: true },
        removeConfirmation: true,
        caseSensitive: false,

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

    /* first row */
    $('#selected-car-open-directory').click(function (){
        if (!_selected) return;
        gui.Shell.openItem(_selected.path);
    });

    $('#selected-car-showroom').click(function (){
        if (!_selected) return;
        modules.showroom.start(_selected);
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