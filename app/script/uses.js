/* uses */
    var fs = require('fs'),
        path = require('path'),
        cp = require('child_process'),
        spawn = cp.spawn,
        gui = require('nw.gui'),
        nwWindow = gui.Window.get();

    var Dialog = require('./script/lib/dialog').Dialog;