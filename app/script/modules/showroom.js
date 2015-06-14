modules.showroom = function (){
    function start(c, s){
        if (c.path.indexOf(acCarsDir)) return;

        
    }

    console.time('CLR');
    console.warn(modules.clr.get(function (){/*
        AcTools.FileUtils.GetDocumentsFolder()
    */}));

    console.timeEnd('CLR');

    return {
        start: start
    };
}();