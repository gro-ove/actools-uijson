function __prototypeExtend(c, 
	p, 
	t){
	t = function (){};
	t.prototype = p.prototype;
	c.prototype = new t();
	c.prototype.constructor = c;
}

function __bindOnce(obj, 
	name){
	if (!obj.hasOwnProperty('__bindTable'))
		obj.__bindTable = {};
	
	if (!obj.__bindTable.hasOwnProperty(name))
		obj.__bindTable[name] = obj[name].bind(obj);
	return obj.__bindTable[name];
}

var fs = require('fs'), path = require('path');

var gui = require('nw.gui'), mainForm = gui.Window.get();

__defineGetter__('Shell',                                                          // uses.jsxi:9
	function (arg){                                                                // uses.jsxi:9
		return gui.Shell;                                                          // uses.jsxi:9
	});

/* Class "Dialog" declaration */
function Dialog(title, elements, callback, closeCallback){                         // dialog.jsxi:3
	var __that = this;
	
	this.__Dialog__closeOnEnter = true;
	this.el = $('<dialog>').html('<article><div class="dialog-header"><h4>' + title + '</h4></div><div class="dialog-content">' + this.__Dialog__prepareContent(elements) + '</div><div class="dialog-buttons"><button data-id="dialog-ok">ОК</button></div></article>').click(function (e){
		if (e.target.tagName == 'DIALOG' && (__that.__Dialog__closeCallback == null || __that.__Dialog__closeCallback !== false && __that.__Dialog__closeCallback() !== false)){
			__that.close();
		}
	}).appendTo('body');                                                           // dialog.jsxi:29
	this.header = this.el.find('.dialog-header > h4');                             // dialog.jsxi:31
	this.content = this.el.find('.dialog-content');                                // dialog.jsxi:32
	this.buttons = this.el.find('.dialog-buttons');                                // dialog.jsxi:33
	this.__Dialog__callback = callback && callback.bind(this);                     // dialog.jsxi:35
	this.__Dialog__closeCallback = closeCallback && closeCallback.bind(this);      // dialog.jsxi:36
	
	if (this.__Dialog__callback === false){
		this.el.find('[data-id="dialog-ok"]').hide();                              // dialog.jsxi:39
	}
	
	this.el.find('[data-id="dialog-ok"]').click(function (e){                      // dialog.jsxi:42
		if (!__that.__Dialog__callback || __that.__Dialog__callback() !== false){
			__that.close();
		}
	});
	this.el.find('*').keydown(function (e){                                        // dialog.jsxi:48
		if (e.keyCode == 13 && __that.__Dialog__closeOnEnter){                     // dialog.jsxi:49
			__that.el.find('[data-id="dialog-ok"]')[0].click();                    // dialog.jsxi:50
			return false;
		}
	});
}
Dialog.prototype.__Dialog__prepareContent = function (elements){                   // dialog.jsxi:11
	if (typeof elements == 'string'){                                              // dialog.jsxi:12
		elements = [ elements ];                                                   // dialog.jsxi:13
	}
	return elements.map(function (e){                                              // dialog.jsxi:16
		return e ? e[0] == '<' && e[e.length - 1] == '>' ? e : '<p>' + e + '</p>' : '';
	}).join('');                                                                   // dialog.jsxi:18
};
Dialog.prototype.closeOnEnter = function (v){                                      // dialog.jsxi:56
	this.__Dialog__closeOnEnter = v;                                               // dialog.jsxi:57
	return this;                                                                   // dialog.jsxi:58
};
Dialog.prototype.setButton = function (a, c){                                      // dialog.jsxi:61
	this.buttons.find('[data-id="dialog-ok"]').toggle(a != null).text(a);          // dialog.jsxi:62
	
	if (c != null){                                                                // dialog.jsxi:63
		this.__Dialog__callback = c;                                               // dialog.jsxi:63
	}
	return this;                                                                   // dialog.jsxi:64
};
Dialog.prototype.setContent = function (content){                                  // dialog.jsxi:67
	content.html(this.__Dialog__prepareContent(content));                          // dialog.jsxi:68
	return this;                                                                   // dialog.jsxi:69
};
Dialog.prototype.addButton = function (text, fn){                                  // dialog.jsxi:72
	var __that = this;
	
	fn = fn && fn.bind(this);                                                      // dialog.jsxi:73
	$('<button>' + text + '</button>').appendTo(this.buttons).click(function (e){
		if (!fn || fn() !== false){                                                // dialog.jsxi:75
			__that.close();
		}
	});
	return this;                                                                   // dialog.jsxi:79
};
Dialog.prototype.find = function (a){                                              // dialog.jsxi:82
	return this.el.find(a);                                                        // dialog.jsxi:83
};
Dialog.prototype.close = function (){                                              // dialog.jsxi:86
	this.el.remove();                                                              // dialog.jsxi:87
};
Dialog.prototype.addTab = function (title, content, callback, closeCallback){      // dialog.jsxi:90
	var __that = this;
	
	if (!this.tabs){
		this.tabs = [ this ];
		this.header.parent().addClass('tabs').click(function (e){                  // dialog.jsxi:93
			if (e.target.tagName === 'H4' && !e.target.classList.contains('active')){
				__that.el.find('.dialog-header h4.active').removeClass('active');
				e.target.classList.add('active');                                  // dialog.jsxi:96
				
				var i = Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target);
				
				var l = __that.el.find('.dialog-content')[0];
				
				l.parentNode.removeChild(l);                                       // dialog.jsxi:100
				
				var l = __that.el.find('.dialog-buttons')[0];
				
				l.parentNode.removeChild(l);                                       // dialog.jsxi:102
				__that.tabs[i].content.appendTo(__that.el.children());             // dialog.jsxi:103
				__that.tabs[i].buttons.appendTo(__that.el.children());             // dialog.jsxi:104
			}
		});
	}
	
	var n = new Dialog(title, content, callback, closeCallback);
	
	this.tabs.push(n);                                                             // dialog.jsxi:110
	document.body.removeChild(n.el[0]);                                            // dialog.jsxi:112
	n.header.appendTo(this.header.addClass('active').parent());                    // dialog.jsxi:113
	n.close = __bindOnce(this, 'close').bind(this);                                // dialog.jsxi:114
	return n;                                                                      // dialog.jsxi:116
};

var Mediator = (function (){                                                       // mediator.jsxi:1
	function _splitAndCall(type, fn, arg){                                         // mediator.jsxi:2
		if (Array.isArray(type)){                                                  // mediator.jsxi:3
			for (var i = 0; i < type.length; i ++){                                // mediator.jsxi:4
				fn.call(this, type[i], arg);                                       // mediator.jsxi:5
			}
		} else if (type.indexOf(' ') !== - 1){                                     // mediator.jsxi:7
			type = type.split(' ');                                                // mediator.jsxi:8
			
			for (var i = 0; i < type.length; i ++){                                // mediator.jsxi:9
				fn.call(this, type[i], arg);                                       // mediator.jsxi:10
			}
		} else {
			fn.call(this, type, arg);                                              // mediator.jsxi:13
		}
	}
	
	function _call(type, entry, array){                                            // mediator.jsxi:17
		try {
			return entry.callback.apply(null, array);                              // mediator.jsxi:19
		} catch (e){                                                               // mediator.jsxi:20
			console.warn(e.stack);                                                 // mediator.jsxi:21
			
			if (typeof Mediator.errorHandler === 'function'){                      // mediator.jsxi:23
				try {
					Mediator.errorHandler(e);                                      // mediator.jsxi:25
				} catch (e){} 
			}
		} 
	}
	
	function _on(type, entry){                                                     // mediator.jsxi:31
		console.assert(type && typeof type === 'string' && typeof entry.callback === 'function', 
			'Wrong arg');                                                          // mediator.jsxi:32
		
		var added = false;
		
		this.dispatch('register:' + type,                                          // mediator.jsxi:35
			function (){                                                           // mediator.jsxi:35
				var l = arguments.length, array = new Array(l + 1);
				
				for (var i = 0; i < l; i ++){                                      // mediator.jsxi:37
					array[i] = arguments[i];                                       // mediator.jsxi:38
				}
				
				array[l] = type;                                                   // mediator.jsxi:40
				_call.call(this, type, entry, array);                              // mediator.jsxi:43
				
				if (!entry.one){                                                   // mediator.jsxi:45
					return;
				}
				
				if (added){                                                        // mediator.jsxi:49
					this.off(type, entry.callback);                                // mediator.jsxi:50
				} else {
					this.dispatch('unregister:' + type);                           // mediator.jsxi:52
					entry = null;                                                  // mediator.jsxi:53
				}
			});
		
		if (entry === null){                                                       // mediator.jsxi:57
			return;
		} else {
			added = true;                                                          // mediator.jsxi:60
		}
		
		if (this.listeners.hasOwnProperty(type)){                                  // mediator.jsxi:63
			var array = this.listeners[type];
			
			for (var i = 0; i < array.length; i ++){                               // mediator.jsxi:66
				if (array[i] === null){                                            // mediator.jsxi:67
					array[i] = entry;                                              // mediator.jsxi:68
					return;
				}
			}
			
			this.listeners[type].push(entry);                                      // mediator.jsxi:73
		} else {
			this.listeners[type] = [ entry ];                                      // mediator.jsxi:75
		}
	}
	
	function _offCallback(callback){                                               // mediator.jsxi:79
		for (var type in this.listeners){                                          // mediator.jsxi:80
			var array = this.listeners[type];
			
			for (var i = 0; i < array.length; i ++){                               // mediator.jsxi:83
				if (array[i] !== null && array[i].callback === callback){          // mediator.jsxi:84
					this.dispatch('unregister:' + type);                           // mediator.jsxi:85
					array[i] = null;                                               // mediator.jsxi:86
				}
			}
		}
	}
	
	function _offType(type, callback){                                             // mediator.jsxi:92
		console.assert(typeof callback === 'function', 'Wrong arg');               // mediator.jsxi:93
		
		if (this.listeners.hasOwnProperty(type)){                                  // mediator.jsxi:95
			var array = this.listeners[type];
			
			for (var i = 0; i < array.length; i ++){                               // mediator.jsxi:98
				if (array[i] !== null && array[i].callback === callback){          // mediator.jsxi:99
					this.dispatch('unregister:' + type);                           // mediator.jsxi:100
					array[i] = null;                                               // mediator.jsxi:101
				}
			}
		}
	}
	
	function _dispatch(type, args){                                                // mediator.jsxi:107
		if (this.listeners.hasOwnProperty(type)){                                  // mediator.jsxi:108
			var array = this.listeners[type];
			
			for (var i = 0; i < array.length; i ++){                               // mediator.jsxi:111
				var entry = array[i];
				
				if (entry !== null){                                               // mediator.jsxi:114
					if (entry.one){                                                // mediator.jsxi:115
						this.dispatch('unregister:' + type);                       // mediator.jsxi:116
						array[i] = null;                                           // mediator.jsxi:117
					}
					
					_call.call(this, type, entry, args);                           // mediator.jsxi:121
				}
			}
		}
	}
	
	var Mediator = function (){                                                    // mediator.jsxi:127
		this.listeners = {};                                                       // mediator.jsxi:128
	};
	
	Mediator.prototype.on = function (type, callback){                             // mediator.jsxi:131
		if (typeof type === 'object' && !Array.isArray(type)){                     // mediator.jsxi:132
			for (var k in type){                                                   // mediator.jsxi:133
				this.on(k, type[k]);                                               // mediator.jsxi:134
			}
		} else {
			_splitAndCall.call(this, type, _on, { callback: callback });           // mediator.jsxi:137
		}
		return this;                                                               // mediator.jsxi:139
	};
	Mediator.prototype.one = function (type, callback){                            // mediator.jsxi:142
		if (typeof type === 'object' && !Array.isArray(type)){                     // mediator.jsxi:143
			for (var k in type){                                                   // mediator.jsxi:144
				this.one(k, type[k]);                                              // mediator.jsxi:145
			}
		} else {
			_splitAndCall.call(this, type, _on, { callback: callback, one: true });
		}
		return this;                                                               // mediator.jsxi:150
	};
	Mediator.prototype.off = function (type, callback){                            // mediator.jsxi:153
		if (typeof type === 'function'){                                           // mediator.jsxi:154
			_offCallback.call(this, type);                                         // mediator.jsxi:155
		} else {
			_splitAndCall.call(this, type, _offType, callback);                    // mediator.jsxi:157
		}
		return this;                                                               // mediator.jsxi:159
	};
	Mediator.prototype.dispatch = function (type){                                 // mediator.jsxi:162
		var args = new Array(arguments.length);
		
		for (var i = 1; i < args.length; i ++){                                    // mediator.jsxi:164
			args[i - 1] = arguments[i];                                            // mediator.jsxi:165
		}
		
		args[args.length - 1] = type;                                              // mediator.jsxi:167
		_dispatch.call(this, type, args);                                          // mediator.jsxi:169
		
		for (var index = type.lastIndexOf(':'); index !== - 1; index = type.lastIndexOf(':', index - 1))
			_dispatch.call(this, type.substr(0, index), args);                     // mediator.jsxi:171
		return this;                                                               // mediator.jsxi:173
	};
	Mediator.prototype.extend = function (obj){                                    // mediator.jsxi:176
		if (obj.on === undefined){                                                 // mediator.jsxi:177
			obj.on = this.on.bind(this);                                           // mediator.jsxi:178
		}
		
		if (obj.one === undefined){                                                // mediator.jsxi:181
			obj.one = this.one.bind(this);                                         // mediator.jsxi:182
		}
		
		if (obj.off === undefined){                                                // mediator.jsxi:185
			obj.off = this.off.bind(this);                                         // mediator.jsxi:186
		}
		return obj;                                                                // mediator.jsxi:189
	};
	Mediator.prototype.debug = function (arg){                                     // mediator.jsxi:192
		var result = {};
		
		for (var key in this.listeners){                                           // mediator.jsxi:194
			var filtered = this.listeners[key].filter(function (a){                // mediator.jsxi:195
				return a;                                                          // mediator.jsxi:196
			});
			
			if (typeof arg === 'string' && key !== arg && !key.startsWith(arg + ':')){
				continue;
			}
			
			result[key] = {                                                        // mediator.jsxi:203
				'Listeners': filtered.length,                                      // mediator.jsxi:203
				'First listener at': filtered.length > 0 ? filtered[0].callback.location() : '–', 
				'Allocated': this.listeners[key].length
			};
		}
		
		console.table(result);                                                     // mediator.jsxi:210
		return this;                                                               // mediator.jsxi:211
	};
	Mediator.test = function (){                                                   // mediator.jsxi:214
		var m = new Mediator(), c;
		
		m.on('register',                                                           // mediator.jsxi:217
			function (){                                                           // mediator.jsxi:217
				console.log('REGISTERED', arguments);                              // mediator.jsxi:218
			});
		m.on('unregister',                                                         // mediator.jsxi:220
			function (){                                                           // mediator.jsxi:220
				console.log('UNREGISTERED', arguments);                            // mediator.jsxi:221
			});
		m.on('a',                                                                  // mediator.jsxi:223
			c = function (){                                                       // mediator.jsxi:223
				console.log('A', arguments);                                       // mediator.jsxi:224
			});
		m.on('b',                                                                  // mediator.jsxi:226
			function (){                                                           // mediator.jsxi:226
				console.log('B', arguments);                                       // mediator.jsxi:227
			});
		m.on('a:b',                                                                // mediator.jsxi:229
			function (){                                                           // mediator.jsxi:229
				console.log('A:B', arguments);                                     // mediator.jsxi:230
			});
		m.one('a:b:c',                                                             // mediator.jsxi:232
			function (){                                                           // mediator.jsxi:232
				console.log('A:B:C', arguments);                                   // mediator.jsxi:233
			});
		console.info('a:b, 15');                                                   // mediator.jsxi:235
		m.dispatch('a:b', 15);                                                     // mediator.jsxi:236
		console.info('a:b:c, 16');                                                 // mediator.jsxi:237
		m.dispatch('a:b:c', 16);                                                   // mediator.jsxi:238
		console.info('a:b:c, 17');                                                 // mediator.jsxi:239
		m.dispatch('a:b:c', 17);                                                   // mediator.jsxi:240
		console.info('b, 18');                                                     // mediator.jsxi:241
		m.dispatch('b', 18);                                                       // mediator.jsxi:242
		console.info('a:b, 19');                                                   // mediator.jsxi:243
		m.dispatch('a:b', 19);                                                     // mediator.jsxi:244
		console.info('off');                                                       // mediator.jsxi:245
		m.off(c);                                                                  // mediator.jsxi:246
		console.info('a:b, 20');                                                   // mediator.jsxi:247
		m.dispatch('a:b', 20);                                                     // mediator.jsxi:248
		return m;                                                                  // mediator.jsxi:249
	};
	return Mediator;                                                               // mediator.jsxi:252
})();

