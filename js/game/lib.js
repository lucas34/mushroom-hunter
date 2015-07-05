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

    isClose: function (obj, perso) {
        return (obj && obj.position.distanceTo(perso.position) < 40);
    },

    distances: function (foo, bar) {
        var x = (foo.x - bar.x) * (foo.x - bar.x);
        var y = (foo.y - bar.z) * (foo.y - bar.z);
        return Math.sqrt(x + y);
    },

    pythagore: function (a, b) {
        return Math.sqrt(a * a + b * b);
    }

};

var lib = new Lib();
