modules.showroom = function (){
    var _showrooms = null;

    function loadShowrooms(){
        _showrooms = fs.readdirSync(modules.acDir.showrooms).map(function (e){
            var p = path.join(modules.acDir.showrooms, e);
            var d = null;
            var j = path.join(p, 'ui', 'ui_showroom.json');

            if (fs.existsSync(j)){
                try {
                    d = JSON.parse(fs.readFileSync(j));
                } catch (e){}
            }

            return {
                id: e,
                data: d,
                path: p,
                json: j,
            }
        }).filter(function (e){
            return e;
        });
    }

    function start(c, s, r){
        if (c.path.indexOf(modules.acDir.cars)) return;

        if (s == null){
            s = c.skins.selected.id;
        }

        r = r || localStorage.lastShowroom || 'showroom';
        try {
            modules.acTools.Processes.Showroom.Start(modules.acDir.root, c.id, s, r);
        } catch (err){
            modules.errorHandler.handled('Cannot start showroom. Maybe there is not enough rights or the car is broken.');
            return;
        }
        localStorage.lastShowroom = r;
    }

    function select(c, s){
        if (!_showrooms){
            loadShowrooms();
        }

        new Dialog('Showroom', [
            '<select>{0}</select>'.format(_showrooms.map(function (e){
                return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
            }).join(''))
        ], function (){
            start(c, s, this.find('select').val());
        }).addButton('Reload List', function (){
            setTimeout(function (){
                loadShowrooms();
                select(c, s);
            });
        }).find('select').val(localStorage.lastShowroom || 'showroom').change(function (){
            localStorage.lastShowroom = this.value;
        });
    }

    function shot(c, m){
        if (c.path.indexOf(modules.acDir.cars)) return;

        // http://www.racedepartment.com/downloads/studio-black-showroom.4353/download?version=6612

        var output;
        try {
            output = modules.acTools.Processes.Showroom.Shot(modules.acDir.root, c.id, 150, -36, !!m);
        } catch (err){
            modules.errorHandler.handled('Cannot get previews. Maybe process was terminated, there is not enough rights or the car is broken.');
            return;
        }
        
        gui.Shell.openItem(output);
        new Dialog('Update Previews', [
            'New previews ready. Apply?'
        ], function (){
            modules.acTools.Utils.ImageUtils.ApplyPreviews(modules.acDir.root, c.id, output);
            modules.cars.updateSkins(c);
            fs.rmdirSync(output);
        }, false).setButton('Yes').addButton('No');
    }

    return {
        start: start,
        select: select,
        shot: shot
    };
}();
