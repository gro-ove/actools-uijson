modules.viewNewVersion = function (){
    var _upd, _inf;
    var _autoinstall = true;

    function newVersion(inf){
        _inf = inf;

        var d = new Dialog('New Version', [
            'Current version: {0}'.format(gui.App.manifest.version),
            'New version: {0}'.format(inf.actualVersion),
            inf.changelog && 'Changelog:<br><ul><li>{0}</li></ul>'.format(
                inf.changelog.map(function (e){
                    return '<div>' + e.version + '</div><ul><li>' + e.changes.join('</li><li>') + '</li></ul>';
                }).join('</li><li>')
            ),
        ], function (){
            gui.Shell.openItem(inf.detailsUrl);
            return !inf.downloadUrl && !inf.installUrl;
        }, false).setButton('Details');

        if (inf.installUrl){
            d.addButton('Install', function (){
                modules.checkUpdate.install(inf.installUrl);
            });
        } else if (inf.downloadUrl){
            d.addButton('Download', function (){
                gui.Shell.openItem(inf.downloadUrl);
            });
        }

        d.addButton('Later');
    }

    function installStart(){
        _upd = new Dialog('Installation', [
            '<progress indeterminate></progress>'
        ], function (){
            modules.checkUpdate.abort();
        }, false).setButton('Abort');
    }

    function installProgress(value, max){
        if (!_upd) installStart();
        _upd.find('progress').attr({
            max: max,
            value: value
        });
    }

    function installReady(){
        if (_autoinstall){
            modules.checkUpdate.autoupdate();
        } else {
            if (!_upd) installStart();
            _upd.setContent('Update ready. Application will be restarted.');
            _upd.setButton('Install', function (){
                modules.checkUpdate.autoupdate();
            }).addButton('Later');
        }
    }

    function installInterrupt(){
        if (!_upd) return;
        _upd.close();
        _upd = null;
    }

    function installFailed(e){
        if (!_upd) installStart();
        _upd.setContent('Update failed: {0}.'.format(e));
        _upd.setButton('Nevermind', function (){}).addButton('Manual Update', function (){
            gui.Shell.openItem(_inf.downloadUrl || _inf.detailsUrl);
        });
    }

    function autoupdateFailed(e){
        modules.errorHandler.handled('Autoupdate failed.', e);
    }

    modules.checkUpdate
        .on('update', newVersion)
        .on('install:start', installStart)
        .on('install:progress', installProgress)
        .on('install:ready', installReady)
        .on('install:interrupt', installInterrupt)
        .on('install:failed', installFailed)
        .on('autoupdate:failed', autoupdateFailed);

    return {};
}();