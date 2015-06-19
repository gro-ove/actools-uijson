modules.datalists = function (){
    var datalists = {};

    function create(id){
        datalists[id] = document.createElement('datalist');
        document.body.appendChild(datalists[id]);
        datalists[id].id = id;
    }

    function add(id, v){
        datalists[id].appendChild(document.createElement('option')).setAttribute('value', v);
    }

    create('tags');
    create('brands');
    create('classes');

    modules.cars
        .on('new.tag', add.bind(null, 'tags'))
        .on('new.brand', add.bind(null, 'brands'))
        .on('new.class', add.bind(null, 'classes'));

    return {};
}();