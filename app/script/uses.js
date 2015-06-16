/* default modules */
    var fs = require('fs'),
        path = require('path'),
        cp = require('child_process'),
        spawn = cp.spawn;

/* nw.js modules */
    var gui = require('nw.gui'),
        nwWindow = gui.Window.get();

/* custom node.js modules */
    var Dialog = require('./script/lib/dialog').Dialog,
        Mediator = require('./script/lib/mediator').Mediator;
