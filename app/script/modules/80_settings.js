modules.settings = function (){
    var mediator = new Mediator();

    var _settings;

    function init(){
        _settings = {};

        try {
            _settings = JSON.parse(localStorage.settings) || {};
        } catch (e){}
    }

    function get(k, def){
        return _settings.hasOwnProperty(k) ? _settings[k] : def;
    }

    function set(k, val){
        if (typeof k == 'object'){
            for (var n in k){
                _settings[n] = k[n];
            }
        } else {
            _settings[k] = val;
        }

        save();
    }

    function update(f){
        f(_settings);
        save();
    }

    function save(){
        localStorage.settings = JSON.stringify(_settings);
    }

    init();
    return mediator.extend({
        get: get,
        set: set,
        update: update,
        save: save,

        // get obj (){ return _settings; },
    });
}();