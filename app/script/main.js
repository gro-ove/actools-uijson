modules.acDir
    .on('change', function (){
        modules.cars.scan();
    });

modules.acDir.init();