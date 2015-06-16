modules.showroom = function (){
    function start(c, s){
        if (c.path.indexOf(modules.acDir.cars)) return;

        if (s == null){
            s = c.skins.selected.id;
        }

        acTools.Processes.Showroom.Start(modules.acDir.root, c.id, s, 'showroom');
    }

    function shot(c){
        if (c.path.indexOf(modules.acDir.cars)) return;

        var output;
        try {
            output = acTools.Processes.Showroom.Shot(modules.acDir.root, c.id, 200, -20);
        } catch (err){
            new Dialog('Oops!', [
                '<p>Cannot get previews, sorry.</p>',
                '<pre>' + err + '</pre>'
            ]);

            return;
        }
        
        gui.Shell.openItem(output);
        new Dialog('Update Previews', [
            '<p>New previews ready. Apply?</p>'
        ], function (){
            acTools.FileUtils.ApplyPreviews(modules.acDir.root, c.id, output);
            display(selected);
        }).find('button').text('Apply');;
    }

    return {
        start: start,
        shot: shot
    };
}();
