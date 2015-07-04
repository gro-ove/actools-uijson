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
	this.el = $('<dialog>').html('<article><div class="dialog-header"><h4>' + title + '</h4></div><div class="dialog-content"></div><div class="dialog-buttons"><button data-id="dialog-ok">ОК</button></div></article>').click(function (e){
		if (e.target.tagName == 'DIALOG' && (__that.__Dialog__closeCallback == null || __that.__Dialog__closeCallback !== false && __that.__Dialog__closeCallback(e) !== false)){
			__that.close();
		}
	}).appendTo('body');                                                           // dialog.jsxi:18
	this.header = this.el.find('.dialog-header > h4');                             // dialog.jsxi:20
	this.content = this.el.find('.dialog-content');                                // dialog.jsxi:21
	this.buttons = this.el.find('.dialog-buttons');                                // dialog.jsxi:22
	this.setContent(elements);
	this.__Dialog__callback = callback && callback.bind(this);                     // dialog.jsxi:26
	this.__Dialog__closeCallback = closeCallback && closeCallback.bind(this);      // dialog.jsxi:27
	
	if (this.__Dialog__callback === false){
		this.el.find('[data-id="dialog-ok"]').hide();                              // dialog.jsxi:30
	}
	
	this.el.find('[data-id="dialog-ok"]').click(function (e){                      // dialog.jsxi:33
		if (!__that.__Dialog__callback || __that.__Dialog__callback(e) !== false){
			__that.close();
		}
	});
	this.el.find('*').keydown(function (e){                                        // dialog.jsxi:39
		if (e.keyCode == 13 && __that.__Dialog__closeOnEnter){                     // dialog.jsxi:40
			var okButton = __that.el[0].querySelector('[data-id="dialog-ok"]');    // dialog.jsxi:41
			
			if (okButton){                                                         // dialog.jsxi:42
				__that.el[0].querySelector('[data-id="dialog-ok"]').click();       // dialog.jsxi:43
				return false;
			}
		}
	});
}
Dialog.prototype.setContent = function (elements){                                 // dialog.jsxi:50
	if (!Array.isArray(elements)){                                                 // dialog.jsxi:51
		elements = [ elements ];                                                   // dialog.jsxi:52
	}
	
	this.content.empty();                                                          // dialog.jsxi:55
	
	for (var __0 = 0; __0 < elements.length; __0 ++){                              // dialog.jsxi:56
		var element = elements[__0];
		
		this.content.append($(typeof element === 'string' && element[0] !== '<' && element[element.length - 1] !== '>' ? '<p>' + element + '</p>' : element));
	}
	return this;                                                                   // dialog.jsxi:60
};
Dialog.prototype.closeOnEnter = function (v){                                      // dialog.jsxi:63
	this.__Dialog__closeOnEnter = v;                                               // dialog.jsxi:64
	return this;                                                                   // dialog.jsxi:65
};
Dialog.prototype.onEnd = function (callback){                                      // dialog.jsxi:68
	this.__Dialog__endCallback = callback.bind(this);                              // dialog.jsxi:69
	return this;                                                                   // dialog.jsxi:70
};
Dialog.prototype.setButton = function (a, c){                                      // dialog.jsxi:73
	this.buttons.find('[data-id="dialog-ok"]').toggle(a != null).text(a);          // dialog.jsxi:74
	
	if (c != null){                                                                // dialog.jsxi:75
		this.__Dialog__callback = c;                                               // dialog.jsxi:75
	}
	return this;                                                                   // dialog.jsxi:76
};
Dialog.prototype.addButton = function (text, fn){                                  // dialog.jsxi:79
	var __that = this;
	
	fn = fn && fn.bind(this);                                                      // dialog.jsxi:80
	$('<button>' + text + '</button>').appendTo(this.buttons).click(function (e){
		if (!fn || fn(e) !== false){                                               // dialog.jsxi:82
			__that.close();
		}
	});
	return this;                                                                   // dialog.jsxi:86
};
Dialog.prototype.find = function (a){                                              // dialog.jsxi:89
	return this.el.find(a);                                                        // dialog.jsxi:90
};
Dialog.prototype.close = function (){                                              // dialog.jsxi:93
	if (this.__Dialog__endCallback)
		this.__Dialog__endCallback();
	
	this.el.remove();                                                              // dialog.jsxi:95
};
Dialog.prototype.addTab = function (title, content, callback, closeCallback){      // dialog.jsxi:98
	var __that = this;
	
	if (!this.tabs){
		this.tabs = [ this ];
		this.header.parent().addClass('tabs').click(function (e){                  // dialog.jsxi:101
			if (e.target.tagName === 'H4' && !e.target.classList.contains('active')){
				__that.el.find('.dialog-header h4.active').removeClass('active');
				e.target.classList.add('active');                                  // dialog.jsxi:104
				
				var i = Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target);
				
				var l = __that.el.find('.dialog-content')[0];
				
				l.parentNode.removeChild(l);                                       // dialog.jsxi:108
				
				var l = __that.el.find('.dialog-buttons')[0];
				
				l.parentNode.removeChild(l);                                       // dialog.jsxi:110
				__that.tabs[i].content.appendTo(__that.el.children());             // dialog.jsxi:111
				__that.tabs[i].buttons.appendTo(__that.el.children());             // dialog.jsxi:112
			}
		});
	}
	
	var n = new Dialog(title, content, callback, closeCallback);
	
	this.tabs.push(n);                                                             // dialog.jsxi:118
	document.body.removeChild(n.el[0]);                                            // dialog.jsxi:120
	n.header.appendTo(this.header.addClass('active').parent());                    // dialog.jsxi:121
	n.close = __bindOnce(this, 'close').bind(this);                                // dialog.jsxi:122
	return n;                                                                      // dialog.jsxi:124
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
	return (this[1] === ':' ? 'file://' : '') + this.replace(/\\/g, '/');          // helpers.jsxi:34
};
String.prototype.decodeHtmlEntities = function (){                                 // helpers.jsxi:37
	return this.replace(/&(?:#(\d+)|(\w{2,7}));/g,                                 // helpers.jsxi:38
		function (_, n, v){                                                        // helpers.jsxi:38
			if (n)                                                                 // helpers.jsxi:39
				return String.fromCharCode(+ n);                                   // helpers.jsxi:39
			
			switch (v){                                                            // helpers.jsxi:40
				case 'amp':                                                        // helpers.jsxi:41
					return '&';                                                    // helpers.jsxi:41
				case 'nbsp':                                                       // helpers.jsxi:42
					return ' ';                                                    // helpers.jsxi:42
				case 'iexcl':                                                      // helpers.jsxi:43
					return '¡';                                                    // helpers.jsxi:43
				case 'cent':                                                       // helpers.jsxi:44
					return '¢';                                                    // helpers.jsxi:44
				case 'pound':                                                      // helpers.jsxi:45
					return '£';                                                    // helpers.jsxi:45
				case 'curren':                                                     // helpers.jsxi:46
					return '¤';                                                    // helpers.jsxi:46
				case 'yen':                                                        // helpers.jsxi:47
					return '¥';                                                    // helpers.jsxi:47
				case 'brvbar':                                                     // helpers.jsxi:48
					return '¦';                                                    // helpers.jsxi:48
				case 'sect':                                                       // helpers.jsxi:49
					return '§';                                                    // helpers.jsxi:49
				case 'uml':                                                        // helpers.jsxi:50
					return '¨';                                                    // helpers.jsxi:50
				case 'copy':                                                       // helpers.jsxi:51
					return '©';                                                    // helpers.jsxi:51
				case 'ordf':                                                       // helpers.jsxi:52
					return 'ª';                                                    // helpers.jsxi:52
				case 'laquo':                                                      // helpers.jsxi:53
					return '«';                                                    // helpers.jsxi:53
				case 'not':                                                        // helpers.jsxi:54
					return '¬';                                                    // helpers.jsxi:54
				case 'shy':                                                        // helpers.jsxi:55
					return '­';                                                    // helpers.jsxi:55
				case 'reg':                                                        // helpers.jsxi:56
					return '®';                                                    // helpers.jsxi:56
				case 'macr':                                                       // helpers.jsxi:57
					return '¯';                                                    // helpers.jsxi:57
				case 'deg':                                                        // helpers.jsxi:58
					return '°';                                                    // helpers.jsxi:58
				case 'plusmn':                                                     // helpers.jsxi:59
					return '±';                                                    // helpers.jsxi:59
				case 'sup2':                                                       // helpers.jsxi:60
					return '²';                                                    // helpers.jsxi:60
				case 'sup3':                                                       // helpers.jsxi:61
					return '³';                                                    // helpers.jsxi:61
				case 'acute':                                                      // helpers.jsxi:62
					return '´';                                                    // helpers.jsxi:62
				case 'micro':                                                      // helpers.jsxi:63
					return 'µ';                                                    // helpers.jsxi:63
				case 'para':                                                       // helpers.jsxi:64
					return '¶';                                                    // helpers.jsxi:64
				case 'middot':                                                     // helpers.jsxi:65
					return '·';                                                    // helpers.jsxi:65
				case 'cedil':                                                      // helpers.jsxi:66
					return '¸';                                                    // helpers.jsxi:66
				case 'sup1':                                                       // helpers.jsxi:67
					return '¹';                                                    // helpers.jsxi:67
				case 'ordm':                                                       // helpers.jsxi:68
					return 'º';                                                    // helpers.jsxi:68
				case 'raquo':                                                      // helpers.jsxi:69
					return '»';                                                    // helpers.jsxi:69
				case 'frac14':                                                     // helpers.jsxi:70
					return '¼';                                                    // helpers.jsxi:70
				case 'frac12':                                                     // helpers.jsxi:71
					return '½';                                                    // helpers.jsxi:71
				case 'frac34':                                                     // helpers.jsxi:72
					return '¾';                                                    // helpers.jsxi:72
				case 'iquest':                                                     // helpers.jsxi:73
					return '¿';                                                    // helpers.jsxi:73
				case 'Agrave':                                                     // helpers.jsxi:74
					return 'À';                                                    // helpers.jsxi:74
				case 'Aacute':                                                     // helpers.jsxi:75
					return 'Á';                                                    // helpers.jsxi:75
				case 'Acirc':                                                      // helpers.jsxi:76
					return 'Â';                                                    // helpers.jsxi:76
				case 'Atilde':                                                     // helpers.jsxi:77
					return 'Ã';                                                    // helpers.jsxi:77
				case 'Auml':                                                       // helpers.jsxi:78
					return 'Ä';                                                    // helpers.jsxi:78
				case 'Aring':                                                      // helpers.jsxi:79
					return 'Å';                                                    // helpers.jsxi:79
				case 'AElig':                                                      // helpers.jsxi:80
					return 'Æ';                                                    // helpers.jsxi:80
				case 'Ccedil':                                                     // helpers.jsxi:81
					return 'Ç';                                                    // helpers.jsxi:81
				case 'Egrave':                                                     // helpers.jsxi:82
					return 'È';                                                    // helpers.jsxi:82
				case 'Eacute':                                                     // helpers.jsxi:83
					return 'É';                                                    // helpers.jsxi:83
				case 'Ecirc':                                                      // helpers.jsxi:84
					return 'Ê';                                                    // helpers.jsxi:84
				case 'Euml':                                                       // helpers.jsxi:85
					return 'Ë';                                                    // helpers.jsxi:85
				case 'Igrave':                                                     // helpers.jsxi:86
					return 'Ì';                                                    // helpers.jsxi:86
				case 'Iacute':                                                     // helpers.jsxi:87
					return 'Í';                                                    // helpers.jsxi:87
				case 'Icirc':                                                      // helpers.jsxi:88
					return 'Î';                                                    // helpers.jsxi:88
				case 'Iuml':                                                       // helpers.jsxi:89
					return 'Ï';                                                    // helpers.jsxi:89
				case 'ETH':                                                        // helpers.jsxi:90
					return 'Ð';                                                    // helpers.jsxi:90
				case 'Ntilde':                                                     // helpers.jsxi:91
					return 'Ñ';                                                    // helpers.jsxi:91
				case 'Ograve':                                                     // helpers.jsxi:92
					return 'Ò';                                                    // helpers.jsxi:92
				case 'Oacute':                                                     // helpers.jsxi:93
					return 'Ó';                                                    // helpers.jsxi:93
				case 'Ocirc':                                                      // helpers.jsxi:94
					return 'Ô';                                                    // helpers.jsxi:94
				case 'Otilde':                                                     // helpers.jsxi:95
					return 'Õ';                                                    // helpers.jsxi:95
				case 'Ouml':                                                       // helpers.jsxi:96
					return 'Ö';                                                    // helpers.jsxi:96
				case 'times':                                                      // helpers.jsxi:97
					return '×';                                                    // helpers.jsxi:97
				case 'Oslash':                                                     // helpers.jsxi:98
					return 'Ø';                                                    // helpers.jsxi:98
				case 'Ugrave':                                                     // helpers.jsxi:99
					return 'Ù';                                                    // helpers.jsxi:99
				case 'Uacute':                                                     // helpers.jsxi:100
					return 'Ú';                                                    // helpers.jsxi:100
				case 'Ucirc':                                                      // helpers.jsxi:101
					return 'Û';                                                    // helpers.jsxi:101
				case 'Uuml':                                                       // helpers.jsxi:102
					return 'Ü';                                                    // helpers.jsxi:102
				case 'Yacute':                                                     // helpers.jsxi:103
					return 'Ý';                                                    // helpers.jsxi:103
				case 'THORN':                                                      // helpers.jsxi:104
					return 'Þ';                                                    // helpers.jsxi:104
				case 'szlig':                                                      // helpers.jsxi:105
					return 'ß';                                                    // helpers.jsxi:105
				case 'agrave':                                                     // helpers.jsxi:106
					return 'à';                                                    // helpers.jsxi:106
				case 'aacute':                                                     // helpers.jsxi:107
					return 'á';                                                    // helpers.jsxi:107
				case 'acirc':                                                      // helpers.jsxi:108
					return 'â';                                                    // helpers.jsxi:108
				case 'atilde':                                                     // helpers.jsxi:109
					return 'ã';                                                    // helpers.jsxi:109
				case 'auml':                                                       // helpers.jsxi:110
					return 'ä';                                                    // helpers.jsxi:110
				case 'aring':                                                      // helpers.jsxi:111
					return 'å';                                                    // helpers.jsxi:111
				case 'aelig':                                                      // helpers.jsxi:112
					return 'æ';                                                    // helpers.jsxi:112
				case 'ccedil':                                                     // helpers.jsxi:113
					return 'ç';                                                    // helpers.jsxi:113
				case 'egrave':                                                     // helpers.jsxi:114
					return 'è';                                                    // helpers.jsxi:114
				case 'eacute':                                                     // helpers.jsxi:115
					return 'é';                                                    // helpers.jsxi:115
				case 'ecirc':                                                      // helpers.jsxi:116
					return 'ê';                                                    // helpers.jsxi:116
				case 'euml':                                                       // helpers.jsxi:117
					return 'ë';                                                    // helpers.jsxi:117
				case 'igrave':                                                     // helpers.jsxi:118
					return 'ì';                                                    // helpers.jsxi:118
				case 'iacute':                                                     // helpers.jsxi:119
					return 'í';                                                    // helpers.jsxi:119
				case 'icirc':                                                      // helpers.jsxi:120
					return 'î';                                                    // helpers.jsxi:120
				case 'iuml':                                                       // helpers.jsxi:121
					return 'ï';                                                    // helpers.jsxi:121
				case 'eth':                                                        // helpers.jsxi:122
					return 'ð';                                                    // helpers.jsxi:122
				case 'ntilde':                                                     // helpers.jsxi:123
					return 'ñ';                                                    // helpers.jsxi:123
				case 'ograve':                                                     // helpers.jsxi:124
					return 'ò';                                                    // helpers.jsxi:124
				case 'oacute':                                                     // helpers.jsxi:125
					return 'ó';                                                    // helpers.jsxi:125
				case 'ocirc':                                                      // helpers.jsxi:126
					return 'ô';                                                    // helpers.jsxi:126
				case 'otilde':                                                     // helpers.jsxi:127
					return 'õ';                                                    // helpers.jsxi:127
				case 'ouml':                                                       // helpers.jsxi:128
					return 'ö';                                                    // helpers.jsxi:128
				case 'divide':                                                     // helpers.jsxi:129
					return '÷';                                                    // helpers.jsxi:129
				case 'oslash':                                                     // helpers.jsxi:130
					return 'ø';                                                    // helpers.jsxi:130
				case 'ugrave':                                                     // helpers.jsxi:131
					return 'ù';                                                    // helpers.jsxi:131
				case 'uacute':                                                     // helpers.jsxi:132
					return 'ú';                                                    // helpers.jsxi:132
				case 'ucirc':                                                      // helpers.jsxi:133
					return 'û';                                                    // helpers.jsxi:133
				case 'uuml':                                                       // helpers.jsxi:134
					return 'ü';                                                    // helpers.jsxi:134
				case 'yacute':                                                     // helpers.jsxi:135
					return 'ý';                                                    // helpers.jsxi:135
				case 'thorn':                                                      // helpers.jsxi:136
					return 'þ';                                                    // helpers.jsxi:136
				case 'yuml':                                                       // helpers.jsxi:137
					return 'ÿ';                                                    // helpers.jsxi:137
				case 'quot':                                                       // helpers.jsxi:138
					return '"';                                                    // helpers.jsxi:138
				case 'lt':                                                         // helpers.jsxi:139
					return '<';                                                    // helpers.jsxi:139
				case 'gt':                                                         // helpers.jsxi:140
					return '>';                                                    // helpers.jsxi:140
				default:
					return _;                                                      // helpers.jsxi:141
			}
		});
};
JSON.flexibleParse = function (d){                                                 // helpers.jsxi:146
	var r;
	
	eval('r=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g,                    // helpers.jsxi:148
		function (_){                                                              // helpers.jsxi:148
			return _.replace(/\r?\n/g, '\\n');                                     // helpers.jsxi:149
		}));
	return r;                                                                      // helpers.jsxi:151
};
JSON.restoreDamaged = function (data, fields){                                     // helpers.jsxi:154
	data = data.toString().replace(/\r?\n|\r/g, '\n').trim();                      // helpers.jsxi:155
	
	var result = {};
	
	for (var key in fields)                                                        // helpers.jsxi:158
		if (fields.hasOwnProperty(key)){                                           // helpers.jsxi:158
			var type = fields[key];
			
			var re = new RegExp('(?:\"\\s*' + key + '\\s*\"|\'\\s*' + key + '\\s*\'|' + key + ')\\s*:\\s*([\\s\\S]+)');
			
			var m = data.match(re);
			
			if (re.test(data)){                                                    // helpers.jsxi:161
				var d = RegExp.$1.trim();
				
				if (type !== 'multiline' && type !== 'array' && type !== 'pairsArray'){
					d = d.split('\n')[0].replace(/\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:[\s\S]+|\s*}/, '');
				}
				
				d = d.replace(/(?:\n?\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:|\s*})[\s\S]*$/, 
					'');                                                           // helpers.jsxi:168
				result[key] = d.trim().replace(/,$/, '');                          // helpers.jsxi:169
			}
		}
	
	for (var key in result)                                                        // helpers.jsxi:173
		if (result.hasOwnProperty(key)){                                           // helpers.jsxi:173
			var value = result[key];
			
			if (fields[key] === 'string' || fields[key] === 'multiline'){          // helpers.jsxi:174
				result[key] = value.replace(/^['"]/, '').replace(/['"]$/, '');     // helpers.jsxi:175
			}
			
			if (fields[key] === 'array' || fields[key] === 'pairsArray'){          // helpers.jsxi:178
				value = value.split(/\n|,/).map(function (arg){                    // helpers.jsxi:179
					return arg.trim().replace(/^['"]/, '').replace(/['"]$/, '');   // helpers.jsxi:180
				}).filter(function (a, i){                                         // helpers.jsxi:181
					return a && (i > 0 || a != '[');                               // helpers.jsxi:181
				});
				
				if (value[value.length - 1] === ']'){                              // helpers.jsxi:182
					value.length --;                                               // helpers.jsxi:183
				}
				
				result[key] = value;                                               // helpers.jsxi:186
			}
			
			if (fields[key] === 'pairsArray'){                                     // helpers.jsxi:189
				result[key] = [];                                                  // helpers.jsxi:190
				
				var last;
				
				value.forEach(function (arg){                                      // helpers.jsxi:192
					if (arg === '[' || arg === ']')                                // helpers.jsxi:193
						return;
					
					if (last){                                                     // helpers.jsxi:194
						last.push(arg);                                            // helpers.jsxi:195
						last = null;                                               // helpers.jsxi:196
					} else {
						result[key].push(last = [ arg ]);                          // helpers.jsxi:198
					}
				});
			}
			
			if (fields[key] === 'number'){                                         // helpers.jsxi:203
				value = value.replace(/^['"]/, '').replace(/['"]$/, '');           // helpers.jsxi:204
				value = value.replace(/[liI]/g, '1').replace(/[oO]/g, '0');        // helpers.jsxi:206
				result[key] = + value;                                             // helpers.jsxi:207
				
				if (Number.isNaN(result[key])){                                    // helpers.jsxi:209
					result[key] = + value.replace(/[^-.\d]+/g, '');                // helpers.jsxi:210
				}
				
				if (Number.isNaN(result[key])){                                    // helpers.jsxi:213
					result[key] = + (value.replace(/[^\d]+/g, '') || '0');         // helpers.jsxi:214
				}
			}
		}
	return result;                                                                 // helpers.jsxi:219
};

/* Class "ErrorHandler" declaration */
var ErrorHandler = (function (){                                                   // error_handler.jsxi:1
	var ErrorHandler = function (){};
	
	function _details(e){                                                          // error_handler.jsxi:2
		return e.stack ? ('' + e.stack).replace(/file:\/{3}[A-Z]:\/.+?(?=\/app\/)/g, '…') : e;
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
		process.on('uncaughtException',                                            // error_handler.jsxi:18
			function (err){                                                        // error_handler.jsxi:18
				try {
					if (localStorage.developerMode){                               // error_handler.jsxi:19
						require('nw.gui').Window.get().showDevTools();             // error_handler.jsxi:20
					}
					
					console.warn(_details(err));                                   // error_handler.jsxi:23
					
					if (window.AppServerRequest && AppServerRequest.sendFeedback){
						AppServerRequest.sendError(gui.App.manifest.version, _details(err));
					}
					
					show();                                                        // error_handler.jsxi:29
					new Dialog('Oops!',                                            // error_handler.jsxi:31
						[
							'<p>Uncaught exception, sorry.</p>',                   // error_handler.jsxi:32
							'<pre>' + _details(err) + '</pre>'
						], 
						function (arg){                                            // error_handler.jsxi:34
							mainForm.reloadDev();                                  // error_handler.jsxi:35
						}, 
						function (arg){                                            // error_handler.jsxi:36
							return false;
						}).find('button').text('Restart');                         // error_handler.jsxi:36
				} catch (e){} 
			});
		Mediator.errorHandler = function (err){                                    // error_handler.jsxi:39
			ErrorHandler.handled('Listener exception', err);
		};
	})();
	return ErrorHandler;
})();

/* Class "UiJsonDamaged" declaration */
function UiJsonDamaged(){}
UiJsonDamaged.parseSkinFile = function (filename){                                 // ui_json_damaged.jsxi:2
	var result = JSON.restoreDamaged(fs.readFileSync(filename),                    // ui_json_damaged.jsxi:3
		{
			skinname: 'string',                                                    // ui_json_damaged.jsxi:4
			drivername: 'string',                                                  // ui_json_damaged.jsxi:5
			country: 'string',                                                     // ui_json_damaged.jsxi:6
			team: 'string',                                                        // ui_json_damaged.jsxi:7
			number: 'number',                                                      // ui_json_damaged.jsxi:8
			author: 'string',                                                      // ui_json_damaged.jsxi:10
			version: 'string',                                                     // ui_json_damaged.jsxi:11
			url: 'string'
		});
	return result;                                                                 // ui_json_damaged.jsxi:15
};
UiJsonDamaged.parseCarFile = function (filename){                                  // ui_json_damaged.jsxi:18
	var result = JSON.restoreDamaged(fs.readFileSync(filename),                    // ui_json_damaged.jsxi:19
		{
			name: 'string',                                                        // ui_json_damaged.jsxi:20
			brand: 'string',                                                       // ui_json_damaged.jsxi:21
			parent: 'string',                                                      // ui_json_damaged.jsxi:22
			description: 'multiline',                                              // ui_json_damaged.jsxi:23
			class: 'string',                                                       // ui_json_damaged.jsxi:24
			tags: 'array',                                                         // ui_json_damaged.jsxi:25
			bhp: 'string',                                                         // ui_json_damaged.jsxi:26
			torque: 'string',                                                      // ui_json_damaged.jsxi:27
			weight: 'string',                                                      // ui_json_damaged.jsxi:28
			topspeed: 'string',                                                    // ui_json_damaged.jsxi:29
			acceleration: 'string',                                                // ui_json_damaged.jsxi:30
			pwratio: 'string',                                                     // ui_json_damaged.jsxi:31
			range: 'number',                                                       // ui_json_damaged.jsxi:32
			torqueCurve: 'pairsArray',                                             // ui_json_damaged.jsxi:33
			powerCurve: 'pairsArray',                                              // ui_json_damaged.jsxi:34
			year: 'number',                                                        // ui_json_damaged.jsxi:36
			country: 'string',                                                     // ui_json_damaged.jsxi:37
			author: 'string',                                                      // ui_json_damaged.jsxi:39
			version: 'string',                                                     // ui_json_damaged.jsxi:40
			url: 'string'
		});
	
	result.specs = {};                                                             // ui_json_damaged.jsxi:44
	[
		'bhp',                                                                     // ui_json_damaged.jsxi:46
		'torque',                                                                  // ui_json_damaged.jsxi:46
		'weight',                                                                  // ui_json_damaged.jsxi:46
		'topspeed',                                                                // ui_json_damaged.jsxi:46
		'acceleration',                                                            // ui_json_damaged.jsxi:46
		'pwratio'
	].forEach(function (arg){                                                      // ui_json_damaged.jsxi:46
		if (result.hasOwnProperty(arg)){                                           // ui_json_damaged.jsxi:47
			result.specs[arg] = result[arg];                                       // ui_json_damaged.jsxi:48
			delete result[arg];                                                    // ui_json_damaged.jsxi:49
		}
	});
	return result;                                                                 // ui_json_damaged.jsxi:53
};

/* Class "AcDir" declaration */
var AcDir = (function (){                                                          // ac_dir.jsxi:1
	var AcDir = function (){}, 
		mediator = new Mediator(),                                                 // ac_dir.jsxi:2
		_root,                                                                     // ac_dir.jsxi:4
		_cars,                                                                     // ac_dir.jsxi:4
		_carsOff,                                                                  // ac_dir.jsxi:4
		_tracks,                                                                   // ac_dir.jsxi:4
		_showrooms,                                                                // ac_dir.jsxi:4
		_filters;                                                                  // ac_dir.jsxi:4
	
	function dirExists(){                                                          // ac_dir.jsxi:6
		var d = path.join.apply(path, arguments);
		return fs.existsSync(d) && fs.statSync(d).isDirectory();                   // ac_dir.jsxi:8
	}
	
	AcDir.check = function (d){                                                    // ac_dir.jsxi:11
		if (!dirExists(d)){                                                        // ac_dir.jsxi:12
			return 'Folder not found';                                             // ac_dir.jsxi:13
		}
		
		if (!dirExists(d, 'content', 'cars')){                                     // ac_dir.jsxi:16
			return 'Folder content/cars not found';                                // ac_dir.jsxi:17
		}
		
		if (!dirExists(d, 'content', 'tracks')){                                   // ac_dir.jsxi:20
			return 'Folder content/tracks not found';                              // ac_dir.jsxi:21
		}
		
		if (!dirExists(d, 'content', 'showroom')){                                 // ac_dir.jsxi:24
			return 'Folder content/showroom not found';                            // ac_dir.jsxi:25
		}
		
		if (!dirExists(d, 'system', 'cfg', 'ppfilters')){                          // ac_dir.jsxi:28
			return 'Folder system/cfg/ppfilters not found';                        // ac_dir.jsxi:29
		}
		
		try {
			var tmpFile = d + '/__test.at~tmp';
			
			fs.writeFileSync(tmpFile, 'test');                                     // ac_dir.jsxi:34
			fs.unlinkSync(tmpFile);                                                // ac_dir.jsxi:35
		} catch (e){                                                               // ac_dir.jsxi:36
			return 'App doesn\'t have access to this folder.';                     // ac_dir.jsxi:37
		} 
	};
	AcDir.set = function (d){                                                      // ac_dir.jsxi:41
		if (_root == d)                                                            // ac_dir.jsxi:42
			return;
		
		_root = d;                                                                 // ac_dir.jsxi:44
		_cars = path.join(d, 'content', 'cars');                                   // ac_dir.jsxi:46
		_carsOff = path.join(d, 'content', 'cars-off');                            // ac_dir.jsxi:47
		
		if (!fs.existsSync(_carsOff)){                                             // ac_dir.jsxi:48
			fs.mkdirSync(_carsOff);                                                // ac_dir.jsxi:49
		}
		
		_tracks = path.join(d, 'content', 'tracks');                               // ac_dir.jsxi:52
		_showrooms = path.join(d, 'content', 'showroom');                          // ac_dir.jsxi:53
		_filters = path.join(d, 'system', 'cfg', 'ppfilters');                     // ac_dir.jsxi:54
		localStorage.acRootDir = d;                                                // ac_dir.jsxi:56
		mediator.dispatch('change', _root);                                        // ac_dir.jsxi:58
	};
	AcDir.init = function (c){                                                     // ac_dir.jsxi:61
		function ready(d){                                                         // ac_dir.jsxi:62
			var err = AcDir.check(d);
			
			if (err){                                                              // ac_dir.jsxi:64
				return prompt(err);                                                // ac_dir.jsxi:65
			} else {
				AcDir.set(d);
			}
		}
		
		function prompt(e){                                                        // ac_dir.jsxi:71
			var dialog = new Dialog('Assetto Corsa Folder',                        // ac_dir.jsxi:72
				[
					e && '<p class="error">' + e + '</p>',                         // ac_dir.jsxi:73
					'<button id="select-dir" style="float:right;width:30px">…</button>', 
					'<input placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">'
				], 
				function (){                                                       // ac_dir.jsxi:76
					ready(this.find('input').val());                               // ac_dir.jsxi:77
				}, 
				function (){                                                       // ac_dir.jsxi:78
					return false;
				});
			
			if (localStorage.acRootDir){                                           // ac_dir.jsxi:82
				dialog.find('input').val(localStorage.acRootDir);                  // ac_dir.jsxi:83
			}
			
			dialog.find('#select-dir').click(function (){                          // ac_dir.jsxi:86
				$('<input type="file" nwdirectory />').attr({ nwworkingdir: dialog.find('input').val() }).change(function (){
					dialog.find('input').val(this.value);                          // ac_dir.jsxi:90
				}).click();                                                        // ac_dir.jsxi:91
			});
		}
		
		if (localStorage.acRootDir){                                               // ac_dir.jsxi:95
			ready(localStorage.acRootDir);                                         // ac_dir.jsxi:96
		} else {
			prompt();                                                              // ac_dir.jsxi:98
		}
	};
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'root', 
		{
			get: (function (){
				return _root;                                                      // ac_dir.jsxi:102
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'cars', 
		{
			get: (function (){
				return _cars;                                                      // ac_dir.jsxi:103
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'carsOff', 
		{
			get: (function (){
				return _carsOff;                                                   // ac_dir.jsxi:104
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'tracks', 
		{
			get: (function (){
				return _tracks;                                                    // ac_dir.jsxi:105
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'showrooms', 
		{
			get: (function (){
				return _showrooms;                                                 // ac_dir.jsxi:106
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'filters', 
		{
			get: (function (){
				return _filters;                                                   // ac_dir.jsxi:107
			})
		});
	(function (){                                                                  // ac_dir.jsxi:109
		mediator.extend(AcDir);                                                    // ac_dir.jsxi:110
	})();
	return AcDir;
})();

/* Class "AcFilters" declaration */
var AcFilters = (function (){                                                      // ac_filters.jsxi:1
	var AcFilters = function (){}, 
		_filters = null;
	
	AcFilters.exists = function (id){                                              // ac_filters.jsxi:12
		return fs.existsSync(AcDir.filters + '/' + id + '.ini');                   // ac_filters.jsxi:13
	};
	AcFilters.load = function (){                                                  // ac_filters.jsxi:16
		var path = AcDir.filters;
		
		try {
			_filters = fs.readdirSync(path).map(function (e){                      // ac_filters.jsxi:20
				if (!/\.ini$/i.test(e))                                            // ac_filters.jsxi:21
					return;
				return { id: e.replace(/\.ini$/i, ''), path: path + '/' + e };
			}).filter(function (e){                                                // ac_filters.jsxi:26
				return e;                                                          // ac_filters.jsxi:27
			});
		} catch (e){                                                               // ac_filters.jsxi:29
			_filters = [];                                                         // ac_filters.jsxi:31
		} 
	};
	Object.defineProperty(AcFilters,                                               // ac_filters.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_filters){                                                    // ac_filters.jsxi:5
					AcFilters.load();
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
			s = c.selectedSkin.id;                                                 // ac_practice.jsxi:39
		}
		
		r = r || localStorage.lastTrack || 'spa';                                  // ac_practice.jsxi:42
		localStorage.lastTrack = r;                                                // ac_practice.jsxi:43
		AcTools;                                                                   // ac_practice.jsxi:45
		
		try {
			AcTools.Processes.Game.StartPractice(AcDir.root, c.id, s, r.split('/')[0], r.split('/')[1] || '');
		} catch (e){                                                               // ac_practice.jsxi:48
			ErrorHandler.handled('Cannot start the game. Maybe there is not enough rights.');
		} 
	};
	AcPractice.select = function (c, s){                                           // ac_practice.jsxi:53
		if (!_tracks){                                                             // ac_practice.jsxi:54
			loadTracks();                                                          // ac_practice.jsxi:55
		}
		
		new Dialog('Track',                                                        // ac_practice.jsxi:58
			[
				'<select>{0}</select>'.format(_tracks.map(function (e){            // ac_practice.jsxi:59
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join(''))
			], 
			function (){                                                           // ac_practice.jsxi:62
				AcPractice.start(c, s, this.find('select').val());
			}).addButton('Reload List',                                            // ac_practice.jsxi:64
			function (){                                                           // ac_practice.jsxi:64
				setTimeout(function (){                                            // ac_practice.jsxi:65
					loadTracks();                                                  // ac_practice.jsxi:66
					AcPractice.select(c, s);
				});
			}).find('select').val(localStorage.lastTrack || 'spa').change(function (){
			localStorage.lastTrack = this.value;                                   // ac_practice.jsxi:70
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
		_showrooms = null,                                                         // ac_showroom.jsxi:10
		_blackShowroom = 'studio_black',                                           // ac_showroom.jsxi:12
		_blackShowroomUrl = 'http://www.racedepartment.com/downloads/studio-black-showroom.4353/';
	
	AcShowroom.modes = [                                                           // ac_showroom.jsxi:2
		{ id: 'default', name: 'Regular Showroom (Recommended)' },                 // ac_showroom.jsxi:2
		{ id: 'kunos', name: 'Kunos Style (Dark Room)' }, 
		{ id: 'seatleon', name: 'Seat Leon Eurocup Style' }, 
		{ id: 'gt5', name: 'GT5-style' }, 
		{ id: 'gt6', name: 'GT6-style' }
	];
	AcShowroom.load = function (){                                                 // ac_showroom.jsxi:23
		_showrooms = fs.readdirSync(AcDir.showrooms).map(function (e){             // ac_showroom.jsxi:24
			var p = path.join(AcDir.showrooms, e);
			
			var d = null;
			
			var j = path.join(p, 'ui', 'ui_showroom.json');
			
			if (fs.existsSync(j)){                                                 // ac_showroom.jsxi:29
				try {
					d = JSON.parse(fs.readFileSync(j));                            // ac_showroom.jsxi:31
				} catch (e){} 
			}
			return { id: e, data: d, path: p, json: j };
		}).filter(function (arg){                                                  // ac_showroom.jsxi:41
			return arg;                                                            // ac_showroom.jsxi:41
		});
	};
	AcShowroom.exists = function (id){                                             // ac_showroom.jsxi:44
		return fs.existsSync(AcDir.showrooms + '/' + id);                          // ac_showroom.jsxi:45
	};
	
	function handleError(err, car){                                                // ac_showroom.jsxi:48
		try {
			var logFile = fs.readFileSync(AcTools.Utils.FileUtils.GetLogFile()).toString();
			
			if (/\bCOULD NOT FIND SUSPENSION OBJECT SUSP_[LR][FR]\b/.test(logFile)){
				car.addError('kn5-susp_xx-error',                                  // ac_showroom.jsxi:52
					'Car\'s model doesn\'t have a proper suspension.');            // ac_showroom.jsxi:52
				return true;
			}
		} catch (e){} 
		
		if (err && err.message === 'Process exited'){                              // ac_showroom.jsxi:57
			ErrorHandler.handled('Showroom was terminated too soon.');             // ac_showroom.jsxi:58
			return true;
		}
		return false;
	}
	
	AcShowroom.start = function (c, s, room){                                      // ac_showroom.jsxi:68
		if (c.path.indexOf(AcDir.cars))                                            // ac_showroom.jsxi:69
			return;
		
		if (s == null){                                                            // ac_showroom.jsxi:71
			s = c.selectedSkin.id;                                                 // ac_showroom.jsxi:72
		}
		
		room = room || AcShowroom.__AcShowroom_lastShowroom;                       // ac_showroom.jsxi:75
		
		var filter = AcShowroom.__AcShowroom_lastShowroomFilter || null;
		
		if (!AcShowroom.exists(room)){
			ErrorHandler.handled('Showroom “' + room + '” is missing.');           // ac_showroom.jsxi:79
			return;
		}
		
		if (filter && !AcFilters.exists(filter)){                                  // ac_showroom.jsxi:83
			ErrorHandler.handled('Filter “' + filter + '” is missing.');           // ac_showroom.jsxi:84
			return;
		}
		
		AcTools;                                                                   // ac_showroom.jsxi:88
		
		try {
			AcTools.Processes.Showroom.Start(AcDir.root, c.id, s, room, filter);   // ac_showroom.jsxi:90
		} catch (err){                                                             // ac_showroom.jsxi:91
			ErrorHandler.handled('Cannot start showroom. Maybe the car is broken.', err);
			return;
		} 
		
		handleError(null, c);                                                      // ac_showroom.jsxi:96
	};
	AcShowroom.select = function (c, s){                                           // ac_showroom.jsxi:99
		var d = new Dialog('Showroom',                                             // ac_showroom.jsxi:100
			[
				'<h6>Select showroom</h6>',                                        // ac_showroom.jsxi:101
				'<select id="showroom-select-showroom">{0}</select>'.format(AcShowroom.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join('')),                                                      // ac_showroom.jsxi:104
				'<h6>Select filter</h6>',                                          // ac_showroom.jsxi:105
				'<select id="showroom-select-filter"><option value="">Don\'t change</option>{0}</select>'.format(AcFilters.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.id);
				}).join(''))
			], 
			function (){                                                           // ac_showroom.jsxi:109
				AcShowroom.start(c, s);
			}).addButton('Reload List',                                            // ac_showroom.jsxi:111
			function (){                                                           // ac_showroom.jsxi:111
				setTimeout(function (){                                            // ac_showroom.jsxi:112
					AcShowroom.load();
					AcFilters.load();                                              // ac_showroom.jsxi:114
					AcShowroom.select(c, s);
				});
			});
		
		d.find('#showroom-select-showroom').val(AcShowroom.__AcShowroom_lastShowroom).change(function (){
			localStorage.lastShowroom = this.value;                                // ac_showroom.jsxi:119
		});
		d.find('#showroom-select-filter').val(AcShowroom.__AcShowroom_lastShowroomFilter).change(function (){
			localStorage.lastShowroomFilter = this.value;                          // ac_showroom.jsxi:122
		});
	};
	
	function shotOutputPreview(car, output, callback){                             // ac_showroom.jsxi:126
		var d = new Dialog('Update Previews',                                      // ac_showroom.jsxi:128
			[
				'<div class="left"><h6>Current</h6><img id="current-preview"></div>', 
				'<div class="right"><h6>New</h6><img id="new-preview"></div>'
			], 
			function (){                                                           // ac_showroom.jsxi:131
				callback();                                                        // ac_showroom.jsxi:132
			}, 
			false).setButton('Apply').addButton('Cancel');                         // ac_showroom.jsxi:133
		
		var t = $('<div>' + '<button data-action="prev" id="button-prev" disabled>←</button> ' + '<button data-action="next" id="button-next">→</button>' + '</div>').insertBefore(d.header);
		
		t.find('#button-prev').click(function (){                                  // ac_showroom.jsxi:140
			pos --;                                                                // ac_showroom.jsxi:141
			out();                                                                 // ac_showroom.jsxi:142
		});
		t.find('#button-next').click(function (){                                  // ac_showroom.jsxi:145
			pos ++;                                                                // ac_showroom.jsxi:146
			out();                                                                 // ac_showroom.jsxi:147
		});
		d.content.css({ maxWidth: 'calc(100vw - 100px)', paddingBottom: '10px' }).find('img').css({ width: '100%', verticalAlign: 'top' });
		
		var pos = 0;
		
		function out(){                                                            // ac_showroom.jsxi:159
			t.find('#button-prev').attr('disabled', pos > 0 ? null : true);        // ac_showroom.jsxi:160
			t.find('#button-next').attr('disabled', pos < car.skins.length - 1 ? null : true);
			d.content.find('#current-preview').prop('src', car.skins[pos].preview.cssUrl());
			d.content.find('#new-preview').prop('src', (output + '/' + car.skins[pos].id + '.jpg').cssUrl());
		}
		
		out();                                                                     // ac_showroom.jsxi:166
	}
	
	AcShowroom.shot = function (c, m){                                             // ac_showroom.jsxi:169
		if (c.path.indexOf(AcDir.cars))                                            // ac_showroom.jsxi:170
			return;
		
		var mode = Settings.get('aptMode');
		
		if (mode === 'default'){                                                   // ac_showroom.jsxi:174
			var showroom = Settings.get('aptShowroom') || _blackShowroom;
			
			var x = - Settings.get('aptCameraX');
			
			var y = - Settings.get('aptCameraY');
			
			var distance = - Settings.get('aptCameraDistance');
			
			var filter = Settings.get('aptFilter') || null;
			
			var disableSweetFx = !!Settings.get('aptDisableSweetFx');
			
			var delays = !!Settings.get('aptIncreaseDelays');
			
			if (Number.isNaN(x))                                                   // ac_showroom.jsxi:183
				x = Settings.defaults.aptCameraX;                                  // ac_showroom.jsxi:183
			
			if (Number.isNaN(y))                                                   // ac_showroom.jsxi:184
				y = Settings.defaults.aptCameraY;                                  // ac_showroom.jsxi:184
			
			if (Number.isNaN(distance))                                            // ac_showroom.jsxi:185
				distance = Settings.defaults.aptCameraY;                           // ac_showroom.jsxi:185
			
			showroomTest();                                                        // ac_showroom.jsxi:187
			
			function showroomTest(){                                               // ac_showroom.jsxi:188
				function blackShowroomTest(){                                      // ac_showroom.jsxi:189
					return fs.existsSync(AcTools.Utils.FileUtils.GetShowroomFolder(AcDir.root, showroom));
				}
				
				if (showroom == _blackShowroom && !blackShowroomTest()){           // ac_showroom.jsxi:193
					new Dialog('One More Thing',                                   // ac_showroom.jsxi:194
						'Please, install <a href="#" onclick="Shell.openItem(\'' + _blackShowroomUrl + '\')">Black Showroom</a> first.', 
						function (){                                               // ac_showroom.jsxi:196
							Shell.openItem(_blackShowroomUrl);                     // ac_showroom.jsxi:197
							return false;
						}).setButton('From Here').addButton('Right Here',          // ac_showroom.jsxi:199
						function (){                                               // ac_showroom.jsxi:199
							Shell.openItem(AcTools.Utils.FileUtils.GetShowroomsFolder(AcDir.root));
							return false;
						}).addButton('Done',                                       // ac_showroom.jsxi:202
						function (){                                               // ac_showroom.jsxi:202
							if (blackShowroomTest()){                              // ac_showroom.jsxi:203
								setTimeout(proceed);                               // ac_showroom.jsxi:204
							} else {
								new Dialog('Black Showroom Installation',          // ac_showroom.jsxi:206
									'Showroom is still missing. Are you sure?');   // ac_showroom.jsxi:206
								this.buttons.find('button:last-child').text('Really Done');
								return false;
							}
						});
				} else {
					proceed();                                                     // ac_showroom.jsxi:212
				}
			}
		} else {
			proceed();                                                             // ac_showroom.jsxi:216
		}
		
		function proceed(){                                                        // ac_showroom.jsxi:219
			var output;
			
			try {
				if (mode === 'default'){                                           // ac_showroom.jsxi:222
					output = AcTools.Processes.Showroom.Shot(AcDir.root,           // ac_showroom.jsxi:223
						c.id,                                                      // ac_showroom.jsxi:223
						showroom,                                                  // ac_showroom.jsxi:223
						!!m,                                                       // ac_showroom.jsxi:223
						x,                                                         // ac_showroom.jsxi:223
						y,                                                         // ac_showroom.jsxi:223
						distance,                                                  // ac_showroom.jsxi:223
						filter,                                                    // ac_showroom.jsxi:223
						disableSweetFx,                                            // ac_showroom.jsxi:223
						delays);                                                   // ac_showroom.jsxi:223
				} else {
					output = AcTools.Utils.Kn5RenderWrapper.Shot(c.path, mode);    // ac_showroom.jsxi:225
				}
			} catch (err){                                                         // ac_showroom.jsxi:227
				if (!handleError(err, c)){                                         // ac_showroom.jsxi:228
					ErrorHandler.handled('Cannot start showroom. Maybe the car is broken.', err);
				}
				return;
			} 
			
			shotOutputPreview(c,                                                   // ac_showroom.jsxi:235
				output,                                                            // ac_showroom.jsxi:235
				function (){                                                       // ac_showroom.jsxi:235
					AcTools.Utils.ImageUtils.ApplyPreviews(AcDir.root, c.id, output, Settings.get('aptResize'));
					c.loadSkins();                                                 // ac_showroom.jsxi:237
					fs.rmdirSync(output);                                          // ac_showroom.jsxi:238
				});
		}
	};
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_showrooms){                                                  // ac_showroom.jsxi:16
					AcShowroom.load();
				}
				return _showrooms;                                                 // ac_showroom.jsxi:20
			})
		});
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'__AcShowroom_lastShowroom', 
		{
			get: (function (){
				return localStorage.lastShowroom || 'showroom';                    // ac_showroom.jsxi:65
			})
		});
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'__AcShowroom_lastShowroomFilter', 
		{
			get: (function (){
				return localStorage.lastShowroomFilter || '';                      // ac_showroom.jsxi:66
			})
		});
	return AcShowroom;
})();

__defineGetter__('AcTools',                                                        // ac_tools.jsxi:1
	function (){                                                                   // ac_tools.jsxi:1
		try {
			return AcTools = require('clr').init({                                 // ac_tools.jsxi:3
				assemblies: [ 'native/AcTools.dll', 'native/AcToolsKn5Render.dll' ], 
				global: false
			}).AcTools;                                                            // ac_tools.jsxi:6
		} catch (err){                                                             // ac_tools.jsxi:7
			throw new Error('Cannot load native module. Make sure you have .NET Framework 4.5 and Visual C++ Redistributable 2013 (x86) installed.');
		} 
	});

/* Class "CheckUpdate" declaration */
var CheckUpdate = (function (){                                                    // app_check_update.jsxi:1
	var CheckUpdate = function (){}, 
		mediator = new Mediator(),                                                 // app_check_update.jsxi:2
		_updateFile = path.join(path.dirname(process.execPath), 'carsmgr_update.next'), 
		_details = 'https://ascobash.wordpress.com/2015/06/14/actools-uijson/',    // app_check_update.jsxi:5
		_updateInProcess;                                                          // app_check_update.jsxi:48
	
	function isInstallableYadisk(link){                                            // app_check_update.jsxi:7
		return /^https:\/\/yadi.sk\/d\/\w+/.test(link);                            // app_check_update.jsxi:8
	}
	
	function isInstallableRd(link){                                                // app_check_update.jsxi:11
		return /^http:\/\/www.racedepartment.com\/downloads\//.test(link);         // app_check_update.jsxi:12
	}
	
	function isInstallable(link){                                                  // app_check_update.jsxi:15
		return isInstallableYadisk(link) || isInstallableRd(link);                 // app_check_update.jsxi:16
	}
	
	CheckUpdate.check = function (c){                                              // app_check_update.jsxi:19
		mediator.dispatch('check:start');                                          // app_check_update.jsxi:20
		AppServerRequest.checkUpdate(gui.App.manifest.version,                     // app_check_update.jsxi:22
			Settings.get('updatesSource', 'stable'),                               // app_check_update.jsxi:24
			function (err, data){                                                  // app_check_update.jsxi:25
				if (err){                                                          // app_check_update.jsxi:26
					console.warn(err);                                             // app_check_update.jsxi:27
					mediator.dispatch('check:failed');                             // app_check_update.jsxi:28
					return;
				}
				
				if (data){                                                         // app_check_update.jsxi:32
					mediator.dispatch('update',                                    // app_check_update.jsxi:33
						{
							actualVersion: data.version,                           // app_check_update.jsxi:34
							changelog: data.changes,                               // app_check_update.jsxi:35
							detailsUrl: _details,                                  // app_check_update.jsxi:36
							downloadUrl: data.url,                                 // app_check_update.jsxi:37
							installUrl: data.download || isInstallable(data.url) && data.url
						});
					mediator.dispatch('check:done:found');                         // app_check_update.jsxi:41
				} else {
					mediator.dispatch('check:done');                               // app_check_update.jsxi:43
				}
			});
	};
	
	function httpDownload(url, file, callback, progressCallback){                  // app_check_update.jsxi:49
		try {
			if (typeof file === 'string'){                                         // app_check_update.jsxi:51
				file = fs.createWriteStream(file);                                 // app_check_update.jsxi:52
			}
			
			_updateInProcess = require(url.match(/^https?/)[0]).get(url,           // app_check_update.jsxi:55
				function (r){                                                      // app_check_update.jsxi:55
					if (r.statusCode == 302){                                      // app_check_update.jsxi:56
						httpDownload(r.headers['location'], file, callback, progressCallback);
					} else if (r.statusCode == 200){                               // app_check_update.jsxi:58
						var m = r.headers['content-length'], p = 0;
						
						r.pipe(file);                                              // app_check_update.jsxi:60
						r.on('data',                                               // app_check_update.jsxi:61
							function (d){                                          // app_check_update.jsxi:61
								progressCallback(p += d.length, m);                // app_check_update.jsxi:62
							}).on('end',                                           // app_check_update.jsxi:63
							function (){                                           // app_check_update.jsxi:63
								if (_updateInProcess){                             // app_check_update.jsxi:64
									_updateInProcess = null;                       // app_check_update.jsxi:65
									setTimeout(callback, 50);                      // app_check_update.jsxi:66
								}
							});
					} else {
						callback(r.statusCode);                                    // app_check_update.jsxi:70
					}
				}).on('error',                                                     // app_check_update.jsxi:72
				function (e){                                                      // app_check_update.jsxi:72
					callback(e);                                                   // app_check_update.jsxi:73
				});
		} catch (e){                                                               // app_check_update.jsxi:75
			callback('DOWNLOAD:' + url);                                           // app_check_update.jsxi:76
		} 
	}
	
	function yadiskDownload(url, dest, callback, progressCallback){                // app_check_update.jsxi:80
		_updateInProcess = true;                                                   // app_check_update.jsxi:81
		
		var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load',    // app_check_update.jsxi:82
			function (e){                                                          // app_check_update.jsxi:82
				if (!_updateInProcess)                                             // app_check_update.jsxi:83
					return;
				
				this.contentWindow._cb = function (e){                             // app_check_update.jsxi:85
					if (!_updateInProcess)                                         // app_check_update.jsxi:86
						return;
					
					try {
						clearTimeout(to);                                          // app_check_update.jsxi:88
						httpDownload(e.models[0].data.file, dest, callback, progressCallback);
					} catch (e){
						callback('YADISK');                                        // app_check_update.jsxi:90
					} 
					
					ifr.remove();                                                  // app_check_update.jsxi:91
				};
				this.contentWindow.eval("\t\t\t\t\t \n_XMLHttpRequest = XMLHttpRequest;\nXMLHttpRequest = function (){\n\tvar r = new _XMLHttpRequest();\n\tr.onreadystatechange = function (e){\n\t\tif (r.status == 200 && r.readyState == 4)\n\t\t\t_cb(JSON.parse(r.responseText));\n\t};\n\treturn {\n\t\topen: function (){ r.open.apply(r, arguments); },\n\t\tsetRequestHeader: function (){ r.setRequestHeader.apply(r, arguments); },\n\t\tgetAllResponseHeaders: function (){ r.getAllResponseHeaders.apply(r, arguments); },\n\t\tgetResponseHeader: function (){ r.getResponseHeader.apply(r, arguments); },\n\t\tabort: function (){ r.abort.apply(r, arguments); },\n\t\tsend: function (){ r.send.apply(r, arguments); },\n\t};\n};");
				
				try {
					this.contentWindow.document.querySelector('button[data-click-action="resource.download"]').click();
				} catch (e){
					ifr.remove();                                                  // app_check_update.jsxi:113
					callback('YADISK:BTN');                                        // app_check_update.jsxi:114
				} 
			}).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');
		
		var to = setTimeout(function (){                                           // app_check_update.jsxi:118
			if (!_updateInProcess)                                                 // app_check_update.jsxi:119
				return;
			
			ifr.remove();                                                          // app_check_update.jsxi:120
			callback('YADISK:TO');                                                 // app_check_update.jsxi:121
		}, 
		10e3);
	}
	
	function rdDownload(url, dest, callback, progressCallback){                    // app_check_update.jsxi:125
		_updateInProcess = true;                                                   // app_check_update.jsxi:126
		
		var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load',    // app_check_update.jsxi:127
			function (e){                                                          // app_check_update.jsxi:127
				if (!_updateInProcess)                                             // app_check_update.jsxi:128
					return;
				
				try {
					clearTimeout(to);                                              // app_check_update.jsxi:131
					httpDownload(this.contentWindow.document.querySelector('.downloadButton a').href, 
						dest,                                                      // app_check_update.jsxi:132
						callback,                                                  // app_check_update.jsxi:132
						progressCallback);                                         // app_check_update.jsxi:132
				} catch (e){                                                       // app_check_update.jsxi:133
					ifr.remove();                                                  // app_check_update.jsxi:134
					callback('RD:BTN');                                            // app_check_update.jsxi:135
				} 
			}).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');
		
		var to = setTimeout(function (){                                           // app_check_update.jsxi:139
			if (!_updateInProcess)                                                 // app_check_update.jsxi:140
				return;
			
			ifr.remove();                                                          // app_check_update.jsxi:141
			callback('RD:TO');                                                     // app_check_update.jsxi:142
		}, 
		10e3);
	}
	
	function download(url, dest, callback, progressCallback){                      // app_check_update.jsxi:146
		if (isInstallableYadisk(url))                                              // app_check_update.jsxi:147
			yadiskDownload(url, dest, callback, progressCallback);                 // app_check_update.jsxi:147
		else if (isInstallableRd(url))                                             // app_check_update.jsxi:148
			rdDownload(url, dest, callback, progressCallback);                     // app_check_update.jsxi:148
		else
			httpDownload(url, dest, callback, progressCallback);                   // app_check_update.jsxi:149
	}
	
	CheckUpdate.install = function (url){                                          // app_check_update.jsxi:152
		mediator.dispatch('install:start');                                        // app_check_update.jsxi:153
		download(url,                                                              // app_check_update.jsxi:154
			_updateFile + '~tmp',                                                  // app_check_update.jsxi:154
			function (error){                                                      // app_check_update.jsxi:154
				if (error){                                                        // app_check_update.jsxi:155
					_updateInProcess = null;                                       // app_check_update.jsxi:156
					mediator.dispatch('install:failed', error);                    // app_check_update.jsxi:157
				} else {
					fs.renameSync(_updateFile + '~tmp', _updateFile);              // app_check_update.jsxi:159
					mediator.dispatch('install:ready');                            // app_check_update.jsxi:160
				}
			}, 
			function (p, m){                                                       // app_check_update.jsxi:162
				mediator.dispatch('install:progress', p, m);                       // app_check_update.jsxi:163
			});
	};
	CheckUpdate.abort = function (){                                               // app_check_update.jsxi:167
		if (!_updateInProcess)                                                     // app_check_update.jsxi:168
			return;
		
		if (_updateInProcess.abort)                                                // app_check_update.jsxi:169
			_updateInProcess.abort();                                              // app_check_update.jsxi:169
		
		_updateInProcess = null;                                                   // app_check_update.jsxi:171
		mediator.dispatch('install:interrupt');                                    // app_check_update.jsxi:172
		setTimeout(function (arg){                                                 // app_check_update.jsxi:174
			try {
				fs.unlinkSync(_updateFile + '~tmp');                               // app_check_update.jsxi:175
			} catch (e){} 
		}, 
		500);
	};
	CheckUpdate.autoupdate = function (){                                          // app_check_update.jsxi:179
		function clearDir(dirPath){                                                // app_check_update.jsxi:180
			try {
				var files = fs.readdirSync(dirPath);
			} catch (e){
				return;
			} 
			
			for (var i = 0; i < files.length; i ++){                               // app_check_update.jsxi:184
				var filePath = dirPath + '/' + files[i];
				
				if (fs.statSync(filePath).isFile()){                               // app_check_update.jsxi:186
					fs.unlinkSync(filePath);                                       // app_check_update.jsxi:187
				} else {
					clearDir(filePath);                                            // app_check_update.jsxi:189
					fs.rmdirSync(filePath);                                        // app_check_update.jsxi:190
				}
			}
		}
		
		;
		
		try {
			if (fs.existsSync(_updateFile)){                                       // app_check_update.jsxi:196
				var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
				
				if (fs.existsSync(d)){                                             // app_check_update.jsxi:198
					clearDir(d);                                                   // app_check_update.jsxi:199
				} else {
					fs.mkdirSync(d);                                               // app_check_update.jsxi:201
				}
				
				AcTools.Utils.FileUtils.Unzip(_updateFile, d);                     // app_check_update.jsxi:204
				
				var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
				
				fs.writeFileSync(b,                                                // app_check_update.jsxi:207
					"\t\t\t\t \n@ECHO OFF\n\nCD %~dp0\nTASKKILL /F /IM carsmgr.exe\n\n:CHECK_EXECUTABLE\nIF NOT EXIST carsmgr.exe GOTO EXECUTABLE_REMOVED\n\nDEL carsmgr.exe\nTIMEOUT /T 1 >nul\n\nGOTO CHECK_EXECUTABLE\n:EXECUTABLE_REMOVED\n\nDEL carsmgr.exe\n\nfor /r %%i in (carsmgr_update~next\\*) do MOVE /Y \"%%i\" %%~nxi\nRMDIR /S /Q carsmgr_update~next\n\nstart carsmgr.exe\n\nDEL %0 carsmgr_update.next".replace(/\n/g, '\r\n'));
				Shell.openItem(b);                                                 // app_check_update.jsxi:230
				gui.App.quit();                                                    // app_check_update.jsxi:231
			}
		} catch (e){                                                               // app_check_update.jsxi:233
			mediator.dispatch('autoupdate:failed', e);                             // app_check_update.jsxi:234
			
			try {
				if (fs.existsSync(_updateFile)){                                   // app_check_update.jsxi:236
					fs.unlinkSync(_updateFile);                                    // app_check_update.jsxi:237
				}
			} catch (e){} 
			
			try {
				var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
				
				if (fs.existsSync(d)){                                             // app_check_update.jsxi:242
					clearDir(d);                                                   // app_check_update.jsxi:243
					fs.rmdirSync(d);                                               // app_check_update.jsxi:244
				}
			} catch (e){} 
			
			try {
				var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
				
				if (fs.existsSync(b)){                                             // app_check_update.jsxi:250
					fs.unlinkSync(b);                                              // app_check_update.jsxi:251
				}
			} catch (e){} 
		} 
	};
	(function (){                                                                  // app_check_update.jsxi:257
		CheckUpdate.autoupdate();
		mediator.extend(CheckUpdate);                                              // app_check_update.jsxi:259
	})();
	return CheckUpdate;
})();

/* Class "AppServerRequest" declaration */
var AppServerRequest = (function (){                                               // app_server_request.jsxi:1
	var AppServerRequest = function (){}, 
		_host = 'ascobash.comuf.com',                                              // app_server_request.jsxi:2
		_dataToSend = [],                                                          // app_server_request.jsxi:62
		_sendTimeout,                                                              // app_server_request.jsxi:63
		_sendDelay = 3e3;                                                          // app_server_request.jsxi:64
	
	AppServerRequest.sendDataDisabled = false;                                     // app_server_request.jsxi:88
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
	AppServerRequest.sendBinary = function (car, file, buf, callback){             // app_server_request.jsxi:20
		var req = new XMLHttpRequest();
		
		req.open('POST',                                                           // app_server_request.jsxi:22
			'http://ascobash.comuf.com/api.php?0=binary&c=' + car + '&f=' + file, 
			true);
		req.setRequestHeader('Content-Type', 'application/octet-stream');          // app_server_request.jsxi:23
		req.onreadystatechange = function (){                                      // app_server_request.jsxi:25
			if (req.readyState == 4){                                              // app_server_request.jsxi:26
				if (callback)                                                      // app_server_request.jsxi:27
					callback(null);                                                // app_server_request.jsxi:27
			}
		};
		req.send(new Uint8Array(buf).buffer);                                      // app_server_request.jsxi:31
	};
	AppServerRequest.sendFeedback = function (feedback, callback){                 // app_server_request.jsxi:34
		$.ajax({                                                                   // app_server_request.jsxi:35
			url: 'http://ascobash.comuf.com/api.php?0=feedback',                   // app_server_request.jsxi:35
			type: 'POST',                                                          // app_server_request.jsxi:37
			contentType: 'text/plain',                                             // app_server_request.jsxi:38
			data: feedback,                                                        // app_server_request.jsxi:39
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:41
			if (callback)                                                          // app_server_request.jsxi:42
				callback('error:request');                                         // app_server_request.jsxi:42
		}).done(function (data){                                                   // app_server_request.jsxi:43
			if (callback)                                                          // app_server_request.jsxi:44
				callback(null);                                                    // app_server_request.jsxi:44
		});
	};
	AppServerRequest.sendError = function (version, details, callback){            // app_server_request.jsxi:48
		$.ajax({                                                                   // app_server_request.jsxi:49
			url: 'http://ascobash.comuf.com/api.php?0=error',                      // app_server_request.jsxi:49
			type: 'POST',                                                          // app_server_request.jsxi:51
			contentType: 'text/plain',                                             // app_server_request.jsxi:52
			data: version + ':' + details,                                         // app_server_request.jsxi:53
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:55
			if (callback)                                                          // app_server_request.jsxi:56
				callback('error:request');                                         // app_server_request.jsxi:56
		}).done(function (data){                                                   // app_server_request.jsxi:57
			if (callback)                                                          // app_server_request.jsxi:58
				callback(null);                                                    // app_server_request.jsxi:58
		});
	};
	
	function sendDataInner(carId, key, value){                                     // app_server_request.jsxi:66
		$.ajax({                                                                   // app_server_request.jsxi:67
			url: 'http://ascobash.comuf.com/api.php?0=database&c=' + carId + '&f=' + key, 
			type: 'POST',                                                          // app_server_request.jsxi:69
			contentType: 'text/plain',                                             // app_server_request.jsxi:70
			data: value,                                                           // app_server_request.jsxi:71
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:73
			console.warn('send data failed');                                      // app_server_request.jsxi:74
		});
	}
	
	function sendDataGroup(carId, key, value, callback){                           // app_server_request.jsxi:78
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:79
			var e = _dataToSend[i];
			
			if (e){                                                                // app_server_request.jsxi:80
				sendDataInner(e.car, e.key, e.value);                              // app_server_request.jsxi:81
			}
		}
		
		_dataToSend = [];                                                          // app_server_request.jsxi:85
	}
	
	AppServerRequest.sendData = function (carId, key, value, callback){            // app_server_request.jsxi:89
		if (AppServerRequest.sendDataDisabled)
			return;
		
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:92
			var e = _dataToSend[i];
			
			if (e && e.car === carId && e.key === key){                            // app_server_request.jsxi:93
				_dataToSend[i] = null;                                             // app_server_request.jsxi:94
			}
		}
		
		_dataToSend.push({ car: carId, key: key, value: value });                  // app_server_request.jsxi:98
		
		if (callback)                                                              // app_server_request.jsxi:99
			callback(null);                                                        // app_server_request.jsxi:99
		
		clearTimeout(_sendTimeout);                                                // app_server_request.jsxi:101
		_sendTimeout = setTimeout(sendDataGroup, _sendDelay);                      // app_server_request.jsxi:102
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
		_list,                                                                     // cars.jsxi:25
		_brands = new UniqueList('brand'),                                         // cars.jsxi:26
		_classes = new UniqueList('class'),                                        // cars.jsxi:27
		_countries = new UniqueList('country'),                                    // cars.jsxi:28
		_authors = new UniqueList('author'),                                       // cars.jsxi:29
		_tags = new UniqueList('tag');                                             // cars.jsxi:30
	
	Cars.byName = function (n){                                                    // cars.jsxi:37
		for (var i = 0; i < _list.length; i ++){                                   // cars.jsxi:38
			if (_list[i].id === n){                                                // cars.jsxi:39
				return _list[i];                                                   // cars.jsxi:40
			}
		}
		return null;
	};
	Cars.registerTags = function (tags){                                           // cars.jsxi:47
		tags.forEach(function (e){                                                 // cars.jsxi:48
			_tags.add(e);                                                          // cars.jsxi:49
		});
	};
	Cars.registerClass = function (v){                                             // cars.jsxi:53
		_classes.add(v);                                                           // cars.jsxi:54
	};
	Cars.registerBrand = function (v){                                             // cars.jsxi:57
		_brands.add(v);                                                            // cars.jsxi:58
		Brands.add(v);                                                             // cars.jsxi:59
	};
	Cars.registerCountry = function (v){                                           // cars.jsxi:62
		_countries.add(v);                                                         // cars.jsxi:63
	};
	Cars.registerAuthor = function (v){                                            // cars.jsxi:66
		_authors.add(v);                                                           // cars.jsxi:67
	};
	Cars.scan = function (){                                                       // cars.jsxi:70
		mediator.dispatch('scan:start');                                           // cars.jsxi:71
		
		if (!fs.existsSync(AcDir.carsOff)){                                        // cars.jsxi:73
			fs.mkdirSync(AcDir.carsOff);                                           // cars.jsxi:74
		}
		
		var names = {};
		
		_list = fs.readdirSync(AcDir.cars).map(function (e){                       // cars.jsxi:78
			return path.join(AcDir.cars, e);                                       // cars.jsxi:79
		}).concat(fs.readdirSync(AcDir.carsOff).map(function (e){                  // cars.jsxi:80
			return path.join(AcDir.carsOff, e);                                    // cars.jsxi:81
		})).map(function (carPath){                                                // cars.jsxi:82
			car = new Car(carPath);                                                // cars.jsxi:83
			
			if (names[car.id])                                                     // cars.jsxi:85
				return;
			
			mediator.dispatch('new.car', car);                                     // cars.jsxi:86
			names[car.id] = true;                                                  // cars.jsxi:87
			return car;                                                            // cars.jsxi:88
		}).filter(function (e){                                                    // cars.jsxi:89
			return e;                                                              // cars.jsxi:90
		});
		asyncLoad();                                                               // cars.jsxi:93
	};
	
	function asyncLoad(){                                                          // cars.jsxi:96
		var a = _list,                                                             // cars.jsxi:97
			i = 0,                                                                 // cars.jsxi:97
			step = function (arg){                                                 // cars.jsxi:98
				if (a != _list){                                                   // cars.jsxi:99
					mediator.dispatch('scan:interrupt', a);                        // cars.jsxi:100
				} else if (i >= a.length){                                         // cars.jsxi:101
					mediator.dispatch('scan:ready', a);                            // cars.jsxi:102
					lasyAsyncLoad();                                               // cars.jsxi:103
				} else {
					mediator.dispatch('scan:progress', i, a.length);               // cars.jsxi:106
					a[i ++].loadData(step);                                        // cars.jsxi:107
				}
			};
		
		mediator.dispatch('scan:list', a);                                         // cars.jsxi:111
		step();                                                                    // cars.jsxi:112
	}
	
	function lasyAsyncLoad(){                                                      // cars.jsxi:115
		var a = _list,                                                             // cars.jsxi:116
			b = a.slice(),                                                         // cars.jsxi:116
			i = 0,                                                                 // cars.jsxi:116
			step = setTimeout.bind(window,                                         // cars.jsxi:117
				function (arg){                                                    // cars.jsxi:117
					if (a != _list){                                               // cars.jsxi:118
						mediator.dispatch('lazyscan:interrupt', b);                // cars.jsxi:119
					} else if (i >= b.length){                                     // cars.jsxi:120
						mediator.dispatch('lazyscan:ready', b);                    // cars.jsxi:121
					} else {
						mediator.dispatch('lazyscan:progress', i, b.length);       // cars.jsxi:123
						b[i ++].loadEnsure(step);                                  // cars.jsxi:124
					}
				}, 
				20);
		
		mediator.dispatch('lazyscan:start', b);                                    // cars.jsxi:128
		step();                                                                    // cars.jsxi:129
	}
	
	Cars.acdTest = function (){                                                    // cars.jsxi:132
		var a = _list,                                                             // cars.jsxi:133
			b = a.slice(),                                                         // cars.jsxi:133
			i = 0,                                                                 // cars.jsxi:133
			step = setTimeout.bind(window,                                         // cars.jsxi:134
				function (arg){                                                    // cars.jsxi:134
					if (a != _list){                                               // cars.jsxi:135
						mediator.dispatch('lazyscan:interrupt', b);                // cars.jsxi:136
					} else if (i >= b.length){                                     // cars.jsxi:137
						mediator.dispatch('lazyscan:ready', b);                    // cars.jsxi:138
					} else {
						mediator.dispatch('lazyscan:progress', i, b.length);       // cars.jsxi:140
						b[i ++].testAcd(step);                                     // cars.jsxi:141
					}
				}, 
				20);
		
		mediator.dispatch('lazyscan:start', b);                                    // cars.jsxi:145
		step();                                                                    // cars.jsxi:146
	};
	Cars.toggle = function (car, state){                                           // cars.jsxi:149
		car.toggle(state);                                                         // cars.jsxi:150
	};
	Cars.changeData = function (car, key, value){                                  // cars.jsxi:153
		car.changeData(key, value);                                                // cars.jsxi:154
	};
	Cars.changeDataSpecs = function (car, key, value){                             // cars.jsxi:157
		car.changeDataSpecs(key, value);                                           // cars.jsxi:158
	};
	Cars.changeParent = function (car, parentId){                                  // cars.jsxi:161
		car.changeParent(parentId);                                                // cars.jsxi:162
	};
	Cars.selectSkin = function (car, skinId){                                      // cars.jsxi:165
		car.selectSkin(skinId);                                                    // cars.jsxi:166
	};
	Cars.updateSkins = function (car){                                             // cars.jsxi:169
		car.updateSkins();                                                         // cars.jsxi:170
	};
	Cars.updateUpgrade = function (car){                                           // cars.jsxi:173
		car.updateUpgrade();                                                       // cars.jsxi:174
	};
	Cars.reload = function (car){                                                  // cars.jsxi:177
		car.load();                                                                // cars.jsxi:178
	};
	Cars.reloadAll = function (){                                                  // cars.jsxi:181
		Cars.scan();
	};
	Cars.save = function (car){                                                    // cars.jsxi:185
		car.save();                                                                // cars.jsxi:186
	};
	Cars.saveAll = function (){                                                    // cars.jsxi:189
		_list.forEach(function (car){                                              // cars.jsxi:190
			if (car.changed){                                                      // cars.jsxi:191
				car.save();                                                        // cars.jsxi:192
			}
		});
	};
	Cars.remove = function (car){                                                  // cars.jsxi:197
		for (var i = 0; i < _list.length; i ++){                                   // cars.jsxi:198
			var c = _list[i];
			
			if (c === car){                                                        // cars.jsxi:199
				AcTools.Utils.FileUtils.Recycle(car.path);                         // cars.jsxi:200
				
				if (car.parent){                                                   // cars.jsxi:202
					car.parent.children.splice(car.parent.children.indexOf(car), 1);
					mediator.dispatch('update.car.children', car.parent);          // cars.jsxi:204
				}
				
				{
					var __2 = car.children;
					
					for (var __1 = 0; __1 < __2.length; __1 ++){
						var child = __2[__1];
						
						Cars.remove(child);                                        // cars.jsxi:208
					}
					
					__2 = undefined;
				}
				
				_list.splice(i, 1);                                                // cars.jsxi:211
				mediator.dispatch('remove.car', car);                              // cars.jsxi:212
				return;
			}
		}
	};
	
	function parseLoadedData(data){                                                // cars_car_load.jsxi:254
		try {
			return JSON.parse(data);                                               // cars_car_load.jsxi:256
		} catch (e){
			try {
				return JSON.flexibleParse(data);                                   // cars_car_load.jsxi:258
			} catch (er){                                                          // cars_car_load.jsxi:259
				return er;                                                         // cars_car_load.jsxi:260
			} 
		} 
	}
	
	/* Class "UniqueList" declaration */
	function UniqueList(name){                                                     // cars.jsxi:4
		this.list = [];
		this.__UniqueList__lower = [];
		this.name = name;                                                          // cars.jsxi:10
	}
	UniqueList.prototype.add = function (v){                                       // cars.jsxi:13
		if (!v)                                                                    // cars.jsxi:14
			return;
		
		var l = v.toLowerCase();
		
		if (this.__UniqueList__lower.indexOf(l) < 0){                              // cars.jsxi:16
			this.list.push(v);                                                     // cars.jsxi:17
			this.__UniqueList__lower.push(l);                                      // cars.jsxi:18
			mediator.dispatch('new.' + this.name, v);                              // cars.jsxi:20
		}
	};
	
	/* Class "Car" declaration */
	var Car = (function (){                                                        // cars_car.jsxi:2
		var Car = function (carPath){                                              // cars_car.jsxi:2
				this.error = [];
				this.changed = false;
				this.parent = null;
				this.children = [];
				this.id = carPath.slice(Math.max(carPath.lastIndexOf('/'), carPath.lastIndexOf('\\')) + 1);
				this.path = carPath;                                               // cars_car.jsxi:25
				this.disabled = carPath.indexOf(AcDir.carsOff) != - 1;             // cars_car.jsxi:27
			}, 
			_messages = {                                                          // cars_car_load.jsxi:247
				'acd-test-error': 'Cannot test data',                              // cars_car_load.jsxi:247
				'acd-invalid-weight': 'Weight in data has to be equal to weight in UI + 75kg (±90kg)', 
				'acd-obsolete-aero-data': 'Obsolete section “DATA” in aero.ini'
			};
		
		Car.prototype.getSpec = function (id){                                     // cars_car.jsxi:30
			return this.data && this.data.specs[id] && + this.data.specs[id].match(/\d+(?:\.\d+)?/) || null;
		};
		Car.prototype.addError = function (id, msg, details, object){              // cars_car.jsxi:34
			if (this.hasError(id))
				return;
			
			this.error.push({ id: id, msg: msg, details: details, object: object });
			mediator.dispatch('error:add', this);                                  // cars_car.jsxi:37
		};
		Car.prototype.removeError = function (id){                                 // cars_car.jsxi:40
			for (var i = 0; i < this.error.length; i ++){                          // cars_car.jsxi:41
				var e = this.error[i];
				
				if (e.id === id){                                                  // cars_car.jsxi:42
					this.error.splice(i, 1);                                       // cars_car.jsxi:43
					mediator.dispatch('error:remove', this);                       // cars_car.jsxi:44
					return;
				}
			}
		};
		Car.prototype.clearErrors = function (filter){                             // cars_car.jsxi:50
			if (this.error.length > 0){                                            // cars_car.jsxi:51
				if (filter){                                                       // cars_car.jsxi:52
					var o = this.error.length;
					
					this.error = this.error.filter(function (arg){                 // cars_car.jsxi:54
						return arg.id.indexOf(filter) < 0;                         // cars_car.jsxi:54
					});
					
					if (o === this.error.length)                                   // cars_car.jsxi:55
						return;
				} else {
					this.error.length = 0;                                         // cars_car.jsxi:57
				}
				
				mediator.dispatch('error:remove', this);                           // cars_car.jsxi:60
			}
		};
		Car.prototype.getError = function (id){                                    // cars_car.jsxi:64
			for (var __3 = 0; __3 < this.error.length; __3 ++){
				var e = this.error[__3];
				
				if (e.id === id)                                                   // cars_car.jsxi:66
					return e;                                                      // cars_car.jsxi:66
			}
			return null;
		};
		Car.prototype.hasError = function (id){                                    // cars_car.jsxi:72
			for (var __4 = 0; __4 < this.error.length; __4 ++){
				var e = this.error[__4];
				
				if (e.id === id)                                                   // cars_car.jsxi:74
					return true;
			}
			return false;
		};
		Car.prototype.toggle = function (state){                                   // cars_car.jsxi:80
			var __that = this, 
				d = state == null ? !this.disabled : !state;                       // cars_car.jsxi:81
			
			if (this.disabled == d)                                                // cars_car.jsxi:82
				return;
			
			var a, b;
			
			if (d){                                                                // cars_car.jsxi:85
				a = AcDir.cars, b = AcDir.carsOff;
			} else {
				a = AcDir.carsOff, b = AcDir.cars;
			}
			
			var newPath = this.path.replace(a, b);
			
			try {
				fs.renameSync(this.path, newPath);                                 // cars_car.jsxi:93
			} catch (err){                                                         // cars_car.jsxi:94
				ErrorHandler.handled('Cannot change car state.', err);             // cars_car.jsxi:95
				return;
			} 
			
			this.disabled = d;                                                     // cars_car.jsxi:99
			this.path = newPath;                                                   // cars_car.jsxi:100
			mediator.dispatch('update.car.disabled', this);                        // cars_car.jsxi:102
			mediator.dispatch('update.car.path', this);                            // cars_car.jsxi:103
			
			if (this.skins)
				mediator.dispatch('update.car.skins', this);                       // cars_car.jsxi:104
			
			if (this.parent && !this.disabled && this.parent.disabled){            // cars_car.jsxi:106
				this.toggle(this.parent, 
					true);
			}
			
			this.children.forEach(function (e){                                    // cars_car.jsxi:110
				__that.toggle(e, !__that.disabled);
			});
		};
		Car.prototype.changeData = function (key, value, inner){                   // cars_car.jsxi:120
			if (inner === undefined)                                               // cars_car.jsxi:120
				inner = false;                                                     // cars_car.jsxi:120
		
			if (!this.data || this.data[key] == value)                             // cars_car.jsxi:121
				return;
			
			if (!value && (key === 'name' || key === 'brand'))                     // cars_car.jsxi:122
				return;
			
			if (!inner){                                                           // cars_car.jsxi:124
				if (key === 'name' || key === 'brand' || key === 'class' || key === 'year' || key === 'country' || key === 'author' || key === 'version' || key === 'url'){
					value = clearStr(value);                                       // cars_car.jsxi:128
				}
				
				if (key === 'name'){                                               // cars_car.jsxi:131
					if (Years.nameContains(value) && Years.fromName(this.data.name) == this.data.year){
						this.changeData('year', Years.fromName(value), true);
					}
					
					if (Brands.nameContains(this.data.name, this.data.brand) && Brands.nameContains(value)){
						this.changeData('brand', Brands.fromName(value), true);
					}
				}
				
				if (key === 'country'){                                            // cars_car.jsxi:141
					var i = this.data.tags.map(function (arg){                     // cars_car.jsxi:142
						return arg.toLowerCase();                                  // cars_car.jsxi:142
					}).indexOf(this.data.country.toLowerCase());                   // cars_car.jsxi:142
					
					if (i > - 1){                                                  // cars_car.jsxi:144
						var tags = this.data.tags.slice();
						
						tags[i] = value.toLowerCase();                             // cars_car.jsxi:146
						this.changeData('tags', tags, true);
					}
				}
				
				if (key === 'brand'){                                              // cars_car.jsxi:151
					if (Brands.nameContains(this.data.name, this.data.brand)){     // cars_car.jsxi:152
						this.changeData('name',                                    // cars_car.jsxi:153
							value + this.data.name.substr(Brands.toNamePart(this.data.brand).length), 
							true);
					}
				}
				
				if (key === 'year'){                                               // cars_car.jsxi:157
					value = value ? + ('' + value).replace(/[^\d]+/g, '') : null;
					
					if (value < 1800 || value > 2100)                              // cars_car.jsxi:159
						return;
					
					if (Years.nameContains(this.data.name)){                       // cars_car.jsxi:161
						if (this.data.name.substr(- 4) == this.data.year){         // cars_car.jsxi:162
							this.data.name = this.data.name.slice(0, - 4) + value;
						} else if (this.data.name.substr(- 2) == ('' + this.data.year).slice(2)){
							this.data.name = this.data.name.slice(0, - 2) + ('' + value).slice(2);
						}
					}
				}
				
				if (Settings.get('uploadData')){                                   // cars_car.jsxi:170
					AppServerRequest.sendData(this.id, key, value);                // cars_car.jsxi:171
				}
			}
			
			if (key === 'tags'){                                                   // cars_car.jsxi:175
				Cars.registerTags(value);
			}
			
			if (key === 'brand'){                                                  // cars_car.jsxi:179
				Cars.registerBrand(value);
			}
			
			if (key === 'class'){                                                  // cars_car.jsxi:183
				Cars.registerClass(value);
			}
			
			if (key === 'country'){                                                // cars_car.jsxi:187
				Cars.registerCountry(value);
			}
			
			if (key === 'author'){                                                 // cars_car.jsxi:191
				Cars.registerAuthor(value);
			}
			
			this.data[key] = value;                                                // cars_car.jsxi:195
			mediator.dispatch('update.car.data:' + key, this);                     // cars_car.jsxi:196
			
			if (!this.changed){
				this.changed = true;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:200
			}
		};
		Car.prototype.changeDataSpecs = function (key, value, inner){              // cars_car.jsxi:204
			if (!this.data || this.data.specs[key] == value)                       // cars_car.jsxi:205
				return;
			
			value = clearStr(value);                                               // cars_car.jsxi:207
			this.data.specs[key] = value;                                          // cars_car.jsxi:208
			
			if (!inner){                                                           // cars_car.jsxi:210
				if (key === 'weight' || key === 'bhp'){                            // cars_car.jsxi:211
					this.recalculatePwRatio();
				}
				
				if (Settings.get('uploadData')){                                   // cars_car.jsxi:215
					AppServerRequest.sendData(this.id, 'specs:' + key, value);     // cars_car.jsxi:216
				}
			}
			
			mediator.dispatch('update.car.data:specs', this);                      // cars_car.jsxi:220
			
			if (!this.changed){
				this.changed = true;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:224
			}
		};
		Car.prototype.recalculatePwRatio = function (inner){                       // cars_car.jsxi:228
			var w = this.getSpec('weight'), p = this.getSpec('bhp');
			
			if (w && p){                                                           // cars_car.jsxi:231
				this.changeDataSpecs('pwratio', + (+ w / + p).toFixed(2) + 'kg/cv', inner);
			}
		};
		Car.prototype.changeParent = function (parentId){                          // cars_car.jsxi:236
			if (!this.data || this.parent && this.parent.id == parentId || !this.parent && parentId == null)
				return;
			
			if (this.children.length > 0)                                          // cars_car.jsxi:238
				throw new Error('Children car cannot have childrens');             // cars_car.jsxi:238
			
			if (this.parent){
				this.parent.children.splice(this.parent.children.indexOf(this), 1);
				mediator.dispatch('update.car.children', this.parent);             // cars_car.jsxi:242
			}
			
			if (parentId){                                                         // cars_car.jsxi:245
				var par = Cars.byName(parentId);
				
				if (!par)                                                          // cars_car.jsxi:247
					throw new Error('Parent car "' + parentId + '" not found');    // cars_car.jsxi:247
				
				this.parent = par;                                                 // cars_car.jsxi:249
				this.parent.children.push(this);                                   // cars_car.jsxi:250
				mediator.dispatch('update.car.parent', this);                      // cars_car.jsxi:251
				mediator.dispatch('update.car.children', this.parent);             // cars_car.jsxi:252
				this.data.parent = this.parent.id;                                 // cars_car.jsxi:254
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:255
			} else {
				this.parent = null;
				mediator.dispatch('update.car.parent', this);                      // cars_car.jsxi:258
				delete this.data.parent;                                           // cars_car.jsxi:260
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:261
			}
			
			this.changed = true;
			mediator.dispatch('update.car.changed', this);                         // cars_car.jsxi:265
		};
		Car.prototype.getSkin = function (skinId){                                 // cars_car.jsxi:268
			for (var __5 = 0; __5 < this.skins.length; __5 ++){
				var skin = this.skins[__5];
				
				if (skin.id === skinId){                                           // cars_car.jsxi:270
					return skin;                                                   // cars_car.jsxi:271
				}
			}
		};
		Car.prototype.selectSkin = function (skinId){                              // cars_car.jsxi:276
			if (!this.skins)
				return;
			
			var newSkin = this.getSkin(skinId);
			
			if (newSkin == this.selectedSkin)                                      // cars_car.jsxi:280
				return;
			
			this.selectedSkin = newSkin;                                           // cars_car.jsxi:282
			mediator.dispatch('update.car.skins', this);                           // cars_car.jsxi:283
		};
		Car.prototype.updateSkins = function (){                                   // cars_car.jsxi:286
			gui.App.clearCache();                                                  // cars_car.jsxi:287
			setTimeout((function (){                                               // cars_car.jsxi:288
				mediator.dispatch('update.car.skins', this);                       // cars_car.jsxi:289
			}).bind(this),                                                         // cars_car.jsxi:290
			100);
		};
		Car.prototype.updateBadge = function (){                                   // cars_car.jsxi:293
			gui.App.clearCache();                                                  // cars_car.jsxi:294
			setTimeout((function (){                                               // cars_car.jsxi:295
				mediator.dispatch('update.car.badge', this);                       // cars_car.jsxi:296
			}).bind(this),                                                         // cars_car.jsxi:297
			100);
		};
		Car.prototype.updateUpgrade = function (){                                 // cars_car.jsxi:300
			gui.App.clearCache();                                                  // cars_car.jsxi:301
			setTimeout((function (){                                               // cars_car.jsxi:302
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:303
			}).bind(this),                                                         // cars_car.jsxi:304
			100);
		};
		Car.prototype.save = function (){                                          // cars_car.jsxi:307
			if (this.data){
				var p = Object.clone(this.data);
				
				p.description = p.description.replace(/\n/g, '<br>');              // cars_car.jsxi:310
				p.class = p.class.toLowerCase();                                   // cars_car.jsxi:311
				fs.writeFileSync(this.json,                                        // cars_car.jsxi:312
					JSON.stringify(p, null, 
						4));                                                       // cars_car.jsxi:312
				this.changed = false;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:314
			}
		};
		Car.prototype.loadBadge = function (callback){                             // cars_car_load.jsxi:4
			var __that = this;
			
			this.clearErrors('badge');
			
			if (this.__Car__badgeLoaded)
				gui.App.clearCache();                                              // cars_car_load.jsxi:6
			
			fs.exists(this.badge,                                                  // cars_car_load.jsxi:8
				(function (result){                                                // cars_car_load.jsxi:8
					if (!result){                                                  // cars_car_load.jsxi:9
						__that.addError('badge-missing', 'Missing badge.png');
					}
					
					__that.__Car__badgeLoaded = true;
					
					if (callback)                                                  // cars_car_load.jsxi:14
						callback();                                                // cars_car_load.jsxi:14
				}).bind(this));                                                    // cars_car_load.jsxi:15
		};
		Car.prototype.loadSkins_stuff = function (callback){                       // cars_car_load.jsxi:18
			var __that = this, 
				a = this.skins, i = 0;
			
			step();                                                                // cars_car_load.jsxi:20
			
			function step(){                                                       // cars_car_load.jsxi:22
				if (a != __that.skins){                                            // cars_car_load.jsxi:23
					if (callback)                                                  // cars_car_load.jsxi:24
						callback();                                                // cars_car_load.jsxi:24
				} else if (i >= a.length){                                         // cars_car_load.jsxi:25
					if (callback)                                                  // cars_car_load.jsxi:26
						callback();                                                // cars_car_load.jsxi:26
					
					mediator.dispatch('update.car.skins:data', this);              // cars_car_load.jsxi:27
				} else {
					a[i ++].load(step);                                            // cars_car_load.jsxi:29
				}
			}
		};
		Car.prototype.loadSkins = function (callback){                             // cars_car_load.jsxi:34
			var __that = this;
			
			if (this.skins){
				this.skins = null;
				mediator.dispatch('update.car.skins', this);                       // cars_car_load.jsxi:37
				gui.App.clearCache();                                              // cars_car_load.jsxi:38
			}
			
			this.clearErrors('skin');
			this.clearErrors('skins');
			
			if (!fs.existsSync(this.skinsDir)){                                    // cars_car_load.jsxi:44
				this.addError('skins-missing', 'Skins folder is missing');
				
				if (callback)                                                      // cars_car_load.jsxi:46
					callback();                                                    // cars_car_load.jsxi:46
				return;
			}
			
			if (!fs.statSync(this.skinsDir).isDirectory()){                        // cars_car_load.jsxi:50
				this.addError('skins-file', 'There is a file instead of skins folder', err);
				
				if (callback)                                                      // cars_car_load.jsxi:52
					callback();                                                    // cars_car_load.jsxi:52
				return;
			}
			
			fs.readdir(this.skinsDir,                                              // cars_car_load.jsxi:56
				(function (err, result){                                           // cars_car_load.jsxi:56
					__that.skins = false;
					
					if (err){                                                      // cars_car_load.jsxi:59
						__that.addError('skins-access', 'Cannot access skins', err);
					} else {
						result = result.filter(function (e){                       // cars_car_load.jsxi:62
							return fs.statSync(__that.path + '/skins/' + e).isDirectory();
						});
						
						if (__that.skins.length === 0){                            // cars_car_load.jsxi:66
							__that.addError('skins-empty', 'Skins folder is empty');
						} else {
							__that.skins = result.map((function (e){               // cars_car_load.jsxi:69
								return new CarSkin(this, e);                       // cars_car_load.jsxi:70
							}).bind(this));                                        // cars_car_load.jsxi:71
							
							var index = 0;
							
							if (__that.selectedSkin){
								for (var i = 0; i < __that.skins.length; i ++){    // cars_car_load.jsxi:75
									var s = __that.skins[i];
									
									if (s.id === __that.selectedSkin.id){          // cars_car_load.jsxi:76
										index = i;                                 // cars_car_load.jsxi:77
										
										break;
									}
								}
							}
							
							__that.selectedSkin = __that.skins[index];             // cars_car_load.jsxi:83
							mediator.dispatch('update.car.skins', this);           // cars_car_load.jsxi:84
							__that.loadSkins_stuff(callback);
							return;
						}
					}
					
					if (callback)                                                  // cars_car_load.jsxi:90
						callback();                                                // cars_car_load.jsxi:90
				}).bind(this));                                                    // cars_car_load.jsxi:91
		};
		Car.prototype.loadData = function (callback){                              // cars_car_load.jsxi:94
			var __that = this;
			
			if (this.data){
				this.data = null;
				mediator.dispatch('update.car.data', this);                        // cars_car_load.jsxi:97
			}
			
			if (this.parent){
				this.parent.children.splice(this.parent.children.indexOf(this), 1);
				mediator.dispatch('update.car.children', this.parent);             // cars_car_load.jsxi:102
				this.parent = null;
				mediator.dispatch('update.car.parent', this);                      // cars_car_load.jsxi:104
			}
			
			this.clearErrors('data');
			this.clearErrors('parent');
			
			if (!fs.existsSync(this.json)){                                        // cars_car_load.jsxi:110
				if (fs.existsSync(this.json + '.disabled')){                       // cars_car_load.jsxi:111
					fs.renameSync(this.json + '.disabled', this.json);             // cars_car_load.jsxi:112
				} else {
					if (this.changed){
						this.changed = false;
						mediator.dispatch('update.car.changed', this);             // cars_car_load.jsxi:116
					}
					
					this.data = false;
					this.addError('data-missing', 'Missing ui_car.json');
					mediator.dispatch('update.car.data', this);                    // cars_car_load.jsxi:121
					
					if (callback)                                                  // cars_car_load.jsxi:122
						callback();                                                // cars_car_load.jsxi:122
					return;
				}
			}
			
			fs.readFile(this.json,                                                 // cars_car_load.jsxi:127
				(function (err, result){                                           // cars_car_load.jsxi:127
					if (__that.changed){
						__that.changed = false;
						mediator.dispatch('update.car.changed', this);             // cars_car_load.jsxi:130
					}
					
					if (err){                                                      // cars_car_load.jsxi:133
						__that.data = false;
						__that.addError('data-access', 'Unavailable ui_car.json', err);
					} else {
						var dat = parseLoadedData(result.toString()),              // cars_car_load.jsxi:137
							err = dat instanceof Error && dat;                     // cars_car_load.jsxi:138
						
						__that.data = false;
						
						if (err || !dat){                                          // cars_car_load.jsxi:141
							__that.addError('data-damaged', 'Damaged ui_car.json', err);
						} else if (!dat.name){                                     // cars_car_load.jsxi:143
							__that.addError('data-name-missing', 'Name is missing');
						} else if (!dat.brand){                                    // cars_car_load.jsxi:145
							__that.addError('data-brand-missing', 'Brand is missing');
						} else {
							__that.data = dat;                                     // cars_car_load.jsxi:148
							
							if (!__that.data.description)                          // cars_car_load.jsxi:149
								__that.data.description = '';                      // cars_car_load.jsxi:149
							
							if (!__that.data.tags)                                 // cars_car_load.jsxi:150
								__that.data.tags = [];                             // cars_car_load.jsxi:150
							
							if (!__that.data.specs)                                // cars_car_load.jsxi:151
								__that.data.specs = {};                            // cars_car_load.jsxi:151
							
							__that.data.name = __that.data.name.trim();            // cars_car_load.jsxi:153
							__that.data.brand = __that.data.brand.trim();          // cars_car_load.jsxi:154
							__that.data.class = (__that.data.class || '').trim();
							__that.data.description = __that.data.description.replace(/\n/g, ' ').replace(/<\/?br\/?>[ \t]*|\n[ \t]+/g, '\n').replace(/<\s*\/?\s*\w+\s*>/g, '').replace(/[\t ]+/g, ' ').decodeHtmlEntities();
							
							if (__that.data.year == null && Years.nameContains(__that.data.name)){
								__that.data.year = Years.fromName(__that.data.name);
							}
							
							if (__that.data.country == null){                      // cars_car_load.jsxi:164
								{
									var __7 = __that.data.tags;
									
									for (var __6 = 0; __6 < __7.length; __6 ++){
										var tag = __7[__6];
										
										var c = Countries.fromTag(tag);
										
										if (c == null)                             // cars_car_load.jsxi:167
											c = Countries.fromBrand(__that.data.brand);
										
										if (c != null)                             // cars_car_load.jsxi:168
											__that.data.country = c;               // cars_car_load.jsxi:168
									}
									
									__7 = undefined;
								}
							}
							
							if (__that.data.author == null){                       // cars_car_load.jsxi:172
								__that.data.author = Authors.fromId(__that.id);    // cars_car_load.jsxi:173
							}
							
							if (__that.data.parent != null){                       // cars_car_load.jsxi:176
								if (__that.data.parent == __that.id){              // cars_car_load.jsxi:177
									__that.addError('parent-wrong', 'Car cannot be parent to itself');
								} else {
									var par = Cars.byName(__that.data.parent);
									
									if (par == null){                              // cars_car_load.jsxi:181
										__that.addError('parent-missing', 'Parent is missing');
									} else if (par.parent){                        // cars_car_load.jsxi:183
										__that.addError('parent-wrong', 'Parent is child');
									} else {
										__that.parent = par;                       // cars_car_load.jsxi:187
										__that.parent.children.push(this);         // cars_car_load.jsxi:188
										mediator.dispatch('update.car.parent', this);
										mediator.dispatch('update.car.children', __that.parent);
									}
									
									if (!fs.existsSync(__that.upgrade)){           // cars_car_load.jsxi:194
										__that.addError('parent-upgrade-missing', 'Missing upgrade.png');
									}
								}
							}
							
							Cars.registerTags(__that.data.tags);
							Cars.registerClass(__that.data.class);
							Cars.registerBrand(__that.data.brand);
							Cars.registerCountry(__that.data.country);
							Cars.registerAuthor(__that.data.author);
						}
					}
					
					mediator.dispatch('update.car.data', this);                    // cars_car_load.jsxi:208
					
					if (callback)                                                  // cars_car_load.jsxi:209
						callback();                                                // cars_car_load.jsxi:209
				}).bind(this));                                                    // cars_car_load.jsxi:210
		};
		Car.prototype.load = function (callback){                                  // cars_car_load.jsxi:213
			this.clearErrors();
			this.loadBadge();
			this.loadSkins();
			this.loadData(callback);
		};
		Car.prototype.reload = function (callback){                                // cars_car_load.jsxi:220
			this.clearErrors();
			this.loadBadge();
			this.loadSkins();
			this.loadData(callback);
		};
		Car.prototype.loadEnsure = function (callback){                            // cars_car_load.jsxi:230
			var __that = this;
			
			function s1(){                                                         // cars_car_load.jsxi:231
				if (!__that.__Car__badgeLoaded)
					__that.loadBadge(s2);
				else
					s2();                                                          // cars_car_load.jsxi:231
			}
			
			function s2(){                                                         // cars_car_load.jsxi:232
				if (__that.skins == null)
					__that.loadSkins(s3);
				else
					s3();                                                          // cars_car_load.jsxi:232
			}
			
			function s3(){                                                         // cars_car_load.jsxi:233
				if (__that.data == null)
					__that.loadData(callback);
				else if (callback)                                                 // cars_car_load.jsxi:233
					callback();                                                    // cars_car_load.jsxi:233
			}
			
			s1();                                                                  // cars_car_load.jsxi:234
		};
		Car.prototype.testAcd = function (callback){                               // cars_car_load.jsxi:237
			var __that = this;
			
			if (this.data && this.data.author === 'Kunos')                         // cars_car_load.jsxi:238
				return callback();                                                 // cars_car_load.jsxi:238
			
			this.clearErrors('acd');
			AcTools.Utils.DataFixer.TestData(this.path,                            // cars_car_load.jsxi:240
				this.getSpec('weight') || 0, 
				function (arg){                                                    // cars_car_load.jsxi:240
					__that.addError(arg, _messages[arg] || 'Undeclared error: “' + arg + '”');
				}, 
				function (arg){                                                    // cars_car_load.jsxi:242
					if (callback)                                                  // cars_car_load.jsxi:243
						setTimeout(callback);                                      // cars_car_load.jsxi:243
				});
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
			'skinsDir', 
			{
				get: (function (){
					return this.path + '/skins';
				})
			});
		Object.defineProperty(Car.prototype, 
			'displayName', 
			{
				get: (function (){
					return this.data && this.data.name || this.id;                 // cars_car.jsxi:13
				})
			});
		
		function clearStr(str){                                                    // cars_car.jsxi:115
			if (typeof str !== 'string')                                           // cars_car.jsxi:116
				return;
			return str.trim().replace(/\s+/g, ' ');                                // cars_car.jsxi:117
		}
		return Car;
	})();
	
	/* Class "CarSkin" declaration */
	function CarSkin(car, id){                                                     // cars_car_skin.jsxi:2
		this.__CarSkin__car = car;                                                 // cars_car_skin.jsxi:15
		this.id = id;                                                              // cars_car_skin.jsxi:16
	}
	CarSkin.prototype.loadData = function (callback){                              // cars_car_skin.jsxi:19
		var __that = this;
		
		if (!fs.existsSync(this.json)){                                            // cars_car_skin.jsxi:20
			this.data = false;
			
			if (callback)                                                          // cars_car_skin.jsxi:23
				callback();                                                        // cars_car_skin.jsxi:23
			return;
		} else
			this.data = null;
		
		fs.readFile(this.json,                                                     // cars_car_skin.jsxi:28
			(function (err, result){                                               // cars_car_skin.jsxi:28
				if (err){                                                          // cars_car_skin.jsxi:29
					__that.data = false;
					__that.__CarSkin__car.addError('skin-data-access:' + __that.id, 
						'Unavailable skins/' + __that.id + '/ui_skin.json', 
						err,                                                       // cars_car_skin.jsxi:31
						this);                                                     // cars_car_skin.jsxi:31
				} else {
					var dat = parseLoadedData(result.toString()),                  // cars_car_skin.jsxi:33
						err = dat instanceof Error && dat;                         // cars_car_skin.jsxi:34
					
					__that.data = false;
					
					if (err || !dat || dat.skinname == null || dat.drivername == null || dat.country == null || dat.number == null){
						__that.__CarSkin__car.addError('skin-data-damaged:' + __that.id, 
							'Damaged skins/' + __that.id + '/ui_skin.json', 
							err,                                                   // cars_car_skin.jsxi:38
							this);                                                 // cars_car_skin.jsxi:38
					} else {
						__that.data = dat;                                         // cars_car_skin.jsxi:40
					}
				}
				
				if (callback)                                                      // cars_car_skin.jsxi:44
					callback();                                                    // cars_car_skin.jsxi:44
			}).bind(this));                                                        // cars_car_skin.jsxi:45
	};
	CarSkin.prototype.load = function (__callback){                                // cars_car_skin.jsxi:48
		var __that = this, 
			res, res;
		
		var __block_0 = (function (){
			fs.exists(__that.preview,                                              // cars_car_skin.jsxi:49
				function (__result){
					res = __result;                                                // cars_car_skin.jsxi:49
					
					__block_1()
				})
		}).bind(this);
		
		var __block_1 = (function (){
			if (!res){                                                             // cars_car_skin.jsxi:50
				__that.__CarSkin__car.addError('skin-preview-missing',             // cars_car_skin.jsxi:51
					'Some of skin\'s previews are missing',                        // cars_car_skin.jsxi:51
					null, 
					this);                                                         // cars_car_skin.jsxi:51
			}
			
			fs.exists(__that.livery,                                               // cars_car_skin.jsxi:54
				function (__result){
					res = __result;                                                // cars_car_skin.jsxi:54
					
					__block_2()
				})
		}).bind(this);
		
		var __block_2 = (function (){
			if (!res){                                                             // cars_car_skin.jsxi:55
				__that.__CarSkin__car.addError('skin-livery-missing:' + __that.id, 
					'Livery of “' + __that.id + '” skin is missing', 
					null, 
					this);                                                         // cars_car_skin.jsxi:56
			}
			
			__that.loadData(__block_3)
		}).bind(this);
		
		var __block_3 = (function (){
			__callback();
		}).bind(this);
		
		__block_0();
	};
	Object.defineProperty(CarSkin.prototype, 
		'path', 
		{
			get: (function (){
				return this.__CarSkin__car.path + '/skins/' + this.id;             // cars_car_skin.jsxi:6
			})
		});
	Object.defineProperty(CarSkin.prototype, 
		'json', 
		{
			get: (function (){
				return this.__CarSkin__car.path + '/skins/' + this.id + '/ui_skin.json';
			})
		});
	Object.defineProperty(CarSkin.prototype, 
		'livery', 
		{
			get: (function (){
				return this.__CarSkin__car.path + '/skins/' + this.id + '/livery.png';
			})
		});
	Object.defineProperty(CarSkin.prototype, 
		'preview', 
		{
			get: (function (){
				return this.__CarSkin__car.path + '/skins/' + this.id + '/preview.jpg';
			})
		});
	Object.defineProperty(CarSkin.prototype, 
		'displayName', 
		{
			get: (function (){
				return this.data && this.data.skinname || this.id;                 // cars_car_skin.jsxi:12
			})
		});
	
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'list', 
		{
			get: (function (){
				return _list;                                                      // cars.jsxi:32
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'brands', 
		{
			get: (function (){
				return _brands.list;                                               // cars.jsxi:33
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'classes', 
		{
			get: (function (){
				return _classes.list;                                              // cars.jsxi:34
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'tags', 
		{
			get: (function (){
				return _tags.list;                                                 // cars.jsxi:35
			})
		});
	(function (){                                                                  // cars.jsxi:218
		mediator.extend(Cars);                                                     // cars.jsxi:219
	})();
	return Cars;
})();

;

;

;

/* Class "DataStorage" declaration */
var DataStorage = (function (){                                                    // data.jsxi:1
	var DataStorage = function (){}, 
		_storage, _downloads;
	
	DataStorage.getDataDir = function (id){                                        // data.jsxi:4
		return mkdir(_storage + '/' + id);                                         // data.jsxi:5
	};
	DataStorage.getDownloadsDir = function (id){                                   // data.jsxi:8
		return id ? mkdir(_downloads + '/' + id) : _downloads;                     // data.jsxi:9
	};
	
	function mkdir(p){                                                             // data.jsxi:12
		if (!fs.existsSync(p)){                                                    // data.jsxi:13
			fs.mkdirSync(p);                                                       // data.jsxi:14
		}
		return p;                                                                  // data.jsxi:16
	}
	
	(function (){                                                                  // data.jsxi:19
		mkdir(gui.App.dataPath);                                                   // data.jsxi:20
		_storage = mkdir(path.join(gui.App.dataPath, 'Data Storage'));             // data.jsxi:21
		_downloads = mkdir(path.join(gui.App.dataPath, 'Downloads'));              // data.jsxi:22
	})();
	return DataStorage;
})();

/* Class "Data" declaration */
var Data = (function (){                                                           // data.jsxi:26
	var Data = function (){}, 
		mediator = new Mediator(),                                                 // data.jsxi:27
		_dataDir = DataStorage.getDataDir('Details'),                              // data.jsxi:29
		_userBadgesDir = DataStorage.getDataDir('Badges (User)'),                  // data.jsxi:30
		_builtInVersion = 6;                                                       // data.jsxi:32
	
	function init(){}
	
	(function (){                                                                  // data.jsxi:38
		$(init);                                                                   // data.jsxi:39
		mediator.extend(Data);                                                     // data.jsxi:40
	})();
	return Data;
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
		create('authors');                                                         // datalists.jsxi:18
		create('countries');                                                       // datalists.jsxi:19
		Cars.on('new.tag', add.bind(null, 'tags')).on('new.brand', add.bind(null, 'brands')).on('new.class', add.bind(null, 'classes')).on('new.author', add.bind(null, 'authors')).on('new.country', add.bind(null, 'countries'));
	})();
	return Datalists;
})();

/* Class "Authors" declaration */
function Authors(){}
Authors.fromId = function (id){                                                    // data_authors.jsxi:2
	switch (id.toLowerCase()){                                                     // data_authors.jsxi:4
		case 'abarth500':                                                          // data_authors.jsxi:5
			
		case 'abarth500_s1':                                                       // data_authors.jsxi:6
			
		case 'alfa_romeo_giulietta_qv':                                            // data_authors.jsxi:7
			
		case 'alfa_romeo_giulietta_qv_le':                                         // data_authors.jsxi:8
			
		case 'bmw_1m':                                                             // data_authors.jsxi:9
			
		case 'bmw_1m_s3':                                                          // data_authors.jsxi:10
			
		case 'bmw_m3_e30':                                                         // data_authors.jsxi:11
			
		case 'bmw_m3_e30_s1':                                                      // data_authors.jsxi:12
			
		case 'bmw_m3_e30_drift':                                                   // data_authors.jsxi:13
			
		case 'bmw_m3_e30_dtm':                                                     // data_authors.jsxi:14
			
		case 'bmw_m3_e30_gra':                                                     // data_authors.jsxi:15
			
		case 'bmw_m3_e92':                                                         // data_authors.jsxi:16
			
		case 'bmw_m3_e92_s1':                                                      // data_authors.jsxi:17
			
		case 'bmw_m3_e92_drift':                                                   // data_authors.jsxi:18
			
		case 'bmw_m3_gt2':                                                         // data_authors.jsxi:19
			
		case 'bmw_z4':                                                             // data_authors.jsxi:20
			
		case 'bmw_z4_s1':                                                          // data_authors.jsxi:21
			
		case 'bmw_z4_drift':                                                       // data_authors.jsxi:22
			
		case 'bmw_z4_gt3':                                                         // data_authors.jsxi:23
			
		case 'ferrari_312t':                                                       // data_authors.jsxi:24
			
		case 'ferrari_458':                                                        // data_authors.jsxi:25
			
		case 'ferrari_458_gt2':                                                    // data_authors.jsxi:26
			
		case 'ferrari_458_s3':                                                     // data_authors.jsxi:27
			
		case 'ferrari_599xxevo':                                                   // data_authors.jsxi:28
			
		case 'ferrari_f40':                                                        // data_authors.jsxi:29
			
		case 'ferrari_f40_s3':                                                     // data_authors.jsxi:30
			
		case 'ferrari_laferrari':                                                  // data_authors.jsxi:31
			
		case 'ks_alfa_romeo_155_v6':                                               // data_authors.jsxi:32
			
		case 'ks_alfa_romeo_4c':                                                   // data_authors.jsxi:33
			
		case 'ks_alfa_romeo_gta':                                                  // data_authors.jsxi:34
			
		case 'ks_bmw_m235i_racing':                                                // data_authors.jsxi:35
			
		case 'ks_corvette_c7r':                                                    // data_authors.jsxi:36
			
		case 'ks_mclaren_f1_gtr':                                                  // data_authors.jsxi:37
			
		case 'ks_mclaren_p1':                                                      // data_authors.jsxi:38
			
		case 'ks_mercedes_190_evo2':                                               // data_authors.jsxi:39
			
		case 'ks_mercedes_c9':                                                     // data_authors.jsxi:40
			
		case 'ks_nissan_gtr_gt3':                                                  // data_authors.jsxi:41
			
		case 'ktm_xbow_r':                                                         // data_authors.jsxi:42
			
		case 'lotus_2_eleven':                                                     // data_authors.jsxi:43
			
		case 'lotus_2_eleven_gt4':                                                 // data_authors.jsxi:44
			
		case 'lotus_49':                                                           // data_authors.jsxi:45
			
		case 'lotus_98t':                                                          // data_authors.jsxi:46
			
		case 'lotus_elise_sc':                                                     // data_authors.jsxi:47
			
		case 'lotus_elise_sc_s1':                                                  // data_authors.jsxi:48
			
		case 'lotus_elise_sc_s2':                                                  // data_authors.jsxi:49
			
		case 'lotus_evora_gtc':                                                    // data_authors.jsxi:50
			
		case 'lotus_evora_gte':                                                    // data_authors.jsxi:51
			
		case 'lotus_evora_gte_carbon':                                             // data_authors.jsxi:52
			
		case 'lotus_evora_gx':                                                     // data_authors.jsxi:53
			
		case 'lotus_evora_s':                                                      // data_authors.jsxi:54
			
		case 'lotus_evora_s_s2':                                                   // data_authors.jsxi:55
			
		case 'lotus_exige_240':                                                    // data_authors.jsxi:56
			
		case 'lotus_exige_240_s3':                                                 // data_authors.jsxi:57
			
		case 'lotus_exige_s':                                                      // data_authors.jsxi:58
			
		case 'lotus_exige_s_roadster':                                             // data_authors.jsxi:59
			
		case 'lotus_exige_scura':                                                  // data_authors.jsxi:60
			
		case 'lotus_exige_v6_cup':                                                 // data_authors.jsxi:61
			
		case 'lotus_exos_125':                                                     // data_authors.jsxi:62
			
		case 'lotus_exos_125_s1':                                                  // data_authors.jsxi:63
			
		case 'mclaren_mp412c':                                                     // data_authors.jsxi:64
			
		case 'mclaren_mp412c_gt3':                                                 // data_authors.jsxi:65
			
		case 'mercedes_sls':                                                       // data_authors.jsxi:66
			
		case 'mercedes_sls_gt3':                                                   // data_authors.jsxi:67
			
		case 'p4-5_2011':                                                          // data_authors.jsxi:68
			
		case 'pagani_huayra':                                                      // data_authors.jsxi:69
			
		case 'pagani_zonda_r':                                                     // data_authors.jsxi:70
			
		case 'ruf_yellowbird':                                                     // data_authors.jsxi:71
			
		case 'shelby_cobra_427sc':                                                 // data_authors.jsxi:72
			
		case 'tatuusfa1':                                                          // data_authors.jsxi:73
			return 'Kunos';                                                        // data_authors.jsxi:74
		default:
			return null;
	}
};

/* Class "Brands" declaration */
var Brands = (function (){                                                         // data_brands.jsxi:1
	var Brands = function (){}, 
		_list = [],                                                                // data_brands.jsxi:11
		_listLower,                                                                // data_brands.jsxi:12
		_sorted = true,                                                            // data_brands.jsxi:13
		_newBadgesDir = DataStorage.getDataDir('Badges'),                          // data_brands.jsxi:26
		_userBadgesDir = DataStorage.getDataDir('Badges (User)'),                  // data_brands.jsxi:27
		_newBadges = {},                                                           // data_brands.jsxi:29
		_userBadges = {};                                                          // data_brands.jsxi:29
	
	Brands.add = function (brand){                                                 // data_brands.jsxi:15
		var lower = brand.toLowerCase();
		
		if (_listLower.indexOf(lower) === - 1){                                    // data_brands.jsxi:17
			Brands.list.push(brand);                                               // data_brands.jsxi:18
			Brands.list.sort();                                                    // data_brands.jsxi:19
			_listLower.push(lower);                                                // data_brands.jsxi:21
			_sorted = false;                                                       // data_brands.jsxi:22
		}
	};
	Brands.getBadge = function (brand){                                            // data_brands.jsxi:51
		return _userBadges.hasOwnProperty(brand) ? _userBadges[brand] : _newBadges.hasOwnProperty(brand) ? _newBadges[brand] : null;
	};
	Brands.nameContains = function (name, brand){                                  // data_brands.jsxi:57
		return brand == null ? _list.some(function (arg){                          // data_brands.jsxi:58
			return name.indexOf(Brands.toNamePart(arg) + ' ') === 0;               // data_brands.jsxi:58
		}) : name.indexOf(Brands.toNamePart(brand) + ' ') === 0;                   // data_brands.jsxi:59
	};
	Brands.fromName = function (name){                                             // data_brands.jsxi:62
		for (var __d = 0; __d < _list.length; __d ++){                             // data_brands.jsxi:63
			var b = _list[__d];
			
			if (name.indexOf(Brands.toNamePart(b) + ' ') === 0){                   // data_brands.jsxi:64
				return b;                                                          // data_brands.jsxi:65
			}
		}
		return null;
	};
	Brands.fromNamePart = function (brand){                                        // data_brands.jsxi:72
		switch (brand){                                                            // data_brands.jsxi:73
			case 'Mercedes':                                                       // data_brands.jsxi:74
				return 'Mercedes-Benz';                                            // data_brands.jsxi:75
			default:
				return brand;                                                      // data_brands.jsxi:78
		}
	};
	Brands.toNamePart = function (brand){                                          // data_brands.jsxi:82
		switch (brand){                                                            // data_brands.jsxi:83
			case 'Mercedes-Benz':                                                  // data_brands.jsxi:84
				return 'Mercedes';                                                 // data_brands.jsxi:85
			default:
				return brand;                                                      // data_brands.jsxi:88
		}
	};
	Object.defineProperty(Brands,                                                  // data_brands.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_sorted){                                                     // data_brands.jsxi:3
					_list.sort();                                                  // data_brands.jsxi:4
					_sorted = true;                                                // data_brands.jsxi:5
				}
				return _list;                                                      // data_brands.jsxi:8
			})
		});
	(function (){                                                                  // data_brands.jsxi:31
		_listLower = Brands.list.map(function (arg){                               // data_brands.jsxi:32
			return arg.toLowerCase();                                              // data_brands.jsxi:32
		});
		
		{
			var __9 = fs.readdirSync(_newBadgesDir);
			
			for (var __8 = 0; __8 < __9.length; __8 ++){
				var arg = __9[__8];
				
				var brand = arg.split('.')[0];
				
				Brands.add(brand);
				_newBadges[brand] = _newBadgesDir + '/' + arg;                     // data_brands.jsxi:37
			}
			
			__9 = undefined;
		}
		
		{
			var __b = fs.readdirSync(_userBadgesDir);
			
			for (var __a = 0; __a < __b.length; __a ++){
				var arg = __b[__a];
				
				var brand = arg.split('.')[0];
				
				Brands.add(brand);
				_userBadges[brand] = _userBadgesDir + '/' + arg;                   // data_brands.jsxi:43
			}
			
			__b = undefined;
		}
		
		$(function (arg){                                                          // data_brands.jsxi:46
			for (var __c = 0; __c < _list.length; __c ++){                         // data_brands.jsxi:47
				var b = _list[__c];
				
				Cars.registerBrand(b);                                             // data_brands.jsxi:47
			}
		});
	})();
	return Brands;
})();

/* Class "Countries" declaration */
function Countries(){}
Countries.fromBrand = function (brand){                                            // data_countries.jsxi:2
	switch (brand = brand.trim().toLowerCase()){                                   // data_countries.jsxi:3
		case 'abarth':                                                             // data_countries.jsxi:4
			return 'Italy';                                                        // data_countries.jsxi:4
		case 'alfa':                                                               // data_countries.jsxi:5
			return 'Italy';                                                        // data_countries.jsxi:5
		case 'alfa romeo':                                                         // data_countries.jsxi:6
			return 'Italy';                                                        // data_countries.jsxi:6
		case 'alpine':                                                             // data_countries.jsxi:7
			return 'France';                                                       // data_countries.jsxi:7
		case 'amc':                                                                // data_countries.jsxi:8
			return 'USA';                                                          // data_countries.jsxi:8
		case 'aston':                                                              // data_countries.jsxi:9
			return 'Great Britain';                                                // data_countries.jsxi:9
		case 'aston martin':                                                       // data_countries.jsxi:10
			return 'Great Britain';                                                // data_countries.jsxi:10
		case 'audi':                                                               // data_countries.jsxi:11
			return 'Germany';                                                      // data_countries.jsxi:11
		case 'bentley':                                                            // data_countries.jsxi:12
			return 'Great Britain';                                                // data_countries.jsxi:12
		case 'bmw':                                                                // data_countries.jsxi:13
			return 'Germany';                                                      // data_countries.jsxi:13
		case 'bugatti':                                                            // data_countries.jsxi:14
			return 'France';                                                       // data_countries.jsxi:14
		case 'buick':                                                              // data_countries.jsxi:15
			return 'USA';                                                          // data_countries.jsxi:15
		case 'cadillac':                                                           // data_countries.jsxi:16
			return 'USA';                                                          // data_countries.jsxi:16
		case 'chevrolet':                                                          // data_countries.jsxi:17
			return 'USA';                                                          // data_countries.jsxi:17
		case 'datsun':                                                             // data_countries.jsxi:18
			return 'Japan';                                                        // data_countries.jsxi:18
		case 'dodge':                                                              // data_countries.jsxi:19
			return 'USA';                                                          // data_countries.jsxi:19
		case 'ferrari':                                                            // data_countries.jsxi:20
			return 'Italy';                                                        // data_countries.jsxi:20
		case 'fiat':                                                               // data_countries.jsxi:21
			return 'Italy';                                                        // data_countries.jsxi:21
		case 'ford':                                                               // data_countries.jsxi:22
			return 'USA';                                                          // data_countries.jsxi:22
		case 'gemballa':                                                           // data_countries.jsxi:23
			return 'Germany';                                                      // data_countries.jsxi:23
		case 'ginetta':                                                            // data_countries.jsxi:24
			return 'Great Britain';                                                // data_countries.jsxi:24
		case 'gmc':                                                                // data_countries.jsxi:25
			return 'USA';                                                          // data_countries.jsxi:25
		case 'gumpert':                                                            // data_countries.jsxi:26
			return 'Germany';                                                      // data_countries.jsxi:26
		case 'hamann':                                                             // data_countries.jsxi:27
			return 'Germany';                                                      // data_countries.jsxi:27
		case 'holden':                                                             // data_countries.jsxi:28
			return 'Australia';                                                    // data_countries.jsxi:28
		case 'honda':                                                              // data_countries.jsxi:29
			return 'Japan';                                                        // data_countries.jsxi:29
		case 'hyundai':                                                            // data_countries.jsxi:30
			return 'Korea';                                                        // data_countries.jsxi:30
		case 'infiniti':                                                           // data_countries.jsxi:31
			return 'Japan';                                                        // data_countries.jsxi:31
		case 'jaguar':                                                             // data_countries.jsxi:32
			return 'Great Britain';                                                // data_countries.jsxi:32
		case 'kia':                                                                // data_countries.jsxi:33
			return 'Korea';                                                        // data_countries.jsxi:33
		case 'koenigsegg':                                                         // data_countries.jsxi:34
			return 'Sweden';                                                       // data_countries.jsxi:34
		case 'ktm':                                                                // data_countries.jsxi:35
			return 'Austria';                                                      // data_countries.jsxi:35
		case 'lada':                                                               // data_countries.jsxi:36
			return 'Russia';                                                       // data_countries.jsxi:36
		case 'lamborghini':                                                        // data_countries.jsxi:37
			return 'Italy';                                                        // data_countries.jsxi:37
		case 'lancia':                                                             // data_countries.jsxi:38
			return 'Italy';                                                        // data_countries.jsxi:38
		case 'lexus':                                                              // data_countries.jsxi:39
			return 'Japan';                                                        // data_countries.jsxi:39
		case 'lotus':                                                              // data_countries.jsxi:40
			return 'Great Britain';                                                // data_countries.jsxi:40
		case 'maserati':                                                           // data_countries.jsxi:41
			return 'Italy';                                                        // data_countries.jsxi:41
		case 'mazda':                                                              // data_countries.jsxi:42
			return 'Japan';                                                        // data_countries.jsxi:42
		case 'mclaren':                                                            // data_countries.jsxi:43
			return 'Great Britain';                                                // data_countries.jsxi:43
		case 'mercedes':                                                           // data_countries.jsxi:44
			return 'Germany';                                                      // data_countries.jsxi:44
		case 'mercedes-benz':                                                      // data_countries.jsxi:45
			return 'Germany';                                                      // data_countries.jsxi:45
		case 'mg':                                                                 // data_countries.jsxi:46
			return 'Great Britain';                                                // data_countries.jsxi:46
		case 'mini':                                                               // data_countries.jsxi:47
			return 'Great Britain';                                                // data_countries.jsxi:47
		case 'mitsubishi':                                                         // data_countries.jsxi:48
			return 'Japan';                                                        // data_countries.jsxi:48
		case 'nissan':                                                             // data_countries.jsxi:49
			return 'Japan';                                                        // data_countries.jsxi:49
		case 'noble':                                                              // data_countries.jsxi:50
			return 'Great Britain';                                                // data_countries.jsxi:50
		case 'opel':                                                               // data_countries.jsxi:51
			return 'Germany';                                                      // data_countries.jsxi:51
		case 'oreca':                                                              // data_countries.jsxi:52
			return 'France';                                                       // data_countries.jsxi:52
		case 'pagani':                                                             // data_countries.jsxi:53
			return 'Italy';                                                        // data_countries.jsxi:53
		case 'detomaso':                                                           // data_countries.jsxi:54
			return 'Italy';                                                        // data_countries.jsxi:54
		case 'de tomaso':                                                          // data_countries.jsxi:55
			return 'Italy';                                                        // data_countries.jsxi:55
		case 'plymouth':                                                           // data_countries.jsxi:56
			return 'USA';                                                          // data_countries.jsxi:56
		case 'pontiac':                                                            // data_countries.jsxi:57
			return 'USA';                                                          // data_countries.jsxi:57
		case 'porsche':                                                            // data_countries.jsxi:58
			return 'Germany';                                                      // data_countries.jsxi:58
		case 'radical':                                                            // data_countries.jsxi:59
			return 'Great Britain';                                                // data_countries.jsxi:59
		case 'reliant':                                                            // data_countries.jsxi:60
			return 'Great Britain';                                                // data_countries.jsxi:60
		case 'renault':                                                            // data_countries.jsxi:61
			return 'France';                                                       // data_countries.jsxi:61
		case 'rover':                                                              // data_countries.jsxi:62
			return 'Great Britain';                                                // data_countries.jsxi:62
		case 'ruf':                                                                // data_countries.jsxi:63
			return 'Germany';                                                      // data_countries.jsxi:63
		case 'saleen':                                                             // data_countries.jsxi:64
			return 'USA';                                                          // data_countries.jsxi:64
		case 'sareni':                                                             // data_countries.jsxi:65
			return 'USA';                                                          // data_countries.jsxi:65
		case 'scuderia glickenhaus':                                               // data_countries.jsxi:66
			return 'Italy';                                                        // data_countries.jsxi:66
		case 'seat':                                                               // data_countries.jsxi:67
			return 'Spain';                                                        // data_countries.jsxi:67
		case 'shelby':                                                             // data_countries.jsxi:68
			return 'USA';                                                          // data_countries.jsxi:68
		case 'subaru':                                                             // data_countries.jsxi:69
			return 'Japan';                                                        // data_countries.jsxi:69
		case 'suzuki':                                                             // data_countries.jsxi:70
			return 'Japan';                                                        // data_countries.jsxi:70
		case 'tatuus':                                                             // data_countries.jsxi:71
			return 'Italy';                                                        // data_countries.jsxi:71
		case 'tesla':                                                              // data_countries.jsxi:72
			return 'USA';                                                          // data_countries.jsxi:72
		case 'toyota':                                                             // data_countries.jsxi:73
			return 'Japan';                                                        // data_countries.jsxi:73
		case 'volkswagen':                                                         // data_countries.jsxi:74
			return 'Germany';                                                      // data_countries.jsxi:74
		case 'volvo':                                                              // data_countries.jsxi:75
			return 'Sweden';                                                       // data_countries.jsxi:75
		default:
			return null;
	}
};
Countries.fromTag = function (tag){                                                // data_countries.jsxi:80
	switch (tag = tag.trim().toLowerCase()){                                       // data_countries.jsxi:81
		case 'afghanistan':                                                        // data_countries.jsxi:82
			
		case 'albania':                                                            // data_countries.jsxi:83
			
		case 'algeria':                                                            // data_countries.jsxi:84
			
		case 'andorra':                                                            // data_countries.jsxi:85
			
		case 'angola':                                                             // data_countries.jsxi:86
			
		case 'argentina':                                                          // data_countries.jsxi:87
			
		case 'armenia':                                                            // data_countries.jsxi:88
			
		case 'aruba':                                                              // data_countries.jsxi:89
			
		case 'australia':                                                          // data_countries.jsxi:90
			
		case 'austria':                                                            // data_countries.jsxi:91
			
		case 'azerbaijan':                                                         // data_countries.jsxi:92
			
		case 'bahamas':                                                            // data_countries.jsxi:93
			
		case 'bahrain':                                                            // data_countries.jsxi:94
			
		case 'bangladesh':                                                         // data_countries.jsxi:95
			
		case 'barbados':                                                           // data_countries.jsxi:96
			
		case 'belarus':                                                            // data_countries.jsxi:97
			
		case 'belgium':                                                            // data_countries.jsxi:98
			
		case 'belize':                                                             // data_countries.jsxi:99
			
		case 'benin':                                                              // data_countries.jsxi:100
			
		case 'bhutan':                                                             // data_countries.jsxi:101
			
		case 'bolivia':                                                            // data_countries.jsxi:102
			
		case 'botswana':                                                           // data_countries.jsxi:103
			
		case 'brazil':                                                             // data_countries.jsxi:104
			
		case 'brunei':                                                             // data_countries.jsxi:105
			
		case 'bulgaria':                                                           // data_countries.jsxi:106
			
		case 'burma':                                                              // data_countries.jsxi:107
			
		case 'burundi':                                                            // data_countries.jsxi:108
			
		case 'cambodia':                                                           // data_countries.jsxi:109
			
		case 'cameroon':                                                           // data_countries.jsxi:110
			
		case 'canada':                                                             // data_countries.jsxi:111
			
		case 'chad':                                                               // data_countries.jsxi:112
			
		case 'chile':                                                              // data_countries.jsxi:113
			
		case 'china':                                                              // data_countries.jsxi:114
			
		case 'colombia':                                                           // data_countries.jsxi:115
			
		case 'comoros':                                                            // data_countries.jsxi:116
			
		case 'congo':                                                              // data_countries.jsxi:117
			
		case 'croatia':                                                            // data_countries.jsxi:118
			
		case 'cuba':                                                               // data_countries.jsxi:119
			
		case 'curacao':                                                            // data_countries.jsxi:120
			
		case 'cyprus':                                                             // data_countries.jsxi:121
			
		case 'denmark':                                                            // data_countries.jsxi:122
			
		case 'djibouti':                                                           // data_countries.jsxi:123
			
		case 'dominica':                                                           // data_countries.jsxi:124
			
		case 'ecuador':                                                            // data_countries.jsxi:125
			
		case 'egypt':                                                              // data_countries.jsxi:126
			
		case 'eritrea':                                                            // data_countries.jsxi:127
			
		case 'estonia':                                                            // data_countries.jsxi:128
			
		case 'ethiopia':                                                           // data_countries.jsxi:129
			
		case 'fiji':                                                               // data_countries.jsxi:130
			
		case 'finland':                                                            // data_countries.jsxi:131
			
		case 'france':                                                             // data_countries.jsxi:132
			
		case 'gabon':                                                              // data_countries.jsxi:133
			
		case 'gambia':                                                             // data_countries.jsxi:134
			
		case 'georgia':                                                            // data_countries.jsxi:135
			
		case 'germany':                                                            // data_countries.jsxi:136
			
		case 'ghana':                                                              // data_countries.jsxi:137
			
		case 'greece':                                                             // data_countries.jsxi:138
			
		case 'grenada':                                                            // data_countries.jsxi:139
			
		case 'guatemala':                                                          // data_countries.jsxi:140
			
		case 'guinea':                                                             // data_countries.jsxi:141
			
		case 'guinea-bissau':                                                      // data_countries.jsxi:142
			
		case 'guyana':                                                             // data_countries.jsxi:143
			
		case 'haiti':                                                              // data_countries.jsxi:144
			
		case 'holy see':                                                           // data_countries.jsxi:145
			
		case 'honduras':                                                           // data_countries.jsxi:146
			
		case 'hong kong':                                                          // data_countries.jsxi:147
			
		case 'hungary':                                                            // data_countries.jsxi:148
			
		case 'iceland':                                                            // data_countries.jsxi:149
			
		case 'india':                                                              // data_countries.jsxi:150
			
		case 'indonesia':                                                          // data_countries.jsxi:151
			
		case 'iran':                                                               // data_countries.jsxi:152
			
		case 'iraq':                                                               // data_countries.jsxi:153
			
		case 'ireland':                                                            // data_countries.jsxi:154
			
		case 'israel':                                                             // data_countries.jsxi:155
			
		case 'italy':                                                              // data_countries.jsxi:156
			
		case 'jamaica':                                                            // data_countries.jsxi:157
			
		case 'japan':                                                              // data_countries.jsxi:158
			
		case 'jordan':                                                             // data_countries.jsxi:159
			
		case 'kazakhstan':                                                         // data_countries.jsxi:160
			
		case 'kenya':                                                              // data_countries.jsxi:161
			
		case 'kiribati':                                                           // data_countries.jsxi:162
			
		case 'kosovo':                                                             // data_countries.jsxi:163
			
		case 'kuwait':                                                             // data_countries.jsxi:164
			
		case 'kyrgyzstan':                                                         // data_countries.jsxi:165
			
		case 'laos':                                                               // data_countries.jsxi:166
			
		case 'latvia':                                                             // data_countries.jsxi:167
			
		case 'lebanon':                                                            // data_countries.jsxi:168
			
		case 'lesotho':                                                            // data_countries.jsxi:169
			
		case 'liberia':                                                            // data_countries.jsxi:170
			
		case 'libya':                                                              // data_countries.jsxi:171
			
		case 'liechtenstein':                                                      // data_countries.jsxi:172
			
		case 'lithuania':                                                          // data_countries.jsxi:173
			
		case 'luxembourg':                                                         // data_countries.jsxi:174
			
		case 'macau':                                                              // data_countries.jsxi:175
			
		case 'macedonia':                                                          // data_countries.jsxi:176
			
		case 'madagascar':                                                         // data_countries.jsxi:177
			
		case 'malawi':                                                             // data_countries.jsxi:178
			
		case 'malaysia':                                                           // data_countries.jsxi:179
			
		case 'maldives':                                                           // data_countries.jsxi:180
			
		case 'mali':                                                               // data_countries.jsxi:181
			
		case 'malta':                                                              // data_countries.jsxi:182
			
		case 'mauritania':                                                         // data_countries.jsxi:183
			
		case 'mauritius':                                                          // data_countries.jsxi:184
			
		case 'mexico':                                                             // data_countries.jsxi:185
			
		case 'micronesia':                                                         // data_countries.jsxi:186
			
		case 'moldova':                                                            // data_countries.jsxi:187
			
		case 'monaco':                                                             // data_countries.jsxi:188
			
		case 'mongolia':                                                           // data_countries.jsxi:189
			
		case 'montenegro':                                                         // data_countries.jsxi:190
			
		case 'morocco':                                                            // data_countries.jsxi:191
			
		case 'mozambique':                                                         // data_countries.jsxi:192
			
		case 'namibia':                                                            // data_countries.jsxi:193
			
		case 'nauru':                                                              // data_countries.jsxi:194
			
		case 'nepal':                                                              // data_countries.jsxi:195
			
		case 'netherlands':                                                        // data_countries.jsxi:196
			
		case 'nicaragua':                                                          // data_countries.jsxi:197
			
		case 'niger':                                                              // data_countries.jsxi:198
			
		case 'nigeria':                                                            // data_countries.jsxi:199
			
		case 'norway':                                                             // data_countries.jsxi:200
			
		case 'oman':                                                               // data_countries.jsxi:201
			
		case 'pakistan':                                                           // data_countries.jsxi:202
			
		case 'palau':                                                              // data_countries.jsxi:203
			
		case 'panama':                                                             // data_countries.jsxi:204
			
		case 'paraguay':                                                           // data_countries.jsxi:205
			
		case 'peru':                                                               // data_countries.jsxi:206
			
		case 'philippines':                                                        // data_countries.jsxi:207
			
		case 'poland':                                                             // data_countries.jsxi:208
			
		case 'portugal':                                                           // data_countries.jsxi:209
			
		case 'qatar':                                                              // data_countries.jsxi:210
			
		case 'romania':                                                            // data_countries.jsxi:211
			
		case 'russia':                                                             // data_countries.jsxi:212
			
		case 'rwanda':                                                             // data_countries.jsxi:213
			
		case 'samoa':                                                              // data_countries.jsxi:214
			
		case 'senegal':                                                            // data_countries.jsxi:215
			
		case 'serbia':                                                             // data_countries.jsxi:216
			
		case 'seychelles':                                                         // data_countries.jsxi:217
			
		case 'singapore':                                                          // data_countries.jsxi:218
			
		case 'slovakia':                                                           // data_countries.jsxi:219
			
		case 'slovenia':                                                           // data_countries.jsxi:220
			
		case 'somalia':                                                            // data_countries.jsxi:221
			
		case 'spain':                                                              // data_countries.jsxi:222
			
		case 'sudan':                                                              // data_countries.jsxi:223
			
		case 'suriname':                                                           // data_countries.jsxi:224
			
		case 'swaziland':                                                          // data_countries.jsxi:225
			
		case 'switzerland':                                                        // data_countries.jsxi:226
			
		case 'syria':                                                              // data_countries.jsxi:227
			
		case 'taiwan':                                                             // data_countries.jsxi:228
			
		case 'tajikistan':                                                         // data_countries.jsxi:229
			
		case 'tanzania':                                                           // data_countries.jsxi:230
			
		case 'thailand':                                                           // data_countries.jsxi:231
			
		case 'timor-leste':                                                        // data_countries.jsxi:232
			
		case 'togo':                                                               // data_countries.jsxi:233
			
		case 'tonga':                                                              // data_countries.jsxi:234
			
		case 'tunisia':                                                            // data_countries.jsxi:235
			
		case 'turkey':                                                             // data_countries.jsxi:236
			
		case 'turkmenistan':                                                       // data_countries.jsxi:237
			
		case 'tuvalu':                                                             // data_countries.jsxi:238
			
		case 'uganda':                                                             // data_countries.jsxi:239
			
		case 'ukraine':                                                            // data_countries.jsxi:240
			
		case 'uruguay':                                                            // data_countries.jsxi:241
			
		case 'uzbekistan':                                                         // data_countries.jsxi:242
			
		case 'vanuatu':                                                            // data_countries.jsxi:243
			
		case 'venezuela':                                                          // data_countries.jsxi:244
			
		case 'vietnam':                                                            // data_countries.jsxi:245
			
		case 'yemen':                                                              // data_countries.jsxi:246
			
		case 'zambia':                                                             // data_countries.jsxi:247
			
		case 'zimbabwe':                                                           // data_countries.jsxi:248
			return tag[0].toUpperCase() + tag.slice(1);                            // data_countries.jsxi:249
		case 'antigua and barbuda':                                                // data_countries.jsxi:251
			
		case 'bosnia and herzegovina':                                             // data_countries.jsxi:252
			
		case 'burkina faso':                                                       // data_countries.jsxi:253
			
		case 'cape verde':                                                         // data_countries.jsxi:254
			
		case 'central african republic':                                           // data_countries.jsxi:255
			
		case 'costa rica':                                                         // data_countries.jsxi:256
			
		case 'el salvador':                                                        // data_countries.jsxi:257
			
		case 'equatorial guinea':                                                  // data_countries.jsxi:258
			
		case 'marshall islands':                                                   // data_countries.jsxi:259
			
		case 'new zealand':                                                        // data_countries.jsxi:260
			
		case 'san marino':                                                         // data_countries.jsxi:261
			
		case 'saudi arabia':                                                       // data_countries.jsxi:262
			
		case 'sierra leone':                                                       // data_countries.jsxi:263
			
		case 'sint maarten':                                                       // data_countries.jsxi:264
			
		case 'solomon islands':                                                    // data_countries.jsxi:265
			
		case 'south africa':                                                       // data_countries.jsxi:266
			
		case 'south sudan':                                                        // data_countries.jsxi:267
			
		case 'sri lanka':                                                          // data_countries.jsxi:268
			
		case 'trinidad and tobago':                                                // data_countries.jsxi:269
			
		case 'united arab emirates':                                               // data_countries.jsxi:270
			return tag.replace(/\b(?!and)\w/g,                                     // data_countries.jsxi:271
				function (arg){                                                    // data_countries.jsxi:271
					return arg.toUpperCase();                                      // data_countries.jsxi:271
				});
		case 'cote d\'ivoire':                                                     // data_countries.jsxi:273
			
		case 'côte d\'ivoire':                                                     // data_countries.jsxi:274
			
		case 'cote d’ivoire':                                                      // data_countries.jsxi:275
			
		case 'côte d’ivoire':                                                      // data_countries.jsxi:276
			return 'Côte d’Ivoire';                                                // data_countries.jsxi:277
		case 'czech':                                                              // data_countries.jsxi:279
			
		case 'czech republic':                                                     // data_countries.jsxi:280
			return 'Czech Republic';                                               // data_countries.jsxi:281
		case 'gb':                                                                 // data_countries.jsxi:283
			
		case 'uk':                                                                 // data_countries.jsxi:284
			
		case 'united kingdom':                                                     // data_countries.jsxi:285
			
		case 'england':                                                            // data_countries.jsxi:286
			
		case 'britain':                                                            // data_countries.jsxi:287
			
		case 'great britain':                                                      // data_countries.jsxi:288
			return 'Great Britain';                                                // data_countries.jsxi:289
		case 'korea':                                                              // data_countries.jsxi:291
			
		case 'korea, south':                                                       // data_countries.jsxi:292
			
		case 'south korea':                                                        // data_countries.jsxi:293
			return 'Korea';                                                        // data_countries.jsxi:294
		case 'sweden':                                                             // data_countries.jsxi:296
			
		case 'swedish':                                                            // data_countries.jsxi:297
			return 'Sweden';                                                       // data_countries.jsxi:298
		case 'us':                                                                 // data_countries.jsxi:300
			
		case 'usa':                                                                // data_countries.jsxi:301
			
		case 'america':                                                            // data_countries.jsxi:302
			return 'USA';                                                          // data_countries.jsxi:303
		default:
			return null;
	}
};
Countries.fixTag = function (raw){                                                 // data_countries.jsxi:310
	var tag = raw.toLowerCase();
	
	switch (tag){                                                                  // data_countries.jsxi:313
		case 'gb':                                                                 // data_countries.jsxi:314
			
		case 'uk':                                                                 // data_countries.jsxi:315
			
		case 'united kingdom':                                                     // data_countries.jsxi:316
			
		case 'england':                                                            // data_countries.jsxi:317
			
		case 'britain':                                                            // data_countries.jsxi:318
			return 'great britain';                                                // data_countries.jsxi:319
		case 'cote d\'ivoire':                                                     // data_countries.jsxi:321
			
		case 'côte d\'ivoire':                                                     // data_countries.jsxi:322
			
		case 'cote d’ivoire':                                                      // data_countries.jsxi:323
			return 'côte d’ivoire';                                                // data_countries.jsxi:324
		case 'czech':                                                              // data_countries.jsxi:326
			
		case 'czech republic':                                                     // data_countries.jsxi:327
			return 'czech republic';                                               // data_countries.jsxi:328
		case 'korea':                                                              // data_countries.jsxi:330
			
		case 'korea, south':                                                       // data_countries.jsxi:331
			
		case 'south korea':                                                        // data_countries.jsxi:332
			return 'korea';                                                        // data_countries.jsxi:333
		case 'swedish':                                                            // data_countries.jsxi:335
			return 'sweden';                                                       // data_countries.jsxi:336
		case 'us':                                                                 // data_countries.jsxi:338
			
		case 'america':                                                            // data_countries.jsxi:339
			return 'usa';                                                          // data_countries.jsxi:340
		default:
			return raw;                                                            // data_countries.jsxi:343
	}
};

/* Class "Tips" declaration */
var Tips = (function (){                                                           // data_tips.jsxi:1
	var Tips = function (){}, 
		_t = [                                                                     // data_tips.jsxi:2
			"You could use Drag'n'Drop while select new upgrade icon or badge.", 
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
			"Press Esc to abort <b>Auto-update Preview</b>.",                      // data_tips.jsxi:2
			"All manually added badges are located in <a href=\"#\" onclick=\"Shell.openItem(DataStorage.getDataDir('Badges (User)'))\"><i>…\\AppData\\Local\\AcTools Cars Manager\\Data Storage\\Badges (User)</i></a>.", 
			"If you want to use <b>Quick Practive</b>, make sure AcTools Ui Json has access to rename <a href=\"#\" onclick=\"Shell.showItemInFolder(path.join(AcDir.root,'AssettoCorsa.exe'))\"><i>AssettoCorsa.exe</i></a>.\nJust open file properties and edit permissions on the Security tab. Or you can run AcTools Ui Json as Administrator.\nBut it's a terrible way", 
			"<b>Auto-update Preview</b> requires access to <a href=\"#\" onclick=\"Shell.showItemInFolder(path.join(AcDir.root,'content/gui/logo_ac_app.png'))\"><i>content\\\\gui\\\\logo_ac_app.png</i></a>. Don't worry, it'll revert back all changes.", 
			""
		], 
		_i = _t.length * Math.random() | 0;                                        // data_tips.jsxi:4
	
	Object.defineProperty(Tips,                                                    // data_tips.jsxi:1
		'next', 
		{
			get: (function (){
				return _t[++ _i % _t.length];                                      // data_tips.jsxi:5
			})
		});
	return Tips;
})();

/* Class "Years" declaration */
function Years(){}
Years.nameContains = function (name){                                              // data_years.jsxi:2
	return /\s(?:\W?(?:(?:\d\d){1,2})|((?:\d\d){1,2})\W)$/.test(name);             // data_years.jsxi:3
};
Years.fromName = function (name){                                                  // data_years.jsxi:6
	if (/\s(?:\W?((?:\d\d){1,2})|((?:\d\d){1,2})\W)$/.test(name)){                 // data_years.jsxi:7
		var year = + (RegExp.$1 || RegExp.$2);
		
		if (year < 30){                                                            // data_years.jsxi:9
			year = 2e3 + year;                                                     // data_years.jsxi:10
		} else if (year < 1e3){                                                    // data_years.jsxi:11
			year = 1900 + year;                                                    // data_years.jsxi:12
		}
		return year;                                                               // data_years.jsxi:15
	} else {
		return null;
	}
};

/* Class "DragDestination" declaration */
var DragDestination = (function (){                                                // drag_destination.jsxi:1
	var DragDestination = function (){}, 
		_node,                                                                     // drag_destination.jsxi:2
		_registered = [],                                                          // drag_destination.jsxi:4
		_lastId = 0;                                                               // drag_destination.jsxi:5
	
	DragDestination.register = function (text, callback){                          // drag_destination.jsxi:7
		_registered.push({ text: text, callback: callback, id: _lastId });         // drag_destination.jsxi:8
		return _lastId ++;                                                         // drag_destination.jsxi:9
	};
	DragDestination.unregister = function (id){                                    // drag_destination.jsxi:12
		for (var i = 0; i < _registered.length; i ++){                             // drag_destination.jsxi:13
			var entry = _registered[i];
			
			if (entry.id === id){                                                  // drag_destination.jsxi:14
				_registered.splice(i, 1);                                          // drag_destination.jsxi:15
				return;
			}
		}
	};
	(function (){                                                                  // drag_destination.jsxi:21
		_node = document.body.appendChild(document.createElement('div'));          // drag_destination.jsxi:22
		_node.id = 'drop-target';                                                  // drag_destination.jsxi:23
		_node.appendChild(document.createElement('h4'));                           // drag_destination.jsxi:25
		_node.style.display = 'none';                                              // drag_destination.jsxi:26
		_node.ondrop = function (arg){                                             // drag_destination.jsxi:28
			arg.preventDefault();                                                  // drag_destination.jsxi:29
			arg.stopPropagation();                                                 // drag_destination.jsxi:30
			_node.style.display = 'none';                                          // drag_destination.jsxi:32
			
			var entry = _registered[_registered.length - 1];
			
			if (entry){                                                            // drag_destination.jsxi:35
				setTimeout(entry.callback.bind(null,                               // drag_destination.jsxi:36
					Array.prototype.map.call(arg.dataTransfer.files,               // drag_destination.jsxi:36
						function (arg){                                            // drag_destination.jsxi:36
							return arg.path;                                       // drag_destination.jsxi:36
						})));
			}
			return false;
		};
		$(window).on('dragover drop',                                              // drag_destination.jsxi:42
			_node.ondragover = function (arg){                                     // drag_destination.jsxi:43
				arg.preventDefault();                                              // drag_destination.jsxi:44
				
				var entry = _registered[_registered.length - 1];
				
				if (entry){                                                        // drag_destination.jsxi:47
					_node.children[0].textContent = entry.name;                    // drag_destination.jsxi:48
					_node.style.display = null;                                    // drag_destination.jsxi:49
				}
				return false;
			});
		_node.ondragleave = function (arg){                                        // drag_destination.jsxi:55
			arg.preventDefault();                                                  // drag_destination.jsxi:56
			_node.style.display = 'none';                                          // drag_destination.jsxi:57
			return false;
		};
	})();
	return DragDestination;
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
			badgeAutoupdate: true,                                                 // settings.jsxi:11
			aptMode: 'default',                                                    // settings.jsxi:13
			aptShowroom: '',                                                       // settings.jsxi:14
			aptFilter: 'S1-Dynamic',                                               // settings.jsxi:15
			aptResize: true,                                                       // settings.jsxi:16
			aptDisableSweetFx: true,                                               // settings.jsxi:17
			aptCameraX: - 145,                                                     // settings.jsxi:18
			aptCameraY: 36,                                                        // settings.jsxi:19
			aptCameraDistance: 5.5,                                                // settings.jsxi:20
			aptIncreaseDelays: false
		};
	
	function save(){                                                               // settings.jsxi:26
		localStorage.settings = JSON.stringify(_settings);                         // settings.jsxi:27
	}
	
	Settings.get = function (k){                                                   // settings.jsxi:30
		return _settings.hasOwnProperty(k) ? _settings[k] : _defaults[k];          // settings.jsxi:31
	};
	Settings.set = function (k, val){                                              // settings.jsxi:34
		if (typeof k == 'object'){                                                 // settings.jsxi:35
			for (var n in k){                                                      // settings.jsxi:36
				_settings[n] = k[n];                                               // settings.jsxi:37
			}
		} else {
			_settings[k] = val;                                                    // settings.jsxi:40
		}
		
		save();                                                                    // settings.jsxi:43
	};
	Settings.update = function (f){                                                // settings.jsxi:46
		f(_settings);                                                              // settings.jsxi:47
		save();                                                                    // settings.jsxi:48
	};
	Object.defineProperty(Settings,                                                // settings.jsxi:1
		'defaults', 
		{
			get: (function (){
				return _defaults;                                                  // settings.jsxi:24
			})
		});
	(function (){                                                                  // settings.jsxi:51
		_settings = {};                                                            // settings.jsxi:52
		
		try {
			_settings = JSON.parse(localStorage.settings) || {};                   // settings.jsxi:55
		} catch (e){} 
	})();
	return Settings;
})();

/* Class "BadgeEditor" declaration */
var BadgeEditor = (function (){                                                    // badge_editor.jsxi:1
	var BadgeEditor = function (){}, 
		_currentCarId;
	
	function saveFromLibrary(library, file, callback){                             // badge_editor.jsxi:2
		fs.writeFile(file, fs.readFileSync(library), callback);                    // badge_editor.jsxi:3
	}
	
	BadgeEditor.saveFromFile = function (filename, file, callback){                // badge_editor.jsxi:7
		try {
			AcTools.Utils.ImageUtils.ResizeFile(filename, file, 128, 
				128);                                                              // badge_editor.jsxi:9
			
			if (Settings.get('uploadData')){                                       // badge_editor.jsxi:10
				AppServerRequest.sendBinary(_currentCarId, 'badge', fs.readFileSync(file));
			}
			
			callback();                                                            // badge_editor.jsxi:13
		} catch (err){                                                             // badge_editor.jsxi:14
			callback(err);                                                         // badge_editor.jsxi:15
		} 
	};
	BadgeEditor.autoupdate = function (car, force){                                // badge_editor.jsxi:19
		if (!force && !Settings.get('badgeAutoupdate'))                            // badge_editor.jsxi:20
			return;
		
		var image = Brands.getBadge(car.data.brand);
		
		if (image){                                                                // badge_editor.jsxi:23
			saveFromLibrary(image,                                                 // badge_editor.jsxi:24
				car.badge,                                                         // badge_editor.jsxi:24
				function (arg){                                                    // badge_editor.jsxi:24
					return arg || car.updateBadge();                               // badge_editor.jsxi:24
				});
		}
	};
	BadgeEditor.start = function (car, callback){                                  // badge_editor.jsxi:28
		_currentCarId = car.id;                                                    // badge_editor.jsxi:29
		
		function cb(e){                                                            // badge_editor.jsxi:31
			if (e){                                                                // badge_editor.jsxi:32
				ErrorHandler.handled('Cannot save badge icon.', e);                // badge_editor.jsxi:33
			} else {
				car.updateBadge();                                                 // badge_editor.jsxi:35
			}
			
			if (callback)                                                          // badge_editor.jsxi:37
				callback();                                                        // badge_editor.jsxi:37
		}
		
		var logosHtml = '',                                                        // badge_editor.jsxi:40
			carBrand = car.data && car.data.brand,                                 // badge_editor.jsxi:41
			carBrandBadge = carBrand && Brands.getBadge(carBrand);                 // badge_editor.jsxi:42
		
		{
			var __f = Brands.list;
			
			for (var __e = 0; __e < __f.length; __e ++){
				var brand = __f[__e];
				
				var file = Brands.getBadge(brand);
				
				if (file){                                                         // badge_editor.jsxi:45
					logosHtml += '<span class="car-library-element' + (!carBrandBadge && !logosHtml.length || carBrand === brand ? ' selected' : '') + '" data-file="' + file.cssUrl() + '" title="' + brand + '" style=\'display:inline-block;width:64px;height:64px;\
                    background:center url("' + file.cssUrl() + '") no-repeat;background-size:54px\'></span>';
				}
			}
			
			__f = undefined;
		}
		
		var d = new Dialog('Change Badge',                                         // badge_editor.jsxi:52
			[
				'<div style="max-height:70vh;overflow-y:auto;line-height:0">' + logosHtml + '</div>'
			], 
			function (){                                                           // badge_editor.jsxi:54
				saveFromLibrary(this.content.find('.selected').data('file'), car.badge, cb);
			}).addButton('Select File',                                            // badge_editor.jsxi:56
			function (){                                                           // badge_editor.jsxi:56
				var a = document.createElement('input');
				
				a.type = 'file';                                                   // badge_editor.jsxi:58
				a.setAttribute('accept', '.png');                                  // badge_editor.jsxi:59
				a.onchange = function (){                                          // badge_editor.jsxi:60
					if (a.files[0]){                                               // badge_editor.jsxi:61
						BadgeEditor.saveFromFile(a.files[0].path, car.badge, cb);
						d.close();                                                 // badge_editor.jsxi:63
					}
				};
				a.click();                                                         // badge_editor.jsxi:66
				return false;
			}).onEnd(function (arg){                                               // badge_editor.jsxi:68
			DragDestination.unregister(ddId);                                      // badge_editor.jsxi:69
		});
		
		var ddId = DragDestination.register('New Badge',                           // badge_editor.jsxi:72
			function (files){                                                      // badge_editor.jsxi:72
				if (files[0]){                                                     // badge_editor.jsxi:73
					BadgeEditor.saveFromFile(files[0], car.badge, cb);
					d.close();                                                     // badge_editor.jsxi:75
				}
			});
		
		d.el.addClass('dark');                                                     // badge_editor.jsxi:79
		d.content.find('.car-library-element').click(function (){                  // badge_editor.jsxi:80
			$(this.parentNode).find('.selected').removeClass('selected');          // badge_editor.jsxi:81
			this.classList.add('selected');                                        // badge_editor.jsxi:82
		}).dblclick(function (){                                                   // badge_editor.jsxi:83
			d.buttons.find('[data-id="dialog-ok"]')[0].click();                    // badge_editor.jsxi:84
		});
	};
	
	function init(){                                                               // badge_editor.jsxi:88
		Cars.on('update.car.data:brand', BadgeEditor.autoupdate);                  // badge_editor.jsxi:89
	}
	
	(function (){                                                                  // badge_editor.jsxi:93
		$(init);                                                                   // badge_editor.jsxi:94
	})();
	return BadgeEditor;
})();

/* Class "AbstractBatchProcessor" declaration */
function AbstractBatchProcessor(){                                                 // batch_processing.jsxi:1
	if (this.constructor === AbstractBatchProcessor)
		throw new Error('Trying to instantiate abstract class AbstractBatchProcessor');
}
AbstractBatchProcessor.prototype.start = function (){};
AbstractBatchProcessor.prototype.end = function (){};

/* Class "JsBatchProcessor" declaration */
function JsBatchProcessor(fn){                                                     // batch_processing.jsxi:7
	this.__JsBatchProcessor__fn = fn;                                              // batch_processing.jsxi:11
}
__prototypeExtend(JsBatchProcessor, 
	AbstractBatchProcessor);
JsBatchProcessor.prototype.process = function (car, callback){                     // batch_processing.jsxi:14
	try {
		this.__JsBatchProcessor__fn(car);
	} catch (err){                                                                 // batch_processing.jsxi:17
		callback(err);                                                             // batch_processing.jsxi:18
		return;
	} 
	
	callback();                                                                    // batch_processing.jsxi:22
};

/* Class "ExportDbProcessor" declaration */
function ExportDbProcessor(){}
__prototypeExtend(ExportDbProcessor, 
	AbstractBatchProcessor);
ExportDbProcessor.prototype.start = function (){                                   // batch_processing.jsxi:32
	this.__ExportDbProcessor_data = {};
};
ExportDbProcessor.prototype.end = function (){                                     // batch_processing.jsxi:36
	fs.writeFileSync(gui.App.dataPath + '/exported-data.json',                     // batch_processing.jsxi:37
		JSON.stringify(this.__ExportDbProcessor_data));                            // batch_processing.jsxi:37
};
ExportDbProcessor.prototype.process = function (car, callback){                    // batch_processing.jsxi:40
	this.__ExportDbProcessor_data[car.id] = car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'];
	callback();                                                                    // batch_processing.jsxi:42
};

/* Class "BatchProcessing" declaration */
var BatchProcessing = (function (){                                                // batch_processing.jsxi:46
	var BatchProcessing = function (){}, 
		mediator = new Mediator(),                                                 // batch_processing.jsxi:47
		_procs;                                                                    // batch_processing.jsxi:49
	
	BatchProcessing.process = function (cars, processor){                          // batch_processing.jsxi:51
		AppServerRequest.sendDataDisabled = true;                                  // batch_processing.jsxi:52
		
		var abort = false;
		
		var d = new Dialog('Batch Processing',                                     // batch_processing.jsxi:56
			[ '<progress></progress>' ], 
			function (){                                                           // batch_processing.jsxi:56
				AppServerRequest.sendDataDisabled = false;                         // batch_processing.jsxi:57
				abort = true;                                                      // batch_processing.jsxi:58
			}, 
			false);
		
		var progress = d.find('progress');
		
		progress[0].max = cars.length;                                             // batch_processing.jsxi:62
		
		var i = 0, k = 0;
		
		function next(){                                                           // batch_processing.jsxi:65
			if (abort)                                                             // batch_processing.jsxi:66
				return;
			
			if (cars[i]){                                                          // batch_processing.jsxi:68
				var j = i ++;
				
				progress[0].value = j;                                             // batch_processing.jsxi:70
				processor.process(cars[j], nextDelayed);                           // batch_processing.jsxi:71
			} else {
				AppServerRequest.sendDataDisabled = false;                         // batch_processing.jsxi:73
				d.close();                                                         // batch_processing.jsxi:74
				processor.end();                                                   // batch_processing.jsxi:75
				mediator.dispatch('end', processor);                               // batch_processing.jsxi:76
			}
		}
		
		function nextDelayed(){                                                    // batch_processing.jsxi:80
			if (++ k < 10){                                                        // batch_processing.jsxi:81
				next();                                                            // batch_processing.jsxi:82
			} else {
				setTimeout(next);                                                  // batch_processing.jsxi:84
				k = 0;                                                             // batch_processing.jsxi:85
			}
		}
		
		mediator.dispatch('start', processor);                                     // batch_processing.jsxi:89
		processor.start();                                                         // batch_processing.jsxi:90
		next();                                                                    // batch_processing.jsxi:91
	};
	BatchProcessing.add = function (name, proc){                                   // batch_processing.jsxi:94
		if (!_procs)                                                               // batch_processing.jsxi:95
			_procs = [];                                                           // batch_processing.jsxi:95
		
		_procs.push({ name: name, proc: proc });                                   // batch_processing.jsxi:96
	};
	BatchProcessing.select = function (cars){                                      // batch_processing.jsxi:99
		if (!_procs)                                                               // batch_processing.jsxi:100
			init();                                                                // batch_processing.jsxi:100
		
		new Dialog('Batch Processing',                                             // batch_processing.jsxi:101
			[
				'<h6>Cars</h6>',                                                   // batch_processing.jsxi:102
				cars.length + ' cars to process',                                  // batch_processing.jsxi:103
				'<h6>Processor</h6>',                                              // batch_processing.jsxi:104
				'<select>' + _procs.map(function (e, i){                           // batch_processing.jsxi:105
					return '<option value="' + i + '">' + e.name + '</option>';    // batch_processing.jsxi:105
				}) + '</select>', 
				'<div id="proc-options"></div>',                                   // batch_processing.jsxi:106
				'If you have any ideas about different processors, you can use Feedback Form in Settings.'
			], 
			function (){                                                           // batch_processing.jsxi:108
				setTimeout((function (){                                           // batch_processing.jsxi:109
					BatchProcessing.process(cars, _procs[this.find('select').val()].proc);
				}).bind(this));                                                    // batch_processing.jsxi:111
			}).find('select').val(0);                                              // batch_processing.jsxi:112
	};
	
	function init(){                                                               // batch_processing.jsxi:115
		BatchProcessing.add('Add missing brand names to car names',                // batch_processing.jsxi:116
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:116
				if (!car.data || !car.data.name || !car.data.brand)                // batch_processing.jsxi:117
					return;
				
				if (car.data.brand === 'Kunos')                                    // batch_processing.jsxi:119
					return;
				
				if (Brands.nameContains(car.data.name, car.data.brand))            // batch_processing.jsxi:120
					return;
				
				car.changeData('name',                                             // batch_processing.jsxi:122
					Brands.toNamePart(car.data.brand) + ' ' + car.data.name);      // batch_processing.jsxi:122
			}));
		BatchProcessing.add('Remove brand names from car names',                   // batch_processing.jsxi:125
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:125
				if (!car.data || !car.data.name || !car.data.brand)                // batch_processing.jsxi:126
					return;
				
				if (!Brands.nameContains(car.data.name, car.data.brand))           // batch_processing.jsxi:128
					return;
				
				car.changeData('name',                                             // batch_processing.jsxi:130
					car.data.name.substr(Brands.toNamePart(car.data.brand).length + 1));
			}));
		BatchProcessing.add('Lowercase classes',                                   // batch_processing.jsxi:133
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:133
				if (!car.data || !car.data.class)                                  // batch_processing.jsxi:134
					return;
				
				car.changeData('class', car.data.class.toLowerCase());             // batch_processing.jsxi:135
			}));
		BatchProcessing.add('Lowercase & fix tags',                                // batch_processing.jsxi:138
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:138
				if (!car.data || !car.data.tags)                                   // batch_processing.jsxi:139
					return;
				
				var temp = 0,                                                      // batch_processing.jsxi:140
					tags = car.data.tags.map(function (raw){                       // batch_processing.jsxi:141
						var tag = Countries.fixTag(raw.toLowerCase());
						
						if (/^#?(a\d+)$/.test(tag)){                               // batch_processing.jsxi:144
							return '#' + RegExp.$1.toUpperCase();                  // batch_processing.jsxi:145
						}
						
						if (tag === raw){                                          // batch_processing.jsxi:148
							temp ++;                                               // batch_processing.jsxi:149
						}
						return tag;                                                // batch_processing.jsxi:152
					});
				
				if (temp !== car.data.tags.length){                                // batch_processing.jsxi:155
					car.changeData('tags', tags);                                  // batch_processing.jsxi:156
				}
			}));
		BatchProcessing.add('Remove logo.png',                                     // batch_processing.jsxi:160
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:160
				if (fs.existsSync(car.path + '/logo.png')){                        // batch_processing.jsxi:161
					fs.unlinkSync(car.path + '/logo.png');                         // batch_processing.jsxi:162
				}
			}));
		BatchProcessing.add('Replace logo.png by ui/badge.png',                    // batch_processing.jsxi:166
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:166
				if (!fs.existsSync(car.badge))                                     // batch_processing.jsxi:167
					return;
				
				fs.writeFileSync(car.path + '/logo.png', fs.readFileSync(car.badge));
			}));
		BatchProcessing.add('Set default badges',                                  // batch_processing.jsxi:171
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:171
				BadgeEditor.autoupdate(car, true);                                 // batch_processing.jsxi:172
			}));
		
		if (localStorage.developerMode)                                            // batch_processing.jsxi:175
			BatchProcessing.add('Export database', new ExportDbProcessor());
	}
	
	(function (){                                                                  // batch_processing.jsxi:178
		mediator.extend(BatchProcessing);                                          // batch_processing.jsxi:179
	})();
	return BatchProcessing;
})();

