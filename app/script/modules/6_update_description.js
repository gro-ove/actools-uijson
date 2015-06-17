modules.updateDescription = function (){
    function prov(c){
        return {
            clearUp: function (w){
                $('#before-appbar, #fbarcnt', w.document).remove();
                $('a[target="_blank"]', w.document).removeAttr('target');
            },
            prepare: function (s){
                return s.replace(/\[(?:\d+|citation needed)\]/g, '');
            },
            get url (){
                return 'https://www.google.ru/search?q=' + encodeURIComponent(c.data.name);
            },
            get userAgent (){
                return 'Mozilla/5.0 (Linux; Android 2.3) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36';
            },
        };
    }

    function upd(c){
        p = prov(c);

        var dialog = new Dialog('Update Description', [
            '<iframe nwdisable nwfaketop nwUserAgent="{0}" src="{1}"></iframe>'.format(p.userAgent, p.url),
        ], function (){
            if (s){
                modules.cars.changeData(c, 'description', p.prepare(s));
            }
        });

        var s;
        dialog.find('iframe').on('load popstate', function (){
            var w = this.contentWindow;
            p.clearUp(w);
            $('body', w.document).on('mouseup keydown keyup mousemove', function (e){
                s = w.getSelection().toString();
            });
        });

        var t = $('<div>\
            <button id="button-back">←</button>\
            <button id="button-return">↑</button>\
            <button id="button-external">↗</button>\
        </div>').insertBefore(dialog.find('h2'));

        t.find('#button-back').click(function (){
            dialog.find('iframe')[0].contentWindow.history.back(); 
        });

        t.find('#button-return').click(function (){
            dialog.find('iframe')[0].src = p.url;
        });

        t.find('#button-external').click(function (){
            gui.Shell.openItem(dialog.find('iframe')[0].contentWindow.location.href);
        });
    }

    return upd;
}();