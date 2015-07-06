function Horse_prototype() {
    this.time = undefined;
    this.vitesse = 4;
    this.idObject = -1;
    this.animationHorse = undefined;
    this.light = undefined;
}

Horse_prototype.prototype = {

    init : function () {

        (function addLight(self) {
            var opponentLight = new THREE.PointLight(0xffffff, 1.5, 1000);
            opponentLight.position.set(0, 200, 0);
            opponentLight.castShadow = true;
            opponentLight.shadowMapWidth = 1024;
            opponentLight.shadowMapHeight = 1024;
            opponentLight.shadowMapDarkness = 0.95;
            opponentLight.shadowCameraVisible = true;
            scene.add(opponentLight);
            self.light = opponentLight;
        })(this);

        (function add (self) {
            var loader = new THREE.JSONLoader(true);
            loader.load(link_horse_obj, function (geometry) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0x582900, morphTargets: true}));
                mesh.scale.set(0.1, 0.1, 0.1);
                mesh.position.set(0, 0, -30);
                scene.add(mesh);
                game.opponent.element = mesh;
                self.animationHorse = new THREE.MorphAnimation(mesh);
                self.animationHorse.play();
            });

        }(this));

    },

    computeAngle: function (ob) {
        var distanceX = ob.position.x - game.opponent.element.position.x;
        var distanceZ = ob.position.z - game.opponent.element.position.z;
        var pythagore = lib.pythagore(distanceX, distanceZ);
        var angle = Math.acos(distanceX / pythagore);
        if (distanceZ > 0) {
            angle = -angle;
        }
        game.opponent.element.rotation.y = angle + Math.PI / 2;
    },

    moveLightBot: function () {
        this.light.position.set(game.opponent.element.position.x + 50, 50, game.opponent.element.position.z);
        this.light.updateMatrix();
        this.light.updateMatrixWorld();
    },

    animate: function () {
        var ti = Date.now();
        var delta = ti - this.time + 40;
        horse.animationHorse.update(delta);
        this.time = ti;
    },

    move: function () {
        botEngine.move();
        this.animate();
    },

    moveTo: function (idObject) {

        this.animate();
        this.moveLightBot();

        var xDep;
        var zDep;

        if (lib.isClose(collision.mushrooms[idObject], game.opponent.element)) {
            if (collision.mushrooms[idObject].megaMushroom) {
                game.opponent.points += 5;
            } else {
                game.opponent.points++;
            }
            elements.moveToRandomPosition(collision.mushrooms[idObject]);
            botEngine.etat = 0;
            message.showScore();
        } else {

            var ob = collision.mushrooms[idObject];
            this.computeAngle(ob);
            if (ob.position.x == game.opponent.element.position.x) {
                xDep = game.opponent.element.position.x;
            } else if (ob.position.x > game.opponent.element.position.x) {
                xDep = game.opponent.element.position.x + horse.vitesse;
            } else {
                xDep = game.opponent.element.position.x - horse.vitesse;
            }
            if (ob.position.z == game.opponent.element.position.z) {
                zDep = game.opponent.element.position.z;
            } else if (ob.position.z > game.opponent.element.position.z) {
                zDep = game.opponent.element.position.z + horse.vitesse;
            } else {
                zDep = game.opponent.element.position.z - horse.vitesse;
            }
            game.opponent.element.position.set(xDep, 0, zDep);
        }
    }

};

var horse = new Horse_prototype();