/* Class "RestorationWizard" declaration */
var RestorationWizard = (function (){                                              // restoration_wizard.jsxi:1
	var RestorationWizard = function (){}, 
		_fixers = {};
	
	RestorationWizard.fix = function (car, fullErrorId){                           // restoration_wizard.jsxi:4
		var errorId = fullErrorId.split(':')[0];
		
		if (_fixers.hasOwnProperty(errorId)){                                      // restoration_wizard.jsxi:7
			var fixer = RestorationWizard.createFixer(car, car.getError(fullErrorId));
			
			if (errorId !== fullErrorId){                                          // restoration_wizard.jsxi:10
				var simular = car.error.filter(function (e){                       // restoration_wizard.jsxi:11
					return e.id !== fullErrorId && e.id.indexOf(errorId + ':') === 0;
				});
				
				if (simular.length > 0){                                           // restoration_wizard.jsxi:14
					fixer.simular(simular);                                        // restoration_wizard.jsxi:15
				}
			}
			
			fixer.run();                                                           // restoration_wizard.jsxi:19
		} else {
			ErrorHandler.handled('Not supported error: ' + errorId);               // restoration_wizard.jsxi:21
		}
	};
	RestorationWizard.createFixer = function (car, error){                         // restoration_wizard.jsxi:25
		return new _fixers[error.id.split(':')[0]](car, error);                    // restoration_wizard.jsxi:26
	};
	RestorationWizard.register = function (id, classObj){                          // restoration_wizard.jsxi:29
		_fixers[id] = classObj;                                                    // restoration_wizard.jsxi:30
	};
	return RestorationWizard;
})();

