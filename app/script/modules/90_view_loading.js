modules.viewLoading = function (){
    var mediator = new Mediator();

    var _node = $(document.getElementById('loading')),
        _interval = null,
        _dots;

    function init(){
        modules.cars
            .on('scan:start', function (){
                clearInterval(_interval);
                _node.show();
                _dots = 0;
                _interval = setInterval(function (){
                    _node.find('h4').text('Please wait' + '...'.slice(0, 1 + _dots++ % 3));
                }, 300);
            })
            .on('scan:list', function (list){
                _node.find('h6').text('Car{0} found: {1}'.format(list.length == 1 ? '' : 's', list.length));
            })
            .on('scan:ready', function (list){
                clearInterval(_interval);
                _node.hide();
            });
    }

    init();
    return mediator.extend({
    });
}();