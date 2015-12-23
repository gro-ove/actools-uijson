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

var Shell = gui.Shell, App = gui.App;

fs.mkdirpSync = function (dir){                                                    // uses.jsxi:13
	if (!fs.existsSync(dir)){                                                      // uses.jsxi:14
		fs.mkdirpSync(path.dirname(dir));                                          // uses.jsxi:15
		fs.mkdirSync(dir);                                                         // uses.jsxi:16
	}
};
fs.readdirRecursiveSync = function (dir, limit, sub, result){                      // uses.jsxi:20
	if (limit === undefined)                                                       // uses.jsxi:20
		limit = 1e3;                                                               // uses.jsxi:20

	if (sub === undefined)                                                         // uses.jsxi:20
		sub = '';                                                                  // uses.jsxi:20

	if (result === undefined)                                                      // uses.jsxi:20
		result = [];                                                               // uses.jsxi:20

	if (result.length > limit)                                                     // uses.jsxi:21
		return;
	
	try {
		{
			var __1 = fs.readdirSync(sub ? path.join(dir, sub) : dir);
			
			for (var __0 = 0; __0 < __1.length; __0 ++){
				var c = __1[__0];
				
				var subs = sub ? path.join(sub, c) : c;
				
				result.push(subs);                                                 // uses.jsxi:25
				
				if (fs.statSync(path.join(dir, subs)).isDirectory()){              // uses.jsxi:26
					fs.readdirRecursiveSync(dir, limit, subs, result);             // uses.jsxi:27
				}
			}
			
			__1 = undefined;
		}
	} catch (e){} 
	return result;                                                                 // uses.jsxi:31
};
fs.removeDirSync = function (dirPath, removeSelf){                                 // uses.jsxi:34
	if (removeSelf === undefined)                                                  // uses.jsxi:34
		removeSelf = true;                                                         // uses.jsxi:34

	try {
		var files = fs.readdirSync(dirPath);
	} catch (e){
		return;
	} 
	
	for (var i = 0; i < files.length; i ++){                                       // uses.jsxi:38
		var filePath = path.join(dirPath, files[i]);
		
		if (fs.statSync(filePath).isFile()){                                       // uses.jsxi:40
			fs.unlinkSync(filePath);                                               // uses.jsxi:41
		} else {
			fs.removeDirSync(filePath, true);                                      // uses.jsxi:43
		}
	}
	
	if (removeSelf){                                                               // uses.jsxi:46
		fs.rmdirSync(dirPath);                                                     // uses.jsxi:47
	}
};
fs.copyFileSync = function (source, target){                                       // uses.jsxi:51
	var targetFile = target;
	
	if (fs.existsSync(target)){                                                    // uses.jsxi:54
		if (fs.lstatSync(target).isDirectory()){                                   // uses.jsxi:55
			targetFile = path.join(target, path.basename(source));                 // uses.jsxi:56
		}
	}
	
	fs.createReadStream(source).pipe(fs.createWriteStream(targetFile));            // uses.jsxi:60
};
fs.copyDirRecursiveSync = function (source, target){                               // uses.jsxi:63
	var files = [];
	
	if (!fs.existsSync(target)){                                                   // uses.jsxi:66
		fs.mkdirSync(target);                                                      // uses.jsxi:67
	}
	
	if (fs.lstatSync(source).isDirectory()){                                       // uses.jsxi:70
		{
			var __3 = fs.readdirSync(source);
			
			for (var __2 = 0; __2 < __3.length; __2 ++){
				var file = __3[__2];
				
				var curSource = path.join(source, file);
				
				if (fs.lstatSync(curSource).isDirectory()){                        // uses.jsxi:73
					fs.copyDirRecursiveSync(curSource, path.join(target, file));   // uses.jsxi:74
				} else {
					fs.copyFileSync(curSource, path.join(target, file));           // uses.jsxi:76
				}
			}
			
			__3 = undefined;
		}
	}
};

/* Class "Dialog" declaration */
function Dialog(title, elements, callback, closeCallback){                         // dialog.jsxi:1
	var __that = this;
	
	this.__Dialog__closeOnEnter = true;
	this.el = $('<dialog>').html('<article><div class="dialog-header"><h4>' + title + '</h4></div><div class="dialog-content"></div><div class="dialog-buttons"><button data-id="dialog-ok">ОК</button></div></article>').click(function (e){
		if (e.target.tagName == 'DIALOG' && (__that.__Dialog__closeCallback == null || __that.__Dialog__closeCallback !== false && __that.__Dialog__closeCallback(e) !== false)){
			__that.close();
		}
	}).appendTo('body');                                                           // dialog.jsxi:16
	this.header = this.el.find('.dialog-header > h4');                             // dialog.jsxi:18
	this.content = this.el.find('.dialog-content');                                // dialog.jsxi:19
	this.buttons = this.el.find('.dialog-buttons');                                // dialog.jsxi:20
	this.setContent(elements);
	this.__Dialog__callback = callback && callback.bind(this);                     // dialog.jsxi:24
	this.__Dialog__closeCallback = closeCallback && closeCallback.bind(this);      // dialog.jsxi:25
	
	if (this.__Dialog__callback === false){
		this.el.find('[data-id="dialog-ok"]').hide();                              // dialog.jsxi:28
	}
	
	this.el.find('[data-id="dialog-ok"]').click(function (e){                      // dialog.jsxi:31
		if (!__that.__Dialog__callback || __that.__Dialog__callback(e) !== false){
			__that.close();
		}
	});
	this.el.find('*').keydown(function (e){                                        // dialog.jsxi:37
		if (e.keyCode == 13 && __that.__Dialog__closeOnEnter){                     // dialog.jsxi:38
			var okButton = __that.el[0].querySelector('[data-id="dialog-ok"]');    // dialog.jsxi:39
			
			if (okButton){                                                         // dialog.jsxi:40
				__that.el[0].querySelector('[data-id="dialog-ok"]').click();       // dialog.jsxi:41
				return false;
			}
		}
	});
}
Dialog.prototype.setContent = function (elements){                                 // dialog.jsxi:48
	if (!Array.isArray(elements)){                                                 // dialog.jsxi:49
		elements = [ elements ];                                                   // dialog.jsxi:50
	}
	
	var html = '';
	
	for (var __4 = 0; __4 < elements.length; __4 ++){                              // dialog.jsxi:54
		var element = elements[__4];
		
		if (element == null || element === '')                                     // dialog.jsxi:55
			continue;
		
		html += typeof element === 'string' && element[0] !== '<' && element[element.length - 1] !== '>' ? '<p>' + element + '</p>' : element;
	}
	
	this.content.html(html);                                                       // dialog.jsxi:59
	return this;                                                                   // dialog.jsxi:66
};
Dialog.prototype.closeOnEnter = function (v){                                      // dialog.jsxi:69
	this.__Dialog__closeOnEnter = v;                                               // dialog.jsxi:70
	return this;                                                                   // dialog.jsxi:71
};
Dialog.prototype.onEnd = function (callback){                                      // dialog.jsxi:74
	this.__Dialog__endCallback = callback.bind(this);                              // dialog.jsxi:75
	return this;                                                                   // dialog.jsxi:76
};
Dialog.prototype.setButton = function (a, c){                                      // dialog.jsxi:79
	this.buttons.find('[data-id="dialog-ok"]').toggle(a != null).text(a);          // dialog.jsxi:80
	
	if (c != null){                                                                // dialog.jsxi:81
		this.__Dialog__callback = c;                                               // dialog.jsxi:81
	}
	return this;                                                                   // dialog.jsxi:82
};
Dialog.prototype.setWarningColor = function (){                                    // dialog.jsxi:85
	this.buttons.find('[data-id="dialog-ok"]').css('-webkit-filter', 'hue-rotate(150deg)');
	return this;                                                                   // dialog.jsxi:87
};
Dialog.prototype.addButton = function (text, fn){                                  // dialog.jsxi:90
	var __that = this;
	
	fn = fn && fn.bind(this);                                                      // dialog.jsxi:91
	$('<button>' + text + '</button>').appendTo(this.buttons).click(function (e){
		if (!fn || fn(e) !== false){                                               // dialog.jsxi:93
			__that.close();
		}
	});
	return this;                                                                   // dialog.jsxi:97
};
Dialog.prototype.find = function (a){                                              // dialog.jsxi:100
	return this.el.find(a);                                                        // dialog.jsxi:101
};
Dialog.prototype.close = function (){                                              // dialog.jsxi:104
	if (this.__Dialog__endCallback)
		this.__Dialog__endCallback();
	
	this.el.remove();                                                              // dialog.jsxi:106
};
Dialog.prototype.addTab = function (title, content, callback, closeCallback){      // dialog.jsxi:109
	var __that = this;
	
	if (!this.tabs){
		this.tabs = [ this ];
		this.header.parent().addClass('tabs').click(function (e){                  // dialog.jsxi:112
			if (e.target.tagName === 'H4' && !e.target.classList.contains('active')){
				__that.el.find('.dialog-header h4.active').removeClass('active');
				e.target.classList.add('active');                                  // dialog.jsxi:115
				
				var i = Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target);
				
				var l = __that.el.find('.dialog-content')[0];
				
				l.parentNode.removeChild(l);                                       // dialog.jsxi:119
				
				var l = __that.el.find('.dialog-buttons')[0];
				
				l.parentNode.removeChild(l);                                       // dialog.jsxi:121
				__that.tabs[i].content.appendTo(__that.el.children());             // dialog.jsxi:122
				__that.tabs[i].buttons.appendTo(__that.el.children());             // dialog.jsxi:123
			}
		});
	}
	
	var n = new Dialog(title, content, callback, closeCallback);
	
	this.tabs.push(n);                                                             // dialog.jsxi:129
	document.body.removeChild(n.el[0]);                                            // dialog.jsxi:131
	n.header.appendTo(this.header.addClass('active').parent());                    // dialog.jsxi:132
	n.close = __bindOnce(this, 'close').bind(this);                                // dialog.jsxi:133
	return n;                                                                      // dialog.jsxi:135
};

/* Class "Downloader" declaration */
var Downloader = (function (){                                                     // downloader.jsxi:1
	var Downloader = function (){}, 
		_updateInProcess;
	
	Downloader.isAvailableYadisk = function (link){                                // downloader.jsxi:2
		return /^https:\/\/yadi.sk\/d\/\w+/.test(link);                            // downloader.jsxi:3
	};
	Downloader.isAvailableRd = function (link){                                    // downloader.jsxi:6
		return /^http:\/\/www.racedepartment.com\/downloads\//.test(link);         // downloader.jsxi:7
	};
	Downloader.isAvailable = function (link){                                      // downloader.jsxi:10
		return Downloader.isAvailableYadisk(link) || Downloader.isAvailableRd(link);
	};
	Downloader.download = function (url, dest, callback, progressCallback){        // downloader.jsxi:14
		if (Downloader.isAvailableYadisk(url))
			yadiskDownload(url, dest, callback, progressCallback);                 // downloader.jsxi:15
		else if (Downloader.isAvailableRd(url))
			rdDownload(url, dest, callback, progressCallback);                     // downloader.jsxi:16
		else
			httpDownload(url, dest, callback, progressCallback);                   // downloader.jsxi:17
	};
	Downloader.abort = function (id){                                              // downloader.jsxi:20
		if (_updateInProcess.abort){                                               // downloader.jsxi:21
			_updateInProcess.abort();                                              // downloader.jsxi:22
		}
	};
	
	function httpDownload(url, file, callback, progressCallback){                  // downloader.jsxi:27
		try {
			fs.writeFileSync(file, '');                                            // downloader.jsxi:29
			fs.unlinkSync(file, '');                                               // downloader.jsxi:30
		} catch (err){                                                             // downloader.jsxi:31
			callback('ACCESS:' + file);                                            // downloader.jsxi:32
			return;
		} 
		
		try {
			if (typeof file === 'string'){                                         // downloader.jsxi:37
				file = fs.createWriteStream(file);                                 // downloader.jsxi:38
			}
			
			_updateInProcess = require(url.match(/^https?/)[0]).get(url,           // downloader.jsxi:41
				function (r){                                                      // downloader.jsxi:41
					if (r.statusCode == 302){                                      // downloader.jsxi:42
						httpDownload(r.headers['location'], file, callback, progressCallback);
					} else if (r.statusCode == 200){                               // downloader.jsxi:44
						var m = r.headers['content-length'], p = 0;
						
						r.pipe(file);                                              // downloader.jsxi:46
						r.on('data',                                               // downloader.jsxi:47
							function (d){                                          // downloader.jsxi:47
								if (progressCallback)                              // downloader.jsxi:48
									progressCallback(p += d.length, m);            // downloader.jsxi:48
							}).on('end',                                           // downloader.jsxi:49
							function (){                                           // downloader.jsxi:49
								if (_updateInProcess){                             // downloader.jsxi:50
									_updateInProcess = null;                       // downloader.jsxi:51
									setTimeout(callback, 50);                      // downloader.jsxi:52
								}
							});
					} else {
						callback(r.statusCode);                                    // downloader.jsxi:56
					}
				}).on('error',                                                     // downloader.jsxi:58
				function (e){                                                      // downloader.jsxi:58
					callback(e);                                                   // downloader.jsxi:59
				});
		} catch (e){                                                               // downloader.jsxi:61
			callback('DOWNLOAD:' + url);                                           // downloader.jsxi:62
		} 
	}
	
	function yadiskDownload(url, dest, callback, progressCallback){                // downloader.jsxi:66
		_updateInProcess = true;                                                   // downloader.jsxi:67
		
		var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load',    // downloader.jsxi:68
			function (e){                                                          // downloader.jsxi:68
				if (!_updateInProcess)                                             // downloader.jsxi:69
					return;
				
				this.contentWindow._cb = function (e){                             // downloader.jsxi:71
					if (!_updateInProcess)                                         // downloader.jsxi:72
						return;
					
					try {
						clearTimeout(to);                                          // downloader.jsxi:74
						httpDownload(e.models[0].data.file, dest, callback, progressCallback);
					} catch (e){
						callback('YADISK');                                        // downloader.jsxi:76
					} 
					
					ifr.remove();                                                  // downloader.jsxi:77
				};
				this.contentWindow.eval("\t\t\t\t\t \n_XMLHttpRequest = XMLHttpRequest;\nXMLHttpRequest = function (){\n\tvar r = new _XMLHttpRequest();\n\tr.onreadystatechange = function (e){\n\t\tif (r.status == 200 && r.readyState == 4)\n\t\t\t_cb(JSON.parse(r.responseText));\n\t};\n\treturn {\n\t\topen: function (){ r.open.apply(r, arguments); },\n\t\tsetRequestHeader: function (){ r.setRequestHeader.apply(r, arguments); },\n\t\tgetAllResponseHeaders: function (){ r.getAllResponseHeaders.apply(r, arguments); },\n\t\tgetResponseHeader: function (){ r.getResponseHeader.apply(r, arguments); },\n\t\tabort: function (){ r.abort.apply(r, arguments); },\n\t\tsend: function (){ r.send.apply(r, arguments); },\n\t};\n};");
				
				try {
					this.contentWindow.document.querySelector('button[data-click-action="resource.download"]').click();
				} catch (e){
					ifr.remove();                                                  // downloader.jsxi:99
					callback('YADISK:BTN');                                        // downloader.jsxi:100
				} 
			}).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');
		
		var to = setTimeout(function (){                                           // downloader.jsxi:104
			if (!_updateInProcess)                                                 // downloader.jsxi:105
				return;
			
			ifr.remove();                                                          // downloader.jsxi:106
			callback('YADISK:TO');                                                 // downloader.jsxi:107
		}, 
		10e3);
	}
	
	function rdDownload(url, dest, callback, progressCallback){                    // downloader.jsxi:111
		_updateInProcess = true;                                                   // downloader.jsxi:112
		
		var ifr = $('<iframe nwdisable nwfaketop>').attr('src', url).on('load',    // downloader.jsxi:113
			function (e){                                                          // downloader.jsxi:113
				if (!_updateInProcess)                                             // downloader.jsxi:114
					return;
				
				try {
					clearTimeout(to);                                              // downloader.jsxi:117
					httpDownload(this.contentWindow.document.querySelector('.downloadButton a').href, 
						dest,                                                      // downloader.jsxi:118
						callback,                                                  // downloader.jsxi:118
						progressCallback);                                         // downloader.jsxi:118
				} catch (e){                                                       // downloader.jsxi:119
					ifr.remove();                                                  // downloader.jsxi:120
					callback('RD:BTN');                                            // downloader.jsxi:121
				} 
			}).css({ position: 'fixed', top: '200vh', left: '200vw' }).appendTo('body');
		
		var to = setTimeout(function (){                                           // downloader.jsxi:125
			if (!_updateInProcess)                                                 // downloader.jsxi:126
				return;
			
			ifr.remove();                                                          // downloader.jsxi:127
			callback('RD:TO');                                                     // downloader.jsxi:128
		}, 
		10e3);
	}
	return Downloader;
})();

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

/* Class "Notification" declaration */
var Notification = (function (){                                                   // notification.jsxi:1
	var Notification = function (message, details, type){                          // notification.jsxi:1
			if (type === undefined)                                                // notification.jsxi:7
				type = 'info';                                                     // notification.jsxi:7
		
			var __that = this;
			
			if (_current)                                                          // notification.jsxi:8
				_current.close();                                                  // notification.jsxi:8
			
			this.el = $('<notification class="' + type + '">').html('<h4>' + message + '</h4><p>' + details + '</p>').click(function (e){
				__that.close();
			}).appendTo('body');                                                   // notification.jsxi:12
			_current = this;                                                       // notification.jsxi:14
			window.setTimeout(function (arg){                                      // notification.jsxi:16
				return __that.el.addClass('active');                               // notification.jsxi:16
			});
			this.setTimeout(3e3);
		}, 
		_current;                                                                  // notification.jsxi:2
	
	Notification.prototype.close = function (){                                    // notification.jsxi:20
		var __that = this;
		
		clearTimeout(this.__Notification__timeout);                                // notification.jsxi:21
		_current = null;                                                           // notification.jsxi:22
		this.el.removeClass('active');                                             // notification.jsxi:24
		window.setTimeout(function (arg){                                          // notification.jsxi:25
			return __that.el.remove();                                             // notification.jsxi:25
		}, 
		500);
		return this;                                                               // notification.jsxi:26
	};
	Notification.prototype.setTimeout = function (timeout){                        // notification.jsxi:29
		clearTimeout(this.__Notification__timeout);                                // notification.jsxi:30
		this.__Notification__timeout = window.setTimeout(__bindOnce(this, 'close'), timeout);
		return this;                                                               // notification.jsxi:32
	};
	Notification.prototype.setButton = function (text, callback){                  // notification.jsxi:35
		var __that = this;
		
		$('<button>' + text + '</button>').click((function (e){                    // notification.jsxi:36
			if (!callback || callback(e) !== false){                               // notification.jsxi:37
				__that.close();
			}
		}).bind(this)).prependTo(this.el);                                         // notification.jsxi:40
		return this;                                                               // notification.jsxi:41
	};
	Notification.info = function (m, d){                                           // notification.jsxi:44
		return new Notification(m, d, 'info');                                     // notification.jsxi:44
	};
	Notification.warn = function (m, d){                                           // notification.jsxi:45
		return new Notification(m, d, 'warn');                                     // notification.jsxi:45
	};
	return Notification;
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
RegExp.fromQuery = function (q, w){                                                // helpers.jsxi:33
	var r = q.replace(/\\/g, '\\\\').replace(/(?=[\$^.+(){}[\]])/g, '\\').replace(/\?|(\*)/g, '.$1');
	return new RegExp(w ? '^(?:' + r + ')$' : r, 'i');                             // helpers.jsxi:35
};
String.prototype.cssUrl = function (){                                             // helpers.jsxi:38
	return (this[1] === ':' ? 'file://' : '') + this.replace(/\\/g, '/');          // helpers.jsxi:39
};
String.prototype.decodeHtmlEntities = function (){                                 // helpers.jsxi:42
	return this.replace(/&(?:#(\d+)|(\w{2,7}));/g,                                 // helpers.jsxi:43
		function (_, n, v){                                                        // helpers.jsxi:43
			if (n)                                                                 // helpers.jsxi:44
				return String.fromCharCode(+ n);                                   // helpers.jsxi:44
			
			switch (v){                                                            // helpers.jsxi:45
				case 'amp':                                                        // helpers.jsxi:46
					return '&';                                                    // helpers.jsxi:46
				case 'nbsp':                                                       // helpers.jsxi:47
					return ' ';                                                    // helpers.jsxi:47
				case 'iexcl':                                                      // helpers.jsxi:48
					return '¡';                                                    // helpers.jsxi:48
				case 'cent':                                                       // helpers.jsxi:49
					return '¢';                                                    // helpers.jsxi:49
				case 'pound':                                                      // helpers.jsxi:50
					return '£';                                                    // helpers.jsxi:50
				case 'curren':                                                     // helpers.jsxi:51
					return '¤';                                                    // helpers.jsxi:51
				case 'yen':                                                        // helpers.jsxi:52
					return '¥';                                                    // helpers.jsxi:52
				case 'brvbar':                                                     // helpers.jsxi:53
					return '¦';                                                    // helpers.jsxi:53
				case 'sect':                                                       // helpers.jsxi:54
					return '§';                                                    // helpers.jsxi:54
				case 'uml':                                                        // helpers.jsxi:55
					return '¨';                                                    // helpers.jsxi:55
				case 'copy':                                                       // helpers.jsxi:56
					return '©';                                                    // helpers.jsxi:56
				case 'ordf':                                                       // helpers.jsxi:57
					return 'ª';                                                    // helpers.jsxi:57
				case 'laquo':                                                      // helpers.jsxi:58
					return '«';                                                    // helpers.jsxi:58
				case 'not':                                                        // helpers.jsxi:59
					return '¬';                                                    // helpers.jsxi:59
				case 'shy':                                                        // helpers.jsxi:60
					return '­';                                                    // helpers.jsxi:60
				case 'reg':                                                        // helpers.jsxi:61
					return '®';                                                    // helpers.jsxi:61
				case 'macr':                                                       // helpers.jsxi:62
					return '¯';                                                    // helpers.jsxi:62
				case 'deg':                                                        // helpers.jsxi:63
					return '°';                                                    // helpers.jsxi:63
				case 'plusmn':                                                     // helpers.jsxi:64
					return '±';                                                    // helpers.jsxi:64
				case 'sup2':                                                       // helpers.jsxi:65
					return '²';                                                    // helpers.jsxi:65
				case 'sup3':                                                       // helpers.jsxi:66
					return '³';                                                    // helpers.jsxi:66
				case 'acute':                                                      // helpers.jsxi:67
					return '´';                                                    // helpers.jsxi:67
				case 'micro':                                                      // helpers.jsxi:68
					return 'µ';                                                    // helpers.jsxi:68
				case 'para':                                                       // helpers.jsxi:69
					return '¶';                                                    // helpers.jsxi:69
				case 'middot':                                                     // helpers.jsxi:70
					return '·';                                                    // helpers.jsxi:70
				case 'cedil':                                                      // helpers.jsxi:71
					return '¸';                                                    // helpers.jsxi:71
				case 'sup1':                                                       // helpers.jsxi:72
					return '¹';                                                    // helpers.jsxi:72
				case 'ordm':                                                       // helpers.jsxi:73
					return 'º';                                                    // helpers.jsxi:73
				case 'raquo':                                                      // helpers.jsxi:74
					return '»';                                                    // helpers.jsxi:74
				case 'frac14':                                                     // helpers.jsxi:75
					return '¼';                                                    // helpers.jsxi:75
				case 'frac12':                                                     // helpers.jsxi:76
					return '½';                                                    // helpers.jsxi:76
				case 'frac34':                                                     // helpers.jsxi:77
					return '¾';                                                    // helpers.jsxi:77
				case 'iquest':                                                     // helpers.jsxi:78
					return '¿';                                                    // helpers.jsxi:78
				case 'Agrave':                                                     // helpers.jsxi:79
					return 'À';                                                    // helpers.jsxi:79
				case 'Aacute':                                                     // helpers.jsxi:80
					return 'Á';                                                    // helpers.jsxi:80
				case 'Acirc':                                                      // helpers.jsxi:81
					return 'Â';                                                    // helpers.jsxi:81
				case 'Atilde':                                                     // helpers.jsxi:82
					return 'Ã';                                                    // helpers.jsxi:82
				case 'Auml':                                                       // helpers.jsxi:83
					return 'Ä';                                                    // helpers.jsxi:83
				case 'Aring':                                                      // helpers.jsxi:84
					return 'Å';                                                    // helpers.jsxi:84
				case 'AElig':                                                      // helpers.jsxi:85
					return 'Æ';                                                    // helpers.jsxi:85
				case 'Ccedil':                                                     // helpers.jsxi:86
					return 'Ç';                                                    // helpers.jsxi:86
				case 'Egrave':                                                     // helpers.jsxi:87
					return 'È';                                                    // helpers.jsxi:87
				case 'Eacute':                                                     // helpers.jsxi:88
					return 'É';                                                    // helpers.jsxi:88
				case 'Ecirc':                                                      // helpers.jsxi:89
					return 'Ê';                                                    // helpers.jsxi:89
				case 'Euml':                                                       // helpers.jsxi:90
					return 'Ë';                                                    // helpers.jsxi:90
				case 'Igrave':                                                     // helpers.jsxi:91
					return 'Ì';                                                    // helpers.jsxi:91
				case 'Iacute':                                                     // helpers.jsxi:92
					return 'Í';                                                    // helpers.jsxi:92
				case 'Icirc':                                                      // helpers.jsxi:93
					return 'Î';                                                    // helpers.jsxi:93
				case 'Iuml':                                                       // helpers.jsxi:94
					return 'Ï';                                                    // helpers.jsxi:94
				case 'ETH':                                                        // helpers.jsxi:95
					return 'Ð';                                                    // helpers.jsxi:95
				case 'Ntilde':                                                     // helpers.jsxi:96
					return 'Ñ';                                                    // helpers.jsxi:96
				case 'Ograve':                                                     // helpers.jsxi:97
					return 'Ò';                                                    // helpers.jsxi:97
				case 'Oacute':                                                     // helpers.jsxi:98
					return 'Ó';                                                    // helpers.jsxi:98
				case 'Ocirc':                                                      // helpers.jsxi:99
					return 'Ô';                                                    // helpers.jsxi:99
				case 'Otilde':                                                     // helpers.jsxi:100
					return 'Õ';                                                    // helpers.jsxi:100
				case 'Ouml':                                                       // helpers.jsxi:101
					return 'Ö';                                                    // helpers.jsxi:101
				case 'times':                                                      // helpers.jsxi:102
					return '×';                                                    // helpers.jsxi:102
				case 'Oslash':                                                     // helpers.jsxi:103
					return 'Ø';                                                    // helpers.jsxi:103
				case 'Ugrave':                                                     // helpers.jsxi:104
					return 'Ù';                                                    // helpers.jsxi:104
				case 'Uacute':                                                     // helpers.jsxi:105
					return 'Ú';                                                    // helpers.jsxi:105
				case 'Ucirc':                                                      // helpers.jsxi:106
					return 'Û';                                                    // helpers.jsxi:106
				case 'Uuml':                                                       // helpers.jsxi:107
					return 'Ü';                                                    // helpers.jsxi:107
				case 'Yacute':                                                     // helpers.jsxi:108
					return 'Ý';                                                    // helpers.jsxi:108
				case 'THORN':                                                      // helpers.jsxi:109
					return 'Þ';                                                    // helpers.jsxi:109
				case 'szlig':                                                      // helpers.jsxi:110
					return 'ß';                                                    // helpers.jsxi:110
				case 'agrave':                                                     // helpers.jsxi:111
					return 'à';                                                    // helpers.jsxi:111
				case 'aacute':                                                     // helpers.jsxi:112
					return 'á';                                                    // helpers.jsxi:112
				case 'acirc':                                                      // helpers.jsxi:113
					return 'â';                                                    // helpers.jsxi:113
				case 'atilde':                                                     // helpers.jsxi:114
					return 'ã';                                                    // helpers.jsxi:114
				case 'auml':                                                       // helpers.jsxi:115
					return 'ä';                                                    // helpers.jsxi:115
				case 'aring':                                                      // helpers.jsxi:116
					return 'å';                                                    // helpers.jsxi:116
				case 'aelig':                                                      // helpers.jsxi:117
					return 'æ';                                                    // helpers.jsxi:117
				case 'ccedil':                                                     // helpers.jsxi:118
					return 'ç';                                                    // helpers.jsxi:118
				case 'egrave':                                                     // helpers.jsxi:119
					return 'è';                                                    // helpers.jsxi:119
				case 'eacute':                                                     // helpers.jsxi:120
					return 'é';                                                    // helpers.jsxi:120
				case 'ecirc':                                                      // helpers.jsxi:121
					return 'ê';                                                    // helpers.jsxi:121
				case 'euml':                                                       // helpers.jsxi:122
					return 'ë';                                                    // helpers.jsxi:122
				case 'igrave':                                                     // helpers.jsxi:123
					return 'ì';                                                    // helpers.jsxi:123
				case 'iacute':                                                     // helpers.jsxi:124
					return 'í';                                                    // helpers.jsxi:124
				case 'icirc':                                                      // helpers.jsxi:125
					return 'î';                                                    // helpers.jsxi:125
				case 'iuml':                                                       // helpers.jsxi:126
					return 'ï';                                                    // helpers.jsxi:126
				case 'eth':                                                        // helpers.jsxi:127
					return 'ð';                                                    // helpers.jsxi:127
				case 'ntilde':                                                     // helpers.jsxi:128
					return 'ñ';                                                    // helpers.jsxi:128
				case 'ograve':                                                     // helpers.jsxi:129
					return 'ò';                                                    // helpers.jsxi:129
				case 'oacute':                                                     // helpers.jsxi:130
					return 'ó';                                                    // helpers.jsxi:130
				case 'ocirc':                                                      // helpers.jsxi:131
					return 'ô';                                                    // helpers.jsxi:131
				case 'otilde':                                                     // helpers.jsxi:132
					return 'õ';                                                    // helpers.jsxi:132
				case 'ouml':                                                       // helpers.jsxi:133
					return 'ö';                                                    // helpers.jsxi:133
				case 'divide':                                                     // helpers.jsxi:134
					return '÷';                                                    // helpers.jsxi:134
				case 'oslash':                                                     // helpers.jsxi:135
					return 'ø';                                                    // helpers.jsxi:135
				case 'ugrave':                                                     // helpers.jsxi:136
					return 'ù';                                                    // helpers.jsxi:136
				case 'uacute':                                                     // helpers.jsxi:137
					return 'ú';                                                    // helpers.jsxi:137
				case 'ucirc':                                                      // helpers.jsxi:138
					return 'û';                                                    // helpers.jsxi:138
				case 'uuml':                                                       // helpers.jsxi:139
					return 'ü';                                                    // helpers.jsxi:139
				case 'yacute':                                                     // helpers.jsxi:140
					return 'ý';                                                    // helpers.jsxi:140
				case 'thorn':                                                      // helpers.jsxi:141
					return 'þ';                                                    // helpers.jsxi:141
				case 'yuml':                                                       // helpers.jsxi:142
					return 'ÿ';                                                    // helpers.jsxi:142
				case 'quot':                                                       // helpers.jsxi:143
					return '"';                                                    // helpers.jsxi:143
				case 'lt':                                                         // helpers.jsxi:144
					return '<';                                                    // helpers.jsxi:144
				case 'gt':                                                         // helpers.jsxi:145
					return '>';                                                    // helpers.jsxi:145
				default:
					return _;                                                      // helpers.jsxi:146
			}
		});
};
JSON.flexibleParse = function (d){                                                 // helpers.jsxi:151
	d = d.toString();                                                              // helpers.jsxi:152
	
	try {
		return JSON.parse(d);                                                      // helpers.jsxi:155
	} catch (e){
		var r;
		
		eval('r=' + d.toString().replace(/"(?:[^"\\]*(?:\\.)?)+"/g,                // helpers.jsxi:158
			function (_){                                                          // helpers.jsxi:158
				return _.replace(/\r?\n/g, '\\n');                                 // helpers.jsxi:159
			}));
		return r;                                                                  // helpers.jsxi:161
	} 
};
JSON.restoreDamaged = function (data, fields){                                     // helpers.jsxi:165
	data = data.toString().replace(/\r?\n|\r/g, '\n').trim();                      // helpers.jsxi:166
	
	var result = {};
	
	for (var key in fields)                                                        // helpers.jsxi:169
		if (fields.hasOwnProperty(key)){                                           // helpers.jsxi:169
			var type = fields[key];
			
			var re = new RegExp('(?:\"\\s*' + key + '\\s*\"|\'\\s*' + key + '\\s*\'|' + key + ')\\s*:\\s*([\\s\\S]+)');
			
			var m = data.match(re);
			
			if (re.test(data)){                                                    // helpers.jsxi:172
				var d = RegExp.$1.trim();
				
				if (type !== 'multiline' && type !== 'array' && type !== 'pairsArray'){
					d = d.split('\n')[0].replace(/\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:[\s\S]+|\s*}/, '');
				}
				
				d = d.replace(/(?:\n?\s*,?\s*("\s*\w+\s*"|'\s*\w+\s*'|\w+)\s*:|\s*})[\s\S]*$/, 
					'');                                                           // helpers.jsxi:179
				result[key] = d.trim().replace(/,$/, '');                          // helpers.jsxi:180
			}
		}
	
	for (var key in result)                                                        // helpers.jsxi:184
		if (result.hasOwnProperty(key)){                                           // helpers.jsxi:184
			var value = result[key];
			
			if (fields[key] === 'string' || fields[key] === 'multiline'){          // helpers.jsxi:185
				result[key] = value === 'null' ? null : value.replace(/^['"]/, '').replace(/['"]$/, '').replace(/\\(?=")/g, '');
			}
			
			if (fields[key] === 'array' || fields[key] === 'pairsArray'){          // helpers.jsxi:189
				value = value.split(/\n|,/).map(function (arg){                    // helpers.jsxi:190
					return arg.trim().replace(/^['"]/, '').replace(/['"]$/, '');   // helpers.jsxi:191
				}).filter(function (a, i){                                         // helpers.jsxi:192
					return a && (i > 0 || a != '[');                               // helpers.jsxi:192
				});
				
				if (value[value.length - 1] === ']'){                              // helpers.jsxi:193
					value.length --;                                               // helpers.jsxi:194
				}
				
				result[key] = value;                                               // helpers.jsxi:197
			}
			
			if (fields[key] === 'pairsArray'){                                     // helpers.jsxi:200
				result[key] = [];                                                  // helpers.jsxi:201
				
				var last;
				
				value.forEach(function (arg){                                      // helpers.jsxi:203
					if (arg === '[' || arg === ']')                                // helpers.jsxi:204
						return;
					
					if (last){                                                     // helpers.jsxi:205
						last.push(arg);                                            // helpers.jsxi:206
						last = null;                                               // helpers.jsxi:207
					} else {
						result[key].push(last = [ arg ]);                          // helpers.jsxi:209
					}
				});
			}
			
			if (fields[key] === 'number'){                                         // helpers.jsxi:214
				if (value === 'null'){                                             // helpers.jsxi:215
					value = null;                                                  // helpers.jsxi:216
				} else {
					value = value.replace(/^['"]/, '').replace(/['"]$/, '');       // helpers.jsxi:218
					value = value.replace(/[liI]/g, '1').replace(/[oO]/g, '0');    // helpers.jsxi:220
					result[key] = + value;                                         // helpers.jsxi:221
					
					if (Number.isNaN(result[key])){                                // helpers.jsxi:223
						result[key] = + value.replace(/[^-.\d]+/g, '');            // helpers.jsxi:224
					}
					
					if (Number.isNaN(result[key])){                                // helpers.jsxi:227
						result[key] = + (value.replace(/[^\d]+/g, '') || '0');     // helpers.jsxi:228
					}
				}
			}
		}
	return result;                                                                 // helpers.jsxi:234
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
	return UiJsonDamaged.parseSkinData(fs.readFileSync(filename));
};
UiJsonDamaged.parseSkinData = function (data){                                     // ui_json_damaged.jsxi:6
	var result = JSON.restoreDamaged(data,                                         // ui_json_damaged.jsxi:7
		{
			skinname: 'string',                                                    // ui_json_damaged.jsxi:8
			drivername: 'string',                                                  // ui_json_damaged.jsxi:9
			country: 'string',                                                     // ui_json_damaged.jsxi:10
			team: 'string',                                                        // ui_json_damaged.jsxi:11
			number: 'number',                                                      // ui_json_damaged.jsxi:12
			author: 'string',                                                      // ui_json_damaged.jsxi:14
			version: 'string',                                                     // ui_json_damaged.jsxi:15
			url: 'string'
		});
	return result;                                                                 // ui_json_damaged.jsxi:19
};
UiJsonDamaged.parseCarFile = function (filename){                                  // ui_json_damaged.jsxi:22
	return UiJsonDamaged.parseCarData(fs.readFileSync(filename));
};
UiJsonDamaged.parseCarData = function (data){                                      // ui_json_damaged.jsxi:26
	var result = JSON.restoreDamaged(data,                                         // ui_json_damaged.jsxi:27
		{
			name: 'string',                                                        // ui_json_damaged.jsxi:28
			brand: 'string',                                                       // ui_json_damaged.jsxi:29
			parent: 'string',                                                      // ui_json_damaged.jsxi:30
			description: 'multiline',                                              // ui_json_damaged.jsxi:31
			class: 'string',                                                       // ui_json_damaged.jsxi:32
			tags: 'array',                                                         // ui_json_damaged.jsxi:33
			bhp: 'string',                                                         // ui_json_damaged.jsxi:34
			torque: 'string',                                                      // ui_json_damaged.jsxi:35
			weight: 'string',                                                      // ui_json_damaged.jsxi:36
			topspeed: 'string',                                                    // ui_json_damaged.jsxi:37
			acceleration: 'string',                                                // ui_json_damaged.jsxi:38
			pwratio: 'string',                                                     // ui_json_damaged.jsxi:39
			range: 'number',                                                       // ui_json_damaged.jsxi:40
			torqueCurve: 'pairsArray',                                             // ui_json_damaged.jsxi:41
			powerCurve: 'pairsArray',                                              // ui_json_damaged.jsxi:42
			year: 'number',                                                        // ui_json_damaged.jsxi:44
			country: 'string',                                                     // ui_json_damaged.jsxi:45
			author: 'string',                                                      // ui_json_damaged.jsxi:47
			version: 'string',                                                     // ui_json_damaged.jsxi:48
			url: 'string'
		});
	
	result.specs = {};                                                             // ui_json_damaged.jsxi:52
	[
		'bhp',                                                                     // ui_json_damaged.jsxi:54
		'torque',                                                                  // ui_json_damaged.jsxi:54
		'weight',                                                                  // ui_json_damaged.jsxi:54
		'topspeed',                                                                // ui_json_damaged.jsxi:54
		'acceleration',                                                            // ui_json_damaged.jsxi:54
		'pwratio'
	].forEach(function (arg){                                                      // ui_json_damaged.jsxi:54
		if (result.hasOwnProperty(arg)){                                           // ui_json_damaged.jsxi:55
			result.specs[arg] = result[arg];                                       // ui_json_damaged.jsxi:56
			delete result[arg];                                                    // ui_json_damaged.jsxi:57
		}
	});
	return result;                                                                 // ui_json_damaged.jsxi:61
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
	Object.defineProperty(AcDir,                                                   // ac_dir.jsxi:1
		'temp', 
		{
			get: (function (){
				return _root + '/content/__at_tmp_' + Date.now();                  // ac_dir.jsxi:109
			})
		});
	(function (){                                                                  // ac_dir.jsxi:111
		mediator.extend(AcDir);                                                    // ac_dir.jsxi:112
	})();
	return AcDir;
})();

/* Class "AcFilters" declaration */
var AcFilters = (function (){                                                      // ac_filters.jsxi:1
	var AcFilters = function (){}, 
		_filters = null;
	
	AcFilters.getPath = function (id){                                             // ac_filters.jsxi:12
		return AcDir.filters + '/' + id + '.ini';                                  // ac_filters.jsxi:13
	};
	AcFilters.exists = function (id){                                              // ac_filters.jsxi:16
		return fs.existsSync(AcFilters.getPath(id));                               // ac_filters.jsxi:17
	};
	AcFilters.installFilter = function (source, id){                               // ac_filters.jsxi:20
		if (AcFilters.exists(id))
			fs.unlinkSync(AcFilters.getPath(id));                                  // ac_filters.jsxi:21
		
		fs.copyFileSync(source, AcFilters.getPath(id));                            // ac_filters.jsxi:22
	};
	AcFilters.load = function (){                                                  // ac_filters.jsxi:25
		var path = AcDir.filters;
		
		try {
			_filters = fs.readdirSync(path).map(function (e){                      // ac_filters.jsxi:29
				if (!/\.ini$/i.test(e))                                            // ac_filters.jsxi:30
					return;
				return { id: e.replace(/\.ini$/i, ''), path: path + '/' + e };
			}).filter(function (e){                                                // ac_filters.jsxi:35
				return e;                                                          // ac_filters.jsxi:36
			});
		} catch (e){                                                               // ac_filters.jsxi:38
			_filters = [];                                                         // ac_filters.jsxi:40
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
		_modes = [ 'Practice', 'Hotlap', 'Race', 'Drift' ],                        // ac_practice.jsxi:17
		_storage,                                                                  // ac_practice.jsxi:21
		_tracks;                                                                   // ac_practice.jsxi:22
	
	function initTracks(){                                                         // ac_practice.jsxi:29
		_tracks = [];                                                              // ac_practice.jsxi:30
		
		{
			var __7 = fs.readdirSync(AcDir.tracks);
			
			for (var __6 = 0; __6 < __7.length; __6 ++){
				var e = __7[__6];
				
				var p = path.join(AcDir.tracks, e);
				
				var d = null;
				
				var j = path.join(p, 'ui', 'ui_track.json');
				
				if (fs.existsSync(j)){                                             // ac_practice.jsxi:37
					_tracks.push(new Track(e, p, j));                              // ac_practice.jsxi:38
				} else {
					var s = null;
					
					try {
						s = fs.readdirSync(path.join(p, 'ui'));                    // ac_practice.jsxi:41
					} catch (e){} 
					
					if (!s)                                                        // ac_practice.jsxi:42
						continue;
					
					for (var __5 = 0; __5 < s.length; __5 ++){                     // ac_practice.jsxi:44
						var u = s[__5];
						
						var q = path.join(p, 'ui', u);
						
						if (fs.statSync(q).isDirectory()){                         // ac_practice.jsxi:46
							_tracks.push(new Track(e + '/' + u, path.join(p, u), path.join(q, 'ui_track.json')));
						}
					}
				}
			}
			
			__7 = undefined;
		}
	}
	
	function init(){                                                               // ac_practice.jsxi:54
		initTracks();                                                              // ac_practice.jsxi:55
		_storage = new ObjLocalStorage('practice',                                 // ac_practice.jsxi:56
			{
				track: {                                                           // ac_practice.jsxi:57
					'Practice': 'spa',                                             // ac_practice.jsxi:57
					'Hotlap': 'silverstone-national',                              // ac_practice.jsxi:57
					'Race': 'valencia',                                            // ac_practice.jsxi:57
					'Drift': 'drift'
				}, 
				mode: _modes[0]
			});
		
		if (localStorage.lastTrack){                                               // ac_practice.jsxi:62
			_storage.update(function (arg){                                        // ac_practice.jsxi:63
				return arg.track['Practice'] = localStorage.lastTrack;             // ac_practice.jsxi:63
			});
			delete localStorage.lastTrack;                                         // ac_practice.jsxi:64
		}
	}
	
	AcPractice.start = function (c, s, m){                                         // ac_practice.jsxi:68
		if (c.disabled){                                                           // ac_practice.jsxi:69
			Notification.warn('No Way', 'Enable car first.');                      // ac_practice.jsxi:70
			return;
		}
		
		if (!_tracks)                                                              // ac_practice.jsxi:74
			init();                                                                // ac_practice.jsxi:74
		
		if (c.skins.length === 0){                                                 // ac_practice.jsxi:76
			Notification.warn('No Way', 'At least one skin required.');            // ac_practice.jsxi:77
			return;
		}
		
		if (m == null){                                                            // ac_practice.jsxi:81
			m = _storage.get('mode');                                              // ac_practice.jsxi:82
		}
		
		if (s == null){                                                            // ac_practice.jsxi:85
			s = c.selectedSkin ? c.selectedSkin.id : c.skins[0].id;                // ac_practice.jsxi:86
		}
		
		var r = _storage.get('track')[m];
		
		AcTools;                                                                   // ac_practice.jsxi:91
		
		try {
			AcTools.Processes.Game[m === 'Practice' ? 'StartPractice' : m === 'Hotlap' ? 'StartHotlap' : m === 'Race' ? 'StartSimpleRace' : 'StartDrift'](AcDir.root, c.id, s, r.split('/')[0], r.split('/')[1] || '');
		} catch (e){                                                               // ac_practice.jsxi:96
			ErrorHandler.handled('Cannot start the game. Maybe there is not enough rights.');
		} 
	};
	AcPractice.select = function (c, s){                                           // ac_practice.jsxi:101
		if (!_tracks)                                                              // ac_practice.jsxi:102
			init();                                                                // ac_practice.jsxi:102
		
		var d = new Dialog('Drive!',                                               // ac_practice.jsxi:104
			[
				'<h6>Mode</h6>',                                                   // ac_practice.jsxi:105
				'<select id="practice-mode">' + _modes.map(function (arg){         // ac_practice.jsxi:106
					return '<option value="' + arg + '">' + arg + '</option>';     // ac_practice.jsxi:106
				}).join('') + '</select>',                                         // ac_practice.jsxi:106
				'<h6>Track</h6>',                                                  // ac_practice.jsxi:107
				'<select id="practice-track">' + _tracks.map(function (arg){       // ac_practice.jsxi:108
					return '<option value="' + arg.id + '">' + arg.displayNameWithDescription + '</option>';
				}).join('') + '</select>'
			], 
			function (){                                                           // ac_practice.jsxi:109
				AcPractice.start(c, s);
			}).addButton('Reload List',                                            // ac_practice.jsxi:111
			function (){                                                           // ac_practice.jsxi:111
				setTimeout(function (){                                            // ac_practice.jsxi:112
					initTracks();                                                  // ac_practice.jsxi:113
					AcPractice.select(c, s);
				});
			});
		
		d.find('#practice-mode').val(_storage.get('mode')).change(function (){     // ac_practice.jsxi:118
			_storage.set('mode', this.value);                                      // ac_practice.jsxi:119
			d.find('#practice-track').val(_storage.get('track')[_storage.get('mode')]);
		});
		d.find('#practice-track').val(_storage.get('track')[_storage.get('mode')]).change(function (){
			var val = this.value;
			
			_storage.update(function (arg){                                        // ac_practice.jsxi:125
				return arg.track[_storage.get('mode')] = val;                      // ac_practice.jsxi:125
			});
		});
	};
	
	/* Class "Track" declaration */
	function Track(id, path, json){                                                // ac_practice.jsxi:2
		this.id = id;                                                              // ac_practice.jsxi:6
		this.path = path;                                                          // ac_practice.jsxi:7
		this.json = json;                                                          // ac_practice.jsxi:8
		
		try {
			this.data = JSON.flexibleParse(fs.readFileSync(json));                 // ac_practice.jsxi:10
		} catch (e){} 
	}
	Object.defineProperty(Track.prototype, 
		'displayName', 
		{
			get: (function (){
				return this.data && this.data.name || this.id;                     // ac_practice.jsxi:13
			})
		});
	Object.defineProperty(Track.prototype, 
		'displayNameWithDescription', 
		{
			get: (function (){
				return this.data && this.data.description ? this.displayName + ': ' + this.data.description : this.id;
			})
		});
	
	Object.defineProperty(AcPractice,                                              // ac_practice.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_tracks)                                                      // ac_practice.jsxi:25
					init();                                                        // ac_practice.jsxi:25
				return _tracks;                                                    // ac_practice.jsxi:26
			})
		});
	return AcPractice;
})();

/* Class "AcShowroom" declaration */
var AcShowroom = (function (){                                                     // ac_showroom.jsxi:1
	var AcShowroom = function (){}, 
		_showrooms = null,                                                         // ac_showroom.jsxi:11
		_blackShowroom = 'studio_black',                                           // ac_showroom.jsxi:13
		_blackShowroomUrl = 'http://www.racedepartment.com/downloads/studio-black-showroom.4353/';
	
	AcShowroom.modes = [                                                           // ac_showroom.jsxi:2
		{                                                                          // ac_showroom.jsxi:2
			id: 'default',                                                         // ac_showroom.jsxi:2
			name: 'Regular Showroom, Fixed Position (Recommended)'
		}, 
		{
			id: 'default_old',                                                     // ac_showroom.jsxi:4
			name: 'Regular Showroom, Simulated Rotation (Old)'
		}, 
		{ id: 'kunos', name: 'Custom Showroom, Dark Room' }, 
		{ id: 'gt5', name: 'Custom Showroom, GT5-style' }, 
		{ id: 'gt6', name: 'Custom Showroom, GT6-style' }, 
		{
			id: 'seatleon',                                                        // ac_showroom.jsxi:8
			name: 'Custom Showroom, Seat Leon Eurocup Style'
		}
	];
	AcShowroom.load = function (){                                                 // ac_showroom.jsxi:24
		_showrooms = fs.readdirSync(AcDir.showrooms).map(function (e){             // ac_showroom.jsxi:25
			var p = path.join(AcDir.showrooms, e);
			
			var d = null;
			
			var j = path.join(p, 'ui', 'ui_showroom.json');
			
			if (fs.existsSync(j)){                                                 // ac_showroom.jsxi:30
				try {
					d = JSON.parse(fs.readFileSync(j));                            // ac_showroom.jsxi:32
				} catch (e){} 
			}
			return { id: e, data: d, path: p, json: j };
		}).filter(function (arg){                                                  // ac_showroom.jsxi:42
			return arg;                                                            // ac_showroom.jsxi:42
		});
	};
	AcShowroom.exists = function (id){                                             // ac_showroom.jsxi:45
		return fs.existsSync(AcDir.showrooms + '/' + id);                          // ac_showroom.jsxi:46
	};
	
	function handleError(err, car){                                                // ac_showroom.jsxi:49
		try {
			var logFile = fs.readFileSync(AcTools.Utils.FileUtils.GetLogFile()).toString();
			
			if (/\bCOULD NOT FIND SUSPENSION OBJECT SUSP_[LR][FR]\b/.test(logFile)){
				car.addError('kn5-susp_xx-error',                                  // ac_showroom.jsxi:53
					'Car\'s model doesn\'t have a proper suspension.');            // ac_showroom.jsxi:53
				ErrorHandler.handled('Car\'s model doesn\'t have a proper suspension.');
				return true;
			}
			
			if (/\bCOULD NOT FIND SUSPENSION OBJECT WHEEL_[LR][FR]\b/.test(logFile)){
				ErrorHandler.handled('Car\'s model doesn\'t have some of the wheels.');
				return true;
			}
			
			if (/\\cameraforwardyebis\.cpp \(\d+\): CameraForwardYebis::render\b/.test(logFile)){
				ErrorHandler.handled('Most likely selected filter is missing.');   // ac_showroom.jsxi:64
				return true;
			}
		} catch (e){} 
		
		if (err && err.message === 'Process exited'){                              // ac_showroom.jsxi:69
			ErrorHandler.handled('Showroom was terminated too soon.');             // ac_showroom.jsxi:70
			return true;
		}
		return false;
	}
	
	AcShowroom.start = function (c, s, room){                                      // ac_showroom.jsxi:80
		if (c.disabled){                                                           // ac_showroom.jsxi:81
			Notification.warn('No Way', 'Enable car first.');                      // ac_showroom.jsxi:82
			return;
		}
		
		if (!c)                                                                    // ac_showroom.jsxi:86
			return;
		
		if (c.skins.length === 0){                                                 // ac_showroom.jsxi:88
			Notification.warn('No Way', 'At least one skin required.');            // ac_showroom.jsxi:89
			return;
		}
		
		if (s == null){                                                            // ac_showroom.jsxi:93
			s = c.selectedSkin ? c.selectedSkin.id : c.skins[0].id;                // ac_showroom.jsxi:94
		}
		
		room = room || AcShowroom.__AcShowroom_lastShowroom;                       // ac_showroom.jsxi:97
		
		var filter = AcShowroom.__AcShowroom_lastShowroomFilter || null;
		
		if (!AcShowroom.exists(room)){
			ErrorHandler.handled('Showroom “' + room + '” is missing.');           // ac_showroom.jsxi:101
			return;
		}
		
		if (filter && !AcFilters.exists(filter)){                                  // ac_showroom.jsxi:105
			ErrorHandler.handled('Filter “' + filter + '” is missing.');           // ac_showroom.jsxi:106
			return;
		}
		
		AcTools;                                                                   // ac_showroom.jsxi:110
		
		try {
			AcTools.Processes.Showroom.Start(AcDir.root, c.id, s, room, filter);   // ac_showroom.jsxi:112
		} catch (err){                                                             // ac_showroom.jsxi:113
			ErrorHandler.handled('Cannot start showroom. Maybe the car is broken.', err);
			return;
		} 
		
		handleError(null, c);                                                      // ac_showroom.jsxi:118
	};
	AcShowroom.select = function (c, s){                                           // ac_showroom.jsxi:121
		var d = new Dialog('Showroom',                                             // ac_showroom.jsxi:122
			[
				'<h6>Select showroom</h6>',                                        // ac_showroom.jsxi:123
				'<select id="showroom-select-showroom">{0}</select>'.format(AcShowroom.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.data ? e.data.name : e.id);
				}).join('')),                                                      // ac_showroom.jsxi:126
				'<h6>Select filter</h6>',                                          // ac_showroom.jsxi:127
				'<select id="showroom-select-filter"><option value="">Don\'t change</option>{0}</select>'.format(AcFilters.list.map(function (e){
					return '<option value="{0}">{1}</option>'.format(e.id, e.id);
				}).join(''))
			], 
			function (){                                                           // ac_showroom.jsxi:131
				AcShowroom.start(c, s);
			}).addButton('Reload List',                                            // ac_showroom.jsxi:133
			function (){                                                           // ac_showroom.jsxi:133
				setTimeout(function (){                                            // ac_showroom.jsxi:134
					AcShowroom.load();
					AcFilters.load();                                              // ac_showroom.jsxi:136
					AcShowroom.select(c, s);
				});
			});
		
		d.find('#showroom-select-showroom').val(AcShowroom.__AcShowroom_lastShowroom).change(function (){
			localStorage.lastShowroom = this.value;                                // ac_showroom.jsxi:141
		});
		d.find('#showroom-select-filter').val(AcShowroom.__AcShowroom_lastShowroomFilter).change(function (){
			localStorage.lastShowroomFilter = this.value;                          // ac_showroom.jsxi:144
		});
	};
	
	function shotOutputPreview(car, output, callback){                             // ac_showroom.jsxi:148
		var d = new Dialog('Update Previews',                                      // ac_showroom.jsxi:150
			[
				'<div class="left"><h6>Current</h6><img id="current-preview"></div>', 
				'<div class="right"><h6>New</h6><img id="new-preview"></div>'
			], 
			function (){                                                           // ac_showroom.jsxi:153
				callback();                                                        // ac_showroom.jsxi:154
			}, 
			false).setButton('Apply').addButton('Cancel');                         // ac_showroom.jsxi:155
		
		var t = $('<div>' + '<button data-action="prev" id="button-prev" disabled>←</button> ' + '<button data-action="next" id="button-next">→</button>' + '</div>').insertBefore(d.header);
		
		t.find('#button-prev').click(function (){                                  // ac_showroom.jsxi:162
			pos --;                                                                // ac_showroom.jsxi:163
			out();                                                                 // ac_showroom.jsxi:164
		});
		t.find('#button-next').click(function (){                                  // ac_showroom.jsxi:167
			pos ++;                                                                // ac_showroom.jsxi:168
			out();                                                                 // ac_showroom.jsxi:169
		});
		d.content.css({ maxWidth: 'calc(100vw - 100px)', paddingBottom: '10px' }).find('img').css({ width: '100%', verticalAlign: 'top' });
		
		var list = fs.readdirSync(output).map(function (arg){                      // ac_showroom.jsxi:180
			return arg.slice(0, - 4);                                              // ac_showroom.jsxi:180
		});
		
		var pos = 0;
		
		function out(){                                                            // ac_showroom.jsxi:182
			t.find('#button-prev').attr('disabled', pos > 0 ? null : true);        // ac_showroom.jsxi:183
			t.find('#button-next').attr('disabled', pos < list.length - 1 ? null : true);
			d.content.find('#current-preview').prop('src', car.getSkin(list[pos]).preview.cssUrl());
			d.content.find('#new-preview').prop('src', (output + '/' + list[pos] + '.bmp').cssUrl());
		}
		
		out();                                                                     // ac_showroom.jsxi:189
	}
	
	AcShowroom.shotOne = function (car, skin){                                     // ac_showroom.jsxi:192
		AcShowroom.shot(car, false, 
			skin || car.selectedSkin);
	};
	AcShowroom.shot = function (c, manualMode, onlyOneSkin){                       // ac_showroom.jsxi:196
		if (manualMode && onlyOneSkin != null)                                     // ac_showroom.jsxi:197
			return;
		
		manualMode = !!manualMode;                                                 // ac_showroom.jsxi:198
		
		var mode = Settings.get('aptMode');
		
		if (manualMode)                                                            // ac_showroom.jsxi:201
			mode = 'default_old';                                                  // ac_showroom.jsxi:201
		
		if (onlyOneSkin != null)                                                   // ac_showroom.jsxi:202
			mode = 'default';                                                      // ac_showroom.jsxi:202
		
		if (mode === 'default' || mode === 'default_old'){                         // ac_showroom.jsxi:204
			if (c.disabled){                                                       // ac_showroom.jsxi:205
				Notification.warn('No Way', 'Enable car first.');                  // ac_showroom.jsxi:206
				return;
			}
			
			var showroom = Settings.get('aptShowroom') || _blackShowroom;
			
			var filter = Settings.get('aptFilter') || null;
			
			var disableSweetFx = !!Settings.get('aptDisableSweetFx');
			
			if (mode === 'default'){                                               // ac_showroom.jsxi:214
				var cameraPosition = Settings.get('aptCameraPosition');
				
				var cameraLookAt = Settings.get('aptCameraLookAt');
				
				var cameraFov = + Settings.get('aptCameraFov');
				
				if (!/((-?\d(.\d*)?)\s*,\s*){2}(-?\d(.\d*)?)/.test(cameraPosition))
					cameraPosition = Settings.defaults.aptCameraPosition;          // ac_showroom.jsxi:219
				
				if (!/((-?\d(.\d*)?)\s*,\s*){2}(-?\d(.\d*)?)/.test(cameraLookAt))
					cameraLookAt = Settings.defaults.aptCameraLookAt;              // ac_showroom.jsxi:220
				
				if (Number.isNaN(cameraFov))                                       // ac_showroom.jsxi:221
					cameraFov = Settings.defaults.aptCameraFov;                    // ac_showroom.jsxi:221
			} else {
				var cameraX = + Settings.get('aptCameraX');
				
				var cameraY = + Settings.get('aptCameraY');
				
				var cameraDistance = + Settings.get('aptCameraDistance');
				
				var delays = !!Settings.get('aptIncreaseDelays');
				
				if (Number.isNaN(cameraX))                                         // ac_showroom.jsxi:228
					cameraX = Settings.defaults.aptCameraX;                        // ac_showroom.jsxi:228
				
				if (Number.isNaN(cameraY))                                         // ac_showroom.jsxi:229
					cameraY = Settings.defaults.aptCameraY;                        // ac_showroom.jsxi:229
				
				if (Number.isNaN(cameraDistance))                                  // ac_showroom.jsxi:230
					cameraDistance = Settings.defaults.aptCameraDistance;          // ac_showroom.jsxi:230
			}
			
			showroomTest();                                                        // ac_showroom.jsxi:233
			
			function showroomTest(){                                               // ac_showroom.jsxi:234
				function blackShowroomTest(){                                      // ac_showroom.jsxi:235
					return fs.existsSync(AcTools.Utils.FileUtils.GetShowroomFolder(AcDir.root, showroom));
				}
				
				if (showroom == _blackShowroom && !blackShowroomTest()){           // ac_showroom.jsxi:239
					new Dialog('One More Thing',                                   // ac_showroom.jsxi:240
						'Please, install <a href="#" onclick="Shell.openItem(\'' + _blackShowroomUrl + '\')">Black Showroom</a> first.', 
						function (){                                               // ac_showroom.jsxi:242
							Shell.openItem(_blackShowroomUrl);                     // ac_showroom.jsxi:243
							return false;
						}).setButton('From Here').addButton('Right Here',          // ac_showroom.jsxi:245
						function (){                                               // ac_showroom.jsxi:245
							Shell.openItem(AcTools.Utils.FileUtils.GetShowroomsFolder(AcDir.root));
							return false;
						}).addButton('Done',                                       // ac_showroom.jsxi:248
						function (){                                               // ac_showroom.jsxi:248
							if (blackShowroomTest()){                              // ac_showroom.jsxi:249
								setTimeout(proceed);                               // ac_showroom.jsxi:250
							} else {
								new Dialog('Black Showroom Installation',          // ac_showroom.jsxi:252
									'Showroom is still missing. No way.');         // ac_showroom.jsxi:252
								this.buttons.find('button:last-child').text('Really Done');
								return false;
							}
						});
				} else {
					proceed();                                                     // ac_showroom.jsxi:258
				}
			}
		} else {
			proceed();                                                             // ac_showroom.jsxi:262
		}
		
		var upd;
		
		function proceed(){                                                        // ac_showroom.jsxi:267
			upd = new Dialog('Auto-update Previews',                               // ac_showroom.jsxi:268
				[ '<progress indeterminate></progress>' ], 
				function (){                                                       // ac_showroom.jsxi:270
					CheckUpdate.abort();                                           // ac_showroom.jsxi:271
				}, 
				false).setButton(false);                                           // ac_showroom.jsxi:272
			
			if (mode === 'default' || mode == 'default_old'){                      // ac_showroom.jsxi:274
				if (filter === Settings.defaults.aptFilter){                       // ac_showroom.jsxi:275
					AcFilters.installFilter('data/ppfilter.ini', Settings.defaults.aptFilter);
					setTimeout(proceedShot, 500);                                  // ac_showroom.jsxi:277
					return;
				} else if (filter && !AcFilters.exists(filter)){                   // ac_showroom.jsxi:279
					ErrorHandler.handled('Filter “' + filter + '” is missing.');   // ac_showroom.jsxi:280
					upd.close();                                                   // ac_showroom.jsxi:281
					return;
				}
			}
			
			proceedShot();                                                         // ac_showroom.jsxi:286
		}
		
		function proceedShot(){                                                    // ac_showroom.jsxi:289
			var output;
			
			try {
				if (mode === 'default_old'){                                       // ac_showroom.jsxi:292
					output = AcTools.Processes.Showroom.Shot(AcDir.root,           // ac_showroom.jsxi:293
						c.id,                                                      // ac_showroom.jsxi:293
						showroom,                                                  // ac_showroom.jsxi:293
						manualMode,                                                // ac_showroom.jsxi:293
						cameraX,                                                   // ac_showroom.jsxi:293
						cameraY,                                                   // ac_showroom.jsxi:293
						cameraDistance,                                            // ac_showroom.jsxi:293
						filter,                                                    // ac_showroom.jsxi:294
						disableSweetFx,                                            // ac_showroom.jsxi:294
						delays);                                                   // ac_showroom.jsxi:294
				} else if (mode === 'default'){                                    // ac_showroom.jsxi:295
					if (onlyOneSkin != null){                                      // ac_showroom.jsxi:296
						output = AcTools.Processes.Showroom.ShotOne(AcDir.root,    // ac_showroom.jsxi:297
							c.id,                                                  // ac_showroom.jsxi:297
							showroom,                                              // ac_showroom.jsxi:297
							onlyOneSkin,                                           // ac_showroom.jsxi:297
							cameraPosition,                                        // ac_showroom.jsxi:297
							cameraLookAt,                                          // ac_showroom.jsxi:297
							cameraFov,                                             // ac_showroom.jsxi:297
							filter,                                                // ac_showroom.jsxi:297
							disableSweetFx);                                       // ac_showroom.jsxi:297
					} else {
						output = AcTools.Processes.Showroom.ShotAll(AcDir.root,    // ac_showroom.jsxi:299
							c.id,                                                  // ac_showroom.jsxi:299
							showroom,                                              // ac_showroom.jsxi:299
							cameraPosition,                                        // ac_showroom.jsxi:299
							cameraLookAt,                                          // ac_showroom.jsxi:299
							cameraFov,                                             // ac_showroom.jsxi:299
							filter,                                                // ac_showroom.jsxi:299
							disableSweetFx);                                       // ac_showroom.jsxi:299
					}
				} else {
					output = AcTools.Kn5Render.Utils.Kn5RenderWrapper.Shot(c.path, mode);
				}
				
				upd.close();                                                       // ac_showroom.jsxi:304
			} catch (err){                                                         // ac_showroom.jsxi:305
				upd.close();                                                       // ac_showroom.jsxi:306
				
				if (!handleError(err, c)){                                         // ac_showroom.jsxi:307
					ErrorHandler.handled('Cannot start showroom. Maybe the car is broken.', err);
				}
				return;
			} 
			
			shotOutputPreview(c,                                                   // ac_showroom.jsxi:314
				output,                                                            // ac_showroom.jsxi:314
				function (){                                                       // ac_showroom.jsxi:314
					AcTools.Utils.ImageUtils.ApplyPreviews(AcDir.root,             // ac_showroom.jsxi:315
						c.id,                                                      // ac_showroom.jsxi:315
						output,                                                    // ac_showroom.jsxi:315
						Settings.get('aptResize'),                                 // ac_showroom.jsxi:315
						Settings.get('aptPngMode'));                               // ac_showroom.jsxi:315
					c.loadSkins();                                                 // ac_showroom.jsxi:316
					
					try {
						fs.rmdirSync(output);                                      // ac_showroom.jsxi:317
					} catch (e){} 
				});
		}
	};
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'list', 
		{
			get: (function (){
				if (!_showrooms){                                                  // ac_showroom.jsxi:17
					AcShowroom.load();
				}
				return _showrooms;                                                 // ac_showroom.jsxi:21
			})
		});
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'__AcShowroom_lastShowroom', 
		{
			get: (function (){
				return localStorage.lastShowroom || 'showroom';                    // ac_showroom.jsxi:77
			})
		});
	Object.defineProperty(AcShowroom,                                              // ac_showroom.jsxi:1
		'__AcShowroom_lastShowroomFilter', 
		{
			get: (function (){
				return localStorage.lastShowroomFilter || '';                      // ac_showroom.jsxi:78
			})
		});
	return AcShowroom;
})();

(function (){                                                                      // ac_tools.jsxi:1
	var _a;
	
	function init(){                                                               // ac_tools.jsxi:4
		var c;
		
		try {
			c = require('clr');                                                    // ac_tools.jsxi:7
		} catch (err){                                                             // ac_tools.jsxi:8
			throw new Error('Cannot load native module. Make sure you have Visual C++ Redistributable 2013 (x86) installed.');
		} 
		
		try {
			_a = c.init({                                                          // ac_tools.jsxi:13
				assemblies: [ 'native/AcTools.dll', 'native/AcTools.Kn5Render.dll' ], 
				global: false
			}).AcTools;                                                            // ac_tools.jsxi:16
		} catch (err){                                                             // ac_tools.jsxi:17
			throw new Error('Cannot load native module. Make sure you have .NET Framework 4.5 installed.');
		} 
	}
	
	__defineGetter__('AcTools',                                                    // ac_tools.jsxi:22
		function (){                                                               // ac_tools.jsxi:22
			if (!_a)                                                               // ac_tools.jsxi:23
				init();                                                            // ac_tools.jsxi:23
			return _a;                                                             // ac_tools.jsxi:24
		});
})();

/* Class "CheckUpdate" declaration */
var CheckUpdate = (function (){                                                    // app_check_update.jsxi:1
	var CheckUpdate = function (){}, 
		mediator = new Mediator(),                                                 // app_check_update.jsxi:2
		_updateFile = path.join(path.dirname(process.execPath), 'carsmgr_update.next'), 
		_details = 'https://ascobash.wordpress.com/2015/06/14/actools-uijson/',    // app_check_update.jsxi:5
		_downloadId;                                                               // app_check_update.jsxi:36
	
	CheckUpdate.check = function (c){                                              // app_check_update.jsxi:7
		mediator.dispatch('check:start');                                          // app_check_update.jsxi:8
		AppServerRequest.checkUpdate(gui.App.manifest.version,                     // app_check_update.jsxi:10
			Settings.get('updatesSource'),                                         // app_check_update.jsxi:12
			function (err, data){                                                  // app_check_update.jsxi:13
				if (err){                                                          // app_check_update.jsxi:14
					console.warn(err);                                             // app_check_update.jsxi:15
					mediator.dispatch('check:failed');                             // app_check_update.jsxi:16
					return;
				}
				
				if (data){                                                         // app_check_update.jsxi:20
					mediator.dispatch('update',                                    // app_check_update.jsxi:21
						{
							actualVersion: data.version,                           // app_check_update.jsxi:22
							changelog: data.changes,                               // app_check_update.jsxi:23
							detailsUrl: _details,                                  // app_check_update.jsxi:24
							downloadUrl: data.url,                                 // app_check_update.jsxi:25
							installUrl: data.download || Downloader.isAvailable(data.url) && data.url
						});
					mediator.dispatch('check:done:found');                         // app_check_update.jsxi:29
				} else {
					mediator.dispatch('check:done');                               // app_check_update.jsxi:31
				}
			});
	};
	CheckUpdate.install = function (url){                                          // app_check_update.jsxi:37
		mediator.dispatch('install:start');                                        // app_check_update.jsxi:38
		_downloadId = Downloader.download(url,                                     // app_check_update.jsxi:39
			_updateFile + '~tmp',                                                  // app_check_update.jsxi:39
			function (error){                                                      // app_check_update.jsxi:39
				if (error){                                                        // app_check_update.jsxi:40
					mediator.dispatch('install:failed', error);                    // app_check_update.jsxi:41
				} else {
					fs.renameSync(_updateFile + '~tmp', _updateFile);              // app_check_update.jsxi:43
					mediator.dispatch('install:ready');                            // app_check_update.jsxi:44
				}
				
				_downloadId = null;                                                // app_check_update.jsxi:47
			}, 
			function (p, m){                                                       // app_check_update.jsxi:48
				mediator.dispatch('install:progress', p, m);                       // app_check_update.jsxi:49
			});
	};
	CheckUpdate.abort = function (){                                               // app_check_update.jsxi:53
		if (!_downloadId)                                                          // app_check_update.jsxi:54
			return;
		
		Downloader.abort(_downloadId);                                             // app_check_update.jsxi:55
		_downloadId = null;                                                        // app_check_update.jsxi:56
		mediator.dispatch('install:interrupt');                                    // app_check_update.jsxi:58
		setTimeout(function (arg){                                                 // app_check_update.jsxi:60
			try {
				fs.unlinkSync(_updateFile + '~tmp');                               // app_check_update.jsxi:61
			} catch (e){} 
		}, 
		500);
	};
	CheckUpdate.autoupdate = function (){                                          // app_check_update.jsxi:65
		try {
			if (fs.existsSync(_updateFile)){                                       // app_check_update.jsxi:67
				var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
				
				if (fs.existsSync(d)){                                             // app_check_update.jsxi:69
					fs.removeDirSync(d, false);                                    // app_check_update.jsxi:70
				} else {
					fs.mkdirSync(d);                                               // app_check_update.jsxi:72
				}
				
				AcTools.Utils.FileUtils.Unzip(_updateFile, d);                     // app_check_update.jsxi:75
				
				var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
				
				fs.writeFileSync(b,                                                // app_check_update.jsxi:78
					"\t\t\t\t \n@ECHO OFF\n\nCD %~dp0\nTASKKILL /F /IM carsmgr.exe\n\n:CHECK_EXECUTABLE\nIF NOT EXIST carsmgr.exe GOTO EXECUTABLE_REMOVED\n\nDEL carsmgr.exe\nTIMEOUT /T 1 >nul\n\nGOTO CHECK_EXECUTABLE\n:EXECUTABLE_REMOVED\n\nDEL carsmgr.exe\n\nfor /r %%i in (carsmgr_update~next\\*) do MOVE /Y \"%%i\" %%~nxi\nRMDIR /S /Q carsmgr_update~next\n\nstart carsmgr.exe\n\nDEL %0 carsmgr_update.next".replace(/\n/g, '\r\n'));
				Shell.openItem(b);                                                 // app_check_update.jsxi:101
				gui.App.quit();                                                    // app_check_update.jsxi:102
			}
		} catch (e){                                                               // app_check_update.jsxi:104
			mediator.dispatch('autoupdate:failed', e);                             // app_check_update.jsxi:105
			
			try {
				if (fs.existsSync(_updateFile)){                                   // app_check_update.jsxi:107
					fs.unlinkSync(_updateFile);                                    // app_check_update.jsxi:108
				}
			} catch (e){} 
			
			try {
				var d = path.join(path.dirname(process.execPath), 'carsmgr_update~next');
				
				if (fs.existsSync(d)){                                             // app_check_update.jsxi:113
					clearDir(d);                                                   // app_check_update.jsxi:114
					fs.rmdirSync(d);                                               // app_check_update.jsxi:115
				}
			} catch (e){} 
			
			try {
				var b = path.join(path.dirname(process.execPath), 'carsmgr_update.bat');
				
				if (fs.existsSync(b)){                                             // app_check_update.jsxi:121
					fs.unlinkSync(b);                                              // app_check_update.jsxi:122
				}
			} catch (e){} 
		} 
	};
	(function (){                                                                  // app_check_update.jsxi:128
		CheckUpdate.autoupdate();
		mediator.extend(CheckUpdate);                                              // app_check_update.jsxi:130
	})();
	return CheckUpdate;
})();

/* Class "AppServerRequest" declaration */
var AppServerRequest = (function (){                                               // app_server_request.jsxi:1
	var AppServerRequest = function (){}, 
		_url = 'http://ascobash.comuf.com/api.php',                                // app_server_request.jsxi:2
		_dataToSend = [],                                                          // app_server_request.jsxi:76
		_sendTimeout,                                                              // app_server_request.jsxi:77
		_sendDelay = 3e3;                                                          // app_server_request.jsxi:78
	
	AppServerRequest.sendDataDisabled = false;                                     // app_server_request.jsxi:102
	AppServerRequest.checkUpdate = function (version, branch, callback){           // app_server_request.jsxi:6
		$.ajax({ url: _url + ('?0=check&v=' + version + '&b=' + branch) }).fail(function (){
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
	AppServerRequest.checkContentUpdate = function (version, callback){            // app_server_request.jsxi:20
		$.ajax({ url: _url + ('?0=check-content&v=' + version) }).fail(function (){
			if (callback)                                                          // app_server_request.jsxi:24
				callback('error:request');                                         // app_server_request.jsxi:24
		}).done(function (data){                                                   // app_server_request.jsxi:25
			if (data == null || typeof data === 'object'){                         // app_server_request.jsxi:26
				if (callback)                                                      // app_server_request.jsxi:27
					callback(null, data);                                          // app_server_request.jsxi:27
			} else {
				if (callback)                                                      // app_server_request.jsxi:29
					callback('error:' + data);                                     // app_server_request.jsxi:29
			}
		});
	};
	AppServerRequest.sendBinary = function (car, file, buf, callback){             // app_server_request.jsxi:34
		var req = new XMLHttpRequest();
		
		req.open('POST', _url + ('?0=binary&c=' + car + '&f=' + file), true);      // app_server_request.jsxi:36
		req.setRequestHeader('Content-Type', 'application/octet-stream');          // app_server_request.jsxi:37
		req.onreadystatechange = function (){                                      // app_server_request.jsxi:39
			if (req.readyState == 4){                                              // app_server_request.jsxi:40
				if (callback)                                                      // app_server_request.jsxi:41
					callback(null);                                                // app_server_request.jsxi:41
			}
		};
		req.send(new Uint8Array(buf).buffer);                                      // app_server_request.jsxi:45
	};
	AppServerRequest.sendFeedback = function (feedback, callback){                 // app_server_request.jsxi:48
		$.ajax({                                                                   // app_server_request.jsxi:49
			url: _url + '?0=feedback',                                             // app_server_request.jsxi:49
			type: 'POST',                                                          // app_server_request.jsxi:51
			contentType: 'text/plain',                                             // app_server_request.jsxi:52
			data: feedback,                                                        // app_server_request.jsxi:53
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:55
			if (callback)                                                          // app_server_request.jsxi:56
				callback('error:request');                                         // app_server_request.jsxi:56
		}).done(function (data){                                                   // app_server_request.jsxi:57
			if (callback)                                                          // app_server_request.jsxi:58
				callback(null);                                                    // app_server_request.jsxi:58
		});
	};
	AppServerRequest.sendError = function (version, details, callback){            // app_server_request.jsxi:62
		$.ajax({                                                                   // app_server_request.jsxi:63
			url: _url + '?0=error',                                                // app_server_request.jsxi:63
			type: 'POST',                                                          // app_server_request.jsxi:65
			contentType: 'text/plain',                                             // app_server_request.jsxi:66
			data: version + ':' + details,                                         // app_server_request.jsxi:67
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:69
			if (callback)                                                          // app_server_request.jsxi:70
				callback('error:request');                                         // app_server_request.jsxi:70
		}).done(function (data){                                                   // app_server_request.jsxi:71
			if (callback)                                                          // app_server_request.jsxi:72
				callback(null);                                                    // app_server_request.jsxi:72
		});
	};
	
	function sendDataInner(carId, key, value){                                     // app_server_request.jsxi:80
		$.ajax({                                                                   // app_server_request.jsxi:81
			url: _url + ('?0=database&c=' + carId + '&f=' + key),                  // app_server_request.jsxi:81
			type: 'POST',                                                          // app_server_request.jsxi:83
			contentType: 'text/plain',                                             // app_server_request.jsxi:84
			data: value,                                                           // app_server_request.jsxi:85
			processData: false
		}).fail(function (){                                                       // app_server_request.jsxi:87
			console.warn('send data failed');                                      // app_server_request.jsxi:88
		});
	}
	
	function sendDataGroup(carId, key, value, callback){                           // app_server_request.jsxi:92
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:93
			var e = _dataToSend[i];
			
			if (e){                                                                // app_server_request.jsxi:94
				sendDataInner(e.car, e.key, e.value);                              // app_server_request.jsxi:95
			}
		}
		
		_dataToSend = [];                                                          // app_server_request.jsxi:99
	}
	
	AppServerRequest.sendData = function (carId, key, value, callback){            // app_server_request.jsxi:103
		if (AppServerRequest.sendDataDisabled)
			return;
		
		for (var i = 0; i < _dataToSend.length; i ++){                             // app_server_request.jsxi:106
			var e = _dataToSend[i];
			
			if (e && e.car === carId && e.key === key){                            // app_server_request.jsxi:107
				_dataToSend[i] = null;                                             // app_server_request.jsxi:108
			}
		}
		
		_dataToSend.push({ car: carId, key: key, value: value });                  // app_server_request.jsxi:112
		
		if (callback)                                                              // app_server_request.jsxi:113
			callback(null);                                                        // app_server_request.jsxi:113
		
		clearTimeout(_sendTimeout);                                                // app_server_request.jsxi:115
		_sendTimeout = setTimeout(sendDataGroup, _sendDelay);                      // app_server_request.jsxi:116
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
		_list,                                                                     // cars.jsxi:26
		_brands = new UniqueList('brand'),                                         // cars.jsxi:27
		_classes = new UniqueList('class'),                                        // cars.jsxi:28
		_countries = new UniqueList('country'),                                    // cars.jsxi:29
		_authors = new UniqueList('author'),                                       // cars.jsxi:30
		_tags = new UniqueList('tag');                                             // cars.jsxi:31
	
	Cars.byId = function (n){                                                      // cars.jsxi:38
		for (var i = 0; i < _list.length; i ++){                                   // cars.jsxi:39
			if (_list[i].id === n){                                                // cars.jsxi:40
				return _list[i];                                                   // cars.jsxi:41
			}
		}
		return null;
	};
	Cars.byName = function (n){                                                    // cars.jsxi:48
		return Cars.byId(n);
	};
	Cars.registerTags = function (tags){                                           // cars.jsxi:52
		tags.forEach(function (e){                                                 // cars.jsxi:53
			_tags.add(e);                                                          // cars.jsxi:54
		});
	};
	Cars.registerClass = function (v){                                             // cars.jsxi:58
		_classes.add(v);                                                           // cars.jsxi:59
	};
	Cars.registerBrand = function (v){                                             // cars.jsxi:62
		_brands.add(v);                                                            // cars.jsxi:63
		Brands.add(v);                                                             // cars.jsxi:64
	};
	Cars.registerCountry = function (v){                                           // cars.jsxi:67
		_countries.add(v);                                                         // cars.jsxi:68
	};
	Cars.registerAuthor = function (v){                                            // cars.jsxi:71
		_authors.add(v);                                                           // cars.jsxi:72
	};
	Cars.scan = function (){                                                       // cars.jsxi:75
		mediator.dispatch('scan:start');                                           // cars.jsxi:76
		
		if (!fs.existsSync(AcDir.carsOff)){                                        // cars.jsxi:78
			fs.mkdirSync(AcDir.carsOff);                                           // cars.jsxi:79
		}
		
		var names = {};
		
		_list = fs.readdirSync(AcDir.cars).map(function (e){                       // cars.jsxi:83
			return path.join(AcDir.cars, e);                                       // cars.jsxi:84
		}).concat(fs.readdirSync(AcDir.carsOff).map(function (e){                  // cars.jsxi:85
			return path.join(AcDir.carsOff, e);                                    // cars.jsxi:86
		})).map(function (carPath){                                                // cars.jsxi:87
			car = new Car(carPath);                                                // cars.jsxi:88
			
			if (names[car.id])                                                     // cars.jsxi:89
				return;
			
			mediator.dispatch('new.car', car);                                     // cars.jsxi:90
			names[car.id] = true;                                                  // cars.jsxi:91
			return car;                                                            // cars.jsxi:92
		}).filter(function (e){                                                    // cars.jsxi:93
			return e;                                                              // cars.jsxi:94
		});
		asyncLoad();                                                               // cars.jsxi:97
	};
	Cars.loadById = function (id, callback){                                       // cars.jsxi:100
		var car = Cars.byId(id);
		
		if (car){                                                                  // cars.jsxi:102
			car.reload(callback);                                                  // cars.jsxi:103
		} else {
			var path = AcDir.cars + '/' + id;
			
			if (fs.existsSync(path)){                                              // cars.jsxi:106
				car = new Car(path);                                               // cars.jsxi:107
			} else {
				path = AcDir.carsOff + '/' + id;                                   // cars.jsxi:109
				
				if (fs.existsSync(path)){                                          // cars.jsxi:110
					car = new Car(path);                                           // cars.jsxi:111
				} else {
					throw new Error('Car with id “' + id + '” not found.');        // cars.jsxi:113
				}
			}
			
			_list.push(car);                                                       // cars.jsxi:117
			mediator.dispatch('new.car', car);                                     // cars.jsxi:118
			car.loadEnsure(callback);                                              // cars.jsxi:119
		}
	};
	
	function asyncLoad(){                                                          // cars.jsxi:123
		var a = _list,                                                             // cars.jsxi:124
			i = 0,                                                                 // cars.jsxi:124
			step = function (arg){                                                 // cars.jsxi:125
				if (a != _list){                                                   // cars.jsxi:126
					mediator.dispatch('scan:interrupt', a);                        // cars.jsxi:127
				} else if (i >= a.length){                                         // cars.jsxi:128
					mediator.dispatch('scan:ready', a);                            // cars.jsxi:129
					lasyAsyncLoad();                                               // cars.jsxi:130
				} else {
					mediator.dispatch('scan:progress', i, a.length);               // cars.jsxi:132
					a[i ++].loadData(step);                                        // cars.jsxi:133
				}
			};
		
		mediator.dispatch('scan:list', a);                                         // cars.jsxi:137
		step();                                                                    // cars.jsxi:138
	}
	
	function lasyAsyncLoad(){                                                      // cars.jsxi:141
		var a = _list,                                                             // cars.jsxi:142
			b = a.slice(),                                                         // cars.jsxi:142
			i = 0,                                                                 // cars.jsxi:142
			step = setTimeout.bind(window,                                         // cars.jsxi:143
				function (arg){                                                    // cars.jsxi:143
					if (a != _list){                                               // cars.jsxi:144
						mediator.dispatch('lazyscan:interrupt', b);                // cars.jsxi:145
					} else if (i >= b.length){                                     // cars.jsxi:146
						mediator.dispatch('lazyscan:ready', b);                    // cars.jsxi:147
					} else {
						mediator.dispatch('lazyscan:progress', i, b.length);       // cars.jsxi:150
						b[i ++].loadEnsure(step);                                  // cars.jsxi:151
					}
				}, 
				20);
		
		mediator.dispatch('lazyscan:start', b);                                    // cars.jsxi:155
		step();                                                                    // cars.jsxi:156
	}
	
	Cars.acdTest = function (){                                                    // cars.jsxi:159
		var a = _list,                                                             // cars.jsxi:160
			b = a.slice(),                                                         // cars.jsxi:160
			i = 0,                                                                 // cars.jsxi:160
			step = setTimeout.bind(window,                                         // cars.jsxi:161
				function (arg){                                                    // cars.jsxi:161
					if (a != _list){                                               // cars.jsxi:162
						mediator.dispatch('lazyscan:interrupt', b);                // cars.jsxi:163
					} else if (i >= b.length){                                     // cars.jsxi:164
						mediator.dispatch('lazyscan:ready', b);                    // cars.jsxi:165
					} else {
						mediator.dispatch('lazyscan:progress', i, b.length);       // cars.jsxi:167
						b[i ++].testAcd(step);                                     // cars.jsxi:168
					}
				}, 
				20);
		
		mediator.dispatch('lazyscan:start', b);                                    // cars.jsxi:172
		step();                                                                    // cars.jsxi:173
	};
	Cars.toggle = function (car, state){                                           // cars.jsxi:176
		car.toggle(state);                                                         // cars.jsxi:177
	};
	Cars.changeData = function (car, key, value){                                  // cars.jsxi:180
		car.changeData(key, value);                                                // cars.jsxi:181
	};
	Cars.changeDataSpecs = function (car, key, value){                             // cars.jsxi:184
		car.changeDataSpecs(key, value);                                           // cars.jsxi:185
	};
	Cars.changeParent = function (car, parentId){                                  // cars.jsxi:188
		car.changeParent(parentId);                                                // cars.jsxi:189
	};
	Cars.selectSkin = function (car, skinId){                                      // cars.jsxi:192
		car.selectSkin(skinId);                                                    // cars.jsxi:193
	};
	Cars.updateSkins = function (car){                                             // cars.jsxi:196
		car.updateSkins();                                                         // cars.jsxi:197
	};
	Cars.updateUpgrade = function (car){                                           // cars.jsxi:200
		car.updateUpgrade();                                                       // cars.jsxi:201
	};
	Cars.reload = function (car){                                                  // cars.jsxi:204
		car.load();                                                                // cars.jsxi:205
	};
	Cars.reloadAll = function (){                                                  // cars.jsxi:208
		Cars.scan();
	};
	Cars.save = function (car){                                                    // cars.jsxi:212
		car.save();                                                                // cars.jsxi:213
	};
	Cars.saveAll = function (){                                                    // cars.jsxi:216
		_list.forEach(function (car){                                              // cars.jsxi:217
			if (car.changed){                                                      // cars.jsxi:218
				car.save();                                                        // cars.jsxi:219
			}
		});
	};
	Cars.remove = function (car){                                                  // cars.jsxi:224
		for (var i = 0; i < _list.length; i ++){                                   // cars.jsxi:225
			var c = _list[i];
			
			if (c === car){                                                        // cars.jsxi:226
				AcTools.Utils.FileUtils.Recycle(car.path);                         // cars.jsxi:227
				
				if (car.parent){                                                   // cars.jsxi:229
					car.parent.children.splice(car.parent.children.indexOf(car), 1);
					mediator.dispatch('update.car.children', car.parent);          // cars.jsxi:231
				}
				
				{
					var __9 = car.children;
					
					for (var __8 = 0; __8 < __9.length; __8 ++){
						var child = __9[__8];
						
						Cars.remove(child);                                        // cars.jsxi:235
					}
					
					__9 = undefined;
				}
				
				_list.splice(i, 1);                                                // cars.jsxi:238
				mediator.dispatch('remove.car', car);                              // cars.jsxi:239
				return;
			}
		}
	};
	Cars.databaseContains = function (id){                                         // cars.jsxi:245
		return DataStorage.getContentFile('Details', id + '.json') != null;        // cars.jsxi:246
	};
	Cars.fromDatabase = function (id){                                             // cars.jsxi:249
		return DataStorage.readContentJsonFile('Details', id + '.json');           // cars.jsxi:250
	};
	
	function parseLoadedData(data){                                                // cars_car_load.jsxi:294
		try {
			return JSON.flexibleParse(data);                                       // cars_car_load.jsxi:296
		} catch (er){                                                              // cars_car_load.jsxi:297
			return er;                                                             // cars_car_load.jsxi:298
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
		
		v = '' + v;                                                                // cars.jsxi:15
		
		var l = v.toLowerCase();
		
		if (this.__UniqueList__lower.indexOf(l) < 0){                              // cars.jsxi:17
			this.list.push(v);                                                     // cars.jsxi:18
			this.__UniqueList__lower.push(l);                                      // cars.jsxi:19
			mediator.dispatch('new.' + this.name, v);                              // cars.jsxi:21
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
				this.path = carPath;                                               // cars_car.jsxi:32
				this.disabled = carPath.indexOf(AcDir.carsOff) != - 1;             // cars_car.jsxi:34
			}, 
			_messages = {                                                          // cars_car_load.jsxi:287
				'acd-test-error': 'Cannot test data',                              // cars_car_load.jsxi:287
				'acd-invalid-weight': 'Weight in data has to be equal to weight in UI + 75kg (±90kg)', 
				'acd-obsolete-aero-data': 'Obsolete section “DATA” in aero.ini'
			};
		
		Car.prototype.getSpec = function (id){                                     // cars_car.jsxi:37
			return this.data && this.data.specs[id] && + this.data.specs[id].match(/\d+(?:\.\d+)?/) || null;
		};
		Car.prototype.addError = function (id, msg, details, object){              // cars_car.jsxi:41
			if (this.hasError(id))
				return;
			
			this.error.push({ id: id, msg: msg, details: details, object: object });
			mediator.dispatch('error:add', this);                                  // cars_car.jsxi:44
		};
		Car.prototype.removeError = function (id){                                 // cars_car.jsxi:47
			for (var i = 0; i < this.error.length; i ++){                          // cars_car.jsxi:48
				var e = this.error[i];
				
				if (e.id === id){                                                  // cars_car.jsxi:49
					this.error.splice(i, 1);                                       // cars_car.jsxi:50
					mediator.dispatch('error:remove', this);                       // cars_car.jsxi:51
					return;
				}
			}
		};
		Car.prototype.clearErrors = function (filter){                             // cars_car.jsxi:57
			if (this.error.length > 0){                                            // cars_car.jsxi:58
				if (filter){                                                       // cars_car.jsxi:59
					var o = this.error.length;
					
					this.error = this.error.filter(function (arg){                 // cars_car.jsxi:61
						return arg.id.indexOf(filter) < 0;                         // cars_car.jsxi:61
					});
					
					if (o === this.error.length)                                   // cars_car.jsxi:62
						return;
				} else {
					this.error.length = 0;                                         // cars_car.jsxi:64
				}
				
				mediator.dispatch('error:remove', this);                           // cars_car.jsxi:67
			}
		};
		Car.prototype.getError = function (id){                                    // cars_car.jsxi:71
			for (var __a = 0; __a < this.error.length; __a ++){
				var e = this.error[__a];
				
				if (e.id === id)                                                   // cars_car.jsxi:73
					return e;                                                      // cars_car.jsxi:73
			}
			return null;
		};
		Car.prototype.hasError = function (id){                                    // cars_car.jsxi:79
			for (var __b = 0; __b < this.error.length; __b ++){
				var e = this.error[__b];
				
				if (e.id === id)                                                   // cars_car.jsxi:81
					return true;
			}
			return false;
		};
		Car.prototype.toggle = function (state, skipParent){                       // cars_car.jsxi:87
			var __that = this, 
				d = state == null ? !this.disabled : !state;                       // cars_car.jsxi:88
			
			if (this.disabled == d)                                                // cars_car.jsxi:89
				return;
			
			var a, b;
			
			if (d){                                                                // cars_car.jsxi:92
				a = AcDir.cars, b = AcDir.carsOff;
			} else {
				a = AcDir.carsOff, b = AcDir.cars;
			}
			
			var newPath = this.path.replace(a, b);
			
			try {
				fs.renameSync(this.path, newPath);                                 // cars_car.jsxi:100
			} catch (err){                                                         // cars_car.jsxi:101
				ErrorHandler.handled('Cannot change car state.', err);             // cars_car.jsxi:102
				return;
			} 
			
			this.disabled = d;                                                     // cars_car.jsxi:106
			this.path = newPath;                                                   // cars_car.jsxi:107
			mediator.dispatch('update.car.disabled', this);                        // cars_car.jsxi:109
			mediator.dispatch('update.car.path', this);                            // cars_car.jsxi:110
			
			if (this.skins)
				mediator.dispatch('update.car.skins', this);                       // cars_car.jsxi:111
			
			if (!skipParent && this.parent && !this.disabled && this.parent.disabled){
				this.toggle(this.parent, 
					true);
			}
			
			this.children.forEach(function (e){                                    // cars_car.jsxi:117
				e.toggle(!__that.disabled, true);                                  // cars_car.jsxi:118
			});
		};
		Car.prototype.changeData = function (key, value, inner){                   // cars_car.jsxi:127
			if (inner === undefined)                                               // cars_car.jsxi:127
				inner = false;                                                     // cars_car.jsxi:127
		
			if (!this.data || this.data[key] == value)                             // cars_car.jsxi:128
				return;
			
			if (!value && (key === 'name' || key === 'brand'))                     // cars_car.jsxi:129
				return;
			
			if (!inner){                                                           // cars_car.jsxi:131
				if (key === 'name' || key === 'brand' || key === 'class' || key === 'year' || key === 'country' || key === 'author' || key === 'version' || key === 'url'){
					value = clearStr(value);                                       // cars_car.jsxi:135
				}
				
				if (key === 'name'){                                               // cars_car.jsxi:138
					if (Years.nameContains(value) && Years.fromName(this.data.name) == this.data.year){
						this.changeData('year', Years.fromName(value), true);
					}
					
					if (Brands.nameContains(this.data.name, this.data.brand) && Brands.nameContains(value)){
						this.changeData('brand', Brands.fromName(value), true);
					}
				}
				
				if (key === 'country'){                                            // cars_car.jsxi:148
					if (this.data.country != null){                                // cars_car.jsxi:149
						var i = this.data.tags.map(function (arg){                 // cars_car.jsxi:150
							return arg.toLowerCase();                              // cars_car.jsxi:150
						}).indexOf(this.data.country.toLowerCase());               // cars_car.jsxi:150
						
						if (i > - 1){                                              // cars_car.jsxi:152
							var tags = this.data.tags.slice();
							
							if (value){                                            // cars_car.jsxi:154
								tags[i] = value.toLowerCase();                     // cars_car.jsxi:155
							} else {
								tags.splice(i, 1);                                 // cars_car.jsxi:157
							}
							
							this.changeData('tags', tags, true);
						}
					}
				}
				
				if (key === 'brand'){                                              // cars_car.jsxi:164
					if (Brands.nameContains(this.data.name, this.data.brand)){     // cars_car.jsxi:165
						this.changeData('name',                                    // cars_car.jsxi:166
							value + this.data.name.substr(Brands.toNamePart(this.data.brand).length), 
							true);
					}
				}
				
				if (key === 'year'){                                               // cars_car.jsxi:170
					value = value ? + ('' + value).replace(/[^\d]+/g, '') : null;
					
					if (value < 1800 || value > 2100)                              // cars_car.jsxi:172
						return;
					
					if (Years.nameContains(this.data.name)){                       // cars_car.jsxi:174
						this.changeData('name',                                    // cars_car.jsxi:175
							this.data.name.slice(0, - 2) + ('' + value).slice(2), 
							true);
					} else if (Settings.get('yearAutoupdate')){                    // cars_car.jsxi:176
						this.changeData('name', Years.addToName(this.data.name, value), true);
					}
				}
				
				if (Settings.get('uploadData')){                                   // cars_car.jsxi:181
					AppServerRequest.sendData(this.id, key, value);                // cars_car.jsxi:182
				}
			}
			
			if (key === 'tags'){                                                   // cars_car.jsxi:186
				Cars.registerTags(value);
			}
			
			if (key === 'brand'){                                                  // cars_car.jsxi:190
				Cars.registerBrand(value);
			}
			
			if (key === 'class'){                                                  // cars_car.jsxi:194
				Cars.registerClass(value);
			}
			
			if (key === 'country'){                                                // cars_car.jsxi:198
				Cars.registerCountry(value);
			}
			
			if (key === 'author'){                                                 // cars_car.jsxi:202
				Cars.registerAuthor(value);
			}
			
			this.data[key] = value;                                                // cars_car.jsxi:206
			mediator.dispatch('update.car.data:' + key, this);                     // cars_car.jsxi:207
			
			if (!this.changed){
				this.changed = true;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:211
			}
		};
		Car.prototype.changeDataSpecs = function (key, value, inner){              // cars_car.jsxi:215
			if (!this.data || this.data.specs[key] == value)                       // cars_car.jsxi:216
				return;
			
			value = clearStr(value);                                               // cars_car.jsxi:218
			this.data.specs[key] = value;                                          // cars_car.jsxi:219
			
			if (!inner){                                                           // cars_car.jsxi:221
				if (key === 'weight' || key === 'bhp'){                            // cars_car.jsxi:222
					this.recalculatePwRatio();
				}
				
				if (Settings.get('uploadData')){                                   // cars_car.jsxi:226
					AppServerRequest.sendData(this.id, 'specs:' + key, value);     // cars_car.jsxi:227
				}
			}
			
			mediator.dispatch('update.car.data:specs', this);                      // cars_car.jsxi:231
			
			if (!this.changed){
				this.changed = true;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:235
			}
		};
		Car.prototype.recalculatePwRatio = function (inner){                       // cars_car.jsxi:239
			var w = this.getSpec('weight'), p = this.getSpec('bhp');
			
			if (w && p){                                                           // cars_car.jsxi:242
				this.changeDataSpecs('pwratio', + (+ w / + p).toFixed(2) + 'kg/cv', inner);
			}
		};
		Car.prototype.changeParent = function (parentId){                          // cars_car.jsxi:247
			if (!this.data || this.parent && this.parent.id == parentId || !this.parent && parentId == null)
				return;
			
			if (this.children.length > 0)                                          // cars_car.jsxi:249
				throw new Error('Children car cannot have childrens');             // cars_car.jsxi:249
			
			if (this.parent){
				this.parent.children.splice(this.parent.children.indexOf(this), 1);
				mediator.dispatch('update.car.children', this.parent);             // cars_car.jsxi:253
			}
			
			if (parentId){                                                         // cars_car.jsxi:256
				var par = Cars.byName(parentId);
				
				if (!par)                                                          // cars_car.jsxi:258
					throw new Error('Parent car "' + parentId + '" not found');    // cars_car.jsxi:258
				
				this.parent = par;                                                 // cars_car.jsxi:260
				this.parent.children.push(this);                                   // cars_car.jsxi:261
				mediator.dispatch('update.car.parent', this);                      // cars_car.jsxi:262
				mediator.dispatch('update.car.children', this.parent);             // cars_car.jsxi:263
				this.data.parent = this.parent.id;                                 // cars_car.jsxi:265
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:266
			} else {
				this.parent = null;
				mediator.dispatch('update.car.parent', this);                      // cars_car.jsxi:269
				delete this.data.parent;                                           // cars_car.jsxi:271
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:272
			}
			
			this.changed = true;
			mediator.dispatch('update.car.changed', this);                         // cars_car.jsxi:276
		};
		Car.prototype.getSkin = function (skinId){                                 // cars_car.jsxi:279
			if (!this.skins)
				return;
			
			for (var __c = 0; __c < this.skins.length; __c ++){
				var skin = this.skins[__c];
				
				if (skin.id === skinId){                                           // cars_car.jsxi:283
					return skin;                                                   // cars_car.jsxi:284
				}
			}
		};
		Car.prototype.selectSkin = function (skinId){                              // cars_car.jsxi:289
			if (!this.skins)
				return;
			
			var newSkin = this.getSkin(skinId);
			
			if (newSkin == this.selectedSkin)                                      // cars_car.jsxi:293
				return;
			
			this.selectedSkin = newSkin;                                           // cars_car.jsxi:295
			mediator.dispatch('update.car.skins', this);                           // cars_car.jsxi:296
		};
		Car.prototype.updateSkins = function (){                                   // cars_car.jsxi:299
			gui.App.clearCache();                                                  // cars_car.jsxi:300
			setTimeout((function (){                                               // cars_car.jsxi:301
				mediator.dispatch('update.car.skins', this);                       // cars_car.jsxi:302
			}).bind(this),                                                         // cars_car.jsxi:303
			100);
		};
		Car.prototype.updateBadge = function (){                                   // cars_car.jsxi:306
			gui.App.clearCache();                                                  // cars_car.jsxi:307
			setTimeout((function (){                                               // cars_car.jsxi:308
				mediator.dispatch('update.car.badge', this);                       // cars_car.jsxi:309
			}).bind(this),                                                         // cars_car.jsxi:310
			100);
		};
		Car.prototype.updateUpgrade = function (){                                 // cars_car.jsxi:313
			gui.App.clearCache();                                                  // cars_car.jsxi:314
			setTimeout((function (){                                               // cars_car.jsxi:315
				mediator.dispatch('update.car.data', this);                        // cars_car.jsxi:316
			}).bind(this),                                                         // cars_car.jsxi:317
			100);
		};
		Car.prototype.save = function (){                                          // cars_car.jsxi:320
			if (this.data){
				var p = Object.clone(this.data);
				
				p.description = p.description.replace(/\n/g, '<br>');              // cars_car.jsxi:323
				p.class = p.class.toLowerCase();                                   // cars_car.jsxi:324
				
				var d = JSON.stringify(p, null, 
					4);                                                            // cars_car.jsxi:325
				
				try {
					fs.writeFileSync(this.json, d);                                // cars_car.jsxi:328
				} catch (err){                                                     // cars_car.jsxi:329
					ErrorHandler.handled('Cannot save file ' + this.json + '.', err);
					return;
				} 
				
				this.changed = false;
				mediator.dispatch('update.car.changed', this);                     // cars_car.jsxi:335
			}
		};
		Car.prototype.exportDatabase = function (){                                // cars_car.jsxi:339
			var dir = DataStorage.getUserContentDir('Details');
			
			var obj = Object.clone(this.data);
			
			delete obj.version;                                                    // cars_car.jsxi:342
			fs.writeFileSync(dir + '/' + this.id + '.json', JSON.stringify(obj));
		};
		Car.prototype.loadBadge = function (callback){                             // cars_car_load.jsxi:4
			var __that = this;
			
			this.clearErrors('badge');
			
			if (this.__Car__badgeLoaded)
				gui.App.clearCache();                                              // cars_car_load.jsxi:6
			
			fs.exists(this.badge,                                                  // cars_car_load.jsxi:8
				(function (result){                                                // cars_car_load.jsxi:8
					if (!result){                                                  // cars_car_load.jsxi:9
						__that.addError('badge-missing', 'Missing ui/badge.png');
					}
					
					__that.__Car__badgeLoaded = true;
					
					if (callback)                                                  // cars_car_load.jsxi:14
						callback();                                                // cars_car_load.jsxi:14
				}).bind(this));                                                    // cars_car_load.jsxi:15
		};
		Car.prototype.loadSfx = function (__callback){                             // cars_car_load.jsxi:19
			var __that = this, 
				e;
			
			var __block_0 = (function (){
				__that.clearErrors('sfx');
				
				fs.exists(__that.path + ('/sfx/' + __that.id + '.bank'),           // cars_car_load.jsxi:22
					function (__result){
						e = __result;                                              // cars_car_load.jsxi:22
						
						__block_1()
					})
			}).bind(this);
			
			var __block_1 = (function (){
				if (!e){                                                           // cars_car_load.jsxi:23
					__that.addError('sfx-bank-missing', 'Missing sfx/' + __that.id + '.bank');
					return __callback();
				}
				
				Sfx.getSfxOriginal(__that.id,                                      // cars_car_load.jsxi:28
					__that.path, 
					function (__result){
						__that.originalSfx = __result;
						
						__block_2()
					})
			}).bind(this);
			
			var __block_2 = (function (){
				__that.__Car__sfxLoaded = true;
				mediator.dispatch('update.car.sfx:original', this);                // cars_car_load.jsxi:31
				
				if (__callback)
					__callback();
			}).bind(this);
			
			__block_0();
		};
		Car.prototype.loadSkins_stuff = function (callback){                       // cars_car_load.jsxi:34
			var __that = this, 
				a = this.skins, i = 0;
			
			step();                                                                // cars_car_load.jsxi:36
			
			function step(){                                                       // cars_car_load.jsxi:38
				if (a != __that.skins){                                            // cars_car_load.jsxi:39
					if (callback)                                                  // cars_car_load.jsxi:40
						callback();                                                // cars_car_load.jsxi:40
				} else if (i >= a.length){                                         // cars_car_load.jsxi:41
					if (callback)                                                  // cars_car_load.jsxi:42
						callback();                                                // cars_car_load.jsxi:42
					
					mediator.dispatch('update.car.skins:data', this);              // cars_car_load.jsxi:43
				} else {
					a[i ++].load(step);                                            // cars_car_load.jsxi:45
				}
			}
		};
		Car.prototype.loadSkins = function (callback){                             // cars_car_load.jsxi:50
			var __that = this;
			
			if (this.skins){
				this.skins = null;
				mediator.dispatch('update.car.skins', this);                       // cars_car_load.jsxi:53
				gui.App.clearCache();                                              // cars_car_load.jsxi:54
			}
			
			this.clearErrors('skin');
			this.clearErrors('skins');
			
			if (!fs.existsSync(this.skinsDir)){                                    // cars_car_load.jsxi:60
				this.addError('skins-missing', 'Skins folder is missing');
				
				if (callback)                                                      // cars_car_load.jsxi:62
					callback();                                                    // cars_car_load.jsxi:62
				return;
			}
			
			if (!fs.statSync(this.skinsDir).isDirectory()){                        // cars_car_load.jsxi:66
				this.addError('skins-file', 'There is a file instead of skins folder', err);
				
				if (callback)                                                      // cars_car_load.jsxi:68
					callback();                                                    // cars_car_load.jsxi:68
				return;
			}
			
			fs.readdir(this.skinsDir,                                              // cars_car_load.jsxi:72
				(function (err, result){                                           // cars_car_load.jsxi:72
					__that.skins = false;
					
					if (err){                                                      // cars_car_load.jsxi:75
						__that.addError('skins-access', 'Cannot access skins', err);
					} else {
						result = result.filter(function (e){                       // cars_car_load.jsxi:78
							return fs.statSync(__that.path + '/skins/' + e).isDirectory();
						});
						
						if (__that.skins.length === 0){                            // cars_car_load.jsxi:82
							__that.addError('skins-empty', 'Skins folder is empty');
						} else {
							__that.skins = result.map((function (e){               // cars_car_load.jsxi:85
								return new CarSkin(this, e);                       // cars_car_load.jsxi:86
							}).bind(this));                                        // cars_car_load.jsxi:87
							
							var index = 0;
							
							if (__that.selectedSkin){
								for (var i = 0; i < __that.skins.length; i ++){    // cars_car_load.jsxi:91
									var s = __that.skins[i];
									
									if (s.id === __that.selectedSkin.id){          // cars_car_load.jsxi:92
										index = i;                                 // cars_car_load.jsxi:93
										
										break;
									}
								}
							}
							
							__that.selectedSkin = __that.skins[index];             // cars_car_load.jsxi:99
							mediator.dispatch('update.car.skins', this);           // cars_car_load.jsxi:100
							__that.loadSkins_stuff(callback);
							return;
						}
					}
					
					if (callback)                                                  // cars_car_load.jsxi:106
						callback();                                                // cars_car_load.jsxi:106
				}).bind(this));                                                    // cars_car_load.jsxi:107
		};
		Car.prototype.loadData = function (callback){                              // cars_car_load.jsxi:110
			var __that = this;
			
			if (this.data){
				this.data = null;
				mediator.dispatch('update.car.data', this);                        // cars_car_load.jsxi:113
			}
			
			if (this.parent){
				this.parent.children.splice(this.parent.children.indexOf(this), 1);
				mediator.dispatch('update.car.children', this.parent);             // cars_car_load.jsxi:118
				this.parent = null;
				mediator.dispatch('update.car.parent', this);                      // cars_car_load.jsxi:120
			}
			
			this.clearErrors('data');
			this.clearErrors('parent');
			
			if (!fs.existsSync(this.json)){                                        // cars_car_load.jsxi:126
				if (fs.existsSync(this.json + '.disabled')){                       // cars_car_load.jsxi:127
					fs.renameSync(this.json + '.disabled', this.json);             // cars_car_load.jsxi:128
				} else {
					if (this.changed){
						this.changed = false;
						mediator.dispatch('update.car.changed', this);             // cars_car_load.jsxi:132
					}
					
					this.data = false;
					this.addError('data-missing', 'Missing ui_car.json');
					mediator.dispatch('update.car.data', this);                    // cars_car_load.jsxi:137
					
					if (callback)                                                  // cars_car_load.jsxi:138
						callback();                                                // cars_car_load.jsxi:138
					return;
				}
			}
			
			fs.readFile(this.json,                                                 // cars_car_load.jsxi:143
				(function (err, result){                                           // cars_car_load.jsxi:143
					if (__that.changed){
						__that.changed = false;
						mediator.dispatch('update.car.changed', this);             // cars_car_load.jsxi:146
					}
					
					if (err){                                                      // cars_car_load.jsxi:149
						__that.data = false;
						__that.addError('data-access', 'Unavailable ui_car.json', err);
					} else {
						var dat = parseLoadedData(result.toString()),              // cars_car_load.jsxi:153
							err = dat instanceof Error && dat;                     // cars_car_load.jsxi:154
						
						__that.data = false;
						
						if (err || !dat){                                          // cars_car_load.jsxi:157
							__that.addError('data-damaged', 'Damaged ui_car.json', err);
						} else if (!dat.name){                                     // cars_car_load.jsxi:159
							__that.addError('data-name-missing', 'Name is missing');
						} else if (!dat.brand){                                    // cars_car_load.jsxi:161
							__that.addError('data-brand-missing', 'Brand is missing');
						} else {
							__that.data = dat;                                     // cars_car_load.jsxi:164
							
							if (!__that.data.description)                          // cars_car_load.jsxi:165
								__that.data.description = '';                      // cars_car_load.jsxi:165
							
							if (!__that.data.tags)                                 // cars_car_load.jsxi:166
								__that.data.tags = [];                             // cars_car_load.jsxi:166
							
							if (!__that.data.specs)                                // cars_car_load.jsxi:167
								__that.data.specs = {};                            // cars_car_load.jsxi:167
							
							__that.data.name = __that.data.name.trim();            // cars_car_load.jsxi:169
							__that.data.brand = __that.data.brand.trim();          // cars_car_load.jsxi:170
							__that.data.class = (__that.data.class || '').trim();
							__that.data.description = __that.data.description.replace(/\n/g, ' ').replace(/<\/?br\/?>[ \t]*|\n[ \t]+/g, '\n').replace(/<\s*\/?\s*\w+\s*>/g, '').replace(/[\t ]+/g, ' ').decodeHtmlEntities();
							
							if (__that.data.year == null && Years.nameContains(__that.data.name)){
								__that.data.year = Years.fromName(__that.data.name);
							}
							
							if (__that.data.year == null){                         // cars_car_load.jsxi:180
								__that.data.year = Years.fromDatabase(__that.id);
							}
							
							if (__that.data.year != null && Settings.get('yearAutoupdate') && !Years.nameContains(__that.data.name)){
								__that.data.name = Years.addToName(__that.data.name, __that.data.year);
								__that.changed = true;
								mediator.dispatch('update.car.changed', this);     // cars_car_load.jsxi:187
							}
							
							if (__that.data.country == null){                      // cars_car_load.jsxi:190
								{
									var __e = __that.data.tags;
									
									for (var __d = 0; __d < __e.length; __d ++){
										var tag = __e[__d];
										
										__that.data.country = Countries.fromTag(tag);
										
										if (__that.data.country != null)           // cars_car_load.jsxi:193
											break;
									}
									
									__e = undefined;
								}
								
								if (__that.data.country == null){                  // cars_car_load.jsxi:196
									__that.data.country = Countries.fromDatabase(__that.id);
								}
								
								if (__that.data.country == null){                  // cars_car_load.jsxi:200
									__that.data.country = Countries.fromBrand(__that.data.brand);
								}
							}
							
							if (__that.data.author == null){                       // cars_car_load.jsxi:205
								__that.data.author = Authors.fromId(__that.id);    // cars_car_load.jsxi:206
								
								if (__that.data.author == null){                   // cars_car_load.jsxi:208
									__that.data.author = Authors.fromDatabase(__that.id);
								}
							}
							
							if (__that.data.url == null){                          // cars_car_load.jsxi:213
								__that.data.url = Urls.fromDatabase(__that.id);    // cars_car_load.jsxi:214
							}
							
							if (__that.data.parent != null){                       // cars_car_load.jsxi:217
								if (__that.data.parent == __that.id){              // cars_car_load.jsxi:218
									__that.addError('parent-wrong', 'Car cannot be parent to itself');
								} else {
									var par = Cars.byName(__that.data.parent);
									
									if (par == null){                              // cars_car_load.jsxi:222
										__that.addError('parent-missing', 'Parent is missing');
									} else if (par.parent){                        // cars_car_load.jsxi:224
										__that.addError('parent-wrong', 'Parent is child');
									} else {
										__that.parent = par;                       // cars_car_load.jsxi:228
										__that.parent.children.push(this);         // cars_car_load.jsxi:229
										mediator.dispatch('update.car.parent', this);
										mediator.dispatch('update.car.children', __that.parent);
									}
									
									if (!fs.existsSync(__that.upgrade)){           // cars_car_load.jsxi:235
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
					
					mediator.dispatch('update.car.data', this);                    // cars_car_load.jsxi:249
					
					if (callback)                                                  // cars_car_load.jsxi:250
						callback();                                                // cars_car_load.jsxi:250
				}).bind(this));                                                    // cars_car_load.jsxi:251
		};
		Car.prototype.load = function (__callback){                                // cars_car_load.jsxi:254
			var __that = this, 
				__block_0 = (function (){
					__that.clearErrors();
					
					__that.loadBadge(__block_1)
				}).bind(this);
			
			var __block_1 = (function (){
				__that.loadSfx(__block_2)
			}).bind(this);
			
			var __block_2 = (function (){
				__that.loadSkins(__block_3)
			}).bind(this);
			
			var __block_3 = (function (){
				__that.loadData(__block_4)
			}).bind(this);
			
			var __block_4 = (function (){
				if (__callback)
					__callback();
			}).bind(this);
			
			__block_0();
		};
		Car.prototype.reload = function (callback){                                // cars_car_load.jsxi:262
			this.load(callback);
		};
		Car.prototype.loadEnsure = function (callback){                            // cars_car_load.jsxi:269
			var __that = this;
			
			function s1(){                                                         // cars_car_load.jsxi:270
				if (!__that.__Car__badgeLoaded)
					__that.loadBadge(s2);
				else
					s2();                                                          // cars_car_load.jsxi:270
			}
			
			function s2(){                                                         // cars_car_load.jsxi:271
				if (!__that.__Car__sfxLoaded)
					__that.loadSfx(s3);
				else
					s3();                                                          // cars_car_load.jsxi:271
			}
			
			function s3(){                                                         // cars_car_load.jsxi:272
				if (__that.skins == null)
					__that.loadSkins(s4);
				else
					s4();                                                          // cars_car_load.jsxi:272
			}
			
			function s4(){                                                         // cars_car_load.jsxi:273
				if (__that.data == null)
					__that.loadData(callback);
				else if (callback)                                                 // cars_car_load.jsxi:273
					callback();                                                    // cars_car_load.jsxi:273
			}
			
			s1();                                                                  // cars_car_load.jsxi:274
		};
		Car.prototype.testAcd = function (callback){                               // cars_car_load.jsxi:277
			var __that = this;
			
			if (this.data && this.data.author === 'Kunos')                         // cars_car_load.jsxi:278
				return callback();                                                 // cars_car_load.jsxi:278
			
			this.clearErrors('acd');
			AcTools.Utils.DataFixer.TestData(this.path,                            // cars_car_load.jsxi:280
				this.getSpec('weight') || 0, 
				function (arg){                                                    // cars_car_load.jsxi:280
					__that.addError(arg, _messages[arg] || 'Undeclared error: “' + arg + '”');
				}, 
				function (arg){                                                    // cars_car_load.jsxi:282
					if (callback)                                                  // cars_car_load.jsxi:283
						setTimeout(callback);                                      // cars_car_load.jsxi:283
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
		Object.defineProperty(Car.prototype, 
			'originalSfxDisplayName', 
			{
				get: (function (){
					if (!this.originalSfx)
						return '';                                                 // cars_car.jsxi:25
					
					var c = Cars.byId(this.originalSfx);
					return c && c.displayName || this.originalSfx;                 // cars_car.jsxi:27
				})
			});
		
		function clearStr(str){                                                    // cars_car.jsxi:122
			if (typeof str !== 'string')                                           // cars_car.jsxi:123
				return;
			return str.trim().replace(/\s+/g, ' ');                                // cars_car.jsxi:124
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
			if (__callback)
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
				return _list;                                                      // cars.jsxi:33
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'brands', 
		{
			get: (function (){
				return _brands.list;                                               // cars.jsxi:34
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'classes', 
		{
			get: (function (){
				return _classes.list;                                              // cars.jsxi:35
			})
		});
	Object.defineProperty(Cars,                                                    // cars.jsxi:1
		'tags', 
		{
			get: (function (){
				return _tags.list;                                                 // cars.jsxi:36
			})
		});
	(function (){                                                                  // cars.jsxi:253
		mediator.extend(Cars);                                                     // cars.jsxi:254
	})();
	return Cars;
})();

;

;

;

/* Class "DataStorage" declaration */
var DataStorage = (function (){                                                    // data.jsxi:1
	var DataStorage = function (){}, 
		_contentDir,                                                               // data.jsxi:2
		_userContentDir,                                                           // data.jsxi:2
		_downloadsDir;                                                             // data.jsxi:2
	
	DataStorage.getContentDir = function (id){                                     // data.jsxi:4
		return id ? mkdir(_contentDir + '/' + id) : _contentDir;                   // data.jsxi:5
	};
	DataStorage.getUserContentDir = function (id){                                 // data.jsxi:8
		return id ? mkdir(_userContentDir + '/' + id) : _userContentDir;           // data.jsxi:9
	};
	DataStorage.getDownloadsDir = function (id){                                   // data.jsxi:12
		return id ? mkdir(_downloadsDir + '/' + id) : _downloadsDir;               // data.jsxi:13
	};
	DataStorage.getDownloadsTemp = function (id){                                  // data.jsxi:16
		if (id === undefined)                                                      // data.jsxi:16
			id = 'tmp';                                                            // data.jsxi:16
	
		return _downloadsDir + '/' + ('__' + id + '_' + Date.now() + '~tmp');      // data.jsxi:17
	};
	DataStorage.getContentFile = function (id, file){                              // data.jsxi:20
		var userOverride = _userContentDir + '/' + id + '/' + file;
		
		if (fs.existsSync(userOverride))                                           // data.jsxi:22
			return userOverride;                                                   // data.jsxi:22
		
		var contentFile = _contentDir + '/' + id + '/' + file;
		
		if (fs.existsSync(contentFile))                                            // data.jsxi:25
			return contentFile;                                                    // data.jsxi:25
		return null;
	};
	DataStorage.readContentFile = function (id, file){                             // data.jsxi:30
		var filename = DataStorage.getContentFile(id, file);
		return filename ? fs.readFileSync(filename) : null;                        // data.jsxi:32
	};
	DataStorage.readContentJsonFile = function (id, file){                         // data.jsxi:35
		var content = DataStorage.readContentFile(id, file);
		return content ? JSON.parse('' + content) : null;                          // data.jsxi:37
	};
	DataStorage.readContentDir = function (id, extension){                         // data.jsxi:40
		extension = '.' + extension;                                               // data.jsxi:41
		
		var dir = DataStorage.getContentDir(id);
		
		var result = {};
		
		{
			var __g = fs.readdirSync(dir);
			
			for (var __f = 0; __f < __g.length; __f ++){
				var file = __g[__f];
				
				if (file.substr(file.length - extension.length) === extension){    // data.jsxi:47
					result[file.substr(0, file.length - extension.length)] = dir + '/' + file;
				}
			}
			
			__g = undefined;
		}
		
		dir = DataStorage.getUserContentDir(id);                                   // data.jsxi:52
		
		{
			var __i = fs.readdirSync(dir);
			
			for (var __h = 0; __h < __i.length; __h ++){
				var file = __i[__h];
				
				if (file.substr(file.length - extension.length) === extension){    // data.jsxi:54
					result[file.substr(0, file.length - extension.length)] = dir + '/' + file;
				}
			}
			
			__i = undefined;
		}
		return result;                                                             // data.jsxi:59
	};
	
	function mkdir(p){                                                             // data.jsxi:62
		if (!fs.existsSync(p)){                                                    // data.jsxi:63
			fs.mkdirSync(p);                                                       // data.jsxi:64
		}
		return p;                                                                  // data.jsxi:66
	}
	
	DataStorage.isEmpty = function (){                                             // data.jsxi:69
		return fs.readdirSync(_contentDir).length === 0;                           // data.jsxi:70
	};
	(function (){                                                                  // data.jsxi:73
		mkdir(gui.App.dataPath);                                                   // data.jsxi:74
		_contentDir = mkdir(path.join(gui.App.dataPath, 'Data Storage'));          // data.jsxi:75
		_userContentDir = mkdir(path.join(gui.App.dataPath, 'Data Storage (User)'));
		_downloadsDir = mkdir(path.join(gui.App.dataPath, 'Downloads'));           // data.jsxi:77
		
		{
			var __k = fs.readdirSync(_downloadsDir);
			
			for (var __j = 0; __j < __k.length; __j ++){
				var file = __k[__j];
				
				if (/^__.+~tmp$/.test(file)){                                      // data.jsxi:80
					fs.unlinkSync(_downloadsDir + '/' + file);                     // data.jsxi:81
				}
			}
			
			__k = undefined;
		}
	})();
	return DataStorage;
})();

/* Class "Data" declaration */
var Data = (function (){                                                           // data.jsxi:87
	var Data = function (){}, 
		mediator = new Mediator(),                                                 // data.jsxi:88
		_builtInVersion = 34,                                                      // data.jsxi:90
		_scheduled;                                                                // data.jsxi:179
	
	function installBuiltIn(){                                                     // data.jsxi:95
		console.time('installation');                                              // data.jsxi:96
		
		try {
			fs.removeDirSync(DataStorage.getContentDir(), false);                  // data.jsxi:98
			fs.copyDirRecursiveSync('content', DataStorage.getContentDir());       // data.jsxi:99
		} catch (err){                                                             // data.jsxi:100
			throw new Error('Installation failed', err);                           // data.jsxi:101
		} finally {
			console.timeEnd('installation');                                       // data.jsxi:103
		}
	}
	
	function installUpdate(data){                                                  // data.jsxi:107
		mediator.dispatch('install:start');                                        // data.jsxi:108
		
		var tmpFile = DataStorage.getDownloadsTemp();
		
		Downloader.download(data.url,                                              // data.jsxi:111
			tmpFile,                                                               // data.jsxi:111
			function (arg){                                                        // data.jsxi:111
				if (arg){                                                          // data.jsxi:112
					mediator.dispatch('install:failed', arg);                      // data.jsxi:113
				} else
					try {
						var d = DataStorage.getContentDir();
						
						fs.removeDirSync(d, false);                                // data.jsxi:116
						AcTools.Utils.FileUtils.Unzip(tmpFile, d);                 // data.jsxi:117
						Data.__Data__currentVersion = data.version;                // data.jsxi:119
						mediator.dispatch('install:ready');                        // data.jsxi:120
						mediator.dispatch('update');                               // data.jsxi:121
						Notification.info('Database Updated', 'New version: ' + data.version);
					} catch (err){                                                 // data.jsxi:124
						Notification.warn('Database Update Failed', ('' + err).split('\n')[0]);
					} 
				
				Data.scheduleCheckUpdate();
			});
	}
	
	function init(){                                                               // data.jsxi:132
		if (Data.__Data__currentVersion < _builtInVersion || DataStorage.isEmpty()){
			mediator.dispatch('install:start');                                    // data.jsxi:134
			setTimeout(function (){                                                // data.jsxi:136
				installBuiltIn();                                                  // data.jsxi:137
				Data.__Data__currentVersion = _builtInVersion;                     // data.jsxi:138
				mediator.dispatch('install:ready');                                // data.jsxi:139
				mediator.dispatch('update');                                       // data.jsxi:140
				Data.checkUpdate();
			}, 
			100);
		} else {
			mediator.dispatch('update');                                           // data.jsxi:144
			Data.checkUpdate();
		}
	}
	
	Data.checkUpdate = function (){                                                // data.jsxi:149
		clearTimeout(_scheduled);                                                  // data.jsxi:150
		
		if (!Settings.get('updateDatabase')){                                      // data.jsxi:152
			Data.scheduleCheckUpdate();
			return;
		}
		
		mediator.dispatch('check:start');                                          // data.jsxi:157
		AppServerRequest.checkContentUpdate(Data.__Data__currentVersion,           // data.jsxi:159
			function (err, data){                                                  // data.jsxi:159
				if (err){                                                          // data.jsxi:160
					console.warn(err);                                             // data.jsxi:161
					mediator.dispatch('check:failed');                             // data.jsxi:162
					Data.scheduleCheckUpdate();
					return;
				}
				
				if (data){                                                         // data.jsxi:167
					Notification.info('Database Update Is Available', 'Downloading in process...');
					installUpdate(data);                                           // data.jsxi:170
					mediator.dispatch('check:done:found');                         // data.jsxi:171
				} else {
					mediator.dispatch('check:done');                               // data.jsxi:173
					Data.scheduleCheckUpdate();
				}
			});
	};
	Data.scheduleCheckUpdate = function (){                                        // data.jsxi:180
		clearTimeout(_scheduled);                                                  // data.jsxi:181
		_scheduled = setTimeout(Data.checkUpdate, 2.5 * 3.6e6);                    // data.jsxi:182
	};
	Object.defineProperty(Data,                                                    // data.jsxi:87
		'__Data__currentVersion', 
		{
			get: (function (){
				return + (localStorage.installedDataVersion || - 1);               // data.jsxi:92
			}), 
			set: (function (arg){
				return localStorage.installedDataVersion = arg;                    // data.jsxi:93
			})
		});
	(function (){                                                                  // data.jsxi:185
		$(init);                                                                   // data.jsxi:186
		mediator.extend(Data);                                                     // data.jsxi:187
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
var Authors = (function (){                                                        // data_authors.jsxi:1
	var Authors = function (){}, 
		_initialized = false, _database;
	
	Authors.fromId = function (id){                                                // data_authors.jsxi:2
		return Sfx.isCarOriginal(id) ? 'Kunos' : null;                             // data_authors.jsxi:3
	};
	Authors.fromDatabase = function (id){                                          // data_authors.jsxi:9
		if (!_initialized){                                                        // data_authors.jsxi:10
			Authors.init();
		}
		
		if (_database && _database.hasOwnProperty(id)){                            // data_authors.jsxi:14
			return _database[id];                                                  // data_authors.jsxi:15
		} else {
			return null;
		}
	};
	Authors.init = function (){                                                    // data_authors.jsxi:21
		_database = DataStorage.readContentJsonFile('Details (Preload)', 'authors.json');
	};
	return Authors;
})();

/* Class "Brands" declaration */
var Brands = (function (){                                                         // data_brands.jsxi:1
	var Brands = function (){}, 
		_list = [],                                                                // data_brands.jsxi:11
		_listLower = [],                                                           // data_brands.jsxi:11
		_badges,                                                                   // data_brands.jsxi:12
		_sorted = true;                                                            // data_brands.jsxi:13
	
	Brands.add = function (brand){                                                 // data_brands.jsxi:20
		var lower = brand.toLowerCase();
		
		if (_listLower.indexOf(lower) === - 1){                                    // data_brands.jsxi:22
			_list.push(brand);                                                     // data_brands.jsxi:23
			_list.sort();                                                          // data_brands.jsxi:24
			_listLower.push(lower);                                                // data_brands.jsxi:26
			_sorted = false;                                                       // data_brands.jsxi:27
		}
	};
	Brands.init = function (){                                                     // data_brands.jsxi:31
		_badges = DataStorage.readContentDir('Badges', 'png');                     // data_brands.jsxi:32
	};
	Brands.getBadge = function (brand){                                            // data_brands.jsxi:35
		return _badges.hasOwnProperty(brand) ? _badges[brand] : null;              // data_brands.jsxi:36
	};
	Brands.nameContains = function (name, brand){                                  // data_brands.jsxi:39
		return brand == null ? _list.some(function (arg){                          // data_brands.jsxi:40
			return name.indexOf(Brands.toNamePartNc(arg) + ' ') === 0;             // data_brands.jsxi:40
		}) : name.indexOf(Brands.toNamePartNc(brand) + ' ') === 0;                 // data_brands.jsxi:41
	};
	Brands.fromName = function (name){                                             // data_brands.jsxi:44
		for (var __l = 0; __l < _list.length; __l ++){                             // data_brands.jsxi:45
			var b = _list[__l];
			
			if (name.indexOf(Brands.toNamePart(b) + ' ') === 0){                   // data_brands.jsxi:46
				return b;                                                          // data_brands.jsxi:47
			}
		}
		return null;
	};
	Brands.fromNamePart = function (brand){                                        // data_brands.jsxi:54
		switch (brand){                                                            // data_brands.jsxi:55
			case 'Mercedes':                                                       // data_brands.jsxi:56
				return 'Mercedes-Benz';                                            // data_brands.jsxi:57
			case 'VW':                                                             // data_brands.jsxi:59
				return 'Volkswagen';                                               // data_brands.jsxi:60
			default:
				return brand;                                                      // data_brands.jsxi:63
		}
	};
	Brands.toNamePart = function (brand){                                          // data_brands.jsxi:67
		switch (brand){                                                            // data_brands.jsxi:68
			case 'Mercedes-Benz':                                                  // data_brands.jsxi:69
				return 'Mercedes';                                                 // data_brands.jsxi:70
			default:
				return brand;                                                      // data_brands.jsxi:73
		}
	};
	Brands.toNamePartNc = function (brand){                                        // data_brands.jsxi:77
		switch (brand){                                                            // data_brands.jsxi:78
			case 'VW':                                                             // data_brands.jsxi:79
				return 'Volkswagen';                                               // data_brands.jsxi:80
			default:
				return Brands.toNamePart(brand);
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
	(function (){                                                                  // data_brands.jsxi:15
		Data.on('update', Brands.init);                                            // data_brands.jsxi:16
	})();
	return Brands;
})();

/* Class "Countries" declaration */
var Countries = (function (){                                                      // data_countries.jsxi:1
	var Countries = function (){}, 
		_initialized = false,                                                      // data_countries.jsxi:347
		_database;                                                                 // data_countries.jsxi:348
	
	Countries.fromBrand = function (brand){                                        // data_countries.jsxi:2
		switch (brand = brand.trim().toLowerCase()){                               // data_countries.jsxi:3
			case 'abarth':                                                         // data_countries.jsxi:4
				return 'Italy';                                                    // data_countries.jsxi:4
			case 'alfa':                                                           // data_countries.jsxi:5
				return 'Italy';                                                    // data_countries.jsxi:5
			case 'alfa romeo':                                                     // data_countries.jsxi:6
				return 'Italy';                                                    // data_countries.jsxi:6
			case 'alpine':                                                         // data_countries.jsxi:7
				return 'France';                                                   // data_countries.jsxi:7
			case 'amc':                                                            // data_countries.jsxi:8
				return 'USA';                                                      // data_countries.jsxi:8
			case 'aston':                                                          // data_countries.jsxi:9
				return 'Great Britain';                                            // data_countries.jsxi:9
			case 'aston martin':                                                   // data_countries.jsxi:10
				return 'Great Britain';                                            // data_countries.jsxi:10
			case 'audi':                                                           // data_countries.jsxi:11
				return 'Germany';                                                  // data_countries.jsxi:11
			case 'bentley':                                                        // data_countries.jsxi:12
				return 'Great Britain';                                            // data_countries.jsxi:12
			case 'bmw':                                                            // data_countries.jsxi:13
				return 'Germany';                                                  // data_countries.jsxi:13
			case 'bugatti':                                                        // data_countries.jsxi:14
				return 'France';                                                   // data_countries.jsxi:14
			case 'buick':                                                          // data_countries.jsxi:15
				return 'USA';                                                      // data_countries.jsxi:15
			case 'cadillac':                                                       // data_countries.jsxi:16
				return 'USA';                                                      // data_countries.jsxi:16
			case 'chevrolet':                                                      // data_countries.jsxi:17
				return 'USA';                                                      // data_countries.jsxi:17
			case 'datsun':                                                         // data_countries.jsxi:18
				return 'Japan';                                                    // data_countries.jsxi:18
			case 'dodge':                                                          // data_countries.jsxi:19
				return 'USA';                                                      // data_countries.jsxi:19
			case 'ferrari':                                                        // data_countries.jsxi:20
				return 'Italy';                                                    // data_countries.jsxi:20
			case 'fiat':                                                           // data_countries.jsxi:21
				return 'Italy';                                                    // data_countries.jsxi:21
			case 'ford':                                                           // data_countries.jsxi:22
				return 'USA';                                                      // data_countries.jsxi:22
			case 'gemballa':                                                       // data_countries.jsxi:23
				return 'Germany';                                                  // data_countries.jsxi:23
			case 'ginetta':                                                        // data_countries.jsxi:24
				return 'Great Britain';                                            // data_countries.jsxi:24
			case 'gmc':                                                            // data_countries.jsxi:25
				return 'USA';                                                      // data_countries.jsxi:25
			case 'gumpert':                                                        // data_countries.jsxi:26
				return 'Germany';                                                  // data_countries.jsxi:26
			case 'hamann':                                                         // data_countries.jsxi:27
				return 'Germany';                                                  // data_countries.jsxi:27
			case 'holden':                                                         // data_countries.jsxi:28
				return 'Australia';                                                // data_countries.jsxi:28
			case 'honda':                                                          // data_countries.jsxi:29
				return 'Japan';                                                    // data_countries.jsxi:29
			case 'hyundai':                                                        // data_countries.jsxi:30
				return 'Korea';                                                    // data_countries.jsxi:30
			case 'infiniti':                                                       // data_countries.jsxi:31
				return 'Japan';                                                    // data_countries.jsxi:31
			case 'jaguar':                                                         // data_countries.jsxi:32
				return 'Great Britain';                                            // data_countries.jsxi:32
			case 'kia':                                                            // data_countries.jsxi:33
				return 'Korea';                                                    // data_countries.jsxi:33
			case 'koenigsegg':                                                     // data_countries.jsxi:34
				return 'Sweden';                                                   // data_countries.jsxi:34
			case 'ktm':                                                            // data_countries.jsxi:35
				return 'Austria';                                                  // data_countries.jsxi:35
			case 'lada':                                                           // data_countries.jsxi:36
				return 'Russia';                                                   // data_countries.jsxi:36
			case 'lamborghini':                                                    // data_countries.jsxi:37
				return 'Italy';                                                    // data_countries.jsxi:37
			case 'lancia':                                                         // data_countries.jsxi:38
				return 'Italy';                                                    // data_countries.jsxi:38
			case 'lexus':                                                          // data_countries.jsxi:39
				return 'Japan';                                                    // data_countries.jsxi:39
			case 'lotus':                                                          // data_countries.jsxi:40
				return 'Great Britain';                                            // data_countries.jsxi:40
			case 'maserati':                                                       // data_countries.jsxi:41
				return 'Italy';                                                    // data_countries.jsxi:41
			case 'mazda':                                                          // data_countries.jsxi:42
				return 'Japan';                                                    // data_countries.jsxi:42
			case 'mclaren':                                                        // data_countries.jsxi:43
				return 'Great Britain';                                            // data_countries.jsxi:43
			case 'mercedes':                                                       // data_countries.jsxi:44
				return 'Germany';                                                  // data_countries.jsxi:44
			case 'mercedes-benz':                                                  // data_countries.jsxi:45
				return 'Germany';                                                  // data_countries.jsxi:45
			case 'mg':                                                             // data_countries.jsxi:46
				return 'Great Britain';                                            // data_countries.jsxi:46
			case 'mini':                                                           // data_countries.jsxi:47
				return 'Great Britain';                                            // data_countries.jsxi:47
			case 'mitsubishi':                                                     // data_countries.jsxi:48
				return 'Japan';                                                    // data_countries.jsxi:48
			case 'nissan':                                                         // data_countries.jsxi:49
				return 'Japan';                                                    // data_countries.jsxi:49
			case 'noble':                                                          // data_countries.jsxi:50
				return 'Great Britain';                                            // data_countries.jsxi:50
			case 'opel':                                                           // data_countries.jsxi:51
				return 'Germany';                                                  // data_countries.jsxi:51
			case 'oreca':                                                          // data_countries.jsxi:52
				return 'France';                                                   // data_countries.jsxi:52
			case 'pagani':                                                         // data_countries.jsxi:53
				return 'Italy';                                                    // data_countries.jsxi:53
			case 'detomaso':                                                       // data_countries.jsxi:54
				return 'Italy';                                                    // data_countries.jsxi:54
			case 'de tomaso':                                                      // data_countries.jsxi:55
				return 'Italy';                                                    // data_countries.jsxi:55
			case 'plymouth':                                                       // data_countries.jsxi:56
				return 'USA';                                                      // data_countries.jsxi:56
			case 'pontiac':                                                        // data_countries.jsxi:57
				return 'USA';                                                      // data_countries.jsxi:57
			case 'porsche':                                                        // data_countries.jsxi:58
				return 'Germany';                                                  // data_countries.jsxi:58
			case 'radical':                                                        // data_countries.jsxi:59
				return 'Great Britain';                                            // data_countries.jsxi:59
			case 'reliant':                                                        // data_countries.jsxi:60
				return 'Great Britain';                                            // data_countries.jsxi:60
			case 'renault':                                                        // data_countries.jsxi:61
				return 'France';                                                   // data_countries.jsxi:61
			case 'rover':                                                          // data_countries.jsxi:62
				return 'Great Britain';                                            // data_countries.jsxi:62
			case 'ruf':                                                            // data_countries.jsxi:63
				return 'Germany';                                                  // data_countries.jsxi:63
			case 'saleen':                                                         // data_countries.jsxi:64
				return 'USA';                                                      // data_countries.jsxi:64
			case 'sareni':                                                         // data_countries.jsxi:65
				return 'USA';                                                      // data_countries.jsxi:65
			case 'scuderia glickenhaus':                                           // data_countries.jsxi:66
				return 'Italy';                                                    // data_countries.jsxi:66
			case 'seat':                                                           // data_countries.jsxi:67
				return 'Spain';                                                    // data_countries.jsxi:67
			case 'shelby':                                                         // data_countries.jsxi:68
				return 'USA';                                                      // data_countries.jsxi:68
			case 'subaru':                                                         // data_countries.jsxi:69
				return 'Japan';                                                    // data_countries.jsxi:69
			case 'suzuki':                                                         // data_countries.jsxi:70
				return 'Japan';                                                    // data_countries.jsxi:70
			case 'tatuus':                                                         // data_countries.jsxi:71
				return 'Italy';                                                    // data_countries.jsxi:71
			case 'tesla':                                                          // data_countries.jsxi:72
				return 'USA';                                                      // data_countries.jsxi:72
			case 'toyota':                                                         // data_countries.jsxi:73
				return 'Japan';                                                    // data_countries.jsxi:73
			case 'volkswagen':                                                     // data_countries.jsxi:74
				return 'Germany';                                                  // data_countries.jsxi:74
			case 'volvo':                                                          // data_countries.jsxi:75
				return 'Sweden';                                                   // data_countries.jsxi:75
			default:
				return null;
		}
	};
	Countries.fromTag = function (tag){                                            // data_countries.jsxi:80
		switch (tag = tag.trim().toLowerCase()){                                   // data_countries.jsxi:81
			case 'afghanistan':                                                    // data_countries.jsxi:82
				
			case 'albania':                                                        // data_countries.jsxi:83
				
			case 'algeria':                                                        // data_countries.jsxi:84
				
			case 'andorra':                                                        // data_countries.jsxi:85
				
			case 'angola':                                                         // data_countries.jsxi:86
				
			case 'argentina':                                                      // data_countries.jsxi:87
				
			case 'armenia':                                                        // data_countries.jsxi:88
				
			case 'aruba':                                                          // data_countries.jsxi:89
				
			case 'australia':                                                      // data_countries.jsxi:90
				
			case 'austria':                                                        // data_countries.jsxi:91
				
			case 'azerbaijan':                                                     // data_countries.jsxi:92
				
			case 'bahamas':                                                        // data_countries.jsxi:93
				
			case 'bahrain':                                                        // data_countries.jsxi:94
				
			case 'bangladesh':                                                     // data_countries.jsxi:95
				
			case 'barbados':                                                       // data_countries.jsxi:96
				
			case 'belarus':                                                        // data_countries.jsxi:97
				
			case 'belgium':                                                        // data_countries.jsxi:98
				
			case 'belize':                                                         // data_countries.jsxi:99
				
			case 'benin':                                                          // data_countries.jsxi:100
				
			case 'bhutan':                                                         // data_countries.jsxi:101
				
			case 'bolivia':                                                        // data_countries.jsxi:102
				
			case 'botswana':                                                       // data_countries.jsxi:103
				
			case 'brazil':                                                         // data_countries.jsxi:104
				
			case 'brunei':                                                         // data_countries.jsxi:105
				
			case 'bulgaria':                                                       // data_countries.jsxi:106
				
			case 'burma':                                                          // data_countries.jsxi:107
				
			case 'burundi':                                                        // data_countries.jsxi:108
				
			case 'cambodia':                                                       // data_countries.jsxi:109
				
			case 'cameroon':                                                       // data_countries.jsxi:110
				
			case 'canada':                                                         // data_countries.jsxi:111
				
			case 'chad':                                                           // data_countries.jsxi:112
				
			case 'chile':                                                          // data_countries.jsxi:113
				
			case 'china':                                                          // data_countries.jsxi:114
				
			case 'colombia':                                                       // data_countries.jsxi:115
				
			case 'comoros':                                                        // data_countries.jsxi:116
				
			case 'congo':                                                          // data_countries.jsxi:117
				
			case 'croatia':                                                        // data_countries.jsxi:118
				
			case 'cuba':                                                           // data_countries.jsxi:119
				
			case 'curacao':                                                        // data_countries.jsxi:120
				
			case 'cyprus':                                                         // data_countries.jsxi:121
				
			case 'denmark':                                                        // data_countries.jsxi:122
				
			case 'djibouti':                                                       // data_countries.jsxi:123
				
			case 'dominica':                                                       // data_countries.jsxi:124
				
			case 'ecuador':                                                        // data_countries.jsxi:125
				
			case 'egypt':                                                          // data_countries.jsxi:126
				
			case 'eritrea':                                                        // data_countries.jsxi:127
				
			case 'estonia':                                                        // data_countries.jsxi:128
				
			case 'ethiopia':                                                       // data_countries.jsxi:129
				
			case 'fiji':                                                           // data_countries.jsxi:130
				
			case 'finland':                                                        // data_countries.jsxi:131
				
			case 'france':                                                         // data_countries.jsxi:132
				
			case 'gabon':                                                          // data_countries.jsxi:133
				
			case 'gambia':                                                         // data_countries.jsxi:134
				
			case 'georgia':                                                        // data_countries.jsxi:135
				
			case 'germany':                                                        // data_countries.jsxi:136
				
			case 'ghana':                                                          // data_countries.jsxi:137
				
			case 'greece':                                                         // data_countries.jsxi:138
				
			case 'grenada':                                                        // data_countries.jsxi:139
				
			case 'guatemala':                                                      // data_countries.jsxi:140
				
			case 'guinea':                                                         // data_countries.jsxi:141
				
			case 'guinea-bissau':                                                  // data_countries.jsxi:142
				
			case 'guyana':                                                         // data_countries.jsxi:143
				
			case 'haiti':                                                          // data_countries.jsxi:144
				
			case 'holy see':                                                       // data_countries.jsxi:145
				
			case 'honduras':                                                       // data_countries.jsxi:146
				
			case 'hong kong':                                                      // data_countries.jsxi:147
				
			case 'hungary':                                                        // data_countries.jsxi:148
				
			case 'iceland':                                                        // data_countries.jsxi:149
				
			case 'india':                                                          // data_countries.jsxi:150
				
			case 'indonesia':                                                      // data_countries.jsxi:151
				
			case 'iran':                                                           // data_countries.jsxi:152
				
			case 'iraq':                                                           // data_countries.jsxi:153
				
			case 'ireland':                                                        // data_countries.jsxi:154
				
			case 'israel':                                                         // data_countries.jsxi:155
				
			case 'italy':                                                          // data_countries.jsxi:156
				
			case 'jamaica':                                                        // data_countries.jsxi:157
				
			case 'japan':                                                          // data_countries.jsxi:158
				
			case 'jordan':                                                         // data_countries.jsxi:159
				
			case 'kazakhstan':                                                     // data_countries.jsxi:160
				
			case 'kenya':                                                          // data_countries.jsxi:161
				
			case 'kiribati':                                                       // data_countries.jsxi:162
				
			case 'kosovo':                                                         // data_countries.jsxi:163
				
			case 'kuwait':                                                         // data_countries.jsxi:164
				
			case 'kyrgyzstan':                                                     // data_countries.jsxi:165
				
			case 'laos':                                                           // data_countries.jsxi:166
				
			case 'latvia':                                                         // data_countries.jsxi:167
				
			case 'lebanon':                                                        // data_countries.jsxi:168
				
			case 'lesotho':                                                        // data_countries.jsxi:169
				
			case 'liberia':                                                        // data_countries.jsxi:170
				
			case 'libya':                                                          // data_countries.jsxi:171
				
			case 'liechtenstein':                                                  // data_countries.jsxi:172
				
			case 'lithuania':                                                      // data_countries.jsxi:173
				
			case 'luxembourg':                                                     // data_countries.jsxi:174
				
			case 'macau':                                                          // data_countries.jsxi:175
				
			case 'macedonia':                                                      // data_countries.jsxi:176
				
			case 'madagascar':                                                     // data_countries.jsxi:177
				
			case 'malawi':                                                         // data_countries.jsxi:178
				
			case 'malaysia':                                                       // data_countries.jsxi:179
				
			case 'maldives':                                                       // data_countries.jsxi:180
				
			case 'mali':                                                           // data_countries.jsxi:181
				
			case 'malta':                                                          // data_countries.jsxi:182
				
			case 'mauritania':                                                     // data_countries.jsxi:183
				
			case 'mauritius':                                                      // data_countries.jsxi:184
				
			case 'mexico':                                                         // data_countries.jsxi:185
				
			case 'micronesia':                                                     // data_countries.jsxi:186
				
			case 'moldova':                                                        // data_countries.jsxi:187
				
			case 'monaco':                                                         // data_countries.jsxi:188
				
			case 'mongolia':                                                       // data_countries.jsxi:189
				
			case 'montenegro':                                                     // data_countries.jsxi:190
				
			case 'morocco':                                                        // data_countries.jsxi:191
				
			case 'mozambique':                                                     // data_countries.jsxi:192
				
			case 'namibia':                                                        // data_countries.jsxi:193
				
			case 'nauru':                                                          // data_countries.jsxi:194
				
			case 'nepal':                                                          // data_countries.jsxi:195
				
			case 'netherlands':                                                    // data_countries.jsxi:196
				
			case 'nicaragua':                                                      // data_countries.jsxi:197
				
			case 'niger':                                                          // data_countries.jsxi:198
				
			case 'nigeria':                                                        // data_countries.jsxi:199
				
			case 'norway':                                                         // data_countries.jsxi:200
				
			case 'oman':                                                           // data_countries.jsxi:201
				
			case 'pakistan':                                                       // data_countries.jsxi:202
				
			case 'palau':                                                          // data_countries.jsxi:203
				
			case 'panama':                                                         // data_countries.jsxi:204
				
			case 'paraguay':                                                       // data_countries.jsxi:205
				
			case 'peru':                                                           // data_countries.jsxi:206
				
			case 'philippines':                                                    // data_countries.jsxi:207
				
			case 'poland':                                                         // data_countries.jsxi:208
				
			case 'portugal':                                                       // data_countries.jsxi:209
				
			case 'qatar':                                                          // data_countries.jsxi:210
				
			case 'romania':                                                        // data_countries.jsxi:211
				
			case 'russia':                                                         // data_countries.jsxi:212
				
			case 'rwanda':                                                         // data_countries.jsxi:213
				
			case 'samoa':                                                          // data_countries.jsxi:214
				
			case 'senegal':                                                        // data_countries.jsxi:215
				
			case 'serbia':                                                         // data_countries.jsxi:216
				
			case 'seychelles':                                                     // data_countries.jsxi:217
				
			case 'singapore':                                                      // data_countries.jsxi:218
				
			case 'slovakia':                                                       // data_countries.jsxi:219
				
			case 'slovenia':                                                       // data_countries.jsxi:220
				
			case 'somalia':                                                        // data_countries.jsxi:221
				
			case 'spain':                                                          // data_countries.jsxi:222
				
			case 'sudan':                                                          // data_countries.jsxi:223
				
			case 'suriname':                                                       // data_countries.jsxi:224
				
			case 'swaziland':                                                      // data_countries.jsxi:225
				
			case 'switzerland':                                                    // data_countries.jsxi:226
				
			case 'syria':                                                          // data_countries.jsxi:227
				
			case 'taiwan':                                                         // data_countries.jsxi:228
				
			case 'tajikistan':                                                     // data_countries.jsxi:229
				
			case 'tanzania':                                                       // data_countries.jsxi:230
				
			case 'thailand':                                                       // data_countries.jsxi:231
				
			case 'timor-leste':                                                    // data_countries.jsxi:232
				
			case 'togo':                                                           // data_countries.jsxi:233
				
			case 'tonga':                                                          // data_countries.jsxi:234
				
			case 'tunisia':                                                        // data_countries.jsxi:235
				
			case 'turkey':                                                         // data_countries.jsxi:236
				
			case 'turkmenistan':                                                   // data_countries.jsxi:237
				
			case 'tuvalu':                                                         // data_countries.jsxi:238
				
			case 'uganda':                                                         // data_countries.jsxi:239
				
			case 'ukraine':                                                        // data_countries.jsxi:240
				
			case 'uruguay':                                                        // data_countries.jsxi:241
				
			case 'uzbekistan':                                                     // data_countries.jsxi:242
				
			case 'vanuatu':                                                        // data_countries.jsxi:243
				
			case 'venezuela':                                                      // data_countries.jsxi:244
				
			case 'vietnam':                                                        // data_countries.jsxi:245
				
			case 'yemen':                                                          // data_countries.jsxi:246
				
			case 'zambia':                                                         // data_countries.jsxi:247
				
			case 'zimbabwe':                                                       // data_countries.jsxi:248
				return tag[0].toUpperCase() + tag.slice(1);                        // data_countries.jsxi:249
			case 'antigua and barbuda':                                            // data_countries.jsxi:251
				
			case 'bosnia and herzegovina':                                         // data_countries.jsxi:252
				
			case 'burkina faso':                                                   // data_countries.jsxi:253
				
			case 'cape verde':                                                     // data_countries.jsxi:254
				
			case 'central african republic':                                       // data_countries.jsxi:255
				
			case 'costa rica':                                                     // data_countries.jsxi:256
				
			case 'el salvador':                                                    // data_countries.jsxi:257
				
			case 'equatorial guinea':                                              // data_countries.jsxi:258
				
			case 'marshall islands':                                               // data_countries.jsxi:259
				
			case 'new zealand':                                                    // data_countries.jsxi:260
				
			case 'san marino':                                                     // data_countries.jsxi:261
				
			case 'saudi arabia':                                                   // data_countries.jsxi:262
				
			case 'sierra leone':                                                   // data_countries.jsxi:263
				
			case 'sint maarten':                                                   // data_countries.jsxi:264
				
			case 'solomon islands':                                                // data_countries.jsxi:265
				
			case 'south africa':                                                   // data_countries.jsxi:266
				
			case 'south sudan':                                                    // data_countries.jsxi:267
				
			case 'sri lanka':                                                      // data_countries.jsxi:268
				
			case 'trinidad and tobago':                                            // data_countries.jsxi:269
				
			case 'united arab emirates':                                           // data_countries.jsxi:270
				return tag.replace(/\b(?!and)\w/g,                                 // data_countries.jsxi:271
					function (arg){                                                // data_countries.jsxi:271
						return arg.toUpperCase();                                  // data_countries.jsxi:271
					});
			case 'cote d\'ivoire':                                                 // data_countries.jsxi:273
				
			case 'côte d\'ivoire':                                                 // data_countries.jsxi:274
				
			case 'cote d’ivoire':                                                  // data_countries.jsxi:275
				
			case 'côte d’ivoire':                                                  // data_countries.jsxi:276
				return 'Côte d’Ivoire';                                            // data_countries.jsxi:277
			case 'czech':                                                          // data_countries.jsxi:279
				
			case 'czech republic':                                                 // data_countries.jsxi:280
				return 'Czech Republic';                                           // data_countries.jsxi:281
			case 'gb':                                                             // data_countries.jsxi:283
				
			case 'uk':                                                             // data_countries.jsxi:284
				
			case 'united kingdom':                                                 // data_countries.jsxi:285
				
			case 'england':                                                        // data_countries.jsxi:286
				
			case 'britain':                                                        // data_countries.jsxi:287
				
			case 'great britain':                                                  // data_countries.jsxi:288
				return 'Great Britain';                                            // data_countries.jsxi:289
			case 'korea':                                                          // data_countries.jsxi:291
				
			case 'korea, south':                                                   // data_countries.jsxi:292
				
			case 'south korea':                                                    // data_countries.jsxi:293
				return 'Korea';                                                    // data_countries.jsxi:294
			case 'sweden':                                                         // data_countries.jsxi:296
				
			case 'swedish':                                                        // data_countries.jsxi:297
				return 'Sweden';                                                   // data_countries.jsxi:298
			case 'us':                                                             // data_countries.jsxi:300
				
			case 'usa':                                                            // data_countries.jsxi:301
				
			case 'america':                                                        // data_countries.jsxi:302
				return 'USA';                                                      // data_countries.jsxi:303
			default:
				return null;
		}
	};
	Countries.fixTag = function (raw){                                             // data_countries.jsxi:310
		var tag = raw.toLowerCase();
		
		switch (tag){                                                              // data_countries.jsxi:313
			case 'gb':                                                             // data_countries.jsxi:314
				
			case 'uk':                                                             // data_countries.jsxi:315
				
			case 'united kingdom':                                                 // data_countries.jsxi:316
				
			case 'england':                                                        // data_countries.jsxi:317
				
			case 'britain':                                                        // data_countries.jsxi:318
				return 'great britain';                                            // data_countries.jsxi:319
			case 'cote d\'ivoire':                                                 // data_countries.jsxi:321
				
			case 'côte d\'ivoire':                                                 // data_countries.jsxi:322
				
			case 'cote d’ivoire':                                                  // data_countries.jsxi:323
				return 'côte d’ivoire';                                            // data_countries.jsxi:324
			case 'czech':                                                          // data_countries.jsxi:326
				
			case 'czech republic':                                                 // data_countries.jsxi:327
				return 'czech republic';                                           // data_countries.jsxi:328
			case 'korea':                                                          // data_countries.jsxi:330
				
			case 'korea, south':                                                   // data_countries.jsxi:331
				
			case 'south korea':                                                    // data_countries.jsxi:332
				return 'korea';                                                    // data_countries.jsxi:333
			case 'swedish':                                                        // data_countries.jsxi:335
				return 'sweden';                                                   // data_countries.jsxi:336
			case 'us':                                                             // data_countries.jsxi:338
				
			case 'america':                                                        // data_countries.jsxi:339
				return 'usa';                                                      // data_countries.jsxi:340
			default:
				return raw;                                                        // data_countries.jsxi:343
		}
	};
	Countries.fromDatabase = function (id){                                        // data_countries.jsxi:350
		if (!_initialized){                                                        // data_countries.jsxi:351
			Countries.init();
		}
		
		if (_database && _database.hasOwnProperty(id)){                            // data_countries.jsxi:355
			return _database[id];                                                  // data_countries.jsxi:356
		} else {
			return null;
		}
	};
	Countries.init = function (){                                                  // data_countries.jsxi:362
		_database = DataStorage.readContentJsonFile('Details (Preload)', 'countries.json');
	};
	return Countries;
})();

/* Class "Sfx" declaration */
var Sfx = (function (){                                                            // data_sfx.jsxi:1
	var Sfx = function (){}, 
		_origIds, _origGuids;
	
	Sfx.isCarOriginal = function (id){                                             // data_sfx.jsxi:4
		if (!_origIds)                                                             // data_sfx.jsxi:5
			Sfx.init();
		return _origIds.hasOwnProperty(id);                                        // data_sfx.jsxi:6
	};
	Sfx.getSfxOriginal_inner = function (id, guids){                               // data_sfx.jsxi:9
		{
			var __n = guids.split(/\n/);
			
			for (var __m = 0; __m < __n.length; __m ++){
				var l = __n[__m];
				
				var m = l.match(/^\{(\w{8}(?:-\w{4}){3}-\w{12})\}\s+event:\/cars\/(\w+)\/e/);
				
				if (m && m[2] === id && _origGuids[m[1]]){                         // data_sfx.jsxi:12
					return _origGuids[m[1]];                                       // data_sfx.jsxi:13
				}
			}
			
			__n = undefined;
		}
	};
	Sfx.getSfxOriginal = function (id, path, __callback){                          // data_sfx.jsxi:18
		var g;
		
		var __block_0 = (function (){
			if (Sfx.isCarOriginal(id))
				return __callback(null);
			
			fs.readFile(path + '/sfx/GUIDs.txt',                                   // data_sfx.jsxi:21
				function (__err, 
					__result){
					g = __result;                                                  // data_sfx.jsxi:21
					
					__block_1()
				})
		}).bind(this);
		
		var __block_1 = (function (){
			if (!g)                                                                // data_sfx.jsxi:22
				return __callback(null);
			return __callback(Sfx.getSfxOriginal_inner(id, g.toString()));
			
			if (__callback)
				__callback();
		}).bind(this);
		
		__block_0();
	};
	Sfx.init = function (){                                                        // data_sfx.jsxi:27
		_origIds = {};                                                             // data_sfx.jsxi:28
		_origGuids = {};                                                           // data_sfx.jsxi:29
		
		var file = AcDir.root + '/content/sfx/GUIDs.txt';
		
		if (fs.existsSync(file)){                                                  // data_sfx.jsxi:32
			{
				var __p = fs.readFileSync(file).toString().split(/\n/);
				
				for (var __o = 0; __o < __p.length; __o ++){
					var l = __p[__o];
					
					var m = l.match(/^\{(\w{8}(?:-\w{4}){3}-\w{12})\}\s+event:\/cars\/(\w+)\/e/);
					
					if (m){                                                        // data_sfx.jsxi:35
						_origGuids[m[1]] = m[2];                                   // data_sfx.jsxi:36
						_origIds[m[2]] = true;                                     // data_sfx.jsxi:37
					}
				}
				
				__p = undefined;
			}
		}
	};
	Sfx.getGuidsById = function (id){                                              // data_sfx.jsxi:43
		var file = Cars.byId(id).path + '/sfx/GUIDs.txt';
		
		if (!fs.existsSync(file))                                                  // data_sfx.jsxi:45
			file = AcDir.root + '/content/sfx/GUIDs.txt';                          // data_sfx.jsxi:45
		
		var result = [];
		
		{
			var __r = fs.readFileSync(file).toString().split(/\n/);
			
			for (var __q = 0; __q < __r.length; __q ++){
				var l = __r[__q];
				
				var m = l.match(/^\{(\w{8}(?:-\w{4}){3}-\w{12})\}\s+event:\/cars\/(\w+)\/.+/);
				
				if (m && m[2] === id){                                             // data_sfx.jsxi:50
					result.push(m[0]);                                             // data_sfx.jsxi:51
				}
			}
			
			__r = undefined;
		}
		return result.join('\n');                                                  // data_sfx.jsxi:55
	};
	Sfx.getBankFilenameById = function (id){                                       // data_sfx.jsxi:58
		return Cars.byId(id).path + ('/sfx/' + id + '.bank');                      // data_sfx.jsxi:59
	};
	Sfx.getDefaultGuids = function (id){                                           // data_sfx.jsxi:62
		return fs.readFileSync('data/GUIDs.txt').toString().replace(/\{\{CAR_ID\}\}/g, id);
	};
	return Sfx;
})();

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
			"All manually added badges are located in <a href=\"#\" onclick=\"Shell.openItem(DataStorage.getUserContentDir('Badges'))\"><i>…\\AppData\\Local\\AcTools Cars Manager\\Data Storage\\Badges (User)</i></a>.", 
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

/* Class "Urls" declaration */
var Urls = (function (){                                                           // data_urls.jsxi:1
	var Urls = function (){}, 
		_initialized = false, _database;
	
	Urls.fromDatabase = function (id){                                             // data_urls.jsxi:5
		if (!_initialized){                                                        // data_urls.jsxi:6
			Urls.init();
		}
		
		if (_database && _database.hasOwnProperty(id)){                            // data_urls.jsxi:10
			return _database[id];                                                  // data_urls.jsxi:11
		} else {
			return null;
		}
	};
	Urls.init = function (){                                                       // data_urls.jsxi:17
		_database = DataStorage.readContentJsonFile('Details (Preload)', 'urls.json');
	};
	return Urls;
})();

/* Class "Years" declaration */
var Years = (function (){                                                          // data_years.jsxi:1
	var Years = function (){}, 
		_re = /\s['`]?(\d\d)$/,                                                    // data_years.jsxi:2
		_initialized = false,                                                      // data_years.jsxi:31
		_database;                                                                 // data_years.jsxi:32
	
	Years.nameContains = function (name){                                          // data_years.jsxi:4
		return _re.test(name);                                                     // data_years.jsxi:5
	};
	Years.fromName = function (name){                                              // data_years.jsxi:8
		if (_re.test(name)){                                                       // data_years.jsxi:9
			var year = + RegExp.$1;
			
			if (year < 30){                                                        // data_years.jsxi:11
				year = 2e3 + year;                                                 // data_years.jsxi:12
			} else if (year < 1e3){                                                // data_years.jsxi:13
				year = 1900 + year;                                                // data_years.jsxi:14
			}
			return year;                                                           // data_years.jsxi:17
		} else {
			return null;
		}
	};
	Years.addToName = function (name, year){                                       // data_years.jsxi:23
		return name + ' \'' + ('' + year).slice(2);                                // data_years.jsxi:24
	};
	Years.removeFromName = function (name){                                        // data_years.jsxi:27
		return name.replace(_re, '');                                              // data_years.jsxi:28
	};
	Years.fromDatabase = function (id){                                            // data_years.jsxi:34
		if (!_initialized){                                                        // data_years.jsxi:35
			Years.init();
		}
		
		if (_database && _database.hasOwnProperty(id)){                            // data_years.jsxi:39
			return _database[id];                                                  // data_years.jsxi:40
		} else {
			return null;
		}
	};
	Years.init = function (){                                                      // data_years.jsxi:46
		_database = DataStorage.readContentJsonFile('Details (Preload)', 'years.json');
	};
	return Years;
})();

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
				mainForm.focus();                                                  // drag_destination.jsxi:37
			}
			return false;
		};
		$(window).on('dragover drop',                                              // drag_destination.jsxi:43
			_node.ondragover = function (arg){                                     // drag_destination.jsxi:44
				arg.preventDefault();                                              // drag_destination.jsxi:45
				
				var entry = _registered[_registered.length - 1];
				
				if (entry){                                                        // drag_destination.jsxi:48
					_node.children[0].textContent = entry.text;                    // drag_destination.jsxi:49
					_node.style.display = null;                                    // drag_destination.jsxi:50
				}
				return false;
			});
		_node.ondragleave = function (arg){                                        // drag_destination.jsxi:56
			arg.preventDefault();                                                  // drag_destination.jsxi:57
			_node.style.display = 'none';                                          // drag_destination.jsxi:58
			return false;
		};
	})();
	return DragDestination;
})();

/* Class "DragMainHandler" declaration */
var DragMainHandler = (function (){                                                // drag_main_handler.jsxi:1
	var DragMainHandler = function (){}, 
		_ddId,                                                                     // drag_main_handler.jsxi:2
		_holders = [],                                                             // drag_main_handler.jsxi:2
		_idToReload = [],                                                          // drag_main_handler.jsxi:2
		_exec_inner;                                                               // drag_main_handler_archive.jsxi:2
	
	function handle(file){                                                         // drag_main_handler.jsxi:4
		if (fs.statSync(file).isDirectory()){                                      // drag_main_handler.jsxi:5
			return fromDirectory(file);                                            // drag_main_handler.jsxi:6
		} else {
			return fromArchive(file);                                              // drag_main_handler.jsxi:8
		}
	}
	
	function detectContent(file, node, result){                                    // drag_main_handler.jsxi:12
		if (result === undefined)                                                  // drag_main_handler.jsxi:12
			result = [];                                                           // drag_main_handler.jsxi:12
	
		if (node.sub['body_shadow.png'] && node.sub['sfx'] && node.sub['skins'] && node.sub['ui'] && node.sub['ui'].sub && node.sub['ui'].sub['ui_car.json']){
			result.push({                                                          // drag_main_handler.jsxi:15
				type: 'car',                                                       // drag_main_handler.jsxi:15
				id: node.path === '' ? file.replace(/^.+[\\\/]|\.\w+$/g, '') : node.id, 
				root: node,                                                        // drag_main_handler.jsxi:15
				data: node.sub['ui'].sub['ui_car.json']
			});
		} else if (node.sub['ui_skin.json']){                                      // drag_main_handler.jsxi:17
			result.push({                                                          // drag_main_handler.jsxi:18
				type: 'skin',                                                      // drag_main_handler.jsxi:18
				id: node.path === '' ? file.replace(/^.+[\\\/]|\.\w+$/g, '') : node.id, 
				root: node,                                                        // drag_main_handler.jsxi:18
				data: node.sub['ui_skin.json']
			});
		} else {
			{
				var __s = node.sub;
				
				for (var id in __s)
					if (__s.hasOwnProperty(id)){
						var child = __s[id];
						
						if (child.sub){                                            // drag_main_handler.jsxi:22
							detectContent(file, child, result);                    // drag_main_handler.jsxi:23
						}
					}
				
				__s = undefined;
			}
		}
		return result;                                                             // drag_main_handler.jsxi:28
	}
	
	function showDialog(found){                                                    // drag_main_handler.jsxi:31
		if (found.length === 0){                                                   // drag_main_handler.jsxi:32
			new Dialog('Installation', [ 'Nothing to install.' ]);                 // drag_main_handler.jsxi:33
			return;
		}
		
		var d = new Dialog('Installation',                                         // drag_main_handler.jsxi:37
			found.map(function (entry, id){                                        // drag_main_handler.jsxi:37
				return '<h6>' + entry.type + ': ' + entry.name + '</h6><p>' + entry.actions.map(function (a, i){
					return '<label style="display:block"><input name="found-' + id + '" data-id="' + entry.id + '" data-action="' + i + '" type="radio">' + a.name + '</label>';
				}).join('') + '<label style="display:block"><input name="found-' + id + '" data-id="' + entry.id + '" type="radio" checked>Skip</label></p>';
			}), 
			function (){                                                           // drag_main_handler.jsxi:42
				var actions = found.map((function (entry, id){                     // drag_main_handler.jsxi:43
					var action = entry.actions[this.content.find('[name="found-' + id + '"]:checked').data('action')];
					return action && action.action;                                // drag_main_handler.jsxi:45
				}).bind(this)).filter(function (arg){                              // drag_main_handler.jsxi:46
					return arg;                                                    // drag_main_handler.jsxi:46
				});
				
				if (actions.length){                                               // drag_main_handler.jsxi:48
					setTimeout(applyActions.bind(null, actions));                  // drag_main_handler.jsxi:49
				}
			}, 
			freeHolders).setButton('Install');                                     // drag_main_handler.jsxi:51
		
		d.content.find('input[data-action]').change(function (){                   // drag_main_handler.jsxi:53
			var t = this;
			
			d.content.find('input[data-id="' + this.getAttribute('data-id') + '"]:not([data-action])').each(function (arg){
				if (this !== t)                                                    // drag_main_handler.jsxi:56
					this.checked = true;                                           // drag_main_handler.jsxi:56
			});
			this.checked = true;                                                   // drag_main_handler.jsxi:59
		});
		
		var lastId;
		
		for (var id = 0; id < found.length; id ++){                                // drag_main_handler.jsxi:63
			var entry = found[id];
			
			var el = d.content.find('[name="found-' + id + '"]')[0];
			
			if (lastId !== el.getAttribute('data-id')){                            // drag_main_handler.jsxi:65
				el.checked = true;                                                 // drag_main_handler.jsxi:66
				lastId = el.getAttribute('data-id');                               // drag_main_handler.jsxi:67
			}
		}
	}
	
	function reloadAfter(){}
	
	function freeHolders(){                                                        // drag_main_handler.jsxi:76
		for (var __t = 0; __t < _holders.length; __t ++){                          // drag_main_handler.jsxi:77
			var holder = _holders[__t];
			
			holder.stream.end();                                                   // drag_main_handler.jsxi:78
			
			if (fs.existsSync(holder.filename))                                    // drag_main_handler.jsxi:79
				try {
					fs.unlinkSync(holder.filename);                                // drag_main_handler.jsxi:80
				} catch (e){} 
		}
	}
	
	function applyActions(actions){                                                // drag_main_handler.jsxi:84
		var d = new Dialog('Installation',                                         // drag_main_handler.jsxi:85
				[ '<progress max="' + actions.length + '"></progress>' ], 
				false, 
				false), 
			p = d.find('progress')[0];                                             // drag_main_handler.jsxi:87
		
		var i = 0,                                                                 // drag_main_handler.jsxi:89
			step = function (arg){                                                 // drag_main_handler.jsxi:90
				if (i >= actions.length){                                          // drag_main_handler.jsxi:91
					d.close();                                                     // drag_main_handler.jsxi:92
					reloadAfter();                                                 // drag_main_handler.jsxi:93
					freeHolders();                                                 // drag_main_handler.jsxi:94
				} else {
					actions[p.value = i ++](function (arg){                        // drag_main_handler.jsxi:96
						setTimeout(step, 100);                                     // drag_main_handler.jsxi:97
					});
				}
			};
		
		setTimeout(step, 100);                                                     // drag_main_handler.jsxi:102
	}
	
	function exec(){                                                               // drag_main_handler_archive.jsxi:5
		return '' + DragMainHandler.__DragMainHandler__exec.apply(null, arguments, { encoding: 'utf8' });
	}
	
	function fromArchive_getFiles(file){                                           // drag_main_handler_archive.jsxi:9
		var list = exec('native\\7z', [ 'l', '-sccUTF-8', file ]).split(/\r?\n/).map(function (arg){
			return /^[-\d]+\s+[:\d]+\s+[\.\w]+\s+(\d+)\s+(?:\d+\s+)?(.+)/.test(arg) && { path: RegExp.$2, size: + RegExp.$1 };
		}).filter(function (arg){                                                  // drag_main_handler_archive.jsxi:11
			return arg;                                                            // drag_main_handler_archive.jsxi:11
		});
		
		var root = { sub: {}, path: '' };
		
		for (var __12 = 0; __12 < list.length; __12 ++){                           // drag_main_handler_archive.jsxi:14
			var entry = list[__12];
			
			var path = entry.path.split('\\');
			
			var loc = root;
			
			var currentPath = '';
			
			for (var __11 = 0; __11 < path.length; __11 ++){                       // drag_main_handler_archive.jsxi:19
				var part = path[__11];
				
				if (!loc.sub)                                                      // drag_main_handler_archive.jsxi:20
					loc.sub = {};                                                  // drag_main_handler_archive.jsxi:20
				
				currentPath = currentPath ? currentPath + '\\' + part : part;      // drag_main_handler_archive.jsxi:21
				loc = loc.sub[part] || (loc.sub[part] = { id: part, path: currentPath });
			}
			
			loc.path = entry.path;                                                 // drag_main_handler_archive.jsxi:25
			loc.size = entry.size;                                                 // drag_main_handler_archive.jsxi:26
		}
		return root;                                                               // drag_main_handler_archive.jsxi:29
	}
	
	function fromArchive_extractData(file, content){                               // drag_main_handler_archive.jsxi:32
		var files = content.map(function (arg){                                    // drag_main_handler_archive.jsxi:33
			return arg.data;                                                       // drag_main_handler_archive.jsxi:33
		}).filter(function (arg){                                                  // drag_main_handler_archive.jsxi:33
			return arg;                                                            // drag_main_handler_archive.jsxi:33
		});
		
		var output = exec('native\\7z',                                            // drag_main_handler_archive.jsxi:34
			[ 'e', '-sccUTF-8', file, '-so' ].concat(files.map(function (arg){     // drag_main_handler_archive.jsxi:34
				return arg.path;                                                   // drag_main_handler_archive.jsxi:34
			})));
		
		for (var __13 = 0; __13 < files.length; __13 ++){                          // drag_main_handler_archive.jsxi:36
			var file = files[__13];
			
			try {
				file.content = JSON.flexibleParse(output.substr(0, file.size));    // drag_main_handler_archive.jsxi:37
			} catch (e){} 
			
			output = output.slice(file.size);                                      // drag_main_handler_archive.jsxi:38
		}
	}
	
	function fromArchive_prepareFound(file, entry){                                // drag_main_handler_archive.jsxi:42
		var path = '/' + entry.root.path.replace(/\\/g, '/'),                      // drag_main_handler_archive.jsxi:43
			name = entry.data && entry.data.content && (entry.data.content.name || entry.data.content.skinname);
		
		name = name ? name + ' (' + path + ')' : path;                             // drag_main_handler_archive.jsxi:46
		
		switch (entry.type){                                                       // drag_main_handler_archive.jsxi:48
			case 'car':                                                            // drag_main_handler_archive.jsxi:49
				return Cars.byId(entry.id) == null ? {                             // drag_main_handler_archive.jsxi:50
					id: entry.id,                                                  // drag_main_handler_archive.jsxi:50
					type: 'New Car',                                               // drag_main_handler_archive.jsxi:52
					name: name,                                                    // drag_main_handler_archive.jsxi:53
					actions: [                                                     // drag_main_handler_archive.jsxi:54
						{                                                          // drag_main_handler_archive.jsxi:54
							name: 'Install',                                       // drag_main_handler_archive.jsxi:54
							action: (function (arg){                               // drag_main_handler_archive.jsxi:55
								return fromArchive_installCar(file, entry, arg);   // drag_main_handler_archive.jsxi:55
							})
						}
					]
				} : {
					id: entry.id,                                                  // drag_main_handler_archive.jsxi:58
					type: 'Update Existing Car',                                   // drag_main_handler_archive.jsxi:59
					name: name,                                                    // drag_main_handler_archive.jsxi:60
					actions: [                                                     // drag_main_handler_archive.jsxi:61
						{                                                          // drag_main_handler_archive.jsxi:61
							name: 'Keep current skins & information',              // drag_main_handler_archive.jsxi:61
							action: (function (arg){                               // drag_main_handler_archive.jsxi:62
								return fromArchive_updateCarKeepSkinsUi(file, entry, arg);
							})
						}, 
						{
							name: 'Update only data & sfx',                        // drag_main_handler_archive.jsxi:63
							action: (function (arg){                               // drag_main_handler_archive.jsxi:63
								return fromArchive_updateCarOnlyDataSfx(file, entry, arg);
							})
						}, 
						{
							name: 'Full update',                                   // drag_main_handler_archive.jsxi:64
							action: (function (arg){                               // drag_main_handler_archive.jsxi:64
								return fromArchive_updateCarFull(file, entry, arg);
							})
						}
					]
				};
			case 'skin':                                                           // drag_main_handler_archive.jsxi:68
				var selected = ViewList.selected;
				
				if (!selected)                                                     // drag_main_handler_archive.jsxi:70
					return;
				
				var _unique;
				
				function unique(){                                                 // drag_main_handler_archive.jsxi:73
					for (var i = 1; selected.getSkin(_unique = entry.id + '-' + i) != null; i ++);
					return _unique;                                                // drag_main_handler_archive.jsxi:75
				}
				return selected.getSkin(entry.id) == null ? {                      // drag_main_handler_archive.jsxi:78
					id: entry.id,                                                  // drag_main_handler_archive.jsxi:78
					type: 'New Skin For ' + selected.displayName,                  // drag_main_handler_archive.jsxi:80
					name: name,                                                    // drag_main_handler_archive.jsxi:81
					actions: [                                                     // drag_main_handler_archive.jsxi:82
						{                                                          // drag_main_handler_archive.jsxi:82
							name: 'Install',                                       // drag_main_handler_archive.jsxi:82
							action: (function (arg){                               // drag_main_handler_archive.jsxi:83
								return fromArchive_installSkin(selected, file, entry, arg);
							})
						}
					]
				} : {
					id: entry.id,                                                  // drag_main_handler_archive.jsxi:86
					type: 'Update Existing Skin Of ' + selected.displayName,       // drag_main_handler_archive.jsxi:87
					name: name,                                                    // drag_main_handler_archive.jsxi:88
					actions: [                                                     // drag_main_handler_archive.jsxi:89
						{                                                          // drag_main_handler_archive.jsxi:89
							name: 'Full update',                                   // drag_main_handler_archive.jsxi:89
							action: (function (arg){                               // drag_main_handler_archive.jsxi:90
								return fromArchive_updateSkinFull(selected, file, entry, arg);
							})
						}, 
						{
							name: 'Install as ' + unique(),                        // drag_main_handler_archive.jsxi:91
							action: (function (arg){                               // drag_main_handler_archive.jsxi:91
								return fromArchive_installSkinAs(selected, _unique, file, entry, arg);
							})
						}, 
						{
							name: 'Keep current preview & information',            // drag_main_handler_archive.jsxi:92
							action: (function (arg){                               // drag_main_handler_archive.jsxi:92
								return fromArchive_updateSkinKeepUi(selected, file, entry, arg);
							})
						}
					]
				};
			default:
				throw new Error('Unsupported type: ' + entry.type);                // drag_main_handler_archive.jsxi:97
		}
	}
	
	function fromArchive_unpack(file, node, target){                               // drag_main_handler_archive.jsxi:101
		if (!fs.existsSync(target)){                                               // drag_main_handler_archive.jsxi:102
			fs.mkdirSync(target);                                                  // drag_main_handler_archive.jsxi:103
		}
		
		if (node.path === ''){                                                     // drag_main_handler_archive.jsxi:106
			var files = fromArchive_collectSub(node);
			
			exec('native\\7z',                                                     // drag_main_handler_archive.jsxi:108
				[ 'x', '-sccUTF-8', '-o' + target, file ].concat(files));          // drag_main_handler_archive.jsxi:108
		} else {
			var tmpDir = target + '/__tmp_' + Date.now();
			
			fs.mkdirSync(tmpDir);                                                  // drag_main_handler_archive.jsxi:111
			
			var files = fromArchive_collectSub(node);
			
			try {
				exec('native\\7z',                                                 // drag_main_handler_archive.jsxi:115
					[ 'x', '-sccUTF-8', '-o' + tmpDir, file ].concat(files));      // drag_main_handler_archive.jsxi:115
			} catch (err){                                                         // drag_main_handler_archive.jsxi:116
				console.debug(tmpDir, file, files);                                // drag_main_handler_archive.jsxi:117
				ErrorHandler.handled('Cannot unpack archive.', err);               // drag_main_handler_archive.jsxi:118
				return;
			} 
			
			for (var __14 = 0; __14 < files.length; __14 ++){                      // drag_main_handler_archive.jsxi:122
				var f = files[__14];
				
				var dest = target + '/' + f.slice(node.path.length + 1);
				
				fs.mkdirpSync(path.dirname(dest));                                 // drag_main_handler_archive.jsxi:124
				fs.renameSync(tmpDir + '/' + f, dest);                             // drag_main_handler_archive.jsxi:125
			}
			
			fs.removeDirSync(tmpDir);                                              // drag_main_handler_archive.jsxi:128
		}
	}
	
	function fromArchive_collectSub(node, result){                                 // drag_main_handler_archive.jsxi:132
		if (result === undefined)                                                  // drag_main_handler_archive.jsxi:132
			result = [];                                                           // drag_main_handler_archive.jsxi:132
	
		{
			var __15 = node.sub;
			
			for (var id in __15)
				if (__15.hasOwnProperty(id)){
					var child = __15[id];
					
					if (child.sub){                                                // drag_main_handler_archive.jsxi:134
						fromArchive_collectSub(child, result);                     // drag_main_handler_archive.jsxi:135
					} else {
						result.push(child.path);                                   // drag_main_handler_archive.jsxi:137
					}
				}
			
			__15 = undefined;
		}
		return result;                                                             // drag_main_handler_archive.jsxi:141
	}
	
	function fromArchive_installCar(file, entry, callback){                        // drag_main_handler_archive.jsxi:144
		var destination = path.join(AcDir.cars, entry.id);
		
		if (fs.existsSync(destination)){                                           // drag_main_handler_archive.jsxi:146
			return ErrorHandler.handled('Folder “' + destination + '” already exists.');
		}
		
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:150
		Cars.loadById(entry.id,                                                    // drag_main_handler_archive.jsxi:151
			function (arg){                                                        // drag_main_handler_archive.jsxi:151
				ViewList.select(entry.id);                                         // drag_main_handler_archive.jsxi:152
				
				if (callback)                                                      // drag_main_handler_archive.jsxi:153
					callback();                                                    // drag_main_handler_archive.jsxi:153
			});
		_idToReload.push(entry.id);                                                // drag_main_handler_archive.jsxi:156
	}
	
	function fromArchive_updateCarFull(file, entry, callback){                     // drag_main_handler_archive.jsxi:159
		var destination = Cars.byId(entry.id).path;
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_archive.jsxi:161
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_archive.jsxi:165
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:166
		Cars.loadById(entry.id,                                                    // drag_main_handler_archive.jsxi:167
			function (arg){                                                        // drag_main_handler_archive.jsxi:167
				ViewList.select(entry.id);                                         // drag_main_handler_archive.jsxi:168
				
				if (callback)                                                      // drag_main_handler_archive.jsxi:169
					callback();                                                    // drag_main_handler_archive.jsxi:169
			});
	}
	
	function fromArchive_updateCarKeepSkinsUi(file, entry, callback){              // drag_main_handler_archive.jsxi:173
		var destination = Cars.byId(entry.id).path,                                // drag_main_handler_archive.jsxi:174
			skins = destination + '/skins',                                        // drag_main_handler_archive.jsxi:175
			ui = destination + '/ui';                                              // drag_main_handler_archive.jsxi:176
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_archive.jsxi:177
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		var tmpDir = AcDir.temp;
		
		fs.mkdirSync(tmpDir);                                                      // drag_main_handler_archive.jsxi:182
		
		if (fs.existsSync(skins))                                                  // drag_main_handler_archive.jsxi:184
			fs.renameSync(skins, tmpDir + '/skins');                               // drag_main_handler_archive.jsxi:184
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_archive.jsxi:185
			fs.renameSync(ui, tmpDir + '/ui');                                     // drag_main_handler_archive.jsxi:185
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_archive.jsxi:187
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:188
		
		if (fs.existsSync(skins))                                                  // drag_main_handler_archive.jsxi:190
			fs.removeDirSync(skins);                                               // drag_main_handler_archive.jsxi:190
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_archive.jsxi:191
			fs.removeDirSync(ui);                                                  // drag_main_handler_archive.jsxi:191
		
		if (fs.existsSync(tmpDir + '/skins'))                                      // drag_main_handler_archive.jsxi:193
			fs.renameSync(tmpDir + '/skins', skins);                               // drag_main_handler_archive.jsxi:193
		
		if (fs.existsSync(tmpDir + '/ui'))                                         // drag_main_handler_archive.jsxi:194
			fs.renameSync(tmpDir + '/ui', ui);                                     // drag_main_handler_archive.jsxi:194
		
		fs.removeDirSync(tmpDir);                                                  // drag_main_handler_archive.jsxi:195
		Cars.loadById(entry.id,                                                    // drag_main_handler_archive.jsxi:197
			function (arg){                                                        // drag_main_handler_archive.jsxi:197
				ViewList.select(entry.id);                                         // drag_main_handler_archive.jsxi:198
				
				if (callback)                                                      // drag_main_handler_archive.jsxi:199
					callback();                                                    // drag_main_handler_archive.jsxi:199
			});
	}
	
	function fromArchive_updateCarOnlyDataSfx(file, entry, callback){              // drag_main_handler_archive.jsxi:203
		var destination = Cars.byId(entry.id).path;
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_archive.jsxi:205
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		if (fs.existsSync(destination + '/sfx'))                                   // drag_main_handler_archive.jsxi:209
			AcTools.Utils.FileUtils.Recycle(destination + '/sfx');                 // drag_main_handler_archive.jsxi:209
		
		if (fs.existsSync(destination + '/data'))                                  // drag_main_handler_archive.jsxi:210
			AcTools.Utils.FileUtils.Recycle(destination + '/data');                // drag_main_handler_archive.jsxi:210
		
		if (fs.existsSync(destination + '/data.acd'))                              // drag_main_handler_archive.jsxi:211
			AcTools.Utils.FileUtils.Recycle(destination + '/data.acd');            // drag_main_handler_archive.jsxi:211
		
		fromArchive_unpack(file, entry.root.sub['sfx'], destination + '/sfx');     // drag_main_handler_archive.jsxi:213
		
		if (entry.root.sub['data'])                                                // drag_main_handler_archive.jsxi:214
			fromArchive_unpack(file, entry.root.sub['data'], destination + '/data');
		
		if (entry.root.sub['data.acd'])                                            // drag_main_handler_archive.jsxi:215
			fromArchive_unpack(file, entry.root.sub['data.acd'], destination + '/data.acd');
		
		Cars.loadById(entry.id,                                                    // drag_main_handler_archive.jsxi:217
			function (arg){                                                        // drag_main_handler_archive.jsxi:217
				ViewList.select(entry.id);                                         // drag_main_handler_archive.jsxi:218
				
				if (callback)                                                      // drag_main_handler_archive.jsxi:219
					callback();                                                    // drag_main_handler_archive.jsxi:219
			});
	}
	
	function fromArchive_installSkin(car, file, entry, callback){                  // drag_main_handler_archive.jsxi:223
		var destination = path.join(car.path, 'skins', entry.id);
		
		if (fs.existsSync(destination)){                                           // drag_main_handler_archive.jsxi:225
			return ErrorHandler.handled('Folder “' + destination + '” already exists.');
		}
		
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:229
		car.loadSkins(callback);                                                   // drag_main_handler_archive.jsxi:230
	}
	
	function fromArchive_installSkinAs(car, id, file, entry, callback){            // drag_main_handler_archive.jsxi:233
		var destination = path.join(car.path, 'skins', id);
		
		if (fs.existsSync(destination)){                                           // drag_main_handler_archive.jsxi:235
			return ErrorHandler.handled('Folder “' + destination + '” already exists.');
		}
		
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:239
		car.loadSkins(callback);                                                   // drag_main_handler_archive.jsxi:240
	}
	
	function fromArchive_updateSkinFull(car, file, entry, callback){               // drag_main_handler_archive.jsxi:243
		var destination = path.join(car.path, 'skins', entry.id);
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_archive.jsxi:245
			callback();                                                            // drag_main_handler_archive.jsxi:246
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_archive.jsxi:250
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:251
		car.loadSkins(callback);                                                   // drag_main_handler_archive.jsxi:252
	}
	
	function fromArchive_updateSkinKeepUi(car, file, entry, callback){             // drag_main_handler_archive.jsxi:255
		var destination = path.join(car.path, 'skins', entry.id),                  // drag_main_handler_archive.jsxi:256
			preview = destination + '/preview.jpg',                                // drag_main_handler_archive.jsxi:257
			ui = destination + '/ui_skin.json';                                    // drag_main_handler_archive.jsxi:258
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_archive.jsxi:259
			callback();                                                            // drag_main_handler_archive.jsxi:260
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		var tmpDir = AcDir.temp;
		
		fs.mkdirSync(tmpDir);                                                      // drag_main_handler_archive.jsxi:265
		
		if (fs.existsSync(preview))                                                // drag_main_handler_archive.jsxi:267
			fs.renameSync(preview, tmpDir + '/p');                                 // drag_main_handler_archive.jsxi:267
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_archive.jsxi:268
			fs.renameSync(ui, tmpDir + '/u');                                      // drag_main_handler_archive.jsxi:268
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_archive.jsxi:270
		fromArchive_unpack(file, entry.root, destination);                         // drag_main_handler_archive.jsxi:271
		
		if (fs.existsSync(preview))                                                // drag_main_handler_archive.jsxi:273
			fs.removeDirSync(preview);                                             // drag_main_handler_archive.jsxi:273
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_archive.jsxi:274
			fs.removeDirSync(ui);                                                  // drag_main_handler_archive.jsxi:274
		
		if (fs.existsSync(tmpDir + '/p'))                                          // drag_main_handler_archive.jsxi:276
			fs.renameSync(tmpDir + '/p', preview);                                 // drag_main_handler_archive.jsxi:276
		
		if (fs.existsSync(tmpDir + '/u'))                                          // drag_main_handler_archive.jsxi:277
			fs.renameSync(tmpDir + '/u', ui);                                      // drag_main_handler_archive.jsxi:277
		
		fs.removeDirSync(tmpDir);                                                  // drag_main_handler_archive.jsxi:278
		car.loadSkins(callback);                                                   // drag_main_handler_archive.jsxi:280
	}
	
	function fromArchive(file){                                                    // drag_main_handler_archive.jsxi:283
		var tree = fromArchive_getFiles(file);
		
		var content = detectContent(file, tree);
		
		fromArchive_extractData(file, content);                                    // drag_main_handler_archive.jsxi:286
		return content.map(function (arg){                                         // drag_main_handler_archive.jsxi:287
			return fromArchive_prepareFound(file, arg);                            // drag_main_handler_archive.jsxi:287
		});
	}
	
	function fromDirectory_getFiles(dir){                                          // drag_main_handler_directory.jsxi:2
		var list = fs.readdirRecursiveSync(dir, 10e3);
		
		Shell.openItem(dir);                                                       // drag_main_handler_directory.jsxi:5
		
		var root = { sub: {}, path: '' };
		
		for (var __17 = 0; __17 < list.length; __17 ++){                           // drag_main_handler_directory.jsxi:8
			var entry = list[__17];
			
			var path = entry.split('\\');
			
			var loc = root;
			
			var currentPath = '';
			
			for (var __16 = 0; __16 < path.length; __16 ++){                       // drag_main_handler_directory.jsxi:13
				var part = path[__16];
				
				if (!loc.sub)                                                      // drag_main_handler_directory.jsxi:14
					loc.sub = {};                                                  // drag_main_handler_directory.jsxi:14
				
				currentPath = currentPath ? currentPath + '\\' + part : part;      // drag_main_handler_directory.jsxi:15
				loc = loc.sub[part] || (loc.sub[part] = { id: part, path: currentPath });
			}
			
			loc.path = entry;                                                      // drag_main_handler_directory.jsxi:19
		}
		
		console.log(root);                                                         // drag_main_handler_directory.jsxi:22
		return root;                                                               // drag_main_handler_directory.jsxi:24
	}
	
	function fromDirectory_extractData(dir, content){                              // drag_main_handler_directory.jsxi:27
		var files = content.map(function (arg){                                    // drag_main_handler_directory.jsxi:28
			return arg.data;                                                       // drag_main_handler_directory.jsxi:28
		}).filter(function (arg){                                                  // drag_main_handler_directory.jsxi:28
			return arg;                                                            // drag_main_handler_directory.jsxi:28
		});
		
		for (var __18 = 0; __18 < files.length; __18 ++){                          // drag_main_handler_directory.jsxi:29
			var file = files[__18];
			
			try {
				file.content = JSON.flexibleParse(fs.readFileSync(dir + '/' + file.path));
			} catch (e){} 
		}
	}
	
	function fromDirectory_prepareFound(file, entry){                              // drag_main_handler_directory.jsxi:34
		var path = '/' + entry.root.path.replace(/\\/g, '/'),                      // drag_main_handler_directory.jsxi:35
			name = entry.data && entry.data.content && (entry.data.content.name || entry.data.content.skinname);
		
		name = name ? name + ' (' + path + ')' : path;                             // drag_main_handler_directory.jsxi:38
		
		switch (entry.type){                                                       // drag_main_handler_directory.jsxi:40
			case 'car':                                                            // drag_main_handler_directory.jsxi:41
				return Cars.byId(entry.id) == null ? {                             // drag_main_handler_directory.jsxi:42
					id: entry.id,                                                  // drag_main_handler_directory.jsxi:42
					type: 'New Car',                                               // drag_main_handler_directory.jsxi:44
					name: name,                                                    // drag_main_handler_directory.jsxi:45
					actions: [                                                     // drag_main_handler_directory.jsxi:46
						{                                                          // drag_main_handler_directory.jsxi:46
							name: 'Install',                                       // drag_main_handler_directory.jsxi:46
							action: (function (arg){                               // drag_main_handler_directory.jsxi:47
								return fromDirectory_installCar(file, entry, arg);
							})
						}
					]
				} : {
					id: entry.id,                                                  // drag_main_handler_directory.jsxi:50
					type: 'Update Existing Car',                                   // drag_main_handler_directory.jsxi:51
					name: name,                                                    // drag_main_handler_directory.jsxi:52
					actions: [                                                     // drag_main_handler_directory.jsxi:53
						{                                                          // drag_main_handler_directory.jsxi:53
							name: 'Keep current skins & information',              // drag_main_handler_directory.jsxi:53
							action: (function (arg){                               // drag_main_handler_directory.jsxi:54
								return fromDirectory_updateCarKeepSkinsUi(file, entry, arg);
							})
						}, 
						{
							name: 'Update only data & sfx',                        // drag_main_handler_directory.jsxi:55
							action: (function (arg){                               // drag_main_handler_directory.jsxi:55
								return fromDirectory_updateCarOnlyDataSfx(file, entry, arg);
							})
						}, 
						{
							name: 'Full update',                                   // drag_main_handler_directory.jsxi:56
							action: (function (arg){                               // drag_main_handler_directory.jsxi:56
								return fromDirectory_updateCarFull(file, entry, arg);
							})
						}
					]
				};
			case 'skin':                                                           // drag_main_handler_directory.jsxi:60
				var selected = ViewList.selected;
				
				if (!selected)                                                     // drag_main_handler_directory.jsxi:62
					return;
				
				var _unique;
				
				function unique(){                                                 // drag_main_handler_directory.jsxi:65
					for (var i = 1; selected.getSkin(_unique = entry.id + '-' + i) != null; i ++);
					return _unique;                                                // drag_main_handler_directory.jsxi:67
				}
				return selected.getSkin(entry.id) == null ? {                      // drag_main_handler_directory.jsxi:70
					id: entry.id,                                                  // drag_main_handler_directory.jsxi:70
					type: 'New Skin For ' + selected.displayName,                  // drag_main_handler_directory.jsxi:72
					name: name,                                                    // drag_main_handler_directory.jsxi:73
					actions: [                                                     // drag_main_handler_directory.jsxi:74
						{                                                          // drag_main_handler_directory.jsxi:74
							name: 'Install',                                       // drag_main_handler_directory.jsxi:74
							action: (function (arg){                               // drag_main_handler_directory.jsxi:75
								return fromDirectory_installSkin(selected, file, entry, arg);
							})
						}
					]
				} : {
					id: entry.id,                                                  // drag_main_handler_directory.jsxi:78
					type: 'Update Existing Skin Of ' + selected.displayName,       // drag_main_handler_directory.jsxi:79
					name: name,                                                    // drag_main_handler_directory.jsxi:80
					actions: [                                                     // drag_main_handler_directory.jsxi:81
						{                                                          // drag_main_handler_directory.jsxi:81
							name: 'Full update',                                   // drag_main_handler_directory.jsxi:81
							action: (function (arg){                               // drag_main_handler_directory.jsxi:82
								return fromDirectory_updateSkinFull(selected, file, entry, arg);
							})
						}, 
						{
							name: 'Install as ' + unique(),                        // drag_main_handler_directory.jsxi:83
							action: (function (arg){                               // drag_main_handler_directory.jsxi:83
								return fromDirectory_installSkinAs(selected, _unique, file, entry, arg);
							})
						}, 
						{
							name: 'Keep current preview & information',            // drag_main_handler_directory.jsxi:84
							action: (function (arg){                               // drag_main_handler_directory.jsxi:84
								return fromDirectory_updateSkinKeepUi(selected, file, entry, arg);
							})
						}
					]
				};
			default:
				throw new Error('Unsupported type: ' + entry.type);                // drag_main_handler_directory.jsxi:89
		}
	}
	
	function fromDirectory_unpack(dir, node, target){                              // drag_main_handler_directory.jsxi:93
		if (!fs.existsSync(target)){                                               // drag_main_handler_directory.jsxi:94
			fs.mkdirSync(target);                                                  // drag_main_handler_directory.jsxi:95
		}
		
		var files = fromDirectory_collectSub(node);
		
		for (var __19 = 0; __19 < files.length; __19 ++){                          // drag_main_handler_directory.jsxi:99
			var file = files[__19];
			
			var dest = target + '/' + file.slice(node.path.length + 1);
			
			fs.mkdirpSync(path.dirname(dest));                                     // drag_main_handler_directory.jsxi:101
			fs.copyFileSync(dir + '/' + file, dest);                               // drag_main_handler_directory.jsxi:102
		}
	}
	
	function fromDirectory_collectSub(node, result){                               // drag_main_handler_directory.jsxi:106
		if (result === undefined)                                                  // drag_main_handler_directory.jsxi:106
			result = [];                                                           // drag_main_handler_directory.jsxi:106
	
		{
			var __1a = node.sub;
			
			for (var id in __1a)
				if (__1a.hasOwnProperty(id)){
					var child = __1a[id];
					
					if (child.sub){                                                // drag_main_handler_directory.jsxi:108
						fromDirectory_collectSub(child, result);                   // drag_main_handler_directory.jsxi:109
					} else {
						result.push(child.path);                                   // drag_main_handler_directory.jsxi:111
					}
				}
			
			__1a = undefined;
		}
		return result;                                                             // drag_main_handler_directory.jsxi:115
	}
	
	function fromDirectory_installCar(file, entry, callback){                      // drag_main_handler_directory.jsxi:118
		var destination = path.join(AcDir.cars, entry.id);
		
		if (fs.existsSync(destination)){                                           // drag_main_handler_directory.jsxi:120
			return ErrorHandler.handled('Folder “' + destination + '” already exists.');
		}
		
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:124
		Cars.loadById(entry.id,                                                    // drag_main_handler_directory.jsxi:125
			function (arg){                                                        // drag_main_handler_directory.jsxi:125
				ViewList.select(entry.id);                                         // drag_main_handler_directory.jsxi:126
				
				if (callback)                                                      // drag_main_handler_directory.jsxi:127
					callback();                                                    // drag_main_handler_directory.jsxi:127
			});
	}
	
	function fromDirectory_updateCarFull(file, entry, callback){                   // drag_main_handler_directory.jsxi:131
		var destination = Cars.byId(entry.id).path;
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_directory.jsxi:133
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_directory.jsxi:137
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:138
		Cars.loadById(entry.id,                                                    // drag_main_handler_directory.jsxi:139
			function (arg){                                                        // drag_main_handler_directory.jsxi:139
				ViewList.select(entry.id);                                         // drag_main_handler_directory.jsxi:140
				
				if (callback)                                                      // drag_main_handler_directory.jsxi:141
					callback();                                                    // drag_main_handler_directory.jsxi:141
			});
	}
	
	function fromDirectory_updateCarKeepSkinsUi(file, entry, callback){            // drag_main_handler_directory.jsxi:145
		var destination = Cars.byId(entry.id).path,                                // drag_main_handler_directory.jsxi:146
			skins = destination + '/skins',                                        // drag_main_handler_directory.jsxi:147
			ui = destination + '/ui';                                              // drag_main_handler_directory.jsxi:148
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_directory.jsxi:149
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		var tmpDir = AcDir.temp;
		
		fs.mkdirSync(tmpDir);                                                      // drag_main_handler_directory.jsxi:154
		
		if (fs.existsSync(skins))                                                  // drag_main_handler_directory.jsxi:156
			fs.renameSync(skins, tmpDir + '/skins');                               // drag_main_handler_directory.jsxi:156
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_directory.jsxi:157
			fs.renameSync(ui, tmpDir + '/ui');                                     // drag_main_handler_directory.jsxi:157
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_directory.jsxi:159
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:160
		
		if (fs.existsSync(skins))                                                  // drag_main_handler_directory.jsxi:162
			fs.removeDirSync(skins);                                               // drag_main_handler_directory.jsxi:162
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_directory.jsxi:163
			fs.removeDirSync(ui);                                                  // drag_main_handler_directory.jsxi:163
		
		if (fs.existsSync(tmpDir + '/skins'))                                      // drag_main_handler_directory.jsxi:165
			fs.renameSync(tmpDir + '/skins', skins);                               // drag_main_handler_directory.jsxi:165
		
		if (fs.existsSync(tmpDir + '/ui'))                                         // drag_main_handler_directory.jsxi:166
			fs.renameSync(tmpDir + '/ui', ui);                                     // drag_main_handler_directory.jsxi:166
		
		fs.removeDirSync(tmpDir);                                                  // drag_main_handler_directory.jsxi:167
		Cars.loadById(entry.id,                                                    // drag_main_handler_directory.jsxi:169
			function (arg){                                                        // drag_main_handler_directory.jsxi:169
				ViewList.select(entry.id);                                         // drag_main_handler_directory.jsxi:170
				
				if (callback)                                                      // drag_main_handler_directory.jsxi:171
					callback();                                                    // drag_main_handler_directory.jsxi:171
			});
	}
	
	function fromDirectory_updateCarOnlyDataSfx(file, entry, callback){            // drag_main_handler_directory.jsxi:175
		var destination = Cars.byId(entry.id).path;
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_directory.jsxi:177
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		if (fs.existsSync(destination + '/sfx'))                                   // drag_main_handler_directory.jsxi:181
			AcTools.Utils.FileUtils.Recycle(destination + '/sfx');                 // drag_main_handler_directory.jsxi:181
		
		if (fs.existsSync(destination + '/data'))                                  // drag_main_handler_directory.jsxi:182
			AcTools.Utils.FileUtils.Recycle(destination + '/data');                // drag_main_handler_directory.jsxi:182
		
		if (fs.existsSync(destination + '/data.acd'))                              // drag_main_handler_directory.jsxi:183
			AcTools.Utils.FileUtils.Recycle(destination + '/data.acd');            // drag_main_handler_directory.jsxi:183
		
		fromDirectory_unpack(file, entry.root.sub['sfx'], destination + '/sfx');   // drag_main_handler_directory.jsxi:185
		
		if (entry.root.sub['data'])                                                // drag_main_handler_directory.jsxi:186
			fromDirectory_unpack(file, entry.root.sub['data'], destination + '/data');
		
		if (entry.root.sub['data.acd'])                                            // drag_main_handler_directory.jsxi:187
			fromDirectory_unpack(file, entry.root.sub['data.acd'], destination + '/data.acd');
		
		Cars.loadById(entry.id,                                                    // drag_main_handler_directory.jsxi:189
			function (arg){                                                        // drag_main_handler_directory.jsxi:189
				ViewList.select(entry.id);                                         // drag_main_handler_directory.jsxi:190
				
				if (callback)                                                      // drag_main_handler_directory.jsxi:191
					callback();                                                    // drag_main_handler_directory.jsxi:191
			});
	}
	
	function fromDirectory_installSkin(car, file, entry, callback){                // drag_main_handler_directory.jsxi:195
		var destination = path.join(car.path, 'skins', entry.id);
		
		if (fs.existsSync(destination)){                                           // drag_main_handler_directory.jsxi:197
			return ErrorHandler.handled('Folder “' + destination + '” already exists.');
		}
		
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:201
		car.loadSkins(callback);                                                   // drag_main_handler_directory.jsxi:202
	}
	
	function fromDirectory_installSkinAs(car, id, file, entry, callback){          // drag_main_handler_directory.jsxi:205
		var destination = path.join(car.path, 'skins', id);
		
		if (fs.existsSync(destination)){                                           // drag_main_handler_directory.jsxi:207
			return ErrorHandler.handled('Folder “' + destination + '” already exists.');
		}
		
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:211
		car.loadSkins(callback);                                                   // drag_main_handler_directory.jsxi:212
	}
	
	function fromDirectory_updateSkinFull(car, file, entry, callback){             // drag_main_handler_directory.jsxi:215
		var destination = path.join(car.path, 'skins', entry.id);
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_directory.jsxi:217
			callback();                                                            // drag_main_handler_directory.jsxi:218
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_directory.jsxi:222
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:223
		car.loadSkins(callback);                                                   // drag_main_handler_directory.jsxi:224
	}
	
	function fromDirectory_updateSkinKeepUi(car, file, entry, callback){           // drag_main_handler_directory.jsxi:227
		var destination = path.join(car.path, 'skins', entry.id),                  // drag_main_handler_directory.jsxi:228
			preview = destination + '/preview.jpg',                                // drag_main_handler_directory.jsxi:229
			ui = destination + '/ui_skin.json';                                    // drag_main_handler_directory.jsxi:230
		
		if (!fs.existsSync(destination)){                                          // drag_main_handler_directory.jsxi:231
			callback();                                                            // drag_main_handler_directory.jsxi:232
			return ErrorHandler.handled('Folder “' + destination + '” doesn\'t exist.');
		}
		
		var tmpDir = AcDir.temp;
		
		fs.mkdirSync(tmpDir);                                                      // drag_main_handler_directory.jsxi:237
		
		if (fs.existsSync(preview))                                                // drag_main_handler_directory.jsxi:239
			fs.renameSync(preview, tmpDir + '/p');                                 // drag_main_handler_directory.jsxi:239
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_directory.jsxi:240
			fs.renameSync(ui, tmpDir + '/u');                                      // drag_main_handler_directory.jsxi:240
		
		AcTools.Utils.FileUtils.Recycle(destination);                              // drag_main_handler_directory.jsxi:242
		fromDirectory_unpack(file, entry.root, destination);                       // drag_main_handler_directory.jsxi:243
		
		if (fs.existsSync(preview))                                                // drag_main_handler_directory.jsxi:245
			fs.removeDirSync(preview);                                             // drag_main_handler_directory.jsxi:245
		
		if (fs.existsSync(ui))                                                     // drag_main_handler_directory.jsxi:246
			fs.removeDirSync(ui);                                                  // drag_main_handler_directory.jsxi:246
		
		if (fs.existsSync(tmpDir + '/p'))                                          // drag_main_handler_directory.jsxi:248
			fs.renameSync(tmpDir + '/p', preview);                                 // drag_main_handler_directory.jsxi:248
		
		if (fs.existsSync(tmpDir + '/u'))                                          // drag_main_handler_directory.jsxi:249
			fs.renameSync(tmpDir + '/u', ui);                                      // drag_main_handler_directory.jsxi:249
		
		fs.removeDirSync(tmpDir);                                                  // drag_main_handler_directory.jsxi:250
		car.loadSkins(callback);                                                   // drag_main_handler_directory.jsxi:252
	}
	
	function fromDirectory(dir){                                                   // drag_main_handler_directory.jsxi:255
		var holder = dir + '/__tmp_' + Date.now();
		
		_holders.push({ stream: fs.createWriteStream(holder), filename: holder });
		
		var tree = fromDirectory_getFiles(dir);
		
		var content = detectContent(dir, tree);
		
		fromDirectory_extractData(dir, content);                                   // drag_main_handler_directory.jsxi:261
		return content.map(function (arg){                                         // drag_main_handler_directory.jsxi:262
			return fromDirectory_prepareFound(dir, arg);                           // drag_main_handler_directory.jsxi:262
		});
	}
	
	Object.defineProperty(DragMainHandler,                                         // drag_main_handler.jsxi:1
		'__DragMainHandler__exec', 
		{
			get: (function (){
				return _exec_inner || (_exec_inner = require('child_process').execFileSync);
			})
		});
	(function (){                                                                  // drag_main_handler.jsxi:105
		_ddId = DragDestination.register('New Car Or Skin',                        // drag_main_handler.jsxi:106
			function (files){                                                      // drag_main_handler.jsxi:106
				var d = new Dialog('Searching',                                    // drag_main_handler.jsxi:107
					[ '<progress indeterminate></progress>' ], 
					false, 
					false);
				
				setTimeout(function (arg){                                         // drag_main_handler.jsxi:111
					d.close();                                                     // drag_main_handler.jsxi:112
					
					try {
						var found = [];
						
						for (var __10 = 0; __10 < files.length; __10 ++){          // drag_main_handler.jsxi:116
							var file = files[__10];
							
							{
								var __v = handle(file);
								
								for (var __u = 0; __u < __v.length; __u ++){
									var entry = __v[__u];
									
									if (entry)                                     // drag_main_handler.jsxi:118
										found.push(entry);                         // drag_main_handler.jsxi:118
								}
								
								__v = undefined;
							}
						}
						
						showDialog(found);                                         // drag_main_handler.jsxi:122
					} catch (err){                                                 // drag_main_handler.jsxi:123
						ErrorHandler.handled('Cannot process dragged files.', err);
					} 
				}, 
				30);
			});
	})();
	return DragMainHandler;
})();

;

;

/* Class "ObjLocalStorage" declaration */
function ObjLocalStorage(key, defaults){                                           // settings.jsxi:1
	this.key = key;                                                                // settings.jsxi:6
	this.defaults = defaults;                                                      // settings.jsxi:7
	this.__ObjLocalStorage_load();
}
ObjLocalStorage.prototype.__ObjLocalStorage_load = function (){                    // settings.jsxi:11
	try {
		this.__ObjLocalStorage__obj = JSON.parse(localStorage[this.key]);          // settings.jsxi:12
	} catch (e){} 
	
	if (!this.__ObjLocalStorage__obj)
		this.__ObjLocalStorage__obj = {};
	
	for (var k in this.defaults)
		if (this.defaults.hasOwnProperty(k)){
			var v = this.defaults[k];
			
			if (typeof v === 'object' && v != null && (typeof this.__ObjLocalStorage__obj[k] !== 'object' || this.__ObjLocalStorage__obj[k] == null)){
				this.__ObjLocalStorage__obj[k] = v;                                // settings.jsxi:17
			}
		}
};
ObjLocalStorage.prototype.__ObjLocalStorage_save = function (){                    // settings.jsxi:22
	localStorage[this.key] = JSON.stringify(this.__ObjLocalStorage__obj);          // settings.jsxi:23
};
ObjLocalStorage.prototype.get = function (k){                                      // settings.jsxi:26
	return this.__ObjLocalStorage__obj.hasOwnProperty(k) ? this.__ObjLocalStorage__obj[k] : this.defaults[k];
};
ObjLocalStorage.prototype.set = function (k, val){                                 // settings.jsxi:30
	if (typeof k == 'object'){                                                     // settings.jsxi:31
		for (var n in k){                                                          // settings.jsxi:32
			this.__ObjLocalStorage__obj[n] = k[n];                                 // settings.jsxi:33
		}
	} else {
		this.__ObjLocalStorage__obj[k] = val;                                      // settings.jsxi:36
	}
	
	this.__ObjLocalStorage_save();
};
ObjLocalStorage.prototype.update = function (f){                                   // settings.jsxi:42
	f(this.__ObjLocalStorage__obj);                                                // settings.jsxi:43
	this.__ObjLocalStorage_save();
};

var Settings = new ObjLocalStorage('settings',                                     // settings.jsxi:48
	{
		disableTips: false,                                                        // settings.jsxi:49
		updateDatabase: true,                                                      // settings.jsxi:50
		uploadData: false,                                                         // settings.jsxi:51
		updatesCheck: true,                                                        // settings.jsxi:52
		updatesSource: 'stable',                                                   // settings.jsxi:53
		badgeAutoupdate: true,                                                     // settings.jsxi:55
		yearAutoupdate: false,                                                     // settings.jsxi:56
		aptMode: 'default',                                                        // settings.jsxi:58
		aptShowroom: '',                                                           // settings.jsxi:59
		aptFilter: 'AT-Previews Special',                                          // settings.jsxi:60
		aptResize: true,                                                           // settings.jsxi:61
		aptDisableSweetFx: true,                                                   // settings.jsxi:62
		aptCameraX: - 145,                                                         // settings.jsxi:63
		aptCameraY: 36,                                                            // settings.jsxi:64
		aptCameraDistance: 5.5,                                                    // settings.jsxi:65
		aptIncreaseDelays: false,                                                  // settings.jsxi:66
		aptPngMode: false,                                                         // settings.jsxi:67
		aptCameraPosition: '-2.461, 0.836, 5.08',                                  // settings.jsxi:69
		aptCameraLookAt: '0.497, 0.853, 0',                                        // settings.jsxi:70
		aptCameraFov: 30
	});

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
			new Dialog('Add Badge To User Base',                                   // badge_editor.jsxi:15
				[
					'<label>Brand Name: <input value="' + Cars.byId(_currentCarId).data.brand + '"></label>'
				], 
				function (){                                                       // badge_editor.jsxi:17
					fs.copyFileSync(file,                                          // badge_editor.jsxi:18
						DataStorage.getUserContentDir('Badges') + '/' + this.content.find('input').val() + '.png');
					Brands.init();                                                 // badge_editor.jsxi:19
				});
		} catch (err){                                                             // badge_editor.jsxi:21
			callback(err);                                                         // badge_editor.jsxi:22
		} 
	};
	BadgeEditor.autoupdate = function (car, force, callback){                      // badge_editor.jsxi:26
		if (!force && !Settings.get('badgeAutoupdate')){                           // badge_editor.jsxi:27
			if (callback)                                                          // badge_editor.jsxi:28
				callback();                                                        // badge_editor.jsxi:28
			return;
		}
		
		var image = Brands.getBadge(car.data.brand);
		
		if (image){                                                                // badge_editor.jsxi:33
			saveFromLibrary(image,                                                 // badge_editor.jsxi:34
				car.badge,                                                         // badge_editor.jsxi:34
				function (arg){                                                    // badge_editor.jsxi:34
					if (!arg){                                                     // badge_editor.jsxi:35
						car.updateBadge();                                         // badge_editor.jsxi:36
					}
					
					if (callback)                                                  // badge_editor.jsxi:39
						callback(arg);                                             // badge_editor.jsxi:39
				});
		} else {
			if (callback)                                                          // badge_editor.jsxi:42
				callback();                                                        // badge_editor.jsxi:42
		}
	};
	BadgeEditor.start = function (car, callback){                                  // badge_editor.jsxi:46
		if (!car.data)                                                             // badge_editor.jsxi:47
			return;
		
		_currentCarId = car.id;                                                    // badge_editor.jsxi:49
		Brands.init();                                                             // badge_editor.jsxi:50
		
		function cb(e){                                                            // badge_editor.jsxi:52
			if (e){                                                                // badge_editor.jsxi:53
				ErrorHandler.handled('Cannot save badge icon.', e);                // badge_editor.jsxi:54
			} else {
				car.updateBadge();                                                 // badge_editor.jsxi:56
			}
			
			if (callback)                                                          // badge_editor.jsxi:58
				callback();                                                        // badge_editor.jsxi:58
		}
		
		var logosHtml = '',                                                        // badge_editor.jsxi:61
			carBrand = car.data && car.data.brand,                                 // badge_editor.jsxi:62
			carBrandBadge = carBrand && Brands.getBadge(carBrand);                 // badge_editor.jsxi:63
		
		{
			var __1c = Brands.list;
			
			for (var __1b = 0; __1b < __1c.length; __1b ++){
				var brand = __1c[__1b];
				
				var file = Brands.getBadge(brand);
				
				if (file){                                                         // badge_editor.jsxi:66
					logosHtml += '<span class="car-library-element' + (!carBrandBadge && !logosHtml.length || carBrand === brand ? ' selected' : '') + '" data-file="' + file + '" title="' + brand + '" style=\'display:inline-block;width:64px;height:64px;\
                    background:center url("' + file.cssUrl() + '") no-repeat;background-size:54px\'></span>';
				}
			}
			
			__1c = undefined;
		}
		
		var d = new Dialog('Change Badge',                                         // badge_editor.jsxi:73
			[
				'<div style="max-height:70vh;overflow-y:auto;line-height:0">' + logosHtml + '</div>'
			], 
			function (){                                                           // badge_editor.jsxi:75
				saveFromLibrary(this.content.find('.selected').data('file'), car.badge, cb);
			}).addButton('Select File',                                            // badge_editor.jsxi:77
			function (){                                                           // badge_editor.jsxi:77
				var a = document.createElement('input');
				
				a.type = 'file';                                                   // badge_editor.jsxi:79
				a.setAttribute('accept', '.png');                                  // badge_editor.jsxi:80
				a.onchange = function (){                                          // badge_editor.jsxi:81
					if (a.files[0]){                                               // badge_editor.jsxi:82
						BadgeEditor.saveFromFile(a.files[0].path, car.badge, cb);
						d.close();                                                 // badge_editor.jsxi:84
					}
				};
				a.click();                                                         // badge_editor.jsxi:87
				return false;
			}).onEnd(function (arg){                                               // badge_editor.jsxi:89
			DragDestination.unregister(ddId);                                      // badge_editor.jsxi:90
		});
		
		var ddId = DragDestination.register('New Badge',                           // badge_editor.jsxi:93
			function (files){                                                      // badge_editor.jsxi:93
				if (files[0]){                                                     // badge_editor.jsxi:94
					BadgeEditor.saveFromFile(files[0], car.badge, cb);
					d.close();                                                     // badge_editor.jsxi:96
				}
			});
		
		d.el.addClass('dark');                                                     // badge_editor.jsxi:100
		d.content.find('.car-library-element').click(function (){                  // badge_editor.jsxi:101
			$(this.parentNode).find('.selected').removeClass('selected');          // badge_editor.jsxi:102
			this.classList.add('selected');                                        // badge_editor.jsxi:103
		}).dblclick(function (){                                                   // badge_editor.jsxi:104
			d.buttons.find('[data-id="dialog-ok"]')[0].click();                    // badge_editor.jsxi:105
		});
	};
	
	function init(){                                                               // badge_editor.jsxi:109
		Cars.on('update.car.data:brand', BadgeEditor.autoupdate);                  // badge_editor.jsxi:110
	}
	
	(function (){                                                                  // badge_editor.jsxi:114
		$(init);                                                                   // badge_editor.jsxi:115
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

/* Class "JsBatchCallbackProcessor" declaration */
function JsBatchCallbackProcessor(fn){                                             // batch_processing.jsxi:26
	this.__JsBatchCallbackProcessor__fn = fn;                                      // batch_processing.jsxi:30
}
__prototypeExtend(JsBatchCallbackProcessor, 
	AbstractBatchProcessor);
JsBatchCallbackProcessor.prototype.process = function (car, callback){             // batch_processing.jsxi:33
	try {
		this.__JsBatchCallbackProcessor__fn(car, callback);
	} catch (err){                                                                 // batch_processing.jsxi:36
		callback(err);                                                             // batch_processing.jsxi:37
	} 
};

/* Class "ExportDbProcessor" declaration */
function ExportDbProcessor(){}
__prototypeExtend(ExportDbProcessor, 
	AbstractBatchProcessor);
ExportDbProcessor.prototype.start = function (){                                   // batch_processing.jsxi:48
	this.__ExportDbProcessor_data = { years: {}, countries: {}, authors: {}, urls: {} };
};
ExportDbProcessor.prototype.end = function (){                                     // batch_processing.jsxi:57
	var dir = DataStorage.getUserContentDir('Details (Preload)');
	
	for (var k in this.__ExportDbProcessor_data)
		if (this.__ExportDbProcessor_data.hasOwnProperty(k)){
			var a = this.__ExportDbProcessor_data[k];
			
			fs.writeFileSync(dir + '/' + k + '.json', JSON.stringify(a));          // batch_processing.jsxi:60
		}
};
ExportDbProcessor.prototype.process = function (car, callback){                    // batch_processing.jsxi:64
	if (car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].year)
		this.__ExportDbProcessor_data.years[car.id] = car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].year;
	
	if (car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].country)
		this.__ExportDbProcessor_data.countries[car.id] = car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].country;
	
	if (car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].author && car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].author !== 'Kunos')
		this.__ExportDbProcessor_data.authors[car.id] = car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].author;
	
	if (car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].url)
		this.__ExportDbProcessor_data.urls[car.id] = car[car instanceof ExportDbProcessor ? '__ExportDbProcessor_data' : 'data'].url;
	
	callback();                                                                    // batch_processing.jsxi:69
};

/* Class "BatchProcessing" declaration */
var BatchProcessing = (function (){                                                // batch_processing.jsxi:73
	var BatchProcessing = function (){}, 
		mediator = new Mediator(),                                                 // batch_processing.jsxi:74
		_procs;                                                                    // batch_processing.jsxi:76
	
	BatchProcessing.process = function (cars, processor){                          // batch_processing.jsxi:78
		if (!_procs)                                                               // batch_processing.jsxi:79
			init();                                                                // batch_processing.jsxi:79
		
		AppServerRequest.sendDataDisabled = true;                                  // batch_processing.jsxi:80
		
		if (typeof processor === 'string'){                                        // batch_processing.jsxi:82
			for (var __1d = 0; __1d < _procs.length; __1d ++){                     // batch_processing.jsxi:83
				var p = _procs[__1d];
				
				if (p.name === processor){                                         // batch_processing.jsxi:84
					processor = p.proc;                                            // batch_processing.jsxi:85
					
					break;
				}
			}
			
			if (typeof processor === 'string'){                                    // batch_processing.jsxi:90
				ErrorHandler.handled('Processor “' + processor + '” not found.');
				return;
			}
		}
		
		var abort = false;
		
		var d = new Dialog('Batch Processing',                                     // batch_processing.jsxi:98
			[ '<progress></progress>' ], 
			function (){                                                           // batch_processing.jsxi:98
				AppServerRequest.sendDataDisabled = false;                         // batch_processing.jsxi:99
				abort = true;                                                      // batch_processing.jsxi:100
			}, 
			false).setButton('Abort');                                             // batch_processing.jsxi:101
		
		var progress = d.find('progress');
		
		progress[0].max = cars.length;                                             // batch_processing.jsxi:104
		
		var i = 0, k = 0;
		
		function next(){                                                           // batch_processing.jsxi:107
			if (abort)                                                             // batch_processing.jsxi:108
				return;
			
			if (cars[i]){                                                          // batch_processing.jsxi:110
				var j = i ++;
				
				progress[0].value = j;                                             // batch_processing.jsxi:112
				processor.process(cars[j], nextDelayed);                           // batch_processing.jsxi:113
			} else {
				AppServerRequest.sendDataDisabled = false;                         // batch_processing.jsxi:115
				d.close();                                                         // batch_processing.jsxi:116
				processor.end();                                                   // batch_processing.jsxi:117
				mediator.dispatch('end', processor);                               // batch_processing.jsxi:118
			}
		}
		
		function nextDelayed(){                                                    // batch_processing.jsxi:122
			if (++ k < 10){                                                        // batch_processing.jsxi:123
				next();                                                            // batch_processing.jsxi:124
			} else {
				setTimeout(next);                                                  // batch_processing.jsxi:126
				k = 0;                                                             // batch_processing.jsxi:127
			}
		}
		
		mediator.dispatch('start', processor);                                     // batch_processing.jsxi:131
		processor.start();                                                         // batch_processing.jsxi:132
		next();                                                                    // batch_processing.jsxi:133
	};
	BatchProcessing.add = function (name, proc){                                   // batch_processing.jsxi:136
		if (!_procs)                                                               // batch_processing.jsxi:137
			_procs = [];                                                           // batch_processing.jsxi:137
		
		_procs.push({ name: name, proc: proc });                                   // batch_processing.jsxi:138
	};
	BatchProcessing.select = function (cars){                                      // batch_processing.jsxi:141
		if (!_procs)                                                               // batch_processing.jsxi:142
			init();                                                                // batch_processing.jsxi:142
		
		new Dialog('Batch Processing',                                             // batch_processing.jsxi:143
			[
				'<h6>Cars</h6>',                                                   // batch_processing.jsxi:144
				cars.length + ' cars to process',                                  // batch_processing.jsxi:145
				'<h6>Processor</h6>',                                              // batch_processing.jsxi:146
				'<select>' + _procs.map(function (e, i){                           // batch_processing.jsxi:147
					return '<option value="' + i + '">' + e.name + '</option>';    // batch_processing.jsxi:147
				}) + '</select>', 
				'<div id="proc-options"></div>',                                   // batch_processing.jsxi:148
				'If you have any ideas about different processors, you can use Feedback Form in Settings.'
			], 
			function (){                                                           // batch_processing.jsxi:150
				setTimeout((function (){                                           // batch_processing.jsxi:151
					BatchProcessing.process(cars, _procs[this.find('select').val()].proc);
				}).bind(this));                                                    // batch_processing.jsxi:153
			}).find('select').val(0);                                              // batch_processing.jsxi:154
	};
	
	function init(){                                                               // batch_processing.jsxi:157
		BatchProcessing.add('Add missing brand names to car names',                // batch_processing.jsxi:158
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:158
				if (!car.data || !car.data.name || !car.data.brand)                // batch_processing.jsxi:159
					return;
				
				if (car.data.brand === 'Various')                                  // batch_processing.jsxi:161
					return;
				
				if (Brands.nameContains(car.data.name, car.data.brand))            // batch_processing.jsxi:162
					return;
				
				car.changeData('name',                                             // batch_processing.jsxi:164
					Brands.toNamePart(car.data.brand) + ' ' + car.data.name);      // batch_processing.jsxi:164
			}));
		BatchProcessing.add('Remove brand names from car names',                   // batch_processing.jsxi:167
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:167
				if (!car.data || !car.data.name || !car.data.brand)                // batch_processing.jsxi:168
					return;
				
				if (!Brands.nameContains(car.data.name, car.data.brand))           // batch_processing.jsxi:170
					return;
				
				car.changeData('name',                                             // batch_processing.jsxi:172
					car.data.name.substr(Brands.toNamePart(car.data.brand).length + 1));
			}));
		BatchProcessing.add('Add missing years to car names',                      // batch_processing.jsxi:175
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:175
				if (!car.data || !car.data.name || !car.data.year)                 // batch_processing.jsxi:176
					return;
				
				if (car.data.brand === 'Various')                                  // batch_processing.jsxi:178
					return;
				
				if (Years.nameContains(car.data.name))                             // batch_processing.jsxi:179
					return;
				
				car.changeData('name',                                             // batch_processing.jsxi:181
					car.data.name + ' \'' + ('' + car.data.year).slice(- 2));      // batch_processing.jsxi:181
			}));
		BatchProcessing.add('Remove years from car names',                         // batch_processing.jsxi:184
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:184
				if (!car.data || !car.data.name)                                   // batch_processing.jsxi:185
					return;
				
				if (!Years.nameContains(car.data.name))                            // batch_processing.jsxi:187
					return;
				
				car.changeData('name', Years.removeFromName(car.data.name));       // batch_processing.jsxi:188
			}));
		BatchProcessing.add('Lowercase classes',                                   // batch_processing.jsxi:191
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:191
				if (!car.data || !car.data.class)                                  // batch_processing.jsxi:192
					return;
				
				car.changeData('class', car.data.class.toLowerCase());             // batch_processing.jsxi:193
			}));
		BatchProcessing.add('Lowercase & fix tags',                                // batch_processing.jsxi:196
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:196
				if (!car.data || !car.data.tags)                                   // batch_processing.jsxi:197
					return;
				
				var temp = 0,                                                      // batch_processing.jsxi:198
					tags = car.data.tags.map(function (raw){                       // batch_processing.jsxi:199
						var tag = raw;
						
						if (/^(?:#(a\d+)|([aA]\d+))$/.test(tag)){                  // batch_processing.jsxi:201
							tag = '#' + (RegExp.$1 || RegExp.$2).toUpperCase();    // batch_processing.jsxi:202
						} else {
							tag = Countries.fixTag(raw.toLowerCase());             // batch_processing.jsxi:204
						}
						
						if (tag === raw){                                          // batch_processing.jsxi:207
							temp ++;                                               // batch_processing.jsxi:208
						}
						return tag;                                                // batch_processing.jsxi:211
					});
				
				if (temp !== car.data.tags.length){                                // batch_processing.jsxi:214
					car.changeData('tags', tags);                                  // batch_processing.jsxi:215
				}
			}));
		BatchProcessing.add('Remove logo.png',                                     // batch_processing.jsxi:219
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:219
				if (fs.existsSync(car.path + '/logo.png')){                        // batch_processing.jsxi:220
					fs.unlinkSync(car.path + '/logo.png');                         // batch_processing.jsxi:221
				}
			}));
		BatchProcessing.add('Replace logo.png by ui/badge.png',                    // batch_processing.jsxi:225
			new JsBatchProcessor(function (car){                                   // batch_processing.jsxi:225
				if (!fs.existsSync(car.badge))                                     // batch_processing.jsxi:226
					return;
				
				fs.writeFileSync(car.path + '/logo.png', fs.readFileSync(car.badge));
			}));
		BatchProcessing.add('Set default badges',                                  // batch_processing.jsxi:230
			new JsBatchCallbackProcessor(function (car, callback){                 // batch_processing.jsxi:230
				BadgeEditor.autoupdate(car, true, 
					callback);                                                     // batch_processing.jsxi:231
			}));
		
		if (localStorage.developerMode)                                            // batch_processing.jsxi:234
			BatchProcessing.add('Export database', new ExportDbProcessor());
	}
	
	(function (){                                                                  // batch_processing.jsxi:237
		mediator.extend(BatchProcessing);                                          // batch_processing.jsxi:238
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
			ErrorHandler.handled('Solutions for “' + errorId + '” not found.');    // restoration_wizard.jsxi:21
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
			new Dialog('Add Upgrade Icon To User Base',                            // upgrade_editor.jsxi:99
				[
					'<label>Name: <input value="' + path.basename(filename, '.png') + '"></label>'
				], 
				function (){                                                       // upgrade_editor.jsxi:101
					fs.copyFileSync(file,                                          // upgrade_editor.jsxi:102
						DataStorage.getUserContentDir('Upgrades') + '/' + this.content.find('input').val() + '.png');
					Brands.init();                                                 // upgrade_editor.jsxi:103
				});
		} catch (err){                                                             // upgrade_editor.jsxi:105
			callback(err);                                                         // upgrade_editor.jsxi:106
		} 
	};
	UpgradeEditor.start = function (car, callback){                                // upgrade_editor.jsxi:110
		function cb(e){                                                            // upgrade_editor.jsxi:111
			if (e){                                                                // upgrade_editor.jsxi:112
				ErrorHandler.handled('Cannot save upgrade icon.', e);              // upgrade_editor.jsxi:113
			} else {
				car.updateUpgrade();                                               // upgrade_editor.jsxi:115
			}
			
			if (callback)                                                          // upgrade_editor.jsxi:117
				callback();                                                        // upgrade_editor.jsxi:117
		}
		
		var d = new Dialog('Upgrade Icon Editor',                                  // upgrade_editor.jsxi:120
			[
				'<div class="left"><h6>Current</h6><img class="car-upgrade"></div>', 
				'<div class="right"><h6>New</h6><div id="car-upgrade-editor"></div></div>', 
				'<p><i>Ctrl+I: Italic, Ctrl+B: Bold</i></p>'
			], 
			function (){                                                           // upgrade_editor.jsxi:124
				var label = this.content.find('#car-upgrade-editor')[0].innerHTML;
				
				car.data.upgradeLabel = $('#editable-focus').html();               // upgrade_editor.jsxi:126
				
				if (!car.changed){                                                 // upgrade_editor.jsxi:127
					car.save();                                                    // upgrade_editor.jsxi:128
				}
				
				saveFromHtml(label, car.upgrade, cb);                              // upgrade_editor.jsxi:130
			}).addButton('Select File',                                            // upgrade_editor.jsxi:131
			function (){                                                           // upgrade_editor.jsxi:131
				var a = document.createElement('input');
				
				a.type = 'file';                                                   // upgrade_editor.jsxi:133
				a.setAttribute('accept', '.png');                                  // upgrade_editor.jsxi:134
				a.onchange = function (){                                          // upgrade_editor.jsxi:135
					if (a.files[0]){                                               // upgrade_editor.jsxi:136
						UpgradeEditor.saveFromFile(a.files[0].path, car.upgrade, cb);
						d.close();                                                 // upgrade_editor.jsxi:138
					}
				};
				a.click();                                                         // upgrade_editor.jsxi:141
				return false;
			}).onEnd(function (arg){                                               // upgrade_editor.jsxi:143
			DragDestination.unregister(ddId);                                      // upgrade_editor.jsxi:144
		});
		
		var ddId = DragDestination.register('New Upgrade Icon',                    // upgrade_editor.jsxi:147
			function (files){                                                      // upgrade_editor.jsxi:147
				if (files[0]){                                                     // upgrade_editor.jsxi:148
					UpgradeEditor.saveFromFile(files[0], car.upgrade, cb);
					d.close();                                                     // upgrade_editor.jsxi:150
				}
			});
		
		d.el.addClass('dark');                                                     // upgrade_editor.jsxi:154
		
		if (fs.existsSync(car.upgrade)){                                           // upgrade_editor.jsxi:155
			d.content.find('img').attr('src', car.upgrade);                        // upgrade_editor.jsxi:156
		} else {
			d.content.find('.left').remove();                                      // upgrade_editor.jsxi:158
		}
		
		d.content.find('#car-upgrade-editor').append(editable(car.data.upgradeLabel || 'S1'));
		focus(d.content.find('#editable-focus')[0]);                               // upgrade_editor.jsxi:162
		
		var upgradesLib = DataStorage.readContentDir('Upgrades', 'png');
		
		var upgradesLibHtml = '';
		
		for (var name in upgradesLib)                                              // upgrade_editor.jsxi:166
			if (upgradesLib.hasOwnProperty(name)){                                 // upgrade_editor.jsxi:166
				var file = upgradesLib[name];
				
				upgradesLibHtml += '<span class="car-library-element' + (upgradesLibHtml.length ? '' : ' selected') + '" data-file="' + file + '" title="' + name + '" style=\'display:inline-block;width:74px;height:74px;\
                    background:center url("' + file.cssUrl() + '") no-repeat;background-size:64px\'></span>';
			}
		
		var t = d.addTab('Library',                                                // upgrade_editor.jsxi:171
			upgradesLibHtml,                                                       // upgrade_editor.jsxi:171
			function (){                                                           // upgrade_editor.jsxi:171
				saveFromLibrary(t.content.find('.selected').data('file'), car.upgrade, cb);
			}).setButton('Select').addButton('Cancel');                            // upgrade_editor.jsxi:173
		
		t.content.css('margin', '10px 0');                                         // upgrade_editor.jsxi:174
		t.find('.car-library-element').click(function (){                          // upgrade_editor.jsxi:175
			$(this.parentNode).find('.selected').removeClass('selected');          // upgrade_editor.jsxi:176
			this.classList.add('selected');                                        // upgrade_editor.jsxi:177
		}).dblclick(function (){                                                   // upgrade_editor.jsxi:178
			t.buttons.find('[data-id="dialog-ok"]')[0].click();                    // upgrade_editor.jsxi:179
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
	ErrorHandler.handled('Cannot fix error: ' + this.__errorId + '.', err);        // abstract_fixer.jsxi:41
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
					
					for (var __1e = 0; __1e < __that.__simularErrors.length; __1e ++){
						var simularError = __that.__simularErrors[__1e];
						
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
		
		for (var __1f = 0; __1f < s.length; __1f ++){                              // abstract_fixer.jsxi:140
			var d = s[__1f];
			
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
	Notification.info('Done', 'Obsolete section “DATA” in aero.ini removed.');     // error_acd_file.jsxi:4
	c();                                                                           // error_acd_file.jsxi:5
};
Object.defineProperty(AcdAeroDataSectionFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Obsolete section “DATA” in aero.ini';                          // error_acd_file.jsxi:8
		})
	});
Object.defineProperty(AcdAeroDataSectionFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Remove section',                                        // error_acd_file.jsxi:10
					fn: __bindOnce(this, '__AcdAeroDataSectionFixer_removeSection')
				}
			];
		})
	});

RestorationWizard.register('acd-obsolete-aero-data', AcdAeroDataSectionFixer);     // error_acd_file.jsxi:14

/* Class "AcdInvalidWeightFixer" declaration */
function AcdInvalidWeightFixer(){                                                  // error_acd_file.jsxi:16
	AbstractFixer.apply(this, 
		arguments);
}
__prototypeExtend(AcdInvalidWeightFixer, 
	AbstractFixer);
AcdInvalidWeightFixer.prototype.__AcdInvalidWeightFixer_changeWeight = function (c){
	this.__car.changeDataSpecs('weight',                                           // error_acd_file.jsxi:18
		AcTools.Utils.DataFixer.GetWeight(this.__car.path) + 'kg');                // error_acd_file.jsxi:18
	Notification.info('Done', 'Weight changed, don\'t forget to save.');           // error_acd_file.jsxi:19
	c();                                                                           // error_acd_file.jsxi:20
};
Object.defineProperty(AcdInvalidWeightFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Obsolete section “DATA” in aero.ini';                          // error_acd_file.jsxi:23
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
				}
			];
		})
	});

RestorationWizard.register('acd-invalid-weight', AcdInvalidWeightFixer);           // error_acd_file.jsxi:30

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
	AcTools.Utils.Kn5Fixer.FixSuspension(AcDir.root, this.__car.id);               // error_kn5_file.jsxi:3
	Notification.info('Done',                                                      // error_kn5_file.jsxi:4
		'Suspension fixed, empty placeholders have been added.');                  // error_kn5_file.jsxi:4
	c();                                                                           // error_kn5_file.jsxi:5
};
Object.defineProperty(Kn5SuspXxErrorFixer.prototype, 
	'title', 
	{
		get: (function (){
			return 'Car\'s model doesn\'t have a proper suspension.';              // error_kn5_file.jsxi:8
		})
	});
Object.defineProperty(Kn5SuspXxErrorFixer.prototype, 
	'solutions', 
	{
		get: (function (){
			return [
				{
					name: 'Add empty placeholders',                                // error_kn5_file.jsxi:10
					fn: __bindOnce(this, '__Kn5SuspXxErrorFixer_emptyPlaceholders')
				}
			];
		})
	});

RestorationWizard.register('kn5-susp_xx-error', Kn5SuspXxErrorFixer);              // error_kn5_file.jsxi:14

/* Class "SfxBankMissing" declaration */
var SfxBankMissing = (function (){                                                 // error_sfx.jsxi:1
	var SfxBankMissing = function (){                                              // error_sfx.jsxi:1
			AbstractFixer.apply(this, 
				arguments);
		}, 
		_kunosOnly = true;                                                         // error_sfx.jsxi:6
	
	__prototypeExtend(SfxBankMissing, 
		AbstractFixer);
	SfxBankMissing.prototype.__reloadAfter = function (){                          // error_sfx.jsxi:2
		this.__car.loadSfx();                                                      // error_sfx.jsxi:3
	};
	SfxBankMissing.prototype.__SfxBankMissing_replaceSfxBank = function (c){       // error_sfx.jsxi:8
		var __that = this;
		
		new Dialog('Select car',                                                   // error_sfx.jsxi:9
			[
				'<select>' + Cars.list.filter(function (arg){                      // error_sfx.jsxi:10
					return !_kunosOnly || arg.data && arg.data.author === 'Kunos';
				}).map(function (arg){                                             // error_sfx.jsxi:12
					return '<option value="' + arg.id + '">' + arg.displayName + '</option>';
				}) + '</select>'
			], 
			function (arg){                                                        // error_sfx.jsxi:13
				var id = this.content.find('select').val();
				
				var guids = Sfx.getGuidsById(id).replace(/(event:\/cars\/)\w+/g, '$1' + __that.__car.id) + '\n' + Sfx.getDefaultGuids(__that.__car.id);
				
				if (!fs.existsSync(__that.__car.path + '/sfx'))                    // error_sfx.jsxi:16
					fs.mkdirSync(__that.__car.path + '/sfx');                      // error_sfx.jsxi:16
				
				fs.writeFileSync(__that.__car.path + '/sfx/GUIDs.txt', guids);     // error_sfx.jsxi:17
				fs.copyFileSync(Sfx.getBankFilenameById(id),                       // error_sfx.jsxi:18
					__that.__car.path + ('/sfx/' + __that.__car.id + '.bank'));    // error_sfx.jsxi:18
				c();                                                               // error_sfx.jsxi:19
			});
	};
	Object.defineProperty(SfxBankMissing.prototype, 
		'title', 
		{
			get: (function (){
				return 'Car doesn\'t have correct sfx bank.';                      // error_sfx.jsxi:23
			})
		});
	Object.defineProperty(SfxBankMissing.prototype, 
		'solutions', 
		{
			get: (function (){
				return [
					{
						name: 'Use sfx bank from another car (not recommended)', 
						fn: __bindOnce(this, '__SfxBankMissing_replaceSfxBank')
					}
				];
			})
		});
	return SfxBankMissing;
})();

RestorationWizard.register('sfx-bank-missing', SfxBankMissing);                    // error_sfx.jsxi:29

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
	AcTools.Kn5Render.Utils.Kn5RenderWrapper.GenerateLivery(this.__car.path, this.__object.id, this.__object.livery);
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
	
	function outSfxOriginal(car){                                                  // view_details.jsxi:95
		var s = document.getElementById('selected-car-sound');
		
		if (!s)                                                                    // view_details.jsxi:97
			return;
		
		s.value = car.originalSfxDisplayName;                                      // view_details.jsxi:99
		s.parentNode.style.display = car.originalSfx ? null : 'none';              // view_details.jsxi:100
	}
	
	function outDisabled(car){                                                     // view_details.jsxi:103
		$('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');      // view_details.jsxi:104
		$('#selected-car-header').toggleClass('disabled', car.disabled);           // view_details.jsxi:105
	}
	
	function outChanged(car){                                                      // view_details.jsxi:108
		$('#selected-car-header').toggleClass('changed', car.changed);             // view_details.jsxi:109
	}
	
	function outSkins(car){                                                        // view_details.jsxi:112
		if (!car.skins || !car.skins[0]){                                          // view_details.jsxi:113
			$('#selected-car-skins-article').hide();                               // view_details.jsxi:114
			return;
		}
		
		if (!car.selectedSkin){                                                    // view_details.jsxi:118
			car.selectSkin(car.skins[0].id);                                       // view_details.jsxi:119
			return;
		}
		
		setTimeout(function (){                                                    // view_details.jsxi:123
			if (car !== _selected)                                                 // view_details.jsxi:124
				return;
			
			var sa = $('#selected-car-skins-article'),                             // view_details.jsxi:126
				sp = $('#selected-car-preview'),                                   // view_details.jsxi:127
				ss = $('#selected-car-skins');                                     // view_details.jsxi:128
			
			if (car.skins && car.skins[0] && car.selectedSkin){                    // view_details.jsxi:129
				sa.show();                                                         // view_details.jsxi:130
				ss.empty();                                                        // view_details.jsxi:131
				sp.attr({                                                          // view_details.jsxi:133
					'data-id': car.selectedSkin.id,                                // view_details.jsxi:133
					'src': (car.selectedSkin.preview + '?' + Math.random()).cssUrl()
				});
				car.skins.forEach(function (e){                                    // view_details.jsxi:138
					var i = $('<img>').attr({                                      // view_details.jsxi:139
						'data-id': e.id,                                           // view_details.jsxi:139
						'title': e.displayName,                                    // view_details.jsxi:141
						'src': e.livery.cssUrl()
					}).appendTo(ss);                                               // view_details.jsxi:143
					
					if (e === car.selectedSkin){                                   // view_details.jsxi:144
						i.addClass('selected');                                    // view_details.jsxi:145
					}
				});
			} else {
				sa.hide();                                                         // view_details.jsxi:149
			}
		}, 
		50);
	}
	
	function updateParents(car){                                                   // view_details.jsxi:154
		var s = document.getElementById('selected-car-parent');
		
		if (!s)                                                                    // view_details.jsxi:157
			return;
		
		if (car.children.length > 0){                                              // view_details.jsxi:159
			s.parentNode.style.display = 'none';                                   // view_details.jsxi:160
		} else {
			s.parentNode.style.display = null;                                     // view_details.jsxi:162
			s.innerHTML = '<option value="">None</option>' + Cars.list.filter(function (e){
				return e.data && !e.disabled && e.parent == null && e.id != car.id && (!car.parent || car.parent.id != car.id);
			}).map(function (e){                                                   // view_details.jsxi:166
				return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);
			}).join('');                                                           // view_details.jsxi:168
			s.value = car.parent && car.parent.id || '';                           // view_details.jsxi:170
		}
	}
	
	function updateTags(l){                                                        // view_details.jsxi:174
		var t = document.getElementById('tags-filtered');
		
		if (t){                                                                    // view_details.jsxi:177
			document.body.removeChild(t);                                          // view_details.jsxi:178
		}
		
		t = document.body.appendChild(document.createElement('datalist'));         // view_details.jsxi:181
		t.id = 'tags-filtered';                                                    // view_details.jsxi:182
		
		var n = l.map(function (e){                                                // view_details.jsxi:184
			return e.toLowerCase();                                                // view_details.jsxi:185
		});
		
		Cars.tags.forEach(function (v){                                            // view_details.jsxi:188
			if (n.indexOf(v.toLowerCase()) < 0){                                   // view_details.jsxi:189
				t.appendChild(document.createElement('option')).setAttribute('value', v);
			}
		});
	}
	
	function applyTags(){                                                          // view_details.jsxi:195
		if (!_selected || !_selected.data)                                         // view_details.jsxi:196
			return;
		
		Cars.changeData(_selected,                                                 // view_details.jsxi:197
			'tags',                                                                // view_details.jsxi:197
			Array.prototype.map.call(document.querySelectorAll('#selected-car-tags li'), 
				function (a){                                                      // view_details.jsxi:198
					return a.textContent;                                          // view_details.jsxi:198
				}));
		updateTags(_selected.data.tags);                                           // view_details.jsxi:199
	}
	
	function init(){                                                               // view_details.jsxi:202
		Cars.on('scan:ready',                                                      // view_details.jsxi:203
			function (list){                                                       // view_details.jsxi:204
				if (list.length == 0){                                             // view_details.jsxi:205
					outMsg('Hmm...', 'Cars not found');                            // view_details.jsxi:206
				}
				
				$('main').show();                                                  // view_details.jsxi:209
			}).on('error',                                                         // view_details.jsxi:211
			function (car){                                                        // view_details.jsxi:211
				if (_selected != car)                                              // view_details.jsxi:212
					return;
				
				outErrors(car);                                                    // view_details.jsxi:213
			}).on('update.car.badge',                                              // view_details.jsxi:215
			function (car){                                                        // view_details.jsxi:215
				if (_selected != car)                                              // view_details.jsxi:216
					return;
				
				outBadge(car);                                                     // view_details.jsxi:217
			}).on('update.car.data',                                               // view_details.jsxi:219
			function (car){                                                        // view_details.jsxi:219
				if (_selected != car)                                              // view_details.jsxi:220
					return;
				
				outData(car);                                                      // view_details.jsxi:221
			}).on('update.car.sfx:original',                                       // view_details.jsxi:223
			function (car){                                                        // view_details.jsxi:223
				if (_selected != car)                                              // view_details.jsxi:224
					return;
				
				outSfxOriginal(car);                                               // view_details.jsxi:225
			}).on('update.car.skins',                                              // view_details.jsxi:227
			function (car){                                                        // view_details.jsxi:227
				if (_selected != car)                                              // view_details.jsxi:228
					return;
				
				outSkins(car);                                                     // view_details.jsxi:229
			}).on('update.car.disabled',                                           // view_details.jsxi:231
			function (car){                                                        // view_details.jsxi:231
				if (_selected != car)                                              // view_details.jsxi:232
					return;
				
				outDisabled(car);                                                  // view_details.jsxi:233
			}).on('update.car.changed',                                            // view_details.jsxi:235
			function (car){                                                        // view_details.jsxi:235
				if (_selected != car)                                              // view_details.jsxi:236
					return;
				
				outChanged(car);                                                   // view_details.jsxi:237
			});
		ViewList.on('select',                                                      // view_details.jsxi:240
			function (car){                                                        // view_details.jsxi:241
				$('main').show();                                                  // view_details.jsxi:242
				_selected = car;                                                   // view_details.jsxi:244
				car.loadEnsure();                                                  // view_details.jsxi:245
				
				if (car){                                                          // view_details.jsxi:247
					outMsg(null);                                                  // view_details.jsxi:248
				} else {
					return;
				}
				
				outData(car);                                                      // view_details.jsxi:253
				outSfxOriginal(car);                                               // view_details.jsxi:254
				outBadge(car);                                                     // view_details.jsxi:255
				outDisabled(car);                                                  // view_details.jsxi:256
				outChanged(car);                                                   // view_details.jsxi:257
				outErrors(car);                                                    // view_details.jsxi:258
				outSkins(car);                                                     // view_details.jsxi:259
				$('#selected-car-update-data').attr('disabled',                    // view_details.jsxi:261
					car && Cars.databaseContains(car.id) ? null : true);           // view_details.jsxi:261
			});
		$('#selected-car').on('keydown',                                           // view_details.jsxi:265
			function (e){                                                          // view_details.jsxi:266
				if (e.keyCode == 13){                                              // view_details.jsxi:267
					this.blur();                                                   // view_details.jsxi:268
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:272
			function (){                                                           // view_details.jsxi:272
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:273
					return;
				
				this.value = this.value.slice(0, 64);                              // view_details.jsxi:274
				Cars.changeData(_selected, 'name', this.value);                    // view_details.jsxi:275
			});
		$('#selected-car-tags').on('click',                                        // view_details.jsxi:278
			function (e){                                                          // view_details.jsxi:279
				if (e.target.tagName === 'LI' && e.target.offsetWidth - e.offsetX < 20){
					e.target.parentNode.removeChild(e.target);                     // view_details.jsxi:281
					applyTags();                                                   // view_details.jsxi:282
				} else {
					this.querySelector('input').focus();                           // view_details.jsxi:284
				}
			}).on('contextmenu',                                                   // view_details.jsxi:287
			function (e){                                                          // view_details.jsxi:287
				if (!_selected || !_selected.data)                                 // view_details.jsxi:288
					return;
				
				if (e.target.tagName !== 'LI')                                     // view_details.jsxi:289
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:292
					label: 'Filter Tag',                                           // view_details.jsxi:292
					key: 'F',                                                      // view_details.jsxi:292
					click: (function (){                                           // view_details.jsxi:292
						if (!_selected)                                            // view_details.jsxi:293
							return;
						
						ViewList.addFilter('tag:' + e.target.textContent);         // view_details.jsxi:294
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:297
				return false;
			});
		$('#selected-car-tags input').on('change',                                 // view_details.jsxi:301
			function (){                                                           // view_details.jsxi:302
				if (this.value){                                                   // view_details.jsxi:303
					this.parentNode.insertBefore(document.createElement('li'), this).textContent = this.value;
					this.value = '';                                               // view_details.jsxi:305
					applyTags();                                                   // view_details.jsxi:306
				}
			}).on('keydown',                                                       // view_details.jsxi:309
			function (e){                                                          // view_details.jsxi:309
				if (e.keyCode == 8 && this.value == ''){                           // view_details.jsxi:310
					this.parentNode.removeChild(this.parentNode.querySelector('li:last-of-type'));
					applyTags();                                                   // view_details.jsxi:312
				}
			});
		$('#selected-car-desc').elastic().on('change',                             // view_details.jsxi:316
			function (){                                                           // view_details.jsxi:317
				if (!_selected || this.readonly)                                   // view_details.jsxi:318
					return;
				
				Cars.changeData(_selected, 'description', this.value);             // view_details.jsxi:319
			});
		$('#selected-car-brand').on('keydown',                                     // view_details.jsxi:322
			function (e){                                                          // view_details.jsxi:323
				if (e.keyCode == 13){                                              // view_details.jsxi:324
					this.blur();                                                   // view_details.jsxi:325
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:329
			function (e){                                                          // view_details.jsxi:329
				if (!_selected || this.readonly || !this.value)                    // view_details.jsxi:330
					return;
				
				Cars.changeData(_selected, 'brand', this.value);                   // view_details.jsxi:331
			}).on('contextmenu',                                                   // view_details.jsxi:333
			function (e){                                                          // view_details.jsxi:333
				if (!_selected || !_selected.data)                                 // view_details.jsxi:334
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:337
					label: 'Filter Brand',                                         // view_details.jsxi:337
					key: 'F',                                                      // view_details.jsxi:337
					click: (function (){                                           // view_details.jsxi:337
						if (!_selected)                                            // view_details.jsxi:338
							return;
						
						ViewList.addFilter('brand:' + _selected.data.brand);       // view_details.jsxi:339
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:342
				return false;
			});
		$('#selected-car-class').on('keydown',                                     // view_details.jsxi:346
			function (e){                                                          // view_details.jsxi:347
				if (e.keyCode == 13){                                              // view_details.jsxi:348
					this.blur();                                                   // view_details.jsxi:349
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:353
			function (){                                                           // view_details.jsxi:353
				if (!_selected || this.readonly)                                   // view_details.jsxi:354
					return;
				
				Cars.changeData(_selected, 'class', this.value);                   // view_details.jsxi:355
			}).on('contextmenu',                                                   // view_details.jsxi:357
			function (e){                                                          // view_details.jsxi:357
				if (!_selected || !_selected.data || !_selected.data.class)        // view_details.jsxi:358
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:361
					label: 'Filter Class',                                         // view_details.jsxi:361
					key: 'F',                                                      // view_details.jsxi:361
					click: (function (){                                           // view_details.jsxi:361
						if (!_selected)                                            // view_details.jsxi:362
							return;
						
						ViewList.addFilter('class:' + _selected.data.class);       // view_details.jsxi:363
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:366
				return false;
			});
		$('#selected-car-year').on('keydown',                                      // view_details.jsxi:370
			function (e){                                                          // view_details.jsxi:371
				if (e.keyCode == 13){                                              // view_details.jsxi:372
					this.blur();                                                   // view_details.jsxi:373
					return false;
				}
				
				if (e.keyCode == 37){                                              // view_details.jsxi:377
					this.value = + this.value + 1;                                 // view_details.jsxi:378
					return false;
				}
				
				if (e.keyCode == 39){                                              // view_details.jsxi:382
					this.value = + this.value - 1;                                 // view_details.jsxi:383
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:387
			function (){                                                           // view_details.jsxi:387
				if (!_selected || this.readonly)                                   // view_details.jsxi:388
					return;
				
				Cars.changeData(_selected, 'year', this.value);                    // view_details.jsxi:389
			}).on('contextmenu',                                                   // view_details.jsxi:391
			function (e){                                                          // view_details.jsxi:391
				if (!_selected || !_selected.data || !_selected.data.year)         // view_details.jsxi:392
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:395
					label: 'Filter Year',                                          // view_details.jsxi:395
					key: 'F',                                                      // view_details.jsxi:395
					click: (function (){                                           // view_details.jsxi:395
						if (!_selected)                                            // view_details.jsxi:396
							return;
						
						ViewList.addFilter('year:' + _selected.data.year);         // view_details.jsxi:397
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:399
					label: 'Filter Decade',                                        // view_details.jsxi:399
					click: (function (){                                           // view_details.jsxi:399
						if (!_selected)                                            // view_details.jsxi:400
							return;
						
						ViewList.addFilter('year:' + (('' + _selected.data.year).slice(0, - 1) + '?'));
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:404
				return false;
			});
		$('#selected-car-country').on('keydown',                                   // view_details.jsxi:408
			function (e){                                                          // view_details.jsxi:409
				if (e.keyCode == 13){                                              // view_details.jsxi:410
					this.blur();                                                   // view_details.jsxi:411
					return false;
				}
			}).on('change',                                                        // view_details.jsxi:415
			function (){                                                           // view_details.jsxi:415
				if (!_selected || this.readonly)                                   // view_details.jsxi:416
					return;
				
				Cars.changeData(_selected, 'country', this.value);                 // view_details.jsxi:417
			}).on('contextmenu',                                                   // view_details.jsxi:419
			function (e){                                                          // view_details.jsxi:419
				if (!_selected || !_selected.data || !_selected.data.country)      // view_details.jsxi:420
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:423
					label: 'Filter Country',                                       // view_details.jsxi:423
					key: 'F',                                                      // view_details.jsxi:423
					click: (function (){                                           // view_details.jsxi:423
						if (!_selected)                                            // view_details.jsxi:424
							return;
						
						ViewList.addFilter('country:' + _selected.data.country);   // view_details.jsxi:425
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:428
				return false;
			});
		$('#selected-car-parent').on('change',                                     // view_details.jsxi:432
			function (e){                                                          // view_details.jsxi:433
				if (!_selected)                                                    // view_details.jsxi:434
					return;
				
				var t = this, v = this.value || null;
				
				if (v && !fs.existsSync(_selected.upgrade)){                       // view_details.jsxi:437
					UpgradeEditor.start(_selected,                                 // view_details.jsxi:438
						function (arg){                                            // view_details.jsxi:438
							if (fs.existsSync(_selected.upgrade)){                 // view_details.jsxi:439
								fn();                                              // view_details.jsxi:440
							} else {
								t.value = '';                                      // view_details.jsxi:442
							}
						});
				} else {
					fn();                                                          // view_details.jsxi:446
				}
				
				function fn(){                                                     // view_details.jsxi:449
					_selected.changeParent(v);                                     // view_details.jsxi:450
				}
			});
		$('#selected-car-author').on('click',                                      // view_details.jsxi:454
			function (){                                                           // view_details.jsxi:455
				if (!_selected || !_selected.data)                                 // view_details.jsxi:456
					return;
				
				var a, v, u;
				
				var d = new Dialog('In-Game Car Model',                            // view_details.jsxi:460
					[
						'<label>Author: <input id="car-details-edit-author" autocomplete list="authors" placeholder="?" value="' + (_selected.data.author || '') + '"></label>', 
						'<label>Version: <input id="car-details-edit-version" placeholder="?" value="' + (_selected.data.version || '') + '"></label>', 
						'<label>URL: <input id="car-details-edit-url" placeholder="?" value="' + (_selected.data.url || '') + '"></label>'
					], 
					function (){                                                   // view_details.jsxi:464
						if (!_selected)                                            // view_details.jsxi:465
							return;
						
						if (a != null)                                             // view_details.jsxi:466
							_selected.changeData('author', a);                     // view_details.jsxi:466
						
						if (v != null)                                             // view_details.jsxi:467
							_selected.changeData('version', v);                    // view_details.jsxi:467
						
						if (u != null)                                             // view_details.jsxi:468
							_selected.changeData('url', u);                        // view_details.jsxi:468
					});
				
				d.content.find('#car-details-edit-author').change(function (arg){
					return a = this.value;                                         // view_details.jsxi:471
				});
				d.content.find('#car-details-edit-version').change(function (arg){
					return v = this.value;                                         // view_details.jsxi:472
				});
				d.content.find('#car-details-edit-url').change(function (arg){     // view_details.jsxi:473
					return u = this.value;                                         // view_details.jsxi:473
				});
			}).on('dblclick',                                                      // view_details.jsxi:475
			function (){                                                           // view_details.jsxi:475
				if (!_selected || !_selected.data || !_selected.data.url)          // view_details.jsxi:476
					return;
				
				Shell.openItem(_selected.data.url);                                // view_details.jsxi:477
			}).on('contextmenu',                                                   // view_details.jsxi:479
			function (e){                                                          // view_details.jsxi:479
				if (!_selected || !_selected.data || !_selected.data.author)       // view_details.jsxi:480
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:483
					label: 'Filter Author',                                        // view_details.jsxi:483
					key: 'F',                                                      // view_details.jsxi:483
					click: (function (){                                           // view_details.jsxi:483
						if (!_selected)                                            // view_details.jsxi:484
							return;
						
						ViewList.addFilter('author:' + _selected.data.author);     // view_details.jsxi:485
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:488
				return false;
			});
		[
			'bhp',                                                                 // view_details.jsxi:492
			'torque',                                                              // view_details.jsxi:492
			'weight',                                                              // view_details.jsxi:492
			'topspeed',                                                            // view_details.jsxi:492
			'acceleration',                                                        // view_details.jsxi:492
			'pwratio'
		].forEach(function (e){                                                    // view_details.jsxi:492
			$('#selected-car-' + e).on('keydown',                                  // view_details.jsxi:493
				function (e){                                                      // view_details.jsxi:493
					if (e.keyCode == 13){                                          // view_details.jsxi:494
						this.blur();                                               // view_details.jsxi:495
						return false;
					}
				}).on('keyup keydown keypress',                                    // view_details.jsxi:498
				function (e){                                                      // view_details.jsxi:498
					if (e.keyCode == 32){                                          // view_details.jsxi:499
						e.stopPropagation();                                       // view_details.jsxi:500
						
						if (e.type === 'keyup'){                                   // view_details.jsxi:501
							return false;
						}
					}
				}).on('change',                                                    // view_details.jsxi:505
				function (){                                                       // view_details.jsxi:505
					if (!_selected || this.readonly)                               // view_details.jsxi:506
						return;
					
					Cars.changeDataSpecs(_selected, e, this.value);                // view_details.jsxi:507
				});
		});
		$('#selected-car-pwratio').on('dblclick contextmenu',                      // view_details.jsxi:511
			function (e){                                                          // view_details.jsxi:512
				if (!_selected || !_selected.data || this.readonly)                // view_details.jsxi:513
					return;
				
				function r(){                                                      // view_details.jsxi:515
					if (!_selected || this.readonly)                               // view_details.jsxi:516
						return;
					
					_selected.recalculatePwRatio();                                // view_details.jsxi:517
				}
				
				if (e.type === 'dblclick'){                                        // view_details.jsxi:520
					r();                                                           // view_details.jsxi:521
				} else {
					var menu = new gui.Menu();
					
					menu.append(new gui.MenuItem({ label: 'Recalculate', key: 'R', click: r }));
					menu.popup(e.clientX, e.clientY);                              // view_details.jsxi:525
					return false;
				}
			});
		$('#selected-car-logo').on('click',                                        // view_details.jsxi:531
			function (){                                                           // view_details.jsxi:532
				if (!_selected)                                                    // view_details.jsxi:533
					return;
				
				BadgeEditor.start(_selected);                                      // view_details.jsxi:534
			});
		$('#selected-car-upgrade').on('click',                                     // view_details.jsxi:537
			function (){                                                           // view_details.jsxi:538
				if (!_selected)                                                    // view_details.jsxi:539
					return;
				
				UpgradeEditor.start(_selected);                                    // view_details.jsxi:540
			});
		$('#selected-car-skins-article').dblclick(function (e){                    // view_details.jsxi:544
			if (!_selected)                                                        // view_details.jsxi:546
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:547
		}).on('contextmenu',                                                       // view_details.jsxi:549
			function (e){                                                          // view_details.jsxi:549
				if (!_selected)                                                    // view_details.jsxi:550
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:553
					return;
				
				var menu = new gui.Menu();
				
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:557
					label: 'Open in Showroom',                                     // view_details.jsxi:557
					key: 'S',                                                      // view_details.jsxi:557
					click: (function (){                                           // view_details.jsxi:557
						if (!_selected)                                            // view_details.jsxi:558
							return;
						
						AcShowroom.start(_selected, id);                           // view_details.jsxi:559
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:562
					label: 'Open in Custom Showroom (Experimental)',               // view_details.jsxi:562
					click: (function (){                                           // view_details.jsxi:562
						if (!_selected)                                            // view_details.jsxi:563
							return;
						
						try {
							AcTools.Kn5Render.Utils.Kn5RenderWrapper.StartDarkRoomPreview(_selected.path, id);
						} catch (err){                                             // view_details.jsxi:566
							ErrorHandler.handled('Cannot start Custom Showroom.', err);
							return;
						} 
					})
				}));
				
				var driveMenu = new gui.MenuItem({ label: 'Drive', submenu: new gui.Menu() });
				
				menu.append(driveMenu);                                            // view_details.jsxi:573
				driveMenu = driveMenu.submenu;                                     // view_details.jsxi:574
				driveMenu.append(new gui.MenuItem({                                // view_details.jsxi:576
					label: 'Practice',                                             // view_details.jsxi:576
					click: (function (){                                           // view_details.jsxi:576
						AcPractice.start(_selected, id, 'Practice');               // view_details.jsxi:577
					})
				}));
				driveMenu.append(new gui.MenuItem({                                // view_details.jsxi:580
					label: 'Hotlap',                                               // view_details.jsxi:580
					click: (function (){                                           // view_details.jsxi:580
						AcPractice.start(_selected, id, 'Hotlap');                 // view_details.jsxi:581
					})
				}));
				driveMenu.append(new gui.MenuItem({                                // view_details.jsxi:584
					label: 'Race',                                                 // view_details.jsxi:584
					click: (function (){                                           // view_details.jsxi:584
						AcPractice.start(_selected, id, 'Race');                   // view_details.jsxi:585
					})
				}));
				driveMenu.append(new gui.MenuItem({                                // view_details.jsxi:588
					label: 'Drift',                                                // view_details.jsxi:588
					click: (function (){                                           // view_details.jsxi:588
						AcPractice.start(_selected, id, 'Drift');                  // view_details.jsxi:589
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:592
					label: 'Folder',                                               // view_details.jsxi:592
					click: (function (){                                           // view_details.jsxi:592
						if (!_selected)                                            // view_details.jsxi:593
							return;
						
						Shell.openItem(_selected.getSkin(id).path);                // view_details.jsxi:594
					})
				}));
				menu.append(new gui.MenuItem({ type: 'separator' }));              // view_details.jsxi:597
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:599
					label: 'Update Preview',                                       // view_details.jsxi:599
					click: (function (){                                           // view_details.jsxi:599
						if (!_selected)                                            // view_details.jsxi:600
							return;
						
						AcShowroom.shotOne(_selected, id);                         // view_details.jsxi:601
					})
				}));
				
				var autoUpdateLivery = new gui.MenuItem({ label: 'Update Livery', submenu: new gui.Menu() });
				
				menu.append(autoUpdateLivery);                                     // view_details.jsxi:605
				autoUpdateLivery = autoUpdateLivery.submenu;                       // view_details.jsxi:606
				autoUpdateLivery.append(new gui.MenuItem({                         // view_details.jsxi:608
					label: 'From Preview',                                         // view_details.jsxi:608
					click: (function (){                                           // view_details.jsxi:608
						if (!_selected)                                            // view_details.jsxi:609
							return;
						
						var skin = _selected.getSkin(id);
						
						try {
							AcTools.Utils.ImageUtils.GenerateLivery(skin.preview, skin.livery);
							_selected.loadSkins();                                 // view_details.jsxi:613
						} catch (err){                                             // view_details.jsxi:614
							ErrorHandler.handled('Cannot update livery.', err);    // view_details.jsxi:615
							return;
						} 
					})
				}));
				autoUpdateLivery.append(new gui.MenuItem({                         // view_details.jsxi:620
					label: 'With Custom Showroom',                                 // view_details.jsxi:620
					click: (function (){                                           // view_details.jsxi:620
						if (!_selected)                                            // view_details.jsxi:621
							return;
						
						var skin = _selected.getSkin(id);
						
						try {
							AcTools.Kn5Render.Utils.Kn5RenderWrapper.GenerateLivery(_selected.path, skin.id, skin.livery);
							_selected.loadSkins();                                 // view_details.jsxi:625
						} catch (err){                                             // view_details.jsxi:626
							ErrorHandler.handled('Cannot update livery.', err);    // view_details.jsxi:627
							return;
						} 
					})
				}));
				menu.append(new gui.MenuItem({                                     // view_details.jsxi:632
					label: 'Delete skin',                                          // view_details.jsxi:632
					click: (function (){                                           // view_details.jsxi:632
						if (!_selected)                                            // view_details.jsxi:633
							return;
						
						var skin = _selected.getSkin(id);
						
						new Dialog('Delete ' + skin.displayName,                   // view_details.jsxi:636
							'Folder will be removed to the Recycle Bin. Are you sure?', 
							function (arg){                                        // view_details.jsxi:636
								if (!skin)                                         // view_details.jsxi:637
									return;
								
								AcTools.Utils.FileUtils.Recycle(skin.path);        // view_details.jsxi:638
								_selected.loadSkins();                             // view_details.jsxi:639
							});
					})
				}));
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:646
				return false;
			});
		$('#selected-car-skins').on('click',                                       // view_details.jsxi:651
			function (e){                                                          // view_details.jsxi:652
				if (!_selected)                                                    // view_details.jsxi:653
					return;
				
				var id = e.target.getAttribute('data-id');
				
				if (!id)                                                           // view_details.jsxi:656
					return;
				
				_selected.selectSkin(id);                                          // view_details.jsxi:658
			});
		$('#selected-car-error').click(function (e){                               // view_details.jsxi:662
			if (!_selected)                                                        // view_details.jsxi:663
				return;
			
			var id = e.target.getAttribute('data-error-id');
			
			if (id){                                                               // view_details.jsxi:665
				RestorationWizard.fix(_selected, id);                              // view_details.jsxi:666
			}
		});
		$(window).on('keydown',                                                    // view_details.jsxi:671
			function (e){                                                          // view_details.jsxi:672
				if (!_selected)                                                    // view_details.jsxi:673
					return;
				
				if (e.keyCode === 'S'.charCodeAt(0) && e.ctrlKey && e.altKey){     // view_details.jsxi:675
					AcShowroom.shot(_selected, false);                             // view_details.jsxi:676
					return false;
				}
				
				if (e.keyCode === 'D'.charCodeAt(0) && e.ctrlKey && e.altKey){     // view_details.jsxi:680
					try {
						AcTools.Kn5Render.Utils.Kn5RenderWrapper.UpdateAmbientShadows(_selected.path);
					} catch (err){                                                 // view_details.jsxi:683
						ErrorHandler.handled('Cannot update shadows.', err);       // view_details.jsxi:684
						return;
					} 
					return false;
				}
				
				if (e.keyCode === '1'.charCodeAt(0) && e.ctrlKey && e.altKey){     // view_details.jsxi:690
					AcShowroom.shotOne(_selected, _selected.selectedSkin);         // view_details.jsxi:691
					return false;
				}
				
				if (e.keyCode === 'A'.charCodeAt(0) && e.ctrlKey && e.altKey){     // view_details.jsxi:695
					try {
						AcTools.Kn5Render.Utils.Kn5RenderWrapper.UpdateAmbientShadows(_selected.path);
					} catch (err){                                                 // view_details.jsxi:698
						ErrorHandler.handled('Cannot update shadows.', err);       // view_details.jsxi:699
						return;
					} 
					
					AcShowroom.shot(_selected, false);                             // view_details.jsxi:702
					return false;
				}
				
				if (e.keyCode === 'S'.charCodeAt(0) && e.ctrlKey){                 // view_details.jsxi:706
					$(':focus').each(function (arg){                               // view_details.jsxi:707
						return this.blur();                                        // view_details.jsxi:707
					});
					_selected.save();                                              // view_details.jsxi:708
					return false;
				}
				
				if (e.keyCode === 'F'.charCodeAt(0) && e.ctrlKey){                 // view_details.jsxi:712
					UpdateDescription.update(_selected);                           // view_details.jsxi:713
					return false;
				}
				
				if (e.keyCode === 'T'.charCodeAt(0) && e.ctrlKey){                 // view_details.jsxi:717
					_selected.toggle();                                            // view_details.jsxi:718
					return false;
				}
				
				if (e.keyCode === 'B'.charCodeAt(0) && e.ctrlKey && e.shiftKey){   // view_details.jsxi:722
					$('#selected-car-logo')[0].click();                            // view_details.jsxi:723
					return false;
				}
				
				if (e.keyCode === 'U'.charCodeAt(0) && e.ctrlKey && e.shiftKey){   // view_details.jsxi:727
					if (_selected.parent)                                          // view_details.jsxi:728
						$('#selected-car-upgrade')[0].click();                     // view_details.jsxi:728
					return false;
				}
				
				if (localStorage.developerMode && e.keyCode === 'E'.charCodeAt(0) && e.ctrlKey && e.shiftKey){
					_selected.exportDatabase();                                    // view_details.jsxi:733
					return false;
				}
			});
		
		var cmIgnore = false;
		
		$('main').on('contextmenu',                                                // view_details.jsxi:740
			function (){                                                           // view_details.jsxi:741
				this.querySelector('footer').classList.toggle('active');           // view_details.jsxi:742
				cmIgnore = true;                                                   // view_details.jsxi:743
			});
		$(window).on('click contextmenu',                                          // view_details.jsxi:746
			(function (e){                                                         // view_details.jsxi:747
				if (cmIgnore){                                                     // view_details.jsxi:748
					cmIgnore = false;                                              // view_details.jsxi:749
				} else if (e.target !== this){                                     // view_details.jsxi:750
					this.classList.remove('active');                               // view_details.jsxi:751
				}
			}).bind($('main footer')[0]));                                         // view_details.jsxi:753
		$('#selected-car-open-directory').click(function (){                       // view_details.jsxi:756
			if (!_selected)                                                        // view_details.jsxi:757
				return;
			
			Shell.openItem(_selected.path);                                        // view_details.jsxi:758
		});
		$('#selected-car-showroom').click(function (){                             // view_details.jsxi:761
			if (!_selected)                                                        // view_details.jsxi:762
				return;
			
			AcShowroom.start(_selected);                                           // view_details.jsxi:763
		});
		$('#selected-car-showroom-select').click(function (){                      // view_details.jsxi:766
			if (!_selected)                                                        // view_details.jsxi:767
				return;
			
			AcShowroom.select(_selected);                                          // view_details.jsxi:768
		});
		$('#selected-car-practice').click(function (){                             // view_details.jsxi:771
			if (!_selected)                                                        // view_details.jsxi:772
				return;
			
			AcPractice.start(_selected);                                           // view_details.jsxi:773
		});
		$('#selected-car-practice-select').click(function (){                      // view_details.jsxi:776
			if (!_selected)                                                        // view_details.jsxi:777
				return;
			
			AcPractice.select(_selected);                                          // view_details.jsxi:778
		});
		$('#selected-car-reload').click(function (){                               // view_details.jsxi:781
			if (!_selected)                                                        // view_details.jsxi:782
				return;
			
			if (_selected.changed){                                                // view_details.jsxi:784
				new Dialog('Reload',                                               // view_details.jsxi:785
					[ 'Your changes will be lost. Are you sure?' ], 
					reload);                                                       // view_details.jsxi:787
			} else {
				reload();                                                          // view_details.jsxi:789
			}
			
			function reload(){                                                     // view_details.jsxi:792
				if (!_selected)                                                    // view_details.jsxi:793
					return;
				
				_selected.reload();                                                // view_details.jsxi:794
			}
		});
		$('#selected-car-test').click(function (){                                 // view_details.jsxi:798
			if (!_selected)                                                        // view_details.jsxi:799
				return;
			
			_selected.testAcd();                                                   // view_details.jsxi:800
		});
		$('#selected-car-save').click(function (){                                 // view_details.jsxi:804
			if (!_selected)                                                        // view_details.jsxi:805
				return;
			
			_selected.save();                                                      // view_details.jsxi:806
		});
		$('#selected-car-update-data').click(function (){                          // view_details.jsxi:809
			if (!_selected)                                                        // view_details.jsxi:810
				return;
			
			var updated = Cars.fromDatabase(_selected.id);
			
			if (!updated){                                                         // view_details.jsxi:813
				return Notification.warn('Error', 'Data is missing.');             // view_details.jsxi:814
			}
			
			var fields = [];
			
			for (var k in updated)                                                 // view_details.jsxi:818
				if (updated.hasOwnProperty(k)){                                    // view_details.jsxi:818
					var v = updated[k];
					
					if (JSON.stringify(v) === JSON.stringify(_selected.data[k])){
						continue;
					}
					
					fields.push({ key: k, value: v });                             // view_details.jsxi:823
				}
			
			if (fields.length === 0){                                              // view_details.jsxi:826
				return Notification.warn('Error', 'Nothing to update.');           // view_details.jsxi:827
			}
			
			var d = new Dialog('Update Data',                                      // view_details.jsxi:830
				[
					'<h6>Select fields to update</h6>',                            // view_details.jsxi:831
					fields.map(function (arg){                                     // view_details.jsxi:832
						return '<label><input data-key="' + arg.key + '" type="checkbox" checked>' + (arg.key === 'url' ? 'URL' : arg.key[0].toUpperCase() + arg.key.slice(1).replace(/(?=[A-Z])/g, ' ')) + '</label>';
					}).join('')
				], 
				function (){                                                       // view_details.jsxi:835
					if (!_selected)                                                // view_details.jsxi:836
						return;
					
					this.content.find(':checked').each(function (arg){             // view_details.jsxi:838
						var k = this.getAttribute('data-key');
						
						_selected.changeData(k, updated[k], true);                 // view_details.jsxi:840
					});
				});
		});
		$('#selected-car-update-description').click(function (){                   // view_details.jsxi:845
			if (!_selected)                                                        // view_details.jsxi:846
				return;
			
			UpdateDescription.update(_selected);                                   // view_details.jsxi:847
		});
		$('#selected-car-update-previews').click(function (){                      // view_details.jsxi:850
			if (!_selected)                                                        // view_details.jsxi:851
				return;
			
			AcShowroom.shot(_selected);                                            // view_details.jsxi:852
		});
		$('#selected-car-update-previews-manual').click(function (){               // view_details.jsxi:855
			if (!_selected)                                                        // view_details.jsxi:856
				return;
			
			AcShowroom.shot(_selected, true);                                      // view_details.jsxi:857
		});
		$('#selected-car-disable').click(function (){                              // view_details.jsxi:860
			if (!_selected)                                                        // view_details.jsxi:861
				return;
			
			_selected.toggle();                                                    // view_details.jsxi:862
		});
		$('#selected-car-additional').on('click contextmenu',                      // view_details.jsxi:865
			function (e){                                                          // view_details.jsxi:865
				if (!_selected)                                                    // view_details.jsxi:866
					return;
				
				var menu = new gui.Menu();
				
				function add(label, fn, to){                                       // view_details.jsxi:870
					if (to === undefined)                                          // view_details.jsxi:870
						to = menu;                                                 // view_details.jsxi:870
				
					to.append(new gui.MenuItem({                                   // view_details.jsxi:871
						label: label,                                              // view_details.jsxi:871
						click: (function (){                                       // view_details.jsxi:871
							$('main footer').removeClass('active');                // view_details.jsxi:872
							
							if (_selected)                                         // view_details.jsxi:873
								fn();                                              // view_details.jsxi:873
						})
					}));
				}
				
				add('Update Ambient Shadows',                                      // view_details.jsxi:877
					function (){                                                   // view_details.jsxi:877
						try {
							AcTools.Kn5Render.Utils.Kn5RenderWrapper.UpdateAmbientShadows(_selected.path);
						} catch (err){                                             // view_details.jsxi:880
							ErrorHandler.handled('Cannot update shadows.', err);   // view_details.jsxi:881
							return;
						} 
					});
				add('Change Body Ambient Shadow Size',                             // view_details.jsxi:886
					function (){                                                   // view_details.jsxi:886
						var currentSize = AcTools.Kn5Render.Utils.Kn5RenderWrapper.GetBodyAmbientShadowSize(_selected.path).split(',');
						
						var d = new Dialog('Body Ambient Shadow',                  // view_details.jsxi:888
							[
								'<h6>Size (in meters)</h6>',                       // view_details.jsxi:889
								'<label style="display:inline-block;width:160px;line-height:24px">Width: <input id="body-ambient-shadow-width" type="number" step="0.1" min="0.8" max="6.0" style="width: 80px;float: right;margin-right: 20px;"></label>', 
								'<label style="display:inline-block;width:160px;line-height:24px">Length: <input id="body-ambient-shadow-height" type="number" step="0.1" min="0.8" max="6.0" style="width: 80px;float: right;margin-right: 20px;"></label>'
							], 
							function (){                                           // view_details.jsxi:892
								var w = + d.content.find('#body-ambient-shadow-width').val();
								
								if (Number.isNaN(w))                               // view_details.jsxi:894
									w = currentSize[0];                            // view_details.jsxi:894
								
								var h = + d.content.find('#body-ambient-shadow-height').val();
								
								if (Number.isNaN(h))                               // view_details.jsxi:897
									h = currentSize[1];                            // view_details.jsxi:897
								
								AcTools.Kn5Render.Utils.Kn5RenderWrapper.SetBodyAmbientShadowSize(_selected.path, w, h);
							});
						
						d.content.find('#body-ambient-shadow-width').val(currentSize[0]);
						d.content.find('#body-ambient-shadow-height').val(currentSize[1]);
					});
				add('Fix LR/HR nodes',                                             // view_details.jsxi:906
					function (){                                                   // view_details.jsxi:906
						try {
							AcTools.Utils.Kn5Fixer.FixLrHrNodes(AcDir.root, _selected.id);
						} catch (err){                                             // view_details.jsxi:909
							ErrorHandler.handled('Cannot fix car.', err);          // view_details.jsxi:910
							return;
						} 
					});
				add('Fix blurred wheels',                                          // view_details.jsxi:915
					function (){                                                   // view_details.jsxi:915
						try {
							AcTools.Utils.Kn5Fixer.FixBlurredWheels(AcDir.root, _selected.id);
						} catch (err){                                             // view_details.jsxi:918
							ErrorHandler.handled('Cannot fix car.', err);          // view_details.jsxi:919
							return;
						} 
					});
				
				if (localStorage.developerMode){                                   // view_details.jsxi:924
					var devMenu = new gui.MenuItem({ label: 'Developer Tools', submenu: new gui.Menu() });
					
					menu.append(devMenu);                                          // view_details.jsxi:926
					devMenu = devMenu.submenu;                                     // view_details.jsxi:927
					add('Export to database',                                      // view_details.jsxi:929
						function (){                                               // view_details.jsxi:929
							_selected.exportDatabase();                            // view_details.jsxi:930
						}, 
						devMenu);                                                  // view_details.jsxi:931
					add('Fix SUSP_XX error',                                       // view_details.jsxi:933
						function (){                                               // view_details.jsxi:933
							try {
								AcTools.Utils.Kn5Fixer.FixSuspension(AcDir.root, _selected.id);
							} catch (err){                                         // view_details.jsxi:936
								ErrorHandler.handled('Cannot fix car.', err);      // view_details.jsxi:937
								return;
							} 
						}, 
						devMenu);                                                  // view_details.jsxi:940
					add('Unpack KN5',                                              // view_details.jsxi:942
						function (){                                               // view_details.jsxi:942
							try {
								var kn5 = AcTools.Kn5File.Kn5.FromFile(AcTools.Utils.FileUtils.GetMainCarFile(AcDir.root, _selected.id));
								
								var dest = _selected.path + '/unpacked';
								
								if (fs.existsSync(dest))                           // view_details.jsxi:946
									AcTools.Utils.FileUtils.Recycle(dest);         // view_details.jsxi:946
								
								kn5.ExportDirectory(dest, false);                  // view_details.jsxi:947
								
								if (kn5.RootNode != null){                         // view_details.jsxi:948
									kn5.Export(AcTools.Kn5File.Kn5.ExportType.Collada, dest + '/model.dae');
								}
								
								Shell.openItem(dest);                              // view_details.jsxi:951
							} catch (err){                                         // view_details.jsxi:952
								ErrorHandler.handled('Failed.', err);              // view_details.jsxi:953
							} 
						}, 
						devMenu);                                                  // view_details.jsxi:955
					
					if (fs.existsSync(_selected.path + '/unpacked'))               // view_details.jsxi:957
						add('Repack KN5',                                          // view_details.jsxi:957
							function (){                                           // view_details.jsxi:957
								try {
									var kn5 = AcTools.Kn5File.Kn5.FromDirectory(_selected.path + '/unpacked', false);
									
									var dest = AcTools.Utils.FileUtils.GetMainCarFile(AcDir.root, _selected.id);
									
									if (fs.existsSync(dest))                       // view_details.jsxi:961
										AcTools.Utils.FileUtils.Recycle(dest);     // view_details.jsxi:961
									
									kn5.Save(dest, false);                         // view_details.jsxi:962
								} catch (err){                                     // view_details.jsxi:963
									ErrorHandler.handled('Failed.', err);          // view_details.jsxi:964
								} 
							}, 
							devMenu);                                              // view_details.jsxi:966
					
					if (fs.existsSync(_selected.path + '/data.acd'))               // view_details.jsxi:968
						add('Unpack data',                                         // view_details.jsxi:968
							function (){                                           // view_details.jsxi:968
								try {
									function go(){                                 // view_details.jsxi:970
										acd.ExportDirectory(dest);                 // view_details.jsxi:971
										Shell.openItem(dest);                      // view_details.jsxi:972
									}
									
									var source = _selected.path + '/data.acd';
									
									var acd = AcTools.AcdFile.Acd.FromFile(source);
									
									var dest = _selected.path + '/data';
									
									if (fs.existsSync(dest)){                      // view_details.jsxi:978
										new Dialog('Unpack data.acd',              // view_details.jsxi:979
											'Folder “data” already exists and will be moved to Recycle Bin. Are you sure?', 
											function (arg){                        // view_details.jsxi:979
												AcTools.Utils.FileUtils.Recycle(dest);
												go();                              // view_details.jsxi:981
											});
									} else
										go();                                      // view_details.jsxi:983
								} catch (err){                                     // view_details.jsxi:984
									ErrorHandler.handled('Failed.', err);          // view_details.jsxi:985
								} 
							}, 
							devMenu);                                              // view_details.jsxi:987
					
					if (fs.existsSync(_selected.path + '/data'))                   // view_details.jsxi:989
						add('Pack data',                                           // view_details.jsxi:989
							function (){                                           // view_details.jsxi:989
								if (_selected.data.author == 'Kunos'){             // view_details.jsxi:990
									new Dialog('Warning',                          // view_details.jsxi:991
										'You\'re going to repack Kunos car. Some of them can\'t be packed 100%-correctly right now, so you could lose access to online mode even if there is no changes. Are you sure?', 
										fn).setWarningColor();                     // view_details.jsxi:991
								} else
									fn();                                          // view_details.jsxi:992
								
								function fn(){                                     // view_details.jsxi:994
									try {
										function go(){                             // view_details.jsxi:996
											acd.Save(dest);                        // view_details.jsxi:997
										}
										
										var source = _selected.path + '/data';
										
										var acd = AcTools.AcdFile.Acd.FromDirectory(source);
										
										var dest = _selected.path + '/data.acd';
										
										if (fs.existsSync(dest)){                  // view_details.jsxi:1003
											new Dialog('Pack data',                // view_details.jsxi:1004
												'File “data.acd” already exists and will be moved to Recycle Bin. Are you sure?', 
												function (arg){                    // view_details.jsxi:1004
													AcTools.Utils.FileUtils.Recycle(dest);
													go();                          // view_details.jsxi:1006
												});
										} else
											go();                                  // view_details.jsxi:1008
									} catch (err){                                 // view_details.jsxi:1010
										ErrorHandler.handled('Failed.', err);      // view_details.jsxi:1011
									} 
								}
							}, 
							devMenu);                                              // view_details.jsxi:1014
				}
				
				add('Delete car',                                                  // view_details.jsxi:1017
					function (){                                                   // view_details.jsxi:1017
						new Dialog('Delete ' + _selected.displayName,              // view_details.jsxi:1018
							'Folder will be removed to the Recycle Bin. Are you sure?', 
							function (arg){                                        // view_details.jsxi:1018
								if (!_selected)                                    // view_details.jsxi:1019
									return;
								
								Cars.remove(_selected);                            // view_details.jsxi:1020
							});
					});
				menu.popup(e.clientX, e.clientY);                                  // view_details.jsxi:1024
				return false;
			});
	}
	
	(function (){                                                                  // view_details.jsxi:1029
		$(init);                                                                   // view_details.jsxi:1030
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
		_sortFn = {                                                                // view_list.jsxi:133
			id: (function (a, b){                                                  // view_list.jsxi:133
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.id.localeCompare(b.id);
			}), 
			displayName: (function (a, b){                                         // view_list.jsxi:137
				return !a.disabled && b.disabled ? - 1 : a.disabled && !b.disabled ? 1 : a.displayName.localeCompare(b.displayName);
			})
		}, 
		sortingEnabled = true;                                                     // view_list.jsxi:141
	
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
		if (typeof car === 'string')                                               // view_list.jsxi:26
			car = Cars.byId(car);                                                  // view_list.jsxi:26
		
		_selected = car;                                                           // view_list.jsxi:28
		_node.find('.expand').removeClass('expand');                               // view_list.jsxi:29
		_node.find('.selected').removeClass('selected');                           // view_list.jsxi:30
		
		if (car){                                                                  // view_list.jsxi:32
			localStorage.selectedCar = car.id;                                     // view_list.jsxi:33
			
			var n = _node.find('[data-id="' + car.id + '"]').addClass('expand').parent().addClass('selected')[0];
			
			if (car.parent){                                                       // view_list.jsxi:36
				n = _node.find('[data-id="' + car.parent.id + '"]').addClass('expand')[0];
			}
			
			scrollToSelected();                                                    // view_list.jsxi:40
		}
		
		mediator.dispatch('select', car);                                          // view_list.jsxi:43
	};
	ViewList.selectNear = function (d){                                            // view_list.jsxi:46
		if (d === undefined)                                                       // view_list.jsxi:46
			d = 0;                                                                 // view_list.jsxi:46
	
		if (!_selected)                                                            // view_list.jsxi:47
			return ViewList.select(Cars.list[0]);
		
		var n = _node[0].querySelectorAll('[data-id]');
		
		for (var p, i = 0; i < n.length; i ++){                                    // view_list.jsxi:50
			if (n[i].getAttribute('data-id') === _selected.id){                    // view_list.jsxi:51
				p = i;                                                             // view_list.jsxi:52
				
				break;
			}
		}
		
		if (p == null)                                                             // view_list.jsxi:57
			return;
		
		if (d === 0)                                                               // view_list.jsxi:58
			d = p === n.length - 1 ? - 1 : 1;                                      // view_list.jsxi:58
		
		var j = n[(p + d + n.length) % n.length].getAttribute('data-id');
		
		ViewList.select(Cars.byName(j));
	};
	ViewList.filter = function (v){                                                // view_list.jsxi:63
		var i = _aside.find('#cars-list-filter')[0];
		
		if (i.value != v){                                                         // view_list.jsxi:65
			i.value = v;                                                           // view_list.jsxi:66
		}
		
		if (v){                                                                    // view_list.jsxi:69
			i.style.display = 'block';                                             // view_list.jsxi:70
			
			var f;
			
			try {
				var fCode = v.replace(/\s+/g, ' ').trim().split(/\s*\|\s*/).join('  ||  ').split(/\s*!\s*/).join('  !  ').split(/\s*&\s*/).join('  &&  ').split(/\s*\(\s*/).join('  (  ').split(/\s*\)\s*/).join('  )  ').replace(/(?:^|  )(?!&&|\|\||[()!])([^ ]+(?:\s[^ ]+)*)/g, 
					function (_, a){                                               // view_list.jsxi:80
						if (!a)                                                    // view_list.jsxi:81
							return 'true';                                         // view_list.jsxi:81
						
						if (/^brand:(.*)/.test(a))                                 // view_list.jsxi:83
							return '(car.data && (' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.data.brand))';
						
						if (/^class:(.*)/.test(a))                                 // view_list.jsxi:84
							return '(car.data && (' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.data.class))';
						
						if (/^country:(.*)/.test(a))                               // view_list.jsxi:85
							return '(car.data && (' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.data.country))';
						
						if (/^year:(.*)/.test(a))                                  // view_list.jsxi:86
							return '(car.data && (' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.data.year))';
						
						if (/^year([><=])(.*)/.test(a))                            // view_list.jsxi:87
							return '(car.data && car.data.year ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						if (/^author:(.*)/.test(a))                                // view_list.jsxi:88
							return '(car.data && (' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.data.author))';
						
						if (/^tag:(.*)/.test(a))                                   // view_list.jsxi:89
							return '(car.data && car.data.tags.some(RegExp.prototype.test.bind(' + RegExp.fromQuery(RegExp.$1, true) + ')))';
						
						if (/^(?:bhp|power):(.*)/.test(a))                         // view_list.jsxi:91
							return '(' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.getSpec(\'bhp\'))';
						
						if (/^(?:bhp|power)([><=])(.*)/.test(a))                   // view_list.jsxi:92
							return '(car.getSpec(\'bhp\') ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						if (/^(?:weight|mass):(.*)/.test(a))                       // view_list.jsxi:93
							return '(' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.getSpec(\'weight\'))';
						
						if (/^(?:weight|mass)([><=])(.*)/.test(a))                 // view_list.jsxi:94
							return '(car.getSpec(\'weight\') ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						if (/^torque:(.*)/.test(a))                                // view_list.jsxi:96
							return '(' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.getSpec(\'torque\'))';
						
						if (/^torque([><=])(.*)/.test(a))                          // view_list.jsxi:97
							return '(car.getSpec(\'torque\') ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						if (/^topspeed:(.*)/.test(a))                              // view_list.jsxi:98
							return '(' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.getSpec(\'topspeed\'))';
						
						if (/^topspeed([><=])(.*)/.test(a))                        // view_list.jsxi:99
							return '(car.getSpec(\'topspeed\') ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						if (/^acceleration:(.*)/.test(a))                          // view_list.jsxi:100
							return '(' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.getSpec(\'acceleration\'))';
						
						if (/^acceleration([><=])(.*)/.test(a))                    // view_list.jsxi:101
							return '(car.getSpec(\'acceleration\') ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						if (/^pwratio:(.*)/.test(a))                               // view_list.jsxi:102
							return '(' + RegExp.fromQuery(RegExp.$1, true) + ').test(car.getSpec(\'pwratio\'))';
						
						if (/^pwratio([><=])(.*)/.test(a))                         // view_list.jsxi:103
							return '(car.getSpec(\'pwratio\') ' + (RegExp.$1 == '=' ? '==' : RegExp.$1) + ' ' + JSON.stringify(RegExp.$2) + ')';
						
						var r = RegExp.fromQuery(a);
						return '((' + r + ').test(car.id) || car.data && (' + r + ').test(car.data.name))';
					});
				
				console.debug(fCode);                                              // view_list.jsxi:109
				i.style.boxShadow = null;                                          // view_list.jsxi:110
				f = eval('(function (car){ return ' + fCode + '; })');             // view_list.jsxi:111
			} catch (e){                                                           // view_list.jsxi:112
				f = function (arg){                                                // view_list.jsxi:113
					return false;
				};
				i.style.boxShadow = '#f00 0 0 0 2px';                              // view_list.jsxi:114
				console.warn('broken query: ' + e);                                // view_list.jsxi:115
			} 
			
			_aside.find('#cars-list > div > [data-id]').each(function (){          // view_list.jsxi:118
				this.parentNode.style.display = f(Cars.byName(this.getAttribute('data-id'))) ? null : 'none';
			});
		} else {
			i.style.display = 'hide';                                              // view_list.jsxi:122
			i.style.boxShadow = null;                                              // view_list.jsxi:123
			_aside.find('#cars-list > div').show();                                // view_list.jsxi:124
		}
	};
	ViewList.addFilter = function (v){                                             // view_list.jsxi:128
		var a = _aside.find('#cars-list-filter')[0].value;
		
		ViewList.filter((a && a + ' ') + v);
	};
	ViewList.sort = function (){                                                   // view_list.jsxi:143
		if (!sortingEnabled)                                                       // view_list.jsxi:144
			return;
		
		_aside.find('#total-cars').text(Cars.list.filter(function (e){             // view_list.jsxi:146
			return e.parent == null;                                               // view_list.jsxi:147
		}).length).attr('title', 'Including modded versions: ' + Cars.list.length);
		
		var sorted = Cars.list.sort(_sortFn.displayName);
		
		var listNode = _node[0];
		
		var children = Array.prototype.slice.call(listNode.children);
		
		for (var __1h = 0; __1h < sorted.length; __1h ++){                         // view_list.jsxi:154
			var car = sorted[__1h];
			
			for (var __1g = 0; __1g < children.length; __1g ++){                   // view_list.jsxi:155
				var entry = children[__1g];
				
				if (entry.children[0].getAttribute('data-id') === car.id){         // view_list.jsxi:156
					listNode.appendChild(entry);                                   // view_list.jsxi:157
					
					break;
				}
			}
		}
		
		scrollToSelected();                                                        // view_list.jsxi:163
	};
	
	function init(){                                                               // view_list.jsxi:166
		BatchProcessing.on('start',                                                // view_list.jsxi:167
			function (arg){                                                        // view_list.jsxi:168
				return sortingEnabled = false;                                     // view_list.jsxi:168
			}).on('end',                                                           // view_list.jsxi:169
			function (arg){                                                        // view_list.jsxi:169
				sortingEnabled = true;                                             // view_list.jsxi:170
				ViewList.sort();
			});
		Cars.on('scan:start',                                                      // view_list.jsxi:174
			function (){                                                           // view_list.jsxi:175
				sortingEnabled = false;                                            // view_list.jsxi:176
				_aside.find('#cars-list').empty();                                 // view_list.jsxi:178
				document.body.removeChild(_aside[0]);                              // view_list.jsxi:179
			}).on('scan:ready',                                                    // view_list.jsxi:181
			function (list){                                                       // view_list.jsxi:181
				sortingEnabled = true;                                             // view_list.jsxi:182
				ViewList.sort();
				document.body.appendChild(_aside[0]);                              // view_list.jsxi:185
				
				if (list.length > 0){                                              // view_list.jsxi:187
					ViewList.select(Cars.byName(localStorage.selectedCar) || list[0]);
				}
			}).on('new.car',                                                       // view_list.jsxi:191
			function (car){                                                        // view_list.jsxi:191
				var s = document.createElement('span');
				
				s.textContent = car.displayName;                                   // view_list.jsxi:193
				
				if (car.disabled)                                                  // view_list.jsxi:194
					s.classList.add('disabled');                                   // view_list.jsxi:194
				
				s.setAttribute('title', car.path);                                 // view_list.jsxi:196
				s.setAttribute('data-id', car.id);                                 // view_list.jsxi:197
				s.setAttribute('data-name', car.id);                               // view_list.jsxi:198
				s.setAttribute('data-path', car.path);                             // view_list.jsxi:199
				
				var d = document.createElement('div');
				
				d.appendChild(s);                                                  // view_list.jsxi:202
				
				if (car.children.length > 0){                                      // view_list.jsxi:204
					d.setAttribute('data-children', car.children.length + 1);      // view_list.jsxi:205
				}
				
				_node[0].appendChild(d);                                           // view_list.jsxi:208
				ViewList.sort();
			}).on('remove.car',                                                    // view_list.jsxi:211
			function (car){                                                        // view_list.jsxi:211
				if (car === _selected){                                            // view_list.jsxi:212
					ViewList.selectNear();
				}
				
				var d = _node[0].querySelector('[data-id="' + car.id + '"]').parentNode;
				
				d.parentNode.removeChild(d);                                       // view_list.jsxi:217
			}).on('update.car.data',                                               // view_list.jsxi:219
			function (car, upd){                                                   // view_list.jsxi:219
				_node.find('[data-id="' + car.id + '"]').text(car.displayName).attr('data-name', car.displayName.toLowerCase());
				ViewList.filter(_aside.find('#cars-list-filter').val());
				
				if (upd === 'update.car.data:name'){                               // view_list.jsxi:224
					ViewList.sort();
				}
			}).on('update.car.parent',                                             // view_list.jsxi:228
			function (car){                                                        // view_list.jsxi:228
				var d = _node[0].querySelector('[data-id="' + car.id + '"]').parentNode;
				
				if (car.error.length > 0){                                         // view_list.jsxi:230
					var c = d.parentNode;
					
					if (c.tagName === 'DIV' && c.querySelectorAll('.error').length == 1){
						c.classList.remove('error');                               // view_list.jsxi:233
					}
				}
				
				if (car.parent){                                                   // view_list.jsxi:237
					var p = _node[0].querySelector('[data-id="' + car.parent.id + '"]').parentNode;
					
					p.appendChild(d);                                              // view_list.jsxi:239
					
					if (d.classList.contains('error')){                            // view_list.jsxi:240
						d.classList.remove('error');                               // view_list.jsxi:241
						p.classList.add('error');                                  // view_list.jsxi:242
					}
				} else {
					_node[0].appendChild(d);                                       // view_list.jsxi:245
					ViewList.sort();
				}
				
				scrollToSelected();                                                // view_list.jsxi:249
			}).on('update.car.children',                                           // view_list.jsxi:251
			function (car){                                                        // view_list.jsxi:251
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:253
					return;
				
				if (car.children.length){                                          // view_list.jsxi:254
					e.parentNode.setAttribute('data-children', car.children.length + 1);
				} else {
					e.parentNode.removeAttribute('data-children');                 // view_list.jsxi:257
				}
			}).on('update.car.path',                                               // view_list.jsxi:260
			function (car){                                                        // view_list.jsxi:260
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:262
					return;
				
				e.setAttribute('data-path', car.path);                             // view_list.jsxi:263
				e.setAttribute('title', car.path);                                 // view_list.jsxi:264
			}).on('update.car.disabled',                                           // view_list.jsxi:266
			function (car){                                                        // view_list.jsxi:266
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:268
					return;
				
				if (car.disabled){                                                 // view_list.jsxi:269
					e.classList.add('disabled');                                   // view_list.jsxi:270
				} else {
					e.classList.remove('disabled');                                // view_list.jsxi:272
				}
				
				ViewList.sort();
			}).on('update.car.changed',                                            // view_list.jsxi:277
			function (car){                                                        // view_list.jsxi:277
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:279
					return;
				
				if (car.changed){                                                  // view_list.jsxi:280
					e.classList.add('changed');                                    // view_list.jsxi:281
				} else {
					e.classList.remove('changed');                                 // view_list.jsxi:283
				}
			}).on('error',                                                         // view_list.jsxi:286
			function (car){                                                        // view_list.jsxi:286
				var e = _node[0].querySelector('[data-id="' + car.id + '"]');
				
				if (!e)                                                            // view_list.jsxi:288
					return;
				
				if (car.error.length > 0){                                         // view_list.jsxi:290
					e.classList.add('error');                                      // view_list.jsxi:291
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:293
				}
				
				while (e.parentNode.id !== 'cars-list'){                           // view_list.jsxi:296
					e = e.parentNode;                                              // view_list.jsxi:297
				}
				
				if (car.error.length > 0){                                         // view_list.jsxi:300
					e.classList.add('error');                                      // view_list.jsxi:301
				} else {
					e.classList.remove('error');                                   // view_list.jsxi:303
				}
			});
		_aside.find('#cars-list-filter').on('change paste keyup keypress search', 
			function (e){                                                          // view_list.jsxi:308
				if (e.keyCode == 13){                                              // view_list.jsxi:309
					this.blur();                                                   // view_list.jsxi:310
				}
				
				if (e.keyCode == 27){                                              // view_list.jsxi:313
					this.value = '';                                               // view_list.jsxi:314
					this.blur();                                                   // view_list.jsxi:315
				}
				
				ViewList.filter(this.value);
			}).on('keydown',                                                       // view_list.jsxi:320
			function (e){                                                          // view_list.jsxi:320
				if (e.keyCode == 8 && !this.value){                                // view_list.jsxi:321
					this.blur();                                                   // view_list.jsxi:322
				}
			}).on('blur',                                                          // view_list.jsxi:325
			function (){                                                           // view_list.jsxi:325
				if (!this.value){                                                  // view_list.jsxi:326
					$(this).hide();                                                // view_list.jsxi:327
				}
			});
		$(window).on('keydown',                                                    // view_list.jsxi:332
			function (e){                                                          // view_list.jsxi:333
				if (Event.isSomeInput(e))                                          // view_list.jsxi:334
					return;
				
				if (e.ctrlKey || e.altKey || e.shiftKey)                           // view_list.jsxi:335
					return;
				
				if ($('#dialog')[0])                                               // view_list.jsxi:336
					return;
				
				var f = _aside.find('#cars-list-filter');
				
				if (/[a-zA-Z\d]/.test(String.fromCharCode(e.keyCode)) || e.keyCode == 8 && f.val()){
					f.show()[0].focus();                                           // view_list.jsxi:340
				}
				
				if (e.keyCode === 38){                                             // view_list.jsxi:343
					ViewList.selectNear(- 1);
					return false;
				}
				
				if (e.keyCode === 40){                                             // view_list.jsxi:348
					ViewList.selectNear(1);
					return false;
				}
			});
		_aside.find('#cars-list-filter-focus').click(function (){                  // view_list.jsxi:354
			_aside.find('#cars-list-filter').show()[0].focus();                    // view_list.jsxi:355
		});
		_aside.find('#cars-list').click(function (e){                              // view_list.jsxi:359
			var car = Cars.byName(e.target.getAttribute('data-id'));
			
			if (!car)                                                              // view_list.jsxi:361
				return;
			
			ViewList.select(car);
		});
		
		var cmIgnore = false;
		
		_aside.on('contextmenu',                                                   // view_list.jsxi:367
			function (){                                                           // view_list.jsxi:368
				this.querySelector('footer').classList.toggle('active');           // view_list.jsxi:369
				cmIgnore = true;                                                   // view_list.jsxi:370
			});
		$(window).on('click contextmenu',                                          // view_list.jsxi:373
			(function (e){                                                         // view_list.jsxi:374
				if (cmIgnore){                                                     // view_list.jsxi:375
					cmIgnore = false;                                              // view_list.jsxi:376
				} else if (e.target !== this){                                     // view_list.jsxi:377
					this.classList.remove('active');                               // view_list.jsxi:378
				}
			}).bind(_aside.find('footer')[0]));                                    // view_list.jsxi:380
		_aside.find('#cars-list-open-directory').click(function (){                // view_list.jsxi:383
			if (!_selected)                                                        // view_list.jsxi:384
				return;
			
			Shell.openItem(AcDir.cars);                                            // view_list.jsxi:385
		});
		_aside.find('#cars-list-reload').click(function (){                        // view_list.jsxi:388
			if (Cars.list.some(function (e){                                       // view_list.jsxi:389
				return e.changed;                                                  // view_list.jsxi:390
			})){
				new Dialog('Reload',                                               // view_list.jsxi:392
					[
						'<p>{0}</p>'.format('Your changes will be lost. Are you sure?')
					], 
					reload);                                                       // view_list.jsxi:394
			} else {
				reload();                                                          // view_list.jsxi:396
			}
			
			function reload(){                                                     // view_list.jsxi:399
				Cars.reloadAll();                                                  // view_list.jsxi:400
			}
		});
		_aside.find('#cars-list-test-acd').click(function (){                      // view_list.jsxi:404
			Cars.acdTest();                                                        // view_list.jsxi:405
		});
		_aside.find('#cars-list-batch').click(function (){                         // view_list.jsxi:409
			if (_aside.find('#cars-list-filter').val()){                           // view_list.jsxi:410
				var filtered = [];
				
				var n = _node[0].querySelectorAll('[data-id]');
				
				for (var i = 0; i < n.length; i ++){                               // view_list.jsxi:414
					filtered.push(Cars.byName(n[i].getAttribute('data-id')));      // view_list.jsxi:415
				}
				
				BatchProcessing.select(filtered);                                  // view_list.jsxi:418
			} else {
				BatchProcessing.select(Cars.list.slice());                         // view_list.jsxi:420
			}
		});
		_aside.find('#cars-list-save').click(function (){                          // view_list.jsxi:424
			Cars.saveAll();                                                        // view_list.jsxi:425
		});
	}
	
	function lazyLoadingProgressInit(){                                            // view_list.jsxi:429
		var p;
		
		Cars.on('lazyscan:start',                                                  // view_list.jsxi:431
			function (list){                                                       // view_list.jsxi:432
				p = _aside.find('progress').show()[0];                             // view_list.jsxi:433
				p.indeterminate = false;                                           // view_list.jsxi:434
				p.max = list.length;                                               // view_list.jsxi:435
				p.value = 0;                                                       // view_list.jsxi:436
				$('#cars-list-test-acd').attr('disabled', true);                   // view_list.jsxi:438
			}).on('lazyscan:progress',                                             // view_list.jsxi:440
			function (i, m){                                                       // view_list.jsxi:440
				p.value = i;                                                       // view_list.jsxi:441
			}).on('lazyscan:ready',                                                // view_list.jsxi:443
			function (list){                                                       // view_list.jsxi:443
				p.style.display = 'none';                                          // view_list.jsxi:444
				$('#cars-list-test-acd').attr('disabled', null);                   // view_list.jsxi:446
			});
	}
	
	Object.defineProperty(ViewList,                                                // view_list.jsxi:1
		'selected', 
		{
			get: (function (){
				return _selected;                                                  // view_list.jsxi:8
			})
		});
	(function (){                                                                  // view_list.jsxi:450
		init();                                                                    // view_list.jsxi:451
		lazyLoadingProgressInit();                                                 // view_list.jsxi:452
		mediator.extend(ViewList);                                                 // view_list.jsxi:453
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
	
	function details(msg){                                                         // view_loading.jsxi:10
		_node.querySelector('h6').textContent = msg;                               // view_loading.jsxi:11
	}
	
	(function (){                                                                  // view_loading.jsxi:14
		Data.on('installation:start',                                              // view_loading.jsxi:15
			function (){                                                           // view_loading.jsxi:16
				clearInterval(_interval);                                          // view_loading.jsxi:17
				_node.style.display = null;                                        // view_loading.jsxi:18
				_progress.indeterminate = true;                                    // view_loading.jsxi:19
				_dots = 0;                                                         // view_loading.jsxi:20
				_interval = setInterval(function (){                               // view_loading.jsxi:21
					_h4.textContent = 'Please wait' + '...'.slice(0, 1 + _dots ++ % 3);
				}, 
				300);
				details('Data installation in process');                           // view_loading.jsxi:25
				mainForm.setProgressBar(2);                                        // view_loading.jsxi:26
			}).on('installation:ready',                                            // view_loading.jsxi:28
			function (list){                                                       // view_loading.jsxi:28
				clearInterval(_interval);                                          // view_loading.jsxi:29
				_node.style.display = 'none';                                      // view_loading.jsxi:30
				mainForm.setProgressBar(- 1);                                      // view_loading.jsxi:31
			});
		Cars.on('scan:start',                                                      // view_loading.jsxi:34
			function (){                                                           // view_loading.jsxi:35
				clearInterval(_interval);                                          // view_loading.jsxi:36
				_node.style.display = null;                                        // view_loading.jsxi:37
				_progress.indeterminate = true;                                    // view_loading.jsxi:38
				_dots = 0;                                                         // view_loading.jsxi:39
				_interval = setInterval(function (){                               // view_loading.jsxi:40
					_h4.textContent = 'Please wait' + '...'.slice(0, 1 + _dots ++ % 3);
				}, 
				300);
				mainForm.setProgressBar(0);                                        // view_loading.jsxi:43
			}).on('scan:list',                                                     // view_loading.jsxi:45
			function (list){                                                       // view_loading.jsxi:45
				details('Car' + (list.length == 1 ? '' : 's') + ' found: ' + list.length);
				_progress.indeterminate = false;                                   // view_loading.jsxi:47
				_progress.max = list.length;                                       // view_loading.jsxi:48
			}).on('scan:progress',                                                 // view_loading.jsxi:50
			function (i, m){                                                       // view_loading.jsxi:50
				_progress.value = i;                                               // view_loading.jsxi:51
				mainForm.setProgressBar(i / m);                                    // view_loading.jsxi:52
			}).on('scan:ready',                                                    // view_loading.jsxi:54
			function (list){                                                       // view_loading.jsxi:54
				clearInterval(_interval);                                          // view_loading.jsxi:55
				_node.style.display = 'none';                                      // view_loading.jsxi:56
				mainForm.setProgressBar(- 1);                                      // view_loading.jsxi:57
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
		
		if (e.indexOf('ACCESS:') === 0)                                            // view_new_version.jsxi:70
			e = 'access not permitted';                                            // view_new_version.jsxi:70
		
		_upd.setContent('Update failed: ' + e + '.');                              // view_new_version.jsxi:71
		_upd.setButton('Nevermind', function (){}).addButton('Manual Update',      // view_new_version.jsxi:72
			function (){                                                           // view_new_version.jsxi:72
				Shell.openItem(_inf.downloadUrl || _inf.detailsUrl);               // view_new_version.jsxi:73
			});
	}
	
	function autoupdateFailed(e){                                                  // view_new_version.jsxi:77
		ErrorHandler.handled('Autoupdate failed.', e);                             // view_new_version.jsxi:78
	}
	
	(function (){                                                                  // view_new_version.jsxi:81
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
				if (!s.yearAutoupdate && yearAutoupdate){                          // view_settings.jsxi:13
					setTimeout(function (arg){                                     // view_settings.jsxi:14
						return new Dialog('Year As Postfix',                       // view_settings.jsxi:14
							'Would you like to add missing years to names now?', 
							function (arg){                                        // view_settings.jsxi:15
								BatchProcessing.process(Cars.list, 'Add missing years to car names');
							});
					});
				}
				
				s.disableTips = disableTips;                                       // view_settings.jsxi:20
				s.badgeAutoupdate = badgeAutoupdate;                               // view_settings.jsxi:21
				s.yearAutoupdate = yearAutoupdate;                                 // view_settings.jsxi:22
				s.updateDatabase = updateDatabase;                                 // view_settings.jsxi:23
				s.uploadData = uploadData;                                         // view_settings.jsxi:24
				s.updatesCheck = updatesCheck;                                     // view_settings.jsxi:25
				s.updatesSource = updatesSource;                                   // view_settings.jsxi:26
				s.aptShowroom = aptShowroom;                                       // view_settings.jsxi:28
				s.aptMode = aptMode;                                               // view_settings.jsxi:29
				s.aptFilter = aptFilter;                                           // view_settings.jsxi:30
				s.aptDisableSweetFx = aptDisableSweetFx;                           // view_settings.jsxi:31
				s.aptResize = aptResize;                                           // view_settings.jsxi:32
				s.aptCameraPosition = aptCameraPosition;                           // view_settings.jsxi:33
				s.aptCameraLookAt = aptCameraLookAt;                               // view_settings.jsxi:34
				s.aptCameraFov = aptCameraFov;                                     // view_settings.jsxi:35
				s.aptCameraX = aptCameraX;                                         // view_settings.jsxi:37
				s.aptCameraY = aptCameraY;                                         // view_settings.jsxi:38
				s.aptCameraDistance = aptCameraDistance;                           // view_settings.jsxi:39
				s.aptIncreaseDelays = aptIncreaseDelays;                           // view_settings.jsxi:40
			});
		}
		
		var d = new Dialog('Settings',                                             // view_settings.jsxi:44
				[
					'<h6>Assetto Corsa Folder</h6>',                               // view_settings.jsxi:45
					'<button id="settings-acdir-select" style="float:right;width:30px">…</button>', 
					'<input id="settings-acdir" placeholder="…/Assetto Corsa" style="width:calc(100% - 35px)">', 
					'<h6>Editing</h6>',                                            // view_settings.jsxi:49
					'<label><input id="settings-badge-autoupdate" type="checkbox">Update badge with brand</label><br>', 
					'<label><input id="settings-year-autoupdate" type="checkbox">Add year to name as postfix if missing</label>', 
					'<h6>Tips</h6>',                                               // view_settings.jsxi:53
					'<label><input id="settings-disable-tips" type="checkbox">Disable tips on launch</label>', 
					'<h6>Database</h6>',                                           // view_settings.jsxi:56
					'<label><input id="settings-update-database" type="checkbox">Update databases</label><br>', 
					'<label><input id="settings-upload-data" type="checkbox">Upload some changes</label>', 
					'<h6>Updates</h6>',                                            // view_settings.jsxi:60
					'<label><input id="settings-updates-check" type="checkbox">Check for new versions on launch</label>', 
					'<select id="settings-updates-source"><option value="stable">Stable</option><option value="last">Beta</option></select>'
				], 
				save,                                                              // view_settings.jsxi:66
				false).setButton('Save').addButton('User Storage',                 // view_settings.jsxi:66
				function (){                                                       // view_settings.jsxi:66
					Shell.openItem(DataStorage.getUserContentDir());               // view_settings.jsxi:67
					return false;
				}).addButton('Cancel'),                                            // view_settings.jsxi:69
			c = 0;                                                                 // view_settings.jsxi:69
		
		var acdirVal;
		
		function acdirChange(){                                                    // view_settings.jsxi:73
			var err = AcDir.check(acdirVal = d.find('#settings-acdir').val());     // view_settings.jsxi:74
			
			$(this).toggleClass('invalid', !!err).attr('title', err || null);      // view_settings.jsxi:75
			
			if (err){                                                              // view_settings.jsxi:76
				acdirVal = false;                                                  // view_settings.jsxi:77
			}
		}
		
		d.content.find('#settings-acdir').val(AcDir.root).change(acdirChange);     // view_settings.jsxi:81
		d.content.find('#settings-acdir-select').click(function (){                // view_settings.jsxi:83
			$('<input type="file" nwdirectory />').attr({ nwworkingdir: d.content.find('#settings-acdir').val() }).change(function (){
				d.content.find('#settings-acdir').val(this.value);                 // view_settings.jsxi:87
				acdirChange();                                                     // view_settings.jsxi:88
			}).click();                                                            // view_settings.jsxi:89
		});
		
		var badgeAutoupdate = Settings.get('badgeAutoupdate');
		
		d.content.find('#settings-badge-autoupdate').change(function (arg){        // view_settings.jsxi:94
			badgeAutoupdate = this.checked;                                        // view_settings.jsxi:94
		})[0].checked = badgeAutoupdate;                                           // view_settings.jsxi:94
		
		var yearAutoupdate = Settings.get('yearAutoupdate');
		
		d.content.find('#settings-year-autoupdate').change(function (arg){         // view_settings.jsxi:97
			yearAutoupdate = this.checked;                                         // view_settings.jsxi:97
		})[0].checked = yearAutoupdate;                                            // view_settings.jsxi:97
		
		var disableTips = Settings.get('disableTips');
		
		d.content.find('#settings-disable-tips').change(function (arg){            // view_settings.jsxi:101
			disableTips = this.checked;                                            // view_settings.jsxi:101
		})[0].checked = disableTips;                                               // view_settings.jsxi:101
		
		var updateDatabase = Settings.get('updateDatabase');
		
		d.content.find('#settings-update-database').change(function (arg){         // view_settings.jsxi:105
			updateDatabase = this.checked;                                         // view_settings.jsxi:105
		})[0].checked = updateDatabase;                                            // view_settings.jsxi:105
		
		var uploadData = Settings.get('uploadData');
		
		d.content.find('#settings-upload-data').change(function (arg){             // view_settings.jsxi:108
			uploadData = this.checked;                                             // view_settings.jsxi:108
		})[0].checked = uploadData;                                                // view_settings.jsxi:108
		
		var updatesCheck = Settings.get('updatesCheck');
		
		d.content.find('#settings-updates-check').change(function (arg){           // view_settings.jsxi:112
			updatesCheck = this.checked;                                           // view_settings.jsxi:112
		})[0].checked = updatesCheck;                                              // view_settings.jsxi:112
		
		var updatesSource = Settings.get('updatesSource');
		
		d.content.find('#settings-updates-source').change(function (arg){          // view_settings.jsxi:115
			updatesSource = this.value;                                            // view_settings.jsxi:115
		})[0].value = updatesSource;                                               // view_settings.jsxi:115
		
		var apt = d.addTab('Auto-Preview',                                         // view_settings.jsxi:118
			[
				'<h6>Mode</h6>',                                                   // view_settings.jsxi:119
				'<select id="apt-mode">' + AcShowroom.modes.map(function (e){      // view_settings.jsxi:120
					return '<option value="' + e.id + '">' + e.name + '</option>';
				}).join('') + '</select>',                                         // view_settings.jsxi:122
				'<h6>Showroom</h6>',                                               // view_settings.jsxi:124
				'<select id="apt-showroom"><option value="">Black Showroom (Recommended)</option>' + AcShowroom.list.map(function (e){
					return '<option value="' + e.id + '">' + (e.data ? e.data.name : e.id) + '</option>';
				}).join('') + '</select>',                                         // view_settings.jsxi:127
				'<h6>Filter</h6>',                                                 // view_settings.jsxi:129
				'<select id="apt-filter"><option value="">Don\'t change</option>' + AcFilters.list.map(function (e){
					return '<option value="' + e.id + '">' + e.id + '</option>';   // view_settings.jsxi:131
				}).join('') + '</select>',                                         // view_settings.jsxi:132
				'<label><input id="apt-disable-sweetfx" type="checkbox">Disable SweetFX (Recommended)</label>', 
				'<h6>Resize</h6>',                                                 // view_settings.jsxi:135
				'<label><input id="apt-resize" type="checkbox">Change size to default 1024×575 (Recommended)</label>', 
				'<h6>Camera</h6>',                                                 // view_settings.jsxi:138
				'<div class="apt-newmode-c">',                                     // view_settings.jsxi:139
				'<label style="display:block;width:320px;line-height:24px;clear:both">Camera Position: <input id="apt-camera-position" style="width:160px;float:right"></label>', 
				'<label style="display:block;width:320px;line-height:24px;clear:both">Look At: <input id="apt-camera-look-at" style="width:160px;float:right"></label>', 
				'<label style="display:block;width:320px;line-height:24px;clear:both">FOV: <input id="apt-camera-fov" type="number" step="0.1" style="width:80px;float:right"></label>', 
				'</div>',                                                          // view_settings.jsxi:143
				'<div class="apt-oldmode-c">',                                     // view_settings.jsxi:145
				'<label style="display:inline-block;width:160px;line-height:24px" title="Actually, just simulate mouse move">Rotate X: <input id="apt-camera-x" type="number" step="1" style="width: 80px;float: right;margin-right: 20px;"></label>', 
				'<label style="display:inline-block;width:160px;line-height:24px" title="Actually, just simulate mouse move">Rotate Y: <input id="apt-camera-y" type="number" step="1" style="width: 80px;float: right;margin-right: 20px;"></label>', 
				'<label style="display:inline-block;width:160px;line-height:24px">Distance: <input id="apt-camera-distance" type="number" step="0.1" style="width: 80px;float: right;margin-right: 20px;"></label>', 
				'<h6>Delays</h6>',                                                 // view_settings.jsxi:149
				'<label><input id="apt-increase-delays" type="checkbox">Increased delays</label>', 
				'</div>'
			], 
			save).setButton('Save').addButton('Defaults',                          // view_settings.jsxi:155
			function (){                                                           // view_settings.jsxi:155
				apt.content.find('#apt-mode')[0].value = (aptMode = Settings.defaults.aptMode);
				modeVisibility();                                                  // view_settings.jsxi:157
				apt.content.find('#apt-showroom')[0].value = (aptShowroom = Settings.defaults.aptShowroom);
				
				if (AcFilters.list.length)                                         // view_settings.jsxi:160
					apt.content.find('#apt-filter')[0].value = (aptFilter = Settings.defaults.aptFilter);
				
				apt.content.find('#apt-disable-sweetfx')[0].checked = (aptDisableSweetFx = Settings.defaults.aptDisableSweetFx);
				apt.content.find('#apt-resize')[0].checked = (aptResize = Settings.defaults.aptResize);
				apt.content.find('#apt-camera-position')[0].value = (aptCameraPosition = Settings.defaults.aptCameraPosition);
				apt.content.find('#apt-camera-look-at')[0].value = (aptCameraLookAt = Settings.defaults.aptCameraLookAt);
				apt.content.find('#apt-camera-fov')[0].value = (aptCameraFov = Settings.defaults.aptCameraFov);
				apt.content.find('#apt-camera-x')[0].value = (aptCameraX = Settings.defaults.aptCameraX);
				apt.content.find('#apt-camera-y')[0].value = (aptCameraY = Settings.defaults.aptCameraY);
				apt.content.find('#apt-camera-distance')[0].value = (aptCameraDistance = Settings.defaults.aptCameraDistance);
				apt.content.find('#apt-increase-delays')[0].checked = (aptIncreaseDelays = Settings.defaults.aptIncreaseDelays);
				return false;
			}).addButton('Cancel');                                                // view_settings.jsxi:174
		
		function modeVisibility(){                                                 // view_settings.jsxi:176
			apt.content.toggleClass('apt-customshowroommode',                      // view_settings.jsxi:177
				aptMode !== 'default' && aptMode !== 'default_old');               // view_settings.jsxi:177
			apt.content.toggleClass('apt-newmode', aptMode === 'default');         // view_settings.jsxi:178
			apt.content.toggleClass('apt-oldmode', aptMode === 'default_old');     // view_settings.jsxi:179
		}
		
		var aptMode = Settings.get('aptMode');
		
		apt.content.find('#apt-mode').change(function (arg){                       // view_settings.jsxi:183
			aptMode = this.value;                                                  // view_settings.jsxi:184
			modeVisibility();                                                      // view_settings.jsxi:185
		})[0].value = aptMode;                                                     // view_settings.jsxi:186
		modeVisibility();                                                          // view_settings.jsxi:187
		
		var aptShowroom = Settings.get('aptShowroom');
		
		apt.content.find('#apt-showroom').change(function (arg){                   // view_settings.jsxi:190
			aptShowroom = this.value;                                              // view_settings.jsxi:190
		})[0].value = aptShowroom;                                                 // view_settings.jsxi:190
		
		var aptFilter = Settings.get('aptFilter');
		
		if (AcFilters.list.length){                                                // view_settings.jsxi:193
			var recFilter = apt.content.find('#apt-filter [value="' + Settings.defaults.aptFilter + '"]')[0];
			
			if (recFilter){                                                        // view_settings.jsxi:195
				recFilter.textContent += ' (Recommended)';                         // view_settings.jsxi:196
			} else {
				$('<option value="' + Settings.defaults.aptFilter + '">' + Settings.defaults.aptFilter + ' (Recommended)</option>').insertAfter(apt.content.find('#apt-filter option:first-child'));
			}
			
			apt.content.find('#apt-filter').change(function (arg){                 // view_settings.jsxi:201
				aptFilter = this.value;                                            // view_settings.jsxi:201
			})[0].value = aptFilter;                                               // view_settings.jsxi:201
		} else {
			apt.content.find('#apt-filter').attr({ disabled: true, title: 'Filters not found' });
		}
		
		var aptDisableSweetFx = Settings.get('aptDisableSweetFx');
		
		apt.content.find('#apt-disable-sweetfx').change(function (arg){            // view_settings.jsxi:210
			aptDisableSweetFx = this.checked;                                      // view_settings.jsxi:210
		})[0].checked = aptDisableSweetFx;                                         // view_settings.jsxi:210
		
		var aptResize = Settings.get('aptResize');
		
		apt.content.find('#apt-resize').change(function (arg){                     // view_settings.jsxi:213
			aptResize = this.checked;                                              // view_settings.jsxi:213
		})[0].checked = aptResize;                                                 // view_settings.jsxi:213
		
		var aptCameraPosition = Settings.get('aptCameraPosition');
		
		apt.content.find('#apt-camera-position').change(function (arg){            // view_settings.jsxi:216
			aptCameraPosition = this.value;                                        // view_settings.jsxi:216
		})[0].value = aptCameraPosition;                                           // view_settings.jsxi:216
		
		var aptCameraLookAt = Settings.get('aptCameraLookAt');
		
		apt.content.find('#apt-camera-look-at').change(function (arg){             // view_settings.jsxi:219
			aptCameraLookAt = this.value;                                          // view_settings.jsxi:219
		})[0].value = aptCameraLookAt;                                             // view_settings.jsxi:219
		
		var aptCameraFov = Settings.get('aptCameraFov');
		
		apt.content.find('#apt-camera-fov').change(function (arg){                 // view_settings.jsxi:222
			aptCameraFov = this.value;                                             // view_settings.jsxi:222
		})[0].value = aptCameraFov;                                                // view_settings.jsxi:222
		
		var aptCameraX = Settings.get('aptCameraX');
		
		apt.content.find('#apt-camera-x').change(function (arg){                   // view_settings.jsxi:225
			aptCameraX = this.value;                                               // view_settings.jsxi:225
		})[0].value = aptCameraX;                                                  // view_settings.jsxi:225
		
		var aptCameraY = Settings.get('aptCameraY');
		
		apt.content.find('#apt-camera-y').change(function (arg){                   // view_settings.jsxi:228
			aptCameraY = this.value;                                               // view_settings.jsxi:228
		})[0].value = aptCameraY;                                                  // view_settings.jsxi:228
		
		var aptCameraDistance = Settings.get('aptCameraDistance');
		
		apt.content.find('#apt-camera-distance').change(function (arg){            // view_settings.jsxi:231
			aptCameraDistance = this.value;                                        // view_settings.jsxi:231
		})[0].value = aptCameraDistance;                                           // view_settings.jsxi:231
		
		var aptIncreaseDelays = Settings.get('aptIncreaseDelays');
		
		apt.content.find('#apt-increase-delays').change(function (arg){            // view_settings.jsxi:235
			aptIncreaseDelays = this.checked;                                      // view_settings.jsxi:235
		})[0].checked = aptIncreaseDelays;                                         // view_settings.jsxi:235
		d.addTab('About',                                                          // view_settings.jsxi:241
			[
				'<h6>Version</h6>',                                                // view_settings.jsxi:242
				'<p id="version">' + gui.App.manifest.version + '</p>',            // view_settings.jsxi:243
				'<h6>Details</h6>',                                                // view_settings.jsxi:244
				"<p><a href=\"#\" onclick=\"Shell.openItem('https://ascobash.wordpress.com/2015/06/14/actools-uijson/')\">https://ascobash.wordpress.com/…/actools-uijson/</a></p>", 
				'<h6>Author</h6>',                                                 // view_settings.jsxi:246
				'x4fab',                                                           // view_settings.jsxi:247
				'<h6>Support developing</h6>',                                     // view_settings.jsxi:248
				"<p><a href=\"#\" onclick=\"Shell.openItem('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=6BXQ7U3KM7KBY&lc=US&item_name=Ascobash&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedw')\"><img src=\"img/btn_donate.gif\"></a></p>"
			]).addButton('Check for update',                                       // view_settings.jsxi:253
			function (){                                                           // view_settings.jsxi:253
				var b = this.buttons.find('button:last-child').text('Please wait...').attr('disabled', true);
				
				CheckUpdate.check();                                               // view_settings.jsxi:255
				CheckUpdate.one('check',                                           // view_settings.jsxi:256
					function (arg){                                                // view_settings.jsxi:256
						b.text('Check again').attr('disabled', null);              // view_settings.jsxi:257
						
						if (arg === 'check:failed'){                               // view_settings.jsxi:258
							new Dialog('Check For Update', 'Cannot check for update.');
						} else if (arg !== 'check:done:found'){                    // view_settings.jsxi:260
							new Dialog('Check For Update', 'New version not found.');
						}
					});
				return false;
			}).content.find('#version').click(function (){                         // view_settings.jsxi:265
			if (++ c > 10 && !localStorage.developerMode){                         // view_settings.jsxi:266
				new Dialog('Developer Mode Enabled',                               // view_settings.jsxi:267
					'Don\'t spread it around, ok?',                                // view_settings.jsxi:267
					function (arg){}, 
					false);
				localStorage.developerMode = true;                                 // view_settings.jsxi:268
			}
		});
	}
	
	function feedbackForm(){                                                       // view_settings.jsxi:273
		function sendFeedback(v){                                                  // view_settings.jsxi:274
			d.buttons.find('button:first-child').text('Please wait...').attr('disabled', true);
			AppServerRequest.sendFeedback(v,                                       // view_settings.jsxi:277
				function (arg){                                                    // view_settings.jsxi:277
					d.close();                                                     // view_settings.jsxi:278
					
					if (arg){                                                      // view_settings.jsxi:279
						new Dialog('Cannot Send Feedback', 'Sorry about that.');   // view_settings.jsxi:280
					} else {
						_prevFeedback = null;                                      // view_settings.jsxi:282
						new Dialog('Feedback Sent', 'Thank you.');                 // view_settings.jsxi:283
					}
				});
		}
		
		var d = new Dialog('Feedback',                                             // view_settings.jsxi:288
			'<textarea style="width:350px;height:200px;resize:none" maxlength="5000"\
                placeholder="If you have any ideas or suggestions please let me know"></textarea>', 
			function (){                                                           // view_settings.jsxi:289
				var v = this.content.find('textarea').val().trim();
				
				if (v)                                                             // view_settings.jsxi:291
					sendFeedback(v);                                               // view_settings.jsxi:291
				return false;
			}, 
			false).setButton('Send').addButton('Cancel').closeOnEnter(false);      // view_settings.jsxi:293
		
		d.content.find('textarea').val(_prevFeedback || '').change(function (arg){
			return _prevFeedback = this.value;                                     // view_settings.jsxi:294
		});
	}
	
	(function (){                                                                  // view_settings.jsxi:297
		$('#settings-open').click(openDialog);                                     // view_settings.jsxi:298
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

if (0 && !localStorage.dataCollection){                                            // app.jsxi:27
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

var checkAndFixDefaultLauncherTimeout = null;

AcDir.on('change',                                                                 // app.jsxi:77
	function (){                                                                   // app.jsxi:78
		Cars.scan();                                                               // app.jsxi:79
		clearTimeout(checkAndFixDefaultLauncherTimeout);                           // app.jsxi:81
		checkAndFixDefaultLauncherTimeout = setTimeout(function (arg){             // app.jsxi:82
			AcTools.Utils.AcFixer.CheckAndFixDefaultLauncher(AcDir.root);          // app.jsxi:83
		}, 
		15e3);
		
		if (first && !Settings.get('disableTips')){                                // app.jsxi:86
			new Dialog('Tip',                                                      // app.jsxi:87
				Tips.next,                                                         // app.jsxi:87
				function (){                                                       // app.jsxi:87
					this.find('p').html(Tips.next);                                // app.jsxi:88
					this.find('h4').text('Another Tip');                           // app.jsxi:89
					return false;
				}).setButton('Next').addButton('Disable Tips',                     // app.jsxi:91
				function (){                                                       // app.jsxi:91
					Settings.set('disableTips', true);                             // app.jsxi:92
				}).find('p').css('maxWidth', 400);                                 // app.jsxi:93
			first = false;                                                         // app.jsxi:95
		}
	});
Data.one('update',                                                                 // app.jsxi:99
	function (){                                                                   // app.jsxi:100
		AcDir.init();                                                              // app.jsxi:101
	});
CheckUpdate.on('check:failed',                                                     // app.jsxi:104
	function (){                                                                   // app.jsxi:105
		Notification.warn('Update Checking Failed',                                // app.jsxi:106
			'Probably server is unavailable or something.');                       // app.jsxi:106
	});

