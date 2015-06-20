modules.upgradeEditor = function (){
    var _sizes = {
        0: 15,
        1: 15,
        2: 15,
        3: 14,
        4: 12,
        5: 11,
        6: 10,
        7: 9,
        8: 8
    }

    function fontSize(l){
        return _sizes[l] || 7;
    }

    function updateStyle(e){
        var s = fontSize(e.textContent.length);
        e.style.fontSize = s + 'px';
        e.style.marginTop = (15 - s) / 4 + 'px';
    }

    function focus(e){
        if (!e) return;
        e.focus();
        document.execCommand('selectAll', false, null);
    }

    function editable(label){
        var r = $('<div style="position:relative;width:64px;height:64px">\
            <img src="data/upgrade.png" width="64" height="64">\
            <span id="editable-focus" style="position:absolute;top:35px;left:8px;right:7px;text-align:\
                    center;color:white;font:bold 15px Consolas;\
                    display:block;overflow:hidden;white-space:nowrap" \
                contenteditable="true">{0}</span>\
        </div>'.format(label));

        updateStyle(r.find('span').on('input', function (){
            updateStyle(this);
        })[0]);

        return r;
    }

    function saveFromHtml(html, file, callback){
        var du = 'data:image/png;base64,' + fs.readFileSync('data/upgrade.png').toString('base64');
        var da = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128">\
            <image x="0" y="0" width="128px" height="128px" xlink:href="{0}"></image>\
            <foreignObject width="100%" height="100%">\
                <div xmlns="http://www.w3.org/1999/xhtml" style="transform-origin:0 0;transform:scale(2,2)">{1}</div>\
            </foreignObject>\
        </svg>'.format(du, html.replace(/<img.+?>/, ''));

        var im = new Image();
        var sv = new Blob([ da ], { type: 'image/svg+xml;charset=utf-8' });
        var ur = URL.createObjectURL(sv);

        im.onload = function () {
            try {
                /* workaround for an issue with the chrome text engine */
                var cb = document.createElement('canvas');
                cb.width = cb.height = 128;
                var xb = cb.getContext('2d');
                xb.drawImage(im, 0, 0);

                var cr = document.createElement('canvas');
                cr.width = cr.height = 64;
                var xn = cr.getContext('2d');
                xn.drawImage(cb, 0, 0, 64, 64);

                fs.writeFileSync(file, cr.toDataURL('image/png').slice(22), 'base64');
                callback(null);
            } catch (e){
                callback(e);
            } finally {
                URL.revokeObjectURL(ur);
            }
        };

        im.src = ur;
    }

    function saveFromLibrary(library, file, callback){
        fs.writeFile(file, fs.readFileSync(library), callback);
    }

    function start(car){
        function cb(e){
            if (e){
                modules.errorHandler.handled(e);
            } else {
                modules.cars.reloadUpgrade(car);
            }
        }

        var d = new Dialog('Upgrade Editor', [
            '<div class="left"><h6>Current</h6><img class="car-upgrade"></div>',
            '<div class="right"><h6>New</h6><div id="car-upgrade-editor"></div></div>',
            '<p><i>Ctrl+I: Italic, Ctrl+B: Bold</i></p>',
        ], function (){
            saveFromHtml(this.content.find('#car-upgrade-editor')[0].innerHTML, car.upgrade, cb);
        }, false).setButton('Save').addButton('Cancel');

        d.el.addClass('dark');
        d.content.find('img').attr('src', car.upgrade);
        d.content.find('#car-upgrade-editor').append(editable('S1'));

        focus(d.content.find('#editable-focus')[0]);

        var t = d.addTab('Library', [
            '<img class="car-upgrade-library-element selected" src="data/upgrade-lib/0.png"></img>',
            '<img class="car-upgrade-library-element" src="data/upgrade-lib/1.png"></img>',
            '<img class="car-upgrade-library-element" src="data/upgrade-lib/2.png"></img>',
            '<img class="car-upgrade-library-element" src="data/upgrade-lib/3.png"></img>',
        ], function (){
            saveFromLibrary(t.content.find('.selected').attr('src'), car.upgrade, cb);
        }).setButton('Select').addButton('Cancel');
        t.content.css('marginTop', '7px');
        t.find('.car-upgrade-library-element').click(function (){
            $(this.parentNode).find('.selected').removeClass('selected');
            this.classList.add('selected');
        });
    }

    function init(){
    }

    init();
    return {
        start: start
    };
}();