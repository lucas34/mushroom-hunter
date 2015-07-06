function Lib() {
}

Lib.prototype = {
    random: function () {
        var rand = Math.floor(Math.random() * 10);
        var x = Math.floor((Math.random() * 1000) + 1);
        if (rand % 2 == 0) {
            x = -x;
        }
        return x;
    },

    isClose: function (obj, player) {
        return (obj && obj.position.distanceTo(player.position) < 40);
    },

    distances: function (foo, bar) {
        var x = (foo.x - bar.x) * (foo.x - bar.x);
        var y = (foo.y - bar.z) * (foo.y - bar.z);
        return Math.sqrt(x + y);
    },

    pythagore: function (a, b) {
        return Math.sqrt(a * a + b * b);
    },

    isOnRiver : function (data, player) {

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

};

var lib = new Lib();
