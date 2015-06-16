modules.viewList = function (){
    var mediator = new Mediator();

    var _selected;

    function select(car){
        _selected = car;
        $('#cars-list > span.selected').removeClass('selected');

        if (car){
            $('#cars-list > [data-id="' + car.id + '"]').addClass('selected');
        }

        mediator.dispatch('select', car);
    }

    modules.acDir
        .on('change', function (){
            $('title').text('{0} - AcTools Ui Json'.format(modules.acDir.root));
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

            document.getElementById('cars-list').appendChild(s);
        })
        .on('update:car:data', function (car){
            var n = car.data && car.data.name || car.id;
            $('#cars-list > [data-id="' + car.id + '"]')
                .text(n).attr('data-name', n.toLowerCase());
        })
        .on('update:car:path', function (car){
            $('#cars-list > [data-id="' + car.id + '"]')
                .attr('data-path', car.path);
        })
        .on('update:car:disabled', function (car){
            $('#cars-list > [data-id="' + car.id + '"]')
                .toggleClass('disabled');
        })
        .on('error', function (car){
            $('#cars-list > [data-id="' + car.id + '"]').addClass('error');
        });

    $('#cars-list-filter')
        .on('change paste keyup keypress search', function (){
            var v = $('#cars-list-filter').val();
            if (v){
                $('#cars-list > span').hide();
                $('#cars-list > [data-id*="' + v + '"],\
                    #cars-list > [data-name*="' + v.toLowerCase() + '"]').show();
            } else {
                $('#cars-list > span').show();
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