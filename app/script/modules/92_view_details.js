modules.viewDetails = function (){
    var mediator = new Mediator();

    var _selected, _tagSkip;

    function outMsg(title, msg){
        var dm = $('#details-message'),
            cd = $('#selected-car-details');

        if (title){
            dm.html('<h4>{0}</h4><p>{1}</p>'.format(title, msg)).show();
            cd.hide();
        } else {
            dm.hide();
            cd.show();
        }
    }

    function outErrors(car){
        var er = $('#selected-car-error');
        if (car.error.length > 0){
            er.show().html('Errors:<ul><li>' +
                car.error.map(function (e){
                    return e.msg;
                }).join('</li><li>') + '</li></ul>');
        } else {
            er.hide();
        }
    }

    function outBadge(car){
        var lo = $('#selected-car-logo');
        lo.attr('src', car.badge.cssUrl());
    }

    function updateParents(car){
        var s = document.getElementById('selected-car-parent');
        if (!s) return;

        if (car.children.length > 0){
            s.parentNode.style.display = 'none';
        } else {
            s.parentNode.style.display = null;

            s.innerHTML = '<option value="">None</option>' + modules.cars.list.filter(function (e){
                return e.data && !e.disabled && e.parent == null && e.id != car.id && (!car.parent || car.parent.id != car.id);
            }).map(function (e){
                return '<option value="{0}">{1}</option>'.format(e.id, e.data.name);
            }).join('');

            s.value = car.parent && car.parent.id || '';
        }
    }

    function outData(car){
        var he = $('#selected-car'),
            de = $('#selected-car-desc'),
            ta = $('#selected-car-tags'),
            pr = $('#selected-car-properties');
        if (car.data){
            he.removeAttr('readonly');
            de.removeAttr('readonly');

            ta.show().find('li').remove();
            car.data.tags.forEach(function (e){
                $('<li>').text(e).insertBefore(this);
            }.bind(ta.find('input')));
            updateTags(car.data.tags);

            if (car.data.name != he.val()){
                he.val(car.data.name);
            }

            if (car.data.description != de.val()){
                de.val(car.data.description).elastic();
            }

            pr.show();
            $('#selected-car-brand').val(car.data.brand);
            $('#selected-car-class').val(car.data.class || '');

            $('#selected-car-bhp').val(car.data.specs.bhp || '');
            $('#selected-car-torque').val(car.data.specs.torque || '');
            $('#selected-car-weight').val(car.data.specs.weight || '');
            $('#selected-car-topspeed').val(car.data.specs.topspeed || '');
            $('#selected-car-acceleration').val(car.data.specs.acceleration || '');
            $('#selected-car-pwratio').val(car.data.specs.pwratio || '');

            updateParents(car);

            if (car.parent){
                $('#selected-car-upgrade').show().attr('src', car.upgrade);
            } else {
                $('#selected-car-upgrade').hide();
            }
        } else {
            he.attr('readonly', true).val(car.id);
            de.attr('readonly', true).val('');
            ta.hide();
            pr.hide();
        }
    }

    function outDisabled(car){
        $('#selected-car-disable').text(car.disabled ? 'Enable' : 'Disable');
        $('#selected-car-header').toggleClass('disabled', car.disabled)
    }

    function outChanged(car){
        $('#selected-car-header').toggleClass('changed', car.changed)
    }

    function outSkins(car){
        setTimeout(function (){
            var sa = $('#selected-car-skins-article'),
                sp = $('#selected-car-preview'),
                ss = $('#selected-car-skins');
            if (car.skins){
                sa.show();
                ss.empty();

                sp.attr({
                    'data-id': car.skins.selected.id,
                    'src': (car.skins.selected.preview + '?' + Math.random()).cssUrl()
                });

                car.skins.forEach(function (e){
                    $('<img>').attr({
                        'data-id': e.id,
                        'src': e.livery.cssUrl()
                    }).appendTo(ss);
                });
            } else {
                sa.hide();
            }
        }, 50);
    }

    function updateTags(l){
        var t = document.getElementById('tags-filtered');
        if (t){
            document.body.removeChild(t);
        }

        t = document.body.appendChild(document.createElement('datalist'));
        t.id = 'tags-filtered';

        var n = l.map(function (e){
            return e.toLowerCase();
        });

        modules.cars.tags.forEach(function (v){
            if (n.indexOf(v.toLowerCase()) < 0){
                t.appendChild(document.createElement('option')).setAttribute('value', v);
            }
        });
    }

    function applyTags(){
        if (!_selected || !_selected.data) return;
        modules.cars.changeData(_selected, 'tags', [].map.call(
            document.querySelectorAll('#selected-car-tags li'), function (a){ return a.textContent }));
        updateTags(_selected.data.tags);
    }

    function init(){
        modules.cars
            .on('scan:ready', function (list){
                if (list.length == 0){
                    outMsg('Hmm', 'Cars not found');
                }

                $('main').show();
            })
            .on('error', function (car){
                if (_selected != car) return;
                outErrors(car);
            })
            .on('update:car:data', function (car){
                if (_selected != car) return;
                outData(car);
            })
            .on('update:car:skins', function (car){
                if (_selected != car) return;
                outSkins(car);
            })
            .on('update:car:disabled', function (car){
                if (_selected != car) return;
                outDisabled(car);
            })
            .on('update:car:changed', function (car){
                if (_selected != car) return;
                outChanged(car);
            });

        modules.viewList
            .on('select', function (car){
                $('main').show();

                _selected = car;

                if (car){
                    outMsg(null);
                } else {
                    return;
                }

                outData(car);
                outBadge(car);
                outDisabled(car);
                outChanged(car);
                outErrors(car);
                outSkins(car);
            });

        /* inputs */
        $('#selected-car')
            .keydown(function (e){
                if (e.keyCode == 13){
                    this.blur();
                    return false;
                }
            })
            .on('change', function (){
                if (!_selected || this.readonly || !this.value) return;
                this.value = this.value.slice(0, 64);
                modules.cars.changeData(_selected, 'name', this.value);
            });

        $('#selected-car-tags')
            .click(function (e){
                if (e.target.tagName === 'LI' && e.target.offsetWidth - e.offsetX < 20){
                    e.target.parentNode.removeChild(e.target);
                    applyTags();
                } else {
                    this.querySelector('input').focus();
                }
            });

        $('#selected-car-tags input')
            .on('change', function (){
                if (this.value){
                    this.parentNode.insertBefore(document.createElement('li'), this).textContent = this.value;
                    this.value = '';
                    applyTags();
                }
            })
            .on('keydown', function (e){
                if (e.keyCode == 8 && this.value == ''){
                    this.parentNode.removeChild(this.parentNode.querySelector('li:last-of-type'));
                    applyTags();
                }
            });

        $('#selected-car-desc').elastic()
            .on('input', function (){
                if (!_selected || this.readonly) return;
                modules.cars.changeData(_selected, 'description', this.value);
            });

        $('#selected-car-brand')
            .keydown(function (e){
                if (e.keyCode == 13){
                    this.blur();
                    return false;
                }
            })
            .change(function (e){
                if (!_selected || this.readonly || !this.value) return;
                modules.cars.changeData(_selected, 'brand', this.value);
            });

        $('#selected-car-parent')
            .change(function (e){
                modules.cars.changeParent(_selected, this.value || null);
            });

        $('#selected-car-class')
            .keydown(function (e){
                if (e.keyCode == 13){
                    this.blur();
                    return false;
                }
            })
            .change(function (){
                if (!_selected || this.readonly) return;
                modules.cars.changeData(_selected, 'class', this.value);
            });

        [ 'bhp', 'torque', 'weight', 'topspeed', 'acceleration', 'pwratio' ].forEach(function (e){
            $('#selected-car-' + e).keydown(function (e){
                if (e.keyCode == 13){
                    this.blur();
                    return false;
                }
            }).on('keyup keydown keypress', function (e){
                if (e.keyCode == 32){
                    e.stopPropagation();
                    if (e.type === 'keyup'){
                        return false;
                    }
                }
            }).on('change input', function (){
                if (!_selected || this.readonly) return;
                modules.cars.changeDataSpecs(_selected, e, this.value);
            });
        });

        $('#selected-car-pwratio')
            .dblclick(function (){
                if (!_selected || !_selected.data || this.readonly) return;
                var w = (_selected.data.specs.weight || '').match(/\d+/),
                    p = (_selected.data.specs.bhp || '').match(/\d+/);
                if (w && p){
                    modules.cars.changeDataSpecs(_selected, 'pwratio', (+w / +p).toFixed(2) + 'kg/cv');
                }
            });

        $('#selected-car-upgrade')
            .on('click', function (){
                if (!_selected) return;
                modules.upgradeEditor.start(_selected);
            });

        /* previews */
        $('#selected-car-skins-article')
            .dblclick(function (e){
                if (!_selected) return;
                modules.showroom.start(_selected);
            })
            .on('contextmenu', function (e){
                if (!_selected) return;

                var id = e.target.getAttribute('data-id');
                if (!id) return;

                var menu = new gui.Menu();
                menu.append(new gui.MenuItem({ label: 'Open in Showroom', key: 'S', click: function (){
                    if (!_selected) return;
                    modules.showroom.start(_selected, id);
                } }));
                menu.append(new gui.MenuItem({ label: 'Start Practice', key: 'P', click: function (){
                    if (!_selected) return;
                    modules.practice.start(_selected, id);
                } }));
                menu.append(new gui.MenuItem({ type: 'separator' }));
                menu.append(new gui.MenuItem({ label: 'Edit', enabled: false }));
                menu.append(new gui.MenuItem({ label: 'Remove', enabled: false }));

                menu.popup(e.clientX, e.clientY);
                return false;
            });

        /* skins changer */
        $('#selected-car-skins')
            .click(function (e){
                if (!_selected) return;

                var id = e.target.getAttribute('data-id');
                if (!id) return;

                modules.cars.selectSkin(_selected, id);
            });

        /* global hotkeys */
        $(window)
            .keydown(function (e){
                if (!_selected) return;

                if (e.keyCode == 83 && e.ctrlKey){
                    /* Ctrl+S */
                    modules.cars.save(_selected);
                    return false;
                }
            });

        /* bottom toolbar */
        var cmIgnore = false;
        $('main')
            .on('contextmenu', function (){
                this.querySelector('footer').classList.toggle('active');
                cmIgnore = true;
            });

        $(window)
            .on('click contextmenu', function (e){
                if (cmIgnore){
                    cmIgnore = false;
                } else if (e.target !== this){
                    this.classList.remove('active');
                }
            }.bind($('main footer')[0]));

        /* first row */
        $('#selected-car-open-directory').click(function (){
            if (!_selected) return;
            gui.Shell.openItem(_selected.path);
        });

        $('#selected-car-showroom').click(function (){
            if (!_selected) return;
            modules.showroom.start(_selected);
        });

        $('#selected-car-showroom-select').click(function (){
            if (!_selected) return;
            modules.showroom.select(_selected);
        });

        $('#selected-car-practice').click(function (){
            if (!_selected) return;
            modules.practice.start(_selected);
        });

        $('#selected-car-practice-select').click(function (){
            if (!_selected) return;
            modules.practice.select(_selected);
        });

        $('#selected-car-reload').click(function (){
            if (!_selected) return;

            if (_selected.changed){
                new Dialog('Reload', [
                    'Your changes will be lost. Are you sure?'
                ], reload);
            } else {
                reload();
            }

            function reload(){
                modules.cars.reload(_selected);
            }
        });

        /* second row */
        $('#selected-car-disable').click(function (){
            if (!_selected) return;
            modules.cars.toggle(_selected);
        });

        $('#selected-car-update-previews').click(function (){
            if (!_selected) return;
            modules.showroom.shot(_selected);
        });

        $('#selected-car-update-previews-manual').click(function (){
            if (!_selected) return;
            modules.showroom.shot(_selected, true);
        });

        $('#selected-car-update-description').click(function (){
            if (!_selected) return;
            modules.updateDescription(_selected);
        });

        $('#selected-car-save').click(function (){
            if (!_selected) return;
            modules.cars.save(_selected);
        });
    }

    init();
    return mediator.extend({
    });
}();