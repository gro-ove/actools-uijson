if (modules.settings.get('updatesCheck', true)){
    setTimeout(function (){
        modules.checkUpdate.check();
    }, 5e1);
}

modules.viewList
    .on('select', function (car){
        modules.appWindow.title = car.data ? car.data.name : car.id;
    });

modules.cars
    .on('update:car:data', function (car){
        if (car === modules.viewList.selected){
            modules.appWindow.title = car.data ? car.data.name : car.id;
        }
    });

var first = true;
modules.acDir
    .on('change', function (){
        modules.cars.scan();

        if (first && !modules.settings.get('disableTips', false)){
            new Dialog('Tip', [
                modules.tips.next
            ], function (){
                this.find('p').html(modules.tips.next);
                this.find('h4').text('Another Tip');
                return false;
            }).setButton('Next').addButton('Disable Tips', function (){
                modules.settings.set('disableTips', true);
            }).find('p').css('maxWidth', 400);

            first = false;
        }
    });

modules.acDir.init();