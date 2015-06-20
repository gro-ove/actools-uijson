modules.viewSettings = function (){
    var mediator = new Mediator();

    function openDialog(){
        var d = new Dialog('Settings', [
            '<h6>AC Root Directory</h6>',
            '<button id="settings-acdir-select" style="float:right;width:30px">…</button>',
            '<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">',

            '<h6>Tips</h6>',
            '<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>',

            '<h6>Updates</h6>',
            '<label><input id="settings-updates-check" type="checkbox">Check for new versions on launch</label>',
            '<select id="settings-updates-source"><option value="last">Last</option><option value="stable">Stable</option></select>',

            /*'<h6>Search Provider</h6>',
            '<label><select id="settings-search-provider"><option value="google"></option></select>',*/
        ], function (){
            if (acdirVal === false) return false;

            if (acdirVal != null){
                modules.acDir.set(acdirVal);
            }

            modules.settings.update(function (s){
                s.disableTips = disableTips;
                s.updatesCheck = updatesCheck;
                s.updatesSource = updatesSource;
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

        var disableTips = modules.settings.get('disableTips', false);
        d.find('#settings-disable-tips').change(function (){
            disableTips = this.checked;
        })[0].checked = disableTips;

        var updatesCheck = modules.settings.get('updatesCheck', true);
        d.find('#settings-updates-check').change(function (){
            updatesCheck = this.checked;
        })[0].checked = updatesCheck;

        var updatesSource = modules.settings.get('updatesSource', 'stable');
        d.find('#settings-updates-source').change(function (){
            updatesSource = this.value;
        })[0].value = updatesSource;

        d.addTab('About', [
            '<h6>Version</h6>',
            gui.App.manifest.version,
            '<h6>Author</h6>',
            'x4fab',
        ]).addButton('Check for update', function (){
            modules.checkUpdate.check();
            return false;
        });
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