/* всплывающие диалоговые окна */

function _prepareContent(content){
    if (typeof content == 'string'){
        content = [ content ];
    }

    return content.map(function (e){
        return e ? e[0] == '<' && e[e.length - 1] == '>' ? e : '<p>' + e + '</p>' : '';
    }).join('');
}

var Dialog = function(title, content, callback, closeCallback) {
    var $ = window.$,
        document = window.document;

    this.el = $('<dialog>').html('<article><div class="dialog-header"><h4>' + title + 
        '</h4></div><div class="dialog-content">' + _prepareContent(content) + 
        '</div><div class="dialog-buttons"><button data-id="dialog-ok">ОК</button></div></article>').click(function (e){
        if (e.target.tagName == 'DIALOG' && (
                closeCallback == null || 
                closeCallback !== false && closeCallback.call(this) !== false)){
            this.close();
        }
    }.bind(this)).appendTo('body');

    this.header = this.el.find('.dialog-header > h4');
    this.content = this.el.find('.dialog-content');
    this.buttons = this.el.find('.dialog-buttons');

    this.callback = callback;
    if (callback === false){
        this.el.find('[data-id="dialog-ok"]').hide();
    }

    this.el.find('[data-id="dialog-ok"]').click(function (e){
        if (!this.callback || this.callback.call(this) !== false){
            this.close();
        }
    }.bind(this));

    this.el.find('*').keydown(function (e){
        if (e.keyCode == 13){
            this.el.find('[data-id="dialog-ok"]')[0].click();
            return false;
        }
    }.bind(this));
};

Dialog.prototype.setButton = function (a, c){
    this.buttons.find('[data-id="dialog-ok"]').toggle(a != null).text(a);
    if (c != null){ this.callback = c; }
    return this;
};

Dialog.prototype.setContent = function (content){
    this.content.html(_prepareContent(content));
};

Dialog.prototype.addButton = function (text, fn){
    var $ = window.$,
        document = window.document;

    $('<button>' + text + '</button>').appendTo(this.buttons).click(function (e){
        if (!fn || fn.call(this) !== false){
            this.close();
        }
    }.bind(this));
    return this;
};

Dialog.prototype.find = function (a){
    return this.el.find(a);
};

Dialog.prototype.close = function (){
    this.el.remove();
};

Dialog.prototype.addTab = function (title, content, callback, closeCallback){
    var $ = window.$,
        document = window.document;

    if (!this.tabs){
        this.tabs = [ this ];
        this.header.parent().addClass('tabs').click(function (e){
            if (e.target.tagName === 'H4' && !e.target.classList.contains('active')){
                this.el.find('.dialog-header h4.active').removeClass('active');
                e.target.classList.add('active');

                var i = Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target);
                var l = this.el.find('.dialog-content')[0];
                l.parentNode.removeChild(l);
                var l = this.el.find('.dialog-buttons')[0];
                l.parentNode.removeChild(l);
                this.tabs[i].content.appendTo(this.el.children());
                this.tabs[i].buttons.appendTo(this.el.children());

            }
        }.bind(this));
    }

    var n = new Dialog(title, content, callback, closeCallback);
    this.tabs.push(n);

    document.body.removeChild(n.el[0]);
    n.header.appendTo(this.header.addClass('active').parent());
    n.close = this.close.bind(this);

    return n;
};

(typeof module == 'object' ? module.exports : window).Dialog = Dialog;