;

/* Class "SearchProvider" declaration */
function SearchProvider(car){                                                      // update_description.jsxi:1
	if (this.constructor === SearchProvider)
		throw new Error('Trying to instantiate abstract class SearchProvider');
	
	this.___car = car;                                                             // update_description.jsxi:5
}
SearchProvider.prototype.prepare = function (s){                                   // update_description.jsxi:11
	return s.trim().replace(/\[(?:\d+|citation needed)\]/g, '');                   // update_description.jsxi:12
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
var UpdateDescription = (function (){                                              // update_description.jsxi:31
	var UpdateDescription = function (){}, 
		hiddenDialog;
	
	UpdateDescription.update = function (car){                                     // update_description.jsxi:34
		if (hiddenDialog){                                                         // update_description.jsxi:35
			hiddenDialog.el.show();                                                // update_description.jsxi:36
			return;
		}
		
		provider = new GoogleSearchProvider(car);                                  // update_description.jsxi:40
		
		var dialog = new Dialog('Update Description',                              // update_description.jsxi:42
			[
				'<iframe nwdisable nwfaketop nwUserAgent="' + provider.userAgent + '" src="' + provider.url + '"></iframe>'
			], 
			function (e){                                                          // update_description.jsxi:44
				if (s){                                                            // update_description.jsxi:45
					var p = provider.prepare(s);
					
					if (/^\d{4}$/.test(p)){                                        // update_description.jsxi:47
						Cars.changeData(car, 'year', p);                           // update_description.jsxi:48
					} else {
						Cars.changeData(car,                                       // update_description.jsxi:50
							'description',                                         // update_description.jsxi:50
							e.ctrlKey && car.data.description ? car.data.description + '\n\n' + p : p);
					}
				}
			});
		
		dialog.close = function (){                                                // update_description.jsxi:55
			hiddenDialog = dialog;                                                 // update_description.jsxi:56
			dialog.el.hide();                                                      // update_description.jsxi:57
		};
		
		var s;
		
		dialog.find('iframe').on('load popstate',                                  // update_description.jsxi:61
			function (){                                                           // update_description.jsxi:61
				var w = this.contentWindow;
				
				provider.clearUp(w);                                               // update_description.jsxi:63
				$('body', w.document).on('mouseup keydown keyup mousemove',        // update_description.jsxi:64
					function (e){                                                  // update_description.jsxi:64
						s = w.getSelection().toString();                           // update_description.jsxi:65
					});
			});
		
		var t = $('<div>' + '<button id="button-back" title="Back">←</button> ' + '<button id="button-top" title="Return to start page">↑</button> ' + '<button id="button-external" title="Open in default browser">→</button>' + '</div>').insertBefore(dialog.header);
		
		t.find('#button-back').click(function (){                                  // update_description.jsxi:75
			dialog.find('iframe')[0].contentWindow.history.back();                 // update_description.jsxi:76
		});
		t.find('#button-top').click(function (){                                   // update_description.jsxi:79
			dialog.find('iframe')[0].contentWindow.location = provider.url;        // update_description.jsxi:80
		});
		t.find('#button-external').click(function (){                              // update_description.jsxi:83
			Shell.openItem(dialog.find('iframe')[0].contentWindow.location.href);
		});
	};
	
	function init(){                                                               // update_description.jsxi:88
		ViewList.on('select',                                                      // update_description.jsxi:89
			function (car){                                                        // update_description.jsxi:90
				if (hiddenDialog != null){                                         // update_description.jsxi:91
					hiddenDialog.el.remove();                                      // update_description.jsxi:92
					hiddenDialog = null;                                           // update_description.jsxi:93
				}
			});
	}
	
	(function (){                                                                  // update_description.jsxi:98
		$(init);                                                                   // update_description.jsxi:99
	})();
	return UpdateDescription;
})();

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
	
	UpgradeEditor.saveFromFile = function (filename, file, callback){              // upgrade_editor.jsxi:91
		try {
			AcTools.Utils.ImageUtils.ResizeFile(filename, file, 64, 
				64);                                                               // upgrade_editor.jsxi:93
			
			if (Settings.get('uploadData')){                                       // upgrade_editor.jsxi:94
				AppServerRequest.sendBinary(_currentCarId, 'upgrade', fs.readFileSync(file));
			}
			
			callback();                                                            // upgrade_editor.jsxi:97
		} catch (err){                                                             // upgrade_editor.jsxi:98
			callback(err);                                                         // upgrade_editor.jsxi:99
		} 
	};
	UpgradeEditor.start = function (car, callback){                                // upgrade_editor.jsxi:103
		function cb(e){                                                            // upgrade_editor.jsxi:104
			if (e){                                                                // upgrade_editor.jsxi:105
				ErrorHandler.handled('Cannot save upgrade icon.', e);              // upgrade_editor.jsxi:106
			} else {
				car.updateUpgrade();                                               // upgrade_editor.jsxi:108
			}
			
			if (callback)                                                          // upgrade_editor.jsxi:110
				callback();                                                        // upgrade_editor.jsxi:110
		}
		
		var d = new Dialog('Upgrade Icon Editor',                                  // upgrade_editor.jsxi:113
			[
				'<div class="left"><h6>Current</h6><img class="car-upgrade"></div>', 
				'<div class="right"><h6>New</h6><div id="car-upgrade-editor"></div></div>', 
				'<p><i>Ctrl+I: Italic, Ctrl+B: Bold</i></p>'
			], 
			function (){                                                           // upgrade_editor.jsxi:117
				var label = this.content.find('#car-upgrade-editor')[0].innerHTML;
				
				car.data.upgradeLabel = $('#editable-focus').html();               // upgrade_editor.jsxi:119
				
				if (!car.changed){                                                 // upgrade_editor.jsxi:120
					car.save();                                                    // upgrade_editor.jsxi:121
				}
				
				saveFromHtml(label, car.upgrade, cb);                              // upgrade_editor.jsxi:123
			}).addButton('Select File',                                            // upgrade_editor.jsxi:124
			function (){                                                           // upgrade_editor.jsxi:124
				var a = document.createElement('input');
				
				a.type = 'file';                                                   // upgrade_editor.jsxi:126
				a.setAttribute('accept', '.png');                                  // upgrade_editor.jsxi:127
				a.onchange = function (){                                          // upgrade_editor.jsxi:128
					if (a.files[0]){                                               // upgrade_editor.jsxi:129
						UpgradeEditor.saveFromFile(a.files[0].path, car.upgrade, cb);
						d.close();                                                 // upgrade_editor.jsxi:131
					}
				};
				a.click();                                                         // upgrade_editor.jsxi:134
				return false;
			}).onEnd(function (arg){                                               // upgrade_editor.jsxi:136
			DragDestination.unregister(ddId);                                      // upgrade_editor.jsxi:137
		});
		
		var ddId = DragDestination.register('New Upgrade Icon',                    // upgrade_editor.jsxi:140
			function (files){                                                      // upgrade_editor.jsxi:140
				if (files[0]){                                                     // upgrade_editor.jsxi:141
					UpgradeEditor.saveFromFile(files[0], car.upgrade, cb);
					d.close();                                                     // upgrade_editor.jsxi:143
				}
			});
		
		d.el.addClass('dark');                                                     // upgrade_editor.jsxi:147
		
		if (fs.existsSync(car.upgrade)){                                           // upgrade_editor.jsxi:148
			d.content.find('img').attr('src', car.upgrade);                        // upgrade_editor.jsxi:149
		} else {
			d.content.find('.left').remove();                                      // upgrade_editor.jsxi:151
		}
		
		d.content.find('#car-upgrade-editor').append(editable(car.data.upgradeLabel || 'S1'));
		focus(d.content.find('#editable-focus')[0]);                               // upgrade_editor.jsxi:155
		
		var t = d.addTab('Library',                                                // upgrade_editor.jsxi:157
			"",                                                                    // upgrade_editor.jsxi:157
			function (){                                                           // upgrade_editor.jsxi:157
				saveFromLibrary(t.content.find('.selected').attr('src'), car.upgrade, cb);
			}).setButton('Select').addButton('Cancel');                            // upgrade_editor.jsxi:159
		
		t.content.css('margin', '10px 0');                                         // upgrade_editor.jsxi:160
		t.find('.car-library-element').click(function (){                          // upgrade_editor.jsxi:161
			$(this.parentNode).find('.selected').removeClass('selected');          // upgrade_editor.jsxi:162
			this.classList.add('selected');                                        // upgrade_editor.jsxi:163
		}).dblclick(function (){                                                   // upgrade_editor.jsxi:164
			t.buttons.find('[data-id="dialog-ok"]')[0].click();                    // upgrade_editor.jsxi:165
		});
	};
	return UpgradeEditor;
})();

