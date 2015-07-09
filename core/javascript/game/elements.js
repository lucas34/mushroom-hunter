function Elements_prototype() {
}

Elements_prototype.prototype = {

    addThree: function (data) {
        this.add_JSON(link_tree_obj, link_tree_texture, data, [20, 150, 20], "three");
    },

    addWaterlily: function (data) {
        this.add_OBJ(link_waterlily_obj, link_waterlily_texture, data, [25, 25, 25], "waterlily");
    },

    addMushroomWithPosition: function (data) {
        function getTexture() {
            var rand = Math.floor((Math.random() * 10) + 1);
            if (rand < 3) {
                return link_mushroom_texture2;
            }
            if (rand > 8) {
                return link_mushroom_texture3;
            } else {
                return link_mushroom_texture1;
            }
        }

        var position = {};
        position['x1'] = data[0];
        position['y1'] = data[1];


        function getScale() {
            if (data.isMegamush) {
                return [50, 50, 50];
            } else {
                return [4, 4, 4];
            }
        }

        this.add_JSON(link_mushroom_obj, getTexture(), position, getScale(), "mushroom", data.isMegamush)

    },

    addMushroom: function (data) {

        function getTexture() {

            switch (data.element) {
                case "Disciotis_venosa":
                    data.isMegamush = true;
                    return link_mushroom_texture2;
                case "Cuphophyllus_niveus":
                    return link_mushroom_texture3;
                default:
                    return link_mushroom_texture1;
            }
        }

        function getPosition() {

            var x, y;
            if (data !== undefined) {
                if (data['type'] == "mushroom") {
                    x = data['x1'];
                    y = data['y1'];

                } else {
                    x = data[0];
                    y = data[1];
                }
            } else {
                x = lib.random();
                y = lib.random();
            }

            var result = {};
            result['x1'] = x;
            result['y1'] = y;
            return result;
        }

        function getScale() {
            if (data.isMegamush) {
                return [50, 50, 50];
            } else {
                return [4, 4, 4];
            }
        }

        var texture = getTexture();
        var position = getPosition();
        var scale = getScale();

        this.add_JSON(link_mushroom_obj, texture, position, scale, "mushroom", data.isMegamush)
    },

    addRiver: function (data) {

        var geometry = new THREE.BoxGeometry(50, 1 / 10, this.extractRiverDistance(data));
        var texture = THREE.ImageUtils.loadTexture(link_river_texture);
        texture.minFilter = THREE.NearestFilter;
        var material = new THREE.MeshBasicMaterial({map: texture, overdraw: true});

        var mesh = new THREE.Mesh(geometry, material);

        var x = (data['x1'] + data['x2']) / 2;
        var y = (data['y1'] + data['y2']) / 2;

        mesh.position.x = x;
        mesh.position.z = y;
        mesh.rotation.y = this.extractAngleRiver(data) + Math.PI / 2;

        collision.rivers.push(data);
        scene.add(mesh);

    },

    moveToRandomPosition: function (obj) {
        obj.position.x = lib.random();
        obj.position.z = lib.random();
    },

    extractRiverDistance: function (data) {
        var x = (data['x2'] - data['x1']) * (data['x2'] - data['x1']);
        var y = (data['y2'] - data['y1']) * (data['y2'] - data['y1']);
        return Math.sqrt(x + y);
    },

    extractAngleRiver: function (data) {

        var distanceX = data['x2'] - data['x1'];
        var distanceZ = data['y2'] - data['y1'];
        var pythagore = lib.pythagore(distanceX, distanceZ);
        var angle = Math.acos(distanceX / pythagore);
        if (distanceZ > 0) {
            angle = -angle;
        }
        return angle;

    },


    add_JSON: function (link, shape, data, scale, type, bool, id) {

        var texture = THREE.ImageUtils.loadTexture(shape);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1);
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var loader = new THREE.JSONLoader(true);
        loader.load(link, function (geometry) {
            var mesh = new THREE.Mesh(geometry, material);

            mesh.scale.set(scale[0], scale[1], scale[2]);
            mesh.position.set(data['x1'], 0, data['y1']);

            scene.add(mesh);
            if (type == "mushroom") {
                mesh.isMegamush = bool;
                collision.mushrooms.push(mesh);
            } else if (type == "waterlily") {
                collision.nenuphars.push(mesh);
            } else if (type == "three") {
                collision.arbres.push(mesh);
            } else if (type == "opponent") {
                multiplayer.players["" + id] = mesh;
            }
        });

    },

    add_OBJ: function (obj, shape, data, scale, type, bool, id) {

        var texture = new THREE.Texture();
        var loader1 = new THREE.ImageLoader();
        loader1.load(shape, function (image) {
            texture.image = image;
            texture.needsUpdate = true;
        });
        var loader2 = new THREE.OBJLoader();
        loader2.load(obj, function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });
            object.position.set(data['x1'], 0, data['y1']);
            object.scale.set(scale[0], scale[1], scale[2]);
            scene.add(object);
            if (type == "mushroom") {
                object.isMegamush = bool;
                collision.mushrooms.push(object);
            } else if (type == "waterlily") {
                collision.nenuphars.push(object);
            } else if (type == "three") {
                collision.arbres.push(object);
            } else if (type == "opponent") {
                multiplayer.players["" + id] = object;
            }
        });
    },

    removeElementObjectMush: function (mush) {
        for (var i = 0; i < collision.mushrooms.length; i++) {
            if ((collision.mushrooms[i].position.x == mush.position.x) && (collision.mushrooms[i].position.z == mush.position.z)) {
                scene.remove(collision.mushrooms[i]);
                collision.mushrooms.splice(i, 1);
                break;
            }
        }
    },

    removeElementPositionMush: function (position) {
        for (var i = 0; i < collision.mushrooms.length; i++) {
            if ((collision.mushrooms[i].position.x == position[0]) && (collision.mushrooms[i].position.z == position[1])) {
                scene.remove(collision.mushrooms[i]);
                collision.mushrooms.splice(i, 1);
                break;
            }
        }
    }

};

var elements = new Elements_prototype();
