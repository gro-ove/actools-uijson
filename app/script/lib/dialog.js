/* всплывающие диалоговые окна */

var Dialog = function(title, content, callback, closeCallback) {
    var $ = window.$,
        document = window.document;

    this.el = $('<dialog>').html('<div>\
        <h1>' + title + '</h1><div>'  + content.join('') + '</div><button id="dialog-ok">ОК</button>\
    </div>').appendTo('body').click(function (e){
        if (e.target.tagName == 'DIALOG' && (!closeCallback || closeCallback() !== false)){
            this.close();
        }
    }.bind(this));

    this.el.find('#dialog-ok').click(function (e){
        if (!callback || callback.call(this) !== false){
            this.close();
        }
    }.bind(this));

    this.el.find('*').keydown(function (e){
        if (e.keyCode == 13){
            this.el.find('#dialog-ok')[0].click();
            return false;
        }
    }.bind(this));
};

Dialog.prototype.find = function (a){
    return this.el.find(a);
};

Dialog.prototype.close = function (){
    this.el.remove();
};

(typeof module == 'object' ? module.exports : window).Dialog = Dialog;