/* Class "AbstractFixer" declaration */
function AbstractFixer(c, e){                                                      // abstract_fixer.jsxi:1
	if (this.constructor === AbstractFixer)
		throw new Error('Trying to instantiate abstract class AbstractFixer');
	
	this.__car = c;                                                                // abstract_fixer.jsxi:5
	this.__errorId = e.id;                                                         // abstract_fixer.jsxi:6
	this.__object = e[e instanceof AbstractFixer ? '__object' : 'object'];         // abstract_fixer.jsxi:7
}
AbstractFixer.prototype.simular = function (arg){                                  // abstract_fixer.jsxi:10
	this.__simularErrors = arg;                                                    // abstract_fixer.jsxi:11
};
AbstractFixer.prototype.run = function (){                                         // abstract_fixer.jsxi:14
	var __that = this;
	
	try {
		this.__AbstractFixer_work(function (err){                                  // abstract_fixer.jsxi:16
			if (__that.__AbstractFixer__error)
				return;
			
			if (err){                                                              // abstract_fixer.jsxi:19
				__that.__AbstractFixer_error(err === true ? null : err);
			} else {
				__that.__removeError();
				setTimeout(__bindOnce(__that, '__reloadAfter'));                   // abstract_fixer.jsxi:23
			}
		});
	} catch (err){                                                                 // abstract_fixer.jsxi:26
		this.__AbstractFixer_error(err);
	} 
};
AbstractFixer.prototype.__removeError = function (){                               // abstract_fixer.jsxi:31
	this.__car[this.__car instanceof AbstractFixer ? '__removeError' : 'removeError'](this.__errorId);
};
AbstractFixer.prototype.__reloadAfter = function (){};
AbstractFixer.prototype.__AbstractFixer_error = function (err){                    // abstract_fixer.jsxi:39
	this.__AbstractFixer__error = true;
	ErrorHandler.handled('Cannot fix error: ' + this.__errorId, err);              // abstract_fixer.jsxi:41
};
AbstractFixer.prototype.__AbstractFixer_work = function (c){                       // abstract_fixer.jsxi:44
	var __that = this, 
		s = this.solutions.filter(function (arg){                                  // abstract_fixer.jsxi:45
			return arg;                                                            // abstract_fixer.jsxi:45
		});
	
	if (s.length == 0){                                                            // abstract_fixer.jsxi:46
		new Dialog(this.title,                                                     // abstract_fixer.jsxi:47
			[
				'<h6>Available solutions:</h6>',                                   // abstract_fixer.jsxi:47
				'Sorry, but none of solutions is available.'
			]);
		return;
	}
	
	var d = new Dialog(this.title,                                                 // abstract_fixer.jsxi:51
		[
			'<h6>Available solutions:</h6>',                                       // abstract_fixer.jsxi:52
			s.map(function (e, i){                                                 // abstract_fixer.jsxi:53
				return '<label><input name="solution" data-solution-id="' + i + '" type="radio">' + e.name + '</label>';
			}).join('<br>')
		], 
		function (){                                                               // abstract_fixer.jsxi:54
			var id = this.find('input[name="solution"]:checked').data('solution-id');
			
			try {
				s[id].fn(c);                                                       // abstract_fixer.jsxi:57
			} catch (err){                                                         // abstract_fixer.jsxi:58
				__that.__AbstractFixer_error(err);
			} 
		});
	
	if (this.__simularErrors){
		d.addButton('Apply to all',                                                // abstract_fixer.jsxi:64
			function (){                                                           // abstract_fixer.jsxi:64
				var id = this.find('input[name="solution"]:checked').data('solution-id');
				
				try {
					var fns = [ s[id].fn ];
					
					s[id].fn(c);                                                   // abstract_fixer.jsxi:68
					
					for (var __g = 0; __g < __that.__simularErrors.length; __g ++){
						var simularError = __that.__simularErrors[__g];
						
						var fixer = RestorationWizard.createFixer(__that.__car, simularError);
						
						var simularSolution = fixer.solutions.filter(function (arg){
							return arg && arg.name == s[id].name;                  // abstract_fixer.jsxi:72
						})[0];
						
						if (simularSolution){                                      // abstract_fixer.jsxi:73
							fns.push(simularSolution.fn);                          // abstract_fixer.jsxi:74
						}
					}
					
					var i = 0;
					
					function next(){                                               // abstract_fixer.jsxi:79
						if (i < fns.length){                                       // abstract_fixer.jsxi:80
							fns[i ++](next);                                       // abstract_fixer.jsxi:81
						} else {
							c();                                                   // abstract_fixer.jsxi:83
						}
					}
					
					next();                                                        // abstract_fixer.jsxi:87
				} catch (err){                                                     // abstract_fixer.jsxi:88
					__that.__AbstractFixer_error(err);
				} 
				
				console.log(id);                                                   // abstract_fixer.jsxi:92
			});
	}
	
	d.addButton('Cancel');                                                         // abstract_fixer.jsxi:96
	d.find('input[name="solution"]')[0].checked = true;                            // abstract_fixer.jsxi:97
};
AbstractFixer.prototype.__fixJsonFile = function (filename, fn){                   // abstract_fixer.jsxi:103
	try {
		var dat = JSON.flexibleParse(fs.readFileSync(filename));
		
		fn(dat);                                                                   // abstract_fixer.jsxi:106
		fs.writeFileSync(filename,                                                 // abstract_fixer.jsxi:107
			JSON.stringify(dat, false, 
				4));                                                               // abstract_fixer.jsxi:107
	} catch (err){                                                                 // abstract_fixer.jsxi:108
		this.__AbstractFixer_error(err);
	} 
};
AbstractFixer.__simularFile = function (a, b){                                     // abstract_fixer.jsxi:113
	a = a.toLowerCase();                                                           // abstract_fixer.jsxi:115
	b = b.toLowerCase();                                                           // abstract_fixer.jsxi:116
	
	if (b.indexOf(a) !== - 1)                                                      // abstract_fixer.jsxi:117
		return true;
	
	for (var i = a.length - 1; i > a.length / 2; i --)                             // abstract_fixer.jsxi:119
		if (b.indexOf(a.substr(0, i)) !== - 1)                                     // abstract_fixer.jsxi:120
			return true;
	return false;
};
AbstractFixer.__simularFiles = function (filename, filter, deep, rec){             // abstract_fixer.jsxi:125
	if (filter === undefined)                                                      // abstract_fixer.jsxi:125
		filter = (function (arg){                                                  // abstract_fixer.jsxi:125
	return true;
});

	if (deep === undefined)                                                        // abstract_fixer.jsxi:125
		deep = true;                                                               // abstract_fixer.jsxi:125

	if (rec === undefined)                                                         // abstract_fixer.jsxi:125
		rec = false;                                                               // abstract_fixer.jsxi:125

	var dir = path.dirname(filename);
	
	var basename = path.basename(filename);
	
	if (fs.existsSync(dir)){                                                       // abstract_fixer.jsxi:129
		if (fs.statSync(dir).isDirectory()){                                       // abstract_fixer.jsxi:130
			return fs.readdirSync(dir).filter(function (arg){                      // abstract_fixer.jsxi:131
				return AbstractFixer.__simularFile(basename, arg) && (arg != basename || rec);
			}).map(function (e){                                                   // abstract_fixer.jsxi:131
				return dir + '/' + e;                                              // abstract_fixer.jsxi:132
			}).filter(function (arg){                                              // abstract_fixer.jsxi:133
				return filter(fs.statSync(arg));                                   // abstract_fixer.jsxi:133
			});
		} else {
			return [];
		}
	} else if (deep){                                                              // abstract_fixer.jsxi:137
		var r = [];
		
		var s = AbstractFixer.__simularFiles(dir,                                  // abstract_fixer.jsxi:139
			function (arg){                                                        // abstract_fixer.jsxi:139
				return arg.isDirectory();                                          // abstract_fixer.jsxi:139
			}, 
			false, 
			true);
		
		for (var __h = 0; __h < s.length; __h ++){                                 // abstract_fixer.jsxi:140
			var d = s[__h];
			
			r.push.call(r,                                                         // abstract_fixer.jsxi:141
				AbstractFixer.__simularFiles(d + '/' + basename, filter, false, 
					true));
		}
		return r;                                                                  // abstract_fixer.jsxi:143
	} else {
		return [];
	}
};
AbstractFixer.__restoreFile = function (filename, from, c){                        // abstract_fixer.jsxi:149
	if (fs.existsSync(filename))                                                   // abstract_fixer.jsxi:150
		fs.unlinkSync(filename);                                                   // abstract_fixer.jsxi:151
	
	function mkdirp(d){                                                            // abstract_fixer.jsxi:153
		if (fs.existsSync(d))                                                      // abstract_fixer.jsxi:154
			return;
		
		mkdirp(path.dirname(d));                                                   // abstract_fixer.jsxi:155
		fs.mkdirSync(d);                                                           // abstract_fixer.jsxi:156
	}
	
	mkdirp(path.dirname(filename));                                                // abstract_fixer.jsxi:159
	fs.rename(from,                                                                // abstract_fixer.jsxi:160
		filename,                                                                  // abstract_fixer.jsxi:160
		function (err){                                                            // abstract_fixer.jsxi:160
			if (err){                                                              // abstract_fixer.jsxi:161
				if (err.code === 'EXDEV'){                                         // abstract_fixer.jsxi:162
					copy();                                                        // abstract_fixer.jsxi:163
				} else {
					c(err);                                                        // abstract_fixer.jsxi:165
				}
			} else {
				c();                                                               // abstract_fixer.jsxi:168
			}
		});
	
	function copy(){                                                               // abstract_fixer.jsxi:172
		var rs = fs.createReadStream(from);
		
		var ws = fs.createWriteStream(filename);
		
		rs.on('error', c);                                                         // abstract_fixer.jsxi:175
		ws.on('error', c);                                                         // abstract_fixer.jsxi:176
		rs.on('close',                                                             // abstract_fixer.jsxi:177
			function (){                                                           // abstract_fixer.jsxi:177
				c();                                                               // abstract_fixer.jsxi:178
				fs.unlink(from);                                                   // abstract_fixer.jsxi:179
			});
		rs.pipe(ws);                                                               // abstract_fixer.jsxi:181
	}
};
AbstractFixer.__tryToRestoreFile = function (filename, filter, callback, deep){    // abstract_fixer.jsxi:185
	return AbstractFixer.__simularFiles(filename, filter, deep).map(function (e){
		return {
			name: 'Restore from …' + path.normalize(e).slice(AcDir.root.length), 
			fn: (function (c){                                                     // abstract_fixer.jsxi:189
				AbstractFixer.__restoreFile(filename,                              // abstract_fixer.jsxi:190
					e,                                                             // abstract_fixer.jsxi:190
					function (err){                                                // abstract_fixer.jsxi:190
						if (err)                                                   // abstract_fixer.jsxi:191
							return c(err);                                         // abstract_fixer.jsxi:191
						
						if (callback)                                              // abstract_fixer.jsxi:192
							callback();                                            // abstract_fixer.jsxi:192
						
						c();                                                       // abstract_fixer.jsxi:193
					});
			})
		};
	});
};
AbstractFixer.__tryToRestoreFileHere = function (filename, filter, callback){      // abstract_fixer.jsxi:200
	return AbstractFixer.__tryToRestoreFile(filename, filter, callback, false);
};

