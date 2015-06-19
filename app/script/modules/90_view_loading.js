modules.viewLoading = function (){
    var mediator = new Mediator();

    var _node = document.getElementById('loading'),
        _h4 = _node.querySelector('h4'),
        _progress = _node.querySelector('progress'),
        _interval = null,
        _dots;

    function init(){
        modules.cars
            .on('scan:start', function (){
                clearInterval(_interval);
                _node.style.display = null;
                _dots = 0;
                _interval = setInterval(function (){
                    _h4.textContent = 'Please wait' + '...'.slice(0, 1 + _dots++ % 3);
                }, 300);
            })
            .on('scan:list', function (list){
                _node.querySelector('h6').textContent = 'Car{0} found: {1}'.format(list.length == 1 ? '' : 's', list.length);
                _progress.indeterminate = false;
                _progress.max = list.length;
            })
            .on('scan:progress', function (i, m){
                _progress.value = i;
            })
            .on('scan:ready', function (list){
                clearInterval(_interval);
                _node.style.display = 'none';
            });
    }

    init();
    return mediator.extend({
    });
}();