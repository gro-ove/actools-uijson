modules.tips = function (){
    var _t = [
        'Use double click on skin preview to view it in showroom.',
        'Press RMB to open controls bar.',
        'Select found text in built-in browser and press “OK” to apply it as new description.',
        'Don\'t forget to save changes (Ctrl+S).',
    ];
    
    var _i = _t.length * Math.random() | 0;

    return {
        get next (){
            return _t[++_i % _t.length];
        }
    }
}();