/* Class "AcdAeroDataSectionFixer" declaration */
function AcdAeroDataSectionFixer(){                                                // error_acd_file.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(AcdAeroDataSectionFixer, 
	AbstractFixer);
AcdAeroDataSectionFixer.prototype.__AcdAeroDataSectionFixer_removeSection = function (c){
	AcTools.Utils.DataFixer.RemoveAeroDataSection(this.__car.path);                // error_acd_file.jsxi:3
	c();                                                                           // error_acd_file.jsxi:4
};
Object.defineProperty(AcdAeroDataSectionFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Obsolete section “DATA” in aero.ini';                          // error_acd_file.jsxi:7
		})
	});
Object.defineProperty(AcdAeroDataSectionFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Remove section',                                        // error_acd_file.jsxi:9
					fn: __bindOnce(this, '__AcdAeroDataSectionFixer_removeSection')
				}
			];
		})
	});

RestorationWizard.register('acd-obsolete-aero-data', AcdAeroDataSectionFixer);     // error_acd_file.jsxi:13

/* Class "AcdInvalidWeightFixer" declaration */
function AcdInvalidWeightFixer(){                                                  // error_acd_file.jsxi:15
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(AcdInvalidWeightFixer, 
	AbstractFixer);
AcdInvalidWeightFixer.prototype.__AcdInvalidWeightFixer_changeWeight = function (c){
	this.__car.changeDataSpecs('weight',                                           // error_acd_file.jsxi:17
		AcTools.Utils.DataFixer.GetWeight(this.__car.path) + 'kg');                // error_acd_file.jsxi:17
	c();                                                                           // error_acd_file.jsxi:18
};
Object.defineProperty(AcdInvalidWeightFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Obsolete section “DATA” in aero.ini';                          // error_acd_file.jsxi:21
		})
	});
