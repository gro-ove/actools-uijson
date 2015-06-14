/* modules */
    modules = {};

/* helpers */
    String.prototype.cssUrl = function (){
        return 'file://' + this.replace(/\\/g, '/');
    }