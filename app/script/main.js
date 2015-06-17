modules.checkUpdate
    .on('update', function (version, detailsUrl, downloadUrl){
        var d = new Dialog('New Version', [
            'Current version: {0}'.format(gui.App.manifest.version),
            'New version: {0}'.format(version),
        ], function (){
            gui.Shell.openItem(detailsUrl);
            return !downloadUrl;
        }, false).setButton('Details');

        if (downloadUrl){
            d.addButton('Download', function (){
                gui.Shell.openItem(downloadUrl);
            });
        }

        d.addButton('Later');
    });

modules.acDir
    .on('change', function (){
        modules.cars.scan();
    });

modules.acDir.init();