Object.defineProperty(AcdInvalidWeightFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Change weight in UI to ' + AcTools.Utils.DataFixer.GetWeight(this.__car.path) + 'kg', 
					fn: __bindOnce(this, '__AcdInvalidWeightFixer_changeWeight')
				}, 
				localStorage.developerMode && {                                    // error_acd_file.jsxi:24
					name: 'Change weight in data to ' + this.__car.getSpec('weight') + 'kg (use only if UI weight is correct!)', 
					fn: __bindOnce(this, '__AcdInvalidWeightFixer_changeWeight')
				}
			];
		})
	});

RestorationWizard.register('acd-invalid-weight', AcdInvalidWeightFixer);           // error_acd_file.jsxi:28

/* Class "MissingBadgeIconFixer" declaration */
function MissingBadgeIconFixer(){                                                  // error_badge_missing.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingBadgeIconFixer, 
	AbstractFixer);
MissingBadgeIconFixer.prototype.__MissingBadgeIconFixer_newIcon = function (c){    // error_badge_missing.jsxi:2
	var __that = this;
	
	BadgeEditor.start(this.__car,                                                  // error_badge_missing.jsxi:3
		function (arg){                                                            // error_badge_missing.jsxi:3
			if (fs.existsSync(__that.__car.badge)){                                // error_badge_missing.jsxi:4
				c();                                                               // error_badge_missing.jsxi:5
			}
		});
};
Object.defineProperty(MissingBadgeIconFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Badge icon missing';                                           // error_badge_missing.jsxi:10
		})
	});
Object.defineProperty(MissingBadgeIconFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			var __that = this;
			return [].concat(AbstractFixer.__tryToRestoreFile(this.__car.badge,    // error_badge_missing.jsxi:13
				function (arg){                                                    // error_badge_missing.jsxi:14
					return arg.isFile() && arg.size > 1e3 && arg.size < 1e5;       // error_badge_missing.jsxi:14
				}, 
				function (c){                                                      // error_badge_missing.jsxi:15
					__that.__car.updateBadge();                                    // error_badge_missing.jsxi:16
				}));
		})
	});

RestorationWizard.register('badge-missing', MissingBadgeIconFixer);                // error_badge_missing.jsxi:20

/* Class "MissingDataNameFixer" declaration */
function MissingDataNameFixer(){                                                   // error_data_fields.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingDataNameFixer, 
	AbstractFixer);
MissingDataNameFixer.prototype.__reloadAfter = function (){                        // error_data_fields.jsxi:2
	this.__car.loadData();                                                         // error_data_fields.jsxi:3
};
MissingDataNameFixer.prototype.__MissingDataNameFixer_fix = function (v){          // error_data_fields.jsxi:6
	this.__fixJsonFile(this.__car.json,                                            // error_data_fields.jsxi:7
		function (data){                                                           // error_data_fields.jsxi:7
			data.name = v;                                                         // error_data_fields.jsxi:8
		});
};
MissingDataNameFixer.prototype.__MissingDataNameFixer_createNew = function (c){    // error_data_fields.jsxi:12
	var __that = this;
	
	new Dialog('Input A New Name',                                                 // error_data_fields.jsxi:13
		'<input required>',                                                        // error_data_fields.jsxi:13
		function (){                                                               // error_data_fields.jsxi:13
			__that.__MissingDataNameFixer_fix(this.find('input').val());
			c();                                                                   // error_data_fields.jsxi:15
		});
};
MissingDataNameFixer.prototype.__MissingDataNameFixer_useId = function (c){        // error_data_fields.jsxi:19
	this.__MissingDataNameFixer_fix(this.__car.id);
	c();                                                                           // error_data_fields.jsxi:21
};
Object.defineProperty(MissingDataNameFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Car name is missing';                                          // error_data_fields.jsxi:24
		})
	});
Object.defineProperty(MissingDataNameFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Enter a new name',                                      // error_data_fields.jsxi:26
					fn: __bindOnce(this, '__MissingDataNameFixer_createNew')
				}, 
				{
					name: 'Use id as a name',                                      // error_data_fields.jsxi:27
					fn: __bindOnce(this, '__MissingDataNameFixer_useId')
				}
			];
		})
	});

/* Class "MissingDataBrandFixer" declaration */
function MissingDataBrandFixer(){                                                  // error_data_fields.jsxi:31
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingDataBrandFixer, 
	AbstractFixer);
MissingDataBrandFixer.prototype.__reloadAfter = function (){                       // error_data_fields.jsxi:32
	this.__car.loadData();                                                         // error_data_fields.jsxi:33
};
MissingDataBrandFixer.prototype.__MissingDataBrandFixer_fix = function (v){        // error_data_fields.jsxi:36
	this.__fixJsonFile(this.__car.json,                                            // error_data_fields.jsxi:37
		function (data){                                                           // error_data_fields.jsxi:37
			data.brand = v;                                                        // error_data_fields.jsxi:38
		});
};
MissingDataBrandFixer.prototype.__MissingDataBrandFixer_createNew = function (c){
	var __that = this;
	
	new Dialog('Select Brand Name',                                                // error_data_fields.jsxi:43
		'<input autocomplete list="brands" required>',                             // error_data_fields.jsxi:43
		function (){                                                               // error_data_fields.jsxi:43
			__that.__MissingDataBrandFixer_fix(this.find('input').val());
			c();                                                                   // error_data_fields.jsxi:45
		});
};
MissingDataBrandFixer.prototype.__MissingDataBrandFixer_useBr = function (c){      // error_data_fields.jsxi:49
	this.__MissingDataBrandFixer_fix(this.__MissingDataBrandFixer_br);
	c();                                                                           // error_data_fields.jsxi:51
};
MissingDataBrandFixer.prototype.__MissingDataBrandFixer_extractBrand = function (){
	var __that = this;
	return this.__MissingDataBrandFixer_br = Cars.brands.filter(function (arg){    // error_data_fields.jsxi:56
		return __that.__car.id.indexOf(arg.toLowerCase()) === 0;                   // error_data_fields.jsxi:56
	})[0];
};
Object.defineProperty(MissingDataBrandFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Car brand is missing';                                         // error_data_fields.jsxi:59
		})
	});
Object.defineProperty(MissingDataBrandFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				this.__MissingDataBrandFixer_extractBrand() && {
					name: 'Use “' + this.__MissingDataBrandFixer_br + '” as a brand', 
					fn: __bindOnce(this, '__MissingDataBrandFixer_useBr')
				}, 
				{
					name: 'Select a new brand',                                    // error_data_fields.jsxi:62
					fn: __bindOnce(this, '__MissingDataBrandFixer_createNew')
				}
			];
		})
	});

RestorationWizard.register('data-name-missing', MissingDataNameFixer);             // error_data_fields.jsxi:66
RestorationWizard.register('data-brand-missing', MissingDataBrandFixer);           // error_data_fields.jsxi:67

/* Class "WrongDataParentFixer" declaration */
function WrongDataParentFixer(){                                                   // error_data_fields.jsxi:69
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(WrongDataParentFixer, 
	AbstractFixer);
WrongDataParentFixer.prototype.__reloadAfter = function (){                        // error_data_fields.jsxi:70
	this.__car.loadData();                                                         // error_data_fields.jsxi:71
};
WrongDataParentFixer.prototype.__WrongDataParentFixer_fix = function (v){          // error_data_fields.jsxi:74
	this.__fixJsonFile(this.__car.json,                                            // error_data_fields.jsxi:75
		function (data){                                                           // error_data_fields.jsxi:75
			if (v){                                                                // error_data_fields.jsxi:76
				data.parent = v;                                                   // error_data_fields.jsxi:77
			} else {
				delete data.parent;                                                // error_data_fields.jsxi:79
			}
		});
};
WrongDataParentFixer.prototype.__WrongDataParentFixer_createNew = function (c){    // error_data_fields.jsxi:84
	var __that = this;
	
	d = new Dialog('Select New Parent',                                            // error_data_fields.jsxi:85
		'<select></select>',                                                       // error_data_fields.jsxi:85
		function (){                                                               // error_data_fields.jsxi:85
			__that.__WrongDataParentFixer_fix(this.find('select').val());
			c();                                                                   // error_data_fields.jsxi:87
		});
	
	var s = d.find('select')[0];
	
	s.innerHTML = '<option value="">None</option>' + Cars.list.filter(function (e){
		return e.data && !e.disabled && e.parent == null && e.id != __that.__car.id && (!__that.__car.parent || __that.__car.parent.id != __that.__car.id);
	}).map(function (e){                                                           // error_data_fields.jsxi:93
		return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);       // error_data_fields.jsxi:94
	}).join('');                                                                   // error_data_fields.jsxi:95
};
WrongDataParentFixer.prototype.__WrongDataParentFixer_makeInd = function (c){      // error_data_fields.jsxi:98
	this.__WrongDataParentFixer_fix(null);
	c();                                                                           // error_data_fields.jsxi:100
};
Object.defineProperty(WrongDataParentFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Parent id is incorrect';                                       // error_data_fields.jsxi:103
		})
	});
Object.defineProperty(WrongDataParentFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Make independent',                                      // error_data_fields.jsxi:105
					fn: __bindOnce(this, '__WrongDataParentFixer_makeInd')
				}, 
				this.__car.children.length == 0 && {                               // error_data_fields.jsxi:106
					name: 'Select a new parent',                                   // error_data_fields.jsxi:106
					fn: __bindOnce(this, '__WrongDataParentFixer_createNew')
				}
			];
		})
	});

RestorationWizard.register('parent-wrong', WrongDataParentFixer);                  // error_data_fields.jsxi:110
RestorationWizard.register('parent-missing', WrongDataParentFixer);                // error_data_fields.jsxi:111

/* Class "MissingDataFileFixer" declaration */
function MissingDataFileFixer(){                                                   // error_data_file.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingDataFileFixer, 
	AbstractFixer);
MissingDataFileFixer.prototype.__reloadAfter = function (){                        // error_data_file.jsxi:2
	this.__car.loadData();                                                         // error_data_file.jsxi:3
};
Object.defineProperty(MissingDataFileFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'File ui/ui_car.json is missing';                               // error_data_file.jsxi:6
		})
	});
Object.defineProperty(MissingDataFileFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return AbstractFixer.__tryToRestoreFile(this.__car.json,               // error_data_file.jsxi:7
				function (arg){                                                    // error_data_file.jsxi:8
					return arg.isFile() && arg.size > 10 && arg.size < 1e5;        // error_data_file.jsxi:8
				});
		})
	});

RestorationWizard.register('data-missing', MissingDataFileFixer);                  // error_data_file.jsxi:11

/* Class "DamagedDataFileFixer" declaration */
function DamagedDataFileFixer(){                                                   // error_data_file.jsxi:13
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(DamagedDataFileFixer, 
	AbstractFixer);
DamagedDataFileFixer.prototype.__reloadAfter = function (){                        // error_data_file.jsxi:14
	this.__car.loadData();                                                         // error_data_file.jsxi:15
};
DamagedDataFileFixer.prototype.__DamagedDataFileFixer_restore = function (c){      // error_data_file.jsxi:18
	var parsed = UiJsonDamaged.parseCarFile(this.__car.json);
	
	if (!fs.existsSync(this.__car.json + '~at_bak')){                              // error_data_file.jsxi:20
		fs.renameSync(this.__car.json, this.__car.json + '~at_bak');               // error_data_file.jsxi:21
	}
	
	fs.writeFileSync(this.__car.json,                                              // error_data_file.jsxi:23
		JSON.stringify(parsed, null, 
			4));                                                                   // error_data_file.jsxi:23
	c();                                                                           // error_data_file.jsxi:24
};
Object.defineProperty(DamagedDataFileFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'File ui/ui_car.json is damaged';                               // error_data_file.jsxi:27
		})
	});
Object.defineProperty(DamagedDataFileFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Try to restore',                                        // error_data_file.jsxi:29
					fn: __bindOnce(this, '__DamagedDataFileFixer_restore')
				}
			].concat(AbstractFixer.__tryToRestoreFile(this.__car.json,             // error_data_file.jsxi:30
				function (arg){                                                    // error_data_file.jsxi:31
					return arg.isFile() && arg.size > 10 && arg.size < 1e5;        // error_data_file.jsxi:31
				}));
		})
	});

RestorationWizard.register('data-damaged', DamagedDataFileFixer);                  // error_data_file.jsxi:34

/* Class "Kn5SuspXxErrorFixer" declaration */
function Kn5SuspXxErrorFixer(){                                                    // error_kn5_file.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(Kn5SuspXxErrorFixer, 
	AbstractFixer);
Kn5SuspXxErrorFixer.prototype.__Kn5SuspXxErrorFixer_emptyPlaceholders = function (c){
	AcTools.Utils.Kn5Fixer.FixSuspensionWrapper(AcDir.root, this.__car.id);        // error_kn5_file.jsxi:3
	c();                                                                           // error_kn5_file.jsxi:4
};
Object.defineProperty(Kn5SuspXxErrorFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Car\'s model doesn\'t have a proper suspension.';              // error_kn5_file.jsxi:7
		})
	});
Object.defineProperty(Kn5SuspXxErrorFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Add empty placeholders',                                // error_kn5_file.jsxi:9
					fn: __bindOnce(this, '__Kn5SuspXxErrorFixer_emptyPlaceholders')
				}
			];
		})
	});

RestorationWizard.register('kn5-susp_xx-error', Kn5SuspXxErrorFixer);              // error_kn5_file.jsxi:13

/* Class "MissingSkinsDirectoryFixer" declaration */
function MissingSkinsDirectoryFixer(){                                             // error_skins_directory.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingSkinsDirectoryFixer, 
	AbstractFixer);
MissingSkinsDirectoryFixer.prototype.__reloadAfter = function (){                  // error_skins_directory.jsxi:2
	this.__car.loadSkins();                                                        // error_skins_directory.jsxi:3
};
MissingSkinsDirectoryFixer.prototype.__MissingSkinsDirectoryFixer_createNew = function (c){
	fs.mkdirSync(this.__car.skinsDir);                                             // error_skins_directory.jsxi:7
	fs.mkdirSync(this.__car.skinsDir + '/default');                                // error_skins_directory.jsxi:8
	c();                                                                           // error_skins_directory.jsxi:9
};
Object.defineProperty(MissingSkinsDirectoryFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Skins folder is missing';                                      // error_skins_directory.jsxi:12
		})
	});
Object.defineProperty(MissingSkinsDirectoryFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Create new with empty skin',                            // error_skins_directory.jsxi:14
					fn: __bindOnce(this, '__MissingSkinsDirectoryFixer_createNew')
				}
			].concat(AbstractFixer.__tryToRestoreFile(this.__car.skinsDir,         // error_skins_directory.jsxi:15
				function (arg){                                                    // error_skins_directory.jsxi:15
					return arg.isDirectory();                                      // error_skins_directory.jsxi:15
				}));
		})
	});

/* Class "EmptySkinsDirectoryFixer" declaration */
function EmptySkinsDirectoryFixer(){                                               // error_skins_directory.jsxi:18
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(EmptySkinsDirectoryFixer, 
	AbstractFixer);
EmptySkinsDirectoryFixer.prototype.__reloadAfter = function (){                    // error_skins_directory.jsxi:19
	this.__car.loadSkins();                                                        // error_skins_directory.jsxi:20
};
EmptySkinsDirectoryFixer.prototype.__EmptySkinsDirectoryFixer_createNew = function (c){
	fs.mkdirSync(this.__car.skinsDir + '/default');                                // error_skins_directory.jsxi:24
	c();                                                                           // error_skins_directory.jsxi:25
};
Object.defineProperty(EmptySkinsDirectoryFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Skins folder is empty';                                        // error_skins_directory.jsxi:28
		})
	});
Object.defineProperty(EmptySkinsDirectoryFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Create new empty skin',                                 // error_skins_directory.jsxi:30
					fn: __bindOnce(this, '__EmptySkinsDirectoryFixer_createNew')
				}
			];
		})
	});

/* Class "FileSkinsDirectoryFixer" declaration */
function FileSkinsDirectoryFixer(){                                                // error_skins_directory.jsxi:34
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(FileSkinsDirectoryFixer, 
	AbstractFixer);
FileSkinsDirectoryFixer.prototype.__reloadAfter = function (){                     // error_skins_directory.jsxi:35
	this.__car.loadSkins();                                                        // error_skins_directory.jsxi:36
};
FileSkinsDirectoryFixer.prototype.__FileSkinsDirectoryFixer_fix = function (c){    // error_skins_directory.jsxi:39
	fs.renameSync(this.__car.skinsDir, this.__car.skinsDir + '.bak');              // error_skins_directory.jsxi:40
	fs.mkdirSync(this.__car.skinsDir);                                             // error_skins_directory.jsxi:41
	fs.mkdirSync(this.__car.skinsDir + '/default');                                // error_skins_directory.jsxi:42
	c();                                                                           // error_skins_directory.jsxi:43
};
Object.defineProperty(FileSkinsDirectoryFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'There is a file instead of skins folder';                      // error_skins_directory.jsxi:46
		})
	});
Object.defineProperty(FileSkinsDirectoryFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Rename file to “skins.bak” and create new skins directory with empty skin', 
					fn: __bindOnce(this, '__FileSkinsDirectoryFixer_fix')
				}
			];
		})
	});

RestorationWizard.register('skins-missing', MissingSkinsDirectoryFixer);           // error_skins_directory.jsxi:52
RestorationWizard.register('skins-empty', EmptySkinsDirectoryFixer);               // error_skins_directory.jsxi:53
RestorationWizard.register('skins-file', FileSkinsDirectoryFixer);                 // error_skins_directory.jsxi:54

/* Class "DamagedSkinDataFixer" declaration */
var DamagedSkinDataFixer = (function (){                                           // error_skin_data.jsxi:1
	var DamagedSkinDataFixer = function (){                                        // error_skin_data.jsxi:1
			AbstractFixer.apply(this, 
				arguments);
		}, 
		defaultSkinData = {                                                        // error_skin_data.jsxi:2
			skinname: "Undefined",                                                 // error_skin_data.jsxi:2
			drivername: "",                                                        // error_skin_data.jsxi:4
			country: "",                                                           // error_skin_data.jsxi:5
			team: "",                                                              // error_skin_data.jsxi:6
			number: 0
		};
	
	__prototypeExtend(DamagedSkinDataFixer, 
		AbstractFixer);
	DamagedSkinDataFixer.prototype.__reloadAfter = function (){                    // error_skin_data.jsxi:10
		this.__car.loadSkins();                                                    // error_skin_data.jsxi:11
	};
	DamagedSkinDataFixer.prototype.__DamagedSkinDataFixer_remove = function (c){   // error_skin_data.jsxi:14
		if (!fs.existsSync(this.__object.json + '~at_bak')){                       // error_skin_data.jsxi:15
			fs.renameSync(this.__object.json, this.__object.json + '~at_bak');     // error_skin_data.jsxi:16
		} else {
			fs.unlinkSync(this.__object.json);                                     // error_skin_data.jsxi:18
		}
		
		c();                                                                       // error_skin_data.jsxi:20
	};
	DamagedSkinDataFixer.prototype.__DamagedSkinDataFixer_blank = function (c){    // error_skin_data.jsxi:23
		if (!fs.existsSync(this.__object.json + '~at_bak')){                       // error_skin_data.jsxi:24
			fs.renameSync(this.__object.json, this.__object.json + '~at_bak');     // error_skin_data.jsxi:25
		}
		
		fs.writeFileSync(this.__object.json,                                       // error_skin_data.jsxi:27
			JSON.stringify(defaultSkinData, null, 
				4));                                                               // error_skin_data.jsxi:27
		c();                                                                       // error_skin_data.jsxi:28
	};
	DamagedSkinDataFixer.prototype.__DamagedSkinDataFixer_restore = function (c){
		var parsed = UiJsonDamaged.parseSkinFile(this.__object.json);
		
		for (var k in defaultSkinData)                                             // error_skin_data.jsxi:33
			if (defaultSkinData.hasOwnProperty(k)){                                // error_skin_data.jsxi:33
				var v = defaultSkinData[k];
				
				if (parsed[k] == null)                                             // error_skin_data.jsxi:34
					parsed[k] = v;                                                 // error_skin_data.jsxi:34
			}
		
		if (!fs.existsSync(this.__object.json + '~at_bak')){                       // error_skin_data.jsxi:36
			fs.renameSync(this.__object.json, this.__object.json + '~at_bak');     // error_skin_data.jsxi:37
		}
		
		fs.writeFileSync(this.__object.json,                                       // error_skin_data.jsxi:39
			JSON.stringify(parsed, null, 
				4));                                                               // error_skin_data.jsxi:39
		c();                                                                       // error_skin_data.jsxi:40
	};
	Object.defineProperty(DamagedSkinDataFixer.prototype, 
		'title', 
		{
			get: (function (){
				return 'File skins/' + this.__object.id + '/ui_skin.json is damaged';
			})
		});
	Object.defineProperty(DamagedSkinDataFixer.prototype, 
		'solutions', 
		{
			get: (function (){
				return [
					{
						name: 'Try to restore',                                    // error_skin_data.jsxi:45
						fn: __bindOnce(this, '__DamagedSkinDataFixer_restore')
					}, 
					{
						name: 'Just remove damaged file',                          // error_skin_data.jsxi:46
						fn: __bindOnce(this, '__DamagedSkinDataFixer_remove')
					}, 
					{
						name: 'Replace with the new one',                          // error_skin_data.jsxi:47
						fn: __bindOnce(this, '__DamagedSkinDataFixer_blank')
					}
				].concat(AbstractFixer.__tryToRestoreFileHere(this.__object.json, 
					function (arg){                                                // error_skin_data.jsxi:49
						return arg.isFile() && arg.size > 10 && arg.size < 1e5;    // error_skin_data.jsxi:49
					}));
			})
		});
	return DamagedSkinDataFixer;
})();

RestorationWizard.register('skin-data-damaged', DamagedSkinDataFixer);             // error_skin_data.jsxi:52

/* Class "MissingPreviewFixer" declaration */
function MissingPreviewFixer(){                                                    // error_skin_images.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingPreviewFixer, 
	AbstractFixer);
MissingPreviewFixer.prototype.__removeError = function (){};
MissingPreviewFixer.prototype.__MissingPreviewFixer_restore = function (c){        // error_skin_images.jsxi:5
	AcShowroom.shot(this.__car);                                                   // error_skin_images.jsxi:6
	c();                                                                           // error_skin_images.jsxi:7
};
Object.defineProperty(MissingPreviewFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Some of skin\'s previews are missing';                         // error_skin_images.jsxi:10
		})
	});
Object.defineProperty(MissingPreviewFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Auto-generate new previews',                            // error_skin_images.jsxi:12
					fn: __bindOnce(this, '__MissingPreviewFixer_restore')
				}
			].concat(AbstractFixer.__tryToRestoreFileHere(this.__object.preview, 
				function (arg){                                                    // error_skin_images.jsxi:14
					return arg.isFile() && arg.size > 1e3 && arg.size < 1e6;       // error_skin_images.jsxi:14
				}));
		})
	});

RestorationWizard.register('skin-preview-missing', MissingPreviewFixer);           // error_skin_images.jsxi:17

/* Class "MissingLiveryFixer" declaration */
function MissingLiveryFixer(){                                                     // error_skin_images.jsxi:19
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingLiveryFixer, 
	AbstractFixer);
MissingLiveryFixer.prototype.__reloadAfter = function (){                          // error_skin_images.jsxi:20
	this.__car.loadSkins();                                                        // error_skin_images.jsxi:21
};
MissingLiveryFixer.prototype.__MissingLiveryFixer_autogenFromPreview = function (c){
	AcTools.Utils.ImageUtils.GenerateLivery(this.__object.preview, this.__object.livery);
	c();                                                                           // error_skin_images.jsxi:26
};
MissingLiveryFixer.prototype.__MissingLiveryFixer_autogenFromCustomShowroom = function (c){
	AcTools.Utils.Kn5RenderWrapper.GenerateLivery(this.__car.path, this.__object.id, this.__object.livery);
	c();                                                                           // error_skin_images.jsxi:31
};
Object.defineProperty(MissingLiveryFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Livery of skin “' + this.__object.id + '” is missing';         // error_skin_images.jsxi:34
		})
	});
Object.defineProperty(MissingLiveryFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				fs.existsSync(this.__object.preview) && {                          // error_skin_images.jsxi:36
					name: 'Auto-generate new livery from skin\'s preview',         // error_skin_images.jsxi:36
					fn: __bindOnce(this, '__MissingLiveryFixer_autogenFromPreview')
				}, 
				{
					name: 'Auto-generate new livery using Custom Showroom',        // error_skin_images.jsxi:37
					fn: __bindOnce(this, '__MissingLiveryFixer_autogenFromCustomShowroom')
				}
			].concat(AbstractFixer.__tryToRestoreFileHere(this.__object.livery,    // error_skin_images.jsxi:38
				function (arg){                                                    // error_skin_images.jsxi:39
					return arg.isFile() && arg.size > 1e1 && arg.size < 1e6;       // error_skin_images.jsxi:39
				}));
		})
	});

RestorationWizard.register('skin-livery-missing', MissingLiveryFixer);             // error_skin_images.jsxi:42

/* Class "MissingUpgradeIconFixer" declaration */
function MissingUpgradeIconFixer(){                                                // error_upgrade_missing.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingUpgradeIconFixer, 
	AbstractFixer);
MissingUpgradeIconFixer.prototype.__MissingUpgradeIconFixer_newIcon = function (c){
	var __that = this;
	
	UpgradeEditor.start(this.__car,                                                // error_upgrade_missing.jsxi:3
		function (arg){                                                            // error_upgrade_missing.jsxi:3
			if (fs.existsSync(__that.__car.upgrade)){                              // error_upgrade_missing.jsxi:4
				c();                                                               // error_upgrade_missing.jsxi:5
			}
		});
};
MissingUpgradeIconFixer.prototype.__MissingUpgradeIconFixer_makeIndependent = function (c){
	this.__car.changeParent(null);                                                 // error_upgrade_missing.jsxi:11
	c();                                                                           // error_upgrade_missing.jsxi:12
};
Object.defineProperty(MissingUpgradeIconFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Upgrade icon missing';                                         // error_upgrade_missing.jsxi:15
		})
	});
Object.defineProperty(MissingUpgradeIconFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			var __that = this;
			return [
				{
					name: 'Create new',                                            // error_upgrade_missing.jsxi:17
					fn: __bindOnce(this, '__MissingUpgradeIconFixer_newIcon')
				}, 
				{
					name: 'Make independent',                                      // error_upgrade_missing.jsxi:18
					fn: __bindOnce(this, '__MissingUpgradeIconFixer_makeIndependent')
				}
			].concat(AbstractFixer.__tryToRestoreFile(this.__car.upgrade,          // error_upgrade_missing.jsxi:19
				function (arg){                                                    // error_upgrade_missing.jsxi:20
					return arg.isFile() && arg.size > 1e3 && arg.size < 1e5;       // error_upgrade_missing.jsxi:20
				}, 
				function (c){                                                      // error_upgrade_missing.jsxi:21
					__that.__car.updateUpgrade();                                  // error_upgrade_missing.jsxi:22
				}));
		})
	});

