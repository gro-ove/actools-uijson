modules.viewDetails = function (){
    var mediator = new Mediator();

    var _selected;

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
            he.attr('contenteditable', true).text(car.data.name);
            de.attr('contenteditable', true).text(car.data.description);
            ta.show();
        } else {
            he.removeAttr('contenteditable').text(car.id);
            de.removeAttr('contenteditable').text(car.data == null ? 'Loading...' : '');
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
                    'data-skin': car.skins[0].name,
                    'src': car.skins[0].preview.cssUrl()
                });

                car.skins.slice(1).forEach(function (e){
                    $('<img>').attr({
                        'data-skin': e.name,
                        'src': e.preview.cssUrl()
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

    /* bottom toolbar */
    $(window)
        .on('contextmenu', function (){
            $('footer').toggleClass('active'); 
        });

    $('#selected-car-disable').click(function (){
        modules.cars.toggle(_selected);
    });

    $('#selected-car-open-directory').click(function (){
        gui.Shell.openItem(_selected.path);
    });

    $('#selected-car-update-description').click(function (){
        modules.updateDescription(_selected);
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