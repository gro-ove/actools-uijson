modules.showroom = function (){
    function start(c, s){
        if (c.path.indexOf(acCarsDir)) return;

        clr.AcTools.Showroom.ShowroomStarter.StartShot(acDir, c.name, s, 'ibl');
    }

    return {
        start: start
    };
}();

// 0A086478