RestorationWizard.register('parent-upgrade-missing', MissingUpgradeIconFixer);     // error_upgrade_missing.jsxi:26

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
			er.show().html('Errors:<ul>' + car.error.map(function (e){             // view_details.jsxi:20
				return '<li><a href="#" data-error-id="' + e.id + '">' + e.msg + '</a></li>';
			}).join('') + '</ul>');                                                // view_details.jsxi:22
		} else {
			er.hide();                                                             // view_details.jsxi:24
		}
	}
	
	function outBadge(car){                                                        // view_details.jsxi:28
		var lo = $('#selected-car-logo');
		
		if (car.hasError('badge-missing')){                                        // view_details.jsxi:30
			lo.hide();                                                             // view_details.jsxi:31
		} else {
			lo.show().attr('src', car.badge.cssUrl());                             // view_details.jsxi:33
		}
	}
	
	function outData(car){                                                         // view_details.jsxi:37
		function val(e, s){                                                        // view_details.jsxi:38
			if (typeof e === 'string')                                             // view_details.jsxi:39
				e = $(e);                                                          // view_details.jsxi:39
			
			if (e = e[0]){                                                         // view_details.jsxi:40
				var c = e.value;
				
				if (!s)                                                            // view_details.jsxi:42
					s = '';                                                        // view_details.jsxi:42
				
				if (c != s)                                                        // view_details.jsxi:43
					e.value = s;                                                   // view_details.jsxi:43
			}
			return e;                                                              // view_details.jsxi:46
		}
		
		var he = $('#selected-car'),                                               // view_details.jsxi:49
			de = $('#selected-car-desc'),                                          // view_details.jsxi:50
			ta = $('#selected-car-tags'),                                          // view_details.jsxi:51
			pr = $('#selected-car-properties');                                    // view_details.jsxi:52
		
		he.attr('title', car.path);                                                // view_details.jsxi:53
		
		if (car.data){                                                             // view_details.jsxi:54
			val(he.removeAttr('readonly'), car.data.name);                         // view_details.jsxi:55
			val(de.removeAttr('readonly'), car.data.description);                  // view_details.jsxi:56
			de.elastic();                                                          // view_details.jsxi:57
			ta.show().find('li').remove();                                         // view_details.jsxi:59
			car.data.tags.forEach((function (e){                                   // view_details.jsxi:60
				$('<li>').text(e).insertBefore(this);                              // view_details.jsxi:61
			}).bind(ta.find('input')));                                            // view_details.jsxi:62
			updateTags(car.data.tags);                                             // view_details.jsxi:63
			pr.show();                                                             // view_details.jsxi:65
			val('#selected-car-brand', car.data.brand);                            // view_details.jsxi:66
			val('#selected-car-class', car.data.class);                            // view_details.jsxi:67
			val('#selected-car-year', car.data.year);                              // view_details.jsxi:69
			val('#selected-car-country', car.data.country);                        // view_details.jsxi:70
			val('#selected-car-author',                                            // view_details.jsxi:71
				car.data.author ? car.data.author + (car.data.version ? ' (' + car.data.version + ')' : '') : car.data.version).title = car.data.url || '';
			val('#selected-car-bhp', car.data.specs.bhp);                          // view_details.jsxi:73
			val('#selected-car-torque', car.data.specs.torque);                    // view_details.jsxi:74
			val('#selected-car-weight', car.data.specs.weight);                    // view_details.jsxi:75
			val('#selected-car-topspeed', car.data.specs.topspeed);                // view_details.jsxi:76
			val('#selected-car-acceleration', car.data.specs.acceleration);        // view_details.jsxi:77
			val('#selected-car-pwratio', car.data.specs.pwratio);                  // view_details.jsxi:78
			updateParents(car);                                                    // view_details.jsxi:80
			
			if (car.parent && !car.hasError('upgrade-missing')){                   // view_details.jsxi:82
				$('#selected-car-upgrade').show().attr('src', car.upgrade);        // view_details.jsxi:83
			} else {
				$('#selected-car-upgrade').hide();                                 // view_details.jsxi:85
			}
		} else {
			he.attr('readonly', true).val(car.id);                                 // view_details.jsxi:88
			de.attr('readonly', true).val('');                                     // view_details.jsxi:89
			ta.hide();                                                             // view_details.jsxi:90
			pr.hide();                                                             // view_details.jsxi:91
		}
	}
	
	function outDisabled(car){                                                     // view_details.jsxi:95
		$('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');      // view_details.jsxi:96
		$('#selected-car-header').toggleClass('disabled', car.disabled);           // view_details.jsxi:97
	}
	
	function outChanged(car){                                                      // view_details.jsxi:100
		$('#selected-car-header').toggleClass('changed', car.changed);             // view_details.jsxi:101
	}
	
	function outSkins(car){                                                        // view_details.jsxi:104
		if (!car.skins || !car.skins[0])                                           // view_details.jsxi:105
			return;
		
		if (!car.selectedSkin){                                                    // view_details.jsxi:106
			car.selectSkin(car.skins[0].id);                                       // view_details.jsxi:107
			return;
		}
		
		setTimeout(function (){                                                    // view_details.jsxi:111
			if (car !== _selected)                                                 // view_details.jsxi:112
				return;
			
			var sa = $('#selected-car-skins-article'),                             // view_details.jsxi:113
				sp = $('#selected-car-preview'),                                   // view_details.jsxi:114
				ss = $('#selected-car-skins');                                     // view_details.jsxi:115
			
			if (car.skins){                                                        // view_details.jsxi:116
				sa.show();                                                         // view_details.jsxi:117
				ss.empty();                                                        // view_details.jsxi:118
				sp.attr({                                                          // view_details.jsxi:120
					'data-id': car.selectedSkin.id,                                // view_details.jsxi:120
					'src': (car.selectedSkin.preview + '?' + Math.random()).cssUrl()
				});
				car.skins.forEach(function (e){                                    // view_details.jsxi:125
					var i = $('<img>').attr({                                      // view_details.jsxi:126
						'data-id': e.id,                                           // view_details.jsxi:126
						'title': e.displayName,                                    // view_details.jsxi:128
						'src': e.livery.cssUrl()
					}).appendTo(ss);                                               // view_details.jsxi:130
					
					if (e === car.selectedSkin){                                   // view_details.jsxi:131
						i.addClass('selected');                                    // view_details.jsxi:132
					}
				});
			} else {
				sa.hide();                                                         // view_details.jsxi:136
			}
		}, 
		50);
	}
	
	function updateParents(car){                                                   // view_details.jsxi:141
		var s = document.getElementById('selected-car-parent');
		
		if (!s)                                                                    // view_details.jsxi:144
			return;
		
		if (car.children.length > 0){                                              // view_details.jsxi:146
			s.parentNode.style.display = 'none';                                   // view_details.jsxi:147
		} else {
			s.parentNode.style.display = null;                                     // view_details.jsxi:149
			s.innerHTML = '<option value="">None</option>' + Cars.list.filter(function (e){
				return e.data && !e.disabled && e.parent == null && e.id != car.id && (!car.parent || car.parent.id != car.id);
			}).map(function (e){                                                   // view_details.jsxi:153
				return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);
			}).join('');                                                           // view_details.jsxi:155
			s.value = car.parent && car.parent.id || '';                           // view_details.jsxi:157
		}
	}
	
	function updateTags(l){                                                        // view_details.jsxi:161
		var t = document.getElementById('tags-filtered');
		
		if (t){                                                                    // view_details.jsxi:164
			document.body.removeChild(t);                                          // view_details.jsxi:165
		}
		
		t = document.body.appendChild(document.createElement('datalist'));         // view_details.jsxi:168
		t.id = 'tags-filtered';                                                    // view_details.jsxi:169
		
		var n = l.map(function (e){                                                // view_details.jsxi:171
			return e.toLowerCase();                                                // view_details.jsxi:172
		});
		
		Cars.tags.forEach(function (v){                                            // view_details.jsxi:175
			if (n.indexOf(v.toLowerCase()) < 0){                                   // view_details.jsxi:176
				t.appendChild(document.createElement('option')).setAttribute('value', v);
			}
		});
	}
	
	function applyTags(){                                                          // view_details.jsxi:182
		if (!_selected || !_selected.data)                                         // view_details.jsxi:183
			return;
		
		Cars.changeData(_selected,                                                 // view_details.jsxi:184
			'tags',                                                                // view_details.jsxi:184
			Array.prototype.map.call(document.querySelectorAll('#selected-car-tags li'), 
				function (a){                                                      // view_details.jsxi:185
					return a.textContent;                                          // view_details.jsxi:185
				}));
		updateTags(_selected.data.tags);                                           // view_details.jsxi:186
	}
	
	function init(){                                                               // view_details.jsxi:189
		Cars.on('scan:ready',                                                      // view_details.jsxi:190
			function (list){                                                       // view_details.jsxi:191
				if (list.length == 0){                                             // view_details.jsxi:192
					outMsg('Hmm...', 'Cars not found');                            // view_details.jsxi:193
				}
				
				$('main').show();                                                  // view_details.jsxi:196
			}).on('error',                                                         // view_details.jsxi:198
			function (car){                                                        // view_details.jsxi:198
				if (_selected != car)                                              // view_details.jsxi:199
					return;
				
				outErrors(car);                                                    // view_details.jsxi:200
			}).on('update.car.badge',                                              // view_details.jsxi:202
			function (car){                                                        // view_details.jsxi:202
				if (_selected != car)                                              // view_details.jsxi:203
					return;
				
				outBadge(car);                                                     // view_details.jsxi:204
			}).on('update.car.data',                                               // view_details.jsxi:206
			function (car){                                                        // view_details.jsxi:206
				if (_selected != car)                                              // view_details.jsxi:207
					return;
				
				outData(car);                                                      // view_details.jsxi:208
			}).on('update.car.skins',                                              // view_details.jsxi:210
			function (car){                                                        // view_details.jsxi:210
				if (_selected != car)                                              // view_details.jsxi:211
					return;
				
				outSkins(car);                                                     // view_details.jsxi:212
			}).on('update.car.disabled',                                           // view_details.jsxi:214
			function (car){                                                        // view_details.jsxi:214
				if (_selected != car)                                              // view_details.jsxi:215
					return;
				
				outDisabled(car);                                                  // view_details.jsxi:216
			}).on('update.car.changed',                                            // view_details.jsxi:218
			function (car){                                                        // view_details.jsxi:218
				if (_selected != car)                                              // view_details.jsxi:219
					return;
				
				outChanged(car);                                                   // view_details.jsxi:220
			});
		ViewList.on('select',                                                      // view_details.jsxi:223
			function (car){                                                        // view_details.jsxi:224
				$('main').show();                                                  // view_details.jsxi:225
				_selected = car;                                                   // view_details.jsxi:227
				car.loadEnsure();                                                  // view_details.jsxi:228
				
				if (car){                                                          // view_details.jsxi:230
					outMsg(null);                                                  // view_details.jsxi:231
				} else {
					return;
				}
				
				outData(car);                                                      // view_details.jsxi:236
				outBadge(car);                                                     // view_details.jsxi:237
				outDisabled(car);                                                  // view_details.jsxi:238
				outChanged(car);                                                   // view_details.jsxi:239
				outErrors(car);                                                    // view_details.jsxi:240
				outSkins(car);                                                     // view_details.jsxi:241
			});
		$('#selected-car').on('keydown',                                           // view_details.jsxi:245
			function (e){                                                          // view_details.jsxi:246
				if (e.keyCode == 13){                                              // view_details.jsxi:247
					this.blur();                                                   // view_details.jsxi:248
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:252
			function (){                                                           // view_details.jsxi:252
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:253
					return;
				
				this.value = this.value.slice(0, 64);                              // view_details.jsxi:254
				Cars.changeData(_selected, 'name', this.value);                    // view_details.jsxi:255
			});
		$('#selected-car-tags').on('click',                                        // view_details.jsxi:258
			function (e){                                                          // view_details.jsxi:259
				if (e.target.tagName === 'LI' && e.target.offsetWidth - e.offsetX < 20){
					e.target.parentNode.removeChild(e.target);                     // view_details.jsxi:261
					applyTags();                                                   // view_details.jsxi:262
				} else {
					this.querySelector('input').focus();                           // view_details.jsxi:264
				}
			}).on('contextmenu',                                                   // view_details.jsxi:267
			function (e){                                                          // view_details.jsxi:267
				if (!_selected || !_selected.data)                                 // view_details.jsxi:268
					return;
				
				if (e.target.tagName !== 'LI')                                     // view_details.jsxi:269
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:272
					label: 'Filter Tag',                                           // view_details.jsxi:272
					key: 'F',                                                      // view_details.jsxi:272
					click: (function (){                                           // view_details.jsxi:272
						if (!_selected)                                            // view_details.jsxi:273
							return;
						
						ViewList.addFilter('tag:' + e.target.textContent);         // view_details.jsxi:274
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:277
				return false;
			});
		$('#selected-car-tags input').on('change',                                 // view_details.jsxi:281
			function (){                                                           // view_details.jsxi:282
				if (this.value){                                                   // view_details.jsxi:283
					this.parentNode.insertBefore(document.createElement('li'), this).textContent = this.value;
					this.value = '';                                               // view_details.jsxi:285
					applyTags();                                                   // view_details.jsxi:286
				}
			}).on('keydown',                                                       // view_details.jsxi:289
			function (e){                                                          // view_details.jsxi:289
				if (e.keyCode == 8 && this.value == ''){                           // view_details.jsxi:290
					this.parentNode.removeChild(this.parentNode.querySelector('li:last-of-type'));
					applyTags();                                                   // view_details.jsxi:292
				}
			});
		$('#selected-car-desc').elastic().on('change',                             // view_details.jsxi:296
			function (){                                                           // view_details.jsxi:297
				if (!_selected || this.readonly)                                   // view_details.jsxi:298
					return;
				
				Cars.changeData(_selected, 'description', this.value);             // view_details.jsxi:299
			});
		$('#selected-car-brand').on('keydown',                                     // view_details.jsxi:302
			function (e){                                                          // view_details.jsxi:303
				if (e.keyCode == 13){                                              // view_details.jsxi:304
					this.blur();                                                   // view_details.jsxi:305
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:309
			function (e){                                                          // view_details.jsxi:309
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:310
					return;
				
				Cars.changeData(_selected, 'brand', this.value);                   // view_details.jsxi:311
			}).on('contextmenu',                                                   // view_details.jsxi:313
			function (e){                                                          // view_details.jsxi:313
				if (!_selected || !_selected.data)                                 // view_details.jsxi:314
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:317
					label: 'Filter Brand',                                         // view_details.jsxi:317
					key: 'F',                                                      // view_details.jsxi:317
					click: (function (){                                           // view_details.jsxi:317
						if (!_selected)                                            // view_details.jsxi:318
							return;
						
						ViewList.addFilter('brand:' + _selected.data.brand);       // view_details.jsxi:319
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:322
				return false;
			});
		$('#selected-car-class').on('keydown',                                     // view_details.jsxi:326
			function (e){                                                          // view_details.jsxi:327
				if (e.keyCode == 13){                                              // view_details.jsxi:328
					this.blur();                                                   // view_details.jsxi:329
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:333
			function (){                                                           // view_details.jsxi:333
				if (!_selected || this.readonly)                                   // view_details.jsxi:334
					return;
				
				Cars.changeData(_selected, 'class', this.value);                   // view_details.jsxi:335
			}).on('contextmenu',                                                   // view_details.jsxi:337
			function (e){                                                          // view_details.jsxi:337
				if (!_selected || !_selected.data || !_selected.data.class)        // view_details.jsxi:338
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:341
					label: 'Filter Class',                                         // view_details.jsxi:341
					key: 'F',                                                      // view_details.jsxi:341
					click: (function (){                                           // view_details.jsxi:341
						if (!_selected)                                            // view_details.jsxi:342
							return;
						
						ViewList.addFilter('class:' + _selected.data.class);       // view_details.jsxi:343
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:346
				return false;
			});
		$('#selected-car-year').on('keydown',                                      // view_details.jsxi:350
			function (e){                                                          // view_details.jsxi:351
				if (e.keyCode == 13){                                              // view_details.jsxi:352
					this.blur();                                                   // view_details.jsxi:353
					return false;
				}
				
				if (e.keyCode == 37){                                              // view_details.jsxi:357
					this.value = + this.value + 1;                                 // view_details.jsxi:358
					return false;
				}
				
				if (e.keyCode == 39){                                              // view_details.jsxi:362
					this.value = + this.value - 1;                                 // view_details.jsxi:363
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:367
			function (){                                                           // view_details.jsxi:367
				if (!_selected || this.readonly)                                   // view_details.jsxi:368
					return;
				
				Cars.changeData(_selected, 'year', this.value);                    // view_details.jsxi:369
			}).on('contextmenu',                                                   // view_details.jsxi:371
			function (e){                                                          // view_details.jsxi:371
				if (!_selected || !_selected.data || !_selected.data.year)         // view_details.jsxi:372
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:375
					label: 'Filter Year',                                          // view_details.jsxi:375
					key: 'F',                                                      // view_details.jsxi:375
					click: (function (){                                           // view_details.jsxi:375
						if (!_selected)                                            // view_details.jsxi:376
							return;
						
						ViewList.addFilter('year:' + _selected.data.year);         // view_details.jsxi:377
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:379
					label: 'Filter Decade',                                        // view_details.jsxi:379
					click: (function (){                                           // view_details.jsxi:379
						if (!_selected)                                            // view_details.jsxi:380
							return;
						
						ViewList.addFilter('year:' + (('' + _selected.data.year).slice(0, - 1) + '?'));
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:384
				return false;
			});
		$('#selected-car-country').on('keydown',                                   // view_details.jsxi:388
			function (e){                                                          // view_details.jsxi:389
				if (e.keyCode == 13){                                              // view_details.jsxi:390
					this.blur();                                                   // view_details.jsxi:391
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:395
			function (){                                                           // view_details.jsxi:395
				if (!_selected || this.readonly)                                   // view_details.jsxi:396
					return;
				
				Cars.changeData(_selected, 'country', this.value);                 // view_details.jsxi:397
			}).on('contextmenu',                                                   // view_details.jsxi:399
			function (e){                                                          // view_details.jsxi:399
				if (!_selected || !_selected.data || !_selected.data.country)      // view_details.jsxi:400
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:403
					label: 'Filter Country',                                       // view_details.jsxi:403
					key: 'F',                                                      // view_details.jsxi:403
					click: (function (){                                           // view_details.jsxi:403
						if (!_selected)                                            // view_details.jsxi:404
							return;
						
						ViewList.addFilter('country:' + _selected.data.country);   // view_details.jsxi:405
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:408
				return false;
			});
		$('#selected-car-parent').on('change',                                     // view_details.jsxi:412
			function (e){                                                          // view_details.jsxi:413
				if (!_selected)                                                    // view_details.jsxi:414
					return;
				
				var t = this, v = this.value || null;
				
				if (v && !fs.existsSync(_selected.upgrade)){                       // view_details.jsxi:417
					UpgradeEditor.start(_selected,                                 // view_details.jsxi:418
						function (arg){                                            // view_details.jsxi:418
							if (fs.existsSync(_selected.upgrade)){                 // view_details.jsxi:419
								fn();                                              // view_details.jsxi:420
							} else {
								t.value = '';                                      // view_details.jsxi:422
							}
						});
				} else {
					fn();                                                          // view_details.jsxi:426
				}
				
				function fn(){                                                     // view_details.jsxi:429
					_selected.changeParent(v);                                     // view_details.jsxi:430
				}
			});
		$('#selected-car-author').on('click',                                      // view_details.jsxi:434
			function (){                                                           // view_details.jsxi:435
				if (!_selected || !_selected.data)                                 // view_details.jsxi:436
					return;
				
				var a, v, u;
				
				var d = new Dialog('In-Game Car Model',                            // view_details.jsxi:440
					[
						'<label>Author: <input id="car-details-edit-author" autocomplete list="authors" placeholder="?" value="' + (_selected.data.author || '') + '"></label>', 
						'<label>Version: <input id="car-details-edit-version" placeholder="?" value="' + (_selected.data.version || '') + '"></label>', 
						'<label>URL: <input id="car-details-edit-url" placeholder="?" value="' + (_selected.data.url || '') + '"></label>'
					], 
					function (){                                                   // view_details.jsxi:444
						if (!_selected)                                            // view_details.jsxi:445
							return;
						
						if (a != null)                                             // view_details.jsxi:446
							_selected.changeData('author', a);                     // view_details.jsxi:446
						
						if (v != null)                                             // view_details.jsxi:447
							_selected.changeData('version', v);                    // view_details.jsxi:447
						
						if (u != null)                                             // view_details.jsxi:448
							_selected.changeData('url', u);                        // view_details.jsxi:448
					});
				
				d.content.find('#car-details-edit-author').change(function (arg){
					return a = this.value;                                         // view_details.jsxi:451
				});
				d.content.find('#car-details-edit-version').change(function (arg){
					return v = this.value;                                         // view_details.jsxi:452
				});
				d.content.find('#car-details-edit-url').change(function (arg){     // view_details.jsxi:453
					return u = this.value;                                         // view_details.jsxi:453
				});
			}).on('dblclick',                                                      // view_details.jsxi:455
			function (){                                                           // view_details.jsxi:455
				if (!_selected || !_selected.data || !_selected.data.url)          // view_details.jsxi:456
					return;
				
				Shell.openItem(_selected.data.url);                                // view_details.jsxi:457
			}).on('contextmenu',                                                   // view_details.jsxi:459
			function (e){                                                          // view_details.jsxi:459
				if (!_selected || !_selected.data || !_selected.data.author)       // view_details.jsxi:460
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:463
					label: 'Filter Author',                                        // view_details.jsxi:463
					key: 'F',                                                      // view_details.jsxi:463
					click: (function (){                                           // view_details.jsxi:463
						if (!_selected)                                            // view_details.jsxi:464
							return;
						
						ViewList.addFilter('author:' + _selected.data.author);     // view_details.jsxi:465
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:468
				return false;
			});
		[
			'bhp',                                                                 // view_details.jsxi:472
			'torque',                                                              // view_details.jsxi:472
			'weight',                                                              // view_details.jsxi:472
			'topspeed',                                                            // view_details.jsxi:472
			'acceleration',                                                        // view_details.jsxi:472
			'pwratio'
		].forEach(function (e){                                                    // view_details.jsxi:472
			$('#selected-car-' + e).on('keydown',                                  // view_details.jsxi:473
				function (e){                                                      // view_details.jsxi:473
					if (e.keyCode == 13){                                          // view_details.jsxi:474
						this.blur();                                               // view_details.jsxi:475
						return false;
					}
				}).on('keyup keydown keypress',                                    // view_details.jsxi:478
				function (e){                                                      // view_details.jsxi:478
					if (e.keyCode == 32){                                          // view_details.jsxi:479
						e.stopPropagation();                                       // view_details.jsxi:480
						
						if (e.type === 'keyup'){                                   // view_details.jsxi:481
							return false;
						}
					}
				}).on('change',                                                    // view_details.jsxi:485
				function (){                                                       // view_details.jsxi:485
					if (!_selected || this.readonly)                               // view_details.jsxi:486
						return;
					
					Cars.changeDataSpecs(_selected, e, this.value);                // view_details.jsxi:487
				});
		});
		$('#selected-car-pwratio').on('dblclick contextmenu',                      // view_details.jsxi:491
			function (e){                                                          // view_details.jsxi:492
				if (!_selected || !_selected.data || this.readonly)                // view_details.jsxi:493
					return;
				
				function r(){                                                      // view_details.jsxi:495
					if (!_selected || this.readonly)                               // view_details.jsxi:496
						return;
					
					_selected.recalculatePwRatio();                                // view_details.jsxi:497
				}
				
				if (e.type === 'dblclick'){                                        // view_details.jsxi:500
					r();                                                           // view_details.jsxi:501
				} else {
					var menu = new gui.Menu();
					
					menu.append(new gui.MenuItem({ label: 'Recalculate', key: 'R', click: r }));
					menu.popup(e.clientX, e.clientY);                              // view_details.jsxi:505
					return false;
				}
			});
		$('#selected-car-logo').on('click',                                        // view_details.jsxi:511
			function (){                                                           // view_details.jsxi:512
				if (!_selected)                                                    // view_details.jsxi:513
					return;
				
				BadgeEditor.start(_selected);                                      // view_details.jsxi:514
			});
		$('#selected-car-upgrade').on('click',                                     // view_details.jsxi:517
			function (){                                                           // view_details.jsxi:518
				if (!_selected)                                                    // view_details.jsxi:519
					return;
				
				UpgradeEditor.start(_selected);                                    // view_details.jsxi:520
			});
		$('#selected-car-skins-article').dblclick(function (e){                    // view_details.jsxi:524
			if (!_selected)                                                        // view_details.jsxi:526
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:527
		}).on('contextmenu',                                                       // view_details.jsxi:529
			function (e){                                                          // view_details.jsxi:529
				if (!_selected)                                                    // view_details.jsxi:530
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:533
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:536
					label: 'Open in Showroom',                                     // view_details.jsxi:536
					key: 'S',                                                      // view_details.jsxi:536
					click: (function (){                                           // view_details.jsxi:536
						if (!_selected)                                            // view_details.jsxi:537
							return;
						
						AcShowroom.start(_selected, id);                           // view_details.jsxi:538
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:540
					label: 'Open in Custom Showroom (Experimental)',               // view_details.jsxi:540
					click: (function (){                                           // view_details.jsxi:540
						if (!_selected)                                            // view_details.jsxi:541
							return;
						
						try {
							AcTools.Utils.Kn5RenderWrapper.StartDarkRoomPreview(_selected.path, id);
						} catch (err){                                             // view_details.jsxi:544
							ErrorHandler.handled('Cannot start Custom Showroom.', err);
							return;
						} 
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:549
					label: 'Start Practice',                                       // view_details.jsxi:549
					key: 'P',                                                      // view_details.jsxi:549
					click: (function (){                                           // view_details.jsxi:549
						if (!_selected)                                            // view_details.jsxi:550
							return;
						
						AcPractice.start(_selected, id);                           // view_details.jsxi:551
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:553
					label: 'Folder',                                               // view_details.jsxi:553
					click: (function (){                                           // view_details.jsxi:553
						if (!_selected)                                            // view_details.jsxi:554
							return;
						
						Shell.openItem(_selected.getSkin(id).path);                // view_details.jsxi:555
					})
				}));
				menu.append(new gui.MenuItem({ type: 'separator' }));              // view_details.jsxi:558
				
				var autoUpdateLivery = new gui.MenuItem({ label: 'Update Livery', submenu: new gui.Menu() });
				
				menu.append(autoUpdateLivery);                                     // view_details.jsxi:561
				autoUpdateLivery = autoUpdateLivery.submenu;                       // view_details.jsxi:562
				autoUpdateLivery.append(new gui.MenuItem({                         // view_details.jsxi:564
					label: 'From Preview',                                         // view_details.jsxi:564
					click: (function (){                                           // view_details.jsxi:564
						if (!_selected)                                            // view_details.jsxi:565
							return;
						
						var skin = _selected.getSkin(id);
						
						try {
							AcTools.Utils.ImageUtils.GenerateLivery(skin.preview, skin.livery);
							_selected.loadSkins();                                 // view_details.jsxi:569
						} catch (err){                                             // view_details.jsxi:570
							ErrorHandler.handled('Cannot update livery.', err);    // view_details.jsxi:571
							return;
						} 
					})
				}));
				autoUpdateLivery.append(new gui.MenuItem({                         // view_details.jsxi:576
					label: 'With Custom Showroom',                                 // view_details.jsxi:576
					click: (function (){                                           // view_details.jsxi:576
						if (!_selected)                                            // view_details.jsxi:577
							return;
						
						var skin = _selected.getSkin(id);
						
						try {
							AcTools.Utils.Kn5RenderWrapper.GenerateLivery(_selected.path, skin.id, skin.livery);
							_selected.loadSkins();                                 // view_details.jsxi:581
						} catch (err){                                             // view_details.jsxi:582
							ErrorHandler.handled('Cannot update livery.', err);    // view_details.jsxi:583
							return;
						} 
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:592
				return false;
			});
		$('#selected-car-skins').on('click',                                       // view_details.jsxi:597
			function (e){                                                          // view_details.jsxi:598
				if (!_selected)                                                    // view_details.jsxi:599
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:602
					return;
				
				_selected.selectSkin(id);                                          // view_details.jsxi:604
			});
		$('#selected-car-error').click(function (e){                               // view_details.jsxi:608
			if (!_selected)                                                        // view_details.jsxi:609
				return;
			
			var id = e.target.getAttribute('data-error-id');
			
			if (id){                                                               // view_details.jsxi:611
				RestorationWizard.fix(_selected, id);                              // view_details.jsxi:612
			}
		});
		$(window).on('keydown',                                                    // view_details.jsxi:617
			function (e){                                                          // view_details.jsxi:618
				if (!_selected)                                                    // view_details.jsxi:619
					return;
				
				if (e.keyCode == 83 && e.ctrlKey){                                 // view_details.jsxi:621
					_selected.save();                                              // view_details.jsxi:623
					return false;
				}
			});
		
		var cmIgnore = false;
		
		$('main').on('contextmenu',                                                // view_details.jsxi:630
			function (){                                                           // view_details.jsxi:631
				this.querySelector('footer').classList.toggle('active');           // view_details.jsxi:632
				cmIgnore = true;                                                   // view_details.jsxi:633
			});
		$(window).on('click contextmenu',                                          // view_details.jsxi:636
			(function (e){                                                         // view_details.jsxi:637
				if (cmIgnore){                                                     // view_details.jsxi:638
					cmIgnore = false;                                              // view_details.jsxi:639
				} else if (e.target !== this){                                     // view_details.jsxi:640
					this.classList.remove('active');                               // view_details.jsxi:641
				}
			}).bind($('main footer')[0]));                                         // view_details.jsxi:643
		$('#selected-car-open-directory').click(function (){                       // view_details.jsxi:646
			if (!_selected)                                                        // view_details.jsxi:647
				return;
			
			Shell.openItem(_selected.path);                                        // view_details.jsxi:648
		});
		$('#selected-car-showroom').click(function (){                             // view_details.jsxi:651
			if (!_selected)                                                        // view_details.jsxi:652
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:653
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:656
			if (!_selected)                                                        // view_details.jsxi:657
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:658
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:661
			if (!_selected)                                                        // view_details.jsxi:662
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:663
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:666
			if (!_selected)                                                        // view_details.jsxi:667
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:668
		});
		$('#selected-car-practice').click(function (){                             // view_details.jsxi:671
			if (!_selected)                                                        // view_details.jsxi:672
				return;
			
			AcPractice.start(_selected);                                           // view_details.jsxi:673
		});
		$('#selected-car-practice-select').click(function (){                      // view_details.jsxi:676
			if (!_selected)                                                        // view_details.jsxi:677
				return;
			
			AcPractice.select(_selected);                                          // view_details.jsxi:678
		});
		$('#selected-car-reload').click(function (){                               // view_details.jsxi:681
			if (!_selected)                                                        // view_details.jsxi:682
				return;
			
			if (_selected.changed){                                                // view_details.jsxi:684
				new Dialog('Reload',                                               // view_details.jsxi:685
					[ 'Your changes will be lost. Are you sure?' ], 
					reload);                                                       // view_details.jsxi:687
			} else {
				reload();                                                          // view_details.jsxi:689
			}
			
			function reload(){                                                     // view_details.jsxi:692
				if (!_selected)                                                    // view_details.jsxi:693
					return;
				
				_selected.reload();                                                // view_details.jsxi:694
			}
		});
		$('#selected-car-test').click(function (){                                 // view_details.jsxi:698
			if (!_selected)                                                        // view_details.jsxi:699
				return;
			
			_selected.testAcd();                                                   // view_details.jsxi:700
		});
		$('#selected-car-save').click(function (){                                 // view_details.jsxi:704
			if (!_selected)                                                        // view_details.jsxi:705
				return;
			
			_selected.save();                                                      // view_details.jsxi:706
		});
		$('#selected-car-update-description').click(function (){                   // view_details.jsxi:709
			if (!_selected)                                                        // view_details.jsxi:710
				return;
			
			UpdateDescription.update(_selected);                                   // view_details.jsxi:711
		});
		$('#selected-car-update-previews').click(function (){                      // view_details.jsxi:714
			if (!_selected)                                                        // view_details.jsxi:715
				return;
			
			AcShowroom.shot(_selected);                                            // view_details.jsxi:716
		});
		$('#selected-car-update-previews-manual').click(function (){               // view_details.jsxi:719
			if (!_selected)                                                        // view_details.jsxi:720
				return;
			
			AcShowroom.shot(_selected, true);                                      // view_details.jsxi:721
		});
		$('#selected-car-disable').click(function (){                              // view_details.jsxi:724
			if (!_selected)                                                        // view_details.jsxi:725
				return;
			
			_selected.toggle();                                                    // view_details.jsxi:726
		});
		$('#selected-car-additional').on('click contextmenu',                      // view_details.jsxi:729
			function (e){                                                          // view_details.jsxi:729
				if (!_selected)                                                    // view_details.jsxi:730
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:734
					label: 'Update Ambient Shadows',                               // view_details.jsxi:734
					click: (function (){                                           // view_details.jsxi:734
						$('main footer').removeClass('active');                    // view_details.jsxi:735
						
						if (!_selected)                                            // view_details.jsxi:736
							return;
						
						try {
							AcTools.Utils.Kn5RenderWrapper.UpdateAmbientShadows(_selected.path);
						} catch (err){                                             // view_details.jsxi:740
							ErrorHandler.handled('Cannot update shadows.', err);   // view_details.jsxi:741
							return;
						} 
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:746
					label: 'Change Body Ambient Shadow Size',                      // view_details.jsxi:746
					click: (function (){                                           // view_details.jsxi:746
						$('main footer').removeClass('active');                    // view_details.jsxi:747
						
						if (!_selected)                                            // view_details.jsxi:748
							return;
						
						var currentSize = AcTools.Utils.Kn5RenderWrapper.GetBodyAmbientShadowSize(_selected.path).split(',');
						
						var d = new Dialog('Body Ambient Shadow',                  // view_details.jsxi:751
							[
								'<h6>Size (in meters)</h6>',                       // view_details.jsxi:752
								'<label style="display:inline-block;width:160px;line-height:24px">Width: <input id="body-ambient-shadow-width" type="number" step="0.1" min="0.8" max="6.0" style="width: 80px;float: right;margin-right: 20px;"></label>', 
								'<label style="display:inline-block;width:160px;line-height:24px">Length: <input id="body-ambient-shadow-height" type="number" step="0.1" min="0.8" max="6.0" style="width: 80px;float: right;margin-right: 20px;"></label>'
							], 
							function (){                                           // view_details.jsxi:755
								var w = + d.content.find('#body-ambient-shadow-width').val();
								
								if (Number.isNaN(w))                               // view_details.jsxi:757
									w = currentSize[0];                            // view_details.jsxi:757
								
								var h = + d.content.find('#body-ambient-shadow-height').val();
								
								if (Number.isNaN(h))                               // view_details.jsxi:760
									h = currentSize[1];                            // view_details.jsxi:760
								
								AcTools.Utils.Kn5RenderWrapper.SetBodyAmbientShadowSize(_selected.path, w, h);
							});
						
						d.content.find('#body-ambient-shadow-width').val(currentSize[0]);
						d.content.find('#body-ambient-shadow-height').val(currentSize[1]);
					})
				}));
				
				if (localStorage.developerMode){                                   // view_details.jsxi:780
					var devMenu = new gui.MenuItem({ label: 'Developer Tools', submenu: new gui.Menu() });
					
					menu.append(devMenu);                                          // view_details.jsxi:782
					devMenu = devMenu.submenu;                                     // view_details.jsxi:783
					devMenu.append(new gui.MenuItem({                              // view_details.jsxi:785
						label: 'Unpack KN5',                                       // view_details.jsxi:785
						click: (function (){                                       // view_details.jsxi:785
							$('main footer').removeClass('active');                // view_details.jsxi:786
							
							if (!_selected)                                        // view_details.jsxi:787
								return;
							
							try {
								var kn5 = AcTools.Kn5File.Kn5.FromFile(AcTools.Utils.FileUtils.GetMainCarFile(AcDir.root, _selected.id));
								
								var dest = _selected.path + '/unpacked';
								
								if (fs.existsSync(dest))                           // view_details.jsxi:792
									AcTools.Utils.FileUtils.Recycle(dest);         // view_details.jsxi:792
								
								kn5.ExportDirectory(dest, false);                  // view_details.jsxi:793
								
								if (kn5.RootNode != null){                         // view_details.jsxi:794
									kn5.Export(AcTools.Kn5File.Kn5.ExportType.Collada, dest + '/model.dae');
								}
								
								Shell.openItem(dest);                              // view_details.jsxi:797
							} catch (err){                                         // view_details.jsxi:798
								ErrorHandler.handled('Failed.', err);              // view_details.jsxi:799
							} 
						})
					}));
					
					if (fs.existsSync(_selected.path + '/unpacked'))               // view_details.jsxi:803
						devMenu.append(new gui.MenuItem({                          // view_details.jsxi:803
							label: 'Repack KN5',                                   // view_details.jsxi:803
							click: (function (){                                   // view_details.jsxi:803
								$('main footer').removeClass('active');            // view_details.jsxi:804
								
								if (!_selected)                                    // view_details.jsxi:805
									return;
								
								try {
									var kn5 = AcTools.Kn5File.Kn5.FromDirectory(_selected.path + '/unpacked', false);
									
									var dest = AcTools.Utils.FileUtils.GetMainCarFile(AcDir.root, _selected.id);
									
									if (fs.existsSync(dest))                       // view_details.jsxi:810
										AcTools.Utils.FileUtils.Recycle(dest);     // view_details.jsxi:810
									
									kn5.Save(dest, false);                         // view_details.jsxi:811
								} catch (err){                                     // view_details.jsxi:812
									ErrorHandler.handled('Failed.', err);          // view_details.jsxi:813
								} 
							})
						}));
					
					if (fs.existsSync(_selected.path + '/data.acd'))               // view_details.jsxi:817
						devMenu.append(new gui.MenuItem({                          // view_details.jsxi:817
							label: 'Unpack data',                                  // view_details.jsxi:817
							click: (function (){                                   // view_details.jsxi:817
								$('main footer').removeClass('active');            // view_details.jsxi:818
								
								if (!_selected)                                    // view_details.jsxi:819
									return;
								
								try {
									var source = _selected.path + '/data.acd';
									
									var acd = AcTools.AcdFile.Acd.FromFile(source);
									
									var dest = _selected.path + '/data';
									
									if (fs.existsSync(dest))                       // view_details.jsxi:825
										AcTools.Utils.FileUtils.Recycle(dest);     // view_details.jsxi:825
									
									acd.ExportDirectory(dest);                     // view_details.jsxi:826
									Shell.openItem(dest);                          // view_details.jsxi:827
									AcTools.Utils.FileUtils.Recycle(source);       // view_details.jsxi:828
								} catch (err){                                     // view_details.jsxi:829
									ErrorHandler.handled('Failed.', err);          // view_details.jsxi:830
								} 
							})
						}));
					
					if (fs.existsSync(_selected.path + '/data'))                   // view_details.jsxi:834
						devMenu.append(new gui.MenuItem({                          // view_details.jsxi:834
							label: 'Pack data',                                    // view_details.jsxi:834
							click: (function (){                                   // view_details.jsxi:834
								$('main footer').removeClass('active');            // view_details.jsxi:835
								
								if (!_selected)                                    // view_details.jsxi:836
									return;
								
								try {
									var source = _selected.path + '/data';
									
									var acd = AcTools.AcdFile.Acd.FromDirectory(source);
									
									var dest = _selected.path + '/data.acd';
									
									if (fs.existsSync(dest))                       // view_details.jsxi:842
										AcTools.Utils.FileUtils.Recycle(dest);     // view_details.jsxi:842
									
									acd.Save(dest);                                // view_details.jsxi:843
									AcTools.Utils.FileUtils.Recycle(source);       // view_details.jsxi:844
								} catch (err){                                     // view_details.jsxi:845
									ErrorHandler.handled('Failed.', err);          // view_details.jsxi:846
								} 
							})
						}));
				}
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:851
					label: 'Delete car',                                           // view_details.jsxi:851
					click: (function (){                                           // view_details.jsxi:851
						$('main footer').removeClass('active');                    // view_details.jsxi:852
						
						if (!_selected)                                            // view_details.jsxi:853
							return;
						
						new Dialog('Delete ' + _selected.displayName,              // view_details.jsxi:855
							'Folder will be removed to the Recycle Bin. Are you sure?', 
							function (arg){                                        // view_details.jsxi:855
								if (!_selected)                                    // view_details.jsxi:856
									return;
								
								Cars.remove(_selected);                            // view_details.jsxi:857
							});
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:861
				return false;
			});
	}
	
	(function (){                                                                  // view_details.jsxi:866
		$(init);                                                                   // view_details.jsxi:867
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
		_sortFn = {                                                                // view_list.jsxi:147
			id: (function (a, b){                                                  // view_list.jsxi:147
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.id.localeCompare(b.id);
			}), 
			displayName: (function (a, b){                                         // view_list.jsxi:151
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.displayName.localeCompare(b.displayName);
			})
		}, 
		sortingEnabled = true;                                                     // view_list.jsxi:155
	
	function scrollToSelected(){                                                   // view_list.jsxi:10
		var n = _node[0].querySelector('.selected');
		
		if (!n)                                                                    // view_list.jsxi:12
			return;
		
		while (n && n.parentNode !== _node[0])                                     // view_list.jsxi:14
			n = n.parentNode;                                                      // view_list.jsxi:15
		
		var p = n.offsetTop - n.parentNode.scrollTop;
		
		if (p < 50){                                                               // view_list.jsxi:18
			n.parentNode.scrollTop += p - 50;                                      // view_list.jsxi:19
		} else if (p > n.parentNode.offsetHeight - 80){                            // view_list.jsxi:20
			n.parentNode.scrollTop += p + 80 - n.parentNode.offsetHeight;          // view_list.jsxi:21
		}
	}
	
	ViewList.select = function (car){                                              // view_list.jsxi:25
		_selected = car;                                                           // view_list.jsxi:26
		_node.find('.expand').removeClass('expand');                               // view_list.jsxi:27
		_node.find('.selected').removeClass('selected');                           // view_list.jsxi:28
		
		if (car){                                                                  // view_list.jsxi:30
			localStorage.selectedCar = car.id;                                     // view_list.jsxi:31
			
			var n = _node.find('[data-id="' + car.id + '"]').addClass('expand').parent().addClass('selected')[0];
			
			if (car.parent){                                                       // view_list.jsxi:34
				n = _node.find('[data-id="' + car.parent.id + '"]').addClass('expand')[0];
			}
			
			scrollToSelected();                                                    // view_list.jsxi:38
		}
		
		mediator.dispatch('select', car);                                          // view_list.jsxi:41
	};
	ViewList.selectNear = function (d){                                            // view_list.jsxi:44
		if (d === undefined)                                                       // view_list.jsxi:44
			d = 0;                                                                 // view_list.jsxi:44
	
		if (!_selected)                                                            // view_list.jsxi:45
			return ViewList.select(Cars.list[0]);
		
		var n = _node[0].querySelectorAll('[data-id]');
		
		for (var p, i = 0; i < n.length; i ++){                                    // view_list.jsxi:48
			if (n[i].getAttribute('data-id') === _selected.id){                    // view_list.jsxi:49
				p = i;                                                             // view_list.jsxi:50
				
				break;
			}
		}
		
		if (p == null)                                                             // view_list.jsxi:55
			return;
		
		if (d === 0)                                                               // view_list.jsxi:56
			d = p === n.length - 1 ? - 1 : 1;                                      // view_list.jsxi:56
		
		var j = n[(p + d + n.length) % n.length].getAttribute('data-id');
		
		ViewList.select(Cars.byName(j));
	};
	ViewList.filter = function (v){                                                // view_list.jsxi:61
		var i = _aside.find('#cars-list-filter')[0];
		
		if (i.value != v){                                                         // view_list.jsxi:63
			i.value = v;                                                           // view_list.jsxi:64
		}
		
		if (v){                                                                    // view_list.jsxi:67
			i.style.display = 'block';                                             // view_list.jsxi:68
			
			var s = v.trim().split(/\s+/);
			
			var brandFilter = '',                                                  // view_list.jsxi:71
				classFilter = '',                                                  // view_list.jsxi:72
				tagFilter = '',                                                    // view_list.jsxi:73
				countryFilter = '',                                                // view_list.jsxi:74
				yearFilter = '',                                                   // view_list.jsxi:75
				authorFilter = '';                                                 // view_list.jsxi:76
			
			var vv = s.filter(function (e){                                        // view_list.jsxi:78
				if (/^brand:(.*)/.test(e)){                                        // view_list.jsxi:79
					brandFilter = (brandFilter && brandFilter + '|') + RegExp.$1;
					return false;
				}
				
				if (/^class:(.*)/.test(e)){                                        // view_list.jsxi:84
					classFilter = (classFilter && classFilter + '|') + RegExp.$1;
					return false;
				}
				
				if (/^tag:(.*)/.test(e)){                                          // view_list.jsxi:89
					tagFilter = (tagFilter && tagFilter + '|') + RegExp.$1;        // view_list.jsxi:90
					return false;
				}
				
				if (/^country:(.*)/.test(e)){                                      // view_list.jsxi:94
					countryFilter = (countryFilter && countryFilter + '|') + RegExp.$1;
					return false;
				}
				
				if (/^author:(.*)/.test(e)){                                       // view_list.jsxi:99
					authorFilter = (authorFilter && authorFilter + '|') + RegExp.$1;
					return false;
				}
				
				if (/^year:(.*)/.test(e)){                                         // view_list.jsxi:104
					yearFilter = (yearFilter && yearFilter + '|') + RegExp.$1;     // view_list.jsxi:105
					return false;
				}
				return true;
			});
			
			var re = RegExp.fromQuery(vv.join(' '));
			
			var brandRe = brandFilter && RegExp.fromQuery(brandFilter, true);
			
			var classRe = classFilter && RegExp.fromQuery(classFilter, true);
			
			var tagRe = tagFilter && RegExp.fromQuery(tagFilter, true);
			
			var countryRe = countryFilter && RegExp.fromQuery(countryFilter, true);
			
			var authorRe = authorFilter && RegExp.fromQuery(authorFilter, true);   // view_list.jsxi:117
			
			var yearRe = yearFilter && RegExp.fromQuery(yearFilter, true);
			
			var f = function (car){                                                // view_list.jsxi:120
				if (brandRe && (!car.data || !brandRe.test(car.data.brand)) || classRe && (!car.data || !classRe.test(car.data.class)) || tagRe && (!car.data || !car.data.tags.some(tagRe.test.bind(tagRe))) || countryRe && (!car.data || !countryRe.test(car.data.country)) || yearRe && (!car.data || !yearRe.test(car.data.year)) || authorRe && (!car.data || !authorRe.test(car.data.author))){
					return false;
				} else {
					return re.test(car.id) || car.data && re.test(car.data.name);
				}
			};
			
			_aside.find('#cars-list > div > [data-id]').each(function (){          // view_list.jsxi:133
				this.parentNode.style.display = f(Cars.byName(this.getAttribute('data-id'))) ? null : 'none';
			});
		} else {
			i.style.display = 'hide';                                              // view_list.jsxi:137
			_aside.find('#cars-list > div').show();                                // view_list.jsxi:138
		}
	};
	ViewList.addFilter = function (v){                                             // view_list.jsxi:142
		var a = _aside.find('#cars-list-filter')[0].value;
		
		ViewList.filter((a && a + ' ') + v);
	};
	ViewList.sort = function (){                                                   // view_list.jsxi:157
		if (!sortingEnabled)                                                       // view_list.jsxi:158
			return;
		
		var sorted = Cars.list.sort(_sortFn.displayName);
		
		var listNode = _node[0];
		
		var children = Array.prototype.slice.call(listNode.children);
		
		for (var __j = 0; __j < sorted.length; __j ++){                            // view_list.jsxi:164
			var car = sorted[__j];
			
			for (var __i = 0; __i < children.length; __i ++){                      // view_list.jsxi:165
				var entry = children[__i];
				
				if (entry.children[0].getAttribute('data-id') === car.id){         // view_list.jsxi:166
					listNode.appendChild(entry);                                   // view_list.jsxi:167
					
					break;
				}
			}
		}
		
		scrollToSelected();                                                        // view_list.jsxi:173
	};
	
	function init(){                                                               // view_list.jsxi:176
		BatchProcessing.on('start',                                                // view_list.jsxi:177
			function (arg){                                                        // view_list.jsxi:178
				return sortingEnabled = false;                                     // view_list.jsxi:178
			}).on('end',                                                           // view_list.jsxi:179
			function (arg){                                                        // view_list.jsxi:179
				sortingEnabled = true;                                             // view_list.jsxi:180
				ViewList.sort();
			});
		Cars.on('scan:start',                                                      // view_list.jsxi:184
			function (){                                                           // view_list.jsxi:185
				_aside.find('#cars-list').empty();                                 // view_list.jsxi:186
				document.body.removeChild(_aside[0]);                              // view_list.jsxi:187
			}).on('scan:ready',                                                    // view_list.jsxi:189
			function (list){                                                       // view_list.jsxi:189
				_aside.find('#total-cars').text(list.filter(function (e){          // view_list.jsxi:190
					return e.parent == null;                                       // view_list.jsxi:191
				}).length).attr('title',                                           // view_list.jsxi:192
					'Including modded versions: {0}'.format(list.length));         // view_list.jsxi:192
				ViewList.sort();
				document.body.appendChild(_aside[0]);                              // view_list.jsxi:195
				
				if (list.length > 0){                                              // view_list.jsxi:197
					ViewList.select(Cars.byName(localStorage.selectedCar) || list[0]);
				}
			}).on('new.car',                                                       // view_list.jsxi:201
			function (car){                                                        // view_list.jsxi:201
				var s = document.createElement('span');
				
				s.textContent = car.displayName;                                   // view_list.jsxi:203
				
				if (car.disabled)                                                  // view_list.jsxi:204
					s.classList.add('disabled');                                   // view_list.jsxi:204
				
				s.setAttribute('title', car.path);                                 // view_list.jsxi:206
				s.setAttribute('data-id', car.id);                                 // view_list.jsxi:207
				s.setAttribute('data-name', car.id);                               // view_list.jsxi:208
				s.setAttribute('data-path', car.path);                             // view_list.jsxi:209
				
				var d = document.createElement('div');
				
				d.appendChild(s);                                                  // view_list.jsxi:212
				
				if (car.children.length > 0){                                      // view_list.jsxi:214
					d.setAttribute('data-children', car.children.length + 1);      // view_list.jsxi:215
				}
				
				_node[0].appendChild(d);                                           // view_list.jsxi:218
			}).on('remove.car',                                                    // view_list.jsxi:220
			function (car){                                                        // view_list.jsxi:220
				if (car === _selected){                                            // view_list.jsxi:221
					ViewList.selectNear();
				}
				
				var d = _node[0].querySelector('[data-id="' + car.id + '"]').parentNode;
				
				d.parentNode.removeChild(d);                                       // view_list.jsxi:226
			}).on('update.car.data',                                               // view_list.jsxi:228
			function (car, upd){                                                   // view_list.jsxi:228
				_node.find('[data-id="' + car.id + '"]').text(car.displayName).attr('data-name', car.displayName.toLowerCase());
				ViewList.filter(_aside.find('#cars-list-filter').val());
				
				if (upd === 'update.car.data:name'){                               // view_list.jsxi:233
					ViewList.sort();
				}
			}).on('update.car.parent',                                             // view_list.jsxi:237
			function (car){                                                        // view_list.jsxi:237
				var d = _node[0].querySelector('[data-id="' + car.id + '"]').parentNode;
				
				if (car.error.length > 0){                                         // view_list.jsxi:239
					var c = d.parentNode;
					
					if (c.tagName === 'DIV' && c.querySelectorAll('.error').length == 1){
						c.classList.remove('error');                               // view_list.jsxi:242
					}
				}
				
				if (car.parent){                                                   // view_list.jsxi:246
					var p = _node[0].querySelector('[data-id="' + car.parent.id + '"]').parentNode;
					
					p.appendChild(d);                                              // view_list.jsxi:248
					
					if (d.classList.contains('error')){                            // view_list.jsxi:249
						d.classList.remove('error');                               // view_list.jsxi:250
						p.classList.add('error');                                  // view_list.jsxi:251
					}
				} else {
					_node[0].appendChild(d);                                       // view_list.jsxi:254
					ViewList.sort();
				}
				
				scrollToSelected();                                                // view_list.jsxi:258
			}).on('update.car.children',                                           // view_list.jsxi:260
			function (car){                                                        // view_list.jsxi:260
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:262
					return;
				
				if (car.children.length){                                          // view_list.jsxi:263
					e.parentNode.setAttribute('data-children', car.children.length + 1);
				} else {
					e.parentNode.removeAttribute('data-children');                 // view_list.jsxi:266
				}
			}).on('update.car.path',                                               // view_list.jsxi:269
			function (car){                                                        // view_list.jsxi:269
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:271
					return;
				
				e.setAttribute('data-path', car.path);                             // view_list.jsxi:272
				e.setAttribute('title', car.path);                                 // view_list.jsxi:273
			}).on('update.car.disabled',                                           // view_list.jsxi:275
			function (car){                                                        // view_list.jsxi:275
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:277
					return;
				
				if (car.disabled){                                                 // view_list.jsxi:278
					e.classList.add('disabled');                                   // view_list.jsxi:279
				} else {
					e.classList.remove('disabled');                                // view_list.jsxi:281
				}
				
				ViewList.sort();
			}).on('update.car.changed',                                            // view_list.jsxi:286
			function (car){                                                        // view_list.jsxi:286
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:288
					return;
				
				if (car.changed){                                                  // view_list.jsxi:289
					e.classList.add('changed');                                    // view_list.jsxi:290
				} else {
					e.classList.remove('changed');                                 // view_list.jsxi:292
				}
			}).on('error',                                                         // view_list.jsxi:295
			function (car){                                                        // view_list.jsxi:295
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:297
					return;
				
				if (car.error.length > 0){                                         // view_list.jsxi:299
					e.classList.add('error');                                      // view_list.jsxi:300
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:302
				}
				
				while (e.parentNode.id !== 'cars-list'){                           // view_list.jsxi:305
					e = e.parentNode;                                              // view_list.jsxi:306
				}
				
				if (car.error.length > 0){                                         // view_list.jsxi:309
					e.classList.add('error');                                      // view_list.jsxi:310
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:312
				}
			});
		_aside.find('#cars-list-filter').on('change paste keyup keypress search', 
			function (e){                                                          // view_list.jsxi:317
				if (e.keyCode == 13){                                              // view_list.jsxi:318
					this.blur();                                                   // view_list.jsxi:319
				}
				
				if (e.keyCode == 27){                                              // view_list.jsxi:322
					this.value = '';                                               // view_list.jsxi:323
					this.blur();                                                   // view_list.jsxi:324
				}
				
				ViewList.filter(this.value);
			}).on('keydown',                                                       // view_list.jsxi:329
			function (e){                                                          // view_list.jsxi:329
				if (e.keyCode == 8 && !this.value){                                // view_list.jsxi:330
					this.blur();                                                   // view_list.jsxi:331
				}
			}).on('blur',                                                          // view_list.jsxi:334
			function (){                                                           // view_list.jsxi:334
				if (!this.value){                                                  // view_list.jsxi:335
					$(this).hide();                                                // view_list.jsxi:336
				}
			});
		$(window).on('keydown',                                                    // view_list.jsxi:341
			function (e){                                                          // view_list.jsxi:342
				if (Event.isSomeInput(e))                                          // view_list.jsxi:343
					return;
				
				if (e.ctrlKey || e.altKey || e.shiftKey)                           // view_list.jsxi:344
					return;
				
				var f = _aside.find('#cars-list-filter');
				
				if (/[a-zA-Z\d]/.test(String.fromCharCode(e.keyCode)) || e.keyCode == 8 && f.val()){
					f.show()[0].focus();                                           // view_list.jsxi:348
				}
				
				if (e.keyCode === 38 && !$('#dialog')[0]){                         // view_list.jsxi:351
					ViewList.selectNear(- 1);
					return false;
				}
				
				if (e.keyCode === 40 && !$('#dialog')[0]){                         // view_list.jsxi:356
					ViewList.selectNear(1);
					return false;
				}
			});
		_aside.find('#cars-list-filter-focus').click(function (){                  // view_list.jsxi:362
			_aside.find('#cars-list-filter').show()[0].focus();                    // view_list.jsxi:363
		});
		_aside.find('#cars-list').click(function (e){                              // view_list.jsxi:367
			var car = Cars.byName(e.target.getAttribute('data-id'));
			
			if (!car)                                                              // view_list.jsxi:369
				return;
			
			ViewList.select(car);
		});
		
		var cmIgnore = false;
		
		_aside.on('contextmenu',                                                   // view_list.jsxi:375
			function (){                                                           // view_list.jsxi:376
				this.querySelector('footer').classList.toggle('active');           // view_list.jsxi:377
				cmIgnore = true;                                                   // view_list.jsxi:378
			});
		$(window).on('click contextmenu',                                          // view_list.jsxi:381
			(function (e){                                                         // view_list.jsxi:382
				if (cmIgnore){                                                     // view_list.jsxi:383
					cmIgnore = false;                                              // view_list.jsxi:384
				} else if (e.target !== this){                                     // view_list.jsxi:385
					this.classList.remove('active');                               // view_list.jsxi:386
				}
			}).bind(_aside.find('footer')[0]));                                    // view_list.jsxi:388
		_aside.find('#cars-list-open-directory').click(function (){                // view_list.jsxi:391
			if (!_selected)                                                        // view_list.jsxi:392
				return;
			
			Shell.openItem(AcDir.cars);                                            // view_list.jsxi:393
		});
		_aside.find('#cars-list-reload').click(function (){                        // view_list.jsxi:396
			if (Cars.list.some(function (e){                                       // view_list.jsxi:397
				return e.changed;                                                  // view_list.jsxi:398
			})){
				new Dialog('Reload',                                               // view_list.jsxi:400
					[
						'<p>{0}</p>'.format('Your changes will be lost. Are you sure?')
					], 
					reload);                                                       // view_list.jsxi:402
			} else {
				reload();                                                          // view_list.jsxi:404
			}
			
			function reload(){                                                     // view_list.jsxi:407
				Cars.reloadAll();                                                  // view_list.jsxi:408
			}
		});
		_aside.find('#cars-list-test-acd').click(function (){                      // view_list.jsxi:412
			Cars.acdTest();                                                        // view_list.jsxi:413
		});
		_aside.find('#cars-list-batch').click(function (){                         // view_list.jsxi:417
			if (_aside.find('#cars-list-filter').val()){                           // view_list.jsxi:418
				var filtered = [];
				
				var n = _node[0].querySelectorAll('[data-id]');
				
				for (var i = 0; i < n.length; i ++){                               // view_list.jsxi:422
					filtered.push(Cars.byName(n[i].getAttribute('data-id')));      // view_list.jsxi:423
				}
				
				BatchProcessing.select(filtered);                                  // view_list.jsxi:426
			} else {
				BatchProcessing.select(Cars.list.slice());                         // view_list.jsxi:428
			}
		});
		_aside.find('#cars-list-save').click(function (){                          // view_list.jsxi:432
			Cars.saveAll();                                                        // view_list.jsxi:433
		});
	}
	
	function lazyLoadingProgressInit(){                                            // view_list.jsxi:437
		var p;
		
		Cars.on('lazyscan:start',                                                  // view_list.jsxi:439
			function (list){                                                       // view_list.jsxi:440
				p = _aside.find('progress').show()[0];                             // view_list.jsxi:441
				p.indeterminate = false;                                           // view_list.jsxi:442
				p.max = list.length;                                               // view_list.jsxi:443
				p.value = 0;                                                       // view_list.jsxi:444
				$('#cars-list-test-acd').attr('disabled', true);                   // view_list.jsxi:446
			}).on('lazyscan:progress',                                             // view_list.jsxi:448
			function (i, m){                                                       // view_list.jsxi:448
				p.value = i;                                                       // view_list.jsxi:449
			}).on('lazyscan:ready',                                                // view_list.jsxi:451
			function (list){                                                       // view_list.jsxi:451
				p.style.display = 'none';                                          // view_list.jsxi:452
				$('#cars-list-test-acd').attr('disabled', null);                   // view_list.jsxi:454
			});
	}
	
	Object.defineProperty(ViewList,                                                // view_list.jsxi:1
		'selected', 
		{
			get: (function (){
				return _selected;                                                  // view_list.jsxi:8
			})
		});
	(function (){                                                                  // view_list.jsxi:458
		init();                                                                    // view_list.jsxi:459
		lazyLoadingProgressInit();                                                 // view_list.jsxi:460
		mediator.extend(ViewList);                                                 // view_list.jsxi:461
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
				s.aptMode = aptMode;                                               // view_settings.jsxi:20
				s.aptFilter = aptFilter;                                           // view_settings.jsxi:21
				s.aptDisableSweetFx = aptDisableSweetFx;                           // view_settings.jsxi:22
				s.aptResize = aptResize;                                           // view_settings.jsxi:23
				s.aptCameraX = aptCameraX;                                         // view_settings.jsxi:24
				s.aptCameraY = aptCameraY;                                         // view_settings.jsxi:25
				s.aptCameraDistance = aptCameraDistance;                           // view_settings.jsxi:26
				s.aptIncreaseDelays = aptIncreaseDelays;                           // view_settings.jsxi:27
			});
		}
		
		var d = new Dialog('Settings',                                             // view_settings.jsxi:31
				[
					'<h6>Assetto Corsa Folder</h6>',                               // view_settings.jsxi:32
					'<button id="settings-acdir-select" style="float:right;width:30px">…</button>', 
					'<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">', 
					'<h6>Tips</h6>',                                               // view_settings.jsxi:36
					'<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>', 
					'<h6>Database</h6>',                                           // view_settings.jsxi:39
					'<label><input id="settings-update-database" type="checkbox" disabled>Update databases</label><br>', 
					'<label><input id="settings-upload-data" type="checkbox">Upload some changes</label>', 
					'<h6>Updates</h6>',                                            // view_settings.jsxi:43
					'<label><input id="settings-updates-check" type="checkbox">Check for new versions on launch</label>', 
					'<select id="settings-updates-source"><option value="stable">Stable</option><option value="last">Beta</option></select>'
				], 
				save,                                                              // view_settings.jsxi:49
				false).setButton('Save').addButton('Cancel'),                      // view_settings.jsxi:49
			c = 0;                                                                 // view_settings.jsxi:49
		
		var acdirVal;
		
		function acdirChange(){                                                    // view_settings.jsxi:53
			var err = AcDir.check(acdirVal = d.find('#settings-acdir').val());     // view_settings.jsxi:54
			
			$(this).toggleClass('invalid', !!err).attr('title', err || null);      // view_settings.jsxi:55
			
			if (err){                                                              // view_settings.jsxi:56
				acdirVal = false;                                                  // view_settings.jsxi:57
			}
		}
		
		d.content.find('#settings-acdir').val(AcDir.root).change(acdirChange);     // view_settings.jsxi:61
		d.content.find('#settings-acdir-select').click(function (){                // view_settings.jsxi:63
			$('<input type="file" nwdirectory />').attr({ nwworkingdir: d.content.find('#settings-acdir').val() }).change(function (){
				d.content.find('#settings-acdir').val(this.value);                 // view_settings.jsxi:67
				acdirChange();                                                     // view_settings.jsxi:68
			}).click();                                                            // view_settings.jsxi:69
		});
		
		var disableTips = Settings.get('disableTips');
		
		d.content.find('#settings-disable-tips').change(function (arg){            // view_settings.jsxi:74
			disableTips = this.checked;                                            // view_settings.jsxi:74
		})[0].checked = disableTips;                                               // view_settings.jsxi:74
		
		var updateDatabase = Settings.get('updateDatabase');
		
		d.content.find('#settings-update-database').change(function (arg){         // view_settings.jsxi:78
			updateDatabase = this.checked;                                         // view_settings.jsxi:78
		})[0].checked = updateDatabase;                                            // view_settings.jsxi:78
		
		var uploadData = Settings.get('uploadData');
		
		d.content.find('#settings-upload-data').change(function (arg){             // view_settings.jsxi:81
			uploadData = this.checked;                                             // view_settings.jsxi:81
		})[0].checked = uploadData;                                                // view_settings.jsxi:81
		
		var updatesCheck = Settings.get('updatesCheck');
		
		d.content.find('#settings-updates-check').change(function (arg){           // view_settings.jsxi:85
			updatesCheck = this.checked;                                           // view_settings.jsxi:85
		})[0].checked = updatesCheck;                                              // view_settings.jsxi:85
		
		var updatesSource = Settings.get('updatesSource');
		
		d.content.find('#settings-updates-source').change(function (arg){          // view_settings.jsxi:88
			updatesSource = this.value;                                            // view_settings.jsxi:88
		})[0].value = updatesSource;                                               // view_settings.jsxi:88
		
		var apt = d.addTab('Auto-Preview',                                         // view_settings.jsxi:91
			[
				'<h6>Mode</h6>',                                                   // view_settings.jsxi:92
				'<select id="apt-mode">' + AcShowroom.modes.map(function (e){      // view_settings.jsxi:93
					return '<option value="' + e.id + '">' + e.name + '</option>';
				}).join('') + '</select>',                                         // view_settings.jsxi:95
				'<h6>Showroom</h6>',                                               // view_settings.jsxi:97
				'<select id="apt-showroom"><option value="">Black Showroom (Recommended)</option>' + AcShowroom.list.map(function (e){
					return '<option value="' + e.id + '">' + (e.data ? e.data.name : e.id) + '</option>';
				}).join('') + '</select>',                                         // view_settings.jsxi:100
				'<h6>Filter</h6>',                                                 // view_settings.jsxi:102
				'<select id="apt-filter"><option value="">Don\'t change</option>' + AcFilters.list.map(function (e){
					return '<option value="' + e.id + '">' + e.id + '</option>';   // view_settings.jsxi:104
				}).join('') + '</select>',                                         // view_settings.jsxi:105
				'<label><input id="apt-disable-sweetfx" type="checkbox">Disable SweetFX (Recommended)</label>', 
				'<h6>Resize</h6>',                                                 // view_settings.jsxi:108
				'<label><input id="apt-resize" type="checkbox">Change size to default 1024×576 (Recommended)</label>', 
				'<h6>Camera Position</h6>',                                        // view_settings.jsxi:111
				'<label style="display:inline-block;width:160px;line-height:24px" title="Actually, just simulate mouse move">Rotate X: <input id="apt-camera-x" type="number" step="1" style="width: 80px;float: right;margin-right: 20px;"></label>', 
				'<label style="display:inline-block;width:160px;line-height:24px" title="Actually, just simulate mouse move">Rotate Y: <input id="apt-camera-y" type="number" step="1" style="width: 80px;float: right;margin-right: 20px;"></label>', 
				'<label style="display:inline-block;width:160px;line-height:24px">Distance: <input id="apt-camera-distance" type="number" step="0.1" style="width: 80px;float: right;margin-right: 20px;"></label>', 
				'<h6>Delays</h6>',                                                 // view_settings.jsxi:116
				'<label><input id="apt-increase-delays" type="checkbox">Increased delays</label>'
			], 
			save).setButton('Save').addButton('Defaults',                          // view_settings.jsxi:118
			function (){                                                           // view_settings.jsxi:118
				apt.content.find('#apt-mode')[0].value = (aptMode = Settings.defaults.aptMode);
				apt.content.toggleClass('apt-nondefmode', aptMode !== 'default');
				apt.content.find('#apt-showroom')[0].value = (aptShowroom = Settings.defaults.aptShowroom);
				
				if (AcFilters.list.length)                                         // view_settings.jsxi:123
					apt.content.find('#apt-filter')[0].value = (aptFilter = Settings.defaults.aptFilter);
				
				apt.content.find('#apt-disable-sweetfx')[0].checked = (aptDisableSweetFx = Settings.defaults.aptDisableSweetFx);
				apt.content.find('#apt-resize')[0].checked = (aptResize = Settings.defaults.aptResize);
				apt.content.find('#apt-camera-x')[0].value = (aptCameraX = Settings.defaults.aptCameraX);
				apt.content.find('#apt-camera-y')[0].value = (aptCameraY = Settings.defaults.aptCameraY);
				apt.content.find('#apt-camera-distance')[0].value = (aptCameraDistance = Settings.defaults.aptCameraDistance);
				apt.content.find('#apt-increase-delays')[0].checked = (aptIncreaseDelays = Settings.defaults.aptIncreaseDelays);
				return false;
			}).addButton('Cancel');                                                // view_settings.jsxi:131
		
		var aptMode = Settings.get('aptMode');
		
		apt.content.find('#apt-mode').change(function (arg){                       // view_settings.jsxi:134
			aptMode = this.value;                                                  // view_settings.jsxi:135
			apt.content.toggleClass('apt-nondefmode', aptMode !== 'default');      // view_settings.jsxi:136
		})[0].value = aptMode;                                                     // view_settings.jsxi:137
		apt.content.toggleClass('apt-nondefmode', aptMode !== 'default');          // view_settings.jsxi:138
		
		var aptShowroom = Settings.get('aptShowroom');
		
		apt.content.find('#apt-showroom').change(function (arg){                   // view_settings.jsxi:141
			aptShowroom = this.value;                                              // view_settings.jsxi:141
		})[0].value = aptShowroom;                                                 // view_settings.jsxi:141
		
		var aptFilter = Settings.get('aptFilter');
		
		if (AcFilters.list.length){                                                // view_settings.jsxi:144
			apt.content.find('#apt-filter').change(function (arg){                 // view_settings.jsxi:145
				aptFilter = this.value;                                            // view_settings.jsxi:145
			})[0].value = aptFilter;                                               // view_settings.jsxi:145
			
			var recFilter = apt.content.find('#apt-filter [value="' + Settings.defaults.aptFilter + '"]')[0];
			
			if (recFilter)                                                         // view_settings.jsxi:147
				recFilter.textContent += ' (Recommended)';                         // view_settings.jsxi:147
		} else {
			apt.content.find('#apt-filter').attr({ disabled: true, title: 'Filters not found' });
		}
		
		var aptDisableSweetFx = Settings.get('aptDisableSweetFx');
		
		apt.content.find('#apt-disable-sweetfx').change(function (arg){            // view_settings.jsxi:156
			aptDisableSweetFx = this.checked;                                      // view_settings.jsxi:156
		})[0].checked = aptDisableSweetFx;                                         // view_settings.jsxi:156
		
		var aptResize = Settings.get('aptResize');
		
		apt.content.find('#apt-resize').change(function (arg){                     // view_settings.jsxi:159
			aptResize = this.checked;                                              // view_settings.jsxi:159
		})[0].checked = aptResize;                                                 // view_settings.jsxi:159
		
		var aptCameraX = Settings.get('aptCameraX');
		
		apt.content.find('#apt-camera-x').change(function (arg){                   // view_settings.jsxi:162
			aptCameraX = this.value;                                               // view_settings.jsxi:162
		})[0].value = aptCameraX;                                                  // view_settings.jsxi:162
		
		var aptCameraY = Settings.get('aptCameraY');
		
		apt.content.find('#apt-camera-y').change(function (arg){                   // view_settings.jsxi:165
			aptCameraY = this.value;                                               // view_settings.jsxi:165
		})[0].value = aptCameraY;                                                  // view_settings.jsxi:165
		
		var aptCameraDistance = Settings.get('aptCameraDistance');
		
		apt.content.find('#apt-camera-distance').change(function (arg){            // view_settings.jsxi:168
			aptCameraDistance = this.value;                                        // view_settings.jsxi:168
		})[0].value = aptCameraDistance;                                           // view_settings.jsxi:168
		
		var aptIncreaseDelays = Settings.get('aptIncreaseDelays');
		
		apt.content.find('#apt-increase-delays').change(function (arg){            // view_settings.jsxi:171
			aptIncreaseDelays = this.checked;                                      // view_settings.jsxi:171
		})[0].checked = aptIncreaseDelays;                                         // view_settings.jsxi:171
		d.addTab('About',                                                          // view_settings.jsxi:174
			[
				'<h6>Version</h6>',                                                // view_settings.jsxi:175
				'<p id="version">' + gui.App.manifest.version + '</p>',            // view_settings.jsxi:176
				'<h6>Details</h6>',                                                // view_settings.jsxi:177
				"<p><a href=\"#\" onclick=\"Shell.openItem('https://ascobash.wordpress.com/2015/06/14/actools-uijson/')\">https://ascobash.wordpress.com/…/actools-uijson/</a></p>", 
				'<h6>Author</h6>',                                                 // view_settings.jsxi:179
				'x4fab'
			]).addButton('Feedback',                                               // view_settings.jsxi:181
			function (){                                                           // view_settings.jsxi:181
				feedbackForm();                                                    // view_settings.jsxi:182
				return false;
			}).addButton('Check for update',                                       // view_settings.jsxi:184
			function (){                                                           // view_settings.jsxi:184
				var b = this.buttons.find('button:last-child').text('Please wait...').attr('disabled', true);
				
				CheckUpdate.check();                                               // view_settings.jsxi:186
				CheckUpdate.one('check',                                           // view_settings.jsxi:187
					function (arg){                                                // view_settings.jsxi:187
						b.text('Check again').attr('disabled', null);              // view_settings.jsxi:188
						
						if (arg === 'check:failed'){                               // view_settings.jsxi:189
							new Dialog('Check For Update', 'Cannot check for update.');
						} else if (arg !== 'check:done:found'){                    // view_settings.jsxi:191
							new Dialog('Check For Update', 'New version not found.');
						}
					});
				return false;
			}).content.find('#version').click(function (){                         // view_settings.jsxi:196
			if (++ c > 10 && !localStorage.developerMode){                         // view_settings.jsxi:197
				new Dialog('Developer Mode Enabled',                               // view_settings.jsxi:198
					'Don\'t spread it around, ok?',                                // view_settings.jsxi:198
					function (arg){}, 
					false);
				localStorage.developerMode = true;                                 // view_settings.jsxi:199
			}
		});
	}
	
	function feedbackForm(){                                                       // view_settings.jsxi:204
		function sendFeedback(v){                                                  // view_settings.jsxi:205
			d.buttons.find('button:first-child').text('Please wait...').attr('disabled', true);
			AppServerRequest.sendFeedback(v,                                       // view_settings.jsxi:208
				function (arg){                                                    // view_settings.jsxi:208
					d.close();                                                     // view_settings.jsxi:209
					
					if (arg){                                                      // view_settings.jsxi:210
						new Dialog('Cannot Send Feedback', 'Sorry about that.');   // view_settings.jsxi:211
					} else {
						_prevFeedback = null;                                      // view_settings.jsxi:213
						new Dialog('Feedback Sent', 'Thank you.');                 // view_settings.jsxi:214
					}
				});
		}
		
		var d = new Dialog('Feedback',                                             // view_settings.jsxi:219
			'<textarea style="width:350px;height:200px;resize:none" maxlength="5000"\
                placeholder="If you have any ideas or suggestions please let me know"></textarea>', 
			function (){                                                           // view_settings.jsxi:220
				var v = this.content.find('textarea').val().trim();
				
				if (v)                                                             // view_settings.jsxi:222
					sendFeedback(v);                                               // view_settings.jsxi:222
				return false;
			}, 
			false).setButton('Send').addButton('Cancel').closeOnEnter(false);      // view_settings.jsxi:224
		
		d.content.find('textarea').val(_prevFeedback || '').change(function (arg){
			return _prevFeedback = this.value;                                     // view_settings.jsxi:225
		});
	}
	
	(function (){                                                                  // view_settings.jsxi:228
		$('#settings-open').click(openDialog);                                     // view_settings.jsxi:229
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
		
		if (e.ctrlKey || e.altKey || e.shiftKey)                                   // app.jsxi:14
			return;
		
		if (e.keyCode === 39){                                                     // app.jsxi:16
			var l = $('[data-action="next"]');
			
			if (l[l.length - 1])                                                   // app.jsxi:18
				l[l.length - 1].click();                                           // app.jsxi:18
		}
		
		if (e.keyCode === 37){                                                     // app.jsxi:21
			var l = $('[data-action="prev"]');
			
			if (l[l.length - 1])                                                   // app.jsxi:23
				l[l.length - 1].click();                                           // app.jsxi:23
		}
	});

if (!localStorage.dataCollection){                                                 // app.jsxi:27
	new Dialog('Introducing: Data Collection',                                     // app.jsxi:28
		[
			'<h6>What is it?</h6>',                                                // app.jsxi:29
			'Data Collection – new feature, which allows to create huge database with correct information about every car, modded or not.', 
			'<h6>How does it work?</h6>',                                          // app.jsxi:32
			'App will upload some of your changes in ui_car.json, which will be anonymously collected and later will be used to create database.', 
			'<h6>But how about privacy?</h6>',                                     // app.jsxi:35
			'Feature is disabled by default, so there\'s nothing to worry about.', 
			'<h6>How to enable it?</h6>',                                          // app.jsxi:38
			'Open Settings and enable option “Upload some changes”. Or just press this button. That\'s it.'
		], 
		function (){}, 
		false).addButton('Enable It',                                              // app.jsxi:40
		function (){                                                               // app.jsxi:40
			Settings.set('uploadData', true);                                      // app.jsxi:41
			new Dialog('Data Collection Enabled', 'Thank you.');                   // app.jsxi:42
		});
	localStorage.dataCollection = true;                                            // app.jsxi:45
}

AppWindow.on('close',                                                              // app.jsxi:48
	function (){                                                                   // app.jsxi:49
		if (Cars.list && Cars.list.filter(function (e){                            // app.jsxi:50
			return e.changed;                                                      // app.jsxi:51
		}).length > 0){                                                            // app.jsxi:52
			new Dialog('Close',                                                    // app.jsxi:53
				[ 'Unsaved changes will be lost. Are you sure?' ], 
				function (){                                                       // app.jsxi:55
					AppWindow.close(true);                                         // app.jsxi:56
				});
		} else {
			AppWindow.close(true);                                                 // app.jsxi:59
		}
	});
ViewList.on('select',                                                              // app.jsxi:63
	function (car){                                                                // app.jsxi:64
		AppWindow.title = car.data ? car.data.name : car.id;                       // app.jsxi:65
	});
Cars.on('update.car.data',                                                         // app.jsxi:68
	function (car){                                                                // app.jsxi:69
		if (car === ViewList.selected){                                            // app.jsxi:70
			AppWindow.title = car.data ? car.data.name : car.id;                   // app.jsxi:71
		}
	});

var first = true;

AcDir.on('change',                                                                 // app.jsxi:76
	function (){                                                                   // app.jsxi:77
		Cars.scan();                                                               // app.jsxi:78
		
		if (first && !Settings.get('disableTips')){                                // app.jsxi:80
			new Dialog('Tip',                                                      // app.jsxi:81
				Tips.next,                                                         // app.jsxi:81
				function (){                                                       // app.jsxi:81
					this.find('p').html(Tips.next);                                // app.jsxi:82
					this.find('h4').text('Another Tip');                           // app.jsxi:83
					return false;
				}).setButton('Next').addButton('Disable Tips',                     // app.jsxi:85
				function (){                                                       // app.jsxi:85
					Settings.set('disableTips', true);                             // app.jsxi:86
				}).find('p').css('maxWidth', 400);                                 // app.jsxi:87
			first = false;                                                         // app.jsxi:89
		}
	});
Data.on('ready',                                                                   // app.jsxi:93
	function (){                                                                   // app.jsxi:94
		AcDir.init();                                                              // app.jsxi:95
	});

