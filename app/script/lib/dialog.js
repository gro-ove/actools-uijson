/* всплывающие диалоговые окна */

var Dialog = function(title, content, callback, closeCallback) {
    var $ = window.$,
        document = window.document;

    if (typeof content == 'string'){
        content = [ content ];
    }

    this.el = $('<dialog>').html('<div>\
        <h2>' + title + '</h2><div>'  + content.map(function (e){
            return e[0] == '<' ? e : '<p>' + e + '</p>';
        }).join('') + '</div>' + (callback === false ? '' 
            : '<div class="dialog-buttons"><button data-id="dialog-ok">ОК</button></div>') + 
    '</div>').appendTo('body').click(function (e){
        if (e.target.tagName == 'DIALOG' && (
                closeCallback == null || 
                closeCallback !== false && closeCallback() !== false)){
            this.close();
        }
    }.bind(this));

    this.el.find('[data-id="dialog-ok"]').click(function (e){
        if (!callback || callback.call(this) !== false){
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

Dialog.prototype.setButton = function (a){
    this.find('[data-id="dialog-ok"]').text(a);
    return this;
};

Dialog.prototype.addButton = function (text, fn){
    var $ = window.$,
        document = window.document;

    $('<button>' + text + '</button>').appendTo(this.find('.dialog-buttons')).click(function (e){
        if (!fn || fn() !== false){
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

(typeof module == 'object' ? module.exports : window).Dialog = Dialog;