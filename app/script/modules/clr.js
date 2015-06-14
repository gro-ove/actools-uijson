modules.clr = function (){
    function get(c){
        if (typeof c === 'function') c = ''.slice.call(c, 14, -3).trim();
        return '' + cp.execSync('dll\\AcToolsWrapper.exe Console.WriteLine(' + c + ')');
    }

    return {
        get: get,
    };
}();