!(function (){                                                                     // winstate.jsxi:1
	var winState;
	
	var currWinMode;
	
	var resizeTimeout;
	
	var isMaximizationEvent = false;
	
	var deltaHeight = (function (){                                                // winstate.jsxi:8
		if (gui.App.manifest.window.frame)                                         // winstate.jsxi:10
			return true;
		else
			return 'disabled';                                                     // winstate.jsxi:10
	})();
	
	function initWindowState(){                                                    // winstate.jsxi:13
		winState = JSON.parse(localStorage.windowState || 'null');                 // winstate.jsxi:14
		
		if (winState){                                                             // winstate.jsxi:16
			currWinMode = winState.mode;                                           // winstate.jsxi:17
			
			if (currWinMode === 'maximized'){                                      // winstate.jsxi:18
				mainForm.maximize();                                               // winstate.jsxi:19
			} else {
				restoreWindowState();                                              // winstate.jsxi:21
			}
		} else {
			currWinMode = 'normal';                                                // winstate.jsxi:24
			
			if (deltaHeight !== 'disabled')                                        // winstate.jsxi:25
				deltaHeight = 0;                                                   // winstate.jsxi:25
			
			dumpWindowState();                                                     // winstate.jsxi:26
		}
		
		if (!mainForm.isDevToolsOpen()){                                           // winstate.jsxi:34
			setTimeout(function (){                                                // winstate.jsxi:35
				mainForm.show();                                                   // winstate.jsxi:36
			}, 
			100);
		}
	}
	
	function dumpWindowState(){                                                    // winstate.jsxi:41
		if (!winState){                                                            // winstate.jsxi:42
			winState = {};                                                         // winstate.jsxi:43
		}
		
		if (currWinMode === 'maximized'){                                          // winstate.jsxi:47
			winState.mode = 'maximized';                                           // winstate.jsxi:48
		} else {
			winState.mode = 'normal';                                              // winstate.jsxi:50
		}
		
		if (currWinMode === 'normal'){                                             // winstate.jsxi:55
			winState.x = mainForm.x;                                               // winstate.jsxi:56
			winState.y = mainForm.y;                                               // winstate.jsxi:57
			winState.width = mainForm.width;                                       // winstate.jsxi:58
			winState.height = mainForm.height;                                     // winstate.jsxi:59
			
			if (deltaHeight !== 'disabled' && deltaHeight !== 0 && currWinMode !== 'maximized'){
				winState.deltaHeight = deltaHeight;                                // winstate.jsxi:63
			}
		}
	}
	
	function restoreWindowState(){                                                 // winstate.jsxi:68
		if (deltaHeight !== 'disabled' && typeof winState.deltaHeight !== 'undefined'){
			deltaHeight = winState.deltaHeight;                                    // winstate.jsxi:71
			winState.height = winState.height - deltaHeight;                       // winstate.jsxi:72
		}
		
		mainForm.resizeTo(winState.width, winState.height);                        // winstate.jsxi:75
		mainForm.moveTo(winState.x, winState.y);                                   // winstate.jsxi:76
	}
	
	function saveWindowState(){                                                    // winstate.jsxi:79
		dumpWindowState();                                                         // winstate.jsxi:80
		localStorage['windowState'] = JSON.stringify(winState);                    // winstate.jsxi:81
	}
	
	initWindowState();                                                             // winstate.jsxi:84
	mainForm.on('maximize',                                                        // winstate.jsxi:86
		function (){                                                               // winstate.jsxi:86
			isMaximizationEvent = true;                                            // winstate.jsxi:87
			currWinMode = 'maximized';                                             // winstate.jsxi:88
		});
	mainForm.on('unmaximize',                                                      // winstate.jsxi:91
		function (){                                                               // winstate.jsxi:91
			currWinMode = 'normal';                                                // winstate.jsxi:92
			restoreWindowState();                                                  // winstate.jsxi:93
		});
	mainForm.on('minimize',                                                        // winstate.jsxi:96
		function (){                                                               // winstate.jsxi:96
			currWinMode = 'minimized';                                             // winstate.jsxi:97
		});
	mainForm.on('restore',                                                         // winstate.jsxi:100
		function (){                                                               // winstate.jsxi:100
			currWinMode = 'normal';                                                // winstate.jsxi:101
		});
	mainForm.window.addEventListener('resize',                                     // winstate.jsxi:104
		function (){                                                               // winstate.jsxi:104
			clearTimeout(resizeTimeout);                                           // winstate.jsxi:107
			resizeTimeout = setTimeout(function (){                                // winstate.jsxi:108
				if (isMaximizationEvent){                                          // winstate.jsxi:111
					isMaximizationEvent = false;                                   // winstate.jsxi:113
				} else {
					if (currWinMode === 'maximized'){                              // winstate.jsxi:115
						currWinMode = 'normal';                                    // winstate.jsxi:116
					}
				}
				
				if (deltaHeight !== 'disabled' && deltaHeight === false){          // winstate.jsxi:121
					deltaHeight = mainForm.height - winState.height;               // winstate.jsxi:122
					
					if (deltaHeight !== 0){                                        // winstate.jsxi:125
						mainForm.resizeTo(winState.width, mainForm.height - deltaHeight);
					}
				}
				
				dumpWindowState();                                                 // winstate.jsxi:130
				saveWindowState();                                                 // winstate.jsxi:131
			}, 
			500);
		}, 
		false);
	mainForm.on('close',                                                           // winstate.jsxi:135
		function (){                                                               // winstate.jsxi:135
			try {
				saveWindowState();                                                 // winstate.jsxi:137
			} catch (err){                                                         // winstate.jsxi:138
				console.log("winstateError: " + err);                              // winstate.jsxi:139
			} 
		});
})();
Object.clone = function (o){                                                       // helpers.jsxi:1
	if (Array.isArray(o)){                                                         // helpers.jsxi:2
		return o.map(Object.clone);                                                // helpers.jsxi:3
	} else if (o && typeof o === 'object'){                                        // helpers.jsxi:4
		var r = {};
		
		for (var n in o){                                                          // helpers.jsxi:6
			r[n] = Object.clone(o[n]);                                             // helpers.jsxi:7
		}
		return r;                                                                  // helpers.jsxi:9
	} else {
		return o;                                                                  // helpers.jsxi:11
	}
};
Event.isSomeInput = function (e){                                                  // helpers.jsxi:15
	var n = e.target;
	
	if (n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.tagName === 'SELECT')
		return true;
	
	while (n){                                                                     // helpers.jsxi:20
		if (n.contentEditable === 'true')                                          // helpers.jsxi:21
			return true;
		
		n = n.parentNode;                                                          // helpers.jsxi:22
	}
	return false;
};
RegExp.fromQuery = function (q, w){                                                // helpers.jsxi:28
	var r = q.replace(/(?=[\$^.+(){}[\]])/g, '\\').replace(/\?|(\*)/g, '.$1');     // helpers.jsxi:29
	return new RegExp(w ? '^(?:' + r + ')$' : r, 'i');                             // helpers.jsxi:30
};
String.prototype.cssUrl = function (){                                             // helpers.jsxi:33
	return 'file://' + this.replace(/\\/g, '/');                                   // helpers.jsxi:34
};

/* Class "ErrorHandler" declaration */
var ErrorHandler = (function (){                                                   // error_handler.jsxi:1
	var ErrorHandler = function (){};
	
	function _details(e){                                                          // error_handler.jsxi:2
		return ''.replace.call(e.stack, /file:\/{3}[A-Z]:\/.+?(?=\/app\/)/g, 
			'…');                                                                  // error_handler.jsxi:3
	}
	
	ErrorHandler.handled = function (msg, err){                                    // error_handler.jsxi:6
		new Dialog('Oops!',                                                        // error_handler.jsxi:7
			[
				'<p>' + msg + '</p>',                                              // error_handler.jsxi:8
				err ? '<pre>' + _details(err) + '</pre>' : null
			]);
	};
	
	function show(){                                                               // error_handler.jsxi:13
		require('nw.gui').Window.get().show();                                     // error_handler.jsxi:14
	}
	
	(function (){                                                                  // error_handler.jsxi:17
		process.on('uncaughtException2',                                           // error_handler.jsxi:18
			function (err){                                                        // error_handler.jsxi:18
				console.warn(_details(err));                                       // error_handler.jsxi:19
				show();                                                            // error_handler.jsxi:21
				new Dialog('Oops!',                                                // error_handler.jsxi:23
					[
						'<p>Uncaught exception, sorry.</p>',                       // error_handler.jsxi:24
						'<pre>' + _details(err) + '</pre>'
					], 
					function (arg){                                                // error_handler.jsxi:26
						mainForm.reloadDev();                                      // error_handler.jsxi:27
					}, 
					function (arg){                                                // error_handler.jsxi:28
						return false;
					}).find('button').text('Restart');                             // error_handler.jsxi:28
			});
		Mediator.errorHandler = function (err){                                    // error_handler.jsxi:31
			ErrorHandler.handled('Listener exception', err);
		};
	})();
	return ErrorHandler;
})();

/* Class "AcDir" declaration */
var AcDir = (function (){                                                          // ac_dir.jsxi:1
	var AcDir = function (){}, 
		mediator = new Mediator(),                                                 // ac_dir.jsxi:2
		_root,                                                                     // ac_dir.jsxi:4
		_cars,                                                                     // ac_dir.jsxi:4
		_carsOff,                                                                  // ac_dir.jsxi:4
		_tracks,                                                                   // ac_dir.jsxi:4
		_showrooms;                                                                // ac_dir.jsxi:4
	
	AcDir.check = function (d){                                                    // ac_dir.jsxi:6
		if (!fs.existsSync(d)){                                                    // ac_dir.jsxi:7
			return 'Folder not found';                                             // ac_dir.jsxi:8
		}
		
		if (!fs.existsSync(path.join(d, 'content', 'cars'))){                      // ac_dir.jsxi:11
			return 'Folder content/cars not found';                                // ac_dir.jsxi:12
		}
	};
	AcDir.set = function (d){                                                      // ac_dir.jsxi:16
		if (_root == d)                                                            // ac_dir.jsxi:17
			return;
		
		_root = d;                                                                 // ac_dir.jsxi:19
		_cars = path.join(d, 'content', 'cars');                                   // ac_dir.jsxi:21
		_carsOff = path.join(d, 'content', 'cars-off');                            // ac_dir.jsxi:22
		
		if (!fs.existsSync(_carsOff)){                                             // ac_dir.jsxi:23
			fs.mkdirSync(_carsOff);                                                // ac_dir.jsxi:24
		}
		
		_tracks = path.join(d, 'content', 'tracks');                               // ac_dir.jsxi:27
		_showrooms = path.join(d, 'content', 'showroom');                          // ac_dir.jsxi:28
		localStorage.acRootDir = d;                                                // ac_dir.jsxi:30
		mediator.dispatch('change', _root);                                        // ac_dir.jsxi:32
	};
	AcDir.init = function (c){                                                     // ac_dir.jsxi:35
		function ready(d){                                                         // ac_dir.jsxi:36
			var err = AcDir.check(d);
			
			if (err){                                                              // ac_dir.jsxi:38
				return prompt(err);                                                // ac_dir.jsxi:39
			} else {
				AcDir.set(d);
			}
		}
		
		function prompt(e){                                                        // ac_dir.jsxi:45
			var dialog = new Dialog('Assetto Corsa Folder',                        // ac_dir.jsxi:46
				[
					e && '<p class="error">' + e + '</p>',                         // ac_dir.jsxi:47
					'<button id="select-dir" style="float:right;width:30px">…</button>', 
					'<input placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">'
				], 
				function (){                                                       // ac_dir.jsxi:50
					ready(this.find('input').val());                               // ac_dir.jsxi:51
				}, 
				function (){                                                       // ac_dir.jsxi:52
					return false;
				});
			
			if (localStorage.acRootDir){                                           // ac_dir.jsxi:56
				dialog.find('input').val(localStorage.acRootDir);                  // ac_dir.jsxi:57
			}
			
			dialog.find('#select-dir').click(function (){                          // ac_dir.jsxi:60
				$('<input type="file" nwdirectory />').attr({ nwworkingdir: dialog.find('input').val() }).change(function (){
					dialog.find('input').val(this.value);                          // ac_dir.jsxi:64
				}).click();                                                        // ac_dir.jsxi:65
			});
		}
		
		if (localStorage.acRootDir){                                               // ac_dir.jsxi:69
			ready(localStorage.acRootDir);                                         // ac_dir.jsxi:70
		} else {
			prompt();                                                              // ac_dir.jsxi:72
		}
	};
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'root', 
		{
			get: (function (){
				return _root;                                                      // ac_dir.jsxi:76
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'cars', 
		{
			get: (function (){
				return _cars;                                                      // ac_dir.jsxi:77
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'carsOff', 
		{
			get: (function (){
				return _carsOff;                                                   // ac_dir.jsxi:78
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'tracks', 
		{
			get: (function (){
				return _tracks;                                                    // ac_dir.jsxi:79
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'showrooms', 
		{
			get: (function (){
				return _showrooms;                                                 // ac_dir.jsxi:80
			})
		});
	(function (){                                                                  // ac_dir.jsxi:82
		mediator.extend(AcDir);                                                    // ac_dir.jsxi:83
	})();
	return AcDir;
})();

/* Class "AcFilters" declaration */
var AcFilters = (function (){                                                      // ac_filters.jsxi:1
	var AcFilters = function (){}, 
		_filters = null;
	
	function loadFilters(){                                                        // ac_filters.jsxi:12
		var path = AcTools.Utils.FileUtils.GetDocumentsFiltersFolder();
		
		_filters = fs.readdirSync(path).map(function (e){                          // ac_filters.jsxi:15
			if (!/\.ini$/i.test(e))                                                // ac_filters.jsxi:16
				return;
			return { id: e.replace(/\.ini$/i, ''), path: path + '/' + e };
		}).filter(function (e){                                                    // ac_filters.jsxi:21
			return e;                                                              // ac_filters.jsxi:22
		});
	}
	
	Object.defineProperty(AcFilters,                                               // ac_filters.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_filters){                                                    // ac_filters.jsxi:5
					loadFilters();                                                 // ac_filters.jsxi:6
				}
				return _filters;                                                   // ac_filters.jsxi:9
			})
		});
	return AcFilters;
})();

/* Class "AcPractice" declaration */
var AcPractice = (function (){                                                     // ac_practice.jsxi:1
	var AcPractice = function (){}, 
		_tracks = null;
	
	function loadTracks(){                                                         // ac_practice.jsxi:12
		_tracks = fs.readdirSync(AcDir.tracks).map(function (e){                   // ac_practice.jsxi:13
			var p = path.join(AcDir.tracks, e);
			
			var d = null;
			
			var j = path.join(p, 'ui', 'ui_track.json');
			
			if (fs.existsSync(j)){                                                 // ac_practice.jsxi:18
				try {
					d = JSON.parse(fs.readFileSync(j));                            // ac_practice.jsxi:20
				} catch (e){} 
			}
			return { id: e, data: d, path: p, json: j };
		}).filter(function (e){                                                    // ac_practice.jsxi:30
			return e;                                                              // ac_practice.jsxi:31
		});
	}
	
	AcPractice.start = function (c, s, r){                                         // ac_practice.jsxi:35
		if (c.path.indexOf(AcDir.cars))                                            // ac_practice.jsxi:36
			return;
		
		if (s == null){                                                            // ac_practice.jsxi:38
			s = c.skins.selected.id;                                               // ac_practice.jsxi:39
		}
		
		r = r || localStorage.lastTrack || 'spa';                                  // ac_practice.jsxi:42
		localStorage.lastTrack = r;                                                // ac_practice.jsxi:43
		
		try {
			AcTools.Processes.Game.StartPractice(AcDir.root, c.id, s, r.split('/')[0], r.split('/')[1] || '');
		} catch (e){                                                               // ac_practice.jsxi:47
			ErrorHandler.handled('Cannot start the game. Maybe there is not enough rights.');
		} 
	};
	AcPractice.select = function (c, s){                                           // ac_practice.jsxi:52
		if (!_tracks){                                                             // ac_practice.jsxi:53
			loadTracks();                                                          // ac_practice.jsxi:54
		}
		
		new Dialog('Track',                                                        // ac_practice.jsxi:57
			[
				'<select>{0}</select>'.format(_tracks.map(function (e){            // ac_practice.jsxi:58
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join(''))
			], 
			function (){                                                           // ac_practice.jsxi:61
				AcPractice.start(c, s, this.find('select').val());
			}).addButton('Reload List',                                            // ac_practice.jsxi:63
			function (){                                                           // ac_practice.jsxi:63
				setTimeout(function (){                                            // ac_practice.jsxi:64
					loadTracks();                                                  // ac_practice.jsxi:65
					AcPractice.select(c, s);
				});
			}).find('select').val(localStorage.lastTrack || 'spa').change(function (){
			localStorage.lastTrack = this.value;                                   // ac_practice.jsxi:69
		});
	};
	Object.defineProperty(AcPractice,                                              // ac_practice.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_tracks){                                                     // ac_practice.jsxi:5
					loadTracks();                                                  // ac_practice.jsxi:6
				}
				return _tracks;                                                    // ac_practice.jsxi:9
			})
		});
	return AcPractice;
})();

/* Class "AcShowroom" declaration */
var AcShowroom = (function (){                                                     // ac_showroom.jsxi:1
	var AcShowroom = function (){}, 
		_showrooms = null,                                                         // ac_showroom.jsxi:2
		_blackShowroom = 'studio_black',                                           // ac_showroom.jsxi:4
		_blackShowroomUrl = 'http://www.racedepartment.com/downloads/studio-black-showroom.4353/';
	
	function loadShowrooms(){                                                      // ac_showroom.jsxi:15
		_showrooms = fs.readdirSync(AcDir.showrooms).map(function (e){             // ac_showroom.jsxi:16
			var p = path.join(AcDir.showrooms, e);
			
			var d = null;
			
			var j = path.join(p, 'ui', 'ui_showroom.json');
			
			if (fs.existsSync(j)){                                                 // ac_showroom.jsxi:21
				try {
					d = JSON.parse(fs.readFileSync(j));                            // ac_showroom.jsxi:23
				} catch (e){} 
			}
			return { id: e, data: d, path: p, json: j };
		}).filter(function (e){                                                    // ac_showroom.jsxi:33
			return e;                                                              // ac_showroom.jsxi:34
		});
	}
	
	AcShowroom.start = function (c, s, r){                                         // ac_showroom.jsxi:38
		if (c.path.indexOf(AcDir.cars))                                            // ac_showroom.jsxi:39
			return;
		
		if (s == null){                                                            // ac_showroom.jsxi:41
			s = c.skins.selected.id;                                               // ac_showroom.jsxi:42
		}
		
		r = r || localStorage.lastShowroom || 'showroom';                          // ac_showroom.jsxi:45
		
		try {
			AcTools.Processes.Showroom.Start(AcDir.root, c.id, s, r);              // ac_showroom.jsxi:47
		} catch (err){                                                             // ac_showroom.jsxi:48
			ErrorHandler.handled('Cannot start showroom. Maybe there is not enough rights or the car is broken.');
			return;
		} 
		
		localStorage.lastShowroom = r;                                             // ac_showroom.jsxi:52
	};
	AcShowroom.select = function (c, s){                                           // ac_showroom.jsxi:55
		if (!_showrooms){                                                          // ac_showroom.jsxi:56
			loadShowrooms();                                                       // ac_showroom.jsxi:57
		}
		
		new Dialog('Showroom',                                                     // ac_showroom.jsxi:60
			[
				'<select>{0}</select>'.format(_showrooms.map(function (e){         // ac_showroom.jsxi:61
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join(''))
			], 
			function (){                                                           // ac_showroom.jsxi:64
				AcShowroom.start(c, s, this.find('select').val());
			}).addButton('Reload List',                                            // ac_showroom.jsxi:66
			function (){                                                           // ac_showroom.jsxi:66
				setTimeout(function (){                                            // ac_showroom.jsxi:67
					loadShowrooms();                                               // ac_showroom.jsxi:68
					AcShowroom.select(c, s);
				});
			}).find('select').val(localStorage.lastShowroom || 'showroom').change(function (){
			localStorage.lastShowroom = this.value;                                // ac_showroom.jsxi:72
		});
	};
	
	function shotOutputPreview(car, output, callback){                             // ac_showroom.jsxi:76
		var d = new Dialog('Update Previews',                                      // ac_showroom.jsxi:78
			[
				'<div class="left"><h6>Current</h6><img id="current-preview"></div>', 
				'<div class="right"><h6>New</h6><img id="new-preview"></div>'
			], 
			function (){                                                           // ac_showroom.jsxi:81
				callback();                                                        // ac_showroom.jsxi:82
			}, 
			false).setButton('Apply').addButton('Cancel');                         // ac_showroom.jsxi:83
		
		var t = $('<div>' + '<button data-action="prev" id="button-prev" disabled>←</button> ' + '<button data-action="next" id="button-next">→</button>' + '</div>').insertBefore(d.header);
		
		t.find('#button-prev').click(function (){                                  // ac_showroom.jsxi:90
			pos --;                                                                // ac_showroom.jsxi:91
			out();                                                                 // ac_showroom.jsxi:92
		});
		t.find('#button-next').click(function (){                                  // ac_showroom.jsxi:95
			pos ++;                                                                // ac_showroom.jsxi:96
			out();                                                                 // ac_showroom.jsxi:97
		});
		d.content.css({ maxWidth: 'calc(100vw - 100px)', paddingBottom: '10px' }).find('img').css({ width: '100%', verticalAlign: 'top' });
		
		var pos = 0;
		
		function out(){                                                            // ac_showroom.jsxi:109
			t.find('#button-prev').attr('disabled', pos > 0 ? null : true);        // ac_showroom.jsxi:110
			t.find('#button-next').attr('disabled', pos < car.skins.length - 1 ? null : true);
			d.content.find('#current-preview').prop('src', car.skins[pos].preview.cssUrl());
			d.content.find('#new-preview').prop('src', (output + '/' + car.skins[pos].id + '.jpg').cssUrl());
		}
		
		out();                                                                     // ac_showroom.jsxi:116
	}
	
	AcShowroom.shot = function (c, m){                                             // ac_showroom.jsxi:119
		if (c.path.indexOf(AcDir.cars))                                            // ac_showroom.jsxi:120
			return;
		
		var showroom = Settings.get('aptShowroom') || _blackShowroom;
		
		var x = - Settings.get('aptCameraX');
		
		var y = - Settings.get('aptCameraY');
		
		var filter = Settings.get('aptFilter') || null;
		
		var disableSweetFx = !!Settings.get('aptDisableSweetFx');
		
		var delays = !!Settings.get('aptIncreaseDelays');
		
		if (Number.isNaN(x))                                                       // ac_showroom.jsxi:129
			x = Settings.defaults.aptCameraX;                                      // ac_showroom.jsxi:129
		
		if (Number.isNaN(y))                                                       // ac_showroom.jsxi:130
			y = Settings.defaults.aptCameraY;                                      // ac_showroom.jsxi:130
		
		showroomTest();                                                            // ac_showroom.jsxi:132
		
		function showroomTest(){                                                   // ac_showroom.jsxi:134
			function blackShowroomTest(){                                          // ac_showroom.jsxi:135
				return fs.existsSync(AcTools.Utils.FileUtils.GetShowroomFolder(AcDir.root, showroom));
			}
			
			if (showroom == _blackShowroom && !blackShowroomTest()){               // ac_showroom.jsxi:139
				new Dialog('One More Thing',                                       // ac_showroom.jsxi:140
					'Please, install <a href="#" onclick="Shell.openItem(\'' + _blackShowroomUrl + '\')">Black Showroom</a> first.', 
					function (){                                                   // ac_showroom.jsxi:142
						Shell.openItem(_blackShowroomUrl);                         // ac_showroom.jsxi:143
						return false;
					}).setButton('From Here').addButton('Right Here',              // ac_showroom.jsxi:145
					function (){                                                   // ac_showroom.jsxi:145
						Shell.openItem(AcTools.Utils.FileUtils.GetShowroomsFolder(AcDir.root));
						return false;
					}).addButton('Done',                                           // ac_showroom.jsxi:148
					function (){                                                   // ac_showroom.jsxi:148
						if (blackShowroomTest()){                                  // ac_showroom.jsxi:149
							setTimeout(proceed);                                   // ac_showroom.jsxi:150
						} else {
							new Dialog('Are You Sure?', 'Because showroom is still missing.');
							this.buttons.find('button:last-child').text('Really Done');
							return false;
						}
					});
			} else {
				proceed();                                                         // ac_showroom.jsxi:158
			}
		}
		
		function proceed(){                                                        // ac_showroom.jsxi:162
			var output;
			
			try {
				output = AcTools.Processes.Showroom.Shot(AcDir.root,               // ac_showroom.jsxi:165
					c.id,                                                          // ac_showroom.jsxi:165
					showroom,                                                      // ac_showroom.jsxi:165
					!!m,                                                           // ac_showroom.jsxi:165
					x,                                                             // ac_showroom.jsxi:165
					y,                                                             // ac_showroom.jsxi:165
					filter,                                                        // ac_showroom.jsxi:165
					disableSweetFx,                                                // ac_showroom.jsxi:165
					delays);                                                       // ac_showroom.jsxi:165
			} catch (err){                                                         // ac_showroom.jsxi:166
				ErrorHandler.handled('Cannot get previews. Maybe process was terminated, there is not enough rights or the car is broken.');
				return;
			} 
			
			shotOutputPreview(c,                                                   // ac_showroom.jsxi:171
				output,                                                            // ac_showroom.jsxi:171
				function (){                                                       // ac_showroom.jsxi:171
					AcTools.Utils.ImageUtils.ApplyPreviews(AcDir.root, c.id, output, Settings.get('aptResize'));
					c.updateSkins();                                               // ac_showroom.jsxi:173
					fs.rmdirSync(output);                                          // ac_showroom.jsxi:174
				});
		}
	};
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_showrooms){                                                  // ac_showroom.jsxi:8
					loadShowrooms();                                               // ac_showroom.jsxi:9
				}
				return _showrooms;                                                 // ac_showroom.jsxi:12
			})
		});
	return AcShowroom;
})();

__defineGetter__('AcTools',                                                        // ac_tools.jsxi:1
	function (){                                                                   // ac_tools.jsxi:1
		return AcTools = require('clr').init({ assemblies: [ 'native/AcTools.dll' ], global: false }).AcTools;
	});

/* Class "AppServerRequest" declaration */
var AppServerRequest = (function (){                                               // app_server_request.jsxi:1
	var AppServerRequest = function (){}, 
		_host = 'ascobash.comuf.com',                                              // app_server_request.jsxi:2
		_dataToSend = [],                                                          // app_server_request.jsxi:34
		_sendTimeout,                                                              // app_server_request.jsxi:35
		_sendDelay = 3e3;                                                          // app_server_request.jsxi:36
	
	AppServerRequest.checkUpdate = function (version, source, callback){           // app_server_request.jsxi:6
		$.ajax({                                                                   // app_server_request.jsxi:7
			url: 'http://ascobash.comuf.com/api.php?0=check&v=' + version + '&b=' + source
		}).fail(function (){                                                       // app_server_request.jsxi:9
			if (callback)                                                          // app_server_request.jsxi:10
				callback('error:request');                                         // app_server_request.jsxi:10
		}).done(function (data){                                                   // app_server_request.jsxi:11
			if (data == null || typeof data === 'object'){                         // app_server_request.jsxi:12
				if (callback)                                                      // app_server_request.jsxi:13
					callback(null, data);                                          // app_server_request.jsxi:13
			} else {
				if (callback)                                                      // app_server_request.jsxi:15
					callback('error:' + data);                                     // app_server_request.jsxi:15
			}
		});
	};
	AppServerRequest.sendFeedback = function (feedback, callback){                 // app_server_request.jsxi:20
		$.ajax({                                                                   // app_server_request.jsxi:21
			url: 'http://ascobash.comuf.com/api.php?0=feedback',                   // app_server_request.jsxi:21
			type: 'POST',                                                          // app_server_request.jsxi:23
			contentType: 'text/plain',                                             // app_server_request.jsxi:24
			data: feedback,                                                        // app_server_request.jsxi:25
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:27
			if (callback)                                                          // app_server_request.jsxi:28
				callback('error:request');                                         // app_server_request.jsxi:28
		}).done(function (data){                                                   // app_server_request.jsxi:29
			if (callback)                                                          // app_server_request.jsxi:30
				callback(null);                                                    // app_server_request.jsxi:30
		});
	};
	
	function sendDataInner(carId, key, value){                                     // app_server_request.jsxi:38
		$.ajax({                                                                   // app_server_request.jsxi:39
			url: 'http://ascobash.comuf.com/api.php?0=database&c=' + carId + '&f=' + key, 
			type: 'POST',                                                          // app_server_request.jsxi:41
			contentType: 'text/plain',                                             // app_server_request.jsxi:42
			data: value,                                                           // app_server_request.jsxi:43
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:45
			console.warn('send data failed');                                      // app_server_request.jsxi:46
		});
	}
	
	function sendDataGroup(carId, key, value, callback){                           // app_server_request.jsxi:50
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:51
			var e = _dataToSend[i];
			
			if (e){                                                                // app_server_request.jsxi:52
				sendDataInner(e.car, e.key, e.value);                              // app_server_request.jsxi:53
			}
		}
		
		_dataToSend = [];                                                          // app_server_request.jsxi:57
	}
	
	AppServerRequest.sendData = function (carId, key, value, callback){            // app_server_request.jsxi:60
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:61
			var e = _dataToSend[i];
			
			if (e && e.car === carId && e.key === key){                            // app_server_request.jsxi:62
				_dataToSend[i] = null;                                             // app_server_request.jsxi:63
			}
		}
		
		_dataToSend.push({ car: carId, key: key, value: value });                  // app_server_request.jsxi:67
		
		if (callback)                                                              // app_server_request.jsxi:68
			callback(null);                                                        // app_server_request.jsxi:68
		
		clearTimeout(_sendTimeout);                                                // app_server_request.jsxi:70
		_sendTimeout = setTimeout(sendDataGroup, _sendDelay);                      // app_server_request.jsxi:71
	};
	Object.defineProperty(AppServerRequest,                                        // app_server_request.jsxi:1
		'__AppServerRequest_http', 
		{
			get: (function (){
				return require('http');                                            // app_server_request.jsxi:4
			})
		});
	return AppServerRequest;
})();

