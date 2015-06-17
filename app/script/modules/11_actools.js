modules.__defineGetter__('acTools', function (){
    return modules.acTools = require('clr').init({
        assemblies: [ 'native/AcTools.dll' ],
        global: false
    }).AcTools;
});