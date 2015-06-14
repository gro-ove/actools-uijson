/* update description */
    modules.updateDescription = function (){
        function prov(c){
            return {
                clearUp: function (w){
                    $('#before-appbar, #fbarcnt', w.document).remove();
                    $('a[target="_blank"]', w.document).removeAttr('target');
                },
                prepare: function (s){
                    return s.replace(/\[\d+\]/g, '');
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
                '<iframe nwdisable nwfaketop nwUserAgent="' + p.userAgent + '" src=' + p.url + '></iframe>',
            ], function (){
                if (s){
                    c.data.description = p.prepare(s);
                    display(c);
                }
            });

            var s;
            dialog.find('iframe').on('load popstate', function (){
                var w = this.contentWindow;
                p.clearUp(w);
                $('body', w.document).on('mouseup', function (e){
                    s = w.getSelection().toString();
                });
            });

            var t = $('<div>\
                <button>←</button>\
            </div>').insertBefore(dialog.find('h1'));

            t.find('button').click(function (){
                dialog.find('iframe')[0].contentWindow.history.back(); 
            });
        }

        return upd;
    }();