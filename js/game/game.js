/*
 * Globals variables
 */

var camera, scene, renderer;
var controls, time = Date.now();
var instructions = document.getElementById('instructions');
var score = document.getElementById('score');
var divTemps = document.getElementById('temps');
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

scene = new THREE.Scene();

function Jeu_prototype() {
    this.inGame = false;
    this.secondes = 100000;
    this.endGame = false;
    this.collision = new collision();
    this.type = undefined;
}

Jeu_prototype.prototype = {
    joueur: new function () {
        this.position = new THREE.Vector3();
        this.boost = 0;
        this.points = 0;
        this.name = "Pseudo";
    },
    restart: function () {
        this.joueur.position = new THREE.Vector3();
        this.joueur.boost = 0;
        this.joueur.points = 0;
        this.secondes = 0;
        this.ennemie.points = 0;
        $("#pross_bar").css("width", this.joueur.boost + "%");
        this.inGame = true;
        this.endGame = false;
        animation.prevTime = performance.now();
        message.startTimeManager();
        animation.play();
    },
    ennemie: new function () {
        this.points = 0;
        this.element = undefined;
        this.name = "Horse";
    },

    start: function (type) {

        this.type = type;
        THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
            var progress = Math.round(loaded / total * 100);
            $("#percent").html(progress + "%");
            if (loaded == total) {
                document.body.appendChild(renderer.domElement);
                $("#loading").remove();
                $("#bbar").show();
                document.body.appendChild(debug.stats.domElement);
                debug.start();
            }
        };

        checkConfig();
        windows.init();
        map.init();
        if (jeu.type == TYPE_GAME.BOT) {
            this.secondes = 0;
            divTemps.innerHTML = 'Time : ' + this.secondes;
            bot.add();
        } else if (jeu.type == TYPE_GAME.MULTIPLAYER) {
            this.joueur.name = "Team blue";
            this.ennemie.name = "Team red";
            $("#temps").hide();
        }

        message.startTimeManager();
        animation.play();

    }
};

var jeu = new Jeu_prototype();