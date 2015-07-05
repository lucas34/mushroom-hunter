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
        jeu.joueur.light = light;
        scene.add(light);
    },

    addAdversaireLight: function () {
        var adversaireLight = new THREE.PointLight(0xffffff, 1.5, 1000);
        adversaireLight.position.set(0, 200, 0);
        adversaireLight.castShadow = true;
        adversaireLight.shadowMapWidth = 1024;
        adversaireLight.shadowMapHeight = 1024;
        adversaireLight.shadowMapDarkness = 0.95;
        adversaireLight.shadowCameraVisible = true;
        scene.add(adversaireLight);

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
        if (jeu.type == TYPE_GAME.BOT) {
            this.addAdversaireLight();
        }
    }
};

var map = new Map_prototype();
