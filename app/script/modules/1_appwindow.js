modules.appWindow = function (){
    var mediator = new Mediator();

    $('#window-close').click(function (){
        nwWindow.close();
    });

    $('#window-minimize').click(function (){
        nwWindow.minimize();
    });

    var maximized = false;
    $('#window-maximize').click(function (){
        if (maximized){
            nwWindow.unmaximize();
        } else {
            nwWindow.maximize();
        }
    });

    nwWindow.on('maximize', function() {
        maximized = true;
        $('#window-maximize').text('↓');
        $('body').addClass('maximized');
    });

    nwWindow.on('unmaximize', function() {
        maximized = false;
        $('#window-maximize').text('□');
        $('body').removeClass('maximized');
    });

    $('body').mousemove(function (e){
        $('#window-drag').toggleClass('active', /MAIN|ASIDE/.test(e.target.tagName) && e.pageY < 20);
    });

    var _defTitle = gui.App.manifest.name;
    function setTitle(t){
        $('#window-title').text(t ? '{0} - {1}'.format(t, _defTitle) : _defTitle);
    }

    return mediator.extend({
        set title(v){
            setTitle(v);
        },
    });
}();