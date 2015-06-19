modules.viewSettings = function (){
    var mediator = new Mediator();

    function openDialog(){
        var d = new Dialog('Settings', [
            '<h6>AC Root Directory</h6>',
            '<button id="settings-acdir-select" style="float:right;width:30px">…</button>',
            '<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">',

            '<h6>Tips</h6>',
            '<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>',
        ], function (){
            if (acdirVal === false) return false;

            if (acdirVal != null){
                modules.acDir.set(acdirVal);
            }

            modules.settings.update(function (s){
                if (disableTips != null) s.disableTips = disableTips; 
            });
        }, false).setButton('Save').addButton('Cancel');

        var acdirVal;
        function acdirChange(){
            var err = modules.acDir.check(acdirVal = d.find('#settings-acdir').val());
            $(this).toggleClass('invalid', !!err).attr('title', err || null);
            if (err){
                acdirVal = false;
            }
        }

        d.find('#settings-acdir').val(modules.acDir.root).change(acdirChange);

        d.find('#settings-acdir-select').click(function (){
            $('<input type="file" nwdirectory />').attr({
                nwworkingdir: d.find('#settings-acdir').val()
            }).change(function (){
                d.find('#settings-acdir').val(this.value);
                acdirChange();
            }).click();
        });

        var disableTips;
        d.find('#settings-disable-tips').change(function (){
            disableTips = this.checked;
        })[0].checked = modules.settings.get('disableTips');
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