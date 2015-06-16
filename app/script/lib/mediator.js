function _splitAndCall(type, fn, arg){
    if (Array.isArray(type)){
        for (var i = 0; i < type.length; i++){
            fn.call(this, type[i], arg);
        }
    } else if (type.indexOf (' ') !== -1){
        type = type.split(' ');
        for (var i = 0; i < type.length; i++){
            fn.call(this, type[i], arg);
        }
    } else {
        fn.call(this, type, arg);
    }
}

function _call(type, entry, array){
    try {
        return entry.callback.apply(null, array);
    } catch (e){
        console.warn(e.stack);
        
        if (typeof Mediator.errorHandler === 'function'){
            try {
                Mediator.errorHandler(e);
            } catch (e){}
        }
    }
}

function _on(type, entry){
    console.assert(type && typeof type === 'string' && typeof entry.callback === 'function', 'Wrong arg');
    
    var added = false;
    this.dispatch('register:' + type, function (){
        var l = arguments.length, array = new Array(l + 1);
        for (var i = 0; i < l; i++){
            array[i] = arguments[i];
        }
        array[l] = type;
        
        // entry.callback.apply (null, array);
        _call.call(this, type, entry, array);
        
        if (!entry.one){
            return;
        }
        
        if (added){
            this.off(type, entry.callback);
        } else {
            this.dispatch('unregister:' + type);
            entry = null;
        }
    });
    
    if (entry === null){
        return;
    } else {
        added = true;
    }
    
    if (this.listeners.hasOwnProperty(type)){
        var array = this.listeners[type];
        
        for (var i = 0; i < array.length; i++){
            if (array[i] === null){
                array[i] = entry;
                return;
            }
        }
        
        this.listeners[type].push(entry);
    } else {
        this.listeners[type] = [ entry ];
    }
}

function _offCallback(callback){
    for (var type in this.listeners){
        var array = this.listeners[type];

        for (var i = 0; i < array.length; i++){
            if (array[i] !== null && array[i].callback === callback){
                this.dispatch('unregister:' + type);
                array[i] = null;
            }
        }
    }
}

function _offType(type, callback){
    console.assert (typeof callback === 'function', 'Wrong arg');
    
    if (this.listeners.hasOwnProperty(type)){
        var array = this.listeners[type];

        for (var i = 0; i < array.length; i++){
            if (array[i] !== null && array[i].callback === callback){
                this.dispatch('unregister:' + type);
                array[i] = null;
            }
        }
    }
}

function _dispatch(type, args){
    if (this.listeners.hasOwnProperty(type)){
        var array = this.listeners[type];

        for (var i = 0; i < array.length; i++){
            var entry = array[i];

            if (entry !== null){
                if (entry.one){
                    this.dispatch ('unregister:' + type);
                    array[i] = null;
                }

                // array[i].callback.apply (null, array);
                _call.call(this, type, entry, args);
            }
        }
    }
}

var Mediator = function() {
    this.listeners = {};
};

Mediator.prototype.on = function (type, callback){
    if (typeof type === 'object' && !Array.isArray(type)){
        for (var k in type){
            this.on(k, type[k]);
        }
    } else {
        _splitAndCall.call(this, type, _on, { callback: callback });
    }
    return this;
};

Mediator.prototype.one = function (type, callback){
    if (typeof type === 'object' && !Array.isArray(type)){
        for (var k in type){
            this.one(k, type[k]);
        }
    } else {
        _splitAndCall.call(this, type, _on, { callback: callback, one: true });
    }
    return this;
};

Mediator.prototype.off = function (type, callback){
    if (typeof type === 'function'){
        _offCallback.call(this, type);
    } else {
        _splitAndCall.call(this, type, _offType, callback);
    }
    return this;
};

Mediator.prototype.dispatch = function (type){
    var args = new Array(arguments.length);
    for (var i = 1; i < args.length; i ++){
        args[i - 1] = arguments[i];
    }
    args[args.length - 1] = type;
    
    _dispatch.call(this, type, args);
    for (var index = type.lastIndexOf(':'); index !== -1; index = type.lastIndexOf(':', index - 1))
        _dispatch.call(this, type.substr(0, index), args);
    
    return this;
};

Mediator.prototype.extend = function (obj){
    if (obj.on === undefined){
        obj.on = this.on.bind(this);
    }

    if (obj.one === undefined){
        obj.one = this.one.bind(this);
    }

    if (obj.off === undefined){
        obj.off = this.off.bind(this);
    }

    return obj;
};

Mediator.prototype.debug = function (arg){
    var result = {};
    for (var key in this.listeners){
        var filtered = this.listeners[key].filter(function(a){ 
            return a;
        });

        if (typeof arg === 'string' && key !== arg && !key.startsWith(arg + ':')){
            continue;
        }

        result [key] = {
            'Listeners':            filtered.length,
            'First listener at':    filtered.length > 0 ? filtered [0].callback.location () : '–',
            'Allocated':            this.listeners[key].length 
        };
    }

    console.table(result);
    return this;
};

Mediator.test = function (){
    var m = new Mediator(),
        c;
    m.on('register', function (){
        console.log('REGISTERED', arguments);
    });
    m.on('unregister', function (){
        console.log('UNREGISTERED', arguments);
    });
    m.on('a', c = function (){
        console.log('A', arguments);
    });
    m.on('b', function (){
        console.log('B', arguments);
    });
    m.on('a:b', function (){
        console.log('A:B', arguments);
    });
    m.one('a:b:c', function (){
        console.log('A:B:C', arguments);
    });
    console.info('a:b, 15');
    m.dispatch('a:b', 15);
    console.info('a:b:c, 16');
    m.dispatch('a:b:c', 16);
    console.info('a:b:c, 17');
    m.dispatch('a:b:c', 17);
    console.info('b, 18');
    m.dispatch('b', 18);
    console.info('a:b, 19');
    m.dispatch('a:b', 19);
    console.info('off');
    m.off(c);
    console.info('a:b, 20');
    m.dispatch('a:b', 20);
    return m;
};

(typeof module == 'object' ? module.exports : window).Mediator = Mediator;