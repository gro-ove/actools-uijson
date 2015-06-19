modules.acDir = function (){
    var mediator = new Mediator();

    var _root, _cars, _carsOff, _tracks, _showrooms;

    function check(d){
        if (!fs.existsSync(d)){
            return 'Directory not found';
        }

        if (!fs.existsSync(path.join(d, 'content', 'cars'))){
            return 'Directory content/cars not found';
        }
    }

    function set(d){
        if (_root == d) return;

        _root = d;

        _cars = path.join(d, 'content', 'cars');
        _carsOff = path.join(d, 'content', 'cars-off');
        if (!fs.existsSync(_carsOff)){
            fs.mkdirSync(_carsOff);
        }

        _tracks = path.join(d, 'content', 'tracks');
        _showrooms = path.join(d, 'content', 'showroom');

        localStorage.acRootDir = d;

        mediator.dispatch('change', _root);
    }

    function init(c){
        function ready(d){
            var err = check(d);
            if (err){
                return prompt(err);
            } else {
                set(d);
            }
        }

        function prompt(e){
            var dialog = new Dialog('Cars Directory', [
                e && '<p class="error">' + e + '</p>',
                '<button id="select-dir" style="float:right;width:30px">…</button>',
                '<input placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">',
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

    return mediator.extend({
        init: init,
        check: check,
        set: set,

        get root(){ return _root },
        get cars(){ return _cars },
        get carsOff(){ return _carsOff },
        get tracks(){ return _tracks },
        get showrooms(){ return _showrooms },
    });
}();