/* Class "AppWindow" declaration */
var AppWindow = (function (){                                                      // app_window.jsxi:1
	var AppWindow = function (){}, 
		mediator = new Mediator(),                                                 // app_window.jsxi:2
		_defTitle,                                                                 // app_window.jsxi:4
		_maximized;                                                                // app_window.jsxi:4
	
	function init(){                                                               // app_window.jsxi:6
		_defTitle = gui.App.manifest.name;                                         // app_window.jsxi:7
		_maximized = false;                                                        // app_window.jsxi:8
		mainForm.on('close',                                                       // app_window.jsxi:10
			function (){                                                           // app_window.jsxi:11
				AppWindow.close(false);
			});
		mainForm.on('maximize',                                                    // app_window.jsxi:15
			function (){                                                           // app_window.jsxi:16
				_maximized = true;                                                 // app_window.jsxi:17
				$('#window-maximize').text('↓');                                   // app_window.jsxi:18
				$('body').addClass('maximized');                                   // app_window.jsxi:19
			});
		mainForm.on('unmaximize',                                                  // app_window.jsxi:22
			function (){                                                           // app_window.jsxi:23
				_maximized = false;                                                // app_window.jsxi:24
				$('#window-maximize').text('□');                                   // app_window.jsxi:25
				$('body').removeClass('maximized');                                // app_window.jsxi:26
			});
		$('#window-close').click(function (){                                      // app_window.jsxi:29
			AppWindow.close();
		});
		$('#window-minimize').click(function (){                                   // app_window.jsxi:34
			mainForm.minimize();                                                   // app_window.jsxi:36
		});
		$('#window-maximize').click(function (){                                   // app_window.jsxi:39
			if (_maximized){                                                       // app_window.jsxi:41
				mainForm.unmaximize();                                             // app_window.jsxi:42
			} else {
				mainForm.maximize();                                               // app_window.jsxi:44
			}
		});
		$(document.body).mousemove(function (e){                                   // app_window.jsxi:48
			$('#window-drag').toggleClass('active',                                // app_window.jsxi:50
				/MAIN|ASIDE/.test(e.target.tagName) && e.pageY < 20);              // app_window.jsxi:50
		});
	}
	
	AppWindow.close = function (force){                                            // app_window.jsxi:54
		if (force){                                                                // app_window.jsxi:55
			mainForm.close(true);                                                  // app_window.jsxi:56
		} else {
			mediator.dispatch('close');                                            // app_window.jsxi:58
		}
	};
	
	function setTitle(t){                                                          // app_window.jsxi:62
		$('#window-title').text(t ? '{0} - {1}'.format(t, _defTitle) : _defTitle);
	}
	
	Object.defineProperty(AppWindow,                                               // app_window.jsxi:1
		'title', 
		{
			set: (function (arg){
				return setTitle(arg);                                              // app_window.jsxi:66
			})
		});
	(function (){                                                                  // app_window.jsxi:68
		init();                                                                    // app_window.jsxi:69
		AppWindow.title = null;
		mediator.extend(AppWindow);                                                // app_window.jsxi:72
	})();
	return AppWindow;
})();

