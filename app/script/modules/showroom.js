modules.showroom = function (){
    function start(c, s){
        if (c.path.indexOf(acCarsDir)) return;

        acTools.Processes.Showroom.Start(acDir, c.name, s, 'showroom');
    }

    function shot(c){
        if (c.path.indexOf(acCarsDir)) return;

        var output;
        try {
            output = acTools.Processes.Showroom.Shot(acDir, c.name, 200, -20);
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
            acTools.FileUtils.ApplyPreviews(acDir, c.name, output);
            display(selected);
        }).find('button').text('Apply');;
    }

    return {
        start: start,
        shot: shot
    };
}();
