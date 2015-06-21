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
RegExp.fromQuery = function (q, w){                                                // helpers.jsxi:15
	var r = q.replace(/(?=[\$^.+(){}[\]])/g, '\\').replace(/\?|(\*)/g, '.$1');     // helpers.jsxi:16
	return new RegExp(w ? '^(?:' + r + ')$' : r, 'i');                             // helpers.jsxi:17
};
String.prototype.cssUrl = function (){                                             // helpers.jsxi:20
	return 'file://' + this.replace(/\\/g, '/');                                   // helpers.jsxi:21
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
			return 'Directory not found';                                          // ac_dir.jsxi:8
		}
		
		if (!fs.existsSync(path.join(d, 'content', 'cars'))){                      // ac_dir.jsxi:11
			return 'Directory content/cars not found';                             // ac_dir.jsxi:12
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
			var dialog = new Dialog('Cars Directory',                              // ac_dir.jsxi:46
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

/* Class "AcPractice" declaration */
var AcPractice = (function (){                                                     // ac_practice.jsxi:1
	var AcPractice = function (){}, 
		_tracks = null;
	
	function loadTracks(){                                                         // ac_practice.jsxi:4
		_tracks = fs.readdirSync(AcDir.tracks).map(function (e){                   // ac_practice.jsxi:5
			var p = path.join(AcDir.tracks, e);
			
			var d = null;
			
			var j = path.join(p, 'ui', 'ui_track.json');
			
			if (fs.existsSync(j)){                                                 // ac_practice.jsxi:10
				try {
					d = JSON.parse(fs.readFileSync(j));                            // ac_practice.jsxi:12
				} catch (e){} 
			}
			return { id: e, data: d, path: p, json: j };
		}).filter(function (e){                                                    // ac_practice.jsxi:22
			return e;                                                              // ac_practice.jsxi:23
		});
	}
	
	AcPractice.start = function (c, s, r){                                         // ac_practice.jsxi:27
		if (c.path.indexOf(AcDir.cars))                                            // ac_practice.jsxi:28
			return;
		
		if (s == null){                                                            // ac_practice.jsxi:30
			s = c.skins.selected.id;                                               // ac_practice.jsxi:31
		}
		
		r = r || localStorage.lastTrack || 'spa';                                  // ac_practice.jsxi:34
		localStorage.lastTrack = r;                                                // ac_practice.jsxi:35
		
		try {
			AcTools.Processes.Game.StartPractice(AcDir.root, c.id, s, r.split('/')[0], r.split('/')[1] || '');
		} catch (e){                                                               // ac_practice.jsxi:39
			ErrorHandler.handled('Cannot start the game. Maybe there is not enough rights.');
		} 
	};
	AcPractice.select = function (c, s){                                           // ac_practice.jsxi:44
		if (!_tracks){                                                             // ac_practice.jsxi:45
			loadTracks();                                                          // ac_practice.jsxi:46
		}
		
		new Dialog('Track',                                                        // ac_practice.jsxi:49
			[
				'<select>{0}</select>'.format(_tracks.map(function (e){            // ac_practice.jsxi:50
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join(''))
			], 
			function (){                                                           // ac_practice.jsxi:53
				AcPractice.start(c, s, this.find('select').val());
			}).addButton('Reload List',                                            // ac_practice.jsxi:55
			function (){                                                           // ac_practice.jsxi:55
				setTimeout(function (){                                            // ac_practice.jsxi:56
					loadTracks();                                                  // ac_practice.jsxi:57
					AcPractice.select(c, s);
				});
			}).find('select').val(localStorage.lastTrack || 'spa').change(function (){
			localStorage.lastTrack = this.value;                                   // ac_practice.jsxi:61
		});
	};
	return AcPractice;
})();

/* Class "AcShowroom" declaration */
var AcShowroom = (function (){                                                     // ac_showrooms.jsxi:1
	var AcShowroom = function (){}, 
		_showrooms = null;
	
	function loadShowrooms(){                                                      // ac_showrooms.jsxi:4
		_showrooms = fs.readdirSync(AcDir.showrooms).map(function (e){             // ac_showrooms.jsxi:5
			var p = path.join(AcDir.showrooms, e);
			
			var d = null;
			
			var j = path.join(p, 'ui', 'ui_showroom.json');
			
			if (fs.existsSync(j)){                                                 // ac_showrooms.jsxi:10
				try {
					d = JSON.parse(fs.readFileSync(j));                            // ac_showrooms.jsxi:12
				} catch (e){} 
			}
			return { id: e, data: d, path: p, json: j };
		}).filter(function (e){                                                    // ac_showrooms.jsxi:22
			return e;                                                              // ac_showrooms.jsxi:23
		});
	}
	
	AcShowroom.start = function (c, s, r){                                         // ac_showrooms.jsxi:27
		if (c.path.indexOf(AcDir.cars))                                            // ac_showrooms.jsxi:28
			return;
		
		if (s == null){                                                            // ac_showrooms.jsxi:30
			s = c.skins.selected.id;                                               // ac_showrooms.jsxi:31
		}
		
		r = r || localStorage.lastShowroom || 'showroom';                          // ac_showrooms.jsxi:34
		
		try {
			AcTools.Processes.Showroom.Start(AcDir.root, c.id, s, r);              // ac_showrooms.jsxi:36
		} catch (err){                                                             // ac_showrooms.jsxi:37
			ErrorHandler.handled('Cannot start showroom. Maybe there is not enough rights or the car is broken.');
			return;
		} 
		
		localStorage.lastShowroom = r;                                             // ac_showrooms.jsxi:41
	};
	AcShowroom.select = function (c, s){                                           // ac_showrooms.jsxi:44
		if (!_showrooms){                                                          // ac_showrooms.jsxi:45
			loadShowrooms();                                                       // ac_showrooms.jsxi:46
		}
		
		new Dialog('Showroom',                                                     // ac_showrooms.jsxi:49
			[
				'<select>{0}</select>'.format(_showrooms.map(function (e){         // ac_showrooms.jsxi:50
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join(''))
			], 
			function (){                                                           // ac_showrooms.jsxi:53
				AcShowroom.start(c, s, this.find('select').val());
			}).addButton('Reload List',                                            // ac_showrooms.jsxi:55
			function (){                                                           // ac_showrooms.jsxi:55
				setTimeout(function (){                                            // ac_showrooms.jsxi:56
					loadShowrooms();                                               // ac_showrooms.jsxi:57
					AcShowroom.select(c, s);
				});
			}).find('select').val(localStorage.lastShowroom || 'showroom').change(function (){
			localStorage.lastShowroom = this.value;                                // ac_showrooms.jsxi:61
		});
	};
	AcShowroom.shot = function (c, m){                                             // ac_showrooms.jsxi:65
		if (c.path.indexOf(AcDir.cars))                                            // ac_showrooms.jsxi:66
			return;
		
		var output;
		
		try {
			output = AcTools.Processes.Showroom.Shot(AcDir.root, c.id, 140, 
				- 36, 
				!!m);                                                              // ac_showrooms.jsxi:72
		} catch (err){                                                             // ac_showrooms.jsxi:73
			ErrorHandler.handled('Cannot get previews. Maybe process was terminated, there is not enough rights or the car is broken.');
			return;
		} 
		
		Shell.openItem(output);                                                    // ac_showrooms.jsxi:78
		new Dialog('Update Previews',                                              // ac_showrooms.jsxi:79
			[ 'New previews ready. Apply?' ], 
			function (){                                                           // ac_showrooms.jsxi:81
				AcTools.Utils.ImageUtils.ApplyPreviews(AcDir.root, c.id, output);
				Cars.updateSkins(c);                                               // ac_showrooms.jsxi:83
				fs.rmdirSync(output);                                              // ac_showrooms.jsxi:84
			}, 
			false).setButton('Yes').addButton('No');                               // ac_showrooms.jsxi:85
	};
	return AcShowroom;
})();

__defineGetter__('AcTools',                                                        // ac_tools.jsxi:1
	function (){                                                                   // ac_tools.jsxi:1
		return AcTools = require('clr').init({ assemblies: [ 'native/AcTools.dll' ], global: false }).AcTools;
	});

/* Class "AppServerRequest" declaration */
var AppServerRequest = (function (){                                               // app_server_request.jsxi:1
	var AppServerRequest = function (){}, 
		_host = 'ascobash.comuf.com';                                              // app_server_request.jsxi:2
	
	AppServerRequest.checkUpdate = function (version, source, callback){           // app_server_request.jsxi:6
		$.ajax({                                                                   // app_server_request.jsxi:7
			url: 'http://ascobash.comuf.com/api.php?0=check&v=' + version + '&b=' + source
		}).fail(function (){                                                       // app_server_request.jsxi:9
			callback('error:request');                                             // app_server_request.jsxi:10
		}).done(function (data){                                                   // app_server_request.jsxi:11
			if (data == null || typeof data === 'object'){                         // app_server_request.jsxi:12
				callback(null, data);                                              // app_server_request.jsxi:13
			} else {
				callback('error:' + data);                                         // app_server_request.jsxi:15
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
			callback('error:request');                                             // app_server_request.jsxi:28
		}).done(function (data){                                                   // app_server_request.jsxi:29
			callback(null);                                                        // app_server_request.jsxi:30
		});
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
	
	function initCar(carPath){                                                     // cars.jsxi:22
		var id = carPath.slice(Math.max(carPath.lastIndexOf('/'), carPath.lastIndexOf('\\')) + 1);
		
		var disabled = carPath.indexOf(AcDir.carsOff) != - 1;
		
		var json = path.join(carPath, 'ui', 'ui_car.json');
		
		var badge = path.join(carPath, 'ui', 'badge.png');
		
		var upgrade = path.join(carPath, 'ui', 'upgrade.png');
		return {
			id: id,                                                                // cars.jsxi:30
			path: carPath,                                                         // cars.jsxi:31
			disabled: disabled,                                                    // cars.jsxi:32
			json: json,                                                            // cars.jsxi:34
			badge: badge,                                                          // cars.jsxi:35
			upgrade: upgrade,                                                      // cars.jsxi:36
			error: [],                                                             // cars.jsxi:38
			changed: false,                                                        // cars.jsxi:39
			parent: null,                                                          // cars.jsxi:41
			children: []
		};
	}
	
	function loadCar(car, callback){                                               // cars.jsxi:46
		fs.readdir(path.join(car.path, 'skins'),                                   // cars.jsxi:47
			function (err, skins){                                                 // cars.jsxi:47
				car.skins = false;                                                 // cars.jsxi:48
				
				if (err){                                                          // cars.jsxi:50
					car.error.push({ id: 'skins-not-readable', msg: 'Cannot read skins' });
					mediator.dispatch('error', car);                               // cars.jsxi:52
					return;
				}
				
				skins = skins.filter(function (e){                                 // cars.jsxi:56
					return !/\.\w{3,4}$/.test(e);                                  // cars.jsxi:57
				});
				
				if (skins.length == 0){                                            // cars.jsxi:60
					car.error.push({ id: 'skins-empty', msg: 'Skins folder is empty' });
					mediator.dispatch('error', car);                               // cars.jsxi:62
					return;
				}
				
				car.skins = skins.map(function (e){                                // cars.jsxi:66
					var p = path.join(car.path, 'skins', e);
					
					var e = {                                                      // cars.jsxi:68
						id: e,                                                     // cars.jsxi:68
						path: p,                                                   // cars.jsxi:70
						livery: path.join(p, 'livery.png'),                        // cars.jsxi:71
						preview: path.join(p, 'preview.jpg')
					};
					return e;                                                      // cars.jsxi:75
				});
				car.skins.selected = car.skins[0];                                 // cars.jsxi:78
				mediator.dispatch('update:car:skins', car);                        // cars.jsxi:79
			});
		
		if (!fs.existsSync(car.badge)){                                            // cars.jsxi:82
			car.error.push({ id: 'badge-missing', msg: 'Missing badge.png', details: null });
			mediator.dispatch('error', car);                                       // cars.jsxi:84
		}
		
		if (!fs.existsSync(car.json)){                                             // cars.jsxi:87
			if (fs.existsSync(car.json + '.disabled')){                            // cars.jsxi:88
				fs.renameSync(car.json + '.disabled', car.json);                   // cars.jsxi:89
			} else {
				if (car.changed){                                                  // cars.jsxi:91
					car.changed = false;                                           // cars.jsxi:92
					mediator.dispatch('update:car:changed', car);                  // cars.jsxi:93
				}
				
				car.data = false;                                                  // cars.jsxi:96
				car.error.push({                                                   // cars.jsxi:97
					id: 'json-missing',                                            // cars.jsxi:97
					msg: 'Missing ui_car.json',                                    // cars.jsxi:97
					details: null
				});
				mediator.dispatch('error', car);                                   // cars.jsxi:98
				mediator.dispatch('update:car:data', car);                         // cars.jsxi:99
				
				if (typeof callback === 'function')                                // cars.jsxi:100
					callback();                                                    // cars.jsxi:100
				return;
			}
		}
		
		fs.readFile(car.json,                                                      // cars.jsxi:105
			function (err, d){                                                     // cars.jsxi:105
				if (typeof callback === 'function')                                // cars.jsxi:106
					callback();                                                    // cars.jsxi:106
				
				if (car.changed){                                                  // cars.jsxi:108
					car.changed = false;                                           // cars.jsxi:109
					mediator.dispatch('update:car:changed', car);                  // cars.jsxi:110
				}
				
				if (err){                                                          // cars.jsxi:113
					car.data = false;                                              // cars.jsxi:114
					car.error.push({                                               // cars.jsxi:115
						id: 'json-read',                                           // cars.jsxi:115
						msg: 'Unavailable ui_car.json',                            // cars.jsxi:115
						details: err
					});
					mediator.dispatch('error', car);                               // cars.jsxi:116
				} else {
					var p;
					
					try {
						eval('p=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g, 
							function (_){                                          // cars.jsxi:120
								return _.replace(/\r?\n/g, '\\n');                 // cars.jsxi:121
							}));
					} catch (er){                                                  // cars.jsxi:123
						err = er;                                                  // cars.jsxi:124
					} 
					
					if (err){                                                      // cars.jsxi:127
						car.data = false;                                          // cars.jsxi:128
						car.error.push({ id: 'json-parse', msg: 'Damaged ui_car.json', details: err });
						mediator.dispatch('error', car);                           // cars.jsxi:130
					} else {
						if (!p.name){                                              // cars.jsxi:132
							car.error.push({ id: 'data-name', msg: 'Name is missing' });
							mediator.dispatch('error', car);                       // cars.jsxi:134
							return;
						}
						
						if (!p.brand){                                             // cars.jsxi:138
							car.error.push({ id: 'data-brand', msg: 'Brand is missing' });
							mediator.dispatch('error', car);                       // cars.jsxi:140
							return;
						}
						
						if (!p.description)                                        // cars.jsxi:144
							p.description = '';                                    // cars.jsxi:144
						
						if (!p.tags)                                               // cars.jsxi:145
							p.tags = [];                                           // cars.jsxi:145
						
						if (!p.specs)                                              // cars.jsxi:146
							p.specs = {};                                          // cars.jsxi:146
						
						p.class = p.class || '';                                   // cars.jsxi:148
						p.description = p.description.replace(/\n/g, ' ').replace(/<\/?br\/?>[ \t]*|\n[ \t]+/g, '\n').replace(/<\s*\/?\s*\w+\s*>/g, '').replace(/[\t ]+/g, ' ');
						car.data = p;                                              // cars.jsxi:152
						
						if (car.data.parent != null){                              // cars.jsxi:154
							var parent = Cars.byName(car.data.parent);
							
							if (parent == null){                                   // cars.jsxi:156
								car.error.push({ id: 'parent-missing', msg: 'Parent is missing' });
							} else {
								car.parent = parent;                               // cars.jsxi:159
								parent.children.push(car);                         // cars.jsxi:160
								mediator.dispatch('update:car:parent', car);       // cars.jsxi:162
								mediator.dispatch('update:car:children', parent);
							}
							
							if (!fs.existsSync(car.upgrade)){                      // cars.jsxi:166
								car.error.push({                                   // cars.jsxi:167
									id: 'upgrade-missing',                         // cars.jsxi:167
									msg: 'Missing upgrade.png',                    // cars.jsxi:167
									details: null
								});
								mediator.dispatch('error', car);                   // cars.jsxi:168
							}
						}
						
						car.data.tags.forEach(function (e){                        // cars.jsxi:172
							var l = e.toLowerCase();
							
							if (_tagsLower.indexOf(l) < 0){                        // cars.jsxi:174
								_tags.push(e);                                     // cars.jsxi:175
								_tagsLower.push(l);                                // cars.jsxi:176
								mediator.dispatch('new.tag', e);                   // cars.jsxi:178
							}
						});
						
						var l = car.data.class.toLowerCase();
						
						if (_classesLower.indexOf(l) < 0){                         // cars.jsxi:183
							_classes.push(car.data.class);                         // cars.jsxi:184
							_classesLower.push(l);                                 // cars.jsxi:185
							mediator.dispatch('new.class', car.data.class);        // cars.jsxi:187
						}
						
						var l = car.data.brand.toLowerCase();
						
						if (_brandsLower.indexOf(l) < 0){                          // cars.jsxi:191
							_brands.push(car.data.brand);                          // cars.jsxi:192
							_brandsLower.push(l);                                  // cars.jsxi:193
							mediator.dispatch('new.brand', car.data.brand);        // cars.jsxi:195
						}
					}
				}
				
				mediator.dispatch('update:car:data', car);                         // cars.jsxi:200
			});
	}
	
	function asyncLoad(){                                                          // cars.jsxi:204
		var a = _list, i = 0;
		
		step();                                                                    // cars.jsxi:206
		
		function step(){                                                           // cars.jsxi:208
			if (a != _list){                                                       // cars.jsxi:209
				mediator.dispatch('scan:interrupt', a);                            // cars.jsxi:210
			} else if (i >= a.length){                                             // cars.jsxi:211
				mediator.dispatch('scan:ready', a);                                // cars.jsxi:212
			} else {
				mediator.dispatch('scan:progress', i, a.length);                   // cars.jsxi:214
				loadCar(a[i ++], step);                                            // cars.jsxi:215
			}
		}
	}
	
	Cars.scan = function (){                                                       // cars.jsxi:220
		mediator.dispatch('scan:start');                                           // cars.jsxi:221
		
		var names = {};
		
		_list = fs.readdirSync(AcDir.cars).map(function (e){                       // cars.jsxi:224
			return path.join(AcDir.cars, e);                                       // cars.jsxi:225
		}).concat(fs.readdirSync(AcDir.carsOff).map(function (e){                  // cars.jsxi:226
			return path.join(AcDir.carsOff, e);                                    // cars.jsxi:227
		})).map(function (carPath){                                                // cars.jsxi:228
			car = initCar(carPath);                                                // cars.jsxi:229
			
			if (names[car.id])                                                     // cars.jsxi:231
				return;
			
			mediator.dispatch('new.car', car);                                     // cars.jsxi:232
			names[car.id] = true;                                                  // cars.jsxi:233
			return car;                                                            // cars.jsxi:234
		}).filter(function (e){                                                    // cars.jsxi:235
			return e;                                                              // cars.jsxi:236
		});
		mediator.dispatch('scan:list', _list);                                     // cars.jsxi:239
		asyncLoad();                                                               // cars.jsxi:240
	};
	Cars.toggle = function (car, state){                                           // cars.jsxi:243
		var d = state == null ? !car.disabled : !state;
		
		if (car.disabled != d){                                                    // cars.jsxi:245
			var a, b;
			
			if (d){                                                                // cars.jsxi:247
				a = AcDir.cars, b = AcDir.carsOff;
			} else {
				a = AcDir.carsOff, b = AcDir.cars;
			}
			
			var newPath = car.path.replace(a, b);
			
			try {
				fs.renameSync(car.path, newPath);                                  // cars.jsxi:255
			} catch (err){                                                         // cars.jsxi:256
				ErrorHandler.handled(err);                                         // cars.jsxi:257
				return;
			} 
			
			car.disabled = d;                                                      // cars.jsxi:261
			car.path = newPath;                                                    // cars.jsxi:262
			car.json = car.json.replace(a, b);                                     // cars.jsxi:263
			car.badge = car.badge.replace(a, b);                                   // cars.jsxi:264
			car.upgrade = car.upgrade.replace(a, b);                               // cars.jsxi:265
			
			if (car.skins){                                                        // cars.jsxi:266
				car.skins.forEach(function (e){                                    // cars.jsxi:267
					for (var n in e){                                              // cars.jsxi:268
						if (typeof e[n] === 'string'){                             // cars.jsxi:269
							e[n] = e[n].replace(a, b);                             // cars.jsxi:270
						}
					}
				});
			}
			
			mediator.dispatch('update:car:disabled', car);                         // cars.jsxi:276
			mediator.dispatch('update:car:path', car);                             // cars.jsxi:277
			mediator.dispatch('update:car:skins', car);                            // cars.jsxi:278
			
			if (car.parent && !car.disabled && car.parent.disabled){               // cars.jsxi:280
				Cars.toggle(car.parent, true);
			}
			
			car.children.forEach(function (e){                                     // cars.jsxi:284
				Cars.toggle(e, !car.disabled);
			});
		}
	};
	Cars.changeData = function (car, key, value){                                  // cars.jsxi:290
		if (!car.data || car.data[key] == value)                                   // cars.jsxi:291
			return;
		
		car.data[key] = value;                                                     // cars.jsxi:293
		car.changed = true;                                                        // cars.jsxi:294
		mediator.dispatch('update:car:data', car);                                 // cars.jsxi:296
		mediator.dispatch('update:car:changed', car);                              // cars.jsxi:297
	};
	Cars.changeDataSpecs = function (car, key, value){                             // cars.jsxi:300
		if (!car.data || car.data.specs[key] == value)                             // cars.jsxi:301
			return;
		
		car.data.specs[key] = value;                                               // cars.jsxi:303
		car.changed = true;                                                        // cars.jsxi:304
		mediator.dispatch('update:car:data', car);                                 // cars.jsxi:306
		mediator.dispatch('update:car:changed', car);                              // cars.jsxi:307
	};
	Cars.changeParent = function (car, parentId){                                  // cars.jsxi:310
		if (!car.data || car.parent && car.parent.id == parentId || !car.parent && parentId == null)
			return;
		
		if (car.parent){                                                           // cars.jsxi:313
			car.parent.children.splice(car.parent.children.indexOf(car), 1);       // cars.jsxi:314
			mediator.dispatch('update:car:children', car.parent);                  // cars.jsxi:315
		}
		
		if (parentId){                                                             // cars.jsxi:318
			var parent = Cars.byName(parentId);
			
			if (!parent)                                                           // cars.jsxi:320
				return;
			
			car.parent = parent;                                                   // cars.jsxi:322
			parent.children.push(car);                                             // cars.jsxi:323
			mediator.dispatch('update:car:parent', car);                           // cars.jsxi:324
			mediator.dispatch('update:car:children', parent);                      // cars.jsxi:325
			car.data.parent = parent.id;                                           // cars.jsxi:327
			mediator.dispatch('update:car:data', car);                             // cars.jsxi:328
		} else {
			car.parent = null;                                                     // cars.jsxi:330
			mediator.dispatch('update:car:parent', car);                           // cars.jsxi:331
			delete car.data.parent;                                                // cars.jsxi:333
			mediator.dispatch('update:car:data', car);                             // cars.jsxi:334
		}
	};
	Cars.selectSkin = function (car, skinId){                                      // cars.jsxi:338
		var newSkin = car.skins.filter(function (e){                               // cars.jsxi:339
			return e.id == skinId;                                                 // cars.jsxi:340
		})[0];
		
		if (newSkin == car.skins.selected)                                         // cars.jsxi:343
			return;
		
		car.skins.selected = newSkin;                                              // cars.jsxi:345
		mediator.dispatch('update:car:skins', car);                                // cars.jsxi:346
	};
	Cars.updateSkins = function (car){                                             // cars.jsxi:349
		mediator.dispatch('update:car:skins', car);                                // cars.jsxi:350
	};
	Cars.reload = function (car){                                                  // cars.jsxi:353
		loadCar(car);                                                              // cars.jsxi:354
	};
	Cars.reloadUpgrade = function (car){                                           // cars.jsxi:357
		gui.App.clearCache();                                                      // cars.jsxi:358
		setTimeout(function (){                                                    // cars.jsxi:359
			mediator.dispatch('update:car:data', car);                             // cars.jsxi:360
		}, 
		100);
	};
	Cars.reloadAll = function (){                                                  // cars.jsxi:364
		Cars.scan();
	};
	Cars.save = function (car){                                                    // cars.jsxi:368
		if (car.data){                                                             // cars.jsxi:369
			var p = Object.clone(car.data);
			
			p.description = p.description.replace(/\n/g, '<br>');                  // cars.jsxi:371
			p.class = p.class.toLowerCase();                                       // cars.jsxi:372
			fs.writeFileSync(car.json,                                             // cars.jsxi:373
				JSON.stringify(p, null, 
					4));                                                           // cars.jsxi:373
			car.changed = false;                                                   // cars.jsxi:374
			mediator.dispatch('update:car:changed', car);                          // cars.jsxi:375
		}
	};
	Cars.saveAll = function (){                                                    // cars.jsxi:379
		_list.forEach(function (car){                                              // cars.jsxi:380
			if (car.changed){                                                      // cars.jsxi:381
				Cars.save(car);
			}
		});
	};
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'list', 
		{
			get: (function (){
				return _list;                                                      // cars.jsxi:387
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'brands', 
		{
			get: (function (){
				return _brands;                                                    // cars.jsxi:388
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'classes', 
		{
			get: (function (){
				return _classes;                                                   // cars.jsxi:389
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'tags', 
		{
			get: (function (){
				return _tags;                                                      // cars.jsxi:390
			})
		});
	(function (){                                                                  // cars.jsxi:392
		mediator.extend(Cars);                                                     // cars.jsxi:393
	})();
	return Cars;
})();

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
		_settings;
	
	function save(){                                                               // settings.jsxi:4
		localStorage.settings = JSON.stringify(_settings);                         // settings.jsxi:5
	}
	
	Settings.get = function (k, def){                                              // settings.jsxi:8
		return _settings.hasOwnProperty(k) ? _settings[k] : def;                   // settings.jsxi:9
	};
	Settings.set = function (k, val){                                              // settings.jsxi:12
		if (typeof k == 'object'){                                                 // settings.jsxi:13
			for (var n in k){                                                      // settings.jsxi:14
				_settings[n] = k[n];                                               // settings.jsxi:15
			}
		} else {
			_settings[k] = val;                                                    // settings.jsxi:18
		}
		
		save();                                                                    // settings.jsxi:21
	};
	Settings.update = function (f){                                                // settings.jsxi:24
		f(_settings);                                                              // settings.jsxi:25
		save();                                                                    // settings.jsxi:26
	};
	(function (){                                                                  // settings.jsxi:29
		_settings = {};                                                            // settings.jsxi:30
		
		try {
			_settings = JSON.parse(localStorage.settings) || {};                   // settings.jsxi:33
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

/* Class "UpdateDescriptionProvider" declaration */
function UpdateDescriptionProvider(car){                                           // update_description.jsxi:1
	if (this.constructor === UpdateDescriptionProvider)
		throw new Error('Trying to instantiate abstract class UpdateDescriptionProvider');
	
	this.___car = car;                                                             // update_description.jsxi:5
}
UpdateDescriptionProvider.prototype.prepare = function (s){                        // update_description.jsxi:11
	return s.replace(/\[(?:\d+|citation needed)\]/g, '');                          // update_description.jsxi:12
};
UpdateDescriptionProvider.prototype.clearUp = function (w){};
Object.defineProperty(UpdateDescriptionProvider.prototype, 
	'userAgent', 
	{
		get: (function (){
			return 'Mozilla/5.0 (Linux; Android 2.3) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36';
		})
	});

/* Class "UpdateDescriptionGoogleProvider" declaration */
function UpdateDescriptionGoogleProvider(){                                        // update_description.jsxi:18
	UpdateDescriptionProvider.apply(this, 
		arguments);
}
__prototypeExtend(UpdateDescriptionGoogleProvider, 
	UpdateDescriptionProvider);
UpdateDescriptionGoogleProvider.prototype.clearUp = function (w){                  // update_description.jsxi:21
	$('#before-appbar, #fbarcnt', w.document).remove();                            // update_description.jsxi:22
	$('a[target="_blank"]', w.document).removeAttr('target');                      // update_description.jsxi:23
};
Object.defineProperty(UpdateDescriptionGoogleProvider.prototype, 
	'url', 
	{
		get: (function (){
			return 'https://www.google.com/search?q=' + encodeURIComponent(this.___car.data.name);
		})
	});

/* Class "UpdateDescription" declaration */
function UpdateDescription(){}
UpdateDescription.update = function (car){                                         // update_description.jsxi:28
	provider = new UpdateDescriptionGoogleProvider(car);                           // update_description.jsxi:29
	
	var dialog = new Dialog('Update Description',                                  // update_description.jsxi:31
		[
			'<iframe nwdisable nwfaketop nwUserAgent="{0}" src="{1}"></iframe>'.format(provider.userAgent, provider.url)
		], 
		function (){                                                               // update_description.jsxi:33
			if (s){                                                                // update_description.jsxi:34
				Cars.changeData(c, 'description', provider.prepare(s));            // update_description.jsxi:35
			}
		});
	
	var s;
	
	dialog.find('iframe').on('load popstate',                                      // update_description.jsxi:40
		function (){                                                               // update_description.jsxi:40
			var w = this.contentWindow;
			
			provider.clearUp(w);                                                   // update_description.jsxi:42
			$('body', w.document).on('mouseup keydown keyup mousemove',            // update_description.jsxi:43
				function (e){                                                      // update_description.jsxi:43
					s = w.getSelection().toString();                               // update_description.jsxi:44
				});
		});
	
	var t = $('<div>\
            <button id="button-back">←</button>\
            <button id="button-return">↑</button>\
            <button id="button-external">↗</button>\
        </div>').insertBefore(dialog.header);                                      // update_description.jsxi:48
	
	t.find('#button-back').click(function (){                                      // update_description.jsxi:54
		dialog.find('iframe')[0].contentWindow.history.back();                     // update_description.jsxi:55
	});
	t.find('#button-return').click(function (){                                    // update_description.jsxi:58
		dialog.find('iframe')[0].src = provider.url;                               // update_description.jsxi:59
	});
	t.find('#button-external').click(function (){                                  // update_description.jsxi:62
		Shell.openItem(dialog.find('iframe')[0].contentWindow.location.href);      // update_description.jsxi:63
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
        </svg>'.format(du, html.replace(/<img.+?>/, ''));                          // upgrade_editor.jsxi:50
		
		var im = new Image();
		
		var sv = new Blob([ da ], { type: 'image/svg+xml;charset=utf-8' });        // upgrade_editor.jsxi:58
		
		var ur = URL.createObjectURL(sv);
		
		im.onload = function (){                                                   // upgrade_editor.jsxi:61
			try {
				var cb = document.createElement('canvas');
				
				cb.width = (cb.height = 128);                                      // upgrade_editor.jsxi:65
				
				var xb = cb.getContext('2d');
				
				xb.drawImage(im, 0, 
					0);                                                            // upgrade_editor.jsxi:67
				
				var cr = document.createElement('canvas');
				
				cr.width = (cr.height = 64);                                       // upgrade_editor.jsxi:70
				
				var xn = cr.getContext('2d');
				
				xn.drawImage(cb, 0, 
					0, 
					64, 
					64);                                                           // upgrade_editor.jsxi:72
				fs.writeFileSync(file, cr.toDataURL('image/png').slice(22), 'base64');
				callback(null);                                                    // upgrade_editor.jsxi:75
			} catch (e){                                                           // upgrade_editor.jsxi:76
				callback(e);                                                       // upgrade_editor.jsxi:77
			} finally {
				URL.revokeObjectURL(ur);                                           // upgrade_editor.jsxi:79
			}
		};
		im.src = ur;                                                               // upgrade_editor.jsxi:83
	}
	
	function saveFromLibrary(library, file, callback){                             // upgrade_editor.jsxi:86
		fs.writeFile(file, fs.readFileSync(library), callback);                    // upgrade_editor.jsxi:87
	}
	
	UpgradeEditor.start = function (car){                                          // upgrade_editor.jsxi:90
		function cb(e){                                                            // upgrade_editor.jsxi:91
			if (e){                                                                // upgrade_editor.jsxi:92
				ErrorHandler.handled(e);                                           // upgrade_editor.jsxi:93
			} else {
				Cars.reloadUpgrade(car);                                           // upgrade_editor.jsxi:95
			}
		}
		
		var d = new Dialog('Upgrade Editor',                                       // upgrade_editor.jsxi:99
			[
				'<div class="left"><h6>Current</h6><img class="car-upgrade"></div>', 
				'<div class="right"><h6>New</h6><div id="car-upgrade-editor"></div></div>', 
				'<p><i>Ctrl+I: Italic, Ctrl+B: Bold</i></p>'
			], 
			function (){                                                           // upgrade_editor.jsxi:103
				saveFromHtml(this.content.find('#car-upgrade-editor')[0].innerHTML, 
					car.upgrade,                                                   // upgrade_editor.jsxi:104
					cb);                                                           // upgrade_editor.jsxi:104
			}, 
			false).setButton('Save').addButton('Cancel');                          // upgrade_editor.jsxi:105
		
		d.el.addClass('dark');                                                     // upgrade_editor.jsxi:107
		d.content.find('img').attr('src', car.upgrade);                            // upgrade_editor.jsxi:108
		d.content.find('#car-upgrade-editor').append(editable('S1'));              // upgrade_editor.jsxi:109
		focus(d.content.find('#editable-focus')[0]);                               // upgrade_editor.jsxi:111
		
		var t = d.addTab('Library',                                                // upgrade_editor.jsxi:113
			"<img class=\"car-upgrade-library-element selected\" src=\"data/upgrade-lib/D.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/Race.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/S1.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/S2.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/S3.png\"></img><img class=\"car-upgrade-library-element\" src=\"data/upgrade-lib/Turbo.png\"></img>", 
			function (){                                                           // upgrade_editor.jsxi:113
				saveFromLibrary(t.content.find('.selected').attr('src'), car.upgrade, cb);
			}).setButton('Select').addButton('Cancel');                            // upgrade_editor.jsxi:115
		
		t.content.css('margin', '10px 0');                                         // upgrade_editor.jsxi:116
		t.find('.car-upgrade-library-element').click(function (){                  // upgrade_editor.jsxi:117
			$(this.parentNode).find('.selected').removeClass('selected');          // upgrade_editor.jsxi:118
			this.classList.add('selected');                                        // upgrade_editor.jsxi:119
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
	
	function outBadge(car){                                                        // view_details.jsxi:29
		var lo = $('#selected-car-logo');
		
		lo.attr('src', car.badge.cssUrl());                                        // view_details.jsxi:31
	}
	
	function updateParents(car){                                                   // view_details.jsxi:34
		var s = document.getElementById('selected-car-parent');
		
		if (!s)                                                                    // view_details.jsxi:36
			return;
		
		if (car.children.length > 0){                                              // view_details.jsxi:38
			s.parentNode.style.display = 'none';                                   // view_details.jsxi:39
		} else {
			s.parentNode.style.display = null;                                     // view_details.jsxi:41
			s.innerHTML = '<option value="">None</option>' + Cars.list.filter(function (e){
				return e.data && !e.disabled && e.parent == null && e.id != car.id && (!car.parent || car.parent.id != car.id);
			}).map(function (e){                                                   // view_details.jsxi:45
				return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);
			}).join('');                                                           // view_details.jsxi:47
			s.value = car.parent && car.parent.id || '';                           // view_details.jsxi:49
		}
	}
	
	function outData(car){                                                         // view_details.jsxi:53
		var he = $('#selected-car'),                                               // view_details.jsxi:54
			de = $('#selected-car-desc'),                                          // view_details.jsxi:55
			ta = $('#selected-car-tags'),                                          // view_details.jsxi:56
			pr = $('#selected-car-properties');                                    // view_details.jsxi:57
		
		if (car.data){                                                             // view_details.jsxi:58
			he.removeAttr('readonly');                                             // view_details.jsxi:59
			de.removeAttr('readonly');                                             // view_details.jsxi:60
			ta.show().find('li').remove();                                         // view_details.jsxi:62
			car.data.tags.forEach((function (e){                                   // view_details.jsxi:63
				$('<li>').text(e).insertBefore(this);                              // view_details.jsxi:64
			}).bind(ta.find('input')));                                            // view_details.jsxi:65
			updateTags(car.data.tags);                                             // view_details.jsxi:66
			
			if (car.data.name != he.val()){                                        // view_details.jsxi:68
				he.val(car.data.name);                                             // view_details.jsxi:69
			}
			
			if (car.data.description != de.val()){                                 // view_details.jsxi:72
				de.val(car.data.description).elastic();                            // view_details.jsxi:73
			}
			
			pr.show();                                                             // view_details.jsxi:76
			$('#selected-car-brand').val(car.data.brand);                          // view_details.jsxi:77
			$('#selected-car-class').val(car.data.class || '');                    // view_details.jsxi:78
			$('#selected-car-bhp').val(car.data.specs.bhp || '');                  // view_details.jsxi:80
			$('#selected-car-torque').val(car.data.specs.torque || '');            // view_details.jsxi:81
			$('#selected-car-weight').val(car.data.specs.weight || '');            // view_details.jsxi:82
			$('#selected-car-topspeed').val(car.data.specs.topspeed || '');        // view_details.jsxi:83
			$('#selected-car-acceleration').val(car.data.specs.acceleration || '');
			$('#selected-car-pwratio').val(car.data.specs.pwratio || '');          // view_details.jsxi:85
			updateParents(car);                                                    // view_details.jsxi:87
			
			if (car.parent){                                                       // view_details.jsxi:89
				$('#selected-car-upgrade').show().attr('src', car.upgrade);        // view_details.jsxi:90
			} else {
				$('#selected-car-upgrade').hide();                                 // view_details.jsxi:92
			}
		} else {
			he.attr('readonly', true).val(car.id);                                 // view_details.jsxi:95
			de.attr('readonly', true).val('');                                     // view_details.jsxi:96
			ta.hide();                                                             // view_details.jsxi:97
			pr.hide();                                                             // view_details.jsxi:98
		}
	}
	
	function outDisabled(car){                                                     // view_details.jsxi:102
		$('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');      // view_details.jsxi:103
		$('#selected-car-header').toggleClass('disabled', car.disabled);           // view_details.jsxi:104
	}
	
	function outChanged(car){                                                      // view_details.jsxi:107
		$('#selected-car-header').toggleClass('changed', car.changed);             // view_details.jsxi:108
	}
	
	function outSkins(car){                                                        // view_details.jsxi:111
		setTimeout(function (){                                                    // view_details.jsxi:112
			var sa = $('#selected-car-skins-article'),                             // view_details.jsxi:113
				sp = $('#selected-car-preview'),                                   // view_details.jsxi:114
				ss = $('#selected-car-skins');                                     // view_details.jsxi:115
			
			if (car.skins){                                                        // view_details.jsxi:116
				sa.show();                                                         // view_details.jsxi:117
				ss.empty();                                                        // view_details.jsxi:118
				sp.attr({                                                          // view_details.jsxi:120
					'data-id': car.skins.selected.id,                              // view_details.jsxi:120
					'src': (car.skins.selected.preview + '?' + Math.random()).cssUrl()
				});
				car.skins.forEach(function (e){                                    // view_details.jsxi:125
					$('<img>').attr({ 'data-id': e.id, 'src': e.livery.cssUrl() }).appendTo(ss);
				});
			} else {
				sa.hide();                                                         // view_details.jsxi:132
			}
		}, 
		50);
	}
	
	function updateTags(l){                                                        // view_details.jsxi:137
		var t = document.getElementById('tags-filtered');
		
		if (t){                                                                    // view_details.jsxi:139
			document.body.removeChild(t);                                          // view_details.jsxi:140
		}
		
		t = document.body.appendChild(document.createElement('datalist'));         // view_details.jsxi:143
		t.id = 'tags-filtered';                                                    // view_details.jsxi:144
		
		var n = l.map(function (e){                                                // view_details.jsxi:146
			return e.toLowerCase();                                                // view_details.jsxi:147
		});
		
		Cars.tags.forEach(function (v){                                            // view_details.jsxi:150
			if (n.indexOf(v.toLowerCase()) < 0){                                   // view_details.jsxi:151
				t.appendChild(document.createElement('option')).setAttribute('value', v);
			}
		});
	}
	
	function applyTags(){                                                          // view_details.jsxi:157
		if (!_selected || !_selected.data)                                         // view_details.jsxi:158
			return;
		
		Cars.changeData(_selected,                                                 // view_details.jsxi:159
			'tags',                                                                // view_details.jsxi:159
			Array.prototype.map.call(document.querySelectorAll('#selected-car-tags li'), 
				function (a){                                                      // view_details.jsxi:160
					return a.textContent;                                          // view_details.jsxi:160
				}));
		updateTags(_selected.data.tags);                                           // view_details.jsxi:161
	}
	
	function init(){                                                               // view_details.jsxi:164
		Cars.on('scan:ready',                                                      // view_details.jsxi:165
			function (list){                                                       // view_details.jsxi:166
				if (list.length == 0){                                             // view_details.jsxi:167
					outMsg('Hmm', 'Cars not found');                               // view_details.jsxi:168
				}
				
				$('main').show();                                                  // view_details.jsxi:171
			}).on('error',                                                         // view_details.jsxi:173
			function (car){                                                        // view_details.jsxi:173
				if (_selected != car)                                              // view_details.jsxi:174
					return;
				
				outErrors(car);                                                    // view_details.jsxi:175
			}).on('update:car:data',                                               // view_details.jsxi:177
			function (car){                                                        // view_details.jsxi:177
				if (_selected != car)                                              // view_details.jsxi:178
					return;
				
				outData(car);                                                      // view_details.jsxi:179
			}).on('update:car:skins',                                              // view_details.jsxi:181
			function (car){                                                        // view_details.jsxi:181
				if (_selected != car)                                              // view_details.jsxi:182
					return;
				
				outSkins(car);                                                     // view_details.jsxi:183
			}).on('update:car:disabled',                                           // view_details.jsxi:185
			function (car){                                                        // view_details.jsxi:185
				if (_selected != car)                                              // view_details.jsxi:186
					return;
				
				outDisabled(car);                                                  // view_details.jsxi:187
			}).on('update:car:changed',                                            // view_details.jsxi:189
			function (car){                                                        // view_details.jsxi:189
				if (_selected != car)                                              // view_details.jsxi:190
					return;
				
				outChanged(car);                                                   // view_details.jsxi:191
			});
		ViewList.on('select',                                                      // view_details.jsxi:194
			function (car){                                                        // view_details.jsxi:195
				$('main').show();                                                  // view_details.jsxi:196
				_selected = car;                                                   // view_details.jsxi:198
				
				if (car){                                                          // view_details.jsxi:200
					outMsg(null);                                                  // view_details.jsxi:201
				} else {
					return;
				}
				
				outData(car);                                                      // view_details.jsxi:206
				outBadge(car);                                                     // view_details.jsxi:207
				outDisabled(car);                                                  // view_details.jsxi:208
				outChanged(car);                                                   // view_details.jsxi:209
				outErrors(car);                                                    // view_details.jsxi:210
				outSkins(car);                                                     // view_details.jsxi:211
			});
		$('#selected-car').keydown(function (e){                                   // view_details.jsxi:215
			if (e.keyCode == 13){                                                  // view_details.jsxi:217
				this.blur();                                                       // view_details.jsxi:218
				return false;
			}
		}).on('change',                                                            // view_details.jsxi:222
			function (){                                                           // view_details.jsxi:222
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:223
					return;
				
				this.value = this.value.slice(0, 64);                              // view_details.jsxi:224
				Cars.changeData(_selected, 'name', this.value);                    // view_details.jsxi:225
			});
		$('#selected-car-tags').click(function (e){                                // view_details.jsxi:228
			if (e.target.tagName === 'LI' && e.target.offsetWidth - e.offsetX < 20){
				e.target.parentNode.removeChild(e.target);                         // view_details.jsxi:231
				applyTags();                                                       // view_details.jsxi:232
			} else {
				this.querySelector('input').focus();                               // view_details.jsxi:234
			}
		});
		$('#selected-car-tags input').on('change',                                 // view_details.jsxi:238
			function (){                                                           // view_details.jsxi:239
				if (this.value){                                                   // view_details.jsxi:240
					this.parentNode.insertBefore(document.createElement('li'), this).textContent = this.value;
					this.value = '';                                               // view_details.jsxi:242
					applyTags();                                                   // view_details.jsxi:243
				}
			}).on('keydown',                                                       // view_details.jsxi:246
			function (e){                                                          // view_details.jsxi:246
				if (e.keyCode == 8 && this.value == ''){                           // view_details.jsxi:247
					this.parentNode.removeChild(this.parentNode.querySelector('li:last-of-type'));
					applyTags();                                                   // view_details.jsxi:249
				}
			});
		$('#selected-car-desc').elastic().on('input',                              // view_details.jsxi:253
			function (){                                                           // view_details.jsxi:254
				if (!_selected || this.readonly)                                   // view_details.jsxi:255
					return;
				
				Cars.changeData(_selected, 'description', this.value);             // view_details.jsxi:256
			});
		$('#selected-car-brand').keydown(function (e){                             // view_details.jsxi:259
			if (e.keyCode == 13){                                                  // view_details.jsxi:261
				this.blur();                                                       // view_details.jsxi:262
				return false;
			}
		}).change(function (e){                                                    // view_details.jsxi:266
			if (!_selected || this.readonly || !this.value)                        // view_details.jsxi:267
				return;
			
			Cars.changeData(_selected, 'brand', this.value);                       // view_details.jsxi:268
		});
		$('#selected-car-parent').change(function (e){                             // view_details.jsxi:271
			Cars.changeParent(_selected, this.value || null);                      // view_details.jsxi:273
		});
		$('#selected-car-class').keydown(function (e){                             // view_details.jsxi:276
			if (e.keyCode == 13){                                                  // view_details.jsxi:278
				this.blur();                                                       // view_details.jsxi:279
				return false;
			}
		}).change(function (){                                                     // view_details.jsxi:283
			if (!_selected || this.readonly)                                       // view_details.jsxi:284
				return;
			
			Cars.changeData(_selected, 'class', this.value);                       // view_details.jsxi:285
		});
		[
			'bhp',                                                                 // view_details.jsxi:288
			'torque',                                                              // view_details.jsxi:288
			'weight',                                                              // view_details.jsxi:288
			'topspeed',                                                            // view_details.jsxi:288
			'acceleration',                                                        // view_details.jsxi:288
			'pwratio'
		].forEach(function (e){                                                    // view_details.jsxi:288
			$('#selected-car-' + e).keydown(function (e){                          // view_details.jsxi:289
				if (e.keyCode == 13){                                              // view_details.jsxi:290
					this.blur();                                                   // view_details.jsxi:291
					return false;
				}
			}).on('keyup keydown keypress',                                        // view_details.jsxi:294
				function (e){                                                      // view_details.jsxi:294
					if (e.keyCode == 32){                                          // view_details.jsxi:295
						e.stopPropagation();                                       // view_details.jsxi:296
						
						if (e.type === 'keyup'){                                   // view_details.jsxi:297
							return false;
						}
					}
				}).on('change input',                                              // view_details.jsxi:301
				function (){                                                       // view_details.jsxi:301
					if (!_selected || this.readonly)                               // view_details.jsxi:302
						return;
					
					Cars.changeDataSpecs(_selected, e, this.value);                // view_details.jsxi:303
				});
		});
		$('#selected-car-pwratio').dblclick(function (){                           // view_details.jsxi:307
			if (!_selected || !_selected.data || this.readonly)                    // view_details.jsxi:309
				return;
			
			var w = (_selected.data.specs.weight || '').match(/\d+/),              // view_details.jsxi:310
				p = (_selected.data.specs.bhp || '').match(/\d+/);                 // view_details.jsxi:311
			
			if (w && p){                                                           // view_details.jsxi:312
				Cars.changeDataSpecs(_selected, 'pwratio', (+ w / + p).toFixed(2) + 'kg/cv');
			}
		});
		$('#selected-car-upgrade').on('click',                                     // view_details.jsxi:317
			function (){                                                           // view_details.jsxi:318
				if (!_selected)                                                    // view_details.jsxi:319
					return;
				
				UpgradeEditor.start(_selected);                                    // view_details.jsxi:320
			});
		$('#selected-car-skins-article').dblclick(function (e){                    // view_details.jsxi:324
			if (!_selected)                                                        // view_details.jsxi:326
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:327
		}).on('contextmenu',                                                       // view_details.jsxi:329
			function (e){                                                          // view_details.jsxi:329
				if (!_selected)                                                    // view_details.jsxi:330
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:333
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:336
					label: 'Open in Showroom',                                     // view_details.jsxi:336
					key: 'S',                                                      // view_details.jsxi:336
					click: (function (){                                           // view_details.jsxi:336
						if (!_selected)                                            // view_details.jsxi:337
							return;
						
						AcShowroom.start(_selected, id);                           // view_details.jsxi:338
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:340
					label: 'Start Practice',                                       // view_details.jsxi:340
					key: 'P',                                                      // view_details.jsxi:340
					click: (function (){                                           // view_details.jsxi:340
						if (!_selected)                                            // view_details.jsxi:341
							return;
						
						AcPractice.start(_selected, id);                           // view_details.jsxi:342
					})
				}));
				menu.append(new gui.MenuItem({ type: 'separator' }));              // view_details.jsxi:344
				menu.append(new gui.MenuItem({ label: 'Edit', enabled: false }));
				menu.append(new gui.MenuItem({ label: 'Remove', enabled: false }));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:348
				return false;
			});
		$('#selected-car-skins').click(function (e){                               // view_details.jsxi:353
			if (!_selected)                                                        // view_details.jsxi:355
				return;
			
			var id = e.target.getAttribute('data-id');
			
			if (!id)                                                               // view_details.jsxi:358
				return;
			
			Cars.selectSkin(_selected, id);                                        // view_details.jsxi:360
		});
		$(window).keydown(function (e){                                            // view_details.jsxi:364
			if (!_selected)                                                        // view_details.jsxi:366
				return;
			
			if (e.keyCode == 83 && e.ctrlKey){                                     // view_details.jsxi:368
				Cars.save(_selected);                                              // view_details.jsxi:370
				return false;
			}
		});
		
		var cmIgnore = false;
		
		$('main').on('contextmenu',                                                // view_details.jsxi:377
			function (){                                                           // view_details.jsxi:378
				this.querySelector('footer').classList.toggle('active');           // view_details.jsxi:379
				cmIgnore = true;                                                   // view_details.jsxi:380
			});
		$(window).on('click contextmenu',                                          // view_details.jsxi:383
			(function (e){                                                         // view_details.jsxi:384
				if (cmIgnore){                                                     // view_details.jsxi:385
					cmIgnore = false;                                              // view_details.jsxi:386
				} else if (e.target !== this){                                     // view_details.jsxi:387
					this.classList.remove('active');                               // view_details.jsxi:388
				}
			}).bind($('main footer')[0]));                                         // view_details.jsxi:390
		$('#selected-car-open-directory').click(function (){                       // view_details.jsxi:393
			if (!_selected)                                                        // view_details.jsxi:394
				return;
			
			Shell.openItem(_selected.path);                                        // view_details.jsxi:395
		});
		$('#selected-car-showroom').click(function (){                             // view_details.jsxi:398
			if (!_selected)                                                        // view_details.jsxi:399
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:400
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:403
			if (!_selected)                                                        // view_details.jsxi:404
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:405
		});
		$('#selected-car-practice').click(function (){                             // view_details.jsxi:408
			if (!_selected)                                                        // view_details.jsxi:409
				return;
			
			AcPractice.start(_selected);                                           // view_details.jsxi:410
		});
		$('#selected-car-practice-select').click(function (){                      // view_details.jsxi:413
			if (!_selected)                                                        // view_details.jsxi:414
				return;
			
			AcPractice.select(_selected);                                          // view_details.jsxi:415
		});
		$('#selected-car-reload').click(function (){                               // view_details.jsxi:418
			if (!_selected)                                                        // view_details.jsxi:419
				return;
			
			if (_selected.changed){                                                // view_details.jsxi:421
				new Dialog('Reload',                                               // view_details.jsxi:422
					[ 'Your changes will be lost. Are you sure?' ], 
					reload);                                                       // view_details.jsxi:424
			} else {
				reload();                                                          // view_details.jsxi:426
			}
			
			function reload(){                                                     // view_details.jsxi:429
				Cars.reload(_selected);                                            // view_details.jsxi:430
			}
		});
		$('#selected-car-disable').click(function (){                              // view_details.jsxi:435
			if (!_selected)                                                        // view_details.jsxi:436
				return;
			
			Cars.toggle(_selected);                                                // view_details.jsxi:437
		});
		$('#selected-car-update-previews').click(function (){                      // view_details.jsxi:440
			if (!_selected)                                                        // view_details.jsxi:441
				return;
			
			AcShowroom.shot(_selected);                                            // view_details.jsxi:442
		});
		$('#selected-car-update-previews-manual').click(function (){               // view_details.jsxi:445
			if (!_selected)                                                        // view_details.jsxi:446
				return;
			
			AcShowroom.shot(_selected, true);                                      // view_details.jsxi:447
		});
		$('#selected-car-update-description').click(function (){                   // view_details.jsxi:450
			if (!_selected)                                                        // view_details.jsxi:451
				return;
			
			UpdateDescription.update(_selected);                                   // view_details.jsxi:452
		});
		$('#selected-car-save').click(function (){                                 // view_details.jsxi:455
			if (!_selected)                                                        // view_details.jsxi:456
				return;
			
			Cars.save(_selected);                                                  // view_details.jsxi:457
		});
	}
	
	(function (){                                                                  // view_details.jsxi:461
		$(init);                                                                   // view_details.jsxi:462
	})();
	return ViewDetails;
})();

/* Class "ViewList" declaration */
var ViewList = (function (){                                                       // view_list.jsxi:1
	var ViewList = function (){}, 
		mediator = new Mediator(),                                                 // view_list.jsxi:2
		_selected,                                                                 // view_list.jsxi:4
		_aside = $(document.getElementsByTagName('aside')[0]),                     // view_list.jsxi:5
		_node = $(document.getElementById('cars-list'));                           // view_list.jsxi:6
	
	function select(car){                                                          // view_list.jsxi:8
		_selected = car;                                                           // view_list.jsxi:9
		_node.find('.expand').removeClass('expand');                               // view_list.jsxi:10
		_node.find('.selected').removeClass('selected');                           // view_list.jsxi:11
		
		if (car){                                                                  // view_list.jsxi:13
			_node.find('[data-id="' + car.id + '"]').addClass('expand').parent().addClass('selected');
			
			if (car.parent){                                                       // view_list.jsxi:16
				_node.find('[data-id="' + car.parent.id + '"]').addClass('expand');
			}
		}
		
		mediator.dispatch('select', car);                                          // view_list.jsxi:21
	}
	
	function filter(v){                                                            // view_list.jsxi:24
		var i = _aside.find('#cars-list-filter')[0];
		
		if (i.value != v){                                                         // view_list.jsxi:26
			i.value = v;                                                           // view_list.jsxi:27
		}
		
		if (v){                                                                    // view_list.jsxi:30
			var s = v.trim().split(/\s+/);
			
			var bb = '';
			
			var vv = s.filter(function (e){                                        // view_list.jsxi:34
				if (/^brand:(.*)/.test(e)){                                        // view_list.jsxi:35
					bb = (bb && bb + '|') + RegExp.$1;                             // view_list.jsxi:36
					return false;
				}
				return true;
			});
			
			var r = RegExp.fromQuery(vv.join(' '));
			
			var b = bb && RegExp.fromQuery(bb, true);
			
			var f = function (c){                                                  // view_list.jsxi:46
				if (b && (!c.data || !b.test(c.data.brand)))                       // view_list.jsxi:47
					return false;
				return r.test(c.id) || c.data && r.test(c.data.name);              // view_list.jsxi:48
			};
			
			_aside.find('#cars-list > div > [data-id]').each(function (){          // view_list.jsxi:51
				this.parentNode.style.display = f(Cars.byName(this.getAttribute('data-id'))) ? null : 'none';
			});
		} else {
			_aside.find('#cars-list > div').show();                                // view_list.jsxi:55
		}
	}
	
	function init(){                                                               // view_list.jsxi:59
		Cars.on('scan:start',                                                      // view_list.jsxi:60
			function (){                                                           // view_list.jsxi:61
				_aside.find('#cars-list').empty();                                 // view_list.jsxi:62
				document.body.removeChild(_aside[0]);                              // view_list.jsxi:63
			}).on('scan:ready',                                                    // view_list.jsxi:65
			function (list){                                                       // view_list.jsxi:65
				$('#total-cars').val(list.filter(function (e){                     // view_list.jsxi:66
					return e.parent == null;                                       // view_list.jsxi:67
				}).length).attr('title',                                           // view_list.jsxi:68
					'Including modded versions: {0}'.format(list.length));         // view_list.jsxi:68
				
				if (list.length > 0){                                              // view_list.jsxi:70
					select(list[0]);                                               // view_list.jsxi:71
				}
				
				document.body.appendChild(_aside[0]);                              // view_list.jsxi:74
			}).on('new.car',                                                       // view_list.jsxi:76
			function (car){                                                        // view_list.jsxi:76
				var s = document.createElement('span');
				
				s.textContent = car.id;                                            // view_list.jsxi:78
				
				if (car.disabled)                                                  // view_list.jsxi:79
					s.classList.add('disabled');                                   // view_list.jsxi:79
				
				s.setAttribute('title', car.path);                                 // view_list.jsxi:81
				s.setAttribute('data-id', car.id);                                 // view_list.jsxi:82
				s.setAttribute('data-name', car.id);                               // view_list.jsxi:83
				s.setAttribute('data-path', car.path);                             // view_list.jsxi:84
				
				var d = document.createElement('div');
				
				d.appendChild(s);                                                  // view_list.jsxi:87
				
				if (car.children.length > 0){                                      // view_list.jsxi:89
					d.setAttribute('data-children', car.children.length + 1);      // view_list.jsxi:90
				}
				
				_node[0].appendChild(d);                                           // view_list.jsxi:93
			}).on('update:car:data',                                               // view_list.jsxi:95
			function (car){                                                        // view_list.jsxi:95
				var n = car.data && car.data.name || car.id;
				
				_node.find('[data-id="' + car.id + '"]').text(n).attr('data-name', n.toLowerCase());
				filter(_aside.find('#cars-list-filter').val());                    // view_list.jsxi:100
			}).on('update:car:parent',                                             // view_list.jsxi:102
			function (car){                                                        // view_list.jsxi:102
				var d = _node.find('[data-id="' + car.id + '"]').parent();
				
				if (car.error.length > 0){                                         // view_list.jsxi:104
					var c = d.parent();
					
					if (c[0].tagName === 'DIV' && c.find('.error').length == 1){   // view_list.jsxi:106
						c.removeClass('error');                                    // view_list.jsxi:107
					}
				}
				
				if (car.parent){                                                   // view_list.jsxi:111
					var p = _node.find('[data-id="' + car.parent.id + '"]').parent();
					
					d.appendTo(p);                                                 // view_list.jsxi:113
					
					if (d.hasClass('error')){                                      // view_list.jsxi:114
						d.removeClass('error');                                    // view_list.jsxi:115
						p.addClass('error');                                       // view_list.jsxi:116
					}
				} else {
					d.appendTo(_node);                                             // view_list.jsxi:120
				}
			}).on('update:car:children',                                           // view_list.jsxi:123
			function (car){                                                        // view_list.jsxi:123
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:125
					return;
				
				if (car.children.length){                                          // view_list.jsxi:126
					e.parentNode.setAttribute('data-children', car.children.length + 1);
				} else {
					e.parentNode.removeAttribute('data-children');                 // view_list.jsxi:129
				}
			}).on('update:car:path',                                               // view_list.jsxi:132
			function (car){                                                        // view_list.jsxi:132
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:134
					return;
				
				e.setAttribute('data-path', car.path);                             // view_list.jsxi:135
			}).on('update:car:disabled',                                           // view_list.jsxi:137
			function (car){                                                        // view_list.jsxi:137
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:139
					return;
				
				if (car.disabled){                                                 // view_list.jsxi:140
					e.classList.add('disabled');                                   // view_list.jsxi:141
				} else {
					e.classList.remove('disabled');                                // view_list.jsxi:143
				}
			}).on('update:car:changed',                                            // view_list.jsxi:146
			function (car){                                                        // view_list.jsxi:146
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:148
					return;
				
				if (car.changed){                                                  // view_list.jsxi:149
					e.classList.add('changed');                                    // view_list.jsxi:150
				} else {
					e.classList.remove('changed');                                 // view_list.jsxi:152
				}
			}).on('error',                                                         // view_list.jsxi:155
			function (car){                                                        // view_list.jsxi:155
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:157
					return;
				
				if (car.error.length > 0){                                         // view_list.jsxi:158
					e.classList.add('error');                                      // view_list.jsxi:159
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:161
				}
				
				while (e.parentNode.id !== 'cars-list'){                           // view_list.jsxi:164
					e = e.parentNode;                                              // view_list.jsxi:165
				}
				
				if (car.error.length > 0){                                         // view_list.jsxi:168
					e.classList.add('error');                                      // view_list.jsxi:169
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:171
				}
			});
		_aside.find('#cars-list-filter').on('change paste keyup keypress search', 
			function (e){                                                          // view_list.jsxi:176
				if (e.keyCode == 13){                                              // view_list.jsxi:177
					this.blur();                                                   // view_list.jsxi:178
				}
				
				if (e.keyCode == 27){                                              // view_list.jsxi:181
					this.value = '';                                               // view_list.jsxi:182
					this.blur();                                                   // view_list.jsxi:183
				}
				
				filter(this.value);                                                // view_list.jsxi:186
			}).on('keydown',                                                       // view_list.jsxi:188
			function (e){                                                          // view_list.jsxi:188
				if (e.keyCode == 8 && !this.value){                                // view_list.jsxi:189
					this.blur();                                                   // view_list.jsxi:190
				}
			}).on('blur',                                                          // view_list.jsxi:193
			function (){                                                           // view_list.jsxi:193
				if (!this.value){                                                  // view_list.jsxi:194
					$(this).hide();                                                // view_list.jsxi:195
				}
			});
		$(window).keydown(function (e){                                            // view_list.jsxi:200
			if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.target.contentEditable === 'true')
				return;
			
			if (e.ctrlKey || e.altKey || e.shiftKey)                               // view_list.jsxi:203
				return;
			
			var f = _aside.find('#cars-list-filter');
			
			if (/[a-zA-Z\d]/.test(String.fromCharCode(e.keyCode)) || e.keyCode == 8 && f.val()){
				f.show()[0].focus();                                               // view_list.jsxi:206
			}
		});
		_aside.find('#cars-list').click(function (e){                              // view_list.jsxi:211
			var car = Cars.byName(e.target.getAttribute('data-id'));
			
			if (!car)                                                              // view_list.jsxi:213
				return;
			
			select(car);                                                           // view_list.jsxi:214
		});
		
		var cmIgnore = false;
		
		_aside.on('contextmenu',                                                   // view_list.jsxi:219
			function (){                                                           // view_list.jsxi:220
				this.querySelector('footer').classList.toggle('active');           // view_list.jsxi:221
				cmIgnore = true;                                                   // view_list.jsxi:222
			});
		$(window).on('click contextmenu',                                          // view_list.jsxi:225
			(function (e){                                                         // view_list.jsxi:226
				if (cmIgnore){                                                     // view_list.jsxi:227
					cmIgnore = false;                                              // view_list.jsxi:228
				} else if (e.target !== this){                                     // view_list.jsxi:229
					this.classList.remove('active');                               // view_list.jsxi:230
				}
			}).bind(_aside.find('footer')[0]));                                    // view_list.jsxi:232
		_aside.find('#cars-list-open-directory').click(function (){                // view_list.jsxi:235
			if (!_selected)                                                        // view_list.jsxi:236
				return;
			
			Shell.openItem(AcDir.cars);                                            // view_list.jsxi:237
		});
		_aside.find('#cars-list-reload').click(function (){                        // view_list.jsxi:240
			if (Cars.list.some(function (e){                                       // view_list.jsxi:241
				return e.changed;                                                  // view_list.jsxi:242
			})){
				new Dialog('Reload',                                               // view_list.jsxi:244
					[
						'<p>{0}</p>'.format('Your changes will be lost. Are you sure?')
					], 
					reload);                                                       // view_list.jsxi:246
			} else {
				reload();                                                          // view_list.jsxi:248
			}
			
			function reload(){                                                     // view_list.jsxi:251
				Cars.reloadAll();                                                  // view_list.jsxi:252
			}
		});
		_aside.find('#cars-list-save').click(function (){                          // view_list.jsxi:257
			Cars.saveAll();                                                        // view_list.jsxi:258
		});
	}
	
	Object.defineProperty(ViewList,                                                // view_list.jsxi:1
		'selected', 
		{
			get: (function (){
				return _selected;                                                  // view_list.jsxi:262
			})
		});
	(function (){                                                                  // view_list.jsxi:264
		init();                                                                    // view_list.jsxi:265
		mediator.extend(ViewList);                                                 // view_list.jsxi:266
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
		_prevFeedback;
	
	function openDialog(){                                                         // view_settings.jsxi:4
		var d = new Dialog('Settings',                                             // view_settings.jsxi:5
			[
				'<h6>AC Root Directory</h6>',                                      // view_settings.jsxi:6
				'<button id="settings-acdir-select" style="float:right;width:30px">…</button>', 
				'<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">', 
				'<h6>Tips</h6>',                                                   // view_settings.jsxi:10
				'<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>', 
				'<h6>Database</h6>',                                               // view_settings.jsxi:13
				'<label><input id="settings-update-database" type="checkbox">Update databases</label>', 
				'<label><input id="settings-upload-data" type="checkbox">Upload some changes</label>', 
				'<h6>Updates</h6>',                                                // view_settings.jsxi:17
				'<label><input id="settings-updates-check" type="checkbox">Check for new versions on launch</label>', 
				'<select id="settings-updates-source"><option value="stable">Stable</option><option value="last">Beta</option></select>'
			], 
			function (){                                                           // view_settings.jsxi:23
				if (acdirVal === false)                                            // view_settings.jsxi:24
					return false;
				
				if (acdirVal != null){                                             // view_settings.jsxi:26
					AcDir.set(acdirVal);                                           // view_settings.jsxi:27
				}
				
				Settings.update(function (s){                                      // view_settings.jsxi:30
					s.disableTips = disableTips;                                   // view_settings.jsxi:31
					s.updatesCheck = updatesCheck;                                 // view_settings.jsxi:32
					s.updatesSource = updatesSource;                               // view_settings.jsxi:33
				});
			}, 
			false).setButton('Save').addButton('Cancel');                          // view_settings.jsxi:35
		
		var acdirVal;
		
		function acdirChange(){                                                    // view_settings.jsxi:38
			var err = AcDir.check(acdirVal = d.find('#settings-acdir').val());     // view_settings.jsxi:39
			
			$(this).toggleClass('invalid', !!err).attr('title', err || null);      // view_settings.jsxi:40
			
			if (err){                                                              // view_settings.jsxi:41
				acdirVal = false;                                                  // view_settings.jsxi:42
			}
		}
		
		d.find('#settings-acdir').val(AcDir.root).change(acdirChange);             // view_settings.jsxi:46
		d.find('#settings-acdir-select').click(function (){                        // view_settings.jsxi:48
			$('<input type="file" nwdirectory />').attr({ nwworkingdir: d.find('#settings-acdir').val() }).change(function (){
				d.find('#settings-acdir').val(this.value);                         // view_settings.jsxi:52
				acdirChange();                                                     // view_settings.jsxi:53
			}).click();                                                            // view_settings.jsxi:54
		});
		
		var disableTips = Settings.get('disableTips', false);
		
		d.find('#settings-disable-tips').change(function (){                       // view_settings.jsxi:58
			disableTips = this.checked;                                            // view_settings.jsxi:59
		})[0].checked = disableTips;                                               // view_settings.jsxi:60
		
		var updatesCheck = Settings.get('updatesCheck', true);
		
		d.find('#settings-updates-check').change(function (){                      // view_settings.jsxi:63
			updatesCheck = this.checked;                                           // view_settings.jsxi:64
		})[0].checked = updatesCheck;                                              // view_settings.jsxi:65
		
		var updatesSource = Settings.get('updatesSource', 'stable');
		
		d.find('#settings-updates-source').change(function (){                     // view_settings.jsxi:68
			updatesSource = this.value;                                            // view_settings.jsxi:69
		})[0].value = updatesSource;                                               // view_settings.jsxi:70
		d.addTab('About',                                                          // view_settings.jsxi:72
			[
				'<h6>Version</h6>',                                                // view_settings.jsxi:73
				gui.App.manifest.version,                                          // view_settings.jsxi:74
				'<h6>Author</h6>',                                                 // view_settings.jsxi:75
				'x4fab'
			]).addButton('Feedback',                                               // view_settings.jsxi:77
			function (){                                                           // view_settings.jsxi:77
				feedbackForm();                                                    // view_settings.jsxi:78
				return false;
			}).addButton('Check for update',                                       // view_settings.jsxi:80
			function (){                                                           // view_settings.jsxi:80
				var b = this.buttons.find('button:last-child').text('Please wait...').attr('disabled', true);
				
				CheckUpdate.check();                                               // view_settings.jsxi:82
				CheckUpdate.one('check',                                           // view_settings.jsxi:83
					function (arg){                                                // view_settings.jsxi:83
						b.text('Check again').attr('disabled', null);              // view_settings.jsxi:84
						
						if (arg === 'check:failed'){                               // view_settings.jsxi:85
							new Dialog('Check For Update', 'Cannot check for update.');
						} else if (arg !== 'check:done:found'){                    // view_settings.jsxi:87
							new Dialog('Check For Update', 'New version not found.');
						}
					});
				return false;
			});
	}
	
	function feedbackForm(){                                                       // view_settings.jsxi:95
		function sendFeedback(v){                                                  // view_settings.jsxi:96
			d.buttons.find('button:first-child').text('Please wait...').attr('disabled', true);
			AppServerRequest.sendFeedback(v,                                       // view_settings.jsxi:99
				function (arg){                                                    // view_settings.jsxi:99
					d.close();                                                     // view_settings.jsxi:100
					
					if (arg){                                                      // view_settings.jsxi:101
						new Dialog('Cannot Send Feedback', 'Sorry about that.');   // view_settings.jsxi:102
					} else {
						_prevFeedback = null;                                      // view_settings.jsxi:104
						new Dialog('Feedback Sent', 'Thank you.');                 // view_settings.jsxi:105
					}
				});
		}
		
		var d = new Dialog('Feedback',                                             // view_settings.jsxi:110
			'<textarea style="width:350px;height:200px;resize:none" maxlength="5000"\
                placeholder="If you have any ideas or suggestions please let me know"></textarea>', 
			function (){                                                           // view_settings.jsxi:111
				var v = this.content.find('textarea').val().trim();
				
				if (v)                                                             // view_settings.jsxi:113
					sendFeedback(v);                                               // view_settings.jsxi:113
				return false;
			}, 
			false).setButton('Send').addButton('Cancel').closeOnEnter(false);      // view_settings.jsxi:115
		
		d.find('textarea').val(_prevFeedback || '').change(function (arg){         // view_settings.jsxi:116
			return _prevFeedback = this.value;                                     // view_settings.jsxi:116
		});
	}
	
	(function (){                                                                  // view_settings.jsxi:119
		$('#settings-open').click(openDialog);                                     // view_settings.jsxi:120
	})();
	return ViewSettings;
})();

if (Settings.get('updatesCheck', true)){                                           // app.jsxi:1
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
AppWindow.on('close',                                                              // app.jsxi:11
	function (){                                                                   // app.jsxi:12
		if (Cars.list.filter(function (e){                                         // app.jsxi:13
			return e.changed;                                                      // app.jsxi:14
		}).length > 0){                                                            // app.jsxi:15
			new Dialog('Close',                                                    // app.jsxi:16
				[ 'Unsaved changes will be lost. Are you sure?' ], 
				function (){                                                       // app.jsxi:18
					AppWindow.close(true);                                         // app.jsxi:19
				});
		} else {
			AppWindow.close(true);                                                 // app.jsxi:22
		}
	});
ViewList.on('select',                                                              // app.jsxi:26
	function (car){                                                                // app.jsxi:27
		AppWindow.title = car.data ? car.data.name : car.id;                       // app.jsxi:28
	});
Cars.on('update:car:data',                                                         // app.jsxi:31
	function (car){                                                                // app.jsxi:32
		if (car === ViewList.selected){                                            // app.jsxi:33
			AppWindow.title = car.data ? car.data.name : car.id;                   // app.jsxi:34
		}
	});

var first = true;

AcDir.on('change',                                                                 // app.jsxi:39
	function (){                                                                   // app.jsxi:40
		Cars.scan();                                                               // app.jsxi:41
		
		if (first && !Settings.get('disableTips', false)){                         // app.jsxi:43
			new Dialog('Tip',                                                      // app.jsxi:44
				Tips.next,                                                         // app.jsxi:44
				function (){                                                       // app.jsxi:44
					this.find('p').html(Tips.next);                                // app.jsxi:45
					this.find('h4').text('Another Tip');                           // app.jsxi:46
					return false;
				}).setButton('Next').addButton('Disable Tips',                     // app.jsxi:48
				function (){                                                       // app.jsxi:48
					Settings.set('disableTips', true);                             // app.jsxi:49
				}).find('p').css('maxWidth', 400);                                 // app.jsxi:50
			first = false;                                                         // app.jsxi:52
		}
	});
AcDir.init();                                                                      // app.jsxi:56

