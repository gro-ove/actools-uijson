/* default modules */
    var fs = require('fs'),
        path = require('path');

/* nw.js modules */
    var gui = require('nw.gui'),
        nwWindow = gui.Window.get();

/* custom node.js modules */
    var Dialog = require('./script/lib/dialog').Dialog,
        Mediator = require('./script/lib/mediator').Mediator;
