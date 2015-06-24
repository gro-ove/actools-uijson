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
JSON.flexibleParse = function (d){                                                 // helpers.jsxi:37
	var r;
	
	eval('r=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g,                    // helpers.jsxi:39
		function (_){                                                              // helpers.jsxi:39
			return _.replace(/\r?\n/g, '\\n');                                     // helpers.jsxi:40
		}));
	return r;                                                                      // helpers.jsxi:42
};
JSON.restoreDamaged = function (data, fields){                                     // helpers.jsxi:45
	data = data.toString().replace(/\r?\n|\r/g, '\n').trim();                      // helpers.jsxi:46
	
	var result = {};
	
	for (var key in fields)                                                        // helpers.jsxi:49
		if (fields.hasOwnProperty(key)){                                           // helpers.jsxi:49
			var type = fields[key];
			
			var re = new RegExp('(?:\"\\s*' + key + '\\s*\"|\'\\s*' + key + '\\s*\'|' + key + ')\\s*:\\s*([\\s\\S]+)');
			
			var m = data.match(re);
			
			if (re.test(data)){                                                    // helpers.jsxi:52
				var d = RegExp.$1.trim();
				
				if (type !== 'multiline' && type !== 'array' && type !== 'pairsArray'){
					d = d.split('\n')[0].replace(/\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:[\s\S]+|\s*}/, '');
				}
				
				d = d.replace(/(?:\n?\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:|\s*})[\s\S]*$/, 
					'');                                                           // helpers.jsxi:59
				result[key] = d.trim().replace(/,$/, '');                          // helpers.jsxi:60
			}
		}
	
	for (var key in result)                                                        // helpers.jsxi:64
		if (result.hasOwnProperty(key)){                                           // helpers.jsxi:64
			var value = result[key];
			
			if (fields[key] === 'string' || fields[key] === 'multiline'){          // helpers.jsxi:65
				result[key] = value.replace(/^['"]/, '').replace(/['"]$/, '');     // helpers.jsxi:66
			}
			
			if (fields[key] === 'array' || fields[key] === 'pairsArray'){          // helpers.jsxi:69
				value = value.split(/\n|,/).map(function (arg){                    // helpers.jsxi:70
					return arg.trim().replace(/^['"]/, '').replace(/['"]$/, '');   // helpers.jsxi:71
				}).filter(function (a, i){                                         // helpers.jsxi:72
					return a && (i > 0 || a != '[');                               // helpers.jsxi:72
				});
				
				if (value[value.length - 1] === ']'){                              // helpers.jsxi:73
					value.length --;                                               // helpers.jsxi:74
				}
				
				result[key] = value;                                               // helpers.jsxi:77
			}
			
			if (fields[key] === 'pairsArray'){                                     // helpers.jsxi:80
				result[key] = [];                                                  // helpers.jsxi:81
				
				var last;
				
				value.forEach(function (arg){                                      // helpers.jsxi:83
					if (arg === '[' || arg === ']')                                // helpers.jsxi:84
						return;
					
					if (last){                                                     // helpers.jsxi:85
						last.push(arg);                                            // helpers.jsxi:86
						last = null;                                               // helpers.jsxi:87
					} else {
						result[key].push(last = [ arg ]);                          // helpers.jsxi:89
					}
				});
			}
			
			if (fields[key] === 'number'){                                         // helpers.jsxi:94
				value = value.replace(/^['"]/, '').replace(/['"]$/, '');           // helpers.jsxi:95
				value = value.replace(/[oO]/g, '0');                               // helpers.jsxi:97
				result[key] = + value;                                             // helpers.jsxi:98
				
				if (Number.isNaN(result[key])){                                    // helpers.jsxi:100
					result[key] = + value.replace(/[^-.\d]+/g, '');                // helpers.jsxi:101
				}
				
				if (Number.isNaN(result[key])){                                    // helpers.jsxi:104
					result[key] = + (value.replace(/[^\d]+/g, '') || '0');         // helpers.jsxi:105
				}
			}
		}
	return result;                                                                 // helpers.jsxi:110
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
				console.warn(_details(err));                                       // error_handler.jsxi:19
				
				if (window.AppServerRequest && AppServerRequest.sendFeedback){     // error_handler.jsxi:21
					AppServerRequest.sendFeedback('UNCAUGHTEXCEPTION:' + gui.App.manifest.version + ':' + _details(err));
				}
				
				show();                                                            // error_handler.jsxi:25
				new Dialog('Oops!',                                                // error_handler.jsxi:27
					[
						'<p>Uncaught exception, sorry.</p>',                       // error_handler.jsxi:28
						'<pre>' + _details(err) + '</pre>'
					], 
					function (arg){                                                // error_handler.jsxi:30
						mainForm.reloadDev();                                      // error_handler.jsxi:31
					}, 
					function (arg){                                                // error_handler.jsxi:32
						return false;
					}).find('button').text('Restart');                             // error_handler.jsxi:32
			});
		Mediator.errorHandler = function (err){                                    // error_handler.jsxi:35
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
			number: 'number'
		});
	return result;                                                                 // ui_json_damaged.jsxi:11
};
UiJsonDamaged.parseCarFile = function (filename){                                  // ui_json_damaged.jsxi:14
	var result = JSON.restoreDamaged(fs.readFileSync(filename),                    // ui_json_damaged.jsxi:15
		{
			name: 'string',                                                        // ui_json_damaged.jsxi:16
			brand: 'string',                                                       // ui_json_damaged.jsxi:17
			parent: 'string',                                                      // ui_json_damaged.jsxi:18
			description: 'multiline',                                              // ui_json_damaged.jsxi:19
			class: 'string',                                                       // ui_json_damaged.jsxi:20
			tags: 'array',                                                         // ui_json_damaged.jsxi:21
			year: 'number',                                                        // ui_json_damaged.jsxi:22
			country: 'string',                                                     // ui_json_damaged.jsxi:23
			bhp: 'string',                                                         // ui_json_damaged.jsxi:24
			torque: 'string',                                                      // ui_json_damaged.jsxi:25
			weight: 'string',                                                      // ui_json_damaged.jsxi:26
			topspeed: 'string',                                                    // ui_json_damaged.jsxi:27
			acceleration: 'string',                                                // ui_json_damaged.jsxi:28
			pwratio: 'string',                                                     // ui_json_damaged.jsxi:29
			range: 'number',                                                       // ui_json_damaged.jsxi:30
			torqueCurve: 'pairsArray',                                             // ui_json_damaged.jsxi:31
			powerCurve: 'pairsArray'
		});
	
	result.specs = {};                                                             // ui_json_damaged.jsxi:35
	[
		'bhp',                                                                     // ui_json_damaged.jsxi:37
		'torque',                                                                  // ui_json_damaged.jsxi:37
		'weight',                                                                  // ui_json_damaged.jsxi:37
		'topspeed',                                                                // ui_json_damaged.jsxi:37
		'acceleration',                                                            // ui_json_damaged.jsxi:37
		'pwratio'
	].forEach(function (arg){                                                      // ui_json_damaged.jsxi:37
		if (result.hasOwnProperty(arg)){                                           // ui_json_damaged.jsxi:38
			result.specs[arg] = result[arg];                                       // ui_json_damaged.jsxi:39
			delete result[arg];                                                    // ui_json_damaged.jsxi:40
		}
	});
	return result;                                                                 // ui_json_damaged.jsxi:44
};

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
		
		try {
			var tmpFile = d + '/__test.at~tmp';
			
			fs.writeFileSync(tmpFile, 'test');                                     // ac_dir.jsxi:17
			fs.unlinkSync(tmpFile);                                                // ac_dir.jsxi:18
		} catch (e){                                                               // ac_dir.jsxi:19
			return 'App doesn\'t have access to this folder.';                     // ac_dir.jsxi:20
		} 
	};
	AcDir.set = function (d){                                                      // ac_dir.jsxi:24
		if (_root == d)                                                            // ac_dir.jsxi:25
			return;
		
		_root = d;                                                                 // ac_dir.jsxi:27
		_cars = path.join(d, 'content', 'cars');                                   // ac_dir.jsxi:29
		_carsOff = path.join(d, 'content', 'cars-off');                            // ac_dir.jsxi:30
		
		if (!fs.existsSync(_carsOff)){                                             // ac_dir.jsxi:31
			fs.mkdirSync(_carsOff);                                                // ac_dir.jsxi:32
		}
		
		_tracks = path.join(d, 'content', 'tracks');                               // ac_dir.jsxi:35
		_showrooms = path.join(d, 'content', 'showroom');                          // ac_dir.jsxi:36
		localStorage.acRootDir = d;                                                // ac_dir.jsxi:38
		mediator.dispatch('change', _root);                                        // ac_dir.jsxi:40
	};
	AcDir.init = function (c){                                                     // ac_dir.jsxi:43
		function ready(d){                                                         // ac_dir.jsxi:44
			var err = AcDir.check(d);
			
			if (err){                                                              // ac_dir.jsxi:46
				return prompt(err);                                                // ac_dir.jsxi:47
			} else {
				AcDir.set(d);
			}
		}
		
		function prompt(e){                                                        // ac_dir.jsxi:53
			var dialog = new Dialog('Assetto Corsa Folder',                        // ac_dir.jsxi:54
				[
					e && '<p class="error">' + e + '</p>',                         // ac_dir.jsxi:55
					'<button id="select-dir" style="float:right;width:30px">…</button>', 
					'<input placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">'
				], 
				function (){                                                       // ac_dir.jsxi:58
					ready(this.find('input').val());                               // ac_dir.jsxi:59
				}, 
				function (){                                                       // ac_dir.jsxi:60
					return false;
				});
			
			if (localStorage.acRootDir){                                           // ac_dir.jsxi:64
				dialog.find('input').val(localStorage.acRootDir);                  // ac_dir.jsxi:65
			}
			
			dialog.find('#select-dir').click(function (){                          // ac_dir.jsxi:68
				$('<input type="file" nwdirectory />').attr({ nwworkingdir: dialog.find('input').val() }).change(function (){
					dialog.find('input').val(this.value);                          // ac_dir.jsxi:72
				}).click();                                                        // ac_dir.jsxi:73
			});
		}
		
		if (localStorage.acRootDir){                                               // ac_dir.jsxi:77
			ready(localStorage.acRootDir);                                         // ac_dir.jsxi:78
		} else {
			prompt();                                                              // ac_dir.jsxi:80
		}
	};
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'root', 
		{
			get: (function (){
				return _root;                                                      // ac_dir.jsxi:84
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'cars', 
		{
			get: (function (){
				return _cars;                                                      // ac_dir.jsxi:85
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'carsOff', 
		{
			get: (function (){
				return _carsOff;                                                   // ac_dir.jsxi:86
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'tracks', 
		{
			get: (function (){
				return _tracks;                                                    // ac_dir.jsxi:87
			})
		});
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'showrooms', 
		{
			get: (function (){
				return _showrooms;                                                 // ac_dir.jsxi:88
			})
		});
	(function (){                                                                  // ac_dir.jsxi:90
		mediator.extend(AcDir);                                                    // ac_dir.jsxi:91
	})();
	return AcDir;
})();

/* Class "AcFilters" declaration */
var AcFilters = (function (){                                                      // ac_filters.jsxi:1
	var AcFilters = function (){}, 
		_filters = null;
	
	function loadFilters(){                                                        // ac_filters.jsxi:12
		var path = AcTools.Utils.FileUtils.GetDocumentsFiltersFolder();
		
		try {
			_filters = fs.readdirSync(path).map(function (e){                      // ac_filters.jsxi:16
				if (!/\.ini$/i.test(e))                                            // ac_filters.jsxi:17
					return;
				return { id: e.replace(/\.ini$/i, ''), path: path + '/' + e };
			}).filter(function (e){                                                // ac_filters.jsxi:22
				return e;                                                          // ac_filters.jsxi:23
			});
		} catch (e){                                                               // ac_filters.jsxi:25
			_filters = [];                                                         // ac_filters.jsxi:27
		} 
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
		
		var distance = - Settings.get('aptCameraDistance');
		
		var filter = Settings.get('aptFilter') || null;
		
		var disableSweetFx = !!Settings.get('aptDisableSweetFx');
		
		var delays = !!Settings.get('aptIncreaseDelays');
		
		if (Number.isNaN(x))                                                       // ac_showroom.jsxi:130
			x = Settings.defaults.aptCameraX;                                      // ac_showroom.jsxi:130
		
		if (Number.isNaN(y))                                                       // ac_showroom.jsxi:131
			y = Settings.defaults.aptCameraY;                                      // ac_showroom.jsxi:131
		
		if (Number.isNaN(distance))                                                // ac_showroom.jsxi:132
			distance = Settings.defaults.aptCameraY;                               // ac_showroom.jsxi:132
		
		showroomTest();                                                            // ac_showroom.jsxi:134
		
		function showroomTest(){                                                   // ac_showroom.jsxi:136
			function blackShowroomTest(){                                          // ac_showroom.jsxi:137
				return fs.existsSync(AcTools.Utils.FileUtils.GetShowroomFolder(AcDir.root, showroom));
			}
			
			if (showroom == _blackShowroom && !blackShowroomTest()){               // ac_showroom.jsxi:141
				new Dialog('One More Thing',                                       // ac_showroom.jsxi:142
					'Please, install <a href="#" onclick="Shell.openItem(\'' + _blackShowroomUrl + '\')">Black Showroom</a> first.', 
					function (){                                                   // ac_showroom.jsxi:144
						Shell.openItem(_blackShowroomUrl);                         // ac_showroom.jsxi:145
						return false;
					}).setButton('From Here').addButton('Right Here',              // ac_showroom.jsxi:147
					function (){                                                   // ac_showroom.jsxi:147
						Shell.openItem(AcTools.Utils.FileUtils.GetShowroomsFolder(AcDir.root));
						return false;
					}).addButton('Done',                                           // ac_showroom.jsxi:150
					function (){                                                   // ac_showroom.jsxi:150
						if (blackShowroomTest()){                                  // ac_showroom.jsxi:151
							setTimeout(proceed);                                   // ac_showroom.jsxi:152
						} else {
							new Dialog('Are You Sure?', 'Because showroom is still missing.');
							this.buttons.find('button:last-child').text('Really Done');
							return false;
						}
					});
			} else {
				proceed();                                                         // ac_showroom.jsxi:160
			}
		}
		
		function proceed(){                                                        // ac_showroom.jsxi:164
			var output;
			
			try {
				output = AcTools.Processes.Showroom.Shot(AcDir.root,               // ac_showroom.jsxi:167
					c.id,                                                          // ac_showroom.jsxi:167
					showroom,                                                      // ac_showroom.jsxi:167
					!!m,                                                           // ac_showroom.jsxi:167
					x,                                                             // ac_showroom.jsxi:167
					y,                                                             // ac_showroom.jsxi:167
					distance,                                                      // ac_showroom.jsxi:167
					filter,                                                        // ac_showroom.jsxi:167
					disableSweetFx,                                                // ac_showroom.jsxi:167
					delays);                                                       // ac_showroom.jsxi:167
			} catch (err){                                                         // ac_showroom.jsxi:168
				ErrorHandler.handled('Cannot get previews. Maybe process was terminated, there is not enough rights or the car is broken.', 
					err);                                                          // ac_showroom.jsxi:169
				return;
			} 
			
			if (!fs.existsSync(output)){                                           // ac_showroom.jsxi:173
				console.log(output);                                               // ac_showroom.jsxi:174
				ErrorHandler.handled('Cannot get previews.', output);              // ac_showroom.jsxi:175
				return;
			}
			
			shotOutputPreview(c,                                                   // ac_showroom.jsxi:179
				output,                                                            // ac_showroom.jsxi:179
				function (){                                                       // ac_showroom.jsxi:179
					AcTools.Utils.ImageUtils.ApplyPreviews(AcDir.root, c.id, output, Settings.get('aptResize'));
					c.updateSkins();                                               // ac_showroom.jsxi:181
					fs.rmdirSync(output);                                          // ac_showroom.jsxi:182
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
	
	AppServerRequest.sendDataDisabled = false;                                     // app_server_request.jsxi:60
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
	
	AppServerRequest.sendData = function (carId, key, value, callback){            // app_server_request.jsxi:61
		if (AppServerRequest.sendDataDisabled)
			return;
		
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:64
			var e = _dataToSend[i];
			
			if (e && e.car === carId && e.key === key){                            // app_server_request.jsxi:65
				_dataToSend[i] = null;                                             // app_server_request.jsxi:66
			}
		}
		
		_dataToSend.push({ car: carId, key: key, value: value });                  // app_server_request.jsxi:70
		
		if (callback)                                                              // app_server_request.jsxi:71
			callback(null);                                                        // app_server_request.jsxi:71
		
		clearTimeout(_sendTimeout);                                                // app_server_request.jsxi:73
		_sendTimeout = setTimeout(sendDataGroup, _sendDelay);                      // app_server_request.jsxi:74
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
	var Car = (function (){                                                        // cars_car.jsxi:2
		var Car = function (carPath){                                              // cars_car.jsxi:2
			this.error = [];
			this.changed = false;
			this.parent = null;
			this.children = [];
			this.id = carPath.slice(Math.max(carPath.lastIndexOf('/'), carPath.lastIndexOf('\\')) + 1);
			this.path = carPath;                                                   // cars_car.jsxi:25
			this.disabled = carPath.indexOf(AcDir.carsOff) != - 1;                 // cars_car.jsxi:27
		};
		
		Car.prototype.addError = function (id, msg, details){                      // cars_car.jsxi:30
			if (this.hasError(id))
				return;
			
			this.error.push({ id: id, msg: msg, details: details });               // cars_car.jsxi:32
			mediator.dispatch('error:add', this);                                  // cars_car.jsxi:33
		};
		Car.prototype.removeError = function (id){                                 // cars_car.jsxi:36
			for (var i = 0; i < this.error.length; i ++){                          // cars_car.jsxi:37
				var e = this.error[i];
				
				if (e.id === id){                                                  // cars_car.jsxi:38
					this.error.splice(i, 1);                                       // cars_car.jsxi:39
					mediator.dispatch('error:remove', this);                       // cars_car.jsxi:40
					return;
				}
			}
		};
		Car.prototype.clearErrors = function (filter){                             // cars_car.jsxi:46
			if (this.error.length > 0){                                            // cars_car.jsxi:47
				if (filter){                                                       // cars_car.jsxi:48
					var o = this.error.length;
					
					this.error = this.error.filter(function (arg){                 // cars_car.jsxi:50
						return arg.id.indexOf(filter) < 0;                         // cars_car.jsxi:50
					});
					
					if (o === this.error.length)                                   // cars_car.jsxi:51
						return;
				} else {
					this.error.length = 0;                                         // cars_car.jsxi:53
				}
				
				mediator.dispatch('error:remove', this);                           // cars_car.jsxi:56
			}
		};
		Car.prototype.hasError = function (id){                                    // cars_car.jsxi:60
			for (var __0 = 0; __0 < this.error.length; __0 ++){
				var e = this.error[__0];
				
				if (e.id === id)                                                   // cars_car.jsxi:62
					return true;
			}
			return false;
		};
		Car.prototype.toggle = function (state){                                   // cars_car.jsxi:68
			var __that = this, 
				d = state == null ? !this.disabled : !state;                       // cars_car.jsxi:69
			
			if (this.disabled == d)                                                // cars_car.jsxi:70
				return;
			
			var a, b;
			
			if (d){                                                                // cars_car.jsxi:73
				a = AcDir.cars, b = AcDir.carsOff;
			} else {
				a = AcDir.carsOff, b = AcDir.cars;
			}
			
			var newPath = this.path.replace(a, b);
			
			try {
				fs.renameSync(this.path, newPath);                                 // cars_car.jsxi:81
			} catch (err){                                                         // cars_car.jsxi:82
				ErrorHandler.handled('Cannot change car state.', err);             // cars_car.jsxi:83
				return;
			} 
			
			this.disabled = d;                                                     // cars_car.jsxi:87
			this.path = newPath;                                                   // cars_car.jsxi:88
			
			if (this.skins){
				this.skins.forEach(function (e){                                   // cars_car.jsxi:90
					for (var n in e){                                              // cars_car.jsxi:91
						if (typeof e[n] === 'string'){                             // cars_car.jsxi:92
							e[n] = e[n].replace(a, b);                             // cars_car.jsxi:93
						}
					}
				});
			}
			
			mediator.dispatch('update.car.disabled', this);                        // cars_car.jsxi:99
			mediator.dispatch('update.car.path', this);                            // cars_car.jsxi:100
			mediator.dispatch('update.car.skins', this);                           // cars_car.jsxi:101
			
			if (this.parent && !this.disabled && this.parent.disabled){            // cars_car.jsxi:103
				Cars.toggle(this.parent, 
					true);
			}
			
			this.children.forEach(function (e){                                    // cars_car.jsxi:107
				Cars.toggle(e, !__that.disabled);
			});
		};
		Car.prototype.changeData = function (key, value){                          // cars_car.jsxi:117
			if (!this.data || this.data[key] == value)                             // cars_car.jsxi:118
				return;
			
			if (key === 'name' || key === 'brand' || key === 'class' || key === 'year' || key === 'country'){
				value = clearStr(value);                                           // cars_car.jsxi:121
			}
			
			if (key === 'year'){                                                   // cars_car.jsxi:124
				value = value.replace(/[^\d]+/g, '');                              // cars_car.jsxi:125
			}
			
			this.data[key] = value;                                                // cars_car.jsxi:128
			this.changed = true;
			
			if (key === 'tags'){                                                   // cars_car.jsxi:131
				registerTags(value);                                               // cars_car.jsxi:132
			}
			
			if (key === 'brand'){                                                  // cars_car.jsxi:135
				registerBrand(value);                                              // cars_car.jsxi:136
			}
			
			if (key === 'class'){                                                  // cars_car.jsxi:139
				registerClass(value);                                              // cars_car.jsxi:140
			}
			
			if (Settings.get('uploadData')){                                       // cars_car.jsxi:143
				AppServerRequest.sendData(this.id, key, value);                    // cars_car.jsxi:144
			}
			
			mediator.dispatch('update.car.data:' + key, this);                     // cars_car.jsxi:147
			mediator.dispatch('update.car.changed', this);                         // cars_car.jsxi:148
		};
		Car.prototype.changeDataSpecs = function (key, value){                     // cars_car.jsxi:151
			if (!this.data || this.data.specs[key] == value)                       // cars_car.jsxi:152
				return;
			
			value = clearStr(value);                                               // cars_car.jsxi:154
			this.data.specs[key] = value;                                          // cars_car.jsxi:156
			this.changed = true;
			
			if (Settings.get('uploadData')){                                       // cars_car.jsxi:159
				AppServerRequest.sendData(this.id, 'specs:' + key, value);         // cars_car.jsxi:160
			}
			
			mediator.dispatch('update.car.data', this);                            // cars_car.jsxi:163
			mediator.dispatch('update.car.changed', this);                         // cars_car.jsxi:164
		};
		Car.prototype.changeParent = function (parentId){                          // cars_car.jsxi:167
			if (!this.data || this.parent && this.parent.id == parentId || !this.parent && parentId == null)
				return;
			
			if (this.parent){
				this.parent.children.splice(this.parent.children.indexOf(this), 1);
				mediator.dispatch('update.car.children', this.parent);             // cars_car.jsxi:172
			}
			
			if (parentId){                                                         // cars_car.jsxi:175
				var par = Cars.byName(parentId);
				
				if (!par)                                                          // cars_car.jsxi:177
					throw new Error('Parent car "' + parentId + '" not found');    // cars_car.jsxi:177
				
				this.parent = par;                                                 // cars_car.jsxi:179
				this.parent.children.push(this);                                   // cars_car.jsxi:180
				mediator.dispatch('update.car.parent', this);                      // cars_car.jsxi:181
				mediator.dispatch('update.car.children', this.parent);             // cars_car.jsxi:182
				this.data.parent = this.parent.id;                                 // cars_car.jsxi:184
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:185
			} else {
				this.parent = null;
				mediator.dispatch('update.car.parent', this);                      // cars_car.jsxi:188
				delete this.data.parent;                                           // cars_car.jsxi:190
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:191
			}
			
			this.changed = true;
			mediator.dispatch('update.car.changed', this);                         // cars_car.jsxi:195
		};
		Car.prototype.selectSkin = function (skinId){                              // cars_car.jsxi:198
			var newSkin = this.skins.filter(function (e){                          // cars_car.jsxi:199
				return e.id == skinId;                                             // cars_car.jsxi:200
			})[0];
			
			if (newSkin == this.skins.selected)                                    // cars_car.jsxi:203
				return;
			
			this.skins.selected = newSkin;                                         // cars_car.jsxi:205
			mediator.dispatch('update.car.skins', this);                           // cars_car.jsxi:206
		};
		Car.prototype.updateSkins = function (){                                   // cars_car.jsxi:209
			gui.App.clearCache();                                                  // cars_car.jsxi:210
			setTimeout((function (){                                               // cars_car.jsxi:211
				mediator.dispatch('update.car.skins', this);                       // cars_car.jsxi:212
			}).bind(this),                                                         // cars_car.jsxi:213
			100);
		};
		Car.prototype.updateBadge = function (){                                   // cars_car.jsxi:216
			gui.App.clearCache();                                                  // cars_car.jsxi:217
			setTimeout((function (){                                               // cars_car.jsxi:218
				mediator.dispatch('update.car.badge', this);                       // cars_car.jsxi:219
			}).bind(this),                                                         // cars_car.jsxi:220
			100);
		};
		Car.prototype.updateUpgrade = function (){                                 // cars_car.jsxi:223
			gui.App.clearCache();                                                  // cars_car.jsxi:224
			setTimeout((function (){                                               // cars_car.jsxi:225
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:226
			}).bind(this),                                                         // cars_car.jsxi:227
			100);
		};
		Car.prototype.save = function (){                                          // cars_car.jsxi:230
			if (this.data){
				var p = Object.clone(this.data);
				
				p.description = p.description.replace(/\n/g, '<br>');              // cars_car.jsxi:233
				p.class = p.class.toLowerCase();                                   // cars_car.jsxi:234
				fs.writeFileSync(this.json,                                        // cars_car.jsxi:235
					JSON.stringify(p, null, 
						4));                                                       // cars_car.jsxi:235
				this.changed = false;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:237
			}
		};
		Car.prototype.loadBadge = function (callback){                             // cars_car_load.jsxi:3
			var __that = this;
			
			this.clearErrors('badge');
			fs.exists(this.badge,                                                  // cars_car_load.jsxi:6
				(function (result){                                                // cars_car_load.jsxi:6
					if (!result){                                                  // cars_car_load.jsxi:7
						__that.addError('badge-missing', 'Missing badge.png');
					}
					
					if (callback)                                                  // cars_car_load.jsxi:11
						callback();                                                // cars_car_load.jsxi:11
				}).bind(this));                                                    // cars_car_load.jsxi:12
		};
		Car.prototype.loadSkins = function (callback){                             // cars_car_load.jsxi:15
			var __that = this;
			
			if (this.skins){
				this.skins = null;
				mediator.dispatch('update.car.skins', this);                       // cars_car_load.jsxi:18
			}
			
			this.clearErrors('skins');
			
			if (!fs.existsSync(this.skinsDir)){                                    // cars_car_load.jsxi:23
				this.addError('skins-missing', 'Skins folder is missing');
				
				if (callback)                                                      // cars_car_load.jsxi:25
					callback();                                                    // cars_car_load.jsxi:25
				return;
			}
			
			if (!fs.statSync(this.skinsDir).isDirectory()){                        // cars_car_load.jsxi:29
				this.addError('skins-file', 'There is a file instead of skins folder', err);
				
				if (callback)                                                      // cars_car_load.jsxi:31
					callback();                                                    // cars_car_load.jsxi:31
				return;
			}
			
			fs.readdir(this.skinsDir,                                              // cars_car_load.jsxi:35
				(function (err, result){                                           // cars_car_load.jsxi:35
					__that.skins = false;
					
					if (err){                                                      // cars_car_load.jsxi:38
						__that.addError('skins-access', 'Cannot access skins', err);
					} else {
						result = result.filter(function (e){                       // cars_car_load.jsxi:41
							return fs.statSync(__that.path + '/skins/' + e).isDirectory();
						});
						
						if (__that.skins.length === 0){                            // cars_car_load.jsxi:45
							__that.addError('skins-empty', 'Skins folder is empty');
						} else {
							__that.skins = result.map(function (e){                // cars_car_load.jsxi:48
								var p = __that.path + '/skins/' + e;
								return {
									id: e,                                         // cars_car_load.jsxi:51
									path: p,                                       // cars_car_load.jsxi:52
									livery: p + '/livery.png',                     // cars_car_load.jsxi:53
									preview: p + '/preview.jpg'
								};
							});
							__that.skins.selected = __that.skins[0];               // cars_car_load.jsxi:58
							mediator.dispatch('update.car.skins', this);           // cars_car_load.jsxi:59
						}
					}
					
					if (callback)                                                  // cars_car_load.jsxi:63
						callback();                                                // cars_car_load.jsxi:63
				}).bind(this));                                                    // cars_car_load.jsxi:64
		};
		Car.prototype.loadData = function (callback){                              // cars_car_load.jsxi:67
			var __that = this;
			
			if (this.data){
				this.data = null;
				mediator.dispatch('update.car.data', this);                        // cars_car_load.jsxi:70
			}
			
			if (this.parent){
				this.parent.children.splice(this.parent.children.indexOf(this), 1);
				mediator.dispatch('update.car.children', this.parent);             // cars_car_load.jsxi:75
				this.parent = null;
				mediator.dispatch('update.car.parent', this);                      // cars_car_load.jsxi:77
			}
			
			this.clearErrors('data');
			this.clearErrors('parent');
			
			if (!fs.existsSync(this.json)){                                        // cars_car_load.jsxi:83
				if (fs.existsSync(this.json + '.disabled')){                       // cars_car_load.jsxi:84
					fs.renameSync(this.json + '.disabled', this.json);             // cars_car_load.jsxi:85
				} else {
					if (this.changed){
						this.changed = false;
						mediator.dispatch('update.car.changed', this);             // cars_car_load.jsxi:89
					}
					
					this.data = false;
					this.addError('data-missing', 'Missing ui_car.json');
					mediator.dispatch('update.car.data', this);                    // cars_car_load.jsxi:94
					
					if (callback)                                                  // cars_car_load.jsxi:95
						callback();                                                // cars_car_load.jsxi:95
					return;
				}
			}
			
			fs.readFile(this.json,                                                 // cars_car_load.jsxi:100
				(function (err, result){                                           // cars_car_load.jsxi:100
					if (__that.changed){
						__that.changed = false;
						mediator.dispatch('update.car.changed', this);             // cars_car_load.jsxi:103
					}
					
					if (err){                                                      // cars_car_load.jsxi:106
						__that.data = false;
						__that.addError('data-access', 'Unavailable ui_car.json', err);
					} else {
						var dat;
						
						try {
							dat = JSON.flexibleParse(result);                      // cars_car_load.jsxi:112
						} catch (er){                                              // cars_car_load.jsxi:113
							err = er;                                              // cars_car_load.jsxi:114
						} 
						
						__that.data = false;
						
						if (err || !dat){                                          // cars_car_load.jsxi:118
							__that.addError('data-damaged', 'Damaged ui_car.json', err);
						} else if (!dat.name){                                     // cars_car_load.jsxi:120
							__that.addError('data-name-missing', 'Name is missing');
						} else if (!dat.brand){                                    // cars_car_load.jsxi:122
							__that.addError('data-brand-missing', 'Brand is missing');
						} else {
							__that.data = dat;                                     // cars_car_load.jsxi:125
							
							if (!__that.data.description)                          // cars_car_load.jsxi:126
								__that.data.description = '';                      // cars_car_load.jsxi:126
							
							if (!__that.data.tags)                                 // cars_car_load.jsxi:127
								__that.data.tags = [];                             // cars_car_load.jsxi:127
							
							if (!__that.data.specs)                                // cars_car_load.jsxi:128
								__that.data.specs = {};                            // cars_car_load.jsxi:128
							
							__that.data.class = __that.data.class || '';           // cars_car_load.jsxi:130
							__that.data.description = __that.data.description.replace(/\n/g, ' ').replace(/<\/?br\/?>[ \t]*|\n[ \t]+/g, '\n').replace(/<\s*\/?\s*\w+\s*>/g, '').replace(/[\t ]+/g, ' ');
							
							if (__that.data.parent != null){                       // cars_car_load.jsxi:134
								if (__that.data.parent == __that.id){              // cars_car_load.jsxi:135
									__that.addError('parent-wrong', 'Parent is child');
								} else {
									var par = Cars.byName(__that.data.parent);
									
									if (par == null){                              // cars_car_load.jsxi:140
										__that.addError('parent-missing', 'Parent is missing');
									} else {
										__that.parent = par;                       // cars_car_load.jsxi:143
										__that.parent.children.push(this);         // cars_car_load.jsxi:144
										mediator.dispatch('update.car.parent', this);
										mediator.dispatch('update.car.children', __that.parent);
									}
									
									if (!fs.existsSync(__that.upgrade)){           // cars_car_load.jsxi:150
										__that.addError('parent-upgrade-missing', 'Missing upgrade.png');
									}
								}
							}
							
							registerTags(__that.data.tags);                        // cars_car_load.jsxi:156
							registerClass(__that.data.class);                      // cars_car_load.jsxi:157
							registerBrand(__that.data.brand);                      // cars_car_load.jsxi:158
						}
					}
					
					mediator.dispatch('update.car.data', this);                    // cars_car_load.jsxi:162
					
					if (callback)                                                  // cars_car_load.jsxi:163
						callback();                                                // cars_car_load.jsxi:163
				}).bind(this));                                                    // cars_car_load.jsxi:164
		};
		Car.prototype.load = function (callback){                                  // cars_car_load.jsxi:167
			this.clearErrors();
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
					return this.data && this.data.name || this.id;                 // cars_car.jsxi:12
				})
			});
		
		function clearStr(str){                                                    // cars_car.jsxi:112
			if (typeof str !== 'string')                                           // cars_car.jsxi:113
				return;
			return str.trim().replace(/\s+/g, ' ');                                // cars_car.jsxi:114
		}
		return Car;
	})();
	
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
			aptCameraDistance: 5.5,                                                // settings.jsxi:17
			aptIncreaseDelays: false
		};
	
	function save(){                                                               // settings.jsxi:23
		localStorage.settings = JSON.stringify(_settings);                         // settings.jsxi:24
	}
	
	Settings.get = function (k){                                                   // settings.jsxi:27
		return _settings.hasOwnProperty(k) ? _settings[k] : _defaults[k];          // settings.jsxi:28
	};
	Settings.set = function (k, val){                                              // settings.jsxi:31
		if (typeof k == 'object'){                                                 // settings.jsxi:32
			for (var n in k){                                                      // settings.jsxi:33
				_settings[n] = k[n];                                               // settings.jsxi:34
			}
		} else {
			_settings[k] = val;                                                    // settings.jsxi:37
		}
		
		save();                                                                    // settings.jsxi:40
	};
	Settings.update = function (f){                                                // settings.jsxi:43
		f(_settings);                                                              // settings.jsxi:44
		save();                                                                    // settings.jsxi:45
	};
	Object.defineProperty(Settings,                                                // settings.jsxi:1
		'defaults', 
		{
			get: (function (){
				return _defaults;                                                  // settings.jsxi:21
			})
		});
	(function (){                                                                  // settings.jsxi:48
		_settings = {};                                                            // settings.jsxi:49
		
		try {
			_settings = JSON.parse(localStorage.settings) || {};                   // settings.jsxi:52
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

/* Class "BadgeEditor" declaration */
var BadgeEditor = (function (){                                                    // badge_editor.jsxi:1
	var BadgeEditor = function (){}, 
		logos = {                                                                  // badge_editor.jsxi:2
			"Abarth": "data/brand-lib/Abarth.png",                                 // badge_editor.jsxi:2
			"Alfa Romeo": "data/brand-lib/Alfa Romeo.png",                         // badge_editor.jsxi:2
			"Aston Martin": "data/brand-lib/Aston Martin.png",                     // badge_editor.jsxi:2
			"Audi": "data/brand-lib/Audi.png",                                     // badge_editor.jsxi:2
			"BMW": "data/brand-lib/BMW.png",                                       // badge_editor.jsxi:2
			"Cadillac": "data/brand-lib/Cadillac.png",                             // badge_editor.jsxi:2
			"Chevrolet": "data/brand-lib/Chevrolet.png",                           // badge_editor.jsxi:2
			"Datsun": "data/brand-lib/Datsun.png",                                 // badge_editor.jsxi:2
			"Dodge": "data/brand-lib/Dodge.png",                                   // badge_editor.jsxi:2
			"Ferrari": "data/brand-lib/Ferrari.png",                               // badge_editor.jsxi:2
			"Ford": "data/brand-lib/Ford.png",                                     // badge_editor.jsxi:2
			"Ginetta": "data/brand-lib/Ginetta.png",                               // badge_editor.jsxi:2
			"Hamann": "data/brand-lib/Hamann.png",                                 // badge_editor.jsxi:2
			"Holden": "data/brand-lib/Holden.png",                                 // badge_editor.jsxi:2
			"Honda": "data/brand-lib/Honda.png",                                   // badge_editor.jsxi:2
			"Hyundai": "data/brand-lib/Hyundai.png",                               // badge_editor.jsxi:2
			"Jaguar": "data/brand-lib/Jaguar.png",                                 // badge_editor.jsxi:2
			"Kia": "data/brand-lib/Kia.png",                                       // badge_editor.jsxi:2
			"Koenigsegg": "data/brand-lib/Koenigsegg.png",                         // badge_editor.jsxi:2
			"Kunos": "data/brand-lib/Kunos.png",                                   // badge_editor.jsxi:2
			"Lada": "data/brand-lib/Lada.png",                                     // badge_editor.jsxi:2
			"Lamborghini": "data/brand-lib/Lamborghini.png",                       // badge_editor.jsxi:2
			"Lexus": "data/brand-lib/Lexus.png",                                   // badge_editor.jsxi:2
			"Lotus": "data/brand-lib/Lotus.png",                                   // badge_editor.jsxi:2
			"Maserati": "data/brand-lib/Maserati.png",                             // badge_editor.jsxi:2
			"Mazda": "data/brand-lib/Mazda.png",                                   // badge_editor.jsxi:2
			"Mercedes-Benz": "data/brand-lib/Mercedes-Benz.png",                   // badge_editor.jsxi:2
			"MG": "data/brand-lib/MG.png",                                         // badge_editor.jsxi:2
			"Mitsubishi": "data/brand-lib/Mitsubishi.png",                         // badge_editor.jsxi:2
			"Nissan": "data/brand-lib/Nissan.png",                                 // badge_editor.jsxi:2
			"Noble": "data/brand-lib/Noble.png",                                   // badge_editor.jsxi:2
			"Opel": "data/brand-lib/Opel.png",                                     // badge_editor.jsxi:2
			"Pagani": "data/brand-lib/Pagani.png",                                 // badge_editor.jsxi:2
			"Pantera": "data/brand-lib/Pantera.png",                               // badge_editor.jsxi:2
			"Plymouth": "data/brand-lib/Plymouth.png",                             // badge_editor.jsxi:2
			"Pontiac": "data/brand-lib/Pontiac.png",                               // badge_editor.jsxi:2
			"Porsche": "data/brand-lib/Porsche.png",                               // badge_editor.jsxi:2
			"Radical": "data/brand-lib/Radical.png",                               // badge_editor.jsxi:2
			"Renault": "data/brand-lib/Renault.png",                               // badge_editor.jsxi:2
			"RUF": "data/brand-lib/RUF.png",                                       // badge_editor.jsxi:2
			"Saleen": "data/brand-lib/Saleen.png",                                 // badge_editor.jsxi:2
			"Shelby": "data/brand-lib/Shelby.png",                                 // badge_editor.jsxi:2
			"Suzuki": "data/brand-lib/Suzuki.png",                                 // badge_editor.jsxi:2
			"Toyota": "data/brand-lib/Toyota.png",                                 // badge_editor.jsxi:2
			"Volkswagen": "data/brand-lib/Volkswagen.png",                         // badge_editor.jsxi:2
			"Volvo": "data/brand-lib/Volvo.png"
		};
	
	BadgeEditor.autoupdate = function (car){                                       // badge_editor.jsxi:4
		var image = logos[car.data.brand];
	};
	
	function init(){                                                               // badge_editor.jsxi:11
		Cars.on('update.car.data:brand', BadgeEditor.autoupdate);                  // badge_editor.jsxi:12
	}
	
	(function (){                                                                  // badge_editor.jsxi:16
		$(init);                                                                   // badge_editor.jsxi:17
	})();
	return BadgeEditor;
})();

/* Class "AbstractBatchProcessor" declaration */
function AbstractBatchProcessor(){                                                 // batch_processing.jsxi:1
	if (this.constructor === AbstractBatchProcessor)
		throw new Error('Trying to instantiate abstract class AbstractBatchProcessor');
}

/* Class "JsBatchProcessor" declaration */
function JsBatchProcessor(fn){                                                     // batch_processing.jsxi:5
	this.__JsBatchProcessor__fn = fn;                                              // batch_processing.jsxi:9
}
JsBatchProcessor.prototype.process = function (car, callback){                     // batch_processing.jsxi:12
	try {
		this.__JsBatchProcessor__fn(car);
	} catch (err){                                                                 // batch_processing.jsxi:15
		callback(err);                                                             // batch_processing.jsxi:16
		return;
	} 
	
	callback();                                                                    // batch_processing.jsxi:20
};

/* Class "BatchProcessing" declaration */
var BatchProcessing = (function (){                                                // batch_processing.jsxi:24
	var BatchProcessing = function (){}, 
		_procs;
	
	BatchProcessing.process = function (cars, processor){                          // batch_processing.jsxi:27
		AppServerRequest.sendDataDisabled = true;                                  // batch_processing.jsxi:28
		
		var abort = false;
		
		var d = new Dialog('Batch Processing',                                     // batch_processing.jsxi:32
			[ '<progress></progress>' ], 
			function (){                                                           // batch_processing.jsxi:32
				AppServerRequest.sendDataDisabled = false;                         // batch_processing.jsxi:33
				abort = true;                                                      // batch_processing.jsxi:34
			}, 
			false);
		
		var progress = d.find('progress');
		
		progress[0].max = cars.length;                                             // batch_processing.jsxi:38
		
		var i = 0;
		
		function next(){                                                           // batch_processing.jsxi:41
			if (abort)                                                             // batch_processing.jsxi:42
				return;
			
			if (!cars[i]){                                                         // batch_processing.jsxi:44
				AppServerRequest.sendDataDisabled = false;                         // batch_processing.jsxi:45
				d.close();                                                         // batch_processing.jsxi:46
			}
			
			progress[0].value = i ++;                                              // batch_processing.jsxi:49
			processor.process(cars[i],                                             // batch_processing.jsxi:50
				function (arg){                                                    // batch_processing.jsxi:50
					return setTimeout(next);                                       // batch_processing.jsxi:50
				});
		}
		
		next();                                                                    // batch_processing.jsxi:53
	};
	BatchProcessing.add = function (name, proc){                                   // batch_processing.jsxi:56
		if (!_procs)                                                               // batch_processing.jsxi:57
			_procs = [];                                                           // batch_processing.jsxi:57
		
		_procs.push({ name: name, proc: proc });                                   // batch_processing.jsxi:58
	};
	BatchProcessing.select = function (cars){                                      // batch_processing.jsxi:61
		if (!_procs)                                                               // batch_processing.jsxi:62
			init();                                                                // batch_processing.jsxi:62
		
		new Dialog('Batch Processing',                                             // batch_processing.jsxi:63
			[
				'<h6>Cars</h6>',                                                   // batch_processing.jsxi:64
				cars.length + ' cars to process',                                  // batch_processing.jsxi:65
				'<h6>Processor</h6>',                                              // batch_processing.jsxi:66
				'<select>' + _procs.map(function (e, i){                           // batch_processing.jsxi:67
					return '<option value="' + i + '">' + e.name + '</option>';    // batch_processing.jsxi:67
				}) + '</select>', 
				'<div id="proc-options"></div>',                                   // batch_processing.jsxi:68
				'If you have any ideas about different processors, you can use Feedback Form in Settings.'
			], 
			function (){                                                           // batch_processing.jsxi:70
				setTimeout((function (){                                           // batch_processing.jsxi:71
					BatchProcessing.process(cars, _procs[this.find('select').val()].proc);
				}).bind(this));                                                    // batch_processing.jsxi:73
			}).find('select').val(0);                                              // batch_processing.jsxi:74
	};
	
	function init(){                                                               // batch_processing.jsxi:77
		BatchProcessing.add('Add Missing Brand Names to Car Names',                // batch_processing.jsxi:78
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:78
				if (!car.data || !car.data.name || !car.data.brand)                // batch_processing.jsxi:79
					return;
				
				var brand = car.data.brand;
				
				var name = car.data.name;
				
				if (brand === 'Kunos')                                             // batch_processing.jsxi:82
					return;
				
				if (brand === 'Mercedes-Benz'){                                    // batch_processing.jsxi:83
					if (name.indexOf(brand + ' ') === 0){                          // batch_processing.jsxi:84
						name = name.substr(brand.length + 1);                      // batch_processing.jsxi:85
					}
					
					brand = 'Mercedes';                                            // batch_processing.jsxi:88
				}
				
				if (name.indexOf(brand + ' ') === 0)                               // batch_processing.jsxi:91
					return;
				
				car.changeData('name', brand + ' ' + name);                        // batch_processing.jsxi:92
			}));
		BatchProcessing.add('Remove Brand Names from Car Names',                   // batch_processing.jsxi:95
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:95
				if (!car.data || !car.data.name || !car.data.brand)                // batch_processing.jsxi:96
					return;
				
				var brand = car.data.brand;
				
				var name = car.data.name;
				
				if (brand === 'Mercedes-Benz'){                                    // batch_processing.jsxi:99
					if (name.indexOf(brand + ' ') === 0){                          // batch_processing.jsxi:100
						car.changeData('name', name.substr(brand.length + 1));     // batch_processing.jsxi:101
						return;
					}
					
					brand = 'Mercedes';                                            // batch_processing.jsxi:105
				}
				
				if (name.indexOf(brand + ' ') !== 0)                               // batch_processing.jsxi:107
					return;
				
				car.changeData('name', name.substr(brand.length + 1));             // batch_processing.jsxi:108
			}));
		BatchProcessing.add('Lowercase Classes',                                   // batch_processing.jsxi:111
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:111
				if (!car.data || !car.data.class)                                  // batch_processing.jsxi:112
					return;
				
				car.changeData('class', car.data.class.toLowerCase());             // batch_processing.jsxi:113
			}));
		BatchProcessing.add('Lowercase & Fix Tags',                                // batch_processing.jsxi:116
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:116
				if (!car.data || !car.data.tags)                                   // batch_processing.jsxi:117
					return;
				
				var temp = 0,                                                      // batch_processing.jsxi:118
					tags = car.data.tags.map(function (raw){                       // batch_processing.jsxi:119
						var tag = raw.toLowerCase();
						
						if (/^#?(a\d+)$/.test(tag)){                               // batch_processing.jsxi:121
							return '#' + RegExp.$1.toUpperCase();                  // batch_processing.jsxi:122
						}
						
						switch (tag){                                              // batch_processing.jsxi:125
							case 'us':                                             // batch_processing.jsxi:126
								
							case 'america':                                        // batch_processing.jsxi:127
								return 'usa';                                      // batch_processing.jsxi:128
							case 'gb':                                             // batch_processing.jsxi:129
								
							case 'uk':                                             // batch_processing.jsxi:130
								
							case 'united kingdom':                                 // batch_processing.jsxi:131
								
							case 'england':                                        // batch_processing.jsxi:132
								
							case 'britain':                                        // batch_processing.jsxi:133
								return 'great britain';                            // batch_processing.jsxi:134
							case 'swedish':                                        // batch_processing.jsxi:135
								return 'sweden';                                   // batch_processing.jsxi:136
							default:
								if (tag === raw){                                  // batch_processing.jsxi:138
									temp ++;                                       // batch_processing.jsxi:139
								}
								return tag;                                        // batch_processing.jsxi:142
						}
					});
				
				if (temp.length !== car.data.tags.length){                         // batch_processing.jsxi:146
					car.changeData('tags', tags);                                  // batch_processing.jsxi:147
				}
			}));
		BatchProcessing.add('Remove logo.png',                                     // batch_processing.jsxi:151
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:151
				if (fs.existsSync(car.path + '/logo.png')){                        // batch_processing.jsxi:152
					fs.unlinkSync(car.path + '/logo.png');                         // batch_processing.jsxi:153
				}
			}));
		BatchProcessing.add('Replace logo.png by ui/badge.png',                    // batch_processing.jsxi:157
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:157
				if (!fs.existsSync(car.badge))                                     // batch_processing.jsxi:158
					return;
				
				fs.writeFileSync(car.path + '/logo.png', fs.readFileSync(car.badge));
			}));
	}
	return BatchProcessing;
})();

