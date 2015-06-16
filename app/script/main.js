$('#window-title').text('AcTools Ui Json');

$('#window-close').click(function (){
    nwWindow.close();
});

$('body').mousemove(function (e){
    $('#window-drag').toggleClass('active', /MAIN|ASIDE/.test(e.target.tagName) && e.pageY < 20);
});

modules.acDir
    .on('change', function (){
        modules.cars.scan();
    });

modules.acDir.init();