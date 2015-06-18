modules.practice = function (){
    var _tracks = null;

    function loadTracks(){
        _tracks = fs.readdirSync(modules.acDir.tracks).map(function (e){
            var p = path.join(modules.acDir.tracks, e);
            var d = null;
            var j = path.join(p, 'ui', 'ui_track.json');

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

        r = r || localStorage.lastTrack || 'spa';
        localStorage.lastTrack = r;

        try {
            modules.acTools.Processes.Game.StartPractice(modules.acDir.root, c.id, s, r.split('/')[0], r.split('/')[1] || '');
        } catch (e){
            modules.errorHandler.handled('Cannot start the game. Maybe there is not enough rights.');
        }
    }

    function select(c, s){
        if (!_tracks){
            loadTracks();
        }

        new Dialog('Track', [
            '<select>{0}</select>'.format(_tracks.map(function (e){
                return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
            }).join(''))
        ], function (){
            start(c, s, this.find('select').val());
        }).addButton('Reload List', function (){
            setTimeout(function (){
                loadTracks();
                select(c, s);
            });
        }).find('select').val(localStorage.lastTrack || 'spa').change(function (){
            localStorage.lastTrack = this.value;
        });
    }

    return {
        start: start,
        select: select
    };
}();