/* Class "RestorationWizard" declaration */
var RestorationWizard = (function (){                                              // restoration_wizard.jsxi:1
	var RestorationWizard = function (){}, 
		_fixers = {};
	
	RestorationWizard.fix = function (car, errorId){                               // restoration_wizard.jsxi:4
		if (_fixers.hasOwnProperty(errorId)){                                      // restoration_wizard.jsxi:5
			new _fixers[errorId](car, errorId).run();                              // restoration_wizard.jsxi:6
		} else {
			ErrorHandler.handled('Not supported error: ' + errorId);               // restoration_wizard.jsxi:8
		}
	};
	RestorationWizard.register = function (id, classObj){                          // restoration_wizard.jsxi:12
		_fixers[id] = classObj;                                                    // restoration_wizard.jsxi:13
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

/* Class "AbstractFixer" declaration */
function AbstractFixer(c, e){                                                      // abstract_fixer.jsxi:1
	if (this.constructor === AbstractFixer)
		throw new Error('Trying to instantiate abstract class AbstractFixer');
	
	this.__car = c;                                                                // abstract_fixer.jsxi:5
	this.__errorId = e;                                                            // abstract_fixer.jsxi:6
}
AbstractFixer.prototype.run = function (){                                         // abstract_fixer.jsxi:9
	var __that = this;
	
	try {
		this.__AbstractFixer_work(function (err){                                  // abstract_fixer.jsxi:11
			if (__that.__AbstractFixer__error)
				return;
			
			if (err){                                                              // abstract_fixer.jsxi:14
				__that.__AbstractFixer_error(err === true ? null : err);
			} else {
				__that.__car.removeError(__that.__errorId);                        // abstract_fixer.jsxi:17
				setTimeout(__bindOnce(__that, '__reloadAfter'));                   // abstract_fixer.jsxi:18
			}
		});
	} catch (err){                                                                 // abstract_fixer.jsxi:21
		this.__AbstractFixer_error(err);
	} 
};
AbstractFixer.prototype.__reloadAfter = function (){};
AbstractFixer.prototype.__AbstractFixer_error = function (err){                    // abstract_fixer.jsxi:30
	this.__AbstractFixer__error = true;
	ErrorHandler.handled('Cannot fix error: ' + this.__errorId, err);              // abstract_fixer.jsxi:32
};
AbstractFixer.prototype.__AbstractFixer_work = function (c){                       // abstract_fixer.jsxi:35
	var __that = this, 
		s = this.__solutions.filter(function (arg){                                // abstract_fixer.jsxi:36
			return arg;                                                            // abstract_fixer.jsxi:36
		});
	
	if (s.length == 0){                                                            // abstract_fixer.jsxi:37
		new Dialog(this.__title,                                                   // abstract_fixer.jsxi:38
			[
				'<h6>Available solutions:</h6>',                                   // abstract_fixer.jsxi:38
				'Sorry, but none of solutions is available.'
			]);
		return;
	}
	
	new Dialog(this.__title,                                                       // abstract_fixer.jsxi:41
		[
			'<h6>Available solutions:</h6>',                                       // abstract_fixer.jsxi:42
			s.map(function (e, i){                                                 // abstract_fixer.jsxi:43
				return '<label><input name="solution" data-solution-id="' + i + '" type="radio">' + e.name + '</label>';
			}).join('<br>')
		], 
		function (){                                                               // abstract_fixer.jsxi:44
			var id = this.find('input[name="solution"]:checked').data('solution-id');
			
			try {
				s[id].fn(c);                                                       // abstract_fixer.jsxi:47
			} catch (err){                                                         // abstract_fixer.jsxi:48
				__that.__AbstractFixer_error(err);
			} 
		}).addButton('Cancel').find('input[name="solution"]')[0].checked = true;   // abstract_fixer.jsxi:51
};
AbstractFixer.prototype.__fixJsonFile = function (filename, fn){                   // abstract_fixer.jsxi:57
	try {
		var dat = JSON.flexibleParse(fs.readFileSync(filename));
		
		fn(dat);                                                                   // abstract_fixer.jsxi:60
		fs.writeFileSync(filename,                                                 // abstract_fixer.jsxi:61
			JSON.stringify(dat, false, 
				4));                                                               // abstract_fixer.jsxi:61
	} catch (err){                                                                 // abstract_fixer.jsxi:62
		this.__AbstractFixer_error(err);
	} 
};
AbstractFixer.__simularFile = function (a, b){                                     // abstract_fixer.jsxi:67
	a = a.toLowerCase();                                                           // abstract_fixer.jsxi:69
	b = b.toLowerCase();                                                           // abstract_fixer.jsxi:70
	
	if (b.indexOf(a) !== - 1)                                                      // abstract_fixer.jsxi:71
		return true;
	
	for (var i = a.length - 1; i > a.length / 2; i --)                             // abstract_fixer.jsxi:73
		if (b.indexOf(a.substr(0, i)) !== - 1)                                     // abstract_fixer.jsxi:74
			return true;
	return false;
};
AbstractFixer.__simularFiles = function (filename, filter, deep){                  // abstract_fixer.jsxi:79
	if (filter === undefined)                                                      // abstract_fixer.jsxi:79
		filter = (function (arg){                                                  // abstract_fixer.jsxi:79
	return true;
});

	if (deep === undefined)                                                        // abstract_fixer.jsxi:79
		deep = true;                                                               // abstract_fixer.jsxi:79

	var dir = path.dirname(filename);
	
	var basename = path.basename(filename);
	
	if (fs.existsSync(dir)){                                                       // abstract_fixer.jsxi:83
		if (fs.statSync(dir).isDirectory()){                                       // abstract_fixer.jsxi:84
			return fs.readdirSync(dir).filter(function (arg){                      // abstract_fixer.jsxi:85
				return AbstractFixer.__simularFile(basename, arg) && (arg != basename || !deep);
			}).map(function (e){                                                   // abstract_fixer.jsxi:85
				return dir + '/' + e;                                              // abstract_fixer.jsxi:86
			}).filter(function (arg){                                              // abstract_fixer.jsxi:87
				return filter(fs.statSync(arg));                                   // abstract_fixer.jsxi:87
			});
		} else {
			return [];
		}
	} else if (deep){                                                              // abstract_fixer.jsxi:91
		var r = [];
		
		var s = AbstractFixer.__simularFiles(dir,                                  // abstract_fixer.jsxi:93
			function (arg){                                                        // abstract_fixer.jsxi:93
				return arg.isDirectory();                                          // abstract_fixer.jsxi:93
			}, 
			false);
		
		for (var __1 = 0; __1 < s.length; __1 ++){                                 // abstract_fixer.jsxi:94
			var d = s[__1];
			
			r.push.call(r,                                                         // abstract_fixer.jsxi:95
				AbstractFixer.__simularFiles(d + '/' + basename, filter, false));
		}
		return r;                                                                  // abstract_fixer.jsxi:97
	} else {
		return [];
	}
};
AbstractFixer.__restoreFile = function (filename, from, c){                        // abstract_fixer.jsxi:103
	if (fs.existsSync(filename))                                                   // abstract_fixer.jsxi:104
		fs.unlinkSync(filename);                                                   // abstract_fixer.jsxi:105
	
	function mkdirp(d){                                                            // abstract_fixer.jsxi:107
		if (fs.existsSync(d))                                                      // abstract_fixer.jsxi:108
			return;
		
		mkdirp(path.dirname(d));                                                   // abstract_fixer.jsxi:109
		fs.mkdirSync(d);                                                           // abstract_fixer.jsxi:110
	}
	
	mkdirp(path.dirname(filename));                                                // abstract_fixer.jsxi:113
	fs.rename(from,                                                                // abstract_fixer.jsxi:114
		filename,                                                                  // abstract_fixer.jsxi:114
		function (err){                                                            // abstract_fixer.jsxi:114
			if (err){                                                              // abstract_fixer.jsxi:115
				if (err.code === 'EXDEV'){                                         // abstract_fixer.jsxi:116
					copy();                                                        // abstract_fixer.jsxi:117
				} else {
					c(err);                                                        // abstract_fixer.jsxi:119
				}
			} else {
				c();                                                               // abstract_fixer.jsxi:122
			}
		});
	
	function copy(){                                                               // abstract_fixer.jsxi:126
		var rs = fs.createReadStream(from);
		
		var ws = fs.createWriteStream(filename);
		
		rs.on('error', c);                                                         // abstract_fixer.jsxi:129
		ws.on('error', c);                                                         // abstract_fixer.jsxi:130
		rs.on('close',                                                             // abstract_fixer.jsxi:131
			function (){                                                           // abstract_fixer.jsxi:131
				c();                                                               // abstract_fixer.jsxi:132
				fs.unlink(from);                                                   // abstract_fixer.jsxi:133
			});
		rs.pipe(ws);                                                               // abstract_fixer.jsxi:135
	}
};
AbstractFixer.__tryToRestoreFile = function (filename, filter, callback){          // abstract_fixer.jsxi:139
	return AbstractFixer.__simularFiles(filename, filter).map(function (e){        // abstract_fixer.jsxi:140
		return {
			name: 'Restore from …' + path.normalize(e).slice(AcDir.root.length), 
			fn: (function (c){                                                     // abstract_fixer.jsxi:143
				AbstractFixer.__restoreFile(filename,                              // abstract_fixer.jsxi:144
					e,                                                             // abstract_fixer.jsxi:144
					function (err){                                                // abstract_fixer.jsxi:144
						if (err)                                                   // abstract_fixer.jsxi:145
							return c(err);                                         // abstract_fixer.jsxi:145
						
						if (callback)                                              // abstract_fixer.jsxi:146
							callback();                                            // abstract_fixer.jsxi:146
						
						c();                                                       // abstract_fixer.jsxi:147
					});
			})
		};
	});
};

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
	'__title', 
	{
		get: (function (){
			return 'Badge icon missing';                                           // error_badge_missing.jsxi:10
		})
	});
Object.defineProperty(MissingBadgeIconFixer.prototype, 
	'__solutions', 
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
	'__title', 
	{
		get: (function (){
			return 'Car name is missing';                                          // error_data_fields.jsxi:24
		})
	});
Object.defineProperty(MissingDataNameFixer.prototype, 
	'__solutions', 
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
	'__title', 
	{
		get: (function (){
			return 'Car brand is missing';                                         // error_data_fields.jsxi:59
		})
	});
Object.defineProperty(MissingDataBrandFixer.prototype, 
	'__solutions', 
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
	'__title', 
	{
		get: (function (){
			return 'Parent id is incorrect';                                       // error_data_fields.jsxi:103
		})
	});
Object.defineProperty(WrongDataParentFixer.prototype, 
	'__solutions', 
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
	'__title', 
	{
		get: (function (){
			return 'File ui/ui_car.json is missing';                               // error_data_file.jsxi:6
		})
	});
Object.defineProperty(MissingDataFileFixer.prototype, 
	'__solutions', 
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
DamagedDataFileFixer.prototype.__restore = function (c){                           // error_data_file.jsxi:18
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
	'__title', 
	{
		get: (function (){
			return 'File ui/ui_car.json is damaged';                               // error_data_file.jsxi:27
		})
	});
Object.defineProperty(DamagedDataFileFixer.prototype, 
	'__solutions', 
	{
		get: (function (){
			return [
				{ name: 'Try to restore', fn: __bindOnce(this, '__restore') }
			].concat(AbstractFixer.__tryToRestoreFile(this.__car.json,             // error_data_file.jsxi:30
				function (arg){                                                    // error_data_file.jsxi:31
					return arg.isFile() && arg.size > 10 && arg.size < 1e5;        // error_data_file.jsxi:31
				}));
		})
	});

RestorationWizard.register('data-damaged', DamagedDataFileFixer);                  // error_data_file.jsxi:34

/* Class "MissingSkinsDirectoryFixer" declaration */
function MissingSkinsDirectoryFixer(){                                             // error_skins_directory.jsxi:1
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(MissingSkinsDirectoryFixer, 
	AbstractFixer);
MissingSkinsDirectoryFixer.prototype.__MissingSkinsDirectoryFixer_createNew = function (c){
	fs.mkdirSync(this.__car.skinsDir);                                             // error_skins_directory.jsxi:3
	fs.mkdirSync(this.__car.skinsDir + '/default');                                // error_skins_directory.jsxi:4
	c();                                                                           // error_skins_directory.jsxi:5
};
MissingSkinsDirectoryFixer.prototype.__reloadAfter = function (){                  // error_skins_directory.jsxi:13
	this.__car.loadSkins();                                                        // error_skins_directory.jsxi:14
};
Object.defineProperty(MissingSkinsDirectoryFixer.prototype, 
	'__title', 
	{
		get: (function (){
			return 'Skins folder is missing';                                      // error_skins_directory.jsxi:8
		})
	});
Object.defineProperty(MissingSkinsDirectoryFixer.prototype, 
	'__solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Create new with empty skin',                            // error_skins_directory.jsxi:10
					fn: __bindOnce(this, '__MissingSkinsDirectoryFixer_createNew')
				}
			].concat(AbstractFixer.__tryToRestoreFile(this.__car.skinsDir,         // error_skins_directory.jsxi:11
				function (arg){                                                    // error_skins_directory.jsxi:11
					return arg.isDirectory();                                      // error_skins_directory.jsxi:11
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
	'__title', 
	{
		get: (function (){
			return 'Skins folder is empty';                                        // error_skins_directory.jsxi:28
		})
	});
Object.defineProperty(EmptySkinsDirectoryFixer.prototype, 
	'__solutions', 
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
	'__title', 
	{
		get: (function (){
			return 'There is a file instead of skins folder';                      // error_skins_directory.jsxi:46
		})
	});
Object.defineProperty(FileSkinsDirectoryFixer.prototype, 
	'__solutions', 
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
	'__title', 
	{
		get: (function (){
			return 'Upgrade icon missing';                                         // error_upgrade_missing.jsxi:15
		})
	});
Object.defineProperty(MissingUpgradeIconFixer.prototype, 
	'__solutions', 
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
		}
		
		var he = $('#selected-car'),                                               // view_details.jsxi:47
			de = $('#selected-car-desc'),                                          // view_details.jsxi:48
			ta = $('#selected-car-tags'),                                          // view_details.jsxi:49
			pr = $('#selected-car-properties');                                    // view_details.jsxi:50
		
		he.attr('title', car.path);                                                // view_details.jsxi:51
		
		if (car.data){                                                             // view_details.jsxi:52
			val(he.removeAttr('readonly'), car.data.name);                         // view_details.jsxi:53
			val(de.removeAttr('readonly'), car.data.description);                  // view_details.jsxi:54
			de.elastic();                                                          // view_details.jsxi:55
			ta.show().find('li').remove();                                         // view_details.jsxi:57
			car.data.tags.forEach((function (e){                                   // view_details.jsxi:58
				$('<li>').text(e).insertBefore(this);                              // view_details.jsxi:59
			}).bind(ta.find('input')));                                            // view_details.jsxi:60
			updateTags(car.data.tags);                                             // view_details.jsxi:61
			pr.show();                                                             // view_details.jsxi:63
			val('#selected-car-brand', car.data.brand);                            // view_details.jsxi:64
			val('#selected-car-class', car.data.class);                            // view_details.jsxi:65
			val('#selected-car-bhp', car.data.specs.bhp);                          // view_details.jsxi:67
			val('#selected-car-torque', car.data.specs.torque);                    // view_details.jsxi:68
			val('#selected-car-weight', car.data.specs.weight);                    // view_details.jsxi:69
			val('#selected-car-topspeed', car.data.specs.topspeed);                // view_details.jsxi:70
			val('#selected-car-acceleration', car.data.specs.acceleration);        // view_details.jsxi:71
			val('#selected-car-pwratio', car.data.specs.pwratio);                  // view_details.jsxi:72
			updateParents(car);                                                    // view_details.jsxi:74
			
			if (car.parent && !car.hasError('upgrade-missing')){                   // view_details.jsxi:76
				$('#selected-car-upgrade').show().attr('src', car.upgrade);        // view_details.jsxi:77
			} else {
				$('#selected-car-upgrade').hide();                                 // view_details.jsxi:79
			}
		} else {
			he.attr('readonly', true).val(car.id);                                 // view_details.jsxi:82
			de.attr('readonly', true).val('');                                     // view_details.jsxi:83
			ta.hide();                                                             // view_details.jsxi:84
			pr.hide();                                                             // view_details.jsxi:85
		}
	}
	
	function outDisabled(car){                                                     // view_details.jsxi:89
		$('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');      // view_details.jsxi:90
		$('#selected-car-header').toggleClass('disabled', car.disabled);           // view_details.jsxi:91
	}
	
	function outChanged(car){                                                      // view_details.jsxi:94
		$('#selected-car-header').toggleClass('changed', car.changed);             // view_details.jsxi:95
	}
	
	function outSkins(car){                                                        // view_details.jsxi:98
		if (!car.skins || !car.skins[0])                                           // view_details.jsxi:99
			return;
		
		if (!car.skins.selected){                                                  // view_details.jsxi:100
			car.selectSkin(car.skins[0].id);                                       // view_details.jsxi:101
			return;
		}
		
		setTimeout(function (){                                                    // view_details.jsxi:105
			if (car !== _selected)                                                 // view_details.jsxi:106
				return;
			
			var sa = $('#selected-car-skins-article'),                             // view_details.jsxi:107
				sp = $('#selected-car-preview'),                                   // view_details.jsxi:108
				ss = $('#selected-car-skins');                                     // view_details.jsxi:109
			
			if (car.skins){                                                        // view_details.jsxi:110
				sa.show();                                                         // view_details.jsxi:111
				ss.empty();                                                        // view_details.jsxi:112
				sp.attr({                                                          // view_details.jsxi:114
					'data-id': car.skins.selected.id,                              // view_details.jsxi:114
					'src': (car.skins.selected.preview + '?' + Math.random()).cssUrl()
				});
				car.skins.forEach(function (e){                                    // view_details.jsxi:119
					var i = $('<img>').attr({ 'data-id': e.id, 'title': e.id, 'src': e.livery.cssUrl() }).appendTo(ss);
					
					if (e === car.skins.selected){                                 // view_details.jsxi:125
						i.addClass('selected');                                    // view_details.jsxi:126
					}
				});
			} else {
				sa.hide();                                                         // view_details.jsxi:130
			}
		}, 
		50);
	}
	
	function updateParents(car){                                                   // view_details.jsxi:135
		var s = document.getElementById('selected-car-parent');
		
		if (!s)                                                                    // view_details.jsxi:138
			return;
		
		if (car.children.length > 0){                                              // view_details.jsxi:140
			s.parentNode.style.display = 'none';                                   // view_details.jsxi:141
		} else {
			s.parentNode.style.display = null;                                     // view_details.jsxi:143
			s.innerHTML = '<option value="">None</option>' + Cars.list.filter(function (e){
				return e.data && !e.disabled && e.parent == null && e.id != car.id && (!car.parent || car.parent.id != car.id);
			}).map(function (e){                                                   // view_details.jsxi:147
				return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);
			}).join('');                                                           // view_details.jsxi:149
			s.value = car.parent && car.parent.id || '';                           // view_details.jsxi:151
		}
	}
	
	function updateTags(l){                                                        // view_details.jsxi:155
		var t = document.getElementById('tags-filtered');
		
		if (t){                                                                    // view_details.jsxi:158
			document.body.removeChild(t);                                          // view_details.jsxi:159
		}
		
		t = document.body.appendChild(document.createElement('datalist'));         // view_details.jsxi:162
		t.id = 'tags-filtered';                                                    // view_details.jsxi:163
		
		var n = l.map(function (e){                                                // view_details.jsxi:165
			return e.toLowerCase();                                                // view_details.jsxi:166
		});
		
		Cars.tags.forEach(function (v){                                            // view_details.jsxi:169
			if (n.indexOf(v.toLowerCase()) < 0){                                   // view_details.jsxi:170
				t.appendChild(document.createElement('option')).setAttribute('value', v);
			}
		});
	}
	
	function applyTags(){                                                          // view_details.jsxi:176
		if (!_selected || !_selected.data)                                         // view_details.jsxi:177
			return;
		
		Cars.changeData(_selected,                                                 // view_details.jsxi:178
			'tags',                                                                // view_details.jsxi:178
			Array.prototype.map.call(document.querySelectorAll('#selected-car-tags li'), 
				function (a){                                                      // view_details.jsxi:179
					return a.textContent;                                          // view_details.jsxi:179
				}));
		updateTags(_selected.data.tags);                                           // view_details.jsxi:180
	}
	
	function init(){                                                               // view_details.jsxi:183
		Cars.on('scan:ready',                                                      // view_details.jsxi:184
			function (list){                                                       // view_details.jsxi:185
				if (list.length == 0){                                             // view_details.jsxi:186
					outMsg('Hmm', 'Cars not found');                               // view_details.jsxi:187
				}
				
				$('main').show();                                                  // view_details.jsxi:190
			}).on('error',                                                         // view_details.jsxi:192
			function (car){                                                        // view_details.jsxi:192
				if (_selected != car)                                              // view_details.jsxi:193
					return;
				
				outErrors(car);                                                    // view_details.jsxi:194
			}).on('update.car.badge',                                              // view_details.jsxi:196
			function (car){                                                        // view_details.jsxi:196
				if (_selected != car)                                              // view_details.jsxi:197
					return;
				
				outBadge(car);                                                     // view_details.jsxi:198
			}).on('update.car.data',                                               // view_details.jsxi:200
			function (car){                                                        // view_details.jsxi:200
				if (_selected != car)                                              // view_details.jsxi:201
					return;
				
				outData(car);                                                      // view_details.jsxi:202
			}).on('update.car.skins',                                              // view_details.jsxi:204
			function (car){                                                        // view_details.jsxi:204
				if (_selected != car)                                              // view_details.jsxi:205
					return;
				
				outSkins(car);                                                     // view_details.jsxi:206
			}).on('update.car.disabled',                                           // view_details.jsxi:208
			function (car){                                                        // view_details.jsxi:208
				if (_selected != car)                                              // view_details.jsxi:209
					return;
				
				outDisabled(car);                                                  // view_details.jsxi:210
			}).on('update.car.changed',                                            // view_details.jsxi:212
			function (car){                                                        // view_details.jsxi:212
				if (_selected != car)                                              // view_details.jsxi:213
					return;
				
				outChanged(car);                                                   // view_details.jsxi:214
			});
		ViewList.on('select',                                                      // view_details.jsxi:217
			function (car){                                                        // view_details.jsxi:218
				$('main').show();                                                  // view_details.jsxi:219
				_selected = car;                                                   // view_details.jsxi:221
				
				if (car){                                                          // view_details.jsxi:223
					outMsg(null);                                                  // view_details.jsxi:224
				} else {
					return;
				}
				
				outData(car);                                                      // view_details.jsxi:229
				outBadge(car);                                                     // view_details.jsxi:230
				outDisabled(car);                                                  // view_details.jsxi:231
				outChanged(car);                                                   // view_details.jsxi:232
				outErrors(car);                                                    // view_details.jsxi:233
				outSkins(car);                                                     // view_details.jsxi:234
			});
		$('#selected-car').on('keydown',                                           // view_details.jsxi:238
			function (e){                                                          // view_details.jsxi:239
				if (e.keyCode == 13){                                              // view_details.jsxi:240
					this.blur();                                                   // view_details.jsxi:241
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:245
			function (){                                                           // view_details.jsxi:245
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:246
					return;
				
				this.value = this.value.slice(0, 64);                              // view_details.jsxi:247
				Cars.changeData(_selected, 'name', this.value);                    // view_details.jsxi:248
			});
		$('#selected-car-tags').on('click',                                        // view_details.jsxi:251
			function (e){                                                          // view_details.jsxi:252
				if (e.target.tagName === 'LI' && e.target.offsetWidth - e.offsetX < 20){
					e.target.parentNode.removeChild(e.target);                     // view_details.jsxi:254
					applyTags();                                                   // view_details.jsxi:255
				} else {
					this.querySelector('input').focus();                           // view_details.jsxi:257
				}
			});
		$('#selected-car-tags input').on('change',                                 // view_details.jsxi:261
			function (){                                                           // view_details.jsxi:262
				if (this.value){                                                   // view_details.jsxi:263
					this.parentNode.insertBefore(document.createElement('li'), this).textContent = this.value;
					this.value = '';                                               // view_details.jsxi:265
					applyTags();                                                   // view_details.jsxi:266
				}
			}).on('keydown',                                                       // view_details.jsxi:269
			function (e){                                                          // view_details.jsxi:269
				if (e.keyCode == 8 && this.value == ''){                           // view_details.jsxi:270
					this.parentNode.removeChild(this.parentNode.querySelector('li:last-of-type'));
					applyTags();                                                   // view_details.jsxi:272
				}
			});
		$('#selected-car-desc').elastic().on('change',                             // view_details.jsxi:276
			function (){                                                           // view_details.jsxi:277
				if (!_selected || this.readonly)                                   // view_details.jsxi:278
					return;
				
				Cars.changeData(_selected, 'description', this.value);             // view_details.jsxi:279
			});
		$('#selected-car-brand').on('keydown',                                     // view_details.jsxi:282
			function (e){                                                          // view_details.jsxi:283
				if (e.keyCode == 13){                                              // view_details.jsxi:284
					this.blur();                                                   // view_details.jsxi:285
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:289
			function (e){                                                          // view_details.jsxi:289
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:290
					return;
				
				var name = _selected.data.name;
				
				if (name.indexOf(_selected.data.brand + ' ') === 0){               // view_details.jsxi:293
					name = name.substr(_selected.data.brand.length + 1);           // view_details.jsxi:294
				} else {
					name = null;                                                   // view_details.jsxi:296
				}
				
				Cars.changeData(_selected, 'brand', this.value);                   // view_details.jsxi:299
				
				if (name){                                                         // view_details.jsxi:301
					Cars.changeData(_selected, 'name', this.value + ' ' + name);   // view_details.jsxi:302
				}
			}).on('contextmenu',                                                   // view_details.jsxi:305
			function (e){                                                          // view_details.jsxi:305
				if (!_selected || !_selected.data)                                 // view_details.jsxi:306
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:309
					label: 'Filter Brand',                                         // view_details.jsxi:309
					key: 'F',                                                      // view_details.jsxi:309
					click: (function (){                                           // view_details.jsxi:309
						if (!_selected)                                            // view_details.jsxi:310
							return;
						
						ViewList.addFilter('brand:' + _selected.data.brand);       // view_details.jsxi:311
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:314
				return false;
			});
		$('#selected-car-class').on('keydown',                                     // view_details.jsxi:318
			function (e){                                                          // view_details.jsxi:319
				if (e.keyCode == 13){                                              // view_details.jsxi:320
					this.blur();                                                   // view_details.jsxi:321
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:325
			function (){                                                           // view_details.jsxi:325
				if (!_selected || this.readonly)                                   // view_details.jsxi:326
					return;
				
				Cars.changeData(_selected, 'class', this.value);                   // view_details.jsxi:327
			}).on('contextmenu',                                                   // view_details.jsxi:329
			function (e){                                                          // view_details.jsxi:329
				if (!_selected || !_selected.data)                                 // view_details.jsxi:330
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:333
					label: 'Filter Class',                                         // view_details.jsxi:333
					key: 'F',                                                      // view_details.jsxi:333
					click: (function (){                                           // view_details.jsxi:333
						if (!_selected)                                            // view_details.jsxi:334
							return;
						
						ViewList.addFilter('class:' + _selected.data.class);       // view_details.jsxi:335
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:338
				return false;
			});
		$('#selected-car-parent').on('change',                                     // view_details.jsxi:342
			function (e){                                                          // view_details.jsxi:343
				if (!_selected)                                                    // view_details.jsxi:344
					return;
				
				var t = this, v = this.value || null;
				
				if (v && !fs.existsSync(_selected.upgrade)){                       // view_details.jsxi:347
					UpgradeEditor.start(_selected,                                 // view_details.jsxi:348
						function (arg){                                            // view_details.jsxi:348
							if (fs.existsSync(_selected.upgrade)){                 // view_details.jsxi:349
								fn();                                              // view_details.jsxi:350
							} else {
								t.value = '';                                      // view_details.jsxi:352
							}
						});
				} else {
					fn();                                                          // view_details.jsxi:356
				}
				
				function fn(){                                                     // view_details.jsxi:359
					_selected.changeParent(v);                                     // view_details.jsxi:360
				}
			});
		[
			'bhp',                                                                 // view_details.jsxi:364
			'torque',                                                              // view_details.jsxi:364
			'weight',                                                              // view_details.jsxi:364
			'topspeed',                                                            // view_details.jsxi:364
			'acceleration',                                                        // view_details.jsxi:364
			'pwratio'
		].forEach(function (e){                                                    // view_details.jsxi:364
			$('#selected-car-' + e).on('keydown',                                  // view_details.jsxi:365
				function (e){                                                      // view_details.jsxi:365
					if (e.keyCode == 13){                                          // view_details.jsxi:366
						this.blur();                                               // view_details.jsxi:367
						return false;
					}
				}).on('keyup keydown keypress',                                    // view_details.jsxi:370
				function (e){                                                      // view_details.jsxi:370
					if (e.keyCode == 32){                                          // view_details.jsxi:371
						e.stopPropagation();                                       // view_details.jsxi:372
						
						if (e.type === 'keyup'){                                   // view_details.jsxi:373
							return false;
						}
					}
				}).on('change',                                                    // view_details.jsxi:377
				function (){                                                       // view_details.jsxi:377
					if (!_selected || this.readonly)                               // view_details.jsxi:378
						return;
					
					Cars.changeDataSpecs(_selected, e, this.value);                // view_details.jsxi:379
				});
		});
		$('#selected-car-pwratio').on('dblclick contextmenu',                      // view_details.jsxi:383
			function (e){                                                          // view_details.jsxi:384
				if (!_selected || !_selected.data || this.readonly)                // view_details.jsxi:385
					return;
				
				function r(){                                                      // view_details.jsxi:387
					if (!_selected || !_selected.data || this.readonly)            // view_details.jsxi:388
						return;
					
					var w = (_selected.data.specs.weight || '').match(/\d+/),      // view_details.jsxi:389
						p = (_selected.data.specs.bhp || '').match(/\d+/);         // view_details.jsxi:390
					
					if (w && p){                                                   // view_details.jsxi:391
						Cars.changeDataSpecs(_selected, 'pwratio', + (+ w / + p).toFixed(2) + 'kg/cv');
					}
				}
				
				if (e.type === 'dblclick'){                                        // view_details.jsxi:396
					r();                                                           // view_details.jsxi:397
				} else {
					var menu = new gui.Menu();
					
					menu.append(new gui.MenuItem({ label: 'Recalculate', key: 'R', click: r }));
					menu.popup(e.clientX, e.clientY);                              // view_details.jsxi:401
					return false;
				}
			});
		$('#selected-car-upgrade').on('click',                                     // view_details.jsxi:406
			function (){                                                           // view_details.jsxi:407
				if (!_selected)                                                    // view_details.jsxi:408
					return;
				
				UpgradeEditor.start(_selected);                                    // view_details.jsxi:409
			});
		$('#selected-car-skins-article').dblclick(function (e){                    // view_details.jsxi:413
			if (!_selected)                                                        // view_details.jsxi:415
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:416
		}).on('contextmenu',                                                       // view_details.jsxi:418
			function (e){                                                          // view_details.jsxi:418
				if (!_selected)                                                    // view_details.jsxi:419
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:422
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:425
					label: 'Open in Showroom',                                     // view_details.jsxi:425
					key: 'S',                                                      // view_details.jsxi:425
					click: (function (){                                           // view_details.jsxi:425
						if (!_selected)                                            // view_details.jsxi:426
							return;
						
						AcShowroom.start(_selected, id);                           // view_details.jsxi:427
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:429
					label: 'Start Practice',                                       // view_details.jsxi:429
					key: 'P',                                                      // view_details.jsxi:429
					click: (function (){                                           // view_details.jsxi:429
						if (!_selected)                                            // view_details.jsxi:430
							return;
						
						AcPractice.start(_selected, id);                           // view_details.jsxi:431
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:438
				return false;
			});
		$('#selected-car-skins').on('click',                                       // view_details.jsxi:443
			function (e){                                                          // view_details.jsxi:444
				if (!_selected)                                                    // view_details.jsxi:445
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:448
					return;
				
				_selected.selectSkin(id);                                          // view_details.jsxi:450
			});
		$('#selected-car-error').click(function (e){                               // view_details.jsxi:454
			if (!_selected)                                                        // view_details.jsxi:455
				return;
			
			var id = e.target.getAttribute('data-error-id');
			
			if (id){                                                               // view_details.jsxi:457
				RestorationWizard.fix(_selected, id);                              // view_details.jsxi:458
			}
		});
		$(window).on('keydown',                                                    // view_details.jsxi:463
			function (e){                                                          // view_details.jsxi:464
				if (!_selected)                                                    // view_details.jsxi:465
					return;
				
				if (e.keyCode == 83 && e.ctrlKey){                                 // view_details.jsxi:467
					_selected.save();                                              // view_details.jsxi:469
					return false;
				}
			});
		
		var cmIgnore = false;
		
		$('main').on('contextmenu',                                                // view_details.jsxi:476
			function (){                                                           // view_details.jsxi:477
				this.querySelector('footer').classList.toggle('active');           // view_details.jsxi:478
				cmIgnore = true;                                                   // view_details.jsxi:479
			});
		$(window).on('click contextmenu',                                          // view_details.jsxi:482
			(function (e){                                                         // view_details.jsxi:483
				if (cmIgnore){                                                     // view_details.jsxi:484
					cmIgnore = false;                                              // view_details.jsxi:485
				} else if (e.target !== this){                                     // view_details.jsxi:486
					this.classList.remove('active');                               // view_details.jsxi:487
				}
			}).bind($('main footer')[0]));                                         // view_details.jsxi:489
		$('#selected-car-open-directory').click(function (){                       // view_details.jsxi:492
			if (!_selected)                                                        // view_details.jsxi:493
				return;
			
			Shell.openItem(_selected.path);                                        // view_details.jsxi:494
		});
		$('#selected-car-showroom').click(function (){                             // view_details.jsxi:497
			if (!_selected)                                                        // view_details.jsxi:498
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:499
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:502
			if (!_selected)                                                        // view_details.jsxi:503
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:504
		});
		$('#selected-car-practice').click(function (){                             // view_details.jsxi:507
			if (!_selected)                                                        // view_details.jsxi:508
				return;
			
			AcPractice.start(_selected);                                           // view_details.jsxi:509
		});
		$('#selected-car-practice-select').click(function (){                      // view_details.jsxi:512
			if (!_selected)                                                        // view_details.jsxi:513
				return;
			
			AcPractice.select(_selected);                                          // view_details.jsxi:514
		});
		$('#selected-car-reload').click(function (){                               // view_details.jsxi:517
			if (!_selected)                                                        // view_details.jsxi:518
				return;
			
			if (_selected.changed){                                                // view_details.jsxi:520
				new Dialog('Reload',                                               // view_details.jsxi:521
					[ 'Your changes will be lost. Are you sure?' ], 
					reload);                                                       // view_details.jsxi:523
			} else {
				reload();                                                          // view_details.jsxi:525
			}
			
			function reload(){                                                     // view_details.jsxi:528
				Cars.reload(_selected);                                            // view_details.jsxi:529
			}
		});
		$('#selected-car-disable').click(function (){                              // view_details.jsxi:534
			if (!_selected)                                                        // view_details.jsxi:535
				return;
			
			Cars.toggle(_selected);                                                // view_details.jsxi:536
		});
		$('#selected-car-update-previews').click(function (){                      // view_details.jsxi:539
			if (!_selected)                                                        // view_details.jsxi:540
				return;
			
			AcShowroom.shot(_selected);                                            // view_details.jsxi:541
		});
		$('#selected-car-update-previews-manual').click(function (){               // view_details.jsxi:544
			if (!_selected)                                                        // view_details.jsxi:545
				return;
			
			AcShowroom.shot(_selected, true);                                      // view_details.jsxi:546
		});
		$('#selected-car-update-description').click(function (){                   // view_details.jsxi:549
			if (!_selected)                                                        // view_details.jsxi:550
				return;
			
			UpdateDescription.update(_selected);                                   // view_details.jsxi:551
		});
		$('#selected-car-save').click(function (){                                 // view_details.jsxi:554
			if (!_selected)                                                        // view_details.jsxi:555
				return;
			
			Cars.save(_selected);                                                  // view_details.jsxi:556
		});
	}
	
	(function (){                                                                  // view_details.jsxi:560
		$(init);                                                                   // view_details.jsxi:561
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
		_sortFn = {                                                                // view_list.jsxi:108
			id: (function (a, b){                                                  // view_list.jsxi:108
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.id.localeCompare(b.id);
			}), 
			displayName: (function (a, b){                                         // view_list.jsxi:112
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.displayName.localeCompare(b.displayName);
			})
		};
	
	function scrollToSelected(){                                                   // view_list.jsxi:8
		var n = _node[0].querySelector('.selected');
		
		if (!n)                                                                    // view_list.jsxi:10
			return;
		
		while (n && n.parentNode !== _node[0])                                     // view_list.jsxi:12
			n = n.parentNode;                                                      // view_list.jsxi:13
		
		var p = n.offsetTop - n.parentNode.scrollTop;
		
		if (p < 50){                                                               // view_list.jsxi:16
			n.parentNode.scrollTop += p - 50;                                      // view_list.jsxi:17
		} else if (p > n.parentNode.offsetHeight - 80){                            // view_list.jsxi:18
			n.parentNode.scrollTop += p + 80 - n.parentNode.offsetHeight;          // view_list.jsxi:19
		}
	}
	
	ViewList.select = function (car){                                              // view_list.jsxi:23
		_selected = car;                                                           // view_list.jsxi:24
		_node.find('.expand').removeClass('expand');                               // view_list.jsxi:25
		_node.find('.selected').removeClass('selected');                           // view_list.jsxi:26
		
		if (car){                                                                  // view_list.jsxi:28
			localStorage.selectedCar = car.id;                                     // view_list.jsxi:29
			
			var n = _node.find('[data-id="' + car.id + '"]').addClass('expand').parent().addClass('selected')[0];
			
			if (car.parent){                                                       // view_list.jsxi:32
				n = _node.find('[data-id="' + car.parent.id + '"]').addClass('expand')[0];
			}
			
			scrollToSelected();                                                    // view_list.jsxi:36
		}
		
		mediator.dispatch('select', car);                                          // view_list.jsxi:39
	};
	ViewList.selectNear = function (d){                                            // view_list.jsxi:42
		if (!_selected)                                                            // view_list.jsxi:43
			return ViewList.select(Cars.list[0]);
		
		var n = _node[0].querySelectorAll('[data-id]');
		
		for (var p, i = 0; i < n.length; i ++){                                    // view_list.jsxi:46
			if (n[i].getAttribute('data-id') === _selected.id){                    // view_list.jsxi:47
				p = i;                                                             // view_list.jsxi:48
				
				break;
			}
		}
		
		if (p == null)                                                             // view_list.jsxi:53
			return;
		
		var j = n[(p + d + n.length) % n.length].getAttribute('data-id');
		
		ViewList.select(Cars.byName(j));
	};
	ViewList.filter = function (v){                                                // view_list.jsxi:58
		var i = _aside.find('#cars-list-filter')[0];
		
		if (i.value != v){                                                         // view_list.jsxi:60
			i.value = v;                                                           // view_list.jsxi:61
		}
		
		if (v){                                                                    // view_list.jsxi:64
			i.style.display = 'block';                                             // view_list.jsxi:65
			
			var s = v.trim().split(/\s+/);
			
			var bb = '', cc = '';
			
			var vv = s.filter(function (e){                                        // view_list.jsxi:70
				if (/^brand:(.*)/.test(e)){                                        // view_list.jsxi:71
					bb = (bb && bb + '|') + RegExp.$1;                             // view_list.jsxi:72
					return false;
				}
				
				if (/^class:(.*)/.test(e)){                                        // view_list.jsxi:76
					cc = (cc && cc + '|') + RegExp.$1;                             // view_list.jsxi:77
					return false;
				}
				return true;
			});
			
			var r = RegExp.fromQuery(vv.join(' '));
			
			var b = bb && RegExp.fromQuery(bb, true);
			
			var c = cc && RegExp.fromQuery(cc, true);
			
			var f = function (car){                                                // view_list.jsxi:88
				if (b && (!car.data || !b.test(car.data.brand)))                   // view_list.jsxi:89
					return false;
				
				if (c && (!car.data || !c.test(car.data.class)))                   // view_list.jsxi:90
					return false;
				return r.test(car.id) || car.data && r.test(car.data.name);        // view_list.jsxi:91
			};
			
			_aside.find('#cars-list > div > [data-id]').each(function (){          // view_list.jsxi:94
				this.parentNode.style.display = f(Cars.byName(this.getAttribute('data-id'))) ? null : 'none';
			});
		} else {
			i.style.display = 'hide';                                              // view_list.jsxi:98
			_aside.find('#cars-list > div').show();                                // view_list.jsxi:99
		}
	};
	ViewList.addFilter = function (v){                                             // view_list.jsxi:103
		var a = _aside.find('#cars-list-filter')[0].value;
		
		ViewList.filter((a && a + ' ') + v);
	};
	ViewList.sort = function (){                                                   // view_list.jsxi:116
		var c = Cars.list.sort(_sortFn.displayName);
		
		var n = _node[0];
		
		var a = n.children;
		
		c.forEach(function (arg){                                                  // view_list.jsxi:121
			for (var __2 = 0; __2 < a.length; __2 ++){                             // view_list.jsxi:122
				var s = a[__2];
				
				if (s.children[0].getAttribute('data-id') == arg.id){              // view_list.jsxi:123
					n.appendChild(s);                                              // view_list.jsxi:124
					return;
				}
			}
		});
		scrollToSelected();                                                        // view_list.jsxi:130
	};
	
	function init(){                                                               // view_list.jsxi:133
		Cars.on('scan:start',                                                      // view_list.jsxi:134
			function (){                                                           // view_list.jsxi:135
				_aside.find('#cars-list').empty();                                 // view_list.jsxi:136
				document.body.removeChild(_aside[0]);                              // view_list.jsxi:137
			}).on('scan:ready',                                                    // view_list.jsxi:139
			function (list){                                                       // view_list.jsxi:139
				$('#total-cars').val(list.filter(function (e){                     // view_list.jsxi:140
					return e.parent == null;                                       // view_list.jsxi:141
				}).length).attr('title',                                           // view_list.jsxi:142
					'Including modded versions: {0}'.format(list.length));         // view_list.jsxi:142
				ViewList.sort();
				document.body.appendChild(_aside[0]);                              // view_list.jsxi:145
				
				if (list.length > 0){                                              // view_list.jsxi:147
					ViewList.select(Cars.byName(localStorage.selectedCar) || list[0]);
				}
			}).on('new.car',                                                       // view_list.jsxi:151
			function (car){                                                        // view_list.jsxi:151
				var s = document.createElement('span');
				
				s.textContent = car.displayName;                                   // view_list.jsxi:153
				
				if (car.disabled)                                                  // view_list.jsxi:154
					s.classList.add('disabled');                                   // view_list.jsxi:154
				
				s.setAttribute('title', car.path);                                 // view_list.jsxi:156
				s.setAttribute('data-id', car.id);                                 // view_list.jsxi:157
				s.setAttribute('data-name', car.id);                               // view_list.jsxi:158
				s.setAttribute('data-path', car.path);                             // view_list.jsxi:159
				
				var d = document.createElement('div');
				
				d.appendChild(s);                                                  // view_list.jsxi:162
				
				if (car.children.length > 0){                                      // view_list.jsxi:164
					d.setAttribute('data-children', car.children.length + 1);      // view_list.jsxi:165
				}
				
				_node[0].appendChild(d);                                           // view_list.jsxi:168
			}).on('update.car.data',                                               // view_list.jsxi:170
			function (car, upd){                                                   // view_list.jsxi:170
				_node.find('[data-id="' + car.id + '"]').text(car.displayName).attr('data-name', car.displayName.toLowerCase());
				ViewList.filter(_aside.find('#cars-list-filter').val());
				
				if (upd === 'update.car.data:name'){                               // view_list.jsxi:175
					ViewList.sort();
				}
			}).on('update.car.parent',                                             // view_list.jsxi:179
			function (car){                                                        // view_list.jsxi:179
				var d = _node[0].querySelector('[data-id="' + car.id + '"]').parentNode;
				
				if (car.error.length > 0){                                         // view_list.jsxi:181
					var c = d.parentNode;
					
					if (c.tagName === 'DIV' && c.querySelectorAll('.error').length == 1){
						c.classList.remove('error');                               // view_list.jsxi:184
					}
				}
				
				if (car.parent){                                                   // view_list.jsxi:188
					var p = _node[0].querySelector('[data-id="' + car.parent.id + '"]').parentNode;
					
					p.appendChild(d);                                              // view_list.jsxi:190
					
					if (d.classList.contains('error')){                            // view_list.jsxi:191
						d.classList.remove('error');                               // view_list.jsxi:192
						p.classList.add('error');                                  // view_list.jsxi:193
					}
				} else {
					_node[0].appendChild(d);                                       // view_list.jsxi:196
					ViewList.sort();
				}
				
				scrollToSelected();                                                // view_list.jsxi:200
			}).on('update.car.children',                                           // view_list.jsxi:202
			function (car){                                                        // view_list.jsxi:202
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:204
					return;
				
				if (car.children.length){                                          // view_list.jsxi:205
					e.parentNode.setAttribute('data-children', car.children.length + 1);
				} else {
					e.parentNode.removeAttribute('data-children');                 // view_list.jsxi:208
				}
			}).on('update.car.path',                                               // view_list.jsxi:211
			function (car){                                                        // view_list.jsxi:211
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:213
					return;
				
				e.setAttribute('data-path', car.path);                             // view_list.jsxi:214
				e.setAttribute('title', car.path);                                 // view_list.jsxi:215
			}).on('update.car.disabled',                                           // view_list.jsxi:217
			function (car){                                                        // view_list.jsxi:217
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:219
					return;
				
				if (car.disabled){                                                 // view_list.jsxi:220
					e.classList.add('disabled');                                   // view_list.jsxi:221
				} else {
					e.classList.remove('disabled');                                // view_list.jsxi:223
				}
				
				ViewList.sort();
			}).on('update.car.changed',                                            // view_list.jsxi:228
			function (car){                                                        // view_list.jsxi:228
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:230
					return;
				
				if (car.changed){                                                  // view_list.jsxi:231
					e.classList.add('changed');                                    // view_list.jsxi:232
				} else {
					e.classList.remove('changed');                                 // view_list.jsxi:234
				}
			}).on('error',                                                         // view_list.jsxi:237
			function (car){                                                        // view_list.jsxi:237
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:239
					return;
				
				if (car.error.length > 0){                                         // view_list.jsxi:241
					e.classList.add('error');                                      // view_list.jsxi:242
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:244
				}
				
				while (e.parentNode.id !== 'cars-list'){                           // view_list.jsxi:247
					e = e.parentNode;                                              // view_list.jsxi:248
				}
				
				if (car.error.length > 0){                                         // view_list.jsxi:251
					e.classList.add('error');                                      // view_list.jsxi:252
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:254
				}
			});
		_aside.find('#cars-list-filter').on('change paste keyup keypress search', 
			function (e){                                                          // view_list.jsxi:259
				if (e.keyCode == 13){                                              // view_list.jsxi:260
					this.blur();                                                   // view_list.jsxi:261
				}
				
				if (e.keyCode == 27){                                              // view_list.jsxi:264
					this.value = '';                                               // view_list.jsxi:265
					this.blur();                                                   // view_list.jsxi:266
				}
				
				ViewList.filter(this.value);
			}).on('keydown',                                                       // view_list.jsxi:271
			function (e){                                                          // view_list.jsxi:271
				if (e.keyCode == 8 && !this.value){                                // view_list.jsxi:272
					this.blur();                                                   // view_list.jsxi:273
				}
			}).on('blur',                                                          // view_list.jsxi:276
			function (){                                                           // view_list.jsxi:276
				if (!this.value){                                                  // view_list.jsxi:277
					$(this).hide();                                                // view_list.jsxi:278
				}
			});
		$(window).on('keydown',                                                    // view_list.jsxi:283
			function (e){                                                          // view_list.jsxi:284
				if (Event.isSomeInput(e))                                          // view_list.jsxi:285
					return;
				
				if (e.ctrlKey || e.altKey || e.shiftKey)                           // view_list.jsxi:286
					return;
				
				var f = _aside.find('#cars-list-filter');
				
				if (/[a-zA-Z\d]/.test(String.fromCharCode(e.keyCode)) || e.keyCode == 8 && f.val()){
					f.show()[0].focus();                                           // view_list.jsxi:290
				}
				
				if (e.keyCode === 38){                                             // view_list.jsxi:293
					ViewList.selectNear(- 1);
					return false;
				}
				
				if (e.keyCode === 40){                                             // view_list.jsxi:298
					ViewList.selectNear(1);
					return false;
				}
			});
		_aside.find('#cars-list-filter-focus').click(function (){                  // view_list.jsxi:304
			_aside.find('#cars-list-filter').show()[0].focus();                    // view_list.jsxi:305
		});
		_aside.find('#cars-list').click(function (e){                              // view_list.jsxi:309
			var car = Cars.byName(e.target.getAttribute('data-id'));
			
			if (!car)                                                              // view_list.jsxi:311
				return;
			
			ViewList.select(car);
		});
		
		var cmIgnore = false;
		
		_aside.on('contextmenu',                                                   // view_list.jsxi:317
			function (){                                                           // view_list.jsxi:318
				this.querySelector('footer').classList.toggle('active');           // view_list.jsxi:319
				cmIgnore = true;                                                   // view_list.jsxi:320
			});
		$(window).on('click contextmenu',                                          // view_list.jsxi:323
			(function (e){                                                         // view_list.jsxi:324
				if (cmIgnore){                                                     // view_list.jsxi:325
					cmIgnore = false;                                              // view_list.jsxi:326
				} else if (e.target !== this){                                     // view_list.jsxi:327
					this.classList.remove('active');                               // view_list.jsxi:328
				}
			}).bind(_aside.find('footer')[0]));                                    // view_list.jsxi:330
		_aside.find('#cars-list-open-directory').click(function (){                // view_list.jsxi:333
			if (!_selected)                                                        // view_list.jsxi:334
				return;
			
			Shell.openItem(AcDir.cars);                                            // view_list.jsxi:335
		});
		_aside.find('#cars-list-reload').click(function (){                        // view_list.jsxi:338
			if (Cars.list.some(function (e){                                       // view_list.jsxi:339
				return e.changed;                                                  // view_list.jsxi:340
			})){
				new Dialog('Reload',                                               // view_list.jsxi:342
					[
						'<p>{0}</p>'.format('Your changes will be lost. Are you sure?')
					], 
					reload);                                                       // view_list.jsxi:344
			} else {
				reload();                                                          // view_list.jsxi:346
			}
			
			function reload(){                                                     // view_list.jsxi:349
				Cars.reloadAll();                                                  // view_list.jsxi:350
			}
		});
		_aside.find('#cars-list-batch').click(function (){                         // view_list.jsxi:355
			if (_aside.find('#cars-list-filter').val()){                           // view_list.jsxi:356
				var filtered = [];
				
				var n = _node[0].querySelectorAll('[data-id]');
				
				for (var i = 0; i < n.length; i ++){                               // view_list.jsxi:360
					filtered.push(Cars.byName(n[i].getAttribute('data-id')));      // view_list.jsxi:361
				}
				
				BatchProcessing.select(filtered);                                  // view_list.jsxi:364
			} else {
				BatchProcessing.select(Cars.list.slice());                         // view_list.jsxi:366
			}
		});
		_aside.find('#cars-list-save').click(function (){                          // view_list.jsxi:370
			Cars.saveAll();                                                        // view_list.jsxi:371
		});
	}
	
	Object.defineProperty(ViewList,                                                // view_list.jsxi:1
		'selected', 
		{
			get: (function (){
				return _selected;                                                  // view_list.jsxi:375
			})
		});
	(function (){                                                                  // view_list.jsxi:377
		init();                                                                    // view_list.jsxi:378
		mediator.extend(ViewList);                                                 // view_list.jsxi:379
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
				s.aptCameraDistance = aptCameraDistance;                           // view_settings.jsxi:25
				s.aptIncreaseDelays = aptIncreaseDelays;                           // view_settings.jsxi:26
			});
		}
		
		var d = new Dialog('Settings',                                             // view_settings.jsxi:30
			[
				'<h6>Assetto Corsa Folder</h6>',                                   // view_settings.jsxi:31
				'<button id="settings-acdir-select" style="float:right;width:30px">…</button>', 
				'<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">', 
				'<h6>Tips</h6>',                                                   // view_settings.jsxi:35
				'<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>', 
				'<h6>Database</h6>',                                               // view_settings.jsxi:38
				'<label><input id="settings-update-database" type="checkbox" disabled>Update databases</label><br>', 
				'<label><input id="settings-upload-data" type="checkbox">Upload some changes</label>', 
				'<h6>Updates</h6>',                                                // view_settings.jsxi:42
				'<label><input id="settings-updates-check" type="checkbox">Check for new versions on launch</label>', 
				'<select id="settings-updates-source"><option value="stable">Stable</option><option value="last">Beta</option></select>'
			], 
			save,                                                                  // view_settings.jsxi:48
			false).setButton('Save').addButton('Cancel');                          // view_settings.jsxi:48
		
		var acdirVal;
		
		function acdirChange(){                                                    // view_settings.jsxi:52
			var err = AcDir.check(acdirVal = d.find('#settings-acdir').val());     // view_settings.jsxi:53
			
			$(this).toggleClass('invalid', !!err).attr('title', err || null);      // view_settings.jsxi:54
			
			if (err){                                                              // view_settings.jsxi:55
				acdirVal = false;                                                  // view_settings.jsxi:56
			}
		}
		
		d.content.find('#settings-acdir').val(AcDir.root).change(acdirChange);     // view_settings.jsxi:60
		d.content.find('#settings-acdir-select').click(function (){                // view_settings.jsxi:62
			$('<input type="file" nwdirectory />').attr({ nwworkingdir: d.content.find('#settings-acdir').val() }).change(function (){
				d.content.find('#settings-acdir').val(this.value);                 // view_settings.jsxi:66
				acdirChange();                                                     // view_settings.jsxi:67
			}).click();                                                            // view_settings.jsxi:68
		});
		
		var disableTips = Settings.get('disableTips');
		
		d.content.find('#settings-disable-tips').change(function (arg){            // view_settings.jsxi:73
			disableTips = this.checked;                                            // view_settings.jsxi:73
		})[0].checked = disableTips;                                               // view_settings.jsxi:73
		
		var updateDatabase = Settings.get('updateDatabase');
		
		d.content.find('#settings-update-database').change(function (arg){         // view_settings.jsxi:77
			updateDatabase = this.checked;                                         // view_settings.jsxi:77
		})[0].checked = updateDatabase;                                            // view_settings.jsxi:77
		
		var uploadData = Settings.get('uploadData');
		
		d.content.find('#settings-upload-data').change(function (arg){             // view_settings.jsxi:80
			uploadData = this.checked;                                             // view_settings.jsxi:80
		})[0].checked = uploadData;                                                // view_settings.jsxi:80
		
		var updatesCheck = Settings.get('updatesCheck');
		
		d.content.find('#settings-updates-check').change(function (arg){           // view_settings.jsxi:84
			updatesCheck = this.checked;                                           // view_settings.jsxi:84
		})[0].checked = updatesCheck;                                              // view_settings.jsxi:84
		
		var updatesSource = Settings.get('updatesSource');
		
		d.content.find('#settings-updates-source').change(function (arg){          // view_settings.jsxi:87
			updatesSource = this.value;                                            // view_settings.jsxi:87
		})[0].value = updatesSource;                                               // view_settings.jsxi:87
		
		var apt = d.addTab('Auto-Preview',                                         // view_settings.jsxi:90
			[
				'<h6>Showroom</h6>',                                               // view_settings.jsxi:91
				'<select id="apt-showroom"><option value="">Black Showroom (Recommended)</option>{0}</select>'.format(AcShowroom.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join('')),                                                      // view_settings.jsxi:94
				'<h6>Filter</h6>',                                                 // view_settings.jsxi:96
				'<select id="apt-filter"><option value="">Don\'t change</option>{0}</select>'.format(AcFilters.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.id);
				}).join('')),                                                      // view_settings.jsxi:99
				'<label><input id="apt-disable-sweetfx" type="checkbox">Disable SweetFX (Recommended)</label>', 
				'<h6>Resize</h6>',                                                 // view_settings.jsxi:102
				'<label><input id="apt-resize" type="checkbox">Change size to default 1024×576 (Recommended)</label>', 
				'<h6>Camera Position</h6>',                                        // view_settings.jsxi:105
				'<label>X: <input id="apt-camera-x" type="number" step="1"></label>', 
				'<label>Y: <input id="apt-camera-y" type="number" step="1"></label>', 
				'<label>Distance: <input id="apt-camera-distance" type="number" step="0.1"></label>', 
				'<h6>Delays</h6>',                                                 // view_settings.jsxi:110
				'<label><input id="apt-increase-delays" type="checkbox">Increased delays</label>'
			], 
			save).setButton('Save').addButton('Defaults',                          // view_settings.jsxi:113
			function (){                                                           // view_settings.jsxi:113
				apt.content.find('#apt-showroom')[0].value = (aptShowroom = Settings.defaults.aptShowroom);
				
				if (AcFilters.list.length)                                         // view_settings.jsxi:115
					apt.content.find('#apt-filter')[0].value = (aptFilter = Settings.defaults.aptFilter);
				
				apt.content.find('#apt-disable-sweetfx')[0].checked = (aptDisableSweetFx = Settings.defaults.aptDisableSweetFx);
				apt.content.find('#apt-resize')[0].checked = (aptResize = Settings.defaults.aptResize);
				apt.content.find('#apt-camera-x')[0].value = (aptCameraX = Settings.defaults.aptCameraX);
				apt.content.find('#apt-camera-y')[0].value = (aptCameraY = Settings.defaults.aptCameraY);
				apt.content.find('#apt-camera-distance')[0].value = (aptCameraDistance = Settings.defaults.aptCameraDistance);
				apt.content.find('#apt-increase-delays')[0].checked = (aptIncreaseDelays = Settings.defaults.aptIncreaseDelays);
				return false;
			}).addButton('Cancel');                                                // view_settings.jsxi:123
		
		var aptShowroom = Settings.get('aptShowroom');
		
		apt.content.find('#apt-showroom').change(function (arg){                   // view_settings.jsxi:126
			aptShowroom = this.value;                                              // view_settings.jsxi:126
		})[0].value = aptShowroom;                                                 // view_settings.jsxi:126
		
		var aptFilter = Settings.get('aptFilter');
		
		if (AcFilters.list.length){                                                // view_settings.jsxi:129
			apt.content.find('#apt-filter').change(function (arg){                 // view_settings.jsxi:130
				aptFilter = this.value;                                            // view_settings.jsxi:130
			})[0].value = aptFilter;                                               // view_settings.jsxi:130
			
			var recFilter = apt.content.find('#apt-filter [value="' + Settings.defaults.aptFilter + '"]')[0];
			
			if (recFilter)                                                         // view_settings.jsxi:132
				recFilter.textContent += ' (Recommended)';                         // view_settings.jsxi:132
		} else {
			apt.content.find('#apt-filter').attr({ disabled: true, title: 'Filters not found' });
		}
		
		var aptDisableSweetFx = Settings.get('aptDisableSweetFx');
		
		apt.content.find('#apt-disable-sweetfx').change(function (arg){            // view_settings.jsxi:141
			aptDisableSweetFx = this.checked;                                      // view_settings.jsxi:141
		})[0].checked = aptDisableSweetFx;                                         // view_settings.jsxi:141
		
		var aptResize = Settings.get('aptResize');
		
		apt.content.find('#apt-resize').change(function (arg){                     // view_settings.jsxi:144
			aptResize = this.checked;                                              // view_settings.jsxi:144
		})[0].checked = aptResize;                                                 // view_settings.jsxi:144
		
		var aptCameraX = Settings.get('aptCameraX');
		
		apt.content.find('#apt-camera-x').change(function (arg){                   // view_settings.jsxi:147
			aptCameraX = this.value;                                               // view_settings.jsxi:147
		})[0].value = aptCameraX;                                                  // view_settings.jsxi:147
		
		var aptCameraY = Settings.get('aptCameraY');
		
		apt.content.find('#apt-camera-y').change(function (arg){                   // view_settings.jsxi:150
			aptCameraY = this.value;                                               // view_settings.jsxi:150
		})[0].value = aptCameraY;                                                  // view_settings.jsxi:150
		
		var aptCameraDistance = Settings.get('aptCameraDistance');
		
		apt.content.find('#apt-camera-distance').change(function (arg){            // view_settings.jsxi:153
			aptCameraDistance = this.value;                                        // view_settings.jsxi:153
		})[0].value = aptCameraDistance;                                           // view_settings.jsxi:153
		
		var aptIncreaseDelays = Settings.get('aptIncreaseDelays');
		
		apt.content.find('#apt-increase-delays').change(function (arg){            // view_settings.jsxi:156
			aptIncreaseDelays = this.checked;                                      // view_settings.jsxi:156
		})[0].checked = aptIncreaseDelays;                                         // view_settings.jsxi:156
		d.addTab('About',                                                          // view_settings.jsxi:159
			[
				'<h6>Version</h6>',                                                // view_settings.jsxi:160
				gui.App.manifest.version,                                          // view_settings.jsxi:161
				'<h6>Author</h6>',                                                 // view_settings.jsxi:162
				'x4fab'
			]).addButton('Feedback',                                               // view_settings.jsxi:164
			function (){                                                           // view_settings.jsxi:164
				feedbackForm();                                                    // view_settings.jsxi:165
				return false;
			}).addButton('Check for update',                                       // view_settings.jsxi:167
			function (){                                                           // view_settings.jsxi:167
				var b = this.buttons.find('button:last-child').text('Please wait...').attr('disabled', true);
				
				CheckUpdate.check();                                               // view_settings.jsxi:169
				CheckUpdate.one('check',                                           // view_settings.jsxi:170
					function (arg){                                                // view_settings.jsxi:170
						b.text('Check again').attr('disabled', null);              // view_settings.jsxi:171
						
						if (arg === 'check:failed'){                               // view_settings.jsxi:172
							new Dialog('Check For Update', 'Cannot check for update.');
						} else if (arg !== 'check:done:found'){                    // view_settings.jsxi:174
							new Dialog('Check For Update', 'New version not found.');
						}
					});
				return false;
			});
	}
	
	function filtersList(){}
	
	function feedbackForm(){                                                       // view_settings.jsxi:187
		function sendFeedback(v){                                                  // view_settings.jsxi:188
			d.buttons.find('button:first-child').text('Please wait...').attr('disabled', true);
			AppServerRequest.sendFeedback(v,                                       // view_settings.jsxi:191
				function (arg){                                                    // view_settings.jsxi:191
					d.close();                                                     // view_settings.jsxi:192
					
					if (arg){                                                      // view_settings.jsxi:193
						new Dialog('Cannot Send Feedback', 'Sorry about that.');   // view_settings.jsxi:194
					} else {
						_prevFeedback = null;                                      // view_settings.jsxi:196
						new Dialog('Feedback Sent', 'Thank you.');                 // view_settings.jsxi:197
					}
				});
		}
		
		var d = new Dialog('Feedback',                                             // view_settings.jsxi:202
			'<textarea style="width:350px;height:200px;resize:none" maxlength="5000"\
                placeholder="If you have any ideas or suggestions please let me know"></textarea>', 
			function (){                                                           // view_settings.jsxi:203
				var v = this.content.find('textarea').val().trim();
				
				if (v)                                                             // view_settings.jsxi:205
					sendFeedback(v);                                               // view_settings.jsxi:205
				return false;
			}, 
			false).setButton('Send').addButton('Cancel').closeOnEnter(false);      // view_settings.jsxi:207
		
		d.content.find('textarea').val(_prevFeedback || '').change(function (arg){
			return _prevFeedback = this.value;                                     // view_settings.jsxi:208
		});
	}
	
	(function (){                                                                  // view_settings.jsxi:211
		$('#settings-open').click(openDialog);                                     // view_settings.jsxi:212
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
AcDir.init();                                                                      // app.jsxi:93

