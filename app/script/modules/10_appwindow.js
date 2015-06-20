modules.appWindow = function (){
    var mediator = new Mediator();

    var _defTitle, _maximized;

    function setTitle(t){
        $('#window-title').text(t ? '{0} - {1}'.format(t, _defTitle) : _defTitle);
    }

    function init(){
        _defTitle = gui.App.manifest.name;
        _maximized = false;

        nwWindow
            .on('close', function (){
                close(false);
            });

        nwWindow
            .on('maximize', function() {
                _maximized = true;
                $('#window-maximize').text('↓');
                $('body').addClass('maximized');
            });

        nwWindow
            .on('unmaximize', function() {
                _maximized = false;
                $('#window-maximize').text('□');
                $('body').removeClass('maximized');
            });

        $('#window-close')
            .click(function (){
                close();
            });

        $('#window-minimize')
            .click(function (){
                nwWindow.minimize();
            });

        $('#window-maximize')
            .click(function (){
                if (_maximized){
                    nwWindow.unmaximize();
                } else {
                    nwWindow.maximize();
                }
            });

        $(document.body)
            .mousemove(function (e){
                $('#window-drag').toggleClass('active', /MAIN|ASIDE/.test(e.target.tagName) && e.pageY < 20);
            });
    }

    function close(force){
        if (force){
            nwWindow.close(true);
        } else {
            mediator.dispatch('close');
        }
    }

    init();
    setTitle();

    return mediator.extend({
        close: close,

        set title(v){
            setTitle(v);
        },
    });
}();