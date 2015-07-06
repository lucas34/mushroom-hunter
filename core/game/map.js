function Map_prototype() {
}

Map_prototype.prototype = {

    addLight: function () {
        var light = new THREE.PointLight(0xffffff, 1.5, 1000);
        light.position.set(0, 200, 0);
        light.castShadow = true;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        light.shadowMapDarkness = 0.95;
        light.shadowCameraVisible = true;
        game.player.light = light;
        scene.add(light);
    },

    addOpponentLight: function () {
        var opponentLight = new THREE.PointLight(0xffffff, 1.5, 1000);
        opponentLight.position.set(0, 200, 0);
        opponentLight.castShadow = true;
        opponentLight.shadowMapWidth = 1024;
        opponentLight.shadowMapHeight = 1024;
        opponentLight.shadowMapDarkness = 0.95;
        opponentLight.shadowCameraVisible = true;
        scene.add(opponentLight);
    },

    addFog: function () {
        scene.fog = new THREE.Fog(0x000000, 0, 5000);
    },

    generate: function () {
        var texture = THREE.ImageUtils.loadTexture(link_map_texture);
        var gg = new THREE.PlaneBufferGeometry(4000, 4000);
        var gm = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
        var ground = new THREE.Mesh(gg, gm);
        ground.rotation.x = -Math.PI / 2;
        ground.material.map.repeat.set(9, 9);
        ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
        scene.add(ground);
    },

    addCamera: function () {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 10;
    },

    addControls: function () {
        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());
    },

    load: new function () {

        this.getJSON = function () {
            $.ajax({
                url: link_json,
                async: true,
                dataType: 'json'
            }).done(function (json) {
                $.each(json, function (idx, data) {
                    if (data.type == "mushroom") {
                        elements.addMushroom(data);
                    } else if (data.element == "riviere") {
                        elements.addRiver(data);
                    } else if (data.element == "nenuphar") {
                        elements.addWaterlily(data);
                    } else if (data.element == "arbre") {
                        elements.addThree(data);
                    }
                });

            });
        }
    },

    init: function () {

        this.generate();
        this.addCamera();
        this.addControls();
        this.addLight();
        this.addFog();
        this.load.getJSON();
        if (game.type == TYPE_GAME.BOT) {
            this.addOpponentLight();
        }
    }
};

var map = new Map_prototype();