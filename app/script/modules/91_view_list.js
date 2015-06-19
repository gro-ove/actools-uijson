modules.viewList = function (){
    var mediator = new Mediator();

    var _selected,
        _node = $(document.getElementById('cars-list'));

    function select(car){
        _selected = car;
        _node.find('.expand').removeClass('expand');
        _node.find('.selected').removeClass('selected');

        if (car){
            _node.find('[data-id="' + car.id + '"]').addClass('expand').parent().addClass('selected');

            if (car.parent){
                _node.find('[data-id="' + car.parent.id + '"]').addClass('expand');
            }
        }

        mediator.dispatch('select', car);
    }

    function filter(v){
        var i = $('#cars-list-filter')[0];
        if (i.value != v){
            i.value = v;
        }

        if (v){
            var s = v.trim().split(/\s+/);
            var bb = '';

            var vv = s.filter(function (e){
                if (/^brand:(.*)/.test(e)){
                    bb = (bb && bb + '|') + RegExp.$1;
                    return false;
                }

                return true;
            });

            var r = RegExp.fromQuery(vv.join(' '));
            var b = bb && RegExp.fromQuery(bb, true); 

            var f = function (c){
                if (b && (!c.data || !b.test(c.data.brand))) return false;
                return r.test(c.id) || c.data && r.test(c.data.name);
            };

            $('#cars-list > div > [data-id]').each(function (){
                this.parentNode.style.display = f(modules.cars.byName(this.getAttribute('data-id'))) ? null : 'none';
            });
        } else {
            $('#cars-list > div').show();
        }
    }

    function init(){
        modules.cars
            .on('scan:start', function (){
                $('#cars-list').empty();
            })
            .on('scan:ready', function (list){
                $('#total-cars').val(list.filter(function (e){
                    return e.parent == null;
                }).length).attr('title', 'Including modded versions: {0}'.format(list.length));

                if (list.length > 0){
                    select(list[0])
                }

                $('aside').show();
            })
            .on('new.car', function (car){
                var s = document.createElement('span');
                s.textContent = car.id;
                if (car.disabled) s.classList.add('disabled');

                s.setAttribute('title', car.path);
                s.setAttribute('data-id', car.id);
                s.setAttribute('data-name', car.id);
                s.setAttribute('data-path', car.path);

                var d = document.createElement('div');
                d.appendChild(s);

                if (car.children.length > 0){
                    d.setAttribute('data-children', car.children.length + 1);
                }

                _node[0].appendChild(d);
            })
            .on('update:car:data', function (car){
                var n = car.data && car.data.name || car.id;
                _node.find('[data-id="' + car.id + '"]')
                    .text(n).attr('data-name', n.toLowerCase());

                filter($('#cars-list-filter').val());
            })
            .on('update:car:parent', function (car){
                var d = _node.find('[data-id="' + car.id + '"]').parent();
                if (car.error.length > 0){
                    var c = d.parent();
                    if (c[0].tagName === 'DIV' && c.find('.error').length == 1){
                        c.removeClass('error');
                    }
                }

                if (car.parent){
                    var p = _node.find('[data-id="' + car.parent.id + '"]').parent();
                    d.appendTo(p);
                    if (d.hasClass('error')){
                        d.removeClass('error');
                        p.addClass('error');
                    }
                } else {
                    // TODO: Sort?
                    d.appendTo(_node);
                }
            })
            .on('update:car:children', function (car){
                _node.find('[data-id="' + car.id + '"]').parent()
                    .attr('data-children', car.children.length ? car.children.length + 1 : null);
            })
            .on('update:car:path', function (car){
                _node.find('[data-id="' + car.id + '"]')
                    .attr('data-path', car.path);
            })
            .on('update:car:disabled', function (car){
                _node.find('[data-id="' + car.id + '"]')
                    .toggleClass('disabled', car.disabled);
            })
            .on('update:car:changed', function (car){
                _node.find('[data-id="' + car.id + '"]')
                    .toggleClass('changed', car.changed);
            })
            .on('error', function (car){
                _node.find('[data-id="' + car.id + '"]').toggleClass('error', car.error.length > 0)
                    .closest('#cars-list > div').toggleClass('error', car.error.length > 0);
            });

        $('#cars-list-filter')
            .on('change paste keyup keypress search', function (e){
                if (e.keyCode == 27){
                    this.value = '';
                    this.blur();
                }

                filter(this.value);
            })
            .on('blur', function (){ 
                if (!this.value){
                    $(this).hide();
                }
            });

        $(window)
            .keypress(function (e){
                if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.target.contentEditable === 'true') return;
                if (e.ctrlKey || e.altKey || e.shiftKey) return;

                var f = $('#cars-list-filter').show();
                f[0].focus();
            });

        $('#cars-list').click(function (e){
            var car = modules.cars.byName(e.target.getAttribute('data-id'));
            if (!car) return;
            select(car);
        });
    }

    init();
    return mediator.extend({
        get selected (){ return _selected; }
    });
}();