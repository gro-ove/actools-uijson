modules.errorHandler = function (){
    process.on('uncaughtException', function (err) {
        new Dialog('Oops!', [
            '<p>Uncaught exception, sorry.</p>',
            '<pre>' + err.stack + '</pre>'
        ], function (){
            nwWindow.reloadDev();
        }, function (){
            return false;
        }).find('button').text('Restart');
    });

    function handled(msg, err){
        new Dialog('Oops!', [
            '<p>' + msg + '</p>',
            err ? '<pre>' + err.stack + '</pre>' : null
        ]);
    }

    Mediator.errorHandler = function (err){
        handled('Listener exception', err);
    };

    return {
        handled: handled
    };
}();