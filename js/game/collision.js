var collision = function collision() {
    this.arbres = [];
    this.mushrooms = [];
    this.rivers = [];
    this.nenuphars = [];
};

var fnct_collision = (function () {

    function waterlily() {
        for (var j = 0; j < this.nenuphars.length; j++) {
            if (lib.isClose(this.nenuphars[j], jeu.joueur)) {
                controls.bump();
            }
        }
    }

    function three() {
        for (var j = 0; j < this.arbres.length; j++) {
            if (lib.isClose(this.arbres[j], jeu.joueur)) {
                controls.block();
            }
        }
    }

    function river() {
        for (var j = 0; j < this.rivers.length; j++) {
            if (jeu.joueur.position.y < 22) {
                if (this.isOnRiver(this.rivers[j], jeu.joueur.position)) {
                    controls.slow();
                }
            }
        }

    }

    function isOnRiver(data, player) {

        if (!data) {
            return;
        }
        if (data['x1'] > data['x2']) {
            if (player.x > data['x1']) {
                return false;
            }

            if (player.x < data['x2']) {
                return false;
            }
        } else {
            if (player.x < data['x1']) {
                return false;
            }
            if (player.x > data['x2']) {
                return false;
            }
        }

        if (data['y1'] > data['y2']) {
            if (player.z > data['y1']) {
                return false;
            }

            if (player.z < data['y2']) {
                return false;
            }
        } else {
            if (player.z < data['y1']) {
                return false;
            }
            if (player.z > data['y2']) {
                return false;
            }
        }

        var sx = data['x2'] - data['x1'];
        var sy = data['y2'] - data['y1'];

        var ux = player.x - data['x1'];
        var uy = player.z - data['y1'];

        var dp = sx * ux + sy * uy;

        if (dp < 0) {

            var point1 = new function () {
                this.x = data['x1'];
                this.y = data['y1'];
            };
            if (distanceJoueur(point1, player) < 25) {
                return true;
            }
        }

        var sn2 = sx * sx + sy * sy;
        if (dp > sn2) {

            var point2 = new function () {
                this.x = data['x2'];
                this.y = data['y2'];
            };
            if (distanceJoueur(point2, player) < 25) {

                return true;
            }
        }

        var ah2 = dp * dp / sn2;
        var un2 = ux * ux + uy * uy;
        if (Math.sqrt(un2 - ah2) < 25) {

            return true;
        }

    }

    function mushroom() {
        for (var i = 0; i < this.mushrooms.length; i++) {
            if (lib.isClose(this.mushrooms[i], jeu.joueur)) {
                if (jeu.type == TYPE_GAME.MULTIPLAYER) {
                    Arena.ramasserChampignon(this.mushrooms[i].position.x, this.mushrooms[i].position.z);

                    if (this.mushrooms[i].megaMushroom) {
                        jeu.joueur.boost += 30;
                    } else {
                        jeu.joueur.boost += 10;
                    }
                }
                if (jeu.secondes > 0) {
                    if (jeu.type != 2) {
                        if (this.mushrooms[i].isMegamush) {
                            jeu.joueur.points += 5;
                            jeu.joueur.boost += 40;
                        } else {
                            jeu.joueur.boost += 20;
                            jeu.joueur.points++;
                        }
                    }
                    if (jeu.joueur.boost > 100) {
                        jeu.joueur.boost = 100;
                    }
                    $("#pross_bar").css("width", jeu.joueur.boost + "%");
                    message.showScore();
                }
                if (jeu.type == TYPE_GAME.MULTIPLAYER) {
                    elements.removeElementObjectMush(this.mushrooms[i]);
                } else {
                    elements.moveToRandomPosition(this.mushrooms[i]);
                }
                break;
            }
        }
    }

    function manage() {
        this.waterlily();
        this.three();
        this.river();
        this.mushroom();
    }

    return function () {
        this.waterlily = waterlily;
        this.three = three;
        this.river = river;
        this.mushroom = mushroom;
        this.isOnRiver = isOnRiver;
        this.manage = manage;

    };

})();

fnct_collision.call(collision.prototype);