/* Class "Cars" declaration */
var Cars = (function (){                                                           // cars.jsxi:1
	var Cars = function (){}, 
		mediator = new Mediator(),                                                 // cars.jsxi:2
		_list,                                                                     // cars.jsxi:4
		_brands = [],                                                              // cars.jsxi:5
		_brandsLower = [],                                                         // cars.jsxi:6
		_classes = [],                                                             // cars.jsxi:7
		_classesLower = [],                                                        // cars.jsxi:8
		_tags = [],                                                                // cars.jsxi:9
		_tagsLower = [];                                                           // cars.jsxi:10
	
	Cars.byName = function (n){                                                    // cars.jsxi:12
		for (var i = 0; i < _list.length; i ++){                                   // cars.jsxi:13
			if (_list[i].id === n){                                                // cars.jsxi:14
				return _list[i];                                                   // cars.jsxi:15
			}
		}
		return null;
	};
	
	function registerTags(tags){                                                   // cars.jsxi:22
		tags.forEach(function (e){                                                 // cars.jsxi:23
			var l = e.toLowerCase();
			
			if (_tagsLower.indexOf(l) < 0){                                        // cars.jsxi:25
				_tags.push(e);                                                     // cars.jsxi:26
				_tagsLower.push(l);                                                // cars.jsxi:27
				mediator.dispatch('new.tag', e);                                   // cars.jsxi:29
			}
		});
	}
	
	function registerClass(className){                                             // cars.jsxi:34
		var l = className.toLowerCase();
		
		if (_classesLower.indexOf(l) < 0){                                         // cars.jsxi:36
			_classes.push(className);                                              // cars.jsxi:37
			_classesLower.push(l);                                                 // cars.jsxi:38
			mediator.dispatch('new.class', className);                             // cars.jsxi:40
		}
	}
	
	function registerBrand(brandName){                                             // cars.jsxi:44
		var l = brandName.toLowerCase();
		
		if (_brandsLower.indexOf(l) < 0){                                          // cars.jsxi:46
			_brands.push(brandName);                                               // cars.jsxi:47
			_brandsLower.push(l);                                                  // cars.jsxi:48
			mediator.dispatch('new.brand', brandName);                             // cars.jsxi:50
		}
	}
	
	Cars.scan = function (){                                                       // cars.jsxi:54
		mediator.dispatch('scan:start');                                           // cars.jsxi:55
		
		var names = {};
		
		_list = fs.readdirSync(AcDir.cars).map(function (e){                       // cars.jsxi:58
			return path.join(AcDir.cars, e);                                       // cars.jsxi:59
		}).concat(fs.readdirSync(AcDir.carsOff).map(function (e){                  // cars.jsxi:60
			return path.join(AcDir.carsOff, e);                                    // cars.jsxi:61
		})).map(function (carPath){                                                // cars.jsxi:62
			car = new Car(carPath);                                                // cars.jsxi:63
			
			if (names[car.id])                                                     // cars.jsxi:65
				return;
			
			mediator.dispatch('new.car', car);                                     // cars.jsxi:66
			names[car.id] = true;                                                  // cars.jsxi:67
			return car;                                                            // cars.jsxi:68
		}).filter(function (e){                                                    // cars.jsxi:69
			return e;                                                              // cars.jsxi:70
		});
		mediator.dispatch('scan:list', _list);                                     // cars.jsxi:73
		asyncLoad();                                                               // cars.jsxi:74
	};
	
	function asyncLoad(){                                                          // cars.jsxi:77
		var a = _list, i = 0;
		
		step();                                                                    // cars.jsxi:79
		
		function step(){                                                           // cars.jsxi:81
			if (a != _list){                                                       // cars.jsxi:82
				mediator.dispatch('scan:interrupt', a);                            // cars.jsxi:83
			} else if (i >= a.length){                                             // cars.jsxi:84
				mediator.dispatch('scan:ready', a);                                // cars.jsxi:85
			} else {
				mediator.dispatch('scan:progress', i, a.length);                   // cars.jsxi:87
				a[i ++].load(step);                                                // cars.jsxi:88
			}
		}
	}
	
	Cars.toggle = function (car, state){                                           // cars.jsxi:93
		car.toggle(state);                                                         // cars.jsxi:94
	};
	Cars.changeData = function (car, key, value){                                  // cars.jsxi:97
		car.changeData(key, value);                                                // cars.jsxi:98
	};
	Cars.changeDataSpecs = function (car, key, value){                             // cars.jsxi:101
		car.changeDataSpecs(key, value);                                           // cars.jsxi:102
	};
	Cars.changeParent = function (car, parentId){                                  // cars.jsxi:105
		car.changeParent(parentId);                                                // cars.jsxi:106
	};
	Cars.selectSkin = function (car, skinId){                                      // cars.jsxi:109
		car.selectSkin(skinId);                                                    // cars.jsxi:110
	};
	Cars.updateSkins = function (car){                                             // cars.jsxi:113
		car.updateSkins();                                                         // cars.jsxi:114
	};
	Cars.updateUpgrade = function (car){                                           // cars.jsxi:117
		car.updateUpgrade();                                                       // cars.jsxi:118
	};
	Cars.reload = function (car){                                                  // cars.jsxi:121
		car.load();                                                                // cars.jsxi:122
	};
	Cars.reloadAll = function (){                                                  // cars.jsxi:125
		Cars.scan();
	};
	Cars.save = function (car){                                                    // cars.jsxi:129
		car.save();                                                                // cars.jsxi:130
	};
	Cars.saveAll = function (){                                                    // cars.jsxi:133
		_list.forEach(function (car){                                              // cars.jsxi:134
			if (car.changed){                                                      // cars.jsxi:135
				car.save();                                                        // cars.jsxi:136
			}
		});
	};
	
	/* Class "Car" declaration */
	function Car(carPath){                                                         // cars_car.jsxi:2
		this.error = [];
		this.changed = false;
		this.parent = null;
		this.children = [];
		this.id = carPath.slice(Math.max(carPath.lastIndexOf('/'), carPath.lastIndexOf('\\')) + 1);
		this.path = carPath;                                                       // cars_car.jsxi:23
		this.disabled = carPath.indexOf(AcDir.carsOff) != - 1;                     // cars_car.jsxi:25
	}
	Car.prototype.__Car_addError = function (id, msg, details){                    // cars_car.jsxi:28
		this.error.push({ id: id, msg: msg, details: details });                   // cars_car.jsxi:29
	};
	Car.prototype.hasError = function (id){                                        // cars_car.jsxi:32
		for (var __0 = 0; __0 < this.error.length; __0 ++){
			var e = this.error[__0];
			
			if (e.id === id)                                                       // cars_car.jsxi:34
				return true;
		}
		return false;
	};
	Car.prototype.toggle = function (state){                                       // cars_car.jsxi:40
		var __that = this, 
			d = state == null ? !this.disabled : !state;                           // cars_car.jsxi:41
		
		if (this.disabled == d)                                                    // cars_car.jsxi:42
			return;
		
		var a, b;
		
		if (d){                                                                    // cars_car.jsxi:45
			a = AcDir.cars, b = AcDir.carsOff;
		} else {
			a = AcDir.carsOff, b = AcDir.cars;
		}
		
		var newPath = this.path.replace(a, b);
		
		try {
			fs.renameSync(this.path, newPath);                                     // cars_car.jsxi:53
		} catch (err){                                                             // cars_car.jsxi:54
			ErrorHandler.handled('Cannot change car state.', err);                 // cars_car.jsxi:55
			return;
		} 
		
		this.disabled = d;                                                         // cars_car.jsxi:59
		this.path = newPath;                                                       // cars_car.jsxi:60
		
		if (this.skins){
			this.skins.forEach(function (e){                                       // cars_car.jsxi:62
				for (var n in e){                                                  // cars_car.jsxi:63
					if (typeof e[n] === 'string'){                                 // cars_car.jsxi:64
						e[n] = e[n].replace(a, b);                                 // cars_car.jsxi:65
					}
				}
			});
		}
		
		mediator.dispatch('update.car.disabled', this);                            // cars_car.jsxi:71
		mediator.dispatch('update.car.path', this);                                // cars_car.jsxi:72
		mediator.dispatch('update.car.skins', this);                               // cars_car.jsxi:73
		
		if (this.parent && !this.disabled && this.parent.disabled){                // cars_car.jsxi:75
			Cars.toggle(this.parent, 
				true);
		}
		
		this.children.forEach(function (e){                                        // cars_car.jsxi:79
			Cars.toggle(e, !__that.disabled);
		});
	};
	Car.prototype.changeData = function (key, value){                              // cars_car.jsxi:84
		if (!this.data || this.data[key] == value)                                 // cars_car.jsxi:85
			return;
		
		this.data[key] = value;                                                    // cars_car.jsxi:87
		this.changed = true;
		
		if (key === 'tags'){                                                       // cars_car.jsxi:90
			registerTags(value);                                                   // cars_car.jsxi:91
		}
		
		if (key === 'brand'){                                                      // cars_car.jsxi:94
			registerBrand(value);                                                  // cars_car.jsxi:95
		}
		
		if (key === 'class'){                                                      // cars_car.jsxi:98
			registerClass(value);                                                  // cars_car.jsxi:99
		}
		
		if (Settings.get('uploadData')){                                           // cars_car.jsxi:102
			AppServerRequest.sendData(this.id, key, value);                        // cars_car.jsxi:103
		}
		
		mediator.dispatch('update.car.data:' + key, this);                         // cars_car.jsxi:106
		mediator.dispatch('update.car.changed', this);                             // cars_car.jsxi:107
	};
	Car.prototype.changeDataSpecs = function (key, value){                         // cars_car.jsxi:110
		if (!this.data || this.data.specs[key] == value)                           // cars_car.jsxi:111
			return;
		
		this.data.specs[key] = value;                                              // cars_car.jsxi:113
		this.changed = true;
		
		if (Settings.get('uploadData')){                                           // cars_car.jsxi:116
			AppServerRequest.sendData(this.id, 'specs:' + key, value);             // cars_car.jsxi:117
		}
		
		mediator.dispatch('update.car.data', this);                                // cars_car.jsxi:120
		mediator.dispatch('update.car.changed', this);                             // cars_car.jsxi:121
	};
	Car.prototype.changeParent = function (parentId){                              // cars_car.jsxi:124
		if (!this.data || this.parent && this.parent.id == parentId || !this.parent && parentId == null)
			return;
		
		if (this.parent){
			this.parent.children.splice(this.parent.children.indexOf(this), 1);    // cars_car.jsxi:128
			mediator.dispatch('update.car.children', this.parent);                 // cars_car.jsxi:129
		}
		
		if (parentId){                                                             // cars_car.jsxi:132
			var par = Cars.byName(parentId);
			
			if (!par)                                                              // cars_car.jsxi:134
				throw new Error('Parent car "' + parentId + '" not found');        // cars_car.jsxi:134
			
			this.parent = par;                                                     // cars_car.jsxi:136
			this.parent.children.push(this);                                       // cars_car.jsxi:137
			mediator.dispatch('update.car.parent', this);                          // cars_car.jsxi:138
			mediator.dispatch('update.car.children', this.parent);                 // cars_car.jsxi:139
			this.data.parent = this.parent.id;                                     // cars_car.jsxi:141
			mediator.dispatch('update.car.data', this);                            // cars_car.jsxi:142
		} else {
			this.parent = null;
			mediator.dispatch('update.car.parent', this);                          // cars_car.jsxi:145
			delete this.data.parent;                                               // cars_car.jsxi:147
			mediator.dispatch('update.car.data', this);                            // cars_car.jsxi:148
		}
		
		this.changed = true;
		mediator.dispatch('update.car.changed', this);                             // cars_car.jsxi:152
	};
	Car.prototype.selectSkin = function (skinId){                                  // cars_car.jsxi:155
		var newSkin = this.skins.filter(function (e){                              // cars_car.jsxi:156
			return e.id == skinId;                                                 // cars_car.jsxi:157
		})[0];
		
		if (newSkin == this.skins.selected)                                        // cars_car.jsxi:160
			return;
		
		this.skins.selected = newSkin;                                             // cars_car.jsxi:162
		mediator.dispatch('update.car.skins', this);                               // cars_car.jsxi:163
	};
	Car.prototype.updateSkins = function (){                                       // cars_car.jsxi:166
		gui.App.clearCache();                                                      // cars_car.jsxi:167
		setTimeout((function (){                                                   // cars_car.jsxi:168
			mediator.dispatch('update.car.skins', this);                           // cars_car.jsxi:169
		}).bind(this),                                                             // cars_car.jsxi:170
		100);
	};
	Car.prototype.updateUpgrade = function (){                                     // cars_car.jsxi:173
		gui.App.clearCache();                                                      // cars_car.jsxi:174
		setTimeout((function (){                                                   // cars_car.jsxi:175
			mediator.dispatch('update.car.data', this);                            // cars_car.jsxi:176
		}).bind(this),                                                             // cars_car.jsxi:177
		100);
	};
	Car.prototype.save = function (){                                              // cars_car.jsxi:180
		if (this.data){
			var p = Object.clone(this.data);
			
			p.description = p.description.replace(/\n/g, '<br>');                  // cars_car.jsxi:183
			p.class = p.class.toLowerCase();                                       // cars_car.jsxi:184
			fs.writeFileSync(this.json,                                            // cars_car.jsxi:185
				JSON.stringify(p, null, 
					4));                                                           // cars_car.jsxi:185
			this.changed = false;
			mediator.dispatch('update.car.changed', this);                         // cars_car.jsxi:187
		}
	};
	Car.prototype.loadBadge = function (callback){                                 // cars_car_load.jsxi:3
		var __that = this;
		
		fs.exists(this.badge,                                                      // cars_car_load.jsxi:4
			(function (result){                                                    // cars_car_load.jsxi:4
				if (!result){                                                      // cars_car_load.jsxi:5
					__that.error.push({ id: 'badge-missing', msg: 'Missing badge.png' });
					mediator.dispatch('error', this);                              // cars_car_load.jsxi:7
				}
				
				if (callback)                                                      // cars_car_load.jsxi:10
					callback();                                                    // cars_car_load.jsxi:10
			}).bind(this));                                                        // cars_car_load.jsxi:11
	};
	Car.prototype.loadSkins = function (callback){                                 // cars_car_load.jsxi:14
		var __that = this;
		
		fs.readdir(this.path + '/skins',                                           // cars_car_load.jsxi:15
			(function (err, result){                                               // cars_car_load.jsxi:15
				__that.skins = false;
				
				if (err){                                                          // cars_car_load.jsxi:18
					__that.error.push({ id: 'skins-access', msg: 'Cannot access skins', details: err });
					mediator.dispatch('error', this);                              // cars_car_load.jsxi:20
				} else {
					result = result.filter(function (e){                           // cars_car_load.jsxi:22
						return fs.statSync(__that.path + '/skins/' + e).isDirectory();
					});
					
					if (__that.skins.length === 0){                                // cars_car_load.jsxi:26
						__that.error.push({ id: 'skins-empty', msg: 'Skins folder is empty' });
						mediator.dispatch('error', this);                          // cars_car_load.jsxi:28
					} else {
						__that.skins = result.map(function (e){                    // cars_car_load.jsxi:30
							var p = __that.path + '/skins/' + e;
							return {
								id: e,                                             // cars_car_load.jsxi:33
								path: p,                                           // cars_car_load.jsxi:34
								livery: p + '/livery.png',                         // cars_car_load.jsxi:35
								preview: p + '/preview.jpg'
							};
						});
						__that.skins.selected = __that.skins[0];                   // cars_car_load.jsxi:40
						mediator.dispatch('update.car.skins', this);               // cars_car_load.jsxi:41
					}
				}
				
				if (callback)                                                      // cars_car_load.jsxi:45
					callback();                                                    // cars_car_load.jsxi:45
			}).bind(this));                                                        // cars_car_load.jsxi:46
	};
	Car.prototype.loadData = function (callback){                                  // cars_car_load.jsxi:49
		var __that = this;
		
		if (!fs.existsSync(this.json)){                                            // cars_car_load.jsxi:50
			if (fs.existsSync(this.json + '.disabled')){                           // cars_car_load.jsxi:51
				fs.renameSync(this.json + '.disabled', this.json);                 // cars_car_load.jsxi:52
			} else {
				if (this.changed){
					this.changed = false;
					mediator.dispatch('update.car.changed', this);                 // cars_car_load.jsxi:56
				}
				
				this.data = false;
				this.error.push({ id: 'json-missing', msg: 'Missing ui_car.json' });
				mediator.dispatch('error', this);                                  // cars_car_load.jsxi:61
				mediator.dispatch('update.car.data', this);                        // cars_car_load.jsxi:62
				
				if (callback)                                                      // cars_car_load.jsxi:63
					callback();                                                    // cars_car_load.jsxi:63
				return;
			}
		}
		
		fs.readFile(this.json,                                                     // cars_car_load.jsxi:68
			(function (err, result){                                               // cars_car_load.jsxi:68
				if (__that.changed){
					__that.changed = false;
					mediator.dispatch('update.car.changed', this);                 // cars_car_load.jsxi:71
				}
				
				if (err){                                                          // cars_car_load.jsxi:74
					__that.data = false;
					__that.error.push({                                            // cars_car_load.jsxi:76
						id: 'json-read',                                           // cars_car_load.jsxi:76
						msg: 'Unavailable ui_car.json',                            // cars_car_load.jsxi:76
						details: err
					});
					mediator.dispatch('error', this);                              // cars_car_load.jsxi:77
				} else {
					var dat;
					
					try {
						eval('dat=' + result.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g, 
							function (_){                                          // cars_car_load.jsxi:81
								return _.replace(/\r?\n/g, '\\n');                 // cars_car_load.jsxi:82
							}));
					} catch (er){                                                  // cars_car_load.jsxi:84
						err = er;                                                  // cars_car_load.jsxi:85
					} 
					
					__that.data = false;
					
					if (err || !dat){                                              // cars_car_load.jsxi:89
						__that.error.push({ id: 'json-parse', msg: 'Damaged ui_car.json', details: err });
						mediator.dispatch('error', this);                          // cars_car_load.jsxi:91
					} else if (!dat.name){                                         // cars_car_load.jsxi:92
						__that.error.push({ id: 'data-name', msg: 'Name is missing' });
						mediator.dispatch('error', this);                          // cars_car_load.jsxi:94
					} else if (!dat.brand){                                        // cars_car_load.jsxi:95
						__that.error.push({ id: 'data-brand', msg: 'Brand is missing' });
						mediator.dispatch('error', this);                          // cars_car_load.jsxi:97
					} else {
						__that.data = dat;                                         // cars_car_load.jsxi:99
						
						if (!__that.data.description)                              // cars_car_load.jsxi:100
							__that.data.description = '';                          // cars_car_load.jsxi:100
						
						if (!__that.data.tags)                                     // cars_car_load.jsxi:101
							__that.data.tags = [];                                 // cars_car_load.jsxi:101
						
						if (!__that.data.specs)                                    // cars_car_load.jsxi:102
							__that.data.specs = {};                                // cars_car_load.jsxi:102
						
						__that.data.class = __that.data.class || '';               // cars_car_load.jsxi:104
						__that.data.description = __that.data.description.replace(/\n/g, ' ').replace(/<\/?br\/?>[ \t]*|\n[ \t]+/g, '\n').replace(/<\s*\/?\s*\w+\s*>/g, '').replace(/[\t ]+/g, ' ');
						
						if (__that.data.parent != null){                           // cars_car_load.jsxi:108
							if (__that.data.parent == __that.id){                  // cars_car_load.jsxi:109
								__that.error.push({ id: 'parent-wrong', msg: 'Parent is child' });
							} else {
								var par = Cars.byName(__that.data.parent);
								
								if (par == null){                                  // cars_car_load.jsxi:114
									__that.error.push({ id: 'parent-missing', msg: 'Parent is missing' });
								} else {
									__that.parent = par;                           // cars_car_load.jsxi:117
									__that.parent.children.push(this);             // cars_car_load.jsxi:118
									mediator.dispatch('update.car.parent', this);
									mediator.dispatch('update.car.children', __that.parent);
								}
								
								if (!fs.existsSync(__that.upgrade)){               // cars_car_load.jsxi:124
									__that.error.push({ id: 'upgrade-missing', msg: 'Missing upgrade.png' });
									mediator.dispatch('error', this);              // cars_car_load.jsxi:126
								}
							}
						}
						
						registerTags(__that.data.tags);                            // cars_car_load.jsxi:131
						registerClass(__that.data.class);                          // cars_car_load.jsxi:132
						registerBrand(__that.data.brand);                          // cars_car_load.jsxi:133
					}
				}
				
				mediator.dispatch('update.car.data', this);                        // cars_car_load.jsxi:137
				
				if (callback)                                                      // cars_car_load.jsxi:138
					callback();                                                    // cars_car_load.jsxi:138
			}).bind(this));                                                        // cars_car_load.jsxi:139
	};
	Car.prototype.load = function (callback){                                      // cars_car_load.jsxi:142
		this.error = [];
		this.loadBadge();
		this.loadSkins();
		this.loadData(callback);
	};
	Object.defineProperty(Car.prototype, 
		'json', 
		{
			get: (function (){
				return this.path + '/ui/ui_car.json';
			})
		});
	Object.defineProperty(Car.prototype, 
		'badge', 
		{
			get: (function (){
				return this.path + '/ui/badge.png';
			})
		});
	Object.defineProperty(Car.prototype, 
		'upgrade', 
		{
			get: (function (){
				return this.path + '/ui/upgrade.png';
			})
		});
	Object.defineProperty(Car.prototype, 
		'displayName', 
		{
			get: (function (){
				return this.data && this.data.name || this.id;                     // cars_car.jsxi:10
			})
		});
	
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'list', 
		{
			get: (function (){
				return _list;                                                      // cars.jsxi:141
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'brands', 
		{
			get: (function (){
				return _brands;                                                    // cars.jsxi:142
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'classes', 
		{
			get: (function (){
				return _classes;                                                   // cars.jsxi:143
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'tags', 
		{
			get: (function (){
				return _tags;                                                      // cars.jsxi:144
			})
		});
	(function (){                                                                  // cars.jsxi:146
		mediator.extend(Cars);                                                     // cars.jsxi:147
	})();
	return Cars;
})();

;

;

/* Class "CheckUpdate" declaration */
var CheckUpdate = (function (){                                                    // check_update.jsxi:1
	var CheckUpdate = function (){}, 
		mediator = new Mediator(),                                                 // check_update.jsxi:2
		_updateFile = path.join(path.dirname(process.execPath), 'carsmgr_update.next'), 
		_details = 'https://ascobash.wordpress.com/2015/06/14/actools-uijson/',    // check_update.jsxi:5
		_updateInProcess;                                                          // check_update.jsxi:48
	
	function isInstallableYadisk(link){                                            // check_update.jsxi:7
		return /^https:\/\/yadi.sk\/d\/\w+/.test(link);                            // check_update.jsxi:8
	}
	
	function isInstallableRd(link){                                                // check_update.jsxi:11
		return /^http:\/\/www.racedepartment.com\/downloads\//.test(link);         // check_update.jsxi:12
	}
	
	function isInstallable(link){                                                  // check_update.jsxi:15
		return isInstallableYadisk(link) || isInstallableRd(link);                 // check_update.jsxi:16
	}
	
	CheckUpdate.check = function (c){                                              // check_update.jsxi:19
		mediator.dispatch('check:start');                                          // check_update.jsxi:20
		AppServerRequest.checkUpdate(gui.App.manifest.version,                     // check_update.jsxi:22
			Settings.get('updatesSource', 'stable'),                               // check_update.jsxi:24
			function (err, data){                                                  // check_update.jsxi:25
				if (err){                                                          // check_update.jsxi:26
					console.warn(err);                                             // check_update.jsxi:27
					mediator.dispatch('check:failed');                             // check_update.jsxi:28
					return;
				}
				
				if (data){                                                         // check_update.jsxi:32
					mediator.dispatch('update',                                    // check_update.jsxi:33
						{
							actualVersion: data.version,                           // check_update.jsxi:34
							changelog: data.changes,                               // check_update.jsxi:35
							detailsUrl: _details,                                  // check_update.jsxi:36
							downloadUrl: data.url,                                 // check_update.jsxi:37
							installUrl: data.download || isInstallable(data.url) && data.url
						});
					mediator.dispatch('check:done:found');                         // check_update.jsxi:41
				} else {
					mediator.dispatch('check:done');                               // check_update.jsxi:43
				}
			});
	};
	
	function httpDownload(url, file, callback, progressCallback){                  // check_update.jsxi:49
		try {
			if (typeof file === 'string'){                                         // check_update.jsxi:51
				file = fs.createWriteStream(file);                                 // check_update.jsxi:52
			}
			
			_updateInProcess = require(url.match(/^https?/)[0]).get(url,           // check_update.jsxi:55
				function (r){                                                      // check_update.jsxi:55
					if (r.statusCode == 302){                                      // check_update.jsxi:56
						httpDownload(r.headers['location'], file, callback, progressCallback);
					} else if (r.statusCode == 200){                               // check_update.jsxi:58
						var m = r.headers['content-length'], p = 0;
						
						r.pipe(file);                                              // check_update.jsxi:60
						r.on('data',                                               // check_update.jsxi:61
							function (d){                                          // check_update.jsxi:61
								progressCallback(p += d.length, m);                // check_update.jsxi:62
							}).on('end',                                           // check_update.jsxi:63
							function (){                                           // check_update.jsxi:63
								if (_updateInProcess){                             // check_update.jsxi:64
									_updateInProcess = null;                       // check_update.jsxi:65
									setTimeout(callback, 50);                      // check_update.jsxi:66
								}
							});
					} else {
						callback(r.statusCode);                                    // check_update.jsxi:70
					}
				}).on('error',                                                     // check_update.jsxi:72
				function (e){                                                      // check_update.jsxi:72
					callback(e);                                                   // check_update.jsxi:73
				});
		} catch (e){                                                               // check_update.jsxi:75
			callback('DOWNLOAD:' + url);                                           // check_update.jsxi:76
		} 
	}
	
	function yadiskDownload(url, dest, callback, progressCallback){                // check_update.jsxi:80
		_updateInProcess = true;                                                   // check_update.jsxi:81
		
		var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load',    // check_update.jsxi:82
			function (e){                                                          // check_update.jsxi:82
				if (!_updateInProcess)                                             // check_update.jsxi:83
					return;
				
				this.contentWindow._cb = function (e){                             // check_update.jsxi:85
					if (!_updateInProcess)                                         // check_update.jsxi:86
						return;
					
					try {
						clearTimeout(to);                                          // check_update.jsxi:88
						httpDownload(e.models[0].data.file, dest, callback, progressCallback);
					} catch (e){
						callback('YADISK');                                        // check_update.jsxi:90
					} 
					
					ifr.remove();                                                  // check_update.jsxi:91
				};
				this.contentWindow.eval("\t\t\t\t\t \n_XMLHttpRequest = XMLHttpRequest;\nXMLHttpRequest = function (){\n\tvar r = new _XMLHttpRequest();\n\tr.onreadystatechange = function (e){\n\t\tif (r.status == 200 && r.readyState == 4)\n\t\t\t_cb(JSON.parse(r.responseText));\n\t};\n\treturn {\n\t\topen: function (){ r.open.apply(r, arguments); },\n\t\tsetRequestHeader: function (){ r.setRequestHeader.apply(r, arguments); },\n\t\tgetAllResponseHeaders: function (){ r.getAllResponseHeaders.apply(r, arguments); },\n\t\tgetResponseHeader: function (){ r.getResponseHeader.apply(r, arguments); },\n\t\tabort: function (){ r.abort.apply(r, arguments); },\n\t\tsend: function (){ r.send.apply(r, arguments); },\n\t};\n};");
				
				try {
					this.contentWindow.document.querySelector('button[data-click-action="resource.download"]').click();
				} catch (e){
					ifr.remove();                                                  // check_update.jsxi:113
					callback('YADISK:BTN');                                        // check_update.jsxi:114
				} 
			}).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');
		
		var to = setTimeout(function (){                                           // check_update.jsxi:118
			if (!_updateInProcess)                                                 // check_update.jsxi:119
				return;
			
			ifr.remove();                                                          // check_update.jsxi:120
			callback('YADISK:TO');                                                 // check_update.jsxi:121
		}, 
		10e3);
	}
	
	function rdDownload(url, dest, callback, progressCallback){                    // check_update.jsxi:125
		_updateInProcess = true;                                                   // check_update.jsxi:126
		
		var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load',    // check_update.jsxi:127
			function (e){                                                          // check_update.jsxi:127
				if (!_updateInProcess)                                             // check_update.jsxi:128
					return;
				
				try {
					clearTimeout(to);                                              // check_update.jsxi:131
					httpDownload(this.contentWindow.document.querySelector('.downloadButton a').href, 
						dest,                                                      // check_update.jsxi:132
						callback,                                                  // check_update.jsxi:132
						progressCallback);                                         // check_update.jsxi:132
				} catch (e){                                                       // check_update.jsxi:133
					ifr.remove();                                                  // check_update.jsxi:134
					callback('RD:BTN');                                            // check_update.jsxi:135
				} 
			}).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');
		
		var to = setTimeout(function (){                                           // check_update.jsxi:139
			if (!_updateInProcess)                                                 // check_update.jsxi:140
				return;
			
			ifr.remove();                                                          // check_update.jsxi:141
			callback('RD:TO');                                                     // check_update.jsxi:142
		}, 
		10e3);
	}
	
	function download(url, dest, callback, progressCallback){                      // check_update.jsxi:146
		if (isInstallableYadisk(url))                                              // check_update.jsxi:147
			yadiskDownload(url, dest, callback, progressCallback);                 // check_update.jsxi:147
		else if (isInstallableRd(url))                                             // check_update.jsxi:148
			rdDownload(url, dest, callback, progressCallback);                     // check_update.jsxi:148
		else
			httpDownload(url, dest, callback, progressCallback);                   // check_update.jsxi:149
	}
	
	CheckUpdate.install = function (url){                                          // check_update.jsxi:152
		mediator.dispatch('install:start');                                        // check_update.jsxi:153
		download(url,                                                              // check_update.jsxi:154
			_updateFile + '~tmp',                                                  // check_update.jsxi:154
			function (error){                                                      // check_update.jsxi:154
				if (error){                                                        // check_update.jsxi:155
					_updateInProcess = null;                                       // check_update.jsxi:156
					mediator.dispatch('install:failed', error);                    // check_update.jsxi:157
				} else {
					fs.renameSync(_updateFile + '~tmp', _updateFile);              // check_update.jsxi:159
					mediator.dispatch('install:ready');                            // check_update.jsxi:160
				}
			}, 
			function (p, m){                                                       // check_update.jsxi:162
				mediator.dispatch('install:progress', p, m);                       // check_update.jsxi:163
			});
	};
	CheckUpdate.abort = function (){                                               // check_update.jsxi:167
		if (_updateInProcess.abort)                                                // check_update.jsxi:168
			_updateInProcess.abort();                                              // check_update.jsxi:168
		
		_updateInProcess = null;                                                   // check_update.jsxi:169
		mediator.dispatch('install:interrupt');                                    // check_update.jsxi:170
		setTimeout(function (arg){                                                 // check_update.jsxi:172
			try {
				fs.unlinkSync(_updateFile + '~tmp');                               // check_update.jsxi:173
			} catch (e){} 
		}, 
		500);
	};
	CheckUpdate.autoupdate = function (){                                          // check_update.jsxi:177
		function clearDir(dirPath){                                                // check_update.jsxi:178
			try {
				var files = fs.readdirSync(dirPath);
			} catch (e){
				return;
			} 
			
			for (var i = 0; i < files.length; i ++){                               // check_update.jsxi:182
				var filePath = dirPath + '/' + files[i];
				
				if (fs.statSync(filePath).isFile()){                               // check_update.jsxi:184
					fs.unlinkSync(filePath);                                       // check_update.jsxi:185
				} else {
					clearDir(filePath);                                            // check_update.jsxi:187
					fs.rmdirSync(filePath);                                        // check_update.jsxi:188
				}
			}
		}
		
		;
		
		try {
			if (fs.existsSync(_updateFile)){                                       // check_update.jsxi:194
				var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
				
				if (fs.existsSync(d)){                                             // check_update.jsxi:196
					clearDir(d);                                                   // check_update.jsxi:197
				} else {
					fs.mkdirSync(d);                                               // check_update.jsxi:199
				}
				
				AcTools.Utils.FileUtils.Unzip(_updateFile, d);                     // check_update.jsxi:202
				
				var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
				
				fs.writeFileSync(b,                                                // check_update.jsxi:205
					"\t\t\t\t \n@ECHO OFF\n\nCD %~dp0\nTASKKILL /F /IM carsmgr.exe\n\n:CHECK_EXECUTABLE\nIF NOT EXIST carsmgr.exe GOTO EXECUTABLE_REMOVED\n\nDEL carsmgr.exe\nTIMEOUT /T 1 >nul\n\nGOTO CHECK_EXECUTABLE\n:EXECUTABLE_REMOVED\n\nDEL nw.pak icudtl.dat carsmgr.exe\n\nfor /r %%i in (carsmgr_update~next\\*) do MOVE /Y \"%%i\" %%~nxi\nRMDIR /S /Q carsmgr_update~next\n\nstart carsmgr.exe\n\nDEL %0 carsmgr_update.next".replace(/\n/g, '\r\n'));
				Shell.openItem(b);                                                 // check_update.jsxi:228
				gui.App.quit();                                                    // check_update.jsxi:229
			}
		} catch (e){                                                               // check_update.jsxi:231
			mediator.dispatch('autoupdate:failed', e);                             // check_update.jsxi:232
			
			try {
				if (fs.existsSync(_updateFile)){                                   // check_update.jsxi:234
					fs.unlinkSync(_updateFile);                                    // check_update.jsxi:235
				}
			} catch (e){} 
			
			try {
				var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
				
				if (fs.existsSync(d)){                                             // check_update.jsxi:240
					clearDir(d);                                                   // check_update.jsxi:241
					fs.rmdirSync(d);                                               // check_update.jsxi:242
				}
			} catch (e){} 
			
			try {
				var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
				
				if (fs.existsSync(b)){                                             // check_update.jsxi:248
					fs.unlinkSync(b);                                              // check_update.jsxi:249
				}
			} catch (e){} 
		} 
	};
	(function (){                                                                  // check_update.jsxi:255
		CheckUpdate.autoupdate();
		mediator.extend(CheckUpdate);                                              // check_update.jsxi:257
	})();
	return CheckUpdate;
})();

/* Class "Datalists" declaration */
var Datalists = (function (){                                                      // datalists.jsxi:1
	var Datalists = function (){}, 
		datalists = {};
	
	function create(id){                                                           // datalists.jsxi:4
		datalists[id] = document.createElement('datalist');                        // datalists.jsxi:5
		document.body.appendChild(datalists[id]);                                  // datalists.jsxi:6
		datalists[id].id = id;                                                     // datalists.jsxi:7
	}
	
	function add(id, v){                                                           // datalists.jsxi:10
		datalists[id].appendChild(document.createElement('option')).setAttribute('value', v);
	}
	
	(function (){                                                                  // datalists.jsxi:14
		create('tags');                                                            // datalists.jsxi:15
		create('brands');                                                          // datalists.jsxi:16
		create('classes');                                                         // datalists.jsxi:17
		Cars.on('new.tag', add.bind(null, 'tags')).on('new.brand', add.bind(null, 'brands')).on('new.class', add.bind(null, 'classes'));
	})();
	return Datalists;
})();

/* Class "Settings" declaration */
var Settings = (function (){                                                       // settings.jsxi:1
	var Settings = function (){}, 
		_settings,                                                                 // settings.jsxi:2
		_defaults = {                                                              // settings.jsxi:4
			disableTips: false,                                                    // settings.jsxi:4
			updateDatabase: true,                                                  // settings.jsxi:6
			uploadData: false,                                                     // settings.jsxi:7
			updatesCheck: true,                                                    // settings.jsxi:8
			updatesSource: 'stable',                                               // settings.jsxi:9
			aptShowroom: '',                                                       // settings.jsxi:11
			aptFilter: 'S1-Dynamic',                                               // settings.jsxi:12
			aptResize: true,                                                       // settings.jsxi:13
			aptDisableSweetFx: true,                                               // settings.jsxi:14
			aptCameraX: - 140,                                                     // settings.jsxi:15
			aptCameraY: 36,                                                        // settings.jsxi:16
			aptIncreaseDelays: false
		};
	
	function save(){                                                               // settings.jsxi:22
		localStorage.settings = JSON.stringify(_settings);                         // settings.jsxi:23
	}
	
	Settings.get = function (k){                                                   // settings.jsxi:26
		return _settings.hasOwnProperty(k) ? _settings[k] : _defaults[k];          // settings.jsxi:27
	};
	Settings.set = function (k, val){                                              // settings.jsxi:30
		if (typeof k == 'object'){                                                 // settings.jsxi:31
			for (var n in k){                                                      // settings.jsxi:32
				_settings[n] = k[n];                                               // settings.jsxi:33
			}
		} else {
			_settings[k] = val;                                                    // settings.jsxi:36
		}
		
		save();                                                                    // settings.jsxi:39
	};
	Settings.update = function (f){                                                // settings.jsxi:42
		f(_settings);                                                              // settings.jsxi:43
		save();                                                                    // settings.jsxi:44
	};
	Object.defineProperty(Settings,                                                // settings.jsxi:1
		'defaults', 
		{
			get: (function (){
				return _defaults;                                                  // settings.jsxi:20
			})
		});
	(function (){                                                                  // settings.jsxi:47
		_settings = {};                                                            // settings.jsxi:48
		
		try {
			_settings = JSON.parse(localStorage.settings) || {};                   // settings.jsxi:51
		} catch (e){} 
	})();
	return Settings;
})();

/* Class "Tips" declaration */
var Tips = (function (){                                                           // tips.jsxi:1
	var Tips = function (){}, 
		_t = [                                                                     // tips.jsxi:2
			"Use double click on skin preview to view it in showroom. If launch failed, maybe car is broken.", 
			"Press RMB to open controls bar. Some buttons have additional options.", 
			"Select found text in built-in browser and press “OK” to apply it as new description.", 
			"Don't forget to save changes (Ctrl+S). Use “Reload” button if you want to discard them.", 
			"If you want to practice, AcTools Ui Json will be much faster than original Launcher.", 
			"Make double click on PW-ratio to recalculate it using BHP and Weight.", 
			"Native-looking <b>Upgrade Icons</b> requires font “Consolas”, which is included from Windows Vista.\nSo, if your OS is something like XP, please, install it manually.", 
			"<b>Auto-update Preview</b> could produce super-native looking previews, but sadly sometimes not from the first time.", 
			"Before using <b>Auto-update Preview</b> please disable all graphics mods (such as SweetFX).\nWe want original-looking screenshots, don't we?", 
			"Use manual skin previews auto-update to control camera position.\nIn manual skin previews auto-update press F8 when camera position is adjusted.", 
			"Press Esc to abort <b>Auto-update Preview</b>.",                      // tips.jsxi:2
			"If you want to use <b>Quick Practive</b>, make sure AcTools Ui Json has access to rename <a href=\"#\" onclick=\"Shell.showItemInFolder(path.join(AcDir.root,'AssettoCorsa.exe'))\"><i>AssettoCorsa.exe</i></a>.\nJust open file properties and edit permissions on the Security tab. Or you can run AcTools Ui Json as Administrator.\nBut it's a terrible way", 
			"<b>Auto-update Preview</b> requires access to <a href=\"#\" onclick=\"Shell.showItemInFolder(path.join(AcDir.root,'content/gui/logo_ac_app.png'))\"><i>content\\\\gui\\\\logo_ac_app.png</i></a>. Don't worry, it'll revert back all changes.", 
			""
		], 
		_i = _t.length * Math.random() | 0;                                        // tips.jsxi:4
	
	Object.defineProperty(Tips,                                                    // tips.jsxi:1
		'next', 
		{
			get: (function (){
				return _t[++ _i % _t.length];                                      // tips.jsxi:5
			})
		});
	return Tips;
})();

/* Class "SearchProvider" declaration */
function SearchProvider(car){                                                      // update_description.jsxi:1
	if (this.constructor === SearchProvider)
		throw new Error('Trying to instantiate abstract class SearchProvider');
	
	this.___car = car;                                                             // update_description.jsxi:5
}
SearchProvider.prototype.prepare = function (s){                                   // update_description.jsxi:11
	return s.replace(/\[(?:\d+|citation needed)\]/g, '');                          // update_description.jsxi:12
};
SearchProvider.prototype.clearUp = function (w){};
Object.defineProperty(SearchProvider.prototype, 
	'userAgent', 
	{
		get: (function (){
			return 'Mozilla/5.0 (Linux; Android 2.3) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36';
		})
	});

/* Class "GoogleSearchProvider" declaration */
function GoogleSearchProvider(){                                                   // update_description.jsxi:18
	SearchProvider.apply(this, 
		arguments);
}
__prototypeExtend(GoogleSearchProvider, 
	SearchProvider);
GoogleSearchProvider.prototype.clearUp = function (w){                             // update_description.jsxi:21
	$('#before-appbar, #fbarcnt', w.document).remove();                            // update_description.jsxi:22
	$('a[target="_blank"]', w.document).removeAttr('target');                      // update_description.jsxi:23
};
Object.defineProperty(GoogleSearchProvider.prototype, 
	'url', 
	{
		get: (function (){
			return 'https://www.google.com/search?q=' + encodeURIComponent(this.___car.data.name);
		})
	});

/* Class "WikiSearchProvider" declaration */
function WikiSearchProvider(){                                                     // update_description.jsxi:27
	SearchProvider.apply(this, 
		arguments);
}
__prototypeExtend(WikiSearchProvider, 
	SearchProvider);
Object.defineProperty(WikiSearchProvider.prototype, 
	'url', 
	{
		get: (function (){
			return 'http://en.wikipedia.org/w/index.php?search=' + encodeURIComponent(this.___car.data.name);
		})
	});

/* Class "UpdateDescription" declaration */
function UpdateDescription(){}
UpdateDescription.update = function (car){                                         // update_description.jsxi:32
	provider = new GoogleSearchProvider(car);                                      // update_description.jsxi:33
	
	var dialog = new Dialog('Update Description',                                  // update_description.jsxi:35
		[
			'<iframe nwdisable nwfaketop nwUserAgent="{0}" src="{1}"></iframe>'.format(provider.userAgent, provider.url)
		], 
		function (){                                                               // update_description.jsxi:37
			if (s){                                                                // update_description.jsxi:38
				Cars.changeData(car, 'description', provider.prepare(s));          // update_description.jsxi:39
			}
		});
	
	var s;
	
	dialog.find('iframe').on('load popstate',                                      // update_description.jsxi:44
		function (){                                                               // update_description.jsxi:44
			var w = this.contentWindow;
			
			provider.clearUp(w);                                                   // update_description.jsxi:46
			$('body', w.document).on('mouseup keydown keyup mousemove',            // update_description.jsxi:47
				function (e){                                                      // update_description.jsxi:47
					s = w.getSelection().toString();                               // update_description.jsxi:48
				});
		});
	
	var t = $('<div>' + '<button id="button-back">←</button> ' + '<button id="button-external">↑</button>' + '</div>').insertBefore(dialog.header);
	
	t.find('#button-back').click(function (){                                      // update_description.jsxi:57
		dialog.find('iframe')[0].contentWindow.history.back();                     // update_description.jsxi:58
	});
	t.find('#button-external').click(function (){                                  // update_description.jsxi:61
		Shell.openItem(dialog.find('iframe')[0].contentWindow.location.href);      // update_description.jsxi:62
	});
};

/* Class "UpgradeEditor" declaration */
var UpgradeEditor = (function (){                                                  // upgrade_editor.jsxi:3
	var UpgradeEditor = function (){}, 
		_sizes = { 0: 15, 1: 15, 2: 15, 3: 14, 4: 12, 5: 11, 6: 10, 7: 9, 8: 8 };
	
	function fontSize(l){                                                          // upgrade_editor.jsxi:16
		return _sizes[l] || 7;                                                     // upgrade_editor.jsxi:17
	}
	
	function updateStyle(e){                                                       // upgrade_editor.jsxi:20
		var s = fontSize(e.textContent.length);
		
		e.style.fontSize = s + 'px';                                               // upgrade_editor.jsxi:22
		e.style.marginTop = (15 - s) / 4 + 'px';                                   // upgrade_editor.jsxi:23
	}
	
	function focus(e){                                                             // upgrade_editor.jsxi:26
		if (!e)                                                                    // upgrade_editor.jsxi:27
			return;
		
		e.focus();                                                                 // upgrade_editor.jsxi:28
		document.execCommand('selectAll', false, 
			null);                                                                 // upgrade_editor.jsxi:29
	}
	
	function editable(label){                                                      // upgrade_editor.jsxi:32
		var r = $('<div style="position:relative;width:64px;height:64px">\
            <img src="data/upgrade.png" width="64" height="64">\
            <span id="editable-focus" style="position:absolute;top:35px;left:8px;right:7px;text-align:\
                    center;color:white;font:bold 15px Consolas;\
                    display:block;overflow:hidden;white-space:nowrap" \
                contenteditable="true">{0}</span>\
        </div>'.format(label));                                                    // upgrade_editor.jsxi:33
		
		updateStyle(r.find('span').on('input',                                     // upgrade_editor.jsxi:41
			function (){                                                           // upgrade_editor.jsxi:41
				updateStyle(this);                                                 // upgrade_editor.jsxi:42
			})[0]);
		return r;                                                                  // upgrade_editor.jsxi:45
	}
	
	function saveFromHtml(html, file, callback){                                   // upgrade_editor.jsxi:48
		var du = 'data:image/png;base64,' + fs.readFileSync('data/upgrade.png').toString('base64');
		
		var da = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128">\
            <image x="0" y="0" width="128px" height="128px" xlink:href="{0}"></image>\
            <foreignObject width="100%" height="100%">\
                <div xmlns="http://www.w3.org/1999/xhtml" style="transform-origin:0 0;transform:scale(2,2)">{1}</div>\
            </foreignObject>\
        </svg>'.format(du, html.replace(/<img.+?>/, ''));                          // upgrade_editor.jsxi:51
		
		var im = new Image();
		
		var sv = new Blob([ da ], { type: 'image/svg+xml;charset=utf-8' });        // upgrade_editor.jsxi:59
		
		var ur = URL.createObjectURL(sv);
		
		im.onload = function (){                                                   // upgrade_editor.jsxi:62
			try {
				var cb = document.createElement('canvas');
				
				cb.width = (cb.height = 128);                                      // upgrade_editor.jsxi:66
				
				var xb = cb.getContext('2d');
				
				xb.drawImage(im, 0, 
					0);                                                            // upgrade_editor.jsxi:68
				
				var cr = document.createElement('canvas');
				
				cr.width = (cr.height = 64);                                       // upgrade_editor.jsxi:71
				
				var xn = cr.getContext('2d');
				
				xn.drawImage(cb, 0, 
					0, 
					64, 
					64);                                                           // upgrade_editor.jsxi:73
				fs.writeFileSync(file, cr.toDataURL('image/png').slice(22), 'base64');
				callback(null);                                                    // upgrade_editor.jsxi:76
			} catch (e){                                                           // upgrade_editor.jsxi:77
				callback(e);                                                       // upgrade_editor.jsxi:78
			} finally {
				URL.revokeObjectURL(ur);                                           // upgrade_editor.jsxi:80
			}
		};
		im.src = ur;                                                               // upgrade_editor.jsxi:84
	}
	
	function saveFromLibrary(library, file, callback){                             // upgrade_editor.jsxi:87
		fs.writeFile(file, fs.readFileSync(library), callback);                    // upgrade_editor.jsxi:88
	}
	
	UpgradeEditor.start = function (car, callback){                                // upgrade_editor.jsxi:91
		function cb(e){                                                            // upgrade_editor.jsxi:92
			if (e){                                                                // upgrade_editor.jsxi:93
				ErrorHandler.handled('Cannot save upgrade icon.', e);              // upgrade_editor.jsxi:94
			} else {
				car.updateUpgrade();                                               // upgrade_editor.jsxi:96
			}
			
			if (callback)                                                          // upgrade_editor.jsxi:98
				callback();                                                        // upgrade_editor.jsxi:98
		}
		
		var d = new Dialog('Upgrade Editor',                                       // upgrade_editor.jsxi:101
			[
				'<div class="left"><h6>Current</h6><img class="car-upgrade"></div>', 
				'<div class="right"><h6>New</h6><div id="car-upgrade-editor"></div></div>', 
				'<p><i>Ctrl+I: Italic, Ctrl+B: Bold</i></p>'
			], 
			function (){                                                           // upgrade_editor.jsxi:105
				var label = this.content.find('#car-upgrade-editor')[0].innerHTML;
				
				car.data.upgradeLabel = $('#editable-focus').html();               // upgrade_editor.jsxi:107
				
				if (!car.changed){                                                 // upgrade_editor.jsxi:108
					car.save();                                                    // upgrade_editor.jsxi:109
				}
				
				saveFromHtml(label, car.upgrade, cb);                              // upgrade_editor.jsxi:111
			}, 
			false).setButton('Save').addButton('Cancel');                          // upgrade_editor.jsxi:112
		
		d.el.addClass('dark');                                                     // upgrade_editor.jsxi:114
		
		if (fs.existsSync(car.upgrade)){                                           // upgrade_editor.jsxi:115
			d.content.find('img').attr('src', car.upgrade);                        // upgrade_editor.jsxi:116
		} else {
			d.content.find('.left').remove();                                      // upgrade_editor.jsxi:118
		}
		
		d.content.find('#car-upgrade-editor').append(editable(car.data.upgradeLabel || 'S1'));
		focus(d.content.find('#editable-focus')[0]);                               // upgrade_editor.jsxi:122
		
		var t = d.addTab('Library',                                                // upgrade_editor.jsxi:124
			"<img class=\"car-upgrade-library-element selected\" src=\"data/upgrade-lib/D.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/Race.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/S1.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/S2.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/S3.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/Turbo.png\"></img>", 
			function (){                                                           // upgrade_editor.jsxi:124
				saveFromLibrary(t.content.find('.selected').attr('src'), car.upgrade, cb);
			}).setButton('Select').addButton('Cancel');                            // upgrade_editor.jsxi:126
		
		t.content.css('margin', '10px 0');                                         // upgrade_editor.jsxi:127
		t.find('.car-upgrade-library-element').click(function (){                  // upgrade_editor.jsxi:128
			$(this.parentNode).find('.selected').removeClass('selected');          // upgrade_editor.jsxi:129
			this.classList.add('selected');                                        // upgrade_editor.jsxi:130
		});
	};
	return UpgradeEditor;
})();

/* Class "ViewDetails" declaration */
var ViewDetails = (function (){                                                    // view_details.jsxi:1
	var ViewDetails = function (){}, 
		_selected, _tagSkip;
	
	function outMsg(title, msg){                                                   // view_details.jsxi:4
		var dm = $('#details-message'), cd = $('#selected-car-details');
		
		if (title){                                                                // view_details.jsxi:8
			dm.html('<h4>{0}</h4><p>{1}</p>'.format(title, msg)).show();           // view_details.jsxi:9
			cd.hide();                                                             // view_details.jsxi:10
		} else {
			dm.hide();                                                             // view_details.jsxi:12
			cd.show();                                                             // view_details.jsxi:13
		}
	}
	
	function outErrors(car){                                                       // view_details.jsxi:17
		var er = $('#selected-car-error');
		
		if (car.error.length > 0){                                                 // view_details.jsxi:19
			er.show().html('Errors:<ul><li>' + car.error.map(function (e){         // view_details.jsxi:20
				return e.msg;                                                      // view_details.jsxi:22
			}).join('</li><li>') + '</li></ul>');                                  // view_details.jsxi:23
		} else {
			er.hide();                                                             // view_details.jsxi:25
		}
	}
	
	function updateParents(car){                                                   // view_details.jsxi:29
		var s = document.getElementById('selected-car-parent');
		
		if (!s)                                                                    // view_details.jsxi:31
			return;
		
		if (car.children.length > 0){                                              // view_details.jsxi:33
			s.parentNode.style.display = 'none';                                   // view_details.jsxi:34
		} else {
			s.parentNode.style.display = null;                                     // view_details.jsxi:36
			s.innerHTML = '<option value="">None</option>' + Cars.list.filter(function (e){
				return e.data && !e.disabled && e.parent == null && e.id != car.id && (!car.parent || car.parent.id != car.id);
			}).map(function (e){                                                   // view_details.jsxi:40
				return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);
			}).join('');                                                           // view_details.jsxi:42
			s.value = car.parent && car.parent.id || '';                           // view_details.jsxi:44
		}
	}
	
	function outBadge(car){                                                        // view_details.jsxi:48
		var lo = $('#selected-car-logo');
		
		if (car.hasError('badge-missing')){                                        // view_details.jsxi:50
			lo.hide();                                                             // view_details.jsxi:51
		} else {
			lo.show().attr('src', car.badge.cssUrl());                             // view_details.jsxi:53
		}
	}
	
	function outData(car){                                                         // view_details.jsxi:57
		function val(e, s){                                                        // view_details.jsxi:58
			if (typeof e === 'string')                                             // view_details.jsxi:59
				e = $(e);                                                          // view_details.jsxi:59
			
			if (e = e[0]){                                                         // view_details.jsxi:60
				var c = e.value;
				
				if (!s)                                                            // view_details.jsxi:62
					s = '';                                                        // view_details.jsxi:62
				
				if (c != s)                                                        // view_details.jsxi:63
					e.value = s;                                                   // view_details.jsxi:63
			}
		}
		
		var he = $('#selected-car'),                                               // view_details.jsxi:67
			de = $('#selected-car-desc'),                                          // view_details.jsxi:68
			ta = $('#selected-car-tags'),                                          // view_details.jsxi:69
			pr = $('#selected-car-properties');                                    // view_details.jsxi:70
		
		he.attr('title', car.path);                                                // view_details.jsxi:71
		
		if (car.data){                                                             // view_details.jsxi:72
			val(he.removeAttr('readonly'), car.data.name);                         // view_details.jsxi:73
			val(de.removeAttr('readonly'), car.data.description);                  // view_details.jsxi:74
			de.elastic();                                                          // view_details.jsxi:75
			ta.show().find('li').remove();                                         // view_details.jsxi:77
			car.data.tags.forEach((function (e){                                   // view_details.jsxi:78
				$('<li>').text(e).insertBefore(this);                              // view_details.jsxi:79
			}).bind(ta.find('input')));                                            // view_details.jsxi:80
			updateTags(car.data.tags);                                             // view_details.jsxi:81
			pr.show();                                                             // view_details.jsxi:83
			val('#selected-car-brand', car.data.brand);                            // view_details.jsxi:84
			val('#selected-car-class', car.data.class);                            // view_details.jsxi:85
			val('#selected-car-bhp', car.data.specs.bhp);                          // view_details.jsxi:87
			val('#selected-car-torque', car.data.specs.torque);                    // view_details.jsxi:88
			val('#selected-car-weight', car.data.specs.weight);                    // view_details.jsxi:89
			val('#selected-car-topspeed', car.data.specs.topspeed);                // view_details.jsxi:90
			val('#selected-car-acceleration', car.data.specs.acceleration);        // view_details.jsxi:91
			val('#selected-car-pwratio', car.data.specs.pwratio);                  // view_details.jsxi:92
			updateParents(car);                                                    // view_details.jsxi:94
			
			if (car.parent && !car.hasError('upgrade-missing')){                   // view_details.jsxi:96
				$('#selected-car-upgrade').show().attr('src', car.upgrade);        // view_details.jsxi:97
			} else {
				$('#selected-car-upgrade').hide();                                 // view_details.jsxi:99
			}
		} else {
			he.attr('readonly', true).val(car.id);                                 // view_details.jsxi:102
			de.attr('readonly', true).val('');                                     // view_details.jsxi:103
			ta.hide();                                                             // view_details.jsxi:104
			pr.hide();                                                             // view_details.jsxi:105
		}
	}
	
	function outDisabled(car){                                                     // view_details.jsxi:109
		$('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');      // view_details.jsxi:110
		$('#selected-car-header').toggleClass('disabled', car.disabled);           // view_details.jsxi:111
	}
	
	function outChanged(car){                                                      // view_details.jsxi:114
		$('#selected-car-header').toggleClass('changed', car.changed);             // view_details.jsxi:115
	}
	
	function outSkins(car){                                                        // view_details.jsxi:118
		setTimeout(function (){                                                    // view_details.jsxi:119
			var sa = $('#selected-car-skins-article'),                             // view_details.jsxi:120
				sp = $('#selected-car-preview'),                                   // view_details.jsxi:121
				ss = $('#selected-car-skins');                                     // view_details.jsxi:122
			
			if (car.skins){                                                        // view_details.jsxi:123
				sa.show();                                                         // view_details.jsxi:124
				ss.empty();                                                        // view_details.jsxi:125
				sp.attr({                                                          // view_details.jsxi:127
					'data-id': car.skins.selected.id,                              // view_details.jsxi:127
					'src': (car.skins.selected.preview + '?' + Math.random()).cssUrl()
				});
				car.skins.forEach(function (e){                                    // view_details.jsxi:132
					$('<img>').attr({ 'data-id': e.id, 'title': e.id, 'src': e.livery.cssUrl() }).appendTo(ss);
				});
			} else {
				sa.hide();                                                         // view_details.jsxi:140
			}
		}, 
		50);
	}
	
	function updateTags(l){                                                        // view_details.jsxi:145
		var t = document.getElementById('tags-filtered');
		
		if (t){                                                                    // view_details.jsxi:147
			document.body.removeChild(t);                                          // view_details.jsxi:148
		}
		
		t = document.body.appendChild(document.createElement('datalist'));         // view_details.jsxi:151
		t.id = 'tags-filtered';                                                    // view_details.jsxi:152
		
		var n = l.map(function (e){                                                // view_details.jsxi:154
			return e.toLowerCase();                                                // view_details.jsxi:155
		});
		
		Cars.tags.forEach(function (v){                                            // view_details.jsxi:158
			if (n.indexOf(v.toLowerCase()) < 0){                                   // view_details.jsxi:159
				t.appendChild(document.createElement('option')).setAttribute('value', v);
			}
		});
	}
	
	function applyTags(){                                                          // view_details.jsxi:165
		if (!_selected || !_selected.data)                                         // view_details.jsxi:166
			return;
		
		Cars.changeData(_selected,                                                 // view_details.jsxi:167
			'tags',                                                                // view_details.jsxi:167
			Array.prototype.map.call(document.querySelectorAll('#selected-car-tags li'), 
				function (a){                                                      // view_details.jsxi:168
					return a.textContent;                                          // view_details.jsxi:168
				}));
		updateTags(_selected.data.tags);                                           // view_details.jsxi:169
	}
	
	function init(){                                                               // view_details.jsxi:172
		Cars.on('scan:ready',                                                      // view_details.jsxi:173
			function (list){                                                       // view_details.jsxi:174
				if (list.length == 0){                                             // view_details.jsxi:175
					outMsg('Hmm', 'Cars not found');                               // view_details.jsxi:176
				}
				
				$('main').show();                                                  // view_details.jsxi:179
			}).on('error',                                                         // view_details.jsxi:181
			function (car){                                                        // view_details.jsxi:181
				if (_selected != car)                                              // view_details.jsxi:182
					return;
				
				outErrors(car);                                                    // view_details.jsxi:183
			}).on('update.car.data',                                               // view_details.jsxi:185
			function (car){                                                        // view_details.jsxi:185
				if (_selected != car)                                              // view_details.jsxi:186
					return;
				
				outData(car);                                                      // view_details.jsxi:187
			}).on('update.car.skins',                                              // view_details.jsxi:189
			function (car){                                                        // view_details.jsxi:189
				if (_selected != car)                                              // view_details.jsxi:190
					return;
				
				outSkins(car);                                                     // view_details.jsxi:191
			}).on('update.car.disabled',                                           // view_details.jsxi:193
			function (car){                                                        // view_details.jsxi:193
				if (_selected != car)                                              // view_details.jsxi:194
					return;
				
				outDisabled(car);                                                  // view_details.jsxi:195
			}).on('update.car.changed',                                            // view_details.jsxi:197
			function (car){                                                        // view_details.jsxi:197
				if (_selected != car)                                              // view_details.jsxi:198
					return;
				
				outChanged(car);                                                   // view_details.jsxi:199
			});
		ViewList.on('select',                                                      // view_details.jsxi:202
			function (car){                                                        // view_details.jsxi:203
				$('main').show();                                                  // view_details.jsxi:204
				_selected = car;                                                   // view_details.jsxi:206
				
				if (car){                                                          // view_details.jsxi:208
					outMsg(null);                                                  // view_details.jsxi:209
				} else {
					return;
				}
				
				outData(car);                                                      // view_details.jsxi:214
				outBadge(car);                                                     // view_details.jsxi:215
				outDisabled(car);                                                  // view_details.jsxi:216
				outChanged(car);                                                   // view_details.jsxi:217
				outErrors(car);                                                    // view_details.jsxi:218
				outSkins(car);                                                     // view_details.jsxi:219
			});
		$('#selected-car').on('keydown',                                           // view_details.jsxi:223
			function (e){                                                          // view_details.jsxi:224
				if (e.keyCode == 13){                                              // view_details.jsxi:225
					this.blur();                                                   // view_details.jsxi:226
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:230
			function (){                                                           // view_details.jsxi:230
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:231
					return;
				
				this.value = this.value.slice(0, 64);                              // view_details.jsxi:232
				Cars.changeData(_selected, 'name', this.value);                    // view_details.jsxi:233
			});
		$('#selected-car-tags').on('click',                                        // view_details.jsxi:236
			function (e){                                                          // view_details.jsxi:237
				if (e.target.tagName === 'LI' && e.target.offsetWidth - e.offsetX < 20){
					e.target.parentNode.removeChild(e.target);                     // view_details.jsxi:239
					applyTags();                                                   // view_details.jsxi:240
				} else {
					this.querySelector('input').focus();                           // view_details.jsxi:242
				}
			});
		$('#selected-car-tags input').on('change',                                 // view_details.jsxi:246
			function (){                                                           // view_details.jsxi:247
				if (this.value){                                                   // view_details.jsxi:248
					this.parentNode.insertBefore(document.createElement('li'), this).textContent = this.value;
					this.value = '';                                               // view_details.jsxi:250
					applyTags();                                                   // view_details.jsxi:251
				}
			}).on('keydown',                                                       // view_details.jsxi:254
			function (e){                                                          // view_details.jsxi:254
				if (e.keyCode == 8 && this.value == ''){                           // view_details.jsxi:255
					this.parentNode.removeChild(this.parentNode.querySelector('li:last-of-type'));
					applyTags();                                                   // view_details.jsxi:257
				}
			});
		$('#selected-car-desc').elastic().on('change',                             // view_details.jsxi:261
			function (){                                                           // view_details.jsxi:262
				if (!_selected || this.readonly)                                   // view_details.jsxi:263
					return;
				
				Cars.changeData(_selected, 'description', this.value);             // view_details.jsxi:264
			});
		$('#selected-car-brand').on('keydown',                                     // view_details.jsxi:267
			function (e){                                                          // view_details.jsxi:268
				if (e.keyCode == 13){                                              // view_details.jsxi:269
					this.blur();                                                   // view_details.jsxi:270
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:274
			function (e){                                                          // view_details.jsxi:274
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:275
					return;
				
				Cars.changeData(_selected, 'brand', this.value);                   // view_details.jsxi:276
			}).on('contextmenu',                                                   // view_details.jsxi:278
			function (e){                                                          // view_details.jsxi:278
				if (!_selected || !_selected.data)                                 // view_details.jsxi:279
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:282
					label: 'Filter Brand',                                         // view_details.jsxi:282
					key: 'F',                                                      // view_details.jsxi:282
					click: (function (){                                           // view_details.jsxi:282
						if (!_selected)                                            // view_details.jsxi:283
							return;
						
						ViewList.addFilter('brand:' + _selected.data.brand);       // view_details.jsxi:284
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:287
				return false;
			});
		$('#selected-car-parent').on('change',                                     // view_details.jsxi:291
			function (e){                                                          // view_details.jsxi:292
				if (!_selected)                                                    // view_details.jsxi:293
					return;
				
				var t = this, v = this.value || null;
				
				if (v && !fs.existsSync(_selected.upgrade)){                       // view_details.jsxi:296
					UpgradeEditor.start(_selected,                                 // view_details.jsxi:297
						function (arg){                                            // view_details.jsxi:297
							if (fs.existsSync(_selected.upgrade)){                 // view_details.jsxi:298
								fn();                                              // view_details.jsxi:299
							} else {
								t.value = '';                                      // view_details.jsxi:301
							}
						});
				} else {
					fn();                                                          // view_details.jsxi:305
				}
				
				function fn(){                                                     // view_details.jsxi:308
					_selected.changeParent(v);                                     // view_details.jsxi:309
				}
			});
		$('#selected-car-class').on('keydown',                                     // view_details.jsxi:313
			function (e){                                                          // view_details.jsxi:314
				if (e.keyCode == 13){                                              // view_details.jsxi:315
					this.blur();                                                   // view_details.jsxi:316
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:320
			function (){                                                           // view_details.jsxi:320
				if (!_selected || this.readonly)                                   // view_details.jsxi:321
					return;
				
				Cars.changeData(_selected, 'class', this.value);                   // view_details.jsxi:322
			}).on('contextmenu',                                                   // view_details.jsxi:324
			function (e){                                                          // view_details.jsxi:324
				if (!_selected || !_selected.data)                                 // view_details.jsxi:325
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:328
					label: 'Filter Class',                                         // view_details.jsxi:328
					key: 'F',                                                      // view_details.jsxi:328
					click: (function (){                                           // view_details.jsxi:328
						if (!_selected)                                            // view_details.jsxi:329
							return;
						
						ViewList.addFilter('class:' + _selected.data.class);       // view_details.jsxi:330
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:333
				return false;
			});
		[
			'bhp',                                                                 // view_details.jsxi:337
			'torque',                                                              // view_details.jsxi:337
			'weight',                                                              // view_details.jsxi:337
			'topspeed',                                                            // view_details.jsxi:337
			'acceleration',                                                        // view_details.jsxi:337
			'pwratio'
		].forEach(function (e){                                                    // view_details.jsxi:337
			$('#selected-car-' + e).on('keydown',                                  // view_details.jsxi:338
				function (e){                                                      // view_details.jsxi:338
					if (e.keyCode == 13){                                          // view_details.jsxi:339
						this.blur();                                               // view_details.jsxi:340
						return false;
					}
				}).on('keyup keydown keypress',                                    // view_details.jsxi:343
				function (e){                                                      // view_details.jsxi:343
					if (e.keyCode == 32){                                          // view_details.jsxi:344
						e.stopPropagation();                                       // view_details.jsxi:345
						
						if (e.type === 'keyup'){                                   // view_details.jsxi:346
							return false;
						}
					}
				}).on('change',                                                    // view_details.jsxi:350
				function (){                                                       // view_details.jsxi:350
					if (!_selected || this.readonly)                               // view_details.jsxi:351
						return;
					
					Cars.changeDataSpecs(_selected, e, this.value);                // view_details.jsxi:352
				});
		});
		$('#selected-car-pwratio').on('dblclick contextmenu',                      // view_details.jsxi:356
			function (e){                                                          // view_details.jsxi:357
				if (!_selected || !_selected.data || this.readonly)                // view_details.jsxi:358
					return;
				
				function r(){                                                      // view_details.jsxi:360
					if (!_selected || !_selected.data || this.readonly)            // view_details.jsxi:361
						return;
					
					var w = (_selected.data.specs.weight || '').match(/\d+/),      // view_details.jsxi:362
						p = (_selected.data.specs.bhp || '').match(/\d+/);         // view_details.jsxi:363
					
					if (w && p){                                                   // view_details.jsxi:364
						Cars.changeDataSpecs(_selected, 'pwratio', + (+ w / + p).toFixed(2) + 'kg/cv');
					}
				}
				
				if (e.type === 'dblclick'){                                        // view_details.jsxi:369
					r();                                                           // view_details.jsxi:370
				} else {
					var menu = new gui.Menu();
					
					menu.append(new gui.MenuItem({ label: 'Recalculate', key: 'R', click: r }));
					menu.popup(e.clientX, e.clientY);                              // view_details.jsxi:374
					return false;
				}
			});
		$('#selected-car-upgrade').on('click',                                     // view_details.jsxi:379
			function (){                                                           // view_details.jsxi:380
				if (!_selected)                                                    // view_details.jsxi:381
					return;
				
				UpgradeEditor.start(_selected);                                    // view_details.jsxi:382
			});
		$('#selected-car-skins-article').dblclick(function (e){                    // view_details.jsxi:386
			if (!_selected)                                                        // view_details.jsxi:388
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:389
		}).on('contextmenu',                                                       // view_details.jsxi:391
			function (e){                                                          // view_details.jsxi:391
				if (!_selected)                                                    // view_details.jsxi:392
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:395
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:398
					label: 'Open in Showroom',                                     // view_details.jsxi:398
					key: 'S',                                                      // view_details.jsxi:398
					click: (function (){                                           // view_details.jsxi:398
						if (!_selected)                                            // view_details.jsxi:399
							return;
						
						AcShowroom.start(_selected, id);                           // view_details.jsxi:400
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:402
					label: 'Start Practice',                                       // view_details.jsxi:402
					key: 'P',                                                      // view_details.jsxi:402
					click: (function (){                                           // view_details.jsxi:402
						if (!_selected)                                            // view_details.jsxi:403
							return;
						
						AcPractice.start(_selected, id);                           // view_details.jsxi:404
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:411
				return false;
			});
		$('#selected-car-skins').on('click',                                       // view_details.jsxi:416
			function (e){                                                          // view_details.jsxi:417
				if (!_selected)                                                    // view_details.jsxi:418
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:421
					return;
				
				Cars.selectSkin(_selected, id);                                    // view_details.jsxi:423
			});
		$(window).on('keydown',                                                    // view_details.jsxi:427
			function (e){                                                          // view_details.jsxi:428
				if (!_selected)                                                    // view_details.jsxi:429
					return;
				
				if (e.keyCode == 83 && e.ctrlKey){                                 // view_details.jsxi:431
					Cars.save(_selected);                                          // view_details.jsxi:433
					return false;
				}
			});
		
		var cmIgnore = false;
		
		$('main').on('contextmenu',                                                // view_details.jsxi:440
			function (){                                                           // view_details.jsxi:441
				this.querySelector('footer').classList.toggle('active');           // view_details.jsxi:442
				cmIgnore = true;                                                   // view_details.jsxi:443
			});
		$(window).on('click contextmenu',                                          // view_details.jsxi:446
			(function (e){                                                         // view_details.jsxi:447
				if (cmIgnore){                                                     // view_details.jsxi:448
					cmIgnore = false;                                              // view_details.jsxi:449
				} else if (e.target !== this){                                     // view_details.jsxi:450
					this.classList.remove('active');                               // view_details.jsxi:451
				}
			}).bind($('main footer')[0]));                                         // view_details.jsxi:453
		$('#selected-car-open-directory').click(function (){                       // view_details.jsxi:456
			if (!_selected)                                                        // view_details.jsxi:457
				return;
			
			Shell.openItem(_selected.path);                                        // view_details.jsxi:458
		});
		$('#selected-car-showroom').click(function (){                             // view_details.jsxi:461
			if (!_selected)                                                        // view_details.jsxi:462
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:463
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:466
			if (!_selected)                                                        // view_details.jsxi:467
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:468
		});
		$('#selected-car-practice').click(function (){                             // view_details.jsxi:471
			if (!_selected)                                                        // view_details.jsxi:472
				return;
			
			AcPractice.start(_selected);                                           // view_details.jsxi:473
		});
		$('#selected-car-practice-select').click(function (){                      // view_details.jsxi:476
			if (!_selected)                                                        // view_details.jsxi:477
				return;
			
			AcPractice.select(_selected);                                          // view_details.jsxi:478
		});
		$('#selected-car-reload').click(function (){                               // view_details.jsxi:481
			if (!_selected)                                                        // view_details.jsxi:482
				return;
			
			if (_selected.changed){                                                // view_details.jsxi:484
				new Dialog('Reload',                                               // view_details.jsxi:485
					[ 'Your changes will be lost. Are you sure?' ], 
					reload);                                                       // view_details.jsxi:487
			} else {
				reload();                                                          // view_details.jsxi:489
			}
			
			function reload(){                                                     // view_details.jsxi:492
				Cars.reload(_selected);                                            // view_details.jsxi:493
			}
		});
		$('#selected-car-disable').click(function (){                              // view_details.jsxi:498
			if (!_selected)                                                        // view_details.jsxi:499
				return;
			
			Cars.toggle(_selected);                                                // view_details.jsxi:500
		});
		$('#selected-car-update-previews').click(function (){                      // view_details.jsxi:503
			if (!_selected)                                                        // view_details.jsxi:504
				return;
			
			AcShowroom.shot(_selected);                                            // view_details.jsxi:505
		});
		$('#selected-car-update-previews-manual').click(function (){               // view_details.jsxi:508
			if (!_selected)                                                        // view_details.jsxi:509
				return;
			
			AcShowroom.shot(_selected, true);                                      // view_details.jsxi:510
		});
		$('#selected-car-update-description').click(function (){                   // view_details.jsxi:513
			if (!_selected)                                                        // view_details.jsxi:514
				return;
			
			UpdateDescription.update(_selected);                                   // view_details.jsxi:515
		});
		$('#selected-car-save').click(function (){                                 // view_details.jsxi:518
			if (!_selected)                                                        // view_details.jsxi:519
				return;
			
			Cars.save(_selected);                                                  // view_details.jsxi:520
		});
	}
	
	(function (){                                                                  // view_details.jsxi:524
		$(init);                                                                   // view_details.jsxi:525
	})();
	return ViewDetails;
})();

/* Class "ViewList" declaration */
var ViewList = (function (){                                                       // view_list.jsxi:1
	var ViewList = function (){}, 
		mediator = new Mediator(),                                                 // view_list.jsxi:2
		_selected,                                                                 // view_list.jsxi:4
		_aside = $(document.getElementsByTagName('aside')[0]),                     // view_list.jsxi:5
		_node = $(document.getElementById('cars-list')),                           // view_list.jsxi:6
		_sortFn = {                                                                // view_list.jsxi:88
			id: (function (a, b){                                                  // view_list.jsxi:88
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.id.localeCompare(b.id);
			}), 
			displayName: (function (a, b){                                         // view_list.jsxi:92
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.displayName.localeCompare(b.displayName);
			})
		};
	
	function scrollToSelected(){                                                   // view_list.jsxi:8
		var n = _node[0].querySelector('.selected');
		
		if (!n)                                                                    // view_list.jsxi:10
			return;
		
		var p = n.offsetTop - n.parentNode.scrollTop;
		
		if (p < 10){                                                               // view_list.jsxi:13
			n.parentNode.scrollTop += p - 10;                                      // view_list.jsxi:14
		} else if (p > n.parentNode.offsetHeight - 30){                            // view_list.jsxi:15
			n.parentNode.scrollTop += p + 30 - n.parentNode.offsetHeight;          // view_list.jsxi:16
		}
	}
	
	ViewList.select = function (car){                                              // view_list.jsxi:21
		_selected = car;                                                           // view_list.jsxi:22
		_node.find('.expand').removeClass('expand');                               // view_list.jsxi:23
		_node.find('.selected').removeClass('selected');                           // view_list.jsxi:24
		
		if (car){                                                                  // view_list.jsxi:26
			var n = _node.find('[data-id="' + car.id + '"]').addClass('expand').parent().addClass('selected')[0];
			
			if (car.parent){                                                       // view_list.jsxi:28
				n = _node.find('[data-id="' + car.parent.id + '"]').addClass('expand')[0];
			}
			
			scrollToSelected();                                                    // view_list.jsxi:32
		}
		
		mediator.dispatch('select', car);                                          // view_list.jsxi:35
	};
	ViewList.filter = function (v){                                                // view_list.jsxi:38
		var i = _aside.find('#cars-list-filter')[0];
		
		if (i.value != v){                                                         // view_list.jsxi:40
			i.value = v;                                                           // view_list.jsxi:41
		}
		
		if (v){                                                                    // view_list.jsxi:44
			i.style.display = 'block';                                             // view_list.jsxi:45
			
			var s = v.trim().split(/\s+/);
			
			var bb = '', cc = '';
			
			var vv = s.filter(function (e){                                        // view_list.jsxi:50
				if (/^brand:(.*)/.test(e)){                                        // view_list.jsxi:51
					bb = (bb && bb + '|') + RegExp.$1;                             // view_list.jsxi:52
					return false;
				}
				
				if (/^class:(.*)/.test(e)){                                        // view_list.jsxi:56
					cc = (cc && cc + '|') + RegExp.$1;                             // view_list.jsxi:57
					return false;
				}
				return true;
			});
			
			var r = RegExp.fromQuery(vv.join(' '));
			
			var b = bb && RegExp.fromQuery(bb, true);
			
			var c = cc && RegExp.fromQuery(cc, true);
			
			var f = function (car){                                                // view_list.jsxi:68
				if (b && (!car.data || !b.test(car.data.brand)))                   // view_list.jsxi:69
					return false;
				
				if (c && (!car.data || !c.test(car.data.class)))                   // view_list.jsxi:70
					return false;
				return r.test(car.id) || car.data && r.test(car.data.name);        // view_list.jsxi:71
			};
			
			_aside.find('#cars-list > div > [data-id]').each(function (){          // view_list.jsxi:74
				this.parentNode.style.display = f(Cars.byName(this.getAttribute('data-id'))) ? null : 'none';
			});
		} else {
			i.style.display = 'hide';                                              // view_list.jsxi:78
			_aside.find('#cars-list > div').show();                                // view_list.jsxi:79
		}
	};
	ViewList.addFilter = function (v){                                             // view_list.jsxi:83
		var a = _aside.find('#cars-list-filter')[0].value;
		
		ViewList.filter((a && a + ' ') + v);
	};
	ViewList.sort = function (){                                                   // view_list.jsxi:96
		var c = Cars.list.sort(_sortFn.displayName);
		
		var n = _node[0];
		
		var a = n.children;
		
		c.forEach(function (arg){                                                  // view_list.jsxi:101
			for (var __1 = 0; __1 < a.length; __1 ++){                             // view_list.jsxi:102
				var s = a[__1];
				
				if (s.children[0].getAttribute('data-id') == arg.id){              // view_list.jsxi:103
					n.appendChild(s);                                              // view_list.jsxi:104
					return;
				}
			}
		});
		scrollToSelected();                                                        // view_list.jsxi:110
	};
	
	function init(){                                                               // view_list.jsxi:113
		Cars.on('scan:start',                                                      // view_list.jsxi:114
			function (){                                                           // view_list.jsxi:115
				_aside.find('#cars-list').empty();                                 // view_list.jsxi:116
				document.body.removeChild(_aside[0]);                              // view_list.jsxi:117
			}).on('scan:ready',                                                    // view_list.jsxi:119
			function (list){                                                       // view_list.jsxi:119
				$('#total-cars').val(list.filter(function (e){                     // view_list.jsxi:120
					return e.parent == null;                                       // view_list.jsxi:121
				}).length).attr('title',                                           // view_list.jsxi:122
					'Including modded versions: {0}'.format(list.length));         // view_list.jsxi:122
				
				if (list.length > 0){                                              // view_list.jsxi:124
					ViewList.select(list[0]);
				}
				
				ViewList.sort();
				document.body.appendChild(_aside[0]);                              // view_list.jsxi:129
			}).on('new.car',                                                       // view_list.jsxi:131
			function (car){                                                        // view_list.jsxi:131
				var s = document.createElement('span');
				
				s.textContent = car.displayName;                                   // view_list.jsxi:133
				
				if (car.disabled)                                                  // view_list.jsxi:134
					s.classList.add('disabled');                                   // view_list.jsxi:134
				
				s.setAttribute('title', car.path);                                 // view_list.jsxi:136
				s.setAttribute('data-id', car.id);                                 // view_list.jsxi:137
				s.setAttribute('data-name', car.id);                               // view_list.jsxi:138
				s.setAttribute('data-path', car.path);                             // view_list.jsxi:139
				
				var d = document.createElement('div');
				
				d.appendChild(s);                                                  // view_list.jsxi:142
				
				if (car.children.length > 0){                                      // view_list.jsxi:144
					d.setAttribute('data-children', car.children.length + 1);      // view_list.jsxi:145
				}
				
				_node[0].appendChild(d);                                           // view_list.jsxi:148
			}).on('update.car.data',                                               // view_list.jsxi:150
			function (car, upd){                                                   // view_list.jsxi:150
				_node.find('[data-id="' + car.id + '"]').text(car.displayName).attr('data-name', car.displayName.toLowerCase());
				ViewList.filter(_aside.find('#cars-list-filter').val());
				
				if (upd === 'update.car.data:name'){                               // view_list.jsxi:155
					ViewList.sort();
				}
			}).on('update.car.parent',                                             // view_list.jsxi:159
			function (car){                                                        // view_list.jsxi:159
				var d = _node[0].querySelector('[data-id="' + car.id + '"]').parentNode;
				
				if (car.error.length > 0){                                         // view_list.jsxi:161
					var c = d.parentNode;
					
					if (c.tagName === 'DIV' && c.querySelectorAll('.error').length == 1){
						c.classList.remove('error');                               // view_list.jsxi:164
					}
				}
				
				if (car.parent){                                                   // view_list.jsxi:168
					var p = _node[0].querySelector('[data-id="' + car.parent.id + '"]').parentNode;
					
					p.appendChild(d);                                              // view_list.jsxi:170
					
					if (d.classList.contains('error')){                            // view_list.jsxi:171
						d.classList.remove('error');                               // view_list.jsxi:172
						p.classList.add('error');                                  // view_list.jsxi:173
					}
				} else {
					_node[0].appendChild(d);                                       // view_list.jsxi:176
					ViewList.sort();
				}
				
				scrollToSelected();                                                // view_list.jsxi:180
			}).on('update.car.children',                                           // view_list.jsxi:182
			function (car){                                                        // view_list.jsxi:182
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:184
					return;
				
				if (car.children.length){                                          // view_list.jsxi:185
					e.parentNode.setAttribute('data-children', car.children.length + 1);
				} else {
					e.parentNode.removeAttribute('data-children');                 // view_list.jsxi:188
				}
			}).on('update.car.path',                                               // view_list.jsxi:191
			function (car){                                                        // view_list.jsxi:191
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:193
					return;
				
				e.setAttribute('data-path', car.path);                             // view_list.jsxi:194
				e.setAttribute('title', car.path);                                 // view_list.jsxi:195
			}).on('update.car.disabled',                                           // view_list.jsxi:197
			function (car){                                                        // view_list.jsxi:197
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:199
					return;
				
				if (car.disabled){                                                 // view_list.jsxi:200
					e.classList.add('disabled');                                   // view_list.jsxi:201
				} else {
					e.classList.remove('disabled');                                // view_list.jsxi:203
				}
				
				ViewList.sort();
			}).on('update.car.changed',                                            // view_list.jsxi:208
			function (car){                                                        // view_list.jsxi:208
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:210
					return;
				
				if (car.changed){                                                  // view_list.jsxi:211
					e.classList.add('changed');                                    // view_list.jsxi:212
				} else {
					e.classList.remove('changed');                                 // view_list.jsxi:214
				}
			}).on('error',                                                         // view_list.jsxi:217
			function (car){                                                        // view_list.jsxi:217
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:219
					return;
				
				if (car.error.length > 0){                                         // view_list.jsxi:220
					e.classList.add('error');                                      // view_list.jsxi:221
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:223
				}
				
				while (e.parentNode.id !== 'cars-list'){                           // view_list.jsxi:226
					e = e.parentNode;                                              // view_list.jsxi:227
				}
				
				if (car.error.length > 0){                                         // view_list.jsxi:230
					e.classList.add('error');                                      // view_list.jsxi:231
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:233
				}
			});
		_aside.find('#cars-list-filter').on('change paste keyup keypress search', 
			function (e){                                                          // view_list.jsxi:238
				if (e.keyCode == 13){                                              // view_list.jsxi:239
					this.blur();                                                   // view_list.jsxi:240
				}
				
				if (e.keyCode == 27){                                              // view_list.jsxi:243
					this.value = '';                                               // view_list.jsxi:244
					this.blur();                                                   // view_list.jsxi:245
				}
				
				ViewList.filter(this.value);
			}).on('keydown',                                                       // view_list.jsxi:250
			function (e){                                                          // view_list.jsxi:250
				if (e.keyCode == 8 && !this.value){                                // view_list.jsxi:251
					this.blur();                                                   // view_list.jsxi:252
				}
			}).on('blur',                                                          // view_list.jsxi:255
			function (){                                                           // view_list.jsxi:255
				if (!this.value){                                                  // view_list.jsxi:256
					$(this).hide();                                                // view_list.jsxi:257
				}
			});
		$(window).keydown(function (e){                                            // view_list.jsxi:262
			if (Event.isSomeInput(e))                                              // view_list.jsxi:264
				return;
			
			if (e.ctrlKey || e.altKey || e.shiftKey)                               // view_list.jsxi:265
				return;
			
			var f = _aside.find('#cars-list-filter');
			
			if (/[a-zA-Z\d]/.test(String.fromCharCode(e.keyCode)) || e.keyCode == 8 && f.val()){
				f.show()[0].focus();                                               // view_list.jsxi:268
			}
		});
		_aside.find('#cars-list-filter-focus').click(function (){                  // view_list.jsxi:272
			_aside.find('#cars-list-filter').show()[0].focus();                    // view_list.jsxi:273
		});
		_aside.find('#cars-list').click(function (e){                              // view_list.jsxi:277
			var car = Cars.byName(e.target.getAttribute('data-id'));
			
			if (!car)                                                              // view_list.jsxi:279
				return;
			
			ViewList.select(car);
		});
		
		var cmIgnore = false;
		
		_aside.on('contextmenu',                                                   // view_list.jsxi:285
			function (){                                                           // view_list.jsxi:286
				this.querySelector('footer').classList.toggle('active');           // view_list.jsxi:287
				cmIgnore = true;                                                   // view_list.jsxi:288
			});
		$(window).on('click contextmenu',                                          // view_list.jsxi:291
			(function (e){                                                         // view_list.jsxi:292
				if (cmIgnore){                                                     // view_list.jsxi:293
					cmIgnore = false;                                              // view_list.jsxi:294
				} else if (e.target !== this){                                     // view_list.jsxi:295
					this.classList.remove('active');                               // view_list.jsxi:296
				}
			}).bind(_aside.find('footer')[0]));                                    // view_list.jsxi:298
		_aside.find('#cars-list-open-directory').click(function (){                // view_list.jsxi:301
			if (!_selected)                                                        // view_list.jsxi:302
				return;
			
			Shell.openItem(AcDir.cars);                                            // view_list.jsxi:303
		});
		_aside.find('#cars-list-reload').click(function (){                        // view_list.jsxi:306
			if (Cars.list.some(function (e){                                       // view_list.jsxi:307
				return e.changed;                                                  // view_list.jsxi:308
			})){
				new Dialog('Reload',                                               // view_list.jsxi:310
					[
						'<p>{0}</p>'.format('Your changes will be lost. Are you sure?')
					], 
					reload);                                                       // view_list.jsxi:312
			} else {
				reload();                                                          // view_list.jsxi:314
			}
			
			function reload(){                                                     // view_list.jsxi:317
				Cars.reloadAll();                                                  // view_list.jsxi:318
			}
		});
		_aside.find('#cars-list-save').click(function (){                          // view_list.jsxi:323
			Cars.saveAll();                                                        // view_list.jsxi:324
		});
	}
	
	Object.defineProperty(ViewList,                                                // view_list.jsxi:1
		'selected', 
		{
			get: (function (){
				return _selected;                                                  // view_list.jsxi:328
			})
		});
	(function (){                                                                  // view_list.jsxi:330
		init();                                                                    // view_list.jsxi:331
		mediator.extend(ViewList);                                                 // view_list.jsxi:332
	})();
	return ViewList;
})();

/* Class "ViewLoading" declaration */
var ViewLoading = (function (){                                                    // view_loading.jsxi:1
	var ViewLoading = function (){}, 
		mediator = new Mediator(),                                                 // view_loading.jsxi:2
		_node = document.getElementById('loading'),                                // view_loading.jsxi:4
		_h4 = _node.querySelector('h4'),                                           // view_loading.jsxi:5
		_progress = _node.querySelector('progress'),                               // view_loading.jsxi:6
		_interval = null,                                                          // view_loading.jsxi:7
		_dots;                                                                     // view_loading.jsxi:8
	
	(function (){                                                                  // view_loading.jsxi:10
		Cars.on('scan:start',                                                      // view_loading.jsxi:11
			function (){                                                           // view_loading.jsxi:12
				clearInterval(_interval);                                          // view_loading.jsxi:13
				_node.style.display = null;                                        // view_loading.jsxi:14
				_dots = 0;                                                         // view_loading.jsxi:15
				_interval = setInterval(function (){                               // view_loading.jsxi:16
					_h4.textContent = 'Please wait' + '...'.slice(0, 1 + _dots ++ % 3);
				}, 
				300);
			}).on('scan:list',                                                     // view_loading.jsxi:20
			function (list){                                                       // view_loading.jsxi:20
				_node.querySelector('h6').textContent = 'Car{0} found: {1}'.format(list.length == 1 ? '' : 's', list.length);
				_progress.indeterminate = false;                                   // view_loading.jsxi:22
				_progress.max = list.length;                                       // view_loading.jsxi:23
			}).on('scan:progress',                                                 // view_loading.jsxi:25
			function (i, m){                                                       // view_loading.jsxi:25
				_progress.value = i;                                               // view_loading.jsxi:26
			}).on('scan:ready',                                                    // view_loading.jsxi:28
			function (list){                                                       // view_loading.jsxi:28
				clearInterval(_interval);                                          // view_loading.jsxi:29
				_node.style.display = 'none';                                      // view_loading.jsxi:30
			});
	})();
	return ViewLoading;
})();

/* Class "ViewNewVersion" declaration */
var ViewNewVersion = (function (){                                                 // view_new_version.jsxi:1
	var ViewNewVersion = function (){}, 
		_upd,                                                                      // view_new_version.jsxi:2
		_inf,                                                                      // view_new_version.jsxi:2
		_autoinstall = true;                                                       // view_new_version.jsxi:3
	
	function newVersion(inf){                                                      // view_new_version.jsxi:5
		_inf = inf;                                                                // view_new_version.jsxi:6
		
		var d = new Dialog('New Version',                                          // view_new_version.jsxi:8
			[
				'Current version: {0}'.format(gui.App.manifest.version),           // view_new_version.jsxi:9
				'New version: {0}'.format(inf.actualVersion),                      // view_new_version.jsxi:10
				inf.changelog && 'Changelog:<div style="max-height:400px;overflow-y:auto"><ul><li>{0}</li></ul></div>'.format(inf.changelog.map(function (e){
					return '<div>' + e.version + '</div><ul><li>' + e.changes.join('</li><li>') + '</li></ul>';
				}).join('</li><li>'))
			], 
			function (){                                                           // view_new_version.jsxi:16
				Shell.openItem(inf.detailsUrl);                                    // view_new_version.jsxi:17
				return !inf.downloadUrl && !inf.installUrl;                        // view_new_version.jsxi:18
			}, 
			false).setButton('Details');                                           // view_new_version.jsxi:19
		
		if (inf.installUrl){                                                       // view_new_version.jsxi:21
			d.addButton('Install',                                                 // view_new_version.jsxi:22
				function (){                                                       // view_new_version.jsxi:22
					CheckUpdate.install(inf.installUrl);                           // view_new_version.jsxi:23
				});
		} else if (inf.downloadUrl){                                               // view_new_version.jsxi:25
			d.addButton('Download',                                                // view_new_version.jsxi:26
				function (){                                                       // view_new_version.jsxi:26
					Shell.openItem(inf.downloadUrl);                               // view_new_version.jsxi:27
				});
		}
		
		d.addButton('Later');                                                      // view_new_version.jsxi:31
	}
	
	function installStart(){                                                       // view_new_version.jsxi:34
		_upd = new Dialog('Installation',                                          // view_new_version.jsxi:35
			[ '<progress indeterminate></progress>' ], 
			function (){                                                           // view_new_version.jsxi:37
				CheckUpdate.abort();                                               // view_new_version.jsxi:38
			}, 
			false).setButton('Abort');                                             // view_new_version.jsxi:39
	}
	
	function installProgress(value, max){                                          // view_new_version.jsxi:42
		if (!_upd)                                                                 // view_new_version.jsxi:43
			installStart();                                                        // view_new_version.jsxi:43
		
		_upd.find('progress').attr({ max: max, value: value });                    // view_new_version.jsxi:44
	}
	
	function installReady(){                                                       // view_new_version.jsxi:50
		if (_autoinstall){                                                         // view_new_version.jsxi:51
			CheckUpdate.autoupdate();                                              // view_new_version.jsxi:52
		} else {
			if (!_upd)                                                             // view_new_version.jsxi:54
				installStart();                                                    // view_new_version.jsxi:54
			
			_upd.setContent('Update ready. Application will be restarted.');       // view_new_version.jsxi:55
			_upd.setButton('Install',                                              // view_new_version.jsxi:56
				function (){                                                       // view_new_version.jsxi:56
					CheckUpdate.autoupdate();                                      // view_new_version.jsxi:57
				}).addButton('Later');                                             // view_new_version.jsxi:58
		}
	}
	
	function installInterrupt(){                                                   // view_new_version.jsxi:62
		if (!_upd)                                                                 // view_new_version.jsxi:63
			return;
		
		_upd.close();                                                              // view_new_version.jsxi:64
		_upd = null;                                                               // view_new_version.jsxi:65
	}
	
	function installFailed(e){                                                     // view_new_version.jsxi:68
		if (!_upd)                                                                 // view_new_version.jsxi:69
			installStart();                                                        // view_new_version.jsxi:69
		
		_upd.setContent('Update failed: {0}.'.format(e));                          // view_new_version.jsxi:70
		_upd.setButton('Nevermind', function (){}).addButton('Manual Update',      // view_new_version.jsxi:71
			function (){                                                           // view_new_version.jsxi:71
				Shell.openItem(_inf.downloadUrl || _inf.detailsUrl);               // view_new_version.jsxi:72
			});
	}
	
	function autoupdateFailed(e){                                                  // view_new_version.jsxi:76
		ErrorHandler.handled('Autoupdate failed.', e);                             // view_new_version.jsxi:77
	}
	
	(function (){                                                                  // view_new_version.jsxi:80
		CheckUpdate.on('update', newVersion).on('install:start', installStart).on('install:progress', installProgress).on('install:ready', installReady).on('install:interrupt', installInterrupt).on('install:failed', installFailed).on('autoupdate:failed', autoupdateFailed);
	})();
	return ViewNewVersion;
})();

/* Class "ViewSettings" declaration */
var ViewSettings = (function (){                                                   // view_settings.jsxi:1
	var ViewSettings = function (){}, 
		_prevFeedback, _list;
	
	function openDialog(){                                                         // view_settings.jsxi:4
		function save(){                                                           // view_settings.jsxi:5
			if (acdirVal === false)                                                // view_settings.jsxi:6
				return false;
			
			if (acdirVal != null){                                                 // view_settings.jsxi:8
				AcDir.set(acdirVal);                                               // view_settings.jsxi:9
			}
			
			Settings.update(function (s){                                          // view_settings.jsxi:12
				s.disableTips = disableTips;                                       // view_settings.jsxi:13
				s.updateDatabase = updateDatabase;                                 // view_settings.jsxi:14
				s.uploadData = uploadData;                                         // view_settings.jsxi:15
				s.updatesCheck = updatesCheck;                                     // view_settings.jsxi:16
				s.updatesSource = updatesSource;                                   // view_settings.jsxi:17
				s.aptShowroom = aptShowroom;                                       // view_settings.jsxi:19
				s.aptFilter = aptFilter;                                           // view_settings.jsxi:20
				s.aptDisableSweetFx = aptDisableSweetFx;                           // view_settings.jsxi:21
				s.aptResize = aptResize;                                           // view_settings.jsxi:22
				s.aptCameraX = aptCameraX;                                         // view_settings.jsxi:23
				s.aptCameraY = aptCameraY;                                         // view_settings.jsxi:24
				s.aptIncreaseDelays = aptIncreaseDelays;                           // view_settings.jsxi:25
			});
		}
		
		var d = new Dialog('Settings',                                             // view_settings.jsxi:29
			[
				'<h6>Assetto Corsa Folder</h6>',                                   // view_settings.jsxi:30
				'<button id="settings-acdir-select" style="float:right;width:30px">…</button>', 
				'<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">', 
				'<h6>Tips</h6>',                                                   // view_settings.jsxi:34
				'<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>', 
				'<h6>Database</h6>',                                               // view_settings.jsxi:37
				'<label><input id="settings-update-database" type="checkbox" disabled>Update databases</label><br>', 
				'<label><input id="settings-upload-data" type="checkbox">Upload some changes</label>', 
				'<h6>Updates</h6>',                                                // view_settings.jsxi:41
				'<label><input id="settings-updates-check" type="checkbox">Check for new versions on launch</label>', 
				'<select id="settings-updates-source"><option value="stable">Stable</option><option value="last">Beta</option></select>'
			], 
			save,                                                                  // view_settings.jsxi:47
			false).setButton('Save').addButton('Cancel');                          // view_settings.jsxi:47
		
		var acdirVal;
		
		function acdirChange(){                                                    // view_settings.jsxi:51
			var err = AcDir.check(acdirVal = d.find('#settings-acdir').val());     // view_settings.jsxi:52
			
			$(this).toggleClass('invalid', !!err).attr('title', err || null);      // view_settings.jsxi:53
			
			if (err){                                                              // view_settings.jsxi:54
				acdirVal = false;                                                  // view_settings.jsxi:55
			}
		}
		
		d.content.find('#settings-acdir').val(AcDir.root).change(acdirChange);     // view_settings.jsxi:59
		d.content.find('#settings-acdir-select').click(function (){                // view_settings.jsxi:61
			$('<input type="file" nwdirectory />').attr({ nwworkingdir: d.content.find('#settings-acdir').val() }).change(function (){
				d.content.find('#settings-acdir').val(this.value);                 // view_settings.jsxi:65
				acdirChange();                                                     // view_settings.jsxi:66
			}).click();                                                            // view_settings.jsxi:67
		});
		
		var disableTips = Settings.get('disableTips');
		
		d.content.find('#settings-disable-tips').change(function (arg){            // view_settings.jsxi:72
			disableTips = this.checked;                                            // view_settings.jsxi:72
		})[0].checked = disableTips;                                               // view_settings.jsxi:72
		
		var updateDatabase = Settings.get('updateDatabase');
		
		d.content.find('#settings-update-database').change(function (arg){         // view_settings.jsxi:76
			updateDatabase = this.checked;                                         // view_settings.jsxi:76
		})[0].checked = updateDatabase;                                            // view_settings.jsxi:76
		
		var uploadData = Settings.get('uploadData');
		
		d.content.find('#settings-upload-data').change(function (arg){             // view_settings.jsxi:79
			uploadData = this.checked;                                             // view_settings.jsxi:79
		})[0].checked = uploadData;                                                // view_settings.jsxi:79
		
		var updatesCheck = Settings.get('updatesCheck');
		
		d.content.find('#settings-updates-check').change(function (arg){           // view_settings.jsxi:83
			updatesCheck = this.checked;                                           // view_settings.jsxi:83
		})[0].checked = updatesCheck;                                              // view_settings.jsxi:83
		
		var updatesSource = Settings.get('updatesSource');
		
		d.content.find('#settings-updates-source').change(function (arg){          // view_settings.jsxi:86
			updatesSource = this.value;                                            // view_settings.jsxi:86
		})[0].value = updatesSource;                                               // view_settings.jsxi:86
		
		var apt = d.addTab('Auto-Preview',                                         // view_settings.jsxi:89
			[
				'<h6>Showroom</h6>',                                               // view_settings.jsxi:90
				'<select id="apt-showroom"><option value="">Black Showroom (Recommended)</option>{0}</select>'.format(AcShowroom.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join('')),                                                      // view_settings.jsxi:93
				'<h6>Filter</h6>',                                                 // view_settings.jsxi:95
				'<select id="apt-filter"><option value="">Don\'t change</option>{0}</select>'.format(AcFilters.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.id);
				}).join('')),                                                      // view_settings.jsxi:98
				'<label><input id="apt-disable-sweetfx" type="checkbox">Disable SweetFX (Recommended)</label>', 
				'<h6>Resize</h6>',                                                 // view_settings.jsxi:101
				'<label><input id="apt-resize" type="checkbox">Change size to default 1024×576 (Recommended)</label>', 
				'<h6>Camera Position</h6>',                                        // view_settings.jsxi:104
				'<label>X: <input id="apt-camera-x" type="number" step="1"></label>', 
				'<label>Y: <input id="apt-camera-y" type="number" step="1"></label>', 
				'<h6>Delays</h6>',                                                 // view_settings.jsxi:108
				'<label><input id="apt-increase-delays" type="checkbox">Increased delays</label>'
			], 
			save).setButton('Save').addButton('Defaults',                          // view_settings.jsxi:111
			function (){                                                           // view_settings.jsxi:111
				apt.content.find('#apt-showroom')[0].value = (aptShowroom = Settings.defaults.aptShowroom);
				apt.content.find('#apt-filter')[0].value = (aptFilter = Settings.defaults.aptFilter);
				apt.content.find('#apt-disable-sweetfx')[0].checked = (aptDisableSweetFx = Settings.defaults.aptDisableSweetFx);
				apt.content.find('#apt-resize')[0].checked = (aptResize = Settings.defaults.aptResize);
				apt.content.find('#apt-camera-x')[0].value = (aptCameraX = Settings.defaults.aptCameraX);
				apt.content.find('#apt-camera-y')[0].value = (aptCameraY = Settings.defaults.aptCameraY);
				apt.content.find('#apt-increase-delays')[0].checked = (aptIncreaseDelays = Settings.defaults.aptIncreaseDelays);
				return false;
			}).addButton('Cancel');                                                // view_settings.jsxi:120
		
		var aptShowroom = Settings.get('aptShowroom');
		
		apt.content.find('#apt-showroom').change(function (arg){                   // view_settings.jsxi:123
			aptShowroom = this.value;                                              // view_settings.jsxi:123
		})[0].value = aptShowroom;                                                 // view_settings.jsxi:123
		
		var aptFilter = Settings.get('aptFilter');
		
		apt.content.find('#apt-filter').change(function (arg){                     // view_settings.jsxi:126
			aptFilter = this.value;                                                // view_settings.jsxi:126
		})[0].value = aptFilter;                                                   // view_settings.jsxi:126
		apt.content.find('#apt-filter [value="' + Settings.defaults.aptFilter + '"]')[0].textContent += ' (Recommended)';
		
		var aptDisableSweetFx = Settings.get('aptDisableSweetFx');
		
		apt.content.find('#apt-disable-sweetfx').change(function (arg){            // view_settings.jsxi:130
			aptDisableSweetFx = this.checked;                                      // view_settings.jsxi:130
		})[0].checked = aptDisableSweetFx;                                         // view_settings.jsxi:130
		
		var aptResize = Settings.get('aptResize');
		
		apt.content.find('#apt-resize').change(function (arg){                     // view_settings.jsxi:133
			aptResize = this.checked;                                              // view_settings.jsxi:133
		})[0].checked = aptResize;                                                 // view_settings.jsxi:133
		
		var aptCameraX = Settings.get('aptCameraX');
		
		apt.content.find('#apt-camera-x').change(function (arg){                   // view_settings.jsxi:136
			aptCameraX = this.value;                                               // view_settings.jsxi:136
		})[0].value = aptCameraX;                                                  // view_settings.jsxi:136
		
		var aptCameraY = Settings.get('aptCameraY');
		
		apt.content.find('#apt-camera-y').change(function (arg){                   // view_settings.jsxi:139
			aptCameraY = this.value;                                               // view_settings.jsxi:139
		})[0].value = aptCameraY;                                                  // view_settings.jsxi:139
		
		var aptIncreaseDelays = Settings.get('aptIncreaseDelays');
		
		apt.content.find('#apt-increase-delays').change(function (arg){            // view_settings.jsxi:142
			aptIncreaseDelays = this.checked;                                      // view_settings.jsxi:142
		})[0].checked = aptIncreaseDelays;                                         // view_settings.jsxi:142
		d.addTab('About',                                                          // view_settings.jsxi:145
			[
				'<h6>Version</h6>',                                                // view_settings.jsxi:146
				gui.App.manifest.version,                                          // view_settings.jsxi:147
				'<h6>Author</h6>',                                                 // view_settings.jsxi:148
				'x4fab'
			]).addButton('Feedback',                                               // view_settings.jsxi:150
			function (){                                                           // view_settings.jsxi:150
				feedbackForm();                                                    // view_settings.jsxi:151
				return false;
			}).addButton('Check for update',                                       // view_settings.jsxi:153
			function (){                                                           // view_settings.jsxi:153
				var b = this.buttons.find('button:last-child').text('Please wait...').attr('disabled', true);
				
				CheckUpdate.check();                                               // view_settings.jsxi:155
				CheckUpdate.one('check',                                           // view_settings.jsxi:156
					function (arg){                                                // view_settings.jsxi:156
						b.text('Check again').attr('disabled', null);              // view_settings.jsxi:157
						
						if (arg === 'check:failed'){                               // view_settings.jsxi:158
							new Dialog('Check For Update', 'Cannot check for update.');
						} else if (arg !== 'check:done:found'){                    // view_settings.jsxi:160
							new Dialog('Check For Update', 'New version not found.');
						}
					});
				return false;
			});
	}
	
	function filtersList(){}
	
	function feedbackForm(){                                                       // view_settings.jsxi:173
		function sendFeedback(v){                                                  // view_settings.jsxi:174
			d.buttons.find('button:first-child').text('Please wait...').attr('disabled', true);
			AppServerRequest.sendFeedback(v,                                       // view_settings.jsxi:177
				function (arg){                                                    // view_settings.jsxi:177
					d.close();                                                     // view_settings.jsxi:178
					
					if (arg){                                                      // view_settings.jsxi:179
						new Dialog('Cannot Send Feedback', 'Sorry about that.');   // view_settings.jsxi:180
					} else {
						_prevFeedback = null;                                      // view_settings.jsxi:182
						new Dialog('Feedback Sent', 'Thank you.');                 // view_settings.jsxi:183
					}
				});
		}
		
		var d = new Dialog('Feedback',                                             // view_settings.jsxi:188
			'<textarea style="width:350px;height:200px;resize:none" maxlength="5000"\
                placeholder="If you have any ideas or suggestions please let me know"></textarea>', 
			function (){                                                           // view_settings.jsxi:189
				var v = this.content.find('textarea').val().trim();
				
				if (v)                                                             // view_settings.jsxi:191
					sendFeedback(v);                                               // view_settings.jsxi:191
				return false;
			}, 
			false).setButton('Send').addButton('Cancel').closeOnEnter(false);      // view_settings.jsxi:193
		
		d.content.find('textarea').val(_prevFeedback || '').change(function (arg){
			return _prevFeedback = this.value;                                     // view_settings.jsxi:194
		});
	}
	
	(function (){                                                                  // view_settings.jsxi:197
		$('#settings-open').click(openDialog);                                     // view_settings.jsxi:198
	})();
	return ViewSettings;
})();

if (Settings.get('updatesCheck')){                                                 // app.jsxi:1
	setTimeout(function (){                                                        // app.jsxi:2
		CheckUpdate.check();                                                       // app.jsxi:3
	}, 
	5e1);
}

setTimeout(function (){                                                            // app.jsxi:7
	try {
		fs.rmdirSync(path.join(path.dirname(process.execPath), 'locales'));        // app.jsxi:8
	} catch (e){} 
}, 
50);
$(window).on('keydown',                                                            // app.jsxi:11
	function (e){                                                                  // app.jsxi:12
		if (Event.isSomeInput(e))                                                  // app.jsxi:13
			return;
		
		if (e.keyCode == 39){                                                      // app.jsxi:14
			var l = $('[data-action="next"]');
			
			if (l[l.length - 1])                                                   // app.jsxi:16
				l[l.length - 1].click();                                           // app.jsxi:16
		}
		
		if (e.keyCode == 37){                                                      // app.jsxi:18
			var l = $('[data-action="prev"]');
			
			if (l[l.length - 1])                                                   // app.jsxi:20
				l[l.length - 1].click();                                           // app.jsxi:20
		}
	});
AppWindow.on('close',                                                              // app.jsxi:24
	function (){                                                                   // app.jsxi:25
		if (Cars.list.filter(function (e){                                         // app.jsxi:26
			return e.changed;                                                      // app.jsxi:27
		}).length > 0){                                                            // app.jsxi:28
			new Dialog('Close',                                                    // app.jsxi:29
				[ 'Unsaved changes will be lost. Are you sure?' ], 
				function (){                                                       // app.jsxi:31
					AppWindow.close(true);                                         // app.jsxi:32
				});
		} else {
			AppWindow.close(true);                                                 // app.jsxi:35
		}
	});
ViewList.on('select',                                                              // app.jsxi:39
	function (car){                                                                // app.jsxi:40
		AppWindow.title = car.data ? car.data.name : car.id;                       // app.jsxi:41
	});
Cars.on('update.car.data',                                                         // app.jsxi:44
	function (car){                                                                // app.jsxi:45
		if (car === ViewList.selected){                                            // app.jsxi:46
			AppWindow.title = car.data ? car.data.name : car.id;                   // app.jsxi:47
		}
	});

var first = true;

AcDir.on('change',                                                                 // app.jsxi:52
	function (){                                                                   // app.jsxi:53
		Cars.scan();                                                               // app.jsxi:54
		
		if (first && !Settings.get('disableTips')){                                // app.jsxi:56
			new Dialog('Tip',                                                      // app.jsxi:57
				Tips.next,                                                         // app.jsxi:57
				function (){                                                       // app.jsxi:57
					this.find('p').html(Tips.next);                                // app.jsxi:58
					this.find('h4').text('Another Tip');                           // app.jsxi:59
					return false;
				}).setButton('Next').addButton('Disable Tips',                     // app.jsxi:61
				function (){                                                       // app.jsxi:61
					Settings.set('disableTips', true);                             // app.jsxi:62
				}).find('p').css('maxWidth', 400);                                 // app.jsxi:63
			first = false;                                                         // app.jsxi:65
		}
	});
AcDir.init();                                                                      // app.jsxi:69

