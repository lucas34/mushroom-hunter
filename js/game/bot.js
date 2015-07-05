var bot_prototype = function bot() {
    this.time = undefined;
    this.vitesse = 4;
    this.idObject = -1;
    this.animationHorse = undefined;
};

var fnct_bot = (function () {

    function createLight() {
        var adversaireLight = new THREE.PointLight(0xffffff, 1.5, 1000);
        adversaireLight.position.set(0, 200, 0);
        adversaireLight.castShadow = true;
        adversaireLight.shadowMapWidth = 1024;
        adversaireLight.shadowMapHeight = 1024;
        adversaireLight.shadowMapDarkness = 0.95;
        adversaireLight.shadowCameraVisible = true;
        scene.add(adversaireLight);
        return adversaireLight;
    }

    function computeAngle(ob) {
        var distanceX = ob.position.x - jeu.ennemie.element.position.x;
        var distanceZ = ob.position.z - jeu.ennemie.element.position.z;
        var pyth = lib.pythagore(distanceX, distanceZ);
        var angle = Math.acos(distanceX / pyth);
        if (distanceZ > 0) {
            angle = -angle;
        }
        jeu.ennemie.element.rotation.y = angle + Math.PI / 2;
    }

    function moveLightBot() {
        bot.light.position.set(jeu.ennemie.element.position.x + 50, 50, jeu.ennemie.element.position.z);
        bot.light.updateMatrix();
        bot.light.updateMatrixWorld();
    }

    function animate() {
        if (jeu.inGame) {
            var ti = Date.now();
            var delta = ti - this.time + 40;
            bot.animationHorse.update(delta);
            this.time = ti;
        }
    }

    function move() {
        botEngine.move();
        bot.animate();
    }

    function moveTo(idObject) {

        bot.deplacerLightBot();

        var xDep;
        var zDep;

        if (lib.isClose(jeu.collision.mushrooms[idObject], jeu.ennemie.element)) {
            if (jeu.collision.mushrooms[idObject].megaMushroom) {
                jeu.ennemie.points += 5;
            } else {
                jeu.ennemie.points++;
            }
            elements.moveToRandomPosition(jeu.collision.mushrooms[idObject]);
            botEngine.etat = 0;
            message.showScore();
        }
        else {

            var ob = jeu.collision.mushrooms[idObject];
            bot.corrigerAngle(ob);
            if (ob.position.x == jeu.ennemie.element.position.x) {
                xDep = jeu.ennemie.element.position.x;
            } else if (ob.position.x > jeu.ennemie.element.position.x) {
                xDep = jeu.ennemie.element.position.x + bot.vitesse;
            } else {
                xDep = jeu.ennemie.element.position.x - bot.vitesse;
            }
            if (ob.position.z == jeu.ennemie.element.position.z) {
                zDep = jeu.ennemie.element.position.z;
            } else if (ob.position.z > jeu.ennemie.element.position.z) {
                zDep = jeu.ennemie.element.position.z + bot.vitesse;
            } else {
                zDep = jeu.ennemie.element.position.z - bot.vitesse;
            }
            jeu.ennemie.element.position.set(xDep, 0, zDep);
        }
    }


    function add() {

        var loader = new THREE.JSONLoader(true);
        loader.load(link_horse_obj, function (geometry) {

            var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0x582900, morphTargets: true}));
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.position.set(0, 0, -30);
            scene.add(mesh);
            jeu.ennemie.element = mesh;
            bot.animationHorse = new THREE.MorphAnimation(mesh);
            bot.animationHorse.play();
        });

    }

    return function () {
        this.corrigerAngle = computeAngle;
        this.deplacerLightBot = moveLightBot;
        this.animate = animate;
        this.move = move;
        this.moveTo = moveTo;
        this.add = add;
        this.light = new createLight();
        return this;
    }
})();


function BotEngine_prototype() {
    this.etat = 0;
    this.idObject = -1;
}

var fnct_botEngine = (function () {

    function move() {
        switch (botEngine.etat) {
            case 0 :
                botEngine.idObject = botEngine.findMushroom();
                botEngine.etat = 1;
                break;
            case 1 :
                bot.moveTo(botEngine.idObject);
                break;
        }
    }

    function findMushroom() {
        var distMin = 50000;
        var id = 0;
        for (var i = 0; i < jeu.collision.mushrooms.length; i++) {
            if (jeu.collision.mushrooms[i]) {
                var a = Math.abs(jeu.collision.mushrooms[i].position.x - jeu.ennemie.element.position.x);
                var b = Math.abs(jeu.collision.mushrooms[i].position.z - jeu.ennemie.element.position.z);
                var dis = lib.pythagore(a, b);
                if (dis < distMin) {
                    distMin = dis;
                    id = i;
                }
            }
        }
        return id;
    }

    return function () {
        this.move = move;
        this.findMushroom = findMushroom;
        return this;
    }
})();

fnct_botEngine.call(BotEngine_prototype.prototype);
fnct_bot.call(bot_prototype.prototype);

var bot = new bot_prototype();
var botEngine = new BotEngine_prototype();

