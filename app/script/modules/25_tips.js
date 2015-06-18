modules.tips = function (){
    var _t = [
        'Use double click on skin preview to view it in showroom. If launch failed, maybe car is broken.',
        'Press RMB to open controls bar. Some buttons have additional options.',
        'Select found text in built-in browser and press “OK” to apply it as new description.',
        'Don\'t forget to save changes (Ctrl+S). Use “Reload” button if you want to discard them.',
        'If you want practice, <b>AcTools Ui Json</b> helps you much faster than original Launcher. Weird.\
            Maybe later I\'ll create custom launcher.',
        '<b>Auto-update Preview Feature</b> could produce super-native looking previews, but sadly sometimes not from the first time.',
        'Before using <b>Auto-update Preview Feature</b> please disable all graphics mods (such as SweetFX).\
            We want original-looking screenshots, don\'t we?',
        'Use manual skin previews auto-update to control camera position.\
            In manual skin previews auto-update press F8 when camera position is adjusted.',
        'Press Esc to abort skin previews auto-update.',
        'If you want to use <b>Quick Practive Feature</b>, make sure <b>AcTools Ui Json</b> has access to rename <a href="#" onclick="gui.Shell.showItemInFolder(path.join(modules.acDir.root,\'AssettoCorsa.exe\'))"><i>AssettoCorsa.exe</i></a>.\
            Just open file properties and edit permissions on the Security tab. Or you can run <b>AcTools Ui Json</b> as Administrator.\
            But it\'s a terrible way',
        '<b>Auto-update Preview Feature</b> requires access to <a href="#" onclick="gui.Shell.showItemInFolder(path.join(modules.acDir.root,\'content/gui/logo_ac_app.png\'))"><i>content\\gui\\logo_ac_app.png</i></a>. Don\'t worry, it\'ll revert back all changes.',
    ];
    
    var _i = _t.length * Math.random() | 0;

    return {
        get next (){
            return _t[++_i % _t.length];
        }
    }
}();