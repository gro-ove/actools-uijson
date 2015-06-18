modules.viewSettings = function (){
    var mediator = new Mediator();

    function openDialog(){
        new Dialog('Settings', [
            'Hello World!'
        ], function (){
            
        }, false).setButton('Close');
    }

    function init(){
        $('#settings-open')
            .click(openDialog);
    }

    init();
    return mediator.extend({
        // get obj (){ return _settings; },
    });
}();