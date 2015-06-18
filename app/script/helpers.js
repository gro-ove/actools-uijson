/* modules */
    modules = {};

/* helpers */
    Object.clone = function (o){
        if (Array.isArray(o)){
            return o.map(Object.clone);
        } else if (o && typeof o === 'object'){
            var r = {};
            for (var n in o){
                r[n] = Object.clone(o[n]);
            }
            return r;
        } else {
            return o;
        }
    }

    String.prototype.cssUrl = function (){
        return 'file://' + this.replace(/\\/g, '/');
    }