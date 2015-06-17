modules.viewList = function (){
    var mediator = new Mediator();

    var _selected, _node = $(document.getElementById('cars-list'));

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

    modules.acDir
        .on('change', function (){
            modules.appWindow.title = modules.acDir.root;
        });

    modules.cars
        .on('scan:start', function (){
            $('#cars-list').empty();
        })
        .on('scan:list', function (list){
            $('#total-cars').val(list.length);

            if (list.length > 0){
                select(list[0])
            }
        })
        .on('new:car', function (car){
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

            if (this.value){
                $('#cars-list > div').hide();
                $('#cars-list > div > [data-id*="' + this.value + '"],\
                    #cars-list > div > [data-name*="' + this.value.toLowerCase() + '"]').parent().show();
            } else {
                $('#cars-list > div').show();
            }
        })
        .on('blur', function (){ 
            if (!this.value){
                $(this).hide();
            }
        });

    $(window)
        .keypress(function (e){
            if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.target.contentEditable === 'true') return;

            var f = $('#cars-list-filter').show();
            f[0].focus();
        });

    $('#cars-list').click(function (e){
        var car = modules.cars.byName(e.target.getAttribute('data-id'));
        if (!car) return;
        select(car);
    });

    return mediator.extend({
    });
}();