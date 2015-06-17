modules.showroom = function (){
    function start(c, s){
        if (c.path.indexOf(modules.acDir.cars)) return;

        if (s == null){
            s = c.skins.selected.id;
        }

        modules.acTools.Processes.Showroom.Start(modules.acDir.root, c.id, s, 'showroom');
    }

    function shot(c, m){
        if (c.path.indexOf(modules.acDir.cars)) return;

        var output;
        try {
            output = modules.acTools.Processes.Showroom.Shot(modules.acDir.root, c.id, 150, -36, !!m);
        } catch (err){
            modules.errorHandler.handled('Cannot get previews, sorry.', err);
            return;
        }
        
        gui.Shell.openItem(output);
        new Dialog('Update Previews', [
            'New previews ready. Apply?'
        ], function (){
            modules.acTools.Utils.FileUtils.ApplyPreviews(modules.acDir.root, c.id, output);
            modules.cars.updateSkins(c);
            fs.rmdirSync(output);
        }, false).setButton('Yes').addButton('No');
    }

    return {
        start: start,
        shot: shot
    };
}();
