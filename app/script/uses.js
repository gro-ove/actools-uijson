/* uses */
    var fs = require('fs'),
        path = require('path'),
        spawn = require('child_process').spawn,
        gui = require('nw.gui'),
        nwWindow = gui.Window.get();

    var Dialog = require('./script/lib/dialog').Dialog;